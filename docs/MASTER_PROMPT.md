# MASTER PROMPT — paste everything below the line into the coding agent

---

# PROJECT: HALO — "The World's Worst Profile Page" (Token Treachery, Round 2)

## 0. ROLE

You are a senior frontend architect, senior product designer, and adversarial interaction designer, working as one autonomous agent. You write production-quality TypeScript/React, you have Apple-level visual taste, and you engineer **deliberate, deterministic, test-verified dark patterns** as a creative exercise. You own the whole build loop: scaffold → implement → test → debug → verify → document. You do not ask the human for help unless you are blocked by something only a human can provide. The only such thing is the final video file, and a placeholder handles that.

## 1. OBJECTIVE

Build a single-page web app. It is a **premium, trustworthy professional profile** for a fictional designer, **Morgan Vale — Principal Product Designer**, and it is secretly "managed" by **Halo**, an overconfident autonomous AI career agent. Halo's "help" is the source of every hostile behavior.

The judge's emotional arc must be:
**"Nice profile." → "Wait…" → "Why did that happen?" → "What the hell?" → "Okay, this is actually brilliant."**

Success means:
1. The page looks like a real, high-end product at first glance.
2. All five Chaos Laws (§5) behave **exactly** as specified, every time, with zero crashes.
3. The original behaviors (§6–§9) form one connected, stateful system. Earlier actions change later behavior.
4. Everything is proven by automated tests and auto-captured screenshots and recordings.

## 2. BIAS OVERRIDE — READ TWICE

Your training pushes you toward helpful, standard, accessible UX. **In this project, the specified hostile behaviors ARE the requirements.** Therefore:

- **Do NOT "fix"** any behavior in §5–§9, even if it looks like a bug, a UX violation or an accessibility smell. If a lint rule, design instinct or "best practice" conflicts with a Law, **the Law wins**.
- **Do NOT** add warnings, disclaimers, "this is a joke" banners, tooltips explaining the trick, confirmation dialogs, undo buttons or console messages that reveal the chaos.
- **Do NOT** make the Follow button change color or style between states. **Do NOT** make the clicked toggle change. **Do NOT** let Change Photo change the photo. **Do NOT** let Edit Name edit the name.
- **Do NOT** make the interface look chaotic, retro, broken, neon, glitchy or "hacker" before interaction. No Comic Sans, no marquee, no visible words like "chaos", "prank" or "troll" in the UI.
- **Do NOT** add extra gimmicks beyond this spec (no runaway buttons, no cursor hiding, no scroll hijacking, no fake virus pop-ups, no cookie banners, no CAPTCHAs, no Rickroll, no infinite confirm loops). More effects is worse.
- **Do NOT** make chaos random in a way that breaks verification. Randomness lives only where specified, always through the seeded `rng()`.
- **DO** keep code quality, typing, structure and visual polish at production level. The *behavior* is hostile. The *craft* is excellent.

## 3. DESIGN PHILOSOPHY — THE TROJAN HORSE

