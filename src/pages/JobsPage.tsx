import { useState } from 'react';
import { Briefcase, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { getStatusVariant } from '@/lib/utils';
import type { JobStatus, JobType } from '@/types';

type JobFormState = {
  title: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  description: string;
  requirements: string;
};

export default function JobsPage() {
  const { jobs, addJob, applications } = useStoreContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<JobFormState>({
    title: '',
    department: '',
    location: '',
    type: 'full_time',
    status: 'open',
    description: '',
    requirements: '',
  });

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
      postedAt: new Date().toISOString(),
      hiringManagerId: '',
      createdAt: new Date().toISOString(),
    });
    setShowModal(false);
    setForm({ title: '', department: '', location: '', type: 'full_time', status: 'open', description: '', requirements: '' });
  }

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} open position${jobs.length !== 1 ? 's' : ''}`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Post Job
          </Button>
        }
      />

      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem', maxWidth: 400 }}>
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
            description="Post your first job opening to get started."
            action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Post Job</Button>}
          />
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filtered.map((job) => {
              const appCount = applications.filter((a) => a.jobId === job.id).length;
              return (
                <div
                  key={job.id}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    border: '1px solid var(--color-border)',
                    transition: 'box-shadow 0.15s',
                  }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', marginBottom: '0.25rem' }}>{job.title}</h3>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {job.department} · {job.location}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Badge variant="muted">{job.type.replace('_', ' ')}</Badge>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {appCount} applicant{appCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post New Job">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Job Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v as JobType })}
            options={[
              { value: 'full_time', label: 'Full Time' },
              { value: 'part_time', label: 'Part Time' },
              { value: 'contract', label: 'Contract' },
              { value: 'internship', label: 'Internship' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as JobStatus })}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'draft', label: 'Draft' },
              { value: 'on_hold', label: 'On Hold' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Requirements (one per line)"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Post Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
