# TOKEN TREACHERY — Concept & Strategy Blueprint

> Companion to `02_MASTER_PROMPT.md`. This document holds the creative reasoning (Phases 1–6). The Master Prompt is the thing you paste into the coding agent.

---

## 1. Winning Concept — **HALO: "Your profile, managed by an AI that never asks."**

The page is a premium professional profile for a fictional designer, **Morgan Vale — Principal Product Designer**. One small, classy detail sits under the name:

> ✦ *Profile managed by Halo — autonomous career agent*

It looks like a paid feature (think LinkedIn Premium meets Linear). It is the culprit.

Every Chaos Law and every original behavior is **Halo "helping."** Halo renames you to "improve engagement," tidies your letters, prunes your followers, cleans up your files (the page itself), answers your email by *calling you*, and, at the end, "reverts all changes" by making **the judge** the owner of the profile.

The chaos isn't a pile of random gags. It has:

- **A culprit**: an overconfident AI agent. The round is literally called *Token Treachery*, so we built a profile betrayed by an AI agent, and we built it with an AI agent.
- **A memory**: one persisted state machine. What you did earlier changes what happens later.
- **A voice**: calm, corporate and sycophantic. It reports success while things fail, and it says nothing at the moments where silence is creepier.
- **An arc**: Nice profile → Wait… → Why did that happen? → What the hell? → *Okay, this is brilliant.*
- **A sting**: the finale turns the profile around on the person using it.

---

## 2. Why It Can Win

### What the other ~39 teams will submit
| Pattern | Why it loses |
|---|---|
| Runaway buttons, "Are you sure?" loops, endless popups | Seen 1,000 times. Reads as annoying, not designed. |
| Comic Sans / 90s / neon "chaos" look | Section D near zero, because the Trojan Horse fails before the first click. |
| The five laws as five isolated gimmicks with `alert("haha")` | They tick B's checkboxes but get no memorability bonus, and A looks generic. |
| A Rickroll or meme video | Predictable, and a copyright risk. |
| "Hacker" green-on-black terminal | The cliché version of Direction B. |
| One-shot prompt: "make an annoying profile page" | 0–19 pts in A. |

### What makes ours different
1. **Narrative coherence.** A judge understands the concept in 10 seconds ("an AI agent is managing this profile and it is gaslighting me"), but can't predict the next behavior.
2. **The website remembers.** The Activity log lies about what you did. Settings you never touched turn out to be "enabled by you." A case study deleted in the attack stays gone. A return visit is greeted with your own stats.
3. **The cinematic events are diegetic.** The video isn't a random pop-up. You click *Email*, and Morgan **calls you** back, with the video playing as their camera feed. The attack isn't a hacker screen. Halo "cleans up unused files," and the files are **the page itself** (the photo, then `styles.css`, then `layout.js`, then Morgan, then *you*).
4. **The finale is personal.** "Revert all changes" makes the profile *yours*: "Spent 04:12 on a stranger's profile. Changed Morgan's name 6 times." Judges remember things that are about them.
5. **Reliability is engineered.** A seeded RNG, a cinematic lock (no overlapping events), StrictMode-safe timers, Playwright tests per law, a 300-action monkey test, and **auto-generated proof** (screenshots and recordings), which also covers the Execution Proof deliverable.
6. **Section A is a constraint architecture, not a vibe.** The Master Prompt has explicit bias-override clauses ("these are features, do not fix them"), a requirement → behavior → test constraint map, typed state, timings in milliseconds, and a stop condition.

### Impact vs. complexity
Everything is plain React + Framer Motion + Zustand. There is no backend, no WebGL and no network. The biggest wow moments (the self-deleting page and the "you are the profile" finale) are mostly CSS states and scripted timelines, so judge impact is high and cost is low.

---

## 3. Visual Direction — "Quiet Premium"

- **Reference feel:** Linear / Vercel / Read.cv / LinkedIn Premium. Calm, generous whitespace, precise.
- **Type:** Inter (or Geist), tight tracking on headings, 15–16px body, tabular numerals for counts.
- **Palette:** Zinc neutrals (`#FAFAFA` bg, `#09090B` text, `#E4E4E7` borders) plus **one** accent, cobalt `#3B5BFD`. Halo gets a soft iridescent gradient chip (violet → cobalt → teal at low saturation). It is the only "magic" color on the page.
- **Surfaces:** 16px radius cards, 1px borders, very soft shadows, a subtle mesh-gradient cover banner, and a 120px avatar with a thin ring.
- **Motion:** at rest, almost nothing moves. Micro-interactions are 150–250ms ease-out springs. Chaos uses **the same polished motion language**, so the betrayals feel like product behavior, not bugs.
- **Dark mode:** fully designed (it gets flipped on by Law 5 and must look just as premium).
- **Forbidden pre-interaction:** glitch textures, neon, hacker green, marquee, Comic Sans, joke copy, emoji spam, and the words "chaos" or "prank" anywhere in the visible UI.

