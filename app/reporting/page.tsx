'use client';
import { useState } from 'react';
import Link from 'next/link';
import DemoNav from '@/components/DemoNav';

const STAGE_LABELS: Record<string, string> = { prospect: 'Prospect', submitted_to_client: 'Submitted to Client', l1_interview: 'L1 Interview', l2_interview: 'L2 Interview', selected: 'Selected' };
const STAGE_COLORS: Record<string, string> = { prospect: '#6b7280', submitted_to_client: '#2563eb', l1_interview: '#a855f7', l2_interview: '#ec4899', selected: '#10b981' };
const agingColor = (d: number) => d <= 3 ? '#10b981' : d <= 7 ? '#f59e0b' : '#ef4444';
const agingBg = (d: number) => d > 7 ? 'rgba(239,68,68,0.08)' : d >= 3 ? 'rgba(245,158,11,0.06)' : 'transparent';

// --- FAKE DATA ---
const AGING = [
  { name: 'Nitin Kapoor', phone: '+91 98100 22014', job: 'Senior Software Engineer', client: 'Horizon Tech', recruiter: 'Tanya M.', manager: 'Rohit V.', stage: 'l2_interview', days: 9, date: '22 Mar' },
  { name: 'Pooja Deshmukh', phone: '+91 98100 22011', job: 'Senior Software Engineer', client: 'Horizon Tech', recruiter: 'Tanya M.', manager: 'Rohit V.', stage: 'submitted_to_client', days: 6, date: '25 Mar' },
  { name: 'Gaurav Chandra', phone: '+91 98100 22020', job: 'DevOps Engineer', client: 'NovaByte Systems', recruiter: 'Prerna S.', manager: 'Deepak T.', stage: 'submitted_to_client', days: 4, date: '28 Mar' },
  { name: 'Swati Kulkarni', phone: '+91 98100 22017', job: 'Full Stack Developer', client: 'Horizon Tech', recruiter: 'Rekha P.', manager: 'Rohit V.', stage: 'submitted_to_client', days: 3, date: '29 Mar' },
  { name: 'Anjali Rao', phone: '+91 98100 22013', job: 'Senior Software Engineer', client: 'Horizon Tech', recruiter: 'Fatima K.', manager: 'Rohit V.', stage: 'prospect', days: 3, date: '30 Mar' },
  { name: 'Sunita Bose', phone: '+91 98100 22021', job: 'DevOps Engineer', client: 'NovaByte Systems', recruiter: 'Fatima K.', manager: 'Deepak T.', stage: 'prospect', days: 3, date: '30 Mar' },
  { name: 'Amit Saxena', phone: '+91 98100 22018', job: 'Full Stack Developer', client: 'Horizon Tech', recruiter: 'Prerna S.', manager: 'Rohit V.', stage: 'prospect', days: 2, date: '31 Mar' },
  { name: 'Aditya Kulkarni', phone: '+91 98100 22021', job: 'DevOps Engineer', client: 'NovaByte Systems', recruiter: 'Fatima K.', manager: 'Deepak T.', stage: 'prospect', days: 2, date: '31 Mar' },
];

const SUBMISSIONS = [
  { title: 'Senior Software Engineer', client: 'Horizon Tech', recruiters: ['Nisha D.', 'Tanya M.'], managers: ['Rohit V.'], positions: 3, active: 4, filled: 1, deficit: -2, critical: false },
  { title: 'Full Stack Developer', client: 'Horizon Tech', recruiters: ['Rekha P.'], managers: ['Rohit V.'], positions: 2, active: 2, filled: 0, deficit: 0, critical: false },
  { title: 'DevOps Engineer', client: 'NovaByte Systems', recruiters: ['Fatima K.', 'Prerna S.'], managers: ['Deepak T.'], positions: 2, active: 2, filled: 0, deficit: 0, critical: false },
  { title: 'Data Engineer', client: 'PeakLogic Analytics', recruiters: ['Tanya M.', 'Rekha P.'], managers: ['Anita S.'], positions: 1, active: 1, filled: 1, deficit: -1, critical: false },
  { title: 'QA Automation Engineer', client: 'NovaByte Systems', recruiters: [], managers: ['Deepak T.'], positions: 2, active: 0, filled: 0, deficit: 2, critical: true },
  { title: 'Cloud Architect', client: 'PeakLogic Analytics', recruiters: [], managers: [], positions: 1, active: 0, filled: 0, deficit: 1, critical: true },
];

