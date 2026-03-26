<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Traits\HasPermissions;
use Illuminate\Support\Facades\DB;

use App\Notifications\VerifyEmailNotification;
use App\Notifications\PasswordResetRequestNotification;

use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use Illuminate\Support\Facades\Mail;


class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, SoftDeletes, HasRoles, HasPermissions, Notifiable, TwoFactorAuthenticatable;

    protected $fillable = [
        'username',
        'full_name',
        'email',
        'password',
        'is_blocked',
        'firebase_uid',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected $appends = [
        'all_permissions',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_blocked'        => 'boolean',
        ];
    }

    // -------------------------------------------------------------------------
    // Mail Overrides
    // -------------------------------------------------------------------------

    public function sendPasswordResetNotification($token): void
    {
        Mail::to($this->email)->send(new ResetPasswordMail($this, $token));
    }

    public function sendEmailVerificationNotification(): void
    {
        Mail::to($this->email)->send(new VerifyEmailMail($this));
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    public function getAllPermissionsAttribute()
    {
        return $this->getAllPermissions()->pluck('name');
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    public function hasVerifiedEmail(): bool
    {
        return ! is_null($this->email_verified_at);
    }

    public function isBlocked(): bool
    {
        return (bool) $this->is_blocked;
    }

    // -------------------------------------------------------------------------
    // Standard Relationships
    // -------------------------------------------------------------------------

    public function entries(): HasMany
    {
        return $this->hasMany(BracketChallengeEntry::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    // -------------------------------------------------------------------------
    // Friendship Relationships
    // -------------------------------------------------------------------------

    /**
     * Accepted friends where I sent the request.
     */
    public function friendsOfMine(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->wherePivot('status', 'accepted')
            ->withTimestamps();
    }

    /**
     * Accepted friends where I received the request.
     */
    public function friendOf(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id')
            ->wherePivot('status', 'accepted')
            ->withTimestamps();
    }

    /**
     * Requests I have sent that are still pending.
     */
    public function friendRequestsSent(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')
            ->wherePivot('status', 'pending')
            ->withTimestamps();
    }

    /**
     * Requests sent to me that are still pending.
     */
    public function friendRequestsReceived(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id')
            ->wherePivot('status', 'pending')
            ->withTimestamps();
    }

    // -------------------------------------------------------------------------
    // Logic Helpers
    // -------------------------------------------------------------------------

    /**
     * Accessor to get all accepted friends in a single collection.
     * Usage: $user->friends
     */
    public function getFriendsAttribute()
    {
        return $this->friendsOfMine->merge($this->friendOf);
    }

    /**
     * Quick check if any relationship exists (for search/validation).
     */
    public function hasAnyFriendshipWith(User $user): bool
    {
        return DB::table('friends')
            ->where(function ($query) use ($user) {
                $query->where('user_id', $this->id)->where('friend_id', $user->id);
            })
            ->orWhere(function ($query) use ($user) {
                $query->where('user_id', $user->id)->where('friend_id', $this->id);
            })
            ->exists();
    }

    // -------------------------------------------------------------------------
    // Lifecycle Hooks
    // -------------------------------------------------------------------------

    protected static function booted(): void
    {
        static::deleting(function (User $user) {
            // Only run deep cleanup on soft-delete (not force-delete)
            if (! $user->isForceDeleting()) {

                // 1. Anonymise PII so the record is GDPR-safe while still
                //    preserving referential integrity for reports/logs.
                $user->forceFill([
                    'username'          => 'deleted_user_' . $user->id,
                    'full_name'         => 'Deleted User',
                    'email'             => 'deleted_' . $user->id . '@deleted.invalid',
                    'firebase_uid'      => null,
                    'email_verified_at' => null,
                    'is_blocked'        => true,        // prevents accidental re-login
                    'remember_token'    => null,
                    'two_factor_secret' => null,
                    'two_factor_recovery_codes' => null,
                    'two_factor_confirmed_at'   => null,
                ])->saveQuietly();   // saveQuietly skips observers / events

                // 2. Revoke all Spatie roles & permissions.
                $user->syncRoles([]);
                $user->syncPermissions([]);

                // 3. Remove all friendship rows (both directions).
                DB::table('friends')
                    ->where('user_id', $user->id)
                    ->orWhere('friend_id', $user->id)
                    ->delete();

                // 4. Soft-delete child records that have their own SoftDeletes.
                $user->entries()->each(fn ($e) => $e->delete());
                $user->comments()->each(fn ($c) => $c->delete());
                $user->likes()->each(fn ($l) => $l->delete());

                // 5. Revoke all personal-access / API tokens if using Sanctum.
                if (method_exists($user, 'tokens')) {
                    $user->tokens()->delete();
                }
            }
        });

        // When a user is force-deleted, hard-delete everything that was
        // soft-deleted above (or was never soft-deletable).
        static::forceDeleted(function (User $user) {

            // Hard-delete child records (already soft-deleted, now purge).
            $user->entries()->withTrashed()->forceDelete();
            $user->comments()->withTrashed()->forceDelete();
            $user->likes()->withTrashed()->forceDelete();

            // Clean up pivot / junction tables.
            DB::table('friends')
                ->where('user_id', $user->id)
                ->orWhere('friend_id', $user->id)
                ->delete();

            // Revoke roles & permissions one final time
            // (covers users force-deleted without a prior soft-delete).
            $user->syncRoles([]);
            $user->syncPermissions([]);
        });

        // On restore, un-block and cascade restore to child records.
        static::restored(function (User $user) {
            $user->forceFill(['is_blocked' => false])->saveQuietly();

            $user->entries()->onlyTrashed()->restore();
            $user->comments()->onlyTrashed()->restore();
            $user->likes()->onlyTrashed()->restore();
        });
    }
}