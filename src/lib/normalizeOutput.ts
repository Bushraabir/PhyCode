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

    return {
      stdin: processedLines.join('\n'),
      expectedOutput: testCase.outputText.trim()
    };
  }

  private static processCppVariableAssignment(line: string): string[] {
    const result: string[] = [];

    // Handle array assignments: arr = [1, 2, 3, 4, 5]
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
    const includes: string[] = ['#include <iostream>', 'using namespace std;'];
    const readingCode: string[] = [];

    let hasNumber = false;
    let hasArray = false;
    let hasMatrix = false;
    let hasString = false;

    for (const line of lines) {
      if (line.match(/\w+\s*=\s*-?\d+/)) {
        hasNumber = true;
      } else if (line.match(/\w+\s*=\s*\[[\d,\s-]+\]/)) {
        hasArray = true;
        includes.push('#include <vector>');
      } else if (line.match(/\w+\s*=\s*\[\[.*\]\]/)) {
        hasMatrix = true;
        includes.push('#include <vector>');
      } else if (line.match(/\w+\s*=\s*".*"/)) {
        hasString = true;
        includes.push('#include <string>');
      }
    }

    const uniqueIncludes = [...new Set(includes)];

    if (hasNumber) {
      readingCode.push('    int num;');
      readingCode.push('    cin >> num;');
    }

    if (hasArray) {
      readingCode.push('    int n;');
      readingCode.push('    cin >> n;');
      readingCode.push('    vector<int> arr(n);');
      readingCode.push('    for(int i = 0; i < n; i++) {');
      readingCode.push('        cin >> arr[i];');
      readingCode.push('    }');
    }

    if (hasMatrix) {
      readingCode.push('    int rows, cols;');
      readingCode.push('    cin >> rows >> cols;');
      readingCode.push('    vector<vector<int>> matrix(rows, vector<int>(cols));');
      readingCode.push('    for(int i = 0; i < rows; i++) {');
      readingCode.push('        for(int j = 0; j < cols; j++) {');
      readingCode.push('            cin >> matrix[i][j];');
      readingCode.push('        }');
      readingCode.push('    }');
    }

    if (hasString) {
      readingCode.push('    string s;');
      readingCode.push('    getline(cin, s);');
      uniqueIncludes.push('#include <string>');
    }

    return `${uniqueIncludes.join('\n')}

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

export function normalizeOutput(output: string): string {
  if (!output) return '';
  return output
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
}