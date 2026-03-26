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
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->nullable()->constrained()->onDelete('set null');
            $table->string('club_name');
            $table->string('monicker');
            $table->string('short_name');
            $table->string('logo')->nullable();
            $table->enum('conference', ['east', 'west', 'north', 'south'])->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
            $table->unique(['short_name', 'league_id']);
            $table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
