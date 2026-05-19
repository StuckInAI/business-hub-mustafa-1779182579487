import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, Plus, Clock, User } from 'lucide-react';
import { formatDate, getStatusVariant } from '@/lib/utils';
import type { InterviewType } from '@/types';

export default function InterviewsPage() {
  const { interviews, candidates, jobs, applications, addInterview } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    applicationId: '',
    type: 'phone_screen' as InterviewType,
    scheduledAt: '',
    duration: 60,
    interviewers: '',
    notes: '',
  });

  const handleSubmit = () => {
    if (!form.applicationId || !form.scheduledAt) return;
    addInterview({
      applicationId: form.applicationId,
      type: form.type,
      scheduledAt: form.scheduledAt,
      duration: form.duration,
      interviewers: form.interviewers.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'scheduled',
      notes: form.notes,
      feedback: '',
      rating: null,
    });
    setShowModal(false);
    setForm({ applicationId: '', type: 'phone_screen', scheduledAt: '', duration: 60, interviewers: '', notes: '' });
  };

  const getAppDetails = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return null;
    const candidate = candidates.find((c) => c.id === app.candidateId);
    const job = jobs.find((j) => j.id === app.jobId);
    return { candidate, job };
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} scheduled`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Schedule Interview
          </Button>
        }
      />
      <div style={{ padding: '1.5rem 2rem' }}>
        {interviews.length === 0 ? (
          <EmptyState
            icon={<Calendar size={32} />}
            title="No interviews scheduled"
            description="Schedule your first interview to get started."
            action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Schedule Interview</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {interviews.map((interview) => {
              const details = getAppDetails(interview.applicationId);
              return (
                <div key={interview.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>
                        {details?.candidate?.name || 'Unknown'} — {details?.job?.title || 'Unknown Job'}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          <Clock size={13} /> {formatDate(interview.scheduledAt)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          <Calendar size={13} /> {interview.duration} min
                        </span>
                        {interview.interviewers.length > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            <User size={13} /> {interview.interviewers.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Badge variant="info">{interview.type.replace(/_/g, ' ')}</Badge>
                      <Badge variant={getStatusVariant(interview.status)}>{interview.status}</Badge>
                    </div>
                  </div>
                  {interview.notes && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      {interview.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Select
            label="Application"
            value={form.applicationId}
            onChange={(e) => setForm({ ...form, applicationId: e.target.value })}
            options={[
              { value: '', label: 'Select application...' },
              ...applications.map((app) => {
                const candidate = candidates.find((c) => c.id === app.candidateId);
                const job = jobs.find((j) => j.id === app.jobId);
                return { value: app.id, label: `${candidate?.name || '?'} — ${job?.title || '?'}` };
              }),
            ]}
          />
          <Select
            label="Interview Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as InterviewType })}
            options={[
              { value: 'phone_screen', label: 'Phone Screen' },
              { value: 'technical', label: 'Technical' },
              { value: 'behavioral', label: 'Behavioral' },
              { value: 'panel', label: 'Panel' },
              { value: 'final', label: 'Final' },
            ]}
          />
          <Input
            label="Date & Time"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            value={String(form.duration)}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
          />
          <Input
            label="Interviewers (comma separated)"
            value={form.interviewers}
            onChange={(e) => setForm({ ...form, interviewers: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
