import { Finding, Pattern } from '../types';

/**
 * License Violation Detector
 *
 * Detects potential copyleft license violations:
 * - GPL headers in code
 * - LGPL headers
 * - AGPL headers
 * - Known GPL-licensed code snippets
 *
 * TODO: Integrate with license APIs (SPDX, ClearlyDefined)
 * TODO: Check package.json/requirements.txt dependencies
 */

const LICENSE_PATTERNS: Pattern[] = [
  // GPL License headers
  {
    name: 'gpl-header',
    pattern: /GNU\s+General\s+Public\s+License|GPL[- ]?[23]\.?0?|General\s+Public\s+License/gi,
    severity: 'high',
    description: 'GPL license reference detected - code may be copyleft licensed',
    suggestion: 'Verify the license is compatible with your project. GPL code cannot be used in proprietary software.',
  },

  // LGPL License headers
  {
    name: 'lgpl-header',
    pattern: /GNU\s+Lesser\s+General\s+Public|LGPL[- ]?[23]\.?0?|Lesser\s+General\s+Public/gi,
    severity: 'medium',
    description: 'LGPL license reference detected',
    suggestion: 'LGPL allows linking but modifications must be open-sourced. Review usage carefully.',
  },

  // AGPL License headers
  {
    name: 'agpl-header',
    pattern: /GNU\s+Affero\s+General\s+Public|AGPL[- ]?3\.?0?|Affero\s+General\s+Public/gi,
    severity: 'critical',
    description: 'AGPL license reference detected - most restrictive copyleft license',
    suggestion: 'AGPL requires source disclosure even for network use. This is likely incompatible with proprietary software.',
  },

  // Creative Commons Non-Commercial
  {
    name: 'cc-noncommercial',
    pattern: /Creative\s+Commons.*Non[- ]?Commercial|CC[- ]?BY[- ]?NC/gi,
    severity: 'high',
    description: 'Non-commercial license detected',
    suggestion: 'This code cannot be used for commercial purposes.',
  },

  // SPDX License identifiers for copyleft
  {
    name: 'spdx-copyleft',
    pattern: /SPDX[- ]License[- ]Identifier:\s*(GPL|LGPL|AGPL|MPL|EPL|CDDL)/gi,
    severity: 'high',
    description: 'SPDX identifier for copyleft license detected',
    suggestion: 'Review license compatibility with your project.',
  },

  // Copyright with GPL
  {
    name: 'copyright-gpl',
    pattern: /Copyright.*(?:Free\s+Software\s+Foundation|GNU\s+Project)/gi,
    severity: 'high',
    description: 'FSF/GNU Project copyright notice - likely GPL licensed',
    suggestion: 'This code is likely GPL licensed. Do not use in proprietary software.',
  },

  // Stack Overflow attribution (sometimes AI copies without proper attribution)
  {
    name: 'stackoverflow-code',
    pattern: /stackoverflow\.com\/(?:questions|a)\/\d+|from\s+stack\s*overflow/gi,
    severity: 'low',
    description: 'Stack Overflow reference detected - code may require CC BY-SA attribution',
    suggestion: 'Stack Overflow code is CC BY-SA licensed. Ensure proper attribution.',
  },

  // Common GPL project markers
  {
    name: 'known-gpl-marker',
    pattern: /(?:linux|kernel|glibc|gcc|emacs|bash|readline).*(?:source|code|from|copied)/gi,
    severity: 'medium',
    description: 'Reference to known GPL project detected',
    suggestion: 'Verify this code is not directly copied from a GPL project.',
  },
];

export async function analyzeLicenseViolations(filename: string, content: string): Promise<Finding[]> {
  const findings: Finding[] = [];

  // Check both code and text files for license issues
  if (!isRelevantFile(filename)) {
    return findings;
  }

  for (const pattern of LICENSE_PATTERNS) {
    let match;
    const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags);

    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.substring(0, match.index).split('\n').length;

      findings.push({
        type: 'license',
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

function isRelevantFile(filename: string): boolean {
  const relevantExtensions = [
    // Code files
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.py', '.rb', '.go', '.rs', '.java', '.kt',
    '.c', '.cpp', '.h', '.hpp', '.cs', '.swift',
    '.php', '.vue', '.svelte',
    // Config/license files
    '.md', '.txt', '.json', '.yaml', '.yml',
    '.toml', '.cfg', '.ini'
  ];

  const relevantNames = [
    'LICENSE', 'COPYING', 'NOTICE', 'README',
    'package.json', 'Cargo.toml', 'go.mod',
    'requirements.txt', 'Gemfile', 'pom.xml'
  ];

  const basename = filename.split('/').pop() || '';

  return relevantExtensions.some(ext => filename.endsWith(ext)) ||
         relevantNames.some(name => basename.toUpperCase().includes(name.toUpperCase()));
}
