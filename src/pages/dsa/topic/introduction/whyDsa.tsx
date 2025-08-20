import React from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Code, Book, Rocket, Lightbulb, BarChart, Globe, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';

const WhyDSA: React.FC = () => {


  const interviewTopicsData = [
    { topic: 'Arrays', percentage: 85, color: '#FDC57B' },
    { topic: 'Strings', percentage: 78, color: '#007880' },
    { topic: 'Trees', percentage: 72, color: '#2ECC71' },
    { topic: 'Graphs', percentage: 65, color: '#F4A261' },
    { topic: 'DP', percentage: 58, color: '#E63946' },
    { topic: 'Linked Lists', percentage: 70, color: '#62374E' },
  ];

  const realWorldAppsData = [
    { app: 'Search Engines', relevance: 95, color: '#FDC57B' },
    { app: 'Social Media', relevance: 88, color: '#007880' },
    { app: 'GPS Navigation', relevance: 92, color: '#2ECC71' },
    { app: 'Databases', relevance: 98, color: '#F4A261' },
    { app: 'Machine Learning', relevance: 90, color: '#E63946' },
  ];

  const CustomBarChart = ({ data, title, dataKey, nameKey = "topic" }: {
    data: Array<{ [key: string]: string | number }>;
    title: string;
    dataKey: string;
    nameKey?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-slateBlack p-6 rounded-lg mb-6"
    >
      <h4 className="text-lg font-semibold text-goldenAmber mb-4 text-center">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-softSilver text-sm">{item[nameKey]}</span>
              <span className="text-goldenAmber font-medium">{item[dataKey]}%</span>
            </div>
            <div className="w-full bg-charcoalBlack rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item[dataKey]}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-3 rounded-full"
                
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.15, type: 'spring', stiffness: 120 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  };


  // Sample data for charts (kept as is, since sample)
const timeComplexityData = [
  { size: 100, linear: 0.1, binary: 0.033 },
  { size: 200, linear: 0.2, binary: 0.038 },
  { size: 400, linear: 0.4, binary: 0.043 },
  { size: 800, linear: 0.8, binary: 0.048 },
  { size: 1000, linear: 1.0, binary: 0.050 },
  { size: 2000, linear: 2.0, binary: 0.055 },
  { size: 4000, linear: 4.0, binary: 0.060 },
  { size: 8000, linear: 8.0, binary: 0.065 },
  { size: 16000, linear: 16.0, binary: 0.070 },
];


    const CustomLineChart = ({ data, title }: {
    data: Array<{ size: number; linear: number; binary: number }>;
    title: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-slateBlack p-6 rounded-lg mb-6"
    >
      <h4 className="text-lg font-semibold text-goldenAmber mb-4 text-center">{title}</h4>
      <div className="relative h-64">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid lines */}
          {[0, 50, 100, 150, 200].map(y => (
            <line key={y} x1="40" y1={y * 0.8 + 20} x2="380" y2={y * 0.8 + 20} stroke="#62374E" strokeWidth="0.5" />
          ))}
          {data.map((_, i) => (
            <line key={i} x1={40 + (i * 50)} y1="20" x2={40 + (i * 50)} y2="180" stroke="#62374E" strokeWidth="0.5" />
          ))}
          
          {/* Linear line */}
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            fill="none"
            stroke="#FDC57B"
            strokeWidth="2"
            points={data.map((d, i) => `${40 + i * 50},${180 - (d.linear / 4000) * 160}`).join(' ')}
          />
          
          {/* Binary line */}
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
            fill="none"
            stroke="#007880"
            strokeWidth="2"
            points={data.map((d, i) => `${40 + i * 50},${180 - (d.binary / 12) * 160}`).join(' ')}
          />
          
          {/* Legend */}
          <g>
            <line x1="50" y1="190" x2="70" y2="190" stroke="#FDC57B" strokeWidth="2" />
            <text x="75" y="194" fill="#E8ECEF" fontSize="12">Linear O(n)</text>
            <line x1="150" y1="190" x2="170" y2="190" stroke="#007880" strokeWidth="2" />
            <text x="175" y="194" fill="#E8ECEF" fontSize="12">Binary O(log n)</text>
          </g>
        </svg>
      </div>
    </motion.div>
  );


  const sections = [
    {
      title: "1. Foundation of Computer Science",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Hey there, let's kick things off with the basics. Imagine building a house without understanding bricks and mortar—that's what programming feels like without DSA. Data Structures and Algorithms teach you how data is stored, organized, and processed efficiently. It's not just random tricks; it's the fundamental logic that powers computational thinking. Once you get this, you'll see code in a whole new light!
          </p>
          <p className="text-softSilver font-sans mb-4">
            Think about it: Without DSA, you're guessing your way through problems. But with it, you build a strong base that makes everything else easier. It's like learning grammar before writing a novel.
          </p>
          <div className="bg-deepPlum p-6 rounded-lg border-l-4 border-goldenAmber">
            <h4 className="text-goldenAmber font-semibold mb-3">Key Benefits:</h4>
            <ul className="space-y-2 text-softSilver">
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Think like a computer scientist—solve problems systematically instead of trial and error.</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Understand computational complexity—know why one solution is faster or uses less memory.</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Build systematic problem-solving skills that apply beyond coding, even in everyday decisions.</li>
            </ul>
          </div>
          <p className="text-softSilver font-sans mb-4">
            Trust me, mastering this foundation will make you feel unstoppable. It's the starting point for everything else we'll cover!
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
            Now, let's talk about how DSA turns you into a problem-solving wizard. It sharpens your analytical thinking, helping you break down massive, scary problems into bite-sized pieces. No more staring at a challenge feeling overwhelmed—you'll have a toolkit to tackle it step by step.
          </p>
          <p className="text-softSilver font-sans mb-4">
            For example, searching for something in a list? DSA shows why binary search (dividing and conquering) is way faster than checking one by one. It's like choosing a smart shortcut over walking the long way.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-goldenAmber font-semibold mb-3">Linear Search</h4>
              <p className="text-softSilver text-sm mb-3">Check every element one by one—simple but slow for big lists.</p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <pre className="bg-charcoalBlack p-3 rounded text-xs font-mono text-softSilver overflow-x-auto">
{`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
// Time: O(n), Space: O(1)`}
                </pre>
              </motion.div>
            </div>
            
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-tealBlue font-semibold mb-3">Binary Search</h4>
              <p className="text-softSilver text-sm mb-3">Divide and conquer approach—super fast for sorted lists!</p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <pre className="bg-charcoalBlack p-3 rounded text-xs font-mono text-softSilver overflow-x-auto">
{`function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}
// Time: O(log n), Space: O(1)`}
                </pre>
              </motion.div>
            </div>
          </div>
          <p className="text-softSilver font-sans mb-4">
            See the difference? Linear is like checking every house on a street, while binary is jumping to the middle and narrowing down. This superpower makes complex issues manageable.
          </p>
          <CustomLineChart data={timeComplexityData} title="Algorithm Performance Comparison" />
          <p className="text-softSilver font-sans mb-4">
            Look at that chart—binary search crushes linear as data grows. That's the power DSA gives you!
          </p>
        </>
      ),
      icon: <Lightbulb />,
    },
    {
      title: "3. Crucial for Technical Interviews",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            If you're aiming for a job at big tech like Google, Meta, Amazon, or Microsoft, DSA is your golden ticket. In 2025, these companies still heavily focus on DSA in interviews—about 80% of questions revolve around it, based on recent trends. It's their way to test if you can think logically under pressure.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Knowing DSA doesn't just help you pass; it boosts your success rate dramatically—up to 5 times higher, according to industry insights. Plus, it can lead to 20-30% higher starting salaries. Why? Because it shows you're ready for real challenges.
          </p>
          <div className="bg-deepPlum p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-goldenAmber mb-2">80%</div>
                <div className="text-softSilver text-sm">Interview questions based on DSA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-tealBlue mb-2">5x</div>
                <div className="text-softSilver text-sm">Higher success rate with DSA knowledge</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-goldenAmber mb-2">20-30%</div>
                <div className="text-softSilver text-sm">Salary increase potential</div>
              </div>
            </div>
          </div>
          <p className="text-softSilver font-sans mb-4">
            These stats aren't just numbers—they're from 2025 reports on tech hiring. Mastering DSA means you're not just another candidate; you're the one they want.
          </p>
          <CustomBarChart 
            data={interviewTopicsData} 
            title="Most Common DSA Topics in Technical Interviews" 
            dataKey="percentage" 
            nameKey="topic"
          />
          <p className="text-softSilver font-sans mb-4">
            Check out the chart: Arrays and strings top the list, but don't skip trees or graphs—they're interview favorites too!
          </p>
        </>
      ),
      icon: <Code />,
    },
    {
      title: "4. Writing Efficient and Scalable Code",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            In the real world, code isn't just about working—it's about working smart. DSA helps you write efficient code that scales, saving time, money, and headaches. Imagine a app that loads in 2 seconds vs. 2 minutes for millions of users—that's the difference DSA makes.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Efficiency impacts everything: user happiness, server bills, and even the environment (less power used!). With DSA, you'll choose the right tools to make your code fly.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-goldenAmber font-semibold mb-3">Time Complexity Benefits</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Faster execution times—users love quick apps.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Better user experience—no one waits around.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Reduced server costs—efficient code means less hardware needed.</li>
              </ul>
            </div>

            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-tealBlue font-semibold mb-3">Space Complexity Benefits</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Optimized memory usage—run more with less.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Scalable applications—grow without crashing.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Lower infrastructure costs—save big on cloud bills.</li>
              </ul>
            </div>
          </div>
          <p className="text-softSilver font-sans mb-4">
            These aren't theoretical— they're real wins in production.
          </p>
          <div className="bg-slateBlack p-6 rounded-lg">
            <h4 className="text-goldenAmber font-semibold mb-4">Real-World Impact Examples</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-charcoalBlack rounded">
                <div className="text-tealBlue font-bold">NASA Simulations</div>
                <div className="text-softSilver mt-1">Mission-critical performance where every second counts.</div>
              </div>
              <div className="text-center p-3 bg-charcoalBlack rounded">
                <div className="text-goldenAmber font-bold">Google Search</div>
                <div className="text-softSilver mt-1">Handling billions of queries per day efficiently.</div>
              </div>
              <div className="text-center p-3 bg-charcoalBlack rounded">
                <div className="text-tealBlue font-bold">AI Systems</div>
                <div className="text-softSilver mt-1">Processing massive data sets without breaking a sweat.</div>
              </div>
            </div>
          </div>
          <p className="text-softSilver font-sans mb-4">
            See? DSA isn't abstract—it's powering the tech you use daily.
          </p>
        </>
      ),
      icon: <Rocket />,
    },
    {
      title: "5. Competitive Programming and Research",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Dreaming of crushing Codeforces or landing a spot in ICPC? DSA is your secret weapon. It's essential for competitive programming, where speed and smarts win the day.
          </p>
          <p className="text-softSilver font-sans mb-4">
            But it's not just contests—DSA opens doors to cutting-edge research. In 2025, fields like AI and quantum computing rely on advanced algorithms.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-goldenAmber font-semibold mb-3">Competitive Programming</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />ICPC World Finals—test your skills globally.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Codeforces Contests—regular challenges to sharpen up.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />LeetCode Championships—battle for top spots.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Google Code Jam—solve puzzles from the pros.</li>
              </ul>
            </div>

            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-tealBlue font-semibold mb-3">Advanced Research Fields</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Artificial Intelligence—optimize learning models.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Machine Learning—handle big data efficiently.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Cryptography—secure data with smart algorithms.</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Quantum Computing—tackle next-gen problems.</li>
              </ul>
            </div>
          </div>
          <div className="bg-slateBlack p-6 rounded-lg border-l-4 border-tealBlue">
            <h4 className="text-tealBlue font-semibold mb-3">Academic Opportunities</h4>
            <p className="text-softSilver">
              Strong DSA foundations can lead to grad programs, PhDs, and groundbreaking research. It's where algorithmic thinking shines brightest.
            </p>
          </div>
          <p className="text-softSilver font-sans mb-4">
            Whether competing or researching, DSA is your edge in 2025's tech landscape.
          </p>
        </>
      ),
      icon: <Book />,
    },
    {
      title: "6. Real-World Applications Everywhere",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            DSA isn't stuck in textbooks—it's everywhere in daily tech. From your phone apps to global systems, sophisticated DSA makes it all work smoothly.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Understanding this helps you build better stuff and appreciate the magic behind the scenes. Let's look at some examples.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { tech: "Search Engines", algo: "Graph algorithms + Page ranking", icon: "🔍" },
              { tech: "Social Media", algo: "Graph theory for social networks", icon: "📱" },
              { tech: "GPS Navigation", algo: "Dijkstra's shortest path algorithm", icon: "🗺️" },
              { tech: "Databases", algo: "B-trees for fast indexing", icon: "🗄️" },
              { tech: "Streaming Services", algo: "Recommendation algorithms", icon: "📺" },
              { tech: "Cybersecurity", algo: "Hashing and encryption", icon: "🔒" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-deepPlum p-4 rounded-lg flex items-center space-x-4"
              >
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h5 className="text-goldenAmber font-semibold">{item.tech}</h5>
                  <p className="text-softSilver text-sm">{item.algo}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-softSilver font-sans mb-4">
            Cool, right? These are just a few—DSA powers pretty much all modern tech.
          </p>
          <CustomBarChart 
            data={realWorldAppsData} 
            title="DSA Relevance in Real-World Applications" 
            dataKey="relevance" 
            nameKey="app"
          />
          <p className="text-softSilver font-sans mb-4">
            As you can see in the chart, DSA is over 90% relevant in key areas like databases and search engines. It's indispensable!
          </p>
        </>
      ),
      icon: <Globe />,
    },
    {
      title: "7. Career Growth and Salary Advantages",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Last but not least, DSA supercharges your career. It's not just for getting in the door— it speeds up promotions and boosts pay. In 2025, devs with solid DSA earn 20-50% more, per industry reports, because they solve tough problems and design better systems.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Companies love it: It shows logical thinking, problem-solving, and commitment to growth. Result? Faster rises and more opportunities.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-deepPlum p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-goldenAmber mb-2">20-50%</div>
              <div className="text-softSilver">Average salary increase</div>
            </div>
            <div className="bg-deepPlum p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-tealBlue mb-2">3x</div>
              <div className="text-softSilver">Faster promotions</div>
            </div>
            <div className="bg-deepPlum p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-goldenAmber mb-2">60%</div>
              <div className="text-softSilver">More job opportunities</div>
            </div>
          </div>
          <p className="text-softSilver font-sans mb-4">
            These numbers from 2025 trends highlight the payoff. Invest in DSA, and watch your career soar.
          </p>
          <div className="bg-slateBlack p-6 rounded-lg">
            <h4 className="text-goldenAmber font-semibold mb-4 text-center">Salary Comparison Analysis</h4>
            <div className="space-y-4">
              {[
                { category: 'With DSA', salary: 150, color: '#007880' },
                { category: 'Without DSA', salary: 120, color: '#FDC57B' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-softSilver font-medium">{item.category}</span>
                    <span className="text-goldenAmber font-bold">{item.salary}%</span>
                  </div>
                  <div className="w-full bg-charcoalBlack rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.salary / 150) * 100}%` }}
                      transition={{ duration: 1.5, delay: index * 0.3 }}
                      className="h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ backgroundColor: item.color }}
                    >
                      <span className="text-xs text-white font-bold">${item.salary}k</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-softSilver font-sans mb-4">
            Updated for 2025: With DSA, you're looking at around $150k average vs. $120k without— that's a solid boost!
          </p>
          <div className="bg-deepPlum p-6 rounded-lg border-l-4 border-goldenAmber">
            <h4 className="text-goldenAmber font-semibold mb-3">Why Companies Value DSA Skills</h4>
            <ul className="space-y-2 text-softSilver">
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Demonstrates logical thinking ability—key for debugging and innovation.</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Shows capability to solve complex problems—real-world tech is full of them.</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Indicates potential for system design roles—scale up to architect level.</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Reflects commitment to continuous learning—in a fast-changing field.</li>
            </ul>
          </div>
        </>
      ),
      icon: <BarChart />,
    },
  ];



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
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">Why You Should Learn Data Structures and Algorithms: Your Ultimate Guide</h1>
        <p className="text-xl text-softSilver mb-4">
          Hey there, aspiring developers! Ever wondered why Data Structures and Algorithms (DSA) get so much hype? In the fast-paced world of tech, DSA is the backbone of efficient programming and problem-solving. Whether you're eyeing competitive coding, nailing tech interviews, or building apps that scale, DSA is your key to success.
        </p>
        <p className="text-xl text-softSilver mb-4">
          I'm here to break it down for you in a fun, relatable way—like we're chatting over coffee. We'll explore the whys, hows, and real benefits, with examples and tips. By the end, you'll be pumped to dive in. Let's get started!
        </p>
        <p className="text-xl text-softSilver mb-4">
          In 2025, with AI and big data booming, DSA is more relevant than ever. It's not just theory—it's practical power. Stick with me!
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
      {/* Quick Reference Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-slateBlack rounded-lg p-6 max-w-7xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-goldenAmber mb-6 text-center">Quick Reference</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-goldenAmber font-semibold mb-2">Time Complexity</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>O(1) - Constant</div>
              <div>O(log n) - Logarithmic</div>
              <div>O(n) - Linear</div>
              <div>O(n²) - Quadratic</div>
            </div>
          </div>
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-tealBlue font-semibold mb-2">Data Structures</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>Arrays & Lists</div>
              <div>Stacks & Queues</div>
              <div>Trees & Graphs</div>
              <div>Hash Tables</div>
            </div>
          </div>
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-goldenAmber font-semibold mb-2">Algorithms</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>Sorting & Searching</div>
              <div>Dynamic Programming</div>
              <div>Graph Traversal</div>
              <div>Greedy Algorithms</div>
            </div>
          </div>
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-tealBlue font-semibold mb-2">Applications</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>System Design</div>
              <div>Database Optimization</div>
              <div>Web Development</div>
              <div>Machine Learning</div>
            </div>
          </div>
        </div>
        <p className="text-softSilver font-sans mt-4 text-center">
          Use this as your cheat sheet—quick reminders of DSA essentials!
        </p>
      </motion.section>
      {/* Conclusion */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-24 mt-12 text-center w-2/3 mx-auto"
      >
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">Ready to Start Your DSA Journey? 🚀</h1>
        <p className="text-xl text-softSilver mb-4">
          Whew, we've unpacked a ton about why DSA rocks! It's not just for acing interviews or contests—it's about training your brain to think smarter, build better, and grow your career in exciting ways. In 2025, with tech evolving fast, DSA keeps you ahead.
        </p>
        <p className="text-xl text-softSilver mb-4">
          Remember, learning DSA is an investment in yourself. Start small, practice consistently, and watch the doors open.
        </p>
        <p className="text-xl text-softSilver mb-4">
          Thanks for joining me on this chatty guide. If it sparked something, share your thoughts! Keep coding, stay curious, and let's conquer DSA together.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slateBlack p-6 rounded-lg">
            <Book className="w-8 h-8 text-goldenAmber mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-goldenAmber mb-2">Learn Fundamentals</h3>
            <p className="text-softSilver text-sm">Start with basic data structures and algorithms</p>
          </div>
          <div className="bg-slateBlack p-6 rounded-lg">
            <Code className="w-8 h-8 text-tealBlue mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-tealBlue mb-2">Practice Coding</h3>
            <p className="text-softSilver text-sm">Solve problems on platforms like LeetCode</p>
          </div>
          <div className="bg-slateBlack p-6 rounded-lg">
            <Rocket className="w-8 h-8 text-goldenAmber mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-goldenAmber mb-2">Build Projects</h3>
            <p className="text-softSilver text-sm">Apply DSA concepts in real applications</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="#tutorials" 
            className="bg-goldenAmber text-charcoalBlack px-6 py-3 rounded-lg font-semibold hover:bg-tealBlue hover:text-white transition-colors"
          >
            Start Learning DSA
          </a>
          <a 
            href="#practice" 
            className="border-2 border-goldenAmber text-goldenAmber px-6 py-3 rounded-lg font-semibold hover:bg-goldenAmber hover:text-charcoalBlack transition-colors"
          >
            Practice Problems
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default WhyDSA;