# Ranch Manager — Technical Plan

_Agreed 2026-11-18. Companion to the concept, staff, starting-ranch and events docs, which remain the source of truth for game design. This doc covers how the game is built._

---

## 1. Tech stack

| Piece | Choice | Why |
|---|---|---|
| Language | **TypeScript** | Catches mistakes (typos in event files, wrong staff names) before they reach the phone |
| UI framework | **React** | The most widely used option, with plenty of documentation. Fast enough for a menus-and-tables game |
| Build tool | **Vite** | Fast, and has a ready-made PWA plugin |
| PWA / offline | **vite-plugin-pwa** (Workbox) | Installable to the home screen; every file is cached so the game runs with no signal |
| Saves | **IndexedDB** via `idb-keyval` | Chrome's on-device database. No backend |
| Game data files | **YAML**, checked against a schema (**Zod**) | Human-readable, allows comments and multi-line text; a broken file is rejected with a clear message |
| Styling | Plain CSS with shared design tokens | A consistent Football Manager look without a heavy dependency |
| Map | **Stylised flat SVG** | Sharp at any size, tappable areas, easy to colour by condition |
| Tests | **Vitest** (engine), **Playwright** (phone-sized screen tests) | Seeded runs make simulations reproducible and testable |
| Hosting | **GitHub Pages**, deployed automatically by GitHub Actions | A web link to open and install on the phone. No server |

---

## 2. Architecture

Four layers:

```
src/engine/     Pure game logic. No screen, no browser. Same input = same output.
src/ui/         React screens.
src/platform/   Browser-specific: saving, the real clock, PWA updates.
content/<pack>/ Setting-specific data: ranch, staff, events, one-to-ones, prices, text (YAML).
```

The engine only knows generic concepts (areas, herd groups, staff, skills, flags). Montana lives entirely in `content/montana/`. A UK pack would be a second folder.

### 2a. Game clock
- **Game time is stored as whole minutes since the start of the game**, converted to dates by our own calendar code. This avoids time-zone and daylight-saving bugs. The in-game calendar starts on **Monday 1 March 2027**, so weekdays exist (school days for Rosa's calls).
- **Link to real time:** `game time = real time + offset`. Fast forward only ever adds to the offset. On every open, game time = the larger of (last saved game time) and (real now + offset), so **the clock never goes backwards**, even if the device clock changes.
- **New game start (AGREED):** the game starts on 1 March **at the player's current local time of day**, so the game's 6am matches their real 6am. The opening briefing is shown straight away whatever the time.
- **Blocks:** Morning 06:00–12:00 (morning briefing), Midday 12:00–18:00, Evening 18:00–06:00 (end-of-day report at 18:00). Night events (e.g. a 2am calving) fall in the Evening block.
- Once the player fast-forwards, the game's 6am no longer matches the real 6am. This is accepted (concept doc, section 6). A real-world daylight-saving change also shifts the alignment by an hour, which is accepted too.

### 2b. Simulation (a discrete-event timeline)
The engine keeps a **timeline**: a time-ordered queue of everything due. That includes block starts, scheduled follow-ups, deadlines, one-to-ones coming due and daily upkeep (hay eaten, calves born, wages, fatigue). Advancing time means processing the timeline in order. One routine powers everything:

- **Catch-up on open:** simulate from the last saved game time to now.
- **Next decision:** run until a decision arrives or the next block starts, whichever comes first.
- **Next day:** run until the next 06:00, stopping early for any urgent or never-delegable decision.
- **Debug speed multiplier and jump to date:** the same routine, faster.

**Determinism rule:** the world comes out the same whether the player opens the app once a day or ten times, unless they make decisions. Every random roll happens at a fixed game moment, using the seeded random number generator saved in the game state.

### 2c. Event engine
- **Generation:** at each block start, a "director" collects eligible templates. A template is eligible if its triggers are met, it is off cooldown and it is under its maximum occurrences. The director picks events by weight, within a **daily decision budget** that is higher during calving. Each event is given an arrival time inside the block.
- **Trigger kinds:**
  - `fixed`: a date or game day (e.g. Hay shortfall on day 1)
  - `onceWhen`: fires once when a condition first becomes true (e.g. the first calf is born)
  - `weighted`: the random pool
  - `scheduled`: only when another event schedules it
- **Choices** apply a list of **effects**: change numbers, set flags, add notes, schedule follow-ups, temporarily boost another event's weight, run skill checks or disclosure checks.
- **Deadlines and no response:** when a deadline passes, the template's no-response outcome runs:
  - **Delegable / delegable within limits:** the **delegation resolver** decides as the person in charge. It uses the per-person outcomes written in the template where they exist (e.g. Walt rings the Kesslers). Otherwise it falls back to a general rule: the delegate scores each choice using their traits and skills, within the spending limit and other standing orders.
  - **Never delegable (AGREED):** the item **stays in the inbox** and the player still makes the decision. When the deadline passes, though, the world moves on: the template's "lapse" effects happen (e.g. Dale withdraws the hay offer; Walt's limp is treated as "leave it"), and some choices may become unavailable.
