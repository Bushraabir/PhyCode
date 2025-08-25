# Judge0 Integration Setup Guide

## Problem Analysis

The original error "Judge0 connection failed" was caused by several issues:

1. **Environment Variables**: The code was trying to access `process.env` variables in client-side code, but these are only available server-side in Next.js
2. **CORS Issues**: Direct API calls to external services from the browser often fail due to CORS policies
3. **API Configuration**: Hardcoded default values were being used instead of proper environment variables

## Solution Overview

The fix implements a proper Next.js architecture:

- **Client-side code** (`judge0.ts`) now calls internal API routes instead of external APIs
- **Server-side API routes** handle all external Judge0 API communication
- **Environment variables** are properly configured and accessed server-side only

## Setup Instructions

### 1. Get a Judge0 API Key

1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Sign up for a free account
3. Subscribe to the Judge0 CE (Community Edition) - it's free
4. Copy your `X-RapidAPI-Key` from the dashboard

### 2. Create API Route Files

Create these files in your Next.js project:

```
pages/
  api/
    judge0/
      submit.ts    (submission endpoint)
      result.ts    (result fetching endpoint)  
      test.ts      (connection testing endpoint)
```

### 3. Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your API configuration:

```bash
RAPIDAPI_KEY=your_actual_rapidapi_key_here
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com
```

### 4. Update Your Files

Replace your existing files with the fixed versions:

- `lib/judge0.ts` - Updated client-side functions
- `components/EditorFooter.tsx` - Fixed component with better error handling

### 5. Restart Development Server

```bash
npm run dev
# or
yarn dev
```

## File Structure

```
your-project/
├── .env.local                     (your API keys)
├── lib/
│   └── judge0.ts                  (client-side functions)
├── components/
│   └── EditorFooter.tsx          (React component)
└── pages/
    └── api/
        └── judge0/
            ├── submit.ts          (submission API route)
            ├── result.ts          (result API route)
            └── test.ts            (connection test API route)
```

## Key Features

### ✅ Fixed Issues

- **Proper environment variable handling** - API keys are secure server-side
- **CORS compliance** - All external API calls happen server-side
- **Better error handling** - Clear error messages and connection status
- **Connection testing** - Automatic connection verification on component mount
- **Loading states** - Visual feedback during execution
- **Input processing** - Automatic formatting for C++ test cases

### 🚀 Enhanced Features

- **Visual connection status** - Real-time connection indicator
- **Detailed execution results** - Performance metrics, error messages, output comparison
- **Test case processing** - Automatic input formatting for different data types
- **Progressive polling** - Efficient result fetching with backoff strategy

## Troubleshooting

### "Judge0 connection failed"

1. **Check API Key**: Ensure `RAPIDAPI_KEY` in `.env.local` is correct
2. **Check Subscription**: Verify your RapidAPI Judge0 subscription is active
3. **Check Network**: Ensure your server can access external APIs
4. **Check Logs**: Look at browser console and server logs for detailed error messages

### "API key not configured"

1. Ensure `.env.local` exists in project root
2. Restart your development server after adding environment variables
3. Check that the key name is exactly `RAPIDAPI_KEY`

### Connection test timing out

1. Judge0 API might be experiencing high load
2. Your API key might have rate limits
3. Check RapidAPI dashboard for usage limits

## API Endpoints

The solution creates three internal API endpoints:

1. **POST /api/judge0/submit** - Submit code for execution
2. **GET /api/judge0/result?token=<token>** - Get execution results
3. **GET /api/judge0/test** - Test API connection

## Security Notes

- API keys are stored server-side only
- No sensitive information is exposed to the client
- All external API calls are proxied through your Next.js backend
- Rate limiting and error handling are centralized

## Development vs Production

The current setup works for both development and production. For production deployment:

1. Set environment variables in your deployment platform
2. Ensure your hosting service allows outbound HTTP requests
3. Monitor API usage and implement additional rate limiting if needed

## Support

If you encounter issues:

1. Check the browser console for client-side errors
2. Check server logs for API route errors  
3. Verify your Judge0 API key and subscription status
4. Test the connection using the built-in test endpoint