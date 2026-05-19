import { useParams, useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Briefcase, MapPin, Clock, Users, Plus, Edit } from 'lucide-react';
import { useState } from 'react';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, candidates, applications } = useStoreContext();

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
  const appliedCandidates = jobApplications.map((app) => ({
    app,
    candidate: candidates.find((c) => c.id === app.candidateId),
  })).filter((x) => x.candidate);

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
      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Badge variant={getStatusVariant(job.status)}>{job.status.replace(/_/g, ' ')}</Badge>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <MapPin size={14} /> {job.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <Briefcase size={14} /> {job.type}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <Clock size={14} /> Posted {formatDate(job.createdAt)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <Users size={14} /> {jobApplications.length} applicants
          </span>
        </div>

        {job.description && (
          <div style={{ marginBottom: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Description</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{job.description}</p>
          </div>
        )}

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>Applicants ({appliedCandidates.length})</h3>
            <Button size="sm" onClick={() => navigate('/candidates')}>
              <Plus size={14} /> Add Candidate
            </Button>
          </div>
          {appliedCandidates.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No applicants yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Applied</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appliedCandidates.map(({ app, candidate }) => (
                  <tr key={app.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{candidate!.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{candidate!.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge variant={getStatusVariant(app.stage)}>{app.stage.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {formatDate(app.appliedAt)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/candidates/${candidate!.id}`)}>
                        <Edit size={14} /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
