import { useStoreContext } from '@/context/StoreContext';
import { Briefcase, MapPin, Clock, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getStatusVariant } from '@/lib/utils';

export default function CareersPage() {
  const { jobs } = useStoreContext();
  const openJobs = jobs.filter((j) => j.status === 'open');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <header style={{ background: 'var(--color-sidebar-bg)', color: 'white', padding: '2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 40, height: 40, background: 'var(--color-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1.5rem' }}>TalentFlow Inc.</h1>
            <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>Careers Portal</p>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} style={{ color: 'var(--color-primary)' }} />
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Open Positions ({openJobs.length})</h2>
        </div>

        {openJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
            <Briefcase size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>No open positions right now.</p>
            <p style={{ marginTop: '0.5rem' }}>Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {openJobs.map((job) => (
              <div key={job.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.35rem' }}>{job.title}</div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <Briefcase size={13} /> {job.department}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={13} /> {job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <Clock size={13} /> {job.type}
                    </span>
                  </div>
                  {job.description && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 500, lineHeight: 1.6 }}>
                      {job.description.slice(0, 180)}{job.description.length > 180 ? '...' : ''}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                  <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
