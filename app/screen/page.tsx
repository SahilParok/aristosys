'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DemoNav from '@/components/DemoNav';
import { makeScreeningReport } from '@/lib/demoReports';

const CLIENTS = ['Horizon Tech Partners', 'NovaByte Systems', 'PeakLogic Analytics'];
const JDS: Record<string, string[]> = { 'Horizon Tech Partners': ['Senior Software Engineer', 'Full Stack Developer'], 'NovaByte Systems': ['DevOps Engineer', 'QA Automation Engineer'], 'PeakLogic Analytics': ['Data Engineer'] };
const RECRUITERS = ['Nisha Devi', 'Tanya Mathur', 'Fatima Khan', 'Rekha Prasad', 'Prerna Saxena'];
const MANAGERS = ['Rohit Verma', 'Deepak Thakur', 'Anita Sharma'];

// Fake names to randomly assign to uploaded resumes
const FAKE_NAMES = ['Arun Mehta', 'Kavita Srinivasan', 'Raj Malhotra', 'Sneha Nair', 'Vikash Tiwari', 'Poornima Das', 'Sanjay Bose', 'Ritika Chauhan'];
const FAKE_EMAILS = ['arun.m@email.com', 'kavita.s@email.com', 'raj.m@email.com', 'sneha.n@email.com', 'vikash.t@email.com', 'poornima.d@email.com', 'sanjay.b@email.com', 'ritika.c@email.com'];

function getScoreColor(s: number | null) { return !s ? '#6b7280' : s >= 65 ? '#10b981' : s >= 45 ? '#f59e0b' : '#ef4444'; }

function randomScore() { return Math.floor(Math.random() * 40) + 55; } // 55-94

function generateFakeResult(fileName: string, jdTitle: string, idx: number) {
  const name = FAKE_NAMES[idx % FAKE_NAMES.length];
  const email = FAKE_EMAILS[idx % FAKE_EMAILS.length];
  const score = randomScore();
  const rec = score >= 65 ? 'Shortlist' : score >= 45 ? 'Review' : 'Below Threshold';
  const report = makeScreeningReport(name, jdTitle, score, rec, {
    core: { score: Math.floor(score * 0.4), max: 40, skills: [{ name: 'Java', strength: score > 75 ? 'strong' : 'moderate' }, { name: 'Spring Boot', strength: score > 80 ? 'strong' : score > 60 ? 'moderate' : 'weak' }] },
    primary: { score: Math.floor(score * 0.25), max: 25, skills: [{ name: 'Microservices', strength: score > 70 ? 'strong' : 'moderate' }, { name: 'AWS', strength: score > 75 ? 'moderate' : 'weak' }, { name: 'PostgreSQL', strength: 'strong' }] },
    bonus: { score: Math.floor(score * 0.1), max: 10, skills: [{ name: 'Kubernetes', strength: score > 80 ? 'moderate' : 'weak' }] },
    experience: { score: Math.floor(score * 0.15), max: 15, detail: `${Math.floor(Math.random() * 4) + 3} years total — within target range` },
    overall: { score: Math.floor(score * 0.1), max: 10, detail: score >= 65 ? 'Solid candidate with relevant experience across required skills.' : 'Candidate shows potential but has gaps in key areas.' },
    strengths: ['Relevant technical background', 'Good communication in resume', 'Demonstrates problem-solving ability'],
    concerns: score < 70 ? ['Some skill gaps in core areas', 'Could have more hands-on experience'] : ['Minor gaps in bonus skills'],
    summary: `Candidate scored ${score}/100 against ${jdTitle}. ${rec === 'Shortlist' ? 'Recommended for interview.' : 'Consider for review.'}`,
  });
  return { name, email, phone: `+91 98100 ${String(30000 + idx).slice(-5)}`, fileName, score, rec, report };
}

interface CandidateResult { name: string; email: string; phone: string; fileName: string; score: number; rec: string; report: string; }

