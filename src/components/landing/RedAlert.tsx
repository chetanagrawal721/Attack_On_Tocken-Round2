import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { speed } from '../../state/flags';
import { after } from '../../state/scheduler';
import { playSound, soundDurationMs } from '../../fx/sfx';

/** Profile button: "YE NI DABANA THA" red alert (slow pulses only, no strobe). */
export function RedAlert({ onDone }: { onDone: () => void }) {
  // sound plays for the whole alert, until it ends
  useEffect(() => {
    const h = playSound('profileAlert');
    // the alert lasts exactly as long as the sound file (3 s if the file is missing), so sound and visuals end together
    const len = Math.min(9000, Math.max(2500, soundDurationMs('profileAlert', 3000)));
    const c = after(speed(len), onDone);
    return () => { c(); h.stop(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div className="alert" data-testid="red-alert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="alert-pulse" />
      <div className="alert-bar top"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="alert-bar bottom"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <motion.div className="alert-card" initial={{ scale: 0.3, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 14 }}>
        <motion.svg className="alert-tri" viewBox="0 0 100 90" animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 0.5 }}>
          <path d="M50 6 L96 84 H4 Z" fill="#fff" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
          <rect x="46" y="32" width="8" height="28" rx="3" fill="#d90429" />
          <circle cx="50" cy="70" r="5" fill="#d90429" />
        </motion.svg>
        <div className="alert-kicker">⚠ RED ALERT · ACCESS DENIED</div>
        <div className="alert-title" data-text="YE NI DABANA THA!">YE NI DABANA THA!</div>
        <div className="alert-sub">You were not supposed to press that.</div>
      </motion.div>
    </motion.div>
  );
}
