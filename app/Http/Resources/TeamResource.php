<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'club_name'  => $this->club_name,
            'monicker'   => $this->monicker,
            'short_name' => $this->short_name,
            'conference' => $this->conference,
            'slug'       => $this->slug,
            'logo'       => $this->logo,
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'deleted_at' => $this->deleted_at?->toDateTimeString(),

            // Counts
            'matches_count' => $this->whenCounted('matches'),

            // Pivot data — only present when accessed via belongsToMany
            // 'pivot' => $this->when(isset($this->pivot), [
            //     'seed' => $this->pivot?->seed,
            //     'slot' => $this->pivot?->slot,
            // ]),
            'seed' => $this->pivot?->seed ?? 0,
            'slot' => $this->pivot?->slot ?? 0,


            // Relationships
            'league_id' => $this->league_id,
            'league'    => $this->whenLoaded('league', fn () => new LeagueResource($this->league)),
        ];
    }

    /**
     * Minimal representation for dropdowns.
     */
    public static function minimal(mixed $resource): array
    {
        return TeamResource::collection($resource)
            ->collection
            ->map(fn ($team) => [
                'id'         => $team->id,
                'club_name'  => $team->club_name,
                'short_name' => $team->short_name,
                'logo'       => $team->logo,
                'conference' => $team->conference,
                'monicker'   => $team->monicker,
                'slug'       => $team->slug,
            ])->toArray();
    }
}