function StepIndicator({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: completed ? '#10b981' : active ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '600' }}>
        {completed ? '✓' : number}
      </div>
      <span style={{ color: active ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: active ? '600' : '400' }}>{label}</span>
    </div>
  );
}

function StepConnector({ completed }: { completed: boolean }) {
  return <div style={{ flex: 1, height: '2px', background: completed ? '#10b981' : 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />;
}

function ScreenPageContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [client, setClient] = useState('');
  const [jd, setJd] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [manager, setManager] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [screening, setScreening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedReport, setExpandedReport] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const c = searchParams.get('client');
    const j = searchParams.get('jd');
    const r = searchParams.get('recruiter');
    const s = searchParams.get('step');
    if (c && CLIENTS.includes(c)) setClient(c);
    if (j) setJd(j);
    if (r && RECRUITERS.includes(r)) setRecruiter(r);
    if (s === '2' && c && j && r) setStep(2);
  }, [searchParams]);

  const canProceed1 = client && jd && recruiter;
  const clientJDs = client ? (JDS[client] || []) : [];

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const startScreening = () => {
    setStep(3);
    setScreening(true);
    setProgress(0);
    const total = files.length;
    let done = 0;
    const fakeResults: CandidateResult[] = [];

    const processNext = () => {
      if (done >= total) { setScreening(false); return; }
      setTimeout(() => {
        fakeResults.push(generateFakeResult(files[done].name, jd, done));
        done++;
        setProgress(Math.round((done / total) * 100));
        setResults([...fakeResults]);
        processNext();
      }, 1200 + Math.random() * 800);
    };
    processNext();
  };

  const selectStyle: React.CSSProperties = { width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white', fontSize: '14px' };
  const cardBg = 'rgba(255,255,255,0.03)';
  const cardBorder = '1px solid rgba(255,255,255,0.1)';

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main className="screen-main" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>🔍 Screen Candidates</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Upload resumes to analyze and score against job requirements</p>
        </div>

        {/* Progress Steps */}
        <div className="screen-steps" style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: cardBg, padding: '20px', borderRadius: '12px', border: cardBorder, flexWrap: 'wrap' }}>
          <StepIndicator number={1} label="Select Job" active={step === 1} completed={step > 1} />
          <StepConnector completed={step > 1} />
          <StepIndicator number={2} label="Upload Resumes" active={step === 2} completed={step > 2} />
          <StepConnector completed={step > 2} />
          <StepIndicator number={3} label="Review Results" active={step === 3} completed={false} />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '25px' }}>Step 1: Select Job Details</h2>
            <div className="screen-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Client *</label>
                <select value={client} onChange={e => { setClient(e.target.value); setJd(''); }} style={selectStyle}>
                  <option value="" style={{ background: '#1e293b' }}>Select Client...</option>
                  {CLIENTS.map(c => <option key={c} value={c} style={{ background: '#1e293b' }}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Job Description *</label>
                <select value={jd} onChange={e => setJd(e.target.value)} disabled={!client} style={{ ...selectStyle, opacity: client ? 1 : 0.5 }}>
                  <option value="" style={{ background: '#1e293b' }}>{client ? 'Select JD...' : 'Select client first'}</option>
                  {clientJDs.map(j => <option key={j} value={j} style={{ background: '#1e293b' }}>{j}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Recruiter *</label>
                <select value={recruiter} onChange={e => setRecruiter(e.target.value)} style={selectStyle}>
                  <option value="" style={{ background: '#1e293b' }}>Select Recruiter...</option>
                  {RECRUITERS.map(r => <option key={r} value={r} style={{ background: '#1e293b' }}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', fontSize: '14px' }}>Manager (optional)</label>
                <select value={manager} onChange={e => setManager(e.target.value)} style={selectStyle}>
                  <option value="" style={{ background: '#1e293b' }}>Select Manager...</option>
                  {MANAGERS.map(m => <option key={m} value={m} style={{ background: '#1e293b' }}>{m}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setStep(2)} disabled={!canProceed1} style={{ padding: '12px 30px', background: canProceed1 ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: canProceed1 ? 'pointer' : 'not-allowed', opacity: canProceed1 ? 1 : 0.5 }}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '25px' }}>Step 2: Upload Resumes</h2>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '12px', fontSize: '14px' }}>Resumes * (PDF, DOCX, TXT)</label>
              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(59,130,246,0.4)', borderRadius: '12px', padding: '40px', textAlign: 'center', background: 'rgba(59,130,246,0.05)', cursor: 'pointer' }}>
                <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.txt" onChange={handleFiles} style={{ display: 'none' }} />
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
                <div style={{ color: 'white', fontSize: '16px', marginBottom: '5px' }}>Drop resumes here or click to browse</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>You can upload multiple files at once</div>
              </div>
              {files.length > 0 && (
                <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'white', fontSize: '13px' }}>{f.name}</span>
                      <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', padding: '0' }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>← Back</button>
              <button onClick={startScreening} disabled={files.length === 0} style={{ padding: '12px 30px', background: files.length > 0 ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: files.length > 0 ? 'pointer' : 'not-allowed', opacity: files.length > 0 ? 1 : 0.5 }}>🔍 Start Screening →</button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            {screening && (
              <div style={{ background: cardBg, border: cardBorder, borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ color: 'white', fontSize: '14px' }}>Screening candidates...</span>
                  <span style={{ color: '#60a5fa', fontSize: '14px' }}>{progress}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}

            <div className="screen-results-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(results.length, 3)}, 1fr)`, gap: '20px' }}>
              {results.map((c, i) => (
                <div key={i} style={{ background: cardBg, border: cardBorder, borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ color: '#10b981' }}>✅</span>
                      <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>{c.name}</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{c.fileName}</div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Resume Score</span>
                        <span style={{ color: getScoreColor(c.score), fontWeight: '700', fontSize: '18px' }}>{c.score}/100</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${c.score}%`, height: '100%', background: getScoreColor(c.score), transition: 'width 0.5s' }} />
                      </div>
                    </div>
                    <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '20px', background: c.rec === 'Shortlist' ? 'rgba(16,185,129,0.2)' : c.rec === 'Review' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)', color: c.rec === 'Shortlist' ? '#10b981' : c.rec === 'Review' ? '#f59e0b' : '#ef4444', fontSize: '13px', fontWeight: '600', marginBottom: '15px' }}>{c.rec}</div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px', marginBottom: '15px' }}>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '8px' }}>Contact</div>
                      <div style={{ color: 'white', fontSize: '13px', marginBottom: '4px' }}>📧 {c.email}</div>
                      <div style={{ color: 'white', fontSize: '13px' }}>📞 {c.phone}</div>
                    </div>
                    <button onClick={() => setExpandedReport(expandedReport === i ? null : i)} style={{ width: '100%', padding: '10px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontSize: '13px', cursor: 'pointer' }}>
                      {expandedReport === i ? '▼ Hide Report' : '▶ View Report'}
                    </button>
                    {expandedReport === i && (
                      <div style={{ marginTop: '15px', background: 'white', borderRadius: '8px', maxHeight: '500px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: c.report }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!screening && results.length > 0 && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => { setStep(2); setResults([]); setFiles([]); setProgress(0); }} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>← Screen More</button>
                <button onClick={() => { setStep(1); setResults([]); setFiles([]); setProgress(0); setClient(''); setJd(''); }} style={{ padding: '12px 24px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontSize: '14px', cursor: 'pointer' }}>Start Over</button>
              </div>
            )}
          </div>
        )}
      </main>
      <style jsx>{`
        @media (max-width: 640px) {
          .screen-main { padding: 16px !important; }
          .screen-steps { gap: 16px !important; }
          .screen-form-grid { grid-template-columns: 1fr !important; }
          .screen-results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function ScreenPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
      <ScreenPageContent />
    </Suspense>
  );
}
