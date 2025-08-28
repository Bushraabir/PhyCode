// firebase/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Enhanced configuration validation
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Check for missing environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingVars);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
  }
}

// Firebase configuration with validation
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate configuration values
Object.entries(firebaseConfig).forEach(([key, value]) => {
  if (!value || value === 'undefined' || value === 'your-value-here') {
    console.warn(`⚠️ Invalid Firebase config for ${key}: ${value}`);
  }
});

// Initialize Firebase with error handling
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

// Initialize services with error handling
let auth;
let firestore;

try {
  auth = getAuth(app);
  firestore = getFirestore(app);

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true';
    
    if (useEmulator) {
      try {
        // Only connect if not already connected
        if (!auth.config.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099');
          console.log('🔧 Connected to Auth Emulator');
        }
        
        // Only connect if not already connected
        if (!firestore._delegate._databaseId.projectId.includes('demo-')) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          console.log('🔧 Connected to Firestore Emulator');
        }
      } catch (emulatorError) {
        console.warn('⚠️ Failed to connect to Firebase emulators:', emulatorError.message);
      }
    }
  }

  console.log('✅ Firebase services initialized successfully');
  
} catch (error) {
  console.error('❌ Firebase services initialization error:', error);
  throw new Error('Failed to initialize Firebase services.');
}

// Enhanced error logging for Firebase operations
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.code && event.reason.code.startsWith('auth/')) {
      console.error('🔐 Firebase Auth Error:', event.reason);
    }
    if (event.reason && event.reason.code && event.reason.code.startsWith('firestore/')) {
      console.error('🗃️ Firestore Error:', event.reason);
    }
  });
}

// Connection state monitoring
if (typeof window !== 'undefined') {
  // Monitor auth state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('🔐 User authenticated:', user.uid);
    } else {
      console.log('🔐 User signed out');
    }
  });

  // Monitor connectivity
  let isOnline = navigator.onLine;
  window.addEventListener('online', () => {
    if (!isOnline) {
      console.log('🌐 Back online - Firebase will sync');
      isOnline = true;
    }
  });
  
  window.addEventListener('offline', () => {
    if (isOnline) {
      console.log('📴 Gone offline - Firebase will cache writes');
      isOnline = false;
    }
  });
}

// Export configured services
export { auth, firestore, app };

// Export configuration for debugging (development only)
if (process.env.NODE_ENV === 'development') {
  export const debugConfig = {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasValidConfig: Object.values(firebaseConfig).every(v => v && v !== 'undefined')
  };
}

// Utility function to check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  try {
    return !!(app && auth && firestore && firebaseConfig.projectId);
  } catch {
    return false;
  }
};

// Enhanced error boundary for Firebase operations
export const withFirebaseErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.error(`Firebase operation failed in ${context}:`, error);
    
    // Enhance common Firebase errors with user-friendly messages
    if (error.code) {
      switch (error.code) {
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your internet connection.');
        case 'auth/too-many-requests':
          throw new Error('Too many requests. Please try again later.');
        case 'firestore/permission-denied':
          throw new Error('Permission denied. Please check your login status.');
        case 'firestore/unavailable':
          throw new Error('Service temporarily unavailable. Please try again.');
        default:
          throw new Error(error.message || 'An unexpected error occurred.');
      }
    }
    
    throw error;
  }
};