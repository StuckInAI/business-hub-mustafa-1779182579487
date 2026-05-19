import { useState } from 'react';
import { Briefcase, Plus, Search, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { JobType, JobStatus } from '@/types';

const JOB_TYPE_OPTIONS: { label: string; value: JobType }[] = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
];

const JOB_STATUS_OPTIONS: { label: string; value: JobStatus }[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
  { label: 'On Hold', value: 'on_hold' },
];

type FormState = {
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

const defaultForm: FormState = {
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
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [search, setSearch] = useState('');

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addJob({
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      hiringManagerId: '',
      salary: form.salaryMin
        ? { min: Number(form.salaryMin), max: Number(form.salaryMax), currency: 'USD' }
        : undefined,
    });
    setShowModal(false);
    setForm(defaultForm);
  }

  function getStatusVariant(status: JobStatus) {
    switch (status) {
      case 'open': return 'success';
      case 'closed': return 'danger';
      case 'draft': return 'muted';
      case 'on_hold': return 'warning';
      default: return 'muted';
    }
  }

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} total positions`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Job
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No jobs found"
            description="Create your first job posting to get started."
            action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((job) => {
              const appCount = candidates.filter((c) => c.jobId === job.id).length;
              return (
                <div
                  key={job.id}
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
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {job.department} &bull; {job.location} &bull; Posted {formatDate(job.postedAt)}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {appCount} applicant{appCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Badge variant={getStatusVariant(job.status)}>{job.status.replace('_', ' ')}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${job.id}`)} title="View">
                      <Eye size={15} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteJob(job.id)} title="Delete">
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Job">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Select
            label="Job Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as JobType })}
            options={JOB_TYPE_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as JobStatus })}
            options={JOB_STATUS_OPTIONS}
          />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Requirements (one per line)" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <Input label="Min Salary" type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
          <Input label="Max Salary" type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
