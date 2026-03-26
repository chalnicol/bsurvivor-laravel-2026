<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder; // Import your User model
use Illuminate\Support\Facades\Hash; // For hashing the password

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $users = [

            [
                'username' => 'adminUser',
                'full_name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('asdfasdf'), // Use a secure password
                'email_verified_at' => now(), // Set email as verified
            ],
            [
                'username' => 'charlou',
                'full_name' => 'Charlou Nicolas',
                'email' => 'charlou@example.com',
                'password' => Hash::make('asdfasdf'), // Use a secure password
                'email_verified_at' => now(), // Set email as verified
            ],
            [
                'username' => 'nong',
                'full_name' => 'Nong Nicolas',
                'email' => 'nong@example.com',
                'password' => Hash::make('asdfasdf'), // Use a secure password
                'email_verified_at' => now(), // Set email as verified
            ],
            [
                'username' => 'rogernicol',
                'full_name' => 'Roger Nicolas',
                'email' => 'nongers@example.com',
                'password' => Hash::make('asdfasdf'), // Use a secure password
                'email_verified_at' => now(), // Set email as verified
            ],
            [
                'username' => 'charlie',
                'full_name' => 'Charlie Nicolas',
                'email' => 'charles@example.com',
                'password' => Hash::make('asdfasdf'), // Use a secure password
                'email_verified_at' => now(), // Set email as verified
            ],

            // [
            //         "username" => "admin",
            //         "full_name" => "System Admin",
            //         "email" => "chalnicol@gmail.com",
            //         "password" => Hash::make('admin@shvbracket11'), // Use a secure password
            //         "email_verified_at" => now(), // Set email as verified
            // ]

        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                [
                    'username' => $user['username'],
                    'email' => $user['email'],

                ],
                [
                    'full_name' => $user['full_name'],
                    'password' => $user['password'],
                    'email_verified_at' => now(),
                ]
            );
        }

    }
}
