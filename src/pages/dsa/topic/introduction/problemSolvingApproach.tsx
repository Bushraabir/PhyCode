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
            Hey everyone, welcome back to our DSA journey! You know that feeling when you see a new problem and your fingers are itching to start typing code right away? Yeah, I've been there, and let me tell you—it usually ends in frustration. Most of us skim the problem and dive straight in, but that's like trying to assemble a puzzle without looking at the box cover. You end up forcing pieces that don't fit!
          </p>
          <p className="text-softSilver font-sans mb-4">
            So, here's my top tip: Slow down and read the problem carefully. Not once, but at least twice. The first time, get the big picture. The second time, dive deeper. Underline or highlight the key parts—like what are the inputs? What should the output look like? And don't forget those sneaky constraints, like time limits or array sizes. They can make or break your solution.
          </p>
          <p className="text-softSilver font-sans mb-4">Instead of rushing, pause and ask yourself:</p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>What exactly is being asked here? Rephrase it in your own words.</li>
            <li>Are there any edge cases mentioned, like empty inputs or negative numbers?</li>
            <li>How does the sample input turn into the sample output?</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Let me give you a real example. Suppose the problem is: “Find the first unique character in a string.” If you rush, you might start writing loops to count frequencies. But wait—what does “unique” really mean? Does it mean it appears only once? What if the string has all duplicates? What about case sensitivity? Clarifying these upfront saves you hours of debugging later. Trust me, this step alone has turned my “impossible” problems into “oh, that's straightforward!”
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
            Alright, now that you've read it, let's make sure you really get it. I love this trick: Pretend you're explaining the problem to a 10-year-old or someone who knows nothing about coding. If you can't break it down into simple, everyday language, you probably don't understand it fully yet. This forces you to strip away the jargon and see the core.
          </p>
          <p className="text-softSilver font-sans mb-4">
            For instance, take a classic problem: “Find the maximum sum subarray.” Sounds technical, right? But in simple words: “Imagine you have a list of numbers, some positive, some negative. You need to find the continuous chunk of those numbers that adds up to the biggest total possible. Like picking the best streak in a rollercoaster of ups and downs.”
          </p>
          <p className="text-softSilver font-sans mb-4">
            Why does this help? It uncovers hidden assumptions. Maybe the array can be all negative—does that mean the max sum is the least negative number? Or zero? Simplifying reveals these questions early. Plus, it makes the problem less scary and more approachable. I've used this in interviews too—explaining out loud shows the interviewer your thought process.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Pro tip: Write your simplified version down. It becomes your roadmap for the rest of the solving process.
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
            Okay, now we're getting into the action. But hold on—don't try to be a genius right off the bat. Start with the brute force approach, the simplest, most straightforward way, even if it's not efficient. Why? Because it gets something working quickly, clears up any confusion about the logic, and gives you a baseline to improve on.
          </p>
          <p className="text-softSilver font-sans mb-4">
            This step is gold because it builds confidence. Once you have a correct (but slow) solution, you can optimize it without worrying if the core idea is wrong.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>It helps you understand the problem's requirements deeply.</li>
            <li>You can test it against sample inputs to verify.</li>
            <li>It often reveals patterns for optimization.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Back to our max subarray example: The brute force way is to check every possible subarray—start from each index, add up to every possible end, and keep track of the max sum. It's O(n²) time, which is fine for small arrays but slow for big ones. But hey, it works!
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
          <p className="text-softSilver font-sans mb-4">
            See? Simple and clear. Now, with this in hand, you're ready to make it faster.
          </p>
        </>
      ),
      icon: <Code />,
    },
    {
      title: "4. Spot Patterns & Optimize 🔍",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            This is where the magic happens, folks! With your brute force solution in place, look for ways to make it smarter. Ask yourself: Am I doing extra work? Can I reuse calculations? Is there a better way to structure this?
          </p>
          <p className="text-softSilver font-sans mb-4">
            Common questions to spark ideas:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Can I sort the data to make decisions easier?</li>
            <li>Would a hash map speed up lookups?</li>
            <li>Is this a greedy problem (pick the best option at each step)? Or does it need dynamic programming (build up solutions to subproblems)?</li>
            <li>Can divide-and-conquer split the problem in half?</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            In the max subarray case, you notice that in brute force, you're recalculating sums over and over. What if you keep a running sum and reset it when it goes negative? Boom—that's Kadane’s Algorithm, dropping it to O(n) time.
          </p>
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
          <p className="text-softSilver font-sans mb-4">
            How cool is that? Spotting these patterns comes with practice, but starting from brute force makes it easier to see the improvements.
          </p>
        </>
      ),
      icon: <Search />,
    },
    {
      title: "5. Think in Terms of Data Structures 📦",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Data structures are your tools, like a carpenter's hammer or saw. The key question is: How should I store and access this data to make operations fast and easy?
          </p>
          <p className="text-softSilver font-sans mb-4">
            Every problem hints at the right structure if you listen. For example:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>If you need super-fast lookups or to check existence, go for a HashSet or HashMap (O(1) average time).</li>
            <li>For maintaining order or priorities, think Priority Queue (heap) or Sorted Set.</li>
            <li>Dealing with LIFO (last in, first out)? Stack. FIFO? Queue.</li>
            <li>Hierarchical data? Trees. Connections? Graphs.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Let's say the problem is “Find if two words are anagrams.” Brute force: Sort both and compare. But with a HashMap, count frequencies in one and check the other—efficient and clean. Choosing the right DS can turn a messy solution into an elegant one. Remember, the goal is efficiency in time and space!
          </p>
        </>
      ),
      icon: <FileText />,
    },
    {
      title: "6. Dry Run With Small Examples ✨",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Before you hit that compile button, test your logic manually. Grab a pen and paper (or a notepad app) and walk through your algorithm with a small, simple input. This catches bugs early and builds your intuition.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Why small examples? They're quick to compute by hand and reveal flaws fast. Include edge cases too—like empty arrays, all positives, all negatives, or duplicates.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Take binary search on a sorted array [1, 3, 5, 7] looking for 5:
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
          <p className="text-softSilver font-sans mb-4">
            Now, what if target is 0? Or 8? Dry running these ensures your code handles off-by-one errors or infinite loops. It's like a dress rehearsal before the big show!
          </p>
        </>
      ),
      icon: <Lightbulb />,
    },
    {
      title: "7. Write Clean Code 🧑‍💻",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Time to code! But remember, code isn't just for computers—it's for humans too (including future you). Keep it clean, readable, and well-commented. Use meaningful variable names like maxSum instead of x.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Structure it logically: Start with the function signature, then initialize variables, then the main logic, and end with the return. Add comments explaining why, not just what. Ask: If I read this in a month, will it make sense?
          </p>
          <p className="text-softSilver font-sans mb-4">
            Clean code reduces bugs and makes debugging easier. In interviews, it shows you're professional. Don't worry about one-liners; clarity over cleverness every time.
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
            Uh oh, it didn't work? No sweat—that's normal! Debugging is part of the fun. Approach it like a detective: Gather clues, test hypotheses, eliminate suspects.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Start by printing intermediate values—see where the logic diverges from expectation. Check boundaries: What happens with empty input? Max size? Negatives?
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Use tools like debuggers to step through code.</li>
            <li>Isolate the issue: Comment out sections to find the culprit.</li>
            <li>Don't assume—test! Every bug teaches you something new.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Remember, even pros debug. It's not failure; it's refinement. Stay calm, and you'll crack it.
          </p>
        </>
      ),
      icon: <Bug />,
    },
    {
      title: "9. Learn From Patterns 📚",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            As you solve more problems, you'll notice they aren't all unique—they follow patterns! Spotting these is like unlocking cheat codes for DSA.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Common ones:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Duplicates or uniqueness? Hashing or sets.</li>
            <li>Shortest paths or connections? BFS, Dijkstra, or graphs.</li>
            <li>Optimization with choices? Greedy (local best) or DP (overlapping subproblems).</li>
            <li>Two pointers for arrays, sliding windows for subarrays.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Fun fact: Mastering about 15-20 core patterns covers 80% of LeetCode or interview questions. After each solve, ask: What pattern was this? Catalog them in a notebook. Over time, new problems will feel familiar.
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
            Finally, DSA isn't just algorithms—it's mindset training. It's about resilience, curiosity, and logical thinking that spills into real life.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Be patient: Progress is slow at first, but it compounds. Celebrate wins, like solving a medium problem without hints. Remember, every expert started as a beginner who kept going.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Practice daily, even 1 problem.</li>
            <li>Review solutions from others—learn new tricks.</li>
            <li>Don't quit when stuck; take breaks, then attack again.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            You've got this! Turn "I can't" into "How can I?" and watch yourself grow.
          </p>
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
    <div className="w-full p-8 bg-charcoalBlack text-softSilver shadow-xl rounded-lg font-sans">
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
          Hey there, fellow coders! Imagine this: You open a DSA problem on LeetCode or in an interview prep book, and your mind goes blank. “Where do I even start? This looks impossible!” Sound familiar? 
        </p>
        <p className="text-xl text-softSilver mb-4">
          Well, let me reassure you—I've been right there with you. But here's the secret: Every top engineer, contest winner, or FAANG employee felt the same at first. The key isn't some innate genius; it's a structured approach and a mindset shift.
        </p>
        <p className="text-xl text-softSilver mb-4">
          In this guide, think of me as your vlog host, walking you through my personal step-by-step process for tackling DSA problems. We'll make it fun, relatable, and packed with examples. By the end, you'll feel empowered to face any challenge. Let's dive in!
        </p>
      </motion.section>
      {/* Main Content Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-7xl mx-auto"
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
        className="mb-24 mt-12 text-center w-2/3 mx-auto"
      >
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">💡 Final Words</h1>
        <p className="text-xl text-softSilver mb-4">
          Whew, we covered a lot today! DSA isn't just about memorizing algorithms—it's about honing a superpower: Turning complex chaos into elegant solutions. These skills don't just land you jobs; they make you a better thinker in everyday life, from planning trips to optimizing your schedule.
        </p>
        <p className="text-xl text-softSilver mb-4">
          Next time a problem stumps you, don't ask: “Can I solve this?” Instead, flip it to: “How can I break this down and tackle it step by step?” That's the shift that changes everything.
        </p>
        <p className="text-xl text-softSilver mb-4">
          Thanks for hanging out with me in this vlog-style guide. If you found it helpful, drop a like or comment below. Keep practicing, stay curious, and remember—you're building something amazing. You've got this! 🚀
        </p>
        <a href="/dsa-practice" className="text-goldenAmber hover:text-tealBlue transition-colors duration-300">Start Practicing DSA Problems</a>
      </motion.section>
    </div>
  );
};

export default ProblemSolving;