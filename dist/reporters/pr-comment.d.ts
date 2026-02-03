import { ScanResults } from '../types';
/**
 * PR Comment Reporter
 *
 * Posts scan results as a comment on the pull request.
 * Groups findings by type and severity for easy review.
 */
type Octokit = ReturnType<typeof import('@actions/github').getOctokit>;
export declare function postPRComment(octokit: Octokit, owner: string, repo: string, prNumber: number, results: ScanResults): Promise<void>;
export {};
//# sourceMappingURL=pr-comment.d.ts.map