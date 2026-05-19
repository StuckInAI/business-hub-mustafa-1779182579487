import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function getCandidateStatusVariant(
  status: string
): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted' {
  switch (status) {
    case 'new':
      return 'info';
    case 'screening':
      return 'default';
    case 'interview':
      return 'purple';
    case 'offer':
      return 'warning';
    case 'hired':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'muted';
  }
}
