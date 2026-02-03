import * as core from '@actions/core';
import * as github from '@actions/github';
import { analyzeAIPatterns } from './analyzers/ai-detection';
import { analyzeSecurityIssues } from './analyzers/security-scanner';
import { analyzeLicenseViolations } from './analyzers/license-checker';
import { analyzePIILeaks } from './analyzers/pii-detector';
import { postPRComment } from './reporters/pr-comment';
import { Finding, ScanConfig, ScanResults } from './types';

async function run(): Promise<void> {
  try {
    // Get inputs
    const config: ScanConfig = {
      githubToken: core.getInput('github-token', { required: true }),
      scanSecurity: core.getInput('scan-security') === 'true',
      scanLicenses: core.getInput('scan-licenses') === 'true',
      scanPII: core.getInput('scan-pii') === 'true',
      scanAIPatterns: core.getInput('scan-ai-patterns') === 'true',
      failOnFindings: core.getInput('fail-on-findings') === 'true',
      severityThreshold: core.getInput('severity-threshold') as 'low' | 'medium' | 'high' | 'critical',
    };

    const octokit = github.getOctokit(config.githubToken);
    const context = github.context;

    // Only run on pull requests
    if (!context.payload.pull_request) {
      core.info('Not a pull request, skipping audit');
      return;
    }

    const prNumber = context.payload.pull_request.number;
    const owner = context.repo.owner;
    const repo = context.repo.repo;

    core.info(`Auditing PR #${prNumber} in ${owner}/${repo}`);

    // Get the diff/changed files
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: prNumber,
    });

    core.info(`Found ${files.length} changed files`);

    // Collect all findings
    const allFindings: Finding[] = [];

    // Run enabled analyzers
    for (const file of files) {
      if (file.status === 'removed') continue;

      const content = file.patch || '';
      const filename = file.filename;

      if (config.scanAIPatterns) {
        const aiFindings = await analyzeAIPatterns(filename, content);
        allFindings.push(...aiFindings);
      }

      if (config.scanSecurity) {
        const securityFindings = await analyzeSecurityIssues(filename, content);
        allFindings.push(...securityFindings);
      }

      if (config.scanLicenses) {
        const licenseFindings = await analyzeLicenseViolations(filename, content);
        allFindings.push(...licenseFindings);
      }

      if (config.scanPII) {
        const piiFindings = await analyzePIILeaks(filename, content);
        allFindings.push(...piiFindings);
      }
    }

    // Filter by severity threshold
    const severityOrder = ['low', 'medium', 'high', 'critical'];
    const thresholdIndex = severityOrder.indexOf(config.severityThreshold);
    const filteredFindings = allFindings.filter(
      f => severityOrder.indexOf(f.severity) >= thresholdIndex
    );

    // Calculate results
    const results: ScanResults = {
      total: filteredFindings.length,
      security: filteredFindings.filter(f => f.type === 'security').length,
      license: filteredFindings.filter(f => f.type === 'license').length,
      pii: filteredFindings.filter(f => f.type === 'pii').length,
      aiPattern: filteredFindings.filter(f => f.type === 'ai-pattern').length,
      findings: filteredFindings,
    };

    core.info(`Found ${results.total} issues`);

    // Post comment to PR
    await postPRComment(octokit, owner, repo, prNumber, results);

    // Set outputs
    core.setOutput('findings-count', results.total);
    core.setOutput('security-issues', results.security);
    core.setOutput('license-violations', results.license);
    core.setOutput('pii-leaks', results.pii);
    core.setOutput('ai-patterns', results.aiPattern);

    // Fail if configured and findings exist
    if (config.failOnFindings && results.total > 0) {
      core.setFailed(`Found ${results.total} issues in AI-generated code`);
    }

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
