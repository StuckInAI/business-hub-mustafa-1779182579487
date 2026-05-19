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
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatCurrency(amount: number, currency = '$'): string {
  return `${currency}${amount.toLocaleString()}`;
}

export function getStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted' {
  const map: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
    // Job statuses
    open: 'success',
    draft: 'muted',
    paused: 'warning',
    closed: 'danger',
    // Application statuses
    new: 'default',
    screening: 'info',
    interview: 'purple',
    offer: 'warning',
    hired: 'success',
    rejected: 'danger',
    withdrawn: 'muted',
    // Interview statuses
    scheduled: 'info',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'warning',
    // Requisition statuses
    pending: 'warning',
    approved: 'success',
    fulfilled: 'success',
    // Referral statuses
    reviewed: 'info',
    // Priority
    low: 'muted',
    medium: 'info',
    high: 'warning',
    urgent: 'danger',
  };
  return map[status] ?? 'default';
}
