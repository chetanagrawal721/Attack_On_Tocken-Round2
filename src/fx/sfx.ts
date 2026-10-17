import { SOUNDS, type SoundName } from '../config/sounds';

/** Every sound that started, for tests / debugging: window.__sfx */
export const sfxLog: { name: SoundName; mode: 'file' | 'synth' }[] = [];
if (typeof window !== 'undefined') (window as any).__sfx = sfxLog;

export interface SoundHandle {
  stop: () => void;
  fadeOut: (ms?: number) => void;
  setVolume: (v: number) => void;
}

/* ------------------------------------------------------------ file analysis */
export interface SoundInfo { duration: number; onset: number; peak: number }
const infoPromise = new Map<SoundName, Promise<SoundInfo | null>>();
const infoDone = new Map<SoundName, SoundInfo | null>();
const warm = new Map<SoundName, HTMLAudioElement>();

/** Decodes the file once to learn its length and where the first audible sample is (null if missing/undecodable). */
export function soundInfo(name: SoundName): Promise<SoundInfo | null> {
  let p = infoPromise.get(name);
  if (!p) {
    p = (async () => {
      try {
        const res = await fetch(SOUNDS[name].src);
        if (!res.ok || !(res.headers.get('content-type') || '').startsWith('audio')) return null;
        const buf = await res.arrayBuffer();
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AC();
        const ab = await ctx.decodeAudioData(buf);
        void ctx.close().catch(() => {});
        const d = ab.getChannelData(0);
        let onset = 0;
        for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > 0.04) { onset = i / ab.sampleRate; break; }
        // loudest 50 ms window = the "impact" of the sound
        const win = Math.floor(ab.sampleRate * 0.05);
        let best = 0, bestAt = 0;
        for (let i = 0; i + win < d.length; i += win) {
          let sum = 0;
          for (let j = 0; j < win; j++) sum += d[i + j] * d[i + j];
          if (sum > best) { best = sum; bestAt = i; }
        }
        return { duration: ab.duration, onset, peak: bestAt / ab.sampleRate };
      } catch {
        return null;
      }
    })().then((v) => { infoDone.set(name, v); return v; });
    infoPromise.set(name, p);
  }
  return p;
}

/** Warm the cache so the first play has no delay and its timing is known. */
export function preloadSounds(...names: SoundName[]) {
  for (const n of names) {
    void soundInfo(n);
    if (!warm.has(n)) {
      try { const a = new Audio(SOUNDS[n].src); a.preload = 'auto'; a.load(); warm.set(n, a); } catch { /* ignore */ }
    }
  }
}

/** Length of the sound in ms if its file is known/decoded, otherwise the fallback. */
export function soundDurationMs(name: SoundName, fallback: number): number {
  const i = infoDone.get(name);
  return i ? Math.round(i.duration * 1000) : fallback;
}

/* ----------------------------------------------------------------- synthesis */
function newCtx(): AudioContext | null {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    const ctx: AudioContext = new AC();
    void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function synthSiren(master: GainNode, ctx: AudioContext) {
  const o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.value = 760;
  const g = ctx.createGain();
  g.gain.value = 0.35;
  o.connect(g).connect(master);
  o.start();
  let hi = false;
  const id = window.setInterval(() => {
    hi = !hi;
    o.frequency.setTargetAtTime(hi ? 980 : 700, ctx.currentTime, 0.06);
  }, 420);
  return () => { window.clearInterval(id); try { o.stop(); } catch { /* ignore */ } };
}

function synthGunshot(master: GainNode, ctx: AudioContext) {
  const len = Math.floor(ctx.sampleRate * 0.45);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07));
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(5000, ctx.currentTime);
  lp.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.35);
  noise.connect(lp).connect(master);
  noise.start();
  const thump = ctx.createOscillator();
  thump.frequency.setValueAtTime(150, ctx.currentTime);
  thump.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);
  const tg = ctx.createGain();
  tg.gain.setValueAtTime(0.9, ctx.currentTime);
  tg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  thump.connect(tg).connect(master);
  thump.start();
  thump.stop(ctx.currentTime + 0.25);
  return () => {};
}

/* ------------------------------------------------------------------- playback */
const live = new Map<SoundName, SoundHandle>();