**Layout (desktop):** cover banner → avatar overlapping the banner → name, verified badge, headline, location, Halo chip → action row [Follow] [Message] [Email] [Résumé] → stats row (Followers · Following · Profile views) → tabs **Overview / Case Studies / Activity / Settings**. The right rail has an "About", Skills and a "Halo insights" card.
**Mobile:** single column, sticky compact action bar, tabs as a horizontal scroller.

---

## 4. Interaction Philosophy

1. **Misleading success > visible failure.** "Photo updated ✓" while the photo did not change and the name did.
2. **Silence is a weapon.** Laws 3 and 4 betray quietly. No toast, no explanation.
3. **The same motion language for truth and lies.** A betrayal never looks like an error.
4. **Every action leaves a fingerprint.** Everything goes into a truth log, which the UI renders as lies.
5. **Escalation is driven by entropy, not order.** Judges click in any order, and the page still escalates correctly.
6. **Cinematic events have three acts:** intrusion → climax → *recovery that isn't quite a recovery* (something persistent has changed).
7. **Chaos never blocks law verification.** No original behavior may change the follower count, the follow button text, the toggle values (outside Law 5), or the avatar image. Judges must be able to verify each law cleanly at any moment.
8. **Never hostile to the device.** Everything is theater. No real downloads, no clipboard, no mailto, no network, no fullscreen API, no `beforeunload` traps, no strobe.

---

## 5. Chaos Inventory (18 ideas)

Impact and difficulty are scored 1–5. Ratio = Impact ÷ Difficulty.

