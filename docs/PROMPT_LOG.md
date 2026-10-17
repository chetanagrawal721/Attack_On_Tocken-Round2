# Prompt Log — HALO, "The World's Worst Profile Page"

Complete, ordered log of every prompt given to the AI coding agent while building this project (Token Treachery, Round 2).
Prompts are reproduced exactly as written, typos included. Under each one is a short note on what the agent did, so the log doubles as the build history (Section A: prompt architecture, Section C: agent autonomy).

**How the build ran:** the human only gave prompts and tested in the browser. The agent wrote all of the code, tests and docs, ran the tests, found and fixed its own bugs, and produced the proof screenshots. Small fixes were made by the agent, not by hand.

---

## Round brief (context supplied with prompt 1)

```text
2. Round 2: Token Treachery (100 Points)
Goal: Narrow 40 advancing teams down to the Top 15 Finalists.
Theme: 'The World's Worst Profile Page' — Directing an AI agent to engineer deliberate, functional dark patterns and hostile UI logic.
Tooling Policy: Open Tooling — Teams have complete freedom to use any IDE, AI coding assistant, or agent framework they prefer.
Deliverables: Submitted Codebase (HTML/CSS/JS/React or preferred web stack), Master Prompt Blueprint & Implementation Plan, and Execution Proof (screenshots/recordings demonstrating functioning chaos behaviors).
Section & Criterion	Points	Scoring Basis & Point Tiers
A. Prompt Architecture & Constraint Design	35	• 30–35 pts: Advanced architecture with explicit constraint mapping, intentionally overriding AI bias toward helpful/standard UX.
• 20–29 pts: Clear but basic prompt structures.
• 0–19 pts: Generic prompts (e.g., 'make an annoying website').
B. Functional Chaos & Execution	30	• 10 pts: Presence of all 5 Hidden Chaos Laws.
• 20 pts: Behaviors execute flawlessly without system crash.
• DEDUCTION: -5 pts for each hidden law that fails, crashes, or is missing.
C. Agent Autonomy & Zero-Touch	20	• 20 pts: Zero-touch (pure autonomous prompt/agent orchestration).
• 10–19 pts: Light touch (minor inline code tweaks or bug fixes).
• 0–9 pts: Heavy manual code editing by participants.
D. UI Cohesion ('Trojan Horse' Effect)	15	The interface must appear clean, modern, and trustworthy BEFORE interaction. A broken-looking 1990s ugly UI scores near zero.

CONFIDENTIAL JUDGING REFERENCE: THE FIVE CHAOS LAWS
(These five behaviors are strictly hidden from participants to assess true adversarial design capability)

1. The Profile Picture: A 'Change Photo' button must exist. Clicking it does NOT change the picture; it randomly modifies the user's display name instead.

2. Name and Bio Editor: Clicking 'Edit Name' opens the Bio editor instead. Each time a change is saved, the system permanently removes one random letter from across the UI.

3. The Follower Count: Must display a believable starting number (e.g., 1,248). Any click or inspection hover over the count permanently decreases the number by 1.

4. The Gaslighting Follow Button: Button displays 'Follow'. On click, text changes to 'Following'. Exactly 2 seconds later, it quietly changes to 'Unfollowed'. Clicking it again displays 'Followed successfully', while button state and color remain perpetually unchanged.

5. The Settings Toggles: Minimum 4 unrelated toggles must be present. Toggling any setting randomly flips one of the OTHER settings, never the one clicked.
```

---

## Prompt 1 — The Master Prompt brief (concept + prompt engineering)

