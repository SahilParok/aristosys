'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DemoNav from '@/components/DemoNav';
import { DEMO_REPORTS } from '@/lib/demoReports';

// --- ALL FAKE DATA ---
const CLIENTS = [
  { id: 'c1', name: 'Horizon Tech Partners' },
  { id: 'c2', name: 'NovaByte Systems' },
  { id: 'c3', name: 'PeakLogic Analytics' },
];

const JDS: Record<string, { id: string; title: string; client_id: string; status: string; recruiter: string; manager: string; num_positions: number; client_managers: string[]; analysis: any }[]> = {
  c1: [
    { id: 'jd1', title: 'Senior Software Engineer', client_id: 'c1', status: 'active', recruiter: 'Nisha Devi', manager: 'Rohit Verma', num_positions: 3, client_managers: ['Anand Kapoor'], analysis: {
      job_classification: 'strict_engineering', experience_min: 4, experience_max: 8, location: 'Bangalore, Hyderabad', work_mode: 'Hybrid',
      role_identity: 'Backend-heavy Java engineer with microservices architecture ownership and cloud deployment experience.',
      skills: [
        { name: 'Java', tier: 'core', aliases: ['J2EE'] }, { name: 'Spring Boot', tier: 'core', aliases: ['Spring Framework'] },
        { name: 'Microservices', tier: 'primary' }, { name: 'AWS', tier: 'primary' }, { name: 'PostgreSQL', tier: 'primary' }, { name: 'REST APIs', tier: 'primary' },
        { name: 'Kubernetes', tier: 'bonus' }, { name: 'Kafka', tier: 'bonus' },
      ],
      key_responsibilities: ['Design and build scalable backend services', 'Own microservice architecture decisions', 'Collaborate with frontend and DevOps teams', 'Participate in code reviews and mentoring'],
    }},
    { id: 'jd2', title: 'Full Stack Developer', client_id: 'c1', status: 'active', recruiter: 'Rekha Prasad', manager: 'Deepak Thakur', num_positions: 2, client_managers: ['Anand Kapoor', 'Meera Pillai'], analysis: {
      job_classification: 'moderate_engineering', experience_min: 2, experience_max: 5, location: 'Bangalore', work_mode: 'Remote',
      role_identity: 'Product-focused full stack developer working across React frontend and Node.js backend.',
      skills: [
        { name: 'React', tier: 'core' }, { name: 'Node.js', tier: 'core' },
        { name: 'TypeScript', tier: 'primary' }, { name: 'MongoDB', tier: 'primary' }, { name: 'GraphQL', tier: 'primary' },
        { name: 'Next.js', tier: 'bonus' }, { name: 'Docker', tier: 'bonus' },
      ],
    }},
  ],
  c2: [{ id: 'jd3', title: 'DevOps Engineer', client_id: 'c2', status: 'active', recruiter: 'Fatima Khan', manager: 'Anita Sharma', num_positions: 2, client_managers: ['Vikram Joshi'], analysis: {
    job_classification: 'strict_engineering', experience_min: 3, experience_max: 7, location: 'Mumbai, Pune', work_mode: 'Hybrid',
    role_identity: 'Infrastructure-focused DevOps engineer managing cloud deployments and CI/CD pipelines.',
    skills: [
      { name: 'AWS', tier: 'core' }, { name: 'Terraform', tier: 'core' },
      { name: 'Docker', tier: 'primary' }, { name: 'Kubernetes', tier: 'primary' }, { name: 'CI/CD', tier: 'primary' }, { name: 'Linux', tier: 'primary' },
      { name: 'Ansible', tier: 'bonus' }, { name: 'Prometheus', tier: 'bonus' },
    ],
  }}],
  c3: [{ id: 'jd4', title: 'Data Engineer', client_id: 'c3', status: 'active', recruiter: 'Tanya Mathur', manager: 'Rohit Verma', num_positions: 1, client_managers: ['Sanjana Iyer'], analysis: {
    job_classification: 'moderate_engineering', experience_min: 3, experience_max: 6, location: 'Hyderabad', work_mode: 'On-site',
    role_identity: 'Data pipeline engineer working with Spark and cloud data warehousing.',
    skills: [
      { name: 'Python', tier: 'core' }, { name: 'Spark', tier: 'core' },
      { name: 'SQL', tier: 'primary' }, { name: 'Airflow', tier: 'primary' }, { name: 'AWS Glue', tier: 'primary' },
      { name: 'dbt', tier: 'bonus' }, { name: 'Snowflake', tier: 'bonus' },
    ],
  }}],
};

