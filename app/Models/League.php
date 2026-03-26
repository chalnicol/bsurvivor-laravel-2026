<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'short_name',
        'logo',
    ];

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function bracketChallenges(): HasMany
    {
        return $this->hasMany(BracketChallenge::class);
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (League $league) {
            // Soft-delete only — Teams and BracketChallenges are left untouched.
            // league_id on both tables becomes a historical/orphaned reference,
            // which is intentional per domain rules.
            //
            // If you ever need to guard against deleting an active league,
            // uncomment the block below:
            //
            // if ($league->bracketChallenges()->whereNull('deleted_at')->exists()) {
            //     throw new \RuntimeException(
            //         "Cannot delete league [{$league->name}]: it still has active bracket challenges."
            //     );
            // }
        });

        static::forceDeleted(function (League $league) {
            // On hard purge, nullify league_id on Teams so they become
            // truly league-less rather than pointing at a ghost row.
            $league->teams()->update(['league_id' => null]);

            // BracketChallenges keep league_id as a historical reference.
            // If you want to nullify there too, add:
            // $league->bracketChallenges()->update(['league_id' => null]);
        });

        static::restored(function (League $league) {
            // Nothing to cascade-restore since children were never touched.
            // Add any restore-time side-effects here if needed in the future.
        });
    }
}