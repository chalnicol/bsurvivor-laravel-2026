<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BracketChallengeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'slug'             => $this->slug,
            'description'      => $this->description,
            'status'           => $this->status,
            'is_public'        => $this->is_public,
            'team_count'       => $this->team_count,
            'total_rounds'     => $this->total_rounds,
            'submission_start' => $this->submission_start?->toDateString(),
            'submission_end'   => $this->submission_end?->toDateString(),
            'created_at'       => $this->created_at?->toDateTimeString(),
            'updated_at'       => $this->updated_at?->toDateTimeString(),
            'deleted_at'       => $this->deleted_at?->toDateTimeString(),
            'seed_data'        => $this->seed_data,
            // Counts — only present when loaded via withCount()
            'entries_count'    => $this->whenCounted('entries'),

            // Relationships — only present when loaded via with()
            'league_id'        => $this->league_id,
            'league'           => $this->whenLoaded('league', fn () => new LeagueResource($this->league)),
            'matches'          => $this->whenLoaded('matches', fn () => GameMatchResource::collection($this->matches)),
            'entries'          => $this->whenLoaded('entries', fn () => BracketChallengeEntryResource::collection($this->entries)),
        ];
    }
}