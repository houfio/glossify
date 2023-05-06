import type { TypedResponse } from '@vercel/remix';
import { json } from '@vercel/remix';

import type { FormErrors } from '~/types';

export function errorResponse(...errors: (string | readonly [string, string])[]): TypedResponse<{ success: false, errors: FormErrors }> {
  if (!errors.length) {
    errors = ['Something went wrong'];
  }

  return json({
    success: false,
    errors: errors.map((e) => ({
      field: Array.isArray(e) ? e[0] : undefined,
      message: Array.isArray(e) ? e[1] : e
    }))
  }, 400);
}
