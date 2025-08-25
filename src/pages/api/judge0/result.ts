// pages/api/judge0/result.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Judge0 API configuration
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

interface Judge0ResultResponse {
  stdout?: string;
  stderr?: string;
  status?: { id: number; description: string };
  token?: string;
  message?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const { token } = req.query;

    // Validate token
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required as query parameter' });
    }

    // Check API key
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your-api-key-here') {
      return res.status(500).json({ 
        error: 'Judge0 API key not configured. Please set RAPIDAPI_KEY or NEXT_PUBLIC_RAPIDAPI_KEY environment variable.' 
      });
    }

    console.log('=== SERVER-SIDE JUDGE0 RESULT FETCH ===');
    console.log('Token:', token);

    // Make request to Judge0 API
    const response = await fetch(`https://${RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false&fields=*`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    const data = await response.json();
    console.log('Judge0 result response:', {
      status: response.status,
      statusText: response.statusText,
      statusId: data.status?.id,
      statusDescription: data.status?.description
    });

    if (!response.ok) {
      console.error('Judge0 result API error:', {
        status: response.status,
        statusText: response.statusText,
        response: data
      });
      
      return res.status(response.status || 500).json({
        error: `Judge0 API error: ${data.message || data.error || JSON.stringify(data)}`
      });
    }

    // Return the result
    res.status(200).json(data);

  } catch (error) {
    console.error('Judge0 result fetch error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    res.status(500).json({
      error: `Server error: ${errorMessage}`
    });
  }
}