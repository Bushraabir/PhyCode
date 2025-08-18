import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaRocket, FaClipboardList } from 'react-icons/fa';
import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';

type Subtopic = {
  title: string;
  slug: string;
};

type Topic = {
  title: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number;
  blurb: string;
  subtopics?: Subtopic[];
};

const TOPICS: Topic[] = [
  { 
    title: 'Introduction & Setup', 
    slug: 'introduction', 
    difficulty: 'Beginner', 
    estHours: 2, 
    blurb: 'Why DSA matters, tools, environment setup and first steps.',
    subtopics: [
      { title: 'Why DSA Matters', slug: 'topic/introduction/whyDsa' },
      { title: 'Problem Solving Approach', slug: 'topic/introduction/problemSolvingApproach' }
    ]
  },
  { 
    title: 'Complexity Analysis', 
    slug: 'complexity-analysis', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Big-O, amortized analysis, and common complexity patterns.',
    subtopics: [
      { title: 'Big-O Notation', slug: 'complexity-analysis/big-o' },
      { title: 'Amortized Analysis', slug: 'complexity-analysis/amortized' },
      { title: 'Common Complexity Patterns', slug: 'complexity-analysis/patterns' },
      { title: 'Space Complexity', slug: 'complexity-analysis/space' }
    ]
  },
  { 
    title: 'Arrays', 
    slug: 'arrays', 
    difficulty: 'Beginner', 
    estHours: 8, 
    blurb: 'Two pointers, sliding windows, partitioning, in-place tricks.',
    subtopics: [
      { title: 'Two Pointers Technique', slug: 'arrays/two-pointers' },
      { title: 'Sliding Window', slug: 'arrays/sliding-window' },
      { title: 'Array Partitioning', slug: 'arrays/partitioning' },
      { title: 'In-place Operations', slug: 'arrays/in-place' }
    ]
  },
  { 
    title: 'Strings', 
    slug: 'strings', 
    difficulty: 'Beginner', 
    estHours: 8, 
    blurb: 'Parsing, pattern search, KMP, rolling hash basics.',
    subtopics: [
      { title: 'String Parsing', slug: 'strings/parsing' },
      { title: 'Pattern Matching', slug: 'strings/pattern-matching' },
      { title: 'KMP Algorithm', slug: 'strings/kmp' },
      { title: 'Rolling Hash', slug: 'strings/rolling-hash' }
    ]
  },
  { 
    title: 'Linked Lists', 
    slug: 'linked-list', 
    difficulty: 'Beginner', 
    estHours: 6, 
    blurb: 'Pointers, reversal, cycle detection and common patterns.',
    subtopics: [
      { title: 'Pointer Manipulation', slug: 'linked-list/pointers' },
      { title: 'List Reversal', slug: 'linked-list/reversal' },
      { title: 'Cycle Detection', slug: 'linked-list/cycle-detection' },
      { title: 'Merge Operations', slug: 'linked-list/merge' }
    ]
  },
  { 
    title: 'Stacks & Queues', 
    slug: 'stacks-queues', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Monotonic stacks, deque tricks and use cases.',
    subtopics: [
      { title: 'Basic Stack Operations', slug: 'stacks-queues/basic-stack' },
      { title: 'Monotonic Stack', slug: 'stacks-queues/monotonic' },
      { title: 'Queue Implementation', slug: 'stacks-queues/queue' },
      { title: 'Deque Applications', slug: 'stacks-queues/deque' }
    ]
  },
  { 
    title: 'Recursion & Backtracking', 
    slug: 'recursion-backtracking', 
    difficulty: 'Intermediate', 
    estHours: 10, 
    blurb: 'Tree recursion, pruning, and combinatorial backtracking.',
    subtopics: [
      { title: 'Recursive Thinking', slug: 'recursion-backtracking/recursive-thinking' },
      { title: 'Tree Recursion', slug: 'recursion-backtracking/tree-recursion' },
      { title: 'Pruning Techniques', slug: 'recursion-backtracking/pruning' },
      { title: 'Combinatorial Problems', slug: 'recursion-backtracking/combinatorial' }
    ]
  },
  { 
    title: 'Sorting & Searching', 
    slug: 'sorting-searching', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Divide & conquer sorts and binary search patterns.',
    subtopics: [
      { title: 'Basic Sorting Algorithms', slug: 'sorting-searching/basic-sorting' },
      { title: 'Advanced Sorting', slug: 'sorting-searching/advanced-sorting' },
      { title: 'Binary Search', slug: 'sorting-searching/binary-search' },
      { title: 'Search Patterns', slug: 'sorting-searching/search-patterns' }
    ]
  },
  { 
    title: 'Hashing & Maps', 
    slug: 'hashing', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Hashmaps, collision ideas, frequency trick patterns.',
    subtopics: [
      { title: 'Hash Table Basics', slug: 'hashing/basics' },
      { title: 'Collision Resolution', slug: 'hashing/collision' },
      { title: 'Frequency Patterns', slug: 'hashing/frequency' },
      { title: 'Hash Functions', slug: 'hashing/functions' }
    ]
  },
  { 
    title: 'Trees (Binary Trees)', 
    slug: 'binary-trees', 
    difficulty: 'Intermediate', 
    estHours: 10, 
    blurb: 'Traversals, recursion, iterative DFS/BFS and properties.',
    subtopics: [
      { title: 'Tree Traversals', slug: 'binary-trees/traversals' },
      { title: 'Tree Recursion', slug: 'binary-trees/recursion' },
      { title: 'DFS & BFS', slug: 'binary-trees/dfs-bfs' },
      { title: 'Tree Properties', slug: 'binary-trees/properties' }
    ]
  },
  { 
    title: 'Binary Search Trees', 
    slug: 'bst', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'BST operations, balancing ideas and order statistics.',
    subtopics: [
      { title: 'BST Operations', slug: 'bst/operations' },
      { title: 'Tree Balancing', slug: 'bst/balancing' },
      { title: 'Order Statistics', slug: 'bst/order-statistics' },
      { title: 'AVL Trees', slug: 'bst/avl' }
    ]
  },
  { 
    title: 'Heaps & Priority Queues', 
    slug: 'heaps', 
    difficulty: 'Intermediate', 
    estHours: 5, 
    blurb: 'K-way merge, sliding-window maxima, scheduling problems.',
    subtopics: [
      { title: 'Heap Implementation', slug: 'heaps/implementation' },
      { title: 'Priority Queue Applications', slug: 'heaps/priority-queue' },
      { title: 'K-way Merge', slug: 'heaps/k-way-merge' },
      { title: 'Heap Sort', slug: 'heaps/heap-sort' }
    ]
  },
  { 
    title: 'Graphs', 
    slug: 'graphs', 
    difficulty: 'Advanced', 
    estHours: 18, 
    blurb: 'BFS, DFS, shortest paths, components, topological sort.',
    subtopics: [
      { title: 'Graph Representation', slug: 'graphs/representation' },
      { title: 'DFS & BFS', slug: 'graphs/dfs-bfs' },
      { title: 'Shortest Paths', slug: 'graphs/shortest-paths' },
      { title: 'Topological Sort', slug: 'graphs/topological-sort' },
      { title: 'Connected Components', slug: 'graphs/components' }
    ]
  },
  { 
    title: 'Dynamic Programming', 
    slug: 'dynamic-programming', 
    difficulty: 'Advanced', 
    estHours: 24, 
    blurb: 'Patterns: knapsack, LIS, DP on trees and bitmask DP.',
    subtopics: [
      { title: 'DP Fundamentals', slug: 'dynamic-programming/fundamentals' },
      { title: 'Knapsack Problems', slug: 'dynamic-programming/knapsack' },
      { title: 'LIS Variations', slug: 'dynamic-programming/lis' },
      { title: 'DP on Trees', slug: 'dynamic-programming/trees' },
      { title: 'Bitmask DP', slug: 'dynamic-programming/bitmask' }
    ]
  },
  { 
    title: 'Greedy Algorithms', 
    slug: 'greedy-algorithms', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Greedy-choice property, interval problems, scheduling.',
    subtopics: [
      { title: 'Greedy Strategy', slug: 'greedy-algorithms/strategy' },
      { title: 'Interval Problems', slug: 'greedy-algorithms/intervals' },
      { title: 'Scheduling Problems', slug: 'greedy-algorithms/scheduling' },
      { title: 'Proof Techniques', slug: 'greedy-algorithms/proofs' }
    ]
  },
  { 
    title: 'Backtracking', 
    slug: 'backtracking', 
    difficulty: 'Advanced', 
    estHours: 10, 
    blurb: 'Advanced pruning, constraint solving, and search optimization.',
    subtopics: [
      { title: 'Backtracking Template', slug: 'backtracking/template' },
      { title: 'Pruning Strategies', slug: 'backtracking/pruning' },
      { title: 'Constraint Satisfaction', slug: 'backtracking/constraints' },
      { title: 'Search Optimization', slug: 'backtracking/optimization' }
    ]
  },
  { 
    title: 'Tries & Advanced Strings', 
    slug: 'tries', 
    difficulty: 'Advanced', 
    estHours: 8, 
    blurb: 'Prefix trees, Aho-Corasick and autocomplete techniques.',
    subtopics: [
      { title: 'Trie Implementation', slug: 'tries/implementation' },
      { title: 'Prefix Operations', slug: 'tries/prefix' },
      { title: 'Aho-Corasick Algorithm', slug: 'tries/aho-corasick' },
      { title: 'Autocomplete Systems', slug: 'tries/autocomplete' }
    ]
  },
  { 
    title: 'Segment Trees & Fenwick', 
    slug: 'segment-tree-fenwick', 
    difficulty: 'Advanced', 
    estHours: 12, 
    blurb: 'Range queries, lazy propagation, BIT for fast updates.',
    subtopics: [
      { title: 'Segment Tree Basics', slug: 'segment-tree-fenwick/segment-tree' },
      { title: 'Lazy Propagation', slug: 'segment-tree-fenwick/lazy-propagation' },
      { title: 'Fenwick Tree (BIT)', slug: 'segment-tree-fenwick/fenwick' },
      { title: 'Range Update Queries', slug: 'segment-tree-fenwick/range-updates' }
    ]
  },
  { 
    title: 'Bit Manipulation & Number Theory', 
    slug: 'bit-number-theory', 
    difficulty: 'Advanced', 
    estHours: 8, 
    blurb: 'Bit hacks, modular arithmetic, SPF, gcd, primes.',
    subtopics: [
      { title: 'Bit Operations', slug: 'bit-number-theory/bit-operations' },
      { title: 'Bit Manipulation Tricks', slug: 'bit-number-theory/tricks' },
      { title: 'Modular Arithmetic', slug: 'bit-number-theory/modular' },
      { title: 'Prime Numbers & GCD', slug: 'bit-number-theory/primes-gcd' }
    ]
  }
];

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

