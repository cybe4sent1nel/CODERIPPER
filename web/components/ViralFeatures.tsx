'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Hand,
  Flame,
  Zap,
  Dumbbell,
  Crown,
  Trophy,
  Gamepad2,
  Target,
  CircleDollarSign,
  Train,
  Star,
  Timer,
  Wind,
  Car,
  FileText,
  BookOpen,
  Library,
  Building2,
  Globe,
  Map,
  Languages,
  Code,
  Terminal,
  Clock,
  BarChart3,
  Keyboard,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Gem,
  Medal,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
} from 'lucide-react';

interface ViralFeaturesProps {
  code: string;
  language: string;
  executionTime?: number;
  isRunning?: boolean;
}

// Achievement definitions with 5 tiers - Using Custom Badge Images
const achievements = [
  // Streak achievements
  { id: 'streak_3', name: 'Getting Started', description: '3 day streak', icon: Flame, tier: 'bronze', requirement: { type: 'streak', value: 3 }, badgeImage: '/badges/getting started.png' },
  { id: 'streak_7', name: 'Consistency King', description: '7 day streak', icon: Flame, tier: 'silver', requirement: { type: 'streak', value: 7 }, badgeImage: '/badges/consistency_badge.png' },
  { id: 'streak_14', name: 'Persistent Coder', description: '14 day streak', icon: Flame, tier: 'gold', requirement: { type: 'streak', value: 14 }, badgeImage: '/badges/persistent_badge.png' },
  { id: 'streak_30', name: 'Undefeated', description: '30 day streak', icon: Flame, tier: 'platinum', requirement: { type: 'streak', value: 30 }, badgeImage: '/badges/undefeated_badge.png' },
  { id: 'streak_100', name: 'God Tier', description: '100 day streak', icon: Crown, tier: 'diamond', requirement: { type: 'streak', value: 100 }, badgeImage: '/badges/god_tier_badge.png' },
  
  // Execution achievements
  { id: 'runs_10', name: 'Hello World', description: 'Run code 10 times', icon: Rocket, tier: 'bronze', requirement: { type: 'totalRuns', value: 10 }, badgeImage: '/badges/hello_world_badge.png' },
  { id: 'runs_50', name: 'Active Coder', description: 'Run code 50 times', icon: Rocket, tier: 'silver', requirement: { type: 'totalRuns', value: 50 }, badgeImage: '/badges/active_badge.png' },
  { id: 'runs_100', name: 'Compiler', description: 'Run code 100 times', icon: Rocket, tier: 'gold', requirement: { type: 'totalRuns', value: 100 }, badgeImage: '/badges/compiler_badge.png' },
  { id: 'runs_500', name: 'Mainframe', description: 'Run code 500 times', icon: Zap, tier: 'platinum', requirement: { type: 'totalRuns', value: 500 }, badgeImage: '/badges/mainframe_badge.png' },
  { id: 'runs_1000', name: 'Overclock', description: 'Run code 1000 times', icon: Dumbbell, tier: 'diamond', requirement: { type: 'totalRuns', value: 1000 }, badgeImage: '/badges/overclock_badge.png' },
  
  // Lines of code achievements
  { id: 'lines_100', name: 'Scribe', description: 'Write 100 lines of code', icon: FileText, tier: 'bronze', requirement: { type: 'linesWritten', value: 100 }, badgeImage: '/badges/scribe_badge.png' },
  { id: 'lines_500', name: 'Scripting Pro', description: 'Write 500 lines of code', icon: BookOpen, tier: 'silver', requirement: { type: 'linesWritten', value: 500 }, badgeImage: '/badges/scripting_badge.png' },
  { id: 'lines_1000', name: 'Coder', description: 'Write 1000 lines of code', icon: Library, tier: 'gold', requirement: { type: 'linesWritten', value: 1000 }, badgeImage: '/badges/coder_badge.png' },
  { id: 'lines_5000', name: 'Architect', description: 'Write 5000 lines of code', icon: Building2, tier: 'platinum', requirement: { type: 'linesWritten', value: 5000 }, badgeImage: '/badges/architect_badge.png' },
  { id: 'lines_10000', name: 'Root Access', description: 'Write 10000 lines of code', icon: Globe, tier: 'diamond', requirement: { type: 'linesWritten', value: 10000 }, badgeImage: '/badges/root_access_badge.png' },
  
  // Language achievements
  { id: 'lang_3', name: 'Ping', description: 'Use 3 programming languages', icon: Languages, tier: 'bronze', requirement: { type: 'languagesUsed', value: 3 }, badgeImage: '/badges/ping_badge.png' },
  { id: 'lang_5', name: 'Firewall', description: 'Use 5 programming languages', icon: Languages, tier: 'silver', requirement: { type: 'languagesUsed', value: 5 }, badgeImage: '/badges/firewall_badge.png' },
  { id: 'lang_8', name: 'Poly-Syntactic', description: 'Use 8 programming languages', icon: Map, tier: 'gold', requirement: { type: 'languagesUsed', value: 8 }, badgeImage: '/badges/poly-syntactic_badge.png' },
  { id: 'lang_12', name: 'Omniscient', description: 'Use 12 programming languages', icon: Globe, tier: 'platinum', requirement: { type: 'languagesUsed', value: 12 }, badgeImage: '/badges/omniscient_badge.png' },
  { id: 'lang_15', name: 'Universal Coder', description: 'Use 15+ programming languages', icon: Crown, tier: 'diamond', requirement: { type: 'languagesUsed', value: 15 }, badgeImage: '/badges/universal_badge.png' },
  
  // Speed achievements
  { id: 'speed_50', name: 'Quick Fingers', description: 'Sub 50ms code execution', icon: Timer, tier: 'gold', requirement: { type: 'speed', value: 50 }, badgeImage: '/badges/quick_fingers_badge.png' },
];

