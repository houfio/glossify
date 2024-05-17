import type { Issue } from '~/types';

export function respond<T = undefined>(success: true, data?: T): { success: true, data: T };
export function respond(success: false, issues?: Issue[]): { success: false, issues: Issue[] };

export function respond(success: boolean, dataOrIssues?: unknown) {
  if (success) {
    return {
      success,
      data: dataOrIssues
    };
  }

  const issues = dataOrIssues as (string | Issue)[] ?? [];

  return {
    success,
    issues: issues.map((issue) => typeof issue !== 'string' ? issue : {
      message: issue
    })
  };
}
