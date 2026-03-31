<?php

namespace App\Jobs;

use App\Models\BracketChallenge;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Bus;

class OrchestrateBracketProcessing implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly int $challengeId,
    ) {}

    public function handle(): void
    {
        $challenge = BracketChallenge::find($this->challengeId);

        if (! $challenge) return;

        $jobs = [];

        $challenge->entries()
            ->select('id')
            ->chunkById(100, function ($entries) use (&$jobs) {
                $jobs[] = new ProcessEntryChunk($entries->pluck('id')->toArray());
            });

        if (empty($jobs)) return;

        Bus::batch($jobs)
            ->then(function () use ($challenge) {
                // All entry chunks processed — fire notifications
                SendBracketChallengeUpdateNotification::dispatch($challenge->id);
            })
            ->allowFailures() // don't cancel batch if one chunk fails
            ->dispatch();
    }
}