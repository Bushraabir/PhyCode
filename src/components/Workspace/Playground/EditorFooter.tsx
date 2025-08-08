import React, { useState, useEffect } from 'react';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { submitCode, getSubmissionResult, SubmissionResult, validateCode, normalizeOutput, InputProcessor, LANGUAGE_IDS, waitForResult } from '@/lib/judge0';

type TestCase = {
  id: string;
  inputText: string;
  outputText: string;
  explanation?: string;
};

type Problem = {
  id: string;
  title: string;
  examples: TestCase[];
  starterCode: string;
};

type EditorFooterProps = {
  handleSubmit?: () => void;
  code?: string;
  userCode?: string;
  languageId: number;
  activeTestCase?: TestCase | null;
  problem?: Problem;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ 
  handleSubmit, 
  code = '', 
  userCode = '',
  languageId, 
  activeTestCase,
  problem 
}) => {
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<'passed' | 'failed' | null>(null);

  const effectiveCode = userCode || code || '';

  const executeCode = async (isSubmission: boolean = false) => {
    // Validate code first
    const validationErrors = validateCode(effectiveCode, languageId);
    if (validationErrors.length > 0) {
      setError(validationErrors.join('; '));
      setConsoleOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setTestResult(null);
    setConsoleOpen(true); // Auto-open console when running

    try {
      console.log('Executing code with:', {
        languageId,
        codeLength: effectiveCode.length,
        hasTestCase: !!activeTestCase
      });

      let stdin = '';
      let expectedOutput = '';

      // Process test case if available
      if (activeTestCase) {
        const processed = InputProcessor.processInput(activeTestCase, languageId);
        stdin = processed.stdin;
        expectedOutput = processed.expectedOutput;
        
        console.log('Processed test case:', {
          originalInput: activeTestCase.inputText,
          processedStdin: stdin,
          expectedOutput: expectedOutput
        });
      }

      // Submit code with processed inputs
      const submission = await submitCode(effectiveCode, languageId, stdin, expectedOutput);
      
      if (!submission.token) {
        throw new Error('No token received from Judge0');
      }

      console.log('Submission token received:', submission.token);

      // Wait for results using the helper function
      const resultData = await waitForResult(submission.token);
      
      console.log('Execution result:', resultData);
      setResult(resultData);

      // Check if test case passed (if we have expected output)
      if (activeTestCase && activeTestCase.outputText && resultData.stdout) {
        const normalizedOutput = normalizeOutput(resultData.stdout);
        const normalizedExpected = normalizeOutput(activeTestCase.outputText);
        
        console.log('Comparing outputs:', {
          actual: normalizedOutput,
          expected: normalizedExpected,
          match: normalizedOutput === normalizedExpected
        });
        
        if (normalizedOutput === normalizedExpected) {
          setTestResult('passed');
        } else {
          setTestResult('failed');
        }
      }

      // Handle submission success
      if (isSubmission && resultData.status?.id === 3 && handleSubmit) {
        if (testResult === 'passed' || !activeTestCase) {
          handleSubmit();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Code execution error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = () => executeCode(false);
  const handleSubmitCode = () => executeCode(true);

  const toggleConsole = () => setConsoleOpen(!consoleOpen);

  const getStatusColor = (statusId?: number) => {
    switch (statusId) {
      case 3: return 'text-green-400'; // Accepted
      case 4: return 'text-red-400';   // Wrong Answer
      case 5: return 'text-red-400';   // Time Limit Exceeded
      case 6: return 'text-red-400';   // Compilation Error
      case 7: return 'text-red-400';   // Runtime Error (SIGSEGV)
      case 8: return 'text-red-400';   // Runtime Error (SIGXFSZ)
      case 9: return 'text-red-400';   // Runtime Error (SIGFPE)
      case 10: return 'text-red-400';  // Runtime Error (SIGABRT)
      case 11: return 'text-red-400';  // Runtime Error (NZEC)
      case 12: return 'text-red-400';  // Runtime Error (Other)
      case 13: return 'text-yellow-400'; // Internal Error
      case 14: return 'text-yellow-400'; // Exec Format Error
      default: return 'text-softSilver';
    }
  };

  const getLanguageName = (langId: number) => {
    switch (langId) {
      case 54: return 'C++';
      case 71: return 'Python';
      case 62: return 'Java';
      case 63: return 'JavaScript';
      case 50: return 'C';
      default: return `Language ${langId}`;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-20 bg-slateBlack border-t border-slate700">
      <div className="mx-5 my-[10px] flex justify-between items-center">
        <button
          onClick={toggleConsole}
          className="flex items-center space-x-2 px-3 py-1.5 bg-deepPlum text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition"
        >
          <span>Console</span>
          {consoleOpen ? <BsChevronUp className="fill-softSilver" /> : <BsChevronDown className="fill-softSilver" />}
        </button>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-400">
            {getLanguageName(languageId)}
          </span>
          <button
            onClick={handleRun}
            disabled={loading}
            className="px-3 py-1.5 bg-deepPlum text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Running...' : 'Run'}
          </button>
          {handleSubmit && (
            <button
              onClick={handleSubmitCode}
              disabled={loading}
              className="px-3 py-1.5 bg-emeraldGreen text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
      {consoleOpen && (
        <div className="w-full bg-charcoalBlack text-softSilver p-4 border-t border-slate700 max-h-80 overflow-y-auto">
          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-tealBlue"></div>
              <p className="mt-2">Processing your code...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900 border border-red-500 rounded p-3 mb-2">
              <p className="text-red-200 font-semibold">Error:</p>
              <p className="text-red-100">{error}</p>
            </div>
          )}
          
          {result && !loading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold">Execution Result:</h4>
                  <span className={`font-semibold ${getStatusColor(result.status?.id)}`}>
                    {result.status?.description || 'Unknown'}
                  </span>
                </div>
                {testResult && (
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    testResult === 'passed' 
                      ? 'bg-green-600 text-green-100' 
                      : 'bg-red-600 text-red-100'
                  }`}>
                    Test {testResult === 'passed' ? 'PASSED' : 'FAILED'}
                  </div>
                )}
              </div>
              
              {activeTestCase && (
                <div className="bg-gray-700 p-2 rounded text-xs">
                  <p className="text-blue-400 font-medium">Input (processed for {getLanguageName(languageId)}):</p>
                  <pre className="text-gray-300 whitespace-pre-wrap">
                    Original: {activeTestCase.inputText}
                  </pre>
                  {activeTestCase.inputText !== InputProcessor.processInput(activeTestCase, languageId).stdin && (
                    <pre className="text-yellow-300 whitespace-pre-wrap mt-1">
                      Processed: {InputProcessor.processInput(activeTestCase, languageId).stdin}
                    </pre>
                  )}
                </div>
              )}
              
              {result.stdout && (
                <div>
                  <p className="text-green-400 font-medium">Output:</p>
                  <pre className="bg-gray-800 p-2 rounded text-green-200 whitespace-pre-wrap">
                    {result.stdout}
                  </pre>
                </div>
              )}

              {activeTestCase && activeTestCase.outputText && (
                <div>
                  <p className="text-blue-400 font-medium">Expected Output:</p>
                  <pre className="bg-gray-800 p-2 rounded text-blue-200 whitespace-pre-wrap">
                    {activeTestCase.outputText}
                  </pre>
                </div>
              )}
              
              {result.stderr && (
                <div>
                  <p className="text-red-400 font-medium">Runtime Error:</p>
                  <pre className="bg-gray-800 p-2 rounded text-red-200 whitespace-pre-wrap">
                    {result.stderr}
                  </pre>
                </div>
              )}
              
              {result.compile_output && (
                <div>
                  <p className="text-yellow-400 font-medium">Compilation Output:</p>
                  <pre className="bg-gray-800 p-2 rounded text-yellow-200 whitespace-pre-wrap">
                    {result.compile_output}
                  </pre>
                </div>
              )}
              
              <div className="flex space-x-4 text-sm text-gray-400">
                {result.time && (
                  <span>⏱️ {result.time}s</span>
                )}
                {result.memory && (
                  <span>💾 {result.memory} KB</span>
                )}
              </div>
              
              {!result.stdout && !result.stderr && !result.compile_output && result.status?.id === 3 && (
                <p className="text-green-400">✓ Code executed successfully with no output</p>
              )}
            </div>
          )}
          
          {!loading && !error && !result && (
            <div className="text-center text-gray-400 space-y-2">
              <p>No results yet. Run or submit code to see output.</p>
              <div className="text-xs space-y-1">
                <p>Selected Language: {getLanguageName(languageId)}</p>
                {activeTestCase && (
                  <p className="text-blue-400">
                    ✓ Test case loaded - input will be automatically formatted for {getLanguageName(languageId)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditorFooter;