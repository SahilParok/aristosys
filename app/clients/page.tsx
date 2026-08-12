'use client';
import { useState } from 'react';
import DemoNav from '@/components/DemoNav';

const CLIENTS_DATA = [
  { name: 'Horizon Tech Partners', prefs: 'Must have minimum 4 years Java experience\nPrefer candidates from product companies over service companies\nReject candidates with only support/maintenance background\nAWS experience is a strong plus', contacts: [
    { name: 'Rajesh Malhotra', email: 'rajesh.m@horizon.com', mobile: '+91 98200 44001' },
    { name: 'Priya Srinivasan', email: 'priya.s@horizon.com', mobile: '+91 98200 44002' },
  ]},
  { name: 'NovaByte Systems', prefs: 'Strong focus on cloud-native technologies\nMust have hands-on Kubernetes experience for DevOps roles\nPrefer candidates comfortable with on-call rotations\nCI/CD pipeline experience is mandatory', contacts: [
    { name: 'Arjun Bhat', email: 'arjun.b@novabyte.com', mobile: '+91 98200 55001' },
  ]},
  { name: 'PeakLogic Analytics', prefs: 'Data engineering candidates must have PySpark experience at scale (TB+ datasets)\nSQL proficiency is non-negotiable\nPrefer candidates with Airflow DAG design experience, not just users\nSnowflake or Redshift experience preferred', contacts: [
    { name: 'Meena Kapoor', email: 'meena.k@peaklogic.com', mobile: '+91 98200 66001' },
    { name: 'Sanjay Gupta', email: 'sanjay.g@peaklogic.com', mobile: '+91 98200 66002' },
  ]},
  { name: 'Meridian Digital', prefs: 'Fintech domain experience preferred\nMust be comfortable with regulatory compliance requirements\nStrong communication skills required — client-facing role', contacts: [
    { name: 'Deepa Nair', email: 'deepa.n@meridian.com', mobile: '+91 98200 77001' },
  ]},
  { name: 'BlueArc Solutions', prefs: '', contacts: [] },
];

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '15px' };
const cardBg = 'rgba(255,255,255,0.03)';
const cardBorder = '1px solid rgba(255,255,255,0.1)';

export default function ClientsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const client = selected !== null ? CLIENTS_DATA[selected] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main className="clients-main" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>🏢 Manage Clients</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Add and configure client companies with their evaluation preferences</p>
        </div>

        <div className="clients-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left - Form */}
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '25px' }}>
            <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>
              {client ? '✏️ Edit Client' : '➕ Add New Client'}
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Client Name *</label>
              <input type="text" defaultValue={client?.name || ''} placeholder="e.g., Acme Corporation" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Evaluation Preferences</label>
              <textarea
                defaultValue={client?.prefs || ''}
                placeholder={'Enter specific requirements for screening candidates for this client...\n\nExamples:\n• Must have AWS certification\n• Reject candidates with only support experience\n• Prefer candidates with 5+ years Java experience'}
                rows={10}
                style={{ ...inputStyle, fontSize: '14px', lineHeight: '1.6', resize: 'vertical' as const }}
              />
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '8px' }}>
                These preferences are used by Claude when scoring candidates for this client
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {client && (
                <button onClick={() => setSelected(null)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              )}
              <button style={{ flex: 1, padding: '12px 20px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                {client ? '💾 Update Client' : '➕ Add Client'}
              </button>
              {client && (
                <button style={{ padding: '12px 20px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '14px', cursor: 'pointer' }}>🗑️ Delete</button>
              )}
            </div>

            {/* Client Contacts */}
            {client && (
              <div style={{ marginTop: '30px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ color: '#f59e0b', fontSize: '16px', margin: 0 }}>🔒 Client Manager Contacts</h4>
                  <button style={{ padding: '6px 12px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', color: '#f59e0b', fontSize: '13px', cursor: 'pointer' }}>+ Add Contact</button>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '15px' }}>Only visible to admins. Store hiring manager contact details here.</p>

                {client.contacts.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontStyle: 'italic' }}>No contacts added yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {client.contacts.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                        <div>
                          <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{c.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>
                            {c.email}{c.email && c.mobile && ' • '}{c.mobile}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button style={{ padding: '4px 8px', background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '4px', color: '#60a5fa', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                          <button style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '4px', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right - Client List */}
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', margin: 0 }}>📋 Client List ({CLIENTS_DATA.length})</h3>
              <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer' }}>🔄 Refresh</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {CLIENTS_DATA.map((c, i) => (
                <div key={i} onClick={() => setSelected(i)} style={{
                  padding: '15px', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '8px',
                  background: selected === i ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                  border: selected === i ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ color: 'white', fontSize: '15px', fontWeight: '600', marginBottom: '5px' }}>{c.name}</div>
                  {c.prefs ? (
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.prefs.split('\n')[0].substring(0, 100)}...
                    </div>
                  ) : (
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontStyle: 'italic' }}>No preferences set</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        @media (max-width: 640px) {
          .clients-main { padding: 16px !important; }
          .clients-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </div>
  );
}
