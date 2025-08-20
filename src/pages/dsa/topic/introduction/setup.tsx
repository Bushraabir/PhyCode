import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Code, Book, Rocket, Lightbulb, BarChart, Globe, Pencil, Eye, Bug, Brain, Search, FileText, Download, Settings, Globe as GlobeIcon, GitBranch } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import PremiumParticleSystem from '@/components/particles/particles';

const DSAEnvironmentSetup: React.FC = () => {


  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.15, type: 'spring', stiffness: 120 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
  };

  const CustomBarChart = ({ data, title, dataKey, nameKey = "platform" }: {
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



   const sections = [
    {
      title: "1. Choosing Your Programming Language 🚀",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Hey folks, let's start our DSA setup adventure! Picking a language is like choosing your favorite tool— it should feel comfortable and powerful. In 2025, Python, Java, and C++ are top picks for DSA. Python's super easy for beginners, Java's great for structured thinking, and C++ shines in speed for contests.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Why these? Python lets you focus on logic without syntax headaches. Java teaches object-oriented basics well. C++ is king for performance in interviews. If you're new, start with Python—it's forgiving and widely used.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Python: Simple, readable—perfect for quick prototyping.</li>
            <li>Java: Strong typing, great for understanding references.</li>
            <li>C++: Fast, with STL for built-in DS like vectors and maps.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Pro tip: Stick to one at first, but learn another later for versatility. Check this quick video on why Python for DSA:
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/G5_Q2_yRFsY" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"  className="mx-auto mb-4 rounded-lg"></iframe>
          <img src="https://example.com/language-popularity-graph.png" alt="Popularity of DSA Languages in 2025" className="rounded-lg mx-auto mb-4" />
          <p className="text-softSilver font-sans mb-4">
            As you can see in this graph (imagine a bar chart: Python 45%, Java 30%, C++ 25%), Python leads the pack!
          </p>
        </>
      ),
      icon: <Lightbulb />,
    },
    {
      title: "2. Installing the Language 🔧",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Alright, language picked? Time to install! It's easier than you think. For Python, head to python.org and grab the latest (3.12+ in 2025). Java? Download JDK from Oracle or OpenJDK. C++ needs a compiler like GCC via MinGW on Windows or built-in on Linux/Mac.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Step-by-step for Python: Download installer, run it, check "Add to PATH", and verify with `python --version` in terminal. Same vibe for others. Don't forget to set up virtual environments with venv for Python to keep projects clean.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto">
              <code className="text-softSilver font-mono text-sm">
                {`# Verify Python installation
python --version
# Create a virtual env
python -m venv dsa_env
# Activate it (Windows)
dsa_env\\Scripts\\activate
# (Mac/Linux)
source dsa_env/bin/activate`}
              </code>
            </pre>
          </motion.div>
          <p className="text-softSilver font-sans mb-4">
            See? Quick and painless. If stuck, watch this animation or tutorial video:
          </p>
          <img src="https://example.com/python-install-animation.gif" alt="Python Installation Animation" className="rounded-lg mx-auto mb-4" />
          <p className="text-softSilver font-sans mb-4">
            Pro tip: Use tools like pyenv for managing multiple versions—handy for 2025's evolving ecosystem.
          </p>
        </>
      ),
      icon: <Download />,
    },
    {
      title: "3. Picking an IDE or Editor 🖥️",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Now, where to write your code? An IDE (Integrated Development Environment) is your workspace. VS Code is a 2025 favorite—free, lightweight, with extensions for everything. For Java, IntelliJ Community Edition is gold. Python? PyCharm or even Jupyter Notebooks for interactive learning.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Why VS Code? It's customizable, supports all languages, and has built-in Git. Install extensions like Python, C/C++, Java Pack, and DSA-specific ones for snippets.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>VS Code: Versatile, fast—download from code.visualstudio.com.</li>
            <li>IntelliJ: Smart code completion for Java DSA.</li>
            <li>PyCharm: Python-focused with debugging superpowers.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Setup animation: Imagine clicking through install—easy peasy. Here's a pic of VS Code in action:
          </p>
          <img src="https://example.com/vscode-dsa-setup.png" alt="VS Code Setup for DSA" className="rounded-lg mx-auto mb-4" />
          <p className="text-softSilver font-sans mb-4">
            Don't forget themes like Dark+ for eye comfort during late-night coding sessions!
          </p>
        </>
      ),
      icon: <Settings />,
    },
    {
      title: "4. Essential Tools and Extensions 🛠️",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Got your IDE? Supercharge it with tools! For DSA, add extensions for code formatting (Prettier), linting (ESLint/Pylint), and debugging. Libraries? Python has built-ins, but numpy for arrays if needed. C++ STL is your friend.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Other must-haves: LeetCode extension for VS Code to practice in-editor, GitLens for version control visualization.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Prettier: Auto-format code—keeps it clean.</li>
            <li>Debugger for your language: Step through code.</li>
            <li>LeetCode VS Code: Solve problems without switching tabs.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Watch this quick video on essential VS Code extensions for DSA:
          </p>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/h3uDCJ5mvgw" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"  className="mx-auto mb-4 rounded-lg"></iframe>
          <p className="text-softSilver font-sans mb-4">
            These tools make learning smoother— like having a coding sidekick!
          </p>
        </>
      ),
      icon: <FileText />,
    },
    {
      title: "5. Online Practice Platforms 🌐",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Local setup done? Jump online! Platforms like LeetCode, HackerRank, and GeeksforGeeks offer interactive DSA practice. In 2025, LeetCode's still king with daily challenges and mock interviews.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Why online? Instant feedback, no setup needed for quick sessions, and community solutions to learn from.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>LeetCode: 2000+ problems, tagged by topic.</li>
            <li>Codeforces: For competitive style.</li>
            <li>Educative.io: Interactive courses, no install required.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Here's a graph of platform popularity (bar chart: LeetCode 50%, others split):
          </p>
          {/* Assume CustomBarChart defined */}
          <CustomBarChart 
            data={[
              { platform: 'LeetCode', popularity: 50, color: '#FDC57B' },
              { platform: 'HackerRank', popularity: 20, color: '#007880' },
              { platform: 'GeeksforGeeks', popularity: 15, color: '#2ECC71' },
              { platform: 'Codeforces', popularity: 15, color: '#F4A261' },
            ]} 
            title="Popular DSA Platforms in 2025" 
            dataKey="popularity" 
            nameKey="platform"
          />
          <p className="text-softSilver font-sans mb-4">
            Start with LeetCode's beginner tracks—build momentum!
          </p>
        </>
      ),
      icon: <GlobeIcon />,
    },
    {
      title: "6. Version Control Basics (Git) 📂",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Don't lose your code! Git is essential for tracking changes. Install from git-scm.com, create a GitHub account, and start committing your DSA solutions.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Basic flow: git init, git add ., git commit -m "Initial DSA setup", git push to repo.
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto">
              <code className="text-softSilver font-mono text-sm">
                {`# Basic Git commands
git init
git add .
git commit -m "My first DSA commit"
git remote add origin https://github.com/yourusername/dsa-repo.git
git push -u origin main`}
              </code>
            </pre>
          </motion.div>
          <p className="text-softSilver font-sans mb-4">
            Animation of Git workflow: Picture branching like a tree—keeps experiments safe.
          </p>
          <img src="https://example.com/git-workflow-animation.gif" alt="Git Workflow Animation" className="rounded-lg mx-auto mb-4" />
          <p className="text-softSilver font-sans mb-4">
            GitHub also lets you showcase your DSA projects to employers—win-win!
          </p>
        </>
      ),
      icon: <GitBranch />,
    },
    {
      title: "7. Debugging and Testing Tips 🐛",
      content: (
        <>
          <p className="text-softSilver font-sans mb-4">
            Bugs happen— but with good tools, they're easy to squash. Use your IDE's debugger: Set breakpoints, step through code, inspect variables.
          </p>
          <p className="text-softSilver font-sans mb-4">
            For testing, write unit tests with frameworks like pytest (Python) or JUnit (Java). Platforms like LeetCode handle this, but locally, it's gold for custom problems.
          </p>
          <ul className="list-disc list-inside text-softSilver font-sans mb-4 space-y-2">
            <li>Breakpoints: Pause code execution.</li>
            <li>Watch variables: See values change.</li>
            <li>Unit tests: Automate checks for correctness.</li>
          </ul>
          <p className="text-softSilver font-sans mb-4">
            Here's a simple Python test example:
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <pre className="bg-deepPlum p-4 rounded-md overflow-x-auto">
              <code className="text-softSilver font-mono text-sm">
                {`# Install pytest: pip install pytest
def add(a, b):
  return a + b

def test_add():
  assert add(2, 3) == 5`}
              </code>
            </pre>
          </motion.div>
          <p className="text-softSilver font-sans mb-4">
            Video tip: Search "VS Code debugging tutorial" on YouTube for visuals.
          </p>
          <p className="text-softSilver font-sans mb-4">
            Mastering debugging saves hours—turn frustration into "aha!" moments.
          </p>
        </>
      ),
      icon: <Bug />,
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
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">Setting Up Your DSA Learning Environment: A Friendly Guide</h1>
        <p className="text-xl text-softSilver mb-4">
          Hey there, DSA enthusiasts! Ready to dive into Data Structures and Algorithms but not sure where to start with setup? Don't worry—I've got you. Think of this as your casual vlog guide to getting everything ready in 2025.
        </p>
        <p className="text-xl text-softSilver mb-4">
          We'll cover languages, installs, IDEs, tools, and more, with tips, videos, pics, and even some animations. By the end, you'll be all set to code like a pro. Let's make this fun and easy—grab a snack and let's go!
        </p>
        <p className="text-xl text-softSilver mb-4">
          In 2025, setups are smoother than ever with cloud options, but a local environment builds solid skills. Stick around!
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
        <h3 className="text-2xl font-bold text-goldenAmber mb-6 text-center">Quick Reference: Setup Commands & Tips</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-goldenAmber font-semibold mb-2">Python Install</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>Download from python.org</div>
              <div>python --version</div>
              <div>pip install virtualenv</div>
              <div>virtualenv dsa</div>
            </div>
          </div>
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-tealBlue font-semibold mb-2">VS Code Shortcuts</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>Ctrl+Shift+P: Command Palette</div>
              <div>Ctrl+`: Open Terminal</div>
              <div>F5: Run/Debug</div>
              <div>Ctrl+K Ctrl+S: Keyboard Shortcuts</div>
            </div>
          </div>
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-goldenAmber font-semibold mb-2">Git Basics</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>git init</div>
              <div>git add .</div>
              <div>git commit -m "msg"</div>
              <div>git push</div>
            </div>
          </div>
          <div className="bg-deepPlum p-4 rounded-lg text-center">
            <h4 className="text-tealBlue font-semibold mb-2">Platforms</h4>
            <div className="space-y-1 text-sm text-softSilver">
              <div>LeetCode.com</div>
              <div>Codeforces.com</div>
              <div>HackerRank.com</div>
              <div>GeeksforGeeks.org</div>
            </div>
          </div>
        </div>
        <p className="text-softSilver font-sans mt-4 text-center">
          Bookmark this—your go-to for quick reminders during setup!
        </p>
      </motion.section>
      {/* Conclusion */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-24 mt-12 text-center w-2/3 mx-auto"
      >
        <h1 className="text-4xl font-heading font-bold text-goldenAmber mb-4">💡 Final Words: You're All Set!</h1>
        <p className="text-xl text-softSilver mb-4">
          Wow, we just built your perfect DSA setup from scratch! Now you're ready to learn, practice, and conquer. Remember, the key is consistency—code a bit daily, and you'll see massive progress.
        </p>
        <p className="text-xl text-softSilver mb-4">
          If something doesn't click, tweak it to fit your style. DSA is a journey, and a solid environment is your starting line.
        </p>
        <p className="text-xl text-softSilver mb-4">
          Thanks for joining this vlog-style setup guide. Drop questions below, share your setups, and let's keep the conversation going. Happy coding—you've got this! 🚀
        </p>
        <a href="/dsa-topics" className="text-goldenAmber hover:text-tealBlue transition-colors duration-300">Dive into DSA Topics Now</a>
      </motion.section>
    </div>
  );
};

export default DSAEnvironmentSetup;