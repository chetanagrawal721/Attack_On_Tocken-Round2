import { useEffect, useState } from 'react';
import { FaqSequence } from './components/landing/FaqSequence';
import { Header } from './components/Header';
import { TabBar, TabContent } from './components/Tabs';
import { Toasts } from './components/Toasts';
import { BioModal, ChatSheet, FinaleModal, Glyphs, ResumeModal } from './components/Modals';
import { CinematicHost } from './components/cinematic/CinematicHost';
import { RawProfile } from './components/RawProfile';
import { after } from './state/scheduler';
import { useStore, type TabId } from './state/store';
import { Landing } from './components/landing/Landing';
import { ActivityVideos } from './components/cinematic/ActivityVideos';
import { preloadSounds } from './fx/sfx';
import './components/landing/landing.css';
import './components/landing/landing2.css';

function damageProfile(n: number) {
  const el = document.querySelector('[data-glitch]');
  if (!el) return;
  Array.from(el.children).forEach((c, i) => c.classList.toggle('dmg-gone', i < n));
}

function ProfileApp() {
  const s = useStore();
  const [faq, setFaq] = useState(false);
  const closeFaq = () => { damageProfile(0); setFaq(false); };

  useEffect(() => { preloadSounds('faqAlert', 'gunshot', 'planeCrash'); }, []);

  // theme follows the (possibly flipped-by-someone-else) darkMode setting
  useEffect(() => {
    document.documentElement.dataset.theme = s.settings.darkMode ? 'dark' : 'light';
  }, [s.settings.darkMode]);

  // boot-only: hash tab + return-visit greeting
  useEffect(() => {
    const h = location.hash.replace('#', '') as TabId;
    if (['overview', 'cases', 'activity', 'settings'].includes(h)) useStore.setState({ tab: h });
    const st = useStore.getState();
    if (st.visit.visits > 1 && st.identity === 'morgan') {
      return after(900, () => useStore.getState().toast('✦ Welcome back. Halo kept working while you were away.', { halo: true }));
    }
  }, []);

  // active time (visible tab only)
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') useStore.setState((x) => ({ visit: { ...x.visit, activeMs: x.visit.activeMs + 1000 } }));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // O8: tab title betrayal
  useEffect(() => {
    const base = () => `${useStore.getState().profile.displayName} · Principal Product Designer`;
    document.title = base();
    let n = 0, back: (() => void) | null = null;
    const onVis = () => {
      const name = useStore.getState().profile.displayName;
      if (document.visibilityState === 'hidden') {
        document.title = n++ % 2 ? 'Your followers are leaving' : `(1) ${name} is calling…`;
      } else {
        document.title = 'Welcome back — we changed a few things';
        back?.();
        back = after(4000, () => { document.title = base(); });
      }
    };
    document.addEventListener('visibilitychange', onVis);
    const unsub = useStore.subscribe((st, prev) => {
      if (st.profile.displayName !== prev.profile.displayName && document.visibilityState === 'visible' && !document.title.startsWith('Welcome')) document.title = base();
    });
    return () => { document.removeEventListener('visibilitychange', onVis); unsub(); };
  }, []);

  const banner = s.flags.bannerShown && !s.flags.finaleSeen && s.identity === 'morgan' && !s.cinematic;

  return (
    <>
      {banner && (
        <div className="banner" data-testid="finale-banner">
          <span>✦ Halo has finished optimizing your profile.</span>
          <button className="link" data-testid="review-changes" onClick={() => s.patch({ finaleOpen: true })}>Review changes</button>
        </div>
      )}
      <div className="pstrip" data-testid="profile-strip">
        <div className="pstrip-in">
          <span className="lp-logo"><span className="lp-mark">✦</span> Halo</span>
          <button className="pstrip-faq" data-testid="profile-faq" onClick={() => { if (!s.cinematic && !faq) setFaq(true); }}>FAQ</button>
        </div>
      </div>
      {s.unstyled ? (
        <RawProfile />
      ) : (
        <div className={s.gravity ? 'gravity' : ''}>
          <div className={`wrap${s.rearranged ? ' rearranged' : ''}`} data-testid="profile-root" data-glitch>
            <Header />
            <TabBar />
            <TabContent />
            <div className="footer fall">
              <span>© Morgan Vale · Profile managed by Halo</span>
              <button
                className="link" style={{ fontWeight: 500 }} data-testid="start-over"
                onClick={() => { s.resetAll(); try { sessionStorage.removeItem('halo:view'); } catch { /* ignore */ } location.reload(); }} // resetAll writes the fresh state, so a late persist can never bring the old one back
              >Start over</button>
            </div>
          </div>
        </div>
      )}
      {faq && <FaqSequence onDamage={damageProfile} onProfile={closeFaq} />}
      <BioModal />
      <ResumeModal />
      <FinaleModal />
      <ChatSheet />
      <CinematicHost />
      <ActivityVideos />
      <Glyphs />
      <Toasts />
    </>
  );
}

export default function App() {
  const view = useStore((s) => s.view);
  if (view === 'landing') {
    return (
      <>
        <Landing />
        <Toasts />
      </>
    );
  }
  return (
    <div className="enter-profile">
      <ProfileApp />
    </div>
  );
}
