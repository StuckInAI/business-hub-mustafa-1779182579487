import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { BarChart3, Briefcase, Users, Calendar, Gift } from 'lucide-react';

export default function ReportsPage() {
  const { jobs, candidates, applications, interviews, referrals } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const totalCandidates = candidates.length;
  const totalApplications = applications.length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
  const totalReferrals = referrals.length;
  const hiredReferrals = referrals.filter((r) => r.status === 'hired').length;

  const applicationsByStatus = [
    'applied', 'screening', 'interview', 'offer', 'hired', 'rejected'
  ].map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));

  const jobsByDepartment = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.department] = (acc[job.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Analytics and insights"
      />
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} />
          <StatCard title="Total Candidates" value={totalCandidates} icon={<Users size={20} />} />
          <StatCard title="Total Applications" value={totalApplications} icon={<BarChart3 size={20} />} />
          <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} />
          <StatCard title="Total Referrals" value={totalReferrals} icon={<Gift size={20} />} />
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Applications by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {applicationsByStatus.map(({ status, count }) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 100, fontSize: 13, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{status}</div>
                <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 4, height: 16, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: totalApplications > 0 ? `${(count / totalApplications) * 100}%` : '0%',
                      background: 'var(--color-primary)',
                      borderRadius: 4,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
                <div style={{ width: 30, fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Jobs by Department</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(jobsByDepartment).map(([dept, count]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 160, fontSize: 13, color: 'var(--color-text-secondary)' }}>{dept}</div>
                <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: 4, height: 16, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: jobs.length > 0 ? `${(count / jobs.length) * 100}%` : '0%',
                      background: 'var(--color-secondary)',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div style={{ width: 30, fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Referral Conversion</h3>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            <p>{hiredReferrals} out of {totalReferrals} referrals converted to hires.</p>
            {totalReferrals > 0 && (
              <p style={{ marginTop: 8 }}>
                Conversion rate: <strong>{Math.round((hiredReferrals / totalReferrals) * 100)}%</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
