import { useState } from 'react';
import { Gift, Plus } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { ReferralStatus } from '@/types';

const STATUS_COLORS: Record<ReferralStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  pending: 'default',
  reviewing: 'info',
  hired: 'success',
  rejected: 'danger',
};

export default function ReferralsPage() {
  const { referrals, jobs, currentUser, addReferral, updateReferral } = useStoreContext();
  const [filterStatus, setFilterStatus] = useState<ReferralStatus | ''>('');
  const [filterJob, setFilterJob] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    jobId: '',
    notes: '',
  });

  const filtered = referrals.filter((r) => {
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchJob = !filterJob || r.jobId === filterJob;
    return matchStatus && matchJob;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find((j) => j.id === form.jobId);
    addReferral({
      referrerId: currentUser.id,
      referrerName: currentUser.name,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      jobId: form.jobId,
      jobTitle: job?.title ?? '',
      status: 'pending',
      notes: form.notes,
    });
    setShowModal(false);
    setForm({ candidateName: '', candidateEmail: '', jobId: '', notes: '' });
  };

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle={`${referrals.length} total referrals`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Submit Referral
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <Select
            label=""
            value={filterJob}
            onChange={(e) => setFilterJob(e.target.value)}
            options={[
              { value: '', label: 'All Jobs' },
              ...jobs.map((j) => ({ value: j.id, label: j.title })),
            ]}
          />
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ReferralStatus | '')}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'reviewing', label: 'Reviewing' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Gift size={28} />}
            title="No referrals found"
            description="Submit your first referral."
            action={<Button onClick={() => setShowModal(true)}>Submit Referral</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((ref) => (
              <div
                key={ref.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{ref.candidateName}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{ref.candidateEmail}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{ref.jobTitle} &middot; Referred by {ref.referrerName}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{formatDate(ref.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Badge variant={STATUS_COLORS[ref.status]}>{ref.status}</Badge>
                  <Select
                    label=""
                    value={ref.status}
                    onChange={(e) => updateReferral(ref.id, { status: e.target.value as ReferralStatus })}
                    options={[
                      { value: 'pending', label: 'Pending' },
                      { value: 'reviewing', label: 'Reviewing' },
                      { value: 'hired', label: 'Hired' },
                      { value: 'rejected', label: 'Rejected' },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Referral">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Candidate Name" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} required />
          <Input label="Candidate Email" type="email" value={form.candidateEmail} onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })} required />
          <Select
            label="Job"
            value={form.jobId}
            onChange={(e) => setForm({ ...form, jobId: e.target.value })}
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
            placeholder="Select a job"
            required
          />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Submit Referral</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
