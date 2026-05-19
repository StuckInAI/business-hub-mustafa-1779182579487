import styles from './StatCard.module.css';

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
};

export default function StatCard({ label, value, icon, trend, trendUp, color }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ background: color || 'var(--color-primary-light)' }}>
        {icon}
      </div>
      <div className={styles.body}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {trend && (
          <div className={[styles.trend, trendUp ? styles.up : styles.down].join(' ')}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
