// Advanced Language Auto-Detection System
import { LanguageKey } from './constants';

interface LanguagePattern {
  language: LanguageKey;
  patterns: RegExp[];
  keywords: string[];
  fileExtensions?: string[];
  weight: number;
}

const LANGUAGE_SIGNATURES: LanguagePattern[] = [
  {
    language: 'python',
    patterns: [
      /^import\s+\w+/m,
      /^from\s+\w+\s+import/m,
      /def\s+\w+\s*\(/,
      /class\s+\w+.*:/,
      /if\s+__name__\s*==\s*['"]__main__['"]/,
      /print\s*\(/,
      /@\w+\s*\n\s*def/,
    ],
    keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'return', 'yield', 'lambda', 'pass', 'break', 'continue'],
    fileExtensions: ['.py', '.pyw'],
    weight: 1.0
  },
  {
    language: 'javascript',
    patterns: [
      /^import\s+.*\s+from\s+['"].*['"]/m,
      /^export\s+(default|const|function|class)/m,
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /var\s+\w+\s*=/,
      /function\s+\w+\s*\(/,
      /=>\s*{/,
      /console\.log\s*\(/,
      /document\./,
      /window\./,
    ],
    keywords: ['const', 'let', 'var', 'function', 'class', 'import', 'export', 'default', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'switch', 'case'],
    fileExtensions: ['.js', '.mjs', '.cjs'],
    weight: 1.0
  },
  {
    language: 'typescript',
    patterns: [
      /:\s*(string|number|boolean|any|void|never|unknown)\s*[=;,)]/,
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /<.*>\s*\(/,
      /as\s+(string|number|boolean|any)/,
      /enum\s+\w+/,
      /namespace\s+\w+/,
    ],
    keywords: ['interface', 'type', 'enum', 'namespace', 'implements', 'extends', 'abstract', 'private', 'public', 'protected', 'readonly'],
    fileExtensions: ['.ts', '.tsx'],
    weight: 1.2
  },
  {
    language: 'java',
    patterns: [
      /^public\s+class\s+\w+/m,
      /^import\s+java\./m,
      /public\s+static\s+void\s+main/,
      /System\.out\.print/,
      /@Override/,
      /new\s+\w+\s*\(/,
    ],
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'void', 'int', 'String', 'boolean', 'new'],
    fileExtensions: ['.java'],
    weight: 1.0
  },
  {
    language: 'cpp',
    patterns: [
      /#include\s*<.*>/,
      /std::/,
      /cout\s*<<|cin\s*>>/,
      /using\s+namespace\s+std/,
      /template\s*</,
      /\w+::\w+/,
    ],
    keywords: ['#include', 'using', 'namespace', 'std', 'cout', 'cin', 'template', 'class', 'public', 'private', 'virtual'],
    fileExtensions: ['.cpp', '.cc', '.cxx', '.hpp', '.h'],
    weight: 1.0
  },
  {
    language: 'go',
    patterns: [
      /^package\s+\w+/m,
      /^import\s+\(/m,
      /^func\s+\w+/m,
      /func\s+\(\w+\s+\*?\w+\)\s+\w+/,
      /:=/,
      /fmt\./,
    ],
    keywords: ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 'defer', 'go', 'chan', 'range'],
    fileExtensions: ['.go'],
    weight: 1.0
  },
  {
    language: 'rust',
    patterns: [
      /fn\s+\w+/,
      /let\s+(mut\s+)?\w+/,
      /impl\s+\w+/,
      /use\s+\w+::/,
      /println!\s*\(/,
      /->\s*\w+/,
      /&\w+/,
    ],
    keywords: ['fn', 'let', 'mut', 'impl', 'trait', 'struct', 'enum', 'use', 'pub', 'mod', 'match', 'if', 'else'],
    fileExtensions: ['.rs'],
    weight: 1.0
  },
  {
    language: 'html',
    patterns: [
      /<!DOCTYPE\s+html>/i,
      /<html/i,
      /<head>/i,
      /<body>/i,
      /<div/i,
      /<p>/i,
      /<script>/i,
      /<style>/i,
    ],
    keywords: ['<!DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'script', 'style'],
    fileExtensions: ['.html', '.htm'],
    weight: 1.0
  },
  {
    language: 'css',
    patterns: [
      /\{[^}]*:[^}]*;[^}]*\}/,
      /@media/,
      /@keyframes/,
      /\.\w+\s*{/,
      /#\w+\s*{/,
      /:\s*#[0-9a-f]{3,6}/i,
    ],
    keywords: ['@media', '@keyframes', '@import', 'color', 'background', 'font', 'margin', 'padding', 'display', 'flex'],
    fileExtensions: ['.css', '.scss', '.sass'],
    weight: 1.0
  },
  {
    language: 'react',
    patterns: [
      /import\s+React/,
      /from\s+['"]react['"]/,
      /useState\s*\(/,
      /useEffect\s*\(/,
      /className=/,
      /<[A-Z]\w+/,
      /jsx|tsx/i,
    ],
    keywords: ['useState', 'useEffect', 'useContext', 'useCallback', 'useMemo', 'useRef', 'React', 'Component', 'props', 'state'],
    fileExtensions: ['.jsx', '.tsx'],
    weight: 1.5
  },
  {
    language: 'vue',
    patterns: [
      /<template>/,
      /<script>/,
      /<style.*scoped/,
      /export\s+default\s*{/,
      /data\s*\(\)\s*{/,
      /methods\s*:/,
      /computed\s*:/,
    ],
    keywords: ['template', 'script', 'style', 'data', 'methods', 'computed', 'props', 'mounted', 'created'],
    fileExtensions: ['.vue'],
    weight: 1.5
  },
  {
    language: 'svg',
    patterns: [
      /<svg/i,
      /<path\s+d=/i,
      /<circle/i,
      /<rect/i,
      /<polygon/i,
      /xmlns/,
    ],
    keywords: ['svg', 'path', 'circle', 'rect', 'polygon', 'line', 'polyline', 'g'],
    fileExtensions: ['.svg'],
    weight: 1.0
  },
  {
    language: 'kotlin',
    patterns: [
      /fun\s+\w+/,
      /val\s+\w+/,
      /var\s+\w+/,
      /class\s+\w+/,
      /data\s+class/,
      /when\s*\{/,
    ],
    keywords: ['fun', 'val', 'var', 'class', 'data', 'when', 'if', 'else', 'object', 'companion'],
    fileExtensions: ['.kt', '.kts'],
    weight: 1.0
  },
  {
    language: 'solidity',
    patterns: [
      /pragma\s+solidity/,
      /contract\s+\w+/,
      /function\s+\w+.*\s+(public|private|internal|external)/,
      /mapping\s*\(/,
      /address\s+/,
      /payable/,
    ],
    keywords: ['pragma', 'solidity', 'contract', 'function', 'mapping', 'address', 'payable', 'public', 'private', 'view', 'pure'],
    fileExtensions: ['.sol'],
    weight: 1.0
  }
];

export function detectLanguage(code: string, filename?: string): LanguageKey {
  if (!code || code.trim().length === 0) {
    return 'javascript'; // Default
  }

  const scores: Record<string, number> = {};

  // Check file extension first
  if (filename) {
    for (const sig of LANGUAGE_SIGNATURES) {
      if (sig.fileExtensions) {
        for (const ext of sig.fileExtensions) {
          if (filename.toLowerCase().endsWith(ext)) {
            scores[sig.language] = (scores[sig.language] || 0) + 5 * sig.weight;
          }
        }
      }
    }
  }

  // Analyze code patterns
  for (const sig of LANGUAGE_SIGNATURES) {
    let score = 0;

    // Check regex patterns
    for (const pattern of sig.patterns) {
      if (pattern.test(code)) {
        score += 2 * sig.weight;
      }
    }

    // Check keywords
    const codeLower = code.toLowerCase();
    for (const keyword of sig.keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = code.match(regex);
      if (matches) {
        score += matches.length * 0.5 * sig.weight;
      }
    }

    scores[sig.language] = (scores[sig.language] || 0) + score;
  }

  // Find language with highest score
  let maxScore = 0;
  let detectedLanguage: LanguageKey = 'javascript';

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = lang as LanguageKey;
    }
  }

  // Minimum threshold
  if (maxScore < 2) {
    return 'javascript'; // Default if uncertain
  }

  return detectedLanguage;
}

export function getLanguageConfidence(code: string, language: LanguageKey): number {
  const sig = LANGUAGE_SIGNATURES.find(s => s.language === language);
  if (!sig) return 0;

  let score = 0;
  let maxPossible = 0;

  for (const pattern of sig.patterns) {
    maxPossible += 2;
    if (pattern.test(code)) {
      score += 2;
    }
  }

  const codeLower = code.toLowerCase();
  for (const keyword of sig.keywords) {
    maxPossible += 1;
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(codeLower)) {
      score += 1;
    }
  }

  return maxPossible > 0 ? (score / maxPossible) * 100 : 0;
}

export function suggestLanguages(code: string, topN: number = 3): Array<{ language: LanguageKey; confidence: number }> {
  const suggestions: Array<{ language: LanguageKey; confidence: number }> = [];

  for (const sig of LANGUAGE_SIGNATURES) {
    const confidence = getLanguageConfidence(code, sig.language);
    if (confidence > 10) {
      suggestions.push({ language: sig.language, confidence });
    }
  }

  return suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, topN);
}
