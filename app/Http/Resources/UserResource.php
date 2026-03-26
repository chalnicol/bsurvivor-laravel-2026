<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $adminRoles = ['admin', 'moderator'];

        return [
            'id'                         => $this->id,
            'full_name'                  => $this->full_name,
            'username'                   => $this->username,
            'avatar'                     => $this->avatar,

            // Only visible to admins or the user themselves
            'email'                      => $this->when(
                $request->user()?->hasAnyRole($adminRoles) || $request->user()?->id === $this->id,
                $this->email,
            ),

            // Only visible to admins
            'roles'                      => $this->when(
                $request->user()?->hasAnyRole($adminRoles),
                fn () => $this->getRoleNames(),
            ),
            'is_verified'                => $this->hasVerifiedEmail(),
            'is_blocked'                 => (bool) $this->is_blocked,
            'unread_notifications_count' => (int) ($this->unread_notifications_count ?? 0),
            'deleted_at'                 => $this->deleted_at?->toDateTimeString(),
            'created_at'                 => $this->created_at?->toDateTimeString(),
            'updated_at'                 => $this->updated_at?->toDateTimeString(),
        ];
    }

    /**
     * Minimal representation for dropdowns and relation display.
     * Returns: id, full_name, username, avatar
     */
    public static function minimal(mixed $resource): array
    {
        return UserResource::collection($resource)
            ->collection
            ->map(fn ($user) => [
                'id'        => $user->id,
                'full_name' => $user->full_name,
                'username'  => $user->username,
                'avatar'    => $user->avatar,
            ])->toArray();
    }
}