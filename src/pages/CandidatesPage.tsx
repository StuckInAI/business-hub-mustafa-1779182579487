import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { Users, Search, Plus, Mail, Phone } from 'lucide-react';
import { formatDate, getStatusVariant } from '@/lib/utils';
import type { Candidate } from '@/types';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  location: '',
  currentTitle: '',
  skills: '',
  source: 'direct' as Candidate['source'],
};

export default function CandidatesPage() {
  const navigate = useNavigate();
  const { candidates, addCandidate } = useStoreContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location,
      currentTitle: form.currentTitle,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      source: form.source,
      status: 'new',
      resumeUrl: '',
      notes: '',
    });
    setForm(initialForm);
    setShowModal(false);
  };

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidates`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Candidate
          </Button>
        }
      />

      <div style={{ padding: '1.5rem 2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'new', label: 'New' },
              { value: 'screening', label: 'Screening' },
              { value: 'interviewing', label: 'Interviewing' },
              { value: 'offered', label: 'Offered' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={32} />}
            title="No candidates found"
            description="Add your first candidate to get started."
            action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Add Candidate</Button>}
          />
        ) : (
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)' }}>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Contact</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Source</th>
                  <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    style={{ borderTop: '1px solid var(--color-border)', cursor: 'pointer' }}
                    onClick={() => navigate(`/candidates/${c.id}`)}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      {c.currentTitle && <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{c.currentTitle}</div>}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        <Mail size={12} /> {c.email}
                      </div>
                      {c.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                          <Phone size={12} /> {c.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{c.source}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{formatDate(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Current Title" value={form.currentTitle} onChange={(e) => setForm({ ...form, currentTitle: e.target.value })} />
          <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <Select
            label="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value as Candidate['source'] })}
            options={[
              { value: 'direct', label: 'Direct' },
              { value: 'referral', label: 'Referral' },
              { value: 'linkedin', label: 'LinkedIn' },
              { value: 'job_board', label: 'Job Board' },
              { value: 'careers_page', label: 'Careers Page' },
            ]}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Candidate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
