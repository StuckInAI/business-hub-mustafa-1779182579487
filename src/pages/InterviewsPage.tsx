import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, Plus, Clock } from 'lucide-react';
import { getStatusVariant, formatDate } from '@/lib/utils';
import type { Interview } from '@/types';

type InterviewForm = {
  applicationId: string;
  jobId: string;
  candidateId: string;
  type: string;
  status: string;
  scheduledAt: string;
  duration: string;
  interviewerIds: string;
  meetingLink: string;
  notes: string;
};

const EMPTY_FORM: InterviewForm = {
  applicationId: '',
  jobId: '',
  candidateId: '',
  type: 'phone',
  status: 'scheduled',
  scheduledAt: '',
  duration: '60',
  interviewerIds: '',
  meetingLink: '',
  notes: '',
};

export default function InterviewsPage() {
  const { interviews, candidates, jobs, applications, addInterview, updateInterview, deleteInterview } = useStoreContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InterviewForm>(EMPTY_FORM);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  }

  function openEdit(iv: Interview) {
    setForm({
      applicationId: iv.applicationId,
      jobId: iv.jobId,
      candidateId: iv.candidateId,
      type: iv.type,
      status: iv.status,
      scheduledAt: iv.scheduledAt ? iv.scheduledAt.slice(0, 16) : '',
      duration: String(iv.duration),
      interviewerIds: (iv.interviewerIds || []).join(', '),
      meetingLink: iv.meetingLink || '',
      notes: iv.notes || '',
    });
    setEditingId(iv.id);
    setIsModalOpen(true);
  }

  function handleSave() {
    const data = {
      applicationId: form.applicationId,
      jobId: form.jobId,
      candidateId: form.candidateId,
      type: form.type as Interview['type'],
      status: form.status as Interview['status'],
      scheduledAt: form.scheduledAt,
      duration: Number(form.duration),
      interviewerIds: form.interviewerIds.split(',').map((s) => s.trim()).filter(Boolean),
      meetingLink: form.meetingLink,
      notes: form.notes,
    };
    if (editingId) {
      updateInterview(editingId, data);
    } else {
      addInterview(data);
    }
    setIsModalOpen(false);
  }

  function getCandidateName(id: string) {
    return candidates.find((c) => c.id === id)?.name ?? id;
  }

  function getJobTitle(id: string) {
    return jobs.find((j) => j.id === id)?.title ?? id;
  }

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle="Schedule and manage candidate interviews"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} /> Schedule Interview
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {interviews.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No interviews scheduled"
            description="Schedule your first interview to get started."
            action={<Button onClick={openAdd}><Plus size={16} /> Schedule Interview</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {interviews.map((iv) => (
              <div
                key={iv.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>
                    {getCandidateName(iv.candidateId)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {getJobTitle(iv.jobId)}
                  </div>
                </div>
                <Badge variant={getStatusVariant(iv.type)}>{iv.type.replace('_', ' ')}</Badge>
                <Badge variant={getStatusVariant(iv.status)}>{iv.status.replace('_', ' ')}</Badge>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={13} />{formatDate(iv.scheduledAt)}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={13} />{iv.duration}min
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(iv)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteInterview(iv.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Interview' : 'Schedule Interview'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Application"
            value={form.applicationId}
            onChange={(e) => setForm((f) => ({ ...f, applicationId: e.target.value }))}
            options={[
              { value: '', label: 'Select application...' },
              ...applications.map((a) => ({ value: a.id, label: `${getCandidateName(a.candidateId)} - ${getJobTitle(a.jobId)}` })),
            ]}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              options={[
                { value: 'phone', label: 'Phone' },
                { value: 'video', label: 'Video' },
                { value: 'onsite', label: 'Onsite' },
                { value: 'technical', label: 'Technical' },
                { value: 'behavioral', label: 'Behavioral' },
              ]}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'no_show', label: 'No Show' },
              ]}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              label="Scheduled At"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
          </div>
          <Input
            label="Interviewer IDs (comma separated)"
            value={form.interviewerIds}
            onChange={(e) => setForm((f) => ({ ...f, interviewerIds: e.target.value }))}
            placeholder="user-1, user-2"
          />
          <Input
            label="Meeting Link"
            value={form.meetingLink}
            onChange={(e) => setForm((f) => ({ ...f, meetingLink: e.target.value }))}
            placeholder="https://meet.example.com/..."
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Schedule'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
