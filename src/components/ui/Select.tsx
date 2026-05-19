import { cn } from '@/lib/utils';
import styles from './Select.module.css';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
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
  placeholder,
  error,
  className,
  name,
  required,
  disabled,
}: SelectProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <select
        className={cn(styles.select, error ? styles.hasError : '')}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
