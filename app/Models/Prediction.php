<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prediction extends Model
{
    // No SoftDeletes — transactional, cascades from entry or match.

    protected $fillable = [
        'bracket_challenge_entry_id',
        'match_id',
        'predicted_winner_team_id',
        'status',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function entry(): BelongsTo
    {
        return $this->belongsTo(BracketChallengeEntry::class, 'bracket_challenge_entry_id')
                    ->withTrashed();
    }

    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
                    // ->withTrashed();
    }

    public function predictedWinner(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'predicted_winner_team_id')
                    ->withTrashed();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCorrect(): bool
    {
        return $this->status === 'correct';
    }

    public function isIncorrect(): bool
    {
        return $this->status === 'incorrect';
    }

    public function isVoid(): bool
    {
        return $this->status === 'void';
    }
}
