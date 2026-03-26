<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class BracketChallengeEntry extends Model
{
    use SoftDeletes;

    protected $table = 'bracket_challenge_entries';

    protected $fillable = [
        'bracket_challenge_id',
        'user_id',
        'name',
        'slug',
        'status',
        'correct_predictions_count',
    ];

    protected $casts = [
        'correct_predictions_count' => 'integer',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function bracketChallenge(): BelongsTo
    {
        return $this->belongsTo(BracketChallenge::class, 'bracket_challenge_id')
                    ->withTrashed();
    }

    public function predictions(): HasMany
    {
        return $this->hasMany(Prediction::class, 'bracket_challenge_entry_id');
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable')->whereNull('parent_id');
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
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Entries are locked forever once submitted — no changes allowed.
     */
    public function isLocked(): bool
    {
        return true;
    }

    /**
     * Recalculate and persist the correct predictions count.
     * Called automatically when a match result is declared.
     */
    public function recalculateScore(): void
    {
        $this->correct_predictions_count = $this->predictions()
            ->where('status', 'correct')
            ->count();

        $this->saveQuietly();
    }

    /**
     * Total predictions graded so far (correct + incorrect).
     */
    public function gradedCount(): int
    {
        return $this->predictions()
                    ->whereIn('status', ['correct', 'incorrect'])
                    ->count();
    }

    /**
     * Max possible score remaining (pending predictions still winnable).
     */
    public function maxPossibleScore(): int
    {
        return $this->correct_predictions_count
             + $this->predictions()->where('status', 'pending')->count();
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    public function scopeOwnedBy($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForChallenge($query, int $challengeId)
    {
        return $query->where('bracket_challenge_id', $challengeId);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (BracketChallengeEntry $entry) {
            if (! $entry->isForceDeleting()) {
                $entry->likes()->delete();
                $entry->allComments()
                      ->whereNull('parent_id')
                      ->each(fn ($c) => $c->delete());
            }
        });

        static::forceDeleted(function (BracketChallengeEntry $entry) {
            $entry->predictions()->delete();
            $entry->likes()->delete();
            $entry->allComments()->withTrashed()->each(fn ($c) => $c->forceDelete());
        });

        static::restored(function (BracketChallengeEntry $entry) {
            $entry->allComments()
                  ->onlyTrashed()
                  ->whereNull('parent_id')
                  ->each(fn ($c) => $c->restore());
        });
    }
}