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
    <div className="bg-slateBlack text-softSilver">
      <div className="flex h-11 w-full items-center justify-between bg-charcoalBlack px-5">
        <div className="text-softSilver">{problem.title}</div>
        <div className="flex items-center space-x-4">
          <div
            className={`inline-block rounded-[21px] bg-${problemDifficultyClass} px-2.5 py-1 text-xs font-medium capitalize text-softSilver`}
          >
            {loading ? (
              <div className="h-2 w-2 rounded-full bg-dark-fill-3" />
            ) : (
              problem.difficulty
            )}
          </div>
          {_solved && (
            <div className="flex items-center space-x-1 rounded bg-emeraldGreen px-1 py-[2px] text-xs font-medium text-softSilver">
              <BsCheck2Circle />
              <span>Solved</span>
            </div>
          )}
          {!loading && user && (
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center cursor-pointer hover:bg-deepPlum space-x-1 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-softSilver"
                onClick={handleLike}
              >
                {liked && !updating && <AiFillLike className="text-tealBlue" />}
                {!liked && !updating && <AiFillLike />}
                {updating && <AiOutlineLoading3Quarters className="animate-spin" />}
                <span className="text-xs">{currentProblem?.likes}</span>
              </div>
              <div
                className="flex items-center cursor-pointer hover:bg-deepPlum space-x-1 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-softSilver"
                onClick={handleDislike}
              >
                {disliked && !updating && <AiFillDislike className="text-tealBlue" />}
                {!disliked && !updating && <AiFillDislike />}
                {updating && <AiOutlineLoading3Quarters className="animate-spin" />}
                <span className="text-xs">{currentProblem?.dislikes}</span>
              </div>
              <div
                className="cursor-pointer hover:bg-deepPlum rounded p-[3px] ml-4 text-xl transition-colors duration-200 text-softSilver"
                onClick={handleStar}
              >
                {starred && !updating && <AiFillStar className="text-goldenAmber" />}
                {!starred && !updating && <TiStarOutline />}
                {updating && <AiOutlineLoading3Quarters className="animate-spin" />}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-3 flex space-x-2">
              <RectangleSkeleton />
              <CircleSkeleton />
              <RectangleSkeleton />
              <RectangleSkeleton />
              <CircleSkeleton />
            </div>
          )}
        </div>
      </div>
      <div className="px-0 pt-4">
        <div className="px-5">
          <div className="text-white text-sm">
            <div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />
          </div>
          <div className="mt-4">
            {Array.isArray(problem.examples) && problem.examples.length > 0 ? (
              problem.examples.map((example, index) => (
                <div key={example.id}>
                  <p className="font-medium text-softSilver">Example {index + 1}: </p>
                  {example.img && <img src={example.img} alt="" className="mt-3" />}
                  <div className="example-card bg-charcoalBlack mt-2 p-4 rounded-lg">
                    <pre>
                      <strong className="text-softSilver">Input: </strong> {example.inputText}
                      <br />
                      <strong>Output:</strong>
                      {example.outputText} <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-softSilver text-sm">No examples available.</p>
            )}
          </div>
          <div className="my-8 pb-4">
            <div className="text-softSilver text-sm font-medium">Constraints:</div>
            <ul className="text-softSilver ml-5 list-disc">
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