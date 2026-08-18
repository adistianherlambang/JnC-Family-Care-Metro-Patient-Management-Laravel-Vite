<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('service_categories')->onDelete('cascade');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('practitioners', function (Blueprint $table) {
            $table->id();
            $table->string('doctor');
            $table->string('role')->default('Praktisi Medis');
            $table->longText('image')->nullable();
            $table->string('start_day')->default('Senin');
            $table->string('end_day')->default('Jumat');
            $table->string('start_time')->default('08:00');
            $table->string('end_time')->default('14:00');
            $table->json('services')->nullable();
            $table->timestamps();
        });

        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('queue_number');
            $table->string('patient_name');
            $table->string('doctor_name');
            $table->string('category_name')->nullable();
            $table->string('service_name');
            $table->string('date')->default('Hari Ini');
            $table->string('time')->default('09:00 WIB');
            $table->string('status')->default('Menunggu Antrean');
            $table->timestamps();
        });

        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->text('summary');
            $table->longText('content')->nullable();
            $table->string('author')->nullable();
            $table->longText('image')->nullable();
            $table->string('read_time')->nullable();
            $table->string('date');
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->text('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('news');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('practitioners');
        Schema::dropIfExists('services');
        Schema::dropIfExists('service_categories');
    }
};
