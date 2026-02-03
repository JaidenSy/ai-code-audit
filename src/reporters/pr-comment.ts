import { ScanResults, Finding, Severity } from '../types';

/**
 * PR Comment Reporter
 *
 * Posts scan results as a comment on the pull request.
 * Groups findings by type and severity for easy review.
 */

type Octokit = ReturnType<typeof import('@actions/github').getOctokit>;

export async function postPRComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  prNumber: number,
  results: ScanResults
): Promise<void> {
  const comment = generateComment(results);

  // Find existing comment from this action
  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: prNumber,
  });

  const existingComment = comments.find(
    c => c.body?.includes('<!-- ai-code-audit -->')
  );

  if (existingComment) {
    // Update existing comment
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body: comment,
    });
  } else {
    // Create new comment
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: comment,
    });
  }
}

function generateComment(results: ScanResults): string {
  const lines: string[] = [
    '<!-- ai-code-audit -->',
    '## AI Code Audit Report',
    '',
  ];

  // Summary section
  if (results.total === 0) {
    lines.push('### No issues found');
    lines.push('');
    lines.push('All checks passed. No security issues, license violations, PII leaks, or AI-pattern issues detected.');
  } else {
    lines.push('### Summary');
    lines.push('');
    lines.push(`| Category | Count |`);
    lines.push(`|----------|-------|`);

    if (results.security > 0) {
      lines.push(`| Security Issues | ${results.security} |`);
    }
    if (results.license > 0) {
      lines.push(`| License Violations | ${results.license} |`);
    }
    if (results.pii > 0) {
      lines.push(`| PII/Secrets Leaks | ${results.pii} |`);
    }
    if (results.aiPattern > 0) {
      lines.push(`| AI Pattern Issues | ${results.aiPattern} |`);
    }
    lines.push(`| **Total** | **${results.total}** |`);
    lines.push('');

    // Detailed findings
    lines.push('### Findings');
    lines.push('');

    // Group by severity
    const critical = results.findings.filter(f => f.severity === 'critical');
    const high = results.findings.filter(f => f.severity === 'high');
    const medium = results.findings.filter(f => f.severity === 'medium');
    const low = results.findings.filter(f => f.severity === 'low');

    if (critical.length > 0) {
      lines.push('<details open>');
      lines.push(`<summary><strong>Critical (${critical.length})</strong></summary>`);
      lines.push('');
      lines.push(...formatFindings(critical));
      lines.push('</details>');
      lines.push('');
    }

    if (high.length > 0) {
      lines.push('<details open>');
      lines.push(`<summary><strong>High (${high.length})</strong></summary>`);
      lines.push('');
      lines.push(...formatFindings(high));
      lines.push('</details>');
      lines.push('');
    }

    if (medium.length > 0) {
      lines.push('<details>');
      lines.push(`<summary><strong>Medium (${medium.length})</strong></summary>`);
      lines.push('');
      lines.push(...formatFindings(medium));
      lines.push('</details>');
      lines.push('');
    }

    if (low.length > 0) {
      lines.push('<details>');
      lines.push(`<summary><strong>Low (${low.length})</strong></summary>`);
      lines.push('');
      lines.push(...formatFindings(low));
      lines.push('</details>');
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Powered by [AI Code Audit](https://github.com/YOUR_USERNAME/ai-code-audit)*');

  return lines.join('\n');
}

function formatFindings(findings: Finding[]): string[] {
  const lines: string[] = [];

  for (const finding of findings) {
    const icon = getIcon(finding.type);
    const location = finding.line
      ? `\`${finding.file}:${finding.line}\``
      : `\`${finding.file}\``;

    lines.push(`#### ${icon} ${finding.title}`);
    lines.push('');
    lines.push(`**Location:** ${location}`);
    lines.push('');
    lines.push(`**Issue:** ${finding.description}`);

    if (finding.suggestion) {
      lines.push('');
      lines.push(`**Suggestion:** ${finding.suggestion}`);
    }

    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines;
}

function getIcon(type: Finding['type']): string {
  switch (type) {
    case 'security':
      return '🔒';
    case 'license':
      return '📜';
    case 'pii':
      return '🔐';
    case 'ai-pattern':
      return '🤖';
    default:
      return '⚠️';
  }
}