export interface PlayOptions {
  /**
   * Make the first audible sample land this many ms after the call (e.g. the muzzle flash).
   * Uses the file's real onset, so silence at the start of a file never causes a mismatch.
   */
  alignMs?: number;
  /**
   * Make the LOUDEST moment of the file (the impact) land this many ms after the call. The file is
   * started early or seeked forward as needed, so a long build-up never ends up out of sync.
   */
  alignPeakMs?: number;
}

/**
 * Plays a configured sound (file first, synthesized fallback). One instance per name: playing a name
 * again replaces the previous one, so sounds can never stack or get stuck. Start from a click handler.
 */
export function playSound(name: SoundName, opts: PlayOptions = {}): SoundHandle {
  live.get(name)?.stop();
  const cfg = SOUNDS[name];
  let stopped = false;
  let vol: number = cfg.volume;
  let stopImpl: () => void = () => {};
  let volImpl: (v: number) => void = () => {};
  let timer = 0;
  let fadeTimer = 0;

  const synth = () => {
    if (stopped) return;
    const ctx = newCtx();
    if (!ctx) return;
    const base = cfg.synth === 'gunshot' ? 0.9 : 0.12;
    const master = ctx.createGain();
    master.gain.value = Math.min(1, vol) * base;
    master.connect(ctx.destination);
    const stopSynth = cfg.synth === 'gunshot' ? synthGunshot(master, ctx) : synthSiren(master, ctx);
    volImpl = (v) => { master.gain.value = Math.min(1, v) * base; };
    stopImpl = () => { stopSynth(); try { if (ctx.state !== 'closed') void ctx.close().catch(() => {}); } catch { /* ignore */ } };
    if (cfg.synth === 'gunshot') timer = window.setTimeout(() => stopImpl(), 1500);
    sfxLog.push({ name, mode: 'synth' });
  };

  const startFile = (seekS: number) => {
    if (stopped) return;
    try {
      const w = warm.get(name);
      const a = (w ? (w.cloneNode(true) as HTMLAudioElement) : new Audio(cfg.src));
      a.loop = cfg.loop;
      a.volume = Math.min(1, vol);
      if (seekS > 0) a.currentTime = seekS;
      let fellBack = false;
      const fallback = () => { if (!fellBack && !stopped) { fellBack = true; synth(); } };
      a.onerror = fallback;
      const p = a.play();
      stopImpl = () => { a.onerror = null; a.pause(); };
      volImpl = (v) => { a.volume = Math.min(1, v); };
      if (p) {
        p.then(() => { if (!fellBack && !stopped) sfxLog.push({ name, mode: 'file' }); }).catch(fallback);
      }
    } catch {
      synth();
    }
  };

  const begin = () => {
    const info = infoDone.get(name);
    if (opts.alignPeakMs !== undefined) {
      if (info) {
        const on = info.peak * 1000;
        const delay = Math.max(0, opts.alignPeakMs - on);
        const seek = Math.max(0, on - opts.alignPeakMs) / 1000;
        if (delay > 0) timer = window.setTimeout(() => startFile(seek), delay);
        else startFile(seek);
      } else {
        timer = window.setTimeout(() => startFile(0), opts.alignPeakMs); // file missing/unknown: fallback sound at the impact
      }
    } else if (opts.alignMs !== undefined && info) {
      const on = info.onset * 1000;
      const delay = Math.max(0, opts.alignMs - on);
      const seek = Math.max(0, on - opts.alignMs) / 1000;
      if (delay > 0) timer = window.setTimeout(() => startFile(seek), delay);
      else startFile(seek);
    } else if (opts.alignMs !== undefined) {
      timer = window.setTimeout(() => startFile(0), Math.max(0, opts.alignMs - 40)); // file info not ready: assume ~40 ms onset
    } else {
      startFile(0);
    }
  };
  begin();

  const handle: SoundHandle = {
    stop: () => {
      if (stopped) return;
      stopped = true;
      window.clearTimeout(timer);
      window.clearInterval(fadeTimer);
      stopImpl();
      if (live.get(name) === handle) live.delete(name);
    },
    fadeOut: (ms = 450) => {
      if (stopped) return;
      const from = vol;
      const t0 = performance.now();
      window.clearInterval(fadeTimer);
      fadeTimer = window.setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        volImpl(from * (1 - k));
        if (k >= 1) handle.stop();
      }, 40);
    },
    setVolume: (v) => { vol = v; volImpl(v); },
  };
  live.set(name, handle);
  return handle;
}
