<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PredictionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'status'                   => $this->status,
            'created_at'               => $this->created_at?->toDateTimeString(),
            'updated_at'               => $this->updated_at?->toDateTimeString(),

            // Relationships
            'bracket_challenge_entry_id' => $this->bracket_challenge_entry_id,
            'entry'                    => $this->whenLoaded('entry', fn () => new BracketChallengeEntryResource($this->entry)),

            'match_id'                 => $this->match_id,
            'match'                    => $this->whenLoaded('match', fn () => new GameMatchResource($this->match)),

            'predicted_winner_team_id' => $this->predicted_winner_team_id,
            'predicted_winner'         => $this->whenLoaded('predictedWinner', fn () => new TeamResource($this->predictedWinner)),
        ];
    }
}