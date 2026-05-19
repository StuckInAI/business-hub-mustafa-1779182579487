import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted' {
  switch (status) {
    case 'open':
    case 'active':
    case 'hired':
    case 'completed':
      return 'success';
    case 'screening':
    case 'interview':
    case 'scheduled':
    case 'pending':
      return 'info';
    case 'offer':
    case 'offered':
      return 'purple';
    case 'closed':
    case 'rejected':
    case 'cancelled':
      return 'danger';
    case 'on_hold':
    case 'draft':
      return 'warning';
    default:
      return 'muted';
  }
}
