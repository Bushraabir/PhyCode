import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Book, Lightbulb, Rocket, Code, Globe, BarChart, Pencil, Eye, Bug, Brain, Search, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';

const ProblemSolving: React.FC = () => {
  const sections = [
    {
      title: "1. Read, Don’t Rush 🚦",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Most learners jump straight into coding after skimming the problem. That’s like trying to solve a puzzle without even knowing the picture.
          </p>
          <p className="text-softSilver font-sans mb-4">Instead:</p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Read the problem twice.</li>
            <li>Underline key parts: inputs, outputs, constraints.</li>
            <li>Ask yourself: “What exactly is being asked?”</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            👉 Example: If the problem says “Find the first unique character in a string”, don’t jump to loops. First ask: What does “unique” mean here?
          </p>
        </>
      ),
      icon: <Eye />,
    },
    {
      title: "2. Break It Down Into Simpler Words ✍️",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Imagine you’re explaining the problem to a 10-year-old sibling. If you can’t explain it simply, you don’t understand it yet.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Example:<br />
            Problem: “Find the maximum sum subarray.”<br />
            Human version: “I need to find the chunk of numbers that gives the largest total when added together.”
          </p>
        </>
      ),
      icon: <Pencil />,
    },
    {
      title: "3. Start With the Brute Force 💭",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Don’t try to be clever from the start. Begin with the most obvious (even slowest) solution. This:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Clears your confusion.</li>
            <li>Gives you a working baseline.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Example: To find the max subarray sum, brute force is:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Take every possible subarray.</li>
            <li>Compute its sum.</li>
            <li>Track the maximum.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Yes, it’s slow (O(n²)), but it’s a start.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto">
              <code className="text-softSilver font-mono text-sm">
                {`// Brute Force Max Subarray Sum (O(n²))
function maxSubArraySum(arr) {
  let maxSum = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    let currentSum = 0;
    for (let j = i; j < arr.length; j++) {
      currentSum += arr[j];
      if (currentSum > maxSum) {
        maxSum = currentSum;
      }
    }
  }
  return maxSum;
}`}
              </code>
            </pre>
          </motion.div>
        </>
      ),
      icon: <Code />,
    },
    {
      title: "4. Spot Patterns & Optimize 🔍",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Now comes the fun part. Ask yourself:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Can I reuse results instead of recalculating?</li>
            <li>Can sorting or hashing help?</li>
            <li>Is there a greedy, divide-and-conquer, or dynamic programming angle?</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            For max subarray, you’ll notice:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Instead of recalculating every sum, you can build on previous results → Kadane’s Algorithm (O(n)) is born.</li>
          </ul>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto">
              <code className="text-softSilver font-mono text-sm">
                {`// Kadane’s Algorithm (O(n))
function maxSubArraySum(arr) {
  let maxCurrent = arr[0];
  let maxGlobal = arr[0];
  for (let i = 1; i < arr.length; i++) {
    maxCurrent = Math.max(arr[i], maxCurrent + arr[i]);
    if (maxCurrent > maxGlobal) {
      maxGlobal = maxCurrent;
    }
  }
  return maxGlobal;
}`}
              </code>
            </pre>
          </motion.div>
        </>
      ),
      icon: <Search />,
    },
    {
      title: "5. Think in Terms of Data Structures 📦",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Every problem is secretly asking:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Where should I store my data so I can access/update it efficiently?</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">👉 Examples:</p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Need fast lookups? → Use a HashMap.</li>
            <li>Need ordering? → Use a Tree.</li>
            <li>Need sequential processing? → Use a Queue/Stack.</li>
          </ul>
        </>
      ),
      icon: <FileText />,
    },
    {
      title: "6. Dry Run With Small Examples ✨",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Before coding, test your logic with a tiny input. Write it on paper if needed.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Example: For binary search, test with [1, 3, 5, 7] and target = 5.<br />
            Does your logic actually land on the right element?
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto">
              <code className="text-softSilver font-mono text-sm">
                {`// Binary Search Dry Run Example
Array: [1, 3, 5, 7]
Target: 5

Step 1: low=0, high=3, mid=1 (3 < 5) → low=2
Step 2: low=2, high=3, mid=2 (5 == 5) → Found at index 2`}
              </code>
            </pre>
          </motion.div>
        </>
      ),
      icon: <Lightbulb />,
    },
    {
      title: "7. Write Clean Code 🧑‍💻",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Now code. Don’t worry about fancy tricks—just make it readable and correct. Add comments for yourself. Think: “If I read this tomorrow, will I understand what I did?”
          </p>
        </>
      ),
      icon: <Code />,
    },
    {
      title: "8. Debug Like a Detective 🕵️",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            If it fails:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Print intermediate values.</li>
            <li>Check boundary cases (empty array, single element, negative numbers).</li>
            <li>Don’t panic. Every bug is feedback.</li>
          </ul>
        </>
      ),
      icon: <Bug />,
    },
    {
      title: "9. Learn From Patterns 📚",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Over time, you’ll see that problems repeat with different faces:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>“Find duplicate” → Hashing or set.</li>
            <li>“Find shortest path” → BFS/Dijkstra.</li>
            <li>“Optimize something” → Greedy or DP.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            👉 About 15–20 core patterns cover 80% of interview problems.
          </p>
        </>
      ),
      icon: <Book />,
    },
    {
      title: "10. Build the Problem-Solving Mindset 🌱",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Solving DSA isn’t just about syntax. It’s about training your brain’s muscle for logical thinking.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Be patient with yourself.</li>
            <li>Celebrate small wins.</li>
            <li>Remember: Every expert was once a beginner who refused to quit.</li>
          </ul>
        </>
      ),
      icon: <Brain />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.15, type: 'spring', stiffness: 120 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full  p-8 bg-charcoalBlack text-softSilver shadow-xl rounded-lg font-sans">
        <header className="fixed top-0 left-0 right-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
          <Navbar />
        </header>
      
      
      
      {/* Introduction Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mt-24 mb-12 text-center w-2/3 mx-auto"
      >
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">How to Solve DSA Problems: Thinking Like a Problem Solver</h1>
        <p className="text-xl text-softSilver mb-4">
          When you first open a Data Structures and Algorithms (DSA) problem, it can feel intimidating. Your brain screams:
        </p>
        <p className="text-xl text-softSilver mb-4">
          “Where do I even start? This looks impossible!”
        </p>
        <p className="text-xl text-softSilver mb-4">
          Relax. Every expert you admire today—whether they’re cracking Google interviews or winning programming contests—once felt the exact same way. The difference is not talent, it’s approach.
        </p>
        <p className="text-xl text-softSilver">
          In this article, we’ll walk through how to think about DSA problems, how to approach them step by step, and how to train your problem-solving mindset.
        </p>
      </motion.section>
      {/* Main Content Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-7xl mx-auto "
      >
        {sections.map((section, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            className="bg-slateBlack p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <motion.div
                className="mr-4 text-tealBlue"
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              >
                {section.icon}
              </motion.div>
              <h2 className="text-2xl font-heading font-semibold text-goldenAmber">{section.title}</h2>
            </div>
            <div>
              {section.content}
            </div>
          </motion.div>
        ))}
      </motion.div>
      {/* Conclusion */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mt-12 text-center"
      >
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">💡 Final Words</h1>
        <p className="text-xl text-softSilver mb-4">
          DSA isn’t just for coding interviews. It’s about learning how to think systematically, how to break chaos into order, and how to create efficient solutions.
        </p>
        <p className="text-xl text-softSilver mb-4">
          Next time you face a tough problem, don’t ask: “Can I solve this?”
        </p>
        <p className="text-xl text-softSilver mb-4">
          Instead ask: “How can I break this into smaller steps and attack it one by one?”
        </p>
        <p className="text-xl text-softSilver mb-4">
          That’s the mindset that turns learners into problem-solvers—and problem-solvers into innovators. 🚀
        </p>
        <a href="/dsa-practice" className="text-goldenAmber hover:text-tealBlue transition-colors duration-300">Start Practicing DSA Problems</a>
      </motion.section>
    </div>
  );
};

export default ProblemSolving;