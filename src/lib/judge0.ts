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

// InputProcessor Class - COMPLETELY REWRITTEN
export class InputProcessor {
  static processInput(testCase: TestCase, languageId: number): ProcessedInput {
    if (languageId !== 54) {
      throw new Error('Only C++ (language ID 54) is supported');
    }
    return this.processCppInput(testCase);
  }

  private static processCppInput(testCase: TestCase): ProcessedInput {
    const inputText = testCase.inputText.trim();
    const processedLines: string[] = [];

    console.log('=== INPUT PROCESSING DEBUG ===');
    console.log('Original input:', inputText);

    try {
      // Parse the input text which can be in formats like:
      // "nums = [2,7,11,15]\ntarget = 9"
      // "heights = [1,8,6,2,5,4,8,3,7]"
      // "matrix = [[1,2,3],[4,5,6]]"
      // "s = "hello""
      
      const lines = inputText.split(/\\n|\n/).map(line => line.trim()).filter(line => line.length > 0);
      
      for (const line of lines) {
        console.log('Processing line:', line);
        
        if (line.includes('=')) {
          // This is an assignment line
          const processed = this.processAssignmentLine(line);
          processedLines.push(...processed);
        } else {
          // Direct value line
          processedLines.push(line);
        }
      }

      const result = {
        stdin: processedLines.join('\n'),
        expectedOutput: testCase.outputText.trim()
      };

      console.log('=== PROCESSING RESULT ===');
      console.log('Processed stdin:', result.stdin);
      console.log('Expected output:', result.expectedOutput);
      
      return result;

    } catch (error) {
      console.error('Input processing error:', error);
      // Fallback: return original input if processing fails
      return {
        stdin: inputText,
        expectedOutput: testCase.outputText.trim()
      };
    }
  }

  private static processAssignmentLine(line: string): string[] {
    const result: string[] = [];
    
    console.log('Processing assignment line:', line);

    try {
      // Handle multiple assignments: a = 1, b = 2
      if (line.includes(',') && line.split(',').length > 1) {
        const assignments = line.split(',').map(s => s.trim());
        for (const assignment of assignments) {
          result.push(...this.processSingleAssignment(assignment));
        }
        return result;
      }

      // Handle single assignment
      return this.processSingleAssignment(line);

    } catch (error) {
      console.error('Error processing assignment line:', line, error);
      return [];
    }
  }

  private static processSingleAssignment(assignment: string): string[] {
    const result: string[] = [];
    const trimmed = assignment.trim();

    console.log('Processing single assignment:', trimmed);

    try {
      // Extract variable name and value
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) return [];

      const varName = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();

      console.log('Variable:', varName, 'Value:', value);

      // 1. Handle 2D arrays/matrices: matrix = [[1,2,3],[4,5,6],[7,8,9]]
      const matrixMatch = value.match(/\[\[.*?\]\]/);
      if (matrixMatch) {
        console.log('Detected matrix:', matrixMatch[0]);
        const matrixStr = matrixMatch[0];
        
        // Extract rows using a more robust approach
        const rows: string[] = [];
        let currentRow = '';
        let bracketCount = 0;
        let inRow = false;
        
        for (let i = 0; i < matrixStr.length; i++) {
          const char = matrixStr[i];
          
          if (char === '[') {
            bracketCount++;
            if (bracketCount === 2) {
              inRow = true;
              currentRow = '';
            }
          } else if (char === ']') {
            if (inRow && bracketCount === 2) {
              rows.push(currentRow.replace(/,/g, ' ').trim());
              currentRow = '';
              inRow = false;
            }
            bracketCount--;
          } else if (inRow) {
            currentRow += char;
          }
        }
        
        if (rows.length > 0) {
          // First line: rows columns
          const cols = rows[0].split(/\s+/).length;
          result.push(`${rows.length} ${cols}`);
          // Then each row
          result.push(...rows);
        }
        
        console.log('Matrix processed to:', result);
        return result;
      }

      // 2. Handle 1D arrays: nums = [2,7,11,15] or arr = [1, 2, 3, 4]
      const arrayMatch = value.match(/\[([\d,\s.-]+)\]/);
      if (arrayMatch) {
        console.log('Detected array:', arrayMatch[0]);
        const numbersStr = arrayMatch[1];
        const numbers = numbersStr
          .split(',')
          .map(n => n.trim())
          .filter(n => n.length > 0)
          .join(' ');
        result.push(numbers);
        console.log('Array processed to:', numbers);
        return result;
      }

      // 3. Handle strings: s = "hello world" or name = "test"
      const stringMatch = value.match(/^"([^"]*)"$/);
      if (stringMatch) {
        console.log('Detected string:', stringMatch[1]);
        result.push(stringMatch[1]);
        return result;
      }

      // 4. Handle single numbers: target = 9, n = 5, x = -10
      const numberMatch = value.match(/^(-?\d+(?:\.\d+)?)$/);
      if (numberMatch) {
        console.log('Detected number:', numberMatch[1]);
        result.push(numberMatch[1]);
        return result;
      }

      // 5. Handle booleans: flag = true
      const boolMatch = value.match(/^(true|false)$/i);
      if (boolMatch) {
        console.log('Detected boolean:', boolMatch[1]);
        result.push(boolMatch[1].toLowerCase() === 'true' ? '1' : '0');
        return result;
      }

