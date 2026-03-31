<?php

namespace App\Jobs;

use App\Models\BracketChallenge;
use App\Models\BracketChallengeEntry;
use App\Notifications\BracketChallengeUpdatedNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendBracketChallengeUpdateNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $challengeId,
    ) {}

    public function handle(): void
    {
        $challenge = BracketChallenge::find($this->challengeId);

        if (! $challenge) return;

        // Chunk through users with entries to avoid memory issues
        BracketChallengeEntry::with('user')
            ->where('bracket_challenge_id', $this->challengeId)
            ->chunkById(100, function ($entries) use ($challenge) {
                foreach ($entries as $entry) {
                    if (! $entry->user) continue;

                    $entry->user->notify(
                        new BracketChallengeUpdatedNotification($challenge, $entry)
                    );
                }
            });
    }
}