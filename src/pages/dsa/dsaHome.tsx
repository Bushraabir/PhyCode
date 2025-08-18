import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { FaRocket, FaClipboardList } from 'react-icons/fa';
import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';

type Topic = {
  title: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number;
  blurb: string;
};

const TOPICS: Topic[] = [
  { title: 'Introduction & Setup', slug: 'introduction', difficulty: 'Beginner', estHours: 2, blurb: 'Why DSA matters, tools, environment setup and first steps.' },
  { title: 'Complexity Analysis', slug: 'complexity-analysis', difficulty: 'Beginner', estHours: 4, blurb: 'Big-O, amortized analysis, and common complexity patterns.' },
  { title: 'Arrays', slug: 'arrays', difficulty: 'Beginner', estHours: 8, blurb: 'Two pointers, sliding windows, partitioning, in-place tricks.' },
  { title: 'Strings', slug: 'strings', difficulty: 'Beginner', estHours: 8, blurb: 'Parsing, pattern search, KMP, rolling hash basics.' },
  { title: 'Linked Lists', slug: 'linked-list', difficulty: 'Beginner', estHours: 6, blurb: 'Pointers, reversal, cycle detection and common patterns.' },
  { title: 'Stacks & Queues', slug: 'stacks-queues', difficulty: 'Beginner', estHours: 4, blurb: 'Monotonic stacks, deque tricks and use cases.' },
  { title: 'Recursion & Backtracking', slug: 'recursion-backtracking', difficulty: 'Intermediate', estHours: 10, blurb: 'Tree recursion, pruning, and combinatorial backtracking.' },
  { title: 'Sorting & Searching', slug: 'sorting-searching', difficulty: 'Intermediate', estHours: 6, blurb: 'Divide & conquer sorts and binary search patterns.' },
  { title: 'Hashing & Maps', slug: 'hashing', difficulty: 'Intermediate', estHours: 6, blurb: 'Hashmaps, collision ideas, frequency trick patterns.' },
  { title: 'Trees (Binary Trees)', slug: 'binary-trees', difficulty: 'Intermediate', estHours: 10, blurb: 'Traversals, recursion, iterative DFS/BFS and properties.' },
  { title: 'Binary Search Trees', slug: 'bst', difficulty: 'Intermediate', estHours: 6, blurb: 'BST operations, balancing ideas and order statistics.' },
  { title: 'Heaps & Priority Queues', slug: 'heaps', difficulty: 'Intermediate', estHours: 5, blurb: 'K-way merge, sliding-window maxima, scheduling problems.' },
  { title: 'Graphs', slug: 'graphs', difficulty: 'Advanced', estHours: 18, blurb: 'BFS, DFS, shortest paths, components, topological sort.' },
  { title: 'Dynamic Programming', slug: 'dynamic-programming', difficulty: 'Advanced', estHours: 24, blurb: 'Patterns: knapsack, LIS, DP on trees and bitmask DP.' },
  { title: 'Greedy Algorithms', slug: 'greedy-algorithms', difficulty: 'Intermediate', estHours: 6, blurb: 'Greedy-choice property, interval problems, scheduling.' },
  { title: 'Backtracking', slug: 'backtracking', difficulty: 'Advanced', estHours: 10, blurb: 'Advanced pruning, constraint solving, and search optimization.' },
  { title: 'Tries & Advanced Strings', slug: 'tries', difficulty: 'Advanced', estHours: 8, blurb: 'Prefix trees, Aho-Corasick and autocomplete techniques.' },
  { title: 'Segment Trees & Fenwick', slug: 'segment-tree-fenwick', difficulty: 'Advanced', estHours: 12, blurb: 'Range queries, lazy propagation, BIT for fast updates.' },
  { title: 'Bit Manipulation & Number Theory', slug: 'bit-number-theory', difficulty: 'Advanced', estHours: 8, blurb: 'Bit hacks, modular arithmetic, SPF, gcd, primes.' }
];

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

const slugToPath = (slug: string) => `/dsa/${slug}`;

export default function LearningDsa() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | keyof typeof difficultyOrder>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'time' | 'difficulty'>('recommended');
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

  const handleOpenTopic = (slug: string) => {
    router.push(slugToPath(slug));
  };

  return (
    <div className="relative min-h-screen bg-charcoalBlack text-softSilver overflow-hidden font-sans">
      <Particles interactive={true} />

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
                      className="ml-12 p-6 rounded-xl bg-slateBlack/50 border border-deepPlum hover:bg-slateBlack/70 hover:border-tealBlue transition-all cursor-pointer shadow-lg hover:shadow-xl"
                      onClick={() => handleOpenTopic(t.slug)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleOpenTopic(t.slug); }}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-softSilver">{t.title}</h3>
                          <p className="mt-2 text-sm text-slate-300">{t.blurb}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-deepPlum/50 text-goldenAmber">{t.difficulty}</span>
                          <p className="mt-2 text-sm font-medium">{t.estHours} hrs</p>
                        </div>
                      </div>
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