'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  X, Zap, Loader2, Github, AlertCircle, Eye, EyeOff, 
  Check, Shield, RefreshCw, Upload, User, AtSign, Mail, Lock
} from 'lucide-react';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

// Avatar styles from DiceBear
const AVATAR_STYLES = [
  'avataaars',
  'bottts',
  'pixel-art',
  'lorelei',
  'notionists',
  'open-peeps',
  'thumbs',
  'fun-emoji'
];

// Generate random username
const generateUsername = (): string => {
  const adjectives = ['swift', 'cyber', 'code', 'dev', 'tech', 'pixel', 'byte', 'data', 'cloud', 'stack'];
  const nouns = ['ninja', 'wizard', 'hacker', 'coder', 'master', 'guru', 'pro', 'ace', 'star', 'hero'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 9999);
  return `${adj}${noun}${num}`;
};

// Generate DiceBear avatar URL
const generateAvatar = (seed: string, style: string = 'avataaars'): string => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

// Password strength checker
interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const checkPasswordStrength = (password: string): PasswordStrength => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return {
    score,
    label: labels[score] || 'Very Weak',
    color: colors[score] || 'bg-red-500',
    checks,
  };
};

// Simulated username check (in production, this would be an API call)
const takenUsernames = new Set(['admin', 'user', 'test', 'demo', 'root', 'coderipper', 'developer']);

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('');
  const [avatarStyle, setAvatarStyle] = useState('avataaars');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  
  const { login, signup, loginWithGoogle, loginWithGitHub } = useAuth();
  
  const passwordStrength = checkPasswordStrength(password);

  // Generate initial avatar and username on mount
  useEffect(() => {
    if (activeTab === 'signup' && !username) {
      const newUsername = generateUsername();
      setUsername(newUsername);
      setAvatarSeed(newUsername);
    }
  }, [activeTab, username]);

  // Check username availability
  useEffect(() => {
    if (activeTab !== 'signup' || !username || username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(() => {
      const isTaken = takenUsernames.has(username.toLowerCase());
      setUsernameStatus(isTaken ? 'taken' : 'available');
    }, 500);

    return () => clearTimeout(timer);
  }, [username, activeTab]);

  const regenerateAvatar = () => {
    const newSeed = `${username || 'user'}-${Date.now()}`;
    setAvatarSeed(newSeed);
    setCustomAvatar(null);
  };

  const cycleAvatarStyle = () => {
    const currentIndex = AVATAR_STYLES.indexOf(avatarStyle);
    const nextIndex = (currentIndex + 1) % AVATAR_STYLES.length;
    setAvatarStyle(AVATAR_STYLES[nextIndex]);
    setCustomAvatar(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (activeTab === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (!username.trim() || username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
      if (usernameStatus === 'taken') {
        setError('This username is already taken');
        return;
      }
      if (passwordStrength.score < 2) {
        setError('Please choose a stronger password');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        const avatar = customAvatar || generateAvatar(avatarSeed, avatarStyle);
        await signup(email, password, name, username, avatar);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithGitHub();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    setError('');
    if (tab === 'signup' && !username) {
      const newUsername = generateUsername();
      setUsername(newUsername);
      setAvatarSeed(newUsername);
    }
  };

  if (!isOpen) return null;

  const currentAvatar = customAvatar || generateAvatar(avatarSeed || username || 'default', avatarStyle);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card border border-border shadow-2xl my-8"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative p-8 max-h-[90vh] overflow-y-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="CodeRipper"
                  width={40}
                  height={40}
                  className="rounded-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
                  CodeRipper
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 mb-6 bg-muted rounded-xl">
              {(['login', 'signup'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Avatar Section for Signup */}
            {activeTab === 'signup' && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {/* Avatar with glowing rim */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background">
                      <Image
                        src={currentAvatar}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  {/* Avatar controls */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={regenerateAvatar}
                      className="p-1.5 rounded-full bg-violet-500 text-white hover:bg-violet-600 transition-colors shadow-lg"
                      title="Generate new avatar"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={cycleAvatarStyle}
                      className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg"
                      title="Change avatar style"
                    >
                      <User className="w-3 h-3" />
                    </button>
                    <label className="p-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg cursor-pointer" title="Upload custom avatar">
                      <Upload className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Click buttons to customize your avatar</p>
              </div>
            )}

            {/* OAuth buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-gray-100 text-gray-800 font-medium hover:bg-gray-50 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <button
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-card text-muted-foreground rounded">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <>
                  {/* Name Field */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Fahad Khan"
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  {/* Username Field */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                      <AtSign className="w-4 h-4 text-muted-foreground" />
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="codeninja42"
                        className={`w-full px-4 py-3 rounded-xl bg-muted border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                          usernameStatus === 'taken' 
                            ? 'border-red-500 focus:ring-red-500' 
                            : usernameStatus === 'available'
                            ? 'border-green-500 focus:ring-green-500'
                            : 'border-border'
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && (
                          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        )}
                        {usernameStatus === 'available' && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                        {usernameStatus === 'taken' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    {usernameStatus === 'taken' && (
                      <p className="text-xs text-red-500 mt-1">This username is already taken</p>
                    )}
                    {usernameStatus === 'available' && (
                      <p className="text-xs text-green-500 mt-1">Username is available!</p>
                    )}
                  </div>
                </>
              )}
              
              {/* Email Field */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator (only for signup) */}
                {activeTab === 'signup' && password && (
                  <div className="mt-2 space-y-2">
                    {/* Strength Bar */}
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < passwordStrength.score ? passwordStrength.color : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium ${
                        passwordStrength.score >= 4 ? 'text-green-500' :
                        passwordStrength.score >= 3 ? 'text-blue-500' :
                        passwordStrength.score >= 2 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                      <Shield className={`w-4 h-4 ${
                        passwordStrength.score >= 4 ? 'text-green-500' :
                        passwordStrength.score >= 3 ? 'text-blue-500' :
                        passwordStrength.score >= 2 ? 'text-yellow-500' :
                        'text-red-500'
                      }`} />
                    </div>
                    
                    {/* Password Rules */}
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {passwordStrength.checks.length ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {passwordStrength.checks.uppercase ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                        Uppercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {passwordStrength.checks.lowercase ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                        Lowercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {passwordStrength.checks.number ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                        Number
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {passwordStrength.checks.special ? <Check className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-current" />}
                        Special char
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password (signup only) */}
              {activeTab === 'signup' && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full px-4 py-3 pr-12 rounded-xl bg-muted border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : confirmPassword && password === confirmPassword
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-border focus:ring-violet-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading || (activeTab === 'signup' && usernameStatus === 'taken')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  activeTab === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {activeTab === 'login' && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                <a href="#" className="text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors">
                  Forgot your password?
                </a>
              </p>
            )}

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
