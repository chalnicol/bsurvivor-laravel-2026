<?php

namespace App\Notifications;

use App\Models\BracketChallenge;
use App\Models\BracketChallengeEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BracketChallengeUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly BracketChallenge $challenge,
        public readonly BracketChallengeEntry $entry,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'          => 'bracket_challenge_updated',
            'challenge_id'  => $this->challenge->id,
            'challenge_name'=> $this->challenge->name,
            'entry_id'      => $this->entry->id,
            'entry_name'    => $this->entry->name,
            'score'         => $this->entry->correct_predictions_count,
            'entry_status'  => $this->entry->status,
            'message'       => $this->challenge->isCompleted()
                ? "The bracket challenge \"{$this->challenge->name}\" has been completed. Your final score is {$this->entry->correct_predictions_count}."
                : "Match results have been updated for \"{$this->challenge->name}\". Your current score is {$this->entry->correct_predictions_count}.",
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->challenge->isCompleted()
            ? "Bracket Challenge Completed: {$this->challenge->name}"
            : "Match Update: {$this->challenge->name}";

        $message = $this->challenge->isCompleted()
            ? "The bracket challenge has been completed. Your final score is **{$this->entry->correct_predictions_count}** correct predictions."
            : "Match results have been updated. Your current score is **{$this->entry->correct_predictions_count}** correct predictions.";

        return (new MailMessage)
            ->subject($subject)
            ->greeting("Hi {$notifiable->full_name}!")
            ->line($message)
            ->action('View Your Bracket', url("/bracket-challenges/{$this->challenge->slug}/entries/{$this->entry->slug}"))
            ->line('Thank you for participating!');
    }
}