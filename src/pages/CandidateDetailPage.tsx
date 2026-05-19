import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trash2 } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, formatDateTime, getCandidateStatusVariant } from '@/lib/utils';
import type { CandidateStatus } from '@/types';

export default function CandidateDetailPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const { candidates, updateCandidate, deleteCandidate, addNote } = useStoreContext();
  const candidate = candidates.find((c) => c.id === candidateId);
  const [noteText, setNoteText] = useState('');

  if (!candidate) {
    return (
      <div style={{ padding: 32 }}>
        <Button variant="ghost" onClick={() => navigate('/candidates')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <p style={{ marginTop: 24 }}>Candidate not found.</p>
      </div>
    );
  }

  const handleStatusChange = (status: CandidateStatus) => {
    updateCandidate(candidate.id, { candidateStatus: status, stage: status });
  };

  const handleRating = (rating: number) => {
    updateCandidate(candidate.id, { rating });
  };

  const handleDelete = () => {
    if (confirm('Delete this candidate?')) {
      deleteCandidate(candidate.id);
      navigate('/candidates');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(candidate.id, noteText.trim());
    setNoteText('');
  };

  const STATUSES: CandidateStatus[] = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn'];

  return (
    <div>
      <PageHeader
        title={candidate.name}
        subtitle={candidate.jobTitle}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={() => navigate('/candidates')}>
              <ArrowLeft size={16} /> Back
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        }
      />
      <div style={{ padding: '24px 32px', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Left column */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Contact</h3>
            <p style={{ fontSize: 14, marginBottom: 8 }}><strong>Email:</strong> {candidate.email}</p>
            {candidate.phone && <p style={{ fontSize: 14, marginBottom: 8 }}><strong>Phone:</strong> {candidate.phone}</p>}
            <p style={{ fontSize: 14, marginBottom: 8 }}><strong>Source:</strong> {candidate.source}</p>
            <p style={{ fontSize: 14, marginBottom: 8 }}><strong>Applied:</strong> {formatDate(candidate.appliedAt)}</p>
            {candidate.tags.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {candidate.tags.map((tag) => <Badge key={tag} variant="muted">{tag}</Badge>)}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Status</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STATUSES.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={candidate.candidateStatus === s ? 'primary' : 'secondary'}
                  onClick={() => handleStatusChange(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Rating</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map((n) => (
                <button
                  key={n}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: n <= (candidate.rating ?? 0) ? 'var(--color-warning)' : 'var(--color-border)' }}
                  onClick={() => handleRating(n)}
                >
                  <Star size={22} fill={n <= (candidate.rating ?? 0) ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Current Stage</h3>
            <Badge variant={getCandidateStatusVariant(candidate.candidateStatus)} className="">
              {candidate.candidateStatus.charAt(0).toUpperCase() + candidate.candidateStatus.slice(1)}
            </Badge>
          </div>

          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Notes</h3>
            <form onSubmit={handleAddNote} style={{ marginBottom: 16 }}>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', resize: 'vertical', fontSize: 14, fontFamily: 'inherit' }}
              />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" size="sm">Add Note</Button>
              </div>
            </form>
            {candidate.notes.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>No notes yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {candidate.notes.map((note) => (
                  <div key={note.id} style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: 14 }}>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                      {note.authorName} &middot; {formatDateTime(note.createdAt)}
                    </div>
                    <p style={{ fontSize: 14 }}>{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
