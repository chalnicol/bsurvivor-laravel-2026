<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Team; // Make sure to import your League model
use Illuminate\Database\Seeder;   // Make sure to import your Team model
use Illuminate\Support\Str;

class PbaTeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $pbaTeams = [
            [
                'club_name' => 'Brgy. Ginebra',
                'monicker' => 'San Miguel',
                'short_name' => 'BGSM',
                'logo' => null,
            ],
            [
                'club_name' => 'Blackwater',
                'monicker' => 'Bossing',
                'short_name' => 'BLW',
                'logo' => null,
            ],
            [
                'club_name' => 'Converge',
                'monicker' => 'FiberXers',
                'short_name' => 'CFX',
                'logo' => null,
            ],
            [
                'club_name' => 'Magnolia Chicken Timplados',
                'monicker' => 'Hotshots',
                'short_name' => 'MAG',
                'logo' => null,
            ],
            [
                'club_name' => 'Meralco',
                'monicker' => 'Bolts',
                'short_name' => 'MER',
                'logo' => null,
            ],
            [
                'club_name' => 'NLEX',
                'monicker' => 'Road Warriors',
                'short_name' => 'NLEX',
                'logo' => null,
            ],
            
            [
                'club_name' => 'Phoenix Super LPG',
                'monicker' => 'Fuel Masters',
                'short_name' => 'PHX',
                'logo' => null,
            ],
             [
                'club_name' => 'Rain or Shine',
                'monicker' => 'Elasto Painters',
                'short_name' => 'ROS',
                'logo' => null,
            ],
           
            [
                'club_name' => 'San Miguel',
                'monicker' => 'Beermen',
                'short_name' => 'SMB',
                'logo' => null,
            ],
            [
                'club_name' => 'Terrafirma',
                'monicker' => 'Dyip',
                'short_name' => 'TFD',
                'logo' => null,
            ],
            [
                'club_name' => 'Titan Ultra',
                'monicker' => 'Giant Risers',
                'short_name' => 'TGR',
                'logo' => null,
            ],

            [
                'club_name' => 'TNT',
                'monicker' => 'Tropang 5G',
                'short_name' => 'TNT',
                'logo' => null,
            ],
            // Note: Bay Area Dragons was a guest team, typically not included in core league seeders
        ];

        $pbaLeague = League::where('short_name', 'PBA')->first();

        // IMPORTANT: If the league isn't found for some reason, handle it.
        // This indicates a seeding order issue or a typo.
        if (! $pbaLeague) {
            $this->command->error('Error: "PBA" league not found. Run LeagueSeeder first.');

            return;
        }

        foreach ($pbaTeams as $team) {
            Team::firstOrCreate(
                [
                    'short_name' => $team['short_name'],
                    'league_id' => $pbaLeague->id,
                ],
                [
                    'club_name' => $team['club_name'],
                    'monicker' => $team['monicker'],
                    // 'logo' => $team['logo'],
                    'slug' => Str::slug($team['club_name'].' '.$team['monicker']),
                    'short_name' => $team['short_name'],
                ]
            );
        }

    }
}
