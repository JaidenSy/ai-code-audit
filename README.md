# AI Code Audit

> A GitHub Action that audits AI-generated code for security vulnerabilities, license violations, PII leaks, and quality issues.

## The Problem

AI coding assistants (Copilot, Cursor, etc.) are transforming how we write code. But they create compliance blind spots:

- **No audit trail** of what's AI-generated
- **License violations** from copyleft code in AI training data
- **Security issues** that traditional SAST tools miss
- **Hallucinated APIs** and deprecated patterns
- **Hardcoded secrets** in "helpful" suggestions

## The Solution

AI Code Audit scans every PR for issues specific to AI-generated code:

| Detector | What It Finds |
|----------|---------------|
| **Security Scanner** | SQL injection, XSS, command injection, insecure crypto |
| **License Checker** | GPL/LGPL/AGPL code, copyleft violations |
| **PII Detector** | SSNs, credit cards, API keys, private keys, connection strings |
| **AI Pattern Detector** | Hallucinated APIs, deprecated patterns, placeholder values |

## Quick Start

Add to your repository in 2 minutes:

```yaml
# .github/workflows/ai-audit.yml
name: AI Code Audit

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: AI Code Audit
        uses: YOUR_USERNAME/ai-code-audit@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

That's it. Every PR will now be scanned and results posted as a comment.

## Configuration

```yaml
- uses: YOUR_USERNAME/ai-code-audit@v1
  with:
    # Required
    github-token: ${{ secrets.GITHUB_TOKEN }}

    # Optional - enable/disable specific scanners
    scan-security: 'true'      # Security vulnerabilities
    scan-licenses: 'true'      # License violations
    scan-pii: 'true'           # PII and secrets
    scan-ai-patterns: 'true'   # AI-generated code patterns

    # Optional - control behavior
    fail-on-findings: 'false'  # Fail the check if issues found
    severity-threshold: 'medium'  # Minimum severity to report (low/medium/high/critical)
```

## Example Output

When issues are found, you'll see a PR comment like this:

### AI Code Audit Report

#### Summary

| Category | Count |
|----------|-------|
| Security Issues | 2 |
| PII/Secrets Leaks | 1 |
| **Total** | **3** |

#### Critical

**🔐 aws-access-key**

**Location:** `src/config.ts:42`

**Issue:** Potential AWS Access Key ID detected

**Suggestion:** Use environment variables or AWS Secrets Manager. Rotate this key immediately if real.

---

## What Each Scanner Detects

### Security Scanner

- SQL injection patterns
- Command injection
- XSS via innerHTML/dangerouslySetInnerHTML
- eval() usage
- Hardcoded passwords/API keys
- Insecure HTTP URLs
- JWT without verification
- Disabled SSL verification
- Weak cryptographic functions
- Math.random() for security-sensitive values

### License Checker

- GPL/LGPL/AGPL license headers
- SPDX copyleft identifiers
- Creative Commons Non-Commercial
- Stack Overflow code (CC BY-SA)
- Known GPL project markers

### PII Detector

- Social Security Numbers
- Credit card numbers
- AWS access keys and secrets
- GitHub tokens
- Slack tokens
- Private keys (RSA, DSA, EC)
- Database connection strings
- JWT tokens
- Email addresses and phone numbers

### AI Pattern Detector

- Overly verbose comments
- Placeholder values left in code
- Generic numbered variable names
- Unnecessary async/await
- Fetch without error handling
- Console methods in production code

## Outputs

Use these in subsequent workflow steps:

```yaml
- uses: YOUR_USERNAME/ai-code-audit@v1
  id: audit
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}

- run: |
    echo "Total findings: ${{ steps.audit.outputs.findings-count }}"
    echo "Security issues: ${{ steps.audit.outputs.security-issues }}"
    echo "License violations: ${{ steps.audit.outputs.license-violations }}"
    echo "PII leaks: ${{ steps.audit.outputs.pii-leaks }}"
    echo "AI patterns: ${{ steps.audit.outputs.ai-patterns }}"
```

## Roadmap

### Free (Current)
- [x] GitHub Action
- [x] Security scanning
- [x] License checking
- [x] PII detection
- [x] AI pattern detection
- [x] PR comments

### Pro (Coming Soon)
- [ ] Compliance reports (PDF/HTML)
- [ ] Historical tracking
- [ ] Slack/Teams notifications
- [ ] Custom rules
- [ ] Priority support

### Enterprise (Coming Soon)
- [ ] SSO/SAML
- [ ] Audit logs
- [ ] Multi-repo dashboards
- [ ] SLA guarantees

## Why I Built This

I'm a Senior Software Engineer at a major bank. When we adopted AI coding tools, we found issues our existing security tools didn't catch:

- GPL code merged into our private repo
- Hardcoded API keys in AI suggestions
- Functions calling deprecated APIs
- Hallucinated npm packages

I built this to solve that problem. Now I'm sharing it with everyone facing the same challenge.

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with frustration and determination by someone who's seen AI code go wrong.
