import { faCactus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mergeProps } from '@react-aria/utils';
import type { ReactNode } from 'react';
import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  type TableProps
} from 'react-aria-components';
import { withPalette } from '~/utils/styles.ts';
import styles from './Table.module.scss';

type Props<T> = Omit<TableProps, 'children'> & {
  rows: T[];
  rowKey: keyof T;
  columns: Column<T>[];
  palette?: string;
};

type Column<T> = {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
};

export function Table<T>({ rows, rowKey, columns, palette = 'surface', ...props }: Props<T>) {
  return (
    <AriaTable {...mergeProps(props, { className: styles.table, style: withPalette(palette) })}>
      <AriaTableHeader>
        {columns.map((column, index) => (
          <AriaColumn key={column.key} className={styles.column} isRowHeader={index === 0}>
            {column.title}
          </AriaColumn>
        ))}
      </AriaTableHeader>
      <AriaTableBody
        renderEmptyState={() => (
          <div className={styles.empty}>
            <FontAwesomeIcon icon={faCactus} />
            There's nothing to see here
          </div>
        )}
      >
        {rows.map((row) => (
          <AriaRow key={String(row[rowKey])} className={styles.row}>
            {columns.map((column) => (
              <AriaCell key={column.key} className={styles.cell}>
                {column.render(row)}
              </AriaCell>
            ))}
          </AriaRow>
        ))}
      </AriaTableBody>
    </AriaTable>
  );
}
