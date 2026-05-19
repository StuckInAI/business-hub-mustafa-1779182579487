import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { formatDateTime } from '@/lib/utils';
import type { InterviewType, InterviewStatus } from '@/types';

const STATUS_COLORS: Record<InterviewStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  scheduled: 'info',
  completed: 'success',
  cancelled: 'muted',
  no_show: 'danger',
};

export default function InterviewsPage() {
  const { interviews, candidates, jobs, addInterview, updateInterview, deleteInterview } = useStoreContext();
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateId: '',
    jobId: '',
    interviewerName: '',
    type: 'phone' as InterviewType,
    scheduledAt: '',
    duration: '30',
    location: '',
  });

  const filtered = interviews.filter((i) => {
    const matchStatus = !filterStatus || i.status === filterStatus;
    const matchType = !filterType || i.type === filterType;
    return matchStatus && matchType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === form.candidateId);
    const job = jobs.find((j) => j.id === form.jobId);
    addInterview({
      candidateId: form.candidateId,
      candidateName: candidate?.name ?? '',
      jobId: form.jobId,
      jobTitle: job?.title ?? '',
      interviewerId: 'user-current',
      interviewerName: form.interviewerName,
      type: form.type,
      status: 'scheduled',
      scheduledAt: form.scheduledAt,
      duration: parseInt(form.duration, 10),
      location: form.location,
    });
    setShowModal(false);
    setForm({ candidateId: '', jobId: '', interviewerName: '', type: 'phone', scheduledAt: '', duration: '30', location: '' });
  };

  return (
    <div>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} total interviews`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Schedule Interview
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'no_show', label: 'No Show' },
            ]}
          />
          <Select
            label=""
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: '', label: 'All Types' },
              { value: 'phone', label: 'Phone' },
              { value: 'video', label: 'Video' },
              { value: 'onsite', label: 'On-site' },
              { value: 'technical', label: 'Technical' },
              { value: 'behavioral', label: 'Behavioral' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No interviews found"
            description="Schedule your first interview."
            action={<Button onClick={() => setShowModal(true)}>Schedule Interview</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((interview) => (
              <div
                key={interview.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{interview.candidateName}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{interview.jobTitle}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{formatDateTime(interview.scheduledAt)} &middot; {interview.duration} min</div>
                  {interview.location && <div style={{ fontSize: 13, marginTop: 2 }}>{interview.location}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Badge variant={STATUS_COLORS[interview.status]}>{interview.status.replace('_', ' ')}</Badge>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{interview.type}</span>
                  <span style={{ fontSize: 13 }}>by {interview.interviewerName}</span>
                  <Select
                    label=""
                    value={interview.status}
                    onChange={(e) => updateInterview(interview.id, { status: e.target.value as InterviewStatus })}
                    options={[
                      { value: 'scheduled', label: 'Scheduled' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'cancelled', label: 'Cancelled' },
                      { value: 'no_show', label: 'No Show' },
                    ]}
                  />
                  <Button variant="danger" size="sm" onClick={() => deleteInterview(interview.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="Candidate"
            value={form.candidateId}
            onChange={(e) => setForm({ ...form, candidateId: e.target.value })}
            options={candidates.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Select candidate"
            required
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={(e) => setForm({ ...form, jobId: e.target.value })}
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
            placeholder="Select job"
            required
          />
          <Input
            label="Interviewer Name"
            value={form.interviewerName}
            onChange={(e) => setForm({ ...form, interviewerName: e.target.value })}
            required
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as InterviewType })}
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'video', label: 'Video' },
              { value: 'onsite', label: 'On-site' },
              { value: 'technical', label: 'Technical' },
              { value: 'behavioral', label: 'Behavioral' },
            ]}
          />
          <Input
            label="Scheduled At"
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
            label="Location / Link"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
