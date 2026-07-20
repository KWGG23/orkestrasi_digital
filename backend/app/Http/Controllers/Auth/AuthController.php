<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(LoginRequest $request)
    {
        // Auth::once() memverifikasi kredensial tanpa membuat sesi — backend ini
        // API-only (lihat bootstrap/app.php), murni token Bearer lewat Sanctum.
        // Auth::attempt() akan diam-diam login lewat sesi juga, yang bikin guard
        // Sanctum (Guard::__invoke()) mengutamakan sesi itu di atas token manapun.
        if (! Auth::once($request->only('email', 'password'))) {
            return $this->error('Email atau password salah.', 401);
        }

        $user = Auth::user();

        // Satu sesi aktif per admin — revoke token lama
        $user->tokens()->delete();

        $token = $user->createToken('admin-token')->plainTextToken;

        return $this->success([
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login berhasil');
    }

    public function logout(Request $request)
    {
        $token = $request->user()->currentAccessToken();

        // Sanctum bisa mengembalikan TransientToken (sesi, bukan token asli) kalau
        // request ini kebetulan terautentikasi lewat guard sesi, bukan Bearer token.
        // TransientToken tidak punya baris DB untuk dihapus.
        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return $this->success(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        return $this->success(
            $request->user()->only(['id', 'name', 'email', 'role'])
        );
    }
}
