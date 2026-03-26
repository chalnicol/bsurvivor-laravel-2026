@extends('layouts.email')

@section('content')
    <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin-bottom: 16px;">
        Hi, {{ $name }}!
    </h1>

    <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        You've updated your email! To keep your account secure and get you back into the action, just hit the button below to verify your new address.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
        <a href="{{ $url }}" class="button" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Verify My Email
        </a>
    </div>

    <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 40px;">
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 12px;">
            <strong style="color: #cbd5e1;">Trouble with the button?</strong><br>
            Copy and paste the URL below into your web browser:
        </p>
        
        <p style="color: #3b82f6; font-size: 12px; word-break: break-all; margin-bottom: 24px;">
            {{ $url }}
        </p>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            This link will expire in 60 minutes. If you didn't recently change your email address, please 
            <a href="mailto:support@yourdomain.com" style="color: #3b82f6; text-decoration: underline;">contact us immediately</a> 
            to secure your account.
        </p>
    </div>
@endsection