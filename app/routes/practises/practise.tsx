import type { Route } from './+types/practise.ts';
import { requireUserId } from '~/session.server.ts';
import { db } from '~/db.server.ts';
import { redirect } from 'react-router';
import { actions, intent } from '~/utils/actions.server.ts';
import { Form } from '~/components/forms/Form.tsx';
import { Input } from '~/components/forms/Input.tsx';
import { Button } from '~/components/forms/Button.tsx';
import * as v from 'valibot';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const userId = await requireUserId(request);
  const practise = await db.practise.findUnique({
    where: {
      id: params.id,
      userId
    },
    include: {
      words: {
        include: {
          word: true,
          results: true
        },
        where: {
          results: {
            none: { correct: true }
          }
        },
        orderBy: {
          results: { _count: 'asc' }
        }
      }
    }
  });

  const word = practise?.words[0];

  if (!word) {
    throw redirect('/practises');
  }

  return {
    name: practise.name,
    wordId: word.id,
    word: word.word.source
  };
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const userId = await requireUserId(request);

  return await actions(request, [
    intent(
      'submitAnswer',
      v.object({
        wordId: v.string(),
        answer: v.string()
      }),
      async (data) => {
        const word = await db.practiseWord.findUnique({
          where: { id: data.wordId },
          include: { word: true }
        });

        if (!word) {
          return { correct: false, word: '' };
        }

        const correct = word.word.destination === data.answer;

        await db.practiseResult.create({
          data: { wordId: data.wordId, correct }
        });

        return { correct, answer: word.word.destination };
      }
    )
  ]);
};

export default function Component({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <div>
      <div>{loaderData.name}</div>
      {loaderData.word}
      <Form method="post">
        <input type="hidden" name="wordId" value={loaderData.wordId} />
        <Input label="Answer" name="answer" autoComplete="off" autoFocus={true} />
        <Button text="Submit" type="submit" name="intent" value="submitAnswer" />
      </Form>
    </div>
  );
}
