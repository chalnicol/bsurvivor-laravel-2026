<?php

namespace App\Http\Controllers;

use App\Http\Resources\BracketChallengeResource;
use App\Models\BracketChallenge;
use App\Models\BracketChallengeEntry;
use App\Models\BracketPrediction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BracketChallengeEntryController extends Controller
{
    /**
     * Show the entry form (The Bracket UI for the user)
     */
    public function show(BracketChallenge $bracketChallenge, ?BracketChallengeEntry $entry = null): Response
    {
        // If no entry ID provided, check if user already has one
        if (!$entry) {
            $entry = $bracketChallenge->entries()
                ->where('user_id', auth()->id())
                ->first();
        }

        // Load the challenge with matches and the user's existing predictions
        $bracketChallenge->load([
            'league',
            'matches.teams',
            'matches.predictions' => fn($q) => $q->where('bracket_challenge_entry_id', $entry?->id)
        ]);

        return Inertia::render('bracket-challenges/entry', [
            'challenge' => new BracketChallengeResource($bracketChallenge),
            'entry'     => $entry,
            'isLocked'  => $bracketChallenge->isLocked() || ($entry && !$bracketChallenge->isAcceptingSubmissions()),
        ]);
    }

    /**
     * Initialize a new entry and create empty predictions for all matches
     */
    public function store(Request $request, BracketChallenge $bracketChallenge): RedirectResponse
    {
        if (!$bracketChallenge->isAcceptingSubmissions()) {
            return back()->with('error', 'Submissions are currently closed for this challenge.');
        }

        // Prevent duplicate entries
        $existing = $bracketChallenge->entries()->where('user_id', auth()->id())->first();
        if ($existing) {
            return to_route('bracket-challenges.entry', [$bracketChallenge, $existing]);
        }

        $entry = DB::transaction(function () use ($bracketChallenge) {
            $newEntry = $bracketChallenge->entries()->create([
                'user_id' => auth()->id(),
                'name'    => auth()->user()->name . "'s Bracket",
            ]);

            // Create a "pending" prediction row for every match in this challenge
            $predictions = $bracketChallenge->matches->map(fn($match) => [
                'bracket_challenge_entry_id' => $newEntry->id,
                'game_match_id'             => $match->id,
                'predicted_winner_team_id'  => null,
                'status'                    => 'pending',
                'created_at'                => now(),
                'updated_at'                => now(),
            ])->toArray();

            BracketPrediction::insert($predictions);

            return $newEntry;
        });

        return to_route('bracket-challenges.entry', [$bracketChallenge, $entry])
            ->with('success', 'Bracket initialized! Good luck.');
    }

    /**
     * Update a specific prediction (Called when a user clicks a team)
     */
    public function updatePrediction(Request $request, BracketChallengeEntry $entry): \Illuminate\Http\JsonResponse
    {
        $bracketChallenge = $entry->bracketChallenge;

        if (!$bracketChallenge->isAcceptingSubmissions()) {
            return response()->json(['error' => 'Challenge is locked.'], 403);
        }

        $validated = $request->validate([
            'match_id' => 'required|exists:game_matches,id',
            'team_id'  => 'nullable|exists:teams,id',
        ]);

        $prediction = $entry->predictions()
            ->where('game_match_id', $validated['match_id'])
            ->firstOrFail();

        $prediction->update([
            'predicted_winner_team_id' => $validated['team_id'],
            'status' => 'selected'
        ]);

        return response()->json(['success' => true]);
    }
}