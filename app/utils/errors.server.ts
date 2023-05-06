import type { TypedResponse } from '@vercel/remix';
import { json } from '@vercel/remix';

import type { FormErrors } from '~/types';

export function errors(...err: (string | readonly [string, string])[]): TypedResponse<{ errors: FormErrors }> {
  if (!err.length) {
    err = ['Something went wrong'];
  }

  return json(
    {
      errors: err.map((e) => ({
        field: Array.isArray(e) ? e[0] : undefined,
        message: Array.isArray(e) ? e[1] : e
      }))
    },
    400
  );
}
