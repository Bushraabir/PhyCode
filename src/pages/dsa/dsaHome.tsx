import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiGithub, FiExternalLink, FiChevronRight } from 'react-icons/fi';
import { FaRocket, FaClipboardList, FaYoutube } from 'react-icons/fa';
import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';



type Topic = {
  title: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number;
  blurb: string;
  subtopics?: Subtopic[];
  githubPath?: string;
  youtubePath?: string;
};

type Subtopic = {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
  subsubtopics?: SubSubtopic[];
  files?: FileItem[];
};

type SubSubtopic = {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
  files?: FileItem[];
};

type FileItem = {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
};

// GitHub repository configuration
const GITHUB_CONFIG = {
  baseUrl: 'https://github.com/Bushraabir/Data-Structure-And-Algorithm',
  owner: 'Bushra Khandoker',
  repo: 'Data-Structure-And-Algorithm',
  branch: 'main'
};

// YouTube channel configuration
const YOUTUBE_CONFIG = {
  baseUrl: 'https://www.youtube.com/channel/YOUR_CHANNEL_ID',
  playlistUrl: 'https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID'
};

const TOPICS: Topic[] = [
  { 
    title: 'Introduction & Setup', 
    slug: 'introduction', 
    difficulty: 'Beginner', 
    estHours: 2, 
    blurb: 'Why DSA matters, tools, environment setup and first steps.',
    githubPath: '',
    youtubePath: 'intro-dsa-playlist',
    subtopics: [
      { 
        title: 'Why DSA Matters', 
        slug: 'topic/introduction/whyDsa', 
        githubPath: '', 
        youtubePath: 'why-dsa-matters'
      },
      { 
        title: 'Problem Solving Approach', 
        slug: 'topic/introduction/problemSolvingApproach', 
        githubPath: '', 
        youtubePath: 'problem-solving-approach'
      }
    ]
  },
  { 
    title: 'Basic Programming Syntax', 
    slug: 'basic-syntax', 
    difficulty: 'Beginner', 
    estHours: 2, 
    blurb: 'User Input, Conditions and basic programming constructs',
    githubPath: '00.basics',
    youtubePath: 'basic-programming-playlist',
    subtopics: [
      { 
        title: 'Input and Output', 
        slug: 'topic/basic-syntax/input-output', 
        githubPath: '00.basics/input-output', 
        youtubePath: 'input-output-tutorial',
        files: [
          { title: 'Basic Input', slug: 'basic-input', githubPath: '00.basics/01.user input.cpp', youtubePath: 'basic-input-video' },
          { title: 'Advanced Input', slug: 'advanced-input', githubPath: '00.basics/01.advanced input.cpp', youtubePath: 'advanced-input-video' }
        ]
      },
      { 
        title: 'Conditional Statements', 
        slug: 'topic/basic-syntax/conditionals', 
        githubPath: '00.basics/conditionals', 
        youtubePath: 'conditionals-tutorial',
        files: [
          { title: 'If Else Basics', slug: 'if-else-basic', githubPath: '00.basics/02. if elself.cpp', youtubePath: 'if-else-video' },
          { title: 'Switch Statements', slug: 'switch-statements', githubPath: '00.basics/03. switch.cpp', youtubePath: 'switch-video' }
        ]
      }
    ]
  },
  { 
    title: 'Patterns and Nested Loops', 
    slug: 'patterns', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Practice patterns with nested loops',
    githubPath: '01.Patterns',
    youtubePath: 'patterns-playlist',
    subtopics: [
      { 
        title: 'Square Patterns', 
        slug: 'patterns/square', 
        githubPath: '01.Patterns/Square', 
        youtubePath: 'square-patterns',
        subsubtopics: [
          {
            title: 'Basic Square',
            slug: 'patterns/square/basic',
            githubPath: '01.Patterns/Square/Basic',
            youtubePath: 'basic-square-pattern',
            files: [
              { title: 'Square Pattern I', slug: 'square-1', githubPath: '01.Patterns/Square/Basic/01.square1.cpp', youtubePath: 'square-pattern-1' },
              { title: 'Square Pattern II', slug: 'square-2', githubPath: '01.Patterns/Square/Basic/02.square2.cpp', youtubePath: 'square-pattern-2' }
            ]
          },
          {
            title: 'Hollow Square',
            slug: 'patterns/square/hollow',
            githubPath: '01.Patterns/Square/Hollow',
            youtubePath: 'hollow-square-pattern',
            files: [
              { title: 'Hollow Square Pattern', slug: 'hollow-square', githubPath: '01.Patterns/Square/Hollow/hollow_square.cpp', youtubePath: 'hollow-square-video' }
            ]
          }
        ]
      },
      { 
        title: 'Triangle Patterns', 
        slug: 'patterns/triangle', 
        githubPath: '01.Patterns/Triangle', 
        youtubePath: 'triangle-patterns',
        subsubtopics: [
          {
            title: 'Right Triangle',
            slug: 'patterns/triangle/right',
            githubPath: '01.Patterns/Triangle/Right',
            youtubePath: 'right-triangle-pattern',
            files: [
              { title: 'Triangle Pattern I', slug: 'triangle-1', githubPath: '01.Patterns/Triangle/Right/01.triangle1.cpp', youtubePath: 'triangle-pattern-1' },
              { title: 'Triangle Pattern II', slug: 'triangle-2', githubPath: '01.Patterns/Triangle/Right/02.triangle2.cpp', youtubePath: 'triangle-pattern-2' },
              { title: 'Triangle Pattern III', slug: 'triangle-3', githubPath: '01.Patterns/Triangle/Right/03.triangle3.cpp', youtubePath: 'triangle-pattern-3' }
            ]
          },
          {
            title: 'Reverse Triangle',
            slug: 'patterns/triangle/reverse',
            githubPath: '01.Patterns/Triangle/Reverse',
            youtubePath: 'reverse-triangle-pattern',
            files: [
              { title: 'Reverse Triangle', slug: 'reverse-triangle', githubPath: '01.Patterns/Triangle/Reverse/reverse_triangle.cpp', youtubePath: 'reverse-triangle-video' }
            ]
          }
        ]
      },
      { 
        title: 'Advanced Patterns', 
        slug: 'patterns/advanced', 
        githubPath: '01.Patterns/Advanced', 
        youtubePath: 'advanced-patterns',
        files: [
          { title: 'Floyd\'s Triangle', slug: 'floyds-triangle', githubPath: '01.Patterns/Advanced/floyds_triangle.cpp', youtubePath: 'floyds-triangle-video' },
          { title: 'Pyramid Pattern', slug: 'pyramid', githubPath: '01.Patterns/Advanced/pyramid.cpp', youtubePath: 'pyramid-video' },
          { title: 'Diamond Pattern', slug: 'diamond', githubPath: '01.Patterns/Advanced/diamond.cpp', youtubePath: 'diamond-video' },
          { title: 'Butterfly Pattern', slug: 'butterfly', githubPath: '01.Patterns/Advanced/butterfly.cpp', youtubePath: 'butterfly-video' }
        ]
      }
    ]
  },
  { 
    title: 'Basic Functions', 
    slug: 'functions', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Learn function basics and mathematical computations',
    githubPath: '02.Functions',
    youtubePath: 'functions-playlist',
    subtopics: [
      { 
        title: 'Function Basics', 
        slug: 'functions/basics', 
        githubPath: '02.Functions/Basics', 
        youtubePath: 'function-basics',
        files: [
          { title: 'Sum of n numbers', slug: 'sum-n', githubPath: '02.Functions/Basics/01.sum_n.cpp', youtubePath: 'sum-n-video' },
          { title: 'Factorial', slug: 'factorial', githubPath: '02.Functions/Basics/02.factorial.cpp', youtubePath: 'factorial-video' },
          { title: 'Minimum of two', slug: 'min-two', githubPath: '02.Functions/Basics/03.min_two.cpp', youtubePath: 'min-two-video' }
        ]
      },
      { 
        title: 'Advanced Functions', 
        slug: 'functions/advanced', 
        githubPath: '02.Functions/Advanced', 
        youtubePath: 'advanced-functions',
        files: [
          { title: 'Pass by Value', slug: 'pass-by-value', githubPath: '02.Functions/Advanced/01.pass_by_value.cpp', youtubePath: 'pass-by-value-video' },
          { title: 'Sum of digits', slug: 'sum-digits', githubPath: '02.Functions/Advanced/02.sum_digits.cpp', youtubePath: 'sum-digits-video' },
          { title: 'nCr Combination', slug: 'ncr', githubPath: '02.Functions/Advanced/03.ncr.cpp', youtubePath: 'ncr-video' }
        ]
      },
      { 
        title: 'Mathematical Functions', 
        slug: 'functions/math', 
        githubPath: '02.Functions/Mathematical', 
        youtubePath: 'math-functions',
        files: [
          { title: 'Prime Check', slug: 'prime-check', githubPath: '02.Functions/Mathematical/01.prime.cpp', youtubePath: 'prime-check-video' },
          { title: 'Prime Numbers up to N', slug: 'primes-upto-n', githubPath: '02.Functions/Mathematical/02.primes_upto_n.cpp', youtubePath: 'primes-upto-n-video' },
          { title: 'Fibonacci', slug: 'fibonacci', githubPath: '02.Functions/Mathematical/03.fibonacci.cpp', youtubePath: 'fibonacci-video' }
        ]
      }
    ]
  },
  { 
    title: 'Complexity Analysis', 
    slug: 'complexity-analysis', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Big-O, amortized analysis, and common complexity patterns.',
    githubPath: 'Complexity-Analysis',
    youtubePath: 'complexity-analysis-playlist',
    subtopics: [
      { 
        title: 'Big-O Notation', 
        slug: 'complexity-analysis/big-o', 
        githubPath: 'Complexity-Analysis/Big-O-Notation', 
        youtubePath: 'big-o-notation'
      },
      { 
        title: 'Amortized Analysis', 
        slug: 'complexity-analysis/amortized', 
        githubPath: 'Complexity-Analysis/Amortized-Analysis', 
        youtubePath: 'amortized-analysis'
      },
      { 
        title: 'Common Complexity Patterns', 
        slug: 'complexity-analysis/patterns', 
        githubPath: 'Complexity-Analysis/Common-Patterns', 
        youtubePath: 'complexity-patterns'
      },
      { 
        title: 'Space Complexity', 
        slug: 'complexity-analysis/space', 
        githubPath: 'Complexity-Analysis/Space-Complexity', 
        youtubePath: 'space-complexity'
      }
    ]
  },
  { 
    title: 'Arrays', 
    slug: 'arrays', 
    difficulty: 'Beginner', 
    estHours: 8, 
    blurb: 'Two pointers, sliding windows, partitioning, in-place tricks.',
    githubPath: 'Arrays',
    youtubePath: 'arrays-playlist',
    subtopics: [
      { 
        title: 'Two Pointers Technique', 
        slug: 'arrays/two-pointers', 
        githubPath: 'Arrays/Two-Pointers', 
        youtubePath: 'two-pointers-technique'
      },
      { 
        title: 'Sliding Window', 
        slug: 'arrays/sliding-window', 
        githubPath: 'Arrays/Sliding-Window', 
        youtubePath: 'sliding-window-technique'
      },
      { 
        title: 'Array Partitioning', 
        slug: 'arrays/partitioning', 
        githubPath: 'Arrays/Partitioning', 
        youtubePath: 'array-partitioning'
      },
      { 
        title: 'In-place Operations', 
        slug: 'arrays/in-place', 
        githubPath: 'Arrays/In-Place-Operations', 
        youtubePath: 'in-place-operations'
      }
    ]
  },
  { 
    title: 'Strings', 
    slug: 'strings', 
    difficulty: 'Beginner', 
    estHours: 8, 
    blurb: 'Parsing, pattern search, KMP, rolling hash basics.',
    githubPath: 'Strings',
    youtubePath: 'strings-playlist',
    subtopics: [
      { 
        title: 'String Parsing', 
        slug: 'strings/parsing', 
        githubPath: 'Strings/Parsing', 
        youtubePath: 'string-parsing'
      },
      { 
        title: 'Pattern Matching', 
        slug: 'strings/pattern-matching', 
        githubPath: 'Strings/Pattern-Matching', 
        youtubePath: 'pattern-matching'
      },
      { 
        title: 'KMP Algorithm', 
        slug: 'strings/kmp', 
        githubPath: 'Strings/KMP-Algorithm', 
        youtubePath: 'kmp-algorithm'
      },
      { 
        title: 'Rolling Hash', 
        slug: 'strings/rolling-hash', 
        githubPath: 'Strings/Rolling-Hash', 
        youtubePath: 'rolling-hash'
      }
    ]
  },
  { 
    title: 'Linked Lists', 
    slug: 'linked-list', 
    difficulty: 'Beginner', 
    estHours: 6, 
    blurb: 'Pointers, reversal, cycle detection and common patterns.',
    githubPath: 'Linked-Lists',
    youtubePath: 'linked-lists-playlist',
    subtopics: [
      { 
        title: 'Pointer Manipulation', 
        slug: 'linked-list/pointers', 
        githubPath: 'Linked-Lists/Pointer-Manipulation', 
        youtubePath: 'pointer-manipulation'
      },
      { 
        title: 'List Reversal', 
        slug: 'linked-list/reversal', 
        githubPath: 'Linked-Lists/List-Reversal', 
        youtubePath: 'list-reversal'
      },
      { 
        title: 'Cycle Detection', 
        slug: 'linked-list/cycle-detection', 
        githubPath: 'Linked-Lists/Cycle-Detection', 
        youtubePath: 'cycle-detection'
      },
      { 
        title: 'Merge Operations', 
        slug: 'linked-list/merge', 
        githubPath: 'Linked-Lists/Merge-Operations', 
        youtubePath: 'merge-operations'
      }
    ]
  },
  { 
    title: 'Stacks & Queues', 
    slug: 'stacks-queues', 
    difficulty: 'Beginner', 
    estHours: 4, 
    blurb: 'Monotonic stacks, deque tricks and use cases.',
    githubPath: 'Stacks-Queues',
    youtubePath: 'stacks-queues-playlist',
    subtopics: [
      { 
        title: 'Basic Stack Operations', 
        slug: 'stacks-queues/basic-stack', 
        githubPath: 'Stacks-Queues/Basic-Stack', 
        youtubePath: 'basic-stack-operations'
      },
      { 
        title: 'Monotonic Stack', 
        slug: 'stacks-queues/monotonic', 
        githubPath: 'Stacks-Queues/Monotonic-Stack', 
        youtubePath: 'monotonic-stack'
      },
      { 
        title: 'Queue Implementation', 
        slug: 'stacks-queues/queue', 
        githubPath: 'Stacks-Queues/Queue-Implementation', 
        youtubePath: 'queue-implementation'
      },
      { 
        title: 'Deque Applications', 
        slug: 'stacks-queues/deque', 
        githubPath: 'Stacks-Queues/Deque-Applications', 
        youtubePath: 'deque-applications'
      }
    ]
  },
  { 
    title: 'Recursion & Backtracking', 
    slug: 'recursion-backtracking', 
    difficulty: 'Intermediate', 
    estHours: 10, 
    blurb: 'Tree recursion, pruning, and combinatorial backtracking.',
    githubPath: 'Recursion-Backtracking',
    youtubePath: 'recursion-backtracking-playlist',
    subtopics: [
      { 
        title: 'Recursive Thinking', 
        slug: 'recursion-backtracking/recursive-thinking', 
        githubPath: 'Recursion-Backtracking/Recursive-Thinking', 
        youtubePath: 'recursive-thinking'
      },
      { 
        title: 'Tree Recursion', 
        slug: 'recursion-backtracking/tree-recursion', 
        githubPath: 'Recursion-Backtracking/Tree-Recursion', 
        youtubePath: 'tree-recursion'
      },
      { 
        title: 'Pruning Techniques', 
        slug: 'recursion-backtracking/pruning', 
        githubPath: 'Recursion-Backtracking/Pruning-Techniques', 
        youtubePath: 'pruning-techniques'
      },
      { 
        title: 'Combinatorial Problems', 
        slug: 'recursion-backtracking/combinatorial', 
        githubPath: 'Recursion-Backtracking/Combinatorial-Problems', 
        youtubePath: 'combinatorial-problems'
      }
    ]
  },
  { 
    title: 'Sorting & Searching', 
    slug: 'sorting-searching', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Divide & conquer sorts and binary search patterns.',
    githubPath: 'Sorting-Searching',
    youtubePath: 'sorting-searching-playlist',
    subtopics: [
      { 
        title: 'Basic Sorting Algorithms', 
        slug: 'sorting-searching/basic-sorting', 
        githubPath: 'Sorting-Searching/Basic-Sorting', 
        youtubePath: 'basic-sorting-algorithms'
      },
      { 
        title: 'Advanced Sorting', 
        slug: 'sorting-searching/advanced-sorting', 
        githubPath: 'Sorting-Searching/Advanced-Sorting', 
        youtubePath: 'advanced-sorting-algorithms'
      },
      { 
        title: 'Binary Search', 
        slug: 'sorting-searching/binary-search', 
        githubPath: 'Sorting-Searching/Binary-Search', 
        youtubePath: 'binary-search-tutorial',
        subsubtopics: [
          {
            title: '1D Binary Search',
            slug: 'sorting-searching/binary-search/1d',
            githubPath: 'Sorting-Searching/Binary-Search/1D',
            youtubePath: '1d-binary-search',
            files: [
              { title: 'Basic Binary Search', slug: 'basic-binary-search', githubPath: 'Sorting-Searching/Binary-Search/1D/01.Basic.cpp', youtubePath: 'basic-binary-search-video' },
              { title: 'First Occurrence', slug: 'first-occurrence', githubPath: 'Sorting-Searching/Binary-Search/1D/02.FirstOccurrence.cpp', youtubePath: 'first-occurrence-video' },
              { title: 'Last Occurrence', slug: 'last-occurrence', githubPath: 'Sorting-Searching/Binary-Search/1D/03.LastOccurrence.cpp', youtubePath: 'last-occurrence-video' }
            ]
          },
          {
            title: '2D Binary Search',
            slug: 'sorting-searching/binary-search/2d',
            githubPath: 'Sorting-Searching/Binary-Search/2D',
            youtubePath: '2d-binary-search',
            files: [
              { title: 'Search in 2D Matrix', slug: 'search-2d-matrix', githubPath: 'Sorting-Searching/Binary-Search/2D/01.Search2DMatrix.cpp', youtubePath: 'search-2d-matrix-video' }
            ]
          }
        ]
      },
      { 
        title: 'Search Patterns', 
        slug: 'sorting-searching/search-patterns', 
        githubPath: 'Sorting-Searching/Search-Patterns', 
        youtubePath: 'search-patterns'
      }
    ]
  },
  { 
    title: 'Hashing & Maps', 
    slug: 'hashing', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Hashmaps, collision ideas, frequency trick patterns.',
    githubPath: 'Hashing',
    youtubePath: 'hashing-playlist',
    subtopics: [
      { 
        title: 'Hash Table Basics', 
        slug: 'hashing/basics', 
        githubPath: 'Hashing/Hash-Table-Basics', 
        youtubePath: 'hash-table-basics'
      },
      { 
        title: 'Collision Resolution', 
        slug: 'hashing/collision', 
        githubPath: 'Hashing/Collision-Resolution', 
        youtubePath: 'collision-resolution'
      },
      { 
        title: 'Frequency Patterns', 
        slug: 'hashing/frequency', 
        githubPath: 'Hashing/Frequency-Patterns', 
        youtubePath: 'frequency-patterns'
      },
      { 
        title: 'Hash Functions', 
        slug: 'hashing/functions', 
        githubPath: 'Hashing/Hash-Functions', 
        youtubePath: 'hash-functions'
      }
    ]
  },
  { 
    title: 'Trees (Binary Trees)', 
    slug: 'binary-trees', 
    difficulty: 'Intermediate', 
    estHours: 10, 
    blurb: 'Traversals, recursion, iterative DFS/BFS and properties.',
    githubPath: 'Binary-Trees',
    youtubePath: 'binary-trees-playlist',
    subtopics: [
      { 
        title: 'Tree Traversals', 
        slug: 'binary-trees/traversals', 
        githubPath: 'Binary-Trees/Tree-Traversals', 
        youtubePath: 'tree-traversals'
      },
      { 
        title: 'Tree Recursion', 
        slug: 'binary-trees/recursion', 
        githubPath: 'Binary-Trees/Tree-Recursion', 
        youtubePath: 'tree-recursion'
      },
      { 
        title: 'DFS & BFS', 
        slug: 'binary-trees/dfs-bfs', 
        githubPath: 'Binary-Trees/DFS-BFS', 
        youtubePath: 'dfs-bfs-trees'
      },
      { 
        title: 'Tree Properties', 
        slug: 'binary-trees/properties', 
        githubPath: 'Binary-Trees/Tree-Properties', 
        youtubePath: 'tree-properties'
      }
    ]
  },
  { 
    title: 'Binary Search Trees', 
    slug: 'bst', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'BST operations, balancing ideas and order statistics.',
    githubPath: 'Binary-Search-Trees',
    youtubePath: 'bst-playlist',
    subtopics: [
      { 
        title: 'BST Operations', 
        slug: 'bst/operations', 
        githubPath: 'Binary-Search-Trees/BST-Operations', 
        youtubePath: 'bst-operations'
      },
      { 
        title: 'Tree Balancing', 
        slug: 'bst/balancing', 
        githubPath: 'Binary-Search-Trees/Tree-Balancing', 
        youtubePath: 'tree-balancing'
      },
      { 
        title: 'Order Statistics', 
        slug: 'bst/order-statistics', 
        githubPath: 'Binary-Search-Trees/Order-Statistics', 
        youtubePath: 'order-statistics'
      },
      { 
        title: 'AVL Trees', 
        slug: 'bst/avl', 
        githubPath: 'Binary-Search-Trees/AVL-Trees', 
        youtubePath: 'avl-trees'
      }
    ]
  },
  { 
    title: 'Heaps & Priority Queues', 
    slug: 'heaps', 
    difficulty: 'Intermediate', 
    estHours: 5, 
    blurb: 'K-way merge, sliding-window maxima, scheduling problems.',
    githubPath: 'Heaps-Priority-Queues',
    youtubePath: 'heaps-playlist',
    subtopics: [
      { 
        title: 'Heap Implementation', 
        slug: 'heaps/implementation', 
        githubPath: 'Heaps-Priority-Queues/Heap-Implementation', 
        youtubePath: 'heap-implementation'
      },
      { 
        title: 'Priority Queue Applications', 
        slug: 'heaps/priority-queue', 
        githubPath: 'Heaps-Priority-Queues/Priority-Queue-Applications', 
        youtubePath: 'priority-queue-applications'
      },
      { 
        title: 'K-way Merge', 
        slug: 'heaps/k-way-merge', 
        githubPath: 'Heaps-Priority-Queues/K-Way-Merge', 
        youtubePath: 'k-way-merge'
      },
      { 
        title: 'Heap Sort', 
        slug: 'heaps/heap-sort', 
        githubPath: 'Heaps-Priority-Queues/Heap-Sort', 
        youtubePath: 'heap-sort'
      }
    ]
  },
  { 
    title: 'Graphs', 
    slug: 'graphs', 
    difficulty: 'Advanced', 
    estHours: 18, 
    blurb: 'BFS, DFS, shortest paths, components, topological sort.',
    githubPath: 'Graphs',
    youtubePath: 'graphs-playlist',
    subtopics: [
      { 
        title: 'Graph Representation', 
        slug: 'graphs/representation', 
        githubPath: 'Graphs/Graph-Representation', 
        youtubePath: 'graph-representation'
      },
      { 
        title: 'DFS & BFS', 
        slug: 'graphs/dfs-bfs', 
        githubPath: 'Graphs/DFS-BFS', 
        youtubePath: 'dfs-bfs-graphs'
      },
      { 
        title: 'Shortest Paths', 
        slug: 'graphs/shortest-paths', 
        githubPath: 'Graphs/Shortest-Paths', 
        youtubePath: 'shortest-paths'
      },
      { 
        title: 'Topological Sort', 
        slug: 'graphs/topological-sort', 
        githubPath: 'Graphs/Topological-Sort', 
        youtubePath: 'topological-sort'
      },
      { 
        title: 'Connected Components', 
        slug: 'graphs/components', 
        githubPath: 'Graphs/Connected-Components', 
        youtubePath: 'connected-components'
      }
    ]
  },
  { 
    title: 'Dynamic Programming', 
    slug: 'dynamic-programming', 
    difficulty: 'Advanced', 
    estHours: 24, 
    blurb: 'Patterns: knapsack, LIS, DP on trees and bitmask DP.',
    githubPath: 'Dynamic-Programming',
    youtubePath: 'dynamic-programming-playlist',
    subtopics: [
      { 
        title: 'DP Fundamentals', 
        slug: 'dynamic-programming/fundamentals', 
        githubPath: 'Dynamic-Programming/DP-Fundamentals', 
        youtubePath: 'dp-fundamentals'
      },
      { 
        title: 'Knapsack Problems', 
        slug: 'dynamic-programming/knapsack', 
        githubPath: 'Dynamic-Programming/Knapsack-Problems', 
        youtubePath: 'knapsack-problems'
      },
      { 
        title: 'LIS Variations', 
        slug: 'dynamic-programming/lis', 
        githubPath: 'Dynamic-Programming/LIS-Variations', 
        youtubePath: 'lis-variations'
      },
      { 
        title: 'DP on Trees', 
        slug: 'dynamic-programming/trees', 
        githubPath: 'Dynamic-Programming/DP-on-Trees', 
        youtubePath: 'dp-on-trees'
      },
      { 
        title: 'Bitmask DP', 
        slug: 'dynamic-programming/bitmask', 
        githubPath: 'Dynamic-Programming/Bitmask-DP', 
        youtubePath: 'bitmask-dp'
      }
    ]
  },
  { 
    title: 'Greedy Algorithms', 
    slug: 'greedy-algorithms', 
    difficulty: 'Intermediate', 
    estHours: 6, 
    blurb: 'Greedy-choice property, interval problems, scheduling.',
    githubPath: 'Greedy-Algorithms',
    youtubePath: 'greedy-algorithms-playlist',
    subtopics: [
      { 
        title: 'Greedy Strategy', 
        slug: 'greedy-algorithms/strategy', 
        githubPath: 'Greedy-Algorithms/Greedy-Strategy', 
        youtubePath: 'greedy-strategy'
      },
      { 
        title: 'Interval Problems', 
        slug: 'greedy-algorithms/intervals', 
        githubPath: 'Greedy-Algorithms/Interval-Problems', 
        youtubePath: 'interval-problems'
      },
      { 
        title: 'Scheduling Problems', 
        slug: 'greedy-algorithms/scheduling', 
        githubPath: 'Greedy-Algorithms/Scheduling-Problems', 
        youtubePath: 'scheduling-problems'
      },
      { 
        title: 'Proof Techniques', 
        slug: 'greedy-algorithms/proofs', 
        githubPath: 'Greedy-Algorithms/Proof-Techniques', 
        youtubePath: 'proof-techniques'
      }
    ]
  },
  { 
    title: 'Backtracking', 
    slug: 'backtracking', 
    difficulty: 'Advanced', 
    estHours: 10, 
    blurb: 'Advanced pruning, constraint solving, and search optimization.',
    githubPath: 'Backtracking',
    youtubePath: 'backtracking-playlist',
    subtopics: [
      { 
        title: 'Backtracking Template', 
        slug: 'backtracking/template', 
        githubPath: 'Backtracking/Backtracking-Template', 
        youtubePath: 'backtracking-template'
      },
      { 
        title: 'Pruning Strategies', 
        slug: 'backtracking/pruning', 
        githubPath: 'Backtracking/Pruning-Strategies', 
        youtubePath: 'pruning-strategies'
      },
      { 
        title: 'Constraint Satisfaction', 
        slug: 'backtracking/constraints', 
        githubPath: 'Backtracking/Constraint-Satisfaction', 
        youtubePath: 'constraint-satisfaction'
      },
      { 
        title: 'Search Optimization', 
        slug: 'backtracking/optimization', 
        githubPath: 'Backtracking/Search-Optimization', 
        youtubePath: 'search-optimization'
      }
    ]
  },
  { 
    title: 'Tries & Advanced Strings', 
    slug: 'tries', 
    difficulty: 'Advanced', 
    estHours: 8, 
    blurb: 'Prefix trees, Aho-Corasick and autocomplete techniques.',
    githubPath: 'Tries-Advanced-Strings',
    youtubePath: 'tries-playlist',
    subtopics: [
      { 
        title: 'Trie Implementation', 
        slug: 'tries/implementation', 
        githubPath: 'Tries-Advanced-Strings/Trie-Implementation', 
        youtubePath: 'trie-implementation'
      },
      { 
        title: 'Prefix Operations', 
        slug: 'tries/prefix', 
        githubPath: 'Tries-Advanced-Strings/Prefix-Operations', 
        youtubePath: 'prefix-operations'
      },
      { 
        title: 'Aho-Corasick Algorithm', 
        slug: 'tries/aho-corasick', 
        githubPath: 'Tries-Advanced-Strings/Aho-Corasick', 
        youtubePath: 'aho-corasick'
      },
      { 
        title: 'Autocomplete Systems', 
        slug: 'tries/autocomplete', 
        githubPath: 'Tries-Advanced-Strings/Autocomplete-Systems', 
        youtubePath: 'autocomplete-systems'
      }
    ]
  },
  { 
    title: 'Segment Trees & Fenwick', 
    slug: 'segment-tree-fenwick', 
    difficulty: 'Advanced', 
    estHours: 12, 
    blurb: 'Range queries, lazy propagation, BIT for fast updates.',
    githubPath: 'Segment-Trees-Fenwick',
    youtubePath: 'segment-trees-playlist',
    subtopics: [
      { 
        title: 'Segment Tree Basics', 
        slug: 'segment-tree-fenwick/segment-tree', 
        githubPath: 'Segment-Trees-Fenwick/Segment-Tree-Basics', 
        youtubePath: 'segment-tree-basics'
      },
      { 
        title: 'Lazy Propagation', 
        slug: 'segment-tree-fenwick/lazy-propagation', 
        githubPath: 'Segment-Trees-Fenwick/Lazy-Propagation', 
        youtubePath: 'lazy-propagation'
      },
      { 
        title: 'Fenwick Tree (BIT)', 
        slug: 'segment-tree-fenwick/fenwick', 
        githubPath: 'Segment-Trees-Fenwick/Fenwick-Tree', 
        youtubePath: 'fenwick-tree'
      },
      { 
        title: 'Range Update Queries', 
        slug: 'segment-tree-fenwick/range-updates', 
        githubPath: 'Segment-Trees-Fenwick/Range-Update-Queries', 
        youtubePath: 'range-update-queries'
      }
    ]
  },
  { 
    title: 'Bit Manipulation & Number Theory', 
    slug: 'bit-number-theory', 
    difficulty: 'Advanced', 
    estHours: 8, 
    blurb: 'Bit hacks, modular arithmetic, SPF, gcd, primes.',
    githubPath: 'Bit-Manipulation-Number-Theory',
    youtubePath: 'bit-manipulation-playlist',
    subtopics: [
      { 
        title: 'Bit Operations', 
        slug: 'bit-number-theory/bit-operations', 
        githubPath: 'Bit-Manipulation-Number-Theory/Bit-Operations', 
        youtubePath: 'bit-operations'
      },
      { 
        title: 'Bit Manipulation Tricks', 
        slug: 'bit-number-theory/tricks', 
        githubPath: 'Bit-Manipulation-Number-Theory/Bit-Tricks', 
        youtubePath: 'bit-manipulation-tricks'
      },
      { 
        title: 'Modular Arithmetic', 
        slug: 'bit-number-theory/modular', 
        githubPath: 'Bit-Manipulation-Number-Theory/Modular-Arithmetic', 
        youtubePath: 'modular-arithmetic'
      },
      { 
        title: 'Prime Numbers & GCD', 
        slug: 'bit-number-theory/primes-gcd', 
        githubPath: 'Bit-Manipulation-Number-Theory/Primes-GCD', 
        youtubePath: 'primes-gcd'
      }
    ]
  }
];

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

