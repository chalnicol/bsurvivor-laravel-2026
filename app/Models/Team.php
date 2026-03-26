<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'league_id',
        'club_name',
        'monicker',
        'short_name',
        'logo',
        'conference',
        'slug',
    ];

    protected $casts = [
        'conference' => 'string',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class)->withTrashed();
    }

    // In Team
    public function matches(): BelongsToMany
    {
        return $this->belongsToMany(GameMatch::class, 'match_team', 'team_id', 'match_id')
                    ->withPivot('seed', 'slot')
                    ->withTimestamps();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function isLeagueless(): bool
    {
        return is_null($this->league_id);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (Team $team) {
            if (! $team->isForceDeleting()) {
                // Matches are structural — left untouched when a team is soft-deleted.
                // winner_team_id and match_team pivot are left as historical references.
            }
        });

        static::forceDeleted(function (Team $team) {
            // Detach from all match pivots.
            $team->matches()->detach();

            // Nullify winner_team_id where this team was declared winner.
            GameMatch::where('winner_team_id', $team->id)
                    ->update(['winner_team_id' => null]);
        });

        static::restored(function (Team $team) {
            // Nothing to cascade-restore.
        });
    }
}