import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { Problem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { problems } from "@/utils/problems";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
  languageId: number; // Added to store the selected language ID
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
    languageId: 71, // Default to Python
  });
  const [user] = useAuthState(auth);
  const {
    query: { pid },
  } = useRouter();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your code", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    try {
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      const cb = new Function(`return ${userCode}`)();
      const handler = problems[pid as string]?.handlerFunction;

      if (typeof handler === "function") {
        const success = handler(cb);
        if (success) {
          toast.success("Congrats! All tests passed!", {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
          });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);

          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
          });
          setSolved(true);
        }
      } else {
        throw new Error("Handler function not found");
      }
    } catch (error: any) {
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("Oops! One or more test cases failed", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
  };

  useEffect(() => {
    const code = localStorage.getItem(`code-${pid}`);
    if (user) {
      setUserCode(code ? JSON.parse(code) : problem.starterCode);
    } else {
      setUserCode(problem.starterCode);
    }
  }, [pid, user, problem.starterCode]);

  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(`code-${pid}`, JSON.stringify(value));
  };

  useEffect(() => {
    if (!Array.isArray(problem.examples) || problem.examples.length === 0) {
      setActiveTestCaseId(0);
    } else if (activeTestCaseId >= problem.examples.length) {
      setActiveTestCaseId(problem.examples.length - 1);
    }
  }, [problem.examples, activeTestCaseId]);

  return (
    <div className="w-full h-[calc(100vh-100px)]">
      <PreferenceNav settings={settings} setSettings={setSettings} />
      <div className="h-[calc(100%-40px)] flex flex-col">
        <CodeMirror
          value={userCode}
          theme={vscodeDark}
          onChange={onChange}
          extensions={[javascript()]}
          style={{ fontSize: settings.fontSize, height: "70%" }}
          className="w-full bg-deepPlum text-softSilver rounded-lg shadow-lg mb-2"
        />
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-softSilver mb-2">Test Cases</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {problem.examples.length > 0 ? (
              problem.examples.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => setActiveTestCaseId(index)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeTestCaseId === index
                      ? "bg-tealBlue text-softSilver"
                      : "bg-deepPlum text-softSilver hover:bg-tealBlue"
                  }`}
                >
                  Case {index + 1}
                </button>
              ))
            ) : (
              <p className="text-softSilver text-sm">No test cases available.</p>
            )}
          </div>
          {problem.examples[activeTestCaseId] && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-softSilver">Input:</p>
              <div className="bg-deepPlum p-2 rounded-lg text-softSilver">
                {problem.examples[activeTestCaseId].inputText}
              </div>
              <p className="text-sm font-medium text-softSilver mt-2">Output:</p>
              <div className="bg-deepPlum p-2 rounded-lg text-softSilver">
                {problem.examples[activeTestCaseId].outputText}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Playground;