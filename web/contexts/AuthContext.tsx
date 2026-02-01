'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Snippet } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  signup: (email: string, password: string, name: string, username?: string, avatar?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkUsageLimit: (action: 'execution' | 'snippet' | 'ai') => boolean;
  incrementUsage: (action: 'execution' | 'snippet' | 'ai') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate username from name
const generateUsernameFromName = (name: string): string => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const num = Math.floor(Math.random() * 9999);
  return `${base}${num}`;
};

// Generate DiceBear avatar
const generateAvatar = (seed: string): string => {
  const styles = ['avataaars', 'bottts', 'pixel-art', 'lorelei', 'notionists'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

// Simulated user data for demo purposes
const createDemoUser = (overrides?: Partial<User>): User => ({
  id: 'demo-user-' + Date.now(),
  email: 'demo@coderipper.dev',
  username: 'demouser' + Math.floor(Math.random() * 9999),
  name: 'Demo User',
  avatar: null,
  plan: 'free',
  isPremium: false,
  createdAt: new Date().toISOString(),
  executionsToday: 0,
  totalExecutions: 0,
  snippetsCount: 0,
  streakDays: 1,
  longestStreak: 1,
  lastActiveDate: new Date().toISOString(),
  badges: ['first-code'],
  totalPoints: 0,
  rank: 999,
  bio: '',
  location: '',
  website: '',
  socialLinks: {},
  settings: {
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    autoSave: true,
    showLineNumbers: true,
  },
  ...overrides,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('coderipper_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Reset daily executions if it's a new day
        const lastExecution = localStorage.getItem('coderipper_last_execution');
        const today = new Date().toDateString();
        if (lastExecution !== today) {
          parsed.executionsToday = 0;
          localStorage.setItem('coderipper_last_execution', today);
        }
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('coderipper_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, create user with email
    const username = generateUsernameFromName(email.split('@')[0]);
    const newUser: User = createDemoUser({
      email,
      username,
      name: email.split('@')[0],
      avatar: generateAvatar(username),
    });
    
    setUser(newUser);
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const username = 'googleuser' + Math.floor(Math.random() * 9999);
    const newUser: User = createDemoUser({
      email: 'google.user@gmail.com',
      username,
      name: 'Google User',
      avatar: generateAvatar(username),
    });
    
    setUser(newUser);
    setIsLoading(false);
  };

  const loginWithGitHub = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const username = 'githubdev' + Math.floor(Math.random() * 9999);
    const newUser: User = createDemoUser({
      email: 'github.user@github.com',
      username,
      name: 'GitHub Developer',
      avatar: generateAvatar(username),
    });
    
    setUser(newUser);
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, name: string, username?: string, avatar?: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const finalUsername = username || generateUsernameFromName(name);
    const finalAvatar = avatar || generateAvatar(finalUsername);
    
    const newUser: User = createDemoUser({
      email,
      username: finalUsername,
      name,
      avatar: finalAvatar,
      createdAt: new Date().toISOString(),
    });
    
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coderipper_user');
    localStorage.removeItem('coderipper_snippets');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  const checkUsageLimit = (action: 'execution' | 'snippet' | 'ai'): boolean => {
    if (!user) return false;
    if (user.isPremium) return true;
    
    switch (action) {
      case 'execution':
        return user.executionsToday < 10;
      case 'snippet':
        return user.snippetsCount < 5;
      case 'ai':
        return user.executionsToday < 5; // AI has stricter limits
      default:
        return false;
    }
  };

  const incrementUsage = (action: 'execution' | 'snippet' | 'ai') => {
    if (!user) return;
    
    const updates: Partial<User> = {};
    
    switch (action) {
      case 'execution':
        updates.executionsToday = user.executionsToday + 1;
        updates.totalExecutions = user.totalExecutions + 1;
        break;
      case 'snippet':
        updates.snippetsCount = user.snippetsCount + 1;
        break;
    }
    
    setUser({ ...user, ...updates });
    localStorage.setItem('coderipper_last_execution', new Date().toDateString());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        loginWithGitHub,
        signup,
        logout,
        updateProfile,
        checkUsageLimit,
        incrementUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
