import { useState } from 'react';
import { Plus, Briefcase, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, formatDate } from '@/lib/utils';
import type { Job, JobStatus, JobType } from '@/types';

type FormState = {
  title: string;
  department: string;
  location: string;
  type: JobType | '';
  status: JobStatus | '';
  description: string;
  requirements: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  closingDate: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  department: '',
  location: '',
  type: '',
  status: 'open',
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  closingDate: '',
};

export default function JobsPage() {
  const { jobs, addJob, updateJob, deleteJob, currentUser } = useStoreContext();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [search, setSearch] = useState('');

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

  const openEdit = (job: Job) => {
    setEditing(job);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
      requirements: job.requirements.join('\n'),
      salaryMin: job.salary ? String(job.salary.min) : '',
      salaryMax: job.salary ? String(job.salary.max) : '',
      salaryCurrency: job.salary ? job.salary.currency : 'USD',
      closingDate: job.closingDate || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.department || !form.location || !form.type) return;
    const salary =
      form.salaryMin && form.salaryMax
        ? { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: form.salaryCurrency || '$' }
        : undefined;
    if (editing) {
      updateJob({
        ...editing,
        title: form.title,
        department: form.department,
        location: form.location,
        type: form.type as JobType,
        status: form.status as JobStatus,
        description: form.description,
        requirements: form.requirements.split('\n').filter(Boolean),
        salary,
        closingDate: form.closingDate || undefined,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addJob({
        id: generateId(),
        title: form.title,
        department: form.department,
        location: form.location,
        type: form.type as JobType,
        status: form.status as JobStatus || 'open',
        description: form.description,
        requirements: form.requirements.split('\n').filter(Boolean),
        salary,
        closingDate: form.closingDate || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hiringManagerId: currentUser.id,
      });
    }
    setModalOpen(false);
  };

  const statusVariant: Record<JobStatus, 'success' | 'warning' | 'danger' | 'muted'> = {
    open: 'success',
    paused: 'warning',
    closed: 'danger',
    draft: 'muted',
  };

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Manage open positions"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Job
          </Button>
        }
      />

      <div style={{ padding: '16px 32px' }}>
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={32} />}
          title="No jobs found"
          description="Add your first job posting to get started."
          action={<Button onClick={openAdd}><Plus size={16} /> Add Job</Button>}
        />
      ) : (
        <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((job) => (
            <div
              key={job.id}
              style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {job.department} · {job.location}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Posted {formatDate(job.createdAt)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openEdit(job); }}>Edit</Button>
                <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Job' : 'Add Job'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Title *" {...field('title')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Department *" {...field('department')} />
            <Input label="Location *" {...field('location')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value as JobType }))}>
              <option value="">Select type...</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </Select>
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as JobStatus }))}>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <Textarea label="Description" {...field('description')} rows={4} />
          <Textarea label="Requirements (one per line)" {...field('requirements')} rows={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Input label="Salary Min" type="number" {...field('salaryMin')} />
            <Input label="Salary Max" type="number" {...field('salaryMax')} />
            <Input label="Currency" {...field('salaryCurrency')} />
          </div>
          <Input label="Closing Date" type="date" {...field('closingDate')} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add Job'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
