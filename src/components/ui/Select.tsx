import { cn } from '@/lib/utils';
import styles from './Select.module.css';

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  children?: React.ReactNode;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export default function Select({
  label,
  value,
  onChange,
  options,
  children,
  error,
  className,
  name,
  required,
  disabled,
  placeholder,
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
        {placeholder && <option value="">{placeholder}</option>}
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