const tierColors = {
  bronze: { 
    bg: 'from-amber-600/20 to-orange-700/20 dark:from-amber-700/30 dark:to-orange-800/30', 
    border: 'border-amber-500/50 dark:border-amber-600/50', 
    text: 'text-amber-600 dark:text-amber-400', 
    ribbon: 'bg-gradient-to-r from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    badge: 'from-amber-400 via-amber-500 to-orange-600'
  },
  silver: { 
    bg: 'from-slate-300/30 to-gray-400/30 dark:from-gray-400/20 dark:to-slate-500/20', 
    border: 'border-slate-400/50 dark:border-gray-400/50', 
    text: 'text-slate-600 dark:text-gray-300', 
    ribbon: 'bg-gradient-to-r from-slate-400 to-gray-500',
    glow: 'shadow-gray-400/20',
    badge: 'from-slate-300 via-gray-400 to-slate-500'
  },
  gold: { 
    bg: 'from-yellow-400/20 to-amber-500/20 dark:from-yellow-500/20 dark:to-amber-500/20', 
    border: 'border-yellow-500/50 dark:border-yellow-500/50', 
    text: 'text-yellow-600 dark:text-yellow-400', 
    ribbon: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/30',
    badge: 'from-yellow-300 via-yellow-400 to-amber-500'
  },
  platinum: { 
    bg: 'from-cyan-400/20 to-teal-500/20 dark:from-cyan-400/20 dark:to-teal-500/20', 
    border: 'border-cyan-400/50 dark:border-cyan-400/50', 
    text: 'text-cyan-600 dark:text-cyan-400', 
    ribbon: 'bg-gradient-to-r from-cyan-400 to-teal-500',
    glow: 'shadow-cyan-500/30',
    badge: 'from-cyan-300 via-cyan-400 to-teal-500'
  },
  diamond: { 
    bg: 'from-purple-400/20 to-pink-500/20 dark:from-purple-500/20 dark:to-pink-500/20', 
    border: 'border-purple-400/50 dark:border-purple-400/50', 
    text: 'text-purple-600 dark:text-purple-400', 
    ribbon: 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500',
    glow: 'shadow-purple-500/30',
    badge: 'from-purple-400 via-pink-500 to-rose-500'
  },
};

const keyboardShortcuts = [
  { keys: ['Ctrl', 'Enter'], action: 'Run Code', icon: Rocket },
  { keys: ['Ctrl', 'S'], action: 'Save Snippet', icon: FileText },
  { keys: ['Ctrl', 'L'], action: 'Clear Output', icon: Terminal },
  { keys: ['Ctrl', '/'], action: 'Toggle Comment', icon: Code },
  { keys: ['Ctrl', 'Z'], action: 'Undo', icon: Clock },
  { keys: ['Ctrl', 'Y'], action: 'Redo', icon: Clock },
  { keys: ['Ctrl', 'F'], action: 'Find', icon: Target },
  { keys: ['Ctrl', 'H'], action: 'Replace', icon: Target },
  { keys: ['Tab'], action: 'Indent', icon: Code },
  { keys: ['Shift', 'Tab'], action: 'Outdent', icon: Code },
];

