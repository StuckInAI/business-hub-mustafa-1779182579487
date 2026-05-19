import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, applications, candidates } = useStoreContext();

  const job = jobs.find((j) => j.id === jobId);
  if (!job) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Job not found.</p>
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const jobApplications = applications.filter((a) => a.jobId === jobId);

  return (
    <div>
      <PageHeader
        title={job.title}
        subtitle={`${job.department} · ${job.location}`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/jobs')}>
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />

      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
            <Badge variant="muted">{job.type.replace('_', ' ')}</Badge>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{job.description}</p>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div><span style={{ fontWeight: 600 }}>Posted:</span> {formatDate(job.postedAt)}</div>
            {job.closingDate && <div><span style={{ fontWeight: 600 }}>Closes:</span> {formatDate(job.closingDate)}</div>}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Applications ({jobApplications.length})</h2>
          {jobApplications.length === 0 ? (
            <p style={{ color: 'var(--color-text-secondary)' }}>No applications yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Applied</th>
                </tr>
              </thead>
              <tbody>
                {jobApplications.map((app) => {
                  const candidate = candidates.find((c) => c.id === app.candidateId);
                  return (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>
                          {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                          {candidate?.email}
                        </div>
                      </td>
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
