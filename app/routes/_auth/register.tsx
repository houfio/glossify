import { type } from 'arktype';
import { Form } from '~/components/forms/Form.tsx';
import { Container } from '~/components/layout/Container.tsx';
import { db } from '~/db.server.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import { login } from '~/utils/session.server.ts';
import type { Route } from './+types/register.ts';

export async function loader() {
  const languages = await db.language.findMany({
    select: { id: true, name: true }
  });

  return { languages };
}

export function action({ request, context }: Route.ActionArgs) {
  return actions(request, [
    intent(
      'register',
      type({
        username: 'string >= 3',
        password: 'string > 0',
        languageId: 'string'
      }),
      async (data) => {
        const { hash } = await import('@node-rs/argon2');
        const user = await db.user.create({
          data: {
            username: data.username.toLowerCase(),
            password: await hash(data.password),
            languageId: data.languageId
          }
        });

        throw await login(context, user.id);
      }
    )
  ]);
}

export const handle = {
  title: 'Register'
};

export default function Component({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <Container>
      <Form method="post">
        <input name="username" />
        <input name="password" type="password" />
        <select name="languageId">
          {loaderData.languages.map((language) => (
            <option key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </select>
        <button type="submit" name="intent" value="register">
          Register
        </button>
        <pre>{JSON.stringify(actionData, undefined, 2)}</pre>
      </Form>
    </Container>
  );
}
