<?php

namespace App\Services;

use App\Models\BracketChallenge;
use App\Models\GameMatch;
use App\Models\Team;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BracketGenerator
{
    /**
     * Generate bracket from seed_data.
     */
    public function generate(BracketChallenge $challenge, array $seedData): void
    {
        DB::transaction(function () use ($challenge, $seedData) {
            $league = $seedData['league'];

            if ($league === 'pba') {
                $this->generateFlat($challenge, $seedData['teams']);
            } else {
                $this->generateConference($challenge, $seedData);
            }
        });
    }

    /**
     * Regenerate bracket — update teams on existing matches.
     * Only valid for draft challenges.
     */
    public function regenerate(BracketChallenge $challenge, array $seedData): void
    {
        DB::transaction(function () use ($challenge, $seedData) {
            $league = $seedData['league'];

            // Load all existing first round matches ordered correctly
            $firstRoundMatches = GameMatch::where('bracket_challenge_id', $challenge->id)
                ->where('round_index', 1)
                ->orderBy('match_index')
                ->get();

            if ($firstRoundMatches->isEmpty()) {
                // No matches yet — just generate fresh
                $this->generate($challenge, $seedData);
                return;
            }

            if ($league === 'pba') {
                $this->reseadFlat($firstRoundMatches, $seedData['teams']);
            } else {
                $this->reseedConference($challenge, $firstRoundMatches, $seedData);
            }
        });
    }

    // -------------------------------------------------------------------------
    // Flat bracket (PBA)
    // -------------------------------------------------------------------------

    private function generateFlat(BracketChallenge $challenge, array $teamIds): void
    {
        $seededTeams    = $this->loadTeamsInOrder($teamIds);
        $totalRounds    = self::calculateRounds(count($teamIds));
        $matchesByRound = $this->createMatchShells($challenge, $totalRounds, null);

        $this->linkMatches($matchesByRound);
        $this->seedFirstRound($matchesByRound[1], $seededTeams);
    }

    private function reseadFlat(Collection $firstRoundMatches, array $teamIds): void
    {
        $seededTeams = $this->loadTeamsInOrder($teamIds);
        $pairs       = $this->generateSeedPairs($seededTeams->count());

        foreach ($firstRoundMatches as $index => $match) {
            [$topSeed, $bottomSeed] = $pairs[$index];

            $topTeam    = $seededTeams->get($topSeed - 1);
            $bottomTeam = $seededTeams->get($bottomSeed - 1);

            // Detach old teams and reattach with new seeds
            $match->teams()->detach();
            $match->teams()->attach([
                $topTeam->id    => ['seed' => $topSeed,    'slot' => 1],
                $bottomTeam->id => ['seed' => $bottomSeed, 'slot' => 2],
            ]);

            // Reset match result since teams changed
            $match->update(['winner_team_id' => null]);
        }
    }

    // -------------------------------------------------------------------------
    // Conference bracket (NBA/MPBL)
    // -------------------------------------------------------------------------

    private function generateConference(BracketChallenge $challenge, array $seedData): void
    {
        $conferences     = $seedData['teams'];
        $conferenceKeys  = array_keys($conferences);
        $teamsPerConf    = count(reset($conferences));
        $roundsPerConf   = self::calculateRounds($teamsPerConf);

        $allConferenceMatches = [];

        foreach ($conferences as $conference => $teamIds) {
            $seededTeams    = $this->loadTeamsInOrder($teamIds);
            $matchesByRound = $this->createMatchShells(
                $challenge,
                $roundsPerConf,
                $conference,
            );

            $this->linkMatches($matchesByRound);
            $this->seedFirstRound($matchesByRound[1], $seededTeams);

            $allConferenceMatches[$conference] = $matchesByRound;
        }

        // Create Grand Finals match
        $finalsRound = $roundsPerConf + 1;
        $finalsMatch = GameMatch::create([
            'league_id'            => $challenge->league_id,
            'bracket_challenge_id' => $challenge->id,
            'name'                 => 'finals',
            'round_index'          => $finalsRound,
            'match_index'          => 1,
            'conference'           => null,
            'winner_team_id'       => null,
            'next_match_id'        => null,
            'next_match_slot'      => null,
        ]);

        // Link each conference final to Grand Finals
        // East/North champ → slot 1, West/South champ → slot 2
        $slotMap = [
            'east'  => 1,
            'north' => 1,
            'west'  => 2,
            'south' => 2,
        ];

        foreach ($conferenceKeys as $conference) {
            $lastRound     = $allConferenceMatches[$conference][$roundsPerConf];
            $confFinal     = is_array($lastRound) ? $lastRound[0] : $lastRound;
            $slot          = $slotMap[$conference] ?? 1;

            $confFinal->update([
                'next_match_id'   => $finalsMatch->id,
                'next_match_slot' => $slot,
            ]);
        }

        $challenge->update(['total_rounds' => $finalsRound]);
    }

    private function reseedConference(
        BracketChallenge $challenge,
        Collection $firstRoundMatches,
        array $seedData,
    ): void {
        $conferences = $seedData['teams'];

        // Group first round matches by conference
        $matchesByConference = $firstRoundMatches->groupBy('conference');

        foreach ($conferences as $conference => $teamIds) {
            $confMatches = $matchesByConference->get($conference, collect());
            $seededTeams = $this->loadTeamsInOrder($teamIds);
            $pairs       = $this->generateSeedPairs($seededTeams->count());

            foreach ($confMatches->sortBy('match_index')->values() as $index => $match) {
                [$topSeed, $bottomSeed] = $pairs[$index];

                $topTeam    = $seededTeams->get($topSeed - 1);
                $bottomTeam = $seededTeams->get($bottomSeed - 1);

                $match->teams()->detach();
                $match->teams()->attach([
                    $topTeam->id    => ['seed' => $topSeed,    'slot' => 1],
                    $bottomTeam->id => ['seed' => $bottomSeed, 'slot' => 2],
                ]);

                $match->update(['winner_team_id' => null]);
            }
        }

        // Reset all non-first-round matches teams (they'll be populated as results come in)
        GameMatch::where('bracket_challenge_id', $challenge->id)
            ->where('round_index', '>', 1)
            ->each(function (GameMatch $match) {
                $match->teams()->detach();
                $match->update(['winner_team_id' => null]);
            });
    }

    // -------------------------------------------------------------------------
    // Shared helpers
    // -------------------------------------------------------------------------

    private function createMatchShells(
        BracketChallenge $challenge,
        int $totalRounds,
        ?string $conference,
    ): array {
        $matchesByRound = [];

        for ($round = 1; $round <= $totalRounds; $round++) {
            $matchCount = $this->matchesInRound($round, $totalRounds);
            $matches    = [];

            for ($index = 1; $index <= $matchCount; $index++) {
                // Naming: east-r1-m1 / r1-m1 (PBA)
                $name = $conference
                    ? "{$conference}-r{$round}-m{$index}"
                    : "r{$round}-m{$index}";

                $matches[] = GameMatch::create([
                    'league_id'            => $challenge->league_id,
                    'bracket_challenge_id' => $challenge->id,
                    'name'                 => $name,
                    'round_index'          => $round,
                    'match_index'          => $index,
                    'conference'           => $conference,
                    'winner_team_id'       => null,
                    'next_match_id'        => null,
                    'next_match_slot'      => null,
                ]);
            }

            $matchesByRound[$round] = $matches;
        }

        return $matchesByRound;
    }

    private function linkMatches(array $matchesByRound): void
    {
        $maxRound = max(array_keys($matchesByRound));

        foreach ($matchesByRound as $round => $matches) {
            if ($round === $maxRound) continue;

            $nextRoundMatches = $matchesByRound[$round + 1];

            foreach ($matches as $index => $match) {
                $nextMatchIndex = (int) floor($index / 2);
                $nextMatchSlot  = ($index % 2) + 1;

                $match->update([
                    'next_match_id'   => $nextRoundMatches[$nextMatchIndex]->id,
                    'next_match_slot' => $nextMatchSlot,
                ]);
            }
        }
    }

    private function seedFirstRound(array $firstRoundMatches, Collection $seededTeams): void
    {
        $pairs = $this->generateSeedPairs($seededTeams->count());

        foreach ($firstRoundMatches as $index => $match) {
            [$topSeed, $bottomSeed] = $pairs[$index];

            $topTeam    = $seededTeams->get($topSeed - 1);
            $bottomTeam = $seededTeams->get($bottomSeed - 1);

            $match->teams()->attach([
                $topTeam->id    => ['seed' => $topSeed,    'slot' => 1],
                $bottomTeam->id => ['seed' => $bottomSeed, 'slot' => 2],
            ]);
        }
    }

    private function loadTeamsInOrder(array $teamIds): Collection
    {
        return Team::whereIn('id', $teamIds)
            ->get()
            ->sortBy(fn ($team) => array_search($team->id, $teamIds))
            ->values();
    }

    private function generateSeedPairs(int $teamCount): array
    {
        // Standard seeding: 1v8, 4v5, 3v6, 2v7
        return match ($teamCount) {
            8  => [[1,8], [4,5], [3,6], [2,7]],
            16 => [[1,16], [8,9], [5,12], [4,13], [3,14], [6,11], [7,10], [2,15]],
            32 => [[1,32], [16,17], [8,25], [9,24], [5,28], [12,21], [13,20], [4,29],
                   [3,30], [14,19], [11,22], [6,27], [7,26], [10,23], [15,18], [2,31]],
            default => throw new \InvalidArgumentException("Unsupported team count: {$teamCount}"),
        };
    }

    private function matchesInRound(int $round, int $totalRounds): int
    {
        return (int) pow(2, $totalRounds - $round);
    }

    public static function calculateRounds(int $teamCount): int
    {
        return (int) log($teamCount, 2);
    }
}