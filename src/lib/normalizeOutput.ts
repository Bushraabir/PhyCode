export interface TestCase {
  inputText: string;
  outputText: string;
}

export interface ProcessedInput {
  stdin: string;
  expectedOutput: string;
}

/**
 * Universal Input Processor for Custom Problems
 * Handles any input format and makes it user-friendly for both C++ and Python
 */
export class InputProcessor {
  
  /**
   * Process input for C++ - converts to standard input format
   */
  static processCppInput(testCase: TestCase): ProcessedInput {
    let stdin = testCase.inputText;
    let processedLines: string[] = [];
    
    // Split input into lines for processing
    const lines = stdin.split('\n').map(line => line.trim()).filter(line => line);
    
    for (const line of lines) {
      // Handle variable assignments: var = value
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

  /**
   * Process variable assignment for C++ format
   */
  private static processCppVariableAssignment(line: string): string[] {
    const result: string[] = [];
    
    // Handle arrays: nums = [1,2,3,4]
    if (line.match(/\w+\s*=\s*\[[\d,\s-]+\]/)) {
      const match = line.match(/\w+\s*=\s*\[([\d,\s-]+)\]/);
      if (match) {
        const numbers = match[1].replace(/\s/g, '').split(',').join(' ');
        result.push(numbers);
      }
    }
    
    // Handle 2D arrays/matrices: matrix = [[1,2],[3,4]]
    else if (line.match(/\w+\s*=\s*\[\[.*\]\]/)) {
      const match = line.match(/\w+\s*=\s*(\[\[.*\]\])/);
      if (match) {
        let matrixStr = match[1];
        const rows = matrixStr.match(/\[([^\]]+)\]/g);
        if (rows) {
          const processedRows = rows.map(row => 
            row.replace(/[\[\]]/g, '').replace(/,/g, ' ')
          );
          // Add dimensions first: rows cols
          result.push(`${rows.length} ${processedRows[0].split(' ').length}`);
          result.push(...processedRows);
        }
      }
    }
    
    // Handle strings: s = "hello world"
    else if (line.match(/\w+\s*=\s*".*"/)) {
      const match = line.match(/\w+\s*=\s*"([^"]*)"/);
      if (match) {
        result.push(match[1]);
      }
    }
    
    // Handle numbers: n = 5, target = 10
    else if (line.match(/\w+\s*=\s*-?\d+/)) {
      const match = line.match(/\w+\s*=\s*(-?\d+)/);
      if (match) {
        result.push(match[1]);
      }
    }
    
    // Handle multiple assignments in one line: a = 1, b = 2
    else if (line.includes(',') && line.includes('=')) {
      const assignments = line.split(',');
      for (const assignment of assignments) {
        const subResult = this.processCppVariableAssignment(assignment.trim());
        result.push(...subResult);
      }
    }
    
    return result;
  }

  /**
   * Process input for Python - creates ready-to-use variables
   */
  static processPythonInput(testCase: TestCase): ProcessedInput {
    let stdin = testCase.inputText;
    let processedLines: string[] = [];
    
    // Split input into lines for processing
    const lines = stdin.split('\n').map(line => line.trim()).filter(line => line);
    
    for (const line of lines) {
      // Handle variable assignments: var = value
      if (line.includes(' = ')) {
        const processed = this.processPythonVariableAssignment(line);
        processedLines.push(...processed);
      } else {
        // If it's not an assignment, treat as raw input
        processedLines.push(`input_line = "${line}"`);
      }
    }
    
    return {
      stdin: processedLines.join('\n'),
      expectedOutput: testCase.outputText.trim()
    };
  }

