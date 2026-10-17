# Agent log (autonomous build)

- M1 Scaffold: Vite + React + TS + Framer Motion + Zustand + Playwright. Plain CSS tokens instead of Tailwind (fewer moving parts).
- M1 Self-review of the first screenshots: header text overlapped the cover banner edge. Fix: pushed the identity block below the banner.
- M2 Laws 1–5 implemented; all passed except two test-harness issues: Law 4 needs a paused fake clock (`clock.install` keeps ticking), and a stale preview server served an old build (config now always rebuilds).
- Finding: label drift changed the letter count during Law 2 saves. Fix: law events no longer trigger drift (drift applies on tab navigation and other actions) so "exactly one letter per save" is verifiable.
- Finding: the profile-views popover covered the tab bar and blocked clicks. Fix: opens beside the stat, closes on outside click, auto-closes after 4s.
- Video: no real asset yet, so a placeholder webm is generated with Playwright's recorder (`scripts/gen-placeholder-video.mjs`); `intrusion.mp4` takes priority when present. Missing-file fallback tested via a 404 route.
- Hardening: 300-action seeded monkey test, then Laws 1, 2, 3, 4, 5 re-verified on the resulting state; safety test shows no external requests, dialogs, downloads or mailto.
- Proof: `npm run proof` saved 16 screenshots and a recording of the full journey.
