import { cn } from '@/lib/utils';
import styles from './Select.module.css';

export type SelectProps = {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function Select({
  label,
  value,
  onChange,
  error,
  className,
  name,
  required,
  disabled,
  children,
}: SelectProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <select
        className={cn(styles.select, error ? styles.hasError : '')}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
      >
        {children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
