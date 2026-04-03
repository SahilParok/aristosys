'use client';
import Link from 'next/link';
import DemoNav from '@/components/DemoNav';

const STAGE_COLORS: Record<string, string> = {
  prospect: '#6b7280', submitted_to_client: '#2563eb', l1_interview: '#a855f7',
  l2_interview: '#ec4899', selected: '#10b981', rejected: '#dc2626',
};
const STAGE_LABELS: Record<string, string> = {
  prospect: 'Prospect', submitted_to_client: 'Submitted to Client', l1_interview: 'L1 Interview',
  l2_interview: 'L2 Interview', selected: 'Selected', rejected: 'Rejected',
};
const agingColor = (d: number) => d <= 3 ? '#10b981' : d <= 7 ? '#f59e0b' : '#ef4444';

const ATTENTION = [
  { name: 'Pooja Deshmukh', title: 'Senior Software Engineer', client: 'Horizon Tech Partners', stage: 'submitted_to_client', days: 6 },
  { name: 'Nitin Kapoor', title: 'Senior Software Engineer', client: 'Horizon Tech Partners', stage: 'l2_interview', days: 9 },
  { name: 'Gaurav Chandra', title: 'DevOps Engineer', client: 'NovaByte Systems', stage: 'submitted_to_client', days: 4 },
  { name: 'Anjali Rao', title: 'Senior Software Engineer', client: 'Horizon Tech Partners', stage: 'prospect', days: 3 },
  { name: 'Sunita Bose', title: 'DevOps Engineer', client: 'NovaByte Systems', stage: 'prospect', days: 3 },
];

const ACTIVITY = [
  { msg: 'hr assigned "Senior Software Engineer" to NISHA D.', time: '02 Apr 2026, 09:15' },
  { msg: 'AI Interview completed for Ravi Thapar — Tech: 82, Comm: 78', time: '01 Apr 2026, 14:30' },
  { msg: 'hr assigned "DevOps Engineer" to FATIMA K.', time: '01 Apr 2026, 07:52' },
  { msg: 'Pooja Deshmukh moved to Submitted to Client — Senior Software Engineer', time: '31 Mar 2026, 16:20' },
  { msg: 'hr assigned "Full Stack Developer" to REKHA P.', time: '31 Mar 2026, 08:45' },
  { msg: 'AI Interview completed for Suresh Balaji — Tech: 89, Comm: 85', time: '30 Mar 2026, 11:10' },
  { msg: 'hr assigned "Data Engineer" to TANYA M.', time: '29 Mar 2026, 09:30' },
  { msg: 'Lakshmi Narayanan moved to L1 Interview — DevOps Engineer', time: '28 Mar 2026, 15:05' },
];

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px' }}>{title}</div>
          <div style={{ color: 'white', fontSize: '32px', fontWeight: '700' }}>{value}</div>
        </div>
        <div style={{ fontSize: '24px', background: `${color}20`, padding: '10px', borderRadius: '8px' }}>{icon}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Welcome back! 👋</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Here&apos;s what&apos;s happening with your recruitment pipeline</p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <StatCard title="Total Clients" value={5} icon="🏢" color="#3b82f6" />
          <StatCard title="Active Jobs" value={12} icon="📋" color="#8b5cf6" />
          <StatCard title="Active Candidates" value={126} icon="👥" color="#10b981" />
          <StatCard title="Recruiters" value={8} icon="🎯" color="#f59e0b" />
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Candidates Needing Attention */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: 0 }}>⚠️ Candidates Needing Attention</h3>
              <select style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: 'white', fontSize: '13px', cursor: 'pointer', outline: 'none', minWidth: '150px' }}>
                <option style={{ background: '#1e293b' }}>Horizon Tech Partners</option>
                <option style={{ background: '#1e293b' }}>NovaByte Systems</option>
                <option style={{ background: '#1e293b' }}>PeakLogic Analytics</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ATTENTION.map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{c.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>{c.title} • {c.client}</div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', background: `${STAGE_COLORS[c.stage] || '#6b7280'}20`, color: STAGE_COLORS[c.stage] || '#6b7280' }}>{STAGE_LABELS[c.stage] || c.stage}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: agingColor(c.days), fontSize: '18px', fontWeight: '700' }}>{c.days}d</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>in stage</div>
                    <Link href="/jobs" style={{ display: 'inline-block', marginTop: '6px', padding: '4px 8px', background: 'rgba(59,130,246,0.2)', border: 'none', borderRadius: '4px', color: '#60a5fa', fontSize: '11px', textDecoration: 'none' }}>View →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>📊 Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ color: 'white', fontSize: '13px', marginBottom: '4px' }}>{a.msg}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          {[
            { icon: '🔍', label: 'Screen Candidates', href: '/screen' },
            { icon: '📋', label: 'View Jobs', href: '/jobs' },
            { icon: '📊', label: 'Aging Report', href: '/reporting' },
          ].map(q => (
            <Link key={q.label} href={q.href} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: '24px' }}>{q.icon}</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>{q.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
