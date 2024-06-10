import { clsx } from 'clsx';
import type { ReactNode } from 'react';

import styles from './Table.module.scss';

import { withPalette } from '~/utils/withPalette';

type Props<T> = {
  data: T[],
  rowKey: keyof T,
  columns: {
    [K in keyof T]?: ColumnConfig<T, K>
  },
  palette?: string
};

type ColumnConfig<T, K extends keyof T> = {
  title: string,
  render: (row: T[K], data: T) => ReactNode
};

export function Table<T>({ data, rowKey, columns, palette = 'background' }: Props<T>) {
  const columnArrays = Object.entries(columns).map(([key, value]) => ({
    key: key as keyof T & string,
    config: value as ColumnConfig<T, keyof T>
  }));

  return (
    <table style={withPalette(palette)} className={styles.table}>
      <thead className={styles.header}>
        <tr>
          {columnArrays.map(({ key, config }) => (
            <th
              key={key}
              className={clsx(styles.head, !config.title && styles.small)}
            >
              {config.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={String(row[rowKey])}>
            {columnArrays.map(({ key, config }) => (
              <td key={key} className={styles.body}>
                {config.render(row[key], row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
