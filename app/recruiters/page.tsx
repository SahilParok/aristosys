'use client';
import { useState } from 'react';
import DemoNav from '@/components/DemoNav';

interface AssignedJD { title: string; client: string; status: string; deficit: boolean; critical: boolean; difficult: boolean }

const RECRUITERS: { name: string; email: string; phone: string; candidates: number; assigned: AssignedJD[] }[] = [
  { name: 'Nisha Devi', email: 'nisha@demo.com', phone: '+91 98100 11001', candidates: 38, assigned: [
    { title: 'Senior Software Engineer', client: 'Horizon Tech Partners', status: 'active', deficit: true, critical: true, difficult: false },
    { title: 'Full Stack Developer', client: 'Horizon Tech Partners', status: 'active', deficit: false, critical: false, difficult: true },
    { title: 'DevOps Engineer', client: 'NovaByte Systems', status: 'active', deficit: false, critical: false, difficult: false },
    { title: 'React Developer', client: 'NovaByte Systems', status: 'closed', deficit: false, critical: false, difficult: false },
  ]},
  { name: 'Tanya Mathur', email: 'tanya@demo.com', phone: '+91 98100 11002', candidates: 29, assigned: [
    { title: 'Senior Software Engineer', client: 'Horizon Tech Partners', status: 'active', deficit: false, critical: false, difficult: false },
    { title: 'Data Engineer', client: 'PeakLogic Analytics', status: 'active', deficit: true, critical: false, difficult: true },
    { title: 'Backend Developer', client: 'Horizon Tech Partners', status: 'closed', deficit: false, critical: false, difficult: false },
  ]},
  { name: 'Fatima Khan', email: 'fatima@demo.com', phone: '+91 98100 11003', candidates: 24, assigned: [
    { title: 'Senior Software Engineer', client: 'Horizon Tech Partners', status: 'active', deficit: false, critical: true, difficult: false },
    { title: 'DevOps Engineer', client: 'NovaByte Systems', status: 'active', deficit: false, critical: false, difficult: false },
    { title: 'System Admin', client: 'Meridian Digital', status: 'closed', deficit: false, critical: false, difficult: false },
  ]},
  { name: 'Rekha Prasad', email: 'rekha@demo.com', phone: '+91 98100 11004', candidates: 21, assigned: [
    { title: 'Full Stack Developer', client: 'Horizon Tech Partners', status: 'active', deficit: false, critical: false, difficult: true },
    { title: 'Data Engineer', client: 'PeakLogic Analytics', status: 'active', deficit: false, critical: false, difficult: false },
  ]},
  { name: 'Prerna Saxena', email: 'prerna@demo.com', phone: '+91 98100 11005', candidates: 18, assigned: [
    { title: 'Full Stack Developer', client: 'Horizon Tech Partners', status: 'active', deficit: true, critical: true, difficult: true },
    { title: 'DevOps Engineer', client: 'NovaByte Systems', status: 'active', deficit: false, critical: false, difficult: false },
  ]},
];

const MANAGERS = [
  { name: 'Rohit Verma', email: 'rohit.v@demo.com', phone: '+91 98100 22001', notes: 'Handles Horizon Tech accounts', jds: 4, assigned: [
    { title: 'Senior Software Engineer', client: 'Horizon Tech Partners', status: 'active' },
    { title: 'Full Stack Developer', client: 'Horizon Tech Partners', status: 'active' },
  ]},
  { name: 'Deepak Thakur', email: 'deepak.t@demo.com', phone: '+91 98100 22002', notes: 'NovaByte & cloud roles', jds: 3, assigned: [
    { title: 'DevOps Engineer', client: 'NovaByte Systems', status: 'active' },
    { title: 'QA Automation Engineer', client: 'NovaByte Systems', status: 'active' },
  ]},
  { name: 'Anita Sharma', email: 'anita.s@demo.com', phone: '+91 98100 22003', notes: 'PeakLogic & data roles', jds: 2, assigned: [
    { title: 'Data Engineer', client: 'PeakLogic Analytics', status: 'active' },
  ]},
];

const PANEL = [
  { name: 'Vikash Kumar', email: 'vikash.k@demo.com', phone: '+91 98100 33001', notes: 'Java/Spring Boot technical panel' },
  { name: 'Sunita Rao', email: 'sunita.r@demo.com', phone: '+91 98100 33002', notes: 'Full stack & frontend panel' },
  { name: 'Manoj Pillai', email: 'manoj.p@demo.com', phone: '+91 98100 33003', notes: 'DevOps & cloud infrastructure panel' },
  { name: 'Kavita Jain', email: 'kavita.j@demo.com', phone: '+91 98100 33004', notes: 'Data engineering panel' },
];

