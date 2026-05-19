import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { BarChart3, Users, Briefcase, Calendar, TrendingUp, Clock } from 'lucide-react';

export default function ReportsPage() {
  const { jobs, candidates, applications, interviews } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const totalCandidates = candidates.length;
  const totalApplications = applications.length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
  const hiredCandidates = candidates.filter((c) => c.status === 'hired').length;
  const offeredCandidates = candidates.filter((c) => c.status === 'offered').length;

  const conversionRate = totalCandidates > 0 ? Math.round((hiredCandidates / totalCandidates) * 100) : 0;

  // Stage funnel
  const stages = ['applied', 'screening', 'interview', 'offer', 'hired'];
  const stageCounts = stages.map((stage) => ({
    stage,
    count: applications.filter((a) => a.stage === stage || (stage === 'interview' && a.stage === 'technical_interview') || (stage === 'interview' && a.stage === 'final_interview')).length,
  }));

  // Source breakdown
  const sources = ['direct', 'referral', 'linkedin', 'job_board', 'careers_page'];
  const sourceCounts = sources.map((source) => ({
    source,
    count: candidates.filter((c) => c.source === source).length,
  })).filter((s) => s.count > 0);

  // Department breakdown
  const deptMap: Record<string, number> = {};
  jobs.forEach((j) => {
    deptMap[j.department] = (deptMap[j.department] || 0) + 1;
  });
  const deptBreakdown = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Recruiting analytics overview" />
      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} />
          <StatCard title="Total Candidates" value={totalCandidates} icon={<Users size={20} />} />
          <StatCard title="Applications" value={totalApplications} icon={<BarChart3 size={20} />} />
          <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} />
          <StatCard title="Hired" value={hiredCandidates} icon={<TrendingUp size={20} />} />
          <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={<Clock size={20} />} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Hiring Funnel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stageCounts.map(({ stage, count }) => (
                <div key={stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{stage.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ background: 'var(--color-border)', borderRadius: 'var(--radius-full)', height: 8 }}>
                    <div style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-full)', height: 8, width: `${totalApplications > 0 ? (count / totalApplications) * 100 : 0}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Candidates by Source</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sourceCounts.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No data yet.</p>
              ) : sourceCounts.map(({ source, count }) => (
                <div key={source}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{source.replace(/_/g, ' ')}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ background: 'var(--color-border)', borderRadius: 'var(--radius-full)', height: 8 }}>
                    <div style={{ background: 'var(--color-secondary)', borderRadius: 'var(--radius-full)', height: 8, width: `${totalCandidates > 0 ? (count / totalCandidates) * 100 : 0}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Jobs by Department</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {deptBreakdown.map(([dept, count]) => (
              <div key={dept} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{dept}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>({count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
