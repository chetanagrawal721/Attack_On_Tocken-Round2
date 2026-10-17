# HALO — The World's Worst Profile Page

A premium-looking profile for a fictional designer (Morgan Vale) that is "managed" by **Halo**, an overconfident AI career agent. Everything hostile is Halo "helping". All chaos is simulated inside the page; nothing touches the network, the filesystem or your device.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build && npm run preview   # http://localhost:4173
```

URL helpers: `?reset=1` wipes saved state, `?seed=42` makes all randomness repeatable, `?fast=1` compresses the two cinematics (never the Follow timer), `?test=1` exposes `window.__halo` for tests.

## WHERE TO ADD YOUR VIDEOS

Drop your files into `public/media/` using these names. `.mp4` is tried first, then the generated `.webm` placeholder, then an animated fallback (it can never crash).

| Where it plays | File |
|---|---|
| *(unused now: Profile button shows only the red alert)* | `public/media/galat-ghanta.mp4` |
| *(unused now: Get Started shows the error-crash animation instead)* | `public/media/get-started.mp4` |
| Profile page, **Email** button: plays in full after you press **Accept** | `public/media/intrusion.mp4` |
| Profile page, **Change Photo**: plays inside the avatar frame, then pauses on the last frame | `public/media/profile_clip.mp4` |
| Profile page, **Activity** tab: many copies pop up, drift and play with sound for ~4.6 s, then vanish | `public/media/activity.mp4` |
| Optional caller tone for the call (a built-in phone ring is used if missing) | `public/media/ringtone.mp3` |

- Config for all three: `src/config/videoEvents.ts` (filenames, sound, max duration).
- The two landing videos always play to the end, then return to the landing page. They play with sound (the click allows it).
- Email → phone rings (caller tone) → Accept/Decline → the video plays to the very end with sound (no skipping) → a plane crashes across the page, explosion, the page falls apart and re-forms → back on the profile page.
- Regenerate placeholders: `node scripts/gen-placeholder-video.mjs`.
- Avatar: overwrite `public/media/avatar.svg`. Only use a real person's photo with their consent.

## WHERE TO ADD YOUR SOUNDS

Drop mp3 files into `public/media/` with these exact names. If a file is missing, a built-in synthesized sound plays instead. Config: `src/config/sounds.ts`.

| When | File |
|---|---|
| FAQ clicked: alert music, loops through the whole attack, quieter under the demand, stops when you leave | `public/media/faq-alert.mp3` |
| Yes pressed: the gun fires (plays on the muzzle flash) | `public/media/gunshot.mp3` |
| Landing **Profile** clicked: plays for the whole red alert until it ends | `public/media/profile-alert.mp3` |
| Email call ended: plane crash sound (its loudest moment is synced to the explosion) | `public/media/plane_crash.mp3` |
| Email call on the profile: caller tone | `public/media/ringtone.mp3` |

## The flow

1. **Landing page** (clean, trustworthy). **Profile** button: red alert "YE NI DABANA THA!" only → back to landing.
2. **Get Started**: error windows multiply → blue screen → CRT-off crash → back to the landing page.
3. **FAQ** (landing nav/hero; the only way into the profile): "Loading FAQ…" → glitch → a centered "HALO SECURITY — INTRUSION DETECTED" window deleting files (simulated) while the page behind disappears → black → chaos → the demand. **Yes** = the profile opens. **No** = simulated gunfire + gunshot sound, then once the gun sound has finished a warning pops up ("Nahi bologe to maar diye jaoge. Soch lo ek baar.") and the Yes / No question comes back. This is the only security-style attack in the app.
4. **Profile** (all 5 Chaos Laws intact), with different, non-security chaos: Change Photo: the profile picture suddenly pops out of existence and `public/media/profile_clip.mp4` plays inside the avatar frame, then pauses on its last frame (the name still changes, the original `<img>` is never touched); the Follow button never changes, but a hint beside it drains, then shows a 💔 "Halo unfollowed them"; skill chip = A/B-test variants; Following stat = layout rearranges; View all files = "Does this spark joy?" tidy-up; the Case Studies/Evidence tab has exhibit stamps, cards that dodge, a viewer that opens the wrong study with metrics trending down, and a shuffle on close; interrupted navigation; phantom notification; clicking **Activity** makes ten copies of `activity.mp4` pop up, drift around and play with sound for ~4.6 s; blocked Email after the call; strange visitors; chaotic Settings and a fleeing Delete account button.
5. Everything is simulated and recovers automatically. Nothing real is deleted or accessed.

URL helpers: `?landing=1` forces the landing page in test mode (`?test=1` otherwise starts on the profile), `?view=profile` jumps to the profile.

## Docs

- [`PROMPT_LOG.md`](PROMPT_LOG.md): every prompt given to the agent, in order, with what was built for each.
- `docs/CONCEPT_AND_STRATEGY.md`, `docs/MASTER_PROMPT.md`, `docs/CONSTRAINT_MAP.md`, `docs/AGENT_LOG.md`.

## Tests and proof

```bash
npm run typecheck
npm run test:unit
npm run test:e2e     # laws, video, cleanup, finale, monkey test, safety, visual
npm run proof        # screenshots in proof/screens, recordings in proof/videos
```

## Spoiler map (for judges) — where each law lives

| Law | Code | Test |
|---|---|---|
| 1 Change Photo renames you | `src/chaos/law1Photo.ts`, `changePhoto` in `src/state/store.ts` | `tests/e2e/law1.spec.ts` |
| 2 Edit Name opens Bio; each save erodes a letter | `src/chaos/law2Erosion.ts`, `BioModal` in `src/components/Modals.tsx` | `law2.spec.ts` |
| 3 Follower count leaks | `FollowerCount` in `src/components/Header.tsx` | `law3.spec.ts` |
| 4 Gaslighting Follow | `FollowButton`, `followClick` / `resumeFollow` in store | `law4.spec.ts` |
| 5 Toggles flip each other | `src/chaos/law5Settings.ts`, `toggleSetting` in store | `law5.spec.ts` |

Original chaos: incoming call + video (`CinematicHost.tsx`), Halo Cleanup attack (`CleanupCinematic`), lying Activity log (`activityLies.ts`), Message that goes quiet (`ChatSheet`), Résumé pipeline (`Resume.tsx`), DELETE→DELIGHT (`DeleteModal`), profile-views popover, verified-badge decay and label drift (`entropy.ts`), tab-title betrayal (`App.tsx`), and the finale "You Are The Product" (`FinaleModal`, `finale.ts`).

## Design notes

- One persisted Zustand store (`halo:v1`) holds all state; chaos logic is pure functions in `src/chaos/`.
- Only Law 3 changes the follower count, only Law 4 changes the Follow text, only Law 5 changes settings (plus one scripted force at the end of the cleanup). Law events never trigger label drift, so each law is verifiable on its own.
- A cinematic lock prevents overlapping overlays. Timers run through one cancellable scheduler. `prefers-reduced-motion` turns shake/gravity into near-instant transitions.
- Docs: `docs/CONCEPT_AND_STRATEGY.md`, `docs/MASTER_PROMPT.md`, `docs/CONSTRAINT_MAP.md`, `docs/AGENT_LOG.md`.
