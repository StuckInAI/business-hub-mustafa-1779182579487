import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Users } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, getCandidateStatusVariant, generateId } from '@/lib/utils';
import type { Candidate } from '@/types';

export default function CandidatesPage() {
  const { candidates, addCandidate } = useStoreContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    currentTitle: '',
    currentCompany: '',
    skills: '',
  });

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.currentTitle ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const newCandidate: Candidate = {
      id: generateId(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      location: form.location,
      currentTitle: form.currentTitle,
      currentCompany: form.currentCompany,
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    addCandidate(newCandidate);
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', location: '', currentTitle: '', currentCompany: '', skills: '' });
  };

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total candidates`}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <UserPlus size={16} />
            Add Candidate
          </Button>
        }
      />
      <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={28} />}
            title="No candidates found"
            description="Add your first candidate to get started."
            action={<Button onClick={() => setShowModal(true)}>Add Candidate</Button>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/candidates/${c.id}`)}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4) var(--space-5)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--font-size-sm)'
                  }}>
                    {c.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {c.currentTitle}{c.currentCompany ? ` @ ${c.currentCompany}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {formatDate(c.createdAt)}
                  </span>
                  <Badge variant={getCandidateStatusVariant(c.status)}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Current Title" value={form.currentTitle} onChange={(e) => setForm({ ...form, currentTitle: e.target.value })} />
          <Input label="Current Company" value={form.currentCompany} onChange={(e) => setForm({ ...form, currentCompany: e.target.value })} />
          <Input label="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Add Candidate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
