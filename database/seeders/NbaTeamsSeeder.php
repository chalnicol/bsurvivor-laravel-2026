<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Team; // Make sure to import your League model
use Illuminate\Database\Seeder;   // Make sure to import your Team model
use Illuminate\Support\Str;

class NbaTeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $nbaTeams = [
            // eastern Conference
            [
                'club_name' => 'Atlanta',
                'monicker' => 'Hawks',
                'short_name' => 'ATL',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Boston',
                'monicker' => 'Celtics',
                'short_name' => 'BOS',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Brooklyn',
                'monicker' => 'Nets',
                'short_name' => 'BKN',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Charlotte',
                'monicker' => 'Hornets',
                'short_name' => 'CHA',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Chicago',
                'monicker' => 'Bulls',
                'short_name' => 'CHI',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Cleveland',
                'monicker' => 'Cavaliers',
                'short_name' => 'CLE',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Detroit',
                'monicker' => 'Pistons',
                'short_name' => 'DET',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Indiana',
                'monicker' => 'Pacers',
                'short_name' => 'IND',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Miami',
                'monicker' => 'Heat',
                'short_name' => 'MIA',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Milwaukee',
                'monicker' => 'Bucks',
                'short_name' => 'MIL',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'New York',
                'monicker' => 'Knicks',
                'short_name' => 'NYK',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Orlando',
                'monicker' => 'Magic',
                'short_name' => 'ORL',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Philadelphia',
                'monicker' => '76ers',
                'short_name' => 'PHI',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Toronto',
                'monicker' => 'Raptors',
                'short_name' => 'TOR',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
                'conference' => 'east',
            ],
            [
                'club_name' => 'Washington',
                'monicker' => 'Wizards',
                'short_name' => 'WAS',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg',
                'conference' => 'east',
            ],

            // western Conference
            [
                'club_name' => 'Dallas',
                'monicker' => 'Mavericks',
                'short_name' => 'DAL',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Denver',
                'monicker' => 'Nuggets',
                'short_name' => 'DEN',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Golden State',
                'monicker' => 'Warriors',
                'short_name' => 'GSW',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Houston',
                'monicker' => 'Rockets',
                'short_name' => 'HOU',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Los Angeles',
                'monicker' => 'Clippers',
                'short_name' => 'LAC',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Los Angeles',
                'monicker' => 'Lakers',
                'short_name' => 'LAL',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Memphis',
                'monicker' => 'Grizzlies',
                'short_name' => 'MEM',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Minnesota',
                'monicker' => 'Timberwolves',
                'short_name' => 'MIN',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'New Orleans',
                'monicker' => 'Pelicans',
                'short_name' => 'NOP',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Oklahoma City',
                'monicker' => 'Thunder',
                'short_name' => 'OKC',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Phoenix',
                'monicker' => 'Suns',
                'short_name' => 'PHX',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Portland',
                'monicker' => 'Trail Blazers',
                'short_name' => 'POR',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Sacramento',
                'monicker' => 'Kings',
                'short_name' => 'SAC',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'San Antonio',
                'monicker' => 'Spurs',
                'short_name' => 'SAS',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
                'conference' => 'west',
            ],
            [
                'club_name' => 'Utah',
                'monicker' => 'Jazz',
                'short_name' => 'UTA',
                'logo' => 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
                'conference' => 'west',
            ],
        ];

        $nbaLeague = League::where('short_name', 'NBA')->first();

        // IMPORTANT: If the league isn't found for some reason, handle it.
        // This indicates a seeding order issue or a typo.
        if (! $nbaLeague) {
            $this->command->error('Error: "NBA" league not found. Run LeagueSeeder first.');

            return;
        }

        foreach ($nbaTeams as $team) {
            Team::firstOrCreate(
                [
                    'short_name' => $team['short_name'],
                    'league_id' => $nbaLeague->id,
                ],
                [
                    'club_name' => $team['club_name'],
                    'monicker' => $team['monicker'],
                    'short_name' => $team['short_name'],
                    'slug' => Str::slug($team['club_name'].'-'.$team['monicker']),
                    'logo' => $team['logo'],
                    'conference' => $team['conference'],
                ]
            );
        }

    }
}
