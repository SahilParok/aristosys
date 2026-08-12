'use client';
import { useState, useMemo } from 'react';
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
  { title: 'Senior Software Engineer', client: 'Horizon Tech', recruiter: 'Nisha D.', manager: 'Rohit V.', positions: 3, active: 4, filled: 1, deficit: -2, critical: false },
  { title: 'Full Stack Developer', client: 'Horizon Tech', recruiter: 'Rekha P.', manager: 'Rohit V.', positions: 2, active: 2, filled: 0, deficit: 0, critical: false },
  { title: 'DevOps Engineer', client: 'NovaByte Systems', recruiter: 'Fatima K.', manager: 'Deepak T.', positions: 2, active: 2, filled: 0, deficit: 0, critical: false },
  { title: 'Data Engineer', client: 'PeakLogic Analytics', recruiter: 'Tanya M.', manager: 'Anita S.', positions: 1, active: 1, filled: 1, deficit: -1, critical: false },
  { title: 'QA Automation Engineer', client: 'NovaByte Systems', recruiter: '—', manager: 'Deepak T.', positions: 2, active: 0, filled: 0, deficit: 2, critical: true },
  { title: 'Cloud Architect', client: 'PeakLogic Analytics', recruiter: '—', manager: '—', positions: 1, active: 0, filled: 0, deficit: 1, critical: true },
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

