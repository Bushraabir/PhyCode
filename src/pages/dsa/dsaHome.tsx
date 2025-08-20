import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiGithub, FiExternalLink } from 'react-icons/fi';
import { FaRocket, FaClipboardList } from 'react-icons/fa';
import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';

type Subtopic = {
  title: string;
  slug: string;
  githubPath?: string; // Optional GitHub path for subtopics
};

type Topic = {
  title: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number;
  blurb: string;
  subtopics?: Subtopic[];
  githubPath?: string; // GitHub folder path
};

// GitHub repository configuration
const GITHUB_CONFIG = {
  baseUrl: 'https://github.com/Bushraabir/Data-Structure-And-Algorithm',
  owner: 'Bushraabir',
  repo: 'Data-Structure-And-Algorithm',
  branch: 'main' // or 'master' depending on your default branch
};

const TOPICS: Topic[] = [
  { 
    title: 'Introduction & Setup', 
    slug: 'introduction', 
    difficulty: 'Beginner', 
    estHours: 2, 
    blurb: 'Why DSA matters, tools, environment setup and first steps.',
    githubPath: 'Introduction',
    subtopics: [
      { title: 'Why DSA Matters', slug: 'topic/introduction/whyDsa', githubPath: 'Introduction/Why-DSA-Matters' },
      { title: 'Problem Solving Approach', slug: 'topic/introduction/problemSolvingApproach', githubPath: 'Introduction/Problem-Solving-Approach' }
    ]
  },
  { 
    title: 'Complexity Analysis', 
    slug: 'complexity-analysis', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Big-O, amortized analysis, and common complexity patterns.',
    githubPath: 'Complexity-Analysis',
    subtopics: [
      { title: 'Big-O Notation', slug: 'complexity-analysis/big-o', githubPath: 'Complexity-Analysis/Big-O-Notation' },
      { title: 'Amortized Analysis', slug: 'complexity-analysis/amortized', githubPath: 'Complexity-Analysis/Amortized-Analysis' },
      { title: 'Common Complexity Patterns', slug: 'complexity-analysis/patterns', githubPath: 'Complexity-Analysis/Common-Patterns' },
      { title: 'Space Complexity', slug: 'complexity-analysis/space', githubPath: 'Complexity-Analysis/Space-Complexity' }
    ]
  },
  { 
    title: 'Arrays', 
    slug: 'arrays', 
    difficulty: 'Beginner', 
    estHours: 8, 
    blurb: 'Two pointers, sliding windows, partitioning, in-place tricks.',
    githubPath: 'Arrays',
    subtopics: [
      { title: 'Two Pointers Technique', slug: 'arrays/two-pointers', githubPath: 'Arrays/Two-Pointers' },
      { title: 'Sliding Window', slug: 'arrays/sliding-window', githubPath: 'Arrays/Sliding-Window' },
      { title: 'Array Partitioning', slug: 'arrays/partitioning', githubPath: 'Arrays/Partitioning' },
      { title: 'In-place Operations', slug: 'arrays/in-place', githubPath: 'Arrays/In-Place-Operations' }
    ]
  },
  { 
    title: 'Strings', 
    slug: 'strings', 
    difficulty: 'Beginner', 
    estHours: 8, 
    blurb: 'Parsing, pattern search, KMP, rolling hash basics.',
    githubPath: 'Strings',
    subtopics: [
      { title: 'String Parsing', slug: 'strings/parsing', githubPath: 'Strings/Parsing' },
      { title: 'Pattern Matching', slug: 'strings/pattern-matching', githubPath: 'Strings/Pattern-Matching' },
      { title: 'KMP Algorithm', slug: 'strings/kmp', githubPath: 'Strings/KMP-Algorithm' },
      { title: 'Rolling Hash', slug: 'strings/rolling-hash', githubPath: 'Strings/Rolling-Hash' }
    ]
  },
  { 
    title: 'Linked Lists', 
    slug: 'linked-list', 
    difficulty: 'Beginner', 
    estHours: 6, 
    blurb: 'Pointers, reversal, cycle detection and common patterns.',
    githubPath: 'Linked-Lists',
    subtopics: [
      { title: 'Pointer Manipulation', slug: 'linked-list/pointers', githubPath: 'Linked-Lists/Pointer-Manipulation' },
      { title: 'List Reversal', slug: 'linked-list/reversal', githubPath: 'Linked-Lists/List-Reversal' },
      { title: 'Cycle Detection', slug: 'linked-list/cycle-detection', githubPath: 'Linked-Lists/Cycle-Detection' },
      { title: 'Merge Operations', slug: 'linked-list/merge', githubPath: 'Linked-Lists/Merge-Operations' }
    ]
  },
  { 
    title: 'Stacks & Queues', 
    slug: 'stacks-queues', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Monotonic stacks, deque tricks and use cases.',
    githubPath: 'Stacks-Queues',
    subtopics: [
      { title: 'Basic Stack Operations', slug: 'stacks-queues/basic-stack', githubPath: 'Stacks-Queues/Basic-Stack' },
      { title: 'Monotonic Stack', slug: 'stacks-queues/monotonic', githubPath: 'Stacks-Queues/Monotonic-Stack' },
      { title: 'Queue Implementation', slug: 'stacks-queues/queue', githubPath: 'Stacks-Queues/Queue-Implementation' },
      { title: 'Deque Applications', slug: 'stacks-queues/deque', githubPath: 'Stacks-Queues/Deque-Applications' }
    ]
  },
  { 
    title: 'Recursion & Backtracking', 
    slug: 'recursion-backtracking', 
    difficulty: 'Intermediate', 
    estHours: 10, 
    blurb: 'Tree recursion, pruning, and combinatorial backtracking.',
    githubPath: 'Recursion-Backtracking',
    subtopics: [
      { title: 'Recursive Thinking', slug: 'recursion-backtracking/recursive-thinking', githubPath: 'Recursion-Backtracking/Recursive-Thinking' },
      { title: 'Tree Recursion', slug: 'recursion-backtracking/tree-recursion', githubPath: 'Recursion-Backtracking/Tree-Recursion' },
      { title: 'Pruning Techniques', slug: 'recursion-backtracking/pruning', githubPath: 'Recursion-Backtracking/Pruning-Techniques' },
      { title: 'Combinatorial Problems', slug: 'recursion-backtracking/combinatorial', githubPath: 'Recursion-Backtracking/Combinatorial-Problems' }
    ]
  },
  { 
    title: 'Sorting & Searching', 
    slug: 'sorting-searching', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Divide & conquer sorts and binary search patterns.',
    githubPath: 'Sorting-Searching',
    subtopics: [
      { title: 'Basic Sorting Algorithms', slug: 'sorting-searching/basic-sorting', githubPath: 'Sorting-Searching/Basic-Sorting' },
      { title: 'Advanced Sorting', slug: 'sorting-searching/advanced-sorting', githubPath: 'Sorting-Searching/Advanced-Sorting' },
      { title: 'Binary Search', slug: 'sorting-searching/binary-search', githubPath: 'Sorting-Searching/Binary-Search' },
      { title: 'Search Patterns', slug: 'sorting-searching/search-patterns', githubPath: 'Sorting-Searching/Search-Patterns' }
    ]
  },
  { 
    title: 'Hashing & Maps', 
    slug: 'hashing', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Hashmaps, collision ideas, frequency trick patterns.',
    githubPath: 'Hashing',
    subtopics: [
      { title: 'Hash Table Basics', slug: 'hashing/basics', githubPath: 'Hashing/Hash-Table-Basics' },
      { title: 'Collision Resolution', slug: 'hashing/collision', githubPath: 'Hashing/Collision-Resolution' },
      { title: 'Frequency Patterns', slug: 'hashing/frequency', githubPath: 'Hashing/Frequency-Patterns' },
      { title: 'Hash Functions', slug: 'hashing/functions', githubPath: 'Hashing/Hash-Functions' }
    ]
  },
  { 
    title: 'Trees (Binary Trees)', 
    slug: 'binary-trees', 
    difficulty: 'Intermediate', 
    estHours: 10, 
    blurb: 'Traversals, recursion, iterative DFS/BFS and properties.',
    githubPath: 'Binary-Trees',
    subtopics: [
      { title: 'Tree Traversals', slug: 'binary-trees/traversals', githubPath: 'Binary-Trees/Tree-Traversals' },
      { title: 'Tree Recursion', slug: 'binary-trees/recursion', githubPath: 'Binary-Trees/Tree-Recursion' },
      { title: 'DFS & BFS', slug: 'binary-trees/dfs-bfs', githubPath: 'Binary-Trees/DFS-BFS' },
      { title: 'Tree Properties', slug: 'binary-trees/properties', githubPath: 'Binary-Trees/Tree-Properties' }
    ]
  },
  { 
    title: 'Binary Search Trees', 
    slug: 'bst', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'BST operations, balancing ideas and order statistics.',
    githubPath: 'Binary-Search-Trees',
    subtopics: [
      { title: 'BST Operations', slug: 'bst/operations', githubPath: 'Binary-Search-Trees/BST-Operations' },
      { title: 'Tree Balancing', slug: 'bst/balancing', githubPath: 'Binary-Search-Trees/Tree-Balancing' },
      { title: 'Order Statistics', slug: 'bst/order-statistics', githubPath: 'Binary-Search-Trees/Order-Statistics' },
      { title: 'AVL Trees', slug: 'bst/avl', githubPath: 'Binary-Search-Trees/AVL-Trees' }
    ]
  },
  { 
    title: 'Heaps & Priority Queues', 
    slug: 'heaps', 
    difficulty: 'Intermediate', 
    estHours: 5, 
    blurb: 'K-way merge, sliding-window maxima, scheduling problems.',
    githubPath: 'Heaps-Priority-Queues',
    subtopics: [
      { title: 'Heap Implementation', slug: 'heaps/implementation', githubPath: 'Heaps-Priority-Queues/Heap-Implementation' },
      { title: 'Priority Queue Applications', slug: 'heaps/priority-queue', githubPath: 'Heaps-Priority-Queues/Priority-Queue-Applications' },
      { title: 'K-way Merge', slug: 'heaps/k-way-merge', githubPath: 'Heaps-Priority-Queues/K-Way-Merge' },
      { title: 'Heap Sort', slug: 'heaps/heap-sort', githubPath: 'Heaps-Priority-Queues/Heap-Sort' }
    ]
  },
  { 
    title: 'Graphs', 
    slug: 'graphs', 
    difficulty: 'Advanced', 
    estHours: 18, 
    blurb: 'BFS, DFS, shortest paths, components, topological sort.',
    githubPath: 'Graphs',
    subtopics: [
      { title: 'Graph Representation', slug: 'graphs/representation', githubPath: 'Graphs/Graph-Representation' },
      { title: 'DFS & BFS', slug: 'graphs/dfs-bfs', githubPath: 'Graphs/DFS-BFS' },
      { title: 'Shortest Paths', slug: 'graphs/shortest-paths', githubPath: 'Graphs/Shortest-Paths' },
      { title: 'Topological Sort', slug: 'graphs/topological-sort', githubPath: 'Graphs/Topological-Sort' },
      { title: 'Connected Components', slug: 'graphs/components', githubPath: 'Graphs/Connected-Components' }
    ]
  },
  { 
    title: 'Dynamic Programming', 
    slug: 'dynamic-programming', 
    difficulty: 'Advanced', 
    estHours: 24, 
    blurb: 'Patterns: knapsack, LIS, DP on trees and bitmask DP.',
    githubPath: 'Dynamic-Programming',
    subtopics: [
      { title: 'DP Fundamentals', slug: 'dynamic-programming/fundamentals', githubPath: 'Dynamic-Programming/DP-Fundamentals' },
      { title: 'Knapsack Problems', slug: 'dynamic-programming/knapsack', githubPath: 'Dynamic-Programming/Knapsack-Problems' },
      { title: 'LIS Variations', slug: 'dynamic-programming/lis', githubPath: 'Dynamic-Programming/LIS-Variations' },
      { title: 'DP on Trees', slug: 'dynamic-programming/trees', githubPath: 'Dynamic-Programming/DP-on-Trees' },
      { title: 'Bitmask DP', slug: 'dynamic-programming/bitmask', githubPath: 'Dynamic-Programming/Bitmask-DP' }
    ]
  },
  { 
    title: 'Greedy Algorithms', 
    slug: 'greedy-algorithms', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Greedy-choice property, interval problems, scheduling.',
    githubPath: 'Greedy-Algorithms',
    subtopics: [
      { title: 'Greedy Strategy', slug: 'greedy-algorithms/strategy', githubPath: 'Greedy-Algorithms/Greedy-Strategy' },
      { title: 'Interval Problems', slug: 'greedy-algorithms/intervals', githubPath: 'Greedy-Algorithms/Interval-Problems' },
      { title: 'Scheduling Problems', slug: 'greedy-algorithms/scheduling', githubPath: 'Greedy-Algorithms/Scheduling-Problems' },
      { title: 'Proof Techniques', slug: 'greedy-algorithms/proofs', githubPath: 'Greedy-Algorithms/Proof-Techniques' }
    ]
  },
  { 
    title: 'Backtracking', 
    slug: 'backtracking', 
    difficulty: 'Advanced', 
    estHours: 10, 
    blurb: 'Advanced pruning, constraint solving, and search optimization.',
    githubPath: 'Backtracking',
    subtopics: [
      { title: 'Backtracking Template', slug: 'backtracking/template', githubPath: 'Backtracking/Backtracking-Template' },
      { title: 'Pruning Strategies', slug: 'backtracking/pruning', githubPath: 'Backtracking/Pruning-Strategies' },
      { title: 'Constraint Satisfaction', slug: 'backtracking/constraints', githubPath: 'Backtracking/Constraint-Satisfaction' },
      { title: 'Search Optimization', slug: 'backtracking/optimization', githubPath: 'Backtracking/Search-Optimization' }
    ]
  },
  { 
    title: 'Tries & Advanced Strings', 
    slug: 'tries', 
    difficulty: 'Advanced', 
    estHours: 8, 
    blurb: 'Prefix trees, Aho-Corasick and autocomplete techniques.',
    githubPath: 'Tries-Advanced-Strings',
    subtopics: [
      { title: 'Trie Implementation', slug: 'tries/implementation', githubPath: 'Tries-Advanced-Strings/Trie-Implementation' },
      { title: 'Prefix Operations', slug: 'tries/prefix', githubPath: 'Tries-Advanced-Strings/Prefix-Operations' },
      { title: 'Aho-Corasick Algorithm', slug: 'tries/aho-corasick', githubPath: 'Tries-Advanced-Strings/Aho-Corasick' },
      { title: 'Autocomplete Systems', slug: 'tries/autocomplete', githubPath: 'Tries-Advanced-Strings/Autocomplete-Systems' }
    ]
  },
  { 
    title: 'Segment Trees & Fenwick', 
    slug: 'segment-tree-fenwick', 
    difficulty: 'Advanced', 
    estHours: 12, 
    blurb: 'Range queries, lazy propagation, BIT for fast updates.',
    githubPath: 'Segment-Trees-Fenwick',
    subtopics: [
      { title: 'Segment Tree Basics', slug: 'segment-tree-fenwick/segment-tree', githubPath: 'Segment-Trees-Fenwick/Segment-Tree-Basics' },
      { title: 'Lazy Propagation', slug: 'segment-tree-fenwick/lazy-propagation', githubPath: 'Segment-Trees-Fenwick/Lazy-Propagation' },
      { title: 'Fenwick Tree (BIT)', slug: 'segment-tree-fenwick/fenwick', githubPath: 'Segment-Trees-Fenwick/Fenwick-Tree' },
      { title: 'Range Update Queries', slug: 'segment-tree-fenwick/range-updates', githubPath: 'Segment-Trees-Fenwick/Range-Update-Queries' }
    ]
  },
  { 
    title: 'Bit Manipulation & Number Theory', 
    slug: 'bit-number-theory', 
    difficulty: 'Advanced', 
    estHours: 8, 
    blurb: 'Bit hacks, modular arithmetic, SPF, gcd, primes.',
    githubPath: 'Bit-Manipulation-Number-Theory',
    subtopics: [
      { title: 'Bit Operations', slug: 'bit-number-theory/bit-operations', githubPath: 'Bit-Manipulation-Number-Theory/Bit-Operations' },
      { title: 'Bit Manipulation Tricks', slug: 'bit-number-theory/tricks', githubPath: 'Bit-Manipulation-Number-Theory/Bit-Tricks' },
      { title: 'Modular Arithmetic', slug: 'bit-number-theory/modular', githubPath: 'Bit-Manipulation-Number-Theory/Modular-Arithmetic' },
      { title: 'Prime Numbers & GCD', slug: 'bit-number-theory/primes-gcd', githubPath: 'Bit-Manipulation-Number-Theory/Primes-GCD' }
    ]
  }
];

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

