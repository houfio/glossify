import type { ResponseStub } from '@remix-run/server-runtime/dist/single-fetch';
import { isResponseStub } from '@remix-run/server-runtime/dist/single-fetch';
import { unstable_defineAction } from '@vercel/remix';
import { ZodError } from 'zod';

import { setMessage } from '~/session.server';
import type { UnsuccessfulResponse } from '~/types';
import { defineResponse } from '~/utils/defineResponse.server';

type ActionHandler<T> = (data: FormData, request: Request, response: ResponseStub) => Promise<T>;

type Actions = Record<string, ActionHandler<object>>;

type ActionReturn<T, K> = (T | UnsuccessfulResponse) & { action: K };

type Responses<A extends Actions> = {
  [K in keyof A]: A[K] extends ActionHandler<infer T> ? ActionReturn<T, K> : never;
};

export function createActions<A extends Actions>(actions: A) {
  return unstable_defineAction(async ({ request, response }) => {
    const data = await request.formData();
    const intent = data.get('intent');

    if (typeof intent !== 'string' || !(intent in actions)) {
      throw new Error(`Action not found: ${intent}`);
    }

    const respond = (response: object) => ({
      ...response,
      action: intent
    } as unknown as Responses<A>[keyof A]);

    try {
      return respond(await actions[intent](data, request, response));
    } catch (e) {
      if (isResponseStub(e)) {
        throw e;
      } else if (e instanceof ZodError) {
        const issues = e.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));

        await setMessage(request, response, 'The submitted data was invalid');

        return respond(defineResponse(false, issues));
      }

      await setMessage(request, response, 'An unknown error occurred', 'error');

      console.error(e);

      return respond(defineResponse(false));
    }
  });
}
