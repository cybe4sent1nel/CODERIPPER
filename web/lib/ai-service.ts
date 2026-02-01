/**
 * CodeRipper AI Service - Multi-Model with Fallback Support
 * 
 * This service handles AI requests with automatic fallback between 4 configured models.
 * Models are configured via environment variables:
 * - AI_MODEL_PRIMARY: Primary model (tried first)
 * - AI_MODEL_FALLBACK_1: First fallback
 * - AI_MODEL_FALLBACK_2: Second fallback
 * - AI_MODEL_FALLBACK_3: Third fallback (last resort)
 */

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  priority: number;
}

export interface AIRequestOptions {
  action: 'explain' | 'optimize' | 'comment' | 'debug' | 'convert' | 'generate' | 'review';
  code: string;
  language: string;
  output?: string;
  targetLanguage?: string;
  customPrompt?: string;
}

export interface AIResponse {
  success: boolean;
  response?: string;
  model?: string;
  error?: string;
  fallbackUsed?: boolean;
  attempts?: number;
  executionTime?: number;
}

interface ModelAttempt {
  model: string;
  success: boolean;
  error?: string;
  responseTime?: number;
}

// Get configured AI models from environment
export function getConfiguredModels(): AIModel[] {
  const models: AIModel[] = [];
  
  const primary = process.env.AI_MODEL_PRIMARY || 'openai/gpt-4o-mini';
  const fallback1 = process.env.AI_MODEL_FALLBACK_1 || 'anthropic/claude-3-haiku';
  const fallback2 = process.env.AI_MODEL_FALLBACK_2 || 'google/gemini-pro';
  const fallback3 = process.env.AI_MODEL_FALLBACK_3 || 'meta-llama/llama-3-8b-instruct';

  models.push({ id: primary, name: getModelDisplayName(primary), provider: getProvider(primary), priority: 1 });
  models.push({ id: fallback1, name: getModelDisplayName(fallback1), provider: getProvider(fallback1), priority: 2 });
  models.push({ id: fallback2, name: getModelDisplayName(fallback2), provider: getProvider(fallback2), priority: 3 });
  models.push({ id: fallback3, name: getModelDisplayName(fallback3), provider: getProvider(fallback3), priority: 4 });

  return models;
}

function getProvider(modelId: string): string {
  const parts = modelId.split('/');
  return parts[0] || 'unknown';
}

function getModelDisplayName(modelId: string): string {
  const parts = modelId.split('/');
  return parts[1] || modelId;
}