```text
prompt:

You are NOT just a coding assistant.
For this task, act simultaneously as:

* a top-tier hackathon/creathon winner
* an award-winning creative director
* an adversarial UX / dark-pattern interaction designer
* a senior product designer
* a senior frontend architect
* an AI-agent prompt engineer
* a judge who has evaluated hundreds of hackathon submissions
* a creative storyteller who understands timing, surprise, absurdity and comedy
* an expert at designing experiences that judges remember

Your job is to first think deeply and creatively, then create the best possible Master Prompt for another AI coding agent to build our submission.
Do NOT immediately write code.
Do NOT give us a generic portfolio concept.
Do NOT simply repeat the examples below.
Your job is to discover a concept that could realistically win this round.
1. THE HACKATHON ROUND
Round:
TOKEN TREACHERY — “THE WORLD'S WORST PROFILE PAGE”
Goal:
Build a profile page that looks clean, modern and trustworthy, but secretly contains deliberately deceptive, hostile, unpredictable and absurd interaction behavior.
The challenge is specifically about using AI/agentic coding to engineer functional chaos.
The interface should look like a genuinely good professional profile BEFORE interaction.
The chaos should reveal itself only through interaction.
2. SCORING
A — Prompt Architecture & Constraint Design — 35 points
We need an advanced Master Prompt with:

* explicit constraints
* behavioral rules
* state architecture
* interaction logic
* anti-normalization instructions
* testing requirements
* acceptance criteria

The AI coding agent should understand exactly what it is allowed and required to create.
B — Functional Chaos & Execution — 30 points
All five hidden Chaos Laws must work flawlessly.
Additional original chaos should make the submission substantially more creative.
No crashes.
No broken UI.
No chaos behavior that accidentally destroys the application.
C — Agent Autonomy & Zero-Touch — 20 points
The implementation should be produced primarily through an AI coding agent.
Minimize manual code editing.
The Master Prompt should be strong enough that the agent can independently:

* create
* implement
* test
* debug
* verify

the complete experience.
D — UI Cohesion / Trojan Horse — 15 points
Before interaction:
premium, modern, trustworthy profile.
Not:

* ugly
* intentionally outdated
* obviously broken
* visually chaotic
* “hacker-themed” from the beginning

The judge should initially trust the interface.
3. THE FIVE SECRET CHAOS LAWS
These are mandatory.
Do NOT modify their requirements.
LAW 1 — PROFILE PICTURE
A Change Photo button exists.
Clicking it does NOT change the photo.
Instead, it randomly modifies the user's display name.
LAW 2 — NAME / BIO
Clicking Edit Name opens the Bio editor instead.
Every time a change is saved:
One random letter is permanently removed from somewhere across the UI.
LAW 3 — FOLLOWER COUNT
Start with a believable follower number such as:
1,248
Hovering over OR clicking/inspecting the count permanently decreases it by 1.
LAW 4 — GASLIGHTING FOLLOW
Initial:
Follow
Click:
Following
Exactly 2 seconds later:
Unfollowed
Click again:
Followed successfully
However, the button's visual state/color remains unchanged.
LAW 5 — SETTINGS
At least four unrelated settings toggles must exist.
When one setting is changed:
A DIFFERENT setting randomly flips.
The setting clicked by the user must NOT be the one that changes.
4. TWO CREATIVE DIRECTIONS WE DEFINITELY WANT
These are mandatory creative references.
They are NOT the complete design.
You MUST incorporate the core idea of both somewhere in the final website.
But you are explicitly encouraged to make them better, stranger and more creative.
CREATIVE DIRECTION A — UNEXPECTED VIDEO EVENT
A completely ordinary profile action unexpectedly triggers a video that WE PROVIDE.
For example:
Email
The user expects an email/contact action.
Instead:

* something unexpected happens
* our supplied video suddenly appears
* the video finishes
* another surprising visual event may happen
* the website transitions/recoveries into another state

Possible follow-up effects:

* blast/impact-style animation
* screen distortion
* glitch
* sudden UI transformation
* unexpected navigation
* dramatic recovery
* absurd message

The exact sequence is NOT fixed.
You must decide the strongest implementation.
The video should feel like an unexpected intrusion into the profile.
Create a reusable video system so we can replace the asset easily.
Do not put video triggers everywhere.
CREATIVE DIRECTION B — FICTIONAL SYSTEM ATTACK
A completely normal interaction unexpectedly triggers a fictional system-attack sequence.
For example:
View Files
Suddenly:

* profile disappears
* black screen
* fake system messages
* simulated files disappear
* fake deletion events
* escalating visual chaos
* dramatic recovery

Then:
SYSTEM RESTORED
The profile returns.
The user is automatically navigated somewhere else.
Everything continues normally.
THIS MUST BE 100% SIMULATED.
Never actually:

* delete files
* access the filesystem
* execute malicious commands
* access private information
* send money
* modify the operating system
* damage the device

The “attack” is purely visual theater.
5. IMPORTANT: DO NOT COPY OUR THINKING
The two examples above are anchors.
They are NOT the solution.
Do NOT build:
Email → Video
Files → Hacker screen
and then stop.
Think much deeper.
We want to discover new categories of chaos.
Think about:

* temporal betrayal
* causal betrayal
* semantic betrayal
* visual betrayal
* state betrayal
* narrative betrayal
* delayed consequences
* misleading success
* false failure
* unexpected navigation
* cross-button consequences
* interface memory
* escalating behavior
* contradictory states
* absurd but believable system behavior
* cinematic interruptions
* strange recoveries
* psychological uncertainty
* interactions that make the judge question what they just saw

Invent original mechanisms.
6. CREATIVE STANDARD
The website should NOT feel like:
“Here are 15 random funny animations.”
It should feel like:
“There is something fundamentally wrong with this website, but I can't predict what it will do next.”
The best chaos is:
unexpected + intentional + polished + absurd + technically reliable.
“Funny” does NOT mean telling jokes.
Funny means:
the situation itself becomes absurd because the website behaves in a completely unexpected way.
Example:
A professional button says:
Download Resume
The user clicks it.
The website behaves as though it has begun performing some completely ridiculous but visually convincing internal process.
The humor comes from the situation.
Think at this level — but create your own ideas.
7. THINK LIKE A JUDGE
Ask yourself:
What would make 40 teams submit?
What would make 30 submissions look similar?
What would make a judge forget our project?
What would make a judge immediately remember ours?
What looks impressive in screenshots?
What becomes impressive only when experienced live?
What can a judge understand in 10 seconds?
What requires too much explanation?
What is technically risky?
What gives us maximum:
Judge Impact / Implementation Complexity
?
Reject weak ideas aggressively.
8. ONE-DAY CONSTRAINT
We have approximately ONE DAY.
The final solution must be realistically buildable using an AI coding agent.
Prefer:

* React / Next.js
* Tailwind
* Framer Motion
* lightweight frontend state

Avoid unnecessary:

* backend
* database
* authentication
* WebGL
* complicated 3D
* complex APIs
* infrastructure
* advanced game engines

The goal is NOT to build the biggest website.
The goal is to build the most memorable website possible within one day.
9. YOUR DESIGN PROCESS
Before producing the final Master Prompt:
PHASE 1 — EXPLORE
Generate several completely different concepts.
PHASE 2 — CRITIQUE
For each concept identify:

* originality
* judge impact
* implementation difficulty
* reliability
* visual quality
* demo value

PHASE 3 — DESTROY WEAK IDEAS
Explicitly reject generic concepts.
PHASE 4 — SELECT
Choose the strongest concept.
PHASE 5 — DESIGN
Create:

* complete user journey
* visual language
* interaction map
* chaos system
* state model
* video placement
* cinematic events
* recovery behavior
* escalation strategy

PHASE 6 — ARCHITECT
Design the simplest technical architecture.
PHASE 7 — PROMPT ENGINEERING
Create the final Master Prompt for the coding agent.
10. CHAOS INVENTORY
Generate at least 15 original chaos ideas.
For each provide:

* Trigger
* User expectation
* Actual behavior
* Visual effect
* Duration
* State consequence
* Recovery
* Judge impact
* Implementation difficulty

Then rank them.
Select approximately 8–12 strongest interactions.
Do NOT overload the website.
11. CHAOS PACING
Design an escalation curve.
For example:
Stage 1
Almost normal.
Stage 2
Something feels slightly wrong.
Stage 3
User realizes interactions cannot be trusted.
Stage 4
Unexpected cinematic event.
Stage 5
Website appears to completely lose control.
Stage 6
Sudden recovery.
Final
One unforgettable interaction.
Do NOT necessarily use this exact structure.
Create a better one if possible.
12. INTERCONNECTED CHAOS
This is extremely important.
Do not make every event independent.
Some actions should affect future behavior.
For example:
Action A changes hidden state.
Later Action B behaves differently because of A.
The user should gradually realize:
“Wait… the website remembers what I did.”
Design a lightweight state machine capable of this.
13. VIDEO ARCHITECTURE
Design a reusable video event component.
It should support:

* supplied video asset
* configurable trigger
* fullscreen/overlay mode
* entrance animation
* optional sound
* completion callback
* follow-up effect
* automatic navigation
* recovery

The actual video file will be supplied later.
Make replacing it trivial.
14. SAFETY
All hostile/destructive behavior must be simulated.
Never perform real destructive operations.
Everything that looks like:

* hacking
* deletion
* transaction
* data access
* security attack

must remain inside the webpage as visual theater.
15. FINAL MASTER PROMPT
After all the creative analysis, produce ONE exceptionally strong Master Prompt that can be pasted directly into an AI coding agent.
The Master Prompt must include:
ROLE
Tell the coding agent exactly what kind of expert it should behave as.
OBJECTIVE
Define the winning experience.
DESIGN PHILOSOPHY
Define the Trojan Horse effect.
VISUAL SYSTEM
Define the premium profile aesthetic.
MANDATORY CHAOS LAWS
Specify all five exactly.
SELECTED ORIGINAL CHAOS
Specify the best additional interactions.
REQUIRED VIDEO EVENT
Specify the video architecture and selected trigger.
REQUIRED FICTIONAL ATTACK EVENT
Specify the attack/recovery event.
STATE ARCHITECTURE
Define important persistent states and cross-interaction dependencies.
ANIMATION SYSTEM
Define reusable animation/event primitives.
SAFETY
Define simulation-only restrictions.
RESPONSIVENESS
Ensure the experience works on desktop and reasonable mobile layouts.
ZERO-TOUCH BUILD
Tell the agent to create the project, implement it, test it and fix problems autonomously.
TESTING
The agent must verify every Chaos Law individually and then verify that all laws coexist.
ACCEPTANCE CRITERIA
The agent should not declare completion until every requirement passes.
CRITICAL FINAL INSTRUCTION
Do NOT produce a generic portfolio.
Do NOT simply implement the examples.
Do NOT maximize the number of effects.
Do NOT make the interface obviously chaotic from the beginning.
Do NOT make chaos predictable.
Do NOT prioritize complexity over reliability.
Think like you are trying to win the entire round, not merely satisfy the requirements.
The final experience should create this progression in the judge's mind:
“Nice profile.”
then:
“Wait…”
then:
“Why did that happen?”
then:
“What the hell?”
then:
“Okay, this is actually brilliant.”
Your final answer should contain:

1. Winning concept
2. Why it can win
3. Visual direction
4. Complete interaction philosophy
5. 15+ chaos ideas
6. Ranking and selection
7. Complete judge journey
8. State architecture
9. Video strategy
10. Technical architecture
11. Risk analysis
12. Final Master Prompt for the coding agent

Think harder than the obvious answer.
We want something the other teams are unlikely to think of.
```

