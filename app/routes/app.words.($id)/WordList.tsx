import type { Word as WordType } from '@prisma/client';

import styles from './WordList.module.css';

import { Word } from '~/routes/app.words.($id)/Word';

type Props = {
  words: WordType[]
};

export function WordList({ words }: Props) {
  return (
    <>
      <div className={styles.header}>
        WORDS
      </div>
      {words.map((word) => (
        <Word key={word.id} word={word}/>
      ))}
    </>
  );
}
