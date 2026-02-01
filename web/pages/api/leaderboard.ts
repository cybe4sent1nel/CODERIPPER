import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';

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

interface LeaderboardResponse {
  success: boolean;
  leaderboard?: LeaderboardEntry[];
  userRank?: LeaderboardEntry;
  totalUsers?: number;
  error?: string;
}

// In-memory fallback storage (used when MongoDB is not configured)
let leaderboardData: Map<string, Omit<LeaderboardEntry, 'rank'>> = new Map();

// Demo data for fallback
const demoUsers = [
  { id: 'user1', username: 'CodeNinja', streak: 45, totalPoints: 2850, challengesSolved: 142, badges: ['streak_30', 'runs_100', 'polyglot_5'], favoriteLanguage: 'python' },
  { id: 'user2', username: 'ByteMaster', streak: 32, totalPoints: 2340, challengesSolved: 118, badges: ['streak_30', 'runs_50'], favoriteLanguage: 'javascript' },
  { id: 'user3', username: 'AlgoQueen', streak: 28, totalPoints: 2120, challengesSolved: 105, badges: ['streak_14', 'speed_50'], favoriteLanguage: 'java' },
  { id: 'user4', username: 'DebugKing', streak: 21, totalPoints: 1890, challengesSolved: 94, badges: ['streak_14', 'runs_50'], favoriteLanguage: 'typescript' },
  { id: 'user5', username: 'ScriptWizard', streak: 18, totalPoints: 1650, challengesSolved: 82, badges: ['streak_14'], favoriteLanguage: 'python' },
  { id: 'user6', username: 'LoopLord', streak: 15, totalPoints: 1420, challengesSolved: 71, badges: ['streak_7'], favoriteLanguage: 'cpp' },
  { id: 'user7', username: 'FuncFanatic', streak: 12, totalPoints: 1180, challengesSolved: 59, badges: ['streak_7'], favoriteLanguage: 'rust' },
  { id: 'user8', username: 'DataDruid', streak: 10, totalPoints: 950, challengesSolved: 47, badges: ['streak_7'], favoriteLanguage: 'python' },
  { id: 'user9', username: 'SyntaxSage', streak: 8, totalPoints: 720, challengesSolved: 36, badges: ['streak_3'], favoriteLanguage: 'go' },
  { id: 'user10', username: 'BinaryBoss', streak: 5, totalPoints: 480, challengesSolved: 24, badges: ['streak_3'], favoriteLanguage: 'javascript' },
];

