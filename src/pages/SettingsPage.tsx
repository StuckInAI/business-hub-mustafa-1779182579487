import { useState } from 'react';
import { useStoreContext } from '@/context/StoreContext';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useStoreContext();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    companyName: 'TalentFlow Inc.',
    contactEmail: currentUser.email || 'admin@talentflow.com',
    defaultLocation: 'Remote',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your ATS preferences"
        actions={
          <Button onClick={handleSave}>
            <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        }
      />
      <div style={{ padding: '1.5rem 2rem', maxWidth: 600 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={18} /> Company Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Company Name"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
            <Input
              label="Contact Email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            />
            <Input
              label="Default Location"
              value={form.defaultLocation}
              onChange={(e) => setForm({ ...form, defaultLocation: e.target.value })}
            />
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Current User</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Name:</span> {currentUser.name}</div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>Role:</span> {currentUser.role.replace('_', ' ')}</div>
            {currentUser.email && <div><span style={{ color: 'var(--color-text-muted)' }}>Email:</span> {currentUser.email}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
