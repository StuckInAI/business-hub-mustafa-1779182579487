import { useMemo } from 'react';
import { Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function DashboardPage() {
  const { jobs, candidates, interviews, applications } = useStoreContext();

  const stats = useMemo(() => ({
    openJobs: jobs.filter((j) => j.status === 'open').length,
    totalCandidates: candidates.length,
    scheduledInterviews: interviews.filter((i) => i.status === 'scheduled').length,
    hireRate: applications.length > 0
      ? Math.round((candidates.filter((c) => c.status === 'hired').length / applications.length) * 100)
      : 0,
  }), [jobs, candidates, interviews, applications]);

  const recentApplications = useMemo(() =>
    [...applications]
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 5),
    [applications]
  );

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening." />

      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <StatCard title="Open Jobs" value={stats.openJobs} icon={<Briefcase size={22} />} color="primary" />
          <StatCard title="Total Candidates" value={stats.totalCandidates} icon={<Users size={22} />} color="secondary" />
          <StatCard title="Scheduled Interviews" value={stats.scheduledInterviews} icon={<Calendar size={22} />} color="warning" />
          <StatCard title="Hire Rate" value={`${stats.hireRate}%`} icon={<TrendingUp size={22} />} color="success" />
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No applications yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Job</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Applied</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => {
                  const candidate = candidates.find((c) => c.id === app.candidateId);
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{job?.title || 'Unknown'}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{formatDate(app.appliedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
