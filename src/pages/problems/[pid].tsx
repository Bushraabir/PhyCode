import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Playground/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import React from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

// Define the Problem type based on Firestore data structure, aligned with Workspace.tsx
type Problem = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  constraints: string;
  dislikes: number;
  examples: Array<{
    id: string;
    inputText: string;
    outputText: string;
    explanation?: string;
    img?: string;
  }>;
  handlerFunction: string;
  likes: number;
  link: string;
  order: number;
  problemStatement: string;
  starterCode: string;
  starterFunctionName: string;
};

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
    fallback: "blocking", // Use 'blocking' to handle new problems added after build
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
  
  // Helper function to format text with proper line breaks - removed HTML strong tags
  const formatProblemStatement = (text: string): string => {
    if (!text) return "";
    
    return text
      // Convert \n\n to double line breaks for paragraphs
      .replace(/\\n\\n/g, '\n\n')
      // Convert single \n to single line breaks
      .replace(/\\n/g, '\n')
      // Keep ** formatting as is for markdown-style bold (don't convert to HTML)
      // The rendering component should handle ** formatting
      // Clean up any extra whitespace
      .trim();
  };
  
  // Helper function to format constraints text
  const formatConstraints = (text: string): string => {
    if (!text) return "";
    
    return text
      // Handle comma-separated constraints by adding line breaks
      .split(',')
      .map(constraint => constraint.trim())
      .join('\n')
      // Convert \n to proper line breaks
      .replace(/\\n/g, '\n')
      .trim();
  };
  
  // Transform examples.id from string to number
  const examples = Array.isArray(problemData.examples)
    ? problemData.examples.map((example: any, index: number) => ({
        ...example,
        id: parseInt(example.id.replace("ex-", ""), 10) || index, // e.g., "ex-1" -> 1
      }))
    : [];
  
  const problem: Problem = {
    id: problemSnap.id,
    title: problemData.title || "Untitled Problem",
    difficulty: problemData.difficulty || "Unknown",
    category: problemData.category || "Unknown",
    constraints: formatConstraints(problemData.constraints || ""),
    dislikes: problemData.dislikes || 0,
    examples,
    handlerFunction: problemData.handlerFunction || "",
    likes: problemData.likes || 0,
    link: problemData.link || "",
    order: problemData.order || 0,
    problemStatement: formatProblemStatement(problemData.problemStatement || ""),
    starterCode: formatProblemStatement(problemData.starterCode || ""),
    starterFunctionName: problemData.starterFunctionName || "",
  };
  
  return {
    props: {
      problem,
    },
    // Optionally add revalidation for ISR
    revalidate: 60, // Revalidate every 60 seconds
  };
}