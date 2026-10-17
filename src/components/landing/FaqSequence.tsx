import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { speed } from '../../state/flags';
import { rng } from '../../state/rng';
import { after, runTimeline } from '../../state/scheduler';
import { playSound, soundDurationMs, type SoundHandle } from '../../fx/sfx';

type Stage = 'loading' | 'glitch' | 'delete' | 'black' | 'chaos' | 'ask' | 'fire';

const DELETE_LINES = [
  'C:\\Users\\Public\\Documents\\faq\\questions.md',
  'C:\\Users\\Public\\Documents\\faq\\answers.md',
  'C:\\Program Files\\Halo\\assets\\hero.png',
  'C:\\Program Files\\Halo\\config\\nav.json',
  'C:\\Program Files\\Halo\\assets\\logo.svg',
  'C:\\Users\\Public\\Customers\\*.*',
  'C:\\Windows\\System32\\halo\\session.dll',
  'C:\\Users\\Public\\Backups\\restore-point.bak',
];
const FRAGS = ['FAQ', '404', 'DATA', 'BOSS', 'TOKEN', '✦', 'WINNER', '???', 'NULL', 'DELETE'];

/**
 * FAQ button: fake loading -> glitch -> fake deletion -> black -> chaos -> demand.
 * 100% simulated; only landing-page *classes* are toggled via onDamage.
 * Yes -> simulated gunfire animation -> back to the question. No -> profile.
 */
