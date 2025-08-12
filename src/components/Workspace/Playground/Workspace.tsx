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
  dsaTag?: string[];
  phyTag?: string[];
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
  const [currentLikes, setCurrentLikes] = useState(problem.likes);
  const [currentDislikes, setCurrentDislikes] = useState(problem.dislikes);
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
          const likedProblems = userData.likedProblems || [];
          const dislikedProblems = userData.dislikedProblems || [];
          const starredProblems = userData.starredProblems || [];
          const solvedProblems = userData.solvedProblems || [];
          
          setLiked(likedProblems.includes(problem.id));
          setDisliked(dislikedProblems.includes(problem.id));
          setStarred(starredProblems.includes(problem.id));
          setSolved(solvedProblems.includes(problem.id));
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        toast.error("Failed to load user preferences", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    };

    checkUserStatus();
  }, [user, problem.id]);

  // Update local counts when problem prop changes
  useEffect(() => {
    setCurrentLikes(problem.likes);
    setCurrentDislikes(problem.dislikes);
  }, [problem.likes, problem.dislikes]);

  // Create user document if it doesn't exist
  const ensureUserDocument = async (transaction: any, userRef: any) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      transaction.set(userRef, {
        uid: user!.uid,
        email: user!.email || "",
        displayName: user!.displayName || "",
        likedProblems: [],
        dislikedProblems: [],
        starredProblems: [],
        solvedProblems: [],
        createdAt: new Date().toISOString(),
      });
      return {
        likedProblems: [],
        dislikedProblems: [],
        starredProblems: [],
        solvedProblems: [],
      };
    }
    
    return userDoc.data();
  };

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
      const problemRef = doc(firestore, "problems", problem.id);

      await runTransaction(firestore, async (transaction) => {
        const userData = await ensureUserDocument(transaction, userRef);
        const problemDoc = await transaction.get(problemRef);
        
        const problemData = problemDoc.exists() ? problemDoc.data() : {};
        
        const userLikedProblems = userData.likedProblems || [];
        const userDislikedProblems = userData.dislikedProblems || [];
        const currentProblemLikes = problemData.likes || 0;
        const currentProblemDislikes = problemData.dislikes || 0;

        const updateData: any = {};
        let likesChange = 0;
        let dislikesChange = 0;

        if (userLikedProblems.includes(problem.id)) {
          // User is unliking the problem
          updateData.likedProblems = arrayRemove(problem.id);
          likesChange = -1;
        } else {
          // User is liking the problem
          updateData.likedProblems = arrayUnion(problem.id);
          likesChange = 1;
          
          // If user had disliked, remove dislike
          if (userDislikedProblems.includes(problem.id)) {
            updateData.dislikedProblems = arrayRemove(problem.id);
            dislikesChange = -1;
          }
        }

        // Update user document
        transaction.update(userRef, updateData);
        
        // Update problem document
        transaction.update(problemRef, {
          likes: Math.max(0, currentProblemLikes + likesChange),
          dislikes: Math.max(0, currentProblemDislikes + dislikesChange),
        });
      });

      // Update local state after successful transaction
      if (liked) {
        setLiked(false);
        setCurrentLikes(prev => Math.max(0, prev - 1));
        toast.success("Like removed", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        setLiked(true);
        setCurrentLikes(prev => prev + 1);
        
        // If user was disliking, remove dislike
        if (disliked) {
          setDisliked(false);
          setCurrentDislikes(prev => Math.max(0, prev - 1));
        }
        
        toast.success("Problem liked!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }

    } catch (error) {
      console.error("Error handling like:", error);
      toast.error("Failed to update like status. Please try again.", {
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
      const problemRef = doc(firestore, "problems", problem.id);

      await runTransaction(firestore, async (transaction) => {
        const userData = await ensureUserDocument(transaction, userRef);
        const problemDoc = await transaction.get(problemRef);
        
        const problemData = problemDoc.exists() ? problemDoc.data() : {};
        
        const userLikedProblems = userData.likedProblems || [];
        const userDislikedProblems = userData.dislikedProblems || [];
        const currentProblemLikes = problemData.likes || 0;
        const currentProblemDislikes = problemData.dislikes || 0;

        const updateData: any = {};
        let likesChange = 0;
        let dislikesChange = 0;

        if (userDislikedProblems.includes(problem.id)) {
          // User is removing dislike
          updateData.dislikedProblems = arrayRemove(problem.id);
          dislikesChange = -1;
        } else {
          // User is disliking the problem
          updateData.dislikedProblems = arrayUnion(problem.id);
          dislikesChange = 1;
          
          // If user had liked, remove like
          if (userLikedProblems.includes(problem.id)) {
            updateData.likedProblems = arrayRemove(problem.id);
            likesChange = -1;
          }
        }

        // Update user document
        transaction.update(userRef, updateData);
        
        // Update problem document
        transaction.update(problemRef, {
          likes: Math.max(0, currentProblemLikes + likesChange),
          dislikes: Math.max(0, currentProblemDislikes + dislikesChange),
        });
      });

      // Update local state after successful transaction
      if (disliked) {
        setDisliked(false);
        setCurrentDislikes(prev => Math.max(0, prev - 1));
        toast.success("Dislike removed", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        setDisliked(true);
        setCurrentDislikes(prev => prev + 1);
        
        // If user was liking, remove like
        if (liked) {
          setLiked(false);
          setCurrentLikes(prev => Math.max(0, prev - 1));
        }
        
        toast.success("Problem disliked", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }

    } catch (error) {
      console.error("Error handling dislike:", error);
      toast.error("Failed to update dislike status. Please try again.", {
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
        const userData = await ensureUserDocument(transaction, userRef);
        
        const userStarredProblems = userData.starredProblems || [];
        const updateData: any = {};

        if (userStarredProblems.includes(problem.id)) {
          // Remove star
          updateData.starredProblems = arrayRemove(problem.id);
        } else {
          // Add star
          updateData.starredProblems = arrayUnion(problem.id);
        }

        // Update user document
        transaction.update(userRef, updateData);
      });

      // Update local state after successful transaction
      if (starred) {
        setStarred(false);
        toast.success("Removed from favorites", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        setStarred(true);
        toast.success("Added to favorites!", {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }

    } catch (error) {
      console.error("Error handling star:", error);
      toast.error("Failed to update favorite status. Please try again.", {
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
      case 'easy': return 'text-green-400 bg-green-400';
      case 'medium': return 'text-yellow-400 bg-yellow-400';
      case 'hard': return 'text-red-400 bg-red-400';
      default: return 'text-gray-400 bg-gray-400';
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
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-softSilver">{problem.title}</h2>
                  {solved && (
                    <BsCheck2Circle className="text-green-400 text-xl" title="Solved" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)} bg-opacity-20`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-400 px-2 py-1 bg-gray-700 rounded-md">{problem.category}</span>
                </div>
                
                {/* Tags */}
                {(problem.dsaTag || problem.phyTag) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {problem.dsaTag?.map((tag, index) => (
                      <span key={`dsa-${index}`} className="px-2 py-1 bg-blue-600 bg-opacity-20 text-blue-300 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                    {problem.phyTag?.map((tag, index) => (
                      <span key={`phy-${index}`} className="px-2 py-1 bg-purple-600 bg-opacity-20 text-purple-300 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 ml-4">
                <button 
                  onClick={handleLike}
                  disabled={updating}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    liked 
                      ? 'text-blue-400 bg-blue-400 bg-opacity-10 border border-blue-400' 
                      : 'text-softSilver hover:text-blue-400 hover:bg-blue-400 hover:bg-opacity-10 border border-transparent hover:border-blue-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={liked ? 'Unlike this problem' : 'Like this problem'}
                >
                  <AiFillLike className="text-lg" />
                  <span className="text-sm font-medium">{currentLikes}</span>
                </button>
                
                <button 
                  onClick={handleDislike}
                  disabled={updating}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    disliked 
                      ? 'text-red-400 bg-red-400 bg-opacity-10 border border-red-400' 
                      : 'text-softSilver hover:text-red-400 hover:bg-red-400 hover:bg-opacity-10 border border-transparent hover:border-red-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={disliked ? 'Remove dislike' : 'Dislike this problem'}
                >
                  <AiFillDislike className="text-lg" />
                  <span className="text-sm font-medium">{currentDislikes}</span>
                </button>
                
                <button 
                  onClick={handleStar}
                  disabled={updating}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    starred 
                      ? 'text-yellow-400 bg-yellow-400 bg-opacity-10 border border-yellow-400' 
                      : 'text-softSilver hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 border border-transparent hover:border-yellow-400'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  title={starred ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {starred ? <AiFillStar className="text-lg" /> : <TiStarOutline className="text-lg" />}
                </button>
                
                {updating && (
                  <div className="flex items-center">
                    <AiOutlineLoading3Quarters className="text-softSilver animate-spin text-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="text-softSilver space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-tealBlue">Problem Statement</h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-deepPlum bg-opacity-30 p-4 rounded-lg">
                  {problem.problemStatement}
                </div>
              </div>

              {/* Constraints */}
              {problem.constraints && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-tealBlue">Constraints</h3>
                  <div className="bg-deepPlum p-4 rounded-lg text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {problem.constraints}
                  </div>
                </div>
              )}

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-tealBlue">Examples</h3>
                  <div className="space-y-4">
                    {problem.examples.map((example: TestCase, index: number) => (
                      <div key={example.id || index} className="bg-deepPlum bg-opacity-50 p-4 rounded-lg border border-gray-600">
                        <p className="font-medium text-tealBlue mb-3">Example {index + 1}:</p>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Input:</p>
                            <pre className="bg-charcoalBlack p-3 rounded text-green-300 text-sm font-mono whitespace-pre-wrap border-l-4 border-green-400">
                              {example.inputText}
                            </pre>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-400 mb-1">Output:</p>
                            <pre className="bg-charcoalBlack p-3 rounded text-blue-300 text-sm font-mono whitespace-pre-wrap border-l-4 border-blue-400">
                              {example.outputText}
                            </pre>
                          </div>
                          
                          {example.explanation && (
                            <div>
                              <p className="text-sm font-medium text-gray-400 mb-1">Explanation:</p>
                              <div className="bg-charcoalBlack p-3 rounded text-gray-300 text-sm border-l-4 border-yellow-400">
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