const slugToPath = (slug: string) => `/dsa/${slug}`;

// Helper function to generate GitHub URL
const getGithubUrl = (path: string) => {
  return `${GITHUB_CONFIG.baseUrl}/tree/${GITHUB_CONFIG.branch}/${encodeURIComponent(path)}`;
};

// Helper function to generate YouTube URL
const getYoutubeUrl = (path: string) => {
  return `${YOUTUBE_CONFIG.baseUrl}/${path}`;
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

// YouTube Link Component
const YouTubeLink = ({ youtubePath, className = "" }: { youtubePath?: string; className?: string }) => {
  if (!youtubePath) {
    return (
      <span className={`text-slate-500 text-sm ${className}`} title="No YouTube content available">
        -
      </span>
    );
  }

  return (
    <a
      href={getYoutubeUrl(youtubePath)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-800 hover:bg-red-700 text-red-300 hover:text-white transition-colors text-sm ${className}`}
      title={`Watch ${youtubePath} on YouTube`}
      onClick={(e) => e.stopPropagation()}
    >
      <FaYoutube className="w-4 h-4" />
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
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set());
  const [expandedSubSubtopics, setExpandedSubSubtopics] = useState<Set<string>>(new Set());
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
  const topicsWithYoutube = useMemo(() => TOPICS.filter(t => t.youtubePath).length, []);

  const toggleTopicExpansion = (slug: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleSubtopicExpansion = (slug: string) => {
    const newExpanded = new Set(expandedSubtopics);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedSubtopics(newExpanded);
  };

  const toggleSubSubtopicExpansion = (slug: string) => {
    const newExpanded = new Set(expandedSubSubtopics);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedSubSubtopics(newExpanded);
  };

  const handleSubtopicClick = (subtopicSlug: string) => {
    router.push(slugToPath(subtopicSlug));
  };

  const handleFileClick = (fileSlug: string) => {
    router.push(slugToPath(fileSlug));
  };

  const handleTopicClick = (topic: Topic) => {
    if (topic.subtopics && topic.subtopics.length > 0) {
      toggleTopicExpansion(topic.slug);
    } else {
      router.push(slugToPath(topic.slug));
    }
  };

  const handleSubtopicItemClick = (subtopic: Subtopic) => {
    if ((subtopic.subsubtopics && subtopic.subsubtopics.length > 0) || (subtopic.files && subtopic.files.length > 0)) {
      toggleSubtopicExpansion(subtopic.slug);
    } else {
      router.push(slugToPath(subtopic.slug));
    }
  };

  const handleSubSubtopicItemClick = (subsubtopic: SubSubtopic) => {
    if (subsubtopic.files && subsubtopic.files.length > 0) {
      toggleSubSubtopicExpansion(subsubtopic.slug);
    } else {
      router.push(slugToPath(subsubtopic.slug));
    }
  };

  return (
    <div className="relative min-h-screen bg-charcoalBlack text-softSilver overflow-hidden font-sans">
      <Particles />
      {/* Navigation Header - Always Sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
        <Navbar />
      </header>
      
      <div className="relative z-20 max-w-9xl mx-24 pt-20">
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emeraldGreen to-tealBlue">
                PhyCode<br/> DSA Roadmap
              </h1>
              <div className="flex gap-2">
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
                <a
                  href={YOUTUBE_CONFIG.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-800 hover:bg-red-700 text-red-300 hover:text-white transition-colors"
                  title="Watch tutorials on YouTube"
                >
                  <FaYoutube className="w-5 h-5" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
              </div>
            </div>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl">Embark on a structured journey to master Data Structures and Algorithms. Each step includes interactive lessons, practice problems, visual demonstrations, source code examples, and video tutorials.</p>

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

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">YouTube Integration</div>
                    <div className="text-2xl font-bold">{topicsWithYoutube}/{TOPICS.length}</div>
                  </div>
                  <FaYoutube className="w-8 h-8 text-red-400" />
                </div>
                <div className="mt-4 text-sm text-slate-300/75">Topics with video tutorials and visual explanations available.</div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum relative overflow-hidden">
              <h4 className="text-lg font-semibold">Roadmap Essentials</h4>
              <ul className="mt-4 text-sm text-slate-300/70 space-y-2">
                <li>Begin with Arrays, Strings, and Linked Lists for strong foundations.</li>
                <li>Progress to Trees and Graphs, integrating DP practice regularly.</li>
                <li>Use GitHub examples to understand implementation details.</li>
                <li>Watch YouTube tutorials for visual learning and deeper understanding.</li>
              </ul>
              <svg className="absolute right-4 bottom-4 w-24 h-24 opacity-10" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" stroke="#FDC57B" strokeWidth="2" fill="none" /></svg>
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
                              <div className="ml-auto flex gap-2">
                                <GitHubLink githubPath={t.githubPath} />
                                <YouTubeLink youtubePath={t.youtubePath} />
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
                            <div key={subtopic.slug} className="space-y-2">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubtopicItemClick(subtopic);
                                }}
                                className="p-3 rounded-lg bg-charcoalBlack/40 border border-deepPlum/30 hover:border-tealBlue/50 cursor-pointer transition-all hover:bg-charcoalBlack/60"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { 
                                  if (e.key === 'Enter') {
                                    e.stopPropagation();
                                    handleSubtopicItemClick(subtopic);
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
                                    {((subtopic.subsubtopics && subtopic.subsubtopics.length > 0) || (subtopic.files && subtopic.files.length > 0)) && (
                                      <div className="text-tealBlue">
                                        {expandedSubtopics.has(subtopic.slug) ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <GitHubLink githubPath={subtopic.githubPath} className="ml-auto" />
                                    <YouTubeLink youtubePath={subtopic.youtubePath} className="ml-auto" />
                                  </div>
                                </div>
                              </div>

                              {/* Sub-subtopics and Files Dropdown */}
                              {expandedSubtopics.has(subtopic.slug) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="ml-8 space-y-2 border-l-2 border-deepPlum/20 pl-4"
                                >
                                  {/* Sub-subtopics */}
                                  {subtopic.subsubtopics && subtopic.subsubtopics.map((subsubtopic, subSubIndex) => (
                                    <div key={subsubtopic.slug} className="space-y-2">
                                      <div
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSubSubtopicItemClick(subsubtopic);
                                        }}
                                        className="p-2 rounded-lg bg-charcoalBlack/30 border border-deepPlum/20 hover:border-tealBlue/30 cursor-pointer transition-all hover:bg-charcoalBlack/50"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => { 
                                          if (e.key === 'Enter') {
                                            e.stopPropagation();
                                            handleSubSubtopicItemClick(subsubtopic);
                                          }
                                        }}
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-deepPlum/30 flex items-center justify-center text-xs font-medium text-goldenAmber">
                                              {subSubIndex + 1}
                                            </div>
                                            <span className="text-sm text-softSilver hover:text-tealBlue transition-colors">
                                              {subsubtopic.title}
                                            </span>
                                            {subsubtopic.files && subsubtopic.files.length > 0 && (
                                              <div className="text-tealBlue">
                                                {expandedSubSubtopics.has(subsubtopic.slug) ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex gap-2">
                                            <GitHubLink githubPath={subsubtopic.githubPath} className="ml-auto" />
                                            <YouTubeLink youtubePath={subsubtopic.youtubePath} className="ml-auto" />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Files under sub-subtopics */}
                                      {expandedSubSubtopics.has(subsubtopic.slug) && subsubtopic.files && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="ml-6 space-y-1 border-l-2 border-deepPlum/10 pl-3"
                                        >
                                          {subsubtopic.files.map((file, fileIndex) => (
                                            <div
                                              key={file.slug}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleFileClick(file.slug);
                                              }}
                                              className="p-2 rounded-lg bg-charcoalBlack/20 border border-deepPlum/10 hover:border-tealBlue/20 cursor-pointer transition-all hover:bg-charcoalBlack/40"
                                              role="button"
                                              tabIndex={0}
                                              onKeyDown={(e) => { 
                                                if (e.key === 'Enter') {
                                                  e.stopPropagation();
                                                  handleFileClick(file.slug);
                                                }
                                              }}
                                            >
                                              <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                  <FiChevronRight className="w-3 h-3 text-slate-400" />
                                                  <span className="text-xs text-softSilver hover:text-tealBlue transition-colors">
                                                    {file.title}
                                                  </span>
                                                </div>
                                                <div className="flex gap-1">
                                                  <GitHubLink githubPath={file.githubPath} className="ml-auto text-xs" />
                                                  <YouTubeLink youtubePath={file.youtubePath} className="ml-auto text-xs" />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </motion.div>
                                      )}
                                    </div>
                                  ))}

                                  {/* Direct files under subtopics (no sub-subtopics) */}
                                  {subtopic.files && !subtopic.subsubtopics && subtopic.files.map((file, fileIndex) => (
                                    <div
                                      key={file.slug}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFileClick(file.slug);
                                      }}
                                      className="p-2 rounded-lg bg-charcoalBlack/30 border border-deepPlum/20 hover:border-tealBlue/30 cursor-pointer transition-all hover:bg-charcoalBlack/50"
                                      role="button"
                                      tabIndex={0}
                                      onKeyDown={(e) => { 
                                        if (e.key === 'Enter') {
                                          e.stopPropagation();
                                          handleFileClick(file.slug);
                                        }
                                      }}
                                    >
                                      <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                          <FiChevronRight className="w-3 h-3 text-slate-400" />
                                          <span className="text-sm text-softSilver hover:text-tealBlue transition-colors">
                                            {file.title}
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          <GitHubLink githubPath={file.githubPath} className="ml-auto" />
                                          <YouTubeLink youtubePath={file.youtubePath} className="ml-auto" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
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
                  <li>Practice with GitHub examples and YouTube tutorials throughout your journey.</li>
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
                <div className="flex items-center gap-3 mb-4">
                  <FaYoutube className="w-6 h-6 text-red-400" />
                  <div>
                    <div className="text-sm text-slate-400">YouTube Stats</div>
                    <div className="font-semibold text-lg">Video Tutorials</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Available Videos</span>
                    <span className="text-sm font-medium text-red-400">{topicsWithYoutube}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Coming Soon</span>
                    <span className="text-sm font-medium text-slate-400">{TOPICS.length - topicsWithYoutube}</span>
                  </div>
                  <div className="w-full bg-deepPlum/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${(topicsWithYoutube / TOPICS.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={YOUTUBE_CONFIG.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-red-800 hover:bg-red-700 text-red-300 hover:text-white transition-colors"
                  >
                    <FaYoutube className="w-4 h-4" />
                    Watch Tutorials
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
                    Navigate through multiple levels: Topics → Subtopics → Sub-subtopics → Files
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Use GitHub icons to view source code examples
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Use YouTube icons to watch video tutorials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-tealBlue rounded-full mt-2 shrink-0"></span>
                    Items marked with "-" are coming soon
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
            <div className="flex gap-2">
              <a
                href={GITHUB_CONFIG.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full border border-slate-600 hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
              >
                <FiGithub className="w-4 h-4" />
                Repository
              </a>
              <a
                href={YOUTUBE_CONFIG.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full border border-red-600 hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <FaYoutube className="w-4 h-4" />
                YouTube
              </a>
            </div>
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