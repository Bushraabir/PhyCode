import { NextApiRequest, NextApiResponse } from 'next';

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

// Language ID mapping for reference
export const LANGUAGE_IDS = {
  PYTHON: 71,
  CPP: 54,
  JAVA: 62,
  JAVASCRIPT: 63,
  C: 50
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

  if (!languageId || languageId <= 0) {
    throw new Error('Invalid language ID');
  }

  // Clean up the source code - remove any potential encoding issues
  const cleanedSourceCode = sourceCode.trim();
  
  try {
    const requestBody = {
      source_code: cleanedSourceCode,
      language_id: languageId,
      stdin: stdin || '',
      ...(expectedOutput && expectedOutput.trim() && { expected_output: expectedOutput.trim() })
    };

    console.log('Submitting to Judge0:', {
      language_id: languageId,
      source_code_length: cleanedSourceCode.length,
      has_stdin: !!stdin,
      has_expected_output: !!expectedOutput
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
      console.error('Judge0 API Error:', {
        status: response.status,
        data,
        requestBody
      });
      
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
      console.error('Judge0 Get Result Error:', {
        status: response.status,
        data,
        token
      });
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

  switch (languageId) {
    case LANGUAGE_IDS.PYTHON:
      if (code.includes('\t') && code.includes('    ')) {
        errors.push('Mixed tabs and spaces detected. Use consistent indentation.');
      }
      break;
    case LANGUAGE_IDS.CPP:
      if (!code.includes('#include') && !code.includes('int main')) {
        errors.push('C++ code should include headers and main function');
      }
      break;
  }

  return errors;
}

export interface TestCase {
  inputText: string;
  outputText: string;
}

export interface ProcessedInput {
  stdin: string;
  expectedOutput: string;
}

export class InputProcessor {
  static processCppInput(testCase: TestCase): ProcessedInput {
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
    
    return {
      stdin: processedLines.join('\n'),
      expectedOutput: testCase.outputText.trim()
    };
  }

  private static processCppVariableAssignment(line: string): string[] {
    const result: string[] = [];
    
    if (line.match(/\w+\s*=\s*\[[\d,\s-]+\]/)) {
      const match = line.match(/\w+\s*=\s*\[([\d,\s-]+)\]/);
      if (match) {
        const numbers = match[1].replace(/\s/g, '').split(',').join(' ');
        result.push(numbers);
      }
    }
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
    else if (line.match(/\w+\s*=\s*".*"/)) {
      const match = line.match(/\w+\s*=\s*"([^"]*)"/);
      if (match) {
        result.push(match[1]);
      }
    }
    else if (line.match(/\w+\s*=\s*-?\d+/)) {
      const match = line.match(/\w+\s*=\s*(-?\d+)/);
      if (match) {
        result.push(match[1]);
      }
    }
    else if (line.includes(',') && line.includes('=')) {
      const assignments = line.split(',');
      for (const assignment of assignments) {
        const subResult = this.processCppVariableAssignment(assignment.trim());
        result.push(...subResult);
      }
    }
    
    return result;
  }

  static processPythonInput(testCase: TestCase): ProcessedInput {
    let stdin = testCase.inputText;
    let processedLines: string[] = [];
    
    const lines = stdin.split('\n').map(line => line.trim()).filter(line => line);
    
    for (const line of lines) {
      if (line.includes(' = ')) {
        const processed = this.processPythonVariableAssignment(line);
        processedLines.push(...processed);
      } else {
        processedLines.push(`input_line = "${line}"`);
      }
    }
    
    return {
      stdin: processedLines.join('\n'),
      expectedOutput: testCase.outputText.trim()
    };
  }

  private static processPythonVariableAssignment(line: string): string[] {
    const result: string[] = [];
    
    if (line.match(/\w+\s*=\s*\[[\d,\s-]+\]/)) {
      const match = line.match(/(\w+)\s*=\s*\[([\d,\s-]+)\]/);
      if (match) {
        const [, varName, arrayContent] = match;
        result.push(`${varName} = [${arrayContent}]`);
      }
    }
    else if (line.match(/\w+\s*=\s*\[\[.*\]\]/)) {
      const match = line.match(/(\w+)\s*=\s*(\[\[.*\]\])/);
      if (match) {
        const [, varName, matrixStr] = match;
        result.push(`${varName} = ${matrixStr}`);
      }
    }
    else if (line.match(/\w+\s*=\s*".*"/)) {
      const match = line.match(/(\w+)\s*=\s*(".*")/);
      if (match) {
        const [, varName, stringValue] = match;
        result.push(`${varName} = ${stringValue}`);
      }
    }
    else if (line.match(/\w+\s*=\s*'.*'/)) {
      const match = line.match(/(\w+)\s*=\s*('.*')/);
      if (match) {
        const [, varName, charValue] = match;
        result.push(`${varName} = ${charValue}`);
      }
    }
    else if (line.match(/\w+\s*=\s*(true|false)/i)) {
      const match = line.match(/(\w+)\s*=\s*(true|false)/i);
      if (match) {
        const [, varName, boolValue] = match;
        result.push(`${varName} = ${boolValue.charAt(0).toUpperCase() + boolValue.slice(1).toLowerCase()}`);
      }
    }
    else if (line.match(/\w+\s*=\s*-?\d+(\.\d+)?/)) {
      const match = line.match(/(\w+)\s*=\s*(-?\d+(?:\.\d+)?)/);
      if (match) {
        const [, varName, numValue] = match;
        result.push(`${varName} = ${numValue}`);
      }
    }
    else if (line.match(/\w+\s*=\s*\{.*\}/)) {
      const match = line.match(/(\w+)\s*=\s*(\{.*\})/);
      if (match) {
        const [, varName, objValue] = match;
        const pythonDict = objValue.replace(/(\w+):/g, '"$1":');
        result.push(`${varName} = ${pythonDict}`);
      }
    }
    else if (line.includes(',') && line.includes('=')) {
      const assignments = line.split(',');
      for (const assignment of assignments) {
        const subResult = this.processPythonVariableAssignment(assignment.trim());
        result.push(...subResult);
      }
    }
    else if (line.match(/\w+\s*=\s*\w+\(.*\)/)) {
      result.push(line);
    }
    
    return result;
  }

  static processInput(testCase: TestCase, languageId: number): ProcessedInput {
    switch (languageId) {
      case 54:
        return this.processCppInput(testCase);
      case 71:
        return this.processPythonInput(testCase);
      case 62:
        return this.processCppInput(testCase);
      case 63:
        return this.processPythonInput(testCase);
      default:
        return this.processPythonInput(testCase);
    }
  }
}

export class CodeTemplates {
  static getCppTemplate(inputText: string): string {
    const hasArray = /\w+\s*=\s*\[[\d,\s-]+\]/.test(inputText);
    const hasMatrix = /\w+\s*=\s*\[\[.*\]\]/.test(inputText);
    const hasString = /\w+\s*=\s*".*"/.test(inputText);
    const hasMultipleVars = (inputText.match(/\w+\s*=/g) || []).length > 1;

    let includes = ['#include <iostream>'];
    let readingCode = [];
    
    if (hasArray || hasMatrix) {
      includes.push('#include <vector>');
      includes.push('#include <sstream>');
    }
    if (hasString) {
      includes.push('#include <string>');
    }
    
    includes.push('using namespace std;');
    
    if (hasMatrix) {
      readingCode.push('    int rows, cols;');
      readingCode.push('    cin >> rows >> cols;');
      readingCode.push('    vector<vector<int>> matrix(rows, vector<int>(cols));');
      readingCode.push('    for(int i = 0; i < rows; i++) {');
      readingCode.push('        for(int j = 0; j < cols; j++) {');
      readingCode.push('            cin >> matrix[i][j];');
      readingCode.push('        }');
      readingCode.push('    }');
    } else if (hasArray) {
      readingCode.push('    vector<int> nums;');
      readingCode.push('    string line;');
      readingCode.push('    getline(cin, line);');
      readingCode.push('    stringstream ss(line);');
      readingCode.push('    int num;');
      readingCode.push('    while(ss >> num) nums.push_back(num);');
    }
    
    if (hasString) {
      readingCode.push('    string s;');
      readingCode.push('    getline(cin, s);');
    }

    return `${includes.join('\n')}

int main() {
${readingCode.length > 0 ? readingCode.join('\n') + '\n' : '    // Input variables will be available here\n'}
    // Your solution here
    
    return 0;
}`;
  }

  static getPythonTemplate(inputText: string): string {
    const variables = this.extractVariableNames(inputText);
    
    let comments = ['# Input variables are automatically parsed and ready to use:'];
    
    if (variables.length > 0) {
      variables.forEach(varName => {
        comments.push(`# ${varName} - ready to use`);
      });
    } else {
      comments.push('# All input variables are ready to use');
    }

    return `${comments.join('\n')}

# Your solution here`;
  }

  private static extractVariableNames(inputText: string): string[] {
    const matches = inputText.match(/(\w+)\s*=/g);
    if (!matches) return [];
    
    return matches.map(match => match.replace(/\s*=\s*$/, '').trim());
  }

  static getTemplate(languageId: number, inputText: string = ''): string {
    switch (languageId) {
      case 54:
        return this.getCppTemplate(inputText);
      case 71:
        return this.getPythonTemplate(inputText);
      case 62:
        return this.getCppTemplate(inputText).replace('using namespace std;', '').replace('#include', '// #include');
      case 63:
        return `// Input variables are automatically parsed and ready to use\n\n// Your solution here`;
      default:
        return this.getPythonTemplate(inputText);
    }
  }

  static getEnhancedTemplate(languageId: number, inputText: string, problemHints?: string[]): string {
    const baseTemplate = this.getTemplate(languageId, inputText);
    
    if (!problemHints || problemHints.length === 0) {
      return baseTemplate;
    }

    let enhancedTemplate = baseTemplate;
    
    if (languageId === 71) {
      const hintComments = problemHints.map(hint => `# Hint: ${hint}`).join('\n');
      enhancedTemplate = enhancedTemplate.replace('# Your solution here', `${hintComments}\n\n# Your solution here`);
    } else if (languageId === 54) {
      const hintComments = problemHints.map(hint => `    // Hint: ${hint}`).join('\n');
      enhancedTemplate = enhancedTemplate.replace('    // Your solution here', `${hintComments}\n    // Your solution here`);
    }

    return enhancedTemplate;
  }
}

// Add the missing normalizeOutput function
export function normalizeOutput(output: string): string {
  return output.trim();
}