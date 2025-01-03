import { Prisma } from '@prisma/client/index.js';
import * as v from 'valibot';
import { type BaseIssue, type BaseSchema, type InferOutput, ValiError } from 'valibot';
import { parseFormData } from '~/utils/data.server.ts';

type Action<N extends string, T extends object> = {
  name: N;
  handle: (data: FormData) => Promise<ActionResult<T>>;
};
type Actions<A extends Action<string, object>[]> = {
  [K in keyof A]: A[K] extends Action<infer N, infer T> ? { action: N } & ActionResult<T> : never;
};

type ActionResult<T extends object> = ActionSuccess<T> | ActionFail;
type ActionSuccess<T extends object> = { success: true; data: T; error?: undefined };
type ActionFail = { success: false; data?: undefined; error: ActionError };
type ActionError = { message: string; fields: Record<string, string[] | undefined> };

export async function actions<const A extends Action<string, object>[]>(request: Request, actions: A) {
  const data = await request.formData();
  const intent = data.get('intent');
  const action = actions.find((a) => a.name === intent);

  if (!action) {
    throw new Error(`Invalid intent: \`${intent}\``);
  }

  return {
    action: intent,
    ...(await action.handle(data))
  } as Actions<A>[number];
}

export function intent<
  N extends string,
  T extends object,
  const S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>
>(
  name: N,
  schema: S,
  handle: (data: InferOutput<S>) => Promise<T>,
  handleError?: (e: unknown) => ActionError | undefined
): Action<N, T> {
  return {
    name,
    handle: async (data) => {
      try {
        const validated = v.parse(schema, parseFormData(data));

        return { success: true, data: await handle(validated) };
      } catch (e) {
        if (e instanceof Response) {
          throw e;
        }

        const error = handleError?.(e) ?? errorHandler(e);

        if (!error) {
          console.error(e);
        }

        return {
          success: false,
          error: error ?? { message: 'Unknown error', fields: {} }
        };
      }
    }
  };
}

function errorHandler(e: unknown): ActionError | undefined {
  if (typeof e === 'string') {
    return { message: e, fields: {} };
  }

  if (e instanceof ValiError) {
    const issues = v.flatten(e.issues);

    return { message: 'Validation error', fields: issues.nested ?? {} };
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    const target = e.meta?.target as string[];

    return {
      message: 'Validation error',
      fields: target.reduce<Record<string, string[]>>((previous, current) => {
        previous[current] = ['Duplicate: This value is already in use'];

        return previous;
      }, {})
    };
  }
}
