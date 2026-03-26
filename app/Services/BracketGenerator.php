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
     *
     * $seedData shape:
     *
     * Conference (NBA/MPBL):
     * [
     *   'league' => 'nba',
     *   'teams'  => [
     *     'east' => [id1, id2, ...],  // ordered by seed
     *     'west' => [id1, id2, ...],
     *   ]
     * ]
     *
     * Flat (PBA):
     * [
     *   'league' => 'pba',
     *   'teams'  => [id1, id2, ...]
     * ]
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

    // -------------------------------------------------------------------------
    // Flat bracket (PBA — no conferences)
    // -------------------------------------------------------------------------

    private function generateFlat(BracketChallenge $challenge, array $teamIds): void
    {
        $seededTeams    = $this->loadTeamsInOrder($teamIds);
        $totalRounds    = self::calculateRounds(count($teamIds));
        $matchesByRound = $this->createMatchShells($challenge, $totalRounds, null);

        $this->linkMatches($matchesByRound);
        $this->seedFirstRound($matchesByRound[1], $seededTeams);
    }

    // -------------------------------------------------------------------------
    // Conference bracket (NBA/MPBL)
    // -------------------------------------------------------------------------

    private function generateConference(BracketChallenge $challenge, array $seedData): void
    {
        $league      = $seedData['league'];
        $conferences = $seedData['teams'];  // ['east' => [...], 'west' => [...]]

        $conferenceKeys  = array_keys($conferences);   // ['east', 'west'] or ['north', 'south']
        $teamsPerConf    = count(reset($conferences));
        $roundsPerConf   = self::calculateRounds($teamsPerConf);

        $allConferenceMatches = [];

        // Generate a bracket for each conference
        foreach ($conferences as $conference => $teamIds) {
            $seededTeams    = $this->loadTeamsInOrder($teamIds);
            $matchesByRound = $this->createMatchShells(
                $challenge,
                $roundsPerConf,
                $conference
            );

            $this->linkMatches($matchesByRound);
            $this->seedFirstRound($matchesByRound[1], $seededTeams);

            $allConferenceMatches[$conference] = $matchesByRound;
        }

        // Create the Finals match — one round above conference finals
        $finalsRound = $roundsPerConf + 1;
        $finalsMatch = GameMatch::create([
            'league_id'            => $challenge->league_id,
            'bracket_challenge_id' => $challenge->id,
            'name'                 => 'Finals',
            'round_index'          => $finalsRound,
            'match_index'          => 1,
            'conference'           => null,   // Finals has no conference
            'winner_team_id'       => null,
            'next_match_id'        => null,
            'next_match_slot'      => null,
        ]);

        // Link each conference's final match to the Finals
        foreach ($conferenceKeys as $slot => $conference) {
            $confFinalMatch = end($allConferenceMatches[$conference]);  // last round = conf final

            // conf final match is always a single match — get it
            $confFinal = is_array($confFinalMatch)
                ? $confFinalMatch[0]
                : $confFinalMatch;

            $confFinal->update([
                'next_match_id'   => $finalsMatch->id,
                'next_match_slot' => $slot + 1,  // slot 1 = first conf, slot 2 = second conf
            ]);
        }

        // Update challenge total_rounds to include Finals round
        $challenge->update(['total_rounds' => $finalsRound]);
    }

    // -------------------------------------------------------------------------
    // Shared helpers
    // -------------------------------------------------------------------------

    private function createMatchShells(
        BracketChallenge $challenge,
        int $totalRounds,
        ?string $conference
    ): array {
        $matchesByRound = [];

        for ($round = 1; $round <= $totalRounds; $round++) {
            $matchCount = $this->matchesInRound($round, $totalRounds);
            $roundName  = $this->roundName($round, $totalRounds);
            $matches    = [];

            for ($index = 1; $index <= $matchCount; $index++) {
                $label = $conference
                    ? ucfirst($conference) . ' - ' . $roundName . ' - Match ' . $index
                    : $roundName . ' - Match ' . $index;

                $matches[] = GameMatch::create([
                    'league_id'            => $challenge->league_id,
                    'bracket_challenge_id' => $challenge->id,
                    'name'                 => $label,
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
        $seeds = range(1, $teamCount);
        return $this->pairSeeds($seeds);
    }

    private function pairSeeds(array $seeds): array
    {
        $count = count($seeds);

        if ($count === 2) {
            return [[$seeds[0], $seeds[1]]];
        }

        $half   = $count / 2;
        $top    = array_slice($seeds, 0, $half);
        $bottom = array_reverse(array_slice($seeds, $half));

        $pairs = [];
        foreach ($top as $i => $seed) {
            $pairs[] = [$seed, $bottom[$i]];
        }

        $result = [];
        $mid    = (int) (count($pairs) / 2);

        foreach (array_slice($pairs, 0, $mid) as $i => $pair) {
            $result[] = $pair;
            $bottomHalf = array_slice($pairs, $mid);
            if (isset($bottomHalf[$i])) {
                $result[] = $bottomHalf[$i];
            }
        }

        return $result;
    }

    private function matchesInRound(int $round, int $totalRounds): int
    {
        return (int) pow(2, $totalRounds - $round);
    }

    private function roundName(int $round, int $totalRounds): string
    {
        $roundsFromEnd = $totalRounds - $round;

        return match ($roundsFromEnd) {
            0       => 'Conference Finals',
            1       => 'Semifinal',
            2       => 'Quarterfinal',
            default => 'Round ' . $round,
        };
    }

    public static function calculateRounds(int $teamCount): int
    {
        return (int) log($teamCount, 2);
    }
}

// ```

// ---

// **The generated bracket structure for NBA (16 teams):**
// ```
// Round 1 (R1):  East Match 1-4   + West Match 1-4   (8 matches)
// Round 2 (QF):  East Match 1-2   + West Match 1-2   (4 matches)
// Round 3 (SF):  East Match 1     + West Match 1     (2 matches)
// Round 4 (CF):  East Finals      + West Finals      (2 matches) ← conference = east/west
// Round 5:       Finals                              (1 match)   ← conference = null
// ```

// **For PBA (8 teams):**
// ```
// Round 1: 4 matches
// Round 2: 2 matches (SF)
// Round 3: 1 match (Final) ← conference = null