<?php

namespace App\Services;

use App\Models\BracketChallenge;
use App\Models\BracketChallengeEntry;
use App\Models\GameMatch;
use App\Models\Prediction;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BracketSubmissionService
{
    /**
     * Submit a full bracket entry for a user.
     *
     * $picks format:
     * [
     *   match_id => predicted_winner_team_id,
     *   match_id => predicted_winner_team_id,
     *   ...
     * ]
     *
     * Every match in the challenge must have a pick — no partial submissions.
     */
    public function submit(
        BracketChallenge $challenge,
        User $user,
        array $picks,  // [match_id => team_id]
        string $entryName
    ): BracketChallengeEntry
    {
        // --- Guard: challenge must be open and accepting submissions ---
        if (! $challenge->isAcceptingSubmissions()) {
            throw new \RuntimeException('This bracket challenge is not currently accepting submissions.');
        }

        // --- Guard: user hasn't already entered ---
        $existingEntry = BracketChallengeEntry::withTrashed()
            ->where('user_id', $user->id)
            ->where('bracket_challenge_id', $challenge->id)
            ->first();

        if ($existingEntry) {
            throw new \RuntimeException('You have already submitted a bracket for this challenge.');
        }

        // --- Load all matches for this challenge ---
        $matches = $challenge->matches()
                             ->with('teams')
                             ->orderBy('round_index')
                             ->orderBy('match_index')
                             ->get()
                             ->keyBy('id');

        // --- Validate all matches have a pick ---
        $this->validateAllMatchesPicked($matches, $picks);

        // --- Validate bracket consistency (picks flow correctly round to round) ---
        $this->validateBracketConsistency($matches, $picks);

        return DB::transaction(function () use ($challenge, $user, $picks, $matches, $entryName) {
            // Create the entry.
            $entry = BracketChallengeEntry::create([
                'bracket_challenge_id'    => $challenge->id,
                'user_id'                 => $user->id,
                'name'                    => $entryName,
                'slug'                    => str($entryName)->slug() . '-' . $user->id,
                'status'                  => 'active',
                'correct_predictions_count' => 0,
            ]);

            // Bulk insert all predictions.
            $predictions = $matches->map(fn ($match) => [
                'bracket_challenge_entry_id' => $entry->id,
                'match_id'                   => $match->id,
                'predicted_winner_team_id'   => $picks[$match->id],
                'status'                     => 'pending',
                'created_at'                 => now(),
                'updated_at'                 => now(),
            ])->values()->toArray();

            Prediction::insert($predictions);

            return $entry;
        });
    }

    // -------------------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------------------

    private function validateAllMatchesPicked($matches, array $picks): void
    {
        $matchIds  = $matches->keys()->sort()->values();
        $pickedIds = collect(array_keys($picks))->sort()->values();

        if ($matchIds->diff($pickedIds)->isNotEmpty()) {
            throw new \InvalidArgumentException(
                'Incomplete bracket — all matches must have a prediction.'
            );
        }
    }

    /**
     * Validate that picks are consistent across rounds.
     *
     * For each match in rounds 2+, the predicted winner must be
     * the predicted winner of one of the two feeder matches.
     *
     * Example:
     * Match 5 (SF) is fed by Match 1 and Match 2.
     * If user picks Team A to win Match 5,
     * Team A must also be the predicted winner of Match 1 or Match 2.
     */
    private function validateBracketConsistency($matches, array $picks): void
    {
        // Group matches by round, skip round 1 (no feeder matches).
        $matchesByRound = $matches->groupBy('round_index');

        foreach ($matchesByRound as $round => $roundMatches) {
            if ($round === 1) continue;

            foreach ($roundMatches as $match) {
                $pickedTeamId = $picks[$match->id] ?? null;

                if (! $pickedTeamId) continue;

                // Get the two feeder matches for this match.
                $feederMatches = $matches->filter(
                    fn ($m) => $m->next_match_id === $match->id
                );

                // The picked winner must have won one of the feeder matches.
                $pickedTeamAdvanced = $feederMatches->contains(
                    fn ($feeder) => ($picks[$feeder->id] ?? null) === $pickedTeamId
                );

                if (! $pickedTeamAdvanced) {
                    $match->load('teams');
                    throw new \InvalidArgumentException(
                        "Invalid bracket: picked winner for [{$match->name}] 
                        did not advance from the previous round."
                    );
                }
            }
        }
    }
}