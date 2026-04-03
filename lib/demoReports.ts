// Fake report HTML matching the exact style of the real ARISTOSYS backend reports

export function makeScreeningReport(name: string, title: string, score: number, rec: string, breakdown: {
  core: { score: number; max: number; skills: { name: string; strength: string }[] };
  primary: { score: number; max: number; skills: { name: string; strength: string }[] };
  bonus: { score: number; max: number; skills: { name: string; strength: string }[] };
  experience: { score: number; max: number; detail: string };
  overall: { score: number; max: number; detail: string };
  strengths: string[];
  concerns: string[];
  summary: string;
}) {
  const scoreColor = score >= 65 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const recColor = rec === 'Shortlist' || rec === 'Strong Shortlist' ? '#10b981' : rec === 'Review' ? '#f59e0b' : '#ef4444';
  const strengthColor = (s: string) => s === 'strong' || s === 'expert' ? '#10b981' : s === 'moderate' || s === 'proficient' ? '#f59e0b' : s === 'weak' || s === 'familiar' ? '#ef4444' : '#6b7280';

  const skillRows = [...breakdown.core.skills, ...breakdown.primary.skills, ...breakdown.bonus.skills]
    .map(s => `<tr><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#1e293b;">${s.name}</td><td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:center;"><span style="display:inline-block;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:600;background:${strengthColor(s.strength)}15;color:${strengthColor(s.strength)};">${s.strength}</span></td></tr>`)
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:20px;background:#f8fafc;color:#1e293b;}
.container{max-width:800px;margin:0 auto;background:white;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;}
.header{background:linear-gradient(135deg,#1e3a5f,#3b82f6);color:white;padding:30px;}
.header h1{margin:0 0 10px 0;font-size:28px;}
.score-section{display:flex;justify-content:space-around;padding:30px;background:#f1f5f9;}
.score-box{text-align:center;}
.score-circle{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:bold;color:white;margin:0 auto 10px;}
.content{padding:30px;}
table{width:100%;border-collapse:collapse;}
th{text-align:left;padding:10px;background:#f1f5f9;color:#475569;font-size:13px;}
</style></head><body><div class="container">
<div class="header"><h1>${name}</h1><p style="margin:0;opacity:0.9;">${title} • ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</p></div>
<div class="score-section">
<div class="score-box"><div class="score-circle" style="background:${scoreColor};">${score}</div><div style="color:#64748b;font-size:14px;">Resume Score</div></div>
<div class="score-box"><div style="display:inline-block;padding:12px 24px;border-radius:25px;background:${recColor}20;color:${recColor};font-weight:600;font-size:16px;">${rec}</div><div style="color:#64748b;font-size:14px;margin-top:10px;">Recommendation</div></div>
<div class="score-box" style="min-width:210px;"><div style="color:#64748b;font-size:12px;margin-bottom:6px;">Predicted Outcome</div><div style="font-size:16px;font-weight:700;color:${scoreColor};margin-bottom:10px;">${score >= 65 ? 'Likely Progresses' : score >= 45 ? 'Uncertain' : 'Unlikely'}</div><div style="background:#e2e8f0;border-radius:10px;height:14px;width:170px;margin:0 auto 8px;"><div style="background:${scoreColor};height:100%;border-radius:10px;width:${Math.min(score + 5, 100)}%;"></div></div><div style="color:#475569;font-size:12px;font-weight:500;">with ${Math.min(score + 5, 100)}% confidence</div></div>
</div>
<div class="content">
<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:15px;margin-bottom:25px;border-radius:0 8px 8px 0;color:#1e293b;"><strong>Summary:</strong> ${breakdown.summary}</div>
<h2 style="color:#1e293b;font-size:20px;margin-bottom:15px;">📊 Score Breakdown</h2>
<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:15px;margin-bottom:25px;">
<div style="padding:15px;border-radius:10px;background:#dc262615;border-left:4px solid #dc2626;"><div style="color:#64748b;font-size:11px;margin-bottom:5px;">Core Fit</div><div style="font-size:24px;font-weight:700;color:#dc2626;">${breakdown.core.score}<span style="font-size:14px;color:#94a3b8;">/${breakdown.core.max}</span></div></div>
<div style="padding:15px;border-radius:10px;background:#2563eb15;border-left:4px solid #2563eb;"><div style="color:#64748b;font-size:11px;margin-bottom:5px;">Primary Fit</div><div style="font-size:24px;font-weight:700;color:#2563eb;">${breakdown.primary.score}<span style="font-size:14px;color:#94a3b8;">/${breakdown.primary.max}</span></div></div>
<div style="padding:15px;border-radius:10px;background:#8b5cf615;border-left:4px solid #8b5cf6;"><div style="color:#64748b;font-size:11px;margin-bottom:5px;">Bonus Fit</div><div style="font-size:24px;font-weight:700;color:#8b5cf6;">${breakdown.bonus.score}<span style="font-size:14px;color:#94a3b8;">/${breakdown.bonus.max}</span></div></div>
<div style="padding:15px;border-radius:10px;background:#ca8a0415;border-left:4px solid #ca8a04;"><div style="color:#64748b;font-size:11px;margin-bottom:5px;">Experience</div><div style="font-size:24px;font-weight:700;color:#ca8a04;">${breakdown.experience.score}<span style="font-size:14px;color:#94a3b8;">/${breakdown.experience.max}</span></div></div>
<div style="padding:15px;border-radius:10px;background:#16a34a15;border-left:4px solid #16a34a;"><div style="color:#64748b;font-size:11px;margin-bottom:5px;">Overall Fit</div><div style="font-size:24px;font-weight:700;color:#16a34a;">${breakdown.overall.score}<span style="font-size:14px;color:#94a3b8;">/${breakdown.overall.max}</span></div></div>
</div>
<div style="margin-bottom:25px;"><div style="color:#64748b;font-size:12px;margin-bottom:6px;"><strong>Experience:</strong> ${breakdown.experience.detail}</div><div style="color:#64748b;font-size:12px;"><strong>Overall:</strong> ${breakdown.overall.detail}</div></div>
<h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">Skills Analysis</h3>
<table style="margin-bottom:25px;"><thead><tr><th style="border-bottom:2px solid #e2e8f0;">Skill</th><th style="border-bottom:2px solid #e2e8f0;text-align:center;">Strength</th></tr></thead><tbody>${skillRows}</tbody></table>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
<div><h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">💪 Strengths</h3><ul style="margin:0;padding-left:20px;color:#475569;font-size:13px;line-height:1.8;">${breakdown.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>
<div><h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">⚠️ Concerns</h3><ul style="margin:0;padding-left:20px;color:#475569;font-size:13px;line-height:1.8;">${breakdown.concerns.map(s => `<li>${s}</li>`).join('')}</ul></div>
</div></div>
<div style="text-align:center;padding:20px;background:#f8fafc;color:#94a3b8;font-size:12px;">Generated by Aristosys AI Screening System</div>
</div></body></html>`;
}

export function makeInterviewReport(name: string, title: string, techScore: number, commScore: number) {
  const techColor = techScore >= 70 ? '#10b981' : techScore >= 60 ? '#f59e0b' : '#ef4444';
  const commColor = commScore >= 70 ? '#10b981' : commScore >= 60 ? '#f59e0b' : '#ef4444';

  return `<div style="font-family:'Segoe UI',Arial,sans-serif;padding:20px;color:#1e293b;">
<h2 style="color:#1e293b;font-size:22px;margin-bottom:20px;border-bottom:2px solid #8b5cf6;padding-bottom:10px;">🤖 AI Interview Report</h2>
<div style="color:#64748b;font-size:13px;margin-bottom:20px;">${name} • ${title}</div>
<div style="display:flex;gap:20px;margin-bottom:25px;">
<div style="flex:1;background:#f8fafc;padding:20px;border-radius:12px;text-align:center;border:1px solid #e2e8f0;"><div style="font-size:42px;font-weight:bold;color:${techColor};">${techScore}</div><div style="color:#64748b;font-weight:500;">Technical Score</div></div>
<div style="flex:1;background:#f8fafc;padding:20px;border-radius:12px;text-align:center;border:1px solid #e2e8f0;"><div style="font-size:42px;font-weight:bold;color:${commColor};">${commScore}</div><div style="color:#64748b;font-weight:500;">Communication Score</div></div>
</div>
<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:15px;margin-bottom:25px;border-radius:0 8px 8px 0;color:#1e293b;"><strong>Overall Impression:</strong> Candidate demonstrates solid technical knowledge with clear articulation. Showed depth in core framework experience and provided concrete examples from past projects.</div>
<div style="margin-bottom:25px;"><h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">🎯 Skills Demonstrated</h3><div><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#dcfce7;color:#166534;">Java</span><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#dcfce7;color:#166534;">Spring Boot</span><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#dcfce7;color:#166534;">Microservices</span><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#dcfce7;color:#166534;">PostgreSQL</span><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#dcfce7;color:#166534;">REST APIs</span></div></div>
<div style="margin-bottom:25px;"><h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">⚠️ Skills Not Demonstrated</h3><div><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#fee2e2;color:#991b1b;">Kubernetes</span><span style="display:inline-block;padding:4px 10px;border-radius:12px;margin:3px;font-size:12px;background:#fee2e2;color:#991b1b;">Kafka</span></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:25px;">
<div><h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">💻 Technical Assessment</h3><p style="color:#475569;font-size:13px;margin-bottom:10px;">Candidate showed strong understanding of Java ecosystem and microservices patterns. Provided detailed examples of system design and performance optimization.</p><div style="margin-bottom:10px;"><strong style="color:#059669;">Strengths:</strong><ul style="margin:5px 0 0 0;padding-left:20px;color:#475569;font-size:13px;"><li>Deep Java and Spring Boot expertise with real examples</li><li>Strong understanding of microservices architecture</li><li>Good awareness of performance optimization techniques</li></ul></div><div><strong style="color:#dc2626;">Areas for Improvement:</strong><ul style="margin:5px 0 0 0;padding-left:20px;color:#475569;font-size:13px;"><li>Limited discussion of container orchestration</li><li>Could elaborate more on event streaming experience</li></ul></div></div>
<div><h3 style="color:#1e293b;font-size:16px;margin-bottom:10px;">🗣️ Communication Assessment</h3><p style="color:#475569;font-size:13px;margin-bottom:10px;">Clear and structured responses. Candidate organized thoughts well and provided concrete examples when asked.</p><div style="margin-bottom:10px;"><strong style="color:#059669;">Strengths:</strong><ul style="margin:5px 0 0 0;padding-left:20px;color:#475569;font-size:13px;"><li>Well-structured answers with clear beginning, middle, end</li><li>Good use of specific numbers and metrics</li></ul></div><div><strong style="color:#dc2626;">Areas for Improvement:</strong><ul style="margin:5px 0 0 0;padding-left:20px;color:#475569;font-size:13px;"><li>Could be more concise in some responses</li><li>Minor hesitations when discussing unfamiliar topics</li></ul></div></div>
</div>
<div style="text-align:center;padding:15px;background:#f8fafc;border-radius:8px;color:#94a3b8;font-size:11px;">Generated by Aristosys AI Interview System • ${new Date().toISOString().split('T')[0]}</div>
</div>`;
}

// Pre-built reports for demo candidates
export const DEMO_REPORTS: Record<string, { screening: string | null; interview: string | null }> = {
  'Ravi Thapar': {
    screening: makeScreeningReport('Ravi Thapar', 'Senior Software Engineer', 87, 'Shortlist', {
      core: { score: 35, max: 40, skills: [{ name: 'Java', strength: 'strong' }, { name: 'Spring Boot', strength: 'strong' }] },
      primary: { score: 22, max: 25, skills: [{ name: 'Microservices', strength: 'strong' }, { name: 'AWS', strength: 'moderate' }, { name: 'PostgreSQL', strength: 'strong' }, { name: 'REST APIs', strength: 'strong' }] },
      bonus: { score: 8, max: 10, skills: [{ name: 'Kubernetes', strength: 'moderate' }, { name: 'Kafka', strength: 'strong' }] },
      experience: { score: 13, max: 15, detail: '6 years total, 4.5 years relevant — within 4-8 year target range' },
      overall: { score: 9, max: 10, detail: 'Strong technical foundation with proven ownership of complex systems. Minor gap in cloud-native architecture depth.' },
      strengths: ['6 years of hands-on Java and Spring Boot development', 'Designed event-driven microservices architecture (12 services)', 'Strong database optimization skills (PostgreSQL)', 'Kafka streaming pipeline experience is a notable bonus'],
      concerns: ['AWS experience is solid but limited on serverless (Lambda)', 'No direct Kubernetes orchestration ownership', 'Could strengthen cloud-native architecture knowledge'],
      summary: 'Strong backend engineer with deep Java/Spring Boot expertise. Has designed and owned microservices at scale. AWS experience is functional but could be deeper on serverless. Kafka experience is a notable differentiator. Recommended for L1 interview.',
    }),
    interview: makeInterviewReport('Ravi Thapar', 'Senior Software Engineer', 82, 78),
  },
  'Suresh Balaji': {
    screening: makeScreeningReport('Suresh Balaji', 'Senior Software Engineer', 91, 'Strong Shortlist', {
      core: { score: 38, max: 40, skills: [{ name: 'Java', strength: 'strong' }, { name: 'Spring Boot', strength: 'strong' }] },
      primary: { score: 23, max: 25, skills: [{ name: 'Microservices', strength: 'strong' }, { name: 'AWS', strength: 'strong' }, { name: 'PostgreSQL', strength: 'strong' }, { name: 'REST APIs', strength: 'strong' }] },
      bonus: { score: 9, max: 10, skills: [{ name: 'Kubernetes', strength: 'strong' }, { name: 'Kafka', strength: 'moderate' }] },
      experience: { score: 14, max: 15, detail: '7 years total, 6 years relevant — strong match within 4-8 year target range' },
      overall: { score: 7, max: 10, detail: 'Exceptional match across all dimensions. Architecture leadership experience and production-scale system ownership.' },
      strengths: ['7 years of Java development with architecture leadership', 'Led migration of monolithic platform to 15 microservices', 'Strong AWS experience including ECS, Lambda, and SQS', 'Kubernetes production deployment experience'],
      concerns: ['Kafka experience is moderate, not deep streaming', 'May be slightly overqualified for mid-level tasks'],
      summary: 'Exceptional candidate with deep expertise across all required skills. Led major architectural initiatives and has strong cloud-native experience. Strongly recommended for fast-track consideration.',
    }),
    interview: makeInterviewReport('Suresh Balaji', 'Senior Software Engineer', 89, 85),
  },
  'Nitin Kapoor': {
    screening: makeScreeningReport('Nitin Kapoor', 'Senior Software Engineer', 78, 'Shortlist', {
      core: { score: 32, max: 40, skills: [{ name: 'Java', strength: 'strong' }, { name: 'Spring Boot', strength: 'moderate' }] },
      primary: { score: 19, max: 25, skills: [{ name: 'Microservices', strength: 'moderate' }, { name: 'AWS', strength: 'moderate' }, { name: 'PostgreSQL', strength: 'strong' }, { name: 'REST APIs', strength: 'strong' }] },
      bonus: { score: 6, max: 10, skills: [{ name: 'Kubernetes', strength: 'weak' }, { name: 'Kafka', strength: 'moderate' }] },
      experience: { score: 13, max: 15, detail: '5 years total, 4 years relevant — fits the 4-8 year target range' },
      overall: { score: 8, max: 10, detail: 'Solid candidate with good fundamentals. Spring Boot depth could be stronger but compensated by excellent communication and problem-solving.' },
      strengths: ['Strong Java fundamentals with 5 years experience', 'Excellent PostgreSQL and REST API skills', 'Good communicator — clear and structured in responses', 'Demonstrates strong problem-solving approach'],
      concerns: ['Spring Boot experience is moderate — more maintenance than greenfield', 'AWS experience limited to basic EC2/S3 usage', 'Kubernetes exposure is minimal'],
      summary: 'Solid mid-level candidate with strong fundamentals. Java core is strong but Spring Boot and cloud experience could be deeper. Excellent communicator. Recommended for L1 interview.',
    }),
    interview: makeInterviewReport('Nitin Kapoor', 'Senior Software Engineer', 75, 80),
  },
  'Divya Pillai': {
    screening: makeScreeningReport('Divya Pillai', 'Senior Software Engineer', 54, 'Below Threshold', {
      core: { score: 18, max: 40, skills: [{ name: 'Java', strength: 'moderate' }, { name: 'Spring Boot', strength: 'weak' }] },
      primary: { score: 15, max: 25, skills: [{ name: 'Microservices', strength: 'weak' }, { name: 'AWS', strength: 'missing' }, { name: 'PostgreSQL', strength: 'moderate' }, { name: 'REST APIs', strength: 'moderate' }] },
      bonus: { score: 3, max: 10, skills: [{ name: 'Kubernetes', strength: 'missing' }, { name: 'Kafka', strength: 'weak' }] },
      experience: { score: 10, max: 15, detail: '3 years total — below minimum 4-year requirement' },
      overall: { score: 8, max: 10, detail: 'Candidate is below the experience threshold and lacks depth in core skills. Not recommended for this senior role.' },
      strengths: ['Has basic Java experience', 'PostgreSQL fundamentals are adequate', 'Shows willingness to learn new technologies'],
      concerns: ['Spring Boot experience is surface-level', 'No AWS or cloud platform experience', 'Below minimum experience requirement (3 vs 4 years)', 'No microservices architecture ownership', 'Would be better suited for a mid-level position'],
      summary: 'Candidate falls below the threshold for this senior role. Core skill depth is insufficient and experience level does not meet the minimum requirement. Not recommended for this position.',
    }),
    interview: makeInterviewReport('Divya Pillai', 'Senior Software Engineer', 45, 60),
  },
  'Pooja Deshmukh': {
    screening: makeScreeningReport('Pooja Deshmukh', 'Senior Software Engineer', 72, 'Shortlist', {
      core: { score: 28, max: 40, skills: [{ name: 'Java', strength: 'strong' }, { name: 'Spring Boot', strength: 'moderate' }] },
      primary: { score: 20, max: 25, skills: [{ name: 'Microservices', strength: 'moderate' }, { name: 'AWS', strength: 'moderate' }, { name: 'PostgreSQL', strength: 'strong' }, { name: 'REST APIs', strength: 'moderate' }] },
      bonus: { score: 5, max: 10, skills: [{ name: 'Kubernetes', strength: 'weak' }, { name: 'Kafka', strength: 'moderate' }] },
      experience: { score: 12, max: 15, detail: '5 years total, 4 years relevant — meets minimum threshold' },
      overall: { score: 7, max: 10, detail: 'Competent candidate with solid Java fundamentals. Spring Boot and cloud skills need deepening but meets the bar for interview.' },
      strengths: ['Strong Java core skills with 5 years experience', 'Good PostgreSQL query optimization knowledge', 'Demonstrated REST API design in previous role'],
      concerns: ['Spring Boot experience is maintenance-focused, not greenfield', 'AWS limited to EC2 and S3 — no serverless', 'Kubernetes exposure is minimal'],
      summary: 'Solid candidate who meets the minimum bar across core skills. Java is strong but Spring Boot depth is moderate. Recommended for screening interview.',
    }),
    interview: null,
  },
  'Anjali Rao': {
    screening: makeScreeningReport('Anjali Rao', 'Senior Software Engineer', 65, 'Review', {
      core: { score: 25, max: 40, skills: [{ name: 'Java', strength: 'moderate' }, { name: 'Spring Boot', strength: 'moderate' }] },
      primary: { score: 18, max: 25, skills: [{ name: 'Microservices', strength: 'moderate' }, { name: 'AWS', strength: 'weak' }, { name: 'PostgreSQL', strength: 'moderate' }, { name: 'REST APIs', strength: 'strong' }] },
      bonus: { score: 4, max: 10, skills: [{ name: 'Kubernetes', strength: 'missing' }, { name: 'Kafka', strength: 'moderate' }] },
      experience: { score: 11, max: 15, detail: '4 years total — at the minimum of the 4-8 year range' },
      overall: { score: 7, max: 10, detail: 'Borderline candidate. Meets minimum experience but skill depth is moderate across the board. Could work if team is willing to invest in development.' },
      strengths: ['Meets minimum experience requirement', 'Strong REST API design skills', 'Has worked in agile team environments'],
      concerns: ['Java and Spring Boot are moderate, not strong', 'No AWS depth beyond basics', 'No container orchestration experience', 'At the very bottom of the experience range'],
      summary: 'Borderline candidate who meets minimum requirements but lacks the depth expected for a senior role. REST API skills are the strongest area. Recommend review — may work if team needs are flexible.',
    }),
    interview: null,
  },
  'Manish Verma': {
    screening: makeScreeningReport('Manish Verma', 'Full Stack Developer', 84, 'Shortlist', {
      core: { score: 34, max: 40, skills: [{ name: 'React', strength: 'strong' }, { name: 'Node.js', strength: 'strong' }] },
      primary: { score: 21, max: 25, skills: [{ name: 'TypeScript', strength: 'strong' }, { name: 'MongoDB', strength: 'moderate' }, { name: 'GraphQL', strength: 'strong' }] },
      bonus: { score: 7, max: 10, skills: [{ name: 'Next.js', strength: 'strong' }, { name: 'Docker', strength: 'moderate' }] },
      experience: { score: 14, max: 15, detail: '4 years total, all relevant — strong match for 2-5 year range' },
      overall: { score: 8, max: 10, detail: 'Strong full stack profile with modern tech stack. GraphQL and Next.js experience are notable differentiators.' },
      strengths: ['4 years of React + Node.js with production apps', 'TypeScript-first approach across frontend and backend', 'GraphQL API design with Apollo Server', 'Next.js SSR experience is a strong bonus'],
      concerns: ['MongoDB experience is moderate — more reads than schema design', 'Docker usage is basic (Dockerfiles, not orchestration)'],
      summary: 'Strong full stack candidate with modern tech stack expertise. React and Node.js skills are deep, with GraphQL as a differentiator. Recommended for L1 interview.',
    }),
    interview: makeInterviewReport('Manish Verma', 'Full Stack Developer', 80, 76),
  },
  'Swati Kulkarni': {
    screening: makeScreeningReport('Swati Kulkarni', 'Full Stack Developer', 76, 'Shortlist', {
      core: { score: 30, max: 40, skills: [{ name: 'React', strength: 'strong' }, { name: 'Node.js', strength: 'moderate' }] },
      primary: { score: 20, max: 25, skills: [{ name: 'TypeScript', strength: 'moderate' }, { name: 'MongoDB', strength: 'strong' }, { name: 'GraphQL', strength: 'moderate' }] },
      bonus: { score: 5, max: 10, skills: [{ name: 'Next.js', strength: 'weak' }, { name: 'Docker', strength: 'moderate' }] },
      experience: { score: 13, max: 15, detail: '3 years total — solid match within 2-5 year range' },
      overall: { score: 8, max: 10, detail: 'Good candidate with strong React and MongoDB skills. Node.js backend experience could be deeper but shows potential.' },
      strengths: ['Strong React component architecture skills', 'Deep MongoDB experience including aggregation pipelines', 'Good understanding of full stack data flow'],
      concerns: ['Node.js backend experience is more Express CRUD than complex services', 'TypeScript adoption is recent, not fully fluent', 'Next.js exposure is limited to tutorials'],
      summary: 'Good full stack candidate with strong frontend skills. Backend depth is moderate but adequate for the role. Recommended for screening.',
    }),
    interview: null,
  },
  'Amit Saxena': {
    screening: makeScreeningReport('Amit Saxena', 'Full Stack Developer', 69, 'Review', {
      core: { score: 26, max: 40, skills: [{ name: 'React', strength: 'moderate' }, { name: 'Node.js', strength: 'moderate' }] },
      primary: { score: 18, max: 25, skills: [{ name: 'TypeScript', strength: 'weak' }, { name: 'MongoDB', strength: 'moderate' }, { name: 'GraphQL', strength: 'weak' }] },
      bonus: { score: 6, max: 10, skills: [{ name: 'Next.js', strength: 'moderate' }, { name: 'Docker', strength: 'moderate' }] },
      experience: { score: 12, max: 15, detail: '2.5 years total — meets minimum requirement' },
      overall: { score: 7, max: 10, detail: 'Junior-leaning candidate. Has breadth but not depth in most areas. Could work for a team willing to mentor.' },
      strengths: ['Broad exposure to full stack technologies', 'Next.js and Docker show initiative to learn modern tools', 'Eager to learn — mentions side projects in resume'],
      concerns: ['React experience is component-level, not architecture-level', 'GraphQL and TypeScript are surface-level', 'Needs mentorship on backend best practices'],
      summary: 'Junior-leaning full stack developer with broad but shallow experience. Shows initiative with modern tooling. Consider for review if team can provide mentorship.',
    }),
    interview: null,
  },
  'Lakshmi Narayanan': {
    screening: makeScreeningReport('Lakshmi Narayanan', 'DevOps Engineer', 88, 'Shortlist', {
      core: { score: 36, max: 40, skills: [{ name: 'AWS', strength: 'strong' }, { name: 'Terraform', strength: 'strong' }] },
      primary: { score: 22, max: 25, skills: [{ name: 'Docker', strength: 'strong' }, { name: 'Kubernetes', strength: 'strong' }, { name: 'CI/CD', strength: 'strong' }, { name: 'Linux', strength: 'moderate' }] },
      bonus: { score: 8, max: 10, skills: [{ name: 'Ansible', strength: 'moderate' }, { name: 'Prometheus', strength: 'strong' }] },
      experience: { score: 14, max: 15, detail: '6 years total, 5 years in DevOps — strong match for 3-7 year range' },
      overall: { score: 8, max: 10, detail: 'Excellent DevOps profile with production-grade infrastructure experience. Strong across AWS, IaC, and container orchestration.' },
      strengths: ['5 years of dedicated DevOps/infra experience', 'Terraform at scale — manages 200+ resources', 'Kubernetes production clusters with auto-scaling', 'Prometheus + Grafana monitoring stack ownership'],
      concerns: ['Linux skills are functional, not deep kernel-level', 'Ansible experience is moderate — more Terraform-focused'],
      summary: 'Strong DevOps engineer with excellent AWS and Terraform skills. Kubernetes and monitoring experience are production-proven. Highly recommended for L1 interview.',
    }),
    interview: makeInterviewReport('Lakshmi Narayanan', 'DevOps Engineer', 85, 72),
  },
  'Gaurav Chandra': {
    screening: makeScreeningReport('Gaurav Chandra', 'DevOps Engineer', 81, 'Shortlist', {
      core: { score: 33, max: 40, skills: [{ name: 'AWS', strength: 'strong' }, { name: 'Terraform', strength: 'moderate' }] },
      primary: { score: 21, max: 25, skills: [{ name: 'Docker', strength: 'strong' }, { name: 'Kubernetes', strength: 'moderate' }, { name: 'CI/CD', strength: 'strong' }, { name: 'Linux', strength: 'strong' }] },
      bonus: { score: 6, max: 10, skills: [{ name: 'Ansible', strength: 'strong' }, { name: 'Prometheus', strength: 'weak' }] },
      experience: { score: 13, max: 15, detail: '4 years total — solid match within 3-7 year range' },
      overall: { score: 8, max: 10, detail: 'Well-rounded DevOps engineer with strong Linux and CI/CD skills. Terraform depth could be stronger but compensated by Ansible expertise.' },
      strengths: ['Strong Linux administration and scripting', 'CI/CD pipeline design with Jenkins and GitHub Actions', 'Good Docker containerization practices', 'Ansible automation experience fills configuration management gap'],
      concerns: ['Terraform is moderate — more user than designer of modules', 'Kubernetes experience is basic cluster operations, not architecture', 'Monitoring stack experience is limited'],
      summary: 'Well-rounded DevOps candidate with strong Linux and CI/CD fundamentals. Terraform could be deeper but overall profile is solid. Recommended for screening.',
    }),
    interview: null,
  },
  'Sunita Bose': {
    screening: makeScreeningReport('Sunita Bose', 'DevOps Engineer', 73, 'Review', {
      core: { score: 29, max: 40, skills: [{ name: 'AWS', strength: 'moderate' }, { name: 'Terraform', strength: 'moderate' }] },
      primary: { score: 19, max: 25, skills: [{ name: 'Docker', strength: 'strong' }, { name: 'Kubernetes', strength: 'weak' }, { name: 'CI/CD', strength: 'moderate' }, { name: 'Linux', strength: 'moderate' }] },
      bonus: { score: 5, max: 10, skills: [{ name: 'Ansible', strength: 'moderate' }, { name: 'Prometheus', strength: 'missing' }] },
      experience: { score: 12, max: 15, detail: '3 years total — at the minimum of the 3-7 year range' },
      overall: { score: 8, max: 10, detail: 'Junior DevOps engineer with Docker as the strongest skill. AWS and Terraform need deepening for this role level.' },
      strengths: ['Strong Docker skills — multi-stage builds, compose, networking', 'Has Ansible experience for configuration management', 'Demonstrates good scripting habits'],
      concerns: ['AWS and Terraform are moderate — not production IaC at scale', 'Kubernetes exposure is very basic', 'No monitoring/observability stack experience', 'At minimum experience threshold'],
      summary: 'Junior-leaning DevOps engineer with Docker as the standout skill. Core IaC and cloud skills need development. Consider for review.',
    }),
    interview: null,
  },
  'Harish Menon': {
    screening: makeScreeningReport('Harish Menon', 'Data Engineer', 93, 'Strong Shortlist', {
      core: { score: 39, max: 40, skills: [{ name: 'Python', strength: 'strong' }, { name: 'Spark', strength: 'strong' }] },
      primary: { score: 24, max: 25, skills: [{ name: 'SQL', strength: 'strong' }, { name: 'Airflow', strength: 'strong' }, { name: 'AWS Glue', strength: 'strong' }] },
      bonus: { score: 9, max: 10, skills: [{ name: 'dbt', strength: 'strong' }, { name: 'Snowflake', strength: 'moderate' }] },
      experience: { score: 14, max: 15, detail: '5 years total, all in data engineering — excellent match for 3-6 year range' },
      overall: { score: 7, max: 10, detail: 'Outstanding data engineering profile. Deep expertise in the modern data stack with production-scale pipeline experience.' },
      strengths: ['5 years of dedicated data engineering experience', 'PySpark at scale — processes 2TB+ daily', 'Airflow DAG design for 50+ production pipelines', 'AWS Glue + dbt for ELT transformation layer', 'Strong SQL — window functions, CTEs, optimization'],
      concerns: ['Snowflake experience is moderate — more Redshift background', 'No real-time streaming experience (Kafka, Kinesis)'],
      summary: 'Exceptional data engineer with deep expertise across the modern data stack. PySpark and Airflow skills are production-proven at scale. Strongly recommended.',
    }),
    interview: makeInterviewReport('Harish Menon', 'Data Engineer', 91, 88),
  },
  'Isha Bhatt': {
    screening: makeScreeningReport('Isha Bhatt', 'Data Engineer', 70, 'Shortlist', {
      core: { score: 27, max: 40, skills: [{ name: 'Python', strength: 'strong' }, { name: 'Spark', strength: 'moderate' }] },
      primary: { score: 19, max: 25, skills: [{ name: 'SQL', strength: 'strong' }, { name: 'Airflow', strength: 'moderate' }, { name: 'AWS Glue', strength: 'weak' }] },
      bonus: { score: 5, max: 10, skills: [{ name: 'dbt', strength: 'moderate' }, { name: 'Snowflake', strength: 'moderate' }] },
      experience: { score: 12, max: 15, detail: '3 years total — meets minimum of 3-6 year range' },
      overall: { score: 7, max: 10, detail: 'Solid junior data engineer with strong Python and SQL. Spark and cloud data tools need deepening but shows good trajectory.' },
      strengths: ['Strong Python data processing skills (pandas, PySpark basics)', 'Excellent SQL — complex queries and optimization', 'dbt and Snowflake exposure shows modern stack awareness'],
      concerns: ['Spark experience is moderate — small-scale only, not TB-level', 'AWS Glue experience is basic — mostly following existing patterns', 'Airflow is user-level, not DAG architecture'],
      summary: 'Junior data engineer with strong Python and SQL foundation. Big data tools need scaling experience. Recommended for L1 interview with development potential.',
    }),
    interview: makeInterviewReport('Isha Bhatt', 'Data Engineer', 68, 74),
  },
};
