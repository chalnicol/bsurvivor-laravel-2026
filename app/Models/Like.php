<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Like extends Model
{
    // No SoftDeletes — likes are ephemeral, hard-delete is correct.

    protected $fillable = [
        'user_id',
        'likeable_id',
        'likeable_type',
        'is_like',
    ];

    protected $casts = [
        'is_like' => 'boolean',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * The polymorphic parent (BracketChallenge, BracketChallengeEntry, Comment).
     */
    public function likeable(): MorphTo
    {
        return $this->morphTo();
    }
}