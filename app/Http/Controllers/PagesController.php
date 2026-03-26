<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\BracketChallenge;
use App\Http\Resources\BracketChallengeResource;

class PagesController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('home');
    }

    public function terms()
    {
        return Inertia::render('terms-of-service');
    }

    public function policy()
    {
        return Inertia::render('privacy-policy');
    }

    public function about()
    {
        return Inertia::render('about');
    }

    public function getBracketChallenges(Request $request)
    {   
        $query = BracketChallenge::with('league')
            ->where('is_public', true);
            
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
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('bracketChallenges/index', [
            'bracketChallenges' => BracketChallengeResource::collection($bracketChallenges),
            'filters' => $request->only(['search'])
        ]);
    }

    // public function test(Request $request)
    // {
    //     return Inertia::render('user/profile/friends');
    // }
}
