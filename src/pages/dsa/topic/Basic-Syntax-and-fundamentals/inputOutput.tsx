import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Code, Book, Rocket, Lightbulb, Play, ChevronRight, ChevronDown, Calculator, Zap, Target, ArrowRight } from 'lucide-react';

const CppPhysicsGuide: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const codeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sections = [
    {
      title: "Introduction: Where Physics Meets Programming",
      icon: <Rocket className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-900/40 to-teal-900/40 p-6 rounded-xl border border-purple-500/20"
          >
            <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2" />
              The Perfect Marriage: Physics + C++
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Imagine you're a physicist studying the motion of planets, or the behavior of particles in a magnetic field. 
              Your equations are elegant, your theories sound—but how do you bring them to life? How do you simulate 
              thousands of interactions, visualize complex phenomena, or solve equations that would take years by hand?
            </p>
            <p className="text-gray-300 leading-relaxed">
              That's where <strong className="text-teal-400">programming</strong> becomes your superpower! C++ acts as the 
              bridge between abstract physics concepts and practical, real-world applications. Think of it as your 
              digital laboratory where you can experiment, simulate, and discover.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-slate-800/60 p-5 rounded-lg border border-yellow-400/20 hover:border-yellow-400/40 transition-all"
            >
              <Calculator className="w-8 h-8 text-yellow-400 mb-3" />
              <h4 className="text-lg font-semibold text-yellow-400 mb-2">Physics Side</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Mathematical equations</li>
                <li>• Physical laws and theories</li>
                <li>• Experimental observations</li>
                <li>• Natural phenomena</li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-slate-800/60 p-5 rounded-lg border border-teal-500/20 hover:border-teal-500/40 transition-all"
            >
              <Code className="w-8 h-8 text-teal-500 mb-3" />
              <h4 className="text-lg font-semibold text-teal-500 mb-2">Programming Side</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Variables and data types</li>
                <li>• Functions and classes</li>
                <li>• Algorithms and logic</li>
                <li>• Input/Output operations</li>
              </ul>
            </motion.div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400/10 to-teal-500/10 p-6 rounded-xl border-l-4 border-yellow-400">
            <h4 className="text-yellow-400 font-semibold mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Our Journey Today
            </h4>
            <p className="text-gray-300 mb-4">
              We'll start with a simple C++ program that takes user input and displays it. But here's the twist—we'll 
              view every line through the lens of a physicist! Then, we'll enhance it to calculate velocity using real physics equations.
            </p>
            <div className="flex items-center text-teal-400">
              <span className="text-sm font-medium">Basic I/O</span>
              <ArrowRight className="w-4 h-4 mx-2" />
              <span className="text-sm font-medium">Physics Calculations</span>
              <ArrowRight className="w-4 h-4 mx-2" />
              <span className="text-sm font-medium">Real Applications</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Foundation: Understanding Our Basic Code",
      icon: <Code className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/80 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-yellow-400">The Problem We're Solving</h3>
              <Play className="w-5 h-5 text-teal-400" />
            </div>
            <div className="bg-purple-900/30 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="text-gray-300 italic">
                "Complete the function printNumber which takes an integer input from the user and prints it on the screen."
              </p>
            </div>
            <p className="text-gray-300 mt-4">
              This might seem simple, but it's the foundation of all user interaction in programming—just like how 
              basic measurements are the foundation of all physics experiments!
            </p>
          </motion.div>

          <motion.div
            variants={codeVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
              <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
                <span className="text-sm text-gray-400">main.cpp</span>
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="text-teal-400 hover:text-teal-300 text-sm flex items-center"
                >
                  {showCode ? 'Hide Details' : 'Show Details'}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showCode ? 'rotate-90' : ''}`} />
                </button>
              </div>
              <div className="p-4">
                <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
{`#include <iostream>
using namespace std;

class Solution {
public:
    void printNumber() {
        int a;
        cin >> a;
        cout << a << endl;
    }
};

int main() {
    Solution obj;
    cout << "Enter a number: ";
    obj.printNumber();
    return 0;
}`}
                </pre>
              </div>
            </div>
          </motion.div>

          {showCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-teal-900/20 to-purple-900/20 p-6 rounded-xl border border-teal-500/20"
            >
              <h4 className="text-teal-400 font-semibold mb-4">Code Breakdown</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs font-mono mr-3">#include</span>
                  <span className="text-gray-300">Imports the iostream library for input/output operations</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-teal-400/20 text-teal-400 px-2 py-1 rounded text-xs font-mono mr-3">namespace</span>
                  <span className="text-gray-300">Allows us to use standard functions without std:: prefix</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-purple-400/20 text-purple-400 px-2 py-1 rounded text-xs font-mono mr-3">class</span>
                  <span className="text-gray-300">Creates a blueprint/model for our solution</span>
                </div>
                <div className="flex items-start">
                  <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-xs font-mono mr-3">function</span>
                  <span className="text-gray-300">Contains the logic for our specific task</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )
    },
    {
      title: "Breaking Down Each Component: A Physicist's View",
      icon: <Lightbulb className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          {[
            {
              title: "#include <iostream>",
              subtitle: "The Data Collection Tools",
              analogy: "Physics Lab Equipment",
              content: "In physics experiments, we use instruments like voltmeters, thermometers, and scales to measure and record data. Similarly, #include <iostream> imports the 'instruments' we need for input/output operations in C++.",
              example: "Just like a physicist needs a scale to measure mass, our program needs iostream to 'measure' (input) and 'report' (output) data.",
              color: "yellow"
            },
            {
              title: "using namespace std;",
              subtitle: "Choosing Your Physics Framework",
              analogy: "Scientific Conventions",
              content: "In physics, we work within specific frameworks—classical mechanics, quantum mechanics, thermodynamics. Each has its own 'namespace' of concepts and tools.",
              example: "Instead of writing 'classical_mechanics::force' every time, we say we're working in classical mechanics and just use 'force'.",
              color: "teal"
            },
            {
              title: "class Solution { ... }",
              subtitle: "The Experimental Model",
              analogy: "Physical System Model",
              content: "A class is like a simplified model of a physical system—think of it as your 'ideal pendulum' or 'frictionless surface' that contains all the properties and behaviors you need.",
              example: "Our Solution class is like defining a 'measurement device' that has the ability to capture and display numerical data.",
              color: "purple"
            },
            {
              title: "void printNumber() { ... }",
              subtitle: "The Measurement Procedure",
              analogy: "Experimental Protocol",
              content: "This function is like a step-by-step experimental procedure that tells us exactly how to take a measurement and record the results.",
              example: "Step 1: Prepare measurement container (int a), Step 2: Take measurement (cin >> a), Step 3: Record result (cout << a)",
              color: "green"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800/60 p-6 rounded-xl border-l-4 border-${item.color}-400`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-semibold text-${item.color}-400 font-mono`}>{item.title}</h4>
                <span className={`text-${item.color}-400 text-sm bg-${item.color}-400/20 px-2 py-1 rounded`}>
                  {item.analogy}
                </span>
              </div>
              <h5 className={`text-${item.color}-300 font-medium mb-3`}>{item.subtitle}</h5>
              <p className="text-gray-300 mb-3 leading-relaxed">{item.content}</p>
              <div className={`bg-${item.color}-900/20 p-3 rounded-lg border border-${item.color}-400/20`}>
                <span className={`text-${item.color}-400 text-sm font-medium`}>Physics Analogy: </span>
                <span className="text-gray-300 text-sm">{item.example}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "The main() Function: Setting Up Your Physics Lab",
      icon: <Book className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4">The Experimental Setup</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              The main() function is like walking into a physics laboratory and setting up your experiment. 
              Every physics experiment follows a similar pattern: setup, execution, data collection, and cleanup.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {[
              {
                line: "Solution obj;",
                step: "1. Equipment Setup",
                description: "This creates an instance of our Solution class—like setting up your measurement apparatus in the lab.",
                physics: "Similar to calibrating a digital multimeter before taking electrical measurements.",
                icon: "⚡"
              },
              {
                line: 'cout << "Enter a number: ";',
                step: "2. User Instructions",
                description: "This displays instructions to the user—like giving clear directions to a lab assistant.",
                physics: "Like posting a sign that says 'Record the temperature every 5 minutes'.",
                icon: "📋"
              },
              {
                line: "obj.printNumber();",
                step: "3. Execute Experiment",
                description: "This runs our measurement procedure using the object we created.",
                physics: "Like pressing the 'start' button on your data logging equipment.",
                icon: "▶️"
              },
              {
                line: "return 0;",
                step: "4. Successful Completion",
                description: "This tells the system that our program completed successfully.",
                physics: "Like writing 'Experiment completed successfully' in your lab notebook.",
                icon: "✅"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-slate-800/80 p-5 rounded-lg border border-gray-600/30 hover:border-blue-400/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{item.icon}</span>
                    <div>
                      <h4 className="text-blue-400 font-semibold">{item.step}</h4>
                      <code className="text-teal-400 text-sm font-mono">{item.line}</code>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                <div className="bg-blue-900/20 p-2 rounded border-l-2 border-blue-400">
                  <span className="text-blue-400 text-xs font-medium">Physics Connection: </span>
                  <span className="text-gray-300 text-xs">{item.physics}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Level Up: Real Physics with Velocity Calculation",
      icon: <Zap className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-orange-900/40 to-red-900/40 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-orange-400 mb-4">From Simple I/O to Physics Simulation</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Now that you understand the basics, let's create something more exciting! We'll build a program that 
              calculates velocity using one of the most fundamental equations in physics:
            </p>
            <div className="bg-gray-900/60 p-4 rounded-lg border border-orange-400/20">
              <div className="text-center">
                <span className="text-orange-400 text-2xl font-bold">v = u + at</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div className="text-center">
                  <div className="text-orange-400 font-bold">v</div>
                  <div className="text-gray-300">Final velocity</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold">u</div>
                  <div className="text-gray-300">Initial velocity</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold">a</div>
                  <div className="text-gray-300">Acceleration</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold">t</div>
                  <div className="text-gray-300">Time</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700"
          >
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-400">physics_calculator.cpp</span>
              <span className="text-orange-400 text-sm">Enhanced Version</span>
            </div>
            <div className="p-4">
              <pre className="text-sm font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`#include <iostream>
using namespace std;

class Physics {
public:
    void calculateVelocity() {
        float u, a, t, v;
        
        cout << "Enter initial velocity (u) in m/s: ";
        cin >> u;
        
        cout << "Enter acceleration (a) in m/s²: ";
        cin >> a;
        
        cout << "Enter time (t) in seconds: ";
        cin >> t;

        // Calculating velocity using: v = u + at
        v = u + a * t;

        cout << "The final velocity is: " << v << " m/s" << endl;
        
        // Bonus: Let's add some physics insights!
        if (v > u) {
            cout << "The object is speeding up!" << endl;
        } else if (v < u) {
            cout << "The object is slowing down!" << endl;
        } else {
            cout << "The object maintains constant velocity!" << endl;
        }
    }
};

int main() {
    Physics calculator;
    cout << "=== Physics Velocity Calculator ===" << endl;
    calculator.calculateVelocity();
    cout << "Thanks for using the physics calculator!" << endl;
    return 0;
}`}
              </pre>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/60 p-5 rounded-lg border border-orange-400/20"
            >
              <h4 className="text-orange-400 font-semibold mb-3 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                What's New Here?
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                  <span><strong>float</strong> variables for decimal precision</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                  <span>Multiple input prompts for different physics quantities</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                  <span>Mathematical calculation using the physics formula</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-orange-400 mr-2 mt-0.5" />
                  <span>Conditional logic to interpret the results</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/60 p-5 rounded-lg border border-teal-400/20"
            >
              <h4 className="text-teal-400 font-semibold mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Real-World Example
              </h4>
              <div className="text-sm space-y-2">
                <div className="bg-gray-900/60 p-3 rounded">
                  <div className="text-teal-400 font-medium">Car Acceleration</div>
                  <div className="text-gray-300 text-xs mt-1">
                    Initial velocity: 10 m/s<br/>
                    Acceleration: 2 m/s²<br/>
                    Time: 5 seconds<br/>
                    <strong className="text-yellow-400">Result: 20 m/s</strong>
                  </div>
                </div>
                <p className="text-gray-300 text-xs">
                  This could represent a car accelerating from 36 km/h to 72 km/h over 5 seconds!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )
    },
    {
      title: "Interactive Example: Try It Yourself!",
      icon: <Play className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-900/40 to-teal-900/40 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-4">Physics Calculator Simulator</h3>
            <p className="text-gray-300 mb-4">
              Let's simulate running our enhanced physics program! Enter some values and see how it works:
            </p>
          </motion.div>

        

          <div className="bg-slate-800/80 p-6 rounded-xl">
            <h4 className="text-yellow-400 font-semibold mb-4">Understanding the Results</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-400/20">
                <h5 className="text-green-400 font-medium mb-2">Speeding Up (v &gt; u)</h5>
                <p className="text-gray-300 text-sm">
                  Positive acceleration means the object gains speed over time. Think of a car pressing the gas pedal.
                </p>
              </div>
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-400/20">
                <h5 className="text-red-400 font-medium mb-2">Slowing Down (v &lt; u)</h5>
                <p className="text-gray-300 text-sm">
                  Negative acceleration (deceleration) means the object loses speed. Like applying brakes.
                </p>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-400/20">
                <h5 className="text-blue-400 font-medium mb-2">Constant Speed (v = u)</h5>
                <p className="text-gray-300 text-sm">
                  Zero acceleration means no change in velocity. The object moves at constant speed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Connecting the Dots: From Code to Real Applications",
      icon: <Rocket className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Beyond the Classroom</h3>
            <p className="text-gray-300 leading-relaxed">
              The simple concepts we've learned—taking input, processing data, and displaying results—are the 
              building blocks of incredible real-world applications. Let's see where this journey can take you!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Space Missions",
                description: "NASA uses similar calculations to plan spacecraft trajectories",
                icon: "🚀",
                example: "Calculating orbital velocity changes",
                color: "blue"
              },
              {
                title: "Video Games",
                description: "Physics engines simulate realistic motion and collisions",
                icon: "🎮",
                example: "Character movement and projectile physics",
                color: "green"
              },
              {
                title: "Weather Prediction",
                description: "Atmospheric models use physics equations to forecast weather",
                icon: "🌤️",
                example: "Wind velocity and pressure changes",
                color: "yellow"
              },
              {
                title: "Autonomous Cars",
                description: "Self-driving vehicles calculate safe speeds and stopping distances",
                icon: "🚗",
                example: "Braking distance calculations",
                color: "red"
              },
              {
                title: "Sports Analytics",
                description: "Analyzing player and ball movements in professional sports",
                icon: "⚽",
                example: "Ball trajectory in soccer or basketball",
                color: "purple"
              },
              {
                title: "Medical Imaging",
                description: "MRI and CT scanners use physics algorithms for image processing",
                icon: "🏥",
                example: "Signal processing and image reconstruction",
                color: "teal"
              }
            ].map((app, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-slate-800/60 p-4 rounded-lg border border-${app.color}-400/20 hover:border-${app.color}-400/40 transition-all cursor-pointer`}
              >
                <div className="text-3xl mb-2 text-center">{app.icon}</div>
                <h4 className={`text-${app.color}-400 font-semibold mb-2`}>{app.title}</h4>
                <p className="text-gray-300 text-sm mb-2">{app.description}</p>
                <div className={`bg-${app.color}-900/20 p-2 rounded text-xs`}>
                  <span className={`text-${app.color}-400 font-medium`}>Example: </span>
                  <span className="text-gray-300">{app.example}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 p-6 rounded-xl border-l-4 border-yellow-400">
            <h4 className="text-yellow-400 font-semibold mb-4">Your Next Steps</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-orange-400 font-medium mb-2">Expand Your Physics Toolkit</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Add more kinematic equations (distance, time)</li>
                  <li>• Include units conversion (m/s to km/h)</li>
                  <li>• Handle energy calculations (kinetic, potential)</li>
                  <li>• Explore vector physics (2D and 3D motion)</li>
                </ul>
              </div>
              <div>
                <h5 className="text-teal-400 font-medium mb-2">Programming Enhancements</h5>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Add error handling for invalid inputs</li>
                  <li>• Create a menu system for different calculations</li>
                  <li>• Save results to files for later analysis</li>
                  <li>• Build a graphical interface</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Conclusion: Your Journey Has Just Begun",
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-6 rounded-xl text-center"
          >
            <h3 className="text-2xl font-bold text-indigo-400 mb-4">Congratulations! 🎉</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              You've just taken your first steps into the fascinating world where physics meets programming. 
              What started as a simple "print a number" program has evolved into a powerful physics calculator!
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <span className="bg-green-400/20 text-green-400 px-3 py-1 rounded-full">Basic I/O ✓</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full">Physics Equations ✓</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="bg-purple-400/20 text-purple-400 px-3 py-1 rounded-full">Real Applications ✓</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/60 p-5 rounded-lg border border-indigo-400/20"
            >
              <h4 className="text-indigo-400 font-semibold mb-3 flex items-center">
                <Book className="w-5 h-5 mr-2" />
                What You've Learned
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-indigo-400 mr-2 mt-0.5" />
                  <span>How to structure a basic C++ program</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-indigo-400 mr-2 mt-0.5" />
                  <span>The physics connection in every line of code</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-indigo-400 mr-2 mt-0.5" />
                  <span>How to implement real physics equations</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-indigo-400 mr-2 mt-0.5" />
                  <span>The bridge between theory and application</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/60 p-5 rounded-lg border border-teal-400/20"
            >
              <h4 className="text-teal-400 font-semibold mb-3 flex items-center">
                <Rocket className="w-5 h-5 mr-2" />
                Where to Go Next
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-teal-400 mr-2 mt-0.5" />
                  <span>Explore more complex physics simulations</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-teal-400 mr-2 mt-0.5" />
                  <span>Learn about data structures and algorithms</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-teal-400 mr-2 mt-0.5" />
                  <span>Build graphical physics visualizations</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-teal-400 mr-2 mt-0.5" />
                  <span>Contribute to open-source physics projects</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 p-6 rounded-xl border border-green-400/30">
            <h4 className="text-green-400 font-semibold mb-4 text-center">Remember: Every Expert Was Once a Beginner</h4>
            <p className="text-gray-300 text-center leading-relaxed">
              The simple concepts you've learned today are the same ones used in spacecraft navigation, 
              quantum computing simulations, and AI physics engines. Keep building, keep experimenting, 
              and most importantly—keep connecting the beautiful world of physics with the power of programming!
            </p>
            <div className="flex justify-center mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-400/20 text-green-400 px-6 py-2 rounded-full font-medium cursor-pointer"
              >
                🚀 Start Your Next Physics Programming Project!
              </motion.div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Interactive Physics Calculator Component
  const PhysicsCalculator = () => {
    const [inputs, setInputs] = useState({ u: '', a: '', t: '' });
    const [result, setResult] = useState<number | null>(null);
    const [status, setStatus] = useState<'speeding' | 'slowing' | 'constant' | null>(null);

    const calculate = () => {
      const u = parseFloat(inputs.u);
      const a = parseFloat(inputs.a);
      const t = parseFloat(inputs.t);

      if (isNaN(u) || isNaN(a) || isNaN(t)) {
        alert('Please enter valid numbers for all fields!');
        return;
      }

      const v = u + a * t;
      setResult(v);

      if (v > u) setStatus('speeding');
      else if (v < u) setStatus('slowing');
      else setStatus('constant');
    };

    const reset = () => {
      setInputs({ u: '', a: '', t: '' });
      setResult(null);
      setStatus(null);
    };

    return (
      <div className="bg-slate-800/80 p-6 rounded-xl border border-gray-600/30">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-teal-400 text-sm font-medium mb-2">
              Initial Velocity (u) m/s
            </label>
            <input
              type="number"
              value={inputs.u}
              onChange={(e) => setInputs({ ...inputs, u: e.target.value })}
              className="w-full bg-gray-900 text-gray-300 p-3 rounded-lg border border-gray-600 focus:border-teal-400 focus:outline-none"
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <label className="block text-yellow-400 text-sm font-medium mb-2">
              Acceleration (a) m/s²
            </label>
            <input
              type="number"
              value={inputs.a}
              onChange={(e) => setInputs({ ...inputs, a: e.target.value })}
              className="w-full bg-gray-900 text-gray-300 p-3 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              placeholder="e.g., 2"
            />
          </div>
          <div>
            <label className="block text-purple-400 text-sm font-medium mb-2">
              Time (t) seconds
            </label>
            <input
              type="number"
              value={inputs.t}
              onChange={(e) => setInputs({ ...inputs, t: e.target.value })}
              className="w-full bg-gray-900 text-gray-300 p-3 rounded-lg border border-gray-600 focus:border-purple-400 focus:outline-none"
              placeholder="e.g., 5"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Reset
          </motion.button>
        </div>

        {result !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 p-4 rounded-lg border-l-4 border-orange-400"
          >
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-orange-400 mb-2">
                Final Velocity: {result.toFixed(2)} m/s
              </div>
              <div className="text-sm text-gray-400">
                Using equation: v = {inputs.u} + ({inputs.a}) × {inputs.t} = {result.toFixed(2)}
              </div>
            </div>

            {status && (
              <div className={`text-center p-3 rounded-lg ${
                status === 'speeding' 
                  ? 'bg-green-900/40 text-green-400' 
                  : status === 'slowing' 
                    ? 'bg-red-900/40 text-red-400'
                    : 'bg-blue-900/40 text-blue-400'
              }`}>
                {status === 'speeding' && '🚀 The object is speeding up!'}
                {status === 'slowing' && '🛑 The object is slowing down!'}
                {status === 'constant' && '➡️ The object maintains constant velocity!'}
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
                <Code className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">C++ Physics Programming</h1>
                <p className="text-gray-400 text-sm">Where Code Meets Physics</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <span className="text-gray-400">Progress:</span>
              <div className="flex space-x-1">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      expandedSections.has(index) 
                        ? 'bg-yellow-400' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-700/30 transition-all"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-yellow-400"
                  >
                    {section.icon}
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSections.has(index) ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedSections.has(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6"
                >
                  {section.content}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center py-8 border-t border-gray-800"
        >
          <div className="flex justify-center items-center space-x-2 text-gray-400">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-red-400"
            >
              ❤️
            </motion.span>
            <span>for physics and programming enthusiasts</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Keep exploring, keep coding, and remember—every line of code is a step toward understanding our universe!
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default CppPhysicsGuide;