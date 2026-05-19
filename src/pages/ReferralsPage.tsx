import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { Gift, Plus } from 'lucide-react';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function ReferralsPage() {
  const { referrals, addReferral, jobs, currentUser } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    jobId: '',
    notes: '',
  });

  const handleSubmit = () => {
    if (!form.candidateName || !form.candidateEmail) return;
    addReferral({
      referrerId: currentUser.id,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      jobId: form.jobId || null,
      notes: form.notes,
      status: 'pending',
      bonus: null,
    });
    setForm({ candidateName: '', candidateEmail: '', jobId: '', notes: '' });
    setShowModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle="Employee referral program"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Submit Referral
          </Button>
        }
      />
      <div style={{ padding: '1.5rem 2rem' }}>
        {referrals.length === 0 ? (
          <EmptyState
            icon={<Gift size={32} />}
            title="No referrals yet"
            description="Submit your first employee referral."
            action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Submit Referral</Button>}
          />
        ) : (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Job</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => {
                  const job = jobs.find((j) => j.id === ref.jobId);
                  return (
                    <tr key={ref.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{ref.candidateName}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{ref.candidateEmail}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{job?.title || '—'}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <Badge variant={getStatusVariant(ref.status)}>{ref.status}</Badge>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        {formatDate(ref.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Submit Referral">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Candidate Name" required value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} />
          <Input label="Candidate Email" type="email" required value={form.candidateEmail} onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })} />
          <Select
            label="Job (optional)"
            value={form.jobId}
            onChange={(e) => setForm({ ...form, jobId: e.target.value })}
            options={[
              { value: '', label: 'No specific job' },
              ...jobs.filter((j) => j.status === 'open').map((j) => ({ value: j.id, label: j.title })),
            ]}
          />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Referral</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