const slugToPath = (slug: string) => `/dsa/${slug}`;

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

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Navbar />

        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emeraldGreen to-tealBlue">
              PhyCode DSA Roadmap
            </h1>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl">Embark on a structured journey to master Data Structures and Algorithms. Each step includes interactive lessons, practice problems, and visual demonstrations.</p>

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

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum relative overflow-hidden">
                <h4 className="text-lg font-semibold">Roadmap Essentials</h4>
                <ul className="mt-4 text-sm text-slate-300/70 space-y-2">
                  <li>Begin with Arrays, Strings, and Linked Lists for strong foundations.</li>
                  <li>Progress to Trees and Graphs, integrating DP practice regularly.</li>
                  <li>Incorporate visual demos to solidify complex concepts.</li>
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
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-semibold text-softSilver">{t.title}</h3>
                              {t.subtopics && t.subtopics.length > 0 && (
                                <div className="text-tealBlue">
                                  {expandedTopics.has(t.slug) ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                                </div>
                              )}
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
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-deepPlum/40 flex items-center justify-center text-xs font-medium text-goldenAmber">
                                  {subIndex + 1}
                                </div>
                                <span className="text-sm font-medium text-softSilver hover:text-tealBlue transition-colors">
                                  {subtopic.title}
                                </span>
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
            <div className="lg:sticky lg:top-24 p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum shadow-lg">
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
              </ol>

              <div className="mt-6">
                <button onClick={() => router.push('/dsa/roadmap-download')} className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold hover:opacity-90 transition-opacity">Download Full Roadmap</button>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-deepPlum pt-8">
          <div className="text-sm text-slate-300 text-center sm:text-left">Looking for motivation? Join the PhyCode community to find study partners and share progress.</div>
          <div className="flex gap-4">
            <Link href="/dsa/quiz" className="px-5 py-2 rounded-full border border-deepPlum hover:bg-deepPlum/30 transition-colors">Take a Quick Quiz</Link>
            <button onClick={() => router.push('/dsa/projects')} className="px-5 py-2 rounded-full bg-gradient-to-r from-emeraldGreen to-tealBlue text-charcoalBlack font-semibold hover:opacity-90 transition-opacity">Build a Project</button>
          </div>
        </div>
      </div>

      <button aria-label="Open learning plan" onClick={() => router.push('/dsa/learning-plan')} className="fixed right-6 bottom-6 z-40 p-4 rounded-full shadow-2xl bg-gradient-to-br from-goldenAmber to-softOrange hover:scale-105 transition-transform">
        <FaClipboardList className="w-6 h-6 text-charcoalBlack" />
      </button>
    </div>
  );
}