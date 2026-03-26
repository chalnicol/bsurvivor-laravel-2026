<?php

namespace App\Models;

use App\Services\BracketGenerator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Collection;

class BracketChallenge extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'league_id',
        'name',
        'slug',
        'description',
        'status',
        'is_public',
        'submission_start',
        'submission_end',
        'team_count',
        'total_rounds',
        'seed_data'
    ];

    protected $casts = [
        'submission_start' => 'date',
        'submission_end'   => 'date',
        'is_public'        => 'boolean',
        'team_count'       => 'integer',
        'total_rounds'     => 'integer',
        'seed_data'        => 'array',   
    ];



    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class)->withTrashed();
    }

    public function matches(): HasMany
    {
        return $this->hasMany(GameMatch::class, 'bracket_challenge_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(BracketChallengeEntry::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable')
                    ->whereNull('parent_id');
    }

    public function allComments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function myVote(): MorphOne
    {
        if (auth()->check()) {
            return $this->morphOne(Like::class, 'likeable')
                        ->where('user_id', auth()->id());
        }

        return $this->morphOne(Like::class, 'likeable')
                    ->whereRaw('1 = 0');
    }

    public function likesOnly(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable')->where('is_like', true);
    }

    public function dislikesOnly(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable')->where('is_like', false);
    }

    // -------------------------------------------------------------------------
    // Bracket Helpers
    // -------------------------------------------------------------------------

   

    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isAcceptingSubmissions(): bool
    {
        return $this->isOpen()
            && now()->between($this->submission_start, $this->submission_end);
    }

    /**
     * Get matches for a specific round.
     */
    public function matchesInRound(int $round): HasMany
    {
        return $this->matches()->where('round_index', $round);
    }

    /**
     * Get only Round 1 matches (the ones with seeded teams).
     */
    public function firstRoundMatches(): HasMany
    {
        return $this->matches()->where('round_index', 1)->orderBy('match_index');
    }

    /**
     * Get the final match (last round, single match).
     */
    public function finalMatch(): ?GameMatch
    {
        return $this->matches()
                    ->where('round_index', $this->total_rounds)
                    ->first();
    }

    /**
     * Check if all matches have been decided.
     */
    public function isFullyDecided(): bool
    {
        return $this->matches()
                    ->whereNull('winner_team_id')
                    ->doesntExist();
    }

    /**
     * Generate the bracket given seeded teams.
     * Call this after creating the challenge and setting teams.
     *
     * Usage:
     * $challenge->generateBracket(Team::whereIn('id', $teamIds)->get());
     */
    public function generateBracket(Collection $seededTeams): void
    {
        if (! $this->isDraft()) {
            throw new \RuntimeException(
                "Bracket can only be generated when challenge is in draft status."
            );
        }

        // Auto-calculate total_rounds from team_count if not set.
        if (! $this->total_rounds) {
            $this->update([
                'total_rounds' => BracketGenerator::calculateRounds($this->team_count),
            ]);
        }

        app(BracketGenerator::class)->generate($this, $seededTeams);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (BracketChallenge $challenge) {
            if (! $challenge->isForceDeleting()) {
                // Matches are LEFT UNTOUCHED on soft-delete —
                // they only get cleaned up on force-delete via DB cascade.
                $challenge->entries()->each(fn ($e) => $e->delete());
                $challenge->likes()->delete();
                $challenge->allComments()
                        ->whereNull('parent_id')
                        ->each(fn ($c) => $c->delete());
            }
        });

        static::forceDeleted(function (BracketChallenge $challenge) {
            // Matches + their predictions + pivot rows are hard-deleted
            // automatically via DB cascade on bracket_challenge_id FK.
            // No manual loop needed here.

            $challenge->entries()->withTrashed()->each(fn ($e) => $e->forceDelete());
            $challenge->allComments()->withTrashed()->each(fn ($c) => $c->forceDelete());
            $challenge->likes()->delete();
        });

        static::restored(function (BracketChallenge $challenge) {
            $challenge->entries()->onlyTrashed()->restore();
            $challenge->allComments()
                    ->onlyTrashed()
                    ->whereNull('parent_id')
                    ->each(fn ($c) => $c->restore());
        });
    }
}