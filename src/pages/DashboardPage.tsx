import { useMemo } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import styles from './DashboardPage.module.css';
import type { CandidateStatus } from '@/types';

const statusVariant: Record<CandidateStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
  new: 'default',
  screening: 'info',
  interview: 'warning',
  offer: 'purple' as any,
  hired: 'success',
  rejected: 'danger',
  withdrawn: 'muted',
};

export default function DashboardPage() {
  const { jobs, candidates, interviews } = useStoreContext();

  const stats = useMemo(() => ({
    openJobs: jobs.filter((j) => j.status === 'open').length,
    totalCandidates: candidates.length,
    scheduledInterviews: interviews.filter((i) => i.status === 'scheduled').length,
    hireRate: candidates.length
      ? Math.round((candidates.filter((c) => c.status === 'hired').length / candidates.length) * 100)
      : 0,
  }), [jobs, candidates, interviews]);

  const recentCandidates = useMemo(
    () => [...candidates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [candidates]
  );

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter((i) => i.status === 'scheduled' && new Date(i.scheduledAt) > new Date())
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 5),
    [interviews]
  );

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening." />

      <div className={styles.statsGrid}>
        <StatCard title="Open Jobs" value={stats.openJobs} icon={<Briefcase size={22} />} color="primary" />
        <StatCard title="Total Candidates" value={stats.totalCandidates} icon={<Users size={22} />} color="secondary" />
        <StatCard title="Scheduled Interviews" value={stats.scheduledInterviews} icon={<Calendar size={22} />} color="warning" />
        <StatCard title="Hire Rate" value={`${stats.hireRate}%`} icon={<TrendingUp size={22} />} color="success" />
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Recent Candidates</h2>
          <div className={styles.list}>
            {recentCandidates.length === 0 && (
              <p className={styles.empty}>No candidates yet.</p>
            )}
            {recentCandidates.map((c) => {
              const job = jobs.find((j) => j.id === c.jobId);
              const candidate = c;
              return (
                <div key={c.id} className={styles.listItem}>
                  <div className={styles.avatar}>
                    {candidate ? `${candidate.firstName[0]}${candidate.lastName[0]}` : '?'}
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>
                      {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                    </span>
                    <span className={styles.itemSub}>{job?.title ?? 'No position'}</span>
                  </div>
                  <Badge variant={statusVariant[c.status]}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.panelTitle}>Upcoming Interviews</h2>
          <div className={styles.list}>
            {upcomingInterviews.length === 0 && (
              <p className={styles.empty}>No upcoming interviews.</p>
            )}
            {upcomingInterviews.map((iv) => {
              const candidate = candidates.find((c) => c.id === iv.candidateId);
              const job = jobs.find((j) => j.id === iv.jobId);
              return (
                <div key={iv.id} className={styles.listItem}>
                  <div className={styles.avatar}>
                    {candidate ? `${candidate.firstName[0]}${candidate.lastName[0]}` : '?'}
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>
                      {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                    </span>
                    <span className={styles.itemSub}>{job?.title} · {formatDate(iv.scheduledAt)}</span>
                  </div>
                  <Badge variant="info">{iv.type}</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