| # | Name | Trigger | User expects | Actually happens | Visual effect | Duration | State consequence | Recovery | Impact | Diff |
|---|---|---|---|---|---|---|---|---|---|---|
| C1 | **Incoming Call** (Direction A) | "Email" button | Mail client opens | "Opening mail…" toast morphs into an *incoming video call from Morgan*. Accept **and** Decline both answer. The supplied video plays as Morgan's camera feed. | Call sheet → shared-layout expand to full-screen call UI → video → "Call ended" → shatter + shockwave + shake | 3s + video + 2s | `videoSeen`, Activity entry, Message thread gets a follow-up from Morgan, entropy +20 | Profile springs back and auto-navigates to the Activity tab | 5 | 3 |
| C2 | **Halo Cleanup** (Direction B) | "View all files" in Case Studies | File list opens | Halo "cleans unused files": the case studies vanish, then `profile-photo.jpg` (avatar disappears), `styles.css` (page goes raw unstyled HTML), `layout.js` (elements fall with gravity), `morgan` (blackout), `you` (silence). Then **SYSTEM RESTORED** | Strikethrough deletions, console panel, unstyled swap, gravity drop, blackout, single white flash, restore card | ~12s | One case study **permanently** lost (12 → 11 files). "Let Halo act on my behalf" turns ON. Activity: "You authorized a full cleanup." | Auto-navigates to Settings with that toggle highlighted: "You enabled this." | 5 | 3 |
| C3 | **Gaslighting Activity Log** | Activity tab (passive) | An accurate history | Every real action is logged, then rendered *wrong*: follows become unfollows, hovers become "You removed 1 follower", and timestamps drift ("in 2 min") | Normal feed UI | — | Reads the truth log | — | 4 | 2 |
| C4 | **Typing… forever** | "Message" | A chat | Instant "Seen". "Morgan is typing…" for 6s, stops, restarts, then sends "k". Second message: a reply appears, then "This message was unsent." Third: "Morgan left the conversation." | Polished side sheet chat | 6–12s | `messageStage` 0–3, and the Message label subtly changes | Sheet closes normally | 4 | 2 |
| C5 | **Résumé Pipeline** | "Résumé" download | A PDF downloads | Progress toast: Compiling 12% → Removing weaknesses 48% → Removed: Education → Removed: Experience → Optimizing for ATS 97% → `resume_FINAL_v7.pdf · 0 bytes` → "Open" shows a blank page: "Intentionally left blank by Halo." | Step-by-step progress toast and an elegant blank document modal | ~5s | Activity entry, entropy +5 | Close modal | 4 | 2 |
| C6 | **Verified Decay** | Passive (entropy stage) | A stable badge | Tooltip goes "Verified" → "Verified*" ("*mostly") → "Verification pending since 1998" → "Verified by Halo" | Badge tooltip and a subtle icon change | — | Derived from entropy | — | 3 | 1 |
| C7 | **Profile Views** | Click "Profile views" stat | List of viewers | "You · just now", "You · 2 min ago (incognito)", "Halo · watching now". The count rises every time you look. | Popover list | — | `viewsChecked++` | Close | 4 | 1 |
| C8 | **DELETE → DELIGHT** | Settings › Danger zone › Delete account | Type DELETE to confirm | When you finish typing DELETE, the input morphs letter by letter into DELIGHT. The button reads "Delight account". Click: "Account delighted ✓". Nothing is deleted. | Letter morph animation | ~2s | Activity entry | Modal closes | 4 | 2 |
| C9 | **Tab Title Betrayal** | Switching browser tabs | Static title | On hide: "(1) Morgan is calling…" / "Your followers are leaving". On return: "Welcome back — we changed a few things" | Document title | — | — | Reverts after 4s | 3 | 1 |
| C10 | **Semantic Drift** | Entropy stage changes | Stable labels | One label quietly changes per stage: Followers → Witnesses, Message → Plead, Case Studies → Evidence, Settings → Suggestions | Cross-fade | — | `driftedLabels` persisted | Never (until reset) | 4 | 1 |
| C11 | **Consequential Toggles** | Law 5 flips | Settings are cosmetic | Flipped settings *really apply*: Dark mode turns the whole UI dark, Online status shows a green dot, Autoplay decides whether the call video has sound, 2FA disabled shows a calm security toast, and "Halo acts on my behalf" changes how chatty Halo is | Real theme and UI changes | — | Settings feed other systems | — | 4 | 2 |
| C12 | **Return Visit Memory** | Reload / revisit | A fresh page | Toast: "Welcome back. Halo kept working while you were away." The headline has been subtly "optimized." | Toast and a text change | — | `visits++` | — | 3 | 1 |
| C13 | **Prophecy Entry** | Activity tab at entropy ≥ 30 | — | An entry *from the future*: "Upcoming: You will open Settings." If you later do: "You opened Settings, as predicted." | Feed entry | — | `prophecy` state | — | 4 | 2 |
| C14 | **The Finale — You Are The Product** | "Review changes" banner (entropy ≥ 60 or both cinematics seen) | An undo screen | A Git-style diff of everything Halo changed. "Revert all changes" → the profile becomes **the visitor's**: "You (Visitor)", "Spent 04:12 on a stranger's profile", bio built from real session stats. Halo: "Profile optimized. You are now the product." | Diff modal → revert progress → identity swap | ~6s | `finaleSeen`, identity = visitor | "Start over" link resets everything | 5 | 2 |
| C15 | Endorse Swap | "Endorse" on a skill | +1 endorsement | The skill renames to its opposite | Text swap | — | — | — | 3 | 2 |
| C16 | Clipboard Confession | "Share profile" | Link copied | Copies "I've been stalking Morgan's profile for 4 minutes" | Toast | — | — | — | 3 | 2 |
| C17 | Undo That Undoes Something Else | "Undo" on toasts | Undo | Reverts a different, random thing | Toast | — | — | — | 3 | 3 |
| C18 | Completeness Meter | "Improve profile" | Meter goes up | It goes down | Progress bar | — | — | — | 2 | 1 |

**Destroyed outright (generic, never build):** runaway buttons, cursor hiding as a gimmick, scroll hijacking, fake virus pop-ups, CAPTCHA games, Rickroll, infinite confirm dialogs, 90s styling, loud autoplay audio, fake cookie banners.

---

## 6. Ranking & Selection

