<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bracket_challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('set null');
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            // In bracket_challenges migration — update status enum
            $table->enum('status', ['draft', 'published', 'completed'])->default('draft');
            $table->boolean('is_public')->default(false);
            $table->date('submission_start');
            $table->date('submission_end');

            // Bracket structure metadata.
            $table->unsignedTinyInteger('team_count')->default(16);
            $table->unsignedTinyInteger('total_rounds')->default(4);
            $table->json('seed_data')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bracket_challenges');
    }
};