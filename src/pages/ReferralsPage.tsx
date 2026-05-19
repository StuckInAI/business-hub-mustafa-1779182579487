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
import { getStatusVariant, formatDate } from '@/lib/utils';
import type { Referral, ReferralStatus } from '@/types';

type ReferralForm = {
  referrerId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  status: ReferralStatus;
  notes: string;
};

const EMPTY_FORM: ReferralForm = {
  referrerId: '',
  candidateName: '',
  candidateEmail: '',
  jobId: '',
  status: 'pending',
  notes: '',
};

export default function ReferralsPage() {
  const { referrals, jobs, addReferral, updateReferral, deleteReferral } = useStoreContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReferralForm>(EMPTY_FORM);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  }

  function openEdit(r: Referral) {
    setForm({
      referrerId: r.referrerId,
      candidateName: r.candidateName,
      candidateEmail: r.candidateEmail,
      jobId: r.jobId,
      status: r.status,
      notes: r.notes || '',
    });
    setEditingId(r.id);
    setIsModalOpen(true);
  }

  function handleSave() {
    if (editingId) {
      updateReferral(editingId, form);
    } else {
      addReferral(form);
    }
    setIsModalOpen(false);
  }

  function getJobTitle(id: string) {
    return jobs.find((j) => j.id === id)?.title ?? id;
  }

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle="Manage employee referrals"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Referral
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {referrals.length === 0 ? (
          <EmptyState
            icon={<Gift size={28} />}
            title="No referrals yet"
            description="Add your first employee referral."
            action={<Button onClick={openAdd}><Plus size={16} /> Add Referral</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {referrals.map((r) => (
              <div
                key={r.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>{r.candidateName}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {r.candidateEmail} · {getJobTitle(r.jobId)}
                  </div>
                </div>
                <Badge variant={getStatusVariant(r.status)}>{r.status}</Badge>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{formatDate(r.createdAt)}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteReferral(r.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Referral' : 'Add Referral'} size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Referrer ID"
            value={form.referrerId}
            onChange={(e) => setForm((f) => ({ ...f, referrerId: e.target.value }))}
          />
          <Input
            label="Candidate Name"
            required
            value={form.candidateName}
            onChange={(e) => setForm((f) => ({ ...f, candidateName: e.target.value }))}
          />
          <Input
            label="Candidate Email"
            type="email"
            value={form.candidateEmail}
            onChange={(e) => setForm((f) => ({ ...f, candidateEmail: e.target.value }))}
          />
          <Select
            label="Job"
            value={form.jobId}
            onChange={(e) => setForm((f) => ({ ...f, jobId: e.target.value }))}
            options={[
              { value: '', label: 'Select job...' },
              ...jobs.map((j) => ({ value: j.id, label: j.title })),
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ReferralStatus }))}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'reviewed', label: 'Reviewed' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
          <Input
            label="Notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Referral'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
