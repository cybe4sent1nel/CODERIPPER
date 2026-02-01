import type { NextApiRequest, NextApiResponse } from 'next'
import { executeAIRequest, getAvailableModels, type AIRequestOptions, type AIResponse } from '@/lib/ai-service'

interface RequestBody {
  action: 'explain' | 'optimize' | 'comment' | 'debug' | 'convert' | 'generate' | 'review' | 'models'
  code?: string
  language?: string
  output?: string
  targetLanguage?: string
  customPrompt?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIResponse | { models: any; configured: boolean }>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return available models info
    const modelsInfo = getAvailableModels();
    return res.status(200).json(modelsInfo);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { action, code, language, output, targetLanguage, customPrompt }: RequestBody = req.body

    // Handle models info request
    if (action === 'models') {
      const modelsInfo = getAvailableModels();
      return res.status(200).json(modelsInfo);
    }

    // Validate required fields
    if (!action) {
      return res.status(400).json({ success: false, error: 'Missing action field' })
    }

    if (!code || !language) {
      return res.status(400).json({ success: false, error: 'Missing required fields: code and language' })
    }

    // Validate action type
    const validActions = ['explain', 'optimize', 'comment', 'debug', 'convert', 'generate', 'review'];
    if (!validActions.includes(action)) {
      return res.status(400).json({ success: false, error: `Invalid action. Must be one of: ${validActions.join(', ')}` })
    }

    // Execute AI request with fallback support
    const options: AIRequestOptions = {
      action: action as AIRequestOptions['action'],
      code,
      language,
      output,
      targetLanguage,
      customPrompt
    };

    const result = await executeAIRequest(options);

    // Log for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AI API] Action: ${action}, Model: ${result.model}, Success: ${result.success}, Time: ${result.executionTime}ms`);
    }

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }

  } catch (error: any) {
    console.error('AI API Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'AI service temporarily unavailable. Please try again later.',
      attempts: 0,
      executionTime: 0
    })
  }
}