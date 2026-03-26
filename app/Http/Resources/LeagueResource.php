<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeagueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'short_name' => $this->short_name,
            'slug'       => $this->slug,
            'logo'       => $this->logo,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->deleted_at?->toDateTimeString(),

            // Counts
            'teams_count' => $this->whenCounted('teams'),

            // Relationships
            'teams' => $this->whenLoaded('teams', fn () => TeamResource::collection($this->teams)),
        ];
    }

    /**
     * Minimal representation for dropdowns.
     */
    public static function minimal(mixed $resource): array
    {
        return LeagueResource::collection($resource)
            ->collection
            ->map(fn ($league) => [
                'id'         => $league->id,
                'name'       => $league->name,
                'short_name' => $league->short_name,
                'logo'       => $league->logo,
            ])->toArray();
    }
}