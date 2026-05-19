import { useState } from 'react';
import { Briefcase, Plus, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { Job, JobStatus, JobType } from '@/types';

type JobForm = {
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string;
  salaryMin: string;
  salaryMax: string;
};

const STATUS_VARIANTS: Record<JobStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  open: 'success',
  closed: 'muted',
  draft: 'warning',
  on_hold: 'info',
};

const DEFAULT_FORM: JobForm = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  status: 'open',
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
};

export default function JobsPage() {
  const { jobs, candidates, addJob, deleteJob } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<JobForm>(DEFAULT_FORM);
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');

  const filtered = filter === 'all' ? jobs : jobs.filter((j) => j.status === filter);

  const handleSubmit = () => {
    if (!form.title || !form.department) return;
    const payload: Omit<Job, 'id' | 'createdAt'> = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      description: form.description || undefined,
      requirements: form.requirements ? form.requirements.split('\n').filter(Boolean) : undefined,
      salary: form.salaryMin
        ? { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: 'USD' }
        : undefined,
      postedAt: new Date().toISOString(),
    };
    addJob(payload);
    setShowModal(false);
    setForm(DEFAULT_FORM);
  };

  const field = (key: keyof JobForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} total positions`}
        actions={
          <>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {(['all', 'open', 'draft', 'on_hold', 'closed'] as const).map((s) => (
                <Button key={s} size="sm" variant={filter === s ? 'primary' : 'secondary'} onClick={() => setFilter(s)}>
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </Button>
              ))}
            </div>
            <Button onClick={() => { setForm(DEFAULT_FORM); setShowModal(true); }}>
              <Plus size={16} /> New Job
            </Button>
          </>
        }
      />

      <div style={{ padding: 'var(--space-8)' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No jobs found"
            description="Create your first job posting to get started."
            action={<Button onClick={() => setShowModal(true)}>New Job</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((job) => {
              const appCount = candidates.filter((c) => c.jobId === job.id).length;
              return (
                <div key={job.id} style={{
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
                      {job.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {job.department} &bull; {job.location} &bull; Posted {formatDate(job.postedAt ?? job.createdAt)}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {appCount} applicant{appCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Badge variant={STATUS_VARIANTS[job.status]}>{job.status.replace('_', ' ')}</Badge>
                  <Link to={`/jobs/${job.id}`}>
                    <Button size="sm" variant="ghost" title="View"><Eye size={14} /></Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => deleteJob(job.id)} title="Delete">
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Job" size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Job Title *" placeholder="e.g. Senior Engineer" {...field('title')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Department *" placeholder="e.g. Engineering" {...field('department')} />
            <Input label="Location" placeholder="e.g. Remote" {...field('location')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Select label="Type" {...field('type')}>
              {(['full_time', 'part_time', 'contract', 'internship'] as JobType[]).map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </Select>
            <Select label="Status" {...field('status')}>
              {(['open', 'draft', 'on_hold', 'closed'] as JobStatus[]).map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </Select>
          </div>
          <Textarea label="Description" rows={3} {...field('description')} />
          <Textarea label="Requirements (one per line)" rows={4} {...field('requirements')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Min Salary" type="number" placeholder="e.g. 80000" {...field('salaryMin')} />
            <Input label="Max Salary" type="number" placeholder="e.g. 120000" {...field('salaryMax')} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Job</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
