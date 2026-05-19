import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users } from 'lucide-react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, getCandidateStatusVariant, generateId } from '@/lib/utils';
import type { CandidateStatus } from '@/types';

export default function CandidatesPage() {
  const { candidates, jobs, addCandidate } = useStoreContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<CandidateStatus | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    jobId: '',
    source: 'LinkedIn',
    tags: '',
  });

  const filtered = candidates.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || c.candidateStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find((j) => j.id === form.jobId);
    addCandidate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      jobId: form.jobId,
      jobTitle: job?.title ?? '',
      candidateStatus: 'new' as CandidateStatus,
      stage: 'new' as CandidateStatus,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      source: form.source,
      rating: undefined,
    });
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', jobId: '', source: 'LinkedIn', tags: '' });
  };

  // suppress unused import
  void generateId;

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

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            label=""
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CandidateStatus | '')}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'new', label: 'New' },
              { value: 'screening', label: 'Screening' },
              { value: 'interview', label: 'Interview' },
              { value: 'offer', label: 'Offer' },
              { value: 'hired', label: 'Hired' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'withdrawn', label: 'Withdrawn' },
            ]}
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Name', 'Job', 'Status', 'Applied', 'Source', 'Rating'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid var(--color-border-light)', cursor: 'pointer' }}
                  onClick={() => navigate(`/candidates/${c.id}`)}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '12px', fontSize: 14 }}>{c.jobTitle}</td>
                  <td style={{ padding: '12px' }}>
                    <Badge variant={getCandidateStatusVariant(c.candidateStatus)}>
                      {c.candidateStatus.charAt(0).toUpperCase() + c.candidateStatus.slice(1)}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px', fontSize: 14, color: 'var(--color-text-secondary)' }}>{formatDate(c.appliedAt)}</td>
                  <td style={{ padding: '12px', fontSize: 14 }}>{c.source}</td>
                  <td style={{ padding: '12px', fontSize: 14 }}>{c.rating ? '★'.repeat(c.rating) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Candidate">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select
            label="Job"
            value={form.jobId}
            onChange={(e) => setForm({ ...form, jobId: e.target.value })}
            options={jobs.map((j) => ({ value: j.id, label: j.title }))}
            placeholder="Select a job"
            required
          />
          <Input label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Add Candidate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
