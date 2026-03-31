<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\UserResource;
use App\Http\Resources\BracketChallengeEntryResource;

use App\Models\User; 

class ProfilePageController extends Controller
{
    public function index (Request $request): Response
    {
        $user = $request->user();
        // $user->load('addresses');
        return Inertia::render('user/profile/settings', [
            'user' => new UserResource($user),
        ]);
    }
    
    public function getFriends(Request $request)
    {
        $user = Auth::user();

        // 1. Eager load all friendship relationships in one database query
        $user->load([
            'friendsOfMine', 
            'friendOf', 
            'friendRequestsSent', 
            'friendRequestsReceived'
        ]);

        // 2. Merge the two "accepted" sides into one unified collection
        $activeFriends = $user->friendsOfMine->merge($user->friendOf);

        // 3. Return to Inertia
        return Inertia::render('user/profile/friends', [
            // Using UserResource for consistent data (e.g., full_name, avatar)
            'active_friends'    => UserResource::minimal($activeFriends),
            'requests_received' => UserResource::minimal($user->friendRequestsReceived),
            'requests_sent'     => UserResource::minimal($user->friendRequestsSent),

            // Counts for your UI badges/labels
            'counts' => [
                'active'   => $activeFriends->count(),
                'received' => $user->friendRequestsReceived->count(),
                'sent'     => $user->friendRequestsSent->count(),
            ]
        ]);
    }

    public function friendsAction(Request $request) 
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'action'  => 'required|in:add,remove,accept,cancel,ignore',
        ]);

        $currentUser = Auth::user();
        $targetUser = User::findOrFail($request->user_id);
        $action = $request->action;

        // SEND REQUEST
        if ($action === 'add') {
            if ($currentUser->id === $targetUser->id) return back();
            if ($currentUser->hasAnyFriendshipWith($targetUser)) return back();

            $currentUser->friendRequestsSent()->attach($targetUser->id, ['status' => 'pending']);
            // $targetUser->notify(new FriendRequestSentNotification($currentUser));
        }

        // ACCEPT REQUEST
        else if ($action === 'accept') {
            // We update the row where THEY are the user_id and WE are the friend_id
            $currentUser->friendRequestsReceived()->updateExistingPivot($targetUser->id, [
                'status' => 'accepted'
            ]);
        }

        // DELETE RELATIONSHIP (Remove Friend, Cancel Sent, or Reject Received)
        else if (in_array($action, ['remove', 'cancel', 'ignore'])) {
            // Detach both directions to ensure the row is deleted regardless of who started it
            $currentUser->friendsOfMine()->detach($targetUser->id);
            $currentUser->friendOf()->detach($targetUser->id);
            $currentUser->friendRequestsSent()->detach($targetUser->id);
            $currentUser->friendRequestsReceived()->detach($targetUser->id);
        }

        return back()->with('message', 'Friendship updated successfully.');
    }

    public function searchUsers(Request $request) 
    {
        $searchTerm = $request->input('search', "");
        if (empty($searchTerm)) return response()->json(['users' => []]);

        $currentUser = Auth::user();

        // 1. Get all IDs of people involved with the current user
        $friendIds = $currentUser->friendsOfMine()->pluck('friend_id')
            ->merge($currentUser->friendOf()->pluck('user_id'))->toArray();
            
        $sentIds = $currentUser->friendRequestsSent()->pluck('friend_id')->toArray();
        $receivedIds = $currentUser->friendRequestsReceived()->pluck('user_id')->toArray();

        // 2. Simple search on the User model
        $users = User::where('id', '!=', $currentUser->id)
            ->where(function ($q) use ($searchTerm) {
                $q->where('username', 'like', "%{$searchTerm}%")
                ->orWhere('full_name', 'like', "%{$searchTerm}%");
            })
            ->limit(10)
            ->get();

        // 3. Map the status manually based on the IDs we fetched
        $mappedUsers = $users->map(function ($user) use ($friendIds, $sentIds, $receivedIds) {
            $status = 'not_friends';

            if (in_array($user->id, $friendIds)) {
                $status = 'friends';
            } elseif (in_array($user->id, $sentIds)) {
                $status = 'request_sent';
            } elseif (in_array($user->id, $receivedIds)) {
                $status = 'request_received';
            }

            return [
                'id' => $user->id,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'status' => $status,
            ];
        });

        return response()->json(['users' => $mappedUsers]);
    }

    public function getEntries(Request $request)
    {
        $user = Auth::user();
        $query = $user->entries()->with(['bracketChallenge.league']);

        if ($request->filled('search')) {
            $searchTerm = '%' . strtolower(trim($request->input('search'))) . '%';

            $query->where(function ($q) use ($searchTerm) {
                // 1. Basic Fields
                $q->whereRaw('LOWER(name) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(status) LIKE ?', [$searchTerm]);

                // 2. Date Search (SQLite & MySQL compatible way)
                // Instead of MONTHNAME, we search the raw created_at string 
                // which usually contains "YYYY-MM-DD"
                $q->orWhere('created_at', 'LIKE', $searchTerm);

                // 3. Search Bracket Challenge Name
                $q->orWhereHas('bracketChallenge', function ($challengeQuery) use ($searchTerm) {
                    $challengeQuery->whereRaw('LOWER(name) LIKE ?', [$searchTerm]);
                });

                // 4. Search League Name or Abbr
                $q->orWhereHas('bracketChallenge.league', function ($leagueQuery) use ($searchTerm) {
                    $leagueQuery->whereRaw('LOWER(name) LIKE ?', [$searchTerm])
                                ->orWhereRaw('LOWER(short_name) LIKE ?', [$searchTerm]);
                });
            });
        }

        $entries = $query->orderBy('created_at', 'desc')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('user/profile/entries', [
            'entries' => BracketChallengeEntryResource::collection($entries),
            'filters' => $request->only(['search']),
        ]);
    }

}