'use client';
import { useState, useMemo } from 'react';
import DemoNav from '@/components/DemoNav';

const ACTION_COLORS: Record<string, string> = {
  'Candidate Created': '#3b82f6',
  'Candidate Created (Public)': '#6366f1',
  'Resume Uploaded': '#10b981',
  'Resume Re-scored': '#22c55e',
  'Stage Changed': '#f59e0b',
  'AI Interview Sent': '#8b5cf6',
  'AI Interview Completed': '#a78bfa',
  'JD Edited': '#d4af37',
  'JD Created': '#facc15',
  'Recruiter Assigned': '#ec4899',
  'Recruiter Unassigned': '#f472b6',
  'Manager Assigned': '#34d399',
  'Audio Uploaded': '#06b6d4',
  'Notes Updated': '#94a3b8',
  'JD Status Changed': '#fb923c',
};

interface AuditEntry { action: string; detail: string; user: string; time: string; client: string; jd_title: string; person: string; jd_active: boolean }

const AUDIT: AuditEntry[] = [
  { action: 'Candidate Created', detail: 'Ravi Thapar added to pipeline', user: 'Nisha D.', time: '02 Apr 2026, 09:15', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Ravi Thapar', jd_active: true },
  { action: 'Resume Uploaded', detail: 'Resume screened — Score: 87/100', user: 'System', time: '02 Apr 2026, 09:16', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Ravi Thapar', jd_active: true },
  { action: 'Stage Changed', detail: 'Ravi Thapar: Prospect → Submitted to Client', user: 'Nisha D.', time: '02 Apr 2026, 11:30', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Ravi Thapar', jd_active: true },
  { action: 'Stage Changed', detail: 'Ravi Thapar: Submitted to Client → L1 Interview', user: 'Nisha D.', time: '02 Apr 2026, 14:30', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Ravi Thapar', jd_active: true },
  { action: 'AI Interview Completed', detail: 'Tech: 82, Comm: 78 — Recommendation: Proceed', user: 'System', time: '01 Apr 2026, 14:30', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Ravi Thapar', jd_active: true },
  { action: 'AI Interview Sent', detail: 'Interview invite sent to candidate', user: 'Nisha D.', time: '31 Mar 2026, 17:00', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Suresh Balaji', jd_active: true },
  { action: 'AI Interview Completed', detail: 'Tech: 89, Comm: 85 — Recommendation: Strong proceed', user: 'System', time: '30 Mar 2026, 11:10', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Suresh Balaji', jd_active: true },
  { action: 'Stage Changed', detail: 'Suresh Balaji: L1 Interview → Selected', user: 'Nisha D.', time: '30 Mar 2026, 15:45', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Suresh Balaji', jd_active: true },
  { action: 'Candidate Created (Public)', detail: 'Anjali Rao applied via careers portal', user: 'System', time: '30 Mar 2026, 10:22', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Anjali Rao', jd_active: true },
  { action: 'Recruiter Assigned', detail: 'Fatima K. auto-assigned via round-robin', user: 'System', time: '30 Mar 2026, 10:22', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Fatima K.', jd_active: true },
  { action: 'Audio Uploaded', detail: 'Phone screen recording uploaded (5m 22s)', user: 'Tanya M.', time: '29 Mar 2026, 16:10', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Nitin Kapoor', jd_active: true },
  { action: 'JD Edited', detail: 'Skills updated: added "Kafka" to bonus tier', user: 'Tanya M.', time: '29 Mar 2026, 09:30', client: 'Horizon Tech Partners', jd_title: 'Senior Software Engineer', person: 'Tanya Mathur', jd_active: true },

  { action: 'JD Created', detail: 'New JD created — 2 positions, hybrid', user: 'Tanya M.', time: '28 Mar 2026, 11:00', client: 'Horizon Tech Partners', jd_title: 'Full Stack Developer', person: 'Tanya Mathur', jd_active: true },
  { action: 'Recruiter Assigned', detail: 'Rekha P. assigned by Tanya M.', user: 'Tanya M.', time: '28 Mar 2026, 11:05', client: 'Horizon Tech Partners', jd_title: 'Full Stack Developer', person: 'Rekha Prasad', jd_active: true },
  { action: 'Candidate Created', detail: 'Manish Verma added to pipeline', user: 'Rekha P.', time: '28 Mar 2026, 14:20', client: 'Horizon Tech Partners', jd_title: 'Full Stack Developer', person: 'Manish Verma', jd_active: true },
  { action: 'Resume Uploaded', detail: 'Resume screened — Score: 84/100', user: 'System', time: '28 Mar 2026, 14:21', client: 'Horizon Tech Partners', jd_title: 'Full Stack Developer', person: 'Manish Verma', jd_active: true },
  { action: 'Stage Changed', detail: 'Manish Verma: Submitted → L1 Interview', user: 'Rekha P.', time: '30 Mar 2026, 09:45', client: 'Horizon Tech Partners', jd_title: 'Full Stack Developer', person: 'Manish Verma', jd_active: true },

  { action: 'Candidate Created', detail: 'Lakshmi Narayanan added to pipeline', user: 'Fatima K.', time: '27 Mar 2026, 10:15', client: 'NovaByte Systems', jd_title: 'DevOps Engineer', person: 'Lakshmi Narayanan', jd_active: true },
  { action: 'Resume Uploaded', detail: 'Resume screened — Score: 88/100', user: 'System', time: '27 Mar 2026, 10:16', client: 'NovaByte Systems', jd_title: 'DevOps Engineer', person: 'Lakshmi Narayanan', jd_active: true },
  { action: 'AI Interview Sent', detail: 'Interview invite sent', user: 'Fatima K.', time: '28 Mar 2026, 12:00', client: 'NovaByte Systems', jd_title: 'DevOps Engineer', person: 'Lakshmi Narayanan', jd_active: true },
  { action: 'AI Interview Completed', detail: 'Tech: 85, Comm: 72 — Recommendation: Proceed', user: 'System', time: '28 Mar 2026, 15:05', client: 'NovaByte Systems', jd_title: 'DevOps Engineer', person: 'Lakshmi Narayanan', jd_active: true },
  { action: 'Notes Updated', detail: 'Added: "Strong AWS, schedule client round next week"', user: 'Fatima K.', time: '29 Mar 2026, 10:00', client: 'NovaByte Systems', jd_title: 'DevOps Engineer', person: 'Lakshmi Narayanan', jd_active: true },

  { action: 'JD Created', detail: 'New JD — Data Engineer, 1 position, on-site Hyderabad', user: 'Anita S.', time: '20 Mar 2026, 09:00', client: 'PeakLogic Analytics', jd_title: 'Data Engineer', person: 'Anita Sharma', jd_active: true },
  { action: 'Recruiter Assigned', detail: 'Tanya M. assigned', user: 'Anita S.', time: '20 Mar 2026, 09:05', client: 'PeakLogic Analytics', jd_title: 'Data Engineer', person: 'Tanya Mathur', jd_active: true },
  { action: 'Candidate Created', detail: 'Harish Menon added to pipeline', user: 'Tanya M.', time: '21 Mar 2026, 11:20', client: 'PeakLogic Analytics', jd_title: 'Data Engineer', person: 'Harish Menon', jd_active: true },
  { action: 'Resume Uploaded', detail: 'Resume screened — Score: 93/100', user: 'System', time: '21 Mar 2026, 11:21', client: 'PeakLogic Analytics', jd_title: 'Data Engineer', person: 'Harish Menon', jd_active: true },
  { action: 'Stage Changed', detail: 'Harish Menon: L1 Interview → Selected', user: 'Tanya M.', time: '25 Mar 2026, 16:30', client: 'PeakLogic Analytics', jd_title: 'Data Engineer', person: 'Harish Menon', jd_active: true },

  { action: 'JD Status Changed', detail: 'React Developer: Active → Closed (position filled)', user: 'Tanya M.', time: '15 Mar 2026, 14:00', client: 'NovaByte Systems', jd_title: 'React Developer', person: 'Tanya Mathur', jd_active: false },
  { action: 'JD Status Changed', detail: 'System Admin: Active → Closed', user: 'Anita S.', time: '12 Mar 2026, 11:30', client: 'Meridian Digital', jd_title: 'System Admin', person: 'Anita Sharma', jd_active: false },
];

export default function Audit() {
  const [client, setClient] = useState('');
  const [jdTitle, setJdTitle] = useState('');
  const [person, setPerson] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const clientsList = useMemo(() => Array.from(new Set(AUDIT.map(a => a.client))).sort(), []);
  const jdsList = useMemo(() => Array.from(new Set(AUDIT.filter(a => !client || a.client === client).map(a => a.jd_title))).sort(), [client]);
  const peopleList = useMemo(() => Array.from(new Set(AUDIT.map(a => a.person))).sort(), []);

  const filtered = useMemo(() => AUDIT.filter(a =>
    (!client || a.client === client) &&
    (!jdTitle || a.jd_title === jdTitle) &&
    (!person || a.person === person) &&
    (status === 'all' || (status === 'active' ? a.jd_active : !a.jd_active))
  ), [client, jdTitle, person, status]);

  const selectStyle: React.CSSProperties = { padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: 'white', fontSize: '13px', minWidth: '180px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 32px' }}>
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Audit Log</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '20px' }}>
          Full history of all actions across the system — every action is traceable to a user, time, JD, and candidate.
        </p>

        {/* Filters */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px 20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client</label>
              <select value={client} onChange={e => { setClient(e.target.value); setJdTitle(''); }} style={selectStyle}>
                <option value="" style={{ background: '#1e293b' }}>All Clients</option>
                {clientsList.map(c => <option key={c} value={c} style={{ background: '#1e293b' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Job Description</label>
              <select value={jdTitle} onChange={e => setJdTitle(e.target.value)} style={selectStyle}>
                <option value="" style={{ background: '#1e293b' }}>All JDs</option>
                {jdsList.map(j => <option key={j} value={j} style={{ background: '#1e293b' }}>{j}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Person</label>
              <select value={person} onChange={e => setPerson(e.target.value)} style={selectStyle}>
                <option value="" style={{ background: '#1e293b' }}>All People</option>
                {peopleList.map(p => <option key={p} value={p} style={{ background: '#1e293b' }}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</label>
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '6px' }}>
                {(['all', 'active', 'inactive'] as const).map(s => (
                  <button key={s} onClick={() => setStatus(s)} style={{ padding: '5px 12px', background: status === s ? '#3b82f6' : 'transparent', border: 'none', borderRadius: '4px', color: status === s ? 'white' : 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
                ))}
              </div>
            </div>
            {(client || jdTitle || person || status !== 'all') && (
              <button onClick={() => { setClient(''); setJdTitle(''); setPerson(''); setStatus('all'); }} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Clear all</button>
            )}
          </div>
          <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>
            Showing {filtered.length} of {AUDIT.length} events
          </div>
        </div>

        {/* Audit list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((a, i) => {
            const color = ACTION_COLORS[a.action] || '#6b7280';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'rgba(184,151,90,0.06)', borderRadius: '8px', border: '1px solid rgba(184,151,90,0.12)' }}>
                <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color, background: color + '15', border: `1px solid ${color}30`, whiteSpace: 'nowrap', minWidth: '170px', textAlign: 'center' }}>{a.action}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{a.detail}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                    {a.jd_title} <span style={{ opacity: 0.5 }}>·</span> {a.client} {!a.jd_active && <span style={{ marginLeft: '6px', padding: '1px 6px', background: 'rgba(107,114,128,0.2)', color: '#9ca3af', fontSize: '10px', borderRadius: '4px' }}>JD CLOSED</span>}
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>{a.user}</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{a.time}</span>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>No audit events match the selected filters.</div>}
        </div>
      </div>
    </div>
  );
}