interface DemoCandidate {
  name: string; email: string; phone: string; recruiter: string;
  score: number; tech: number | null; comm: number | null; ai_tech: number | null; ai_comm: number | null;
  stage: string; stage_date: string; submitted_date: string | null;
  report_html: string | null; comments: string | null;
}

const CANDIDATES: Record<string, DemoCandidate[]> = {
  jd1: [
    { name: 'Ravi Thapar', email: 'ravi.t@demo.com', phone: '+91 98100 22010', recruiter: 'Nisha D.', score: 87, tech: null, comm: null, ai_tech: 82, ai_comm: 78, stage: 'l1_interview', stage_date: '2026-03-28', submitted_date: '2026-03-26', report_html: '<div style="padding:24px;font-family:sans-serif"><h2 style="color:#1e293b;border-bottom:2px solid #3b82f6;padding-bottom:8px">Resume Screening Report</h2><div style="margin:16px 0"><strong>Candidate:</strong> Ravi Thapar</div><div style="margin:16px 0"><strong>Position:</strong> Senior Software Engineer</div><div style="margin:16px 0"><strong>Overall Score: <span style="color:#10b981;font-size:24px">87/100</span></strong></div><div style="margin:16px 0;padding:12px;background:#f0fdf4;border-radius:8px;border-left:4px solid #10b981"><strong>Recommendation: Shortlist</strong></div><h3 style="color:#1e293b;margin-top:24px">Score Breakdown</h3><table style="width:100%;border-collapse:collapse;margin:12px 0"><tr style="background:#f8fafc"><td style="padding:8px;border:1px solid #e2e8f0"><strong>Core Fit</strong></td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#10b981;font-weight:700">35/40</td><td style="padding:8px;border:1px solid #e2e8f0">Java (strong), Spring Boot (strong)</td></tr><tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Primary Fit</strong></td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#3b82f6;font-weight:700">22/25</td><td style="padding:8px;border:1px solid #e2e8f0">Microservices (strong), AWS (moderate), PostgreSQL (strong), REST APIs (strong)</td></tr><tr style="background:#f8fafc"><td style="padding:8px;border:1px solid #e2e8f0"><strong>Bonus Fit</strong></td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#8b5cf6;font-weight:700">8/10</td><td style="padding:8px;border:1px solid #e2e8f0">Kubernetes (moderate), Kafka (strong)</td></tr><tr><td style="padding:8px;border:1px solid #e2e8f0"><strong>Experience Fit</strong></td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#f59e0b;font-weight:700">13/15</td><td style="padding:8px;border:1px solid #e2e8f0">6 years total, 4.5 years relevant — within target range</td></tr><tr style="background:#f8fafc"><td style="padding:8px;border:1px solid #e2e8f0"><strong>Overall Fit</strong></td><td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:#d4af37;font-weight:700">9/10</td><td style="padding:8px;border:1px solid #e2e8f0">Strong technical foundation with proven ownership of complex systems</td></tr></table><h3 style="color:#1e293b;margin-top:24px">Summary</h3><p style="color:#475569;line-height:1.6">Candidate demonstrates strong Java and Spring Boot experience with 6 years in backend development. Has designed event-driven microservices and managed high-throughput systems. AWS experience is solid but could be deeper on serverless. Kafka streaming pipeline experience is a notable bonus. Recommended for L1 interview.</p></div>', comments: null },
    { name: 'Pooja Deshmukh', email: 'pooja.d@demo.com', phone: '+91 98100 22011', recruiter: 'Tanya M.', score: 72, tech: null, comm: null, ai_tech: null, ai_comm: null, stage: 'submitted', stage_date: '2026-03-25', submitted_date: '2026-03-25', report_html: null, comments: null },
    { name: 'Suresh Balaji', email: 'suresh.b@demo.com', phone: '+91 98100 22012', recruiter: 'Nisha D.', score: 91, tech: null, comm: null, ai_tech: 89, ai_comm: 85, stage: 'selected', stage_date: '2026-03-20', submitted_date: '2026-03-14', report_html: '<div style="padding:24px;font-family:sans-serif"><h2 style="color:#1e293b;border-bottom:2px solid #3b82f6;padding-bottom:8px">Resume Screening Report</h2><div style="margin:16px 0"><strong>Overall Score: <span style="color:#10b981;font-size:24px">91/100</span></strong></div><div style="margin:16px 0;padding:12px;background:#f0fdf4;border-radius:8px;border-left:4px solid #10b981"><strong>Recommendation: Strong Shortlist</strong></div><p style="color:#475569;line-height:1.6;margin-top:16px">Exceptional match across all dimensions. 7 years of Java/Spring Boot with architecture leadership. Led migration of monolithic platform to 15 microservices. Strong AWS (ECS, Lambda, SQS) and Kafka experience.</p></div>', comments: 'Strong candidate - fast track' },
    { name: 'Anjali Rao', email: 'anjali.r@demo.com', phone: '+91 98100 22013', recruiter: 'Fatima K.', score: 65, tech: null, comm: null, ai_tech: null, ai_comm: null, stage: 'prospect', stage_date: '2026-03-30', submitted_date: null, report_html: null, comments: null },
    { name: 'Nitin Kapoor', email: 'nitin.k@demo.com', phone: '+91 98100 22014', recruiter: 'Tanya M.', score: 78, tech: null, comm: null, ai_tech: 75, ai_comm: 80, stage: 'l2_interview', stage_date: '2026-03-22', submitted_date: '2026-03-18', report_html: null, comments: 'Good comm skills' },
    { name: 'Divya Pillai', email: 'divya.p@demo.com', phone: '+91 98100 22015', recruiter: 'Nisha D.', score: 54, tech: null, comm: null, ai_tech: 45, ai_comm: 60, stage: 'rejected', stage_date: '2026-03-18', submitted_date: '2026-03-15', report_html: null, comments: null },
  ],
  jd2: [
    { name: 'Manish Verma', email: 'manish.v@demo.com', phone: '+91 98100 22016', recruiter: 'Rekha P.', score: 84, tech: null, comm: null, ai_tech: 80, ai_comm: 76, stage: 'l1_interview', stage_date: '2026-03-27', submitted_date: '2026-03-25', report_html: null, comments: null },
    { name: 'Swati Kulkarni', email: 'swati.k@demo.com', phone: '+91 98100 22017', recruiter: 'Rekha P.', score: 76, tech: null, comm: null, ai_tech: null, ai_comm: null, stage: 'submitted', stage_date: '2026-03-29', submitted_date: '2026-03-29', report_html: null, comments: null },
    { name: 'Amit Saxena', email: 'amit.s@demo.com', phone: '+91 98100 22018', recruiter: 'Prerna S.', score: 69, tech: null, comm: null, ai_tech: null, ai_comm: null, stage: 'prospect', stage_date: '2026-03-31', submitted_date: null, report_html: null, comments: null },
  ],
  jd3: [
    { name: 'Lakshmi Narayanan', email: 'lakshmi.n@demo.com', phone: '+91 98100 22019', recruiter: 'Fatima K.', score: 88, tech: null, comm: null, ai_tech: 85, ai_comm: 72, stage: 'l1_interview', stage_date: '2026-03-26', submitted_date: '2026-03-24', report_html: null, comments: null },
    { name: 'Gaurav Chandra', email: 'gaurav.c@demo.com', phone: '+91 98100 22020', recruiter: 'Prerna S.', score: 81, tech: null, comm: null, ai_tech: null, ai_comm: null, stage: 'submitted', stage_date: '2026-03-28', submitted_date: '2026-03-28', report_html: null, comments: null },
    { name: 'Sunita Bose', email: 'sunita.b@demo.com', phone: '+91 98100 22021', recruiter: 'Fatima K.', score: 73, tech: null, comm: null, ai_tech: null, ai_comm: null, stage: 'prospect', stage_date: '2026-03-30', submitted_date: null, report_html: null, comments: null },
  ],
  jd4: [
    { name: 'Harish Menon', email: 'harish.m@demo.com', phone: '+91 98100 22022', recruiter: 'Tanya M.', score: 93, tech: null, comm: null, ai_tech: 91, ai_comm: 88, stage: 'selected', stage_date: '2026-03-15', submitted_date: '2026-03-10', report_html: null, comments: null },
    { name: 'Isha Bhatt', email: 'isha.b@demo.com', phone: '+91 98100 22023', recruiter: 'Rekha P.', score: 70, tech: null, comm: null, ai_tech: 68, ai_comm: 74, stage: 'l1_interview', stage_date: '2026-03-24', submitted_date: '2026-03-22', report_html: null, comments: null },
  ],
};

