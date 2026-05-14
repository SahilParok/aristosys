# Aristosys Demo — Walkthrough Cheat Sheet

> Open this on a second monitor (or print it). Use it as a narration guide while you share your screen on Zoom. Don't read it verbatim — these are just prompts so you don't lose your place.

---

## OPEN — before clicking anything

**Frame it in one sentence:**
> "What I'm going to show you is the same product our recruiting team uses every day, but with fake data — names, scores, JDs, candidates are all made up so we don't show real client info. The functionality is identical to the real app."

**Then say WHY they should care** (pick whichever fits the conversation):
- "The big thing this saves is recruiter time on screening — a stack of 50 resumes becomes a ranked shortlist with reasoning, in under an hour."
- "Everything is auditable — every click, every assignment, every stage change is logged with timestamps. That matters when you're answering client questions about a placement."

---

## 1. DASHBOARD

**What this page is:**
> "This is the home view when a recruiter logs in. Top-level stats, candidates needing attention, recent activity."

**One mechanic line:**
> "The 'Candidates Needing Attention' box is automatically generated — anyone sitting in a stage too long shows up here. Click View and it takes you straight to that candidate."

**Demo move:** Click View on **Pooja Deshmukh** (Submitted to Client, 6 days) → lands on the JD with her row highlighted.

**Thing to emphasize:**
> "This is the 'don't drop the ball' surface. Recruiters work the pipeline, this tells them where they're falling behind."

---

## 2. JOBS (the main work area)

**What this page is:**
> "This is where 80% of the recruiter's day happens. Left side lists JDs. Click one and you get the candidate pipeline for that JD."

**Click Senior Software Engineer @ Horizon Tech.** Show:
- The metadata pills: Recruiter, Manager, # Positions, Client Manager
- Candidates table with scores, AI scores, aging, stage

**One mechanic line — POINT AT THE SCORE COLUMN:**
> "Every candidate gets a 0–100 score against this JD. Let me show you how it's calculated."

**Click 'Rpt' on Ravi Thapar (87/100)** → full breakdown opens.

**Walk through the scoring rubric on screen:**
- **Core Fit (out of 40):** must-have skills — Java, Spring Boot
- **Primary Fit (out of 25):** nice-to-have — Microservices, AWS, PostgreSQL, REST APIs
- **Bonus Fit (out of 10):** bonus — Kubernetes, Kafka
- **Experience Fit (out of 15):** does their YOE match the role
- **Overall Fit (out of 10):** subjective summary judgement

> "We send the resume text and the JD to Claude, ask it to score each dimension with reasoning, and it returns this report. Not a black box — every number is justified by the text below it."

