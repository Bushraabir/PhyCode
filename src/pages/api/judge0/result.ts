// pages/api/judge0/result.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Judge0 API configuration with validation
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

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

// Simple token validation
function isValidToken(token: string): boolean {
  // Basic validation - tokens should be alphanumeric with dashes
  return /^[a-zA-Z0-9\-_]+$/.test(token) && token.length >= 10 && token.length <= 100;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use GET.',
      success: false 
    });
  }

  try {
    const { token } = req.query;

    // Enhanced token validation
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ 
        error: 'Token is required as query parameter',
        success: false 
      });
    }

    if (!isValidToken(token)) {
      return res.status(400).json({
        error: 'Invalid token format',
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

    console.log('=== SERVER-SIDE JUDGE0 RESULT FETCH ===');
    console.log('Token:', token);

    // Make request to Judge0 API with timeout and retry logic
    let lastError: any = null;
    let attempt = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    while (attempt < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(
          `https://${RAPIDAPI_HOST}/submissions/${encodeURIComponent(token)}?base64_encoded=false&fields=*`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': RAPIDAPI_KEY,
              'x-rapidapi-host': RAPIDAPI_HOST,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const data = await response.json();
        console.log('Judge0 result response (attempt ${attempt + 1}):', {
          status: response.status,
          statusText: response.statusText,
          statusId: data.status?.id,
          statusDescription: data.status?.description
        });

        if (!response.ok) {
          // Handle specific HTTP errors
          if (response.status === 404) {
            return res.status(404).json({
              error: 'Submission not found. Token may be invalid or expired.',
              success: false
            });
          }
          
          if (response.status === 429) {
            // Rate limit hit, wait and retry
            if (attempt < maxRetries - 1) {
              console.log('Rate limit hit, retrying in ${retryDelay * (attempt + 1)}ms...');
              await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
              attempt++;
              continue;
            }
          }

          lastError = new Error(`Judge0 API error (${response.status}): ${data.message || data.error || response.statusText}`);
          
          if (attempt < maxRetries - 1) {
            console.log(`Retrying after error (attempt ${attempt + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            attempt++;
            continue;
          }
          
          throw lastError;
        }

        // Success - return the result
        const result = {
          ...data,
          success: true,
          timestamp: new Date().toISOString()
        };

        // Validate critical fields
        if (!data.status || typeof data.status.id !== 'number') {
          console.warn('Invalid status in Judge0 response:', data.status);
        }

        return res.status(200).json(result);

      } catch (fetchError) {
        lastError = fetchError;
        
        if (fetchError.name === 'AbortError') {
          console.log('Request timeout on attempt ${attempt + 1}, retrying...');
        } else {
          console.error(`Error on attempt ${attempt + 1}:`, fetchError);
        }
        
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
        
        attempt++;
      }
    }

    // All retries failed
    throw lastError;

  } catch (error) {
    console.error('Judge0 result fetch error:', error);
    
    let errorMessage = 'Unknown server error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Categorize different types of errors
      if (error.message.includes('timeout') || error.name === 'AbortError') {
        errorMessage = 'Request timeout. Judge0 service may be slow or unavailable.';
        statusCode = 408;
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
        statusCode = 503;
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
        statusCode = 429;
      }
    }

    // Don't expose sensitive error details in production
    const clientError = process.env.NODE_ENV === 'development' 
      ? errorMessage
      : 'Service temporarily unavailable. Please try again.';

    res.status(statusCode).json({
      error: clientError,
      success: false,
      timestamp: new Date().toISOString(),
      retryAfter: statusCode === 429 ? 60 : undefined // Suggest retry after 60 seconds for rate limits
    });
  }
}