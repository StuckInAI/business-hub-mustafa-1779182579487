import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate, getStatusVariant } from '@/lib/utils';

type FormState = {
  jobTitle: string;
  department: string;
  headcount: number;
  priority: 'low' | 'medium' | 'high';
  justification: string;
};

export default function RequisitionsPage() {
  const { requisitions, addRequisition, currentUser } = useStoreContext();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>({
    jobTitle: '',
    department: '',
    headcount: 1,
    priority: 'medium',
    justification: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addRequisition({
      jobTitle: form.jobTitle,
      department: form.department,
      headcount: form.headcount,
      priority: form.priority,
      status: 'pending',
      requestedBy: currentUser.id,
      justification: form.justification || undefined,
    });
    setShowModal(false);
    setForm({ jobTitle: '', department: '', headcount: 1, priority: 'medium', justification: '' });
  }

  return (
    <div>
      <PageHeader
        title="Requisitions"
        subtitle="Job requisition management"
        actions={
          <Button onClick={() => setShowModal(true)}>New Requisition</Button>
        }
      />

      <div style={{ padding: '2rem' }}>
        {requisitions.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={28} />}
            title="No requisitions"
            description="Create a job requisition to start the hiring process."
            action={<Button onClick={() => setShowModal(true)}>New Requisition</Button>}
          />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Job Title</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Department</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Priority</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{req.jobTitle}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{req.department}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Badge variant={req.priority === 'high' ? 'danger' : req.priority === 'medium' ? 'warning' : 'muted'}>
                      {req.priority}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>{formatDate(req.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Requisition">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Job Title"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            required
          />
          <Input
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <Input
            label="Headcount"
            type="number"
            value={String(form.headcount)}
            onChange={(e) => setForm({ ...form, headcount: Number(e.target.value) })}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(v) => setForm({ ...form, priority: v as 'low' | 'medium' | 'high' })}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
            ]}
          />
          <Input
            label="Justification"
            value={form.justification}
            onChange={(e) => setForm({ ...form, justification: e.target.value })}
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
