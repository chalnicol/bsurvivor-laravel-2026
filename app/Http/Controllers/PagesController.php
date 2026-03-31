<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\BracketChallenge;
use App\Http\Resources\BracketChallengeResource;

use App\Models\BracketChallengeEntry;
use App\Http\Resources\BracketChallengeEntryResource;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;


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

    public function showEntry(string $slug):Response
    {

        $isUserEntry = false;

        $entry = BracketChallengeEntry::with(['bracketChallenge.league', 'bracketChallenge.matches.teams',   'user', 'predictions'])
            ->where('slug', $slug)
            ->firstOrFail();

        if ( Auth::check()) {
            if ( $entry->user->id === Auth::id()) {
                $isUserEntry = true;
            }
        }

        return Inertia::render('entry', [
            'entry' => new BracketChallengeEntryResource($entry),
            'isUserEntry' => $isUserEntry,
        ]);

    }

}
