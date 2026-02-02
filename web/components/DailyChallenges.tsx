'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Code, Bug, FileOutput, CheckCircle, XCircle, Clock,
  Star, Flame, Trophy, Zap, RefreshCw, ChevronRight, Lightbulb,
  Play, Lock, Award, Target, Calendar, Sparkles, ArrowRight
} from 'lucide-react';

interface ChallengeOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Challenge {
  id: string;
  type: 'quiz' | 'code' | 'debug' | 'output';
  language: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  code?: string;
  options: ChallengeOption[];
  explanation?: string;
  hint?: string;
}

interface DailyChallengesProps {
  language: string;
  userId: string;
  username: string;
  onPointsEarned?: (points: number) => void;
  className?: string;
}

interface ChallengeProgress {
  [challengeId: string]: {
    solved: boolean;
    attempts: number;
    pointsEarned: number;
  };
}

const typeIcons: Record<string, typeof Brain> = {
  quiz: Brain,
  code: Code,
  debug: Bug,
  output: FileOutput
};

const typeLabels: Record<string, string> = {
  quiz: 'Quiz',
  code: 'Coding Challenge',
  debug: 'Debug This',
  output: 'Predict Output'
};

const difficultyConfig = {
  Easy: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
  Hard: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' }
};

const getStorageKey = (userId: string) => `dailyChallenges_${userId}_${new Date().toDateString()}`;

