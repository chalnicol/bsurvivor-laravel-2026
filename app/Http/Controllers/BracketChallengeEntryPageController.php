<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use Inertia\Inertia;

use App\Models\BracketChallenge;
use App\Models\BracketChallengeEntry;

use App\Http\Resources\BracketChallengeResource;
use App\Http\Resources\BracketChallengeEntryResource;
use Illuminate\Support\Facades\DB;

use Inertia\Response; 


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

    public function show(string $slug): Response
    {
        $bracketChallenge = BracketChallenge::with(['league', 'matches.teams'])
            ->where('slug', $slug)
            ->firstOrFail();

        $userEntry = null;

        if (auth()->check()) {
            $userEntry = $bracketChallenge->entries()
                ->where('user_id', auth()->id())
                ->first(['slug']); // We only need the slug for the link
        }

        return Inertia::render('challenges/show', [
            'challenge'  => new BracketChallengeResource($bracketChallenge),
            'userEntry'  => $userEntry ? ['slug' => $userEntry->slug] : null,
            'canSubmit'  => ! $userEntry && $bracketChallenge->isAcceptingSubmissions(),
        ]);
    }

    public function submitEntry(Request $request, BracketChallenge $bracketChallenge)
    {

        // 1. Check if the challenge is active
        if (!$bracketChallenge->isAcceptingSubmissions()) {
            return back()->with('error', 'Submissions are closed.');
        }

        // 2. Check for ANY entry, including Soft Deleted ones
        // Use withTrashed() to ensure we don't hit the unique constraint
        $existing = $bracketChallenge->entries()
            ->withTrashed() 
            ->where('user_id', auth()->id())
            ->exists();

        if ($existing) {
            return back()->with('error', 'You already have an entry for this challenge.');
        }

        // 2. Validation
        $validated = $request->validate([
            'entry_data' => 'required|array',
            'entry_data.*.match_id' => 'required|exists:matches,id',
            'entry_data.*.predicted_winner_team_id' => 'required|exists:teams,id',
        ]);

        // Match count check
        if (count($validated['entry_data']) !== $bracketChallenge->matches()->count()) {
            return back()->with('error', 'Your bracket is incomplete.');
        }

        try {
            $entry = DB::transaction(function () use ($bracketChallenge, $validated) {
                $user = auth()->user();
        
                // 1. Generate the custom Name format: BC[ID]-ENTRY-[TIMESTAMP]-USER[USERNAME]
                // Example: BC12-ENTRY-1711753819-USERcharlou
                $timestamp = now()->getTimestamp();
                $safeUsername = Str::slug($user->username);
                $paddedId = Str::padLeft($bracketChallenge->id, 5, '0');
                // $entryName = "BC{$bracketChallenge->id}-ENTRY-{$safeUsername}-{$timestamp}";
                $entryName = "BCE-{$bracketChallenge->league->short_name}-{$paddedId}-{$timestamp}";
                // 2. Generate a unique Slug (URL friendly version of the name)
                $uniqueSlug = Str::slug($entryName);

                // 4. Create Entry
                $newEntry = $bracketChallenge->entries()->create([
                    'user_id' => auth()->id(),
                    'name'    => $entryName,
                    'slug'    => $uniqueSlug,
                    'status'  => 'active',
                    'correct_predictions_count' => 0,
                ]);

                // 5. Create Predictions
                $predictions = collect($validated['entry_data'])->map(function ($p) use ($newEntry) {
                    return [
                        'bracket_challenge_entry_id' => $newEntry->id,
                        'match_id'             => $p['match_id'],
                        'predicted_winner_team_id'  => $p['predicted_winner_team_id'],
                        'status'                    => 'pending',
                        'created_at'                => now(),
                        'updated_at'                => now(),
                    ];
                })->toArray();

                DB::table('predictions')->insert($predictions);

                return $newEntry;
            });

            return to_route('bracket-challenges.show', $bracketChallenge->slug)
                ->with('success', 'Bracket submitted successfully!');

        } catch (\Exception $e) {
            // dd($e->getMessage(), $e->getTraceAsString());
            \Log::error("Entry failed: " . $e->getMessage());
            return back()->with('error', 'Failed to save entry. Please try again.');
        }
    }

  
}
