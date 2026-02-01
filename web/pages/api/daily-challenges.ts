import type { NextApiRequest, NextApiResponse } from 'next';

interface Challenge {
  id: string;
  type: 'code' | 'quiz' | 'debug' | 'output';
  language: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  code?: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  hint?: string;
}

interface DailyChallengesResponse {
  success: boolean;
  challenges?: Challenge[];
  error?: string;
  date?: string;
}

// Generate a unique seed based on date and language
function getDailySeed(language: string): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  return `${dateStr}-${language}`;
}

// Cache for daily challenges to avoid regenerating
const challengeCache = new Map<string, { challenges: Challenge[]; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DailyChallengesResponse>
) {
  // Support both GET and POST
  let language: string | undefined;
  
  if (req.method === 'GET') {
    language = req.query.language as string;
  } else if (req.method === 'POST') {
    language = req.body.language;
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!language) {
    return res.status(400).json({ success: false, error: 'Language is required' });
  }

  const seed = getDailySeed(language);
  const today = new Date().toISOString().split('T')[0];

  // Check cache first
  const cached = challengeCache.get(seed);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.status(200).json({
      success: true,
      challenges: cached.challenges,
      date: today
    });
  }

  try {
    const challenges = await generateDailyChallenges(language, seed);
    
    // Cache the challenges
    challengeCache.set(seed, { challenges, timestamp: Date.now() });

    return res.status(200).json({
      success: true,
      challenges,
      date: today
    });
  } catch (error) {
    console.error('Error generating daily challenges:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate challenges'
    });
  }
}

async function generateDailyChallenges(language: string, seed: string): Promise<Challenge[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    // Return fallback challenges if no API key
    return getFallbackChallenges(language, seed);
  }

  const prompt = `You are a coding challenge generator. Generate exactly 3 unique daily coding challenges for ${language} programming language.

IMPORTANT: Generate challenges for today's date seed: ${seed}

Return a JSON array with exactly 3 challenges. Each challenge must have this EXACT structure:
{
  "id": "unique_id_string",
  "type": "quiz" | "code" | "debug" | "output",
  "language": "${language}",
  "title": "Challenge Title",
  "description": "Clear description of what the user needs to do",
  "difficulty": "Easy" | "Medium" | "Hard",
  "points": 10 | 20 | 30 (based on difficulty),
  "code": "code snippet if applicable (properly escaped)",
  "options": [
    { "id": "a", "text": "Option A text", "isCorrect": false },
    { "id": "b", "text": "Option B text", "isCorrect": true },
    { "id": "c", "text": "Option C text", "isCorrect": false },
    { "id": "d", "text": "Option D text", "isCorrect": false }
  ],
  "explanation": "Explanation of the correct answer",
  "hint": "Optional hint"
}

Challenge types:
1. "quiz" - Multiple choice question about ${language} concepts
2. "code" - What does this code output?
3. "debug" - Find the bug in this code
4. "output" - Predict the output

Rules:
- One Easy (10 pts), one Medium (20 pts), one Hard (30 pts)
- Mix different challenge types
- Make questions specific to ${language} syntax/features
- Ensure exactly ONE correct answer per question
- Code must be properly escaped for JSON
- Keep code snippets concise (under 15 lines)

Return ONLY the JSON array, no markdown or extra text.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://coderipper.vercel.app',
        'X-Title': 'CodeRipper Daily Challenges'
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a coding challenge generator. You MUST return ONLY valid JSON, no markdown formatting or extra text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse the JSON response
    let challenges: Challenge[];
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      challenges = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return getFallbackChallenges(language, seed);
    }

    // Validate and fix challenges
    return challenges.map((c, idx) => ({
      id: c.id || `${seed}-${idx}`,
      type: c.type || 'quiz',
      language: language,
      title: c.title || `Challenge ${idx + 1}`,
      description: c.description || 'Solve this challenge',
      difficulty: c.difficulty || ['Easy', 'Medium', 'Hard'][idx] as Challenge['difficulty'],
      points: c.points || [10, 20, 30][idx],
      code: c.code,
      options: c.options || [],
      explanation: c.explanation || 'No explanation available',
      hint: c.hint
    }));

  } catch (error) {
    console.error('AI challenge generation failed:', error);
    return getFallbackChallenges(language, seed);
  }
}

function getFallbackChallenges(language: string, seed: string): Challenge[] {
  // Fallback challenges based on language
  const challenges: Record<string, Challenge[]> = {
    python: [
      {
        id: `${seed}-1`,
        type: 'output',
        language: 'python',
        title: 'List Comprehension',
        description: 'What will be the output of this code?',
        difficulty: 'Easy',
        points: 10,
        code: `numbers = [1, 2, 3, 4, 5]
