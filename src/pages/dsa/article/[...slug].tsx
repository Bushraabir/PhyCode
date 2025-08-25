import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { collection, getDocs, query as firebaseQuery, where, orderBy } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import DynamicArticlePage from '@/components/dsaArticle/Article';

interface ArticlePageProps {
  articleData: any;
  prevTopic: any;
  nextTopic: any;
}

export default function ArticlePage({ articleData, prevTopic, nextTopic }: ArticlePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-tealBlue/30 border-t-tealBlue rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-heading font-bold text-goldenAmber mb-2">Loading Article</h2>
          <p className="text-lg text-softSilver/70">Preparing your content...</p>
        </div>
      </div>
    );
  }

  if (!articleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoalBlack via-slateBlack to-deepPlum/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-crimsonRed mb-2">Article Not Found</h2>
          <p className="text-lg text-softSilver/70">The requested article could not be found.</p>
          <button 
            onClick={() => router.push('/dsa')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-tealBlue to-goldenAmber text-charcoalBlack font-semibold rounded-xl"
          >
            Back to DSA Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <DynamicArticlePage 
      articleData={articleData}
      prevTopic={prevTopic}
      nextTopic={nextTopic}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const slugArray = Array.isArray(slug) ? slug : [slug];
  const fullSlug = slugArray.join('/');

  try {
    // First, try to find the article in subtopics
    const topicsRef = collection(firestore, 'topics');
    const topicsSnapshot = await getDocs(firebaseQuery(topicsRef, orderBy('serial', 'asc')));
    
    let articleData = null;
    let allItems = [];
    
    // Process all topics and build a flat list for navigation
    topicsSnapshot.forEach((doc) => {
      const topicData = doc.data();
      allItems.push({
        slug: topicData.slug,
        title: topicData.title,
        serial: topicData.serial
      });
      
      // Check subtopics
      if (topicData.subtopics && Array.isArray(topicData.subtopics)) {
        topicData.subtopics.forEach((subtopic: any) => {
          allItems.push({
            slug: subtopic.slug,
            title: subtopic.title,
            serial: topicData.serial + 0.1
          });
          
          // If this matches our slug, prepare article data
          if (subtopic.slug === fullSlug) {
            articleData = {
              title: subtopic.title,
              slug: subtopic.slug,
              githubPath: subtopic.githubPath || '',
              youtubePath: subtopic.youtubePath || '',
              content: subtopic.content || []
            };
          }
          
          // Check files within subtopics
          if (subtopic.files && Array.isArray(subtopic.files)) {
            subtopic.files.forEach((file: any) => {
              allItems.push({
                slug: file.slug,
                title: file.title,
                serial: topicData.serial + 0.2
              });
              
              if (file.slug === fullSlug) {
                articleData = {
                  title: file.title,
                  slug: file.slug,
                  githubPath: file.githubPath || '',
                  youtubePath: file.youtubePath || '',
                  content: file.content || []
                };
              }
            });
          }
          
          // Check subsubtopics
          if (subtopic.subsubtopics && Array.isArray(subtopic.subsubtopics)) {
            subtopic.subsubtopics.forEach((subsubtopic: any) => {
              allItems.push({
                slug: subsubtopic.slug,
                title: subsubtopic.title,
                serial: topicData.serial + 0.15
              });
              
              if (subsubtopic.slug === fullSlug) {
                articleData = {
                  title: subsubtopic.title,
                  slug: subsubtopic.slug,
                  githubPath: subsubtopic.githubPath || '',
                  youtubePath: subsubtopic.youtubePath || '',
                  content: subsubtopic.content || []
                };
              }
              
              // Check files within subsubtopics
              if (subsubtopic.files && Array.isArray(subsubtopic.files)) {
                subsubtopic.files.forEach((file: any) => {
                  allItems.push({
                    slug: file.slug,
                    title: file.title,
                    serial: topicData.serial + 0.25
                  });
                  
                  if (file.slug === fullSlug) {
                    articleData = {
                      title: file.title,
                      slug: file.slug,
                      githubPath: file.githubPath || '',
                      youtubePath: file.youtubePath || '',
                      content: file.content || []
                    };
                  }
                });
              }
            });
          }
        });
      }
    });

    // Sort items by serial for navigation
    allItems.sort((a, b) => a.serial - b.serial);
    
    // Find prev and next topics
    let prevTopic = null;
    let nextTopic = null;
    
    if (articleData) {
      const currentIndex = allItems.findIndex(item => item.slug === fullSlug);
      if (currentIndex > 0) {
        prevTopic = allItems[currentIndex - 1];
      }
      if (currentIndex < allItems.length - 1) {
        nextTopic = allItems[currentIndex + 1];
      }
    }

    return {
      props: {
        articleData,
        prevTopic,
        nextTopic,
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      props: {
        articleData: null,
        prevTopic: null,
        nextTopic: null,
      },
    };
  }
};