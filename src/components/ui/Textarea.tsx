import { cn } from '@/lib/utils';
import styles from './Textarea.module.css';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
};

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
  name,
  required,
  disabled,
  rows = 4,
}: TextareaProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <textarea
        className={cn(styles.textarea, error ? styles.hasError : '')}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        disabled={disabled}
        rows={rows}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