result = [x ** 2 for x in numbers if x % 2 == 0]
print(result)`,
        options: [
          { id: 'a', text: '[1, 4, 9, 16, 25]', isCorrect: false },
          { id: 'b', text: '[4, 16]', isCorrect: true },
          { id: 'c', text: '[2, 4]', isCorrect: false },
          { id: 'd', text: '[1, 9, 25]', isCorrect: false }
        ],
        explanation: 'The list comprehension filters even numbers (2, 4) and squares them (4, 16).',
        hint: 'Focus on the condition x % 2 == 0'
      },
      {
        id: `${seed}-2`,
        type: 'quiz',
        language: 'python',
        title: 'Dictionary Methods',
        description: 'Which method removes and returns a key-value pair from a dictionary?',
        difficulty: 'Medium',
        points: 20,
        options: [
          { id: 'a', text: 'dict.remove()', isCorrect: false },
          { id: 'b', text: 'dict.delete()', isCorrect: false },
          { id: 'c', text: 'dict.pop()', isCorrect: true },
          { id: 'd', text: 'dict.discard()', isCorrect: false }
        ],
        explanation: 'The pop() method removes and returns the value for the specified key.',
        hint: 'Think about what "pop" means in data structures'
      },
      {
        id: `${seed}-3`,
        type: 'debug',
        language: 'python',
        title: 'Find the Bug',
        description: 'This code should calculate factorial. What is the bug?',
        difficulty: 'Hard',
        points: 30,
        code: `def factorial(n):
    if n == 0:
        return 0
    return n * factorial(n - 1)`,
        options: [
          { id: 'a', text: 'Base case should return 1, not 0', isCorrect: true },
          { id: 'b', text: 'Missing else statement', isCorrect: false },
          { id: 'c', text: 'Should use n + 1 instead of n - 1', isCorrect: false },
          { id: 'd', text: 'Function name is wrong', isCorrect: false }
        ],
        explanation: 'Factorial of 0 is 1, not 0. The base case should return 1.',
        hint: 'What is 0! equal to?'
      }
    ],
    javascript: [
      {
        id: `${seed}-1`,
        type: 'output',
        language: 'javascript',
        title: 'Array Methods',
        description: 'What will be logged to the console?',
        difficulty: 'Easy',
        points: 10,
        code: `const arr = [1, 2, 3];
const result = arr.map(x => x * 2).filter(x => x > 3);
console.log(result);`,
        options: [
          { id: 'a', text: '[2, 4, 6]', isCorrect: false },
          { id: 'b', text: '[4, 6]', isCorrect: true },
          { id: 'c', text: '[6]', isCorrect: false },
          { id: 'd', text: '[1, 2, 3]', isCorrect: false }
        ],
        explanation: 'map doubles: [2,4,6], filter keeps > 3: [4,6]',
        hint: 'Apply map first, then filter'
      },
      {
        id: `${seed}-2`,
        type: 'quiz',
        language: 'javascript',
        title: 'Closures',
        description: 'What is a closure in JavaScript?',
        difficulty: 'Medium',
        points: 20,
        options: [
          { id: 'a', text: 'A way to close browser windows', isCorrect: false },
          { id: 'b', text: 'A function that has access to its outer scope variables', isCorrect: true },
          { id: 'c', text: 'A method to end loops early', isCorrect: false },
          { id: 'd', text: 'A type of error handling', isCorrect: false }
        ],
        explanation: 'A closure is a function that remembers and can access variables from its outer scope even after the outer function has returned.',
        hint: 'Think about scope and function nesting'
      },
      {
        id: `${seed}-3`,
        type: 'code',
        language: 'javascript',
        title: 'Promise Behavior',
        description: 'What will be the order of console.log outputs?',
        difficulty: 'Hard',
        points: 30,
        code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
        options: [
          { id: 'a', text: '1, 2, 3, 4', isCorrect: false },
          { id: 'b', text: '1, 4, 2, 3', isCorrect: false },
          { id: 'c', text: '1, 4, 3, 2', isCorrect: true },
          { id: 'd', text: '1, 3, 4, 2', isCorrect: false }
        ],
        explanation: 'Synchronous code runs first (1,4), then microtasks (Promise: 3), then macrotasks (setTimeout: 2)',
        hint: 'Think about the event loop and task queues'
      }
    ],
    java: [
      {
        id: `${seed}-1`,
        type: 'quiz',
        language: 'java',
        title: 'Access Modifiers',
        description: 'Which access modifier allows access only within the same package?',
        difficulty: 'Easy',
        points: 10,
        options: [
          { id: 'a', text: 'private', isCorrect: false },
          { id: 'b', text: 'public', isCorrect: false },
          { id: 'c', text: 'protected', isCorrect: false },
          { id: 'd', text: 'default (no modifier)', isCorrect: true }
        ],
        explanation: 'Default access (no modifier) allows access within the same package only.',
        hint: 'What happens when you don\'t specify any modifier?'
      },
      {
        id: `${seed}-2`,
        type: 'output',
        language: 'java',
        title: 'String Pool',
        description: 'What will this code print?',
        difficulty: 'Medium',
        points: 20,
        code: `String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");
