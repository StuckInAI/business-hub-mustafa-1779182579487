import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2 } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, generateId } from '@/lib/utils';
import type { Interview, InterviewStatus, InterviewType } from '@/types';

type InterviewForm = {
  candidateId: string;
  jobId: string;
  interviewerId: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration: string;
  notes: string;
};

const STATUS_VARIANTS: Record<InterviewStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'muted',
  no_show: 'danger',
};

const DEFAULT_FORM: InterviewForm = {
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InterviewForm>(DEFAULT_FORM);
  const [filter, setFilter] = useState<InterviewStatus | 'all'>('all');

  const filtered = filter === 'all' ? interviews : interviews.filter((i) => i.status === filter);

  const handleSubmit = () => {
    if (!form.candidateId || !form.jobId || !form.scheduledAt) return;
    const payload: Omit<Interview, 'id' | 'createdAt'> = {
      candidateId: form.candidateId,
      jobId: form.jobId,
      interviewerId: form.interviewerId || undefined,
      type: form.type,
      status: form.status,
      scheduledAt: form.scheduledAt,
      duration: Number(form.duration) || 60,
      notes: form.notes || undefined,
    };
    addInterview(payload);
    setShowModal(false);
    setForm(DEFAULT_FORM);
  };

  const field = (key: keyof InterviewForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} total`}
        actions={
          <Button onClick={() => { setForm(DEFAULT_FORM); setShowModal(true); }}>
            <Plus size={16} /> Schedule Interview
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-4) var(--space-8)', display: 'flex', gap: 'var(--space-2)' }}>
        {(['all', 'scheduled', 'completed', 'cancelled', 'no_show'] as const).map((s) => (
          <Button key={s} size="sm" variant={filter === s ? 'primary' : 'secondary'} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <div style={{ padding: '0 var(--space-8) var(--space-8)' }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="No interviews found" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((interview) => {
              const candidate = candidates.find((c) => c.id === interview.candidateId);
              const job = jobs.find((j) => j.id === interview.jobId);
              const interviewer = users.find((u) => u.id === interview.interviewerId);
              return (
                <div key={interview.id} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
                      {candidate?.name ?? 'Unknown Candidate'}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {job?.title ?? 'Unknown Job'} &bull; {interview.type.replace('_', ' ')} &bull; {formatDate(interview.scheduledAt)}
                    </div>
                    {interviewer && (
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        Interviewer: {interviewer.name}
                      </div>
                    )}
                  </div>
                  <Badge variant={STATUS_VARIANTS[interview.status]}>{interview.status.replace('_', ' ')}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => deleteInterview(interview.id)} title="Delete">
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select label="Candidate *" {...field('candidateId')}>
            <option value="">Select candidate</option>
            {candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Job *" {...field('jobId')}>
            <option value="">Select job</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </Select>
          <Select label="Interviewer" {...field('interviewerId')}>
            <option value="">Select interviewer</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </Select>
          <Select label="Type" {...field('type')}>
            {(['phone', 'video', 'onsite', 'technical', 'hr'] as InterviewType[]).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Input label="Scheduled At *" type="datetime-local" {...field('scheduledAt')} />
          <Input label="Duration (min)" type="number" {...field('duration')} />
          <Input label="Notes" {...field('notes')} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
