import { useEffect, useRef, useState } from 'react';
import { diffLines, mmss, visitorBio } from '../chaos/finale';
import { chooseErosion, type Candidate } from '../chaos/law2Erosion';
import { after } from '../state/scheduler';
import { START_FOLLOWERS, useStore } from '../state/store';
import { Txt } from './Txt';

export function Scrim({ children, onClose, label }: { children: React.ReactNode; onClose?: () => void; label: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="scrim" role="dialog" aria-modal="true" aria-label={label} onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      {children}
    </div>
  );
}

let glyphId = 1;

/** LAW 2: choose a letter from visible erodible text; spawn a falling glyph at its screen position. */
function erode(texts: Record<string, string>) {
  const cands: Candidate[] = [];
  const els = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>('[data-txt]').forEach((el) => {
    const id = el.dataset.txt!;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && !els.has(id)) els.set(id, el);
  });
  for (const [id, text] of Object.entries(texts)) cands.push({ id, text, visible: els.has(id) && els.get(id)!.textContent === text });
  const hit = chooseErosion(cands);
  if (!hit) return null;
  const el = els.get(hit.id);
  const node = el?.firstChild;
  if (el && node && node.nodeType === Node.TEXT_NODE) {
    try {
      const range = document.createRange();
      range.setStart(node, hit.index);
      range.setEnd(node, hit.index + 1);
      const r = range.getBoundingClientRect();
      if (r.width > 0) {
        const g = { id: glyphId++, char: hit.char, x: r.left, y: r.top };
        useStore.setState((s) => ({ glyphs: [...s.glyphs, g] }));
        after(900, () => useStore.setState((s) => ({ glyphs: s.glyphs.filter((x) => x.id !== g.id) })));
      }
    } catch { /* commit silently */ }
  }
  return hit;
}

export function BioModal() {
  const open = useStore((s) => s.bioOpen);
  const bio = useStore((s) => s.texts.bio);
  const patch = useStore((s) => s.patch);
  const saveBio = useStore((s) => s.saveBio);
  const [val, setVal] = useState(bio);
  useEffect(() => { if (open) setVal(useStore.getState().texts.bio); }, [open]);
  if (!open) return null;
  const close = () => patch({ bioOpen: false });
  return (
    <Scrim label="Edit bio" onClose={close}>
      <div className="card modal">
        <h3>Edit bio</h3>
        <textarea data-testid="bio-input" value={val} onChange={(e) => setVal(e.target.value)} autoFocus />
        <div className="foot">
          <button className="btn" data-testid="bio-cancel" onClick={close}>Cancel</button>
          <button className="btn primary" style={{ minWidth: 0 }} data-testid="bio-save" onClick={() => { saveBio(val, erode); close(); }}>Save</button>
        </div>
      </div>
    </Scrim>
  );
}

export function Glyphs() {
  const glyphs = useStore((s) => s.glyphs);
  return <>{glyphs.map((g) => <span key={g.id} className="glyph" style={{ left: g.x, top: g.y }}>{g.char}</span>)}</>;
}

