<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => config('app.name', 'Laravel API'),
        'version' => '1.0.0',
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
    ]);
});
