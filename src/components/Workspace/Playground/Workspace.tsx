import React, { useState, useEffect } from "react";
import Split from "react-split";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import { auth, firestore } from "@/firebase/firebase";
import { arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { toast } from "react-toastify";
import Playground from "./Playground";

export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
  languageId: number;
}

type TestCase = {
  id: string;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
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

type WorkspaceProps = {
  problem: Problem;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  const { width, height } = useWindowSize();
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [user] = useAuthState(auth);

  // Check user's interaction status with this problem
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setLiked(false);
        setDisliked(false);
        setStarred(false);
        setSolved(false);
        return;
      }

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setLiked(userData.likedProblems?.includes(problem.id) || false);
          setDisliked(userData.dislikedProblems?.includes(problem.id) || false);
          setStarred(userData.starredProblems?.includes(problem.id) || false);
          setSolved(userData.solvedProblems?.includes(problem.id) || false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, [user, problem.id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (updating) return;
    setUpdating(true);

    try {
      const userRef = doc(firestore, "users", user.uid);
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const problemDocRef = doc(firestore, "problems", problem.id);
        const problemDoc = await transaction.get(problemDocRef);
        
        const userData = userDoc.data();
        const problemData = problemDoc.data();
        
        if (userData?.likedProblems?.includes(problem.id)) {
          // Unlike
          transaction.update(userRef, {
            likedProblems: arrayRemove(problem.id),
          });
          transaction.update(problemDocRef, {
            likes: Math.max(0, (problemData?.likes || 0) - 1),
          });
          setLiked(false);
        } else {
          // Like
          transaction.update(userRef, {
            likedProblems: arrayUnion(problem.id),
            // Remove dislike if exists
            ...(userData?.dislikedProblems?.includes(problem.id) && {
              dislikedProblems: arrayRemove(problem.id)
            })
          });
          transaction.update(problemDocRef, {
            likes: (problemData?.likes || 0) + 1,
            // Decrease dislikes if user had disliked
            ...(userData?.dislikedProblems?.includes(problem.id) && {
              dislikes: Math.max(0, (problemData?.dislikes || 0) - 1)
            })
          });
          setLiked(true);
          if (disliked) setDisliked(false);
        }
      });
    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("Failed to update like status", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike a problem", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (updating) return;
    setUpdating(true);

    try {
      const userRef = doc(firestore, "users", user.uid);
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const problemDocRef = doc(firestore, "problems", problem.id);
        const problemDoc = await transaction.get(problemDocRef);
        
        const userData = userDoc.data();
        const problemData = problemDoc.data();
        
        if (userData?.dislikedProblems?.includes(problem.id)) {
          // Remove dislike
          transaction.update(userRef, {
            dislikedProblems: arrayRemove(problem.id),
          });
          transaction.update(problemDocRef, {
            dislikes: Math.max(0, (problemData?.dislikes || 0) - 1),
          });
          setDisliked(false);
        } else {
          // Dislike
          transaction.update(userRef, {
            dislikedProblems: arrayUnion(problem.id),
            // Remove like if exists
            ...(userData?.likedProblems?.includes(problem.id) && {
              likedProblems: arrayRemove(problem.id)
            })
          });
          transaction.update(problemDocRef, {
            dislikes: (problemData?.dislikes || 0) + 1,
            // Decrease likes if user had liked
            ...(userData?.likedProblems?.includes(problem.id) && {
              likes: Math.max(0, (problemData?.likes || 0) - 1)
            })
          });
          setDisliked(true);
          if (liked) setLiked(false);
        }
      });
    } catch (error) {
      console.error("Error handling dislike:", error);
      toast.error("Failed to update dislike status", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleStar = async () => {
    if (!user) {
      toast.error("You must be logged in to star a problem", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (updating) return;
    setUpdating(true);

    try {
      const userRef = doc(firestore, "users", user.uid);
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const userData = userDoc.data();
        
        if (userData?.starredProblems?.includes(problem.id)) {
          transaction.update(userRef, {
            starredProblems: arrayRemove(problem.id),
          });
          setStarred(false);
        } else {
          transaction.update(userRef, {
            starredProblems: arrayUnion(problem.id),
          });
          setStarred(true);
        }
      });
    } catch (error) {
      console.error("Error handling star:", error);
      toast.error("Failed to update star status", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-charcoalBlack overflow-hidden">
      {success && (
        <Confetti 
          width={width} 
          height={height} 
          numberOfPieces={300} 
          recycle={false}
          gravity={0.3}
        />
      )}
      
      <Split
        className="split h-full flex"
        sizes={[50, 50]}
        minSize={300}
        maxSize={-300}
        gutterSize={6}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        {/* Problem Description Panel */}
        <div className="pane-left bg-slateBlack overflow-hidden flex flex-col">
          <div className="p-6 overflow-y-auto flex-1">
            {/* Problem Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-softSilver">{problem.title}</h2>
                  {solved && (
                    <BsCheck2Circle className="text-green-400 text-xl" title="Solved" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)} bg-opacity-20`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-400">{problem.category}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleLike}
                  disabled={updating}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                    liked ? 'text-blue-400' : 'text-softSilver hover:text-blue-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AiFillLike className="text-lg" />
                  <span className="text-sm">{problem.likes}</span>
                </button>
                
                <button 
                  onClick={handleDislike}
                  disabled={updating}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                    disliked ? 'text-red-400' : 'text-softSilver hover:text-red-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AiFillDislike className="text-lg" />
                  <span className="text-sm">{problem.dislikes}</span>
                </button>
                
                <button 
                  onClick={handleStar}
                  disabled={updating}
                  className={`p-2 rounded transition-colors ${
                    starred ? 'text-yellow-400' : 'text-softSilver hover:text-yellow-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {starred ? <AiFillStar className="text-lg" /> : <TiStarOutline className="text-lg" />}
                </button>
                
                {updating && (
                  <AiOutlineLoading3Quarters className="text-softSilver animate-spin text-lg" />
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="text-softSilver space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Problem Statement</h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {problem.problemStatement}
                </div>
              </div>

              {/* Constraints */}
              {problem.constraints && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Constraints</h3>
                  <div className="bg-deepPlum p-3 rounded-lg text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {problem.constraints}
                  </div>
                </div>
              )}

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Examples</h3>
                  <div className="space-y-4">
                    {problem.examples.map((example: TestCase, index: number) => (
                      <div key={example.id || index} className="bg-deepPlum p-4 rounded-lg">
                        <p className="font-medium text-tealBlue mb-2">Example {index + 1}:</p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Input:</p>
                            <pre className="bg-charcoalBlack p-2 rounded text-green-300 text-sm font-mono whitespace-pre-wrap">
                              {example.inputText}
                            </pre>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Output:</p>
                            <pre className="bg-charcoalBlack p-2 rounded text-blue-300 text-sm font-mono whitespace-pre-wrap">
                              {example.outputText}
                            </pre>
                          </div>
                          
                          {example.explanation && (
                            <div>
                              <p className="text-sm font-medium text-gray-400 mb-1">Explanation:</p>
                              <div className="bg-charcoalBlack p-2 rounded text-gray-300 text-sm">
                                {example.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <Playground 
          problem={problem} 
          setSuccess={setSuccess} 
          setSolved={setSolved} 
        />
      </Split>
    </div>
  );
};

export default Workspace;