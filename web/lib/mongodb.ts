import { MongoClient, Db, MongoClientOptions } from 'mongodb';

// MongoDB connection URI from environment variable
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.warn('Warning: MONGODB_URL environment variable is not defined. MongoDB features will be unavailable.');
}

// MongoDB connection options
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

// Global variable to cache the MongoDB client connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB and return the database instance
 * Uses connection pooling for better performance
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URL) {
    throw new Error('MONGODB_URL environment variable is not defined');
  }

  try {
    // Create a new MongoDB client
    const client = new MongoClient(MONGODB_URL, options);
    
    // Connect to MongoDB
    await client.connect();
    
    // Get the database name from the connection string or use default
    const dbName = new URL(MONGODB_URL).pathname.slice(1) || 'coderipper';
    const db = client.db(dbName);
    
    // Cache the connection
    cachedClient = client;
    cachedDb = db;
    
    console.log('✓ Connected to MongoDB');
    
    return { client, db };
  } catch (error) {
    console.error('✗ Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Get the cached database instance (must call connectToDatabase first)
 */
export function getDb(): Db | null {
  return cachedDb;
}

/**
 * Get the cached MongoDB client (must call connectToDatabase first)
 */
export function getClient(): MongoClient | null {
  return cachedClient;
}

/**
 * Close the MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('MongoDB connection closed');
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return cachedClient !== null && cachedDb !== null;
}

/**
 * Get MongoDB URL (for debugging - masks password)
 */
export function getMaskedMongoUrl(): string {
  if (!MONGODB_URL) return 'Not configured';
  try {
    const url = new URL(MONGODB_URL);
    if (url.password) {
      url.password = '****';
    }
    return url.toString();
  } catch {
    return 'Invalid URL format';
  }
}

// Export the MongoDB URL availability check
export const isMongoConfigured = !!MONGODB_URL;
