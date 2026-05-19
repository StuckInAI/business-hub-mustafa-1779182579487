import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, getCandidateStatusVariant } from '@/lib/utils';
import type { CandidateStatus } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { candidates, applications, jobs, updateCandidateStatus } = useStoreContext();

  const candidate = candidates.find((c) => c.id === candidateId);
  if (!candidate) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Candidate not found.</p>
        <Button onClick={() => navigate('/candidates')}>Back to Candidates</Button>
      </div>
    );
  }

  const candidateApplications = applications.filter((a) => a.candidateId === candidateId);

  const statusOptions: CandidateStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];

  return (
    <div>
      <PageHeader
        title={candidate.name}
        subtitle={candidate.email}
        actions={
          <Button variant="secondary" onClick={() => navigate('/candidates')}>
            <ArrowLeft size={16} />
            Back
          </Button>
        }
      />
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Contact Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Phone size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Calendar size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <span>Added {formatDate(candidate.createdAt)}</span>
                </div>
              </div>
            </div>

            {candidate.skills && candidate.skills.length > 0 && (
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="muted">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Update Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateCandidateStatus(candidate.id, s)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      background: candidate.status === s ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: candidate.status === s ? 'white' : 'var(--color-text-primary)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textAlign: 'left',
                      textTransform: 'capitalize',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Current Status</h3>
              <Badge variant={getCandidateStatusVariant(candidate.status)}>
                {candidate.status}
              </Badge>
            </div>

            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Applications</h3>
              {candidateApplications.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>No applications yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {candidateApplications.map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId);
                    return (
                      <div key={app.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Briefcase size={14} style={{ color: 'var(--color-text-muted)' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{job?.title ?? 'Unknown Job'}</span>
                        </div>
                        <Badge variant="default">{app.status}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {candidate.notes && (
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Notes</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{candidate.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