export default function ViralFeatures({ code, language, executionTime, isRunning }: ViralFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'challenges' | 'achievements'>('shortcuts');
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [shortcutsExpanded, setShortcutsExpanded] = useState(false);
  const [stats, setStats] = useState({
    streak: 0,
    totalRuns: 0,
    linesWritten: 0,
    languagesUsed: [] as string[],
    lastRunDate: '',
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showAchievementPopup, setShowAchievementPopup] = useState<typeof achievements[0] | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('coderipper_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    const savedAchievements = localStorage.getItem('coderipper_achievements');
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Update stats when code runs
  useEffect(() => {
    if (isRunning) {
      const today = new Date().toDateString();
      const newStats = { ...stats };
      
      // Update streak
      if (stats.lastRunDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (stats.lastRunDate === yesterday.toDateString()) {
          newStats.streak += 1;
        } else if (stats.lastRunDate !== today) {
          newStats.streak = 1;
        }
        newStats.lastRunDate = today;
      }
      
      // Update total runs
      newStats.totalRuns += 1;
      
      // Update lines written
      newStats.linesWritten += code.split('\n').length;
      
      // Update languages used
      if (!newStats.languagesUsed.includes(language)) {
        newStats.languagesUsed = [...newStats.languagesUsed, language];
      }
      
      setStats(newStats);
      localStorage.setItem('coderipper_stats', JSON.stringify(newStats));
      
      // Check for new achievements
      checkAchievements(newStats);
    }
  }, [isRunning]);

  const checkAchievements = (currentStats: typeof stats) => {
    const newUnlocked: string[] = [];
    
    achievements.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;
      
      const { type, value } = achievement.requirement;
      let unlocked = false;
      
      switch (type) {
        case 'streak':
          unlocked = currentStats.streak >= value;
          break;
        case 'totalRuns':
          unlocked = currentStats.totalRuns >= value;
          break;
        case 'linesWritten':
          unlocked = currentStats.linesWritten >= value;
          break;
        case 'languagesUsed':
          unlocked = currentStats.languagesUsed.length >= value;
          break;
        case 'speed':
          unlocked = executionTime !== undefined && executionTime <= value;
          break;
      }
      
      if (unlocked) {
        newUnlocked.push(achievement.id);
        setShowAchievementPopup(achievement);
        setTimeout(() => setShowAchievementPopup(null), 3000);
      }
    });
    
    if (newUnlocked.length > 0) {
      const updated = [...unlockedAchievements, ...newUnlocked];
      setUnlockedAchievements(updated);
      localStorage.setItem('coderipper_achievements', JSON.stringify(updated));
    }
  };

  const tabs = [
    { id: 'achievements', label: 'Badges', icon: Award },
    { id: 'challenges', label: 'Daily', icon: Target },
    { id: 'shortcuts', label: 'Keys', icon: Keyboard },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
      {/* Achievement Popup - With Badge Image */}
      <AnimatePresence>
        {showAchievementPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.8 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="relative">
              {/* Sparkle Effects */}
              <motion.div
                className="absolute -top-2 -left-2"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-3"
                animate={{ scale: [1, 1.4, 1], rotate: [0, -20, 0] }}
                transition={{ duration: 0.6, repeat: 3, delay: 0.1 }}
              >
                <Star className="w-5 h-5 text-pink-400" />
              </motion.div>
              
              {/* Main Popup Card */}
              <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border-2 ${tierColors[showAchievementPopup.tier as keyof typeof tierColors].border}`}>
                {/* Badge Image */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-yellow-400">
                  <img
                    src={showAchievementPopup.badgeImage}
                    alt={showAchievementPopup.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Text Content */}
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    Badge Unlocked!
                  </div>
                  <div className={`font-bold text-lg ${tierColors[showAchievementPopup.tier as keyof typeof tierColors].text}`}>
                    {showAchievementPopup.name}
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${tierColors[showAchievementPopup.tier as keyof typeof tierColors].ribbon} text-white font-medium`}>
                    {showAchievementPopup.tier.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsible Stats Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700/50">
        <button
          onClick={() => setStatsExpanded(!statsExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Stats</span>
            <div className="flex items-center gap-2 ml-2">
              <span className="flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
                <Flame className="w-3 h-3" />{stats.streak}d
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400">
                <Rocket className="w-3 h-3" />{stats.totalRuns}
              </span>
            </div>
          </div>
          <motion.div animate={{ rotate: statsExpanded ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {statsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 grid grid-cols-4 gap-3">
                <StatCard
                  icon={<Flame className="w-5 h-5" />}
                  label="Streak"
                  value={`${stats.streak}d`}
                  color="orange"
                />
                <StatCard
                  icon={<Rocket className="w-5 h-5" />}
                  label="Runs"
                  value={stats.totalRuns.toString()}
                  color="blue"
                />
                <StatCard
                  icon={<Code className="w-5 h-5" />}
                  label="Lines"
                  value={stats.linesWritten > 1000 ? `${(stats.linesWritten / 1000).toFixed(1)}k` : stats.linesWritten.toString()}
                  color="green"
                />
                <StatCard
                  icon={<Languages className="w-5 h-5" />}
                  label="Langs"
                  value={stats.languagesUsed.length.toString()}
                  color="purple"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-transparent">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-white bg-white dark:bg-gray-800/50 border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/30'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-transparent">
        <AnimatePresence mode="wait">
          {activeTab === 'shortcuts' && (
            <motion.div
              key="shortcuts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              {/* Collapsible Shortcuts */}
              <button
                onClick={() => setShortcutsExpanded(!shortcutsExpanded)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Keyboard Shortcuts</span>
                  <span className="text-xs text-gray-400">({keyboardShortcuts.length})</span>
                </div>
                <motion.div animate={{ rotate: shortcutsExpanded ? 180 : 0 }}>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {shortcutsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    {keyboardShortcuts.map((shortcut, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700/30"
                      >
                        <div className="flex items-center gap-3">
                          <shortcut.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.action}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, i) => (
                            <React.Fragment key={i}>
                              <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 shadow-sm">
                                {key}
                              </kbd>
                              {i < shortcut.keys.length - 1 && (
                                <span className="text-gray-400 text-xs">+</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!shortcutsExpanded && (
                <p className="text-center text-sm text-gray-400 py-4">
                  Click above to view all keyboard shortcuts
                </p>
              )}
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center py-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30" />
                  <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                    <Target className="w-12 h-12 text-purple-500 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-4 mb-2">Daily Challenges</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Visit the Arena to solve daily coding challenges!
                </p>
                <a
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  <Trophy className="w-5 h-5" />
                  Go to Arena
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3 overflow-visible"
            >
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-500 dark:text-gray-400">
                  {unlockedAchievements.length} / {achievements.length} badges unlocked
                </span>
                <div className="flex items-center gap-1">
                  {['bronze', 'silver', 'gold', 'platinum', 'diamond'].map(tier => (
                    <div key={tier} className={`w-3 h-3 rounded-full bg-gradient-to-r ${tierColors[tier as keyof typeof tierColors].badge}`} title={tier} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-visible pb-24">
                {achievements.map((achievement, index) => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  const colors = tierColors[achievement.tier as keyof typeof tierColors];
                  // Calculate position for tooltip - left badges go right, right badges go left
                  const colIndex = index % 5;
                  const isLeftEdge = colIndex === 0;
                  const isRightEdge = colIndex === 4;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group cursor-pointer z-0 hover:z-50"
                    >
                      {/* Badge Image Container */}
                      <div className={`relative aspect-square rounded-xl overflow-hidden ${
                        isUnlocked
                          ? 'shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                          : 'opacity-50 grayscale'
                      } ${isUnlocked ? colors.border.replace('border-', 'ring-') : 'ring-gray-300 dark:ring-gray-600'}`}>
                        {/* Badge Image */}
                        <img
                          src={achievement.badgeImage}
                          alt={achievement.name}
                          className={`w-full h-full object-cover ${isUnlocked ? '' : 'filter grayscale'}`}
                          loading="lazy"
                        />
                        
                        {/* Shine Effect on Hover */}
                        {isUnlocked && (
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-full -left-full w-[200%] h-[200%] bg-gradient-to-br from-white/0 via-white/30 to-white/0 rotate-45 group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-700" />
                          </div>
                        )}
                        
                        {/* Lock Overlay for Locked Badges */}
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-800/80 rounded-full flex items-center justify-center">
                              <Shield className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                        
                        {/* Tier Indicator - Minimal */}
                        {isUnlocked && (
                          <div className={`absolute bottom-0 left-0 right-0 h-3 ${colors.ribbon} flex items-center justify-center`}>
                            <span className="text-[6px] font-bold text-white uppercase tracking-tight leading-none">
                              {achievement.tier}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Badge Name Below */}
                      <div className="mt-1.5 text-center px-1">
                        <div className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                          isUnlocked ? colors.text : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          {achievement.name}
                        </div>
                      </div>
                      
                      {/* Hover Tooltip - Smart positioning */}
                      <div className={`absolute top-full mt-2 w-44 px-3 py-2.5 bg-white dark:bg-gray-800 rounded-lg text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-[100] border border-gray-200 dark:border-gray-600 shadow-2xl backdrop-blur-0 ${
                        isLeftEdge ? 'left-0' : isRightEdge ? 'right-0' : 'left-1/2 -translate-x-1/2'
                      }`} style={{ backgroundColor: 'rgb(255, 255, 255)' }}>
                        {/* Arrow */}
                        <div className={`absolute -top-1.5 w-3 h-3 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-600 rotate-45 ${
                          isLeftEdge ? 'left-4' : isRightEdge ? 'right-4' : 'left-1/2 -translate-x-1/2'
                        }`} style={{ backgroundColor: 'rgb(255, 255, 255)' }} />
                        
                        <div className="relative">
                          <div className={`font-bold text-xs mb-0.5 ${colors.text}`}>{achievement.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-[11px] leading-snug">
                            {achievement.description}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className={`text-[9px] px-1.5 py-0.5 rounded ${colors.ribbon} text-white font-medium`}>
                              {achievement.tier.toUpperCase()}
                            </div>
                            {isUnlocked && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const text = `I just unlocked the "${achievement.name}" badge on CodeRipper! 🏆`;
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
                                  }}
                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                  title="Share on X"
                                >
                                  <Twitter className="w-3 h-3 text-blue-400" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const text = `I just unlocked the "${achievement.name}" badge on CodeRipper!`;
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent(text)}`, '_blank');
                                  }}
                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                  title="Share on LinkedIn"
                                >
                                  <Linkedin className="w-3 h-3 text-blue-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const text = `I just unlocked the "${achievement.name}" badge on CodeRipper! 🏆`;
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(text)}`, '_blank');
                                  }}
                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                                  title="Share on Facebook"
                                >
                                  <Facebook className="w-3 h-3 text-blue-700" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'orange' | 'blue' | 'green' | 'purple';
}

const statColors = {
  orange: {
    bg: 'from-orange-100 to-amber-100 dark:from-orange-500/10 dark:to-amber-500/10 border-orange-200 dark:border-orange-500/30',
    icon: 'from-orange-500 to-amber-500',
    text: 'text-orange-600 dark:text-orange-400',
  },
  blue: {
    bg: 'from-blue-100 to-cyan-100 dark:from-blue-500/10 dark:to-cyan-500/10 border-blue-200 dark:border-blue-500/30',
    icon: 'from-blue-500 to-cyan-500',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'from-green-100 to-emerald-100 dark:from-green-500/10 dark:to-emerald-500/10 border-green-200 dark:border-green-500/30',
    icon: 'from-green-500 to-emerald-500',
    text: 'text-green-600 dark:text-green-400',
  },
  purple: {
    bg: 'from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10 border-purple-200 dark:border-purple-500/30',
    icon: 'from-purple-500 to-pink-500',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  const c = statColors[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br ${c.bg} border shadow-sm hover:shadow-md transition-shadow min-h-[100px]`}
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.icon} flex items-center justify-center shadow-lg mb-2`}>
        <div className="text-white">{icon}</div>
      </div>
      <div className={`text-xl font-bold ${c.text}`}>{value}</div>
      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium text-center">{label}</div>
    </motion.div>
  );
}