const slugToPath = (slug: string) => `/dsa/${slug}`;

// Helper function to generate GitHub URL
const getGithubUrl = (path: string) => {
  return `${GITHUB_CONFIG.baseUrl}/tree/${GITHUB_CONFIG.branch}/${encodeURIComponent(path)}`;
};

// GitHub Link Component
const GitHubLink = ({ githubPath, className = "" }: { githubPath?: string; className?: string }) => {
  if (!githubPath) {
    return (
      <span className={`text-slate-500 text-sm ${className}`} title="No GitHub content available">
        -
      </span>
    );
  }

  return (
    <a
      href={getGithubUrl(githubPath)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-sm ${className}`}
      title={`View ${githubPath} on GitHub`}
      onClick={(e) => e.stopPropagation()}
    >
      <FiGithub className="w-4 h-4" />
      <FiExternalLink className="w-3 h-3" />
    </a>
  );
};

export default function LearningDsa() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | keyof typeof difficultyOrder>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'time' | 'difficulty'>('recommended');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    let list = TOPICS.slice();
    if (filter !== 'All') list = list.filter((t) => t.difficulty === filter);
    if (query.trim()) list = list.filter((t) => (t.title + ' ' + t.blurb).toLowerCase().includes(query.toLowerCase()));

    if (sortBy === 'time') list.sort((a, b) => a.estHours - b.estHours);
    else if (sortBy === 'difficulty') list.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    else list.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    return list;
  }, [query, filter, sortBy]);

  const totalHours = useMemo(() => TOPICS.reduce((s, t) => s + t.estHours, 0), []);
  const topicsWithGithub = useMemo(() => TOPICS.filter(t => t.githubPath).length, []);

  const toggleTopicExpansion = (slug: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedTopics(newExpanded);
  };

  const handleSubtopicClick = (subtopicSlug: string) => {
    router.push(slugToPath(subtopicSlug));
  };

  const handleTopicClick = (topic: Topic) => {
    if (topic.subtopics && topic.subtopics.length > 0) {
      toggleTopicExpansion(topic.slug);
    } else {
      router.push(slugToPath(topic.slug));
    }
  };

  return (
    <div className="relative min-h-screen bg-charcoalBlack text-softSilver overflow-hidden font-sans">
      <Particles />
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
        < Navbar />
      </header>
      
      <div className="relative z-20 max-w-9xl mx-24  ">
        

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emeraldGreen to-tealBlue">
                PhyCode<br/> DSA Roadmap
              </h1>
              <a
                href={GITHUB_CONFIG.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="View full repository on GitHub"
              >
                <FiGithub className="w-5 h-5" />
                <span className="hidden sm:inline">Repository</span>
              </a>
            </div>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl">Embark on a structured journey to master Data Structures and Algorithms. Each step includes interactive lessons, practice problems, visual demonstrations, and source code examples.</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="relative flex items-center bg-slateBlack/40 border border-deepPlum rounded-full px-4 py-2 shadow-sm flex-1 max-w-md">
                <FiSearch className="w-5 h-5 text-softSilver mr-3" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics or concepts..."
                  className="bg-transparent placeholder:text-slate-400 focus:outline-none text-sm w-full"
                  aria-label="Search DSA topics"
                />
              </div>

              <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-slateBlack/30 border border-deepPlum rounded-full px-4 py-2 text-sm">
                <option value="All">All difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-slateBlack/30 border border-deepPlum rounded-full px-4 py-2 text-sm">
                <option value="recommended">Recommended Order</option>
                <option value="time">By Time Estimate</option>
                <option value="difficulty">By Difficulty</option>
              </select>

              <button
                onClick={() => router.push('/dsa/learning-plan')}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                <FaClipboardList className="w-4 h-4" /> Start Your Plan
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Total Topics</div>
                    <div className="text-2xl font-bold">{TOPICS.length}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Estimated Hours</div>
                    <div className="text-2xl font-bold">{totalHours} hrs</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-300/75">Recommended pace: 3-8 hours per topic, tailored to your schedule.</div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">GitHub Integration</div>
                    <div className="text-2xl font-bold">{topicsWithGithub}/{TOPICS.length}</div>
                  </div>
                  <FiGithub className="w-8 h-8 text-slate-400" />
                </div>
                <div className="mt-4 text-sm text-slate-300/75">Topics with source code examples and implementations available.</div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum relative overflow-hidden">
                <h4 className="text-lg font-semibold">Roadmap Essentials</h4>
                <ul className="mt-4 text-sm text-slate-300/70 space-y-2">
                  <li>Begin with Arrays, Strings, and Linked Lists for strong foundations.</li>
                  <li>Progress to Trees and Graphs, integrating DP practice regularly.</li>
                  <li>Use GitHub examples to understand implementation details.</li>
                </ul>
                <svg className="absolute right-4 bottom-4 w-24 h-24 opacity-10" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" stroke="#FDC57B" strokeWidth="2" fill="none" /></svg>
              </div>
            </div>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-goldenAmber">Your Learning Path</h2>
              <ul className="space-y-6">
                {filtered.map((t, index) => (
                  <li key={t.slug} className="relative">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-emeraldGreen to-tealBlue flex items-center justify-center text-charcoalBlack font-bold text-sm shadow-md">{index + 1}</div>
                    {index < filtered.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-[-2.5rem] w-0.5 bg-deepPlum/50" />
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="ml-12"
                    >
                      <div
                        className="p-6 rounded-xl bg-slateBlack/50 border border-deepPlum hover:bg-slateBlack/70 hover:border-tealBlue transition-all cursor-pointer shadow-lg hover:shadow-xl"
                        onClick={() => handleTopicClick(t)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleTopicClick(t); }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold text-softSilver">{t.title}</h3>
                              {t.subtopics && t.subtopics.length > 0 && (
                                <div className="text-tealBlue">
                                  {expandedTopics.has(t.slug) ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                                </div>
                              )}
                                <div className=" ml-auto ">
                                  <GitHubLink githubPath={t.githubPath} />
                                </div>
                                
                            </div>
                            <p className="mt-2 text-sm text-slate-300">{t.blurb}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-deepPlum/50 text-goldenAmber">{t.difficulty}</span>
                            <p className="mt-2 text-sm font-medium">{t.estHours} hrs</p>
                          </div>
                        </div>
                      </div>

                      {/* Subtopics Dropdown */}
                      {expandedTopics.has(t.slug) && t.subtopics && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 ml-6 space-y-2 border-l-2 border-deepPlum/30 pl-4"
                        >
                          {t.subtopics.map((subtopic, subIndex) => (
                            <div
                              key={subtopic.slug}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubtopicClick(subtopic.slug);
                              }}
                              className="p-3 rounded-lg bg-charcoalBlack/40 border border-deepPlum/30 hover:border-tealBlue/50 cursor-pointer transition-all hover:bg-charcoalBlack/60"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { 
                                if (e.key === 'Enter') {
                                  e.stopPropagation();
                                  handleSubtopicClick(subtopic.slug);
                                }
                              }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-deepPlum/40 flex items-center justify-center text-xs font-medium text-goldenAmber">
                                    {subIndex + 1}
                                  </div>
                                  <span className="text-sm font-medium text-softSilver hover:text-tealBlue transition-colors">
                                    {subtopic.title}
                                  </span>
                                </div>
                                <GitHubLink githubPath={subtopic.githubPath} className="ml-auto" />
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  </li>
                ))}
              </ul>
            </section>
          </main>

          <aside className="lg:w-80 lg:shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum shadow-lg">
                <div className="flex items-center gap-3">
                  <FaRocket className="w-6 h-6 text-goldenAmber" />
                  <div>
                    <div className="text-sm text-slate-400">Ultimate Goal</div>
                    <div className="font-semibold text-lg">Contest-Ready in 12-20 Weeks</div>
                  </div>
                </div>

                <ol className="mt-6 text-sm text-slate-300/75 space-y-3 list-decimal pl-5">
                  <li>Weeks 1-3: Build fundamentals with Arrays, Strings, Linked Lists.</li>
                  <li>Weeks 4-7: Dive into Trees, Graphs, and Sorting techniques.</li>
                  <li>Weeks 8-12: Master DP and advanced structures like Segment Trees.</li>
                  <li>Practice with GitHub examples throughout your journey.</li>
                </ol>

                <div className="mt-6">
                  <button onClick={() => router.push('/dsa/roadmap-download')} className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold hover:opacity-90 transition-opacity">Download Full Roadmap</button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FiGithub className="w-6 h-6 text-goldenAmber" />
                  <div>
                    <div className="text-sm text-slate-400">Repository Stats</div>
                    <div className="font-semibold text-lg">Code Examples</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Available Topics</span>
                    <span className="text-sm font-medium text-emeraldGreen">{topicsWithGithub}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Coming Soon</span>
                    <span className="text-sm font-medium text-slate-400">{TOPICS.length - topicsWithGithub}</span>
                  </div>
                  <div className="w-full bg-deepPlum/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emeraldGreen to-tealBlue h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(topicsWithGithub / TOPICS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={GITHUB_CONFIG.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <FiGithub className="w-4 h-4" />
                    View Full Repository
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum shadow-lg">
                <h4 className="text-lg font-semibold mb-4 text-goldenAmber">How to Use</h4>
                <ul className="text-sm text-slate-300/75 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Click on topic titles to expand and see subtopics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Use GitHub icons to view source code examples
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Topics marked with "-" are coming soon
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Follow the recommended order for best results
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-deepPlum pt-8">
          <div className="text-sm text-slate-300 text-center sm:text-left">Looking for motivation? Join the PhyCode community to find study partners and share progress.</div>
          <div className="flex gap-4">
            <Link href="/dsa/quiz" className="px-5 py-2 rounded-full border border-deepPlum hover:bg-deepPlum/30 transition-colors">Take a Quick Quiz</Link>
            <button onClick={() => router.push('/dsa/projects')} className="px-5 py-2 rounded-full bg-gradient-to-r from-emeraldGreen to-tealBlue text-charcoalBlack font-semibold hover:opacity-90 transition-opacity">Build a Project</button>
            <a
              href={GITHUB_CONFIG.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border border-slate-600 hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <FiGithub className="w-4 h-4" />
              Repository
            </a>
          </div>
        </div>
      </div>

      <button 
        aria-label="Open learning plan" 
        onClick={() => router.push('/dsa/learning-plan')} 
        className="fixed right-6 bottom-6 z-40 p-4 rounded-full shadow-2xl bg-gradient-to-br from-goldenAmber to-softOrange hover:scale-105 transition-transform"
      >
        <FaClipboardList className="w-6 h-6 text-charcoalBlack" />
      </button>
    </div>
  );
}