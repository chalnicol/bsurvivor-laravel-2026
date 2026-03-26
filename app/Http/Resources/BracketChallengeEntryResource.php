<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BracketChallengeEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                        => $this->id,
            'name'                      => $this->name,
            'slug'                      => $this->slug,
            'status'                    => $this->status,
            'correct_predictions_count' => $this->correct_predictions_count,
            'created_at'                => $this->created_at?->toDateTimeString(),
            'updated_at'                => $this->updated_at?->toDateTimeString(),
            'deleted_at'                => $this->deleted_at?->toDateTimeString(),

            // Counts
            'predictions_count'         => $this->whenCounted('predictions'),
            'correct_count'             => $this->whenCounted('correctPredictions'),

            // Relationships
            'user_id'                   => $this->user_id,
            'user'                      => $this->whenLoaded('user', fn () => new UserResource($this->user)),

            'bracket_challenge_id'      => $this->bracket_challenge_id,
            'bracket_challenge'         => $this->whenLoaded('bracketChallenge', fn () => new BracketChallengeResource($this->bracketChallenge)),

            'predictions'               => $this->whenLoaded('predictions', fn () => PredictionResource::collection($this->predictions)),
        ];
    }
}