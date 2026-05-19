import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { BarChart3, Briefcase, Users, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const { jobs, candidates, applications, interviews } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const totalApplications = applications.length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
  const hiredCount = applications.filter((a) => a.status === 'hired').length;

  // Applications by status
  const statusCounts = applications.reduce<Record<string, number>>((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  // Jobs by department
  const deptCounts = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.department] = (acc[job.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Overview of your hiring pipeline"
      />

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} />
          <StatCard title="Total Candidates" value={candidates.length} icon={<Users size={20} />} />
          <StatCard title="Total Applications" value={totalApplications} icon={<BarChart3 size={20} />} />
          <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} />
        </div>

        {/* Applications by Status */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Applications by Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 100, fontSize: 13, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{status}</div>
                <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'var(--color-primary)',
                    borderRadius: 4,
                    width: jobs.length > 0 ? `${(Number(count) / jobs.length) * 100}%` : '0%',
                  }} />
                </div>
                <div style={{ width: 30, fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{String(count)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs by Department */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Jobs by Department</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(deptCounts).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 140, fontSize: 13, color: 'var(--color-text-secondary)' }}>{dept}</div>
                <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'var(--color-secondary)',
                    borderRadius: 4,
                    width: jobs.length > 0 ? `${(Number(count) / jobs.length) * 100}%` : '0%',
                  }} />
                </div>
                <div style={{ width: 30, fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{String(count)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hire rate */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Hire Rate</h2>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary)' }}>
            {totalApplications > 0 ? `${Math.round((hiredCount / totalApplications) * 100)}%` : '—'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            {hiredCount} hired out of {totalApplications} total applications
          </p>
        </div>
      </div>
    </div>
  );
}
