<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameMatch extends Model
{
    // No SoftDeletes — structural data, hard-delete only.

    protected $table = 'matches';

    protected $fillable = [
        'league_id',
        'bracket_challenge_id',
        'winner_team_id',
        'next_match_id',
        'next_match_slot',
        'name',
        'round_index',
        'match_index',
        'conference',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function bracketChallenge(): BelongsTo
    {
        return $this->belongsTo(BracketChallenge::class)->withTrashed();
    }

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class)->withTrashed();
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'match_team', 'match_id', 'team_id')
                    ->withPivot('seed', 'slot')
                    ->withTimestamps();
    }

    public function winnerTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'winner_team_id')->withTrashed();
    }

    public function nextMatch(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'next_match_id');
    }

    public function previousMatches(): HasMany
    {
        return $this->hasMany(GameMatch::class, 'next_match_id');
    }

    public function predictions(): HasMany
    {
        return $this->hasMany(Prediction::class, 'match_id');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isDecided(): bool
    {
        return ! is_null($this->winner_team_id);
    }

    public function isFinal(): bool
    {
        return is_null($this->next_match_id);
    }

    public function isReady(): bool
    {
        return $this->teams()->count() === 2;
    }

    /**
     * Declare winner, grade predictions, advance to next match.
     */
    public function declareWinner(Team $team): void
    {
        if (! $this->teams->contains($team)) {
            throw new \InvalidArgumentException(
                "Team [{$team->club_name}] is not part of this match."
            );
        }

        $this->update(['winner_team_id' => $team->id]);

        $this->gradePredictions();
        $this->advanceWinnerToNextMatch($team);
        $this->checkChallengeCompletion();
    }

    public function gradePredictions(): void
    {
        if (! $this->isDecided()) return;

        $this->predictions()->each(function (Prediction $prediction) {
            $prediction->update([
                'status' => $prediction->predicted_winner_team_id === $this->winner_team_id
                    ? 'correct'
                    : 'incorrect',
            ]);
        });

        $this->predictions()
             ->with('entry')
             ->get()
             ->each(fn ($p) => $p->entry->recalculateScore());
    }

    public function advanceWinnerToNextMatch(Team $team): void
    {
        if (! $this->next_match_id || ! $this->next_match_slot) return;

        $nextMatch = GameMatch::find($this->next_match_id);
        if (! $nextMatch) return;

        $seed = $this->teams()
                     ->where('teams.id', $team->id)
                     ->first()
                     ?->pivot
                     ?->seed;

        $nextMatch->teams()->attach($team->id, [
            'seed' => $seed,
            'slot' => $this->next_match_slot,
        ]);
    }

    private function checkChallengeCompletion(): void
    {
        if (! $this->isFinal()) return;

        $this->bracketChallenge?->update(['status' => 'completed']);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (GameMatch $match) {
            // Always a hard-delete — detach pivot rows and delete predictions.
            // DB cascade on bracket_challenge_id handles bulk cleanup when
            // a challenge is force-deleted, but this covers direct deletion.
            $match->teams()->detach();
            $match->predictions()->delete();
        });
    }
}