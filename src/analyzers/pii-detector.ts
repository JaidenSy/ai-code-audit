import { Finding, Pattern } from '../types';

/**
 * PII and Secrets Detector
 *
 * Detects personally identifiable information and secrets:
 * - Social Security Numbers
 * - Credit card numbers
 * - Email addresses in suspicious contexts
 * - Phone numbers
 * - API keys and tokens
 * - Private keys
 * - Connection strings
 *
 * TODO: Integrate with TruffleHog for more comprehensive secret scanning
 */

const PII_PATTERNS: Pattern[] = [
  // Social Security Numbers (US)
  {
    name: 'ssn',
    pattern: /\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/g,
    severity: 'critical',
    description: 'Potential Social Security Number detected',
    suggestion: 'Remove SSN from code. Use secure storage with encryption if needed.',
  },

  // Credit Card Numbers (Luhn-valid patterns)
  {
    name: 'credit-card',
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
    severity: 'critical',
    description: 'Potential credit card number detected',
    suggestion: 'Never store credit card numbers in code. Use a payment processor.',
  },

  // AWS Access Key ID
  {
    name: 'aws-access-key',
    pattern: /\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/g,
    severity: 'critical',
    description: 'Potential AWS Access Key ID detected',
    suggestion: 'Use environment variables or AWS Secrets Manager. Rotate this key immediately if real.',
  },

  // AWS Secret Access Key
  {
    name: 'aws-secret-key',
    pattern: /\b[A-Za-z0-9/+=]{40}\b/g,
    severity: 'high',
    description: 'Potential AWS Secret Access Key detected',
    suggestion: 'Never commit AWS secrets. Use IAM roles or environment variables.',
  },

  // Generic API Key patterns
  {
    name: 'generic-api-key',
    pattern: /['"`](?:api[_-]?key|apikey|api[_-]?secret|access[_-]?token)['"`:=\s]+['"`]?[A-Za-z0-9_\-]{20,}['"`]?/gi,
    severity: 'critical',
    description: 'Potential API key or token detected',
    suggestion: 'Use environment variables or a secrets manager for API keys.',
  },

  // GitHub Token
  {
    name: 'github-token',
    pattern: /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/g,
    severity: 'critical',
    description: 'GitHub Personal Access Token detected',
    suggestion: 'Revoke this token immediately and use environment variables.',
  },

  // Slack Token
  {
    name: 'slack-token',
    pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}/g,
    severity: 'critical',
    description: 'Slack token detected',
    suggestion: 'Revoke this token and use environment variables.',
  },

  // Private Key
  {
    name: 'private-key',
    pattern: /-----BEGIN\s+(?:RSA|DSA|EC|OPENSSH|PGP)?\s*PRIVATE\s+KEY-----/g,
    severity: 'critical',
    description: 'Private key detected',
    suggestion: 'Never commit private keys. Use a secrets manager or key vault.',
  },

  // Database Connection String
  {
    name: 'db-connection-string',
    pattern: /(?:mongodb|postgres|mysql|redis|amqp):\/\/[^:\s]+:[^@\s]+@[^\s]+/gi,
    severity: 'critical',
    description: 'Database connection string with credentials detected',
    suggestion: 'Use environment variables for database credentials.',
  },

  // Email addresses (only flag if appears to be test/personal data)
  {
    name: 'email-pii',
    pattern: /['"`][a-zA-Z0-9._%+-]+@(?!example\.com|test\.com|localhost)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}['"`]/g,
    severity: 'medium',
    description: 'Email address detected in string literal',
    suggestion: 'Ensure this is not real personal data. Use example.com for test emails.',
  },

  // Phone numbers (US format)
  {
    name: 'phone-number',
    pattern: /\b(?:\+1[-.\s]?)?\(?[2-9][0-9]{2}\)?[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}\b/g,
    severity: 'medium',
    description: 'Potential phone number detected',
    suggestion: 'Ensure this is not real personal data. Use fake numbers for testing.',
  },

  // JWT Token
  {
    name: 'jwt-token',
    pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
    severity: 'high',
    description: 'JWT token detected in code',
    suggestion: 'Do not hardcode JWT tokens. Use dynamic token generation.',
  },

  // Generic Bearer Token
  {
    name: 'bearer-token',
    pattern: /['"](Bearer\s+)[A-Za-z0-9_\-\.]+['"]/g,
    severity: 'high',
    description: 'Bearer token detected in string',
    suggestion: 'Do not hardcode authentication tokens.',
  },

  // IP Addresses (private ranges are usually OK, flag public)
  {
    name: 'public-ip',
    pattern: /\b(?!(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\.)[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\b/g,
    severity: 'low',
    description: 'Public IP address detected',
    suggestion: 'Ensure this IP address is not sensitive infrastructure.',
  },
];

export async function analyzePIILeaks(filename: string, content: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check most file types for PII (can be in comments, configs, etc.)
  if (shouldSkipFile(filename)) {
    return findings;
  }

  for (const pattern of PII_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);

    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;

      // Additional context check - is this in a test file or example?
      const isTestFile = /\.(test|spec|mock|fixture|example)\./i.test(filename) ||
                         /__(tests?|mocks?|fixtures?)__/i.test(filename);

      // Lower severity for test files (but still report)
      const adjustedSeverity = isTestFile && pattern.severity === 'critical'
        ? 'high'
        : pattern.severity;

      findings.push({
        type: 'pii',
        severity: adjustedSeverity,
        file: filename,
        line: lineNumber,
        title: pattern.name,
        description: pattern.description + (isTestFile ? ' (in test file)' : ''),
        suggestion: pattern.suggestion,
      });
    }
  }

  return findings;
}

function shouldSkipFile(filename: string): boolean {
  const skipPatterns = [
    /\.min\.js$/,
    /\.bundle\.js$/,
    /node_modules\//,
    /vendor\//,
    /\.lock$/,
    /package-lock\.json$/,
    /yarn\.lock$/,
    /\.svg$/,
    /\.png$/,
    /\.jpg$/,
    /\.gif$/,
    /\.ico$/,
    /\.woff2?$/,
    /\.ttf$/,
    /\.eot$/,
  ];

  return skipPatterns.some(pattern => pattern.test(filename));
}
