<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'body'             => $this->when(! $this->trashed(), $this->body),
            'is_published'     => $this->is_published,
            'is_removed'       => $this->trashed(),
            'created_at'       => $this->created_at?->toDateTimeString(),
            'updated_at'       => $this->updated_at?->toDateTimeString(),
            'deleted_at'       => $this->deleted_at?->toDateTimeString(),

            // Counts
            'replies_count'    => $this->whenCounted('replies'),
            'likes_count'      => $this->whenCounted('likes'),

            // Relationships
            'parent_id'        => $this->parent_id,
            'user_id'          => $this->user_id,
            'user'             => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'replies'          => $this->whenLoaded('replies', fn () => CommentResource::collection($this->replies)),
            'commentable_id'   => $this->commentable_id,
            'commentable_type' => $this->commentable_type,
            'likes'            => $this->whenLoaded('likes', fn () => LikeResource::collection($this->likes)),
        ];
    }
}