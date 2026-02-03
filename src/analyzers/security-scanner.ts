import { Finding, Pattern } from '../types';

/**
 * Security Vulnerability Scanner
 *
 * Detects common security issues in code:
 * - SQL injection patterns
 * - XSS vulnerabilities
 * - Command injection
 * - Hardcoded credentials
 * - Insecure functions
 *
 * TODO: Integrate with Semgrep for more comprehensive analysis
 */

const SECURITY_PATTERNS: Pattern[] = [
  // SQL Injection
  {
    name: 'sql-injection',
    pattern: /(\$\{.*\}|['"`]\s*\+\s*\w+\s*\+\s*['"`]).*(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)/gi,
    severity: 'critical',
    description: 'Potential SQL injection: user input may be directly concatenated into SQL query',
    suggestion: 'Use parameterized queries or an ORM instead of string concatenation',
  },

  // Command Injection
  {
    name: 'command-injection',
    pattern: /exec\s*\(\s*[`'"].*\$\{|child_process\.exec\s*\([^)]*\+/g,
    severity: 'critical',
    description: 'Potential command injection: user input may be passed to shell execution',
    suggestion: 'Use execFile with an array of arguments instead of exec with string interpolation',
  },

  // XSS via innerHTML
  {
    name: 'xss-innerhtml',
    pattern: /\.innerHTML\s*=\s*[^"'`]/g,
    severity: 'high',
    description: 'Potential XSS: innerHTML assignment with dynamic content',
    suggestion: 'Use textContent for plain text, or sanitize HTML with DOMPurify',
  },

  // XSS via dangerouslySetInnerHTML
  {
    name: 'xss-dangerous-html',
    pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html:\s*[^}]+\}\s*\}/g,
    severity: 'high',
    description: 'dangerouslySetInnerHTML used - ensure content is sanitized',
    suggestion: 'Sanitize HTML with DOMPurify before using dangerouslySetInnerHTML',
  },

  // Eval usage
  {
    name: 'eval-usage',
    pattern: /\beval\s*\(/g,
    severity: 'critical',
    description: 'eval() usage detected - serious security risk',
    suggestion: 'Avoid eval(). Use JSON.parse() for JSON, or Function constructor if absolutely needed',
  },

  // Hardcoded passwords
  {
    name: 'hardcoded-password',
    pattern: /(password|passwd|pwd|secret)\s*[:=]\s*['"`][^'"`]{4,}['"`]/gi,
    severity: 'critical',
    description: 'Potential hardcoded password or secret',
    suggestion: 'Use environment variables or a secrets manager',
  },

  // Hardcoded API keys
  {
    name: 'hardcoded-api-key',
    pattern: /(api[_-]?key|apikey|api[_-]?secret)\s*[:=]\s*['"`][A-Za-z0-9_\-]{16,}['"`]/gi,
    severity: 'critical',
    description: 'Potential hardcoded API key',
    suggestion: 'Use environment variables or a secrets manager',
  },

  // Insecure HTTP
  {
    name: 'insecure-http',
    pattern: /['"`]http:\/\/(?!localhost|127\.0\.0\.1)[^'"`]+['"`]/g,
    severity: 'medium',
    description: 'Insecure HTTP URL (not HTTPS)',
    suggestion: 'Use HTTPS for external URLs',
  },

  // JWT without verification
  {
    name: 'jwt-no-verify',
    pattern: /jwt\.decode\s*\(/g,
    severity: 'high',
    description: 'JWT decoded without verification',
    suggestion: 'Use jwt.verify() to validate the signature',
  },

  // Disabled SSL verification
  {
    name: 'ssl-disabled',
    pattern: /rejectUnauthorized\s*:\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"`]?0['"`]?/g,
    severity: 'high',
    description: 'SSL/TLS certificate verification disabled',
    suggestion: 'Enable certificate verification in production',
  },

  // Weak crypto
  {
    name: 'weak-crypto',
    pattern: /createHash\s*\(\s*['"`](md5|sha1)['"`]\s*\)/g,
    severity: 'medium',
    description: 'Weak cryptographic hash function (MD5 or SHA1)',
    suggestion: 'Use SHA256 or stronger for security-sensitive operations',
  },

  // Math.random for crypto
  {
    name: 'insecure-random',
    pattern: /Math\.random\s*\(\s*\).*(?:token|key|secret|password|id|uuid)/gi,
    severity: 'high',
    description: 'Math.random() used for potentially security-sensitive value',
    suggestion: 'Use crypto.randomBytes() or crypto.randomUUID() for secure random values',
  },
];

export async function analyzeSecurityIssues(filename: string, content: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Skip non-code files
  if (!isCodeFile(filename)) {
    return findings;
  }

  for (const pattern of SECURITY_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);

    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;

      findings.push({
        type: 'security',
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