- **Fast forward and delegable inbox items (AGREED):** inbox items with multi-day deadlines stay in the inbox until their deadline, rather than being decided by the delegate as soon as the player fast-forwards. "Next day" does not stop for them.
- **Long absences:** everything is simulated faithfully. Inbox pile-up will be tested and reported before any cap is added.
- **Consequence hints:** worked out from what the player *believes* about a person (their displayed trait range), not from hidden values. Hints are therefore soft when the range is wide and wrong when the first impression was wrong. They unlock per person once knowledge and trust thresholds are met, and they only ever describe people's reactions.

### 2d. Game state
A single plain data object (easy to save):

```
version, rng { seed, position }
clock          { gameMinutes, offsetMs, lastRealMs }
ranch          { areas[], herd groups, calving progress, hay tons, ration level, infrastructure }
finance        { cash, lineDrawn, lineLimit, liabilities[] (hidden until discovered), ledger[] }
staff          { [id]: { state, beliefs (trait ranges), relationships, notes[], commitments[], milestones[] } }
standingOrders { spendLimit, vetStance, overtime, leaveCover, weather, inCharge }
inbox[]        open decisions (template, filled variables, arrival, deadline, lapsed?)
timeline[]     scheduled items
flags          { name: { setAt, value } }
history        { per-template count + last fired; temporary weight boosts with expiry }
log[]          what happened (feeds briefings, reports and "while you were away")
actions[]      every player decision with its game time (for replay)
```

State updates use **Immer**, so engine code can be written simply and still keeps a clean snapshot for each step.

