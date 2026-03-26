<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use App\Models\Team;
use App\Models\League;

use App\Http\Resources\TeamResource;
use App\Http\Resources\LeagueResource;

use Illuminate\Validation\Rule;

use Inertia\Inertia;


class TeamController extends Controller
{
    //
    public function index(Request $request)
    {
        $teams = Team::query()
            ->with(['league'])
            // Use 'where' inside a closure if you plan to search multiple columns later
            ->when($request->search, function ($query, $search) {
                // Grouping the OR conditions inside a nested closure
                $query->where(function ($q) use ($search) {
                    $q->where('club_name', 'like', "%{$search}%")
                        ->orWhere('monicker', 'like', "%{$search}%");
                        // ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            // ->orderBy('updated_at', 'desc')
            // ->orderBy('id', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/teams/index', [
            'teams' => TeamResource::collection($teams),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show (Team $team) 
    {
        return Inertia::render('admin/teams/show', [
             'team' => new TeamResource($team)->load('league')
        ]);
    }

    public function create () 
    {

        return Inertia::render('admin/teams/create', [
            'leagues' => LeagueResource::collection(League::all())
        ]);
    }

    public function edit (Team $team) 
    {
        return Inertia::render('admin/teams/edit', [
             'team' => new TeamResource($team)->load('league'),
             'leagues' => LeagueResource::collection(League::all())
        ]);
    }

    public function store(Request $request)
    {
        $nbaLeague = League::where('short_name', 'NBA')->first();

        $validated = $request->validate([
            'club_name'  => [
                'required', 'string', 'max:255', 
                Rule::unique('teams', 'club_name')
                    ->where('league_id', $request->league_id)
            ],
            'short_name' => [
                'required', 'string', 'max:4', 
                Rule::unique('teams', 'short_name')
                    ->where('league_id', $request->league_id)
            ],
            'monicker'   => [
                'required', 'string', 'max:255',
                Rule::unique('teams', 'monicker')
                    ->where('league_id', $request->league_id)
            ],
            'league_id'  => ['nullable', 'exists:leagues,id'],
            'logo'       => ['nullable', 'max:2048'], 
            'conference' => [
                'nullable', 
                'in:east,west,north,south',
                Rule::requiredIf($request->league_id == $nbaLeague?->id),
            ],
        ], [
            'conference.required' => 'The NBA requires a conference selection (East or West).',
            'club_name.unique'    => 'This club name is already registered in the selected league.',
            'short_name.unique'   => 'This short name is already registered in the selected league.',
            'monicker.unique'     => 'This monicker is already registered in the selected league.',
        ]);

        $validated['slug'] = Str::slug($validated['club_name'] . $validated['monicker']);

        $team = new Team($validated);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            
            // Generate name: shortname_timestamp.extension
            $filename = Str::slug($request->short_name) . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            $path = $file->storeAs('teams/logos', $filename, 'public');
            $team->logo = $path;
        } elseif (is_string($request->logo)) {
            $team->logo = $request->logo;
        }

        $team->save();

        return to_route('admin.teams')->with('success', 'Team created!');
    }

    public function update(Request $request, Team $team)
    {   
        $nbaLeague = League::where('short_name', 'NBA')->first();

        $validated = $request->validate([
            'club_name'  => [
                'required', 'string', 'max:255',
                Rule::unique('teams', 'club_name')->where('league_id', $request->league_id)->ignore($team->id)
            ],
            'short_name' => [
                'required', 'string', 'max:4',
                Rule::unique('teams', 'short_name')->where('league_id', $request->league_id)->ignore($team->id)
            ],
            'monicker'   => [
                'required', 'string', 'max:255',
                Rule::unique('teams', 'monicker')->where('league_id', $request->league_id)->ignore($team->id)
            ],
            'league_id'  => ['nullable', 'exists:leagues,id'],
            'logo'       => ['nullable'], 
            'conference' => [
                'nullable', 
                'in:east,west,north,south',
                Rule::requiredIf($request->league_id == $nbaLeague?->id),
            ],
        ], [
            'conference.required' => 'The NBA requires a conference selection (East or West).',
            'club_name.unique'    => 'This club name is already registered in the selected league.',
            'short_name.unique'   => 'This short name is already registered in the selected league.',
            'monicker.unique'     => 'This monicker is already registered in the selected league.',
        ]);

        // 1. Generate the slug
        $validated['slug'] = Str::slug($validated['club_name'] . ' ' . $validated['monicker']);

        // 2. Clear conference if league is removed
        if (!$request->filled('league_id')) {
            $validated['conference'] = null;
        }

        // 3. Fix Temp Path: Remove 'logo' from $validated so it doesn't overwrite your manual path
        unset($validated['logo']);

        // 4. Handle File Logic
        if ($request->hasFile('logo')) {
            if ($team->logo && Storage::disk('public')->exists($team->logo)) {
                Storage::disk('public')->delete($team->logo);
            }

            $file = $request->file('logo');
            $filename = Str::slug($request->short_name) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('teams/logos', $filename, 'public');
            
            $team->logo = $path; 

        } elseif ($request->filled('logo') && is_string($request->logo)) {
            if ($team->logo && Storage::disk('public')->exists($team->logo)) {
                Storage::disk('public')->delete($team->logo);
            }
            $team->logo = $request->logo;

        } elseif (!$request->filled('logo')) {
            if ($team->logo && Storage::disk('public')->exists($team->logo)) {
                Storage::disk('public')->delete($team->logo);
            }
            $team->logo = null;
        }

        // 5. Apply changes and save
        $team->fill($validated);
        $team->save(); 

        return to_route('admin.teams.show', $team->id)->with('success', 'Team updated successfully!');
    }
    public function destroy (Team $team) 
    {
        //..
        $team->delete();
        
        return to_route('admin.teams')->with('success', 'League deleted!');
    }

}

