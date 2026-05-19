import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { Briefcase, Users, Calendar, FileText } from 'lucide-react';
import { formatDate, getCandidateStatusVariant } from '@/lib/utils';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { jobs, candidates, interviews, applications } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const activeApplications = applications.filter((a) => !['hired', 'rejected'].includes(a.status)).length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
  const hiredThisMonth = candidates.filter((c) => c.status === 'hired').length;

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening." />
      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} trend="+2 this week" />
          <StatCard title="Active Applications" value={activeApplications} icon={<FileText size={20} />} trend="+12 this week" />
          <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} />
          <StatCard title="Hired This Month" value={hiredThisMonth} icon={<Users size={20} />} trend="+3 this month" />
        </div>

        <div className={styles.twoCol}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Recent Applications</h2>
            {recentApplications.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No applications yet.</p>
            ) : (
              <div className={styles.list}>
                {recentApplications.map((app) => {
                  const candidate = candidates.find((c) => c.id === app.candidateId);
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className={styles.listItem}>
                      <div>
                        <div className={styles.listItemTitle}>
                          {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                        </div>
                        <div className={styles.listItemSub}>{job?.title ?? 'Unknown Job'}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <Badge variant={getCandidateStatusVariant(app.status as any)}>{app.status}</Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(app.appliedAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Upcoming Interviews</h2>
            {interviews.filter(i => i.status === 'scheduled').length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No upcoming interviews.</p>
            ) : (
              <div className={styles.list}>
                {interviews.filter(i => i.status === 'scheduled').map((interview) => {
                  const candidate = candidates.find((c) => c.id === interview.candidateId);
                  const job = jobs.find((j) => j.id === interview.jobId);
                  return (
                    <div key={interview.id} className={styles.listItem}>
                      <div>
                        <div className={styles.listItemTitle}>
                          {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                        </div>
                        <div className={styles.listItemSub}>{job?.title ?? 'Unknown Job'}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <Badge variant="info">{interview.type}</Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(interview.scheduledAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
