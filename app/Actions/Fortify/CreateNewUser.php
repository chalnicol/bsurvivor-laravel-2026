<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $messages = [
            'password.regex' => 'Your password must contain at least one uppercase letter, one number, and one special character.',
            'username.regex' => 'The username may only contain letters, numbers, and underscores.'
        ];

        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'username' => $input['username'],
            'full_name' => $input['full_name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);
    }
}
