import styles from './Chip.module.css';

type Props = {
  text: string
};

export function Chip({ text }: Props) {
  return (
    <div className={styles.chip}>
      {text}
    </div>
  );
}
