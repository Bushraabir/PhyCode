import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiGithub, FiExternalLink, FiChevronRight, FiStar, FiTrendingUp } from 'react-icons/fi';
import { FaRocket, FaClipboardList, FaYoutube, FaCode, FaPlayCircle, FaBookmark } from 'react-icons/fa';
import { collection, getDocs, orderBy, query as firebaseQuery } from 'firebase/firestore';

import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';
import { firestore } from '@/firebase/firebase';

// Type definitions
interface FileItem {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
}

interface SubSubtopic {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
  files?: FileItem[];
}

interface Subtopic {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
  subsubtopics?: SubSubtopic[];
  files?: FileItem[];
}

interface Topic {
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
}

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

// Premium GitHub Link Component
const GitHubLink: React.FC<{ githubPath?: string; className?: string }> = ({ 
  githubPath, 
  className = "" 
}) => {
  const url = githubPath ? getGithubUrl(githubPath) : null;
  
  if (!url) {
    return (
      <span 
        className={`text-softSilver/40 text-sm font-medium ${className}`} 
        title="No GitHub content available"
      >
        <FiGithub className="w-4 h-4 opacity-30" />
      </span>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`group inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-slateBlack/80 to-charcoalBlack/80 backdrop-blur-sm border border-softSilver/10 hover:border-softSilver/20 text-softSilver/80 hover:text-softSilver transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl ${className}`}
      title={`View ${githubPath} on GitHub`}
      onClick={(e) => e.stopPropagation()}
    >
      <FiGithub className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
      <FiExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-tealBlue/0 to-goldenAmber/0 group-hover:from-tealBlue/5 group-hover:to-goldenAmber/5 transition-all duration-300" />
    </motion.a>
  );
};

