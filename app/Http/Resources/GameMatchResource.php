<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameMatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'round_index'         => $this->round_index,
            'match_index'         => $this->match_index,  // fixed from matchup_index
            'conference'          => $this->conference,
            'next_match_id'       => $this->next_match_id,
            'next_match_slot'     => $this->next_match_slot,
            'created_at'          => $this->created_at?->toDateTimeString(),
            'updated_at'          => $this->updated_at?->toDateTimeString(),

            // Counts
            'predictions_count'   => $this->whenCounted('predictions'),

            // Relationships
            'league_id'           => $this->league_id,
            'league'              => $this->whenLoaded('league', fn () => new LeagueResource($this->league)),

            'bracket_challenge_id' => $this->bracket_challenge_id,
            'bracket_challenge'   => $this->whenLoaded('bracketChallenge', fn () => new BracketChallengeResource($this->bracketChallenge)),

            'winner_team_id'      => $this->winner_team_id,
            'winner_team'         => $this->whenLoaded('winnerTeam', fn () => new TeamResource($this->winnerTeam)),

            'teams'               => $this->whenLoaded('teams', fn () => TeamResource::collection($this->teams)),
            'predictions'         => $this->whenLoaded('predictions', fn () => PredictionResource::collection($this->predictions)),
        ];
    }
}