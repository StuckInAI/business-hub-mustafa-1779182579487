import styles from './StatCard.module.css';

type TrendDir = 'up' | 'down' | 'neutral';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; direction: TrendDir };
};

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.iconBox}>{icon}</div>}
      <div className={styles.info}>
        <div className={styles.value}>{value}</div>
        <div className={styles.title}>{title}</div>
        {trend && (
          <div className={`${styles.trend} ${styles[trend.direction]}`}>
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
