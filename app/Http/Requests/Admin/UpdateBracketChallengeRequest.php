<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UpdateBracketChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['admin', 'moderator']);
    }

    public function rules(): array
    {
        $challengeId = $this->route('bracketChallenge')->id;

        return [
            'league_id'        => ['sometimes', 'exists:leagues,id'],
            'name'             => ['sometimes', 'string', 'max:255'],
            'slug'             => ['sometimes', 'string', 'max:255', Rule::unique('bracket_challenges', 'slug')->ignore($challengeId)],
            'description'      => ['nullable', 'string'],
            'is_public'        => ['sometimes', 'boolean'],
            'submission_start' => ['sometimes', 'date'],
            'submission_end'   => ['sometimes', 'date', 'after:submission_start'],
        ];
    }

    public function messages(): array
    {
        return [
            'submission_end.after' => 'Submission end date must be after the start date.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('slug')) {
            $this->merge([
                'slug' => Str::slug($this->input('slug')),
            ]);
        }
    }
}