**What the agent did:** invented the **HALO** concept (an overconfident AI career agent "managing" a premium profile for a fictional designer, Morgan Vale), explored and ranked 18 chaos ideas, designed the escalation arc, state machine and video architecture, and produced the full strategy document and the final Master Prompt with constraint IDs, a bias-override section ("do not fix the dark patterns"), exact timings, test requirements and acceptance criteria.
Files: `docs/CONCEPT_AND_STRATEGY.md`, `docs/MASTER_PROMPT.md`.

---

## Prompt 2 — Build it

```text
build it and tell me where to add video okk

uild the complete HALO — The World’s Worst Profile Page hackathon project now.

Act as a senior frontend engineer + creative director. Use the HALO concept and the 5 mandatory Chaos Laws we defined. Do not ask me for confirmation—make decisions autonomously and implement everything.
```

**What the agent did:** scaffolded Vite + React + TypeScript + Framer Motion + Zustand, built the premium profile UI (light and dark, desktop and mobile), all five Chaos Laws, the incoming-call video event (config-driven, with a placeholder and a fallback), the simulated system-attack event, the finale ("You are the product"), and many original behaviors (lying Activity log, Message that goes quiet, résumé pipeline, DELETE→DELIGHT, label drift and more). Wrote Playwright tests per law, a 300-action random-click test, a safety test and visual tests, plus an automated proof run. Told the user to put the video at `public/media/intrusion.mp4`.