function SortTh({ label, sortKey, currentKey, dir, onSort, align = 'left' }: { label: string; sortKey: string; currentKey: string; dir: 'asc' | 'desc'; onSort: (k: string) => void; align?: 'left' | 'center' }) {
  const isActive = currentKey === sortKey;
  return (
    <th onClick={() => onSort(sortKey)} style={{ textAlign: align, padding: '15px', color: isActive ? '#60a5fa' : 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', userSelect: 'none' as const, whiteSpace: 'nowrap' as const }}>
      {label}{isActive ? (dir === 'asc' ? ' ▲' : ' ▼') : ''}
    </th>
  );
}

function CheckboxList({ label, options, selected, onChange }: { label: string; options: string[]; selected: string[]; onChange: (next: string[]) => void }) {
  const toggle = (o: string) => {
    if (selected.includes(o)) onChange(selected.filter(s => s !== o));
    else onChange([...selected, o]);
  };
  return (
    <div style={{ flex: '1', minWidth: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 500 }}>{label}</label>
        {selected.length > 0 && <button onClick={() => onChange([])} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '11px', cursor: 'pointer' }}>clear</button>}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', maxHeight: '160px', overflow: 'auto' }}>
        {options.map(o => {
          const on = selected.includes(o);
          return (
            <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', cursor: 'pointer', fontSize: '13px', color: on ? 'white' : 'rgba(255,255,255,0.75)' }}>
              <input type="checkbox" checked={on} onChange={() => toggle(o)} style={{ accentColor: '#3b82f6', width: '14px', height: '14px', cursor: 'pointer', margin: 0 }} />
              <span>{o}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

type Tab = 'aging' | 'submissions' | 'no_audio' | 'hit_ratio';
type Dir = 'asc' | 'desc';

function applySort<T extends Record<string, unknown>>(rows: T[], key: string, dir: Dir): T[] {
  if (!key) return rows;
  const sorted = [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[key];
    const bv = (b as Record<string, unknown>)[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'string' && typeof bv === 'string') return av.localeCompare(bv);
    return (av as number) - (bv as number);
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}

export default function Reporting() {
  const [tab, setTab] = useState<Tab>('aging');

  // Aging tab state
  const [agingSortKey, setAgingSortKey] = useState<string>('days');
  const [agingSortDir, setAgingSortDir] = useState<Dir>('desc');
  const [agingStage, setAgingStage] = useState<string>('');
  const [agingClients, setAgingClients] = useState<string[]>([]);
  const [agingRecruiters, setAgingRecruiters] = useState<string[]>([]);

  // Fill Rate tab state
  const [fillSortKey, setFillSortKey] = useState<string>('deficit');
  const [fillSortDir, setFillSortDir] = useState<Dir>('desc');
  const [fillSearch, setFillSearch] = useState('');
  const [fillClients, setFillClients] = useState<string[]>([]);
  const [fillRecruiters, setFillRecruiters] = useState<string[]>([]);
  const [fillManagers, setFillManagers] = useState<string[]>([]);

  // No Audio tab state
  const [noAudioSortKey, setNoAudioSortKey] = useState<string>('days');
  const [noAudioSortDir, setNoAudioSortDir] = useState<Dir>('desc');

  // Hit Ratio tab state
  const [hitSortKey, setHitSortKey] = useState<string>('joiners');
  const [hitSortDir, setHitSortDir] = useState<Dir>('desc');

  function toggleSort(setKey: (k: string) => void, setDir: (d: Dir) => void, currentKey: string, currentDir: Dir) {
    return (k: string) => {
      if (currentKey === k) setDir(currentDir === 'asc' ? 'desc' : 'asc');
      else { setKey(k); setDir('desc'); }
    };
  }
  const onAgingSort = toggleSort(setAgingSortKey, setAgingSortDir, agingSortKey, agingSortDir);
  const onFillSort = toggleSort(setFillSortKey, setFillSortDir, fillSortKey, fillSortDir);
  const onNoAudioSort = toggleSort(setNoAudioSortKey, setNoAudioSortDir, noAudioSortKey, noAudioSortDir);
  const onHitSort = toggleSort(setHitSortKey, setHitSortDir, hitSortKey, hitSortDir);

  // Filter + sort applied data
  const filteredAging = useMemo(() => {
    let r: typeof AGING = AGING.filter(c => (!agingStage || c.stage === agingStage) && (!agingClients.length || agingClients.includes(c.client)) && (!agingRecruiters.length || agingRecruiters.includes(c.recruiter)));
    return applySort(r as unknown as Record<string, unknown>[], agingSortKey, agingSortDir) as unknown as typeof AGING;
  }, [agingStage, agingClients, agingRecruiters, agingSortKey, agingSortDir]);

  const filteredFill = useMemo(() => {
    const q = fillSearch.toLowerCase().trim();
    let r: typeof SUBMISSIONS = SUBMISSIONS.filter(j =>
      (!q || j.title.toLowerCase().includes(q) || j.client.toLowerCase().includes(q)) &&
      (!fillClients.length || fillClients.includes(j.client)) &&
      (!fillRecruiters.length || fillRecruiters.includes(j.recruiter)) &&
      (!fillManagers.length || fillManagers.includes(j.manager))
    );
    return applySort(r as unknown as Record<string, unknown>[], fillSortKey, fillSortDir) as unknown as typeof SUBMISSIONS;
  }, [fillSearch, fillClients, fillRecruiters, fillManagers, fillSortKey, fillSortDir]);

  const sortedNoAudio = useMemo(() => applySort(NO_AUDIO as unknown as Record<string, unknown>[], noAudioSortKey, noAudioSortDir) as unknown as typeof NO_AUDIO, [noAudioSortKey, noAudioSortDir]);
  const sortedHitJds = useMemo(() => applySort(HIT_JDS as unknown as Record<string, unknown>[], hitSortKey, hitSortDir) as unknown as typeof HIT_JDS, [hitSortKey, hitSortDir]);

  const greenCount = AGING.filter(c => c.days < 3).length;
  const yellowCount = AGING.filter(c => c.days >= 3 && c.days <= 7).length;
  const redCount = AGING.filter(c => c.days > 7).length;

  // Filter options derived from data
  const clientsList = Array.from(new Set(AGING.map(c => c.client)));
  const recruitersList = Array.from(new Set(AGING.map(c => c.recruiter)));
  const fillClientsList = Array.from(new Set(SUBMISSIONS.map(j => j.client)));
  const fillRecruitersList = Array.from(new Set(SUBMISSIONS.map(j => j.recruiter).filter(r => r !== '—')));
  const fillManagersList = Array.from(new Set(SUBMISSIONS.map(j => j.manager).filter(m => m !== '—')));

  const tabBtn = (t: Tab, icon: string, label: string) => (
    <button onClick={() => setTab(t)} style={{ padding: '10px 20px', background: tab === t ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>{icon} {label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main className="rpt-main" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>📊 Reports</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Track candidate aging and JD submissions</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', flexWrap: 'wrap' }}>
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
          <div className="rpt-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '25px' }}>
            <SumCard label="Total" value={AGING.length} />
            <SumCard label="Green (<3 days)" value={greenCount} color="#10b981" />
            <SumCard label="Yellow (3-7 days)" value={yellowCount} color="#f59e0b" />
            <SumCard label="Red (>7 days)" value={redCount} color="#ef4444" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 200px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '6px' }}>Stage</label>
                <select value={agingStage} onChange={e => setAgingStage(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
                  <option value="" style={{ background: '#1e293b' }}>All Stages</option>
                  {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k} style={{ background: '#1e293b' }}>{v}</option>)}
                </select>
              </div>
              <CheckboxList label="Filter by Client(s)" options={clientsList} selected={agingClients} onChange={setAgingClients} />
              <CheckboxList label="Filter by Recruiter(s)" options={recruitersList} selected={agingRecruiters} onChange={setAgingRecruiters} />
            </div>
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <SortTh label="Candidate" sortKey="name" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <SortTh label="Job" sortKey="job" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <SortTh label="Client" sortKey="client" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <SortTh label="Recruiter" sortKey="recruiter" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <SortTh label="Manager" sortKey="manager" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <SortTh label="Stage" sortKey="stage" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <SortTh label="Days" sortKey="days" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} align="center" />
                <SortTh label="Since" sortKey="date" currentKey={agingSortKey} dir={agingSortDir} onSort={onAgingSort} />
                <th style={{ padding: '15px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>Action</th>
              </tr></thead>
              <tbody>
                {filteredAging.map((c, i) => (
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
                {filteredAging.length === 0 && <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No candidates match the selected filters.</td></tr>}
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
          <div className="rpt-grid4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '15px', marginBottom: '25px' }}>
            <SumCard label="Total Active JDs" value={SUBMISSIONS.length} />
            <SumCard label="Active Candidates" value={SUBMISSIONS.reduce((s, j) => s + j.active, 0)} color="#3b82f6" />
            <SumCard label="Positions Filled" value={SUBMISSIONS.reduce((s, j) => s + j.filled, 0)} color="#10b981" />
            <SumCard label="Deficit" value={SUBMISSIONS.reduce((s, j) => s + Math.max(0, j.deficit), 0)} color="#ef4444" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <input value={fillSearch} onChange={e => setFillSearch(e.target.value)} placeholder="Search JD by title or client..." style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <CheckboxList label="Filter by Client(s)" options={fillClientsList} selected={fillClients} onChange={setFillClients} />
              <CheckboxList label="Filter by Manager(s)" options={fillManagersList} selected={fillManagers} onChange={setFillManagers} />
              <CheckboxList label="Filter by Recruiter(s)" options={fillRecruitersList} selected={fillRecruiters} onChange={setFillRecruiters} />
            </div>
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <SortTh label="Job Title" sortKey="title" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} />
                <SortTh label="Client" sortKey="client" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} />
                <SortTh label="Recruiter" sortKey="recruiter" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} />
                <SortTh label="Manager" sortKey="manager" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} />
                <SortTh label="Positions" sortKey="positions" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} align="center" />
                <SortTh label="Active" sortKey="active" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} align="center" />
                <SortTh label="Filled" sortKey="filled" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} align="center" />
                <SortTh label="Deficit" sortKey="deficit" currentKey={fillSortKey} dir={fillSortDir} onSort={onFillSort} align="center" />
                <th style={{ padding: '15px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>Action</th>
              </tr></thead>
              <tbody>
                {filteredFill.map((j, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: j.critical ? 'rgba(245,158,11,0.08)' : (j.active === 0 && j.filled === 0) ? 'rgba(239,68,68,0.1)' : 'transparent', borderLeft: j.critical ? '3px solid #f59e0b' : '3px solid transparent' }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{j.title}</span>
                        {j.critical && <span style={{ padding: '2px 6px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '9px', fontWeight: '700', borderRadius: '4px', letterSpacing: '0.5px' }}>CRITICAL</span>}
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.client}</td>
                    <td style={{ padding: '15px' }}>{j.recruiter !== '—' ? <span style={{ padding: '3px 8px', background: 'rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: '11px', borderRadius: '10px' }}>{j.recruiter}</span> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>—</span>}</td>
                    <td style={{ padding: '15px' }}>{j.manager !== '—' ? <span style={{ padding: '3px 8px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '11px', borderRadius: '10px' }}>{j.manager}</span> : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>—</span>}</td>
                    <td style={{ padding: '15px', textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>{j.positions}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', background: j.active === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)', color: j.active === 0 ? '#ef4444' : '#60a5fa' }}>{j.active}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', background: j.filled > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', color: j.filled > 0 ? '#10b981' : 'rgba(255,255,255,0.4)' }}>{j.filled}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', background: j.deficit > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: j.deficit > 0 ? '#ef4444' : '#10b981' }}>{j.deficit}</span></td>
                    <td style={{ padding: '15px', textAlign: 'center' }}><Link href="/jobs" style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>View Job →</Link></td>
                  </tr>
                ))}
                {filteredFill.length === 0 && <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>No jobs match the selected filters.</td></tr>}
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
          <div className="rpt-grid2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '15px', marginBottom: '25px', maxWidth: '500px' }}>
            <SumCard label="Total Missing Audio" value={NO_AUDIO.length} />
            <SumCard label="Oldest (days)" value={NO_AUDIO[0]?.days || 0} color="#f59e0b" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <SortTh label="Candidate" sortKey="name" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} />
                <SortTh label="Job" sortKey="job" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} />
                <SortTh label="Client" sortKey="client" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} />
                <SortTh label="Recruiter" sortKey="recruiter" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} />
                <SortTh label="Stage" sortKey="stage" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} />
                <SortTh label="Days" sortKey="days" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} align="center" />
                <SortTh label="Since" sortKey="date" currentKey={noAudioSortKey} dir={noAudioSortDir} onSort={onNoAudioSort} />
                <th style={{ padding: '15px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>Action</th>
              </tr></thead>
              <tbody>
                {sortedNoAudio.map((c, i) => (
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
          <div className="rpt-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '15px' }}>
            <RatioCard label="Submissions → L1" value={`${HIT_RATIO.subToL1}:1`} detail={`${HIT_RATIO.submittedToClient} submitted / ${HIT_RATIO.l1} L1`} color="#60a5fa" />
            <RatioCard label="L1 → L2" value={`${HIT_RATIO.l1ToL2}:1`} detail={`${HIT_RATIO.l1} L1 / ${HIT_RATIO.l2} L2`} color="#f59e0b" />
            <RatioCard label="L2 → Selected" value={`${HIT_RATIO.l2ToSelect}:1`} detail={`${HIT_RATIO.l2} L2 / ${HIT_RATIO.selected} selected`} color="#a78bfa" />
          </div>
          <div className="rpt-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' }}>
            <RatioCard label="Selected → Joiner" value={`${HIT_RATIO.selectToJoiner}:1`} detail={`${HIT_RATIO.selected} selected / ${HIT_RATIO.joiners} joined`} color="#10b981" />
            <RatioCard label="Submissions / Joiner" value={`${HIT_RATIO.subPerJoiner}:1`} detail={`${HIT_RATIO.submittedToClient} submitted → ${HIT_RATIO.joiners} joined`} color="#ec4899" />
            <RatioCard label="Avg TAT (Days)" value={`${HIT_RATIO.avgTAT}`} detail="Req date → First joiner billing" color="#818cf8" />
          </div>
          <div className="rpt-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '15px', marginBottom: '20px' }}>
            <SumCard label="Closed JDs" value={HIT_RATIO.totalJDs} />
            <SumCard label="Total Candidates" value={HIT_RATIO.totalCandidates} />
            <SumCard label="Total Joiners" value={HIT_RATIO.joiners} color="#10b981" />
          </div>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>Breakdown by Closed JD ({HIT_JDS.length})</h3>
            </div>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <SortTh label="Job Title" sortKey="title" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} />
                <SortTh label="Client" sortKey="client" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} />
                <SortTh label="Submitted" sortKey="submitted" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} align="center" />
                <SortTh label="L1" sortKey="l1" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} align="center" />
                <SortTh label="L2" sortKey="l2" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} align="center" />
                <SortTh label="Selected" sortKey="selected" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} align="center" />
                <SortTh label="Joiners" sortKey="joiners" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} align="center" />
                <SortTh label="TAT (Days)" sortKey="tat" currentKey={hitSortKey} dir={hitSortDir} onSort={onHitSort} align="center" />
              </tr></thead>
              <tbody>
                {sortedHitJds.map((j, i) => (
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
      <style jsx>{`
        @media (max-width: 640px) {
          .rpt-main { padding: 16px !important; }
          .rpt-grid4 { grid-template-columns: repeat(2,1fr) !important; }
          .rpt-grid3 { grid-template-columns: 1fr !important; }
          .rpt-grid2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
