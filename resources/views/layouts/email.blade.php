<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Base Reset */
        body { 
            margin: 0; 
            padding: 0; 
            width: 100% !important; 
            background-color: #111827; /* gray-900 */
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        
        /* Wrapper for the whole email */
        .wrapper {
            background-color: #111827;
            padding: 40px 10px;
        }

        /* Main Card */
        .container { 
            background-color: #1f2937; /* gray-800 */
            padding: 40px; 
            border-radius: 12px; 
            max-width: 600px; 
            margin: 0 auto; 
            border: 1px solid #374151; /* gray-700 border for definition */
            color: #ffffff;
        }

        .header { 
            text-align: center; 
            padding-bottom: 30px; 
        }

        .header h1 {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #ffffff;
            margin: 0;
        }

        /* Content Area */
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #ffffff;
        }

        /* Using slate-400 for secondary text inside yields */
        .content p {
            margin-bottom: 24px;
        }

        .secondary-text {
            color: #94a3b8; /* slate-400 */
        }

        /* Button Styling */
        .button-wrapper {
            text-align: center;
            padding: 20px 0 40px;
        }

        .button { 
            background-color: #3b82f6; /* blue-500 or your accent color */
            color: #ffffff !important; 
            padding: 14px 28px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600;
            display: inline-block;
        }

        /* Footer */
        .footer { 
            font-size: 13px; 
            color: #94a3b8; /* slate-400 */
            margin-top: 30px; 
            text-align: center; 
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>{{ config('app.name') }}</h1>
            </div>

            <div class="content">
                @yield('content')
            </div>

            <div class="footer">
                <p>
                    © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.<br>
                    Keep building amazing things.
                </p>
            </div>
        </div>
    </div>
</body>
</html>