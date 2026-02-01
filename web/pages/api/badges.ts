import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'runs' | 'points' | 'special' | 'language';
  requirement: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface BadgeResponse {
  success: boolean;
  badges?: Badge[];
  userBadges?: string[];
  awarded?: string[];
  error?: string;
}

// Badge definitions
const BADGES: Badge[] = [
  // Streak badges
  { id: 'streak_3', name: 'Getting Started', description: '3 day streak', icon: '🔥', category: 'streak', requirement: 3, rarity: 'common' },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: '🔥', category: 'streak', requirement: 7, rarity: 'uncommon' },
  { id: 'streak_14', name: 'Fortnight Fighter', description: '14 day streak', icon: '🔥', category: 'streak', requirement: 14, rarity: 'rare' },
  { id: 'streak_30', name: 'Monthly Master', description: '30 day streak', icon: '🔥', category: 'streak', requirement: 30, rarity: 'epic' },
  { id: 'streak_100', name: 'Century Coder', description: '100 day streak', icon: '💯', category: 'streak', requirement: 100, rarity: 'legendary' },
  
  // Runs badges
  { id: 'runs_10', name: 'First Steps', description: 'Run 10 programs', icon: '▶️', category: 'runs', requirement: 10, rarity: 'common' },
  { id: 'runs_50', name: 'Code Runner', description: 'Run 50 programs', icon: '🏃', category: 'runs', requirement: 50, rarity: 'uncommon' },
  { id: 'runs_100', name: 'Execution Expert', description: 'Run 100 programs', icon: '⚡', category: 'runs', requirement: 100, rarity: 'rare' },
  { id: 'runs_500', name: 'Compiler Commander', description: 'Run 500 programs', icon: '🚀', category: 'runs', requirement: 500, rarity: 'epic' },
  { id: 'runs_1000', name: 'Code Legend', description: 'Run 1000 programs', icon: '👑', category: 'runs', requirement: 1000, rarity: 'legendary' },
  
  // Points badges
  { id: 'points_100', name: 'Point Starter', description: 'Earn 100 points', icon: '⭐', category: 'points', requirement: 100, rarity: 'common' },
  { id: 'points_500', name: 'Point Hunter', description: 'Earn 500 points', icon: '🌟', category: 'points', requirement: 500, rarity: 'uncommon' },
  { id: 'points_1000', name: 'Point Master', description: 'Earn 1000 points', icon: '✨', category: 'points', requirement: 1000, rarity: 'rare' },
  { id: 'points_2500', name: 'Point Champion', description: 'Earn 2500 points', icon: '💫', category: 'points', requirement: 2500, rarity: 'epic' },
  { id: 'points_5000', name: 'Point Legend', description: 'Earn 5000 points', icon: '🏆', category: 'points', requirement: 5000, rarity: 'legendary' },
  
  // Language badges
  { id: 'polyglot_3', name: 'Trilingual', description: 'Code in 3 languages', icon: '🌍', category: 'language', requirement: 3, rarity: 'uncommon' },
  { id: 'polyglot_5', name: 'Polyglot', description: 'Code in 5 languages', icon: '🌎', category: 'language', requirement: 5, rarity: 'rare' },
  { id: 'polyglot_10', name: 'Language Master', description: 'Code in 10 languages', icon: '🌏', category: 'language', requirement: 10, rarity: 'legendary' },
  
  // Special badges
  { id: 'first_run', name: 'Hello World', description: 'Run your first program', icon: '👋', category: 'special', requirement: 1, rarity: 'common' },
  { id: 'first_challenge', name: 'Challenger', description: 'Complete first challenge', icon: '🎯', category: 'special', requirement: 1, rarity: 'common' },
  { id: 'speed_50', name: 'Speed Demon', description: 'Execute in under 50ms', icon: '⚡', category: 'special', requirement: 50, rarity: 'rare' },
  { id: 'night_owl', name: 'Night Owl', description: 'Code after midnight', icon: '🦉', category: 'special', requirement: 1, rarity: 'uncommon' },
  { id: 'early_bird', name: 'Early Bird', description: 'Code before 6am', icon: '🐦', category: 'special', requirement: 1, rarity: 'uncommon' },
];

// In-memory user badges storage
const userBadgesMap: Map<string, Set<string>> = new Map();

