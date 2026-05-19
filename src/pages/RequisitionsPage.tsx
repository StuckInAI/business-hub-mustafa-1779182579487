import { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { RequisitionStatus, RequisitionPriority } from '@/types';

const PRIORITY_OPTIONS: { label: string; value: RequisitionPriority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const STATUS_OPTIONS: { label: string; value: RequisitionStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Open', value: 'open' },
];

type FormState = {
  title: string;
  department: string;
  headcount: string;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  notes: string;
};

const defaultForm: FormState = {
  title: '',
  department: '',
  headcount: '1',
  priority: 'medium',
  status: 'pending',
  notes: '',
};

export default function RequisitionsPage() {
  const { requisitions, currentUser, addRequisition, updateRequisition, deleteRequisition } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addRequisition({
      title: form.title,
      department: form.department,
      headcount: Number(form.headcount),
      priority: form.priority,
      status: form.status,
      requestedById: currentUser.id,
      notes: form.notes,
    });
    setShowModal(false);
    setForm(defaultForm);
  }

  function getPriorityVariant(priority: RequisitionPriority) {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'muted';
    }
  }

  function getStatusVariant(status: RequisitionStatus) {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      case 'open': return 'info';
      default: return 'muted';
    }
  }

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle={`${requisitions.length} requisitions`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Requisition
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
        {requisitions.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No requisitions"
            description="Create a hiring requisition to begin the approval process."
            action={<Button onClick={() => setShowModal(true)}>New Requisition</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {requisitions.map((req) => (
              <div
                key={req.id}
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
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{req.title}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {req.department} &bull; {req.headcount} headcount &bull; {formatDate(req.createdAt)}
                  </div>
                  {req.notes && (
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                      {req.notes}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Badge variant={getPriorityVariant(req.priority)}>{req.priority}</Badge>
                  <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                  <Select
                    value={req.status}
                    onChange={(v) => updateRequisition(req.id, { status: v as RequisitionStatus })}
                    options={STATUS_OPTIONS}
                  />
                  <button
                    style={{ color: 'var(--color-danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}
                    onClick={() => deleteRequisition(req.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Requisition">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          <Input label="Headcount" type="number" value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(v) => setForm({ ...form, priority: v as RequisitionPriority })}
            options={PRIORITY_OPTIONS}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as RequisitionStatus })}
            options={STATUS_OPTIONS}
          />
          <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
