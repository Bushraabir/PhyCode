import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Book, Rocket, Lightbulb, BarChart, Globe, ChevronRight, ArrowUp, Menu, X } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';

const WhyDSA = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample data for charts
  const timeComplexityData = [
    { size: 100, linear: 100, binary: 6.6 },
    { size: 200, linear: 200, binary: 7.6 },
    { size: 400, linear: 400, binary: 8.6 },
    { size: 800, linear: 800, binary: 9.6 },
    { size: 1000, linear: 1000, binary: 10 },
    { size: 2000, linear: 2000, binary: 11 },
    { size: 4000, linear: 4000, binary: 12 },
  ];

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

  const salaryData = [
    { category: 'With DSA', salary: 115, color: '#007880' },
    { category: 'Without DSA', salary: 100, color: '#FDC57B' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tableOfContents = [
    { id: 0, title: "Foundation of CS", icon: <Book className="w-4 h-4" /> },
    { id: 1, title: "Problem Solving", icon: <Lightbulb className="w-4 h-4" /> },
    { id: 2, title: "Technical Interviews", icon: <Code className="w-4 h-4" /> },
    { id: 3, title: "Efficient Code", icon: <Rocket className="w-4 h-4" /> },
    { id: 4, title: "Competitive Programming", icon: <Book className="w-4 h-4" /> },
    { id: 5, title: "Real-World Apps", icon: <Globe className="w-4 h-4" /> },
    { id: 6, title: "Career Growth", icon: <BarChart className="w-4 h-4" /> },
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
      title: "Foundation of Computer Science",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            DSA teaches you how data is stored, organized, and processed efficiently. Instead of treating programming as a collection of random tricks, you begin to understand the fundamental logic that drives computational thinking.
          </p>
          <div className="bg-deepPlum p-6 rounded-lg border-l-4 border-goldenAmber">
            <h4 className="text-goldenAmber font-semibold mb-3">Key Benefits:</h4>
            <ul className="space-y-2 text-softSilver">
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Think like a computer scientist</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Understand computational complexity</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Build systematic problem-solving skills</li>
            </ul>
          </div>
        </div>
      ),
      icon: <Book className="w-6 h-6" />,
    },
    {
      title: "Problem-Solving Superpower",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            Learning DSA transforms your analytical thinking capabilities. It enables you to decompose large, complex problems into smaller, manageable components with systematic approaches.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-goldenAmber font-semibold mb-3">Linear Search</h4>
              <p className="text-softSilver text-sm mb-3">Check every element one by one</p>
              <div className="bg-charcoalBlack p-3 rounded text-xs font-mono text-softSilver overflow-x-auto">
{`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}
// Time: O(n), Space: O(1)`}
              </div>
            </div>
            
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-tealBlue font-semibold mb-3">Binary Search</h4>
              <p className="text-softSilver text-sm mb-3">Divide and conquer approach</p>
              <div className="bg-charcoalBlack p-3 rounded text-xs font-mono text-softSilver overflow-x-auto">
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
              </div>
            </div>
          </div>

          <CustomLineChart data={timeComplexityData} title="Algorithm Performance Comparison" />
        </div>
      ),
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      title: "Crucial for Technical Interviews",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            Leading technology companies like Google, Meta, Amazon, and Microsoft heavily emphasize DSA knowledge during their technical interview processes.
          </p>
          
          <div className="bg-deepPlum p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-goldenAmber mb-2">70-80%</div>
                <div className="text-softSilver text-sm">Interview questions based on DSA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-tealBlue mb-2">5x</div>
                <div className="text-softSilver text-sm">Higher success rate with DSA knowledge</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-goldenAmber mb-2">15-20%</div>
                <div className="text-softSilver text-sm">Salary increase potential</div>
              </div>
            </div>
          </div>

          <CustomBarChart 
            data={interviewTopicsData} 
            title="Most Common DSA Topics in Technical Interviews" 
            dataKey="percentage" 
            nameKey="topic"
          />
        </div>
      ),
      icon: <Code className="w-6 h-6" />,
    },
    {
      title: "Writing Efficient and Scalable Code",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            In production environments, efficiency directly impacts user experience and operational costs. A program that executes in 2 seconds versus 2 minutes can save enormous resources when scaled to millions of users.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-goldenAmber font-semibold mb-3">Time Complexity Benefits</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Faster execution times</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Better user experience</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Reduced server costs</li>
              </ul>
            </div>

            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-tealBlue font-semibold mb-3">Space Complexity Benefits</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Optimized memory usage</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Scalable applications</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Lower infrastructure costs</li>
              </ul>
            </div>
          </div>

          <div className="bg-slateBlack p-6 rounded-lg">
            <h4 className="text-goldenAmber font-semibold mb-4">Real-World Impact Examples</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-charcoalBlack rounded">
                <div className="text-tealBlue font-bold">NASA Simulations</div>
                <div className="text-softSilver mt-1">Mission-critical performance</div>
              </div>
              <div className="text-center p-3 bg-charcoalBlack rounded">
                <div className="text-goldenAmber font-bold">Google Search</div>
                <div className="text-softSilver mt-1">Billion queries per day</div>
              </div>
              <div className="text-center p-3 bg-charcoalBlack rounded">
                <div className="text-tealBlue font-bold">AI Systems</div>
                <div className="text-softSilver mt-1">Large-scale data processing</div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      title: "Competitive Programming and Research",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            For aspiring competitive programmers dreaming of excelling in ICPC, Codeforces, or LeetCode contests, DSA mastery is your most powerful asset.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-goldenAmber font-semibold mb-3">Competitive Programming</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />ICPC World Finals</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Codeforces Contests</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />LeetCode Championships</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Google Code Jam</li>
              </ul>
            </div>

            <div className="bg-deepPlum p-5 rounded-lg">
              <h4 className="text-tealBlue font-semibold mb-3">Advanced Research Fields</h4>
              <ul className="space-y-2 text-softSilver">
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Artificial Intelligence</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Machine Learning</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Cryptography</li>
                <li className="flex items-center"><ChevronRight className="w-4 h-4 text-goldenAmber mr-2" />Quantum Computing</li>
              </ul>
            </div>
          </div>

          <div className="bg-slateBlack p-6 rounded-lg border-l-4 border-tealBlue">
            <h4 className="text-tealBlue font-semibold mb-3">Academic Opportunities</h4>
            <p className="text-softSilver">
              Strong DSA foundations open doors to graduate research programs, PhD opportunities, and cutting-edge 
              research in computer science fields where algorithmic thinking is paramount.
            </p>
          </div>
        </div>
      ),
      icon: <Book className="w-6 h-6" />,
    },
    {
      title: "Real-World Applications Everywhere",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            Every digital technology you interact with daily is built upon sophisticated DSA implementations. Understanding these foundations helps you appreciate and build better systems.
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

          <CustomBarChart 
            data={realWorldAppsData} 
            title="DSA Relevance in Real-World Applications" 
            dataKey="relevance" 
            nameKey="app"
          />
        </div>
      ),
      icon: <Globe className="w-6 h-6" />,
    },
    {
      title: "Career Growth and Salary Advantages",
      content: (
        <div className="space-y-6">
          <p className="text-softSilver leading-relaxed text-lg">
            Strong DSA expertise doesn't just help in landing jobs—it significantly accelerates career progression. 
            Industry research consistently shows that developers with solid DSA foundations earn 15-25% higher salaries.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-deepPlum p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-goldenAmber mb-2">25%</div>
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

          <div className="bg-slateBlack p-6 rounded-lg">
            <h4 className="text-goldenAmber font-semibold mb-4 text-center">Salary Comparison Analysis</h4>
            <div className="space-y-4">
              {salaryData.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-softSilver font-medium">{item.category}</span>
                    <span className="text-goldenAmber font-bold">{item.salary}%</span>
                  </div>
                  <div className="w-full bg-charcoalBlack rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.salary / 115) * 100}%` }}
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

          <div className="bg-deepPlum p-6 rounded-lg border-l-4 border-goldenAmber">
            <h4 className="text-goldenAmber font-semibold mb-3">Why Companies Value DSA Skills</h4>
            <ul className="space-y-2 text-softSilver">
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Demonstrates logical thinking ability</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Shows capability to solve complex problems</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Indicates potential for system design roles</li>
              <li className="flex items-center"><ChevronRight className="w-4 h-4 text-tealBlue mr-2" />Reflects commitment to continuous learning</li>
            </ul>
          </div>
        </div>
      ),
      icon: <BarChart className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-charcoalBlack text-softSilver">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
        < Navbar />
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Table of Contents */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-16 left-0 z-40 w-64 h-screen bg-slateBlack border-r border-deepPlum transition-transform duration-300 ease-in-out md:block`}>
          <div className="p-6">
            <h2 className="text-lg font-bold text-goldenAmber mb-6">Table of Contents</h2>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {setActiveSection(item.id); setSidebarOpen(false);}}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-deepPlum text-goldenAmber'
                      : 'text-softSilver hover:bg-deepPlum hover:text-goldenAmber'
                  }`}
                >
                  <span className="text-tealBlue">{item.icon}</span>
                  <span className="text-sm">{item.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-goldenAmber mb-6">
              Why You Should Learn Data Structures and Algorithms
            </h1>
            <p className="text-xl text-softSilver max-w-4xl mx-auto leading-relaxed">
              In the world of computer science, Data Structures and Algorithms (DSA) form the foundation of 
              problem-solving and efficient programming. Whether you aim to excel in competitive programming, 
              crack top-tier tech interviews, or build scalable applications, mastering DSA is essential for 
              every serious developer.
            </p>
          </motion.section>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            <motion.section
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-slateBlack rounded-lg shadow-xl p-8 mb-8"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mr-4 text-tealBlue bg-deepPlum p-3 rounded-lg"
                >
                  {sections[activeSection].icon}
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-goldenAmber mb-2">
                    {activeSection + 1}. {sections[activeSection].title}
                  </h2>
                  <div className="h-1 w-20 bg-tealBlue rounded"></div>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {sections[activeSection].content}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-deepPlum">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 0
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-softSilver hover:text-goldenAmber hover:bg-deepPlum'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-2">
                  {sections.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSection(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeSection ? 'bg-goldenAmber' : 'bg-deepPlum hover:bg-tealBlue'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  disabled={activeSection === sections.length - 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeSection === sections.length - 1
                      ? 'text-gray-500 cursor-not-allowed'
                      : 'text-softSilver hover:text-goldenAmber hover:bg-deepPlum'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          </AnimatePresence>

          {/* Conclusion Section */}
          {activeSection === sections.length - 1 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-deepPlum to-slateBlack rounded-lg p-8 text-center"
            >
              <h2 className="text-3xl font-bold text-goldenAmber mb-6">Ready to Start Your DSA Journey?</h2>
              <p className="text-xl text-softSilver mb-8 max-w-3xl mx-auto">
                Learning DSA is not just about solving coding challenges—it's about training your mind to think 
                logically, efficiently, and innovatively. It's a skill that opens doors to interviews, research, 
                competitive programming, and impactful real-world applications.
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
          )}

          {/* Quick Reference Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-slateBlack rounded-lg p-6"
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
          </motion.section>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-goldenAmber text-charcoalBlack p-3 rounded-full shadow-lg hover:bg-tealBlue hover:text-white transition-colors z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default WhyDSA;