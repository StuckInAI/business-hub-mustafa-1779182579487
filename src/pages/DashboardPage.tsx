import { useMemo } from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { formatDate, sourceLabel } from '@/lib/utils';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { jobs, candidates, applications, interviews: _interviews } = {
    ...useStoreContext(),
    interviews: useStoreContext().applications.flatMap((a) => a.interviews),
  };

  const stats = useMemo(() => {
    const openJobs = jobs.filter((j) => j.status === 'open').length;
    const totalCandidates = candidates.length;
    const activeApplications = applications.filter((a) => a.status === 'active').length;
    const now = new Date();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const allInterviews = applications.flatMap((a) => a.interviews);
    const interviewsThisWeek = allInterviews.filter((i) => {
      const d = new Date(i.scheduledAt);
      return Math.abs(now.getTime() - d.getTime()) < weekMs;
    }).length;
    const offerApps = applications.filter((a) => a.stageId === 'p5');
    const offersExtended = offerApps.length;
    const hiredApps = applications.filter((a) => a.status === 'hired');
    const offerAcceptRate = offersExtended > 0 ? Math.round((hiredApps.length / offersExtended) * 100) : 0;

    // Source breakdown
    const sourceMap: Record<string, number> = {};
    candidates.forEach((c) => {
      sourceMap[c.source] = (sourceMap[c.source] || 0) + 1;
    });
    const sourcingBreakdown = Object.entries(sourceMap).map(([source, count]) => ({ source, count }));

    return { openJobs, totalCandidates, activeApplications, interviewsThisWeek, offersExtended, offerAcceptRate, sourcingBreakdown };
  }, [jobs, candidates, applications]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 8);
  }, [applications]);

  const { candidates: allCandidates, jobs: allJobs } = useStoreContext();

  const upcomingInterviews = useMemo(() => {
    const all = applications.flatMap((a) =>
      a.interviews.map((i) => ({ ...i, applicationId: a.id, candidateId: a.candidateId, jobId: a.jobId }))
    );
    return all
      .filter((i) => i.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 5);
  }, [applications]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your hiring pipeline."
      />

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <StatCard
            label="Open Jobs"
            value={stats.openJobs}
            icon={<Briefcase size={22} color="var(--color-primary)" />}
            color="var(--color-primary-light)"
            trend="2 new this week"
            trendUp
          />
          <StatCard
            label="Total Candidates"
            value={stats.totalCandidates}
            icon={<Users size={22} color="#10b981" />}
            color="var(--color-secondary-light)"
          />
          <StatCard
            label="Active Applications"
            value={stats.activeApplications}
            icon={<TrendingUp size={22} color="#f59e0b" />}
            color="var(--color-warning-light)"
          />
          <StatCard
            label="Interviews This Week"
            value={stats.interviewsThisWeek}
            icon={<Calendar size={22} color="#3b82f6" />}
            color="var(--color-info-light)"
          />
          <StatCard
            label="Offers Extended"
            value={stats.offersExtended}
            icon={<CheckCircle size={22} color="#10b981" />}
            color="var(--color-secondary-light)"
          />
          <StatCard
            label="Offer Accept Rate"
            value={`${stats.offerAcceptRate}%`}
            icon={<Clock size={22} color="#8b5cf6" />}
            color="#ede9fe"
          />
        </div>

        <div className={styles.twoCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Recent Applications</h3>
            <div className={styles.appList}>
              {recentApplications.map((app) => {
                const candidate = allCandidates.find((c) => c.id === app.candidateId);
                const job = allJobs.find((j) => j.id === app.jobId);
                return (
                  <div key={app.id} className={styles.appRow}>
                    <div className={styles.appAvatar}>
                      {candidate ? `${candidate.firstName[0]}${candidate.lastName[0]}` : '?'}
                    </div>
                    <div className={styles.appInfo}>
                      <span className={styles.appName}>
                        {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                      </span>
                      <span className={styles.appJob}>{job ? job.title : 'Unknown Job'}</span>
                    </div>
                    <span className={styles.appDate}>{formatDate(app.appliedAt)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Candidate Sources</h3>
            <div className={styles.sourceList}>
              {stats.sourcingBreakdown.map(({ source, count }) => {
                const pct = Math.round((count / stats.totalCandidates) * 100);
                return (
                  <div key={source} className={styles.sourceRow}>
                    <span className={styles.sourceLabel}>{sourceLabel(source)}</span>
                    <div className={styles.sourceBarWrap}>
                      <div className={styles.sourceBar} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.sourceCount}>{count}</span>
                  </div>
                );
              })}
            </div>

            <h3 className={styles.cardTitle} style={{ marginTop: 24 }}>Upcoming Interviews</h3>
            {upcomingInterviews.length === 0 ? (
              <p className={styles.empty}>No upcoming interviews.</p>
            ) : (
              upcomingInterviews.map((iv) => {
                const candidate = allCandidates.find((c) => c.id === iv.candidateId);
                const job = allJobs.find((j) => j.id === iv.jobId);
                return (
                  <div key={iv.id} className={styles.ivRow}>
                    <Calendar size={14} color="var(--color-primary)" />
                    <div className={styles.ivInfo}>
                      <span className={styles.ivName}>
                        {candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Unknown'}
                      </span>
                      <span className={styles.ivJob}>{job ? job.title : ''} · {iv.type}</span>
                    </div>
                    <span className={styles.ivDate}>{formatDate(iv.scheduledAt)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
