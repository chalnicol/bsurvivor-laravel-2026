<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'body',
        'user_id',
        'parent_id',
        'commentable_id',
        'commentable_type',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    /**
     * The user who wrote the comment.
     * withTrashed() so soft-deleted users' comments don't return null author.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * The parent comment (if this is a reply).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id')->withTrashed();
    }

    /**
     * Direct replies to this comment.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    /**
     * All replies including soft-deleted ones (for cascade restore).
     */
    public function allReplies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->withTrashed();
    }

    /**
     * The polymorphic parent (BracketChallenge, BracketChallengeEntry, etc.)
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Likes on this comment.
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Whether this comment has been soft-deleted (for "removed" UI display).
     */
    public function isRemoved(): bool
    {
        return $this->trashed();
    }

    /**
     * Whether this is a top-level comment.
     */
    public function isTopLevel(): bool
    {
        return is_null($this->parent_id);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (Comment $comment) {
            if (! $comment->isForceDeleting()) {
                // Cascade soft-delete all direct replies.
                // Each reply's own deleting hook will cascade further down,
                // so deeply nested threads are handled recursively.
                $comment->replies()->each(fn ($reply) => $reply->delete());

                // Hard-delete likes (ephemeral).
                $comment->likes()->delete();
            }
        });

        static::forceDeleted(function (Comment $comment) {
            // Purge all replies that were soft-deleted during cascade.
            $comment->allReplies()->each(fn ($reply) => $reply->forceDelete());

            // Clean up any remaining likes.
            $comment->likes()->delete();
        });

        static::restored(function (Comment $comment) {
            // Restore replies that were cascaded down with this comment.
            // Each reply's own restored hook will cascade further down.
            $comment->allReplies()
                ->onlyTrashed()
                ->each(fn ($reply) => $reply->restore());
        });
    }
}