import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Search } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import Textarea from '@/components/ui/Textarea';
import { formatDate } from '@/lib/utils';
import type { JobStatus, JobType, JobDepartment } from '@/types';

const STATUS_COLORS: Record<JobStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  draft: 'muted',
  active: 'success',
  paused: 'warning',
  closed: 'danger',
};

export default function JobsPage() {
  const { jobs, addJob, updateJob, deleteJob } = useStoreContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | ''>('');
  const [filterDept, setFilterDept] = useState<JobDepartment | ''>('');
  const [filterType, setFilterType] = useState<JobType | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: 'engineering' as JobDepartment,
    location: '',
    type: 'full_time' as JobType,
    status: 'active' as JobStatus,
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
  });

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.includes(search.toLowerCase());
    const matchStatus = !filterStatus || j.status === filterStatus;
    const matchDept = !filterDept || j.department === filterDept;
    const matchType = !filterType || j.type === filterType;
    return matchSearch && matchStatus && matchDept && matchType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      status: form.status,
      description: form.description,
      requirements: form.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      hiringManagerId: 'user-1',
      salary: form.salaryMin && form.salaryMax
        ? { min: parseInt(form.salaryMin), max: parseInt(form.salaryMax), currency: 'USD' }
        : undefined,
    });
    setShowModal(false);
    setForm({ title: '', department: 'engineering', location: '', type: 'full_time', status: 'active', description: '', requirements: '', salaryMin: '', salaryMax: '' });
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.length} total positions`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Post Job
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=""
          />
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as JobStatus | '')}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'paused', label: 'Paused' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
          <Select
            label=""
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value as JobDepartment | '')}
            options={[
              { value: '', label: 'All Departments' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'design', label: 'Design' },
              { value: 'product', label: 'Product' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'hr', label: 'HR' },
              { value: 'finance', label: 'Finance' },
              { value: 'operations', label: 'Operations' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Select
            label=""
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as JobType | '')}
            options={[
              { value: '', label: 'All Types' },
              { value: 'full_time', label: 'Full Time' },
              { value: 'part_time', label: 'Part Time' },
              { value: 'contract', label: 'Contract' },
              { value: 'internship', label: 'Internship' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No jobs found"
            description="Post your first job opening."
            action={<Button onClick={() => setShowModal(true)}>Post Job</Button>}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {filtered.map((job) => (
              <div
                key={job.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16 }}>{job.title}</h3>
                  <Badge variant={STATUS_COLORS[job.status]}>{job.status}</Badge>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 4 }}>{job.department} &middot; {job.location}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{job.type.replace('_', ' ')}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{job.applicantCount} applicants</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(job.createdAt)}</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                  <Select
                    label=""
                    value={job.status}
                    onChange={(e) => updateJob(job.id, { status: e.target.value as JobStatus })}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'active', label: 'Active' },
                      { value: 'paused', label: 'Paused' },
                      { value: 'closed', label: 'Closed' },
                    ]}
                  />
                  <Button variant="danger" size="sm" onClick={() => deleteJob(job.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post New Job" size="lg">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select
              label="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value as JobDepartment })}
              options={[
                { value: 'engineering', label: 'Engineering' },
                { value: 'design', label: 'Design' },
                { value: 'product', label: 'Product' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
                { value: 'hr', label: 'HR' },
                { value: 'finance', label: 'Finance' },
                { value: 'operations', label: 'Operations' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as JobType })}
              options={[
                { value: 'full_time', label: 'Full Time' },
                { value: 'part_time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
              ]}
            />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'paused', label: 'Paused' },
              { value: 'closed', label: 'Closed' },
            ]}
          />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          <Textarea label="Requirements (one per line)" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={4} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Salary Min" type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
            <Input label="Salary Max" type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Post Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
