import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatSalary(min?: number, max?: number, currency?: string): string {
  if (!min && !max) return 'Competitive';
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(n);
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return 'Competitive';
}

export function sourceLabel(source: string): string {
  const map: Record<string, string> = {
    careers_page: 'Careers Page',
    linkedin: 'LinkedIn',
    referral: 'Referral',
    agency: 'Agency',
    github: 'GitHub',
    job_board: 'Job Board',
    sourced: 'Sourced',
    other: 'Other',
  };
  return map[source] || source;
}

export function jobTypeLabel(type: string): string {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };
  return map[type] || type;
}

export function workModeLabel(mode: string): string {
  const map: Record<string, string> = {
    remote: 'Remote',
    onsite: 'On-site',
    hybrid: 'Hybrid',
  };
  return map[mode] || mode;
}