type Tab = 'recruiters' | 'managers' | 'panel';

function SliderToggle({ label, on, onChange, color }: { label: string; on: boolean; onChange: () => void; color: string }) {
  return (
    <div onClick={onChange} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ width: '28px', height: '16px', background: on ? color : 'rgba(255,255,255,0.15)', borderRadius: '10px', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: on ? '14px' : '2px', transition: 'left 0.2s' }} />
      </div>
      <span style={{ fontSize: '11px', color: on ? color : 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

export default function InternalTeam() {
  const [tab, setTab] = useState<Tab>('recruiters');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [jdFlags, setJdFlags] = useState<Record<string, { critical: boolean; difficult: boolean }>>(() => {
    const init: Record<string, { critical: boolean; difficult: boolean }> = {};
    RECRUITERS.forEach(r => r.assigned.forEach(jd => {
      init[`${r.name}-${jd.title}`] = { critical: jd.critical, difficult: jd.difficult };
    }));
    return init;
  });

  const toggleFlag = (recruiter: string, jdTitle: string, flag: 'critical' | 'difficult') => {
    const key = `${recruiter}-${jdTitle}`;
    setJdFlags(prev => ({ ...prev, [key]: { ...prev[key], [flag]: !prev[key][flag] } }));
  };

  const tabBtn = (t: Tab, count: number, color: string, activeColor: string) => (
    <button onClick={() => { setTab(t); setExpanded(null); }} style={{
      padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      background: tab === t ? `${color}30` : 'rgba(255,255,255,0.05)',
      border: tab === t ? `1px solid ${color}60` : '1px solid rgba(255,255,255,0.1)',
      color: tab === t ? activeColor : 'rgba(255,255,255,0.6)',
    }}>{t === 'recruiters' ? 'Recruiters' : t === 'managers' ? 'Managers' : 'Internal Panel'} ({count})</button>
  );

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '15px' };
  const cardBg = 'rgba(255,255,255,0.03)';
  const cardBorder = '1px solid rgba(255,255,255,0.1)';

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main className="team-main" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>👥 Internal Team</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Manage recruiters, managers, and internal panel members</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
          {tabBtn('recruiters', RECRUITERS.length, 'rgba(59,130,246)', '#60a5fa')}
          {tabBtn('managers', MANAGERS.length, 'rgba(139,92,246)', '#a78bfa')}
          {tabBtn('panel', PANEL.length, 'rgba(16,185,129)', '#34d399')}
        </div>

        {/* ===== RECRUITERS ===== */}
        {tab === 'recruiters' && (
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px' }}>
            {/* Form */}
            <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>➕ Add New Recruiter</h3>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Name *</label><input placeholder="e.g., John Smith" style={inputStyle} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Email</label><input placeholder="e.g., john@company.com" style={inputStyle} /></div>
              <div style={{ marginBottom: '25px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Phone</label><input placeholder="e.g., +91 98100 12345" style={inputStyle} /></div>
              <button style={{ width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>➕ Add Recruiter</button>
            </div>

            {/* List */}
            <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '18px', margin: 0 }}>📋 Recruiter List</h3>
                <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', cursor: 'pointer' }}>🔄 Refresh</button>
              </div>
              <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                {RECRUITERS.map((r, i) => {
                  const activeJds = r.assigned.filter(j => j.status === 'active').length;
                  const deficitJds = r.assigned.filter(j => j.deficit).length;
                  return (
                  <div key={i}>
                    <div style={{ padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', background: expanded === r.name ? 'rgba(59,130,246,0.1)' : 'transparent' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{r.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{r.email}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '12px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>{r.candidates} candidates</span>
                        <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '12px', background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>{activeJds} JDs</span>
                        {deficitJds > 0 && <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '12px', background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{deficitJds} deficit JDs</span>}
                        <button onClick={() => setExpanded(expanded === r.name ? null : r.name)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer' }}>{expanded === r.name ? '▼' : '▶'}</button>
                        <button style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.2)', border: 'none', borderRadius: '6px', color: '#10b981', fontSize: '12px', cursor: 'pointer' }}>+ Assign JD</button>
                        <button style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                      </div>
                    </div>
                    {expanded === r.name && (
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '12px', fontWeight: '600' }}>Assigned JDs ({r.assigned.length})</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {r.assigned.map((jd, j) => {
                            const flags = jdFlags[`${r.name}-${jd.title}`] || { critical: false, difficult: false };
                            return (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <div>
                                <div style={{ color: '#60a5fa', fontSize: '13px', fontWeight: '500' }}>{jd.title}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{jd.client}</span>
                                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '500', background: jd.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)', color: jd.status === 'active' ? '#22c55e' : '#6b7280' }}>{jd.status}</span>
                                  {jd.deficit && <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '500', background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>deficit</span>}
                                  <SliderToggle label="Critical" on={flags.critical} onChange={() => toggleFlag(r.name, jd.title, 'critical')} color="#ef4444" />
                                  <SliderToggle label="Difficult" on={flags.difficult} onChange={() => toggleFlag(r.name, jd.title, 'difficult')} color="#a855f7" />
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button style={{ padding: '5px 10px', background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '4px', color: '#60a5fa', fontSize: '11px', cursor: 'pointer' }}>View</button>
                                <button style={{ padding: '5px 10px', background: 'rgba(168,85,247,0.2)', border: 'none', borderRadius: '4px', color: '#a855f7', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                                <button style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '4px', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>Remove</button>
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===== MANAGERS ===== */}
        {tab === 'managers' && (
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px' }}>
            <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>➕ Add New Manager</h3>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Name *</label><input placeholder="e.g., Jane Doe" style={inputStyle} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Email</label><input placeholder="e.g., jane@company.com" style={inputStyle} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Phone</label><input placeholder="e.g., +91 98100 12345" style={inputStyle} /></div>
              <div style={{ marginBottom: '25px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Notes</label><textarea placeholder="Any notes about this manager..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} /></div>
              <button style={{ width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>➕ Add Manager</button>
            </div>
            <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: 'white', fontSize: '18px', margin: 0 }}>📋 Manager List</h3>
              </div>
              <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                {MANAGERS.map((m, i) => (
                  <div key={i}>
                    <div style={{ padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', background: expanded === m.name ? 'rgba(139,92,246,0.1)' : 'transparent' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{m.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{m.email} · {m.phone}</div>
                        {m.notes && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>{m.notes}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '12px', background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>{m.jds} JDs</span>
                        <button onClick={() => setExpanded(expanded === m.name ? null : m.name)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer' }}>{expanded === m.name ? '▼' : '▶'}</button>
                        <button style={{ padding: '6px 12px', background: 'rgba(139,92,246,0.2)', border: 'none', borderRadius: '6px', color: '#a78bfa', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                      </div>
                    </div>
                    {expanded === m.name && (
                      <div style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '15px' }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '12px', fontWeight: '600' }}>Assigned JDs ({m.assigned.length})</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {m.assigned.map((jd, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                              <div>
                                <div style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '500' }}>{jd.title}</div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '4px' }}>{jd.client}</div>
                              </div>
                              <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '500', background: jd.status === 'active' ? 'rgba(34,197,94,0.2)' : 'rgba(107,114,128,0.2)', color: jd.status === 'active' ? '#22c55e' : '#6b7280' }}>{jd.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== INTERNAL PANEL ===== */}
        {tab === 'panel' && (
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px' }}>
            <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>➕ Add Panel Member</h3>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Name *</label><input placeholder="e.g., Vikash Kumar" style={inputStyle} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Email</label><input placeholder="e.g., vikash@company.com" style={inputStyle} /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Phone</label><input placeholder="e.g., +91 98100 12345" style={inputStyle} /></div>
              <div style={{ marginBottom: '25px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Notes</label><textarea placeholder="Specialization, availability..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} /></div>
              <button style={{ width: '100%', padding: '12px 20px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>➕ Add Panel Member</button>
            </div>
            <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: 'white', fontSize: '18px', margin: 0 }}>📋 Internal Panel Members</h3>
              </div>
              <div>
                {PANEL.map((p, i) => (
                  <div key={i} style={{ padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{p.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{p.email} · {p.phone}</div>
                      {p.notes && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', fontStyle: 'italic' }}>{p.notes}</div>}
                    </div>
                    <button style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.2)', border: 'none', borderRadius: '6px', color: '#34d399', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                    <button style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '6px', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <style jsx>{`
        @media (max-width: 640px) {
          .team-main { padding: 16px !important; }
          .team-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </div>
  );
}
