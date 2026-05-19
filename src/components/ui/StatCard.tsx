import styles from './StatCard.module.css';

export type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      {icon && (
        <div className={styles.iconWrapper} data-color={color}>
          {icon}
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
}
