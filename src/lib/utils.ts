import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getInitials(name: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted' {
  switch (status) {
    case 'open':
    case 'active':
    case 'hired':
    case 'completed':
    case 'approved':
      return 'success';
    case 'closed':
    case 'rejected':
    case 'cancelled':
    case 'high':
      return 'danger';
    case 'draft':
    case 'on_hold':
    case 'pending':
    case 'screening':
    case 'scheduled':
      return 'warning';
    case 'interviewing':
    case 'interview':
    case 'technical_interview':
    case 'final_interview':
    case 'phone_screen':
      return 'info';
    case 'offered':
    case 'offer':
      return 'purple';
    case 'new':
    case 'applied':
      return 'default';
    default:
      return 'muted';
  }
}
