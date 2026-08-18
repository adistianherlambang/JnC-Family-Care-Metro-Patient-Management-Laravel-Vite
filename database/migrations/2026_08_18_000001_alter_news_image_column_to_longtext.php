<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE news MODIFY image LONGTEXT NULL");
        DB::statement("ALTER TABLE practitioners MODIFY image LONGTEXT NULL");
    }

    public function down(): void
    {
    }
};
