<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // API-only backend — tidak ada rute 'login' web untuk dituju.
        // Tanpa ini, Authenticate::redirectTo() memanggil route('login') dan
        // crash dengan RouteNotFoundException alih-alih melempar 401 biasa.
        Authenticate::redirectUsing(fn () => null);

        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // API-only backend — tidak ada rute 'login' web, jadi selalu balas JSON
        // alih-alih redirect (yang akan crash dengan RouteNotFoundException).
        $exceptions->render(function (AuthenticationException $e, $request) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        });
    })->create();