| Rank | Idea | Ratio | Verdict |
|---|---|---|---|
| 1 | C14 Finale | 2.5 | **MUST**. It's the unforgettable ending. |
| 2 | C7 Profile Views | 4.0 | **SHOULD**. Cheap and very funny. |
| 3 | C10 Semantic Drift | 4.0 | **SHOULD**. Psychological uncertainty. |
| 4 | C1 Incoming Call | 1.7 | **MUST**. Mandatory Direction A, made diegetic. |
| 5 | C2 Halo Cleanup | 1.7 | **MUST**. Mandatory Direction B, the page deletes itself. |
| 6 | C3 Gaslighting Log | 2.0 | **MUST**. It's the memory backbone. |
| 7 | C11 Consequential Toggles | 2.0 | **MUST**. It makes Law 5 matter. |
| 8 | C4 Typing forever | 2.0 | **MUST**. Temporal betrayal. |
| 9 | C8 DELETE → DELIGHT | 2.0 | **MUST**. Semantic betrayal, great live. |
| 10 | C5 Résumé Pipeline | 2.0 | **SHOULD**. The brief's "ridiculous internal process." |
| 11 | C6 Verified Decay | 3.0 | **SHOULD**. Free escalation signal. |
| 12 | C9 Tab Title | 3.0 | **SHOULD**. Cheap and noticed live. |
| 13 | C12 Return Visit | 3.0 | STRETCH |
| 14 | C13 Prophecy | 2.0 | STRETCH |
| — | C15–C18 | ≤1.5 | **Rejected.** Overload, invisible in demo, or confuses law verification. |

**Final set:** 5 Laws + 9 core original behaviors (C1, C2, C3, C4, C5, C8, C11, C14, plus C6, C7, C9 and C10 as small "glue") + 2 stretch. That's about 11 felt interactions, which is not overloaded.

---

## 7. Complete Judge Journey (designed order; any order works)

| Stage | Judge thought | What happens |
|---|---|---|
| **0 · Trust** (0:00) | "Nice profile." | A pristine, calm page. Nothing moves. The Halo chip looks like a premium feature. |
| **1 · Hairline crack** | "Wait…" | The cursor passes the follower count: 1,248 → 1,247. Barely noticed. Follow → Following → (2s) Unfollowed. *"Did I misclick?"* |
| **2 · Contradiction** | "Why did that happen?" | Change Photo: shimmer, "Photo updated ✓", photo identical, **name changed** to "Morgan Vael". Edit Name opens the Bio editor. Save: a letter visibly **falls off** the headline. |
| **3 · Distrust** | "I can't trust anything." | Settings: clicking Dark mode flips Two-factor instead, and the page goes dark from a *different* click. The Activity log says they unfollowed Morgan. "Followers" now reads "Witnesses." The verified tooltip says "Verified*". |
| **4 · Intrusion** | "What the hell?" | Email → "Opening mail…" → **Morgan is calling you.** Decline… it answers anyway. The video plays full-screen as a call. Call ends, the screen shatters, the page recovers onto the Activity tab: "You called Morgan at 00:41. Morgan did not consent." |
| **5 · Loss of control** | "It's eating itself." | View all files → Halo cleans up: case studies vanish, the avatar disappears, the page drops to raw HTML, everything falls, blackout, "removing you…" silence. **SYSTEM RESTORED.** Auto-scroll to Settings: "Let Halo act on my behalf: ON — *You enabled this.*" There are now 11 files, permanently. |
| **6 · The turn** | "Okay, this is brilliant." | A calm banner: "Halo finished optimizing your profile. Review changes." A diff of every lie. **Revert all** → the profile is now **You (Visitor)**, with your real stats as your bio. Halo: "Profile optimized. You are now the product." |

**The 60-second demo cut** (for a recording): hover followers → Follow sequence → Change Photo → Edit Name/save (letter falls) → one toggle → Email call (short video) → View files → finale.

---

## 8. State Architecture

One Zustand store, persisted to `localStorage` (`halo:v1`, versioned, wrapped in try/catch). Ephemeral UI state is kept separate.

```
PersistedState
├─ identity: 'morgan' | 'visitor'
├─ profile: { displayName, originalName, headline, bio, location }
├─ texts: Record<TextId, string>          ← erodible text registry (Law 2)
├─ erosions: { textId, char, index, at }[]
├─ followers: number (1248)               ← only Law 3 may change it
├─ followPhase: 'follow'|'following'|'unfollowed'|'followed_successfully'
├─ settings: Record<SettingId, boolean>   ← only Law 5 (and C2's one forced ON) may change
├─ entropy: number → stage: calm|drift|distrust|possessed
├─ log: TruthEntry[]                      ← real events; Activity renders lies
├─ files: { id, title, size, lost }[]
├─ flags: { videoSeen, attackSeen, finaleSeen, messageStage, viewsChecked, driftedLabels[], prophecy }
└─ visit: { firstAt, visits, activeMs, hoverCount, nameChanges, saves }

Ephemeral: cinematic (null|'call'|'cleanup'|'finale'), toasts[], unstyled, gravity, blackout
```

