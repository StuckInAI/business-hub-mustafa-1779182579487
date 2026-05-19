import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate, getStatusVariant } from '@/lib/utils';
import type { InterviewType } from '@/types';

type FormState = {
  jobId: string;
  candidateId: string;
  type: InterviewType;
  scheduledAt: string;
  duration: number;
  interviewers: string;
  notes: string;
};

export default function InterviewsPage() {
  const { interviews, jobs, candidates, addInterview, currentUser } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({
    jobId: '',
    candidateId: '',
    type: 'phone',
    scheduledAt: '',
    duration: 60,
    interviewers: '',
    notes: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addInterview({
      jobId: form.jobId,
      candidateId: form.candidateId,
      type: form.type,
      status: 'scheduled',
      scheduledAt: form.scheduledAt,
      duration: form.duration,
      interviewers: form.interviewers.split(',').map((s) => s.trim()).filter(Boolean),
      notes: form.notes || undefined,
    });
    setShowModal(false);
    setForm({ jobId: '', candidateId: '', type: 'phone', scheduledAt: '', duration: 60, interviewers: '', notes: '' });
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Manage scheduled interviews"
        actions={
          <Button onClick={() => setShowModal(true)}>Schedule Interview</Button>
        }
      />

      <div style={{ padding: '2rem' }}>
        {interviews.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No interviews scheduled"
            description="Schedule your first interview to get started."
            action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Candidate / Job</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Duration</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => {
                const candidate = candidates.find((c) => c.id === interview.candidateId);
                const job = jobs.find((j) => j.id === interview.jobId);
                return (
                  <tr key={interview.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>
                        {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {job?.title || 'Unknown Job'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{interview.type}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{formatDate(interview.scheduledAt)}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{interview.duration} min</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge variant={getStatusVariant(interview.status)}>{interview.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Select
            label="Job"
            value={form.jobId}
            onChange={(v) => setForm({ ...form, jobId: v })}
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
            placeholder="Select job"
          />
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={(v) => setForm({ ...form, candidateId: v })}
            options={candidates.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))}
            placeholder="Select candidate"
          />
          <Select
            label="Interview Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as InterviewType })}
            options={[
              { value: 'phone', label: 'Phone Screen' },
              { value: 'video', label: 'Video' },
              { value: 'onsite', label: 'On-site' },
              { value: 'technical', label: 'Technical' },
              { value: 'hr', label: 'HR' },
            ]}
          />
          <Input
            label="Scheduled Date & Time"
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
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