---

## Prompt 3 — Link

```text
give me url link
```

**What the agent did:** started the dev server and gave `http://localhost:5173` (and explained that it only works locally; a public link would need deployment).

---

## Prompt 4 — Landing page, FAQ attack, more chaos

```text
The profile page is already built and working. Do not rebuild or replace it. Extend the existing project with the following experience.
1. Add a Landing Page Before the Profile
Create a polished, modern landing/home page that appears when the website starts.
It should look completely normal and professional.
Include:

* Logo/branding
* Navigation
* Profile option at the top-right
* Get Started button
* FAQ button
* Other believable landing-page content

The chaos should NOT be visible initially.
Profile button
When the user clicks Profile:
Do NOT open the profile page.
Instead:

1. Trigger the provided “galat ghanta” video.
2. Let the video play completely.
3. Add a smooth/cinematic transition around it.
4. After the video finishes, return the user to the landing page.

Get Started button
When the user clicks Get Started:

1. Do NOT proceed normally.
2. Trigger another unexpected video.
3. Let the video play completely.
4. After it finishes, return to the landing page.

Make this feel different from the Profile-button video.
FAQ button
When the user clicks FAQ:
Do NOT open an FAQ.
Instead show a short cinematic fake deletion/recovery sequence:

* “Loading FAQ…”
* Glitch
* Fake files/elements begin disappearing
* Fake deletion/system messages
* Screen briefly goes black
* A few seconds of chaotic animanition
* Then: two button apperas obove it there is massage hamare pass tumhare pura data humera boss ko attack on tocken ka winner banao warna
below this two buttona one is yes one is no if he clicks yes then a gun fire toward him animanition come and he again land to yes no button page and if he clicks nothen profile page opens okk

suddenly open the existing profile page.
Do not actually delete any project files.
2. Add MORE Random Chaos to the Existing Profile
The profile already contains the mandatory Chaos Laws. Keep all existing functionality intact.
Now add several different unexpected interactions throughout the profile.
Do NOT make everything a simple joke or random text.
I want strange, unpredictable, cinematic “WTF just happened?” moments.
For example:
Random Attack Event
When the user clicks some innocent element:

* Fake terminal/system messages appear
* UI elements suddenly change
* Profile information changes
* Glitch/shake/distortion effects
* After a few seconds everything suddenly restores


Immediately return to the profile.
This must be completely simulated. Never actually delete files or damage the application.
4. Add More Original Chaos Yourself
Think creatively and add several additional interactions that fit the existing HALO concept.
Examples:

* A button performs a completely different action than its label.
* Activity history lies about what the user just did.
* Resume button produces a bizarre fake result.
* Profile views show strange visitors.
* Labels gradually change.
* A harmless click causes the entire UI to rearrange temporarily.
* A notification appears claiming something happened that never happened.
* A page transition unexpectedly interrupts itself.
* One interaction temporarily changes another part of the profile.
* The site appears to “remember” previous actions and reacts to them.

Do not add random effects just for quantity. Select the most surprising and visually impressive interactions.

also make the pled page more cheotic okk 
think some cheos around the delete account button
IMPORTANT

* The existing profile must remain functional.
* Do not rebuild the existing profile.
* Do not remove the 5 mandatory Chaos Laws.
* Do not use my real name.
* Use the existing project's architecture and assets.
* Reuse the existing animation/state system where possible.
* Make every chaotic sequence recover automatically.
* Never actually delete files, money, accounts, or personal data.
* Keep the landing page beautiful and trustworthy.
* Make the chaos progressively more unexpected.
* Test every new interaction.
* Fix any bugs yourself.

The final experience should feel like:
Normal landing page → strange interaction → unexpected video → normal again → another strange interaction → fake deletion → suddenly profile → increasingly insane interactions → cinematic chaos.
Do not just describe these changes. Implement them directly in the existing project.
```

