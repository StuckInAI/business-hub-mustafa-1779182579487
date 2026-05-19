import styles from './StatCard.module.css';

export type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
};

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.value}>{value}</div>
      {trend && <div className={styles.trend}>{trend}</div>}
    </div>
  );
}
