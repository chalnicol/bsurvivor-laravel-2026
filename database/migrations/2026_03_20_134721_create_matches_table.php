<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('set null');
            $table->foreignId('bracket_challenge_id')
                  ->nullable()
                  ->constrained('bracket_challenges')
                  ->onDelete('cascade'); // hard-delete matches when challenge is force-deleted
            $table->foreignId('winner_team_id')
                  ->nullable()
                  ->constrained('teams')
                  ->onDelete('set null');
            $table->foreignId('next_match_id')
                  ->nullable()
                  ->constrained('matches')
                  ->onDelete('set null');
            $table->unsignedTinyInteger('next_match_slot')->nullable();
            $table->string('name');
            $table->unsignedTinyInteger('round_index');
            $table->unsignedTinyInteger('match_index');
            $table->enum('conference', ['east', 'west', 'north', 'south'])->nullable();
            $table->timestamps();
            // no softDeletes()
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};