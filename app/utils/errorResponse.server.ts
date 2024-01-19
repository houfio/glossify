import type { TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';

import type { FormErrors } from '../types';

export function errorResponse(...errors: (string | readonly [string, string])[]): TypedResponse<[success: false, data: undefined, errors: FormErrors]> {
  return json([
    false,
    undefined,
    errors.map((e) => ({
      field: Array.isArray(e) ? e[0] : undefined,
      message: Array.isArray(e) ? e[1] : e
    }))
  ], 400);
}
