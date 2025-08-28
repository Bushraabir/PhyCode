// pages/api/judge0/test.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Judge0 API configuration with validation
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

interface TestResponse {
  success: boolean;
  message: string;
  details?: any;
  error?: string;
  timestamp?: string;
  connectionInfo?: {
    host: string;
    keyConfigured: boolean;
    responseTime?: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use GET.',
      message: 'Method not allowed',
      timestamp: new Date().toISOString()
    });
  }

  const startTime = Date.now();

  try {
    // Check API key configuration first
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your-api-key-here' || RAPIDAPI_KEY.trim() === '') {
      console.error('❌ RAPIDAPI_KEY not configured properly');
      return res.status(500).json({ 
        success: false,
        error: 'Judge0 API key not configured. Please set RAPIDAPI_KEY environment variable.',
        message: 'API key not configured',
        timestamp: new Date().toISOString(),
        connectionInfo: {
          host: RAPIDAPI_HOST,
          keyConfigured: false
        }
      });
    }

    console.log('=== SERVER-SIDE JUDGE0 CONNECTION TEST ===');
    console.log('RAPIDAPI_HOST:', RAPIDAPI_HOST);
    console.log('RAPIDAPI_KEY length:', RAPIDAPI_KEY.length);
    console.log('Environment:', process.env.NODE_ENV);

    const testCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello Judge0!" << endl;
    return 0;
}`;

    console.log('Submitting test code to Judge0...');

    // Submit test code with enhanced error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let submitResponse;
    try {
      submitResponse = await fetch(`https://${RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
        body: JSON.stringify({
          source_code: testCode,
          language_id: 54, // C++
          stdin: '',
          cpu_time_limit: 2,
          memory_limit: 128000,
          wall_time_limit: 5,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const submitData = await submitResponse.json();
    const responseTime = Date.now() - startTime;

    console.log('Submit response:', {
      status: submitResponse.status,
      statusText: submitResponse.statusText,
      token: submitData.token,
      message: submitData.message,
      responseTime: `${responseTime}ms`
    });

    if (!submitResponse.ok) {
      console.error('Submit failed:', submitData);
      
      let errorMessage = 'Judge0 API submission failed';
      if (submitResponse.status === 401) {
        errorMessage = 'Invalid API key. Please check your RAPIDAPI_KEY environment variable.';
      } else if (submitResponse.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (submitResponse.status >= 500) {
        errorMessage = 'Judge0 service is currently unavailable.';
      }
      
      return res.status(submitResponse.status || 500).json({
        success: false,
        error: `${errorMessage}: ${submitData.message || submitResponse.statusText}`,
        message: 'Judge0 API submission failed',
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? submitData : undefined,
        connectionInfo: {
          host: RAPIDAPI_HOST,
          keyConfigured: true,
          responseTime
        }
      });
    }

    if (!submitData.token) {
      console.error('No token received:', submitData);
      return res.status(500).json({
        success: false,
        error: 'No token received from Judge0',
        message: 'No execution token received',
        timestamp: new Date().toISOString(),
        details: process.env.NODE_ENV === 'development' ? submitData : undefined,
        connectionInfo: {
          host: RAPIDAPI_HOST,
          keyConfigured: true,
          responseTime
        }
      });
    }

    console.log('✅ Submission successful, token:', submitData.token);

    // Wait for result with enhanced retry logic
    let attempts = 0;
    const maxAttempts = 15; // Reduced from 30 for faster testing
    const delays = [1000, 1500, 2000, 2500, 3000]; // Progressive delays
    
    while (attempts < maxAttempts) {
      const delay = delays[Math.min(attempts, delays.length - 1)];
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Fetching result, attempt ${attempts + 1}/${maxAttempts}...`);
      
      try {
        const resultController = new AbortController();
        const resultTimeoutId = setTimeout(() => resultController.abort(), 15000);

        let resultResponse;
        try {
          resultResponse = await fetch(
            `https://${RAPIDAPI_HOST}/submissions/${encodeURIComponent(submitData.token)}?base64_encoded=false&fields=*`,
            {
              method: 'GET',
              headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
              },
              signal: resultController.signal,
            }
          );
        } finally {
          clearTimeout(resultTimeoutId);
        }

        const resultData = await resultResponse.json();
        console.log(`Result attempt ${attempts + 1}:`, {
          status: resultResponse.status,
          statusId: resultData.status?.id,
          description: resultData.status?.description,
          stdout: resultData.stdout ? 'Present' : 'None'
        });

        if (!resultResponse.ok) {
          console.error('Result fetch failed:', resultData);
          
          if (resultResponse.status === 404) {
            return res.status(404).json({
              success: false,
              error: 'Submission not found. Token may have expired.',
              message: 'Failed to get execution result',
              timestamp: new Date().toISOString(),
              details: resultData,
              connectionInfo: {
                host: RAPIDAPI_HOST,
                keyConfigured: true,
                responseTime: Date.now() - startTime
              }
            });
          }
          
          // For other errors, continue retrying
          attempts++;
          continue;
        }

        // Check if execution is complete
        if (resultData.status && resultData.status.id !== 1 && resultData.status.id !== 2) {
          // Execution completed
          const totalTime = Date.now() - startTime;
          
          if (resultData.status.id === 3 && resultData.stdout && resultData.stdout.trim().includes('Hello Judge0!')) {
            console.log('✅ Judge0 connection test passed!');
            return res.status(200).json({
              success: true,
              message: 'Judge0 connection test passed successfully',
              timestamp: new Date().toISOString(),
              details: {
                token: submitData.token,
                status: resultData.status,
                stdout: resultData.stdout,
                time: resultData.time,
                memory: resultData.memory,
                attempts: attempts + 1,
                totalTime: `${totalTime}ms`
              },
              connectionInfo: {
                host: RAPIDAPI_HOST,
                keyConfigured: true,
                responseTime: totalTime
              }
            });
          } else {
            console.error('❌ Test failed - unexpected result:', resultData);
            return res.status(500).json({
              success: false,
              error: `Test execution failed. Status: ${resultData.status?.description || 'Unknown'}`,
              message: 'Judge0 connection test failed',
              timestamp: new Date().toISOString(),
              details: {
                token: submitData.token,
                status: resultData.status,
                stdout: resultData.stdout,
                stderr: resultData.stderr,
                compile_output: resultData.compile_output,
                attempts: attempts + 1,
                totalTime: `${Date.now() - startTime}ms`
              },
              connectionInfo: {
                host: RAPIDAPI_HOST,
                keyConfigured: true,
                responseTime: Date.now() - startTime
              }
            });
          }
        }
        
        attempts++;
        
      } catch (resultError) {
        console.error(`Result fetch error on attempt ${attempts + 1}:`, resultError);
        attempts++;
        
        if (attempts >= maxAttempts) {
          return res.status(500).json({
            success: false,
            error: `Result fetch failed after ${attempts} attempts: ${resultError.message}`,
            message: 'Judge0 connection test timeout',
            timestamp: new Date().toISOString(),
            details: { 
              token: submitData.token,
              attempts,
              lastError: resultError.message
            },
            connectionInfo: {
              host: RAPIDAPI_HOST,
              keyConfigured: true,
              responseTime: Date.now() - startTime
            }
          });
        }
      }
    }

    // Timeout reached
    console.error('❌ Test timeout after', maxAttempts, 'attempts');
    return res.status(500).json({
      success: false,
      error: `Test timeout after ${maxAttempts} attempts. Execution may be taking too long.`,
      message: 'Judge0 connection test timeout',
      timestamp: new Date().toISOString(),
      details: { 
        token: submitData.token,
        attempts: maxAttempts,
        totalTime: `${Date.now() - startTime}ms`
      },
      connectionInfo: {
        host: RAPIDAPI_HOST,
        keyConfigured: true,
        responseTime: Date.now() - startTime
      }
    });

  } catch (error) {
    console.error('❌ Judge0 connection test error:', error);
    
    let errorMessage = 'Connection test failed';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. Judge0 service may be slow.';
        statusCode = 408;
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check connectivity.';
        statusCode = 503;
      } else {
        errorMessage = `Connection test failed: ${error.message}`;
      }
    }

    return res.status(statusCode).json({
      success: false,
      error: process.env.NODE_ENV === 'development' ? errorMessage : 'Service connectivity test failed',
      message: 'Judge0 connection test error',
      timestamp: new Date().toISOString(),
      connectionInfo: {
        host: RAPIDAPI_HOST,
        keyConfigured: !!RAPIDAPI_KEY && RAPIDAPI_KEY !== 'your-api-key-here',
        responseTime: Date.now() - startTime
      }
    });
  }
}