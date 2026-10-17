import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '../config/content';
import { stageOf, VERIFIED_TIP } from '../chaos/entropy';
import { useStore } from '../state/store';
import { Icon, Txt } from './Txt';
import { startCall, startReshuffle } from './cinematic/CinematicHost';
import { startResume } from './Resume';

const VISITORS: [string, string][][] = [
  [['You', 'just now'], ['You', '2 min ago (incognito)'], ['✦ Halo', 'watching now']],
  [['A very large bird', 'on your balcony'], ['Your future self', 'verified'], ['✦ Halo', 'from inside the house']],
  [['Morgan Vale', 'from your phone'], ['Someone who looks like you', '3 min ago'], ['✦ Halo', 'taking notes']],
  [['The person who is reading this', 'now'], ['A recruiter (it is Halo)', 'yesterday'], ['✦ Halo', 'it never left']],
];

function FollowerCount() {
  const followers = useStore((s) => s.followers);
  const lose = useStore((s) => s.loseFollower);
  const ref = useRef<HTMLSpanElement>(null);
  const touchAt = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    ref.current?.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
  }, [followers]);

  return (
    <span
      ref={ref}
      className="v num"
      data-testid="follower-count"
      tabIndex={0}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') touchAt.current = Date.now();
        lose();
      }}
      onClick={() => {
        if (Date.now() - touchAt.current < 350) return; // touch tap = enter + click, count once
        lose();
      }}
      onContextMenu={() => lose()}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) lose();
      }}
    >
      {new Intl.NumberFormat('en-US').format(followers)}
    </span>
  );
}

/** Plays /media/profile_clip.mp4 inside the avatar frame, then stays paused on the last frame. */
function ProfileClip() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    const p = v.play();
    if (p) p.catch(() => { v.muted = true; v.play().catch(() => useStore.setState({ photoClip: 'off' })); });
  }, []);
  return (
    <video
      ref={ref} className="avatar-clip" data-testid="profile-clip" src="/media/profile_clip.mp4" playsInline preload="auto"
      onEnded={(e) => { e.currentTarget.pause(); useStore.setState({ photoClip: 'done' }); }}
      onError={() => useStore.setState({ photoClip: 'off' })}
    />
  );
}

function FollowButton() {
  const phase = useStore((s) => s.followPhase);
  const click = useStore((s) => s.followClick);
  const label = { follow: 'Follow', following: 'Following', unfollowed: 'Unfollowed', followed_successfully: 'Followed successfully' }[phase];
  // LAW 4: the BUTTON's className/style never depend on `phase`. The hint beside it is a separate element
  // that makes the betrayal obvious without touching the button.
  return (
    <span className="follow-wrap">
      <button className="btn primary" data-testid="follow-button" data-phase={phase} onClick={click}>
        {label}
      </button>
      <span className="fhint-slot" aria-live="polite">
        {phase === 'following' && (
          <span className="fhint" data-testid="follow-hint" key="f"><span className="bar"><i /></span>Following… for now</span>
        )}
        {phase === 'unfollowed' && (
          <span className="fhint bad" data-testid="follow-hint" key="u">✕ Halo unfollowed them. Click again to apologize.</span>
        )}
        {phase === 'followed_successfully' && (
          <span className="fhint ok" data-testid="follow-hint" key="s">✓ Followed successfully (the button does not change. Nothing will.)</span>
        )}
      </span>
      {phase === 'unfollowed' && <span className="fx-broken" key="b">💔</span>}
    </span>
  );
}

