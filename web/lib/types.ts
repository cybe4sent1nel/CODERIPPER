// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string | null;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  createdAt: string;
  executionsToday: number;
  totalExecutions: number;
  snippetsCount: number;
  isPremium: boolean;
  streakDays: number;
  longestStreak: number;
  lastActiveDate: string;
  badges: string[];
  totalPoints: number;
  rank: number;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  settings?: {
    theme: string;
    fontSize: number;
    tabSize: number;
    autoSave: boolean;
    showLineNumbers: boolean;
  };
}

// Snippet Types
export interface Snippet {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  isPublic: boolean;
  isFavorite: boolean;
  tags: string[];
  category?: string;
  views: number;
  likes: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  version?: number;
  parentId?: string; // For forked snippets
  collaborators?: string[];
}

export interface SnippetVersion {
  id: string;
  snippetId: string;
  code: string;
  version?: number;
  message?: string;
  createdAt: string;
}

// Execution Types
export interface ExecutionResult {
  id: string;
  snippetId?: string;
  code: string;
  language: string;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed?: number;
  success: boolean;
  createdAt: Date;
}

// AI Feature Types
export interface AIAnalysis {
  codeQuality: number; // 0-100
  suggestions: AISuggestion[];
  securityIssues: SecurityIssue[];
  performance: PerformanceMetric[];
  complexity: ComplexityAnalysis;
}

export interface AISuggestion {
  type: 'improvement' | 'bug' | 'style' | 'performance' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  line?: number;
  message: string;
  suggestedFix?: string;
}

export interface SecurityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  line?: number;
  recommendation: string;
}

export interface PerformanceMetric {
  metric: string;
  value: string;
  recommendation?: string;
}

export interface ComplexityAnalysis {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  linesOfCode: number;
  maintainabilityIndex: number;
}

// Collaboration Types
export interface Comment {
  id: string;
  snippetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  line?: number;
  createdAt: Date;
  replies?: Comment[];
}

// Challenge/Competition Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  language: string;
  starterCode: string;
  testCases: TestCase[];
  points: number;
  participants: number;
  deadline?: Date;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// Analytics Types
export interface UserAnalytics {
  totalExecutions: number;
  languageBreakdown: Record<string, number>;
  weeklyActivity: number[];
  favoriteLanguage: string;
  streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Share Types
export interface ShareOptions {
  type: 'link' | 'embed' | 'gist' | 'download' | 'qr';
  visibility: 'public' | 'unlisted' | 'private';
  expiresAt?: Date;
  password?: string;
  allowFork: boolean;
  allowComments: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'fork' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}
