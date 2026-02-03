/**
 * Utility functions for file handling
 */

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? `.${parts.pop()}` : '';
}

export function getBasename(filepath: string): string {
  return filepath.split('/').pop() || filepath;
}

export function isTestFile(filename: string): boolean {
  const testPatterns = [
    /\.(test|spec)\.[jt]sx?$/,
    /\.(test|spec)\.[mc]?js$/,
    /__tests__\//,
    /__mocks__\//,
    /\.stories\.[jt]sx?$/,
    /test_.*\.py$/,
    /.*_test\.py$/,
    /.*_test\.go$/,
    /Test.*\.java$/,
    /.*Test\.java$/,
  ];

  return testPatterns.some(pattern => pattern.test(filename));
}

export function isGeneratedFile(filename: string): boolean {
  const generatedPatterns = [
    /\.min\.[jc]ss?$/,
    /\.bundle\.js$/,
    /\.generated\./,
    /\/dist\//,
    /\/build\//,
    /\/node_modules\//,
    /\/vendor\//,
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
    /Gemfile\.lock$/,
    /poetry\.lock$/,
    /Cargo\.lock$/,
    /go\.sum$/,
  ];

  return generatedPatterns.some(pattern => pattern.test(filename));
}

export function getLanguageFromFilename(filename: string): string | null {
  const extension = getFileExtension(filename).toLowerCase();

  const languageMap: Record<string, string> = {
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
    '.py': 'python',
    '.rb': 'ruby',
    '.go': 'go',
    '.rs': 'rust',
    '.java': 'java',
    '.kt': 'kotlin',
    '.kts': 'kotlin',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cc': 'cpp',
    '.h': 'c',
    '.hpp': 'cpp',
    '.cs': 'csharp',
    '.swift': 'swift',
    '.php': 'php',
    '.vue': 'vue',
    '.svelte': 'svelte',
  };

  return languageMap[extension] || null;
}
