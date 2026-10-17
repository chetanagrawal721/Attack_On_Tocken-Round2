import { useEffect, useRef, useState } from 'react';
import { speed } from '../../state/flags';
import { after, runTimeline } from '../../state/scheduler';
import { useStore } from '../../state/store';
import { playSound } from '../../fx/sfx';

const A = [-0.1, 0.16];  // start (fractions of viewport)
const C = [0.46, 0.04];  // control point
const B = [0.7, 0.82];   // crash site

const bez = (u: number, i: 0 | 1) => (1 - u) * (1 - u) * A[i] + 2 * (1 - u) * u * C[i] + u * u * B[i];
const dbez = (u: number, i: 0 | 1) => 2 * (1 - u) * (C[i] - A[i]) + 2 * u * (B[i] - C[i]);

const DEBRIS = Array.from({ length: 12 }, (_, i) => ({ id: i, dx: Math.cos(i * 0.52) * (120 + (i % 3) * 70), dy: -Math.abs(Math.sin(i * 0.9)) * 190 - 20, r: i * 53 }));

/** Plane flies across the page, trails smoke, nosedives; explosion; the page falls apart, then everything returns. */
export function PlaneCrash({ onDone }: { onDone: () => void }) {
  const planeRef = useRef<HTMLDivElement>(null);
  const [puffs, setPuffs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [boom, setBoom] = useState(false);
  const [burning, setBurning] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    const D = speed(2600);
    const t0 = performance.now();
    let raf = 0;
    let lastPuff = 0;
    let alive = true;
    const frame = (now: number) => {
      if (!alive) return;
      const raw = Math.min(1, (now - t0) / D);
      const u = raw * raw * 0.65 + raw * 0.35; // accelerates as it falls
      const w = window.innerWidth, h = window.innerHeight;
      const x = bez(u, 0) * w, y = bez(u, 1) * h;
      const ang = (Math.atan2(dbez(u, 1) * h, dbez(u, 0) * w) * 180) / Math.PI;
      if (planeRef.current) planeRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${ang}deg)`;
      if (now - lastPuff > 55 && raw < 1) {
        lastPuff = now;
        setPuffs((p) => [...p.slice(-34), { id: idRef.current++, x, y }]);
      }
      if (raw < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const root = document.getElementById('root');
    // crash audio: its loudest moment is synced to the explosion (2.6 s into the flight)
    const snd = playSound('planeCrash', { alignPeakMs: speed(2600) });
    const steps = [
      { at: 1200, run: () => setBurning(true) },
      { at: 2600, run: () => { setBoom(true); root?.classList.add('shake'); after(450, () => root?.classList.remove('shake')); } },
      { at: 3000, run: () => useStore.setState({ gravity: true }) },
      { at: 4700, run: () => { useStore.setState({ gravity: false }); onDone(); } },
    ];
    const cancel = runTimeline(steps, speed(1));
    return () => { snd.fadeOut(400); alive = false; cancelAnimationFrame(raf); cancel(); root?.classList.remove('shake'); useStore.setState({ gravity: false }); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bx = `${B[0] * 100}vw`, by = `${B[1] * 100}vh`;
  return (
    <div className="plane-layer" data-testid="plane-crash" data-boom={boom ? '1' : '0'}>
      {puffs.map((p) => <i key={p.id} className="puff" style={{ left: p.x, top: p.y }} />)}
      {!boom && (
        <div className="plane" ref={planeRef} style={{ transform: 'translate(-200px,-200px)' }}>
          <svg width="150" height="62" viewBox="0 0 120 50" aria-hidden>
            <path d="M52 18 L74 3 L86 3 L72 18Z" fill="#c5ccdb" stroke="#8f98ad" strokeWidth="1" />
            <path d="M52 32 L74 47 L86 47 L72 32Z" fill="#aab2c6" stroke="#8f98ad" strokeWidth="1" />
            <path d="M4 25 L30 17 L92 17 Q118 21 118 25 Q118 29 92 33 L30 33Z" fill="#f2f5fb" stroke="#8f98ad" strokeWidth="1.2" />
            <path d="M6 25 L16 20 L22 20 L16 25 L22 30 L16 30Z" fill="#3b5bfd" />
            {[44, 54, 64, 74, 84].map((x) => <circle key={x} cx={x} cy="23" r="2.2" fill="#6d83ff" />)}
            <path d="M96 20 Q108 21 112 25 Q108 24 96 24Z" fill="#6d83ff" />
          </svg>
          {burning && <span className="plane-fire" />}
        </div>
      )}
      {boom && (
        <>
          <div className="flash" />
          <i className="fireball" style={{ left: bx, top: by }} />
          <i className="shock" style={{ left: bx, top: by, margin: -40 }} />
          {DEBRIS.map((d) => (
            <i key={d.id} className="debris" style={{ left: bx, top: by, ['--dx' as string]: `${d.dx}px`, ['--dy' as string]: `${d.dy}px`, ['--r' as string]: `${d.r}deg` }} />
          ))}
          <i className="smoke-col" style={{ left: bx, top: by }} />
        </>
      )}
    </div>
  );
}
