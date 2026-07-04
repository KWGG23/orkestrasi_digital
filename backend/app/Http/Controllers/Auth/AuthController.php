<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(LoginRequest $request)
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            return $this->error('Email atau password salah.', 401);
        }

        $user = Auth::user();

        // Satu sesi aktif per admin — revoke token lama
        $user->tokens()->delete();

        $token = $user->createToken('admin-token')->plainTextToken;

        return $this->success([
            'user'       => $user->only(['id', 'name', 'email']),
            'token'      => $token,
            'token_type' => 'Bearer',
        ], 'Login berhasil');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        return $this->success(
            $request->user()->only(['id', 'name', 'email'])
        );
    }
}
