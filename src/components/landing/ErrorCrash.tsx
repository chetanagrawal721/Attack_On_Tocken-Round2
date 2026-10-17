import { useEffect, useMemo, useState } from 'react';
import { speed } from '../../state/flags';
import { rng } from '../../state/rng';
import { runTimeline } from '../../state/scheduler';

type Stage = 'errors' | 'blue' | 'crash' | 'dead';

const TITLES = ['Error', 'Fatal Error', 'Halo.exe has stopped working', 'Runtime Error', 'Out of memory', 'Unexpected Error', 'Exception'];
const MSGS = [
  'Something went wrong.',
  'Error: cannot read properties of undefined',
  'Get Started failed to start (0xC000021A)',
  'Error. Error. Error.',
  'Stack overflow in getStarted()',
  'Unhandled exception at 0x0040AF21',
  'Profile.dll is missing or corrupt',
];

/** Get Started: error windows multiply, blue screen, then the display collapses (CRT-off) and the profile opens. */
export function ErrorCrash({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [stage, setStage] = useState<Stage>('errors');
  const wins = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({
      id: i, x: 4 + Math.floor(rng() * 62), y: 6 + Math.floor(rng() * 66),
      t: TITLES[Math.floor(rng() * TITLES.length)], m: MSGS[Math.floor(rng() * MSGS.length)],
    })),
    [],
  );

  useEffect(() => {
    const steps = [
      ...wins.map((w, i) => ({ at: 120 + i * (170 - i * 4), run: () => setCount(w.id + 1) })),
      { at: 2900, run: () => setStage('blue') },
      { at: 4300, run: () => setStage('crash') },
      { at: 5100, run: () => setStage('dead') },
      { at: 5700, run: onDone },
    ];
    const cancel = runTimeline(steps, speed(1));
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`crash st-${stage}`} data-testid="error-crash" data-stage={stage}>
      <div className="crash-screen">
        {stage === 'errors' && (
          <>
            <div className="crash-bg" />
            {wins.slice(0, count).map((w) => (
              <div key={w.id} className="errwin" style={{ left: `${w.x}%`, top: `${w.y}%` }}>
                <div className="errbar"><span>{w.t}</span><b>×</b></div>
                <div className="errbody"><span className="erricon">✖</span><div>{w.m}</div></div>
                <div className="errbtn"><i>OK</i></div>
              </div>
            ))}
            <div className="errbig" data-testid="error-big">ERROR ERROR ERROR</div>
          </>
        )}
        {(stage === 'blue' || stage === 'crash') && (
          <div className="bsod" data-testid="crash-blue">
            <div className="bsod-face">:(</div>
            <p>A problem has been detected and Get Started has been shut down to prevent damage to your profile.</p>
            <p>HALO_PROFILE_NOT_FOUND<br />*** STOP: 0x000000FE (0xDEADBEEF, 0x00000002)</p>
            <p>Collecting error info… 100% complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