  /**
   * Process variable assignment for Python format
   */
  private static processPythonVariableAssignment(line: string): string[] {
    const result: string[] = [];
    
    // Handle arrays: nums = [1,2,3,4]
    if (line.match(/\w+\s*=\s*\[[\d,\s-]+\]/)) {
      const match = line.match(/(\w+)\s*=\s*\[([\d,\s-]+)\]/);
      if (match) {
        const [, varName, arrayContent] = match;
        result.push(`${varName} = [${arrayContent}]`);
      }
    }
    
    // Handle 2D arrays/matrices: matrix = [[1,2],[3,4]]
    else if (line.match(/\w+\s*=\s*\[\[.*\]\]/)) {
      const match = line.match(/(\w+)\s*=\s*(\[\[.*\]\])/);
      if (match) {
        const [, varName, matrixStr] = match;
        result.push(`${varName} = ${matrixStr}`);
      }
    }
    
    // Handle strings: s = "hello world"
    else if (line.match(/\w+\s*=\s*".*"/)) {
      const match = line.match(/(\w+)\s*=\s*(".*")/);
      if (match) {
        const [, varName, stringValue] = match;
        result.push(`${varName} = ${stringValue}`);
      }
    }
    
    // Handle characters: c = 'a'
    else if (line.match(/\w+\s*=\s*'.*'/)) {
      const match = line.match(/(\w+)\s*=\s*('.*')/);
      if (match) {
        const [, varName, charValue] = match;
        result.push(`${varName} = ${charValue}`);
      }
    }
    
    // Handle booleans: flag = true, isValid = false
    else if (line.match(/\w+\s*=\s*(true|false)/i)) {
      const match = line.match(/(\w+)\s*=\s*(true|false)/i);
      if (match) {
        const [, varName, boolValue] = match;
        result.push(`${varName} = ${boolValue.charAt(0).toUpperCase() + boolValue.slice(1).toLowerCase()}`);
      }
    }
    
    // Handle numbers: n = 5, target = 10
    else if (line.match(/\w+\s*=\s*-?\d+(\.\d+)?/)) {
      const match = line.match(/(\w+)\s*=\s*(-?\d+(?:\.\d+)?)/);
      if (match) {
        const [, varName, numValue] = match;
        result.push(`${varName} = ${numValue}`);
      }
    }
    
    // Handle objects/dictionaries: obj = {key: value}
    else if (line.match(/\w+\s*=\s*\{.*\}/)) {
      const match = line.match(/(\w+)\s*=\s*(\{.*\})/);
      if (match) {
        const [, varName, objValue] = match;
        // Convert to Python dictionary format
        const pythonDict = objValue.replace(/(\w+):/g, '"$1":');
        result.push(`${varName} = ${pythonDict}`);
      }
    }
    
    // Handle multiple assignments in one line: a = 1, b = 2
    else if (line.includes(',') && line.includes('=')) {
      const assignments = line.split(',');
      for (const assignment of assignments) {
        const subResult = this.processPythonVariableAssignment(assignment.trim());
        result.push(...subResult);
      }
    }
    
    // Handle custom data structures: tree = TreeNode(1)
    else if (line.match(/\w+\s*=\s*\w+\(.*\)/)) {
      result.push(line); // Keep as is for custom constructors
    }
    
    return result;
  }

  /**
   * Smart input detection and processing
   */
  static processInput(testCase: TestCase, languageId: number): ProcessedInput {
    switch (languageId) {
      case 54: // C++
        return this.processCppInput(testCase);
      case 71: // Python
        return this.processPythonInput(testCase);
      case 62: // Java
        return this.processCppInput(testCase); // Java uses similar input style
      case 63: // JavaScript
        return this.processPythonInput(testCase); // JS uses Python-like variables
      default:
        return this.processPythonInput(testCase);
    }
  }
}

/**
 * Enhanced Code Templates for Custom Problems
 */
export class CodeTemplates {
  
  /**
   * Generate C++ template based on detected input types
   */
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
    
    // Generate appropriate reading code
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

  /**
   * Generate Python template - variables are auto-available
   */
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

  /**
   * Extract variable names from input text
   */
  private static extractVariableNames(inputText: string): string[] {
    const matches = inputText.match(/(\w+)\s*=/g);
    if (!matches) return [];
    
    return matches.map(match => match.replace(/\s*=\s*$/, '').trim());
  }

  /**
   * Get appropriate template based on language and input
   */
  static getTemplate(languageId: number, inputText: string = ''): string {
    switch (languageId) {
      case 54: // C++
        return this.getCppTemplate(inputText);
      case 71: // Python
        return this.getPythonTemplate(inputText);
      case 62: // Java
        return this.getCppTemplate(inputText).replace('using namespace std;', '').replace('#include', '// #include');
      case 63: // JavaScript
        return `// Input variables are automatically parsed and ready to use\n\n// Your solution here`;
      default:
        return this.getPythonTemplate(inputText);
    }
  }

  /**
   * Detect problem complexity and suggest template enhancements
   */
  static getEnhancedTemplate(languageId: number, inputText: string, problemHints?: string[]): string {
    const baseTemplate = this.getTemplate(languageId, inputText);
    
    if (!problemHints || problemHints.length === 0) {
      return baseTemplate;
    }

    let enhancedTemplate = baseTemplate;
    
    // Add hints as comments
    if (languageId === 71) { // Python
      const hintComments = problemHints.map(hint => `# Hint: ${hint}`).join('\n');
      enhancedTemplate = enhancedTemplate.replace('# Your solution here', `${hintComments}\n\n# Your solution here`);
    } else if (languageId === 54) { // C++
      const hintComments = problemHints.map(hint => `    // Hint: ${hint}`).join('\n');
      enhancedTemplate = enhancedTemplate.replace('    // Your solution here', `${hintComments}\n    // Your solution here`);
    }

    return enhancedTemplate;
  }
}