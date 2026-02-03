"use strict";
/**
 * Utility functions for file handling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileExtension = getFileExtension;
exports.getBasename = getBasename;
exports.isTestFile = isTestFile;
exports.isGeneratedFile = isGeneratedFile;
exports.getLanguageFromFilename = getLanguageFromFilename;
function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
}
function getBasename(filepath) {
    return filepath.split('/').pop() || filepath;
}
function isTestFile(filename) {
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
function isGeneratedFile(filename) {
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
function getLanguageFromFilename(filename) {
    const extension = getFileExtension(filename).toLowerCase();
    const languageMap = {
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
//# sourceMappingURL=file-utils.js.map