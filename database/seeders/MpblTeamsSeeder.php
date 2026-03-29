<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MpblTeamsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mpblTeams = [
            // North Division
            ['club_name' => 'Abra', 'monicker' => 'Weavers', 'short_name' => 'ABR', 'conference' => 'north'],
            ['club_name' => 'Bataan', 'monicker' => 'Risers', 'short_name' => 'BTN', 'conference' => 'north'],
            ['club_name' => 'Caloocan', 'monicker' => 'Batang Kankaloo', 'short_name' => 'CAL', 'conference' => 'north'],
            ['club_name' => 'Bulacan', 'monicker' => 'Kuyas', 'short_name' => 'BUL', 'conference' => 'north'],
            ['club_name' => 'Manila', 'monicker' => 'Batang Quiapo', 'short_name' => 'MNL', 'conference' => 'north'],
            ['club_name' => 'Marikina', 'monicker' => 'Shoemasters', 'short_name' => 'MAR', 'conference' => 'north'],
            ['club_name' => 'Nueva Ecija', 'monicker' => 'Rice Vanguards', 'short_name' => 'NEC', 'conference' => 'north'],
            ['club_name' => 'Pampanga', 'monicker' => 'Giant Lanterns', 'short_name' => 'PAM', 'conference' => 'north'],
            ['club_name' => 'Pangasinan', 'monicker' => 'Heatwaves', 'short_name' => 'PAN', 'conference' => 'north'],
            ['club_name' => 'Pasay', 'monicker' => 'Voyagers', 'short_name' => 'PSY', 'conference' => 'north'],
            ['club_name' => 'Pasig', 'monicker' => 'City', 'short_name' => 'PSG', 'conference' => 'north'],
            ['club_name' => 'Quezon City', 'monicker' => 'Black Bulls', 'short_name' => 'QCC', 'conference' => 'north'],
            ['club_name' => 'Rizal', 'monicker' => 'Xentro Mall Golden Coolers', 'short_name' => 'RZL', 'conference' => 'north'],
            ['club_name' => 'San Juan', 'monicker' => 'Knights', 'short_name' => 'SJK', 'conference' => 'north'],
            ['club_name' => 'Valenzuela', 'monicker' => 'City Magic', 'short_name' => 'VAL', 'conference' => 'north'],

            // South Division
            ['club_name' => 'Bacolod', 'monicker' => 'Mascarra', 'short_name' => 'BCD', 'conference' => 'south'],
            ['club_name' => 'Basilan', 'monicker' => 'Starhorse', 'short_name' => 'BAS', 'conference' => 'south'],
            ['club_name' => 'Batangas City', 'monicker' => 'Tanduay Rum Masters', 'short_name' => 'BTG', 'conference' => 'south'],
            ['club_name' => 'Biñan', 'monicker' => 'Tatak Gel', 'short_name' => 'BIN', 'conference' => 'south'],
            ['club_name' => 'Cebu', 'monicker' => 'Greats', 'short_name' => 'CEB', 'conference' => 'south'],
            ['club_name' => 'Davao Occidental', 'monicker' => 'Tigers', 'short_name' => 'DVO', 'conference' => 'south'],
            ['club_name' => 'General Santos', 'monicker' => 'Warriors', 'short_name' => 'GSN', 'conference' => 'south'],
            ['club_name' => 'Ilagan Isabela', 'monicker' => 'Five Star Cowboys', 'short_name' => 'ISA', 'conference' => 'south'],
            ['club_name' => 'Imus', 'monicker' => 'Grumpy Joe', 'short_name' => 'IMS', 'conference' => 'south'],
            ['club_name' => 'Mindoro', 'monicker' => 'Tamaraws', 'short_name' => 'MDR', 'conference' => 'south'],
            ['club_name' => 'Muntinlupa', 'monicker' => 'Cagers', 'short_name' => 'MUN', 'conference' => 'south'],
            ['club_name' => 'Parañaque', 'monicker' => 'Patriots', 'short_name' => 'PAR', 'conference' => 'south'],
            ['club_name' => 'Quezon', 'monicker' => 'Huskers', 'short_name' => 'QZN', 'conference' => 'south'],
            ['club_name' => 'Sarangani', 'monicker' => '10ACT', 'short_name' => 'SAR', 'conference' => 'south'],
            ['club_name' => 'Zamboanga', 'monicker' => 'SiKAT', 'short_name' => 'ZAM', 'conference' => 'south'],
        ];

        $mpblLeague = League::where('short_name', 'MPBL')->first();

        if (!$mpblLeague) {
            $this->command->error('Error: "MPBL" league not found. Run LeagueSeeder first.');
            return;
        }

        foreach ($mpblTeams as $team) {
            Team::firstOrCreate(
                [
                    'short_name' => $team['short_name'],
                    'league_id' => $mpblLeague->id,
                ],
                [
                    'club_name' => $team['club_name'],
                    'monicker' => $team['monicker'],
                    'slug' => Str::slug($team['club_name'] . '-' . $team['monicker']),
                    'logo' => null, // You can add logo URLs later
                    'conference' => $team['conference'],
                ]
            );
        }
    }
}