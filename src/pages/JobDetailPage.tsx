import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Salary } from '@/types';

function formatSalary(salary: Salary): string {
  return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, applications, candidates, deleteJob } = useStoreContext();

  const job = jobs.find((j) => j.id === jobId);
  if (!job) {
    return (
      <div style={{ padding: 40 }}>
        <p>Job not found.</p>
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  const jobApplications = applications.filter((a) => a.jobId === jobId);

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'muted'> = {
    open: 'success',
    paused: 'warning',
    closed: 'danger',
    draft: 'muted',
  };

  return (
    <div>
      <PageHeader
        title={job.title}
        subtitle={`${job.department} · ${job.location}`}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate('/jobs')}>
              <ArrowLeft size={16} /> Back
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteJob(job.id);
                navigate('/jobs');
              }}
            >
              <Trash2 size={16} /> Delete
            </Button>
          </>
        }
      />
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge variant={statusVariant[job.status] || 'default'}>{job.status}</Badge>
          <Badge variant="info">{job.type.replace('_', ' ')}</Badge>
          {job.salary && <Badge variant="muted">{formatSalary(job.salary)}</Badge>}
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Job Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            <div><span style={{ fontWeight: 600 }}>Type:</span> {job.type.replace('_', ' ')}</div>
            <div><span style={{ fontWeight: 600 }}>Department:</span> {job.department}</div>
            <div><span style={{ fontWeight: 600 }}>Location:</span> {job.location}</div>
            {job.salary && <div><span style={{ fontWeight: 600 }}>Salary:</span> {formatSalary(job.salary)}</div>}
            {job.closingDate && <div><span style={{ fontWeight: 600 }}>Closes:</span> {formatDate(job.closingDate)}</div>}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Description</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Requirements</h3>
            <ul style={{ fontSize: 14, color: 'var(--color-text-secondary)', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Applications ({jobApplications.length})</h3>
          {jobApplications.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>No applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {jobApplications.map((app) => {
                const candidate = candidates.find((c) => c.id === app.candidateId);
                return (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }} onClick={() => navigate(`/candidates/${app.candidateId}`)}
                  >
                    <span>{candidate ? candidate.name : 'Unknown'}</span>
                    <Badge variant={app.status === 'hired' ? 'success' : app.status === 'rejected' ? 'danger' : 'default'}>{app.status}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
