'use client';
import Link from 'next/link';

const FEATURES = [
  { title: 'AI Resume Screening', desc: 'Upload resumes and get 0-100 scores across 5 dimensions with skill-by-skill breakdowns.', icon: '📄', href: '/screening' },
  { title: 'Voice AI Interviews', desc: 'Automated voice interviews using Claude, ElevenLabs, and Deepgram — scores tech depth and communication.', icon: '🎙️', href: '/interviews' },
  { title: 'Pipeline Management', desc: 'Track candidates through stages with automated aging alerts and bulk actions.', icon: '📊', href: '/pipeline' },
  { title: 'Recruiter Dashboard', desc: 'KPIs, recent activity, candidates needing attention — everything at a glance.', icon: '📈', href: '/dashboard' },
];

const STATS = [
  { label: 'Candidates Screened', value: '3,900+' },
  { label: 'AI Interviews', value: '380+' },
  { label: 'Job Descriptions', value: '230+' },
  { label: 'External APIs', value: '5' },
];

const TECH = ['Next.js 14', 'FastAPI', 'Claude API', 'ElevenLabs', 'Deepgram', 'LiveKit', 'Supabase', 'PostgreSQL'];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a' }}>
      {/* Nav */}
      <nav className="landing-nav" style={{ padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(184, 151, 90, 0.2)' }}>
        <span style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #b8975a, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ARISTOSYS
        </span>
        <Link href="/dashboard" className="landing-cta" style={{
          padding: '12px 28px', background: 'linear-gradient(135deg, #b8975a, #d4af37)', color: '#0a0f1a',
          border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
          boxShadow: '0 4px 15px rgba(184, 151, 90, 0.3)',
        }}>
          Explore Demo →
        </Link>
      </nav>

      {/* Hero */}
      <main className="landing-main" style={{ padding: '80px 60px 60px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '8px 18px', background: 'rgba(139, 92, 246, 0.15)',
          borderRadius: '50px', marginBottom: '28px', border: '1px solid rgba(139, 92, 246, 0.3)',
        }}>
          <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>DEMO MODE — ALL DATA IS SYNTHETIC</span>
        </div>

        <h1 className="landing-h1" style={{ fontSize: 'clamp(32px, 8vw, 54px)', fontWeight: '800', color: 'white', lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-1px' }}>
          AI-Powered<br />
          <span style={{ background: 'linear-gradient(135deg, #b8975a, #d4af37, #e8c252)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Recruitment Platform
          </span>
        </h1>

        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', maxWidth: '650px', margin: '0 auto 48px', lineHeight: '1.6' }}>
          Automates resume screening, conducts AI voice interviews, and manages candidate pipelines for IT staffing — built from scratch and deployed in production.
        </p>

        {/* Stats */}
        <div className="landing-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '60px' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding: '24px', background: 'rgba(184, 151, 90, 0.08)', borderRadius: '12px', border: '1px solid rgba(184, 151, 90, 0.2)' }}>
              <div style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: '800', background: 'linear-gradient(135deg, #b8975a, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="landing-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '60px', textAlign: 'left' }}>
          {FEATURES.map(f => (
            <Link key={f.title} href={f.href} style={{
              padding: '28px', background: 'rgba(184, 151, 90, 0.08)', borderRadius: '12px',
              border: '1px solid rgba(184, 151, 90, 0.2)', transition: 'all 0.2s', cursor: 'pointer', display: 'block',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5', margin: 0 }}>{f.desc}</p>
            </Link>
          ))}
        </div>

        {/* Architecture */}
        <div style={{ padding: '40px', background: 'rgba(184, 151, 90, 0.06)', borderRadius: '16px', border: '1px solid rgba(184, 151, 90, 0.15)', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: 'white' }}>Architecture</h2>
          <div className="landing-arch" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
            {[
              { name: 'Frontend', detail: 'Next.js 14, TypeScript, Tailwind', deploy: 'Vercel' },
              { name: 'Backend', detail: 'FastAPI, Python, Claude API', deploy: 'Railway' },
              { name: 'Interview Agent', detail: 'LiveKit, Deepgram, ElevenLabs', deploy: 'Railway' },
            ].map(s => (
              <div key={s.name} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#d4af37', marginBottom: '6px' }}>{s.name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{s.detail}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Deployed on {s.deploy}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {TECH.map(t => (
              <span key={t} style={{ padding: '6px 14px', background: 'rgba(184, 151, 90, 0.1)', borderRadius: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(184, 151, 90, 0.15)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '40px' }}>
          Built by Sahil Paul Parokkaran — this is a demo showcase with synthetic data. No real candidate or company information is displayed.
        </p>
      </main>

      <style jsx>{`
        @media (max-width: 640px) {
          .landing-nav { padding: 16px 20px !important; }
          .landing-cta { padding: 10px 16px !important; font-size: 13px !important; }
          .landing-main { padding: 40px 20px 40px !important; }
          .landing-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .landing-features { grid-template-columns: 1fr !important; }
          .landing-arch { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
