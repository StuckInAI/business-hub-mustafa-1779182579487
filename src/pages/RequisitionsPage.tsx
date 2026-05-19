import { useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { generateId, formatDate } from '@/lib/utils';
import type { Requisition, RequisitionStatus, RequisitionPriority } from '@/types';

type FormState = {
  title: string;
  department: string;
  headcount: string;
  priority: RequisitionPriority | '';
  status: RequisitionStatus | '';
  justification: string;
  requestedBy: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  department: '',
  headcount: '1',
  priority: 'medium',
  status: 'pending',
  justification: '',
  requestedBy: '',
};

export default function RequisitionsPage() {
  const { requisitions, addRequisition, updateRequisition, deleteRequisition, currentUser } = useStoreContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Requisition | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [statusFilter, setStatusFilter] = useState<RequisitionStatus | ''>('');

  const field = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    label: '',
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, requestedBy: currentUser.name });
    setModalOpen(true);
  };

  const openEdit = (req: Requisition) => {
    setEditing(req);
    setForm({
      title: req.title,
      department: req.department,
      headcount: String(req.headcount),
      priority: req.priority,
      status: req.status,
      justification: req.justification,
      requestedBy: req.requestedBy,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.department || !form.requestedBy) return;
    if (editing) {
      updateRequisition({
        ...editing,
        title: form.title,
        department: form.department,
        headcount: Number(form.headcount),
        priority: form.priority as RequisitionPriority,
        status: form.status as RequisitionStatus,
        justification: form.justification,
        requestedBy: form.requestedBy,
        updatedAt: new Date().toISOString(),
      });
    } else {
      addRequisition({
        id: generateId(),
        title: form.title,
        department: form.department,
        headcount: Number(form.headcount),
        priority: form.priority as RequisitionPriority || 'medium',
        status: form.status as RequisitionStatus || 'pending',
        justification: form.justification,
        requestedBy: form.requestedBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setModalOpen(false);
  };

  const priorityVariant: Record<RequisitionPriority, 'danger' | 'warning' | 'info' | 'muted'> = {
    urgent: 'danger',
    high: 'warning',
    medium: 'info',
    low: 'muted',
  };

  const statusVariant: Record<RequisitionStatus, 'default' | 'success' | 'danger' | 'info' | 'muted'> = {
    pending: 'default',
    approved: 'success',
    rejected: 'danger',
    open: 'info',
    closed: 'muted',
  };

  const filtered = statusFilter ? requisitions.filter((r) => r.status === statusFilter) : requisitions;

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle="Manage hiring requisitions"
        actions={<Button onClick={openAdd}><Plus size={16} /> Add Requisition</Button>}
      />

      <div style={{ padding: '16px 32px' }}>
        <Select
          label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequisitionStatus | '')}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} />}
          title="No requisitions found"
          description="Add your first requisition to get started."
          action={<Button onClick={openAdd}><Plus size={16} /> Add Requisition</Button>}
        />
      ) : (
        <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((req) => (
            <div
              key={req.id}
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
                <div style={{ fontWeight: 600, fontSize: 15 }}>{req.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {req.department} · {req.headcount} headcount
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  Requested by {req.requestedBy} · {formatDate(req.createdAt)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge variant={priorityVariant[req.priority]}>{req.priority}</Badge>
                <Badge variant={statusVariant[req.status]}>{req.status}</Badge>
                <Button size="sm" variant="secondary" onClick={() => openEdit(req)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => deleteRequisition(req.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Requisition' : 'Add Requisition'}
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Title *" {...field('title')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Department *" {...field('department')} />
            <Input label="Headcount" type="number" {...field('headcount')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Priority" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value as RequisitionPriority }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as RequisitionStatus }))}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <Textarea label="Justification" {...field('justification')} rows={3} />
          <Input label="Requested By *" {...field('requestedBy')} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add Requisition'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
