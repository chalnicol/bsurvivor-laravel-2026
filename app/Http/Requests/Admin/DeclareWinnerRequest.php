<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DeclareWinnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['admin', 'moderator']);
    }

    public function rules(): array
    {
        return [
            'winner_team_id' => ['required', 'integer', 'exists:teams,id'],
        ];
    }
}