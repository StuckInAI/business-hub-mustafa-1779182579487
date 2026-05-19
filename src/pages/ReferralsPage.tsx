import { useState } from 'react';
import { Plus, Gift } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, formatDate } from '@/lib/utils';
import type { Referral, ReferralStatus } from '@/types';

type FormState = {
  referrerName: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  referrerName: '',
  candidateName: '',
  candidateEmail: '',
  jobId: '',
  notes: '',
};

export default function ReferralsPage() {
  const { referrals, jobs, addReferral, updateReferral, deleteReferral, currentUser } = useStoreContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Referral | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | ''>('');

  const field = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    label: '',
  });

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (ref: Referral) => {
    setEditing(ref);
    setForm({
      referrerName: ref.referrerName,
      candidateName: ref.candidateName,
      candidateEmail: ref.candidateEmail,
      jobId: ref.jobId,
      notes: ref.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.referrerName || !form.candidateName || !form.candidateEmail || !form.jobId) return;
    if (editing) {
      updateReferral({
        ...editing,
        referrerName: form.referrerName,
        candidateName: form.candidateName,
        candidateEmail: form.candidateEmail,
        jobId: form.jobId,
        notes: form.notes || undefined,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addReferral({
        id: generateId(),
        referrerId: currentUser.id,
        referrerName: form.referrerName,
        candidateName: form.candidateName,
        candidateEmail: form.candidateEmail,
        jobId: form.jobId,
        status: 'pending' as ReferralStatus,
        notes: form.notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setModalOpen(false);
  };

  const statusVariant: Record<ReferralStatus, 'default' | 'success' | 'warning' | 'danger'> = {
    pending: 'default',
    reviewing: 'warning',
    hired: 'success',
    rejected: 'danger',
  };

  const filtered = statusFilter ? referrals.filter((r) => r.status === statusFilter) : referrals;

  return (
    <div>
      <PageHeader
        title="Referrals"
        subtitle="Manage employee referrals"
        actions={<Button onClick={openAdd}><Plus size={16} /> Add Referral</Button>}
      />

      <div style={{ padding: '16px 32px' }}>
        <Select
          label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReferralStatus | '')}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Gift size={32} />}
          title="No referrals found"
          description="Add your first referral to get started."
          action={<Button onClick={openAdd}><Plus size={16} /> Add Referral</Button>}
        />
      ) : (
        <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((ref) => {
            const job = jobs.find((j) => j.id === ref.jobId);
            return (
              <div
                key={ref.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{ref.candidateName}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    Referred by {ref.referrerName} · {job ? job.title : 'Unknown Job'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                    {formatDate(ref.createdAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge variant={statusVariant[ref.status]}>{ref.status}</Badge>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(ref)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteReferral(ref.id)}>Delete</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Referral' : 'Add Referral'}
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Referrer Name *" {...field('referrerName')} />
          <Input label="Candidate Name *" {...field('candidateName')} />
          <Input label="Candidate Email *" type="email" {...field('candidateEmail')} />
          <Select label="Job *" value={form.jobId} onChange={(e) => setForm(f => ({ ...f, jobId: e.target.value }))}>
            <option value="">Select job...</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </Select>
          <Input label="Notes" {...field('notes')} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add Referral'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
