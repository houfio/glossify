import type { TypedResponse } from '@vercel/remix';
import { json } from '@vercel/remix';

export function successResponse<T>(data: T): TypedResponse<[success: true, data: T, errors: undefined]>;
export function successResponse<T, S>(data: T, response: S): TypedResponse<[success: S, data: T, errors: undefined]>;

export function successResponse(data: unknown, success = true) {
  return json([success, data, undefined]);
}
