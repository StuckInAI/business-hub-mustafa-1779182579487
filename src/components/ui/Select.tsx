import { cn } from '@/lib/utils';
import styles from './Select.module.css';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  className?: string;
  disabled?: boolean;
};

export default function Select({ label, value, onChange, options, error, className, disabled }: SelectProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        className={cn(styles.select, error ? styles.hasError : '')}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
