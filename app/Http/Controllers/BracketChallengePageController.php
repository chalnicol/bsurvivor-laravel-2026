<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\BracketChallenge;
use App\Http\Resources\BracketChallengeResource;

class BracketChallengePageController extends Controller
{
    //
   

    public function index(Request $request)
    {   
        $query = BracketChallenge::with('league')
            ->where('is_public', true)
            ->where('status', '!=', 'draft');
            
        if ($request->filled('search')) {
            $searchTerm = '%' . strtolower(trim($request->input('search'))) . '%';

            $query->where(function ($q) use ($searchTerm) {
                // 1. Search by Name
                $q->whereRaw('LOWER(name) LIKE ?', [$searchTerm]);

                // 2. Search Dates (SQLite/MySQL compatible string search)
                $q->orWhere('submission_start', 'LIKE', $searchTerm)
                ->orWhere('submission_end', 'LIKE', $searchTerm);

                // 3. Search League Name or Abbr
                $q->orWhereHas('league', function ($leagueQuery) use ($searchTerm) {
                    $leagueQuery->whereRaw('LOWER(name) LIKE ?', [$searchTerm])
                                ->orWhereRaw('LOWER(short_name) LIKE ?', [$searchTerm]);
                });
            });
        }

        // Use withQueryString() so pagination links maintain your search filter
        $bracketChallenges = $query->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('challenges/index', [
            'bracketChallenges' => BracketChallengeResource::collection($bracketChallenges),
            'filters' => $request->only(['search'])
        ]);
    }

    public function show(string $slug) 
    {
        $bracketChallenge = BracketChallenge::with(['league', 'matches.teams'])->where('slug', $slug)->firstOrFail();

        return Inertia::render('challenges/show', [
            'challenge' => new BracketChallengeResource($bracketChallenge)
        ]);
    }
}
