import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiGithub, FiExternalLink, FiChevronRight } from 'react-icons/fi';
import { FaRocket, FaClipboardList, FaYoutube } from 'react-icons/fa';
import { collection, getDocs, orderBy, query as firebaseQuery } from 'firebase/firestore';

import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';
import { firestore } from '@/firebase/firebase';

type Topic = {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number;
  blurb: string;
  serial: number;
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

const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;

const slugToPath = (slug: string) => `/dsa/${slug}`;

// Helper function to generate GitHub URL
const getGithubUrl = (path: string) => {
  if (!path || path.trim() === '') return null;
  return `${GITHUB_CONFIG.baseUrl}/tree/${GITHUB_CONFIG.branch}/${encodeURIComponent(path)}`;
};

// Helper function to generate YouTube URL
const getYoutubeUrl = (path: string) => {
  if (!path || path.trim() === '') return null;
  return `${YOUTUBE_CONFIG.baseUrl}/${path}`;
};

// GitHub Link Component
const GitHubLink = ({ githubPath, className = "" }: { githubPath?: string; className?: string }) => {
  const url = githubPath ? getGithubUrl(githubPath) : null;
  
  if (!url) {
    return (
      <span className={`text-slate-500 text-sm ${className}`} title="No GitHub content available">
        -
      </span>
    );
  }

  return (
    <a
      href={url}
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
  const url = youtubePath ? getYoutubeUrl(youtubePath) : null;
  
  if (!url) {
    return (
      <span className={`text-slate-500 text-sm ${className}`} title="No YouTube content available">
        -
      </span>
    );
  }

  return (
    <a
      href={url}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | keyof typeof difficultyOrder>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'time' | 'difficulty'>('recommended');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set());
  const [expandedSubSubtopics, setExpandedSubSubtopics] = useState<Set<string>>(new Set());
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Helper function to safely process nested data
  const processSubtopics = (subtopicsData: any[]): Subtopic[] => {
    if (!Array.isArray(subtopicsData)) return [];
    
    return subtopicsData.map((subtopic, index) => ({
      title: subtopic?.title || `Subtopic ${index + 1}`,
      slug: subtopic?.slug || `subtopic-${index}`,
      githubPath: subtopic?.githubPath || '',
      youtubePath: subtopic?.youtubePath || '',
      subsubtopics: subtopic?.subsubtopics ? processSubSubtopics(subtopic.subsubtopics) : undefined,
      files: subtopic?.files ? processFiles(subtopic.files) : undefined
    }));
  };

  const processSubSubtopics = (subsubtopicsData: any): SubSubtopic[] => {
    // Handle both array and map formats
    if (Array.isArray(subsubtopicsData)) {
      return subsubtopicsData.map((subsubtopic, index) => ({
        title: subsubtopic?.title || `Sub-subtopic ${index + 1}`,
        slug: subsubtopic?.slug || `subsubtopic-${index}`,
        githubPath: subsubtopic?.githubPath || '',
        youtubePath: subsubtopic?.youtubePath || '',
        files: subsubtopic?.files ? processFiles(subsubtopic.files) : undefined
      }));
    } else if (typeof subsubtopicsData === 'object' && subsubtopicsData !== null) {
      // Handle map format (single subsubtopic)
      const files = subsubtopicsData.files ? processFiles(subsubtopicsData.files) : undefined;
      return [{
        title: subsubtopicsData.title || 'Sub-subtopic',
        slug: subsubtopicsData.slug || 'subsubtopic',
        githubPath: subsubtopicsData.githubPath || '',
        youtubePath: subsubtopicsData.youtubePath || '',
        files
      }];
    }
    return [];
  };

  const processFiles = (filesData: any[]): FileItem[] => {
    if (!Array.isArray(filesData)) return [];
    
    return filesData.map((file, index) => ({
      title: file?.title || `File ${index + 1}`,
      slug: file?.slug || `file-${index}`,
      githubPath: file?.githubPath || '',
      youtubePath: file?.youtubePath || ''
    }));
  };

  // Fetch topics from Firebase
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('Starting to fetch topics from Firebase...');
        setLoading(true);
        setError(null);
        
        // Create a query to get all topics ordered by serial
        const topicsRef = collection(firestore, 'topics');
        const topicsQuery = firebaseQuery(topicsRef, orderBy('serial', 'asc'));
        
        console.log('Executing Firebase query...');
        const querySnapshot = await getDocs(topicsQuery);
        console.log('Query snapshot received, documents count:', querySnapshot.size);
        
        const fetchedTopics: Topic[] = [];
        
        querySnapshot.forEach((doc) => {
          console.log('Processing document:', doc.id);
          const data = doc.data();
          console.log('Document data:', data);
          
          // Process subtopics with nested structure
          const subtopics = data.subtopics ? processSubtopics(data.subtopics) : [];
          
          const topicData: Topic = {
            id: doc.id,
            title: data.title || 'Untitled Topic',
            slug: data.slug || doc.id,
            difficulty: (data.difficulty as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner',
            estHours: typeof data.estHours === 'number' ? data.estHours : 0,
            blurb: data.blurb || 'No description available',
            serial: typeof data.serial === 'number' ? data.serial : 999,
            githubPath: data.githubPath || '',
            youtubePath: data.youtubePath || '',
            subtopics
          };
          
          fetchedTopics.push(topicData);
        });
        
        console.log('Successfully processed topics:', fetchedTopics);
        setTopics(fetchedTopics);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError(`Failed to load topics: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      searchRef.current?.focus();
    }
  }, []);

  const filtered = useMemo(() => {
    let list = topics.slice();
    
    // Filter by difficulty
    if (filter !== 'All') {
      list = list.filter((t) => t.difficulty === filter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      list = list.filter((t) => 
        (t.title + ' ' + t.blurb).toLowerCase().includes(queryLower)
      );
    }

    // Sort the list
    if (sortBy === 'time') {
      list.sort((a, b) => a.estHours - b.estHours);
    } else if (sortBy === 'difficulty') {
      list.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
    } else {
      // Recommended order (by serial)
      list.sort((a, b) => a.serial - b.serial);
    }

    return list;
  }, [searchQuery, filter, sortBy, topics]);

  const totalHours = useMemo(() => topics.reduce((sum, topic) => sum + topic.estHours, 0), [topics]);
  const topicsWithGithub = useMemo(() => 
    topics.filter(topic => topic.githubPath && topic.githubPath.trim() !== '').length, 
    [topics]
  );
  const topicsWithYoutube = useMemo(() => 
    topics.filter(topic => topic.youtubePath && topic.youtubePath.trim() !== '').length, 
    [topics]
  );

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

  if (loading) {
    return (
      <div className="relative min-h-screen bg-charcoalBlack text-softSilver overflow-hidden font-sans">
        <Particles />
        <header className="fixed top-0 left-0 right-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
          <Navbar />
        </header>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-tealBlue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-slate-300">Loading DSA topics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-charcoalBlack text-softSilver overflow-hidden font-sans">
        <Particles />
        <header className="fixed top-0 left-0 right-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
          <Navbar />
        </header>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Content</h2>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-tealBlue text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-charcoalBlack text-softSilver overflow-hidden font-sans">
      <Particles />
      {/* Navigation Header - Always Sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slateBlack border-b border-deepPlum shadow-lg">
        <Navbar />
      </header>
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics or concepts..."
                  className="bg-transparent placeholder:text-slate-400 focus:outline-none text-sm w-full"
                  aria-label="Search DSA topics"
                />
              </div>

              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)} 
                className="bg-slateBlack/30 border border-deepPlum rounded-full px-4 py-2 text-sm"
              >
                <option value="All">All difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)} 
                className="bg-slateBlack/30 border border-deepPlum rounded-full px-4 py-2 text-sm"
              >
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
                    <div className="text-2xl font-bold">{topics.length}</div>
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
                    <div className="text-2xl font-bold">{topicsWithGithub}/{topics.length}</div>
                  </div>
                  <FiGithub className="w-8 h-8 text-slate-400" />
                </div>
                <div className="mt-4 text-sm text-slate-300/75">Topics with source code examples and implementations available.</div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-tr from-slateBlack/60 to-charcoalBlack/30 border border-deepPlum">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">YouTube Integration</div>
                    <div className="text-2xl font-bold">{topicsWithYoutube}/{topics.length}</div>
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
              <svg className="absolute right-4 bottom-4 w-24 h-24 opacity-10" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#FDC57B" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-goldenAmber">Your Learning Path</h2>
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 text-lg mb-2">No topics found</div>
                  <div className="text-slate-500 text-sm">Try adjusting your search or filter criteria</div>
                </div>
              ) : (
                <ul className="space-y-6">
                  {filtered.map((topic, index) => (
                    <li key={topic.id} className="relative">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-emeraldGreen to-tealBlue flex items-center justify-center text-charcoalBlack font-bold text-sm shadow-md">
                        {topic.serial || index + 1}
                      </div>
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
                          onClick={() => handleTopicClick(topic)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleTopicClick(topic); }}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-softSilver">{topic.title}</h3>
                                {topic.subtopics && topic.subtopics.length > 0 && (
                                  <div className="text-tealBlue">
                                    {expandedTopics.has(topic.slug) ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                                  </div>
                                )}
                                <div className="ml-auto flex gap-2">
                                  <GitHubLink githubPath={topic.githubPath} />
                                  <YouTubeLink youtubePath={topic.youtubePath} />
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-slate-300">{topic.blurb}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-deepPlum/50 text-goldenAmber">{topic.difficulty}</span>
                              <p className="mt-2 text-sm font-medium">{topic.estHours} hrs</p>
                            </div>
                          </div>
                        </div>

                        {/* Subtopics Dropdown */}
                        {expandedTopics.has(topic.slug) && topic.subtopics && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 ml-6 space-y-2 border-l-2 border-deepPlum/30 pl-4"
                          >
                            {topic.subtopics.map((subtopic, subIndex) => (
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
              )}
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
                    <span className="text-sm font-medium text-slate-400">{topics.length - topicsWithGithub}</span>
                  </div>
                  <div className="w-full bg-deepPlum/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emeraldGreen to-tealBlue h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${topics.length > 0 ? (topicsWithGithub / topics.length) * 100 : 0}%` }}
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
                    <span className="text-sm font-medium text-slate-400">{topics.length - topicsWithYoutube}</span>
                  </div>
                  <div className="w-full bg-deepPlum/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${topics.length > 0 ? (topicsWithYoutube / topics.length) * 100 : 0}%` }}
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