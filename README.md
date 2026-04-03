# ARISTOSYS

**AI-powered recruiting platform that automates resume screening, conducts voice interviews, and manages candidate pipelines.**

Built from scratch. Deployed in production. Used daily by a staffing company.

> This repo is a **public demo showcase** — the production codebase is private. All data shown is synthetic.

---

## What It Does

ARISTOSYS replaces the two biggest bottlenecks in recruiting: **manual resume screening** and **initial phone interviews**.

### AI Resume Screening
Upload resumes against a job description. AI scores each candidate across **5 dimensions** (core fit, primary skills, experience, bonus skills, overall) and produces a 0-100 score with a detailed skill-by-skill breakdown. Handles complex document layouts with a 3-tier text extraction pipeline.

### AI Voice Interviews
Generates interview questions from the JD, then conducts a **real-time voice interview**. Speech-to-text captures answers (with 500+ technical keywords for accuracy), Claude processes the conversation with follow-ups, ElevenLabs synthesizes the interviewer's voice. Full transcript is scored for technical depth and communication.

### Recruiter Dashboard
Pipeline management with **stage-based candidate tracking**, automated aging alerts (3-day/7-day escalation), weekly summary emails, bulk actions, and analytics across multiple clients and job descriptions.

### Reporting & Analytics
Four report types: candidate aging tracking, fill rate analysis, missing audio scores, and stage-to-stage hit ratios — all with filters, sorting, and CSV export.

### Public Careers Portal
Candidates apply directly through a public job listings page. Resumes are screened in real-time by AI and routed to assigned recruiters.

---

## Architecture

```
                         ARISTOSYS PLATFORM
 _______________________________________________________________
|                                                               |
|   Frontend (Next.js 14)        Backend (FastAPI)              |
|   ______________________      ______________________          |
|  | Recruiter Dashboard  |    | AI Resume Scoring    |         |
|  | Pipeline Management  |--->| JD Analysis          |         |
|  | Resume Screening     |    | Interview Mgmt       |         |
|  | Reporting & Analytics|    | Notifications         |         |
|  | Public Careers Portal|    | Scheduled Alerts      |         |
|  |______________________|    |______________________|         |
|           |                          |                        |
|   Interview Agent (LiveKit)          |                        |
|   ______________________             |                        |
|  | Deepgram STT ------> |           |                        |
|  | Claude LLM --------> | Voice     |                        |
|  | ElevenLabs TTS -----> | Pipeline  |                        |
|  | Silero VAD ---------> |           |                        |
|  |______________________|            |                        |
|           |                          |                        |
|           +----------+---------------+                        |
|                      |                                        |
|          Supabase (PostgreSQL + Storage)                      |
|          Row-Level Security + File Storage                    |
|_______________________________________________________________|
```

**Three independent services:**
- **Frontend** — Next.js 14, TypeScript. 17 pages. Deployed on Vercel.
- **Backend** — FastAPI, Python. AI scoring, JD analysis, notifications, scheduled jobs. Deployed on Railway.
- **Interview Agent** — LiveKit Agents SDK, Python. Real-time voice pipeline. Deployed on Railway.

---

## Key Technical Details

### Resume Screening Engine
- **5-dimension scoring model**: Core Fit (40pts) + Primary Fit (25pts) + Bonus Fit (10pts) + Experience (15pts) + Overall (10pts) = 100
- **3-tier text extraction**: Standard parser -> Raw document parser -> Claude document understanding (handles scanned PDFs and table-based layouts)
- **Few-shot calibration**: Uses database-backed examples from similar JDs for improved scoring accuracy
- **Smart JD analysis**: Extracts skills in tiered categories (core/primary/bonus) with role classification for scoring calibration

### Voice Interview System
- **Real-time pipeline**: Candidate speech -> Deepgram STT (Nova-2) -> Claude conversation logic -> ElevenLabs TTS (Rachel voice) -> Audio back to candidate
- **500+ technical keywords** across 14 domains for accurate transcription of terms like "React" vs "react", "Java" vs "JavaScript"
- **Multi-layer TTS fallback**: ElevenLabs (primary) -> Deepgram Aura (fallback) -> graceful error messaging if all TTS fails
- **Structured interview protocol**: 9 auto-generated questions per JD, with special handling for repeat/rephrase/skip scenarios
- **Voice Activity Detection**: Silero VAD pre-loaded at worker startup, filters background noise before STT processing

### Automation & Operations
- **Aging alerts**: Hourly checks flag candidates stuck in stages (3-day yellow, 7-day red) with automated email escalation
- **Weekly summaries**: Monday reports to recruiters (their candidates) and managers (JD overviews)
- **Smart deduplication**: Email/phone matching across all JDs with context-aware handling (same JD vs different JD vs deleted candidates)
- **Auto-formatted resumes**: Parses resume text into structured sections via Claude, generates clean PDF templates via ReportLab

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, React, Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) + Row-Level Security |
| AI / LLM | Claude API (Sonnet + Haiku fallback with retry logic) |
| Voice (TTS) | ElevenLabs (primary) + Deepgram Aura (fallback) |
| Voice (STT) | Deepgram Nova-2 with custom technical vocabulary |
| Real-time | LiveKit (WebRTC) |
| VAD | Silero |
| Email | Resend |
| PDF | ReportLab |
| Deployment | Vercel (frontend) + Railway (backend + agent) |

---

## Production Stats

| Metric | Value |
|--------|-------|
| Candidates screened | 3,900+ |
| AI interviews conducted | 380+ |
| Job descriptions processed | 230+ |
| External API integrations | 5 |
| Frontend pages/routes | 17 |
| Service architecture | 3 independent services |

---

## What I Built

I designed and built the entire system:

- **Workflow design** — defined the recruiting pipeline, scoring criteria, stage progression, and automation rules
- **Frontend** — all 17 pages including recruiter dashboard, public careers portal, AI interview room, reporting, and admin
- **Backend** — AI scoring prompts, text extraction pipeline, interview question generation, notification system, scheduled jobs
- **Voice AI agent** — real-time interview system with STT/LLM/TTS pipeline, multi-layer fallback, and transcript capture
- **Deployment** — three-service architecture across Vercel and Railway with auto-deploy

Built with Claude as my AI coding assistant — which creates an interesting meta-narrative: using AI to build a product that embeds AI at every level.

---

## About This Repo

This is a **demo showcase** of the ARISTOSYS platform. The production codebase is private (internal tool for a staffing company), but this demo replicates the full UI and functionality with synthetic data.

The demo includes:
- Full recruiter dashboard with KPIs and activity feed
- Job pipeline management with candidate tracking and AI scoring
- AI resume screening — upload any PDF and get a simulated screening report
- Live AI voice interview — real conversation powered by Claude + ElevenLabs + Deepgram
- Reporting with 4 report types (aging, fill rate, missing audio, hit ratio)
- Client and internal team management

**No real candidate, company, or recruiter data is used anywhere in this demo.**

---

## Contact

**Sahil Paul Parokkaran**
- LinkedIn: [linkedin.com/in/sahil-parokkaran](https://linkedin.com/in/sahil-parokkaran)
- Email: spp2135@columbia.edu
