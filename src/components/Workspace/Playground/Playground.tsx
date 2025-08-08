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
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { submitCode, getSubmissionResult, validateCode, InputProcessor, normalizeOutput, waitForResult } from "@/lib/judge0";

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

      // Run all test cases
      for (let i = 0; i < problem.examples.length; i++) {
        const example = problem.examples[i];
        
        try {
          // Process input for the test case
          const processed = InputProcessor.processInput(example, settings.languageId);
          
          console.log(`Running test case ${i + 1}:`, {
            input: processed.stdin,
            expected: processed.expectedOutput
          });

          // Submit code
          const submission = await submitCode(userCode, settings.languageId, processed.stdin, processed.expectedOutput);
          
          if (!submission.token) {
            throw new Error('No token received from Judge0');
          }

          // Wait for result
          const result = await waitForResult(submission.token);
          results.push({ testCase: i + 1, result });

          // Check if execution was successful
          if (result.status?.id !== 3) {
            allTestsPassed = false;
            toast.error(`Test case ${i + 1} failed: ${result.status?.description || 'Execution error'}`, {
              position: "top-center",
              autoClose: 3000,
              theme: "dark",
            });
            continue;
          }

          // Check output match
          if (result.stdout) {
            const normalizedOutput = normalizeOutput(result.stdout);
            const normalizedExpected = normalizeOutput(processed.expectedOutput);
            
            if (normalizedOutput !== normalizedExpected) {
              allTestsPassed = false;
              console.log(`Test case ${i + 1} output mismatch:`, {
                expected: normalizedExpected,
                actual: normalizedOutput
              });
            }
          } else if (processed.expectedOutput.trim()) {
            // Expected output but got none
            allTestsPassed = false;
          }

        } catch (error) {
          console.error(`Error in test case ${i + 1}:`, error);
          allTestsPassed = false;
          toast.error(`Test case ${i + 1} execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`, {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
        }
      }

      // Handle final result
      if (allTestsPassed) {
        toast.success("🎉 Congratulations! All tests passed!", {
          position: "top-center",
          autoClose: 4000,
          theme: "dark",
        });
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);

        // Update user's solved problems in Firestore
        try {
          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          });
          setSolved(true);
        } catch (firestoreError) {
          console.error("Error updating solved problems:", firestoreError);
          // Don't show error to user as the solution is still valid
        }
      } else {
        toast.error("❌ Some test cases failed. Please check your solution.", {
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

  // Load saved code from localStorage
  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}`);
    if (code) {
      try {
        const parsedCode = JSON.parse(code);
        setUserCode(parsedCode);
      } catch (error) {
        console.error("Error parsing saved code:", error);
        setUserCode(problem.starterCode);
      }
    } else {
      setUserCode(problem.starterCode);
    }
  }, [pid, problem.starterCode]);

  // Save code to localStorage on change
  const onChange = (value: string) => {
    setUserCode(value);
    try {
      localStorage.setItem(`code-${pid}`, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving code to localStorage:", error);
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
            }}
          />
        </div>

        {/* Test Cases Section */}
        <div className="flex-shrink-0 bg-slateBlack p-4 border-t border-slate700" style={{ maxHeight: '35%', minHeight: '200px' }}>
          <h3 className="text-sm font-medium text-softSilver mb-3">Test Cases</h3>
          
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