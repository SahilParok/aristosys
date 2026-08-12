'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import DemoNav from '@/components/DemoNav';

interface Message { role: 'user' | 'assistant'; content: string; }

type InterviewState = 'idle' | 'starting' | 'ai_speaking' | 'listening' | 'processing' | 'ended';

export default function InterviewsPage() {
  const [state, setState] = useState<InterviewState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState<{ who: string; text: string }[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [error, setError] = useState('');
  const [micAllowed, setMicAllowed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Keep ref in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcript]);

  // Speak text via ElevenLabs
  const speak = useCallback(async (text: string): Promise<void> => {
    setState('ai_speaking');
    setCurrentText(text);
    try {
      const res = await fetch('/api/interview-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      return new Promise((resolve) => {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(url); setCurrentText(''); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); setCurrentText(''); resolve(); };
        audio.play().catch(() => resolve());
      });
    } catch {
      setCurrentText('');
    }
  }, []);

  // Get AI response
  const getAIResponse = useCallback(async (msgs: Message[]): Promise<string> => {
    setState('processing');
    const res = await fetch('/api/interview-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs }),
    });
    if (!res.ok) throw new Error('Chat failed');
    const data = await res.json();
    return data.text;
  }, []);

  // Listen for user speech — Deepgram STT with voice activity detection via Web Audio API
  const listenForSpeech = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setState('listening');
      setCurrentText('Listening...');

      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        // Voice activity detection using AnalyserNode
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        let speechDetected = false;
        let silenceStart = 0;
        const SILENCE_THRESHOLD = 25; // Volume level below this = silence (filters background noise)
        const SILENCE_DURATION = 5000; // 5 seconds of silence after speech = done
        let vadInterval: ReturnType<typeof setInterval>;

        vadInterval = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;

          if (avg > SILENCE_THRESHOLD) {
            // Speech detected
            speechDetected = true;
            silenceStart = 0;
            setCurrentText('Listening... 🎤');
          } else if (speechDetected) {
            // Silence after speech
            if (silenceStart === 0) silenceStart = Date.now();
            const silentFor = Date.now() - silenceStart;
            const remaining = Math.ceil((SILENCE_DURATION - silentFor) / 1000);
            if (remaining > 0 && remaining <= 3) {
              setCurrentText(`Finishing in ${remaining}s...`);
            }
            if (silentFor >= SILENCE_DURATION) {
              // Done — stop recording
              clearInterval(vadInterval);
              if (recorder.state === 'recording') recorder.stop();
            }
          }
        }, 100);

        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.onstop = async () => {
          clearInterval(vadInterval);
          audioCtx.close();
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

          if (!speechDetected || blob.size < 1000) {
            // No real speech detected
            resolve('');
            return;
          }

          setState('processing');
          setCurrentText('Transcribing...');
          try {
            const res = await fetch('/api/interview-stt', { method: 'POST', body: blob });
            const data = await res.json();
            resolve(data.transcript || '');
          } catch { resolve(''); }
        };

        recorder.start(250); // Collect in 250ms chunks for smoother recording
        // Safety max: 90 seconds
        setTimeout(() => {
          clearInterval(vadInterval);
          if (recorder.state === 'recording') recorder.stop();
        }, 90000);
      }).catch(() => resolve(''));
    });
  }, []);

  // Stop listening (for manual stop button)
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') { mediaRecorderRef.current.stop(); }
  }, []);

  // Main interview loop
  const startInterview = useCallback(async () => {
    setError('');
    setState('starting');
    setMessages([]);
    setTranscript([]);

    // Request mic permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicAllowed(true);
    } catch {
      setError('Microphone access is required for the demo interview. Please allow microphone access and try again.');
      setState('idle');
      return;
    }

    // Kick off conversation — AI speaks first
    const initMsgs: Message[] = [{ role: 'user', content: 'The interview is starting now. Please greet the candidate and begin.' }];
    try {
      const greeting = await getAIResponse(initMsgs);
      const newMsgs: Message[] = [...initMsgs, { role: 'assistant', content: greeting }];
      setMessages(newMsgs);
      setTranscript([{ who: 'AI Interviewer', text: greeting }]);
      await speak(greeting);

      // Interview loop
      let currentMsgs = newMsgs;
      let turns = 0;
      const maxTurns = 12; // Safety limit

      while (turns < maxTurns) {
        // Listen for candidate
        const userText = await listenForSpeech();
        if (!userText) {
          // If empty, prompt them
          const nudge = "I didn't catch that. Could you please repeat?";
          setTranscript(prev => [...prev, { who: 'AI Interviewer', text: nudge }]);
          currentMsgs = [...currentMsgs, { role: 'assistant', content: nudge }];
          setMessages(currentMsgs);
          await speak(nudge);
          continue;
        }

        setTranscript(prev => [...prev, { who: 'Candidate', text: userText }]);
        currentMsgs = [...currentMsgs, { role: 'user', content: userText }];
        setMessages(currentMsgs);

        // Get AI response
        const aiText = await getAIResponse(currentMsgs);
        currentMsgs = [...currentMsgs, { role: 'assistant', content: aiText }];
        setMessages(currentMsgs);
        setTranscript(prev => [...prev, { who: 'AI Interviewer', text: aiText }]);
        await speak(aiText);

        turns++;

        // Check if interview ended (AI said goodbye)
        const lower = aiText.toLowerCase();
        if (lower.includes('good luck') || lower.includes('have a great day') || lower.includes('all the best') || lower.includes('concludes our interview') || lower.includes('that wraps up')) {
          break;
        }
      }

      setState('ended');
    } catch (e) {
      console.error('Interview error:', e);
      setError('Something went wrong. Please check your API keys in .env.local and try again.');
      setState('idle');
    }
  }, [getAIResponse, speak, listenForSpeech]);

  const stateColors: Record<InterviewState, string> = {
    idle: '#6b7280', starting: '#f59e0b', ai_speaking: '#8b5cf6', listening: '#10b981', processing: '#3b82f6', ended: '#6b7280',
  };
  const stateLabels: Record<InterviewState, string> = {
    idle: 'Ready', starting: 'Starting...', ai_speaking: 'AI Speaking', listening: 'Listening...', processing: 'Processing...', ended: 'Interview Complete',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <DemoNav />
      <main className="int-main" style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>🎙️ AI Interview Demo</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Try a live AI voice interview — Senior Software Engineer position</p>
        </div>

        {/* Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: stateColors[state], boxShadow: state === 'listening' ? '0 0 12px #10b981' : state === 'ai_speaking' ? '0 0 12px #8b5cf6' : 'none', animation: (state === 'listening' || state === 'ai_speaking') ? 'pulse 1.5s infinite' : 'none' }} />
          <span style={{ color: stateColors[state], fontSize: '14px', fontWeight: '600' }}>{stateLabels[state]}</span>
          <div style={{ flex: 1 }} />
          {state === 'idle' && (
            <button onClick={startInterview} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Start Interview</button>
          )}
          {state === 'listening' && (
            <button onClick={stopListening} style={{ padding: '10px 24px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', color: '#ef4444', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Done Speaking</button>
          )}
          {state === 'ended' && (
            <button onClick={() => { setState('idle'); setTranscript([]); setMessages([]); }} style={{ padding: '10px 24px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Try Again</button>
          )}
        </div>

        {error && (
          <div style={{ padding: '14px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', marginBottom: '20px', color: '#ef4444', fontSize: '13px' }}>{error}</div>
        )}

        {/* Current Speech Display */}
        {currentText && (
          <div style={{ padding: '16px 20px', background: state === 'ai_speaking' ? 'rgba(139,92,246,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${state === 'ai_speaking' ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: state === 'ai_speaking' ? '#a78bfa' : '#10b981', marginBottom: '6px' }}>{state === 'ai_speaking' ? 'AI INTERVIEWER' : 'YOU'}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: '1.6' }}>{currentText}</div>
          </div>
        )}

        {/* How It Works — shown when idle */}
        {state === 'idle' && transcript.length === 0 && (
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '20px' }}>
            <h2 style={{ color: '#d4af37', fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>How It Works</h2>
            <div className="int-how" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              {[
                { icon: '🎙️', title: 'You Speak', desc: 'Answer questions using your microphone' },
                { icon: '🤖', title: 'AI Listens & Responds', desc: 'Claude processes your answer, ElevenLabs speaks back' },
                { icon: '📝', title: 'Full Transcript', desc: 'Complete conversation captured in real time' },
              ].map(s => (
                <div key={s.title} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ color: 'white', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              Tech: Claude for conversation · ElevenLabs for voice synthesis · Deepgram Nova-2 for speech-to-text · Voice activity detection for noise filtering
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0 }}>Transcript</h3>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Senior Software Engineer</span>
            </div>
            <div ref={transcriptRef} style={{ padding: '16px', maxHeight: '400px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transcript.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: t.who === 'AI Interviewer' ? 'rgba(139,92,246,0.06)' : 'rgba(59,130,246,0.06)', border: `1px solid ${t.who === 'AI Interviewer' ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)'}` }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: t.who === 'AI Interviewer' ? '#a78bfa' : '#60a5fa', whiteSpace: 'nowrap', marginTop: '2px' }}>{t.who === 'AI Interviewer' ? 'AI' : 'You'}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scores — shown when ended */}
        {state === 'ended' && (
          <div className="int-scores" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '20px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Technical Score</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>{Math.floor(Math.random() * 15) + 72}</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Communication Score</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#3b82f6' }}>{Math.floor(Math.random() * 15) + 70}</div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 640px) {
          .int-main { padding: 16px !important; }
          .int-how { grid-template-columns: 1fr !important; }
          .int-scores { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
