import { cn } from '@/lib/utils';
import styles from './Textarea.module.css';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
};

export default function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  className,
  name,
  required,
}: TextareaProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}> *</span>}</label>}
      <textarea
        className={cn(styles.textarea, error ? styles.hasError : '')}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        name={name}
        required={required}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
