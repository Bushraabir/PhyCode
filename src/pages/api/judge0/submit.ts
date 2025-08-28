// pages/api/judge0/submit.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Judge0 API configuration with validation
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

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

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW) {
    // New window
    rateLimitStore.set(identifier, { count: 1, windowStart: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST.',
      success: false 
    });
  }

  // Rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP;
  
  if (!checkRateLimit(identifier)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Maximum 10 submissions per minute.',
      success: false
    });
  }

  try {
    const {
      source_code,
      language_id,
      stdin = '',
      expected_output = ''
    }: SubmitRequestBody = req.body;

    // Enhanced input validation
    if (!source_code || typeof source_code !== 'string' || !source_code.trim()) {
      return res.status(400).json({ 
        error: 'Source code is required and must be a non-empty string',
        success: false 
      });
    }

    if (!language_id || language_id !== 54) {
      return res.status(400).json({ 
        error: 'Only C++ (language_id: 54) is supported',
        success: false 
      });
    }

    // Input size validation (1MB limit)
    const MAX_SIZE = 1024 * 1024;
    if (source_code.length > MAX_SIZE) {
      return res.status(400).json({
        error: 'Source code too large. Maximum 1MB allowed.',
        success: false
      });
    }

    if (stdin && stdin.length > MAX_SIZE) {
      return res.status(400).json({
        error: 'Input too large. Maximum 1MB allowed.',
        success: false
      });
    }

    // Check API key configuration
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your-api-key-here') {
      console.error('❌ RAPIDAPI_KEY not configured properly');
      return res.status(500).json({ 
        error: 'Judge0 API configuration error. Please contact administrator.',
        success: false 
      });
    }

    console.log('=== SERVER-SIDE JUDGE0 SUBMISSION ===');
    console.log('Source code length:', source_code.length);
    console.log('Language ID:', language_id);
    console.log('STDIN length:', stdin?.length || 0);
    console.log('Expected output length:', expected_output?.length || 0);
    console.log('Client IP:', identifier);

    // Prepare request body for Judge0 with enhanced limits
    const requestBody: any = {
      source_code: source_code.trim(),
      language_id: language_id,
      stdin: stdin || '',
      cpu_time_limit: 2, // 2 seconds
      memory_limit: 128000, // 128MB
      wall_time_limit: 5, // 5 seconds wall time
      enable_per_process_and_thread_time_limit: true,
      enable_per_process_and_thread_memory_limit: true,
    };

    // Add expected output if provided
    if (expected_output && expected_output.trim()) {
      requestBody.expected_output = expected_output.trim();
    }

    console.log('Submitting to Judge0 API with enhanced security...');

    // Make request to Judge0 API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`https://${RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('Judge0 API response:', {
        status: response.status,
        statusText: response.statusText,
        token: data.token,
        message: data.message
      });

      if (!response.ok) {
        console.error('Judge0 API error:', {
          status: response.status,
          statusText: response.statusText,
          response: data
        });
        
        return res.status(response.status || 500).json({
          error: `Judge0 API error: ${data.message || data.error || response.statusText}`,
          success: false,
          details: process.env.NODE_ENV === 'development' ? data : undefined
        });
      }

      if (!data.token) {
        console.error('No token in Judge0 response:', data);
        return res.status(500).json({
          error: 'No execution token received from Judge0',
          success: false
        });
      }

      console.log('✅ Submission successful, token:', data.token);

      // Return successful response
      res.status(200).json({
        ...data,
        success: true,
        timestamp: new Date().toISOString()
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return res.status(408).json({
          error: 'Request timeout. Judge0 service may be slow.',
          success: false
        });
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('Judge0 submission error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    
    // Don't expose sensitive error details in production
    const clientError = process.env.NODE_ENV === 'development' 
      ? `Server error: ${errorMessage}`
      : 'Internal server error occurred';
    
    res.status(500).json({
      error: clientError,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}