import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function JobDetailPage() {
  const { jobId } = useParams();
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
            <ArrowLeft size={16} />
            Back
          </Button>
        }
      />
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Job Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><span style={{ fontWeight: 600 }}>Type:</span> {job.type.replace('_', ' ')}</div>
                {job.salary && <div><span style={{ fontWeight: 600 }}>Salary:</span> {job.salary}</div>}
                {job.closingAt && <div><span style={{ fontWeight: 600 }}>Closes:</span> {formatDate(job.closingAt)}</div>}
              </div>
            </div>

            {job.description && (
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Description</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{job.description}</p>
              </div>
            )}

            {job.requirements && (
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Requirements</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Status</h3>
              <Badge variant={job.status === 'open' ? 'success' : job.status === 'closed' ? 'danger' : 'warning'}>
                {job.status}
              </Badge>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Applications ({jobApplications.length})</h3>
              {jobApplications.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No applications yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {jobApplications.map((app) => {
                    const candidate = candidates.find((c) => c.id === app.candidateId);
                    return (
                      <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
                        <span>{candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}</span>
                        <Badge variant="default">{app.status}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