export default function DailyChallenges({
  language,
  userId,
  username,
  onPointsEarned,
  className = ''
}: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [progress, setProgress] = useState<ChallengeProgress>({});
  const [todayPoints, setTodayPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const storageKey = getStorageKey(userId);
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setProgress(parsed.progress || {});
      setTodayPoints(parsed.todayPoints || 0);
    }

    // Load streak
    const streakData = localStorage.getItem(`streak_${userId}`);
    if (streakData) {
      const { streak: savedStreak, lastDate } = JSON.parse(streakData);
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === today || lastDate === yesterday) {
        setStreak(savedStreak);
      } else {
        setStreak(0);
      }
    }
  }, [userId]);

  // Save progress to localStorage
  const saveProgress = useCallback((newProgress: ChallengeProgress, newPoints: number) => {
    const storageKey = getStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify({
      progress: newProgress,
      todayPoints: newPoints
    }));
  }, [userId]);

  // Update streak
  const updateStreak = useCallback(() => {
    const streakData = localStorage.getItem(`streak_${userId}`);
    const today = new Date().toDateString();
    
    let newStreak = 1;
    if (streakData) {
      const { streak: savedStreak, lastDate } = JSON.parse(streakData);
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastDate === yesterday) {
        newStreak = savedStreak + 1;
      } else if (lastDate === today) {
        newStreak = savedStreak;
      }
    }
    
    localStorage.setItem(`streak_${userId}`, JSON.stringify({
      streak: newStreak,
      lastDate: today
    }));
    setStreak(newStreak);
    return newStreak;
  }, [userId]);

  // Fetch challenges
  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/daily-challenges?language=${language}`);
      const data = await response.json();
      
      if (data.success && data.challenges) {
        setChallenges(data.challenges);
      } else {
        setError(data.error || 'Failed to load challenges');
      }
    } catch (err) {
      setError('Failed to fetch challenges. Please try again.');
      console.error('Challenge fetch error:', err);
    }
    setLoading(false);
  }, [language]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Submit answer
  const submitAnswer = async () => {
    if (!selectedChallenge || selectedAnswer === null) return;

    // Find the correct answer
    const correctOption = selectedChallenge.options.find(opt => opt.isCorrect);
    const selectedOption = selectedChallenge.options[selectedAnswer as number];
    const correct = selectedOption?.isCorrect || false;
    
    setIsCorrect(correct);
    setShowResult(true);

    const newProgress = { ...progress };
    const currentProgress = newProgress[selectedChallenge.id] || { solved: false, attempts: 0, pointsEarned: 0 };
    
    if (!currentProgress.solved) {
      currentProgress.attempts += 1;
      
      if (correct) {
        currentProgress.solved = true;
        currentProgress.pointsEarned = selectedChallenge.points;
        
        const newTodayPoints = todayPoints + selectedChallenge.points;
        setTodayPoints(newTodayPoints);
        
        // Update streak when first challenge of the day is solved
        const newStreak = updateStreak();
        
        // Update leaderboard
        try {
          await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              username,
              points: selectedChallenge.points,
              challengeSolved: true,
              language,
              streak: newStreak
            })
          });
        } catch (err) {
          console.error('Failed to update leaderboard:', err);
        }

        onPointsEarned?.(selectedChallenge.points);
        saveProgress(newProgress, newTodayPoints);
      }
    }
    
    newProgress[selectedChallenge.id] = currentProgress;
    setProgress(newProgress);
  };

  const resetChallenge = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  const nextChallenge = () => {
    const currentIndex = challenges.findIndex(c => c.id === selectedChallenge?.id);
    const nextIndex = (currentIndex + 1) % challenges.length;
    setSelectedChallenge(challenges[nextIndex]);
    resetChallenge();
  };

  const solvedCount = Object.values(progress).filter(p => p.solved).length;
  const allSolved = solvedCount === challenges.length && challenges.length > 0;

  return (
    <div className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Daily Challenges
                <Sparkles className="w-5 h-5 text-purple-400" />
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                3 new {language} challenges every day
              </p>
            </div>
          </div>
          <button
            onClick={fetchChallenges}
            className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-gray-500 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-4 p-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{streak}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{todayPoints}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Today&apos;s Points</div>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-300 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{solvedCount}/{challenges.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading && challenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-10 h-10 text-purple-400 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Generating your challenges...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <XCircle className="w-10 h-10 text-red-400 mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchChallenges}
              className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : allSolved ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-green-500/20 rounded-full mb-4">
              <Trophy className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">All Challenges Complete! 🎉</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You earned {todayPoints} points today. Come back tomorrow for new challenges!
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Clock className="w-4 h-4" />
              New challenges in {getTimeUntilMidnight()}
            </div>
          </div>
        ) : selectedChallenge ? (
          // Challenge Detail View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Challenge Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const Icon = typeIcons[selectedChallenge.type];
                    return <Icon className="w-5 h-5 text-purple-400" />;
                  })()}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {typeLabels[selectedChallenge.type]}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyConfig[selectedChallenge.difficulty].bg} ${difficultyConfig[selectedChallenge.difficulty].color}`}>
                    {selectedChallenge.difficulty.toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4" />
                    {selectedChallenge.points} pts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedChallenge.title}</h3>
              </div>
              <button
                onClick={() => { setSelectedChallenge(null); resetChallenge(); }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300">{selectedChallenge.description}</p>

            {/* Code Block (if any) */}
            {selectedChallenge.code && (
              <div className="relative">
                <pre className="p-4 bg-gray-100 dark:bg-gray-950 rounded-xl overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-300">
                  <code>{selectedChallenge.code}</code>
                </pre>
              </div>
            )}

            {/* Options */}
            {selectedChallenge.options && selectedChallenge.options.length > 0 && (
              <div className="space-y-3">
                {selectedChallenge.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const showCorrect = showResult && option.isCorrect;
                  const showWrong = showResult && isSelected && !option.isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => !showResult && setSelectedAnswer(index)}
                      disabled={showResult || progress[selectedChallenge.id]?.solved}
                      className={`w-full p-4 text-left rounded-xl border transition-all ${
                        showCorrect
                          ? 'bg-green-500/20 border-green-500 text-green-300'
                          : showWrong
                          ? 'bg-red-500/20 border-red-500 text-red-300'
                          : isSelected
                          ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-300'
                          : 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      } ${progress[selectedChallenge.id]?.solved ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          isSelected ? 'bg-purple-500 text-white' :
                          'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {option.id.toUpperCase()}
                        </span>
                        <span>{option.text}</span>
                        {showCorrect && <CheckCircle className="w-5 h-5 ml-auto text-green-400" />}
                        {showWrong && <XCircle className="w-5 h-5 ml-auto text-red-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Result Message */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-green-400">Correct! +{selectedChallenge.points} points</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="font-bold text-red-400">Incorrect. Try again!</span>
                      </>
                    )}
                  </div>
                  {selectedChallenge.explanation && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedChallenge.explanation}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showHint ? 'bg-yellow-500/20 text-yellow-500 dark:text-yellow-400' : 'bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>

              <div className="flex gap-3">
                {showResult && !isCorrect && !progress[selectedChallenge.id]?.solved && (
                  <button
                    onClick={resetChallenge}
                    className="px-4 py-2 bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
                {!showResult && !progress[selectedChallenge.id]?.solved && (
                  <button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4" />
                    Submit Answer
                  </button>
                )}
                {(showResult && isCorrect) || progress[selectedChallenge.id]?.solved ? (
                  <button
                    onClick={nextChallenge}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Challenge
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && selectedChallenge.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-medium">Hint</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedChallenge.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Challenge List View
          <div className="space-y-4">
            {challenges.map((challenge, index) => {
              const Icon = typeIcons[challenge.type];
              const solved = progress[challenge.id]?.solved;
              const config = difficultyConfig[challenge.difficulty];

              return (
                <motion.button
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedChallenge(challenge)}
                  className={`w-full p-4 text-left rounded-xl border transition-all ${
                    solved
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${solved ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                      {solved ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <Icon className="w-6 h-6 text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{typeLabels[challenge.type]}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <h4 className={`font-medium ${solved ? 'text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {challenge.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-yellow-400 font-medium">
                        <Star className="w-4 h-4" />
                        {challenge.points}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  return `${hours}h ${minutes}m`;
}
