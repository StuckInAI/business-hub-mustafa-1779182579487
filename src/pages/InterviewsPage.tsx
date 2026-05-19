import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { InterviewType, InterviewStatus } from '@/types';

const INTERVIEW_TYPE_OPTIONS: { label: string; value: InterviewType }[] = [
  { label: 'Phone', value: 'phone' },
  { label: 'Video', value: 'video' },
  { label: 'Onsite', value: 'onsite' },
  { label: 'Technical', value: 'technical' },
];

const INTERVIEW_STATUS_OPTIONS: { label: string; value: InterviewStatus }[] = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

type FormState = {
  candidateId: string;
  jobId: string;
  interviewerId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: string;
  notes: string;
};

const defaultForm: FormState = {
  candidateId: '',
  jobId: '',
  interviewerId: '',
  type: 'phone',
  status: 'scheduled',
  scheduledAt: '',
  duration: '60',
  notes: '',
};

export default function InterviewsPage() {
  const { interviews, candidates, jobs, users, addInterview, deleteInterview } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);

  const candidateOptions = candidates.map((c) => ({ label: c.name, value: c.id }));
  const jobOptions = jobs.map((j) => ({ label: j.title, value: j.id }));
  const userOptions = users.map((u) => ({ label: u.name, value: u.id }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addInterview({
      candidateId: form.candidateId,
      jobId: form.jobId,
      interviewerId: form.interviewerId,
      type: form.type,
      status: form.status,
      scheduledAt: form.scheduledAt,
      duration: Number(form.duration),
      notes: form.notes,
    });
    setShowModal(false);
    setForm(defaultForm);
  }

  function getInterviewTypeBadgeVariant(type: InterviewType) {
    switch (type) {
      case 'phone': return 'info';
      case 'video': return 'default';
      case 'onsite': return 'success';
      case 'technical': return 'purple';
      default: return 'muted';
    }
  }

  function getStatusBadgeVariant(status: InterviewStatus) {
    switch (status) {
      case 'scheduled': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      default: return 'muted';
    }
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} interviews scheduled`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Schedule Interview
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
        {interviews.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No interviews scheduled"
            description="Schedule your first interview to get started."
            action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {interviews.map((interview) => {
              const candidate = candidates.find((c) => c.id === interview.candidateId);
              const job = jobs.find((j) => j.id === interview.jobId);
              const interviewer = users.find((u) => u.id === interview.interviewerId);
              return (
                <div
                  key={interview.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4) var(--space-5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {candidate?.name ?? 'Unknown Candidate'}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {job?.title ?? 'Unknown Job'} &bull; Interviewer: {interviewer?.name ?? 'TBD'}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {formatDate(interview.scheduledAt)} &bull; {interview.duration} min
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Badge variant={getInterviewTypeBadgeVariant(interview.type)}>
                      {interview.type}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(interview.status)}>
                      {interview.status}
                    </Badge>
                    <button
                      style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                      onClick={() => deleteInterview(interview.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={(v) => setForm({ ...form, candidateId: v })}
            options={candidateOptions}
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={(v) => setForm({ ...form, jobId: v })}
            options={jobOptions}
          />
          <Select
            label="Interviewer"
            value={form.interviewerId}
            onChange={(v) => setForm({ ...form, interviewerId: v })}
            options={userOptions}
          />
          <Select
            label="Interview Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as InterviewType })}
            options={INTERVIEW_TYPE_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as InterviewStatus })}
            options={INTERVIEW_STATUS_OPTIONS}
          />
          <Input
            label="Scheduled Date & Time"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            required
          />
          <Input
            label="Duration (minutes)"
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
