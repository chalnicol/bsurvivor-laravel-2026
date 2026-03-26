<?php

namespace App\Concerns;

use App\Models\User;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate user profiles.
     *
     * @return array<string, array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>>
     */
    protected function profileRules(?int $userId = null): array
    {
        return [
            'username' => $this->usernameRules($userId),
            'full_name' => $this->nameRules(),
            'email' => $this->emailRules($userId),
        ];

    }

    protected function usernameRules(?int $userId = null): array 
    {
        return [
            'required', 
            'string', 
            'min:3', 
            'max:15', 
            'regex:/^[a-zA-Z0-9_]+$/',  
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId), ];
    }
    /**
     * Get the validation rules used to validate user names.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate user emails.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function emailRules(?int $userId = null): array
    {
        return [
            'required',
            'string',
            // 'email:rfc,dns',
            'email',
            'max:255',
            $userId === null
                ? Rule::unique(User::class)
                : Rule::unique(User::class)->ignore($userId),
        ];
    }
}
