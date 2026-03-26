<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\League;
use App\Http\Resources\LeagueResource;


use Inertia\Inertia;


class LeagueController extends Controller
{
    //
    public function index(Request $request)
    {
        $leagues = League::query()
            // ->with(['league'])
            ->withCount(['teams'])
            // Use 'where' inside a closure if you plan to search multiple columns later
            ->when($request->search, function ($query, $search) {
                // Grouping the OR conditions inside a nested closure
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('short_name', 'like', "%{$search}%");
                        // ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            // ->orderBy('updated_at', 'desc')
            // ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/leagues/index', [
            'leagues' => LeagueResource::collection($leagues),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show (League $league) 
    {
        return Inertia::render('admin/leagues/show', [
             'league' => new LeagueResource($league)
             ->load(['teams'])
             ->loadCount(['bracketChallenges'])
        ]);
    }

    public function create () 
    {
        return Inertia::render('admin/leagues/create');
    }

    public function edit (League $league) 
    {
        return Inertia::render('admin/leagues/edit', [
             'league' => new LeagueResource($league)
        ]);
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'name'  => [
                'required', 'string', 'max:255', 
            ],
            'short_name' => [
                'required', 'string', 'max:4', 
            ]
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $league = new League($validated);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            
            // Generate name: shortname_timestamp.extension
            $filename = Str::slug($request->short_name) . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            $path = $file->storeAs('teams/logos', $filename, 'public');
            $league->logo = $path;
        } elseif (is_string($request->logo)) {
            $league->logo = $request->logo;
        }

        $league->save();

        return to_route('admin.leagues')->with('success', 'League created!');
    }

    public function update(Request $request, League $league)
    {   

        $validated = $request->validate([
            'name'  => [
                'required', 'string', 'max:255', 
                Rule::unique('leagues')->ignore($league->id),
            ],
            'short_name' => [
                'required', 'string', 'max:4',
            ],
           
        ]);

        // 1. Generate the slug
        $validated['slug'] = Str::slug($validated['name']);

        // 3. Fix Temp Path: Remove 'logo' from $validated so it doesn't overwrite your manual path
        unset($validated['logo']);

        // 4. Handle File Logic
        if ($request->hasFile('logo')) {
            if ($league->logo && Storage::disk('public')->exists($league->logo)) {
                Storage::disk('public')->delete($league->logo);
            }

            $file = $request->file('logo');
            $filename = Str::slug($request->short_name) . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('leagues/logos', $filename, 'public');
            
            $league->logo = $path; 

        } elseif ($request->filled('logo') && is_string($request->logo)) {
            if ($league->logo && Storage::disk('public')->exists($league->logo)) {
                Storage::disk('public')->delete($league->logo);
            }
            $league->logo = $request->logo;

        } elseif (!$request->filled('logo')) {
            if ($league->logo && Storage::disk('public')->exists($league->logo)) {
                Storage::disk('public')->delete($league->logo);
            }
            $league->logo = null;
        }

        // 5. Apply changes and save
        $league->fill($validated);
        $league->save(); 

        return to_route('admin.leagues.show', $league->id)->with('success', 'League updated successfully!');
    }

    public function destroy (League $league) 
    {
        //..
        $league->delete();
        
        return to_route('admin.leagues')->with('success', 'League deleted!');
    }



}