### 2e. Save and load
- Autosave after every player decision and after every catch-up. The **last 3 saves are kept** in case of corruption.
- Each save has a **version number**, with migration steps so old saves keep working.
- **Export and import a save file:** for backups (clearing Chrome's site data deletes saves) and for sending bug reports.
- Request **persistent storage** from Chrome so Android is less likely to clear it.
- **Replay:** seed plus the list of player actions reproduces any game exactly (debug tool).

### 2f. Screens (portrait, bottom tab bar, one-handed)
- **Home:** clock, block, cash, hay days left, alerts, Next decision / Next day
- **Inbox:** urgent first, with countdowns
- **Decision:** situation text, up to 4 large choice buttons, hints
- **Staff:** a Football Manager-style table, then a profile per person with skills, trait ranges, state, relationships, file notes and commitments
- **One-to-one:** a guided flow taking about a minute
- **Map:** the 9 areas, coloured by condition, showing cattle
- **Finance:** cash, line of credit, costs, liabilities
- **Standing orders:** "Instructions to foreman"
- **Reports:** morning briefing, end-of-day report, "while you were away"
- **Debug panel** (open with `?debug` in the address): speed multiplier, jump to date, state inspector, fire event, reseed, replay, export/import

---

## 3. Data formats

### Effect shorthand
The docs' shorthand is kept in the data files and converted to numbers by a tuning table in the pack. On 0–100 scales, for example, `+` = 5 and `++` = 15. Where the docs give dollar amounts, those are used directly.

### Event template (example, shortened)
```yaml
id: EVT_WALT_LIMP
category: [staff, health]
type: inbox
deadline: { days: 4 }
delegation: never
trigger:
  kind: weighted
  when: { all: [ { gameDay: { gte: 7 } }, { any: [ { gt: [staff.walt.fatigue, 60] }, { flag: walt_on_night_checks }, { weather: cold_snap } ] } ] }
  weight: 1
  modifiers: [ { when: { gt: [staff.walt.fatigue, 80] }, add: 2 } ]
cooldown: { days: 999 }
maxOccurrences: 1
text: >
  You notice Walt favouring his left leg climbing into the tractor...
choices:
  - id: private_word
    label: Have a private word
    reactions: [ { who: walt, sentiment: 1 } ]
    effects:
      - check: { trust: walt, difficulty: 55 }
        success: [ { flag: walt_health_known }, { trust: [walt, "+"] } ]
        failure: [ { trust: [walt, "-"] }, { note: [walt, "Asked about knee; brushed off."] } ]
  - id: leave_it
    label: Leave it. He's a grown man.
    effects:
      - schedule: { event: EVT_WALT_FALL, in: { days: [7, 28] }, soonerIf: { gt: [staff.walt.fatigue, 70] } }
noResponse: { choice: leave_it }   # never-delegable: applied as lapse effects; item stays in inbox
```

The same building blocks handle the rest of the batch:
- Skill checks: `check: { skill: stockmanship, who: $checker }`
- Trait branches: `if: { trait: [walt, pride, high] }`
- Multi-select ("pick up to 2"): `select: { max: 2 }`
- Per-delegate outcomes: `noResponse: { byDelegate: { walt: ..., rosa: ... } }`
- Standing-order outcomes: `noResponse: { byOrder: vetStance }`
- Variables: `vars: { hayPrice: { range: [210, 245] }, checker: { from: nightRota } }`, used in text as `{checker.name}`

Two-stage events (e.g. Walt's fall, then the next-day pay and crew decisions) become short chains of linked templates.

### Staff (static pack data; changing state lives in the save)
```yaml
id: walt
name: Walt Haskins
birthDate: 1965-08-14
role: foreman
employment: { pay: 52000, perks: [house, beef, truck], startDate: 1992-04-01, pastProbation: true }
skills: { stockmanship: 18, horsemanship: 15, mechanical: 11, landHay: 16, admin: 4, leadership: 14, judgement: 15, workRate: 13, physical: 8 }
traits:            # true value (hidden) + first impression shown to the player (may be off)
  adaptability: { value: 3, impression: [1, 8] }
priorities: { ranchLife: 0.9, security: 0.6, recognition: 0.6, money: 0.2, family: 0.3, health: 0.2 }
life: { domains: { family: {...}, health: {...} }, milestones: [] }
startState: { morale: 50, fatigue: 30, trustInOwner: 25, delegationTrust: 20 }
relationships: { rosa: -20, ty: 30, june: 50 }   # one-way, as in staff.md section 6
```
Birth dates drive age, birthdays and life stage, so multi-year play needs no rewrite.

### Ranch
- 9 areas, each with acres, type, grass condition, water, fence condition and cattle present
- Herd groups with counts and condition
- A calving curve spreading births over six weeks
- Hay tons and daily use per ration level
- Infrastructure condition
- Finances and liabilities (hidden until discovered)

### One-to-ones
These use the same condition and effect language:
- Each topic has replies per person, chosen by trust band, mood and active life events.
- Topics have a chance to narrow trait ranges.
- Agreed actions become **commitments**, each with a due date and a "kept if" condition.

---

## 4. MVP milestones

Each milestone is playable on the phone.

| # | Milestone | What you can try |
|---|---|---|
| M0 | Skeleton and deployment | Open the link, install to the home screen, works in airplane mode |
| M1 | Clock, save and debug | Live game clock and blocks, catch-up after closing, fast forward, saves survive restarts, debug panel |
| M2 | Event engine and inbox | First 3 events (Hay, June's invoices, Summit letter) with choices, deadlines, flags and follow-ups |
| M3 | Ranch simulation | Calving, hay running down, cash and line of credit, map, finance screen, briefing and end-of-day report |
| M4 | Staff and delegation | Staff screens, fatigue and morale, standing orders, delegation resolver, "while you were away" |
| M5 | All 16 batch 1 events | Every chain, skill and disclosure checks, urgent night calls, the blizzard |
| M6 | One-to-ones and hints | Fortnightly 1:1s, trait narrowing, commitments, file notes, consequence hints |
| M7 | Balance and polish | Pacing, end-of-season screen, automated "bot plays 100 seeds" check, update banner |

**First playable season (AGREED):** ends in **mid-April**, when batch 1's content runs out. Extending it to mid-June turnout needs batch 2 (branding and turnout) plus some reusable filler templates (fence down, breakdown, supplier quote). These will be drafted for approval after M5.

### Testing on an Android phone
1. Every push to the development branch builds the game and deploys it to GitHub Pages.
2. Open the link in Chrome, then ⋮ → **Add to Home screen / Install app**.
3. When a new version is deployed, the app shows a "New version – tap to reload" banner.

---

## 5. Later (out of scope for the MVP)
- **Push notifications** for urgent decisions. These need a small backend to send pushes while the app is closed.
- Other seasons, hiring, expansion, the UK farm pack.

---

## 6. Decisions made
- 2026-11-18: Tech plan agreed: TypeScript, React, Vite, vite-plugin-pwa, IndexedDB, YAML content with schema validation, GitHub Pages hosting.
- 2026-11-18: Never-delegable decisions stay in the inbox past their deadline, but their lapse effects apply when the deadline passes, and some choices may become unavailable.
- 2026-11-18: The first playable season ends mid-April (end of batch 1 content). Batch 2 and filler templates come after M5.
- 2026-11-18: The repo is public so GitHub Pages hosting is free.
- 2026-11-18: A new game starts on 1 March at the player's current local time of day.
- 2026-11-18: "Next day" does not stop for delegable inbox items. They stay in the inbox until their deadline.
- 2026-11-18: Long absences are simulated faithfully. Pile-up will be tested before any cap is considered.
- 2026-11-18: Content files are YAML; the map is a stylised flat SVG; design docs live in the repo under `design/`.
