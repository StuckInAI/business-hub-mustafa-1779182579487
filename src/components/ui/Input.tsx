import { cn } from '@/lib/utils';
import styles from './Input.module.css';

type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
};

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  className,
  name,
  required,
  disabled,
}: InputProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <input
        className={cn(styles.input, error ? styles.hasError : '')}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
