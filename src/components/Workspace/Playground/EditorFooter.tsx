import React, { useState, useEffect } from 'react';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { 
  submitCode, 
  getSubmissionResult, 
  SubmissionResult, 
  validateCode, 
  normalizeOutput, 
  InputProcessor, 
  LANGUAGE_IDS, 
  waitForResult,
  testJudge0Connection 
} from '@/lib/judge0';

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
  const [connectionTested, setConnectionTested] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');

  const effectiveCode = userCode || code || '';

  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus('testing');
        console.log('Testing Judge0 connection...');
        
        const isConnected = await testJudge0Connection();
        setConnectionTested(true);
        
        if (isConnected) {
          setConnectionStatus('connected');
          console.log('✅ Connection test passed');
        } else {
          setConnectionStatus('failed');
          setError('Judge0 connection failed. Please check your API configuration in environment variables.');
        }
      } catch (err) {
        console.error('Connection test failed:', err);
        setConnectionStatus('failed');
        setError('Failed to test Judge0 connection. Please check your network and API configuration.');
        setConnectionTested(true);
      }
    };

    testConnection();
  }, []);

  const executeCode = async (isSubmission: boolean = false) => {
    console.log('=== EXECUTION START ===');
    console.log('Is submission:', isSubmission);
    console.log('Code length:', effectiveCode.length);
    console.log('Active test case:', activeTestCase);
    console.log('Connection status:', connectionStatus);

    // Check connection status first
    if (connectionStatus === 'failed') {
      setError('Cannot execute code: Judge0 connection failed. Please refresh the page and try again.');
      setConsoleOpen(true);
      return;
    }

    if (connectionStatus === 'testing') {
      setError('Please wait for connection test to complete before running code.');
      setConsoleOpen(true);
      return;
    }

    // Validate code first
    const validationErrors = validateCode(effectiveCode, languageId);
    if (validationErrors.length > 0) {
      setError(`Validation failed: ${validationErrors.join('; ')}`);
      setConsoleOpen(true);
      return;
    }

    // Clear previous state
    setLoading(true);
    setError(null);
    setResult(null);
    setTestResult(null);
    setConsoleOpen(true); // Auto-open console when running

    try {
      let stdin = '';
      let expectedOutput = '';

      // Process test case if available
      if (activeTestCase) {
        try {
          const processed = InputProcessor.processInput(activeTestCase, languageId);
          stdin = processed.stdin;
          expectedOutput = processed.expectedOutput;
          
          console.log('=== INPUT PROCESSING ===');
          console.log('Original input:', activeTestCase.inputText);
          console.log('Processed stdin:', stdin);
          console.log('Expected output:', expectedOutput);
        } catch (processError) {
          console.error('Input processing error:', processError);
          setError(`Input processing failed: ${processError instanceof Error ? processError.message : 'Unknown error'}`);
          return;
        }
      }

      // Submit code with processed inputs
      console.log('=== SUBMITTING TO JUDGE0 VIA API ROUTE ===');
      const submission = await submitCode(effectiveCode, languageId, stdin, expectedOutput);
      
      if (!submission.token) {
        throw new Error('No execution token received from Judge0');
      }

      console.log('✅ Submission successful, token:', submission.token);

      // Wait for results
      console.log('=== WAITING FOR RESULTS ===');
      const resultData = await waitForResult(submission.token);
      
      console.log('=== EXECUTION COMPLETED ===');
      console.log('Final result:', resultData);
      setResult(resultData);

      // Determine if test case passed
      if (activeTestCase && activeTestCase.outputText && resultData.stdout) {
        const normalizedActual = normalizeOutput(resultData.stdout);
        const normalizedExpected = normalizeOutput(activeTestCase.outputText);
        
        console.log('=== OUTPUT COMPARISON ===');
        console.log('Actual (normalized):', JSON.stringify(normalizedActual));
        console.log('Expected (normalized):', JSON.stringify(normalizedExpected));
        console.log('Match:', normalizedActual === normalizedExpected);
        
        const passed = normalizedActual === normalizedExpected;
        setTestResult(passed ? 'passed' : 'failed');

        // For submissions, only call handleSubmit if test passed and execution was successful
        if (isSubmission && passed && resultData.status?.id === 3 && handleSubmit) {
          handleSubmit();
        }
      } else if (isSubmission && resultData.status?.id === 3 && handleSubmit) {
        // No test case to compare against, just check if execution was successful
        handleSubmit();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('=== EXECUTION ERROR ===', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('=== EXECUTION END ===');
    }
  };

  const handleRun = () => executeCode(false);
  const handleSubmitCode = () => executeCode(true);

  const toggleConsole = () => setConsoleOpen(!consoleOpen);

  const getStatusColor = (statusId?: number): string => {
    switch (statusId) {
      case 3: return 'text-green-400'; // Accepted
      case 4: return 'text-red-400';   // Wrong Answer
      case 5: return 'text-orange-400'; // Time Limit Exceeded
      case 6: return 'text-red-400';   // Compilation Error
      case 7: case 8: case 9: case 10: case 11: case 12:
        return 'text-red-400'; // Runtime Errors
      case 13: return 'text-yellow-400'; // Internal Error
      case 14: return 'text-yellow-400'; // Exec Format Error
      default: return 'text-softSilver';
    }
  };

  const getStatusMessage = (statusId?: number, description?: string): string => {
    if (description) return description;
    
    switch (statusId) {
      case 1: return 'In Queue';
      case 2: return 'Processing';
      case 3: return '✅ Accepted';
      case 4: return '❌ Wrong Answer';
      case 5: return '⏱️ Time Limit Exceeded';
      case 6: return '🔨 Compilation Error';
      case 7: return '💥 Runtime Error (SIGSEGV)';
      case 8: return '💥 Runtime Error (SIGXFSZ)';
      case 9: return '💥 Runtime Error (SIGFPE)';
      case 10: return '💥 Runtime Error (SIGABRT)';
      case 11: return '💥 Runtime Error (NZEC)';
      case 12: return '💥 Runtime Error (Other)';
      case 13: return '⚠️ Internal Error';
      case 14: return '⚠️ Exec Format Error';
      default: return 'Unknown Status';
    }
  };

  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case 'testing':
        return <span className="text-yellow-400">Testing connection...</span>;
      case 'connected':
        return <span className="text-green-400">●</span>;
      case 'failed':
        return <span className="text-red-400">●</span>;
      default:
        return <span className="text-gray-400">●</span>;
    }
  };

  const canRunCode = effectiveCode.trim().length > 0 && connectionStatus === 'connected' && !loading;

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
          <div className="text-xs text-gray-400 flex items-center space-x-2">
            <span>C++</span>
            {getConnectionStatusDisplay()}
          </div>
          
          <button
            onClick={handleRun}
            disabled={!canRunCode}
            className="px-3 py-1.5 bg-deepPlum text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            title={!canRunCode ? (connectionStatus !== 'connected' ? 'Waiting for connection...' : 'Enter code to run') : 'Run code'}
          >
            {loading ? 'Running...' : 'Run'}
          </button>
          
          {handleSubmit && (
            <button
              onClick={handleSubmitCode}
              disabled={!canRunCode}
              className="px-3 py-1.5 bg-emeraldGreen text-softSilver text-sm font-medium rounded-lg hover:bg-tealBlue transition focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              title={!canRunCode ? (connectionStatus !== 'connected' ? 'Waiting for connection...' : 'Enter code to submit') : 'Submit code'}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>

      {consoleOpen && (
        <div className="w-full bg-charcoalBlack text-softSilver p-4 border-t border-slate700 max-h-80 overflow-y-auto">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-tealBlue"></div>
              <p className="mt-3 text-lg">Executing your code...</p>
              <p className="text-sm text-gray-400">This may take a few seconds</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-200 font-semibold mb-2">❌ Error:</p>
              <p className="text-red-100 text-sm">{error}</p>
              {connectionStatus === 'failed' && (
                <div className="mt-3 text-xs text-red-200">
                  <p>Troubleshooting steps:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Ensure RAPIDAPI_KEY environment variable is set</li>
                    <li>Check your Judge0 API subscription status</li>
                    <li>Verify your internet connection</li>
                    <li>Try refreshing the page</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {result && !loading && (
            <div className="space-y-4">
              {/* Status Header */}
              <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <h4 className="font-bold text-lg">Execution Result</h4>
                  <span className={`font-semibold text-sm px-2 py-1 rounded ${getStatusColor(result.status?.id)}`}>
                    {getStatusMessage(result.status?.id, result.status?.description)}
                  </span>
                </div>
                
                {testResult && (
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    testResult === 'passed' 
                      ? 'bg-green-600 text-green-100' 
                      : 'bg-red-600 text-red-100'
                  }`}>
                    {testResult === 'passed' ? '✅ TEST PASSED' : '❌ TEST FAILED'}
                  </div>
                )}
              </div>

              {/* Performance Metrics */}
              {(result.time || result.memory) && (
                <div className="flex space-x-6 text-sm text-gray-300 bg-gray-800 rounded-lg p-3">
                  {result.time && (
                    <div className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>Time: {result.time}s</span>
                    </div>
                  )}
                  {result.memory && (
                    <div className="flex items-center space-x-1">
                      <span>💾</span>
                      <span>Memory: {result.memory} KB</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Test Case Input */}
              {activeTestCase && (
                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                  <p className="text-blue-300 font-semibold mb-2">📥 Test Input:</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-blue-200">Original:</p>
                      <pre className="text-blue-100 text-sm bg-blue-900/20 p-2 rounded whitespace-pre-wrap">
{activeTestCase.inputText}
                      </pre>
                    </div>
                    
                    {(() => {
                      try {
                        const processed = InputProcessor.processInput(activeTestCase, languageId);
                        if (processed.stdin !== activeTestCase.inputText) {
                          return (
                            <div>
                              <p className="text-xs text-yellow-200">Processed for C++:</p>
                              <pre className="text-yellow-100 text-sm bg-yellow-900/20 p-2 rounded whitespace-pre-wrap">
{processed.stdin}
                              </pre>
                            </div>
                          );
                        }
                      } catch (e) {
                        return null;
                      }
                      return null;
                    })()}
                  </div>
                </div>
              )}
              
              {/* Program Output */}
              {result.stdout && (
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                  <p className="text-green-300 font-semibold mb-2">📤 Your Output:</p>
                  <pre className="text-green-100 text-sm bg-green-900/20 p-2 rounded whitespace-pre-wrap">
{result.stdout}
                  </pre>
                </div>
              )}

              {/* Expected Output */}
              {activeTestCase && activeTestCase.outputText && (
                <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
                  <p className="text-purple-300 font-semibold mb-2">🎯 Expected Output:</p>
                  <pre className="text-purple-100 text-sm bg-purple-900/20 p-2 rounded whitespace-pre-wrap">
{activeTestCase.outputText}
                  </pre>
                </div>
              )}
              
              {/* Runtime Error */}
              {result.stderr && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-300 font-semibold mb-2">💥 Runtime Error:</p>
                  <pre className="text-red-100 text-sm bg-red-900/20 p-2 rounded whitespace-pre-wrap">
{result.stderr}
                  </pre>
                </div>
              )}
              
              {/* Compilation Output */}
              {result.compile_output && (
                <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
                  <p className="text-orange-300 font-semibold mb-2">🔨 Compilation Output:</p>
                  <pre className="text-orange-100 text-sm bg-orange-900/20 p-2 rounded whitespace-pre-wrap">
{result.compile_output}
                  </pre>
                </div>
              )}
              
              {/* Success with no output */}
              {!result.stdout && !result.stderr && !result.compile_output && result.status?.id === 3 && (
                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-3 text-center">
                  <p className="text-green-300">✅ Code executed successfully with no output</p>
                </div>
              )}
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && !result && (
            <div className="text-center text-gray-400 py-8 space-y-3">
              <div className="text-6xl">🚀</div>
              <div>
                <p className="text-lg font-medium">Ready to run your code!</p>
                <p className="text-sm">Click "Run" to test your solution or "Submit" when you're confident.</p>
              </div>
              <div className="text-xs space-y-1 bg-gray-800 rounded-lg p-3 max-w-md mx-auto">
                <p><span className="text-blue-400">Language:</span> C++ (GCC 9.2.0)</p>
                <p>
                  <span className="text-blue-400">Connection:</span> 
                  <span className={connectionStatus === 'connected' ? 'text-green-400' : connectionStatus === 'failed' ? 'text-red-400' : 'text-yellow-400'}>
                    {connectionStatus === 'connected' ? ' Connected ✓' : connectionStatus === 'failed' ? ' Failed ✗' : ' Testing...'}
                  </span>
                </p>
                {activeTestCase && (
                  <p className="text-green-400">
                    ✓ Test case loaded - input will be automatically formatted
                  </p>
                )}
                {!activeTestCase && (
                  <p className="text-yellow-400">
                    ⚠️ No test case selected - code will run without input
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