export function FaqSequence({ onDamage, onProfile }: { onDamage: (n: number) => void; onProfile: () => void }) {
  const [stage, setStage] = useState<Stage>('loading');
  const [lines, setLines] = useState<string[]>([]);
  const [pct, setPct] = useState(0);
  const [warned, setWarned] = useState(false);
  const cancel = useRef<() => void>(() => {});
  const alarm = useRef<SoundHandle | null>(null);
  const root = () => document.querySelector('[data-glitch]');

  const frags = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({
      id: i, t: FRAGS[Math.floor(rng() * FRAGS.length)], x: Math.floor(rng() * 90), y: Math.floor(rng() * 85),
      r: Math.floor(rng() * 60) - 30, d: 1.6 + rng() * 2.4, s: 0.8 + rng() * 2.2,
    })),
    [],
  );

  // alert music: starts when FAQ is clicked, loops through the attack, ducks under the demand, stops on exit
  useEffect(() => {
    const h = playSound('faqAlert');
    alarm.current = h;
    return () => { h.fadeOut(500); alarm.current = null; };
  }, []);

  useEffect(() => {
    const steps = [
      { at: 1400, run: () => { setStage('glitch'); root()?.classList.add('glitch-hard'); } },
      { at: 2800, run: () => { setStage('delete'); root()?.classList.remove('glitch-hard'); root()?.classList.add('glitch'); } },
      ...DELETE_LINES.map((l, i) => ({ at: 2900 + i * 420, run: () => { setLines((x) => [...x.slice(-7), l]); setPct(Math.round(((i + 1) / DELETE_LINES.length) * 100)); onDamage(i + 1); } })),
      { at: 6500, run: () => { setStage('black'); root()?.classList.remove('glitch'); } },
      { at: 7700, run: () => setStage('chaos') },
      { at: 11500, run: () => { setStage('ask'); alarm.current?.setVolume(0.3); } },
    ];
    cancel.current = runTimeline(steps, speed(1));
    return () => { cancel.current(); root()?.classList.remove('glitch', 'glitch-hard'); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // YES opens the profile. NO fires the gun; once the gunshot has finished a warning pops up and the question comes back.
  const yes = () => { cancel.current(); onProfile(); };
  const no = () => {
    setWarned(false);
    setStage('fire');
    // the first audible sample of the gunshot lands exactly on the muzzle flash (0.5 s into the animation)
    alarm.current?.setVolume(0.15);
    playSound('gunshot', { alignMs: 520 });
    const fireMs = Math.min(5200, Math.max(2400, soundDurationMs('gunshot', 2400))); // wait for the whole gun sound
    after(speed(fireMs), () => { setStage('ask'); setWarned(true); alarm.current?.setVolume(0.3); });
  };

  const dark = stage === 'black' || stage === 'chaos' || stage === 'ask' || stage === 'fire';
  return (
    <div className={`faq st-${stage}`} data-testid="faq-sequence" data-stage={stage}>
      {dark && <div className="faq-bg" />}

      {stage === 'loading' && (
        <div className="faq-loading card" data-testid="faq-loading"><span className="spinner" />Loading FAQ…</div>
      )}
      {stage === 'glitch' && (
        <>
          <div className="slices" />
          <div className="faq-loading card"><span className="spinner" />Loading FAQ…</div>
        </>
      )}
      {stage === 'delete' && (
        <div className="atk" data-testid="faq-console">
          <div className="atk-title"><span>⚠ HALO SECURITY — INTRUSION DETECTED</span><b>—&nbsp;&nbsp;▢&nbsp;&nbsp;✕</b></div>
          <div className="atk-body">
            <div className="atk-warn">UNAUTHORIZED REMOTE SESSION</div>
            <div className="atk-meta">Source 203.0.113.7 · user: root · session 0x4F2A · encrypted</div>
            <div className="atk-list">
              {lines.map((l, i) => <div key={i}><em>[DEL]</em> {l}</div>)}
            </div>
            <div className="atk-prog"><i style={{ width: `${pct}%` }} /></div>
            <div className="atk-stats">
              <span>Deleting… {pct}%</span>
              <span>Files deleted: {Math.round(pct * 482.13).toLocaleString('en-US')}</span>
            </div>
            <div className="atk-foot">Connection cannot be terminated. (simulation)</div>
          </div>
        </div>
      )}

      {stage === 'chaos' && (
        <div className="chaos-field" data-testid="faq-chaos">
          {frags.map((f) => (
            <span key={f.id} className="frag" style={{ left: `${f.x}%`, top: `${f.y}%`, fontSize: `${f.s}rem`, animationDuration: `${f.d}s`, ['--r' as string]: `${f.r}deg` }}>{f.t}</span>
          ))}
          <div className="big-flicker">FAQ NOT FOUND</div>
          <div className="scan" />
        </div>
      )}

      {(stage === 'ask' || stage === 'fire') && (
        <div className="ask" data-testid="faq-ask">
          <div className="ask-card" data-shake={stage === 'fire' ? '1' : '0'}>
            <p className="ask-msg" data-testid="faq-message">
              Hamare paas tumhara poora data hai. Hamare boss ko <b>Attack on Token</b> ka winner banao, warna…
            </p>
            <AnimatePresence>
              {warned && stage === 'ask' && (
                <motion.div
                  className="ask-pop" data-testid="faq-warn" role="alert"
                  initial={{ opacity: 0, y: 14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                >
                  <span className="ask-pop-ico">⚠</span>
                  <span>Nahi bologe to maar diye jaoge. Soch lo ek baar.</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="ask-btns">
              <button className="ask-btn yes" data-testid="faq-yes" disabled={stage === 'fire'} onClick={yes}>Yes</button>
              <button className="ask-btn no" data-testid="faq-no" disabled={stage === 'fire'} onClick={no}>No</button>
            </div>
            <div className="ask-foot">Theatre only. No data was accessed.</div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {stage === 'fire' && (
          <motion.div className="fire" data-testid="faq-fire" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.svg className="gun" viewBox="0 0 260 130" initial={{ x: -320 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
              <path d="M8 44h170v26H104l-10 48H62l10-48H8z" fill="#16171b" stroke="#444" strokeWidth="2" />
              <rect x="170" y="38" width="76" height="16" rx="4" fill="#202228" stroke="#444" strokeWidth="2" />
              <rect x="40" y="38" width="90" height="6" rx="3" fill="#3a3d46" />
            </motion.svg>
            <motion.div className="muzzle" initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 1.4, 0], opacity: [1, 1, 0] }} transition={{ delay: 0.5, duration: 0.35 }} />
            <motion.div className="bullet" initial={{ scale: 0.15, x: 0, y: 0, opacity: 0 }} animate={{ scale: [0.15, 5], opacity: [1, 1], x: ['0vw', '34vw'], y: ['0vh', '-8vh'] }} transition={{ delay: 0.6, duration: 0.7, ease: 'easeIn' }} />
            <motion.div className="impact" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 0] }} transition={{ delay: 1.25, duration: 1 }} />
            <motion.svg className="crack" viewBox="0 0 100 100" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: 1.25, duration: 1.1 }}>
              {[[50, 50, 6, 4], [50, 50, 96, 12], [50, 50, 100, 70], [50, 50, 60, 100], [50, 50, 0, 92], [50, 50, 12, 40]].map(([x1, y1, x2, y2], i) => (
                <polyline key={i} points={`${x1},${y1} ${(x1 + x2) / 2 + 3},${(y1 + y2) / 2 - 4} ${x2},${y2}`} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              ))}
            </motion.svg>
            <motion.div className="hit-text" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 1] }} transition={{ delay: 1.3, duration: 1 }}>BANG</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
