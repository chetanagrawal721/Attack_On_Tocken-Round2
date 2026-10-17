/**
 * Phone ringtone for the incoming call.
 * 1) tries a custom file (public/media/ringtone.mp3 by default), 2) falls back to a synthesized
 * two-tone "brrr-brrr" ring (WebAudio, no assets needed). Returns a stop() function.
 * Must be started from a user gesture (the Email click) so the browser allows audio.
 */
export function startRingtone(src?: string): { stop: () => void; ok: Promise<boolean> } {
  let stopped = false;
  let stopFn: () => void = () => {};

  const synth = (): boolean => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return false;
      const ctx: AudioContext = new AC();
      void ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0.16;
      master.connect(ctx.destination);
      const burst = (at: number, dur: number) => {
        // two tones (440 + 480 Hz) chopped at ~20 Hz = classic telephone ring
        const g = ctx.createGain();
        g.gain.value = 0.5;
        const lfo = ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 20;
        const lg = ctx.createGain();
        lg.gain.value = 0.5;
        lfo.connect(lg).connect(g.gain);
        for (const f of [440, 480]) {
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.value = f;
          o.connect(g);
          o.start(at);
          o.stop(at + dur);
        }
        g.connect(master);
        lfo.start(at);
        lfo.stop(at + dur);
      };
      const cycle = () => {
        const t = ctx.currentTime + 0.02;
        burst(t, 0.9);
        burst(t + 1.1, 0.9);
      };
      cycle();
      const id = window.setInterval(cycle, 3600);
      stopFn = () => { window.clearInterval(id); try { if (ctx.state !== 'closed') void ctx.close().catch(() => {}); } catch { /* ignore */ } };
      return true;
    } catch {
      return false;
    }
  };

  const ok = new Promise<boolean>((resolve) => {
    if (!src) { resolve(synth()); return; }
    try {
      const a = new Audio(src);
      a.loop = true;
      a.volume = 0.8;
      a.onerror = () => { if (!stopped) resolve(synth()); };
      const p = a.play();
      if (p) {
        p.then(() => { stopFn = () => { a.pause(); a.src = ''; }; if (stopped) { stopFn(); resolve(false); } else resolve(true); })
          .catch(() => { if (!stopped) resolve(synth()); });
      }
    } catch {
      resolve(synth());
    }
  });

  return {
    ok,
    stop: () => { if (stopped) return; stopped = true; stopFn(); },
  };
}
