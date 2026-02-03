/**
 * Local test runner for AI Code Audit analyzers
 *
 * Run with: npx ts-node test/run-local-test.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { analyzeAIPatterns } from '../src/analyzers/ai-detection';
import { analyzeSecurityIssues } from '../src/analyzers/security-scanner';
import { analyzeLicenseViolations } from '../src/analyzers/license-checker';
import { analyzePIILeaks } from '../src/analyzers/pii-detector';
import { Finding } from '../src/types';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return COLORS.red;
    case 'high': return COLORS.magenta;
    case 'medium': return COLORS.yellow;
    case 'low': return COLORS.blue;
    default: return COLORS.white;
  }
}

function printFinding(finding: Finding): void {
  const color = getSeverityColor(finding.severity);
  console.log(`  ${color}[${finding.severity.toUpperCase()}]${COLORS.reset} ${finding.title}`);
  console.log(`    File: ${finding.file}:${finding.line || '?'}`);
  console.log(`    ${finding.description}`);
  if (finding.suggestion) {
    console.log(`    ${COLORS.green}Suggestion: ${finding.suggestion}${COLORS.reset}`);
  }
  console.log();
}

async function runTests(): Promise<void> {
  const testDir = path.join(__dirname, 'sample-code');
  const files = fs.readdirSync(testDir).filter(f => f.endsWith('.ts'));

  console.log('\n' + '='.repeat(60));
  console.log('  AI Code Audit - Local Test Runner');
  console.log('='.repeat(60) + '\n');

  let totalFindings = 0;
  const resultsByType = {
    'ai-pattern': 0,
    'security': 0,
    'license': 0,
    'pii': 0,
  };

  for (const file of files) {
    const filePath = path.join(testDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    console.log(`${COLORS.cyan}📄 Scanning: ${file}${COLORS.reset}`);
    console.log('-'.repeat(40));

    // Run all analyzers
    const aiFindings = await analyzeAIPatterns(file, content);
    const securityFindings = await analyzeSecurityIssues(file, content);
    const licenseFindings = await analyzeLicenseViolations(file, content);
    const piiFindings = await analyzePIILeaks(file, content);

    const allFindings = [...aiFindings, ...securityFindings, ...licenseFindings, ...piiFindings];

    if (allFindings.length === 0) {
      console.log(`  ${COLORS.green}✓ No issues found${COLORS.reset}\n`);
    } else {
      for (const finding of allFindings) {
        printFinding(finding);
        resultsByType[finding.type]++;
        totalFindings++;
      }
    }
  }

  // Print summary
  console.log('='.repeat(60));
  console.log('  SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n  Total findings: ${totalFindings}\n`);
  console.log(`  ${COLORS.cyan}AI Patterns:${COLORS.reset}      ${resultsByType['ai-pattern']}`);
  console.log(`  ${COLORS.magenta}Security Issues:${COLORS.reset}  ${resultsByType['security']}`);
  console.log(`  ${COLORS.yellow}License Issues:${COLORS.reset}   ${resultsByType['license']}`);
  console.log(`  ${COLORS.red}PII/Secrets:${COLORS.reset}      ${resultsByType['pii']}`);
  console.log('\n' + '='.repeat(60) + '\n');

  // Exit with error code if findings exist
  if (totalFindings > 0) {
    console.log(`${COLORS.yellow}⚠ Found ${totalFindings} issues that need attention${COLORS.reset}\n`);
  } else {
    console.log(`${COLORS.green}✓ All scans passed!${COLORS.reset}\n`);
  }
}

runTests().catch(console.error);
