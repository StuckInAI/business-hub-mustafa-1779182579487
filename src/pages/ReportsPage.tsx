import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { BarChart3, Users, Briefcase, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const { jobs, candidates, applications, interviews } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const closedJobs = jobs.filter((j) => j.status === 'closed').length;
  const totalCandidates = candidates.length;
  const hiredCandidates = candidates.filter((c) => c.status === 'hired').length;
  const rejectedCandidates = candidates.filter((c) => c.status === 'rejected').length;
  const conversionRate = totalCandidates > 0 ? Math.round((hiredCandidates / totalCandidates) * 100) : 0;

  const applicationsByStatus = [
    { label: 'Applied', count: applications.filter((a) => a.status === 'applied').length },
    { label: 'Reviewing', count: applications.filter((a) => a.status === 'reviewing').length },
    { label: 'Interview', count: applications.filter((a) => a.status === 'interview').length },
    { label: 'Offer', count: applications.filter((a) => a.status === 'offer').length },
    { label: 'Hired', count: applications.filter((a) => a.status === 'hired').length },
    { label: 'Rejected', count: applications.filter((a) => a.status === 'rejected').length },
  ];

  const completedInterviews = interviews.filter((i) => i.status === 'completed').length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Overview of your recruiting metrics" />
      <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} />
          <StatCard title="Total Candidates" value={totalCandidates} icon={<Users size={20} />} />
          <StatCard title="Hired" value={hiredCandidates} icon={<TrendingUp size={20} />} />
          <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={<BarChart3 size={20} />} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Applications by Stage</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {applicationsByStatus.map(({ label, count }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '80px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                  <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${applications.length > 0 ? (count / applications.length) * 100 : 0}%`, background: 'var(--color-primary)', height: '100%', borderRadius: '999px' }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, width: '24px', textAlign: 'right' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Candidate Pipeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'New', count: candidates.filter(c => c.status === 'new').length },
                { label: 'Screening', count: candidates.filter(c => c.status === 'screening').length },
                { label: 'Interview', count: candidates.filter(c => c.status === 'interview').length },
                { label: 'Offer', count: candidates.filter(c => c.status === 'offer').length },
                { label: 'Hired', count: hiredCandidates },
                { label: 'Rejected', count: rejectedCandidates },
              ].map(({ label, count }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '80px', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                  <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${totalCandidates > 0 ? (count / totalCandidates) * 100 : 0}%`, background: 'var(--color-secondary)', height: '100%', borderRadius: '999px' }} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, width: '24px', textAlign: 'right' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Interview Summary</h3>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{interviews.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Interviews</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-secondary)' }}>{completedInterviews}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>{scheduledInterviews}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Scheduled</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>{closedJobs}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Closed Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
