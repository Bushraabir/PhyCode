// pages/api/judge0/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Judge0 API configuration
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

interface SubmitRequestBody {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0SubmissionResponse {
  token?: string;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      source_code,
      language_id,
      stdin = '',
      expected_output = ''
    }: SubmitRequestBody = req.body;

    // Validate required fields
    if (!source_code || !source_code.trim()) {
      return res.status(400).json({ error: 'Source code is required' });
    }

    if (!language_id || language_id !== 54) {
      return res.status(400).json({ error: 'Only C++ (language_id: 54) is supported' });
    }

    // Check API key
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your-api-key-here') {
      return res.status(500).json({ 
        error: 'Judge0 API key not configured. Please set RAPIDAPI_KEY or NEXT_PUBLIC_RAPIDAPI_KEY environment variable.' 
      });
    }

    console.log('=== SERVER-SIDE JUDGE0 SUBMISSION ===');
    console.log('Source code length:', source_code.length);
    console.log('Language ID:', language_id);
    console.log('STDIN length:', stdin.length);
    console.log('Expected output length:', expected_output.length);

    // Prepare request body for Judge0
    const requestBody: any = {
      source_code: source_code.trim(),
      language_id: language_id,
      stdin: stdin || '',
      cpu_time_limit: 2,
      memory_limit: 128000,
      wall_time_limit: 5,
    };

    // Add expected output if provided
    if (expected_output && expected_output.trim()) {
      requestBody.expected_output = expected_output.trim();
    }

    console.log('Submitting to Judge0 API...');

    // Make request to Judge0 API
    const response = await fetch(`https://${RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log('Judge0 API response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });

    if (!response.ok) {
      console.error('Judge0 API error:', {
        status: response.status,
        statusText: response.statusText,
        response: data
      });
      
      return res.status(response.status || 500).json({
        error: `Judge0 API error: ${data.message || data.error || JSON.stringify(data)}`
      });
    }

    if (!data.token) {
      console.error('No token in Judge0 response:', data);
      return res.status(500).json({
        error: 'No execution token received from Judge0'
      });
    }

    console.log('✅ Submission successful, token:', data.token);

    // Return the submission response
    res.status(200).json(data);

  } catch (error) {
    console.error('Judge0 submission error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    res.status(500).json({
      error: `Server error: ${errorMessage}`
    });
  }
}