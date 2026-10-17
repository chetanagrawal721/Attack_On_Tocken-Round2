import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VIDEO_EVENTS, type VideoEventConfig } from '../../config/videoEvents';
import { startRingtone } from '../../fx/ringtone';
import { PlaneCrash } from './PlaneCrash';
import { rngInt } from '../../state/rng';
import { flags as urlFlags, speed } from '../../state/flags';
import { after, runTimeline } from '../../state/scheduler';
import { useStore } from '../../state/store';

/* ------------------------------------------------------------------ triggers */
export function startCall() {
  const s = useStore.getState();
  if (s.cinematic) return; // cinematic lock: no overlapping chaos
  if (s.callBlocked) { s.toast('Morgan has blocked this number.'); return; } // blocked only after the call happened in this visit
  s.setCinematic('call');
  s.toast('Opening mail…');
}
export function startCleanup() {
  const s = useStore.getState();
  if (s.cinematic) return;
  s.setCinematic('cleanup');
}

export function startIncident() {
  const s = useStore.getState();
  if (s.cinematic) return;
  s.setCinematic('incident');
}

let reshuffleBusy = false;
/** Harmless click -> the whole layout rearranges for a few seconds, then "was never changed". */
export function startReshuffle() {
  const s = useStore.getState();
  if (s.cinematic || reshuffleBusy || s.rearranged) return;
  reshuffleBusy = true;
  s.patch({ rearranged: true });
  s.toast('✦ Halo reorganized your profile for readability.', { halo: true });
  s.dispatch('reshuffle', { text: 'Halo reorganized your profile' }, 8);
  after(speed(4500), () => {
    useStore.getState().patch({ rearranged: false });
    useStore.getState().toast('✦ Halo restored your layout. It was never changed.', { halo: true });
    reshuffleBusy = false;
  });
}

const fmtClock = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

/* ------------------------------------------------------------ reusable video */
/** Reusable video event. Config-driven; never throws on a missing/broken file. */
export function VideoEvent({ config, muted, onDone, fallbackText }: { config: VideoEventConfig; muted: boolean; onDone: () => void; fallbackText?: [string, string] }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [fallback, setFallback] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;
  const finished = useRef(false);
  const end = () => { if (!finished.current) { finished.current = true; done.current(); } };

  useEffect(() => {
    const cancels: (() => void)[] = [after(config.maxDurationMs, end)];
    const v = ref.current;
    if (v) {
      v.muted = muted;
      const p = v.play();
      if (p) p.catch(() => { v.muted = true; v.play().catch(() => setFallback(true)); });
      cancels.push(after(3000, () => { if (v.readyState < 2) setFallback(true); })); // never-loads safety net
    }
    return () => cancels.forEach((c) => c());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fallback) return;
    return after(speed(config.fallbackMs), end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallback]);

  if (fallback) {
    return (
      <div className="fallback" data-testid="video-fallback">
        <div><div style={{ fontSize: 56 }}>📡</div><div style={{ fontSize: 22, fontWeight: 600 }}>{fallbackText?.[0] ?? 'Connection unstable…'}</div><div style={{ opacity: 0.7 }}>{fallbackText?.[1] ?? 'Reconnecting to Morgan'}</div></div>
      </div>
    );
  }
  return (
    <video ref={ref} data-testid="video-el" playsInline preload="auto" onEnded={end}>
      {config.sources.map((src, i) => (
        <source key={src.src} src={src.src} type={src.type} onError={i === config.sources.length - 1 ? () => setFallback(true) : undefined} />
      ))}
    </video>
  );
}

/* --------------------------------------------------------------- call event */
type CallPhase = 'ring' | 'declining' | 'live' | 'ended' | 'crash';

