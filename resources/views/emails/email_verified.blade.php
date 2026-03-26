@extends('layouts.email')

@section('content')
    <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin-bottom: 16px;">
        Hi, {{ $name }}!
    </h1>

    <p style="color: #ffffff; font-size: 16px; margin-bottom: 24px;">
        Your email address has been successfully verified! You've got full access now, so you're all set to dive back in and start shopping.
    </p>
    
    <div class="button-wrapper" style="text-align: center; margin: 30px 0;">
        <a href="{{ $url }}" class="button" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            View My Account
        </a>
    </div>

    <div style="border-top: 1px solid #374151; padding-top: 20px; margin-top: 30px;">
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">
            <strong style="color: #cbd5e1;">Security Note:</strong> This link will expire in 60 minutes for your protection.
        </p>
        
        <p style="color: #94a3b8; font-size: 14px;">
            If you didn't recently update your email address or sign up, please <a href="mailto:support@yourdomain.com" style="color: #3b82f6; text-decoration: underline;">contact us immediately</a> so we can secure your account.
        </p>
    </div>
@endsection