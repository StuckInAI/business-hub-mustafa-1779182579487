import { cn } from '@/lib/utils';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  title?: string;
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  type = 'button',
  className,
  title,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(styles.btn, styles[variant], styles[size], className)}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
