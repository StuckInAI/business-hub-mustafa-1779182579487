import { useParams, useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Tag } from 'lucide-react';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
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

  const candidateApps = applications.filter((a) => a.candidateId === candidateId);

  return (
    <div>
      <PageHeader
        title={candidate.name}
        subtitle={candidate.currentTitle || 'Candidate'}
        actions={
          <Button variant="secondary" onClick={() => navigate('/candidates')}>
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />
      <div style={{ padding: '1.5rem 2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
        {/* Sidebar info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <Badge variant={getStatusVariant(candidate.status)}>{candidate.status}</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                <span>{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                  <Phone size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{candidate.phone}</span>
                </div>
              )}
              {candidate.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                  <MapPin size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{candidate.location}</span>
                </div>
              )}
              {candidate.currentTitle && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                  <Briefcase size={14} style={{ color: 'var(--color-text-muted)' }} />
                  <span>{candidate.currentTitle}</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Added {formatDate(candidate.createdAt)}
            </div>
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Tag size={14} /> Skills
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="muted">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Update Status</label>
            <select
              value={candidate.status}
              onChange={(e) => updateCandidateStatus(candidate.id, e.target.value as any)}
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              {['new', 'screening', 'interviewing', 'offered', 'hired', 'rejected'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontWeight: 700 }}>Applications ({candidateApps.length})</h3>
            </div>
            {candidateApps.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No applications yet.</div>
            ) : (
              <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {candidateApps.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{job?.title || 'Unknown Job'}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{job?.department}</div>
                        </div>
                        <Badge variant={getStatusVariant(app.stage)}>{app.stage.replace(/_/g, ' ')}</Badge>
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Applied {formatDate(app.appliedAt)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {candidate.notes && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Notes</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{candidate.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
