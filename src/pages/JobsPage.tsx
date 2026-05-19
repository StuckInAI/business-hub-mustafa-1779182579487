import { useState, ChangeEvent } from 'react';
import { Plus, Briefcase, Search } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import Textarea from '@/components/ui/Textarea';
import { formatDate, formatSalary, jobTypeLabel, workModeLabel } from '@/lib/utils';
import type { JobStatus, JobType, WorkMode } from '@/types';
import { useNavigate } from 'react-router-dom';
import styles from './JobsPage.module.css';

const statusVariant: Record<JobStatus, 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
  open: 'success',
  draft: 'muted',
  closed: 'danger',
  paused: 'info',
};

const defaultForm = {
  title: '',
  department: '',
  location: '',
  type: 'full_time' as JobType,
  workMode: 'onsite' as WorkMode,
  status: 'draft' as JobStatus,
  description: '',
  requirements: '',
  salaryMin: '',
  salaryMax: '',
  currency: 'USD',
  headcount: '1',
};

export default function JobsPage() {
  const { jobs, addJob, deleteJob } = useStoreContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const departments = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q);
    const matchStatus = !filterStatus || j.status === filterStatus;
    const matchDept = !filterDept || j.department === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  function handleField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit() {
    if (!form.title || !form.department || !form.location) return;
    addJob({
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type,
      workMode: form.workMode,
      status: form.status,
      description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      currency: form.currency || 'USD',
      headcount: Number(form.headcount) || 1,
      filled: 0,
    });
    setForm(defaultForm);
    setShowModal(false);
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

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'open', label: 'Open' },
            { value: 'draft', label: 'Draft' },
            { value: 'closed', label: 'Closed' },
            { value: 'paused', label: 'Paused' },
          ]}
          className={styles.filterSelect}
        />
        <Select
          value={filterDept}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterDept(e.target.value)}
          options={[
            { value: '', label: 'All Departments' },
            ...departments.map((d) => ({ value: d, label: d })),
          ]}
          className={styles.filterSelect}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={32} />}
          title="No jobs found"
          description="Create your first job posting to get started."
          action={<Button onClick={() => setShowModal(true)}>Add Job</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {filtered.map((job) => (
            <div
              key={job.id}
              className={styles.card}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Briefcase size={18} />
                </div>
                <Badge variant={statusVariant[job.status]}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.jobMeta}>{job.department} · {job.location}</p>
              <div className={styles.jobTags}>
                <span>{jobTypeLabel(job.type)}</span>
                <span>{workModeLabel(job.workMode)}</span>
              </div>
              <div className={styles.jobFooter}>
                <span className={styles.jobSalary}>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                <span className={styles.headcount}>Headcount: {job.filled}/{job.headcount}</span>
                <span className={styles.jobDate}>Posted {formatDate(job.publishedAt || job.createdAt)}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}
                title="Delete job"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Job" size="lg">
        <div className={styles.formGrid}>
          <Input label="Job Title" required value={form.title} onChange={(e) => handleField('title', e.target.value)} />
          <Input label="Department" required value={form.department} onChange={(e) => handleField('department', e.target.value)} />
          <Input label="Location" required value={form.location} onChange={(e) => handleField('location', e.target.value)} />
          <Select
            label="Job Type"
            value={form.type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleField('type', e.target.value)}
            options={[
              { value: 'full_time', label: 'Full-time' },
              { value: 'part_time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
              { value: 'internship', label: 'Internship' },
            ]}
          />
          <Select
            label="Work Mode"
            value={form.workMode}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleField('workMode', e.target.value)}
            options={[
              { value: 'onsite', label: 'On-site' },
              { value: 'remote', label: 'Remote' },
              { value: 'hybrid', label: 'Hybrid' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleField('status', e.target.value)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'open', label: 'Open' },
              { value: 'paused', label: 'Paused' },
            ]}
          />
          <Input label="Min Salary" type="number" value={form.salaryMin} onChange={(e) => handleField('salaryMin', e.target.value)} />
          <Input label="Max Salary" type="number" value={form.salaryMax} onChange={(e) => handleField('salaryMax', e.target.value)} />
          <Input label="Currency" value={form.currency} onChange={(e) => handleField('currency', e.target.value)} />
          <Input label="Headcount" type="number" value={form.headcount} onChange={(e) => handleField('headcount', e.target.value)} />
        </div>
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => handleField('description', e.target.value)}
          rows={4}
        />
        <Textarea
          label="Requirements (one per line)"
          value={form.requirements}
          onChange={(e) => handleField('requirements', e.target.value)}
          rows={4}
        />
        <div className={styles.formActions}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Job</Button>
        </div>
      </Modal>
    </div>
  );
}