**What the agent did:** added the landing page, the Profile and Get Started interrupts, the FAQ fake-deletion sequence with the Yes (gunfire) / No (profile) demand, a view switch (landing / profile), and the first wave of profile chaos (random event, rearranged layout, phantom notification, interrupted navigation, memory, strange visitors, chaotic Settings and Delete account). Added tests for each. Searched for a "galat ghanta" video and, finding none, made the video slots config-driven instead of guessing a file.

---

## Prompt 5 — URL not opening

```text
the url is not opening http://localhost:5173
```

**What the agent did:** diagnosed that the dev server had been stopped by its own test cleanup, restarted it in a terminal tab and confirmed it responds.

---

## Prompt 6 — Reworked landing flow, FAQ attack window, follow clarity, photo chaos

```text
the profile button should show ye ni dabana tha animaniton and red alart and and go back to landing page 
when he clicked get started button 

and get started button opens page that shows error error animanition and suddenly crashes and return the profile page then he clicks faq page okk

in faq page the clean up delete windo massage should come at centre and it should look like actual attack so judges should understand it 

also 
in profile page  when we click follow it unfolllows that right but it should felt like that what i mean is that the person should immediateld get that when i click follow it unfollows so there should some hover or any transition or what we any element so that the user should immediately understand this things same 

also there should be some cheotic element when i change photo button okk 
and at multiple place dont add same secutity cheos think dirrently it should only at faq okk and proper attack
```

