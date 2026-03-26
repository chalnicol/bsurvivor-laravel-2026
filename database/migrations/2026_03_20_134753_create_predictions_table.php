<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bracket_challenge_entry_id')
                  ->constrained('bracket_challenge_entries')
                  ->onDelete('cascade');
            $table->foreignId('match_id')
                  ->constrained('matches')
                  ->onDelete('cascade');
            $table->foreignId('predicted_winner_team_id')
                  ->nullable()
                  ->constrained('teams')
                  ->onDelete('set null');
            $table->enum('status', ['pending', 'correct', 'incorrect', 'void'])
                  ->default('pending');
            $table->timestamps();

            // One prediction per match per entry.
            $table->unique(['bracket_challenge_entry_id', 'match_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};