System.out.println(s1 == s2);
System.out.println(s1 == s3);`,
        options: [
          { id: 'a', text: 'true, true', isCorrect: false },
          { id: 'b', text: 'false, false', isCorrect: false },
          { id: 'c', text: 'true, false', isCorrect: true },
          { id: 'd', text: 'false, true', isCorrect: false }
        ],
        explanation: 's1 and s2 point to the same string in the pool, but s3 creates a new object.',
        hint: 'Think about String pool vs new keyword'
      },
      {
        id: `${seed}-3`,
        type: 'debug',
        language: 'java',
        title: 'Exception Handling',
        description: 'What\'s wrong with this code?',
        difficulty: 'Hard',
        points: 30,
        code: `try {
    throw new Exception("Error");
} catch (RuntimeException e) {
    System.out.println("Caught!");
}`,
        options: [
          { id: 'a', text: 'Exception is not a subclass of RuntimeException', isCorrect: true },
          { id: 'b', text: 'throw keyword is incorrect', isCorrect: false },
          { id: 'c', text: 'catch block syntax is wrong', isCorrect: false },
          { id: 'd', text: 'Nothing is wrong', isCorrect: false }
        ],
        explanation: 'Exception is a checked exception, not a RuntimeException. The catch block won\'t catch it.',
        hint: 'Check the exception hierarchy'
      }
    ]
  };

  // Default fallback for other languages
  const defaultChallenges: Challenge[] = [
    {
      id: `${seed}-1`,
      type: 'quiz',
      language: language,
      title: 'Programming Basics',
      description: `What is the purpose of a variable in ${language}?`,
      difficulty: 'Easy',
      points: 10,
      options: [
        { id: 'a', text: 'To store data that can be used later', isCorrect: true },
        { id: 'b', text: 'To create visual elements', isCorrect: false },
        { id: 'c', text: 'To connect to the internet', isCorrect: false },
        { id: 'd', text: 'To delete files', isCorrect: false }
      ],
      explanation: 'Variables are used to store data values that can be referenced and manipulated in a program.',
      hint: 'Think about data storage'
    },
    {
      id: `${seed}-2`,
      type: 'quiz',
      language: language,
      title: 'Control Flow',
      description: 'Which control structure is used for repeated execution?',
      difficulty: 'Medium',
      points: 20,
      options: [
        { id: 'a', text: 'if statement', isCorrect: false },
        { id: 'b', text: 'loop (for/while)', isCorrect: true },
        { id: 'c', text: 'function', isCorrect: false },
        { id: 'd', text: 'class', isCorrect: false }
      ],
      explanation: 'Loops (for, while, do-while) are used to execute code repeatedly.',
      hint: 'Think about iteration'
    },
    {
      id: `${seed}-3`,
      type: 'quiz',
      language: language,
      title: 'Data Types',
      description: 'What is an array?',
      difficulty: 'Hard',
      points: 30,
      options: [
        { id: 'a', text: 'A single value', isCorrect: false },
        { id: 'b', text: 'A collection of values stored in contiguous memory', isCorrect: true },
        { id: 'c', text: 'A type of function', isCorrect: false },
        { id: 'd', text: 'A network protocol', isCorrect: false }
      ],
      explanation: 'An array is a data structure that stores a collection of elements in contiguous memory locations.',
      hint: 'Think about storing multiple values'
    }
  ];

  return challenges[language.toLowerCase()] || defaultChallenges;
}
