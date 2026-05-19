import { useStoreContext } from '@/context/StoreContext';
import { getStatusVariant } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MapPin, Clock, Briefcase } from 'lucide-react';
import type { Job } from '@/types';

function formatJobType(type: string): string {
  return type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CareersPage() {
  const { jobs } = useStoreContext();
  const openJobs = jobs.filter((j) => j.status === 'open');

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'inherit' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #5b6af0 0%, #7c3aed 100%)', color: 'white', padding: '64px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Join Our Team</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 560, margin: '0 auto' }}>
          We're building the future of talent management. Come work with us.
        </p>
      </div>

      {/* Jobs List */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#1e293b' }}>
          Open Positions ({openJobs.length})
        </h2>
        {openJobs.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '48px 0' }}>
            No open positions at this time. Check back soon!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {openJobs.map((job: Job) => (
              <div
                key={job.id}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: '24px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: '#64748b', fontSize: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={14} />{job.department}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={14} />{job.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} />{formatJobType(job.type)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Badge variant={getStatusVariant(job.experienceLevel)}>{job.experienceLevel}</Badge>
                    <Button size="sm" onClick={() => alert(`Apply for ${job.title} — form coming soon!`)}>
                      Apply Now
                    </Button>
                  </div>
                </div>
                {job.description && (
                  <p style={{ marginTop: 12, color: '#475569', fontSize: 14, lineHeight: 1.6 }}>
                    {job.description.slice(0, 200)}{job.description.length > 200 ? '...' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