function CallCinematic() {
  const name = useStore((s) => s.profile.displayName);
  const [phase, setPhase] = useState<CallPhase>('ring');
  const [sheetIn, setSheetIn] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [secs, setSecs] = useState(0);
  const cfg = VIDEO_EVENTS.incomingCall as VideoEventConfig & { ringtone?: string };
  const muted = cfg.sound === 'never';
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const ring = useRef<{ stop: () => void } | null>(null);

  // Phone ringtone while the call sheet is up (Email click = user gesture, so audio is allowed)
  useEffect(() => {
    const r = startRingtone(cfg.ringtone);
    ring.current = r;
    void r.ok.then((ok) => { if (ok) setRinging(true); });
    return () => { r.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const c = after(speed(400), () => setSheetIn(true));
    return c;
  }, []);

  useEffect(() => {
    if (phase !== 'live') return;
    const id = window.setInterval(() => setSecs((x) => x + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const stopRing = () => { ring.current?.stop(); setRinging(false); };

  const answer = (decline: boolean) => {
    stopRing();
    if (decline) { setPhase('declining'); after(speed(600), () => setPhase('live')); } else setPhase('live');
  };

  // The video always plays to the very end (no skipping), then: plane crash -> back to the profile.
  const onVideoDone = () => {
    if (phaseRef.current !== 'live') return;
    setPhase('ended');
    after(speed(700), () => setPhase('crash'));
  };

  return (
    <div className="cine" data-testid="call-cinematic" data-phase={phase}>
      <AnimatePresence>
        {sheetIn && (phase === 'ring' || phase === 'declining') && (
          <motion.div
            className={`card callsheet${ringing ? ' ringing' : ''}`} data-testid="call-sheet" data-ring={ringing ? 'on' : 'off'}
            initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="ring"><img src="/media/avatar.svg" width="64" height="64" style={{ borderRadius: '50%' }} alt="" /></div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div className="muted" style={{ marginBottom: 14 }}>{phase === 'declining' ? 'Declining…' : '📞 Incoming video call…'}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn" data-testid="call-decline" disabled={phase === 'declining'} style={{ flex: 1, background: 'var(--danger)', color: '#fff', borderColor: 'var(--danger)' }} onClick={() => answer(true)}>Decline</button>
              <button className="btn" data-testid="call-accept" disabled={phase === 'declining'} style={{ flex: 1, background: 'var(--success)', color: '#fff', borderColor: 'var(--success)' }} onClick={() => answer(false)}>Accept</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === 'live' || phase === 'ended') && (
        <motion.div className="callfull" data-testid="call-full" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
          {phase === 'live' ? <VideoEvent config={cfg} muted={muted} onDone={onVideoDone} /> : <div className="fallback"><div style={{ fontSize: 26, fontWeight: 600 }}>Call ended</div></div>}
          <div className="timer num">{fmtClock(secs)}</div>
          <div className="nametag">{name}</div>
        </motion.div>
      )}

      {phase === 'crash' && <PlaneCrash onDone={finishCall} />}
    </div>
  );
}

function finishCall() {
  const s = useStore.getState();
  useStore.setState((st) => ({
    flags: { ...st.flags, videoSeen: true },
    messages: [...st.messages, { from: 'morgan', text: "please don't call me again" }],
    callBlocked: true,
    cinematic: null,
  }));
  s.dispatch('call', {}, 20);
  s.setTab('overview'); // back to the profile page
  window.scrollTo({ top: 0 });
}

/* ------------------------------------------------------------ tidy-up event */
/** "View all files": Halo declutters the profile Marie-Kondo style (no terminals, no security theater). */
function CleanupCinematic() {
  const files = useRef(useStore.getState().files.filter((f) => !f.lost)).current;
  const [struck, setStruck] = useState(0);
  const [cap, setCap] = useState<[string, string] | null>(null);
  const [panel, setPanel] = useState(true);
  const [fold, setFold] = useState(false);
  const [flash, setFlash] = useState(false);
  const [card, setCard] = useState(false);
  const startedAt = useRef(Date.now());
  const cancel = useRef<() => void>(() => {});
  const ended = useRef(false);
  const st = () => useStore.getState();

  const finalize = () => {
    if (ended.current) return;
    ended.current = true;
    const s = st();
    const candidates = s.files.filter((f) => !f.lost);
    const victim = candidates[rngInt(candidates.length)];
    useStore.setState((x) => ({
      unstyled: false, gravity: false, blackout: false, avatarGone: false,
      files: x.files.map((f) => (f.id === victim?.id ? { ...f, lost: true } : f)),
      settings: { ...x.settings, haloAgent: true },
      flags: { ...x.flags, attackSeen: true, forcedHalo: true },
      highlightHalo: true,
      cinematic: null,
    }));
    st().dispatch('cleanup', {}, 20);
    st().setTab('settings');
    window.scrollTo({ top: 0 });
  };

  const showRestore = () => {
    setPanel(false); setFold(false); setCap(null); setFlash(true); setCard(true);
    useStore.setState({ blackout: false, unstyled: false, gravity: false, avatarGone: false });
  };

  useEffect(() => {
    const steps = [
      { at: 700, run: () => st().toast('✦ Halo is decluttering your profile…', { halo: true }) },
      ...files.map((f, i) => ({ at: 1000 + i * 120, run: () => { setStruck(i + 1); setCap([f.title, 'No joy.']); } })),
      { at: 2600, run: () => { setCap(['profile-photo.jpg', 'No joy.']); useStore.setState({ avatarGone: true }); } },
      { at: 3600, run: () => { setCap(['The whole layout', 'No joy.']); setPanel(false); useStore.setState({ gravity: true }); } },
      { at: 5400, run: () => { setCap(null); setFold(true); } },
      { at: 7400, run: showRestore },
      { at: 9000, run: finalize },
    ];
    cancel.current = runTimeline(steps, urlFlags.fast ? 0.25 : 1);
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && Date.now() - startedAt.current > 1000 && !ended.current) {
        cancel.current();
        showRestore();
        after(700, finalize);
      }
    };
    window.addEventListener('keydown', k);
    return () => { cancel.current(); window.removeEventListener('keydown', k); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cine" style={{ pointerEvents: 'auto' }} data-testid="cleanup-cinematic">
      {panel && (
        <div className="card filepanel" data-testid="file-panel">
          <h3 style={{ margin: '0 0 8px' }}>Does this spark joy?</h3>
          {files.map((f, i) => (
            <div key={f.id} className={`file${i < struck ? ' struck' : ''}`}><span>{f.title}</span><span className="stamp">NO JOY</span><span className="muted">{f.size}</span></div>
          ))}
        </div>
      )}
      {cap && (
        <div className="card tidy-cap" data-testid="tidy-caption"><div className="q">{cap[0]}</div><div className="a">{cap[1]}</div></div>
      )}
      {fold && <div className="fold" data-testid="tidy-fold">Folding everything neatly…</div>}
      {flash && <div className="flash" />}
      {card && (
        <motion.div className="card restore" data-testid="system-restored" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="tick">✓</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '.02em' }}>TIDY COMPLETE</div>
          <div className="muted">Everything was put back. Mostly.</div>
        </motion.div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- A/B test event */
/** Skill chip: Halo "A/B tests" the profile. Same page, wildly different variants, then Variant A returns. */
const VARIANTS: [number, string, string][] = [
  [0, 'variant-b', 'Variant B of 7'],
  [2000, 'variant-c', 'Variant C of 7'],
  [3000, 'variant-d', 'Variant D of 7'],
];

function IncidentCinematic() {
  const [label, setLabel] = useState('Variant A of 7');
  const started = useRef(Date.now());
  const ended = useRef(false);
  const cancel = useRef<() => void>(() => {});
  const st = () => useStore.getState();
  const root = () => document.querySelector('[data-glitch]');
  const clearVariants = () => root()?.classList.remove('variant-b', 'variant-c', 'variant-d');

  const end = () => {
    if (ended.current) return;
    ended.current = true;
    cancel.current();
    clearVariants();
    useStore.setState({ override: {}, nameOverride: null, cinematic: null });
    st().dispatch('incident', { text: 'Halo ran an A/B test on your profile' }, 10);
    st().toast('✦ Variant A restored. Nothing was tested.', { halo: true });
  };

  useEffect(() => {
    const set = (o: Record<string, string>, n?: string | null) => useStore.setState((x) => ({ override: { ...x.override, ...o }, nameOverride: n === undefined ? x.nameOverride : n }));
    const variant = (cls: string, lab: string) => () => { clearVariants(); root()?.classList.add(cls); setLabel(lab); };
    const steps = [
      ...VARIANTS.map(([at, cls, lab]) => ({ at, run: variant(cls, lab) })),
      { at: 400, run: () => set({ headline: 'Part-time Wizard, Full-time Mess' }, 'Sir Morgan of Vale') },
      { at: 1200, run: () => set({ bio: 'I now work in cheese. This was a business decision.', location: 'Currently: somewhere warm' }) },
      { at: 2100, run: () => set({ 'skill.1': 'Cheese', 'skill.2': 'Vibes', 'skill.3': 'Moving things around', 'tab.activity': 'Gossip' }, 'Morgan (Beta)') },
      { at: 3100, run: () => set({ 'sec.bio': 'Origin story', 'sec.experience': 'Past lives', 'stat.views': 'Eyes' }, 'MORGAN!!!') },
      { at: 4300, run: () => { clearVariants(); setLabel('Variant A (restoring)'); } },
      { at: 5400, run: end },
    ];
    cancel.current = runTimeline(steps, urlFlags.fast ? 0.25 : 1);
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && Date.now() - started.current > 1000) end(); };
    window.addEventListener('keydown', k);
    return () => { cancel.current(); window.removeEventListener('keydown', k); clearVariants(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cine" style={{ pointerEvents: 'auto' }} data-testid="incident-cinematic">
      <div className="abcard" data-testid="incident-card">
        <div className="t">✦ Halo is A/B testing your profile</div>
        <div className="s" data-testid="incident-variant">{label}</div>
        <div className="p"><i /></div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- host */
export function CinematicHost() {
  const c = useStore((s) => s.cinematic);
  return (
    <>
      {c === 'call' && <CallCinematic />}
      {c === 'cleanup' && <CleanupCinematic />}
      {c === 'incident' && <IncidentCinematic />}
    </>
  );
}
