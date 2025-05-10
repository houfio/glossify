import { Prisma } from '~/prisma/client.ts';
import { parseFormData } from '~/utils/data.server.ts';
import type { StandardSchemaV1 } from '~/utils/standard-schema.ts';

type Action<N extends string, T extends object, E> = {
  name: N;
  handle: (data: FormData) => Promise<ActionResult<T, E>>;
};
type Actions<A extends Action<string, object, unknown>[], E> = {
  [K in keyof A]: A[K] extends Action<infer N, infer T, unknown> ? { action: N } & ActionResult<T, E> : never;
};

type ActionResult<T extends object, E> = ActionSuccess<T> | ActionFailure<E>;
type ActionSuccess<T extends object> = { success: true; data: T; error?: undefined };
type ActionFailure<E> = { success: false; data?: undefined; error: E };

export class ValidationError extends Error {
  readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

  constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
    super('Validation error');

    this.issues = issues;
  }
}

type ActionOptions<E> = {
  key: string;
  handleError: (error: unknown) => E;
};

export const actions = createActions({
  key: 'intent',
  handleError: errorHandler
});

export function createActions<E>(options: ActionOptions<E>) {
  return async <const A extends Action<string, object, unknown>[]>(request: Request, actions: A) => {
    const data = await request.formData();
    const intent = data.get(options.key);
    const action = actions.find((a) => a.name === intent);

    if (!action) {
      throw new Error(`Invalid intent: \`${intent}\``);
    }

    let result: object;

    try {
      result = await action.handle(data);
    } catch (e) {
      const error = options.handleError(e);

      if (e instanceof Response || !error) {
        throw e;
      }

      result = { success: false, error };
    }

    return {
      action: intent,
      ...result
    } as Actions<A, NonNullable<E>>[number];
  };
}

export function intent<N extends string, T extends object, S extends StandardSchemaV1>(
  name: N,
  schema: S,
  handle: (data: StandardSchemaV1.InferOutput<S>) => Promise<T>
): Action<N, T, unknown> {
  return {
    name,
    handle: async (data) => {
      const validated = await schema['~standard'].validate(parseFormData(data));

      if (validated.issues) {
        throw new ValidationError(validated.issues);
      }

      return { success: true, data: await handle(validated.value) };
    }
  };
}

function errorHandler(e: unknown) {
  if (typeof e === 'string') {
    return { message: e, fields: {} };
  }

  if (e instanceof ValidationError) {
    return {
      message: 'Validation error',
      fields: e.issues.reduce<Record<string, string[]>>((previous, current) => {
        const path = current.path?.join('.');

        if (path) {
          previous[path] ??= [];
          previous[path].push(current.message);
        }

        return previous;
      }, {})
    };
  }

  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    const target = e.meta?.target as string[];

    return {
      message: 'Validation error',
      fields: target.reduce<Record<string, string[]>>((previous, current) => {
        previous[current] = ['value already in use'];

        return previous;
      }, {})
    };
  }
}