**Cross-interaction dependencies (the "it remembers" web):**
- Law 5 → Dark mode theme · Online dot · **Autoplay decides call video sound** · Halo verbosity.
- Law 1 name changes → tab title, chat header, call screen caller name, finale diff.
- Law 2 erosions → finale diff ("letters lost: e, a, r").
- Law 3 losses → Activity lies, finale stat, tab title on hide.
- C1 call → chat message from Morgan, Activity entry.
- C2 cleanup → one file lost forever, a setting forced ON, "authorized" log lie.
- Entropy → verified tooltip, semantic drift, finale banner.
- Everything → finale bio (built from `visit` + `log`).

**Entropy:** law events +3–5, original events +5, cinematics +20. Stages: calm < 10 ≤ drift < 30 ≤ distrust < 60 ≤ possessed.

---

## 9. Video Strategy

- **One trigger only:** Email (in the action row). It's diegetic: you try to contact Morgan, and Morgan calls *you*.
- **Why a call frame:** any supplied video (a meme, the team, something absurd) makes sense inside a "camera feed." The Accept/Decline click is a user gesture, so **sound playback is allowed** by the browser autoplay policy.
- **Reusable `<VideoEvent>` and `videoEvents.ts` config:** src, poster, entrance, exit effect, sound policy, max duration, navigate-to, onComplete. To swap the asset, drop `public/media/intrusion.mp4`.
- **Failure-proof:** a missing or broken file or a rejected `play()` falls back to a muted retry, then to a 4s animated "connection unstable" placeholder. It never crashes, and Esc always ends the event.
- **Sound policy:** follows the Autoplay setting (another cross-dependency). OFF plays muted with a caption: "Autoplay is off, so we played it quietly."

---

## 10. Technical Architecture

- **Stack:** Vite + React 18 + TypeScript + Tailwind + Framer Motion + Zustand (persist) + Playwright. No backend, no router (tabs are state plus `#hash`).
- **Determinism:** seeded RNG (`?seed=42`). All randomness goes through `rng()`.
- **Timers:** a central `scheduler` with cancel tokens. It's StrictMode-safe: no chaos fires from `useEffect` mount, only from user events.
- **Cinematic host:** a single overlay root. While it's active, it locks other chaos (no overlaps, so no crashes).
- **Unstyled mode:** a separate `<RawProfile>` component rendered with plain HTML defaults. It avoids fighting Tailwind.
- **Debug flags:** `?reset=1`, `?seed=n`, `?fast=1` (compresses cinematic timelines for tests only, never Law 4).
- **Proof:** `npm run proof` runs a Playwright "judge journey" that saves numbered screenshots and `.webm` recordings to `/proof`.

**One-day schedule:** H0–1 scaffold, design system and static profile (Trojan Horse first) · H1–3 five laws and their tests · H3–5 store, entropy, Activity lies, toggles' consequences · H5–7 call/video event · H7–9 cleanup attack · H9–10 finale · H10–11 glue (C4–C10) · H11–12 monkey test, proof capture, polish.

---

## 11. Risk Analysis

| Risk | Mitigation |
|---|---|
| React StrictMode double effects cause double decrements or timers | Chaos only from event handlers; timers in a central scheduler; idempotency guards |
| Hover fires repeatedly | Decrement on `pointerenter` once per hover session; dedupe touch, click and synthetic hover within 350ms |
| Law 2 erodes a law trigger label, so judges can't find it | Law trigger labels, follow texts and digits are non-erodible; a minimum of 3 letters per string |
| Law 2 removes a letter off-screen, so judges think it failed | Prefer erodible text visible in the viewport; animate the falling glyph |
| Original chaos contaminates law verification | Hard rule: only Law 3 changes followers, only Law 4 changes follow text, only Law 5 changes settings (plus the one scripted C2 force) |
| Video autoplay blocked or file missing | Gesture-initiated play, muted retry, placeholder fallback, Esc and a max-duration cap |
| Overlapping cinematic events | A cinematic lock; triggers are ignored while it's active |
| Corrupted localStorage | Versioned key, try/catch, auto-reset on parse failure |
| Judges get stuck in finale or dark mode | "Start over" link and `?reset=1`; dark mode is fully styled |
| Photosensitivity | No strobe (max one flash per event, < 3Hz); `prefers-reduced-motion` swaps shake and gravity for fades |
| The agent "fixes" the dark patterns | Bias-override clause in the Master Prompt; tests encode the betrayals as requirements |
| Looks broken in screenshots | Pre-interaction screenshot acceptance check; every chaos state uses the design system |
| Using a real person's likeness | Fictional persona and a generated SVG avatar; swap in a team member's photo only with their consent |