// Premium YouTube Link Component
const YouTubeLink: React.FC<{ youtubePath?: string; className?: string }> = ({ 
  youtubePath, 
  className = "" 
}) => {
  const url = youtubePath ? getYoutubeUrl(youtubePath) : null;
  
  if (!url) {
    return (
      <span 
        className={`text-softSilver/40 text-sm font-medium ${className}`} 
        title="No YouTube content available"
      >
        <FaYoutube className="w-4 h-4 opacity-30" />
      </span>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`group inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-crimsonRed/20 to-softOrange/20 backdrop-blur-sm border border-crimsonRed/20 hover:border-crimsonRed/40 text-softSilver/80 hover:text-softSilver transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl ${className}`}
      title={`Watch ${youtubePath} on YouTube`}
      onClick={(e) => e.stopPropagation()}
    >
      <FaYoutube className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 text-crimsonRed" />
      <FiExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-crimsonRed/0 to-softOrange/0 group-hover:from-crimsonRed/10 group-hover:to-softOrange/10 transition-all duration-300" />
    </motion.a>
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

  const handleTopicClick = (topic: Topic) => {
    if (topic.subtopics && topic.subtopics.length > 0) {
      toggleTopicExpansion(topic.slug);
    } else {
      router.push(`/dsa/article/${topic.slug}`);
    }
  };

  const handleSubtopicItemClick = (subtopic: Subtopic) => {
    if ((subtopic.subsubtopics && subtopic.subsubtopics.length > 0) || 
        (subtopic.files && subtopic.files.length > 0)) {
      toggleSubtopicExpansion(subtopic.slug);
    } else {
      router.push(`/dsa/article/${subtopic.slug}`);
    }
  };

  const handleSubSubtopicItemClick = (subsubtopic: SubSubtopic) => {
    if (subsubtopic.files && subsubtopic.files.length > 0) {
      toggleSubSubtopicExpansion(subsubtopic.slug);
    } else {
      router.push(`/dsa/article/${subsubtopic.slug}`);
    }
  };

  const handleFileClick = (fileSlug: string) => {
    router.push(`/dsa/article/${fileSlug}`);
  };

  // Premium loading state
  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 text-softSilver overflow-hidden font-sans">
        <Particles />
        <header className="fixed top-0 left-0 right-0 z-50 bg-charcoalBlack/80 backdrop-blur-xl border-b border-softSilver/10 shadow-2xl">
          <Navbar />
        </header>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-tealBlue/30 border-t-tealBlue rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-goldenAmber/30 border-t-goldenAmber rounded-full animate-spin animate-reverse"></div>
            </div>
            <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-tealBlue to-goldenAmber bg-clip-text text-transparent mb-2">
              Loading Excellence
            </h2>
            <p className="text-lg text-softSilver/70">Preparing your DSA journey...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Premium error state
  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 text-softSilver overflow-hidden font-sans">
        <Particles />
        <header className="fixed top-0 left-0 right-0 z-50 bg-charcoalBlack/80 backdrop-blur-xl border-b border-softSilver/10 shadow-2xl">
          <Navbar />
        </header>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div 
            className="text-center max-w-md mx-auto p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-crimsonRed/20 to-softOrange/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-crimsonRed/20">
              <svg className="w-10 h-10 text-crimsonRed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-bold text-crimsonRed mb-3">Something went wrong</h2>
            <p className="text-softSilver/70 mb-6">{error}</p>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 text-softSilver overflow-hidden font-sans">
      <Particles />
      
      {/* Premium Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-charcoalBlack/80 backdrop-blur-xl border-b border-softSilver/10 shadow-2xl">
        <Navbar />
      </header>
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20">
        <div className="mt-12 flex flex-col lg:flex-row gap-12">
          <main className="flex-1">
            {/* Premium Hero Section */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-8">
                <div className="flex-1">
                  <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-tealBlue via-emeraldGreen to-goldenAmber bg-clip-text text-transparent">
                      PhyCode
                    </span>
                    <br/>
                    <span className="text-3xl md:text-4xl font-medium text-softSilver/90">
                      DSA Mastery
                    </span>
                  </h1>
                  <p className="text-xl text-softSilver/70 leading-relaxed max-w-2xl">
                    Embark on a structured journey to master Data Structures and Algorithms. 
                    Each step includes interactive lessons, practice problems, visual demonstrations, 
                    source code examples, and premium video tutorials.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <motion.a
                    href={GITHUB_CONFIG.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-br from-slateBlack/80 to-charcoalBlack/80 backdrop-blur-sm border border-softSilver/10 hover:border-softSilver/20 text-softSilver hover:text-softSilver transition-all duration-300 shadow-xl hover:shadow-2xl"
                    title="View full repository on GitHub"
                  >
                    <FiGithub className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="hidden sm:block">
                      <div className="text-sm font-semibold">Repository</div>
                      <div className="text-xs text-softSilver/60">View Source</div>
                    </div>
                  </motion.a>
                  
                  <motion.a
                    href={YOUTUBE_CONFIG.baseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-br from-crimsonRed/20 to-softOrange/20 backdrop-blur-sm border border-crimsonRed/20 hover:border-crimsonRed/40 text-softSilver hover:text-softSilver transition-all duration-300 shadow-xl hover:shadow-2xl"
                    title="Watch premium tutorials on YouTube"
                  >
                    <FaYoutube className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 text-crimsonRed" />
                    <div className="hidden sm:block">
                      <div className="text-sm font-semibold">YouTube</div>
                      <div className="text-xs text-softSilver/60">Watch Tutorials</div>
                    </div>
                  </motion.a>
                </div>
              </div>

              {/* Premium Search and Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="relative flex items-center bg-slateBlack/60 backdrop-blur-sm border border-softSilver/10 rounded-2xl px-6 py-4 shadow-lg flex-1 max-w-lg">
                  <FiSearch className="w-5 h-5 text-softSilver/60 mr-4" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics, concepts, algorithms..."
                    className="bg-transparent placeholder:text-softSilver/40 focus:outline-none text-softSilver w-full"
                    aria-label="Search DSA topics"
                  />
                </div>

                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value as any)} 
                  className="bg-slateBlack/60 backdrop-blur-sm border border-softSilver/10 rounded-xl px-4 py-3 text-softSilver focus:outline-none focus:border-tealBlue/50 transition-colors"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)} 
                  className="bg-slateBlack/60 backdrop-blur-sm border border-softSilver/10 rounded-xl px-4 py-3 text-softSilver focus:outline-none focus:border-tealBlue/50 transition-colors"
                >
                  <option value="recommended">Recommended Order</option>
                  <option value="time">By Duration</option>
                  <option value="difficulty">By Difficulty</option>
                </select>

                <motion.button
                  onClick={() => router.push('/dsa/learning-plan')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <FaClipboardList className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Create Learning Plan</span>
                  <span className="sm:hidden">Plan</span>
                </motion.button>
              </div>

              {/* Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <motion.div 
                  className="p-8 rounded-3xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/40 backdrop-blur-sm border border-softSilver/10 shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-tealBlue/20 to-emeraldGreen/20">
                      <FaCode className="w-6 h-6 text-tealBlue" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-softSilver">{topicsWithGithub}</div>
                      <div className="text-sm text-softSilver/60">Code Examples</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-softSilver/80">
                      <div className="text-lg font-semibold">{topics.length - topicsWithGithub} Coming Soon</div>
                      <div className="text-sm text-softSilver/60">In Development</div>
                    </div>
                    <div className="w-12 h-2 bg-slateBlack/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-tealBlue to-emeraldGreen rounded-full transition-all duration-500" 
                        style={{ width: `${topics.length > 0 ? (topicsWithGithub / topics.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="p-8 rounded-3xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/40 backdrop-blur-sm border border-softSilver/10 shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-crimsonRed/20 to-softOrange/20">
                      <FaPlayCircle className="w-6 h-6 text-crimsonRed" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-softSilver">{topicsWithYoutube}</div>
                      <div className="text-sm text-softSilver/60">Video Tutorials</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-softSilver/80">
                      <div className="text-lg font-semibold">{topics.length - topicsWithYoutube} Coming Soon</div>
                      <div className="text-sm text-softSilver/60">In Production</div>
                    </div>
                    <div className="w-12 h-2 bg-slateBlack/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-crimsonRed to-softOrange rounded-full transition-all duration-500" 
                        style={{ width: `${topics.length > 0 ? (topicsWithYoutube / topics.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="p-8 rounded-3xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/40 backdrop-blur-sm border border-softSilver/10 shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-goldenAmber/20 to-softOrange/20">
                      <FaBookmark className="w-6 h-6 text-goldenAmber" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-softSilver">{totalHours}</div>
                      <div className="text-sm text-softSilver/60">Total Hours</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-softSilver/80">
                      <div className="text-lg font-semibold">{topics.length} Topics</div>
                      <div className="text-sm text-softSilver/60">Complete Course</div>
                    </div>
                    <div className="w-12 h-2 bg-slateBlack/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-goldenAmber to-softOrange rounded-full transition-all duration-500" 
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>


              {/* Premium Guidance Card */}
              <motion.div 
                className="p-8 rounded-3xl bg-gradient-to-br from-deepPlum/30 to-slateBlack/40 backdrop-blur-sm border border-goldenAmber/20 shadow-2xl relative overflow-hidden mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-goldenAmber/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-tealBlue/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-goldenAmber/20 to-softOrange/20">
                      <FaRocket className="w-6 h-6 text-goldenAmber" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-softSilver">Roadmap Essentials</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-tealBlue rounded-full mt-2 flex-shrink-0" />
                        <p className="text-softSilver/80">Begin with Arrays, Strings, and Linked Lists for strong foundations</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emeraldGreen rounded-full mt-2 flex-shrink-0" />
                        <p className="text-softSilver/80">Progress to Trees and Graphs, integrating DP practice regularly</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-goldenAmber rounded-full mt-2 flex-shrink-0" />
                        <p className="text-softSilver/80">Use GitHub examples to understand implementation details</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-crimsonRed rounded-full mt-2 flex-shrink-0" />
                        <p className="text-softSilver/80">Watch YouTube tutorials for visual learning and deeper understanding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Premium Learning Path Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-tealBlue to-goldenAmber bg-clip-text text-transparent">
                  Your Premium Learning Path
                </h2>
                <div className="flex items-center gap-2 text-sm text-softSilver/60">
                  <FiStar className="w-4 h-4" />
                  <span>Curated Excellence</span>
                </div>
              </div>
              
              {filtered.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="p-8 rounded-3xl bg-slateBlack/40 backdrop-blur-sm border border-softSilver/10 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-deepPlum/20 to-slateBlack/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiSearch className="w-8 h-8 text-softSilver/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-softSilver/80 mb-2">No topics found</h3>
                    <p className="text-softSilver/60">Try adjusting your search or filter criteria</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {filtered.map((topic, index) => (
                    <motion.div 
                      key={topic.id} 
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Premium Serial Number Badge */}
                      <div className="absolute -left-4 top-6 z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tealBlue to-emeraldGreen flex items-center justify-center shadow-xl">
                          <span className="text-charcoalBlack font-bold text-lg">{topic.serial || index + 1}</span>
                        </div>
                      </div>
                      
                      {/* Premium Connection Line */}
                      {index < filtered.length - 1 && (
                        <div className="absolute left-2 top-16 bottom-[-2rem] w-0.5 bg-gradient-to-b from-tealBlue/30 via-emeraldGreen/20 to-transparent" />
                      )}
                      
                      <div className="ml-16">
                        <motion.div
                          className="group p-8 rounded-3xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/40 backdrop-blur-sm border border-softSilver/10 hover:border-tealBlue/30 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                          onClick={() => handleTopicClick(topic)}
                          whileHover={{ y: -3 }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleTopicClick(topic); }}
                        >
                          <div className="flex justify-between items-start gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-2xl font-heading font-bold text-softSilver group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-tealBlue group-hover:to-goldenAmber group-hover:bg-clip-text transition-all duration-300">
                                  {topic.title}
                                </h3>
                                
                                {topic.subtopics && topic.subtopics.length > 0 && (
                                  <motion.div 
                                    className="text-tealBlue"
                                    animate={{ rotate: expandedTopics.has(topic.slug) ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <FiChevronDown className="w-6 h-6" />
                                  </motion.div>
                                )}
                                
                                <div className="ml-auto flex gap-3">
                                  <GitHubLink githubPath={topic.githubPath} />
                                  <YouTubeLink youtubePath={topic.youtubePath} />
                                </div>
                              </div>
                              
                              <p className="text-softSilver/70 text-lg leading-relaxed mb-4">{topic.blurb}</p>
                              
                              <div className="flex items-center gap-4">
                                <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                                  topic.difficulty === 'Beginner' 
                                    ? 'bg-emeraldGreen/20 text-emeraldGreen border border-emeraldGreen/30'
                                    : topic.difficulty === 'Intermediate'
                                    ? 'bg-goldenAmber/20 text-goldenAmber border border-goldenAmber/30'
                                    : 'bg-crimsonRed/20 text-crimsonRed border border-crimsonRed/30'
                                }`}>
                                  {topic.difficulty}
                                </span>
                                
                                <div className="flex items-center gap-2 text-softSilver/60">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm font-medium">{topic.estHours} hours</span>
                                </div>
                                
                                {topic.subtopics && topic.subtopics.length > 0 && (
                                  <div className="flex items-center gap-2 text-softSilver/60">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="text-sm">{topic.subtopics.length} subtopics</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Premium Subtopics Dropdown */}
                        {expandedTopics.has(topic.slug) && topic.subtopics && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="mt-6 ml-8 space-y-4"
                          >
                            <div className="relative">
                              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-tealBlue/30 to-transparent" />
                              
                              {topic.subtopics.map((subtopic, subIndex) => (
                                <div key={subtopic.slug} className="relative mb-4">
                                  <motion.div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSubtopicItemClick(subtopic);
                                    }}
                                    className="group p-6 rounded-2xl bg-gradient-to-br from-charcoalBlack/60 to-slateBlack/40 backdrop-blur-sm border border-softSilver/5 hover:border-tealBlue/20 cursor-pointer transition-all duration-300 hover:shadow-lg"
                                    whileHover={{ x: 4 }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { 
                                      if (e.key === 'Enter') {
                                        e.stopPropagation();
                                        handleSubtopicItemClick(subtopic);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-tealBlue/20 to-emeraldGreen/20 flex items-center justify-center">
                                          <span className="text-sm font-bold text-tealBlue">{subIndex + 1}</span>
                                        </div>
                                        
                                        <div className="flex-1">
                                          <h4 className="text-lg font-semibold text-softSilver group-hover:text-tealBlue transition-colors">
                                            {subtopic.title}
                                          </h4>
                                        </div>
                                        
                                        {((subtopic.subsubtopics && subtopic.subsubtopics.length > 0) || (subtopic.files && subtopic.files.length > 0)) && (
                                          <motion.div 
                                            className="text-tealBlue"
                                            animate={{ rotate: expandedSubtopics.has(subtopic.slug) ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                          >
                                            <FiChevronDown className="w-5 h-5" />
                                          </motion.div>
                                        )}
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <GitHubLink githubPath={subtopic.githubPath} />
                                        <YouTubeLink youtubePath={subtopic.youtubePath} />
                                      </div>
                                    </div>
                                  </motion.div>

                                  {/* Sub-subtopics and Files Dropdown */}
                                  {expandedSubtopics.has(subtopic.slug) && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="mt-4 ml-12 space-y-3"
                                    >
                                      {/* Sub-subtopics */}
                                      {subtopic.subsubtopics && subtopic.subsubtopics.map((subsubtopic, subSubIndex) => (
                                        <div key={subsubtopic.slug} className="relative">
                                          <motion.div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSubSubtopicItemClick(subsubtopic);
                                            }}
                                            className="group p-4 rounded-xl bg-gradient-to-br from-charcoalBlack/40 to-slateBlack/20 backdrop-blur-sm border border-softSilver/5 hover:border-tealBlue/15 cursor-pointer transition-all duration-300"
                                            whileHover={{ x: 2 }}
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
                                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-deepPlum/20 to-goldenAmber/20 flex items-center justify-center">
                                                  <span className="text-xs font-bold text-goldenAmber">{subSubIndex + 1}</span>
                                                </div>
                                                <span className="text-softSilver group-hover:text-goldenAmber transition-colors font-medium">
                                                  {subsubtopic.title}
                                                </span>
                                                {subsubtopic.files && subsubtopic.files.length > 0 && (
                                                  <motion.div 
                                                    className="text-goldenAmber"
                                                    animate={{ rotate: expandedSubSubtopics.has(subsubtopic.slug) ? 180 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                  >
                                                    <FiChevronDown className="w-4 h-4" />
                                                  </motion.div>
                                                )}
                                              </div>
                                              <div className="flex gap-2">
                                                <GitHubLink githubPath={subsubtopic.githubPath} />
                                                <YouTubeLink youtubePath={subsubtopic.youtubePath} />
                                              </div>
                                            </div>
                                          </motion.div>

                                          {/* Files under sub-subtopics */}
                                          {expandedSubSubtopics.has(subsubtopic.slug) && subsubtopic.files && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: 'auto' }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.3 }}
                                              className="mt-3 ml-8 space-y-2"
                                            >
                                              {subsubtopic.files.map((file, fileIndex) => (
                                                <motion.div
                                                  key={file.slug}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileClick(file.slug);
                                                  }}
                                                  className="group p-3 rounded-lg bg-gradient-to-br from-charcoalBlack/30 to-slateBlack/10 backdrop-blur-sm border border-softSilver/5 hover:border-goldenAmber/20 cursor-pointer transition-all duration-300"
                                                  whileHover={{ x: 1 }}
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
                                                      <FiChevronRight className="w-3 h-3 text-softSilver/40 group-hover:text-goldenAmber transition-colors" />
                                                      <span className="text-sm text-softSilver group-hover:text-goldenAmber transition-colors">
                                                        {file.title}
                                                      </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                      <GitHubLink githubPath={file.githubPath} className="scale-75" />
                                                      <YouTubeLink youtubePath={file.youtubePath} className="scale-75" />
                                                    </div>
                                                  </div>
                                                </motion.div>
                                              ))}
                                            </motion.div>
                                          )}
                                        </div>
                                      ))}

                                      {/* Direct files under subtopics (no sub-subtopics) */}
                                      {subtopic.files && !subtopic.subsubtopics && subtopic.files.map((file, fileIndex) => (
                                        <motion.div
                                          key={file.slug}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFileClick(file.slug);
                                          }}
                                          className="group p-4 rounded-xl bg-gradient-to-br from-charcoalBlack/40 to-slateBlack/20 backdrop-blur-sm border border-softSilver/5 hover:border-goldenAmber/20 cursor-pointer transition-all duration-300"
                                          whileHover={{ x: 2 }}
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
                                              <FiChevronRight className="w-4 h-4 text-softSilver/40 group-hover:text-goldenAmber transition-colors" />
                                              <span className="text-softSilver group-hover:text-goldenAmber transition-colors font-medium">
                                                {file.title}
                                              </span>
                                            </div>
                                            <div className="flex gap-2">
                                              <GitHubLink githubPath={file.githubPath} />
                                              <YouTubeLink youtubePath={file.youtubePath} />
                                            </div>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </motion.div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* Premium Sidebar */}
          <aside className="lg:w-96 lg:shrink-0">
            <div className="lg:sticky lg:top-32 space-y-8">
              {/* Ultimate Goal Card */}
              <motion.div 
                className="p-8 rounded-3xl bg-gradient-to-br from-deepPlum/40 to-slateBlack/60 backdrop-blur-sm border border-goldenAmber/20 shadow-2xl relative overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-goldenAmber/20 to-transparent rounded-full -translate-y-12 translate-x-12" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-goldenAmber/30 to-softOrange/20">
                      <FaRocket className="w-6 h-6 text-goldenAmber" />
                    </div>
                    <div>
                      <div className="text-sm text-softSilver/60 font-medium">Ultimate Goal</div>
                      <div className="font-heading font-bold text-xl text-softSilver">Contest-Ready</div>
                      <div className="text-sm text-goldenAmber">in 12-20 Weeks</div>
                    </div>
                  </div>

                  <div className="space-y-4 text-softSilver/70">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-tealBlue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-tealBlue">1-3</span>
                      </div>
                      <p className="text-sm">Build fundamentals with Arrays, Strings, Linked Lists</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emeraldGreen/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-emeraldGreen">4-7</span>
                      </div>
                      <p className="text-sm">Dive into Trees, Graphs, and Sorting techniques</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-goldenAmber/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-goldenAmber">8+</span>
                      </div>
                      <p className="text-sm">Master DP and advanced structures like Segment Trees</p>
                    </div>
                  </div>

                  <motion.button 
                    onClick={() => router.push('/dsa/roadmap-download')} 
                    className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download Premium Roadmap
                  </motion.button>
                </div>
              </motion.div>

              {/* GitHub Stats Card */}
              <motion.div 
                className="p-8 rounded-3xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/40 backdrop-blur-sm border border-softSilver/10 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/60">
                    <FiGithub className="w-6 h-6 text-softSilver" />
                  </div>
                  <div>
                    <div className="text-sm text-softSilver/60">Repository Stats</div>
                    <div className="font-heading font-bold text-xl text-softSilver">Code Examples</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-softSilver/70">Coming Soon</span>
                    <span className="font-medium text-softSilver/50">{topics.length - topicsWithGithub}</span>
                  </div>
                  <div className="w-full bg-slateBlack/60 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-emeraldGreen to-tealBlue rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${topics.length > 0 ? (topicsWithGithub / topics.length) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <motion.a
                  href={GITHUB_CONFIG.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-br from-slateBlack/80 to-charcoalBlack/80 border border-softSilver/10 hover:border-softSilver/20 text-softSilver hover:text-softSilver transition-all duration-300"
                >
                  <FiGithub className="w-5 h-5" />
                  <span className="font-semibold">View Full Repository</span>
                </motion.a>
              </motion.div>

              {/* YouTube Stats Card */}
              <motion.div 
                className="p-8 rounded-3xl bg-gradient-to-br from-slateBlack/60 to-charcoalBlack/40 backdrop-blur-sm border border-softSilver/10 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-crimsonRed/20 to-softOrange/20">
                    <FaYoutube className="w-6 h-6 text-crimsonRed" />
                  </div>
                  <div>
                    <div className="text-sm text-softSilver/60">YouTube Stats</div>
                    <div className="font-heading font-bold text-xl text-softSilver">Video Tutorials</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-softSilver/70">Available Videos</span>
                    <span className="font-bold text-crimsonRed">{topicsWithYoutube}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-softSilver/70">In Production</span>
                    <span className="font-medium text-softSilver/50">{topics.length - topicsWithYoutube}</span>
                  </div>
                  <div className="w-full bg-slateBlack/60 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-crimsonRed to-softOrange rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${topics.length > 0 ? (topicsWithYoutube / topics.length) * 100 : 0}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                    />
                  </div>
                </div>

                <motion.a
                  href={YOUTUBE_CONFIG.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-br from-crimsonRed/20 to-softOrange/20 border border-crimsonRed/20 hover:border-crimsonRed/40 text-softSilver hover:text-softSilver transition-all duration-300"
                >
                  <FaYoutube className="w-5 h-5" />
                  <span className="font-semibold">Watch Tutorials</span>
                </motion.a>
              </motion.div>

              {/* How to Use Guide */}
              <motion.div 
                className="p-8 rounded-3xl bg-gradient-to-br from-deepPlum/20 to-slateBlack/40 backdrop-blur-sm border border-softSilver/10 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-goldenAmber/20 to-softOrange/20">
                    <FaBookmark className="w-5 h-5 text-goldenAmber" />
                  </div>
                  <h4 className="text-xl font-heading font-bold text-goldenAmber">Premium Guide</h4>
                </div>
                
                <div className="space-y-4 text-softSilver/70">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-tealBlue rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Click topic titles to expand and explore subtopics</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emeraldGreen rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Navigate through multiple levels: Topics → Subtopics → Files</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-goldenAmber rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Use GitHub icons to access premium source code examples</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-crimsonRed rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Use YouTube icons to watch curated video tutorials</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-deepPlum rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">Follow the recommended order for optimal learning</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </aside>
        </div>

        {/* Premium Footer Section */}
        <motion.div 
          className="mt-20 flex flex-col lg:flex-row items-center justify-between gap-8 border-t border-softSilver/10 pt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-heading font-semibold text-softSilver mb-2">
              Ready to join the elite?
            </h3>
            <p className="text-softSilver/60 max-w-md">
              Join the PhyCode community to find study partners, share progress, and accelerate your learning journey.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/dsa/quiz">
              <motion.span
                className="px-6 py-3 rounded-xl border border-softSilver/20 hover:bg-softSilver/5 hover:border-tealBlue/30 text-softSilver transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take Premium Quiz
              </motion.span>
            </Link>
            
            <motion.button 
              onClick={() => router.push('/dsa/projects')} 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emeraldGreen to-tealBlue text-charcoalBlack font-semibold hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Build Premium Projects
            </motion.button>
            
            <div className="flex gap-3">
              <motion.a
                href={GITHUB_CONFIG.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-softSilver/20 hover:border-softSilver/40 transition-colors inline-flex items-center gap-2 text-softSilver"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiGithub className="w-4 h-4" />
                <span className="hidden sm:inline">Repository</span>
              </motion.a>
              
              <motion.a
                href={YOUTUBE_CONFIG.baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-crimsonRed/40 hover:border-crimsonRed/60 transition-colors inline-flex items-center gap-2 text-softSilver"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaYoutube className="w-4 h-4" />
                <span className="hidden sm:inline">YouTube</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Floating Action Button */}
      <motion.button 
        aria-label="Open premium learning plan" 
        onClick={() => router.push('/dsa/learning-plan')} 
        className="fixed right-8 bottom-8 z-40 p-4 rounded-2xl shadow-2xl bg-gradient-to-br from-goldenAmber to-softOrange hover:shadow-3xl group"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <FaClipboardList className="w-6 h-6 text-charcoalBlack group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute -top-12 -left-6 bg-charcoalBlack/90 backdrop-blur-sm text-softSilver px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Create Learning Plan
        </div>
      </motion.button>
    </div>
  );
}