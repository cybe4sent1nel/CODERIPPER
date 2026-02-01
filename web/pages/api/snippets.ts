import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';
import crypto from 'crypto';

interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  authorId: string;
  authorName: string;
  isPublic: boolean;
  tags: string[];
  likes: number;
  forks: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface SnippetResponse {
  success: boolean;
  snippet?: Snippet;
  snippets?: Snippet[];
  total?: number;
  error?: string;
}

// In-memory storage
const snippetsMap: Map<string, Snippet> = new Map();

const COLLECTION_SNIPPETS = 'snippets';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SnippetResponse>
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        if (id) {
          return await getSnippet(id as string, res);
        }
        return await listSnippets(req, res);
      case 'POST':
        return await createSnippet(req, res);
      case 'PUT':
        if (!id) return res.status(400).json({ success: false, error: 'Snippet ID required' });
        return await updateSnippet(id as string, req, res);
      case 'DELETE':
        if (!id) return res.status(400).json({ success: false, error: 'Snippet ID required' });
        return await deleteSnippet(id as string, req, res);
      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Snippets API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

async function getSnippet(id: string, res: NextApiResponse<SnippetResponse>) {
  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const snippet = await db.collection(COLLECTION_SNIPPETS).findOne({ id });
      
      if (snippet) {
        // Increment views
        await db.collection(COLLECTION_SNIPPETS).updateOne({ id }, { $inc: { views: 1 } });
        return res.status(200).json({ success: true, snippet: snippet as unknown as Snippet });
      }
    } catch (error) {
      console.error('MongoDB get snippet error:', error);
    }
  }

  const snippet = snippetsMap.get(id);
  if (!snippet) {
    return res.status(404).json({ success: false, error: 'Snippet not found' });
  }

  snippet.views++;
  return res.status(200).json({ success: true, snippet });
}

async function listSnippets(req: NextApiRequest, res: NextApiResponse<SnippetResponse>) {
  const { 
    authorId, 
    language, 
    tag, 
    search,
    isPublic = 'true',
    sortBy = 'createdAt',
    order = 'desc',
    limit = '20',
    offset = '0'
  } = req.query;

  const limitNum = Math.min(parseInt(limit as string) || 20, 100);
  const offsetNum = parseInt(offset as string) || 0;

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(COLLECTION_SNIPPETS);

      // Build query
      const query: Record<string, any> = {};
      if (isPublic === 'true') query.isPublic = true;
      if (authorId) query.authorId = authorId;
      if (language) query.language = language;
      if (tag) query.tags = { $in: [tag] };
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Build sort
      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sortBy as string] = order === 'asc' ? 1 : -1;

      const [snippets, total] = await Promise.all([
        collection.find(query).sort(sortObj).skip(offsetNum).limit(limitNum).toArray(),
        collection.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        snippets: snippets as unknown as Snippet[],
        total,
      });
    } catch (error) {
      console.error('MongoDB list snippets error:', error);
    }
  }

  // In-memory fallback
  let snippets = Array.from(snippetsMap.values());

  // Filter
  if (isPublic === 'true') snippets = snippets.filter(s => s.isPublic);
  if (authorId) snippets = snippets.filter(s => s.authorId === authorId);
  if (language) snippets = snippets.filter(s => s.language === language);
  if (tag) snippets = snippets.filter(s => s.tags.includes(tag as string));
  if (search) {
    const searchLower = (search as string).toLowerCase();
    snippets = snippets.filter(s => 
      s.title.toLowerCase().includes(searchLower) ||
      (s.description?.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  snippets.sort((a, b) => {
    const aVal = a[sortBy as keyof Snippet] as any;
    const bVal = b[sortBy as keyof Snippet] as any;
    return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const total = snippets.length;
  snippets = snippets.slice(offsetNum, offsetNum + limitNum);

  return res.status(200).json({ success: true, snippets, total });
}

async function createSnippet(req: NextApiRequest, res: NextApiResponse<SnippetResponse>) {
  const { title, description, code, language, authorId, authorName, isPublic = false, tags = [] } = req.body;

  if (!title || !code || !language || !authorId) {
    return res.status(400).json({ success: false, error: 'Title, code, language, and authorId required' });
  }

  const snippet: Snippet = {
    id: crypto.randomUUID(),
    title,
    description,
    code,
    language,
    authorId,
    authorName: authorName || 'Anonymous',
    isPublic: Boolean(isPublic),
    tags: Array.isArray(tags) ? tags : [],
    likes: 0,
    forks: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      await db.collection(COLLECTION_SNIPPETS).insertOne(snippet);
      return res.status(201).json({ success: true, snippet });
    } catch (error) {
      console.error('MongoDB create snippet error:', error);
    }
  }

  snippetsMap.set(snippet.id, snippet);
  return res.status(201).json({ success: true, snippet });
}

async function updateSnippet(id: string, req: NextApiRequest, res: NextApiResponse<SnippetResponse>) {
  const { title, description, code, language, isPublic, tags } = req.body;
  const updates: Partial<Snippet> = { updatedAt: new Date().toISOString() };

  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (code !== undefined) updates.code = code;
  if (language !== undefined) updates.language = language;
  if (isPublic !== undefined) updates.isPublic = Boolean(isPublic);
  if (tags !== undefined) updates.tags = tags;

  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTION_SNIPPETS).findOneAndUpdate(
        { id },
        { $set: updates },
        { returnDocument: 'after' }
      );
      
      if (result) {
        return res.status(200).json({ success: true, snippet: result as unknown as Snippet });
      }
    } catch (error) {
      console.error('MongoDB update snippet error:', error);
    }
  }

  const snippet = snippetsMap.get(id);
  if (!snippet) {
    return res.status(404).json({ success: false, error: 'Snippet not found' });
  }

  Object.assign(snippet, updates);
  return res.status(200).json({ success: true, snippet });
}

async function deleteSnippet(id: string, req: NextApiRequest, res: NextApiResponse<SnippetResponse>) {
  if (isMongoConfigured) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection(COLLECTION_SNIPPETS).deleteOne({ id });
      
      if (result.deletedCount > 0) {
        return res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error('MongoDB delete snippet error:', error);
    }
  }

  if (!snippetsMap.has(id)) {
    return res.status(404).json({ success: false, error: 'Snippet not found' });
  }

  snippetsMap.delete(id);
  return res.status(200).json({ success: true });
}
