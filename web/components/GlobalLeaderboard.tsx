'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Flame, Medal, Crown, Star, Target, Zap, Users,
  ArrowUp, ArrowDown, Minus, ChevronDown, ChevronUp,
  Code, Calendar, Award, TrendingUp, RefreshCw, Filter,
  Search, Globe, Sparkles
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  streak: number;
  totalPoints: number;
  challengesSolved: number;
  rank: number;
  badges: string[];
  lastActive: string;
  favoriteLanguage: string;
}

interface LeaderboardProps {
  currentUserId?: string;
  className?: string;
}

const languageColors: Record<string, string> = {
  python: 'bg-yellow-500',
  javascript: 'bg-yellow-400',
  typescript: 'bg-blue-500',
  java: 'bg-orange-500',
  cpp: 'bg-blue-600',
  c: 'bg-gray-500',
  rust: 'bg-orange-600',
  go: 'bg-cyan-500',
  ruby: 'bg-red-500',
  php: 'bg-purple-500',
  swift: 'bg-orange-400',
  kotlin: 'bg-purple-600',
  csharp: 'bg-green-600',
  default: 'bg-gray-400'
};

const badgeIcons: Record<string, { icon: typeof Trophy; color: string; label: string }> = {
  streak_3: { icon: Flame, color: 'text-orange-400', label: '3 Day Streak' },
  streak_7: { icon: Flame, color: 'text-orange-500', label: '7 Day Streak' },
  streak_14: { icon: Flame, color: 'text-red-500', label: '14 Day Streak' },
  streak_30: { icon: Flame, color: 'text-red-600', label: '30 Day Streak' },
  runs_10: { icon: Target, color: 'text-green-400', label: '10 Challenges' },
  runs_50: { icon: Target, color: 'text-green-500', label: '50 Challenges' },
  runs_100: { icon: Target, color: 'text-green-600', label: '100 Challenges' },
  points_500: { icon: Star, color: 'text-yellow-400', label: '500 Points' },
  points_1000: { icon: Star, color: 'text-yellow-500', label: '1000 Points' },
  points_2500: { icon: Star, color: 'text-yellow-600', label: '2500 Points' },
  polyglot_5: { icon: Globe, color: 'text-purple-500', label: 'Polyglot' },
  speed_50: { icon: Zap, color: 'text-blue-400', label: 'Speed Demon' },
};

const getRankDisplay = (rank: number) => {
  if (rank === 1) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50' };
  if (rank === 2) return { icon: Medal, color: 'text-gray-400 dark:text-gray-300', bg: 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50' };
  if (rank === 3) return { icon: Medal, color: 'text-amber-600', bg: 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/50' };
  return { icon: null, color: 'text-gray-400', bg: 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50' };
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export default function GlobalLeaderboard({ currentUserId, className = '' }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'totalPoints' | 'streak' | 'challengesSolved'>('totalPoints');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy,
        limit: '50',
        ...(currentUserId && { userId: currentUserId })
      });
      
      const response = await fetch(`/api/leaderboard?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
        setUserRank(data.userRank || null);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
    setLoading(false);
  }, [sortBy, currentUserId]);

  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  const filteredLeaderboard = leaderboard.filter(entry => {
    const matchesSearch = entry.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || entry.favoriteLanguage === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const languages = Array.from(new Set(leaderboard.map(e => e.favoriteLanguage)));

  return (
    <div className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Global Leaderboard
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top coders ranked by points & streaks</p>
            </div>
          </div>
          <button
            onClick={() => fetchLeaderboard()}
            className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-500 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            {[
              { key: 'totalPoints', label: 'Points', icon: Star },
              { key: 'streak', label: 'Streak', icon: Flame },
              { key: 'challengesSolved', label: 'Solved', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSortBy(key as typeof sortBy)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === key
                    ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400 border border-blue-500/50'
                    : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showFilters || selectedLanguage !== 'all'
                ? 'bg-purple-500/20 text-purple-500 dark:text-purple-400 border border-purple-500/50'
                : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Language Filter */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedLanguage === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  All Languages
                </button>
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${languageColors[lang] || languageColors.default}`} />
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Your Rank (if logged in and not in top 10) */}
      {userRank && userRank.rank > 10 && (
        <div className="px-6 py-3 bg-blue-500/10 border-b border-blue-500/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-medium">Your Rank:</span>
              <span className="text-2xl font-bold text-white">#{userRank.rank}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4" />
                {userRank.totalPoints.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" />
                {userRank.streak} days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard List */}
      <div className="overflow-y-auto max-h-[600px]">
        {loading && leaderboard.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : filteredLeaderboard.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mb-3 opacity-50" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            {filteredLeaderboard.map((entry, index) => {
              const rankDisplay = getRankDisplay(entry.rank);
              const isCurrentUser = entry.id === currentUserId;
              const isExpanded = expandedUser === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div
                    onClick={() => setExpandedUser(isExpanded ? null : entry.id)}
                    className={`px-6 py-4 cursor-pointer transition-colors ${
                      isCurrentUser
                        ? 'bg-blue-500/10 hover:bg-blue-500/20'
                        : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                    } ${entry.rank <= 3 ? rankDisplay.bg + ' border-l-4' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-12 text-center">
                        {rankDisplay.icon ? (
                          <rankDisplay.icon className={`w-6 h-6 mx-auto ${rankDisplay.color}`} />
                        ) : (
                          <span className="text-lg font-bold text-gray-400 dark:text-gray-500">#{entry.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          className="w-10 h-10 rounded-full bg-gray-700"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${languageColors[entry.favoriteLanguage] || languageColors.default}`} />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold truncate ${isCurrentUser ? 'text-blue-500 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                            {entry.username}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">You</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            {entry.favoriteLanguage}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {getTimeAgo(entry.lastActive)}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-orange-400 font-semibold">
                            <Flame className="w-4 h-4" />
                            {entry.streak}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-green-500 dark:text-green-400 font-semibold">
                            <Target className="w-4 h-4" />
                            {entry.challengesSolved}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">Solved</div>
                        </div>
                        <div className="text-center min-w-[80px]">
                          <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 font-bold text-lg">
                            <Star className="w-4 h-4" />
                            {entry.totalPoints.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">Points</div>
                        </div>
                      </div>

                      {/* Expand Arrow */}
                      <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-100/30 dark:bg-gray-800/30"
                      >
                        <div className="px-6 py-4 ml-16">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Badges Earned</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.badges.length > 0 ? entry.badges.map(badge => {
                              const badgeInfo = badgeIcons[badge];
                              if (!badgeInfo) return null;
                              return (
                                <div
                                  key={badge}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full"
                                  title={badgeInfo.label}
                                >
                                  <badgeInfo.icon className={`w-4 h-4 ${badgeInfo.color}`} />
                                  <span className="text-xs text-gray-600 dark:text-gray-300">{badgeInfo.label}</span>
                                </div>
                              );
                            }) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500">No badges yet</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gray-100/30 dark:bg-gray-800/30 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {leaderboard.length} Active Coders
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Updates every 30s
          </span>
        </div>
      </div>
    </div>
  );
}