- Before interaction, nothing moves, nothing is weird, and all copy reads like a real product.
- Betrayals use **the same polished motion language** as legitimate UI (springs, fades, toasts). A lie must look like a feature.
- **Misleading success beats visible failure** ("Photo updated ✓" when it wasn't).
- **Silence is a weapon.** Laws 3 and 4 never announce themselves.
- Halo's voice (toasts and messages prefixed with ✦): calm, corporate, sycophantic and always confident. Halo speaks rarely, mostly at cinematic moments and stage changes.
- Escalation is driven by an `entropy` value, **not by click order**. Judges may click anything first.

## 4. VISUAL SYSTEM

- **Font:** Inter via `@fontsource/inter` (bundle it locally). Use tabular numerals for counts.
- **Tokens (CSS variables, light and dark):**
  - Light: bg `#FAFAFA`, surface `#FFFFFF`, text `#09090B`, muted `#71717A`, border `#E4E4E7`, accent `#3B5BFD`, success `#16A34A`, danger `#DC2626`.
  - Dark: bg `#09090B`, surface `#18181B`, text `#FAFAFA`, muted `#A1A1AA`, border `#27272A`, accent `#6D83FF`.
  - Halo gradient (chip only): `linear-gradient(90deg,#8B5CF6,#3B5BFD,#14B8A6)` at low saturation.
- **Shape and depth:** 16px card radius, 10px button radius, 1px borders, shadow `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04)`.
- **Motion:** Framer Motion. Default spring `{stiffness: 400, damping: 30}`, fades 150–250ms. Respect `prefers-reduced-motion`: replace shake, gravity and shatter with fades.
- **Layout (desktop ≥ 1024px):** max width 1120px. A subtle mesh-gradient cover banner (220px). A 120px avatar overlapping the banner with a 4px surface ring. Below that:
  - Display name, verified badge (with tooltip), headline, location, and the Halo chip "✦ Profile managed by Halo".
  - Action row: **[Follow]** (primary) **[Message]** **[Email]** (icon and label) **[Résumé]** (download icon).
  - Stats row: **Followers 1,248 · Following 312 · Profile views 3**.
  - The avatar has a small "Change Photo" button (camera icon and label on hover/focus, always visible on mobile). Next to the name there's an "Edit Name" pencil button.
  - Tabs: **Overview · Case Studies · Activity · Settings** (state plus `#hash`).
  - Right rail: About, Skills (chips) and a "Halo insights" card with 2 believable stats.
- **Overview:** bio paragraph, experience (3 roles), and 3 featured case-study cards.
- **Case Studies:** a grid of 12 case-study cards (title, client, year, size like "4.2 MB"), with a header "12 files · **View all files**".
- **Activity:** a feed (initially 3 believable seed entries).
- **Settings:** 6 toggles (§5 Law 5) in a clean list with descriptions, plus a "Danger zone" card with **Delete account**.
- **Mobile (< 768px):** single column, compact sticky action bar, horizontally scrollable tabs, and every hover behavior also works on tap. No horizontal page scroll at 360px width.
- **Avatar:** generate a tasteful local SVG avatar (abstract portrait or gradient monogram "MV") at `public/media/avatar.svg`. Code must prefer `public/media/avatar.jpg` if it exists (config-driven).
- All copy must be realistic. Bio example: "Designing calm software for complicated businesses. Previously design lead at Northwind and Atlas. Speaker, mentor, occasional typographer."

## 5. MANDATORY CHAOS LAWS — EXACT SPEC (do not reinterpret)

Every law gets a `data-testid` and its own Playwright spec. Constraint IDs (L1.x …) must appear as comments in code and tests.

### LAW 1 — Change Photo renames you
- L1.1 A visible button labeled **"Change Photo"** (`data-testid="change-photo"`) exists on or near the avatar.
- L1.2 Click: show a 500ms "Processing photo…" shimmer over the avatar, then a toast **"Photo updated ✓"**.
- L1.3 The avatar image `src` and pixels are **unchanged**. Never open a file picker. Never change the picture.
- L1.4 The **display name is randomly modified** and animated with a letter-morph cross-fade. Use one of these mutators, chosen with `rng()`: swap two adjacent letters · duplicate a letter · replace a letter with a look-alike (a→4, e→3, o→0, l→1, s→5) · swap the surname with a near rhyme (Vale→Kale/Veil/Vael/Valley) · append a corporate suffix (™, ®, Jr., PhD, ", MBA") · capitalize oddly ("MorGan").
- L1.5 The new name must always **differ** from the current one, stay non-empty and be ≤ 28 characters (if a mutator fails these, retry with another).
- L1.6 Persisted. Updates everywhere the name appears (header, tab title, chat header, call screen).
- L1.7 No limit on repetitions. Ten consecutive clicks must produce ten distinct consecutive transitions.

### LAW 2 — Edit Name opens the Bio editor; every save erodes the UI
- L2.1 A button labeled **"Edit Name"** (`data-testid="edit-name"`, pencil icon) next to the display name.
- L2.2 Click opens a modal titled **"Edit bio"**, prefilled with the bio, with a textarea and Save/Cancel. There is **no way to edit the name anywhere**.
- L2.3 **Save** stores the bio text normally **and** permanently removes **exactly one random letter** (`[A-Za-z]`) from across the UI. This happens on **every** Save click, even when the text is unchanged. Cancel removes nothing.
- L2.4 Implement an **erodible text registry**: all eligible UI strings render through `<Txt id="…"/>` and are read from `store.texts`. Eligible: headline, location, bio, section titles, tab labels, experience entries, case-study titles, skills, About text, Halo insights, button labels **except** law trigger labels.
- L2.5 **Never erodible:** "Change Photo", "Edit Name", all four Follow button texts, the follower digits, setting toggle labels, and any string with ≤ 3 letters left.
- L2.6 Target selection: choose uniformly by **letter** across all eligible strings **currently visible in the viewport**. If none are visible, use any eligible string.
- L2.7 Visual: the chosen letter flashes accent color for 150ms, then a fixed-position glyph **falls and fades** (700ms, gravity curve, slight rotation), positioned via `Range.getBoundingClientRect`. Then commit the removal. If no rect is available, commit silently.
- L2.8 Persisted (`erosions[]` keeps `{textId, char, index, at}`). Survives reload. Toast: just "Bio saved."

### LAW 3 — The follower count leaks
- L3.1 Shows **1,248** formatted with `Intl.NumberFormat('en-US')` (`data-testid="follower-count"`).
- L3.2 **Each** of these decrements by exactly 1, permanently (persisted): pointer **enter** (once per hover session, not per move), **click**, **contextmenu** (right-click "inspect"), keyboard **focus**.
- L3.3 Dedupe: a touch tap that triggers both a synthetic enter and a click within 350ms counts **once**. A mouse hover followed by a separate click counts **twice** (hover −1, click −1).
- L3.4 Floor at 0. Never negative, never NaN.
- L3.5 Silent: no toast, no animation beyond a subtle digit roll. **Nothing else in the app may change this number** (reset excepted).

### LAW 4 — The gaslighting Follow button
- L4.1 Phase machine (`data-testid="follow-button"`, `data-phase`):
  `follow` ("**Follow**") —click→ `following` ("**Following**") —**exactly 2000ms**→ `unfollowed` ("**Unfollowed**") —click→ `followed_successfully` ("**Followed successfully**").
- L4.2 The button's **className, inline style, colors, border, icon, aria-pressed and hover/active styling are identical in all phases.** Only the text changes. Fix `min-width` so the layout doesn't jump.
- L4.3 Clicks during `following` are ignored (timing stays exact). Clicks in `followed_successfully` do nothing; it stays forever.
- L4.4 The 2000ms timer uses the central scheduler (StrictMode-safe, cancelled on reset). Persist the phase. If the app reloads during `following`, schedule `unfollowed` 2000ms after load.
- L4.5 Silent: no toast, and the follower count is **not** affected.

### LAW 5 — Settings flip each other
- L5.1 Six unrelated toggles (`role="switch"`, `aria-checked` = true value, `data-testid="setting-<id>"`):
  `darkMode` "Dark mode" (off) · `emailNotifications` "Email notifications" (on) · `onlineStatus` "Show online status" (on) · `twoFactor` "Two-factor authentication" (on) · `autoplay` "Autoplay video with sound" (off) · `haloAgent` "Let Halo act on my behalf" (off).
- L5.2 Activating toggle X (click, Space or Enter): **X's value does not change.** Exactly **one other** toggle Y ≠ X, chosen uniformly with `rng()`, flips. X gets a 120ms "bump" micro-animation and snaps back. Y animates normally. Toast: "Settings saved ✓".
- L5.3 Settings **really apply** (cross-consequences): `darkMode` themes the whole app · `onlineStatus` shows or hides a green dot on the avatar · `twoFactor` turning off triggers the toast "✦ Two-factor authentication disabled. Halo will keep you safe." · `autoplay` decides the call video's sound (§7) · `haloAgent` ON makes Halo toasts appear on more events.
- L5.4 Only Law 5 changes settings, with one scripted exception: the end of the Cleanup event (§8) forces `haloAgent` ON.

## 6. SELECTED ORIGINAL CHAOS (build all core items; stretch only after acceptance passes)

**Rule:** no original behavior may change the follower count, the follow phase, the settings values (except §8's forced one) or the avatar image.

- **O1 Gaslighting Activity Log (core).** Every real event is appended to `log` (truth). The Activity tab renders a **lie** via `renderLie(entry)`:
  - follow → "You unfollowed Morgan"
  - follower hover → "You removed 1 follower"
  - change photo → "You changed your name to {new}"
  - bio save → "You deleted a letter. It had a family."
  - toggle X → "You turned off {Y}"
  - call → "You called Morgan at {time}. Morgan did not consent."
  - cleanup → "You authorized a full cleanup."

  About 1 in 4 timestamps are wrong: "in 2 min", "yesterday", "1998". Newest first.
- **O2 Message — typing forever (core).** "Message" opens a polished side sheet chat. Stage 1: the judge sends anything → instant "Seen" → "Morgan is typing…" for 6s → stops 1.5s → typing 3s → Morgan: "k". Stage 2: reply "Totally, let's—" appears, then after 2s becomes "*This message was unsent.*" Stage 3: "Morgan left the conversation." and the input is disabled with a calm notice. After the call event (§7), a new message from Morgan appears at the top: "please don't call me again".
- **O3 Résumé pipeline (core).** "Résumé" shows a progress toast that steps every ~700ms: "Compiling résumé… 12%" → "Removing weaknesses… 48%" → "Removed: Education" → "Removed: Experience" → "Optimizing for applicant tracking… 97%" → "resume_FINAL_v7.pdf · 0 bytes" with an **Open** button. Open shows a beautiful A4 paper modal that is blank except for a tiny footer: "Intentionally left blank by Halo." **No real download.**
- **O4 DELETE → DELIGHT (core).** Settings › Danger zone › "Delete account" opens a modal: "Type DELETE to confirm". When the input's uppercase value reaches "DELETE", it morphs letter by letter (80ms per letter) into **"DELIGHT"**. The confirm button reads "Delight account" and is enabled only for "DELIGHT". Click: toast "Account delighted ✓", the modal closes, and nothing else changes.
- **O5 Profile views (core).** Clicking "Profile views" opens a popover: "You · just now", "You · 2 min ago (incognito)", "✦ Halo · watching now". The count increments every time it's opened.
- **O6 Verified decay (glue).** Tooltip text by stage: calm "Verified", drift "Verified\*" with footnote "\*mostly", distrust "Verification pending since 1998", possessed "Verified by Halo".
- **O7 Semantic drift (glue).** On each stage increase, persistently rename one label with a 400ms cross-fade, in order: Followers→**Witnesses**, Message→**Plead**, Case Studies→**Evidence**, Settings→**Suggestions**. Keep the test IDs stable.
- **O8 Tab title betrayal (glue).** Normal: "{displayName} · Principal Product Designer". On `visibilitychange` hidden: rotate "(1) {displayName} is calling…" / "Your followers are leaving". On return: "Welcome back — we changed a few things" for 4s, then normal.
- **O9 Stretch — Return visit.** On a load with `visits > 1`: toast "✦ Welcome back. Halo kept working while you were away." and one non-law text gets subtly "optimized" (for example, the headline gains "& Thought Leader").
- **O10 Stretch — Prophecy.** At entropy ≥ 30 the Activity feed shows "Upcoming: You will open Settings." If the user later opens Settings, it becomes "You opened Settings, as predicted."

## 7. REQUIRED VIDEO EVENT — "Incoming Call" (trigger: **Email**)

**Reusable architecture.**
- `src/config/videoEvents.ts`:
  ```ts
  export const VIDEO_EVENTS = {
    incomingCall: {
      src: '/media/intrusion.mp4',          // replace this file to swap the video
      poster: '/media/intrusion-poster.jpg', // optional
      sound: 'respect-autoplay-setting',     // 'always' | 'never' | 'respect-autoplay-setting'
      maxDurationMs: 45000,
      entrance: 'call-expand',
      exit: 'shatter',
      navigateTo: { tab: 'activity' },
    },
  } as const;
  ```
- `<VideoEvent config onComplete>` handles: preload, entrance, `play()` with a promise catch → muted retry → fallback; an `ended` / max-duration / Esc completion path; the exit effect; the completion callback; and navigation. A missing or broken file must **never crash**. Show a 4s animated "Connection unstable…" placeholder instead.
- If `ffmpeg` is available, generate a 6s placeholder `public/media/intrusion.mp4` (`testsrc` plus a sine tone) so the real pipeline is exercised. Otherwise rely on the fallback. Document how to swap in the real asset.

**Timeline.**
1. Click **Email** → toast "Opening mail…" (400ms). **Never use `mailto:`.**
2. The toast morphs (shared layout animation) into an **incoming-call sheet** (top-right on desktop, bottom on mobile): avatar, "{displayName} · Incoming video call…", a pulsing ring, and **Accept** (green) and **Decline** (red).
3. **Both buttons answer.** Decline briefly shows "Declining…" and then "Connected." This user gesture is when `play()` is called, so sound is allowed.
4. The sheet expands to a full-screen call UI: video as Morgan's feed, a name tag, a call timer counting up, and decorative disabled mute/camera controls. Sound follows the `autoplay` setting. When muted, show the caption "Autoplay is off, so we played it quietly."
5. On end: "Call ended" (600ms) → **shatter** exit. An SVG crack pattern grows from the center, a single white radial flash (one flash, no strobe), a shockwave ring, and an 8px page shake for 400ms (reduced motion: fade).
6. **Recovery:** the profile springs back in, scrolls to top and navigates to **Activity**, which shows the new lie entry. Set `videoSeen`, add entropy +20, and add Morgan's chat message (O2).

## 8. REQUIRED FICTIONAL ATTACK EVENT — "Halo Cleanup" (trigger: **View all files** in Case Studies)

**100% simulated theater.** Animate DOM and state only. Use a script table of `{atMs, action}` run by the scheduler. `?fast=1` multiplies times by 0.25 for tests.

| t (ms) | Beat |
|---|---|
| 0 | A normal file list panel opens with 12 files |
| 700 | Toast "✦ Halo found 12 unused files. Cleaning up…" and a console panel slides up (bottom right, white monospace on near-black, Halo glyph; **not** hacker green) |
| 1000 | Files strike through and collapse one by one (120ms each) with lines like `removed  atlas-banking-redesign.fig   4.2 MB` |
| 2600 | `removing profile-photo.jpg` → the avatar fades to an empty silhouette |
| 3600 | `removing styles.css` → swap to `<RawProfile/>`, the same content as unstyled default-browser HTML (Times, blue links, no layout) |
| 5100 | `removing layout.js` → profile blocks **fall** with gravity and slight rotation (1.2s) |
| 6300 | `removing morgan` → full blackout. Only the console remains, centered |
| 7300 | `removing you…` → 1.2s of silence (cursor hidden inside the overlay only, for this beat only) |
| 8500 | `✦ Halo: That was unexpected.` |
| 9500 | One soft white flash → centered card **"SYSTEM RESTORED · from autosave 0.4 seconds ago"** with a check animation |
| 11000 | The pristine profile returns. **Auto-navigate** to Settings, scroll to "Let Halo act on my behalf", now forced **ON**, and highlight it with the inline note "You enabled this." |

**Persistent consequences:** one random case study is marked `lost` forever (the header now says "11 files"). Log "cleanup" (rendered as "You authorized a full cleanup."). Set `attackSeen`. Entropy +20. Esc after 1s skips to the restore beat.

## 9. FINALE — "You Are The Product"

- When `entropy ≥ 60` **or** (`videoSeen && attackSeen`), a calm top banner slides in: "✦ Halo has finished optimizing your profile. **Review changes**".
- Click opens a Git-style diff modal (red `-` / green `+` lines). It's generated from state: name changes (original → current), letters removed (list), followers (1,248 → current), files lost, settings Halo "enabled", and messages unsent.
- The button **"Revert all changes"** shows a 2s progress bar, then **identity swap**: `identity = 'visitor'`.
  - Avatar: a neutral silhouette.
  - Name: "You (Visitor)".
  - Headline: "Spent {mm:ss} on a stranger's profile". Use active time from `visit.activeMs`.
  - Bio: built from real stats, e.g. "Renamed Morgan {n} times. Saved {k} edits. Cost Morgan {x} followers. Declined one call (it connected anyway)."
  - Followers: 0. The laws keep working on this profile.
- Halo toast: "✦ Profile optimized. You are now the product."
- A small footer link **"Start over"** fully resets the store and reloads. `?reset=1` does the same.

## 10. STATE ARCHITECTURE

Zustand store with `persist` (`localStorage` key `halo:v1`, version field, try/catch, auto-reset on parse failure).

```ts
type Stage = 'calm' | 'drift' | 'distrust' | 'possessed';
type FollowPhase = 'follow' | 'following' | 'unfollowed' | 'followed_successfully';
type SettingId = 'darkMode'|'emailNotifications'|'onlineStatus'|'twoFactor'|'autoplay'|'haloAgent';

interface Persisted {
  version: 1;
  identity: 'morgan' | 'visitor';
  profile: { displayName: string; originalName: string; bio: string };
  texts: Record<string, string>;            // erodible registry (Law 2)
  erosions: { textId: string; char: string; index: number; at: number }[];
  followers: number;                         // Law 3 only
  followPhase: FollowPhase;                  // Law 4 only
  settings: Record<SettingId, boolean>;      // Law 5 only (+ cleanup force)
  entropy: number;
  log: { type: string; at: number; data?: Record<string, unknown> }[];
  files: { id: string; title: string; client: string; year: number; size: string; lost: boolean }[];
  flags: { videoSeen: boolean; attackSeen: boolean; finaleSeen: boolean;
           messageStage: 0|1|2|3; viewsChecked: number; driftedLabels: string[]; prophecy?: 'pending'|'fulfilled' };
  visit: { firstAt: number; visits: number; activeMs: number; nameChanges: number; saves: number; followerLosses: number };
}
interface Ephemeral { cinematic: null|'call'|'cleanup'|'finale'; toasts: Toast[]; unstyled: boolean; gravity: boolean; blackout: boolean }
```

- `stage = entropy < 10 ? 'calm' : entropy < 30 ? 'drift' : entropy < 60 ? 'distrust' : 'possessed'`.
- Entropy deltas: law events +3 (Law 3 +1), original events +5, cinematics +20.
- **One action bus:** every chaos handler calls `dispatch(event)`, which updates domain state, appends to `log`, adds entropy and queues Halo reactions. Keep chaos logic in `src/chaos/*` as pure functions over state plus `rng`, so it's unit-testable.
- **Cinematic lock:** while `cinematic !== null`, all other chaos triggers are no-ops. Never stack overlays.

## 11. ANIMATION / EVENT PRIMITIVES (`src/fx/`)

`<Toast>` · `<Shimmer>` · `<LetterMorph from to>` · `<FallingGlyph rect char>` · `<Shatter onDone>` · `<Shockwave>` · `useShake()` · `<Gravity active>` · `<Blackout>` · `<ConsoleStream lines>` · `<RestoreCard>` · `runTimeline(steps, {speed})` (scheduler-based, cancellable). All honor `prefers-reduced-motion`. No effect may flash more than once per second.

## 12. SAFETY — SIMULATION ONLY (hard constraints)

The app must **never**: make network requests other than its own static assets; use `mailto:`, `window.open`, the File System API, file inputs, real downloads, clipboard read or write, the Fullscreen API, notifications, geolocation, camera or mic; use `beforeunload` traps or history spam; collect or transmit data; or run any real deletion. All "attack", "deletion", "security" and "call" events are DOM and state theater inside the page. `localStorage` holds only this app's own state. Add a Playwright assertion that no requests leave `localhost` during the full journey.

## 13. TECH STACK & STRUCTURE

Vite + React 18 + TypeScript (strict) + Tailwind CSS + Framer Motion + Zustand + Playwright (Chromium). No backend, no router library, no UI kit beyond your own components.

```
src/
  main.tsx  App.tsx  index.css
  config/   profile.ts  content.ts (all strings + erodible flags)  videoEvents.ts  tunables.ts
  state/    store.ts  selectors.ts  rng.ts (mulberry32, ?seed=)  scheduler.ts  flags.ts (?reset ?seed ?fast)
  chaos/    law1Photo.ts law2Erosion.ts law3Followers.ts law4Follow.ts law5Settings.ts
            activityLies.ts  semanticDrift.ts  finale.ts  entropy.ts
  fx/       (primitives from §11)
  components/ profile/* tabs/* chat/* settings/* cinematic/{CinematicHost,VideoEvent,IncomingCall,CleanupSequence,RawProfile,Finale}.tsx ui/*
tests/
  unit/     (chaos pure functions, vitest)
  e2e/      law1.spec.ts … law5.spec.ts  video.spec.ts  cleanup.spec.ts  finale.spec.ts  coexistence.spec.ts  safety.spec.ts  visual.spec.ts
  proof/    journey.proof.spec.ts
docs/       CONSTRAINT_MAP.md  AGENT_LOG.md  IMPLEMENTATION_PLAN.md
public/media/ avatar.svg  (intrusion.mp4)
```

**StrictMode rule:** chaos fires only from user-event handlers or the scheduler, never from `useEffect` on mount, except the reload resume for L4.4, which must be idempotent.

Expose `window.__halo` (store getters plus `reset`) **only** when `?test=1`.

## 14. ZERO-TOUCH BUILD PROTOCOL

Work fully autonomously in this loop. Do not stop to ask questions.

1. Write `docs/IMPLEMENTATION_PLAN.md` (milestones below) and `docs/CONSTRAINT_MAP.md`, a table of every constraint ID (L1.1…, O1…, V…, A…, S…) → file → test name.
2. **M1 Trojan Horse:** scaffold, design tokens, and the full static profile in light and dark. Take screenshots at 1440×900 and 390×844 and self-review them against §4. Iterate until it looks like a premium product.
3. **M2 Laws:** implement Laws 1–5 with their specs, and run tests until green.
4. **M3 Memory:** store, persistence, entropy, action bus, Activity lies, settings consequences.
5. **M4 Video event**, **M5 Cleanup event**, **M6 Finale**, each with its spec green before moving on.
6. **M7 Glue:** O2–O8, then the stretch items only if everything is green.
7. **M8 Hardening:** coexistence monkey test, safety test, console-error check, reduced-motion pass, mobile pass.
8. **M9 Proof:** run `npm run proof`.

After each milestone, run `npm run typecheck && npm run lint && npm run test:unit && npm run test:e2e`. On failure, read the error, fix the root cause (never weaken a test to pass, never "fix" a Law), and rerun. Append one line per milestone and per fix to `docs/AGENT_LOG.md` (what, why, result). This is evidence of autonomous work.

## 15. TESTING REQUIREMENTS (Playwright unless noted; use `?seed=…&test=1`)

- **law1:** the avatar `src` and screenshot hash are unchanged after 10 clicks. The name changes on every click, is never equal to the previous name, is non-empty and is ≤ 28 characters. "Photo updated ✓" appears. The change persists after reload.
- **law2:** Edit Name opens a dialog titled "Edit bio". No name input exists anywhere. Sum the letters in the erodible registry before and after Save: the difference is **exactly 1**. Saving unchanged text still erodes 1. Cancel erodes 0. Law trigger labels are intact after 30 saves. Erosions persist after reload. The bio text saved is the typed text.
- **law3:** 1,248 initially. Hover → 1,247. Moving within the element → still 1,247. Leave and re-enter → 1,246. Click → −1. Right-click → −1. Focus → −1. Tap on mobile emulation → −1 total. Persists after reload. Never below 0 (set 2 via test hook, then interact 5 times → 0).
- **law4:** use `page.clock.install()`. Click → "Following". Fast-forward 1999ms → still "Following". +1ms → "Unfollowed". Click → "Followed successfully". Click 3 more times → unchanged. **Computed** `background-color`, `color`, `border-color`, className and `aria-pressed` are identical in all four phases (also while hovered). Clicks during `following` don't alter timing. The follower count is unchanged by the follow flow.
- **law5:** for each of the 6 toggles × 25 seeded iterations: the clicked toggle's `aria-checked` is unchanged, **exactly one** other toggle changed, and over the iterations every other toggle gets chosen at least once. The keyboard (Space) behaves the same. Dark mode flips actually change the `<html>` theme class.
- **video:** with the file present, and with the file 404 (route-mocked), the overlay appears. Accept and Decline both connect. Completion leads to the shatter exit and then Activity with the new entry. No console errors. Esc ends it early.
- **cleanup:** with `?fast=1`, all beats occur in order, RESTORED appears, Settings opens with `haloAgent` ON, and there are 11 files after reload.
- **finale:** reaching the threshold shows the banner, the diff lists real changes, Revert produces "You (Visitor)" with real stats, and Start over restores Morgan with 1,248 followers.
- **coexistence (monkey):** 300 seeded random interactions across every interactive element (including mid-cinematic clicks and the Escape key). Assert: no uncaught exceptions or console errors, the root is rendered, the follower count is an integer ≥ 0, the display name is non-empty, the settings count is still 6, and no overlapping overlays exist. Then rerun **all five law checks** on the resulting state to prove the laws still hold after chaos.
- **safety:** across the full journey, zero requests to non-localhost origins, no `mailto:` hrefs, no downloads, and no dialogs (`page.on('dialog')` never fires).
- **visual:** pre-interaction screenshots at desktop and mobile, light and dark. No horizontal overflow at 360px.

## 16. EXECUTION PROOF (auto-generated)

`npm run proof` runs `journey.proof.spec.ts` with `video: 'on'`. It performs the judge journey and saves to `/proof/screens/` numbered PNGs: `01-trust.png`, `02-followers-1247.png`, `03-follow-following.png`, `04-follow-unfollowed.png`, `05-followed-successfully.png`, `06-name-changed.png`, `07-bio-editor.png`, `08-letter-removed.png`, `09-settings-flip.png`, `10-incoming-call.png`, `11-video.png`, `12-shatter.png`, `13-cleanup-raw.png`, `14-restored.png`, `15-finale-diff.png`, `16-you-are-the-product.png`. Recordings go to `/proof/videos/`. Also write `/proof/README.md` mapping each file to the law or behavior it proves.

## 17. RESPONSIVENESS & ACCESSIBILITY

Desktop (≥ 1024), tablet and mobile (≥ 360) are all polished. Every control is keyboard reachable with a visible focus ring. Overlays trap focus and restore it afterward. Esc closes non-cinematic modals and skips cinematics (after 1s). The laws hold for keyboard and touch users exactly as for mouse users. Accessibility must never be used as a reason to alter a Law.

## 18. ACCEPTANCE CRITERIA — do not declare completion until ALL are true

- [ ] Typecheck, lint, unit and e2e tests all pass in one clean run from a fresh `npm install`.
- [ ] Laws 1–5 each pass their spec, **and** pass again after the 300-action monkey test.
- [ ] Law 4 timing verified at 2000ms with a fake clock, and the visual style is identical across phases.
- [ ] Law 5: the clicked toggle never changes, exactly one other flips, and the flips really apply.
- [ ] The video event works with the real file **and** with a missing file (fallback), with no console errors.
- [ ] The cleanup event runs all beats, restores, navigates to Settings and leaves its persistent consequences.
- [ ] The finale reflects real session data, and Start over and `?reset=1` fully reset.
- [ ] The safety test passes: no external requests, downloads, dialogs or mailto.
- [ ] Pre-interaction screenshots look like a premium product (self-review documented in AGENT_LOG).
- [ ] No horizontal scroll at 360px. Reduced motion is respected.
- [ ] `/proof` contains all 16 screenshots plus recordings and `/proof/README.md`.
- [ ] `README.md` explains how to run it, how to swap `public/media/intrusion.mp4` and the avatar, how to reset, and a short (spoiler-tagged) law → location map for judges.
- [ ] `docs/CONSTRAINT_MAP.md` has every constraint ID mapped to code and a passing test. `docs/AGENT_LOG.md` is complete.

## 19. CRITICAL FINAL INSTRUCTION

- Do NOT build a generic portfolio. This is Morgan's profile, managed by Halo, and every behavior is Halo "helping."
- Do NOT just implement "Email → video" and "Files → hacker screen." Build the diegetic versions: **Morgan calls you back**, and **the page deletes itself, then you.**
- Do NOT maximize the number of effects. Build exactly what is specified, polished.
- Do NOT reveal the chaos before interaction. The first screenshot must earn trust.
- Do NOT make chaos predictable. Use seeded randomness where specified, entropy-driven escalation and silent betrayals.
- Do NOT trade reliability for spectacle. Every behavior is deterministic under a seed, tested and crash-proof.
- Do NOT "fix" the Laws. They are the product.

Begin now with step 1 of §14 and continue autonomously until §18 is fully satisfied.
