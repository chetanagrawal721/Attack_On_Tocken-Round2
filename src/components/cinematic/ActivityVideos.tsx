import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { speed } from '../../state/flags';
import { rng } from '../../state/rng';
import { after } from '../../state/scheduler';
import { useStore } from '../../state/store';

const SRC = '/media/activity.mp4'; // put your clip here (public/media/activity.mp4)
const COUNT = 10;
const LIFETIME_MS = 4600; // everything stops after ~4.6 s

interface Tile { id: number; w: number; x: number; y: number; rot: number; delay: number; dx: number; dy: number; dur: number; vol: number; start: number }

function makeTiles(): Tile[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    w: 150 + Math.floor(rng() * 120),
    x: 2 + rng() * 78,
    y: 4 + rng() * 52,
    rot: (rng() - 0.5) * 26,
    delay: i * 210,
    dx: (rng() - 0.5) * 360,
    dy: (rng() - 0.5) * 260,
    dur: 1.6 + rng() * 1.8,
    vol: i === 0 ? 1 : 0.8,
    start: i === 0 ? 0 : rng() * 1.5,
  }));
}

function Clip({ t }: { t: Tile }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.volume = t.vol;
    v.muted = false;
    const go = () => {
      try { if (t.start > 0) v.currentTime = t.start; } catch { /* ignore */ }
      const p = v.play();
      // Only fall back to muted when the browser really blocks sound. An AbortError (play interrupted by a
      // pause/re-mount, e.g. React StrictMode in dev) must NOT mute the clip.
      if (p) p.catch((e: unknown) => {
        if ((e as DOMException)?.name === 'NotAllowedError') { v.muted = true; v.play().catch(() => {}); }
      });
    };
    go();
    return () => { v.pause(); };
  }, [t]);
  return <video ref={ref} src={SRC} loop playsInline preload="auto" className="avs-video" />;
}

/**
 * Clicking "Activity": many copies of activity.mp4 pop up in random places, drift around and play
 * with sound, then everything disappears after about 4-5 seconds. Never blocks clicks.
 */
export function ActivityVideos() {
  const fx = useStore((s) => s.activityFx);
  const [run, setRun] = useState(0);
  const tiles = useMemo(() => (run ? makeTiles() : []), [run]);

  useEffect(() => {
    if (!fx) return;
    setRun(fx);
    return after(speed(LIFETIME_MS), () => setRun(0));
  }, [fx]);

  return (
    <div className="avs-layer" aria-hidden data-testid="activity-videos" data-active={run ? '1' : '0'}>
      <AnimatePresence>
        {run > 0 && tiles.map((t) => (
          <motion.div
            key={`${run}-${t.id}`}
            className="avs-tile"
            style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.w }}
            initial={{ scale: 0, opacity: 0, rotate: t.rot - 40 }}
            animate={{ scale: 1, opacity: 1, rotate: t.rot, x: [0, t.dx, -t.dx * 0.6, t.dx * 0.4, 0], y: [0, t.dy, -t.dy * 0.5, t.dy * 0.7, 0] }}
            exit={{ scale: 0, opacity: 0, rotate: t.rot + 50, transition: { duration: 0.28 } }}
            transition={{
              scale: { type: 'spring', stiffness: 420, damping: 16, delay: speed(t.delay) / 1000 },
              opacity: { duration: 0.12, delay: speed(t.delay) / 1000 },
              rotate: { type: 'spring', stiffness: 260, damping: 14, delay: speed(t.delay) / 1000 },
              x: { duration: t.dur * 2, ease: 'easeInOut', delay: speed(t.delay) / 1000, repeat: Infinity, repeatType: 'mirror' },
              y: { duration: t.dur * 2, ease: 'easeInOut', delay: speed(t.delay) / 1000, repeat: Infinity, repeatType: 'mirror' },
            }}
          >
            <Clip t={t} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
