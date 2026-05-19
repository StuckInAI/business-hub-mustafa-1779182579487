import { useState } from 'react';
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
import { Briefcase, Plus, Search, MapPin, Users } from 'lucide-react';
import { getStatusVariant } from '@/lib/utils';
import type { Job } from '@/types';

type JobForm = {
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  experienceLevel: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  closingDate: string;
};

const EMPTY_FORM: JobForm = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  status: 'draft',
  experienceLevel: 'mid',
  description: '',
  requirements: '',
  responsibilities: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: 'USD',
  closingDate: '',
};

export default function JobsPage() {
  const { jobs, addJob, updateJob, deleteJob } = useStoreContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);

  const filtered = jobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? j.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  }

  function openEdit(job: Job) {
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      experienceLevel: job.experienceLevel,
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: (job.responsibilities || []).join('\n'),
      salaryMin: job.salary ? String(job.salary.min) : '',
      salaryMax: job.salary ? String(job.salary.max) : '',
      salaryCurrency: job.salary ? job.salary.currency : 'USD',
      closingDate: job.closingDate || '',
    });
    setEditingId(job.id);
    setIsModalOpen(true);
  }

  function handleSave() {
    const data: Partial<Job> = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type as Job['type'],
      status: form.status as Job['status'],
      experienceLevel: form.experienceLevel as Job['experienceLevel'],
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      responsibilities: form.responsibilities.split('\n').filter(Boolean),
      closingDate: form.closingDate || undefined,
    };
    if (form.salaryMin && form.salaryMax) {
      data.salary = {
        min: Number(form.salaryMin),
        max: Number(form.salaryMax),
        currency: form.salaryCurrency,
      };
    }
    if (editingId) {
      updateJob(editingId, data);
    } else {
      addJob(data as Omit<Job, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setIsModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Manage your job postings"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Job
          </Button>
        }
      />

      {/* Filters */}
      <div style={{ padding: '16px 32px', display: 'flex', gap: 12, borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            style={{ paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, width: '100%', background: 'var(--color-bg)', color: 'var(--color-text-primary)', outline: 'none' }}
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 14, background: 'var(--color-bg)', color: 'var(--color-text-primary)', outline: 'none' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div style={{ padding: '24px 32px' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No jobs found"
            description={search || filterStatus ? 'Try adjusting your filters.' : 'Create your first job posting to get started.'}
            action={!search && !filterStatus ? <Button onClick={openAdd}><Plus size={16} /> Add Job</Button> : undefined}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((job) => (
              <div
                key={job.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4, display: 'flex', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} />{job.department}</span>
                  </div>
                </div>
                <Badge variant={getStatusVariant(job.experienceLevel)}>{job.experienceLevel}</Badge>
                <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                <div style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(job)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteJob(job.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Job' : 'Add Job'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Job Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
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
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'open', label: 'Open' },
                { value: 'paused', label: 'Paused' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
            <Select
              label="Experience Level"
              value={form.experienceLevel}
              onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
              options={[
                { value: 'entry', label: 'Entry' },
                { value: 'mid', label: 'Mid' },
                { value: 'senior', label: 'Senior' },
                { value: 'lead', label: 'Lead' },
                { value: 'executive', label: 'Executive' },
              ]}
            />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} />
          <Textarea label="Requirements (one per line)" value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} rows={3} />
          <Textarea label="Responsibilities (one per line)" value={form.responsibilities} onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))} rows={3} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Input label="Salary Min" type="number" value={form.salaryMin} onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))} />
            <Input label="Salary Max" type="number" value={form.salaryMax} onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))} />
            <Input label="Currency" value={form.salaryCurrency} onChange={(e) => setForm((f) => ({ ...f, salaryCurrency: e.target.value }))} />
          </div>
          <Input label="Closing Date" type="date" value={form.closingDate} onChange={(e) => setForm((f) => ({ ...f, closingDate: e.target.value }))} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Job'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
