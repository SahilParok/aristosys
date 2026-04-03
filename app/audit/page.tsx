'use client';
import DemoNav from '@/components/DemoNav';
import { DEMO_AUDIT } from '@/lib/demoData';

const ACTION_COLORS: Record<string, string> = {
  'Candidate Created': '#3b82f6',
  'Candidate Created (Public)': '#6366f1',
  'Resume Uploaded': '#10b981',
  'Stage Changed': '#f59e0b',
  'AI Interview Sent': '#8b5cf6',
  'AI Interview Completed': '#a78bfa',
  'JD Edited': '#d4af37',
  'Recruiter Assigned': '#ec4899',
  'Audio Uploaded': '#06b6d4',
};

export default function Audit() {
  return (<div><DemoNav />
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Audit Log</h1>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
        Full history of all actions — Senior Software Engineer (Demo JD)
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {DEMO_AUDIT.map((a, i) => {
          const color = ACTION_COLORS[a.action] || '#6b7280';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'rgba(184,151,90,0.06)', borderRadius: '8px', border: '1px solid rgba(184,151,90,0.12)' }}>
              <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color, background: color + '15', border: `1px solid ${color}30`, whiteSpace: 'nowrap', minWidth: '160px', textAlign: 'center' }}>{a.action}</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', flex: 1 }}>{a.detail}</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{a.user}</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{a.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>);
}