// Initialize in-memory fallback with demo data
function initializeDemoData() {
  if (leaderboardData.size === 0) {
    demoUsers.forEach(user => {
      leaderboardData.set(user.id, {
        ...user,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
    });
  }
}

// MongoDB collection name
const COLLECTION_NAME = 'leaderboard';

// Seed initial data to MongoDB if empty
async function seedMongoData(collection: any) {
  const count = await collection.countDocuments();
  if (count === 0) {
    const seedData = demoUsers.map(user => ({
      ...user,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      lastActive: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
    await collection.insertMany(seedData);
    console.log('✓ Seeded MongoDB with demo leaderboard data');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse>
) {
  // Try to use MongoDB if configured, otherwise fall back to in-memory
  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(COLLECTION_NAME);
      
      // Seed data if collection is empty
      await seedMongoData(collection);

      if (req.method === 'GET') {
        const { userId, limit = '50', sortBy = 'totalPoints' } = req.query;

        // Build sort object
        const sortField = sortBy === 'streak' ? 'streak' : sortBy === 'challengesSolved' ? 'challengesSolved' : 'totalPoints';
        const sortObj: Record<string, 1 | -1> = { [sortField]: -1 };

        // Get sorted leaderboard from MongoDB
        const entries = await collection
          .find({})
          .sort(sortObj)
          .limit(parseInt(limit as string))
          .toArray();

        // Add ranks
        const rankedEntries: LeaderboardEntry[] = entries.map((entry, idx) => ({
          id: entry.id,
          username: entry.username,
          avatar: entry.avatar,
          streak: entry.streak,
          totalPoints: entry.totalPoints,
          challengesSolved: entry.challengesSolved,
          badges: entry.badges,
          lastActive: entry.lastActive,
          favoriteLanguage: entry.favoriteLanguage,
          rank: idx + 1
        }));

        // Find user's rank if userId provided
        let userRank: LeaderboardEntry | undefined;
        if (userId) {
          const allEntries = await collection.find({}).sort(sortObj).toArray();
          const userIndex = allEntries.findIndex(e => e.id === userId);
          if (userIndex !== -1) {
            const user = allEntries[userIndex];
            userRank = {
              id: user.id,
              username: user.username,
              avatar: user.avatar,
              streak: user.streak,
              totalPoints: user.totalPoints,
              challengesSolved: user.challengesSolved,
              badges: user.badges,
              lastActive: user.lastActive,
              favoriteLanguage: user.favoriteLanguage,
              rank: userIndex + 1
            };
          }
        }

        const totalUsers = await collection.countDocuments();

        return res.status(200).json({
          success: true,
          leaderboard: rankedEntries,
          userRank,
          totalUsers
        });
      }

      if (req.method === 'POST') {
        const { userId, username, points, challengeSolved, language, streak } = req.body;

        if (!userId || !username) {
          return res.status(400).json({ success: false, error: 'userId and username required' });
        }

        const existing = await collection.findOne({ id: userId });
        
        const updatedEntry = {
          id: userId,
          username: username,
          avatar: existing?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          streak: streak ?? (existing?.streak || 0),
          totalPoints: (existing?.totalPoints || 0) + (points || 0),
          challengesSolved: (existing?.challengesSolved || 0) + (challengeSolved ? 1 : 0),
          badges: existing?.badges || [],
          lastActive: new Date().toISOString(),
          favoriteLanguage: language || existing?.favoriteLanguage || 'javascript'
        };

        // Update badges based on achievements
        const badges = new Set(updatedEntry.badges);
        if (updatedEntry.streak >= 3) badges.add('streak_3');
        if (updatedEntry.streak >= 7) badges.add('streak_7');
        if (updatedEntry.streak >= 14) badges.add('streak_14');
        if (updatedEntry.streak >= 30) badges.add('streak_30');
        if (updatedEntry.challengesSolved >= 10) badges.add('runs_10');
        if (updatedEntry.challengesSolved >= 50) badges.add('runs_50');
        if (updatedEntry.challengesSolved >= 100) badges.add('runs_100');
        if (updatedEntry.totalPoints >= 500) badges.add('points_500');
        if (updatedEntry.totalPoints >= 1000) badges.add('points_1000');
        if (updatedEntry.totalPoints >= 2500) badges.add('points_2500');
        updatedEntry.badges = Array.from(badges);

        // Upsert to MongoDB
        await collection.updateOne(
          { id: userId },
          { $set: updatedEntry },
          { upsert: true }
        );

        // Calculate new rank
        const allEntries = await collection.find({}).sort({ totalPoints: -1 }).toArray();
        const rank = allEntries.findIndex(e => e.id === userId) + 1;

        return res.status(200).json({
          success: true,
          userRank: { ...updatedEntry, rank }
        });
      }

      return res.status(405).json({ success: false, error: 'Method not allowed' });
    } catch (error) {
      console.error('MongoDB error, falling back to in-memory:', error);
      // Fall through to in-memory storage
    }
  }

  // Fallback to in-memory storage
  initializeDemoData();

  if (req.method === 'GET') {
    // Get leaderboard
    const { userId, limit = '50', sortBy = 'totalPoints' } = req.query;

    const entries = Array.from(leaderboardData.values());
    
    // Sort by specified field
    entries.sort((a, b) => {
      if (sortBy === 'streak') return b.streak - a.streak;
      if (sortBy === 'challengesSolved') return b.challengesSolved - a.challengesSolved;
      return b.totalPoints - a.totalPoints;
    });

    // Add ranks
    const rankedEntries: LeaderboardEntry[] = entries.slice(0, parseInt(limit as string)).map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));

    // Find user's rank if userId provided
    let userRank: LeaderboardEntry | undefined;
    if (userId) {
      const userIndex = entries.findIndex(e => e.id === userId);
      if (userIndex !== -1) {
        userRank = {
          ...entries[userIndex],
          rank: userIndex + 1
        };
      }
    }

    return res.status(200).json({
      success: true,
      leaderboard: rankedEntries,
      userRank,
      totalUsers: entries.length
    });
  }

  if (req.method === 'POST') {
    // Update user score
    const { userId, username, points, challengeSolved, language, streak } = req.body;

    if (!userId || !username) {
      return res.status(400).json({ success: false, error: 'userId and username required' });
    }

    const existing = leaderboardData.get(userId);
    
    const updatedEntry: Omit<LeaderboardEntry, 'rank'> = {
      id: userId,
      username: username,
      avatar: existing?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      streak: streak ?? (existing?.streak || 0),
      totalPoints: (existing?.totalPoints || 0) + (points || 0),
      challengesSolved: (existing?.challengesSolved || 0) + (challengeSolved ? 1 : 0),
      badges: existing?.badges || [],
      lastActive: new Date().toISOString(),
      favoriteLanguage: language || existing?.favoriteLanguage || 'javascript'
    };

    // Update badges based on achievements
    const badges = new Set(updatedEntry.badges);
    if (updatedEntry.streak >= 3) badges.add('streak_3');
    if (updatedEntry.streak >= 7) badges.add('streak_7');
    if (updatedEntry.streak >= 14) badges.add('streak_14');
    if (updatedEntry.streak >= 30) badges.add('streak_30');
    if (updatedEntry.challengesSolved >= 10) badges.add('runs_10');
    if (updatedEntry.challengesSolved >= 50) badges.add('runs_50');
    if (updatedEntry.challengesSolved >= 100) badges.add('runs_100');
    if (updatedEntry.totalPoints >= 500) badges.add('points_500');
    if (updatedEntry.totalPoints >= 1000) badges.add('points_1000');
    if (updatedEntry.totalPoints >= 2500) badges.add('points_2500');
    updatedEntry.badges = Array.from(badges);

    leaderboardData.set(userId, updatedEntry);

    // Calculate new rank
    const entries = Array.from(leaderboardData.values());
    entries.sort((a, b) => b.totalPoints - a.totalPoints);
    const rank = entries.findIndex(e => e.id === userId) + 1;

    return res.status(200).json({
      success: true,
      userRank: { ...updatedEntry, rank }
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
