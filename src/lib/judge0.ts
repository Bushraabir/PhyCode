import { InputProcessor, normalizeOutput, TestCase, ProcessedInput } from './normalizeOutput';

const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'fba46a49a9mshe6808232641bcf3p1a2895jsn83158ac565e3';

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
};

export async function submitCode(
  sourceCode: string,
  languageId: number,
  stdin: string = '',
  expectedOutput: string = ''
): Promise<SubmissionResult> {
  // Validate inputs
  if (!sourceCode.trim()) {
    throw new Error('Source code cannot be empty');
  }

  if (languageId !== LANGUAGE_IDS.CPP) {
    throw new Error('Only C++ (language ID 54) is supported');
  }

  // Clean up the source code
  const cleanedSourceCode = sourceCode.trim();

  try {
    const requestBody: any = {
      source_code: cleanedSourceCode,
      language_id: languageId,
      stdin: stdin || '',
    };

    // Only add expected_output if it's provided and not empty
    if (expectedOutput && expectedOutput.trim()) {
      requestBody.expected_output = expectedOutput.trim();
    }

    console.log('Submitting to Judge0:', {
      languageId,
      hasStdin: !!stdin,
      hasExpectedOutput: !!expectedOutput,
      codeLength: cleanedSourceCode.length
    });

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

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error(`Invalid request data: ${data.message || 'Please check your code and inputs'}`);
      } else if (response.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`API request failed with status ${response.status}: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${error}`);
  }
}

export async function getSubmissionResult(token: string): Promise<SubmissionResult> {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${data.message || 'Unable to fetch result'}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${error}`);
  }
}

export function validateCode(code: string, languageId: number): string[] {
  const errors: string[] = [];

  if (!code.trim()) {
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

// Helper function to wait for submission result with proper polling
export async function waitForResult(token: string, maxAttempts: number = 30): Promise<SubmissionResult> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const result = await getSubmissionResult(token);
    
    // Check if processing is complete
    if (result.status && result.status.id !== 1 && result.status.id !== 2) {
      return result;
    }
    
    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Execution timed out. Please try again.');
}

// Re-export from normalizeOutput
export { InputProcessor, normalizeOutput, TestCase, ProcessedInput };