const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', submitted: 'Submitted to Client', l1_interview: 'L1 Interview',
  l2_interview: 'L2 Interview', selected: 'Selected', rejected: 'Rejected',
};
const STAGE_COLORS: Record<string, string> = {
  prospect: '#6b7280', submitted: '#2563eb', l1_interview: '#a855f7',
  l2_interview: '#ec4899', selected: '#10b981', rejected: '#dc2626',
};

const TIER_CFG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  core: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.25)', label: 'Core Skills' },
  primary: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.25)', label: 'Primary Skills' },
  bonus: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.25)', label: 'Bonus Skills' },
};

function getScoreColor(s: number) { return s >= 65 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444'; }

function calcWorkingDays(dateStr: string): number {
  const start = new Date(dateStr); start.setDate(start.getDate() + 1);
  const end = new Date('2026-04-02');
  let days = 0; const cur = new Date(start);
  while (cur <= end) { const d = cur.getDay(); if (d !== 0 && d !== 6) days++; cur.setDate(cur.getDate() + 1); }
  return days;
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); }

function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientId, setClientId] = useState('');
  const [jdId, setJdId] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [stageFilter, setStageFilter] = useState('');
  const [search, setSearch] = useState('');
  const [reportCandidate, setReportCandidate] = useState<DemoCandidate | null>(null);
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [editJDOpen, setEditJDOpen] = useState(false);
  const [highlightName, setHighlightName] = useState<string>('');

  useEffect(() => {
    const c = searchParams.get('client');
    const j = searchParams.get('jd');
    const h = searchParams.get('highlight');
    if (c) setClientId(c);
    if (j) setJdId(j);
    if (h) setHighlightName(h);
  }, [searchParams]);

  const clientJDs = clientId ? (JDS[clientId] || []) : [];
  const jd = clientJDs.find(j => j.id === jdId);
  const candidates = jdId ? (CANDIDATES[jdId] || []) : [];
  const filtered = candidates.filter(c => {
    if (stageFilter && c.stage !== stageFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const doneStages = ['selected', 'rejected'];

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sortedFiltered = sortKey ? [...filtered].sort((a, b) => {
    const get = (c: DemoCandidate): string | number => {
      switch (sortKey) {
        case 'name': return c.name;
        case 'recruiter': return c.recruiter;
        case 'score': return c.score;
        case 'tech': return c.tech ?? c.ai_tech ?? -1;
        case 'ai': return c.ai_tech ?? -1;
        case 'aging': return doneStages.includes(c.stage) ? -1 : calcWorkingDays(c.stage_date);
        case 'stage': return c.stage;
        case 'stage_date': return new Date(c.stage_date).getTime();
        default: return 0;
      }
    };
    const av = get(a), bv = get(b);
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  }) : filtered;

  function handleScreenMore() {
    if (!jd) return;
    const clientName = CLIENTS.find(c => c.id === jd.client_id)?.name || '';
    const params = new URLSearchParams({ client: clientName, jd: jd.title, recruiter: jd.recruiter, step: '2' });
    router.push(`/screen?${params.toString()}`);
  }

  return (
    <div className="jobs-root" style={{ height: '100vh', background: '#0f172a', overflow: 'hidden' }}>
      <DemoNav />

      <div className="jobs-layout" style={{ display: 'flex', height: 'calc(100vh - 53px)' }}>
        {/* Left Sidebar */}
        <div className="jobs-sidebar" style={{ width: '350px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>Jobs</h2>
              <button style={{ padding: '8px 15px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>+ Add JD</button>
            </div>
            <select value={clientId} onChange={e => { setClientId(e.target.value); setJdId(''); }} style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '14px' }}>
              <option value="">Select Client...</option>
              {CLIENTS.map(c => <option key={c.id} value={c.id} style={{ background: '#1e293b' }}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
            {!clientId ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.4)' }}>Select a client to view jobs</div>
            ) : clientJDs.map(j => (
              <div key={j.id} onClick={() => setJdId(j.id)} style={{
                padding: '15px', marginBottom: '10px', cursor: 'pointer', borderRadius: '10px',
                background: jdId === j.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${jdId === j.id ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>{j.title}</div>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>Active</span>
                </div>
                <div style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(139,92,246,0.1)', borderRadius: '4px', fontSize: '11px', color: '#a78bfa' }}>✓ AI Analyzed</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {jd ? (
            <>
              {/* JD Header */}
              <div className="jobs-header" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ color: 'white', fontSize: '22px', fontWeight: '600', margin: '0 0 5px 0' }}>{jd.title}</h2>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                      {CLIENTS.find(c => c.id === jd.client_id)?.name} • {candidates.length} candidates
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}>Recruiter: {jd.recruiter}</span>
                      <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '11px', background: 'rgba(236,72,153,0.2)', color: '#f472b6' }}>Manager: {jd.manager}</span>
                      <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '11px', background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}>{jd.num_positions} {jd.num_positions === 1 ? 'Position' : 'Positions'}</span>
                      <span style={{ padding: '4px 10px', borderRadius: '15px', fontSize: '11px', background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>Client Manager{jd.client_managers.length > 1 ? 's' : ''}: {jd.client_managers.join(', ')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['📄 View JD', '📤 Upload JD', '✏️ Edit JD'].map(b => (
                      <button key={b} onClick={b === '✏️ Edit JD' ? () => setEditJDOpen(true) : undefined} style={{ padding: '8px 15px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '6px', color: '#60a5fa', fontSize: '12px', cursor: 'pointer' }}>{b}</button>
                    ))}
                    <button onClick={handleScreenMore} style={{ padding: '8px 15px', background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>🔍 Screen More</button>
                    <button style={{ padding: '8px 15px', background: '#10b981', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Active</button>
                    <button style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>On Hold</button>
                    <button style={{ padding: '8px 15px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Closed</button>
                  </div>
                </div>

                {/* AI Analysis */}
                {jd.analysis && (
                  <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}>
                    <div onClick={() => setShowAnalysis(!showAnalysis)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <div style={{ color: '#a78bfa', fontSize: '12px', fontWeight: '600' }}>AI Analysis Summary</div>
                      <span style={{ color: '#a78bfa', fontSize: '12px' }}>{showAnalysis ? '▼ Hide Details' : '▶ Show Details'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}><strong>Classification:</strong> <span style={{ color: jd.analysis.job_classification === 'strict_engineering' ? '#10b981' : '#f59e0b' }}>{jd.analysis.job_classification?.replace(/_/g, ' ')}</span></div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}><strong>Experience:</strong> {jd.analysis.experience_min}-{jd.analysis.experience_max} years</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}><strong>Core:</strong> <span style={{ color: '#10b981' }}>{jd.analysis.skills.filter((s: any) => s.tier === 'core').length}</span></div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}><strong>Primary:</strong> <span style={{ color: '#f59e0b' }}>{jd.analysis.skills.filter((s: any) => s.tier === 'primary').length}</span></div>
                      {jd.analysis.location && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}><strong>Location:</strong> {jd.analysis.location}</div>}
                      {jd.analysis.work_mode && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}><strong>Work Mode:</strong> {jd.analysis.work_mode}</div>}
                    </div>
                    {showAnalysis && (
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(139,92,246,0.2)' }}>
                        {jd.analysis.role_identity && <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(139,92,246,0.1)', borderRadius: '6px', color: '#a78bfa', fontSize: '12px', fontStyle: 'italic' }}>{jd.analysis.role_identity}</div>}
                        {['core', 'primary', 'bonus'].map(tier => {
                          const skills = jd.analysis.skills.filter((s: any) => s.tier === tier);
                          if (!skills.length) return null;
                          const cfg = TIER_CFG[tier];
                          return (
                            <div key={tier} style={{ marginBottom: '15px' }}>
                              <div style={{ color: cfg.color, fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>{cfg.label} ({skills.length})</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {skills.map((s: any) => <span key={s.name} style={{ padding: '4px 10px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '15px', color: cfg.color, fontSize: '11px' }}>{s.name}</span>)}
                              </div>
                            </div>
                          );
                        })}
                        {jd.analysis.key_responsibilities && (
                          <div><div style={{ color: '#60a5fa', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Key Responsibilities</div>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                              {jd.analysis.key_responsibilities.map((r: string, i: number) => <li key={i} style={{ marginBottom: '4px' }}>{r}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Search & Filter */}
                <div className="jobs-search-row" style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <input placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px' }} />
                  <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} style={{ padding: '10px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontSize: '14px', minWidth: '180px' }}>
                    <option value="">All Stages</option>
                    {Object.entries(STAGE_LABELS).map(([k, v]) => <option key={k} value={k} style={{ background: '#1e293b' }}>{v}</option>)}
                  </select>
                  <button style={{ padding: '10px 15px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>📧 Email All ({filtered.filter(c => c.email).length}) ▾</button>
                  <button style={{ padding: '10px 15px', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', color: '#a855f7', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>🤖 AI Interview ({filtered.length}) ▾</button>
                </div>
              </div>

              {/* Candidates Table */}
              <div style={{ padding: '0 20px 20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {[
                        { label: 'Name', key: 'name' },
                        { label: 'Recruiter', key: 'recruiter' },
                        { label: 'Score', key: 'score' },
                        { label: 'Tech/Comm', key: 'tech' },
                        { label: 'AI', key: 'ai' },
                        { label: 'Aging', key: 'aging' },
                        { label: 'Stage', key: 'stage' },
                        { label: 'Stage Date', key: 'stage_date' },
                        { label: 'Actions', key: '' },
                      ].map((h, i) => (
                        <th key={h.label} onClick={() => h.key && handleSort(h.key)} style={{ textAlign: i === 8 ? 'right' : i >= 2 && i <= 5 ? 'center' : 'left', padding: '8px 10px', color: sortKey === h.key && h.key ? '#60a5fa' : 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: h.key ? 'pointer' : 'default', userSelect: 'none' }}>{h.label}{sortKey === h.key && h.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFiltered.map((c, i) => {
                      const aging = doneStages.includes(c.stage) ? null : calcWorkingDays(c.stage_date);
                      const agingColor = aging === null ? 'rgba(255,255,255,0.3)' : aging > 7 ? '#ef4444' : aging >= 3 ? '#f59e0b' : '#22c55e';
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: highlightName === c.name ? 'rgba(96,165,250,0.08)' : 'transparent', boxShadow: highlightName === c.name ? 'inset 3px 0 0 #60a5fa' : 'none' }}>
                          <td style={{ padding: '6px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{c.name}</span>
                              {c.comments && <span title={c.comments} style={{ color: '#60a5fa', fontSize: '11px', cursor: 'help' }}>💬</span>}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>{c.email}</div>
                          </td>
                          <td style={{ padding: '6px 10px', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{c.recruiter}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'center' }}><span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', background: `${getScoreColor(c.score)}20`, color: getScoreColor(c.score) }}>{c.score}</span></td>
                          <td style={{ padding: '6px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{c.tech !== null ? `${c.tech}/${c.comm}` : '-'}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'center', color: '#a855f7', fontSize: '11px', fontWeight: '500' }}>{c.ai_tech !== null ? `${c.ai_tech}/${c.ai_comm}` : '-'}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'center', fontSize: '11px', fontWeight: '500', color: agingColor }}>{aging !== null ? aging : '-'}</td>
                          <td style={{ padding: '6px 10px' }}><span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500', background: `${STAGE_COLORS[c.stage] || '#6b7280'}20`, color: STAGE_COLORS[c.stage] || '#6b7280', whiteSpace: 'nowrap' }}>{STAGE_LABELS[c.stage] || c.stage}</span></td>
                          <td style={{ padding: '6px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>{formatDate(c.stage_date)}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button style={{ padding: '4px 6px', background: 'rgba(16,185,129,0.15)', border: 'none', borderRadius: '4px', color: '#10b981', fontSize: '11px', cursor: 'pointer', marginLeft: '4px' }}>CV</button>
                            <button onClick={() => setReportCandidate(c)} style={{ padding: '4px 6px', background: 'rgba(59,130,246,0.15)', border: 'none', borderRadius: '4px', color: '#60a5fa', fontSize: '11px', cursor: 'pointer', marginLeft: '4px' }}>Rpt</button>
                            <button style={{ padding: '4px 6px', background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: '4px', color: '#ef4444', fontSize: '11px', cursor: 'pointer', marginLeft: '4px' }}>Del</button>
                            <button style={{ padding: '4px 6px', background: 'rgba(168,85,247,0.15)', border: 'none', borderRadius: '4px', color: '#a855f7', fontSize: '11px', cursor: 'pointer', marginLeft: '4px' }}>AI</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>
              {clientId ? 'Select a job description' : 'Select a client to get started'}
            </div>
          )}
        </div>
      </div>

      {/* Edit JD Modal (read-only demo) */}
      {editJDOpen && jd && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setEditJDOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1e293b', borderRadius: '16px', width: '720px', maxWidth: '95%', maxHeight: '90vh', overflow: 'auto', color: 'white' }}>
            <div style={{ position: 'sticky', top: 0, background: '#1e293b', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>✏️ Edit JD — {jd.title}</h2>
              <button onClick={() => setEditJDOpen(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white', fontSize: '13px' }}>Close</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div className="jobs-modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                {[
                  ['JD Title', jd.title],
                  ['Client', CLIENTS.find(c => c.id === jd.client_id)?.name || ''],
                  ['Recruiter', jd.recruiter],
                  ['Manager', jd.manager],
                  ['Positions', String(jd.num_positions)],
                  ['Client Managers', jd.client_managers.join(', ')],
                  ['Location', jd.analysis.location || '—'],
                  ['Work Mode', jd.analysis.work_mode || '—'],
                  ['Experience', jd.analysis.experience_min && jd.analysis.experience_max ? `${jd.analysis.experience_min}-${jd.analysis.experience_max} years` : '—'],
                  ['Status', 'Active'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                    <div style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'white', fontSize: '13px' }}>{value || '—'}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Interview Notes</div>
                <textarea readOnly value="" placeholder="(No AI interview notes)" style={{ width: '100%', minHeight: '60px', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comments</div>
                <textarea readOnly value="" placeholder="(No comments)" style={{ width: '100%', minHeight: '60px', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button style={{ padding: '9px 16px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '7px', color: '#60a5fa', fontSize: '12px', cursor: 'pointer' }}>📤 Re-upload JD</button>
                <button style={{ padding: '9px 16px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '7px', color: '#a78bfa', fontSize: '12px', cursor: 'pointer' }}>🔄 Re-analyze with AI</button>
                <button style={{ padding: '9px 16px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '7px', color: '#34d399', fontSize: '12px', cursor: 'pointer' }}>💾 Save Changes</button>
              </div>
              <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '7px', color: '#fbbf24', fontSize: '11px' }}>
                ℹ️ Demo view — fields are read-only here. The real product allows editing every value, triggers AI re-analysis on save, and writes the diff to the audit trail.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportCandidate && (() => {
        const reports = DEMO_REPORTS[reportCandidate.name];
        const hasScreening = !!reports?.screening;
        const hasInterview = !!reports?.interview;
        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', borderRadius: '16px', width: '900px', maxWidth: '95%', maxHeight: '90vh', overflow: 'auto' }}>
              <div style={{ position: 'sticky', top: 0, background: 'white', padding: '15px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Candidate Report: {reportCandidate.name}</h3>
                <button onClick={() => setReportCandidate(null)} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#1e293b' }}>Close</button>
              </div>
              {hasScreening && (
                <div dangerouslySetInnerHTML={{ __html: reports!.screening! }} />
              )}
              {hasInterview && (
                <div style={{ borderTop: '3px solid #8b5cf6' }}>
                  <div dangerouslySetInnerHTML={{ __html: reports!.interview! }} />
                </div>
              )}
              {!hasScreening && !hasInterview && (
                <p style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No reports available for this candidate yet.</p>
              )}
            </div>
          </div>
        );
      })()}

      <style jsx>{`
        @media (max-width: 640px) {
          .jobs-root { height: auto !important; overflow: visible !important; }
          .jobs-layout { flex-direction: column !important; height: auto !important; }
          .jobs-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; max-height: 300px !important; }
          .jobs-header { padding: 16px !important; }
          .jobs-modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', background: '#0f172a' }} />}>
      <JobsPageContent />
    </Suspense>
  );
}