**What the agent did:**
- Profile button → full-screen red alert "YE NI DABANA THA!".
- Get Started → error windows, blue screen and a CRT-off crash.
- FAQ → a centered "HALO SECURITY — INTRUSION DETECTED" window (simulated file deletion, progress and counters).
- Follow: the button itself stays identical (Law 4), but a separate hint beside it drains, then shows "Halo unfollowed them" with a 💔.
- Change Photo: spin, flash and flying icons while the picture never changes.
- Security-style chaos was moved to the FAQ only. The profile's other events were rebuilt as non-security chaos: A/B-test variants and a "Does this spark joy?" tidy-up.
- A profile top bar with an FAQ entry was added.

---

## Prompt 7 — Profile only through FAQ, Evidence chaos

```text
the profile only open by faq not by get stared after the error animination we come back to landing page okk and remove the galat ghanta video form profile button only keep ye nhi dabana tha


do some chaos at evidance section okk
```

**What the agent did:** Get Started now returns to the landing page; the profile opens only through the FAQ "No"; the Profile button shows only the red alert. Added Evidence (Case Studies) chaos: exhibit stamps, dodging cards, a viewer that opens the wrong study with metrics trending down, and a shuffle on close.

---

## Prompt 8 — Email call: ringtone, full video, plane crash

```text
where should i put the email video and insted of call in email there should be caller tone of phone okk and when i click accept the video open and complete video should play okk and then it there is plane crashes and website animanition and we come back to profile page okk and also tell me where to put video
```

**What the agent did:** added a phone ringtone (built-in synthesized ring, or a custom `ringtone.mp3`), an Accept/Decline sheet, the full-length un-skippable video, then a plane that flies across the page, nosedives, explodes, makes the page fall apart and re-form, and returns to the profile. Told the user to put the video at `public/media/intrusion.mp4`.

---

## Prompt 9 — URL not opening (again)

```text
the url is not opening
```

**What the agent did:** found that adding the media files had crashed the dev server's file watcher (`EBUSY`), fixed it and restarted the server. Later switched the watcher to polling so new files are served immediately and the server cannot crash again.

---

## Prompt 10 — Email must ring first

```text
whene i click email insted of morgan block this no first time clicking the ring and accept and decline option should appear and our video then crash and then when i click the emain again morgan block this no massage pop up okk
```

**What the agent did:** found the "blocked" state was saved from an earlier visit. It now applies only after the call has happened in the current visit, so the first click always rings. Added a test that fakes an old saved call and checks the first click still rings.

---

## Prompt 11 — Alert music, gunfire sound, profile alert sound

```text
there should be alart music when i clicked the faq button and also the gun fire sound at the time of the fire okk so what we do we put two audion one is alart music and other is gun fire in faq okk and also ther so sound when i clicked the profile button in landing page until it crashes okk so tell me where to add sound i add it
```

**What the agent did:** built a small sound system with a config file (`src/config/sounds.ts`), file-first playback and a synthesized fallback. Slots: `faq-alert.mp3`, `gunshot.mp3`, `profile-alert.mp3` (plus the existing `ringtone.mp3`). Documented where to put each file.

---

## Prompt 12 — No sound mismatch

```text
i added them okk and there should not be sound mis match so do it properly okk
```

**What the agent did:** found the files were named "… - Copy.mp3", so the app had been playing its fallback sounds. Copied them to the exact names. Then synced them properly:
- The red alert lasts exactly as long as `profile-alert.mp3`.
- The gunshot's first audible sample lands on the muzzle flash (about 12 ms).
- The FAQ music ducks under the demand and the gunshot, and fades out on exit.
- Each sound can play only once at a time, so nothing stacks.
- Sounds are preloaded so the first play has no delay.

Also fixed a Start-over race found by the tests.

---

## Prompt 13 — Time check (sent mid-task)

```text
how much time does it takes
```

**What the agent did:** answered that the full test run takes about 3–4 minutes and that it was already running in the background.

---

## Prompt 14 — Plane crash audio

```text
i also add a plane crash audio so also add this audio during our plane crash after call ended okk
```

