export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type FindingType = 'security' | 'license' | 'pii' | 'ai-pattern';
export interface Finding {
    type: FindingType;
    severity: Severity;
    file: string;
    line?: number;
    title: string;
    description: string;
    suggestion?: string;
}
export interface ScanConfig {
    githubToken: string;
    scanSecurity: boolean;
    scanLicenses: boolean;
    scanPII: boolean;
    scanAIPatterns: boolean;
    failOnFindings: boolean;
    severityThreshold: Severity;
}
export interface ScanResults {
    total: number;
    security: number;
    license: number;
    pii: number;
    aiPattern: number;
    findings: Finding[];
}
export interface Pattern {
    name: string;
    pattern: RegExp;
    severity: Severity;
    description: string;
    suggestion?: string;
}
