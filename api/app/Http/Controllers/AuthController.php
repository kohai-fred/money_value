<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function authenticate(Request $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'token' => $user->createToken(time())->plainTextToken,
                'message' => 'Success',
                'status' => 200
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized',
                'status' => 401
            ]);
        }
    }
}
