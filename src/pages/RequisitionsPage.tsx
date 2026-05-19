import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { ClipboardList, Plus } from 'lucide-react';
import { formatDate, getStatusVariant } from '@/lib/utils';

export default function RequisitionsPage() {
  const { requisitions, addRequisition, currentUser } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    headcount: 1,
    priority: 'medium' as 'low' | 'medium' | 'high',
    justification: '',
  });

  const handleSubmit = () => {
    if (!form.title || !form.department) return;
    addRequisition({
      title: form.title,
      department: form.department,
      headcount: form.headcount,
      priority: form.priority,
      justification: form.justification,
      status: 'pending',
      requestedBy: currentUser.id,
      approvedBy: null,
    });
    setForm({ title: '', department: '', headcount: 1, priority: 'medium', justification: '' });
    setShowModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle="Manage hiring requisitions"
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Requisition
          </Button>
        }
      />
      <div style={{ padding: '1.5rem 2rem' }}>
        {requisitions.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={32} />}
            title="No requisitions yet"
            description="Create a requisition to request new hires."
            action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> New Requisition</Button>}
          />
        ) : (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Title</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Department</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Headcount</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {requisitions.map((req) => (
                  <tr key={req.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{req.title}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{req.department}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{req.headcount}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge variant={req.priority === 'high' ? 'danger' : req.priority === 'medium' ? 'warning' : 'muted'}>
                        {req.priority}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      {formatDate(req.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Requisition">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Job Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Department" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <Input label="Headcount" type="number" value={String(form.headcount)} onChange={(e) => setForm({ ...form, headcount: Number(e.target.value) })} />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <Input label="Justification" value={form.justification} onChange={(e) => setForm({ ...form, justification: e.target.value })} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Requisition</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