// Build prompt based on action type
export function buildPrompt(options: AIRequestOptions): { system: string; user: string } {
  const { action, code, language, output, targetLanguage, customPrompt } = options;

  const systemPrompts: Record<string, string> = {
    explain: `You are an expert ${language} developer and educator. Provide clear, comprehensive explanations that help developers understand code deeply. Use markdown formatting for better readability. Include:
- High-level overview
- Step-by-step breakdown
- Key concepts explained
- Potential improvements or considerations`,

    optimize: `You are a senior ${language} performance engineer. Analyze code for optimization opportunities and provide improved versions. Focus on:
- Performance improvements
- Memory efficiency
- Code readability
- Best practices
- Modern language features
Always provide the optimized code in a code block.`,

    comment: `You are a ${language} documentation specialist. Add comprehensive inline comments and documentation to code. Include:
- Function/method documentation with parameters and return values
- Complex logic explanations
- Algorithm descriptions
- Edge case notes
Return the fully commented code in a code block.`,

    debug: `You are a ${language} debugging expert. Analyze code and error output to identify and fix issues. Provide:
- Root cause analysis
- Step-by-step debugging approach
- Fixed code with explanations
- Prevention tips for similar issues`,

    convert: `You are a polyglot programmer expert in ${language} and ${targetLanguage || 'multiple languages'}. Convert code between languages while:
- Maintaining functionality
- Using idiomatic patterns for target language
- Handling language-specific differences
- Adding comments for non-obvious conversions`,

    generate: `You are an expert ${language} developer. Generate high-quality, production-ready code based on requirements. Include:
- Clean, well-structured code
- Error handling
- Comments for complex sections
- Example usage where appropriate`,

    review: `You are a senior ${language} code reviewer. Provide thorough code review feedback including:
- Code quality assessment
- Security considerations
- Performance implications
- Maintainability suggestions
- Specific improvement recommendations with examples`
  };

  const userPrompts: Record<string, string> = {
    explain: output 
      ? `Explain this ${language} code and the error/output it produced:\n\n**Code:**\n\`\`\`${language}\n${code}\n\`\`\`\n\n**Output/Error:**\n\`\`\`\n${output}\n\`\`\``
      : `Explain this ${language} code in detail:\n\n\`\`\`${language}\n${code}\n\`\`\``,

    optimize: `Optimize this ${language} code for better performance and readability:\n\n\`\`\`${language}\n${code}\n\`\`\``,

    comment: `Add comprehensive comments to this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,

    debug: `Debug this ${language} code:\n\n**Code:**\n\`\`\`${language}\n${code}\n\`\`\`\n\n**Error/Output:**\n\`\`\`\n${output || 'No output provided'}\n\`\`\``,

    convert: `Convert this ${language} code to ${targetLanguage || 'the requested language'}:\n\n\`\`\`${language}\n${code}\n\`\`\``,

    generate: customPrompt || `Generate ${language} code based on the following:\n\n${code}`,

    review: `Review this ${language} code and provide detailed feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``
  };

  return {
    system: systemPrompts[action] || systemPrompts.explain,
    user: userPrompts[action] || userPrompts.explain
  };
}

// Make API call to OpenRouter
async function callOpenRouter(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  const timeout = parseInt(process.env.AI_TIMEOUT_MS || '30000');
  const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '2000');
  const temperature = parseFloat(process.env.AI_TEMPERATURE || '0.7');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://coderipper.vercel.app',
        'X-Title': 'CodeRipper AI Editor'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
      return { success: false, error: errorMessage };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return { success: false, error: 'Empty response from model' };
    }

    return { success: true, response: aiResponse };
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      return { success: false, error: 'Request timeout' };
    }
    
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// Main AI service function with fallback support
export async function executeAIRequest(options: AIRequestOptions): Promise<AIResponse> {
  const startTime = Date.now();
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  // If no API key, return mock response
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return getMockResponse(options);
  }

  const models = getConfiguredModels();
  const { system, user } = buildPrompt(options);
  const attempts: ModelAttempt[] = [];
  const maxRetries = parseInt(process.env.AI_MAX_RETRIES || '3');

  // Try each model in order until one succeeds
  for (const model of models) {
    const attemptStart = Date.now();
    
    // Retry logic for each model
    let lastError = '';
    for (let retry = 0; retry < maxRetries; retry++) {
      const result = await callOpenRouter(model.id, system, user, apiKey);
      
      if (result.success && result.response) {
        const executionTime = Date.now() - startTime;
        return {
          success: true,
          response: result.response,
          model: model.id,
          fallbackUsed: model.priority > 1,
          attempts: attempts.length + 1,
          executionTime
        };
      }
      
      lastError = result.error || 'Unknown error';
      
      // Don't retry for certain errors
      if (lastError.includes('Invalid API key') || 
          lastError.includes('quota') ||
          lastError.includes('rate limit')) {
        break;
      }
      
      // Brief pause before retry
      if (retry < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * (retry + 1)));
      }
    }

    attempts.push({
      model: model.id,
      success: false,
      error: lastError,
      responseTime: Date.now() - attemptStart
    });

    console.log(`[AI Service] Model ${model.id} failed: ${lastError}, trying next...`);
  }

  // All models failed
  const executionTime = Date.now() - startTime;
  return {
    success: false,
    error: `All AI models failed. Last error: ${attempts[attempts.length - 1]?.error}`,
    attempts: attempts.length,
    executionTime
  };
}

// Mock response when no API key is configured
function getMockResponse(options: AIRequestOptions): AIResponse {
  const { action, language } = options;

  const mockResponses: Record<string, string> = {
    explain: `## Code Explanation for ${language}

This code demonstrates core ${language} functionality and patterns.

### Overview
The code you've provided showcases:
- Basic ${language} syntax and structure
- Common programming patterns
- Standard library usage

### Key Components
1. **Main Logic**: The primary function/entry point
2. **Data Structures**: Variables and data handling
3. **Control Flow**: Conditionals and loops

---
🤖 **This is a demo response.** To get real AI analysis:
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Get your API key
3. Add it to your \`.env.local\` as \`OPENROUTER_API_KEY\``,

    optimize: `## Optimization Suggestions for ${language}

Here are recommendations to improve your code:

### Performance
- Consider caching repeated computations
- Use appropriate data structures for O(1) lookups
- Minimize memory allocations in loops

### Readability
- Use descriptive variable names
- Extract complex logic into well-named functions
- Add error handling for edge cases

### Best Practices
- Follow ${language} style guidelines
- Add input validation
- Include documentation comments

---
🤖 **Connect your OpenRouter API key for real optimization suggestions.**`,

    comment: `## Commented Code

Your code with comprehensive documentation:

\`\`\`${language}
// Main entry point - initializes the program
// This function handles the core logic

// TODO: Add your actual code here with comments
// Each section would have detailed explanations
// Complex algorithms would be broken down step by step
\`\`\`

---
🤖 **Connect your API key for AI-generated comments.**`,

    debug: `## Debug Analysis

### Potential Issues Found
1. Check for null/undefined values
2. Verify loop boundaries
3. Examine type conversions

### Debugging Steps
1. Add logging at key points
2. Check input validation
3. Test edge cases

---
🤖 **Connect your API key for detailed debugging assistance.**`,

    convert: `## Code Conversion

Code conversion requires an active AI connection to ensure accurate translation between languages.

### Manual Conversion Tips
- Map equivalent data types
- Handle language-specific features
- Adapt to idiomatic patterns

---
🤖 **Connect your API key for automatic code conversion.**`,

    generate: `## Code Generation

Code generation requires an active AI connection.

### What AI Generation Provides
- Production-ready code
- Error handling
- Documentation
- Best practices

---
🤖 **Connect your API key for AI code generation.**`,

    review: `## Code Review Summary

### Areas for Review
- **Security**: Input validation, sanitization
- **Performance**: Algorithm efficiency
- **Maintainability**: Code structure, naming
- **Testing**: Test coverage considerations

---
🤖 **Connect your API key for detailed code review.**`
  };

  return {
    success: true,
    response: mockResponses[action] || mockResponses.explain,
    model: 'mock',
    fallbackUsed: false,
    attempts: 0,
    executionTime: 50
  };
}

// Utility: Get available models info
export function getAvailableModels(): { models: AIModel[]; configured: boolean } {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  return {
    models: getConfiguredModels(),
    configured: !!(apiKey && apiKey !== 'your_openrouter_api_key_here')
  };
}
