<?php

namespace Database\Seeders;

use App\Models\League;
use Illuminate\Database\Seeder; // Make sure to import your League model
use Illuminate\Support\Str;

class LeagueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $leagues = [
            [
                'short_name' => 'NBA',
                'name' => 'National Basketball Association',
            ],
            [
                'short_name' => 'PBA',
                'name' => 'Philippine Basketball Association',
            ],
             [
                'short_name' => 'MPBL',
                'name' => 'Maharlika Pilipinas Basketball League',
            ],
        ];

        foreach ($leagues as $league) {
            League::firstOrCreate(
                [
                    'short_name' => $league['short_name'],
                ],
                [
                    'name' => $league['name'],
                    'slug' => Str::slug($league['name']),
                ]
            );
        }

    }
}
