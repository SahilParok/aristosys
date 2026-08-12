'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/screen', label: 'Screen' },
  { href: '/interviews', label: 'Interviews' },
  { href: '/clients', label: 'Clients' },
  { href: '/recruiters', label: 'Internal Team' },
  { href: '/reporting', label: 'Reporting' },
  { href: '/audit', label: 'Audit' },
];

export default function DemoNav() {
  const p = usePathname();
  return (
    <nav className="demo-nav" style={{ padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid rgba(184,151,90,0.2)', background: 'rgba(10,15,26,0.97)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="demo-nav-left" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(135deg,#b8975a,#d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ARISTOSYS</Link>
        <div className="demo-nav-links" style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', background: p === n.href ? 'rgba(184,151,90,0.15)' : 'transparent', color: p === n.href ? '#d4af37' : 'rgba(255,255,255,0.5)', border: p === n.href ? '1px solid rgba(184,151,90,0.3)' : '1px solid transparent' }}>{n.label}</Link>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: '600', background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>DEMO</span>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Demo User</span>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .demo-nav { padding: 12px 16px !important; }
          .demo-nav-links { gap: 0 !important; }
        }
      `}</style>
    </nav>
  );
}
