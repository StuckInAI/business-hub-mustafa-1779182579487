import { useParams, useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ArrowLeft, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { getStatusVariant, formatCurrency } from '@/lib/utils';
import type { Salary } from '@/types';

function formatJobType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, applications, candidates } = useStoreContext();

  const job = jobs.find((j) => j.id === jobId);
  if (!job) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <p>Job not found.</p>
        <Button onClick={() => navigate('/jobs')} variant="secondary">Back to Jobs</Button>
      </div>
    );
  }

  const jobApplications = applications.filter((a) => a.jobId === jobId);
  const salary = job.salary as Salary | undefined;

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

      <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Meta */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              <Clock size={16} /> {formatJobType(job.type)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              <MapPin size={16} /> {job.location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: 14 }}>
              <Users size={16} /> {jobApplications.length} applicants
            </div>
            {salary && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', fontSize: 14 }}>
                <DollarSign size={16} />
                {formatCurrency(salary.min, salary.currency)} – {formatCurrency(salary.max, salary.currency)}
              </div>
            )}
            <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
            <Badge variant={getStatusVariant(job.experienceLevel)}>{job.experienceLevel}</Badge>
          </div>

          {/* Description */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Description</h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Requirements</h2>
              <ul style={{ paddingLeft: 20, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 2 }}>
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Responsibilities</h2>
              <ul style={{ paddingLeft: 20, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 2 }}>
                {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14 }}>Applicants</h3>
            {jobApplications.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No applicants yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {jobApplications.map((app) => {
                  const cand = candidates.find((c) => c.id === app.candidateId);
                  return (
                    <div key={app.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13 }}>{cand?.name ?? app.candidateId}</span>
                      <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
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
