import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EXP_IDS, SEED_LOG, SETTING_DEFS, SKILL_IDS } from '../config/content';
import { renderLie } from '../chaos/activityLies';
import { useStore, visibleFiles, type TabId } from '../state/store';
import { after } from '../state/scheduler';
import { speed } from '../state/flags';
import { rng } from '../state/rng';
import { Txt } from './Txt';
import { startCleanup, startIncident } from './cinematic/CinematicHost';
import { DeleteModal, Scrim } from './Modals';

export function TabBar() {
  const tab = useStore((s) => s.tab);
  const setTab = useStore((s) => s.userTab);
  const items: [TabId, string][] = [['overview', 'tab.overview'], ['cases', 'tab.cases'], ['activity', 'tab.activity'], ['settings', 'tab.settings']];
  return (
    <div className="tabs fall" role="tablist">
      {items.map(([id, tid]) => (
        <button key={id} role="tab" aria-selected={tab === id} data-testid={`tab-${id}`} className="tab" onClick={() => setTab(id)}>
          <Txt id={tid} />
        </button>
      ))}
    </div>
  );
}

function Overview() {
  const files = useStore((s) => visibleFiles(s));
  return (
    <div className="grid">
      <div className="stack">
        <section className="card pad fall">
          <h2 className="sec"><Txt id="sec.bio" /></h2>
          <p style={{ margin: 0 }} data-testid="bio-text"><Txt id="bio" /></p>
        </section>
        <section className="card pad fall">
          <h2 className="sec"><Txt id="sec.experience" /></h2>
          {EXP_IDS.map((id) => <div className="exp" key={id}><Txt id={id} /></div>)}
        </section>
        <section className="card pad fall">
          <h2 className="sec"><Txt id="sec.featured" /></h2>
          <div className="cs-grid">
            {files.slice(0, 3).map((f) => (
              <div className="card cs" key={f.id}>
                <div className="thumb" />
                <div className="body"><div className="t"><Txt id={`cs.${f.id}`} /></div><div className="muted" style={{ fontSize: 13 }}>{f.client} · {f.year}</div></div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <aside className="stack">
        <section className="card pad fall">
          <h2 className="sec"><Txt id="sec.about" /></h2>
          <p className="muted" style={{ margin: 0 }}><Txt id="about" /></p>
        </section>
        <section className="card pad fall">
          <h2 className="sec"><Txt id="sec.skills" /></h2>
          <div className="chips">{SKILL_IDS.map((id) => <button className="chip" data-testid={`chip-${id}`} key={id} onClick={startIncident}><Txt id={id} /></button>)}</div>
        </section>
        <section className="card pad fall">
          <h2 className="sec">✦ <Txt id="sec.insights" /></h2>
          <div className="exp"><Txt id="insight.1" /><div className="meter" aria-hidden><i style={{ width: '94%' }} /></div></div>
          <div className="exp"><Txt id="insight.2" /></div>
        </section>
      </aside>
    </div>
  );
}

const METRICS: [string, number][] = [['Conversion', 34], ['Retention', 21], ['Satisfaction', 48]];

/** Evidence/Case Studies chaos: exhibit stamps, cards that dodge, a viewer that opens the WRONG study, shuffle on close. */
function CaseViewer({ openId, files, onClose }: { openId: string; files: { id: string; title: string; client: string; year: number }[]; onClose: () => void }) {
  const texts = useStore((s) => s.texts);
  const [phase, setPhase] = useState<'loading' | 'wrong'>('loading');
  const [tick, setTick] = useState(0);
  const wrong = useRef(files.filter((f) => f.id !== openId)[Math.floor(rng() * Math.max(1, files.length - 1))] ?? files[0]).current;
  const asked = files.find((f) => f.id === openId);
  useEffect(() => {
    const c = after(speed(1300), () => setPhase('wrong'));
    return c;
  }, []);
  useEffect(() => {
    if (phase !== 'wrong') return;
    const id = window.setInterval(() => setTick((x) => Math.min(x + 1, 40)), 40);
    return () => window.clearInterval(id);
  }, [phase]);
  return (
    <Scrim label="Case study" onClose={onClose}>
      <div className="card modal" data-testid="case-viewer">
        {phase === 'loading' ? (
          <div data-testid="case-loading" style={{ textAlign: 'center', padding: '30px 0' }}>
            <span className="spinner" style={{ display: 'inline-block', marginBottom: 12 }} />
            <div>Opening <b>{texts[`cs.${openId}`] ?? asked?.title}</b>…</div>
          </div>
        ) : (
          <>
            <div className="exhibit-stamp">EXHIBIT {String.fromCharCode(65 + Math.floor(rng() * 6))}</div>
            <h3 data-testid="case-wrong-title">{texts[`cs.${wrong.id}`] ?? wrong.title}</h3>
            <p className="muted" style={{ marginTop: 0 }} data-testid="case-wrong-note">
              You asked for “{texts[`cs.${openId}`] ?? asked?.title}”. Halo felt this one was stronger.
            </p>
            {METRICS.map(([k, v]) => (
              <div className="row" key={k} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                <span>{k}</span>
                <b className="num" style={{ color: 'var(--danger)' }}>{`−${Math.round((v * tick) / 40)}%`}</b>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 13 }}>Results are trending in an unexpected direction.</p>
            <div className="foot"><button className="btn primary" style={{ minWidth: 0 }} data-testid="case-close" onClick={onClose}>Close</button></div>
          </>
        )}
      </div>
    </Scrim>
  );
}

function Cases() {
  const files = useStore((s) => visibleFiles(s));
  const texts = useStore((s) => s.texts);
  const [order, setOrder] = useState<string[]>([]);
  const [dodge, setDodge] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [letter, setLetter] = useState(0);
  const dodges = useRef(0);

  const ids = files.map((f) => f.id);
  const sorted = [...order.filter((i) => ids.includes(i)), ...ids.filter((i) => !order.includes(i))];
  const byId = Object.fromEntries(files.map((f) => [f.id, f]));

  const shuffle = () => {
    const a = [...sorted];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    setOrder(a);
  };
  const close = () => { setOpen(null); shuffle(); useStore.getState().toast('✦ Halo re-sorted your evidence by vibes.', { halo: true }); };

  return (
    <section className="stack">
      <div className="row fall">
        <h2 className="sec" style={{ margin: 0 }}>
          <span data-testid="file-count">{files.length} files</span>
        </h2>
        <button className="btn" data-testid="view-files" onClick={startCleanup}>View all files</button>
      </div>
      <div className="cs-grid">
        {sorted.map((id, idx) => {
          const f = byId[id];
          if (!f) return null;
          return (
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              animate={dodge === id ? { x: 34, y: -10, rotate: 4 } : { x: 0, y: 0, rotate: 0 }}
              whileHover={dodge === id ? undefined : { rotate: -1.4, y: -3 }}
              className={`card cs fall evid${dodge === id ? ' dodge' : ''}`}
              key={id}
              data-testid={`case-card-${id}`}
              onClick={() => { if (!useStore.getState().cinematic) setOpen(id); }}
              onPointerEnter={() => {
                // every third approach, the card slides away from the cursor once (never blocks clicking)
                dodges.current += 1;
                if (dodges.current % 3 === 0) { setDodge(id); after(900, () => setDodge(null)); }
                setLetter((x) => x + 1);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="thumb"><span className="exh">EXHIBIT {String.fromCharCode(65 + (idx % 26))}</span></div>
              <div className="body">
                <div className="t"><Txt id={`cs.${f.id}`} /></div>
                <div className="muted" style={{ fontSize: 13 }}>{f.client} · {f.year} · {f.size}</div>
                <div className="verdict">{(idx + letter) % 4 === 0 ? 'Admissible' : (idx + letter) % 4 === 1 ? 'Inconclusive' : (idx + letter) % 4 === 2 ? 'Objection!' : 'Sustained'}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
      {open && <CaseViewer openId={open} files={files.map((f) => ({ ...f, title: texts[`cs.${f.id}`] ?? f.title }))} onClose={close} />}
    </section>
  );
}

function Activity() {
  const log = useStore((s) => s.log);
  return (
    <section className="card pad fall" style={{ maxWidth: 760 }} data-testid="activity-feed">
      <h2 className="sec">Recent activity</h2>
      {log.map((e, i) => {
        const l = renderLie(e);
        return (
          <div className="feed-item" key={`${e.at}-${i}`} data-testid="activity-item">
            <span className="dot" /><div style={{ flex: 1 }}>{l.text}</div><span className="muted num" style={{ fontSize: 13 }}>{l.when}</span>
          </div>
        );
      })}
      {SEED_LOG.map((e, i) => (
        <div className="feed-item" key={`seed${i}`} data-testid="activity-item">
          <span className="dot" /><div style={{ flex: 1 }}>{e.text}</div><span className="muted" style={{ fontSize: 13 }}>{e.ago}</span>
        </div>
      ))}
    </section>
  );
}

function DangerZone() {
  const [del, setDel] = useState(false);
  const [swapped, setSwapped] = useState(false);
  const swaps = useRef(0);
  const [boom, setBoom] = useState(0);
  const toast = useStore((s) => s.toast);
  const dispatch = useStore((s) => s.dispatch);

  // The delete button flees to the other side twice, then gives up (always reachable).
  const flee = () => {
    if (swaps.current >= 2) return;
    swaps.current += 1;
    setSwapped((x) => !x);
  };
  const keep = (
    <button key="keep" className="btn primary" style={{ minWidth: 0 }} data-testid="keep-account" onClick={() => toast('✦ Good choice. Halo already knew.', { halo: true })}>Keep my account</button>
  );
  const destroy = (
    <button key="del" className="btn danger-btn" data-testid="delete-account" onPointerEnter={flee} onClick={() => setDel(true)}>Delete account</button>
  );
  return (
    <motion.section
      key={boom}
      className="card pad danger fall"
      data-testid="danger-zone"
      animate={boom ? { scale: [1, 0.15, 0, 1.12, 1], rotate: [0, 40, 180, -6, 0], opacity: [1, 1, 0, 1, 1] } : undefined}
      transition={{ duration: 1.4, times: [0, 0.3, 0.5, 0.8, 1] }}
      whileHover={{ rotate: [0, -0.6, 0.6, 0], transition: { duration: 0.5 } }}
    >
      <h2 className="sec">Danger zone</h2>
      <div className="muted" style={{ fontSize: 13.5, marginBottom: 6 }}>Permanently remove your account and all of its data.</div>
      <div className="muted" style={{ fontSize: 12.5, marginBottom: 14 }} data-testid="others-deleting">✦ 4 other people are deleting their accounts right now.</div>
      <motion.div layout className="row" style={{ justifyContent: 'flex-end', gap: 10 }}>
        {swapped ? [keep, destroy] : [destroy, keep]}
      </motion.div>
      {del && <DeleteModal onClose={() => setDel(false)} onConfirmed={() => { setBoom((x) => x + 1); dispatch('delete'); }} />}
    </motion.section>
  );
}

function Settings() {
  const settings = useStore((s) => s.settings);
  const toggle = useStore((s) => s.toggleSetting);
  const hl = useStore((s) => s.highlightHalo);
  const order = useStore((s) => s.settingsOrder);
  const sync = useStore((s) => s.syncBanner);
  const [bumped, setBumped] = useState<string | null>(null);
  useEffect(() => {
    if (hl) document.querySelector('[data-testid="row-haloAgent"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [hl]);
  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <section className="card pad fall">
        <div className="row" style={{ marginBottom: 6 }}>
          <h2 className="sec" style={{ margin: 0 }}>Preferences</h2>
          <span className="muted" style={{ fontSize: 12.5 }}>✦ Halo is reviewing your settings…</span>
        </div>
        {sync && <div className="sync" data-testid="sync-banner">Settings are out of sync on 3 devices. Resolving automatically…</div>}
        {order.map((id) => {
          const d = SETTING_DEFS.find((x) => x.id === id)!;
          return (
            <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 28 }} key={d.id} className={`setting${hl && d.id === 'haloAgent' ? ' hl' : ''}`} data-testid={`row-${d.id}`}>
              <div>
                <div style={{ fontWeight: 600 }}>{d.label}</div>
                <div className="muted" style={{ fontSize: 13.5 }}>{d.desc}</div>
                {hl && d.id === 'haloAgent' && <div style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, marginTop: 4 }}>You enabled this.</div>}
              </div>
              <button
                role="switch"
                aria-checked={settings[d.id]}
                aria-label={d.label}
                data-testid={`setting-${d.id}`}
                className={`switch${bumped === d.id ? ' bump' : ''}`}
                onClick={() => {
                  setBumped(null);
                  requestAnimationFrame(() => setBumped(d.id));
                  toggle(d.id); // LAW 5: flips a DIFFERENT setting
                }}
              />
            </motion.div>
          );
        })}
      </section>
      <DangerZone />
    </div>
  );
}

export function TabContent() {
  const tab = useStore((s) => s.tab);
  return <div className="tabpane">{tab === 'overview' ? <Overview /> : tab === 'cases' ? <Cases /> : tab === 'activity' ? <Activity /> : <Settings />}</div>;
}
