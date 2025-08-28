// components/Workspace/Playground/index.ts
export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
  languageId: number;
}

export interface TestCase {
  id: string;
  inputText: string;
  outputText: string;
  explanation?: string;
  img?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  constraints: string;
  dislikes: number;
  examples: TestCase[];
  handlerFunction: string;
  likes: number;
  link: string;
  order: number;
  problemStatement: string;
  starterCode: string;
  starterFunctionName: string;
  dsaTag?: string[];
  phyTag?: string[];
  // Enhanced schema fields
  inputFormat?: {
    type: "array" | "matrix" | "string" | "number" | "mixed";
    description: string;
  };
  outputFormat?: {
    type: "array" | "string" | "number" | "boolean";
    precision?: number;
    caseSensitive?: boolean;
  };
  limits?: {
    time: number; // ms
    memory: number; // MB
  };
  hints?: string[];
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  solvedProblems: string[];
  likedProblems: string[];
  dislikedProblems: string[];
  starredProblems: string[];
  createdAt: string;
  totalSubmissions?: number;
  successfulSubmissions?: number;
  lastSolved?: string;
}

export interface SubmissionResult {
  stdout?: string;
  stderr?: string;
  status?: { 
    id: number; 
    description: string 
  };
  token?: string;
  message?: string;
  compile_output?: string;
  time?: string;
  memory?: number;
}

export interface ProcessedInput {
  stdin: string;
  expectedOutput: string;
}

export interface ExecutionStats {
  time: number;
  memory?: number;
  attempts: number;
  totalTime: string;
}

// Connection status for Judge0
export type ConnectionStatus = 'testing' | 'connected' | 'failed';

// Test result status
export type TestResultStatus = 'passed' | 'failed' | null;

// Error categories for better error handling
export interface ErrorContext {
  component: string;
  operation: string;
  userId?: string;
  problemId?: string;
  timestamp: string;
}

// Rate limiting interface
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

// Enhanced API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  rateLimit?: RateLimitInfo;
}

// Judge0 specific types
export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
  wall_time_limit?: number;
}

export interface Judge0Config {
  host: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
}

// Storage keys for localStorage management
export interface StorageKeys {
  code: string;
  timestamp: string;
  fontSize: string;
  theme: string;
  guestSession: string;
}

// Performance monitoring
export interface PerformanceMetrics {
  operationName: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
}

// Validation results
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Firebase operation wrapper
export interface FirebaseOperation<T> {
  operation: () => Promise<T>;
  context: string;
  retries?: number;
}

// Enhanced settings with validation
export interface EnhancedSettings extends ISettings {
  theme: 'dark' | 'light';
  autoSave: boolean;
  showHints: boolean;
  enableSounds: boolean;
  keyBindings: 'default' | 'vim' | 'emacs';
}

// Problem filters and sorting
export interface ProblemFilters {
  difficulty?: Problem['difficulty'][];
  category?: string[];
  tags?: string[];
  solved?: boolean;
  liked?: boolean;
  starred?: boolean;
}

export interface SortOption {
  field: 'title' | 'difficulty' | 'likes' | 'order' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Submission history
export interface SubmissionRecord {
  id: string;
  problemId: string;
  code: string;
  result: SubmissionResult;
  timestamp: string;
  passed: boolean;
  executionTime: number;
}

// User progress tracking
export interface ProgressStats {
  totalProblems: number;
  solvedProblems: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  streak: number;
  lastSubmissionDate: string;
  averageTime: number;
  favoriteCategory: string;
}

// Cache management
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // time to live in milliseconds
}

// Feature flags
export interface FeatureFlags {
  enableHints: boolean;
  enableDiscussions: boolean;
  enableLeaderboard: boolean;
  enableOfflineMode: boolean;
  enableAdvancedMetrics: boolean;
}

// Type guards
export const isValidProblem = (obj: any): obj is Problem => {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.title === 'string' &&
         ['Easy', 'Medium', 'Hard'].includes(obj.difficulty) &&
         Array.isArray(obj.examples);
};

export const isValidTestCase = (obj: any): obj is TestCase => {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.inputText === 'string' &&
         typeof obj.outputText === 'string';
};

export const isValidSubmissionResult = (obj: any): obj is SubmissionResult => {
  return obj && 
         (obj.stdout !== undefined || obj.stderr !== undefined || obj.status !== undefined);
};