const COLLECTION_USER_BADGES = 'user_badges';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BadgeResponse>
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get all badges or user's badges
    const { userId } = req.query;

    if (!userId) {
      // Return all badge definitions
      return res.status(200).json({ success: true, badges: BADGES });
    }

    // Get user's earned badges
    let userBadges: string[] = [];

    if (isMongoConfigured) {
      try {
        const { db } = await connectToDatabase();
        const doc = await db.collection(COLLECTION_USER_BADGES).findOne({ userId });
        userBadges = doc?.badges || [];
      } catch (error) {
        console.error('MongoDB get badges error:', error);
      }
    } else {
      userBadges = Array.from(userBadgesMap.get(userId as string) || []);
    }

    return res.status(200).json({
      success: true,
      badges: BADGES,
      userBadges,
    });
  }

  if (req.method === 'POST') {
    // Trigger badge check
    const { userId, event, meta = {} } = req.body;

    if (!userId || !event) {
      return res.status(400).json({ success: false, error: 'userId and event required' });
    }

    const awarded: string[] = [];

    // Get current user badges
    let currentBadges: Set<string>;
    
    if (isMongoConfigured) {
      try {
        const { db } = await connectToDatabase();
        const doc = await db.collection(COLLECTION_USER_BADGES).findOne({ userId });
        currentBadges = new Set(doc?.badges || []);
      } catch (error) {
        console.error('MongoDB get badges error:', error);
        currentBadges = userBadgesMap.get(userId) || new Set();
      }
    } else {
      currentBadges = userBadgesMap.get(userId) || new Set();
    }

    // Check badge conditions based on event
    switch (event) {
      case 'run_success':
        if (!currentBadges.has('first_run')) {
          awarded.push('first_run');
          currentBadges.add('first_run');
        }
        
        // Check runs count
        const runsCount = meta.totalRuns || 0;
        if (runsCount >= 10 && !currentBadges.has('runs_10')) { awarded.push('runs_10'); currentBadges.add('runs_10'); }
        if (runsCount >= 50 && !currentBadges.has('runs_50')) { awarded.push('runs_50'); currentBadges.add('runs_50'); }
        if (runsCount >= 100 && !currentBadges.has('runs_100')) { awarded.push('runs_100'); currentBadges.add('runs_100'); }
        if (runsCount >= 500 && !currentBadges.has('runs_500')) { awarded.push('runs_500'); currentBadges.add('runs_500'); }
        if (runsCount >= 1000 && !currentBadges.has('runs_1000')) { awarded.push('runs_1000'); currentBadges.add('runs_1000'); }

        // Check execution time
        if (meta.executionTime && meta.executionTime < 50 && !currentBadges.has('speed_50')) {
          awarded.push('speed_50');
          currentBadges.add('speed_50');
        }

        // Check time of day
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5 && !currentBadges.has('night_owl')) {
          awarded.push('night_owl');
          currentBadges.add('night_owl');
        }
        if (hour >= 4 && hour < 6 && !currentBadges.has('early_bird')) {
          awarded.push('early_bird');
          currentBadges.add('early_bird');
        }
        break;

      case 'challenge_complete':
        if (!currentBadges.has('first_challenge')) {
          awarded.push('first_challenge');
          currentBadges.add('first_challenge');
        }
        break;

      case 'streak_update':
        const streak = meta.streak || 0;
        if (streak >= 3 && !currentBadges.has('streak_3')) { awarded.push('streak_3'); currentBadges.add('streak_3'); }
        if (streak >= 7 && !currentBadges.has('streak_7')) { awarded.push('streak_7'); currentBadges.add('streak_7'); }
        if (streak >= 14 && !currentBadges.has('streak_14')) { awarded.push('streak_14'); currentBadges.add('streak_14'); }
        if (streak >= 30 && !currentBadges.has('streak_30')) { awarded.push('streak_30'); currentBadges.add('streak_30'); }
        if (streak >= 100 && !currentBadges.has('streak_100')) { awarded.push('streak_100'); currentBadges.add('streak_100'); }
        break;

      case 'points_update':
        const points = meta.points || 0;
        if (points >= 100 && !currentBadges.has('points_100')) { awarded.push('points_100'); currentBadges.add('points_100'); }
        if (points >= 500 && !currentBadges.has('points_500')) { awarded.push('points_500'); currentBadges.add('points_500'); }
        if (points >= 1000 && !currentBadges.has('points_1000')) { awarded.push('points_1000'); currentBadges.add('points_1000'); }
        if (points >= 2500 && !currentBadges.has('points_2500')) { awarded.push('points_2500'); currentBadges.add('points_2500'); }
        if (points >= 5000 && !currentBadges.has('points_5000')) { awarded.push('points_5000'); currentBadges.add('points_5000'); }
        break;

      case 'language_use':
        const languagesUsed = meta.languagesCount || 0;
        if (languagesUsed >= 3 && !currentBadges.has('polyglot_3')) { awarded.push('polyglot_3'); currentBadges.add('polyglot_3'); }
        if (languagesUsed >= 5 && !currentBadges.has('polyglot_5')) { awarded.push('polyglot_5'); currentBadges.add('polyglot_5'); }
        if (languagesUsed >= 10 && !currentBadges.has('polyglot_10')) { awarded.push('polyglot_10'); currentBadges.add('polyglot_10'); }
        break;
    }

    // Save updated badges
    if (awarded.length > 0) {
      if (isMongoConfigured) {
        try {
          const { db } = await connectToDatabase();
          await db.collection(COLLECTION_USER_BADGES).updateOne(
            { userId },
            { $set: { badges: Array.from(currentBadges), updatedAt: new Date().toISOString() } },
            { upsert: true }
          );
        } catch (error) {
          console.error('MongoDB save badges error:', error);
        }
      }
      userBadgesMap.set(userId, currentBadges);
    }

    return res.status(200).json({
      success: true,
      awarded,
      userBadges: Array.from(currentBadges),
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
