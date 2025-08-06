import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { Problem } from "@/utils/types/problem";
import React from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

type ProblemPageProps = {
  problem: Problem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col h-screen bg-slateBlack text-softSilver">
      <Topbar problemPage />
      <Workspace problem={problem} />
    </div>
  );
};

export default ProblemPage;

export async function getStaticPaths() {
  const problemsRef = collection(firestore, "problems");
  const querySnapshot = await getDocs(problemsRef);
  const paths = querySnapshot.docs.map((doc) => ({
    params: { pid: doc.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { pid: string } }) {
  const { pid } = params;
  const problemRef = doc(firestore, "problems", pid);
  const problemSnap = await getDoc(problemRef);

  if (!problemSnap.exists()) {
    return {
      notFound: true,
    };
  }

  const problemData = problemSnap.data();
  const examples = Array.isArray(problemData.examples) ? problemData.examples : [];

  const problem: Problem = {
    id: problemSnap.id,
    title: problemData.title || "Untitled Problem",
    problemStatement: problemData.problemStatement || "",
    examples,
    constraints: problemData.constraints || "",
    starterCode: problemData.starterCode || "",
    handlerFunction: problemData.handlerFunction || "",
    starterFunctionName: problemData.starterFunctionName || "",
  };

  return {
    props: {
      problem,
    },
  };
}