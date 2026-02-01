'use client';

import { useState, useEffect } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import { 
  Trophy, Brain, Flame, Star, Users, Target, Calendar,
  ChevronLeft, Sparkles, Code, Zap
} from 'lucide-react';
import Link from 'next/link';

import GlobalLeaderboard from '../components/GlobalLeaderboard';
import DailyChallenges from '../components/DailyChallenges';

// Languages available for challenges
const LANGUAGES = [
  { id: 'python', name: 'Python', color: 'bg-yellow-500' },
  { id: 'javascript', name: 'JavaScript', color: 'bg-yellow-400' },
  { id: 'typescript', name: 'TypeScript', color: 'bg-blue-500' },
  { id: 'java', name: 'Java', color: 'bg-orange-500' },
  { id: 'cpp', name: 'C++', color: 'bg-blue-600' },
  { id: 'go', name: 'Go', color: 'bg-cyan-500' },
  { id: 'rust', name: 'Rust', color: 'bg-orange-600' },
  { id: 'ruby', name: 'Ruby', color: 'bg-red-500' },
];

export default function LeaderboardPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('challenges');
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  // Initialize user from localStorage
  useEffect(() => {
    // Get or create user ID
    let storedUserId = localStorage.getItem('coderipper_user_id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('coderipper_user_id', storedUserId);
    }
    setUserId(storedUserId);

    // Get or create username
    let storedUsername = localStorage.getItem('coderipper_username');
    if (!storedUsername) {
      storedUsername = `Coder${Math.floor(Math.random() * 10000)}`;
      localStorage.setItem('coderipper_username', storedUsername);
    }
    setUsername(storedUsername);

    // Get preferred language
    const storedLanguage = localStorage.getItem('coderipper_language');
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }

    // Get stats
    const stats = JSON.parse(localStorage.getItem('coderipper_stats') || '{}');
    setTotalPoints(stats.totalPoints || 0);
    
    // Get streak
    const streakData = localStorage.getItem(`streak_${storedUserId}`);
    if (streakData) {
      const { streak: savedStreak, lastDate } = JSON.parse(streakData);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastDate === today || lastDate === yesterday) {
        setStreak(savedStreak);
      }
    }
  }, []);

  // Save language preference
  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    localStorage.setItem('coderipper_language', langId);
  };

  const handlePointsEarned = (points: number) => {
    const newTotal = totalPoints + points;
    setTotalPoints(newTotal);
    const stats = JSON.parse(localStorage.getItem('coderipper_stats') || '{}');
    stats.totalPoints = newTotal;
    localStorage.setItem('coderipper_stats', JSON.stringify(stats));
  };

  return (
    <>
      <NextSeo
        title="Leaderboard & Daily Challenges | CodeRipper"
        description="Compete with coders worldwide, solve daily challenges, and climb the leaderboard!"
      />
      
      <div className="min-h-screen bg-gray-950">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link 
                  href="/"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back to Editor</span>
                </Link>
                <div className="w-px h-6 bg-gray-700" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">CodeRipper Arena</h1>
                    <p className="text-xs text-gray-400">Compete • Challenge • Conquer</p>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="w-5 h-5" />
                    <span className="font-bold">{streak}</span>
                  </div>
                  <div className="w-px h-6 bg-gray-700" />
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">{totalPoints}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-xl">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                    alt={username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white font-medium">{username}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Language Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Select Your Language</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    selectedLanguage === lang.id
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${lang.color}`} />
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              <Brain className="w-5 h-5" />
              Daily Challenges
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
              }`}
            >
              <Trophy className="w-5 h-5" />
              Global Leaderboard
              <Users className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'challenges' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <DailyChallenges
                    language={selectedLanguage}
                    userId={userId}
                    username={username}
                    onPointsEarned={handlePointsEarned}
                  />
                </div>
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Today&apos;s Date</span>
                        </div>
                        <span className="text-white font-medium">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Zap className="w-4 h-4" />
                          <span>Challenges Available</span>
                        </div>
                        <span className="text-green-400 font-medium">3 / day</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Star className="w-4 h-4" />
                          <span>Max Points Today</span>
                        </div>
                        <span className="text-yellow-400 font-medium">60 pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Pro Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Complete all 3 challenges daily to maximize points
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Build your streak by solving at least 1 challenge daily
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Use hints wisely - they don&apos;t reduce your points!
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        Try different languages to become a polyglot coder
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <GlobalLeaderboard currentUserId={userId} />
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>© 2024 CodeRipper. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span>Challenges refresh daily at midnight UTC</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
