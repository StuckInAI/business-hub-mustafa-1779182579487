import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList, Plus } from 'lucide-react';
import { getStatusVariant, formatDate } from '@/lib/utils';
import type { Requisition, RequisitionStatus, RequisitionPriority } from '@/types';

type RequisitionForm = {
  title: string;
  department: string;
  location: string;
  type: string;
  experienceLevel: string;
  status: RequisitionStatus;
  priority: RequisitionPriority;
  requestedBy: string;
  justification: string;
  headcount: string;
  budgetMin: string;
  budgetMax: string;
  targetStartDate: string;
};

const EMPTY_FORM: RequisitionForm = {
  title: '',
  department: '',
  location: '',
  type: 'full_time',
  experienceLevel: 'mid',
  status: 'draft',
  priority: 'medium',
  requestedBy: '',
  justification: '',
  headcount: '1',
  budgetMin: '',
  budgetMax: '',
  targetStartDate: '',
};

export default function RequisitionsPage() {
  const { requisitions, addRequisition, updateRequisition, deleteRequisition } = useStoreContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RequisitionForm>(EMPTY_FORM);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  }

  function openEdit(req: Requisition) {
    setForm({
      title: req.title,
      department: req.department,
      location: req.location,
      type: req.type,
      experienceLevel: req.experienceLevel,
      status: req.status,
      priority: req.priority,
      requestedBy: req.requestedBy,
      justification: req.justification,
      headcount: String(req.headcount),
      budgetMin: req.budgetMin ? String(req.budgetMin) : '',
      budgetMax: req.budgetMax ? String(req.budgetMax) : '',
      targetStartDate: req.targetStartDate || '',
    });
    setEditingId(req.id);
    setIsModalOpen(true);
  }

  function handleSave() {
    const data: Partial<Requisition> = {
      title: form.title,
      department: form.department,
      location: form.location,
      type: form.type as Requisition['type'],
      experienceLevel: form.experienceLevel as Requisition['experienceLevel'],
      status: form.status,
      priority: form.priority,
      requestedBy: form.requestedBy,
      justification: form.justification,
      headcount: Number(form.headcount),
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      targetStartDate: form.targetStartDate || undefined,
    };
    if (editingId) {
      updateRequisition(editingId, data);
    } else {
      addRequisition(data as Omit<Requisition, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setIsModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle="Manage headcount requests"
        actions={
          <Button onClick={openAdd}>
            <Plus size={16} /> Add Requisition
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {requisitions.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No requisitions yet"
            description="Create your first headcount requisition."
            action={<Button onClick={openAdd}><Plus size={16} /> Add Requisition</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requisitions.map((req) => (
              <div
                key={req.id}
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
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)' }}>{req.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {req.department} · {req.location} · {req.headcount} headcount
                  </div>
                </div>
                <Badge variant={getStatusVariant(req.priority)}>{req.priority}</Badge>
                <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{formatDate(req.createdAt)}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="secondary" onClick={() => openEdit(req)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteRequisition(req.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Requisition' : 'Add Requisition'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Input label="Department" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input label="Headcount" type="number" value={form.headcount} onChange={(e) => setForm((f) => ({ ...f, headcount: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              options={[
                { value: 'full_time', label: 'Full Time' },
                { value: 'part_time', label: 'Part Time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' },
              ]}
            />
            <Select
              label="Experience Level"
              value={form.experienceLevel}
              onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))}
              options={[
                { value: 'entry', label: 'Entry' },
                { value: 'mid', label: 'Mid' },
                { value: 'senior', label: 'Senior' },
                { value: 'lead', label: 'Lead' },
                { value: 'executive', label: 'Executive' },
              ]}
            />
            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as RequisitionPriority }))}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </div>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RequisitionStatus }))}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'fulfilled', label: 'Fulfilled' },
            ]}
          />
          <Input label="Requested By" value={form.requestedBy} onChange={(e) => setForm((f) => ({ ...f, requestedBy: e.target.value }))} />
          <Textarea label="Justification" value={form.justification} onChange={(e) => setForm((f) => ({ ...f, justification: e.target.value }))} rows={3} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input label="Budget Min" type="number" value={form.budgetMin} onChange={(e) => setForm((f) => ({ ...f, budgetMin: e.target.value }))} />
            <Input label="Budget Max" type="number" value={form.budgetMax} onChange={(e) => setForm((f) => ({ ...f, budgetMax: e.target.value }))} />
          </div>
          <Input label="Target Start Date" type="date" value={form.targetStartDate} onChange={(e) => setForm((f) => ({ ...f, targetStartDate: e.target.value }))} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Requisition'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
