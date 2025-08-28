// Types and Interfaces
export interface TestCase {
  inputText: string;
  outputText: string;
  id?: string;
  explanation?: string;
}

export interface ProcessedInput {
  stdin: string;
  expectedOutput: string;
}

export interface SubmissionResult {
  stdout?: string;
  stderr?: string;
  status?: { id: number; description: string };
  token?: string;
  message?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

// Language ID mapping for C++ only
export const LANGUAGE_IDS = {
  CPP: 54,
} as const;

// Error tracking utility
class ErrorTracker {
  static log(error: Error, context: string) {
    console.error(`[${context}]`, error);
    
    // Send to monitoring service in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      }).catch(() => {}); // Silent fail for error tracking
    }
  }
}

// Universal Input Processor - COMPLETELY REWRITTEN
export class UniversalInputProcessor {
  static processInput(testCase: TestCase, languageId: number): ProcessedInput {
    if (languageId !== 54) {
      throw new Error('Only C++ (language ID 54) is supported');
    }

    // Universal approach: pass raw input for C++ to handle
    // This eliminates input processing bugs and lets C++ handle parsing
    return {
      stdin: testCase.inputText.trim(),
      expectedOutput: testCase.outputText.trim()
    };
  }

  static getCppTemplate(inputText: string): string {
    // Universal C++ template that works with any input format
    return `#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <limits>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // Your solution implementation goes here
    // Read input as needed for your specific problem
    
    return 0;
}`;
  }

  static getTemplate(languageId: number, inputText: string = ''): string {
    if (languageId !== 54) {
      throw new Error('Only C++ (language ID 54) is supported');
    }
    return this.getCppTemplate(inputText);
  }
}

// Keep backward compatibility
export const InputProcessor = UniversalInputProcessor;

// Enhanced output validation with flexible comparison
export function validateOutput(actual: string, expected: string): boolean {
  if (!actual && !expected) return true;
  if (!actual || !expected) return false;

  // Normalize both outputs for comparison
  const normalize = (str: string) => {
    return str
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+/g, ' ')
      .split(/\s+/)
      .map(s => {
        // Handle numbers with consistent formatting
        if (/^-?\d+\.?\d*$/.test(s)) {
          const num = parseFloat(s);
          return isNaN(num) ? s : num.toString();
        }
        return s.toLowerCase();
      })
      .join(' ');
  };

  const normalizedActual = normalize(actual);
  const normalizedExpected = normalize(expected);
  
  return normalizedActual === normalizedExpected;
}

// Backward compatibility
export function normalizeOutput(output: string): string {
  if (!output) return '';
  return output
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

// Input size validation
const MAX_INPUT_SIZE = 1024 * 1024; // 1MB

function validateInputSize(input: string) {
  if (input.length > MAX_INPUT_SIZE) {
    throw new Error('Input too large. Maximum 1MB allowed.');
  }
}

// Unicode and special character handling
function sanitizeInput(input: string): string {
  return input.replace(/[^\x00-\x7F]/g, (char) => {
    // Convert problematic Unicode to escape sequences if needed
    return char.length === 1 ? char : `\\u${char.charCodeAt(0).toString(16)}`;
  });
}

export function validateCode(code: string, languageId: number): string[] {
  const errors: string[] = [];

  if (!code || !code.trim()) {
    errors.push('Code cannot be empty');
    return errors;
  }

  if (languageId !== LANGUAGE_IDS.CPP) {
    errors.push('Only C++ is supported');
    return errors;
  }

  // Basic C++ validation
  if (!code.includes('#include')) {
    errors.push('C++ code must include necessary headers (e.g., #include <iostream>)');
  }
  
  if (!code.includes('int main')) {
    errors.push('C++ code must include a main function');
  }

  return errors;
}

// Rate limiting
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const submissions = rateLimiter.get(userId) || [];
  
  // Remove old submissions (> 1 minute)
  const recent = submissions.filter(time => now - time < 60000);
  
  if (recent.length >= 10) return false; // Max 10 per minute
  
  recent.push(now);
  rateLimiter.set(userId, recent);
  return true;
}

// Performance tracking wrapper
const trackPerformance = async (operation: string, fn: () => Promise<any>) => {
  const start = performance.now();
  try {
    const result = await fn();
    console.log(`${operation} took ${performance.now() - start}ms`);
    return result;
  } catch (error) {
    console.error(`${operation} failed:`, error);
    throw error;
  }
};

