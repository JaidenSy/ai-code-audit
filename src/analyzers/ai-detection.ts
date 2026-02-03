import { Finding, Pattern } from '../types';

/**
 * AI-Generated Code Pattern Detection
 *
 * Detects patterns commonly found in AI-generated code:
 * - Overly verbose comments
 * - Hallucinated APIs (functions that don't exist)
 * - Deprecated API usage
 * - Inconsistent naming patterns
 * - TODO: Add more patterns based on research
 */

const AI_PATTERNS: Pattern[] = [
  // Overly verbose comments typical of AI
  {
    name: 'verbose-comment',
    pattern: /\/\/\s*.{100,}/g,
    severity: 'low',
    description: 'Unusually long single-line comment (common in AI-generated code)',
    suggestion: 'Consider if this comment is necessary or can be simplified',
  },

  // Comments that explain obvious code
  {
    name: 'obvious-comment',
    pattern: /\/\/\s*(increment|decrement|initialize|set|get|return|loop|iterate)\s+(the\s+)?\w+/gi,
    severity: 'low',
    description: 'Comment explaining obvious code (AI often over-documents)',
    suggestion: 'Remove comments that simply restate what the code does',
  },

  // Placeholder or example values left in
  {
    name: 'placeholder-value',
    pattern: /(["'`])(example|placeholder|your[_-]?\w+|insert[_-]?\w+|TODO|FIXME|XXX)\1/gi,
    severity: 'medium',
    description: 'Placeholder value that may have been left in by AI',
    suggestion: 'Replace with actual value or remove',
  },

  // Generic variable names AI tends to use
  {
    name: 'generic-naming',
    pattern: /\b(data|result|response|value|item|element|temp|tmp|obj|arr)\d+\b/g,
    severity: 'low',
    description: 'Generic numbered variable name (common AI pattern)',
    suggestion: 'Use more descriptive variable names',
  },

  // AI often adds unnecessary async/await
  {
    name: 'unnecessary-async',
    pattern: /async\s+\w+\s*\([^)]*\)\s*{\s*return\s+[^;]+;\s*}/g,
    severity: 'low',
    description: 'Async function that may not need to be async',
    suggestion: 'Remove async if no await is used inside',
  },

  // Deprecated console methods AI might suggest
  {
    name: 'deprecated-console',
    pattern: /console\.(debug|assert|count|countReset|dir|dirxml|group|groupCollapsed|groupEnd|profile|profileEnd|table|time|timeEnd|timeLog|timeStamp|trace)\(/g,
    severity: 'low',
    description: 'Console method that may not be appropriate for production',
    suggestion: 'Consider using a proper logging library',
  },

  // AI sometimes generates code with fetch without error handling
  {
    name: 'unhandled-fetch',
    pattern: /fetch\([^)]+\)\s*\.then\(/g,
    severity: 'medium',
    description: 'Fetch without apparent error handling',
    suggestion: 'Add .catch() or use try/catch with async/await',
  },

  // TODO: Add detection for:
  // - Hallucinated npm packages
  // - Deprecated React lifecycle methods
  // - Old JavaScript patterns (var instead of let/const)
  // - Inconsistent code style within same file
];

export async function analyzeAIPatterns(filename: string, content: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Skip non-code files
  if (!isCodeFile(filename)) {
    return findings;
  }

  const lines = content.split('\n');

  for (const pattern of AI_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);

    while ((match = regex.exec(content)) !== null) {
      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length;

      findings.push({
        type: 'ai-pattern',
        severity: pattern.severity,
        file: filename,
        line: lineNumber,
        title: pattern.name,
        description: pattern.description,
        suggestion: pattern.suggestion,
      });
    }
  }

  return findings;
}

function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.py', '.rb', '.go', '.rs', '.java', '.kt',
    '.c', '.cpp', '.h', '.hpp', '.cs', '.swift',
    '.php', '.vue', '.svelte'
  ];

  return codeExtensions.some(ext => filename.endsWith(ext));
}
