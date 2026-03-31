<?php

namespace App\Jobs;

use App\Models\BracketChallengeEntry;
use App\Models\GameMatch;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessEntryChunk implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly array $entryIds,
    ) {}

    public function handle(): void
    {
        // Skip if batch was cancelled
        if ($this->batch()?->cancelled()) return;

        BracketChallengeEntry::with(['predictions', 'bracketChallenge.matches'])
            ->whereIn('id', $this->entryIds)
            ->each(function (BracketChallengeEntry $entry) {
                $this->gradeEntry($entry);
            });
    }

    private function gradeEntry(BracketChallengeEntry $entry): void
    {
        $challenge = $entry->bracketChallenge;

        if (! $challenge) return;

        // Grade all predictions for decided matches
        foreach ($entry->predictions as $prediction) {
            $match = $challenge->matches
                ->firstWhere('id', $prediction->match_id);

            if (! $match || ! $match->winner_team_id) {
                // Match not yet decided — keep as pending
                if ($prediction->status !== 'pending') {
                    $prediction->update(['status' => 'pending']);
                }
                continue;
            }

            $status = $prediction->predicted_winner_team_id === $match->winner_team_id
                ? 'correct'
                : 'incorrect';

            if ($prediction->status !== $status) {
                $prediction->update(['status' => $status]);
            }
        }

        // Recalculate score
        $entry->recalculateScore();

        // Resolve entry status if challenge is completed
        if ($challenge->isCompleted()) {
            $this->resolveEntryStatus($entry, $challenge);
        }
    }

    private function resolveEntryStatus(
        BracketChallengeEntry $entry,
        $challenge,
    ): void {
        // Finals = match with no next_match_id
        $finalsMatch = $challenge->matches
            ->whereNull('next_match_id')
            ->first();

        if (! $finalsMatch?->winner_team_id) return;

        $finalsPrediction = $entry->predictions
            ->firstWhere('match_id', $finalsMatch->id);

        if (! $finalsPrediction) return;

        $status = $finalsPrediction->predicted_winner_team_id === $finalsMatch->winner_team_id
            ? 'won'
            : 'eliminated';

        $entry->update(['status' => $status]);
    }
}