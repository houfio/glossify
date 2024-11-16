import { faCactus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import styles from './Table.module.scss';

type Props<T> = {
  data: T[];
  rowKey: keyof T;
  columns: {
    [K in keyof T]?: ColumnConfig<T, K>;
  };
};

type ColumnConfig<T, K extends keyof T> = {
  title: string;
  render: (row: T[K], data: T) => ReactNode;
};

export function Table<T>({ data, rowKey, columns }: Props<T>) {
  const columnArrays = Object.entries(columns).map(([key, value]) => ({
    key: key as keyof T & string,
    config: value as ColumnConfig<T, keyof T>
  }));

  return (
    <table className={styles.table}>
      <thead className={styles.header}>
        <tr>
          {columnArrays.map(({ key, config }) => (
            <th key={key} className={clsx(styles.head, !config.title && styles.small)}>
              {config.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((row) => (
            <tr key={String(row[rowKey])} className={styles.row}>
              {columnArrays.map(({ key, config }) => (
                <td key={key} className={styles.body}>
                  {config.render(row[key], row)}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr className={styles.row}>
            <td colSpan={columnArrays.length} className={styles.body}>
              <div className={styles.empty}>
                <FontAwesomeIcon icon={faCactus} size="xl" />
                There's nothing to see here
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
