import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import crypto from 'crypto';

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// In-memory storage fallback
const inMemoryUsers: Map<string, {
  id: string;
  email: string;
  name: string;
  username: string;
  password: string;
  salt: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
}> = new Map();

const inMemorySessions: Map<string, { userId: string; expiresAt: Date }> = new Map();

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    username: string;
    avatar?: string;
    isPremium: boolean;
  };
  token?: string;
  error?: string;
}

const COLLECTION_USERS = 'users';
const COLLECTION_SESSIONS = 'sessions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  const { action } = req.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (action) {
      case 'signup':
        return await handleSignup(req, res);
      case 'login':
        return await handleLogin(req, res);
      case 'logout':
        return await handleLogout(req, res);
      case 'me':
        return await handleMe(req, res);
      case 'verify':
        return await handleVerify(req, res);
      default:
        return res.status(400).json({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function handleSignup(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password, name, username } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
  }

  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);
  const userId = crypto.randomUUID();
  const finalUsername = username || name.toLowerCase().replace(/\s+/g, '');
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalUsername}`;

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection(COLLECTION_USERS);

      // Check if user exists
      const existingUser = await usersCollection.findOne({ 
        $or: [{ email }, { username: finalUsername }] 
      });
      
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }

      // Create user
      await usersCollection.insertOne({
        id: userId,
        email,
        name,
        username: finalUsername,
        password: hashedPassword,
        salt,
        avatar,
        isPremium: false,
        createdAt: new Date().toISOString(),
      });

      // Create session
      const token = generateToken();
      const sessionsCollection = db.collection(COLLECTION_SESSIONS);
      await sessionsCollection.insertOne({
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      return res.status(201).json({
        success: true,
        user: { id: userId, email, name, username: finalUsername, avatar, isPremium: false },
        token,
      });
    } catch (error) {
      console.error('MongoDB signup error:', error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  if (Array.from(inMemoryUsers.values()).some(u => u.email === email || u.username === finalUsername)) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  inMemoryUsers.set(userId, {
    id: userId,
    email,
    name,
    username: finalUsername,
    password: hashedPassword,
    salt,
    avatar,
    isPremium: false,
    createdAt: new Date().toISOString(),
  });

  const token = generateToken();
  inMemorySessions.set(token, { userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

  return res.status(201).json({
    success: true,
    user: { id: userId, email, name, username: finalUsername, avatar, isPremium: false },
    token,
  });
}

async function handleLogin(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection(COLLECTION_USERS);
      const user = await usersCollection.findOne({ email });

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const hashedPassword = hashPassword(password, user.salt);
      if (hashedPassword !== user.password) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Create session
      const token = generateToken();
      const sessionsCollection = db.collection(COLLECTION_SESSIONS);
      await sessionsCollection.insertOne({
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          isPremium: user.isPremium,
        },
        token,
      });
    } catch (error) {
      console.error('MongoDB login error:', error);
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const user = Array.from(inMemoryUsers.values()).find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const hashedPassword = hashPassword(password, user.salt);
  if (hashedPassword !== user.password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = generateToken();
  inMemorySessions.set(token, { userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      isPremium: user.isPremium,
    },
    token,
  });
}

async function handleLogout(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    if (isMongoConfigured) {
      try {
        const { db } = await connectToDatabase();
        await db.collection(COLLECTION_SESSIONS).deleteOne({ token });
      } catch (error) {
        console.error('MongoDB logout error:', error);
      }
    }
    inMemorySessions.delete(token);
  }

  return res.status(200).json({ success: true });
}

async function handleMe(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const session = await db.collection(COLLECTION_SESSIONS).findOne({ token });
      
      if (!session || new Date(session.expiresAt) < new Date()) {
        return res.status(401).json({ success: false, error: 'Session expired' });
      }

      const user = await db.collection(COLLECTION_USERS).findOne({ id: session.userId });
      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          isPremium: user.isPremium,
        },
      });
    } catch (error) {
      console.error('MongoDB me error:', error);
    }
  }

  // In-memory fallback
  const session = inMemorySessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ success: false, error: 'Session expired' });
  }

  const user = inMemoryUsers.get(session.userId);
  if (!user) {
    return res.status(401).json({ success: false, error: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      isPremium: user.isPremium,
    },
  });
}

async function handleVerify(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.body?.token;
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const session = await db.collection(COLLECTION_SESSIONS).findOne({ token });
      
      if (!session || new Date(session.expiresAt) < new Date()) {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('MongoDB verify error:', error);
    }
  }

  // In-memory fallback
  const session = inMemorySessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  return res.status(200).json({ success: true });
}
