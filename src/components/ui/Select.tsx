import { cn } from '@/lib/utils';
import styles from './Select.module.css';

export type SelectProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
};

export default function Select({
  label,
  value,
  onChange,
  options,
  error,
  className,
  name,
  required,
  disabled,
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
        onChange={(e) => onChange?.(e.target.value)}
        name={name}
        required={required}
        disabled={disabled}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