**Show other working features:**
- **Sort columns:** click "Score" header — sorts asc/desc. Same for every column.
- **Edit JD button:** opens the same edit form the real product uses, populated with this JD's data. In production, every field is editable and re-saving triggers AI re-analysis. Here it's read-only.
- **Screen More button:** routes you to the screening flow with this JD pre-loaded — saves the recruiter from re-selecting client + JD.
- **AI Interview button:** in production sends the candidate a link to an AI voice interview (we'll demo that in a sec).

**Thing to emphasize:**
> "This single screen is what saves the most recruiter time. Instead of reading 50 resumes, they read this list of 6, focus on the top 3, ignore the bottom."

---

## 3. SCREEN (the screening flow)

**What this page is:**
> "This is the entry point for new resumes — select client, select JD, drop a stack of resumes, get back scored shortlist."

**One mechanic line:**
> "Same scoring engine as on the Jobs page. You can drop 50 resumes at once — it processes them in parallel and writes them all into the JD's candidate pipeline."

**Thing to emphasize:**
> "This is the 'firehose' entry. Recruiters source resumes from Naukri, LinkedIn, email — drop them all here, get a ranked list back."

---

## 4. INTERVIEWS — THE LIVE DEMO

**What this page is:**
> "This is our AI screening interviewer. Before a candidate goes to a human, we want a 5-minute voice screen to validate they actually know what their resume says."

**Setup:**
> "Let me actually run one for you. I'll click Start, the AI will greet me and ask a question. I'll answer like a candidate would. It listens, transcribes, and follows up based on my answer."

**Click Start Interview.** Allow mic.

**Strategy for your answer to question 1:**
- Give a SHORT answer the first time — like 10 words. Watch the AI push for more detail.
- Then give a real-sounding answer to its follow-up.

**One mechanic line (after the interview):**
> "Behind the scenes: your voice → Deepgram for transcription → Claude reads the conversation and decides the next question → ElevenLabs speaks it back. Same loop until the interview ends."

**Thing to emphasize:**
> "For a staffing agency this is the difference between submitting a candidate cold versus submitting one we've verified speaks coherently about their own work. Saves your client's time, saves placement risk."

**If something goes wrong (mic glitch, AI weird):**
- "This is running on a live demo, sometimes the network is weird. The real production version runs much more reliably."
- Reset by clicking "Try Again" and skipping the live part — just describe what it does.

---

## 5. CLIENTS

**What this page is:**
> "Directory of client companies. Each has its own client managers, JDs, candidate count, evaluation preferences."

**Thing to emphasize:**
> "Nothing fancy here — it's the rolodex. The important thing is every JD and candidate is scoped to a client, so you can ask 'show me everything for Horizon Tech' in one click."

---

## 6. INTERNAL TEAM (was 'Team')

**What this page is:**
> "Three sub-tabs: Recruiters, Managers, Internal Panel. Where we track who's on the team."

**Click Recruiters tab. Show:**
- Each recruiter has X candidates / X active JDs / X deficit (red pill)
- Expand a recruiter — shows their assigned JDs with Critical / Difficult toggles

**One mechanic line:**
> "Deficit means: this JD has open positions but no candidates currently in the pipeline. The system flags it as 'needs sourcing' attention. Critical and Difficult are flags the manager can set per JD to prioritize."

**Thing to emphasize:**
> "This page is the manager's view of 'who's drowning and who has capacity.' Auto-assignment uses these numbers — when a new JD comes in, the system picks the recruiter with the lowest active workload."

---

## 7. REPORTING — 4 reports

**What this page is:**
> "Four operational reports. Aging tells you stuck candidates. Fill Rate tells you which JDs are short. Missing Audio Scores flags candidates who haven't been screened. Hit Ratio shows your conversion funnel."

### Candidate Aging
> "How long each candidate has been in their current stage. Color-coded green / yellow / red. Filter by client, recruiter, stage."

### Fill Rate
> "Per JD: how many positions, how many active candidates, how filled, how much deficit. Critical JDs flagged with the orange bar. Multi-select filters by recruiter, manager, client."

### Missing Audio Scores
> "Candidates submitted to client without an AI audio screen. Audio acts as a second signal beyond resume — this report makes sure nobody slips through without that check."

### Hit Ratio
> "Conversion funnel for CLOSED JDs only — how many submissions per L1 interview, L1 per L2, etc. The lower the ratio, the more efficient your team. Also shows average TAT."

**One mechanic line:**
> "Every column is sortable, every filter is multi-select. Recruiters use these reports to plan their week."

**Thing to emphasize:**
> "These are the metrics your operations head probably tracks in spreadsheets right now. We just generate them live from the same data."

---

## 8. AUDIT LOG

**What this page is:**
> "Full action history. Every JD created, recruiter assigned, candidate moved, AI interview completed — logged with user + timestamp."

**Filter by Client / JD / Person / Status.**

**One mechanic line:**
> "When a client asks 'what happened with this candidate?' you can pull up the exact sequence of events here in seconds."

**Thing to emphasize:**
> "Compliance, dispute resolution, and operational debugging all live here. Especially important if you have multiple recruiters touching the same client account."

---

## CLOSING

**Frame the value once more:**
> "The big things: scored shortlists save recruiter time. AI audio interviews validate candidates before they go to the client. Audit trail and reporting give you operational visibility. All wrapped in one product that your recruiters live inside all day."

**Ask, don't pitch:**
> "What's the biggest pain point your recruiting team has right now? Time per JD? Quality of shortlists? Client communication? I'd love to know where this would actually help."

**Soft close:**
> "Happy to set up a follow-up where we look at your actual workflow and see what would map. No pressure today — this was mostly to show what's possible."

---

## IF THEY ASK SPECIFIC QUESTIONS

**"Who built this?"**
> "I built it solo, top to bottom. Frontend, backend, AI integration, infrastructure. Took about a year."

**"How does the AI work / what model?"**
> "Claude from Anthropic for the scoring and the interviewer. Deepgram for speech-to-text. ElevenLabs for text-to-speech."

**"What about data privacy?"**
> "All data lives in your own Postgres instance (we use Supabase). Resumes are stored in private storage with row-level security. AI calls send the resume text + JD to Anthropic for analysis — Anthropic doesn't train on that data per their enterprise terms."

**"How long to onboard?"**
> "Couple days to set up clients and JDs. Recruiters can start screening immediately."

**"Pricing?"**
> "Let's chat about that based on team size and volume after you've decided whether the product fits."

---

## ABOUT THE TRAINING OPPORTUNITY (his other email)

If he brings up training corporates on AI / Claude:

> "Yes — happy to discuss. Depends on the scope (audience seniority, format, topics). Could be intro Claude/AI workshops for non-technical teams, prompt engineering for product/ops folks, or hands-on building of small internal AI tools. Tell me more about what kind of audiences you're thinking about."

Don't commit specifics on the call — get more details first.
