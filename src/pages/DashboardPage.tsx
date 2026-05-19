import { Link } from 'react-router-dom';
import { Briefcase, FileText, Users, Calendar, TrendingUp } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { jobs, candidates, interviews } = useStoreContext();

  const openJobs = jobs.filter((j) => j.status === 'open').length;
  const activeApplications = candidates.filter(
    (c) => !['hired', 'rejected'].includes(c.status)
  ).length;
  const hiredThisMonth = candidates.filter((c) => c.status === 'hired').length;
  const scheduledInterviews = interviews.filter((i) => i.status === 'scheduled').length;

  const recentJobs = [...jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentCandidates = [...candidates].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const pipelineStages = [
    { label: 'New', status: 'new' },
    { label: 'Screening', status: 'screening' },
    { label: 'Interview', status: 'interview' },
    { label: 'Offer', status: 'offer' },
    { label: 'Hired', status: 'hired' },
  ] as const;

  const maxPipeline = Math.max(...pipelineStages.map((s) => candidates.filter((c) => c.status === s.status).length), 1);

  return (
    <div className={styles.page}>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's what's happening." />

      <div className={styles.statsGrid}>
        <StatCard title="Open Jobs" value={openJobs} icon={<Briefcase size={20} />} trend="+2 this week" />
        <StatCard title="Active Applications" value={activeApplications} icon={<FileText size={20} />} trend="+12 this week" />
        <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon={<Calendar size={20} />} />
        <StatCard title="Hired This Month" value={hiredThisMonth} icon={<Users size={20} />} trend="+3 this month" />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Recent Jobs</div>
          <div className={styles.list}>
            {recentJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`} className={styles.listItem}>
                <div className={styles.itemIcon}><Briefcase size={16} /></div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{job.title}</div>
                  <div className={styles.itemMeta}>{job.department} &bull; {job.location}</div>
                </div>
                <Badge variant={job.status === 'open' ? 'success' : 'muted'}>{job.status}</Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>Recent Candidates</div>
          <div className={styles.list}>
            {recentCandidates.map((c) => (
              <Link key={c.id} to={`/candidates/${c.id}`} className={styles.listItem}>
                <div className={styles.itemIcon}><Users size={16} /></div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{c.name}</div>
                  <div className={styles.itemMeta}>{c.email}</div>
                </div>
                <Badge variant={c.status === 'hired' ? 'success' : c.status === 'rejected' ? 'danger' : 'default'}>{c.status}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}><TrendingUp size={16} style={{ display: 'inline', marginRight: 6 }} />Pipeline Overview</div>
        <div className={styles.pipelineBar}>
          {pipelineStages.map((s) => {
            const count = candidates.filter((c) => c.status === s.status).length;
            return (
              <div key={s.status} className={styles.pipelineRow}>
                <span className={styles.pipelineLabel}>{s.label}</span>
                <div className={styles.pipelineTrack}>
                  <div className={styles.pipelineFill} style={{ width: `${(count / maxPipeline) * 100}%` }} />
                </div>
                <span className={styles.pipelineCount}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
