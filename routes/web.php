<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\FaqController;

Route::prefix('api')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('doctors', DoctorController::class);
    Route::apiResource('queues', QueueController::class);
    Route::apiResource('news', NewsController::class);
    Route::apiResource('faqs', FaqController::class);
});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
