// pages/api/judge0/test.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Judge0 API configuration
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

interface TestResponse {
  success: boolean;
  message: string;
  details?: any;
  error?: string;
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
      message: 'Method not allowed'
    });
  }

  try {
    // Check API key first
    if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'your-api-key-here') {
      return res.status(500).json({ 
        success: false,
        error: 'Judge0 API key not configured. Please set RAPIDAPI_KEY or NEXT_PUBLIC_RAPIDAPI_KEY environment variable.',
        message: 'API key not configured'
      });
    }

    console.log('=== SERVER-SIDE JUDGE0 CONNECTION TEST ===');
    console.log('RAPIDAPI_HOST:', RAPIDAPI_HOST);
    console.log('RAPIDAPI_KEY length:', RAPIDAPI_KEY.length);

    const testCode = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello Judge0!" << endl;
    return 0;
}`;

    console.log('Submitting test code to Judge0...');

    // Submit test code
    const submitResponse = await fetch(`https://${RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false`, {
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
    });

    const submitData = await submitResponse.json();
    console.log('Submit response:', {
      status: submitResponse.status,
      statusText: submitResponse.statusText,
      token: submitData.token,
      message: submitData.message
    });

    if (!submitResponse.ok) {
      console.error('Submit failed:', submitData);
      return res.status(submitResponse.status || 500).json({
        success: false,
        error: `Submit failed: ${submitData.message || JSON.stringify(submitData)}`,
        message: 'Judge0 API submission failed',
        details: submitData
      });
    }

    if (!submitData.token) {
      console.error('No token received:', submitData);
      return res.status(500).json({
        success: false,
        error: 'No token received from Judge0',
        message: 'No execution token received',
        details: submitData
      });
    }

    console.log('✅ Submission successful, token:', submitData.token);

    // Wait for result with timeout
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000 + (attempts * 500)));
      
      console.log(`Fetching result, attempt ${attempts + 1}...`);
      
      const resultResponse = await fetch(`https://${RAPIDAPI_HOST}/submissions/${submitData.token}?base64_encoded=false&fields=*`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      });

      const resultData = await resultResponse.json();
      console.log(`Result attempt ${attempts + 1}:`, {
        status: resultResponse.status,
        statusId: resultData.status?.id,
        description: resultData.status?.description,
        stdout: resultData.stdout
      });

      if (!resultResponse.ok) {
        console.error('Result fetch failed:', resultData);
        return res.status(resultResponse.status || 500).json({
          success: false,
          error: `Result fetch failed: ${resultData.message || JSON.stringify(resultData)}`,
          message: 'Failed to get execution result',
          details: resultData
        });
      }

      // Check if execution is complete
      if (resultData.status && resultData.status.id !== 1 && resultData.status.id !== 2) {
        // Execution completed
        if (resultData.status.id === 3 && resultData.stdout?.includes('Hello Judge0!')) {
          console.log('✅ Judge0 connection test passed!');
          return res.status(200).json({
            success: true,
            message: 'Judge0 connection test passed successfully',
            details: {
              token: submitData.token,
              status: resultData.status,
              stdout: resultData.stdout,
              time: resultData.time,
              memory: resultData.memory
            }
          });
        } else {
          console.error('❌ Test failed - unexpected output:', resultData);
          return res.status(500).json({
            success: false,
            error: 'Test execution failed or unexpected output',
            message: 'Judge0 connection test failed',
            details: resultData
          });
        }
      }
      
      attempts++;
    }

    // Timeout reached
    console.error('❌ Test timeout after', maxAttempts, 'attempts');
    return res.status(500).json({
      success: false,
      error: `Test timeout after ${maxAttempts} attempts`,
      message: 'Judge0 connection test timeout',
      details: { token: submitData.token }
    });

  } catch (error) {
    console.error('❌ Judge0 connection test error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({
      success: false,
      error: `Connection test failed: ${errorMessage}`,
      message: 'Judge0 connection test error'
    });
  }
}