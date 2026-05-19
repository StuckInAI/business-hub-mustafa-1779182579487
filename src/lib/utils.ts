import { clsx, type ClassValue } from 'clsx';
import type { CandidateStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function getCandidateStatusVariant(
  status: CandidateStatus
): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted' {
  switch (status) {
    case 'new':
      return 'default';
    case 'screening':
      return 'info';
    case 'interview':
      return 'purple';
    case 'offer':
      return 'warning';
    case 'hired':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'withdrawn':
      return 'muted';
    default:
      return 'default';
  }
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
