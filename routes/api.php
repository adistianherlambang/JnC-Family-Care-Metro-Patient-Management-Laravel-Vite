<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\QueueController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\PatientController;

Route::apiResource('categories', CategoryController::class);
Route::apiResource('doctors', DoctorController::class);
Route::apiResource('queues', QueueController::class);
Route::apiResource('news', NewsController::class);
Route::apiResource('faqs', FaqController::class);
Route::apiResource('patients', PatientController::class);

Route::get('/test-db', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
        return response()->json([
            'status' => 'success',
            'message' => 'Database MySQL BERHASIL terhubung!',
            'database' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
            'total_tables' => count($tables),
            'tables' => array_map(function ($t) {
                return array_values((array) $t)[0];
            }, $tables)
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Koneksi database GAGAL!',
            'error_detail' => $e->getMessage(),
            'code' => $e->getCode(),
            'db_host' => config('database.connections.mysql.host'),
            'db_database' => config('database.connections.mysql.database'),
            'db_username' => config('database.connections.mysql.username')
        ], 500);
    }
});

