<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Version 1 API Routes
Route::prefix('v1')->group(function () {
    // Public Authentication Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Protected Routes (Requires Sanctum Token)
    Route::middleware('auth:sanctum')->group(function () {
        // Authenticated User Profile & Logout
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // Administrative Routes (Role: super-admin or admin)
        Route::middleware('role:super-admin,admin')->group(function () {
            // User Management CRUD
            Route::apiResource('users', UserController::class);

            // Role Listing
            Route::get('roles', [RoleController::class, 'index']);
        });
    });
});

// Fallback Convenience Aliases for root /api/login, /api/register, /api/logout
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
});

// API Fallback 404 Handler
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found',
        'status' => 404,
    ], 404);
});
