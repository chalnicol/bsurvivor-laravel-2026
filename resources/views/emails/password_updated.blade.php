
@extends('layouts.email')

@section('content')
    <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin-bottom: 16px;">
        Hi, {{ $name }}!
    </h1>

    <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Just a quick heads-up: your account password was recently updated. If this was you, you're all set! You can head back to your account below.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
        <a href="{{ $url }}" class="button" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Go to My Account
        </a>
    </div>

    <div style="border-top: 1px solid #374151; padding-top: 24px; margin-top: 40px;">
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 16px;">
            <strong style="color: #cbd5e1;">Security Check:</strong> If you did **not** authorize this password change, please 
            <a href="mailto:support@yourdomain.com" style="color: #3b82f6; text-decoration: underline;">contact our support team immediately</a> 
            so we can secure your account.
        </p>

        <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            The link above will expire in 60 minutes for your protection. <br>
            If you made this change yourself, no further action is needed.
        </p>
    </div>
@endsection