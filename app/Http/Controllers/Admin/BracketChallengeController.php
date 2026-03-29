<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBracketChallengeRequest;
use App\Http\Requests\Admin\UpdateBracketChallengeRequest;
use App\Http\Requests\Admin\DeclareWinnerRequest;
use App\Http\Resources\BracketChallengeResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\LeagueResource;
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
        private readonly BracketGenerator $bracketGenerator,
    ) {}

    // -------------------------------------------------------------------------
    // index
    // -------------------------------------------------------------------------

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

        return Inertia::render('admin/bracket-challenges/index', [
            'challenges' => BracketChallengeResource::collection($challenges),
            'filters'    => $request->only(['search']),
        ]);
    }

    // -------------------------------------------------------------------------
    // trashed
    // -------------------------------------------------------------------------

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

        return Inertia::render('admin/bracket-challenges/trashed', [
            'challenges' => BracketChallengeResource::collection($challenges),
            'filters'    => $request->only(['search']),
        ]);
    }

    // -------------------------------------------------------------------------
    // create
    // -------------------------------------------------------------------------

    public function create(): Response
    {
        return Inertia::render('admin/bracket-challenges/create', [
            'leagues' => LeagueResource::minimal(League::orderBy('name')->get()),
        ]);
    }

    // -------------------------------------------------------------------------
    // store
    // -------------------------------------------------------------------------

    public function store(StoreBracketChallengeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $seedData  = $validated['seed_data'];
        $data      = collect($validated)->except('seed_data')->toArray();

        $teamCount = $this->resolveTeamCount($seedData);

        $data['status']       = 'draft';
        $data['team_count']   = $teamCount;
        $data['total_rounds'] = BracketGenerator::calculateRounds($teamCount);
        $data['is_public']    = $data['is_public'] ?? false;
        $data['seed_data']    = $seedData;

        DB::transaction(function () use ($data, $seedData) {
            $challenge = BracketChallenge::create($data);
            $this->bracketGenerator->generate($challenge, $seedData);
        });

        return to_route('admin.bracket-challenges')
            ->with('success', 'Bracket challenge created successfully.');
    }

    // -------------------------------------------------------------------------
    // show
    // -------------------------------------------------------------------------

    public function show(BracketChallenge $bracketChallenge): Response
    {
        $bracketChallenge->load([
            'league',
            'matches' => fn ($q) => $q->with('teams')
                ->orderBy('round_index')
                ->orderBy('match_index'),
            'entries' => fn ($q) => $q->with('user')
                ->orderByDesc('correct_predictions_count'),
        ]);

        return Inertia::render('admin/bracket-challenges/show', [
            'challenge'    => new BracketChallengeResource($bracketChallenge),
            // 'totalEntries' => $bracketChallenge->entries()->count(),
        ]);
    }

    // -------------------------------------------------------------------------
    // edit
    // -------------------------------------------------------------------------

    public function edit(BracketChallenge $bracketChallenge): RedirectResponse|Response
    {
        if (! $bracketChallenge->isDraft()) {
            return to_route('admin.bracket-challenges.show', $bracketChallenge)
                ->with('error', 'Only draft challenges can be edited.');
        }

        return Inertia::render('admin/bracket-challenges/edit', [
            'challenge' => new BracketChallengeResource($bracketChallenge->load('league')),
            'leagues'   => LeagueResource::minimal(League::orderBy('name')->get()),
        ]);
    }

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------

    public function update(
        UpdateBracketChallengeRequest $request,
        BracketChallenge $bracketChallenge,
    ): RedirectResponse {
        if (! $bracketChallenge->isDraft()) {
            return back()->with('error', 'Only draft challenges can be edited.');
        }

        $validated = $request->validated();
        $seedData  = $validated['seed_data'] ?? null;
        $data      = collect($validated)->except('seed_data')->toArray();

        DB::transaction(function () use ($bracketChallenge, $data, $seedData) {
            // 1. Update the basic metadata
            $bracketChallenge->update($data);

            // 2. Only proceed if seed_data was actually provided in the request
            if ($seedData) {
                // Update the JSON column first
                $bracketChallenge->update(['seed_data' => $seedData]);

                // 3. Force a re-sync of matches
                // We use regenerate() to update teams on existing first-round matches
                $this->bracketGenerator->regenerate($bracketChallenge, $seedData);
            }
        });

        return to_route('admin.bracket-challenges.show', $bracketChallenge)
            ->with('success', 'Bracket challenge and team seedings updated.');
    }

    // -------------------------------------------------------------------------
    // destroy — soft-delete, draft only
    // -------------------------------------------------------------------------

    public function destroy(BracketChallenge $bracketChallenge): RedirectResponse
    {
        if (! $bracketChallenge->isDraft()) {
            return back()->with('error', 'Only draft challenges can be deleted.');
        }

        $bracketChallenge->delete();

        return to_route('admin.bracket-challenges')
            ->with('success', 'Bracket challenge deleted.');
    }

    // -------------------------------------------------------------------------
    // restore
    // -------------------------------------------------------------------------

    public function restore(string $id): RedirectResponse
    {
        $bracketChallenge = BracketChallenge::onlyTrashed()->findOrFail($id);
        $bracketChallenge->restore();

        return to_route('admin.bracket-challenges.show', $bracketChallenge)
            ->with('success', 'Bracket challenge restored.');
    }

    // -------------------------------------------------------------------------
    // forceDelete
    // -------------------------------------------------------------------------

    public function forceDelete(string $id): RedirectResponse
    {
        $bracketChallenge = BracketChallenge::onlyTrashed()->findOrFail($id);
        $bracketChallenge->forceDelete();

        return to_route('admin.bracket-challenges.trashed')
            ->with('success', 'Bracket challenge permanently deleted.');
    }

    public function togglePublic(BracketChallenge $bracketChallenge): RedirectResponse
    {
        $bracketChallenge->update(['is_public' => !$bracketChallenge->is_public]);

        $newStatus = $bracketChallenge->is_public ? 'public' : 'private';

        return back()
            ->with('success', 'Bracket challenge is now '. $newStatus .'!');
    }

    // -------------------------------------------------------------------------
    // publish — draft → published (one way, no reverting)
    // -------------------------------------------------------------------------

    public function publish(BracketChallenge $bracketChallenge): RedirectResponse
    {
        if (! $bracketChallenge->isDraft()) {
            return back()->with('error', 'Only draft challenges can be published.');
        }

        if (! $bracketChallenge->matches()->exists()) {
            return back()->with('error', 'Bracket must be generated before publishing.');
        }

        $bracketChallenge->update(['status' => 'published']);

        return to_route('admin.bracket-challenges.show', $bracketChallenge)
            ->with('success', 'Bracket challenge is now published.');
    }

    // -------------------------------------------------------------------------
    // declareWinner
    // -------------------------------------------------------------------------

    public function declareWinner(
        DeclareWinnerRequest $request,
        BracketChallenge $bracketChallenge,
        GameMatch $match,
    ): RedirectResponse {
        if ($bracketChallenge->isCompleted()) {
            return back()->with('error', 'This challenge is already completed.');
        }

        if (! $bracketChallenge->isPublished()) {
            return back()->with('error', 'Challenge must be published before declaring winners.');
        }

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

    // -------------------------------------------------------------------------
    // resetMatch
    // -------------------------------------------------------------------------

    public function resetMatch(
        BracketChallenge $bracketChallenge,
        GameMatch $match,
    ): RedirectResponse {
        if ($bracketChallenge->isCompleted()) {
            return back()->with('error', 'Cannot reset a match on a completed challenge.');
        }

        if (! $bracketChallenge->isPublished()) {
            return back()->with('error', 'Challenge must be published to reset matches.');
        }

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
        });

        return back()->with('success', 'Match result has been reset.');
    }

    // -------------------------------------------------------------------------
    // getTeams — lightweight endpoint for form team loading
    // -------------------------------------------------------------------------

    public function getTeams(Request $request): JsonResponse
    {
        $league = $request->query('league');

        $teams = Team::whereHas('league', fn ($q) => $q->where('short_name', $league))
            ->with('league:id,name,short_name')
            ->orderBy('club_name')
            ->get();

        return response()->json([
            'teams' => TeamResource::collection($teams),
        ]);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function resolveTeamCount(array $seedData): int
    {
        $league = $seedData['league'];
        $teams  = $seedData['teams'];

        if ($league === 'pba') {
            return count($teams);
        }

        return array_sum(array_map('count', $teams));
    }
}