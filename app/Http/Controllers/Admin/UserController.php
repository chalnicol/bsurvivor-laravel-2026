<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Http\Resources\UserResource;

use Illuminate\Support\Facades\Auth;


use Inertia\Inertia;


class UserController extends Controller
{
    //
    public function index(Request $request)
    {
        $users = User::query()
            // ->with(['addresses', 'contacts'])
            // Use 'where' inside a closure if you plan to search multiple columns later
            ->when($request->search, function ($query, $search) {
                // Grouping the OR conditions inside a nested closure
                $query->where(function ($q) use ($search) {
                    $q->where('username', 'like', "%{$search}%")
                        ->orWhere('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            // ->orderBy('updated_at', 'desc')
            // ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show (User $user) 
    {
        return Inertia::render('admin/users/show', [
             'user' => new UserResource($user)
        ]);
    }

    public function toggleBlockStatus(User $user)
    {

        $currentUser = Auth::user();

        if (!$currentUser->hasRole('admin')) {
            return back()->with(['error' => 'Only admins are allowed to update user status.']);
        }

        if ($user->id == $currentUser->id && !$user->is_blocked) {
            return back()->with(['error' => 'You cannot block yourself.']);
        }

        if ($user->hasRole('admin') && !$user->is_blocked) {
            return back()->with(['error' => 'Admin users cannot be blocked.']);
        }

        $user->is_blocked = !$user->is_blocked;
        $user->save();
        // $user->toggleBlockStatus();
        $newStatus = $user->is_blocked ? 'blocked' : 'unblocked';

        return back()->with('success', 'User status has been ' . $newStatus . ' succesfully.');
    }

    public function updateRoles(Request $request, User $user)
    {
        $currentUser = Auth::user();

        // 1. Authorization: Only admins can even touch this
        if (!$currentUser->hasRole('admin')) {
            return back()->withErrors(['error' => 'Only admins are allowed to update user roles.']);
        }

        // 2. Validation: 'present' allows [] (empty array), 'required' does not
        $request->validate([
            'roles' => ['present', 'array'], 
            'roles.*' => ['string', 'in:admin,moderator'],
        ]);

        $newRoles = $request->input('roles', []);

        // 3. THE SELF-DEMOTION CHECK (Crucial)
        // If the admin is editing their own account:
        if ($currentUser->id === $user->id) {
            // They MUST have 'admin' in the new selection, even if everything else is empty
            if (!in_array('admin', $newRoles)) {
                return back()->withErrors(['error' => 'You cannot remove your own administrator privileges. Please keep the admin role checked.']);
            }
        }

        try {
            // 4. Sync Roles: If $newRoles is empty [], syncRoles() will detach all roles
            $user->syncRoles($newRoles);

            return back()->with('success', "Roles updated for {$user->full_name}.");
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Something went wrong while saving roles.']);
        }
    }

}
