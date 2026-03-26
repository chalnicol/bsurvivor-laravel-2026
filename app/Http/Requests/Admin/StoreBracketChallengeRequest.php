<?php

namespace App\Http\Requests\Admin;

use App\Models\Team;
use App\Services\BracketGenerator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreBracketChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole(['admin', 'moderator']);
    }

    public function rules(): array
    {
        return [
            'league_id'        => ['required', 'exists:leagues,id'],
            'name'             => ['required', 'string', 'max:255'],
            'slug'             => ['required', 'string', 'max:255', 'unique:bracket_challenges,slug'],
            'description'      => ['nullable', 'string'],
            'is_public'        => ['sometimes', 'boolean'],
            'submission_start' => ['required', 'date'],
            'submission_end'   => ['required', 'date', 'after:submission_start'],
            'seed_data'        => ['required', 'array'],
            'seed_data.league' => ['required', 'string', 'in:nba,mpbl,pba'],
            'seed_data.teams'  => ['required'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $seedData = $this->input('seed_data');
            $leagueId = $this->input('league_id');

            if (! $seedData) return;

            $league = $seedData['league'] ?? null;
            $teams  = $seedData['teams'] ?? null;

            if (! $league || ! $teams) return;

            // ---- Validate structure per league type ----

            if ($league === 'pba') {
                if (! is_array($teams) || ! array_is_list($teams)) {
                    $validator->errors()->add('seed_data.teams', 'PBA teams must be a flat array.');
                    return;
                }
                $this->validateTeamIds($validator, $teams, 'seed_data.teams');

            } elseif (in_array($league, ['nba', 'mpbl'])) {
                $conferences = $league === 'nba'
                    ? ['east', 'west']
                    : ['north', 'south'];

                foreach ($conferences as $conference) {
                    $confTeams = $teams[$conference] ?? null;

                    if (! is_array($confTeams) || empty($confTeams)) {
                        $validator->errors()->add(
                            "seed_data.teams.{$conference}",
                            "The {$conference} conference teams are required."
                        );
                        continue;
                    }

                    $this->validateTeamIds(
                        $validator,
                        $confTeams,
                        "seed_data.teams.{$conference}"
                    );
                }

                // Both conferences must have same team count
                $counts = array_map(
                    fn ($conf) => count($teams[$conf] ?? []),
                    $conferences
                );

                if (count(array_unique($counts)) > 1) {
                    $validator->errors()->add(
                        'seed_data.teams',
                        'Both conferences must have the same number of teams.'
                    );
                }
            }

            // ---- Validate all teams belong to selected league ----
            if ($leagueId) {
                $allTeamIds = $league === 'pba'
                    ? $teams
                    : array_merge(...array_values($teams));

                if (! empty($allTeamIds)) {
                    $invalidCount = \App\Models\Team::whereIn('id', $allTeamIds)
                        ->where('league_id', '!=', $leagueId)
                        ->count();

                    if ($invalidCount > 0) {
                        $validator->errors()->add(
                            'seed_data.teams',
                            'All selected teams must belong to the selected league.'
                        );
                    }
                }
            }
        });
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->input('name', '')) . '-' . uniqid(),
        ]);
    }

    /**
     * Validate a flat array of team IDs.
     */
    private function validateTeamIds($validator, array $teamIds, string $key): void
    {
        foreach ($teamIds as $index => $id) {
            if (! is_int($id)) {
                $validator->errors()->add("{$key}.{$index}", 'Each team must be a valid ID.');
            }
        }

        if (count($teamIds) !== count(array_unique($teamIds))) {
            $validator->errors()->add($key, 'Duplicate teams are not allowed.');
        }
    }
}