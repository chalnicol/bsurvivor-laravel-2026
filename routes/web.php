<?php

use App\Http\Controllers\PagesController;
use App\Http\Controllers\ProfilePageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\LeagueController;
use App\Http\Controllers\Admin\BracketChallengeController;

use Illuminate\Support\Facades\Route;

Route::get('/', [PagesController::class, 'index'])->name('home');
Route::get('/about', [PagesController::class, 'about'])->name('about');
Route::get('/privacy-policy', [PagesController::class, 'policy'])->name('privacy-policy');
Route::get('/terms-of-service', [PagesController::class, 'terms'])->name('terms-of-service');
Route::get('/bracket-challenges', [PagesController::class, 'getBracketChallenges'])->name('bracket-challenges');

// -------------------------------------------------------
// Authenticated User Routes
// -------------------------------------------------------

Route::middleware(['auth', 'verified', 'check.blocked'])->group(function () {

    // ---- Profile ----
    Route::get('/profile', [ProfilePageController::class, 'index'])->name('profile');

    //----- Friends -----
    Route::get('/profile/friends', [ProfilePageController::class, 'getFriends'])->name('profile.friends');
    Route::get('/profile/friends/search', [ProfilePageController::class, 'searchUsers'])->name('profile.friends.search');
    Route::post('/profile/friends', [ProfilePageController::class, 'friendsAction'])->name('profile.friends.action');

    //-----Entries ------
    Route::get('/profile/entries', [ProfilePageController::class, 'getEntries'])->name('profile.entries');
    Route::post('/profile/entries', [ProfilePageController::class, 'storeEntry'])->name('profile.entries.store');
    
    // ---- Notifications ----
    Route::get('/profile/notifications', [NotificationController::class, 'index'])->name('profile.notifications');
    Route::patch('/profile/notifications/{id}/read', [NotificationController::class, 'update'])->name(
        'profile.notifications.update',
    );
    Route::post('/profile/notifications/mark-all-as-read', [NotificationController::class, 'markAllRead'])->name(
        'profile.notifications.markAllRead',
    );
    Route::delete('/profile/notifications/destroy-all', [NotificationController::class, 'destroyAll'])->name(
        'profile.notifications.destroyAll',
    );
    Route::delete('/profile/notifications/{id}', [NotificationController::class, 'destroy'])->name(
        'profile.notifications.destroy',
    );


    // -------------------------------------------------------
    // Admin Routes
    // -------------------------------------------------------
    Route::middleware(['role:admin|moderator'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        //---dashboard---
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        //---users----
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
        Route::patch('/users/{user}/toggle-block-status', [UserController::class, 'toggleBlockStatus'])->name('users.toggle-block-status');
        Route::patch('/users/{user}/update-roles', [UserController::class, 'updateRoles'])->name('users.update-roles');
        
        //---teams-----
        Route::get('/teams', [TeamController::class, 'index'])->name('teams');
        Route::get('/teams/create', [TeamController::class, 'create'])->name('teams.create');
        Route::get('/teams/{team}', [TeamController::class, 'show'])->name('teams.show');
        Route::get('/teams/{team}/edit', [TeamController::class, 'edit'])->name('teams.edit');
        Route::post('/teams', [TeamController::class, 'store'])->name('teams.store');
        Route::put('/teams/{team}', [TeamController::class, 'update'])->name('teams.update');
        Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('teams.destroy');
        
        //---leagues-----
        Route::get('/leagues', [LeagueController::class, 'index'])->name('leagues');
        Route::get('/leagues/create', [LeagueController::class, 'create'])->name('leagues.create');
        Route::get('/leagues/{league}', [LeagueController::class, 'show'])->name('leagues.show');
        Route::get('/leagues/{league}/edit', [LeagueController::class, 'edit'])->name('leagues.edit');
        Route::post('/leagues', [LeagueController::class, 'store'])->name('leagues.store');
        Route::put('/leagues/{league}', [LeagueController::class, 'update'])->name('leagues.update');
        Route::delete('/leagues/{league}', [LeagueController::class, 'destroy'])->name('leagues.destroy');


        //---bracket challenges-----
        Route::get('/bracket-challenges', [BracketChallengeController::class, 'index'])->name('bracket-challenges');
        Route::get('/bracket-challenges/create', [BracketChallengeController::class, 'create'])->name('bracket-challenges.create');
        Route::get('/bracket-challenges/trashed', [BracketChallengeController::class, 'trashed'])->name('bracket-challenges.trashed');
        Route::get('/bracket-challenges/get-teams', [BracketChallengeController::class, 'getTeams'])->name('bracket-challenges.get-teams');
        Route::post('/bracket-challenges', [BracketChallengeController::class, 'store'])->name('bracket-challenges.store');
        Route::get('/bracket-challenges/{bracketChallenge}', [BracketChallengeController::class, 'show'])->name('bracket-challenges.show');
        Route::get('/bracket-challenges/{bracketChallenge}/edit', [BracketChallengeController::class, 'edit'])->name('bracket-challenges.edit');
        Route::put('/bracket-challenges/{bracketChallenge}', [BracketChallengeController::class, 'update'])->name('bracket-challenges.update');
        Route::delete('/bracket-challenges/{bracketChallenge}', [BracketChallengeController::class, 'destroy'])->name('bracket-challenges.destroy');
        Route::patch('/bracket-challenges/{bracketChallenge}/restore', [BracketChallengeController::class, 'restore'])->name('bracket-challenges.restore');
        Route::patch('/bracket-challenges/{bracketChallenge}/toggle-public', [BracketChallengeController::class, 'togglePublic'])->name('bracket-challenges.toggle-public');
        Route::patch('/bracket-challenges/{bracketChallenge}/update-status', [BracketChallengeController::class, 'updateStatus'])->name('bracket-challenges.update-status');

        Route::delete('/bracket-challenges/{bracketChallenge}/force-delete', [BracketChallengeController::class, 'forceDelete'])->name('bracket-challenges.force-delete');
        Route::patch('/bracket-challenges/{bracketChallenge}/publish', [BracketChallengeController::class, 'publishChallenge'])->name('bracket-challenges.publish');

        // Match actions
        Route::patch('/bracket-challenges/{bracketChallenge}/matches/{match}/declare-winner', [BracketChallengeController::class, 'declareWinner'])->name('bracket-challenges.matches.declare-winner');
        Route::patch('/bracket-challenges/{bracketChallenge}/matches/{match}/reset', [BracketChallengeController::class, 'resetMatch'])->name('bracket-challenges.matches.reset');

    });
});

require __DIR__.'/settings.php';
