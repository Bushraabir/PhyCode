import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { FaRocket, FaClipboardList, FaStar } from 'react-icons/fa';
import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';

type Topic = {
  title: string;
  slug: string; // maps to D:\coding space\PhyCode\phycode\src\pages\dsa\<slug>.tsx
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number; // estimated hours
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

export default function DsaHome() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | keyof typeof difficultyOrder>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'time' | 'difficulty'>('recommended');
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // autofocus search on mount on desktop
    if (typeof window !== 'undefined' && window.innerWidth > 768) searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    let list = TOPICS.slice();
    if (filter !== 'All') list = list.filter((t) => t.difficulty === filter);
    if (query.trim()) list = list.filter((t) => (t.title + ' ' + t.blurb).toLowerCase().includes(query.toLowerCase()));

    if (sortBy === 'time') list.sort((a, b) => a.estHours - b.estHours);
    else if (sortBy === 'difficulty') list.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    // recommended: keep original but push core fundamentals (beginner) first
    else list.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    return list;
  }, [query, filter, sortBy]);

  const totalHours = useMemo(() => TOPICS.reduce((s, t) => s + t.estHours, 0), []);

  const handleOpenTopic = (slug: string) => {
    // navigates to /dsa/<slug> — ensure file exists at
    // D:\coding space\PhyCode\phycode\src\pages\dsa\<slug>.tsx
    router.push(slugToPath(slug));
  };

  return (
    <div className="relative min-h-screen bg-[#020417] text-slate-50 overflow-hidden font-sans">
      {/* Particles kept for theme continuity */}
      <Particles interactive={true} />

      <div className="relative z-20 max-w-8xl mx-auto px-6 lg:px-12 py-12">
        <Navbar />

        <header className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <h1 className="font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#00f5d4,#06b6d4,#8b5cf6)' , fontSize: 'clamp(1.8rem, 4.6vw, 3.5rem)'}}>
              PhyCode DSA Roadmap
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl">A curated, battle-tested path to mastering Data Structures & Algorithms. Each topic has step-by-step lessons, problems, and a visual demo page. Click any card to open its dedicated learning page</p>

            <div className="mt-4 flex gap-3 flex-wrap items-center">
              <div className="relative flex items-center bg-slate-900/40 border border-slate-700 rounded-full px-3 py-2 shadow-sm">
                <FiSearch className="w-5 h-5 text-slate-300 mr-2" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics or concepts..."
                  className="bg-transparent placeholder:text-slate-400 focus:outline-none text-sm"
                  aria-label="Search DSA topics"
                />
              </div>

              <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="bg-slate-900/30 border border-slate-700 rounded-full px-3 py-2 text-sm">
                <option value="All">All difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-slate-900/30 border border-slate-700 rounded-full px-3 py-2 text-sm">
                <option value="recommended">Recommended</option>
                <option value="time">Shortest time</option>
                <option value="difficulty">By difficulty</option>
              </select>

              <button
                onClick={() => router.push('/dsa/learning-plan')}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-fuchsia-500 text-slate-900 font-semibold shadow-lg"
              >
                <FaClipboardList /> Start Plan
              </button>
            </div>

            {/* timeline summary */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900/60 to-slate-800/30 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Total topics</div>
                    <div className="text-xl font-semibold">{TOPICS.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Estimated total hours</div>
                    <div className="text-xl font-semibold">{totalHours} hrs</div>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-slate-800/40 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min(100, Math.round((36 / totalHours) * 100))}%`, background: 'linear-gradient(90deg,#00f5d4,#8b5cf6)' }} />
                </div>
                <div className="mt-2 text-xs text-slate-300/75">Suggested pace: 3-8 hours / topic. Adjust to your availability.</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900/60 to-slate-800/30 border border-slate-700 relative overflow-hidden">
                <h4 className="text-sm font-semibold">Roadmap highlights</h4>
                <ul className="mt-3 text-sm text-slate-300/70 grid grid-cols-1 gap-2">
                  <li>Start with Arrays → Strings → Linked List</li>
                  <li>Then move to Trees & Graphs while practicing DP weekly</li>
                  <li>Always build a small visual demo for one tricky concept</li>
                </ul>
                <svg className="absolute right-3 bottom-3 w-28 h-28 opacity-10" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="1" fill="none" /></svg>
              </div>
            </div>

          </div>

          {/* sticky guide on the right */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 p-4 rounded-2xl bg-gradient-to-tr from-slate-900/60 to-slate-800/30 border border-slate-700">
              <div className="flex items-center gap-3">
                <FaRocket className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-xs text-slate-400">Roadmap goal</div>
                  <div className="font-semibold">Become contest ready in 12–20 weeks</div>
                </div>
              </div>

              <ol className="mt-4 text-sm text-slate-300/75 space-y-2">
                <li>Week 1–3: Fundamentals (Arrays, Strings, Linked Lists)</li>
                <li>Week 4–7: Trees, Graphs, Sorting</li>
                <li>Week 8–12: DP + Advanced DS (SegTree, Tries)</li>
              </ol>

              <div className="mt-4">
                <button onClick={() => router.push('/dsa/roadmap-download')} className="w-full px-3 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold">Download Plan</button>
              </div>
            </div>
          </aside>
        </header>

        {/* topics grid */}
        <section className="mt-10">
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t) => (
              <motion.article
                key={t.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl border border-slate-700 bg-gradient-to-tr from-slate-900/40 to-slate-800/20 p-4 cursor-pointer hover:shadow-[0_20px_60px_rgba(139,92,246,0.12)]"
                onClick={() => handleOpenTopic(t.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleOpenTopic(t.slug); }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-lg">{t.title}</h3>
                    <p className="text-xs text-slate-300/70 mt-1">{t.blurb}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">{t.difficulty}</div>
                    <div className="text-sm font-medium mt-2">{t.estHours} hrs</div>
                  </div>
                </div>

                {/* decorative connectors + animated badge */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900 shadow-md">{t.title.split(' ').slice(0,1)[0].charAt(0)}</div>
                  <div className="flex-1 h-2 bg-slate-800/30 rounded-full overflow-hidden">
                    <div style={{ width: `${Math.min(100, (t.estHours / 24) * 100)}%`, height: 8, background: 'linear-gradient(90deg,#00f5d4,#8b5cf6)' }} />
                  </div>
                </div>

                <div className="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <FaStar className="w-6 h-6 text-amber-400" />
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* footer quick-actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-300">Need a study buddy? Join the PhyCode community and pair up for problem solving.</div>
          <div className="flex gap-3">
            <Link href="/dsa/quiz" className="px-4 py-2 rounded-full border border-slate-700">Quick quiz</Link>
            <button onClick={() => router.push('/dsa/projects')} className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-fuchsia-500 text-slate-900 font-semibold">Build a project</button>
          </div>
        </div>

      </div>

      {/* floating helper */}
      <button aria-label="Open learning plan" onClick={() => router.push('/dsa/learning-plan')} className="fixed right-6 bottom-6 z-40 p-3 rounded-full shadow-lg bg-gradient-to-br from-emerald-400 to-fuchsia-500">
        <FaClipboardList className="w-5 h-5 text-slate-900" />
      </button>
    </div>
  );
}
