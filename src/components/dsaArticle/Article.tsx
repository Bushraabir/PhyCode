import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Play, Copy, Check, ExternalLink, FileText, Clock, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { FiGithub } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

// Import your existing components
import Navbar from '@/components/Navbar/Navbar';
import Particles from '@/components/particles/particles';

interface ContentItem {
  type: 'paragraph' | 'heading' | 'code' | 'image' | 'video' | 'list';
  content: string;
  level?: number;
  language?: string;
  title?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  thumbnail?: string;
  description?: string;
}

interface TopicNavigation {
  slug: string;
  title: string;
}

interface ArticleData {
  title: string;
  slug: string;
  githubPath?: string;
  youtubePath?: string;
  content: ContentItem[];
}

interface DynamicArticlePageProps {
  articleData: ArticleData;
  prevTopic?: TopicNavigation | null;
  nextTopic?: TopicNavigation | null;
}

const DynamicArticlePage: React.FC<DynamicArticlePageProps> = ({ 
  articleData, 
  prevTopic, 
  nextTopic 
}) => {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // GitHub and YouTube configuration
  const GITHUB_CONFIG = {
    baseUrl: 'https://github.com/Bushraabir/Data-Structure-And-Algorithm',
    branch: 'main'
  };

  const YOUTUBE_CONFIG = {
    baseUrl: 'https://www.youtube.com/channel/YOUR_CHANNEL_ID'
  };

  // Helper functions
  const getGithubUrl = (path: string) => {
    if (!path || path.trim() === '') return null;
    return `${GITHUB_CONFIG.baseUrl}/tree/${GITHUB_CONFIG.branch}/${encodeURIComponent(path)}`;
  };

  const getYoutubeUrl = (path: string) => {
    if (!path || path.trim() === '') return null;
    return `${YOUTUBE_CONFIG.baseUrl}/${path}`;
  };

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedCode(index);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Enhanced GitHub Link Component
  const GitHubLink: React.FC<{ githubPath?: string; className?: string }> = ({ 
    githubPath, 
    className = "" 
  }) => {
    const url = githubPath ? getGithubUrl(githubPath) : null;
    
    if (!url) {
      return (
        <span 
          className={`text-softSilver/30 text-sm ${className}`} 
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
        className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-slateBlack/80 to-charcoalBlack/60 backdrop-blur-sm border border-softSilver/10 hover:border-softSilver/30 text-softSilver/80 hover:text-softSilver transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl ${className}`}
        title={`View ${githubPath} on GitHub`}
      >
        <FiGithub className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        <span>View Code</span>
        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
      </motion.a>
    );
  };

  // Enhanced YouTube Link Component
  const YouTubeLink: React.FC<{ youtubePath?: string; className?: string }> = ({ 
    youtubePath, 
    className = "" 
  }) => {
    const url = youtubePath ? getYoutubeUrl(youtubePath) : null;
    
    if (!url) {
      return (
        <span 
          className={`text-softSilver/30 text-sm ${className}`} 
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
        className={`group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-crimsonRed/20 to-softOrange/20 backdrop-blur-sm border border-crimsonRed/20 hover:border-crimsonRed/40 text-softSilver/80 hover:text-softSilver transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl ${className}`}
        title={`Watch ${youtubePath} on YouTube`}
      >
        <FaYoutube className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 text-crimsonRed" />
        <span>Watch Video</span>
        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
      </motion.a>
    );
  };

  // Content renderer function
  const renderContent = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'paragraph':
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <p className="text-softSilver leading-relaxed mb-8 text-lg">
              {item.content}
            </p>
          </motion.div>
        );
      
      case 'heading':
        const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {React.createElement(
              HeadingTag,
              {
                className: `font-heading font-bold text-goldenAmber mb-6 ${
                  item.level === 2 ? 'text-4xl mt-16' : 
                  item.level === 3 ? 'text-3xl mt-12' : 'text-2xl mt-10'
                }`
              },
              item.content
            )}
          </motion.div>
        );
      
      case 'code':
        return (
          <motion.div 
            key={index} 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="bg-charcoalBlack rounded-2xl overflow-hidden border border-slateBlack shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-deepPlum to-slateBlack border-b border-slateBlack">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-goldenAmber/20">
                    <FileText className="w-5 h-5 text-goldenAmber" />
                  </div>
                  <div>
                    <span className="text-softSilver font-semibold text-lg">
                      {item.title || 'Code Example'}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-softSilver/70 bg-slateBlack px-2 py-1 rounded-md font-mono">
                        {item.language ? item.language.toUpperCase() : 'CODE'}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button
                  onClick={() => copyToClipboard(item.content, index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-goldenAmber/10 hover:bg-goldenAmber/20 text-goldenAmber hover:text-softOrange transition-all duration-300 border border-goldenAmber/20"
                >
                  {copiedCode === index ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span className="text-sm font-medium">
                    {copiedCode === index ? 'Copied!' : 'Copy Code'}
                  </span>
                </motion.button>
              </div>
              <div className="p-6 bg-gradient-to-br from-charcoalBlack to-slateBlack/50">
                <pre className="text-softSilver overflow-x-auto">
                  <code className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        );
      
      case 'image':
        return (
          <motion.div 
            key={index} 
            className="mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="rounded-2xl overflow-hidden border border-slateBlack shadow-2xl">
              <img 
                src={item.src} 
                alt={item.alt || 'Article image'}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              {item.caption && (
                <div className="px-6 py-4 bg-gradient-to-r from-slateBlack to-charcoalBlack/80">
                  <p className="text-softSilver/80 text-sm italic text-center">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      
      case 'video':
        return (
          <motion.div 
            key={index} 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="bg-gradient-to-br from-slateBlack/80 to-charcoalBlack/60 rounded-2xl overflow-hidden border border-crimsonRed/30 shadow-2xl">
              <div className="relative group cursor-pointer">
                <img 
                  src={item.thumbnail} 
                  alt={item.title || 'Video thumbnail'}
                  className="w-full h-72 object-cover group-hover:opacity-90 transition-opacity duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-charcoalBlack/20 group-hover:bg-charcoalBlack/30 transition-all duration-300">
                  <motion.div 
                    className="bg-crimsonRed/90 backdrop-blur-sm rounded-full p-6 group-hover:bg-crimsonRed transition-all duration-300 shadow-2xl"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-10 h-10 text-white ml-1" />
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-charcoalBlack/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                    <span className="text-softSilver text-sm font-medium">Premium Tutorial</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-goldenAmber font-heading font-bold text-2xl mb-3">
                  {item.title || 'Video Tutorial'}
                </h3>
                <p className="text-softSilver/80 leading-relaxed">
                  {item.description || 'Watch this comprehensive tutorial to understand the concepts better.'}
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'list':
        return (
          <motion.div
            key={index}
            className="mb-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ul className="space-y-4">
              {item.items?.map((listItem, listIndex) => (
                <li key={listIndex} className="flex items-start space-x-4 group">
                  <div className="w-3 h-3 bg-gradient-to-br from-tealBlue to-emeraldGreen rounded-full mt-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-softSilver leading-relaxed text-lg group-hover:text-softSilver/90 transition-colors duration-300">
                    {listItem}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  // Loading state
  if (loading || !articleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 flex items-center justify-center">
        <Particles />
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-tealBlue/30 border-t-tealBlue rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-goldenAmber/30 border-t-goldenAmber rounded-full animate-spin animate-reverse"></div>
          </div>
          <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-tealBlue to-goldenAmber bg-clip-text text-transparent mb-2">
            Loading Article
          </h2>
          <p className="text-lg text-softSilver/70">Preparing your content...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 text-softSilver">
      <Particles />
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-charcoalBlack/80 backdrop-blur-xl border-b border-softSilver/10 shadow-2xl">
        <Navbar />
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 pt-24 pb-6">
        <motion.div 
          className="flex items-center space-x-2 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/dsa" className="text-softSilver/60 hover:text-tealBlue transition-colors">
            DSA Home
          </Link>
          <ChevronLeft className="w-4 h-4 text-softSilver/40 rotate-180" />
          <Link href="/dsa" className="text-softSilver/60 hover:text-tealBlue transition-colors">
            Topics
          </Link>
          <ChevronLeft className="w-4 h-4 text-softSilver/40 rotate-180" />
          <span className="text-goldenAmber font-medium">{articleData.title}</span>
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 max-w-5xl mx-auto px-6 pb-16">
        {/* Article Header */}
        <motion.header 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <motion.button
                  onClick={() => router.back()}
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-softSilver/70 hover:text-goldenAmber transition-colors duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Topics</span>
                </motion.button>
              </div>

              <div className="mb-6">
                <span className="inline-flex items-center gap-2 text-tealBlue font-medium text-sm tracking-wide uppercase bg-tealBlue/10 px-4 py-2 rounded-xl border border-tealBlue/20">
                  <Star className="w-4 h-4" />
                  C++ Fundamentals
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-heading font-bold bg-gradient-to-r from-goldenAmber via-softOrange to-tealBlue bg-clip-text text-transparent mb-8 leading-tight">
                {articleData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-softSilver/70 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emeraldGreen rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Updated Recently</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">8 min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Interactive Tutorial</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 lg:flex-col">
              <GitHubLink githubPath={articleData.githubPath} />
              <YouTubeLink youtubePath={articleData.youtubePath} />
            </div>
          </div>
        </motion.header>

        {/* Dynamic Content */}
        <article className="prose prose-lg max-w-none">
          {articleData.content && articleData.content.length > 0 ? (
            articleData.content.map((item, index) => renderContent(item, index))
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-8 rounded-3xl bg-slateBlack/40 backdrop-blur-sm border border-softSilver/10 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-deepPlum/20 to-slateBlack/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-softSilver/40" />
                </div>
                <h3 className="text-xl font-semibold text-softSilver/80 mb-2">Content Coming Soon</h3>
                <p className="text-softSilver/60">This article is currently being prepared. Check back soon!</p>
              </div>
            </motion.div>
          )}
        </article>

        {/* Navigation Footer */}
        <motion.footer 
          className="mt-20 pt-12 border-t border-slateBlack/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            {prevTopic ? (
              <Link href={`/dsa/article/${prevTopic.slug}`} className="flex-1">
                <motion.div 
                  className="group flex items-center space-x-3 text-softSilver hover:text-goldenAmber transition-colors cursor-pointer"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <div className="text-sm text-softSilver/60">Previous</div>
                    <div className="font-semibold">{prevTopic.title}</div>
                  </div>
                </motion.div>
              </Link>
            ) : (
              <div className="flex-1"></div>
            )}

            {nextTopic ? (
              <Link href={`/dsa/article/${nextTopic.slug}`} className="flex-1">
                <motion.div 
                  className="group flex items-center space-x-3 text-softSilver hover:text-goldenAmber transition-colors cursor-pointer text-right justify-end"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <div className="text-sm text-softSilver/60">Next</div>
                    <div className="font-semibold">{nextTopic.title}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
              </Link>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
        </motion.footer>
      </main>
    </div>
  );
};

export default DynamicArticlePage;