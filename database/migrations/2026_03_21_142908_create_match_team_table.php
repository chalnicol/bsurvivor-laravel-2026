<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_team', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->onDelete('cascade');
            $table->foreignId('team_id')->constrained()->onDelete('cascade');
            $table->integer('seed')->nullable();
            $table->integer('slot')->nullable();
            $table->timestamps();

            // Prevent the same team appearing twice in the same match.
            $table->unique(['match_id', 'team_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_team'); // fixed typo
    }
};