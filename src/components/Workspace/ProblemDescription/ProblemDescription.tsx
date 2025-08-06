import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem, Problem } from "@/utils/types/problem";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
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
            {loading ? <div className="w-2 h-2 bg-deepPlum rounded-full animate-pulse" /> : problem.difficulty}
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
                {liked && !updating && <AiFillLike className="text-tealBlue" />}
                {!liked && !updating && <AiFillLike />}
                {updating && <AiOutlineLoading3Quarters className="animate-spin" />}
                <span className="text-xs">{currentProblem?.likes}</span>
              </button>
              <button
                className="flex items-center space-x-1 p-1 hover:bg-deepPlum rounded transition"
                onClick={handleDislike}
              >
                {disliked && !updating && <AiFillDislike className="text-tealBlue" />}
                {!disliked && !updating && <AiFillDislike />}
                {updating && <AiOutlineLoading3Quarters className="animate-spin" />}
                <span className="text-xs">{currentProblem?.dislikes}</span>
              </button>
              <button
                className="p-1 hover:bg-deepPlum rounded transition"
                onClick={handleStar}
              >
                {starred && !updating && <AiFillStar className="text-goldenAmber" />}
                {!starred && !updating && <TiStarOutline />}
                {updating && <AiOutlineLoading3Quarters className="animate-spin" />}
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
                  <h3 className="text-softSilver font-medium">Example {index + 1}</h3>
                  {example.img && <img src={example.img} alt="" className="mt-2" />}
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

export default ProblemDescription;

function useGetCurrentProblem(problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

  useEffect(() => {
    const getCurrentProblem = async () => {
      setLoading(true);
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const problem = docSnap.data();
        setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
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
        const { solvedProblems, likedProblems, dislikedProblems, starredProblems } =
          data;
        setData({
          liked: likedProblems.includes(problemId),
          disliked: dislikedProblems.includes(problemId),
          starred: starredProblems.includes(problemId),
          solved: solvedProblems.includes(problemId),
        });
      }
    };

    if (user) getUsersDataOnProblem();
    return () => setData({ liked: false, disliked: false, starred: false, solved: false });
  }, [problemId, user]);

  return { ...data, setData };
}