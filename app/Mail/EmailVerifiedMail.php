<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


// use Illuminate\Support\Facades\URL;
// use Illuminate\Support\Facades\Config;
// use Illuminate\Support\Carbon;

class EmailVerifiedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public $user) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Account Email Verified' ,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {   

        return new Content(
            view: 'emails.email_verified', // Your custom blade file
            with: [
                'url' => url('/profile'),
                'name' => $this->user->username,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
