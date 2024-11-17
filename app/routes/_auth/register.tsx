import * as v from 'valibot';
import { Form } from '~/components/forms/Form.tsx';
import { Container } from '~/components/layout/Container.tsx';
import { db } from '~/db.server.ts';
import { login } from '~/session.server.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import type { Route } from './+types/register.ts';

export const meta: Route.MetaFunction = () => [{ title: 'Register / Glossify' }];

export const loader = async () => {
  const languages = await db.language.findMany({
    select: { id: true, name: true }
  });

  return { languages };
};

export const action = async ({ request }: Route.ActionArgs) =>
  actions(request, [
    intent(
      'register',
      v.object({
        username: v.string(),
        password: v.string(),
        languageId: v.string()
      }),
      async (data) => {
        const { hash } = await import('@node-rs/argon2');
        const user = await db.user.create({
          data: {
            username: data.username,
            password: await hash(data.password),
            languageId: data.languageId
          }
        });

        throw await login(request, user.id);
      }
    )
  ]);

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
