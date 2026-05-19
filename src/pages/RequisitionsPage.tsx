import { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import Textarea from '@/components/ui/Textarea';
import { formatDate } from '@/lib/utils';
import type { RequisitionStatus, RequisitionPriority, JobDepartment } from '@/types';

const STATUS_COLORS: Record<RequisitionStatus, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  draft: 'muted',
  pending: 'default',
  approved: 'success',
  rejected: 'danger',
  filled: 'info',
  cancelled: 'muted',
};

const PRIORITY_COLORS: Record<RequisitionPriority, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'muted'> = {
  low: 'muted',
  medium: 'default',
  high: 'warning',
  urgent: 'danger',
};

export default function RequisitionsPage() {
  const { requisitions, currentUser, addRequisition, updateRequisition } = useStoreContext();
  const [filterStatus, setFilterStatus] = useState<RequisitionStatus | ''>('');
  const [filterDept, setFilterDept] = useState<JobDepartment | ''>('');
  const [filterPriority, setFilterPriority] = useState<RequisitionPriority | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: 'engineering' as JobDepartment,
    priority: 'medium' as RequisitionPriority,
    headcount: '1',
    justification: '',
  });

  const filtered = requisitions.filter((r) => {
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchDept = !filterDept || r.department === filterDept;
    const matchPriority = !filterPriority || r.priority === filterPriority;
    return matchStatus && matchDept && matchPriority;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequisition({
      title: form.title,
      department: form.department,
      requestedById: currentUser.id,
      requestedByName: currentUser.name,
      status: 'draft',
      priority: form.priority,
      headcount: parseInt(form.headcount, 10),
      justification: form.justification,
    });
    setShowModal(false);
    setForm({ title: '', department: 'engineering', priority: 'medium', headcount: '1', justification: '' });
  };

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle={`${requisitions.length} total requisitions`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Requisition
          </Button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <Select
            label=""
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value as JobDepartment | '')}
            options={[
              { value: '', label: 'All Departments' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'design', label: 'Design' },
              { value: 'product', label: 'Product' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'hr', label: 'HR' },
              { value: 'finance', label: 'Finance' },
              { value: 'operations', label: 'Operations' },
            ]}
          />
          <Select
            label=""
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as RequisitionPriority | '')}
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RequisitionStatus | '')}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'filled', label: 'Filled' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No requisitions found"
            description="Create your first hiring requisition."
            action={<Button onClick={() => setShowModal(true)}>New Requisition</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((req) => (
              <div
                key={req.id}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{req.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                    {req.department} &middot; {req.headcount} headcount &middot; Requested by {req.requestedByName}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>{req.justification}</p>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(req.createdAt)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Badge variant={PRIORITY_COLORS[req.priority]}>{req.priority}</Badge>
                    <Badge variant={STATUS_COLORS[req.status]}>{req.status}</Badge>
                  </div>
                  <Select
                    label=""
                    value={req.status}
                    onChange={(e) => updateRequisition(req.id, { status: e.target.value as RequisitionStatus })}
                    options={[
                      { value: 'draft', label: 'Draft' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'approved', label: 'Approved' },
                      { value: 'rejected', label: 'Rejected' },
                      { value: 'filled', label: 'Filled' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Requisition">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Position Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value as JobDepartment })}
            options={[
              { value: 'engineering', label: 'Engineering' },
              { value: 'design', label: 'Design' },
              { value: 'product', label: 'Product' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'sales', label: 'Sales' },
              { value: 'hr', label: 'HR' },
              { value: 'finance', label: 'Finance' },
              { value: 'operations', label: 'Operations' },
            ]}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as RequisitionPriority })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
          <Input label="Headcount" type="number" value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} required />
          <Textarea label="Justification" value={form.justification} onChange={(e) => setForm({ ...form, justification: e.target.value })} rows={4} required />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Submit Requisition</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
