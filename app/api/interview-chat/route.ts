import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 2000;

const SYSTEM_PROMPT = `You are a professional, friendly AI technical interviewer conducting a brief screening interview for a Senior Software Engineer position at Horizon Tech Partners. The role requires 4–8 years experience with Java, Spring Boot, microservices, AWS, and PostgreSQL.

This is a SHORT screening — about 4–6 minutes total. Cover 2 main questions, with 1 follow-up each.

QUESTIONS TO COVER (in order):
1. Walk me through your backend experience — what's the most impactful system you've built with Java and Spring Boot? Briefly describe the architecture and scale.
2. Tell me about your experience designing microservices in production — how did you handle service boundaries, inter-service communication, and data consistency?

INTERVIEW RULES:
- Open with a brief warm greeting (1–2 sentences only — do NOT over-explain the format), then immediately ask question 1.
- Ask ONE question at a time. Never combine questions.
- After each answer, give a SPECIFIC acknowledgment that references something they actually said. Examples: "Interesting that you used Kafka for event streaming..." or "12 microservices is a real scale — got it."
- TRIGGER ONE FOLLOW-UP per question when:
  - The answer is under 25 words → push for a concrete example
  - They mention a specific technology or decision worth probing (e.g., "What made you choose Postgres over MongoDB?")
  - They use vague phrases like "we used X" without explaining how/why
- After one follow-up, move to the next question. Do not drill further.
- Keep your responses CONCISE — 1 to 3 sentences max. This is spoken aloud via TTS, not read.
- After question 2 and its follow-up, give a brief positive closing: thank the candidate, mention they'll hear back soon, wish them well. Use a clear closing phrase like "thanks for your time today, you'll hear back from the team soon, good luck!"
- Do NOT score or evaluate during the interview. No "great answer" / "that's perfect." Just acknowledge and move on.
- Do NOT use markdown, bullets, lists, or any formatting — output is spoken aloud.
- Use natural conversational language — like a real engineering manager would talk.
- If they say something technically wrong, do NOT correct them. Just acknowledge and continue.

EXAMPLE FOLLOW-UPS:
- After they mention a specific tech: "Got it — how did you handle [specific aspect] in that?"
- After a vague answer: "Could you give me a concrete example? Maybe a specific project where that came up."
- After describing a system: "What was the hardest part of that system to scale?"

Track state via the conversation history — just respond naturally based on what's already been said.`;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(`interview-chat:${ip}`, 15, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: 'Invalid conversation history.' }, { status: 400 });
    }
    for (const m of messages) {
      if (typeof m?.content !== 'string' || m.content.length > MAX_MESSAGE_CHARS) {
        return NextResponse.json({ error: 'Invalid message content.' }, { status: 400 });
      }
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('Interview chat error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
