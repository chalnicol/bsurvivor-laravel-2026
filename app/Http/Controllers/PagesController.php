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

}
