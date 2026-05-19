import { useState, useMemo } from 'react';
import { Plus, Search, Briefcase, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, formatSalary, jobTypeLabel, workModeLabel } from '@/lib/utils';
import { DEFAULT_PIPELINE } from '@/lib/seedData';
import type { JobStatus } from '@/types';
import styles from './JobsPage.module.css';

function jobStatusVariant(status: JobStatus) {
  const map: Record<JobStatus, 'success' | 'warning' | 'muted' | 'danger' | 'info'> = {
    open: 'success',
    draft: 'warning',
    paused: 'info',
    closed: 'muted',
    archived: 'muted',
  };
  return map[status];
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'paused', label: 'Paused' },
  { value: 'closed', label: 'Closed' },
];

const TYPE_OPTIONS = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const WORK_MODE_OPTIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
];

const DEPT_OPTIONS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Analytics', label: 'Analytics' },
  { value: 'HR', label: 'HR' },
  { value: 'Finance', label: 'Finance' },
];

type NewJobForm = {
  title: string;
  department: string;
  location: string;
  workMode: string;
  type: string;
  status: string;
  headcount: string;
  description: string;
  salaryMin: string;
  salaryMax: string;
};

export default function JobsPage() {
  const { jobs, applications, addJob, currentUser } = useStoreContext();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewJobForm>({
    title: '',
    department: 'Engineering',
    location: '',
    workMode: 'hybrid',
    type: 'full_time',
    status: 'draft',
    headcount: '1',
    description: '',
    salaryMin: '',
    salaryMax: '',
  });

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus ? j.status === filterStatus : true;
      const matchDept = filterDept ? j.department === filterDept : true;
      return matchSearch && matchStatus && matchDept;
    });
  }, [jobs, search, filterStatus, filterDept]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addJob({
      title: form.title,
      department: form.department,
      location: form.location,
      workMode: form.workMode as any,
      type: form.type as any,
      status: form.status as any,
      headcount: parseInt(form.headcount) || 1,
      filled: 0,
      description: form.description,
      requirements: [],
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : undefined,
      currency: 'USD',
      hiringManagerId: currentUser.id,
      recruiterId: currentUser.id,
      tags: [],
      pipeline: DEFAULT_PIPELINE,
    });
    setShowModal(false);
    setForm({
      title: '',
      department: 'Engineering',
      location: '',
      workMode: 'hybrid',
      type: 'full_time',
      status: 'draft',
      headcount: '1',
      description: '',
      salaryMin: '',
      salaryMax: '',
    });
  }

  function appCount(jobId: string) {
    return applications.filter((a) => a.jobId === jobId).length;
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Jobs"
        subtitle={`${jobs.filter((j) => j.status === 'open').length} open positions`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Job
          </Button>
        }
      />

      <div className={styles.content}>
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={STATUS_OPTIONS}
            placeholder="All Statuses"
            className={styles.filterSelect}
          />
          <Select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            options={DEPT_OPTIONS}
            placeholder="All Departments"
            className={styles.filterSelect}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No jobs found"
            description="Try adjusting your filters or create a new job."
            action={
              <Button onClick={() => setShowModal(true)}><Plus size={16} />New Job</Button>
            }
          />
        ) : (
          <div className={styles.grid}>
            {filtered.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className={styles.jobCard}>
                <div className={styles.jobCardTop}>
                  <div className={styles.jobCardInfo}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.jobDept}>{job.department}</span>
                  </div>
                  <Badge variant={jobStatusVariant(job.status)}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <div className={styles.jobMeta}>
                  <span><MapPin size={13} /> {job.location || 'Remote'}</span>
                  <span>{workModeLabel(job.workMode)}</span>
                  <span>{jobTypeLabel(job.type)}</span>
                </div>
                <div className={styles.jobFooter}>
                  <span className={styles.jobSalary}>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                  <span className={styles.jobApps}><Users size={13} /> {appCount(job.id)} applicants</span>
                </div>
                <div className={styles.jobCardBottom}>
                  <span className={styles.headcount}>Headcount: {job.filled}/{job.headcount}</span>
                  <span className={styles.jobDate}>Posted {formatDate(job.publishedAt || job.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Job" size="lg">
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Job Title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Senior Frontend Engineer"
          />
          <div className={styles.formRow}>
            <Select
              label="Department"
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              options={DEPT_OPTIONS}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div className={styles.formRow}>
            <Select
              label="Work Mode"
              value={form.workMode}
              onChange={(e) => setForm((f) => ({ ...f, workMode: e.target.value }))}
              options={WORK_MODE_OPTIONS}
            />
            <Select
              label="Job Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              options={TYPE_OPTIONS}
            />
          </div>
          <div className={styles.formRow}>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={STATUS_OPTIONS}
            />
            <Input
              label="Headcount"
              type="number"
              value={form.headcount}
              onChange={(e) => setForm((f) => ({ ...f, headcount: e.target.value }))}
              placeholder="1"
            />
          </div>
          <div className={styles.formRow}>
            <Input
              label="Min Salary (USD)"
              type="number"
              value={form.salaryMin}
              onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
              placeholder="e.g. 100000"
            />
            <Input
              label="Max Salary (USD)"
              type="number"
              value={form.salaryMax}
              onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
              placeholder="e.g. 150000"
            />
          </div>
          <Textarea
            label="Job Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the role..."
            rows={5}
          />
          <div className={styles.formActions}>
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">Cancel</Button>
            <Button type="submit">Create Job</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