function Countdown() {
  const [n, setN] = useState(10);
  useEffect(() => {
    const id = window.setInterval(() => setN((x) => (x <= 1 ? 10 : x - 1)), 900);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="muted" data-testid="delete-countdown" style={{ fontSize: 12.5, marginBottom: 10 }}>
      Deletion scheduled in {n}… {n === 1 ? '(postponed by Halo)' : ''}
    </div>
  );
}

export function DeleteModal({ onClose, onConfirmed }: { onClose: () => void; onConfirmed?: () => void }) {

  const [val, setVal] = useState('');
  const morphing = useRef(false);
  const toast = useStore((s) => s.toast);
  const dispatch = useStore((s) => s.dispatch);
  const TARGET = 'DELIGHT';
  const onChange = (v: string) => {
    if (morphing.current) return;
    const up = v.toUpperCase();
    setVal(v);
    if (up === 'DELETE') {
      morphing.current = true;
      let k = 0;
      const tick = () => {
        k++;
        setVal(TARGET.slice(0, k) + 'DELETE'.slice(k));
        if (k < TARGET.length) after(80, tick);
        else setVal(TARGET);
      };
      after(80, tick);
    }
  };
  const ready = val === TARGET;
  return (
    <Scrim label="Delete account" onClose={onClose}>
      <div className="card modal">
        <h3>Delete account</h3>
        <p className="muted" style={{ marginTop: 0 }}>Type DELETE to confirm.</p>
        <Countdown />
        <input className="input" data-testid="delete-input" value={val} onChange={(e) => onChange(e.target.value)} autoFocus />
        <div className="foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn danger-btn"
            data-testid="delete-confirm"
            disabled={!ready}
            style={{ opacity: ready ? 1 : 0.5 }}
            onClick={() => { toast('Account delighted ✓'); if (onConfirmed) onConfirmed(); else dispatch('delete'); onClose(); }}
          >Delight account</button>
        </div>
      </div>
    </Scrim>
  );
}

export function ResumeModal() {
  const open = useStore((s) => s.resumeOpen);
  const patch = useStore((s) => s.patch);
  if (!open) return null;
  const close = () => patch({ resumeOpen: false });
  return (
    <Scrim label="Résumé" onClose={close}>
      <div style={{ width: 'min(460px,100%)' }}>
        <div className="paper" data-testid="resume-paper"><small>Intentionally left blank by Halo.</small></div>
        <div style={{ textAlign: 'center', marginTop: 14 }}><button className="btn" onClick={close}>Close</button></div>
      </div>
    </Scrim>
  );
}

export function ChatSheet() {
  const open = useStore((s) => s.messageOpen);
  const msgs = useStore((s) => s.messages);
  const stageN = useStore((s) => s.flags.messageStage);
  const typing = useStore((s) => s.typing);
  const name = useStore((s) => s.profile.displayName);
  const patch = useStore((s) => s.patch);
  const [val, setVal] = useState('');
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => { logRef.current?.scrollTo({ top: 99999 }); }, [msgs, typing, open]);
  if (!open) return null;

  const add = (m: { from: 'me' | 'morgan'; text: string; unsent?: boolean }) => useStore.setState((s) => ({ messages: [...s.messages, m] }));
  const setStage = (n: 0 | 1 | 2 | 3) => useStore.setState((s) => ({ flags: { ...s.flags, messageStage: n } }));

  const send = () => {
    const text = val.trim();
    if (!text || typing || stageN >= 3) return;
    setVal('');
    add({ from: 'me', text });
    useStore.getState().dispatch('message');
    if (stageN === 0) {
      setStage(1);
      patch({ typing: true });
      after(6000, () => { patch({ typing: false }); after(1500, () => { patch({ typing: true }); after(3000, () => { patch({ typing: false }); add({ from: 'morgan', text: 'k' }); }); }); });
    } else if (stageN === 1) {
      setStage(2);
      patch({ typing: true });
      after(1000, () => {
        patch({ typing: false });
        add({ from: 'morgan', text: "Totally, let's—" });
        after(2000, () => useStore.setState((s) => {
          const m = [...s.messages];
          for (let i = m.length - 1; i >= 0; i--) if (m[i].from === 'morgan' && m[i].text === "Totally, let's—") { m[i] = { from: 'morgan', text: 'This message was unsent.', unsent: true }; break; }
          return { messages: m };
        }));
      });
    } else {
      setStage(3);
      after(1200, () => add({ from: 'morgan', text: 'Morgan left the conversation.', unsent: true }));
    }
  };

  const last = msgs[msgs.length - 1];
  return (
    <aside className="sheet" role="dialog" aria-label="Messages" data-testid="chat-sheet">
      <div className="row pad" style={{ borderBottom: '1px solid var(--border)', padding: '14px 16px' }}>
        <strong>{name}</strong>
        <button className="icon-btn" onClick={() => patch({ messageOpen: false })}>Close</button>
      </div>
      <div className="chat-log" ref={logRef}>
        {msgs.length === 0 && <div className="muted" style={{ textAlign: 'center', marginTop: 24 }}>Say hello to <Txt id="headline" />.</div>}
        {msgs.map((m, i) => <div key={i} className={`bubble${m.from === 'me' ? ' me' : ''}${m.unsent ? ' unsent' : ''}`}>{m.text}</div>)}
        {last?.from === 'me' && <div className="muted" style={{ fontSize: 12, alignSelf: 'flex-end' }}>Seen</div>}
        {typing && <div className="bubble muted" data-testid="typing">{name} is typing…</div>}
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          className="input" data-testid="chat-input" placeholder={stageN >= 3 ? 'This conversation has ended' : 'Write a message'}
          disabled={stageN >= 3} value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <button className="btn primary" style={{ minWidth: 0 }} disabled={stageN >= 3} data-testid="chat-send" onClick={send}>Send</button>
      </div>
    </aside>
  );
}

export function FinaleModal() {
  const open = useStore((s) => s.finaleOpen);
  const s = useStore();
  const [busy, setBusy] = useState(false);
  if (!open) return null;
  const input = {
    originalName: s.profile.originalName, displayName: s.profile.displayName, nameChanges: s.visit.nameChanges, saves: s.visit.saves,
    erosions: s.erosions, followers: s.followers, startFollowers: START_FOLLOWERS, lost: s.files.filter((f) => f.lost).length,
    forcedSetting: s.flags.forcedHalo, unsent: s.messages.filter((m) => m.unsent).length, activeMs: s.visit.activeMs, videoSeen: s.flags.videoSeen,
  };
  const lines = diffLines(input);
  const revert = () => {
    setBusy(true);
    after(2000, () => {
      const st = useStore.getState();
      useStore.setState({
        identity: 'visitor',
        profile: { ...st.profile, displayName: 'You (Visitor)' },
        texts: { ...st.texts, headline: `Spent ${mmss(st.visit.activeMs)} on a stranger's profile`, bio: visitorBio(input) },
        followers: 0,
        followPhase: 'follow',
        finaleOpen: false,
        flags: { ...st.flags, finaleSeen: true },
      });
      useStore.getState().setTab('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      useStore.getState().toast('✦ Profile optimized. You are now the product.', { halo: true });
      setBusy(false);
    });
  };
  return (
    <Scrim label="Review changes" onClose={busy ? undefined : () => s.patch({ finaleOpen: false })}>
      <div className="card modal" data-testid="finale-modal">
        <h3>✦ Review changes</h3>
        <div className="diff" data-testid="finale-diff">
          {lines.map((l, i) => <div key={i} className={l.sign === '-' ? 'minus' : 'plus'}>{l.sign} {l.text}</div>)}
        </div>
        {busy && <div className="progress" style={{ background: 'var(--border)', marginTop: 16 }}><i style={{ width: '100%', background: 'var(--accent)', transition: 'width 2s linear' }} /></div>}
        <div className="foot">
          <button className="btn" disabled={busy} onClick={() => s.patch({ finaleOpen: false })}>Not now</button>
          <button className="btn primary" style={{ minWidth: 0 }} data-testid="revert-all" disabled={busy} onClick={revert}>Revert all changes</button>
        </div>
      </div>
    </Scrim>
  );
}