const NO_AUDIO = [
  { name: 'Pooja Deshmukh', phone: '+91 98100 22011', job: 'Senior Software Engineer', client: 'Horizon Tech', recruiter: 'Tanya M.', stage: 'submitted_to_client', days: 6, date: '25 Mar' },
  { name: 'Gaurav Chandra', phone: '+91 98100 22020', job: 'DevOps Engineer', client: 'NovaByte Systems', recruiter: 'Prerna S.', stage: 'submitted_to_client', days: 4, date: '28 Mar' },
  { name: 'Swati Kulkarni', phone: '+91 98100 22017', job: 'Full Stack Developer', client: 'Horizon Tech', recruiter: 'Rekha P.', stage: 'submitted_to_client', days: 3, date: '29 Mar' },
];

const HIT_RATIO = { totalJDs: 8, totalCandidates: 47, submittedToClient: 32, l1: 18, l2: 9, selected: 6, joiners: 4, subToL1: 1.8, l1ToL2: 2.0, l2ToSelect: 1.5, selectToJoiner: 1.5, subPerJoiner: 8.0, avgTAT: 34 };
const HIT_JDS = [
  { title: 'Backend Developer', client: 'Horizon Tech', submitted: 8, l1: 5, l2: 3, selected: 2, joiners: 1, tat: 28 },
  { title: 'React Developer', client: 'NovaByte Systems', submitted: 6, l1: 3, l2: 2, selected: 1, joiners: 1, tat: 32 },
  { title: 'Python Developer', client: 'PeakLogic Analytics', submitted: 5, l1: 3, l2: 1, selected: 1, joiners: 1, tat: 38 },
  { title: 'System Admin', client: 'Meridian Digital', submitted: 7, l1: 4, l2: 2, selected: 1, joiners: 1, tat: 41 },
  { title: 'Frontend Developer', client: 'Horizon Tech', submitted: 6, l1: 3, l2: 1, selected: 1, joiners: 0, tat: null },
];

