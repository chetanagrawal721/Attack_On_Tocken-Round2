import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { VIDEO_EVENTS } from '../../config/videoEvents';
import { speed } from '../../state/flags';
import { after } from '../../state/scheduler';
import { VideoEvent } from '../cinematic/CinematicHost';

export type InterruptKind = 'galat' | 'start';

const BLINDS = Array.from({ length: 8 }, (_, i) => i);

/**
 * Full-screen video that interrupts the landing page. The video always plays to the end,
 * then a transition returns the user to the (untouched) landing page.
 *  - galat: cinematic iris + letterbox bars
 *  - start: venetian blinds + tilted glitch-in
 */
export function VideoInterrupt({ kind, onDone }: { kind: InterruptKind; onDone: () => void }) {
  const cfg = kind === 'galat' ? VIDEO_EVENTS.galatGhanta : VIDEO_EVENTS.getStarted;
  const [phase, setPhase] = useState<'play' | 'out'>('play');
  const finished = useRef(false);

  const done = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase('out');
    after(speed(800), onDone);
  };

  const galat = kind === 'galat';
  return (
    <motion.div
      className={`vi vi-${kind}`}
      data-testid="video-interrupt"
      data-kind={kind}
      data-phase={phase}
      initial={galat ? { clipPath: 'circle(0% at 50% 50%)' } : { clipPath: 'inset(0 0 100% 0)' }}
      animate={
        phase === 'out'
          ? galat ? { clipPath: 'circle(0% at 50% 50%)' } : { clipPath: 'inset(100% 0 0 0)' }
          : galat ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath: 'inset(0 0 0% 0)' }
      }
      transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
    >
      <motion.div
        className="vi-stage"
        initial={galat ? { scale: 1.25 } : { rotate: 5, scale: 0.9 }}
        animate={phase === 'out' ? { scale: galat ? 0.9 : 1.1, opacity: 0.2 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <VideoEvent
          config={cfg}
          muted={false}
          onDone={done}
          fallbackText={galat ? ['Loading something important…', 'Please hold'] : ['Almost there…', 'Preparing your getting-started experience']}
        />
      </motion.div>

      {galat ? (
        <>
          <motion.div className="bar top" initial={{ y: '-100%' }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} />
          <motion.div className="bar bottom" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <span>✦ A Halo Original</span>
          </motion.div>
          <div className="vignette" />
        </>
      ) : (
        <>
          <div className="vi-rgb" />
          <div className="blinds" aria-hidden>
            {BLINDS.map((i) => (
              <motion.i
                key={i}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: phase === 'out' ? 1 : 0 }}
                transition={{ delay: phase === 'out' ? i * 0.04 : 0.3 + i * 0.05, duration: 0.45 }}
              />
            ))}
          </div>
          <div className="vi-tag">● Live from Halo</div>
        </>
      )}
    </motion.div>
  );
}