      console.warn('Could not parse assignment value:', value);
      return [];

    } catch (error) {
      console.error('Error in processSingleAssignment:', error);
      return [];
    }
  }

  static getCppTemplate(inputText: string): string {
    const lines = inputText.split(/\\n|\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Standard includes
    const includes = [
      '#include <iostream>',
      '#include <vector>',
      '#include <string>',
      '#include <sstream>',
      '#include <algorithm>',
      '#include <unordered_map>',
      '#include <unordered_set>',
      '#include <map>',
      '#include <set>',
      '#include <queue>',
      '#include <stack>',
      '#include <limits>',
      'using namespace std;'
    ];

    // Analyze input to determine what we need to read
    const readingCode: string[] = [];
    let hasArray = false;
    let hasMatrix = false;
    let hasString = false;
    let hasNumbers = false;

    for (const line of lines) {
      if (line.match(/\w+\s*=\s*\[\[.*?\]\]/)) {
        hasMatrix = true;
      } else if (line.match(/\w+\s*=\s*\[[\d,\s.-]+\]/)) {
        hasArray = true;
      } else if (line.match(/\w+\s*=\s*".*?"/)) {
        hasString = true;
      } else if (line.match(/\w+\s*=\s*-?\d+/)) {
        hasNumbers = true;
      }
    }

    console.log('Template analysis:', { hasArray, hasMatrix, hasString, hasNumbers });

    // Generate reading code based on detected patterns
    if (hasMatrix) {
      readingCode.push('    // Read matrix');
      readingCode.push('    int rows, cols;');
      readingCode.push('    cin >> rows >> cols;');
      readingCode.push('    vector<vector<int>> matrix(rows, vector<int>(cols));');
      readingCode.push('    for (int i = 0; i < rows; i++) {');
      readingCode.push('        for (int j = 0; j < cols; j++) {');
      readingCode.push('            cin >> matrix[i][j];');
      readingCode.push('        }');
      readingCode.push('    }');
      readingCode.push('');
    }

    if (hasArray && !hasMatrix) {
      readingCode.push('    // Read array from a single line');
      readingCode.push('    string line;');
      readingCode.push('    getline(cin, line);');
      readingCode.push('    if (line.empty()) getline(cin, line);');
      readingCode.push('    stringstream ss(line);');
      readingCode.push('    vector<int> nums;');
      readingCode.push('    int num;');
      readingCode.push('    while (ss >> num) {');
      readingCode.push('        nums.push_back(num);');
      readingCode.push('    }');
      readingCode.push('');
    }

    if (hasString) {
      readingCode.push('    // Read string');
      readingCode.push('    string s;');
      readingCode.push('    getline(cin, s);');
      readingCode.push('    if (s.empty()) getline(cin, s);');
      readingCode.push('');
    }

    if (hasNumbers) {
      readingCode.push('    // Read additional numbers');
      readingCode.push('    int target;');
      readingCode.push('    cin >> target;');
      readingCode.push('');
    }

    // Default template if no specific patterns detected
    if (!hasArray && !hasMatrix && !hasString && !hasNumbers) {
      readingCode.push('    // Read your input here');
      readingCode.push('    // Example: int n; cin >> n;');
      readingCode.push('');
    }

    return `${includes.join('\n')}

int main() {
${readingCode.join('\n')}    // Your solution here
    cout << "Replace this with your output" << endl;
    
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

// Client-side API functions that call our Next.js API routes
export async function submitCode(
  sourceCode: string,
  languageId: number,
  stdin: string = '',
  expectedOutput: string = ''
): Promise<SubmissionResult> {
  console.log('=== SUBMIT CODE DEBUG ===');
  console.log('Source code length:', sourceCode.length);
  console.log('Language ID:', languageId);
  console.log('STDIN:', JSON.stringify(stdin));
  console.log('Expected Output:', JSON.stringify(expectedOutput));

  // Validate inputs
  if (!sourceCode || !sourceCode.trim()) {
    throw new Error('Source code cannot be empty');
  }

  if (languageId !== LANGUAGE_IDS.CPP) {
    throw new Error('Only C++ (language ID 54) is supported');
  }

  const cleanedSourceCode = sourceCode.trim();

  try {
    const requestBody = {
      source_code: cleanedSourceCode,
      language_id: languageId,
      stdin: stdin || '',
      expected_output: expectedOutput?.trim() || '',
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
      console.error('API route error:', {
        status: response.status,
        statusText: response.statusText,
        response: data
      });
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    if (!data.token) {
      console.error('No token in response:', data);
      throw new Error('No execution token received');
    }

    return data;
  } catch (error) {
    console.error('Submit code error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
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
      console.error('Get result error:', {
        status: response.status,
        statusText: response.statusText,
        response: data
      });
      throw new Error(data.error || `Failed to get result with status ${response.status}`);
    }

    console.log('Get result response:', data);
    return data;
  } catch (error) {
    console.error('Get submission result error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}

// Helper function to wait for submission result with proper polling
export async function waitForResult(token: string, maxAttempts: number = 30): Promise<SubmissionResult> {
  let attempts = 0;
  
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
      
      // Wait before next poll (progressive backoff)
      const delay = Math.min(1000 + (attempts * 500), 3000);
      console.log(`Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
      
    } catch (error) {
      console.error(`Error on attempt ${attempts + 1}:`, error);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw error;
      }
      
      // Wait before retry on error
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  throw new Error(`Execution timeout after ${maxAttempts} attempts. Please try again.`);
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
      return false;
    }
    
  } catch (error) {
    console.error('❌ Judge0 connection test error:', error);
    return false;
  }
}