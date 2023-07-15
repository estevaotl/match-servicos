<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Php\Controllers\NewsletterController;

// Route::prefix('/match-servicos/api/newsletter')->group(function () {
//     Route::post('/inscricao', [NewsletterController::class, 'inscricao']);
//     // Route::middleware([HandleCors::class])
// });

// Route::any('{any}', function ($any) {
//     var_dump($any);
// })->where('any', '.*');

Route::prefix('newsletter')->group(function () {
    Route::get('/inscricao', [NewsletterController::class, 'inscrever']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
