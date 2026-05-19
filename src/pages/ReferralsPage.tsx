import { useState } from 'react';
import { Gift, Plus } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { ReferralStatus } from '@/types';

const REFERRAL_STATUS_OPTIONS: { label: string; value: ReferralStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Hired', value: 'hired' },
  { label: 'Rejected', value: 'rejected' },
];

type FormState = {
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  notes: string;
  status: ReferralStatus;
};

const defaultForm: FormState = {
  candidateName: '',
  candidateEmail: '',
  jobId: '',
  notes: '',
  status: 'pending',
};

export default function ReferralsPage() {
  const { referrals, jobs, users, currentUser, addReferral, updateReferral, deleteReferral } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);

  const jobOptions = jobs.map((j) => ({ label: j.title, value: j.id }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addReferral({
      referrerId: currentUser.id,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      jobId: form.jobId,
      status: form.status,
      notes: form.notes,
    });
    setShowModal(false);
    setForm(defaultForm);
  }

  function getStatusVariant(status: ReferralStatus) {
    switch (status) {
      case 'pending': return 'warning';
      case 'reviewing': return 'info';
      case 'hired': return 'success';
      case 'rejected': return 'danger';
      default: return 'muted';
    }
  }

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle={`${referrals.length} referrals`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Referral
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
        {referrals.length === 0 ? (
          <EmptyState
            icon={<Gift size={28} />}
            title="No referrals yet"
            description="Refer a candidate for an open position."
            action={<Button onClick={() => setShowModal(true)}>Add Referral</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {referrals.map((referral) => {
              const job = jobs.find((j) => j.id === referral.jobId);
              const referrer = users.find((u) => u.id === referral.referrerId);
              return (
                <div
                  key={referral.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4) var(--space-5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {referral.candidateName}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {referral.candidateEmail} &bull; {job?.title ?? 'Unknown Job'}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      Referred by {referrer?.name ?? 'Unknown'} on {formatDate(referral.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Badge variant={getStatusVariant(referral.status)}>{referral.status}</Badge>
                    <Select
                      value={referral.status}
                      onChange={(v) => updateReferral(referral.id, { status: v as ReferralStatus })}
                      options={REFERRAL_STATUS_OPTIONS}
                    />
                    <button
                      style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                      onClick={() => deleteReferral(referral.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Referral">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Candidate Name"
            value={form.candidateName}
            onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
            required
          />
          <Input
            label="Candidate Email"
            type="email"
            value={form.candidateEmail}
            onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })}
            required
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={(v) => setForm({ ...form, jobId: v })}
            options={jobOptions}
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Submit Referral</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
