import React, { useState, useEffect } from "react";
import Split from "react-split";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/firebase/firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
  AiFillStar,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import PreferenceNav from "./Playground/PreferenceNav/PreferenceNav";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./Playground/EditorFooter";
import { useRouter } from "next/router";
import useLocalStorage from "@/hooks/useLocalStorage";

// Define the Problem type based on Firestore data structure, adjusted for Playground
type Problem = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  constraints: string;
  dislikes: number;
  examples: Array<{
    id: string; // Changed to number to match Playground expectations
    inputText: string;
    outputText: string;
    explanation?: string;
    img?: string; // Optional, as not present in Firestore data
  }>;
  handlerFunction: string;
  likes: number;
  link: string;
  order: number;
  problemStatement: string;
  starterCode: string;
  starterFunctionName: string;
};

type WorkspaceProps = {
  problem: Problem;
};

/**
 * Workspace component
 * Renders problem description on the left and code playground on the right
 * with a split-pane layout and optional confetti celebration.
 */
const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  // Get viewport dimensions for confetti canvas sizing
  const { width, height } = useWindowSize();

  // Local success state for triggering confetti
  const [success, setSuccess] = useState(false);
  // Whether the problem has been solved (passed to description)
  const [solved, setSolved] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-charcoalBlack overflow-hidden">
      <Split
        className="split h-full flex"
        sizes={[50, 50]} // initial split ratios: 50% / 50%
        minSize={300} // minimum pane width in px
        gutterSize={30} // width of draggable gutter
        gutterAlign="center"
        snapOffset={30}
        gutter={(index, direction) => {
          const gutterEl = document.createElement("div");
          gutterEl.className = `gutter gutter-${direction}`;
          gutterEl.innerHTML =
            "<div class='gutter-dots'><span></span><span></span><span></span></div>";
          return gutterEl;
        }}
      >
        {/* Left pane: Problem Description */}
        <div className="pane-left bg-slateBlack p-6 overflow-y-auto">
          <ProblemDescription problem={problem} _solved={solved} />
        </div>

        {/* Right pane: Code Playground */}
        <div className="pane-right bg-slateBlack p-6 overflow-y-auto relative">
          <Playground
            problem={problem}
            setSuccess={setSuccess}
            setSolved={setSolved}
          />

          {/* Confetti celebration on success */}
          {success && (
            <Confetti
              gravity={0.3}
              tweenDuration={4000}
              width={width / 2 - 20} // half viewport minus padding
              height={height - 94} // account for header/navbar
            />
          )}
        </div>
      </Split>

      {/* Custom styles for gutter dots */}
      <style jsx>{`
        .gutter {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1f2937;
          cursor: col-resize;
          /* match gutterSize width */
          width: 30px;
        }
        .gutter-dots {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .gutter-dots span {
          width: 6px;
          height: 6px;
          background-color: #94a3b8;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

// ProblemDescription component
type ProblemDescriptionProps = {
  problem: Problem;
  _solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  _solved,
}) => {
  const [user] = useAuthState(auth);
  const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } =
    useGetCurrentProblem(problem.id);
  const { liked, disliked, solved, setData, starred } = useGetUsersDataOnProblem(
    problem.id
  );
  const [updating, setUpdating] = useState(false);

  const returnUserDataAndProblemData = async (transaction: any) => {
    const userRef = doc(firestore, "users", user!.uid);
    const problemRef = doc(firestore, "problems", problem.id);
    const userDoc = await transaction.get(userRef);
    const problemDoc = await transaction.get(problemRef);
    return { userDoc, problemDoc, userRef, problemRef };
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
    if (updating) return;
    setUpdating(true);
    await runTransaction(firestore, async (transaction) => {
      const { problemDoc, userDoc, problemRef, userRef } =
        await returnUserDataAndProblemData(transaction);

      if (userDoc.exists() && problemDoc.exists()) {
        if (liked) {
          transaction.update(userRef, {
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes - 1,
          });

          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev.likes - 1 } : null
          );
          setData((prev) => ({ ...prev, liked: false }));
        } else if (disliked) {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
            dislikedProblems: userDoc
              .data()
              .dislikedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
            dislikes: problemDoc.data().dislikes - 1,
          });

          setCurrentProblem((prev) =>
            prev
              ? { ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 }
              : null
          );
          setData((prev) => ({ ...prev, liked: true, disliked: false }));
        } else {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
          });
          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev.likes + 1 } : null
          );
          setData((prev) => ({ ...prev, liked: true }));
        }
      }
    });
    setUpdating(false);
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
    if (updating) return;
    setUpdating(true);
    await runTransaction(firestore, async (transaction) => {
      const { problemDoc, userDoc, problemRef, userRef } =
        await returnUserDataAndProblemData(transaction);
      if (userDoc.exists() && problemDoc.exists()) {
        if (disliked) {
          transaction.update(userRef, {
            dislikedProblems: userDoc
              .data()
              .dislikedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes - 1,
          });
          setCurrentProblem((prev) =>
            prev ? { ...prev, dislikes: prev.dislikes - 1 } : null
          );
          setData((prev) => ({ ...prev, disliked: false }));
        } else if (liked) {
          transaction.update(userRef, {
            dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes + 1,
            likes: problemDoc.data().likes - 1,
          });
          setCurrentProblem((prev) =>
            prev
              ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 }
              : null
          );
          setData((prev) => ({ ...prev, disliked: true, liked: false }));
        } else {
          transaction.update(userRef, {
            dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes + 1,
          });
          setCurrentProblem((prev) =>
            prev ? { ...prev, dislikes: prev.dislikes + 1 } : null
          );
          setData((prev) => ({ ...prev, disliked: true }));
        }
      }
    });
    setUpdating(false);
  };

  const handleStar = async () => {
    if (!user) {
      toast.error("You must be logged in to star a problem", {
        position: "top-left",
        theme: "dark",
      });
      return;
    }
    if (updating) return;
    setUpdating(true);
    await runTransaction(firestore, async (transaction) => {
      const { userDoc, problemDoc, userRef, problemRef } =
        await returnUserDataAndProblemData(transaction);
      if (userDoc.exists() && problemDoc.exists()) {
        if (starred) {
          transaction.update(userRef, {
            starredProblems: userDoc
              .data()
              .starredProblems.filter((id: string) => id !== problem.id),
          });
          setData((prev) => ({ ...prev, starred: false }));
        } else {
          transaction.update(userRef, {
            starredProblems: [...userDoc.data().starredProblems, problem.id],
          });
          setData((prev) => ({ ...prev, starred: true }));
        }
      }
    });
    setUpdating(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-2 bg-charcoalBlack text-softSilver">
        <h2 className="text-lg font-heading">{problem.title}</h2>
        <div className="flex space-x-4">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              problem.difficulty === "Easy"
                ? "bg-emeraldGreen"
                : problem.difficulty === "Medium"
                ? "bg-goldenAmber"
                : "bg-crimsonRed"
            }`}
          >
            {loading ? (
              <div className="w-2 h-2 bg-deepPlum rounded-full animate-pulse" />
            ) : (
              problem.difficulty
            )}
          </span>
          {_solved && (
            <span className="inline-flex items-center px-2 py-1 bg-emeraldGreen rounded-full text-xs font-medium">
              <BsCheck2Circle className="mr-1" /> Solved
            </span>
          )}
          {!loading && user && (
            <div className="flex space-x-3">
              <button
                className="flex items-center space-x-1 p-1 hover:bg-deepPlum rounded transition"
                onClick={handleLike}
              >
                {liked && !updating && (
                  <AiFillLike className="text-tealBlue" />
                )}
                {!liked && !updating && <AiFillLike />}
                {updating && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
                <span className="text-xs">{currentProblem?.likes}</span>
              </button>
              <button
                className="flex items-center space-x-1 p-1 hover:bg-deepPlum rounded transition"
                onClick={handleDislike}
              >
                {disliked && !updating && (
                  <AiFillDislike className="text-tealBlue" />
                )}
                {!disliked && !updating && <AiFillDislike />}
                {updating && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
                <span className="text-xs">{currentProblem?.dislikes}</span>
              </button>
              <button
                className="p-1 hover:bg-deepPlum rounded transition"
                onClick={handleStar}
              >
                {starred && !updating && (
                  <AiFillStar className="text-goldenAmber" />
                )}
                {!starred && !updating && <TiStarOutline />}
                {updating && (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                )}
              </button>
            </div>
          )}
          {loading && (
            <div className="flex space-x-2">
              <RectangleSkeleton />
              <CircleSkeleton />
              <RectangleSkeleton />
            </div>
          )}
        </div>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100vh-100px)]">
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />
          {problem.examples.length > 0 && (
            <div className="mt-4">
              {problem.examples.map((example, index) => (
                <div key={example.id} className="mb-4">
                  <h3 className="text-softSilver font-medium">
                    Example {index + 1}
                  </h3>
                  {example.img && (
                    <img src={example.img} alt="" className="mt-2" />
                  )}
                  <div className="bg-deepPlum p-3 rounded-lg mt-2">
                    <pre className="text-softSilver">
                      <strong>Input:</strong> {example.inputText}
                      <br />
                      <strong>Output:</strong> {example.outputText}
                      <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-softSilver font-medium">Constraints:</h3>
            <ul className="list-disc list-inside text-softSilver">
              <div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Playground component
interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

type PlaygroundProps = {
  problem: Problem;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

const Playground: React.FC<PlaygroundProps> = ({
  problem,
  setSuccess,
  setSolved,
}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);

  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
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
      // Use the handlerFunction from the problem prop
      const handler = (window as any)[problem.handlerFunction];

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
          <h3 className="text-sm font-medium text-softSilver mb-2">
            Test Cases
          </h3>
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
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};

function useGetCurrentProblem(problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [problemDifficultyClass, setProblemDifficultyClass] =
    useState<string>("");

  useEffect(() => {
    const getCurrentProblem = async () => {
      setLoading(true);
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const problem = docSnap.data();
        // Transform examples.id from string to number
        const transformedExamples = problem.examples.map(
          (example: any, index: number) => {
            // Extract numeric part from id (e.g., "ex-1" -> 1)
            const numericId = parseInt(example.id.replace("ex-", ""), 10) || index;
            return {
              ...example,
              id: numericId,
            };
          }
        );
        setCurrentProblem({
          id: docSnap.id,
          ...problem,
          examples: transformedExamples,
        } as Problem);
        setProblemDifficultyClass(
          problem.difficulty === "Easy"
            ? "bg-emeraldGreen"
            : problem.difficulty === "Medium"
            ? "bg-goldenAmber"
            : "bg-crimsonRed"
        );
      }
      setLoading(false);
    };
    getCurrentProblem();
  }, [problemId]);

  return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUsersDataOnProblem(problemId: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false,
  });
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getUsersDataOnProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const {
          solvedProblems,
          likedProblems,
          dislikedProblems,
          starredProblems,
        } = data;
        setData({
          liked: likedProblems.includes(problemId),
          disliked: dislikedProblems.includes(problemId),
          starred: starredProblems.includes(problemId),
          solved: solvedProblems.includes(problemId),
        });
      }
    };

    if (user) getUsersDataOnProblem();
    return () =>
      setData({ liked: false, disliked: false, starred: false, solved: false });
  }, [problemId, user]);

  return { ...data, setData };
}

export default Workspace;