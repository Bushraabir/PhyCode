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

// Constants
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'fba46a49a9mshe6808232641bcf3p1a2895jsn83158ac565e3';

// Language ID mapping for C++ only
export const LANGUAGE_IDS = {
  CPP: 54,
};

// InputProcessor Class
export class InputProcessor {
  static processInput(testCase: TestCase, languageId: number): ProcessedInput {
    if (languageId !== 54) {
      throw new Error('Only C++ (language ID 54) is supported');
    }
    return this.processCppInput(testCase);
  }

  private static processCppInput(testCase: TestCase): ProcessedInput {
    let stdin = testCase.inputText;
    let processedLines: string[] = [];

    const lines = stdin.split('\n').map(line => line.trim()).filter(line => line);

    for (const line of lines) {
      if (line.includes(' = ')) {
        const processed = this.processCppVariableAssignment(line);
        if (processed.length > 0) {
          processedLines.push(...processed);
        } else {
          processedLines.push(line);
        }
      } else {
        processedLines.push(line);
      }
    }

    // Handle target separately if present in inputText
    const targetMatch = stdin.match(/target\s*=\s*(-?\d+)/);
    if (targetMatch) {
      processedLines.push(targetMatch[1]);
    }

    // Log processed input for debugging
    console.log('Processed input for Judge0:', {
      rawInput: stdin,
      processed: processedLines.join('\n'),
      expectedOutput: testCase.outputText.trim()
    });

    return {
      stdin: processedLines.join('\n'),
      expectedOutput: testCase.outputText.trim()
    };
  }

  private static processCppVariableAssignment(line: string): string[] {
    const result: string[] = [];

    // Handle array assignments: nums = [2,7,11,15]
    if (line.match(/\w+\s*=\s*\[[\d,\s-]+\]/)) {
      const match = line.match(/\w+\s*=\s*\[([\d,\s-]+)\]/);
      if (match) {
        const numbers = match[1].replace(/\s/g, '').split(',').join(' ');
        result.push(numbers);
      }
    }
    // Handle matrix assignments: matrix = [[1,2,3],[4,5,6]]
    else if (line.match(/\w+\s*=\s*\[\[.*\]\]/)) {
      const match = line.match(/\w+\s*=\s*(\[\[.*\]\])/);
      if (match) {
        let matrixStr = match[1];
        const rows = matrixStr.match(/\[([^\]]+)\]/g);
        if (rows) {
          const processedRows = rows.map(row =>
            row.replace(/[\[\]]/g, '').replace(/,/g, ' ')
          );
          result.push(`${rows.length} ${processedRows[0].split(' ').length}`);
          result.push(...processedRows);
        }
      }
    }
    // Handle string assignments: s = "hello world"
    else if (line.match(/\w+\s*=\s*".*"/)) {
      const match = line.match(/\w+\s*=\s*"([^"]*)"/);
      if (match) {
        result.push(match[1]);
      }
    }
    // Handle number assignments: n = 5
    else if (line.match(/\w+\s*=\s*-?\d+/)) {
      const match = line.match(/\w+\s*=\s*(-?\d+)/);
      if (match) {
        result.push(match[1]);
      }
    }
    // Handle multiple assignments: a = 1, b = 2
    else if (line.includes(',') && line.includes('=')) {
      const assignments = line.split(',');
      for (const assignment of assignments) {
        const subResult = this.processCppVariableAssignment(assignment.trim());
        result.push(...subResult);
      }
    }

    return result;
  }

  static getCppTemplate(inputText: string): string {
    const lines = inputText.split('\n').map(line => line.trim()).filter(line => line);
    const includes: string[] = ['#include <iostream>', '#include <vector>', '#include <sstream>', '#include <limits>', 'using namespace std;'];
    const readingCode: string[] = [];

    // Check for array input like nums = [2,7,11,15]
    const hasArray = lines.some(line => line.match(/\w+\s*=\s*\[[\d,\s-]+\]/));
    // Check for target like target = 9
    const hasTarget = lines.some(line => line.match(/target\s*=\s*-?\d+/));

    if (hasArray) {
      readingCode.push('    cin.clear();');
      readingCode.push('    cin.ignore(numeric_limits<streamsize>::max(), \'\\n\');');
      readingCode.push('    string line;');
      readingCode.push('    getline(cin, line);');
      readingCode.push('    stringstream ss(line);');
      readingCode.push('    vector<int> nums;');
      readingCode.push('    int num;');
      readingCode.push('    while (ss >> num) {');
      readingCode.push('        nums.push_back(num);');
      readingCode.push('    }');
    }

    if (hasTarget) {
      readingCode.push('    cin.clear();');
      readingCode.push('    cin.ignore(numeric_limits<streamsize>::max(), \'\\n\');');
      readingCode.push('    int target;');
      readingCode.push('    cin >> target;');
    }

    return `${includes.join('\n')}

int main() {
${readingCode.length > 0 ? readingCode.join('\n') + '\n' : '    // Input variables will be available here\n'}
    // Your solution here
    cout << "Output here" << endl;
    return 0;
}`;
  }

  static getTemplate(languageId: number, inputText: string = ''): string {
    if (languageId !== 54) {
      throw new Error('Only C++ (language ID 54) is supported');
    }
    return this.getCppTemplate(inputText);
  }

  static getEnhancedTemplate(languageId: number, inputText: string, problemHints?: string[]): string {
    if (languageId !== 54) {
      throw new Error('Only C++ (language ID 54) is supported');
    }

    const baseTemplate = this.getCppTemplate(inputText);

    if (!problemHints || problemHints.length === 0) {
      return baseTemplate;
    }

    const hintComments = problemHints.map(hint => `    // Hint: ${hint}`).join('\n');
    return baseTemplate.replace('    // Your solution here', `${hintComments}\n    // Your solution here`);
  }
}

// Utility Functions
export function normalizeOutput(output: string): string {
  if (!output) return '';
  return output
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}

// Judge0 API Functions
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
      codeLength: cleanedSourceCode.length,
      stdinContent: stdin,
      expectedOutputContent: expectedOutput
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
      console.error('Judge0 API error:', {
        status: response.status,
        statusText: response.statusText,
        message: data.message
      });
      throw new Error(`API request failed with status ${response.status}: ${data.message || 'Unknown error'}`);
    }

    console.log('Judge0 submission response:', data);
    return data;
  } catch (error) {
    console.error('Judge0 submission network error:', error);
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
      console.error('Judge0 API result error:', {
        status: response.status,
        statusText: response.statusText,
        message: data.message
      });
      throw new Error(`API request failed with status ${response.status}: ${data.message || 'Unable to fetch result'}`);
    }

    console.log('Judge0 result response:', data);
    return data;
  } catch (error) {
    console.error('Judge0 result network error:', error);
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
      console.log('Final submission result:', result);
      return result;
    }
    
    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
    attempts++;
  }
  
  throw new Error('Execution timed out. Please try again.');
}