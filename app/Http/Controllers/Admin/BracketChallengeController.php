<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBracketChallengeRequest;
use App\Http\Requests\Admin\UpdateBracketChallengeRequest;
use App\Http\Requests\Admin\DeclareWinnerRequest;
use App\Http\Resources\BracketChallengeResource;
use App\Http\Resources\LeagueResource;
use App\Http\Resources\TeamResource;

use App\Models\BracketChallenge;
use App\Models\GameMatch;
use App\Models\League;
use App\Models\Team;

use App\Services\BracketGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BracketChallengeController extends Controller
{
    public function __construct(
        private readonly BracketGenerator $bracketGenerator
    ) {}

    public function index(Request $request): Response
    {
        $challenges = BracketChallenge::query()
            ->with('league')
            ->withCount('entries')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%")
                      ->orWhere('status', 'like', "%{$search}%")
                      ->orWhereHas('league', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('short_name', 'like', "%{$search}%");
                      });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/challenges/index', [
            'challenges' => BracketChallengeResource::collection($challenges),
            'filters'    => $request->only(['search']),
        ]);
    }

    public function trashed(Request $request): Response
    {
        $challenges = BracketChallenge::onlyTrashed()
            ->with('league')
            ->withCount('entries')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%")
                      ->orWhereHas('league', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('short_name', 'like', "%{$search}%");
                      });
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/BracketChallenges/Trashed', [
            'challenges' => BracketChallengeResource::collection($challenges),
            'filters'    => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        $leagues = League::all();

        return Inertia::render('admin/challenges/create', [
            'leagues'    => LeagueResource::collection($leagues),
            'teamCounts' => [8, 16],
        ]);
    }

    public function store(StoreBracketChallengeRequest $request): RedirectResponse
    {
        
        $validated = $request->validated();
        $seedData  = $validated['seed_data'];
        $data      = collect($validated)->except('seed_data')->toArray();

        // Derive team_count and total_rounds from seed_data
        $teamCount = $this->resolveTeamCount($seedData);

        $data['status']       = 'draft';
        $data['team_count']   = $teamCount;
        $data['total_rounds'] = BracketGenerator::calculateRounds($teamCount);
        $data['is_public']    = $data['is_public'] ?? false;

        DB::transaction(function () use ($data, $seedData) {
            $challenge = BracketChallenge::create([
                ...$data,
                'seed_data' => $seedData,
            ]);
            $this->bracketGenerator->generate($challenge, $seedData);
        });

        return to_route('admin.bracket-challenges')
            ->with('success', 'Bracket challenge created successfully.');
    }

    public function show(BracketChallenge $bracketChallenge): Response
    {
        $bracketChallenge
            ->loadCount('entries')
            ->load([
                'league',
                'matches' => fn ($q) => $q->with('teams')->orderBy('round_index')->orderBy('match_index'),
                'entries' => fn ($q) => $q->with('user')->orderByDesc('correct_predictions_count'),
            ]);

        return Inertia::render('admin/challenges/show', [
            'challenge'    => new BracketChallengeResource($bracketChallenge),
            'totalEntries' => $bracketChallenge->entries()->count(),
        ]);
    }

    public function edit(BracketChallenge $bracketChallenge): Response
    {
        $leagues = League::all();

        return Inertia::render('admin/challenges/edit', [
            'challenge' => new BracketChallengeResource($bracketChallenge->load('league')),
            'leagues'    => LeagueResource::collection($leagues),
        ]);
    }

    public function update(UpdateBracketChallengeRequest $request, BracketChallenge $bracketChallenge): RedirectResponse
    {
        $bracketChallenge->update($request->validated());

        return redirect()
            ->route('admin.bracket-challenges.show', $bracketChallenge)
            ->with('success', 'Bracket challenge updated successfully.');
    }

    public function destroy(BracketChallenge $bracketChallenge): RedirectResponse
    {
        if ($bracketChallenge->isOpen() || $bracketChallenge->isCompleted()) {
            return back()->with(['error' => 'Cannot delete an open or completed challenge.']);
        }

        $bracketChallenge->delete();

        return redirect()
            ->route('admin.bracket-challenges')
            ->with('success', 'Bracket challenge deleted.');
    }

    public function togglePublic (BracketChallenge $bracketChallenge): RedirectResponse
    {
        
        $bracketChallenge->is_public = !$bracketChallenge->is_public;
        $bracketChallenge->save();

        return back()->with('success', 'Challenge public status has been changed.');
    }

    public function updateStatus(Request $request, BracketChallenge $bracketChallenge): RedirectResponse
    {
        // 1. Define the "Forward-Only" hierarchy
        $statusRanks = [
            'draft'     => 1,
            'open'      => 2,
            'closed'    => 3,
            'completed' => 4,
        ];

        if (!$bracketChallenge) {
            return back()->withErrors(['error' => 'Challenge not found.']);
        }

        $newStatus = $request->input('status');
        $currentStatus = $bracketChallenge->status ?: 'draft'; // Default to draft if empty

        // 3. Validation Logic
        if (!isset($statusRanks[$newStatus])) {
            return back()->withErrors(['status' => 'Invalid status selected.']);
        }

        // 4. Comparison: Check if the new rank is less than the current rank
        if ($statusRanks[$newStatus] < $statusRanks[$currentStatus]) {
            return back()->withErrors([
                'status' => "Cannot move backward from '{$currentStatus}' to '{$newStatus}'."
            ]);
        }

        $bracketChallenge->update(['status' => $newStatus]);

        return back()->with('success', "Status updated to {$newStatus}.");
    }



    //...
    public function getTeams (Request $request): JsonResponse  
    {
        $query = Team::with('league');

        if ($request->has('league')) {
            $query->whereHas('league', function($q) use ($request) {
                $q->where('short_name', $request->league);
            });
        }

        return response()->json([
            'teams' => TeamResource::collection($query->get()),
        ]);
    }

    
    /**
     * Derive total team count from seed_data.
     */
    private function resolveTeamCount(array $seedData): int
    {
        $league = $seedData['league'];
        $teams  = $seedData['teams'];

        if ($league === 'pba') {
            return count($teams);
        }

        // Conference leagues — sum all conferences
        return array_sum(array_map('count', $teams));
    }


    public function restore(string $id): RedirectResponse
    {
        $bracketChallenge = BracketChallenge::onlyTrashed()->findOrFail($id);
        $bracketChallenge->restore();

        return redirect()
            ->route('admin.bracket-challenges.show', $bracketChallenge)
            ->with('success', 'Bracket challenge restored.');
    }

    public function forceDelete(string $id): RedirectResponse
    {
        $bracketChallenge = BracketChallenge::onlyTrashed()->findOrFail($id);
        $bracketChallenge->forceDelete();

        return redirect()
            ->route('admin.bracket-challenges.trashed')
            ->with('success', 'Bracket challenge permanently deleted.');
    }

    public function publishChallenge(BracketChallenge $bracketChallenge): RedirectResponse
    {
        if (! $bracketChallenge->isDraft()) {
            return back()->with('error', 'Only draft challenges can be published.');
        }

        if (! $bracketChallenge->matches()->exists()) {
            return back()->with('error', 'Generate the bracket before publishing.');
        }

        $bracketChallenge->update(['status' => 'open']);

        return redirect()
            ->route('admin.bracket-challenges.show', $bracketChallenge)
            ->with('success', 'Bracket challenge is now live.');
    }

    public function declareWinner(
        DeclareWinnerRequest $request,
        BracketChallenge $bracketChallenge,
        GameMatch $match
    ): RedirectResponse {
        if ($match->bracket_challenge_id !== $bracketChallenge->id) {
            abort(404);
        }

        if ($match->isDecided()) {
            return back()->with('error', 'Winner has already been declared for this match.');
        }

        if (! $match->isReady()) {
            return back()->with('error', 'Match does not have both teams yet.');
        }

        $team = Team::findOrFail($request->validated('winner_team_id'));

        $match->declareWinner($team);

        return back()->with('success', "Winner declared: {$team->club_name}.");
    }

    public function resetMatch(
        BracketChallenge $bracketChallenge,
        GameMatch $match
    ): RedirectResponse {
        if ($match->bracket_challenge_id !== $bracketChallenge->id) {
            abort(404);
        }

        if (! $match->isDecided()) {
            return back()->with('error', 'This match has no result to reset.');
        }

        $nextMatch = $match->nextMatch;
        if ($nextMatch && $nextMatch->isDecided()) {
            return back()->with('error', 'Cannot reset — a later match has already been decided. Reset that first.');
        }

        DB::transaction(function () use ($match) {
            $previousWinnerId = $match->winner_team_id;

            $match->update(['winner_team_id' => null]);

            $match->predictions()->update(['status' => 'void']);

            $match->predictions()->with('entry')->get()
                  ->each(fn ($p) => $p->entry->recalculateScore());

            if ($match->next_match_id && $previousWinnerId) {
                $match->nextMatch->teams()->detach($previousWinnerId);
            }

            if ($match->isFinal()) {
                $match->bracketChallenge?->update(['status' => 'closed']);
            }
        });

        return back()->with('success', 'Match result has been reset.');
    }
}