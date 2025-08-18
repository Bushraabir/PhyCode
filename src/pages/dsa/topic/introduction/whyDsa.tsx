import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Code, Book, Rocket, Lightbulb, BarChart, Globe } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);
const WhyDSA: React.FC = () => {
  const sections = [
    {
      title: "1. Foundation of Computer Science",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            DSA teaches you how data is stored, organized, and processed. Instead of treating programming as a set of random tricks, you start to understand the logic behind the machine. With DSA, you gain the ability to think like a computer scientist, not just a coder.
          </p>
        </>
      ),
      icon: <Book />,
    },
    {
      title: "2. Problem-Solving Superpower",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Learning DSA sharpens your analytical thinking. It enables you to break down large, complex problems into smaller, manageable steps.
          </p>
          <p className="text-softSilver font-sans mb-4">
            For example:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Linear search → checking every element one by one (slow).</li>
            <li>Binary search → repeatedly dividing the dataset in half (much faster).</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            This skill isn’t limited to programming—it translates into solving real-life challenges efficiently.
          </p>
          <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto mb-4">
            <code className="text-softSilver font-mono text-sm">
              {`// Linear Search (O(n))
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
// Binary Search (O(log n))
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`}
            </code>
          </pre>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <Line
              data={{
                labels: Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
                datasets: [
                  {
                    label: 'Linear Search (O(n))',
                    data: Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
                    borderColor: '#FDC57B', // goldenAmber
                    backgroundColor: 'rgba(253, 197, 123, 0.5)',
                  },
                  {
                    label: 'Binary Search (O(log n))',
                    data: Array.from({ length: 20 }, (_, i) => Math.log2((i + 1) * 50)),
                    borderColor: '#007880', // tealBlue
                    backgroundColor: 'rgba(0, 120, 128, 0.5)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: '#E8ECEF' } },
                  title: { display: true, text: 'Time Complexity Comparison', color: '#E8ECEF' },
                },
                scales: {
                  x: { ticks: { color: '#E8ECEF' } },
                  y: { ticks: { color: '#E8ECEF' } },
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuad',
                },
              }}
            />
          </motion.div>
        </>
      ),
      icon: <Lightbulb />,
    },
    {
      title: "3. Crucial for Technical Interviews",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Top tech companies like Google, Meta, Amazon, and Microsoft emphasize DSA in interviews.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Around 70–80% of coding interview questions are based on arrays, strings, linked lists, trees, graphs, and dynamic programming.</li>
            <li>Mastering DSA can dramatically increase your chances of standing out and landing your dream job.</li>
          </ul>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <Bar
              data={{
                labels: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming'],
                datasets: [
                  {
                    label: 'Percentage of Interviews',
                    data: [75, 75, 75, 75, 75, 75],
                    backgroundColor: [
                      'rgba(253, 197, 123, 0.5)', // goldenAmber variant
                      'rgba(0, 120, 128, 0.5)', // tealBlue variant
                      'rgba(98, 55, 78, 0.5)', // deepPlum variant
                      'rgba(46, 204, 113, 0.5)', // emeraldGreen variant
                      'rgba(244, 162, 97, 0.5)', // softOrange variant
                      'rgba(230, 57, 70, 0.5)', // crimsonRed variant
                    ],
                    borderColor: [
                      '#FDC57B',
                      '#007880',
                      '#62374E',
                      '#2ECC71',
                      '#F4A261',
                      '#E63946',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: '#E8ECEF' } },
                  title: { display: true, text: 'Common DSA Topics in Interviews', color: '#E8ECEF' },
                },
                scales: {
                  x: { ticks: { color: '#E8ECEF' } },
                  y: { ticks: { color: '#E8ECEF' } },
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuad',
                },
              }}
            />
          </motion.div>
        </>
      ),
      icon: <Code />,
    },
    {
      title: "4. Efficient and Scalable Code",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            In the real world, efficiency matters. A program that runs in 2 seconds instead of 2 minutes can save enormous costs when scaled to millions of users.
          </p>
          <p className="text-softSilver font-sans mb-4">
            DSA teaches you how to write code that:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Runs faster (better time complexity).</li>
            <li>Consumes less memory (optimized space complexity).</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            This efficiency is crucial for projects like NASA simulations, Google Search, and large-scale AI systems.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <Line
              data={{
                labels: Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
                datasets: [
                  {
                    label: 'Linear Search (O(n))',
                    data: Array.from({ length: 20 }, (_, i) => (i + 1) * 50),
                    borderColor: '#FDC57B', // goldenAmber
                    backgroundColor: 'rgba(253, 197, 123, 0.5)',
                  },
                  {
                    label: 'Binary Search (O(log n))',
                    data: Array.from({ length: 20 }, (_, i) => Math.log2((i + 1) * 50)),
                    borderColor: '#007880', // tealBlue
                    backgroundColor: 'rgba(0, 120, 128, 0.5)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: '#E8ECEF' } },
                  title: { display: true, text: 'Time Complexity Comparison', color: '#E8ECEF' },
                },
                scales: {
                  x: { ticks: { color: '#E8ECEF' } },
                  y: { ticks: { color: '#E8ECEF' } },
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuad',
                },
              }}
            />
          </motion.div>
        </>
      ),
      icon: <Rocket />,
    },
    {
      title: "5. Competitive Programming and Research",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            If you dream of competing in ICPC, Codeforces, or LeetCode contests, DSA is your strongest weapon.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Beyond competitions, DSA forms the backbone of advanced fields like:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Artificial Intelligence (AI)</li>
            <li>Machine Learning (ML)</li>
            <li>Cryptography</li>
            <li>Networking</li>
            <li>Operating Systems</li>
          </ul>
        </>
      ),
      icon: <Book />,
    },
    {
      title: "6. Real-World Applications",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            You already use technologies built on DSA every day:
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Search engines → Graphs + search algorithms.</li>
            <li>Social media → Graph theory for networks of friends.</li>
            <li>GPS navigation → Dijkstra’s algorithm for shortest paths.</li>
            <li>Databases → B-trees for fast indexing.</li>
            <li>Cybersecurity → Hashing and encryption algorithms.</li>
          </ul>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <Bar
              data={{
                labels: ['Search Engines', 'Social Networks', 'GPS Apps', 'Databases', 'Machine Learning'],
                datasets: [
                  {
                    label: 'Relevance Score (Illustrative)',
                    data: [90, 85, 80, 95, 88],
                    backgroundColor: 'rgba(46, 204, 113, 0.5)', // emeraldGreen variant
                    borderColor: '#2ECC71',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: '#E8ECEF' } },
                  title: { display: true, text: 'DSA in Real-World Applications', color: '#E8ECEF' },
                },
                scales: {
                  x: { ticks: { color: '#E8ECEF' } },
                  y: { ticks: { color: '#E8ECEF' } },
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuad',
                },
              }}
            />
          </motion.div>
        </>
      ),
      icon: <Globe />,
    },
    {
      title: "7. Career Growth and Salary Advantage",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Strong DSA skills don’t just help in getting jobs—they also boost career growth. Studies show developers with DSA expertise often earn 10–20% higher salaries because companies trust them to solve critical and complex problems.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <Bar
              data={{
                labels: ['With DSA Expertise', 'Without DSA Expertise'],
                datasets: [
                  {
                    label: 'Relative Salary (%)',
                    data: [115, 100],
                    backgroundColor: ['rgba(0, 120, 128, 0.5)', 'rgba(253, 197, 123, 0.5)'],
                    borderColor: ['#007880', '#FDC57B'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: '#E8ECEF' } },
                  title: { display: true, text: 'Salary Advantage with DSA Skills', color: '#E8ECEF' },
                },
                scales: {
                  x: { ticks: { color: '#E8ECEF' } },
                  y: { ticks: { color: '#E8ECEF' } },
                },
                animation: {
                  duration: 2000,
                  easing: 'easeInOutQuad',
                },
              }}
            />
          </motion.div>
        </>
      ),
      icon: <BarChart />,
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
    <div className="w-full mx-auto p-8 bg-charcoalBlack text-softSilver shadow-xl rounded-lg font-sans">
      {/* Introduction Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">Why You Should Learn Data Structures and Algorithms (DSA)</h1>
        <p className="text-xl text-softSilver">
          In the world of computer science, Data Structures and Algorithms (DSA) are more than just topics you study for exams. They form the very foundation of problem-solving and efficient programming. Whether you aim to excel in competitive programming, crack top-tier tech interviews, or build scalable applications, mastering DSA is essential.
        </p>
      </motion.section>
      {/* Main Content Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
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
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">Conclusion</h1>
        <p className="text-xl text-softSilver mb-4">
          Learning DSA is not just about solving coding challenges—it’s about training your mind to think logically, efficiently, and innovatively. It’s a skill that opens doors to interviews, research, competitive programming, and impactful real-world applications.
          So, if you’re serious about a future in tech, start your DSA journey today. It’s an investment that will pay off throughout your career.
        </p>
        {/* Removed CTA button, using plain link */}
        <a href="/dsa-tutorials" className="text-goldenAmber hover:text-tealBlue transition-colors duration-300">Explore DSA Tutorials</a>
      </motion.section>
    </div>
  );
};
export default WhyDSA;