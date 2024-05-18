import type { Issue, SuccessfulResponse, UnsuccessfulResponse } from '~/types';

export function defineResponse<T = undefined>(success: true, data?: T): SuccessfulResponse<T>;
export function defineResponse(success: false, issues?: Issue[]): UnsuccessfulResponse;

export function defineResponse(success: boolean, dataOrIssues?: unknown) {
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
