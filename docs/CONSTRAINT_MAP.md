# Constraint map

| ID | Requirement | Code | Test |
|---|---|---|---|
| L1.1 | "Change Photo" button exists | `Header.tsx` (`change-photo`) | law1 |
| L1.2 | 500ms shimmer, toast "Photo updated ✓" | `store.changePhoto`, `.shimmer` | law1 |
| L1.3 | Photo never changes, no file picker | `Header.tsx` (img src constant) | law1 (src equality) |
| L1.4 | Name mutated by one of 6 mutators | `chaos/law1Photo.ts` | law1, unit |
| L1.5 | New name differs, non-empty, ≤ 28 | `mutateName` | law1, unit (500 iterations) |
| L1.6 | Persisted, shown everywhere | `halo:v1`, `display-name`, tab title, chat, call | law1 (reload) |
| L1.7 | Repeatable | `photoBusy` guard only while shimmer runs | law1 (10 clicks) |
| L2.1 | "Edit Name" button | `Header.tsx` (`edit-name`) | law2 |
| L2.2 | Opens "Edit bio" modal, no name input | `BioModal` | law2 |
| L2.3 | Each Save removes exactly one letter; Cancel none | `store.saveBio`, `erode` | law2 (30 saves) |
| L2.4/2.5 | Erodible registry; trigger labels not erodible | `Txt.tsx`, `content.ts`, `isEligible` | law2, unit |
| L2.6 | Uniform by letter over visible text | `chooseErosion` | unit |
| L2.7 | Falling glyph at the letter's position | `erode` + `.glyph` | proof 08 |
| L2.8 | Persisted `erosions[]` | store | law2 (reload) |
| L3.1–3.5 | 1,248; −1 on hover / click / contextmenu / keyboard focus; dedupe touch; floor 0 | `FollowerCount` | law3 |
| L4.1–4.5 | Follow → Following → (2000ms) Unfollowed → Followed successfully; style constant | `FollowButton`, `followClick`, `resumeFollow` | law4 (fake clock) |
| L5.1–5.4 | 6 toggles; clicked never changes; one other flips; settings really apply | `Tabs.tsx` Settings, `toggleSetting`, `pickOther` | law5, unit, monkey |
| V | Email → incoming call → video → shatter → Activity; config-driven | `videoEvents.ts`, `CallCinematic`, `VideoEvent` | cinematics (3 tests) |
| A | View all files → simulated cleanup → SYSTEM RESTORED → Settings; permanent loss | `CleanupCinematic`, `RawProfile` | cinematics |
| F | Finale diff and identity swap; Start over | `FinaleModal`, `finale.ts` | cinematics |
| O1–O8 | Lying log, Message, Résumé, DELIGHT, views, verified decay, drift, title | see README | cinematics, visual |
| S | Simulation-only, no external I/O | all | coexistence (SAFETY) |