// Client-side API functions with enhanced error handling
export async function submitCode(
  sourceCode: string,
  languageId: number,
  stdin: string = '',
  expectedOutput: string = '',
  userId: string = 'guest'
): Promise<SubmissionResult> {
  return trackPerformance('submitCode', async () => {
    console.log('=== SUBMIT CODE DEBUG ===');
    console.log('Source code length:', sourceCode.length);
    console.log('Language ID:', languageId);
    console.log('STDIN length:', stdin.length);
    console.log('Expected Output length:', expectedOutput.length);

    // Rate limiting check
    if (!checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded. Maximum 10 submissions per minute.');
    }

    // Validate inputs
    if (!sourceCode || !sourceCode.trim()) {
      throw new Error('Source code cannot be empty');
    }

    if (languageId !== LANGUAGE_IDS.CPP) {
      throw new Error('Only C++ (language ID 54) is supported');
    }

    // Validate input size
    validateInputSize(sourceCode);
    validateInputSize(stdin);
    validateInputSize(expectedOutput);

    // Sanitize inputs
    const cleanedSourceCode = sanitizeInput(sourceCode.trim());
    const cleanedStdin = sanitizeInput(stdin || '');
    const cleanedExpectedOutput = sanitizeInput(expectedOutput?.trim() || '');

    try {
      const requestBody = {
        source_code: cleanedSourceCode,
        language_id: languageId,
        stdin: cleanedStdin,
        expected_output: cleanedExpectedOutput,
      };

      console.log('Submitting request to API route:', requestBody);

      const response = await fetch('/api/judge0/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('API route response:', data);

      if (!response.ok) {
        const error = new Error(data.error || `API request failed with status ${response.status}`);
        ErrorTracker.log(error, 'submitCode');
        throw error;
      }

      if (!data.token) {
        const error = new Error('No execution token received');
        ErrorTracker.log(error, 'submitCode');
        throw error;
      }

      return data;
    } catch (error) {
      ErrorTracker.log(error as Error, 'submitCode');
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  });
}

export async function getSubmissionResult(token: string): Promise<SubmissionResult> {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const response = await fetch(`/api/judge0/result?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || `Failed to get result with status ${response.status}`);
      ErrorTracker.log(error, 'getSubmissionResult');
      throw error;
    }

    console.log('Get result response:', data);
    return data;
  } catch (error) {
    ErrorTracker.log(error as Error, 'getSubmissionResult');
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}

// Enhanced retry logic with progressive backoff
export async function waitForResult(token: string, maxAttempts: number = 30): Promise<SubmissionResult> {
  let attempts = 0;
  const backoff = [1000, 1500, 2000, 3000, 5000]; // Progressive backoff
  
  console.log(`Starting to poll for result with token: ${token}`);
  
  while (attempts < maxAttempts) {
    try {
      const result = await getSubmissionResult(token);
      
      console.log(`Attempt ${attempts + 1}: Status ID = ${result.status?.id}, Description = ${result.status?.description}`);
      
      // Status IDs: 1 = In Queue, 2 = Processing, 3 = Accepted, 4+ = Various errors
      if (result.status && result.status.id !== 1 && result.status.id !== 2) {
        console.log('Execution completed with final result:', result);
        return result;
      }
      
      // Wait before next poll with progressive backoff
      const delay = backoff[Math.min(attempts, backoff.length - 1)];
      console.log(`Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
      
    } catch (error) {
      console.error(`Error on attempt ${attempts + 1}:`, error);
      
      if (attempts === maxAttempts - 1) {
        ErrorTracker.log(error as Error, 'waitForResult');
        throw new Error('Judge0 service unavailable. Please try again later.');
      }
      
      // Wait before retry on error
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
  }
  
  const timeoutError = new Error('Execution timeout. The code took too long to execute.');
  ErrorTracker.log(timeoutError, 'waitForResult');
  throw timeoutError;
}

// Test the Judge0 connection through our API route
export async function testJudge0Connection(): Promise<boolean> {
  try {
    console.log('Testing Judge0 connection via API route...');
    
    const response = await fetch('/api/judge0/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Judge0 connection test passed!');
      return true;
    } else {
      console.error('❌ Judge0 connection test failed:', data);
      ErrorTracker.log(new Error(`Connection test failed: ${data.error}`), 'testJudge0Connection');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Judge0 connection test error:', error);
    ErrorTracker.log(error as Error, 'testJudge0Connection');
    return false;
  }
}