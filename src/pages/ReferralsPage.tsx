import { useState } from 'react';
import { Gift, Plus, Trash2 } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { Referral, ReferralStatus } from '@/types';

type ReferralForm = {
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  notes: string;
};

const STATUS_VARIANTS: Record<ReferralStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  pending: 'warning',
  reviewing: 'info',
  hired: 'success',
  rejected: 'danger',
};

const DEFAULT_FORM: ReferralForm = {
  candidateName: '',
  candidateEmail: '',
  jobId: '',
  notes: '',
};

export default function ReferralsPage() {
  const { referrals, jobs, users, currentUser, addReferral, updateReferral, deleteReferral } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ReferralForm>(DEFAULT_FORM);

  const handleSubmit = () => {
    if (!form.candidateName || !form.jobId) return;
    const payload: Omit<Referral, 'id' | 'createdAt'> = {
      referrerId: currentUser.id,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      jobId: form.jobId,
      status: 'pending',
      notes: form.notes || undefined,
    };
    addReferral(payload);
    setShowModal(false);
    setForm(DEFAULT_FORM);
  };

  const field = (key: keyof ReferralForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle={`${referrals.length} total`}
        actions={
          <Button onClick={() => { setForm(DEFAULT_FORM); setShowModal(true); }}>
            <Plus size={16} /> Add Referral
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-8)' }}>
        {referrals.length === 0 ? (
          <EmptyState icon={<Gift size={28} />} title="No referrals yet" description="Refer candidates for open positions." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {referrals.map((referral) => {
              const job = jobs.find((j) => j.id === referral.jobId);
              const referrer = users.find((u) => u.id === referral.referrerId);
              return (
                <div key={referral.id} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
                      {referral.candidateName}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      {job?.title ?? 'Unknown Job'} &bull; Referred by {referrer?.name ?? 'Unknown'} &bull; {formatDate(referral.createdAt)}
                    </div>
                    {referral.candidateEmail && (
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {referral.candidateEmail}
                      </div>
                    )}
                  </div>
                  <Badge variant={STATUS_VARIANTS[referral.status]}>{referral.status}</Badge>
                  <Select
                    value={referral.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateReferral(referral.id, { status: e.target.value as ReferralStatus })
                    }
                  >
                    {(['pending', 'reviewing', 'hired', 'rejected'] as ReferralStatus[]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => deleteReferral(referral.id)} title="Delete">
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Referral" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Candidate Name *" {...field('candidateName')} />
          <Input label="Candidate Email" type="email" {...field('candidateEmail')} />
          <Select label="Job *" {...field('jobId')}>
            <option value="">Select job</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </Select>
          <Input label="Notes" {...field('notes')} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Referral</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
