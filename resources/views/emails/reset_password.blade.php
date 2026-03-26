@extends('layouts.email')

@section('content')
    <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin-bottom: 16px;">
        Hi, {{ $name }}!
    </h1>

    <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Forgot your password? No worries—it happens! Click the button below to set a new one and get back into your account.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
        <a href="{{ $url }}" class="button" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Reset Password
        </a>
    </div>

    <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 40px;">
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">
            <strong style="color: #cbd5e1;">Trouble with the button?</strong><br>
            Copy and paste this link into your browser:
        </p>
        
        <p style="color: #3b82f6; font-size: 12px; word-break: break-all; margin-bottom: 24px;">
            {{ $url }}
        </p>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            This link is valid for <span style="color: #cbd5e1; font-weight: bold;">60 minutes</span>. <br>
            If you didn't request a password reset, you can safely ignore this email—your account is still secure.
        </p>
    </div>
@endsection