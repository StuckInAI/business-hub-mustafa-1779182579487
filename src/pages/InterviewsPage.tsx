import { useState } from 'react';
import { Plus, Calendar, Clock } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, generateId } from '@/lib/utils';
import type { Interview, InterviewType, InterviewStatus } from '@/types';

type FormState = {
  jobId: string;
  candidateId: string;
  interviewerId: string;
  type: InterviewType | '';
  scheduledAt: string;
  duration: string;
  location: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  jobId: '',
  candidateId: '',
  interviewerId: '',
  type: '',
  scheduledAt: '',
  duration: '60',
  location: '',
  notes: '',
};

export default function InterviewsPage() {
  const { interviews, jobs, candidates, addInterview, updateInterview, deleteInterview, currentUser } =
    useStoreContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const field = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    label: '',
  });

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (iv: Interview) => {
    setEditing(iv);
    setForm({
      jobId: iv.jobId,
      candidateId: iv.candidateId,
      interviewerId: iv.interviewerId || '',
      type: iv.type,
      scheduledAt: iv.scheduledAt,
      duration: String(iv.duration),
      location: iv.location || '',
      notes: iv.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.jobId || !form.candidateId || !form.type || !form.scheduledAt) return;
    if (editing) {
      updateInterview({
        ...editing,
        jobId: form.jobId,
        candidateId: form.candidateId,
        interviewerId: form.interviewerId || undefined,
        type: form.type as InterviewType,
        scheduledAt: form.scheduledAt,
        duration: Number(form.duration),
        location: form.location || undefined,
        notes: form.notes || undefined,
      });
    } else {
      addInterview({
        id: generateId(),
        applicationId: '',
        jobId: form.jobId,
        candidateId: form.candidateId,
        interviewerId: form.interviewerId || undefined,
        type: form.type as InterviewType,
        status: 'scheduled' as InterviewStatus,
        scheduledAt: form.scheduledAt,
        duration: Number(form.duration),
        location: form.location || undefined,
        notes: form.notes || undefined,
        createdAt: new Date().toISOString(),
      });
    }
    setModalOpen(false);
  };

  const statusVariant: Record<InterviewStatus, 'success' | 'warning' | 'danger' | 'muted' | 'default'> = {
    scheduled: 'default',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'warning',
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Manage scheduled interviews"
        actions={<Button onClick={openAdd}><Plus size={16} /> Schedule Interview</Button>}
      />

      {interviews.length === 0 ? (
        <EmptyState
          icon={<Calendar size={32} />}
          title="No interviews scheduled"
          description="Schedule your first interview to get started."
          action={<Button onClick={openAdd}><Plus size={16} /> Schedule Interview</Button>}
        />
      ) : (
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {interviews.map((iv) => {
            const job = jobs.find((j) => j.id === iv.jobId);
            const candidate = candidates.find((c) => c.id === iv.candidateId);
            return (
              <div
                key={iv.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {candidate ? candidate.name : 'Unknown Candidate'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {job ? job.title : 'Unknown Job'} · {iv.type.replace('_', ' ')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, display: 'flex', gap: 12 }}>
                    <span><Calendar size={12} style={{ verticalAlign: 'middle' }} /> {formatDate(iv.scheduledAt)}</span>
                    <span><Clock size={12} style={{ verticalAlign: 'middle' }} /> {iv.duration} min</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge variant={statusVariant[iv.status]}>{iv.status.replace('_', ' ')}</Badge>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(iv)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteInterview(iv.id)}>Delete</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Interview' : 'Schedule Interview'}
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select label="Job *" value={form.jobId} onChange={(e) => setForm(f => ({ ...f, jobId: e.target.value }))}>
            <option value="">Select job...</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </Select>
          <Select label="Candidate *" value={form.candidateId} onChange={(e) => setForm(f => ({ ...f, candidateId: e.target.value }))}>
            <option value="">Select candidate...</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select label="Interviewer" value={form.interviewerId} onChange={(e) => setForm(f => ({ ...f, interviewerId: e.target.value }))}>
            <option value="">Select interviewer (optional)...</option>
          </Select>
          <Select label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value as InterviewType }))}>
            <option value="">Select type...</option>
            <option value="phone">Phone</option>
            <option value="video">Video</option>
            <option value="onsite">Onsite</option>
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
          </Select>
          <Input label="Scheduled At *" type="datetime-local" {...field('scheduledAt')} />
          <Input label="Duration (minutes)" type="number" {...field('duration')} />
          <Input label="Location" {...field('location')} />
          <Input label="Notes" {...field('notes')} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Schedule'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