export function Header() {
  const s = useStore();
  const stage = stageOf(s.entropy);
  const visitor = s.identity === 'visitor';
  const [viewsOpen, setViewsOpen] = useState(false);
  const [fx, setFx] = useState(false);
  useEffect(() => {
    if (!s.photoFx) return;
    setFx(true);
    const t = window.setTimeout(() => setFx(false), 1500);
    return () => window.clearTimeout(t);
  }, [s.photoFx]);
  const viewsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!viewsOpen) return;
    const close = (e: PointerEvent) => { if (!viewsRef.current?.contains(e.target as Node)) setViewsOpen(false); };
    document.addEventListener('pointerdown', close);
    const t = window.setTimeout(() => setViewsOpen(false), 4000); // popover never lingers over the tabs
    return () => { document.removeEventListener('pointerdown', close); window.clearTimeout(t); };
  }, [viewsOpen]);

  return (
    <>
      <div className="cover fall" />
      <section className="head">
        <div className={`avatar-wrap fall${fx ? ' photo-chaos' : ''}`} data-testid="avatar-wrap">
          {visitor ? (
            <div className="avatar-ph" data-testid="avatar">{Icon.silhouette}</div>
          ) : (
            <img className={`avatar${s.avatarGone ? ' gone' : ''}${s.photoClip !== 'off' ? ' poof' : ''}`} data-testid="avatar" src={PROFILE.avatarSvg} alt="Profile" />
          )}
          {s.avatarGone && !visitor && <div className="avatar-ph" style={{ opacity: 1 }}>{Icon.silhouette}</div>}
          {(s.photoClip === 'play' || s.photoClip === 'done') && !visitor && <ProfileClip key={s.photoClipKey} />}
          {s.photoBusy && <div className="shimmer" />}
          {fx && <div className="photo-flash" key={`fl${s.photoFx}`} />}
          {fx && ['📷', '🖼️', '✨', '📸', '🌀', '🤳'].map((e, i) => <span key={`${s.photoFx}-${i}`} className="pfx" style={{ ['--dx' as string]: `${Math.round(Math.cos(i * 1.05) * 110)}px`, ['--dy' as string]: `${Math.round(Math.sin(i * 1.05) * 90 - 20)}px`, ['--rot' as string]: `${i * 70 - 120}deg` }}>{e}</span>)}
          {s.settings.onlineStatus && !s.avatarGone && <span className="online" data-testid="online-dot" />}
          <button className="photo-btn" data-testid="change-photo" onClick={s.changePhoto}>{Icon.camera}Change Photo</button>
        </div>
        <div className="ident fall">
          <div className="name-row">
            <h1 className={`name${fx ? ' name-jitter' : ''}`} data-testid="display-name">{s.nameOverride ?? s.profile.displayName}</h1>
            <span className="verified" tabIndex={0} aria-label="Verified" data-testid="verified">
              {Icon.check}
              <span className="tip" data-testid="verified-tip">{VERIFIED_TIP[stage]}</span>
            </span>
            <button className="icon-btn" data-testid="edit-name" onClick={() => s.patch({ bioOpen: true })}>{Icon.pencil}Edit Name</button>
          </div>
          <p className="headline"><Txt id="headline" /></p>
          <div className="muted"><Txt id="location" /></div>
          <span className="halo-chip">✦ Profile managed by Halo</span>
        </div>
      </section>

      <div className="actions fall">
        <FollowButton />
        <button className="btn" data-testid="message-btn" onClick={() => s.patch({ messageOpen: true, unread: false })} style={{ position: 'relative' }}>{Icon.chat}<Txt id="btn.message" />{s.unread && <span className="unread" data-testid="unread-dot">1</span>}</button>
        <button className="btn" data-testid="email-btn" onClick={startCall}>{Icon.mail}<Txt id="btn.email" /></button>
        <button className="btn" data-testid="resume-btn" onClick={startResume}>{Icon.download}<Txt id="btn.resume" /></button>
      </div>

      <div className="stats fall">
        <div className="stat">
          <FollowerCount />
          <div className="l"><Txt id="stat.followers" /></div>
        </div>
        <button className="stat" data-testid="following-stat" style={{ font: 'inherit', color: 'inherit' }} onClick={startReshuffle}>
          <span className="v num">312</span>
          <div className="l"><Txt id="stat.following" /></div>
        </button>
        <div style={{ position: 'relative' }} ref={viewsRef}>
          <button
            className="stat"
            data-testid="views-stat"
            style={{ font: 'inherit', color: 'inherit' }}
            onClick={() => {
              if (!viewsOpen) { s.patch({ flags: { ...s.flags, viewsChecked: s.flags.viewsChecked + 1 } }); s.dispatch('views'); }
              setViewsOpen(!viewsOpen);
            }}
          >
            <span className="v num" data-testid="views-count">{3 + s.flags.viewsChecked}</span>
            <div className="l"><Txt id="stat.views" /></div>
          </button>
          {viewsOpen && (
            <div className="card popover" data-testid="views-popover">
              {VISITORS[(s.flags.viewsChecked + VISITORS.length - 1) % VISITORS.length].map(([who, when]) => (
                <div className="row" key={who}><span>{who}</span><span className="muted">{when}</span></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