const thStyle = (active?: boolean): React.CSSProperties => ({ textAlign: 'left' as const, padding: '15px', color: active ? '#60a5fa' : 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', userSelect: 'none' as const });
const thCenter = { ...thStyle(), textAlign: 'center' as const, cursor: 'default' as const };
const cardBg = 'rgba(255,255,255,0.03)';
const cardBorder = '1px solid rgba(255,255,255,0.1)';

function SumCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={{ background: color ? `${color}15` : cardBg, border: color ? `1px solid ${color}40` : cardBorder, borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
      <div style={{ color: color || 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '5px' }}>{label}</div>
      <div style={{ color: color || 'white', fontSize: '28px', fontWeight: '700' }}>{value}</div>
    </div>
  );
}

function RatioCard({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) {
  return (
    <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
      <div style={{ color, fontSize: '12px', marginBottom: '8px' }}>{label}</div>
      <div style={{ color, fontSize: '32px', fontWeight: '700' }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '5px' }}>{detail}</div>
    </div>
  );
}

type Tab = 'aging' | 'submissions' | 'no_audio' | 'hit_ratio';

export default function Reporting() {
  const [tab, setTab] = useState<Tab>('aging');
  const greenCount = AGING.filter(c => c.days < 3).length;
  const yellowCount = AGING.filter(c => c.days >= 3 && c.days <= 7).length;
  const redCount = AGING.filter(c => c.days > 7).length;

  const tabBtn = (t: Tab, icon: string, label: string) => (
    <button onClick={() => setTab(t)} style={{ padding: '10px 20px', background: tab === t ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>{icon} {label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>📊 Reports</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Track candidate aging and JD submissions</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          {tabBtn('aging', '⏱️', 'Candidate Aging')}
          {tabBtn('submissions', '📋', 'Fill Rate')}
          {tabBtn('no_audio', '🎙️', 'Missing Audio Scores')}
          {tabBtn('hit_ratio', '📊', 'Hit Ratio')}
        </div>

        {/* ===== AGING TAB ===== */}
        {tab === 'aging' && (<>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '5px' }}>Candidate Aging Report</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Track how long candidates have been in each stage (Active jobs only)</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '25px' }}>
            <SumCard label="Total" value={AGING.length} />
            <SumCard label="Green (<3 days)" value={greenCount} color="#10b981" />
            <SumCard label="Yellow (3-7 days)" value={yellowCount} color="#f59e0b" />
            <SumCard label="Red (>7 days)" value={redCount} color="#ef4444" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>Stage</label>
                <select style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
                  <option style={{ background: '#1e293b' }}>All Stages</option>
                </select>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>Recruiter</label>
                <select style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
                  <option style={{ background: '#1e293b' }}>All Recruiters</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={thStyle(true)}>Candidate ↓</th><th style={thStyle()}>Job</th><th style={thStyle()}>Client</th><th style={thStyle()}>Recruiter</th><th style={thStyle()}>Manager</th>
                <th style={thStyle()}>Stage</th><th style={{ ...thStyle(true), textAlign: 'center' }}>Days ↓</th><th style={thStyle()}>Since</th><th style={{ ...thStyle(), textAlign: 'center' }}>Action</th>
              </tr></thead>
              <tbody>
                {AGING.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: agingBg(c.days) }}>
                    <td style={{ padding: '15px' }}><div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{c.name}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>{c.phone}</div></td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.job}</td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.client}</td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.recruiter}</td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.manager}</td>
                    <td style={{ padding: '15px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: `${STAGE_COLORS[c.stage] || '#6b7280'}30`, color: STAGE_COLORS[c.stage] || '#6b7280' }}>{STAGE_LABELS[c.stage]}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: agingColor(c.days) }}>{c.days}</span></td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{c.date}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><Link href="/jobs" style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>View Job →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} /><span>Green: &lt;3 days (On track)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b' }} /><span>Yellow: 3-7 days (Needs attention)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} /><span>Red: &gt;7 days (Urgent)</span></div>
          </div>
        </>)}

        {/* ===== FILL RATE TAB ===== */}
        {tab === 'submissions' && (<>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '5px' }}>Fill Rate</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>View candidate submissions for each active job, sorted by deficit</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '25px' }}>
            <SumCard label="Total Active JDs" value={SUBMISSIONS.length} />
            <SumCard label="Active Candidates" value={SUBMISSIONS.reduce((s, j) => s + j.active, 0)} color="#3b82f6" />
            <SumCard label="Positions Filled" value={SUBMISSIONS.reduce((s, j) => s + j.filled, 0)} color="#10b981" />
            <SumCard label="Deficit" value={SUBMISSIONS.reduce((s, j) => s + Math.max(0, j.deficit), 0)} color="#ef4444" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={thStyle()}>Job Title</th><th style={thStyle()}>Client</th><th style={thStyle()}>Recruiter(s)</th><th style={thStyle()}>Manager(s)</th>
                <th style={thCenter}>Positions</th><th style={thCenter}>Active</th><th style={thCenter}>Filled</th><th style={thCenter}>Deficit</th><th style={thCenter}>Action</th>
              </tr></thead>
              <tbody>
                {SUBMISSIONS.map((j, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: j.critical ? 'rgba(245,158,11,0.08)' : (j.active === 0 && j.filled === 0) ? 'rgba(239,68,68,0.1)' : 'transparent', borderLeft: j.critical ? '3px solid #f59e0b' : '3px solid transparent' }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{j.title}</span>
                        {j.critical && <span style={{ padding: '2px 6px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '9px', fontWeight: '700', borderRadius: '4px', letterSpacing: '0.5px' }}>CRITICAL</span>}
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.client}</td>
                    <td style={{ padding: '15px' }}>{j.recruiters.length > 0 ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{j.recruiters.map((n, k) => <span key={k} style={{ padding: '3px 8px', background: 'rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: '11px', borderRadius: '10px' }}>{n}</span>)}</div> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>-</span>}</td>
                    <td style={{ padding: '15px' }}>{j.managers.length > 0 ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{j.managers.map((n, k) => <span key={k} style={{ padding: '3px 8px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '11px', borderRadius: '10px' }}>{n}</span>)}</div> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>-</span>}</td>
                    <td style={{ padding: '15px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.positions}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', background: j.active === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)', color: j.active === 0 ? '#ef4444' : '#60a5fa' }}>{j.active}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', background: j.filled > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', color: j.filled > 0 ? '#10b981' : 'rgba(255,255,255,0.4)' }}>{j.filled}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', background: j.deficit > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: j.deficit > 0 ? '#ef4444' : '#10b981' }}>{j.deficit}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><Link href="/jobs" style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>View Job →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}

        {/* ===== MISSING AUDIO TAB ===== */}
        {tab === 'no_audio' && (<>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '5px' }}>Candidates Missing Audio Scores</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Candidates at &quot;Submitted to Client&quot; stage who have not been audio-screened</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '15px', marginBottom: '25px', maxWidth: '500px' }}>
            <SumCard label="Total Missing Audio" value={NO_AUDIO.length} />
            <SumCard label="Oldest (days)" value={NO_AUDIO[0]?.days || 0} color="#f59e0b" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={thStyle()}>Candidate</th><th style={thStyle()}>Job</th><th style={thStyle()}>Client</th><th style={thStyle()}>Recruiter</th>
                <th style={thStyle()}>Stage</th><th style={{ ...thStyle(), textAlign: 'center' }}>Days</th><th style={thStyle()}>Since</th><th style={{ ...thStyle(), textAlign: 'center' }}>Action</th>
              </tr></thead>
              <tbody>
                {NO_AUDIO.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: agingBg(c.days) }}>
                    <td style={{ padding: '15px' }}><div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{c.name}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>{c.phone}</div></td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.job}</td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.client}</td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{c.recruiter}</td>
                    <td style={{ padding: '15px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: `${STAGE_COLORS[c.stage]}30`, color: STAGE_COLORS[c.stage] }}>{STAGE_LABELS[c.stage]}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ fontSize: '14px', fontWeight: '700', color: agingColor(c.days) }}>{c.days}</span></td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{c.date}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><Link href="/jobs" style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>View Job →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}

        {/* ===== HIT RATIO TAB ===== */}
        {tab === 'hit_ratio' && (<>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '5px' }}>Hit Ratio Report</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Conversion ratios for CLOSED positions only — shows how many candidates at each stage to get one joiner</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '15px' }}>
            <RatioCard label="Submissions → L1" value={`${HIT_RATIO.subToL1}:1`} detail={`${HIT_RATIO.submittedToClient} submitted / ${HIT_RATIO.l1} L1`} color="#60a5fa" />
            <RatioCard label="L1 → L2" value={`${HIT_RATIO.l1ToL2}:1`} detail={`${HIT_RATIO.l1} L1 / ${HIT_RATIO.l2} L2`} color="#f59e0b" />
            <RatioCard label="L2 → Selected" value={`${HIT_RATIO.l2ToSelect}:1`} detail={`${HIT_RATIO.l2} L2 / ${HIT_RATIO.selected} selected`} color="#a78bfa" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' }}>
            <RatioCard label="Selected → Joiner" value={`${HIT_RATIO.selectToJoiner}:1`} detail={`${HIT_RATIO.selected} selected / ${HIT_RATIO.joiners} joined`} color="#10b981" />
            <RatioCard label="Submissions / Joiner" value={`${HIT_RATIO.subPerJoiner}:1`} detail={`${HIT_RATIO.submittedToClient} submitted → ${HIT_RATIO.joiners} joined`} color="#ec4899" />
            <RatioCard label="Avg TAT (Days)" value={`${HIT_RATIO.avgTAT}`} detail="Req date → First joiner billing" color="#818cf8" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' }}>
            <SumCard label="Closed JDs" value={HIT_RATIO.totalJDs} />
            <SumCard label="Total Candidates" value={HIT_RATIO.totalCandidates} />
            <SumCard label="Total Joiners" value={HIT_RATIO.joiners} color="#10b981" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>Breakdown by Closed JD ({HIT_JDS.length})</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th style={thStyle()}>Job Title</th><th style={thStyle()}>Client</th>
                <th style={thCenter}>Submitted</th><th style={thCenter}>L1</th><th style={thCenter}>L2</th><th style={thCenter}>Selected</th>
                <th style={{ ...thCenter, color: '#10b981' }}>Joiners</th><th style={{ ...thCenter, color: '#818cf8' }}>TAT (Days)</th>
              </tr></thead>
              <tbody>
                {HIT_JDS.map((j, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 15px', color: 'white', fontSize: '13px' }}>{j.title}</td>
                    <td style={{ padding: '12px 15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.client}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.submitted}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#f59e0b', fontSize: '13px' }}>{j.l1}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#a78bfa', fontSize: '13px' }}>{j.l2}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.selected}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#10b981', fontSize: '13px', fontWeight: '600' }}>{j.joiners}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'center', color: '#818cf8', fontSize: '13px' }}>{j.tat ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>)}
      </main>
    </div>
  );
}
