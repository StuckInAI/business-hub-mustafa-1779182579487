import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  const { jobs, candidates, applications, interviews } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const totalCandidates = candidates.length;
  const hiredCandidates = candidates.filter((c) => c.status === 'hired').length;
  const offeredCandidates = candidates.filter((c) => c.status === 'offer').length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;
  const completedInterviews = interviews.filter((i) => i.status === 'completed').length;
  const totalApplications = applications.length;
  const hireRate = totalApplications > 0 ? Math.round((hiredCandidates / totalApplications) * 100) : 0;

  const statRows = [
    { label: 'Open Jobs', value: openJobs },
    { label: 'Total Candidates', value: totalCandidates },
    { label: 'Hired', value: hiredCandidates },
    { label: 'Offered', value: offeredCandidates },
    { label: 'Scheduled Interviews', value: scheduledInterviews },
    { label: 'Completed Interviews', value: completedInterviews },
    { label: 'Total Applications', value: totalApplications },
    { label: 'Hire Rate', value: `${hireRate}%` },
  ];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Key recruiting metrics" />
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {statRows.map((row) => (
            <div
              key={row.label}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{row.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{row.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} /> Pipeline Breakdown
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Stage</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'] as const).map((stage) => (
                <tr key={stage} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{stage}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    {applications.filter((a) => a.status === stage).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
