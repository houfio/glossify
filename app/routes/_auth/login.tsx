import * as v from 'valibot';
import { Form } from '~/components/forms/Form.tsx';
import { Container } from '~/components/layout/Container.tsx';
import { db } from '~/db.server.ts';
import { login } from '~/session.server.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import type { Route } from './+types/login.ts';

export const meta: Route.MetaFunction = () => [{ title: 'Login / Glossify' }];

export const action = async ({ request }: Route.ActionArgs) =>
  actions(request, [
    intent(
      'login',
      v.object({
        username: v.pipe(v.string(), v.minLength(3), v.toLowerCase()),
        password: v.string()
      }),
      async (data) => {
        const { verify } = await import('@node-rs/argon2');
        const user = await db.user.findUnique({
          where: { username: data.username }
        });

        if (!user || !(await verify(user.password, data.password))) {
          throw 'Invalid username or password';
        }

        throw await login(request, user.id);
      }
    )
  ]);

export default function Component({ actionData }: Route.ComponentProps) {
  return (
    <Container>
      <Form method="post">
        <input name="username" />
        <input name="password" type="password" />
        <button type="submit" name="intent" value="login">
          Login
        </button>
        <pre>{JSON.stringify(actionData, undefined, 2)}</pre>
      </Form>
    </Container>
  );
}
