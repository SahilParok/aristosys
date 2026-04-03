// 100% fake data. Nothing from the real ARISTOSYS system.

export const STAGES = [
  { key: 'prospect', label: 'Prospect', color: '#6b7280' },
  { key: 'submitted', label: 'Submitted', color: '#3b82f6' },
  { key: 'l1_interview', label: 'L1 Interview', color: '#8b5cf6' },
  { key: 'l2_interview', label: 'L2 Interview', color: '#ec4899' },
  { key: 'selected', label: 'Selected', color: '#10b981' },
  { key: 'joined', label: 'Joined', color: '#059669' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' },
];

export const DEMO_JD = {
  title: 'Senior Software Engineer',
  client: 'Horizon Tech Partners',
  locations: 'Bangalore, Hyderabad',
  experience: '4-8 years',
  positions: 3,
  work_mode: 'Hybrid',
  skills_core: ['Java', 'Spring Boot'],
  skills_primary: ['Microservices', 'AWS', 'PostgreSQL', 'REST APIs'],
  skills_bonus: ['Kubernetes', 'Kafka'],
};

export const DEMO_CANDIDATES = [
  { name: 'Ravi Thapar', email: 'ravi.t@demo.com', score: 87, stage: 'l1_interview', tech: 82, comm: 78, recruiter: 'Nisha D.' },
  { name: 'Pooja Deshmukh', email: 'pooja.d@demo.com', score: 72, stage: 'submitted', tech: null, comm: null, recruiter: 'Tanya M.' },
  { name: 'Suresh Balaji', email: 'suresh.b@demo.com', score: 91, stage: 'selected', tech: 89, comm: 85, recruiter: 'Nisha D.' },
  { name: 'Anjali Rao', email: 'anjali.r@demo.com', score: 65, stage: 'prospect', tech: null, comm: null, recruiter: 'Fatima K.' },
  { name: 'Nitin Kapoor', email: 'nitin.k@demo.com', score: 78, stage: 'l2_interview', tech: 75, comm: 80, recruiter: 'Tanya M.' },
  { name: 'Divya Pillai', email: 'divya.p@demo.com', score: 54, stage: 'rejected', tech: 45, comm: 60, recruiter: 'Nisha D.' },
];

export const DEMO_DASHBOARD = {
  clients: 5,
  active_jobs: 12,
  candidates: 847,
  recruiters: 8,
  activity: [
    'Ravi Thapar moved to L1 Interview — Senior Software Engineer',
    'AI Interview completed for Suresh Balaji — Tech: 89, Comm: 85',
    'Pooja Deshmukh screened — Score: 72/100',
    'New application received for Full Stack Developer',
    'Anjali Rao added as prospect — Senior Software Engineer',
    'Weekly summary sent to 8 recruiters',
  ],
};

export const DEMO_RECRUITERS = [
  { name: 'Nisha Devi', email: 'nisha@demo.com', phone: '+91 98100 11001', active_jds: 4, candidates: 38 },
  { name: 'Tanya Mathur', email: 'tanya@demo.com', phone: '+91 98100 11002', active_jds: 3, candidates: 29 },
  { name: 'Fatima Khan', email: 'fatima@demo.com', phone: '+91 98100 11003', active_jds: 3, candidates: 24 },
  { name: 'Rekha Prasad', email: 'rekha@demo.com', phone: '+91 98100 11004', active_jds: 2, candidates: 21 },
  { name: 'Prerna Saxena', email: 'prerna@demo.com', phone: '+91 98100 11005', active_jds: 2, candidates: 18 },
];

export const DEMO_CLIENTS = [
  { name: 'Horizon Tech Partners', industry: 'IT Services', jds: 4, candidates: 63 },
  { name: 'NovaByte Systems', industry: 'Cloud Infrastructure', jds: 3, candidates: 41 },
  { name: 'PeakLogic Analytics', industry: 'Data & AI', jds: 3, candidates: 37 },
  { name: 'Meridian Digital', industry: 'Fintech', jds: 1, candidates: 12 },
  { name: 'BlueArc Solutions', industry: 'Enterprise Software', jds: 1, candidates: 8 },
];

export const DEMO_AUDIT = [
  { action: 'Candidate Created', detail: 'Ravi Thapar added to Senior Software Engineer', user: 'Nisha D.', time: '2 hours ago' },
  { action: 'Resume Uploaded', detail: 'Resume screened for Ravi Thapar — Score: 87/100', user: 'System', time: '2 hours ago' },
  { action: 'Stage Changed', detail: 'Ravi Thapar: Prospect → Submitted', user: 'Nisha D.', time: '1 day ago' },
  { action: 'Stage Changed', detail: 'Ravi Thapar: Submitted → L1 Interview', user: 'Nisha D.', time: '5 hours ago' },
  { action: 'AI Interview Sent', detail: 'Interview invite sent to Suresh Balaji', user: 'Nisha D.', time: '3 days ago' },
  { action: 'AI Interview Completed', detail: 'Suresh Balaji — Tech: 89, Comm: 85', user: 'System', time: '2 days ago' },
  { action: 'Stage Changed', detail: 'Suresh Balaji: L1 Interview → Selected', user: 'Nisha D.', time: '1 day ago' },
  { action: 'JD Edited', detail: 'Senior Software Engineer — updated skills list', user: 'Tanya M.', time: '4 days ago' },
  { action: 'Candidate Created (Public)', detail: 'Anjali Rao applied via careers portal', user: 'System', time: '3 days ago' },
  { action: 'Recruiter Assigned', detail: 'Fatima K. assigned to Senior Software Engineer', user: 'Admin', time: '5 days ago' },
  { action: 'Stage Changed', detail: 'Divya Pillai: L1 Interview → Rejected', user: 'Nisha D.', time: '4 days ago' },
  { action: 'Audio Uploaded', detail: 'Phone screen recording uploaded for Nitin Kapoor', user: 'Tanya M.', time: '2 days ago' },
];

export const DEMO_REPORTING = {
  aging: [
    { name: 'Pooja Deshmukh', stage: 'Submitted', days: 6, alert: 'yellow' },
    { name: 'Nitin Kapoor', stage: 'L2 Interview', days: 9, alert: 'red' },
    { name: 'Anjali Rao', stage: 'Prospect', days: 3, alert: 'yellow' },
  ],
  submissions: [
    { jd: 'Senior Software Engineer', client: 'Horizon Tech', submitted: 4, l1: 3, l2: 1, selected: 1, filled: '1/3' },
    { jd: 'Full Stack Developer', client: 'NovaByte', submitted: 6, l1: 2, l2: 1, selected: 0, filled: '0/2' },
    { jd: 'DevOps Engineer', client: 'PeakLogic', submitted: 3, l1: 1, l2: 0, selected: 0, filled: '0/2' },
  ],
  hit_ratio: { submissions_to_l1: '62%', l1_to_l2: '45%', l2_to_selected: '33%', selected_to_joined: '80%' },
};

export const DEMO_SCREENING = {
  candidate: 'Ravi Thapar',
  jd: 'Senior Software Engineer',
  score: 87,
  recommendation: 'Shortlist',
  breakdown: [
    { dimension: 'Core Fit', score: 35, max: 40, color: '#ef4444', detail: 'Java (strong), Spring Boot (strong)' },
    { dimension: 'Primary Fit', score: 22, max: 25, color: '#3b82f6', detail: 'Microservices (strong), AWS (moderate), PostgreSQL (strong), REST APIs (strong)' },
    { dimension: 'Bonus Fit', score: 8, max: 10, color: '#10b981', detail: 'Kubernetes (moderate), Kafka (strong)' },
    { dimension: 'Experience Fit', score: 13, max: 15, color: '#8b5cf6', detail: '6 years total — within 4-8 year range' },
    { dimension: 'Overall Fit', score: 9, max: 10, color: '#d4af37', detail: 'Strong technical foundation, minor cloud gaps' },
  ],
};
