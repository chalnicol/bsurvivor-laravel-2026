<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LikeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'is_like'        => $this->is_like,
            'created_at'     => $this->created_at?->toDateTimeString(),
            'updated_at'     => $this->updated_at?->toDateTimeString(),

            // Relationships
            'user_id'        => $this->user_id,
            'user'           => $this->whenLoaded('user', fn () => new UserResource($this->user)),

            'likeable_id'    => $this->likeable_id,
            'likeable_type'  => $this->likeable_type,
        ];
    }
}