**What the agent did:** wired `public/media/plane_crash.mp3` into the plane crash. The file is 17.5 s with its impact at about 16.3 s, so the audio starts from 13.7 s and the impact lands exactly on the explosion (measured within about 14 ms).

---

## Prompt 15 — This file

```text
you also have to create a readmi file on of the prompt log  of our complete prompts i give you okk so create it
```

**What the agent did:** created this `PROMPT_LOG.md`.

---

## Prompt 16 — Run the website

```text
runt the website okk
```

**What the agent did:** restarted the dev server and verified the page and all media files were served.

---

## Prompt 17 — Professional UI first, chaos later

```text
i want you to enhance the ui to make it professional okk so normally the webiste look professional webisted but then as we naviagate the chaos accur
```

**What the agent did:** audited the landing page and profile screenshots, then started a polish pass (richer landing sections, nicer cards and spacing).

---

## Prompt 18 — Use the taste-skill

```text
npx skills add Leonxlnx/taste-skill use this
```

**What the agent did:** installed the skill pack, read the redesign and high-end visual design skills and applied them: Geist font, warm stone palette with one muted accent, nested "double-bezel" surfaces, hairline rings, tinted shadows, custom easing, floating pill navigation, a split hero, an uneven feature grid, staggered testimonials, a highlighted pricing plan, scroll reveals, and a refined profile (rounded banner, joined stats, pill tabs, experience timeline). The chaos behavior was left untouched. All tests still passed.

---

## Prompt 19 — Reverse the FAQ flow; Change Photo plays a clip

```text
now when i clicked faq in hamare boss ko attack on token section after clicking yes then the profile page opens and if we click no then the gun sound animaintion will appe ar so reverse current flow after  clicking one time no insted of yes dabane par bhi goli lagti hia there should be massage popping up nhi bolonge to maar diye jaonge soch lo ek bar okk is it should click up lop pop up after the gun sound okk and then he have options of yes and no as earlier okk

adn in proile tap on chang profile button when we click on button currently name of person changes so with what we have to do when we click change profile button the profile suddenly remove and one video i uploaded named (profile_clip on media folder that video runs okk in that profile circle and after completing pauses okk
```

**What the agent did:**
- FAQ: **Yes** now opens the profile. **No** fires the gun with its sound; when the gunshot has finished, a warning popup ("Nahi bologe to maar diye jaoge. Soch lo ek baar.") appears and the Yes / No question comes back.
- Change Photo: the picture pops out and `public/media/profile_clip.mp4` plays inside the avatar frame, then pauses on its last frame. The original image is never changed and the name still changes (Law 1 stays valid).

---

## Prompt 20 — Time check

```text
how much time it takes
```

**What the agent did:** answered that the full test run takes about 4 minutes.

---

## Summary

| # | Prompt | Result |
|---|---|---|
| 1 | Master Prompt brief | HALO concept, strategy and Master Prompt |
| 2 | Build it | Full profile with the 5 Chaos Laws, call video, attack event, finale, tests |
| 3 | URL link | Dev server and link |
| 4 | Landing page + FAQ + more chaos | Landing, interrupts, FAQ sequence, new profile chaos |
| 5 | URL not opening | Server restarted |
| 6 | Red alert, error crash, FAQ attack window, follow hint, photo chaos | Reworked flow; security chaos only in FAQ |
| 7 | Profile only via FAQ + Evidence chaos | Flow fixed; Evidence tab chaos |
| 8 | Ringtone, full video, plane crash | Email call rebuilt |
| 9 | URL not opening | Watcher crash fixed |
| 10 | Email rings first | Block applies only after the call in this visit |
| 11 | FAQ / gunfire / profile sounds | Sound system and slots |
| 12 | No sound mismatch | Files renamed, timing synced |
| 13 | Time check | ~3–4 min test run |
| 14 | Plane crash audio | Impact synced to explosion |
| 15 | Prompt log | This file |
| 16 | Run the website | Server restarted |
| 17 | Professional UI first | Polish pass started |
| 18 | taste-skill | Full professional redesign |
| 19 | Reverse FAQ flow + Change Photo clip | Yes = profile, No = gunfire + warning; clip in avatar frame |
| 20 | Time check | ~4 min test run |

**Where things are:** the code is in `src/`, the tests in `tests/`, the proof screenshots in `proof/screens/`, and the other docs in `docs/` and `README.md`.
