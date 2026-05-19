import { useState } from 'react';
import { Gift } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function ReferralsPage() {
  const { referrals, jobs, addReferral, currentUser } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    jobId: '',
    notes: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addReferral({
      referrerId: currentUser.id,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      jobId: form.jobId,
      status: 'pending',
      notes: form.notes || undefined,
    });
    setShowModal(false);
    setForm({ candidateName: '', candidateEmail: '', jobId: '', notes: '' });
  }

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle="Employee referral tracking"
        actions={
          <Button onClick={() => setShowModal(true)}>Submit Referral</Button>
        }
      />

      <div style={{ padding: '2rem' }}>
        {referrals.length === 0 ? (
          <EmptyState
            icon={<Gift size={28} />}
            title="No referrals yet"
            description="Submit your first employee referral."
            action={<Button onClick={() => setShowModal(true)}>Submit Referral</Button>}
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Candidate</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Job</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral) => {
                const job = jobs.find((j) => j.id === referral.jobId);
                return (
                  <tr key={referral.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{referral.candidateName}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{referral.candidateEmail}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>{job?.title || 'Unknown'}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{formatDate(referral.createdAt)}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge variant={getStatusVariant(referral.status)}>{referral.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Referral">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
            placeholder="Select job"
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
