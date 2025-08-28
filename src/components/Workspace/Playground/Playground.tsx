import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { cpp } from "@codemirror/lang-cpp";
import EditorFooter from "./EditorFooter";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc, runTransaction } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { 
  submitCode, 
  getSubmissionResult, 
  validateCode, 
  UniversalInputProcessor, 
  validateOutput, 
  waitForResult 
} from "@/lib/judge0";

type TestCase = {
  id: string;
  inputText: string;
  outputText: string;
  explanation?: string;
};

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  constraints: string;
  dislikes: number;
  examples: TestCase[];
  handlerFunction: string;
  likes: number;
  link: string;
  order: number;
  problemStatement: string;
  starterCode: string;
  starterFunctionName: string;
};

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
  languageId: number;
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
    languageId: 54, // Fixed to C++ only
  });
  const [user] = useAuthState(auth);
  const { query: { pid } } = useRouter();

  // Generate user-specific storage key to prevent solution leakage
  const getStorageKey = (problemId: string) => {
    if (user) {
      return `code-${user.uid}-${problemId}`;
    }
    // For guest users, use a session-specific identifier
    const guestId = sessionStorage.getItem('guest-session-id') || 
      (() => {
        const newId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('guest-session-id', newId);
        return newId;
      })();
    return `code-${guestId}-${problemId}`;
  };

  // Clean up old localStorage entries
  const cleanupOldEntries = () => {
    try {
      const keys = Object.keys(localStorage);
      const userPrefix = user ? `code-${user.uid}` : 'code-guest';
      const userKeys = keys.filter(k => k.startsWith(userPrefix));
      
      if (userKeys.length > 50) {
        // Keep only the 50 most recent entries
        const keysWithTimestamp = userKeys
          .map(key => ({
            key,
            timestamp: localStorage.getItem(`${key}-timestamp`) || '0'
          }))
          .sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
        
        // Remove old entries
        keysWithTimestamp.slice(50).forEach(({ key }) => {
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}-timestamp`);
        });
        
        console.log(`Cleaned up ${keysWithTimestamp.length - 50} old code entries`);
      }
    } catch (error) {
      console.warn('Failed to cleanup localStorage:', error);
    }
  };

  // Enhanced submission handler with better test validation
  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    // Validate code first
    const validationErrors = validateCode(userCode, settings.languageId);
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join('; '), {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    try {
      toast.info("Running all test cases...", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });

      let allTestsPassed = true;
      const results = [];
      let totalExecutionTime = 0;

      // Run all test cases with enhanced validation
      for (let i = 0; i < problem.examples.length; i++) {
        const example = problem.examples[i];
        
        try {
          // Use universal input processor
          const processed = UniversalInputProcessor.processInput(example, settings.languageId);
          
          console.log(`Running test case ${i + 1}:`, {
            input: processed.stdin,
            expected: processed.expectedOutput
          });

          const startTime = Date.now();
          
          // Submit code with user ID for rate limiting
          const submission = await submitCode(
            userCode, 
            settings.languageId, 
            processed.stdin, 
            processed.expectedOutput,
            user.uid
          );
          
          if (!submission.token) {
            throw new Error('No token received from Judge0');
          }

          // Wait for result with timeout
          const result = await waitForResult(submission.token);
          const executionTime = Date.now() - startTime;
          totalExecutionTime += executionTime;
          
          results.push({ 
            testCase: i + 1, 
            result, 
            executionTime,
            passed: false 
          });

          // Check if execution was successful
          if (result.status?.id !== 3) {
            allTestsPassed = false;
            results[i].passed = false;
            toast.error(`Test case ${i + 1} failed: ${result.status?.description || 'Execution error'}`, {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
            continue;
          }

          // Enhanced output validation
          if (result.stdout !== undefined) {
            const passed = validateOutput(result.stdout, processed.expectedOutput);
            results[i].passed = passed;
            
            if (!passed) {
              allTestsPassed = false;
              console.log(`Test case ${i + 1} output mismatch:`, {
                expected: processed.expectedOutput,
                actual: result.stdout,
                normalizedExpected: processed.expectedOutput.trim(),
                normalizedActual: result.stdout.trim()
              });
              toast.error(`Test case ${i + 1}: Wrong output`, {
                position: "top-center",
                autoClose: 3000,
                theme: "dark",
              });
            } else {
              results[i].passed = true;
            }
          } else if (processed.expectedOutput.trim()) {
            // Expected output but got none
            allTestsPassed = false;
            results[i].passed = false;
            toast.error(`Test case ${i + 1}: No output produced`, {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
          } else {
            results[i].passed = true;
          }

        } catch (error) {
          console.error(`Error in test case ${i + 1}:`, error);
          allTestsPassed = false;
          results.push({ 
            testCase: i + 1, 
            result: null, 
            executionTime: 0,
            passed: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          
          if (error instanceof Error && error.message.includes('Rate limit')) {
            toast.error('Rate limit exceeded. Please wait before submitting again.', {
              position: "top-center",
              autoClose: 5000,
              theme: "dark",
            });
            break; // Stop running further test cases
          } else {
            toast.error(`Test case ${i + 1} execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
          }
        }
      }

      // Handle final result with detailed feedback
      if (allTestsPassed) {
        toast.success("🎉 Congratulations! All tests passed!", {
          position: "top-center",
          autoClose: 4000,
          theme: "dark",
        });
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);

        // Update user's solved problems using transaction for consistency
        try {
          await runTransaction(firestore, async (transaction) => {
            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists()) {
              // Create user document if it doesn't exist
              transaction.set(userRef, {
                uid: user.uid,
                email: user.email || "",
                displayName: user.displayName || "",
                solvedProblems: [pid],
                likedProblems: [],
                dislikedProblems: [],
                starredProblems: [],
                createdAt: new Date().toISOString(),
                totalSubmissions: 1,
                successfulSubmissions: 1
              });
            } else {
              const userData = userDoc.data();
              const solvedProblems = userData.solvedProblems || [];
              
              if (!solvedProblems.includes(pid)) {
                transaction.update(userRef, {
                  solvedProblems: arrayUnion(pid),
                  totalSubmissions: (userData.totalSubmissions || 0) + 1,
                  successfulSubmissions: (userData.successfulSubmissions || 0) + 1,
                  lastSolved: new Date().toISOString()
                });
              }
            }
          });
          
          setSolved(true);
          console.log(`✅ Successfully updated solved problems for user ${user.uid}`);
          
        } catch (firestoreError) {
          console.error("Error updating solved problems:", firestoreError);
          toast.warn("Solution accepted but failed to save progress. Please refresh the page.", {
            position: "top-center",
            autoClose: 5000,
            theme: "dark",
          });
        }

        // Show performance stats
        toast.info(`Total execution time: ${totalExecutionTime}ms`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });

      } else {
        const passedCount = results.filter(r => r.passed).length;
        toast.error(`${passedCount}/${results.length} test cases passed. Please check your solution.`, {
          position: "top-center",
          autoClose: 4000,
          theme: "dark",
        });
      }

    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "An error occurred during submission", {
        position: "top-center",
        autoClose: 4000,
        theme: "dark",
      });
    }
  };

  // Load saved code from localStorage with user isolation
  useEffect(() => {
    const storageKey = getStorageKey(pid as string);
    
    try {
      const savedCode = localStorage.getItem(storageKey);
      if (savedCode) {
        const parsedCode = JSON.parse(savedCode);
        setUserCode(parsedCode);
        console.log(`Loaded saved code for user ${user?.uid || 'guest'}, problem ${pid}`);
      } else {
        setUserCode(problem.starterCode);
      }
    } catch (error) {
      console.error("Error parsing saved code:", error);
      setUserCode(problem.starterCode);
    }

    // Cleanup old entries periodically
    cleanupOldEntries();
  }, [pid, problem.starterCode, user]);

  // Save code to localStorage with user isolation and timestamp
  const onChange = (value: string) => {
    setUserCode(value);
    
    try {
      const storageKey = getStorageKey(pid as string);
      localStorage.setItem(storageKey, JSON.stringify(value));
      localStorage.setItem(`${storageKey}-timestamp`, Date.now().toString());
    } catch (error) {
      console.error("Error saving code to localStorage:", error);
      
      // Handle localStorage quota exceeded
      if (error.name === 'QuotaExceededError') {
        toast.warn("Storage limit reached. Cleaning up old data...", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        
        try {
          cleanupOldEntries();
          // Retry saving after cleanup
          const storageKey = getStorageKey(pid as string);
          localStorage.setItem(storageKey, JSON.stringify(value));
          localStorage.setItem(`${storageKey}-timestamp`, Date.now().toString());
        } catch (retryError) {
          console.error("Failed to save even after cleanup:", retryError);
          toast.error("Failed to save code. Your changes may be lost.", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
        }
      }
    }
  };

  // Validate active test case ID
  useEffect(() => {
    if (!Array.isArray(problem.examples) || problem.examples.length === 0) {
      setActiveTestCaseId(0);
    } else if (activeTestCaseId >= problem.examples.length) {
      setActiveTestCaseId(Math.max(0, problem.examples.length - 1));
    }
  }, [problem.examples, activeTestCaseId]);

  // Update settings when fontSize changes
  useEffect(() => {
    setSettings(prev => ({ ...prev, fontSize }));
  }, [fontSize]);

  // Memory cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending operations
      console.log("Playground component unmounting, cleaning up...");
    };
  }, []);

  const activeTestCase = problem.examples && problem.examples.length > 0 
    ? problem.examples[activeTestCaseId] 
    : null;

  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col">
      <PreferenceNav settings={settings} setSettings={setSettings} />
      
      <div className="flex-1 flex flex-col">
        {/* Code Editor */}
        <div className="flex-1" style={{ minHeight: '60%' }}>
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            onChange={onChange}
            extensions={[cpp()]}
            style={{ fontSize: settings.fontSize }}
            className="w-full h-full bg-deepPlum text-softSilver rounded-lg shadow-lg"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
            }}
          />
        </div>

        {/* Test Cases Section */}
        <div className="flex-shrink-0 bg-slateBlack p-4 border-t border-slate700" style={{ maxHeight: '35%', minHeight: '200px' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-softSilver">Test Cases</h3>
            {user && (
              <div className="text-xs text-gray-400">
                Saved as: {user.displayName || user.email}
              </div>
            )}
          </div>
          
          {/* Test Case Tabs */}
          <div className="flex flex-wrap gap-2 mb-3">
            {problem.examples && problem.examples.length > 0 ? (
              problem.examples.map((example, index) => (
                <button
                  key={example.id || index}
                  onClick={() => setActiveTestCaseId(index)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeTestCaseId === index
                      ? "bg-tealBlue text-white"
                      : "bg-deepPlum text-softSilver hover:bg-tealBlue hover:text-white"
                  }`}
                >
                  Case {index + 1}
                </button>
              ))
            ) : (
              <p className="text-softSilver text-sm">No test cases available.</p>
            )}
          </div>

          {/* Active Test Case Display */}
          {activeTestCase && (
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '150px' }}>
              <div>
                <p className="text-sm font-medium text-softSilver mb-1">Input:</p>
                <div className="bg-deepPlum p-2 rounded-lg text-softSilver text-sm font-mono">
                  <pre className="whitespace-pre-wrap">{activeTestCase.inputText}</pre>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-softSilver mb-1">Expected Output:</p>
                <div className="bg-deepPlum p-2 rounded-lg text-softSilver text-sm font-mono">
                  <pre className="whitespace-pre-wrap">{activeTestCase.outputText}</pre>
                </div>
              </div>

              {activeTestCase.explanation && (
                <div>
                  <p className="text-sm font-medium text-softSilver mb-1">Explanation:</p>
                  <div className="bg-deepPlum p-2 rounded-lg text-softSilver text-sm">
                    {activeTestCase.explanation}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor Footer */}
      <EditorFooter
        handleSubmit={handleSubmit}
        userCode={userCode}
        languageId={settings.languageId}
        activeTestCase={activeTestCase}
        problem={problem}
      />
    </div>
  );
};

export default Playground;