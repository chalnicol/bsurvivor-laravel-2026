<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class FirebaseAuthController extends Controller
{
    public function loginWithFirebase(Request $request)
    {
        $idToken = $request->input('idToken');

        try {
            // 1. Verify the ID Token with Firebase
            $verifiedIdToken = Firebase::auth()->verifyIdToken($idToken);

            // 2. Extract user data (uid, email, name)
            $uid = $verifiedIdToken->claims()->get('sub');
            $email = $verifiedIdToken->claims()->get('email');
            $name = $verifiedIdToken->claims()->get('name');

            // 3. Find or Create the User in your Laravel DB
            $user = User::updateOrCreate(
                ['firebase_uid' => $uid], // Ensure you add this column to your users table
                [
                    'name' => $name,
                    'email' => $email,
                    'email_verified_at' => now(),
                    // Passwords aren't needed for social users
                ]
            );

            // 4. Log the user into Laravel (Sanctum or Web Session)
            // If using Sanctum:
            $token = $user->createToken('firebase-auth')->plainTextToken;

            return response()->json([
                'message' => 'Authenticated successfully',
                'token' => $token,
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid Firebase token'], 401);
        }
    }
}
