import { useEffect, useState } from 'react';
import { useStore } from '../../state/store';
import { preloadSounds } from '../../fx/sfx';
import { FaqSequence } from './FaqSequence';
import { RedAlert } from './RedAlert';
import { ErrorCrash } from './ErrorCrash';

type Mode = null | 'alert' | 'crash' | 'faq';

/* ------------------------------------------------------------------ icons */
const I = (d: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d}</svg>
);
const ICONS = {
  spark: I(<><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 3v4M21 5h-4" /></>),
  chart: I(<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>),
  shield: I(<><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" /><path d="m9 12 2 2 4-4" /></>),
  bolt: I(<><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></>),
  users: I(<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4c2 .8 3.4 2.8 3.4 5.6" /></>),
  globe: I(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></>),
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>,
};

const FEATURES = [
  { icon: ICONS.spark, title: 'Profiles that manage themselves', body: 'Halo keeps your headline, bio and activity fresh, so you never have to think about it.' },
  { icon: ICONS.chart, title: 'Insight without effort', body: 'See who is looking, what resonates and when to reach out, all in one calm dashboard.' },
  { icon: ICONS.shield, title: 'Built for trust', body: 'Verified identity, private by default and designed to feel the same on every device.' },
  { icon: ICONS.bolt, title: 'Instant publishing', body: 'Update once and your profile, résumé and links stay in sync everywhere.' },
  { icon: ICONS.users, title: 'Made for teams', body: 'Shared brand kits, roles and approvals for studios and growing companies.' },
  { icon: ICONS.globe, title: 'Works everywhere', body: 'Fast on any device, accessible by default and available in 12 languages.' },
];
const STEPS = [
  { n: '01', t: 'Create your profile', b: 'Import from anywhere or start fresh. It takes about two minutes.' },
  { n: '02', t: 'Let Halo handle the details', b: 'Halo polishes wording, keeps work current and suggests what to highlight.' },
  { n: '03', t: 'Share with confidence', b: 'One link that always looks right, on every screen and in every inbox.' },
];
const STATS = [['120k+', 'Profiles managed'], ['98%', 'Customer satisfaction'], ['4.9', 'Average rating'], ['12', 'Languages']];
const QUOTES = [
  { q: 'I set it up on a Tuesday and haven’t touched my profile since. It just keeps improving.', n: 'Morgan V.', r: 'Principal Product Designer' },
  { q: 'Our whole studio looks consistent now. Onboarding new designers takes minutes.', n: 'Priya S.', r: 'Head of Design, Lumen Labs' },
  { q: 'The insights alone are worth it. I finally know which work gets noticed.', n: 'Daniel R.', r: 'Design Director, Atlas' },
  { q: 'Switching took an afternoon. Three months on, recruiters still tell us the profile page is what stood out.', n: 'Amara O.', r: 'Product Designer, Brightpath' },
  { q: 'Quietly excellent.', n: 'Jonas K.', r: 'Freelance Illustrator' },
];
const PLANS = [
  { name: 'Free', price: '$0', note: 'For individuals getting started', items: ['1 profile', 'Basic insights', 'Community support'] },
  { name: 'Pro', price: '$12', note: 'For professionals who share their work', items: ['Unlimited case studies', 'Advanced insights', 'Custom domain', 'Priority support'], hot: true },
  { name: 'Team', price: '$29', note: 'For studios and growing teams', items: ['Shared brand kit', 'Roles & approvals', 'SSO', 'Dedicated manager'] },
];
const LOGOS = ['Northwind', 'Atlas Financial', 'Lumen Labs', 'Brightpath', 'Civic Works'];
const TOTAL = 10; // fading sections (FAQ sequence)

export function Landing() {
  const [mode, setMode] = useState<Mode>(null);
  const [damage, setDamage] = useState(0);
  const [seen, setSeen] = useState({ alert: 0, crash: 0, faq: 0 });
  const setView = useStore((s) => s.setView);

  // gentle fade-up as sections enter the viewport (IntersectionObserver, transform + opacity only)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.rv'));
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    preloadSounds('profileAlert', 'faqAlert', 'gunshot');
    document.documentElement.dataset.theme = 'light';
    document.title = 'Halo — Profiles, handled.';
  }, []);

  const eyebrow = seen.faq ? 'Please do not click anything else.' : seen.alert + seen.crash ? 'Everything is working normally.' : 'New: Halo 2.0 is here';
  const gone = (i: number) => ((damage * TOTAL) / 8 >= i + 1 ? ' gone' : '');
  const back = (k: 'alert' | 'crash') => { setSeen((s) => ({ ...s, [k]: s[k] + 1 })); setMode(null); };
  const start = () => { if (!mode) setMode('crash'); };
  const faq = () => { if (!mode) setMode('faq'); };
  const noop = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className="landing" data-testid="landing">
      <div className="lp-body" data-glitch>
        <header className={`lp-nav lp-sec${gone(0)}`}>
          <div className="lp-wrap lp-nav-in">
            <a className="lp-logo" href="#" onClick={noop}><span className="lp-mark">✦</span> Halo</a>
            <nav className="lp-links" aria-label="Main">
              <a href="#features" onClick={noop}>Product</a>
              <a href="#customers" onClick={noop}>Customers</a>
              <a href="#pricing" onClick={noop}>Pricing</a>
              <button className="lp-link-btn" data-testid="nav-faq" onClick={faq}>FAQ</button>
            </nav>
            <button className="lp-profile" data-testid="nav-profile" aria-label="Profile" onClick={() => !mode && setMode('alert')}>
              <span className="lp-av">M</span>Profile
            </button>
          </div>
        </header>

        <main>
          <section className={`lp-hero lp-sec${gone(1)}`}>
            <div className="lp-hero-bg" aria-hidden />
            <div className="lp-wrap lp-herogrid">
              <div className="lp-copy">
                <span className="lp-pill" data-testid="lp-eyebrow"><i className="lp-dot" />{eyebrow}</span>
                <h1>Your profile,<br /><span className="lp-grad">handled.</span></h1>
                <p className="lp-sub">Halo is the calm, autonomous way to present yourself professionally. Set it up once and let it take care of the rest.</p>
                <div className="lp-cta">
                  <button className="lp-btn primary" data-testid="get-started" onClick={start}>Get Started <span className="lp-nest">{ICONS.arrow}</span></button>
                  <button className="lp-btn" data-testid="hero-faq" onClick={faq}>FAQ</button>
                </div>
                <div className="lp-micro">
                  <span>{ICONS.check} Free forever plan</span><span>{ICONS.check} No credit card</span><span>{ICONS.check} Set up in 2 minutes</span>
                </div>
              </div>

              <div className="lp-window" aria-hidden>
                <div className="lp-shell">
                  <div className="lp-wbar"><i /><i /><i /><span>halo.app/morgan</span></div>
                  <div className="lp-wbody">
                    <div className="lp-prev-cover" />
                    <div className="lp-prev-row">
                      <span className="lp-prev-av" />
                      <div className="lp-prev-id"><b>Morgan Vale</b><span>Principal Product Designer · Lisbon</span></div>
                      <span className="lp-prev-follow">Follow</span>
                    </div>
                    <div className="lp-prev-stats"><span><b>1,248</b> Followers</span><span><b>312</b> Following</span><span><b>3</b> Views</span></div>
                    <div className="lp-prev-grid"><i /><i /><i /></div>
                  </div>
                </div>
                <div className="lp-float f1"><span className="lp-fdot" />Profile strength <b>98%</b></div>
                <div className="lp-float f2">{ICONS.users}<span>14 recruiters viewed this week</span></div>
              </div>
            </div>
          </section>

          <section className={`lp-logos lp-sec${gone(2)}`} id="customers">
            <div className="lp-wrap">
              <div className="lp-cap">Trusted by teams at</div>
              <div className="lp-logo-row">{LOGOS.map((l) => <span key={l}>{l}</span>)}</div>
            </div>
          </section>

          <section className={`lp-features lp-sec${gone(3)}`} id="features">
            <div className="lp-wrap">
              <div className="lp-head rv"><span className="lp-kicker">Product</span><h2>Everything your profile needs</h2><p>Thoughtful defaults, quiet automation and zero busywork.</p></div>
              <div className="lp-bento rv">
                {FEATURES.map((f, i) => (
                  <div className={`card lp-feature b${i + 1}`} key={f.title}>
                    <div className="lp-ficon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p className="muted">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`lp-how lp-sec${gone(4)}`}>
            <div className="lp-wrap">
              <div className="lp-head rv"><span className="lp-kicker">How it works</span><h2>From sign-up to shared in minutes</h2></div>
              <div className="lp-steps rv">
                {STEPS.map((s) => (
                  <div className="lp-step" key={s.n}><span className="lp-stepn">{s.n}</span><h3>{s.t}</h3><p className="muted">{s.b}</p></div>
                ))}
              </div>
            </div>
          </section>

          <section className={`lp-stats lp-sec${gone(5)}`}>
            <div className="lp-wrap lp-stats-in rv">
              {STATS.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
            </div>
          </section>

          <section className={`lp-quote lp-sec${gone(6)}`}>
            <div className="lp-wrap">
              <div className="lp-head rv"><span className="lp-kicker">Customers</span><h2>Loved by people who care about craft</h2></div>
              <div className="lp-masonry rv">
                {QUOTES.map((q) => (
                  <figure className="card lp-qcard" key={q.n}>
                    <blockquote>“{q.q}”</blockquote>
                    <figcaption><span className="lp-av sm">{q.n[0]}</span><div><b>{q.n}</b><span>{q.r}</span></div></figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className={`lp-pricing lp-sec${gone(7)}`} id="pricing">
            <div className="lp-wrap">
              <div className="lp-head rv"><span className="lp-kicker">Pricing</span><h2>Simple, honest pricing</h2><p>Start free. Upgrade when you need more.</p></div>
              <div className="lp-grid3 lp-plans rv">
                {PLANS.map((p) => (
                  <div className={`card lp-plan${p.hot ? ' hot' : ''}`} key={p.name}>
                    {p.hot && <span className="lp-badge">Most popular</span>}
                    <h3>{p.name}</h3>
                    <div className="lp-price"><b>{p.price}</b><span>/month</span></div>
                    <p className="muted">{p.note}</p>
                    <ul>{p.items.map((it) => <li key={it}>{ICONS.check}{it}</li>)}</ul>
                    <button className={`lp-btn${p.hot ? ' primary' : ''}`} onClick={start}>{p.name === 'Free' ? 'Start free' : `Choose ${p.name}`}</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={`lp-band lp-sec${gone(8)}`}>
            <div className="lp-wrap lp-band-in rv">
              <div><h2>Ready when you are.</h2><p>Free for individuals. No credit card required.</p></div>
              <button className="lp-btn primary" onClick={start}>Get Started <span className="lp-nest">{ICONS.arrow}</span></button>
            </div>
          </section>
        </main>

        <footer className={`lp-foot lp-sec${gone(9)}`}>
          <div className="lp-wrap">
            <div className="lp-fcols">
              <div className="lp-fbrand"><a className="lp-logo" href="#" onClick={noop}><span className="lp-mark">✦</span> Halo</a><p className="muted">Profiles, handled.</p></div>
              <div><h4>Product</h4><a href="#" onClick={noop}>Features</a><a href="#" onClick={noop}>Insights</a><a href="#" onClick={noop}>Integrations</a></div>
              <div><h4>Company</h4><a href="#" onClick={noop}>About</a><a href="#" onClick={noop}>Careers</a><a href="#" onClick={noop}>Press</a></div>
              <div><h4>Resources</h4><a href="#" onClick={noop}>Help centre</a><a href="#" onClick={noop}>Guides</a><a href="#" onClick={noop}>Status</a></div>
            </div>
            <div className="lp-foot-in"><span>© Halo Labs</span><span className="muted">Privacy · Terms · Security</span></div>
          </div>
        </footer>
      </div>

      {mode === 'alert' && <RedAlert onDone={() => back('alert')} />}
      {mode === 'crash' && <ErrorCrash onDone={() => back('crash')} />}
      {mode === 'faq' && (
        <FaqSequence
          onDamage={setDamage}
          onProfile={() => { setMode(null); setView('profile'); }}
        />
      )}
    </div>
  );
}
