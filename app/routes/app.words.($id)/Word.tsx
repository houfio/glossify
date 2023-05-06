import type { Word as WordType } from '@prisma/client';

type Props = {
  word: WordType
};

export function Word({ word }: Props) {
  return (
    <div>
      {word.left}
    </div>
  );
}
