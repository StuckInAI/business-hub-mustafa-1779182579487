import { useState } from 'react';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import type { Requisition, RequisitionStatus, RequisitionPriority } from '@/types';

type RequisitionForm = {
  title: string;
  department: string;
  location: string;
  headcount: string;
  priority: RequisitionPriority;
  status: RequisitionStatus;
  notes: string;
};

const STATUS_VARIANTS: Record<RequisitionStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  draft: 'muted',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  open: 'info',
  closed: 'muted',
};

const PRIORITY_VARIANTS: Record<RequisitionPriority, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  low: 'muted',
  medium: 'default',
  high: 'warning',
  urgent: 'danger',
};

const DEFAULT_FORM: RequisitionForm = {
  title: '',
  department: '',
  location: '',
  headcount: '1',
  priority: 'medium',
  status: 'draft',
  notes: '',
};

export default function RequisitionsPage() {
  const { requisitions, currentUser, addRequisition, updateRequisition, deleteRequisition } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<RequisitionForm>(DEFAULT_FORM);
  const [filter, setFilter] = useState<RequisitionStatus | 'all'>('all');

  const filtered = filter === 'all' ? requisitions : requisitions.filter((r) => r.status === filter);

  const handleSubmit = () => {
    if (!form.title || !form.department) return;
    const payload: Omit<Requisition, 'id' | 'createdAt'> = {
      title: form.title,
      department: form.department,
      location: form.location || undefined,
      headcount: Number(form.headcount),
      priority: form.priority,
      status: form.status,
      requestedById: currentUser.id,
      notes: form.notes || undefined,
    };
    addRequisition(payload);
    setShowModal(false);
    setForm(DEFAULT_FORM);
  };

  const field = (key: keyof RequisitionForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle={`${requisitions.length} total`}
        actions={
          <Button onClick={() => { setForm(DEFAULT_FORM); setShowModal(true); }}>
            <Plus size={16} /> New Requisition
          </Button>
        }
      />

      <div style={{ padding: 'var(--space-4) var(--space-8)', display: 'flex', gap: 'var(--space-2)' }}>
        {(['all', 'draft', 'pending', 'approved', 'rejected', 'open', 'closed'] as const).map((s) => (
          <Button key={s} size="sm" variant={filter === s ? 'primary' : 'secondary'} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s}
          </Button>
        ))}
      </div>

      <div style={{ padding: '0 var(--space-8) var(--space-8)' }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<ClipboardList size={28} />} title="No requisitions found" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((req) => (
              <div key={req.id} style={{
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
                    {req.title}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {req.department} &bull; {req.headcount} headcount &bull; {formatDate(req.createdAt)}
                  </div>
                </div>
                <Badge variant={PRIORITY_VARIANTS[req.priority]}>{req.priority}</Badge>
                <Badge variant={STATUS_VARIANTS[req.status]}>{req.status}</Badge>
                <Select
                  value={req.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateRequisition(req.id, { status: e.target.value as RequisitionStatus })
                  }
                >
                  {(['draft', 'pending', 'approved', 'rejected', 'open', 'closed'] as RequisitionStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <Button size="sm" variant="ghost" onClick={() => deleteRequisition(req.id)} title="Delete">
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Requisition" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Title *" placeholder="e.g. Senior Engineer" {...field('title')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Department *" {...field('department')} />
            <Input label="Location" {...field('location')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Headcount" type="number" {...field('headcount')} />
            <Select label="Priority" {...field('priority')}>
              {(['low', 'medium', 'high', 'urgent'] as RequisitionPriority[]).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
            <Select label="Status" {...field('status')}>
              {(['draft', 'pending', 'approved', 'rejected', 'open', 'closed'] as RequisitionStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <Textarea label="Notes" rows={3} {...field('notes')} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Requisition</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
