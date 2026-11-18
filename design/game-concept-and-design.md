# Ranch Manager — Game Concept & Design

_Living document. Update the "Decisions made" and "Open questions" sections whenever something is agreed._

## 1. Core concept
A real-time ranch management sim built around **decision-making**. The player has just bought a run-down Montana cattle ranch and inherited a small team of staff. They never do the physical work. They run the business like an employer: finances, livestock and land, expansion, and their people (wellbeing, training, leave, pay, conduct).

**The pitch:** Football Manager / Two Point Hospital, set on a ranch. It should feel like being a proper employer without doing the graft.

**What makes it different:** most farm games are about manual labour. This one is about judgement, trade-offs and people.

**Game structure:** open-ended, with no win condition. The game ends only if:
- the ranch collapses financially (the bank forecloses), or
- the player chooses to sell up.

Otherwise the player can keep playing indefinitely.

## 2. Setting
- **Launch setting:** a Montana cattle ranch (cow-calf operation to start).
- **Tone:** rugged, dramatic, big-sky Western (inspired by the feel of shows like Yellowstone). Use original characters, names and places only, with no references to the show itself.
- **Montana specifics to lean on:**
  - Harsh winters and blizzards, and a spring calving season in the snow
  - Summer drought and wildfire risk
  - Water rights disputes
  - Wolves and grizzlies preying on livestock
  - Neighbouring ranches and land developers circling
  - Brand inspection rules (Montana is a brand-inspection state)
  - Remote distances to town, the vet and the sale barn
- **Later option:** choose a UK farm at the start (different livestock, regulations, subsidies and tone). Setting-specific content (events, prices, regulations, seasons, map tiles) lives in data files, not hard-coded, so a UK pack can be added later.

### Ranch flavour to draw on
- **Livestock:** beef cattle (cows, calves, bulls), ranch horses, working dogs
- **Land:**
  - Pasture rotation and hay meadows
  - Water: wells, creeks, stock tanks, water rights
  - Fencing
- **Ranch year:**
  - Spring: calving, branding
  - Summer: grazing, hay cutting
  - Autumn: weaning, shipping calves to sale
  - Winter: feeding hay, keeping animals alive through storms
- **Outside parties:**
  - The vet, feed and hay suppliers
  - The sale barn / auction, cattle buyers
  - The bank (operating loans)
  - Neighbouring ranchers, land developers
  - The brand inspector, USDA programmes

## 3. Platform
- **Web-based, mobile-first.** Built for portrait phone screens with large tap targets and one-handed play. It should still work on a desktop browser.
- Installable to the home screen as a Progressive Web App (PWA), with progress saved on the device.
- Built for **2–3 check-ins a day**, with fast forward for players who want longer sessions.
- _Proposed:_ push notifications for urgent decisions (PWAs support these on Android).

## 4. Visual style
- **Football Manager style:** screens built from menus, tables, stats and an inbox. A clean, information-rich UI, not animated characters.
- **Ranch map:** a top-down map showing the pastures and fields: what is being grazed or grown where, where the herds are, and the condition of pasture, water and fences. Tap an area to see details or take action.
- The UI should evoke a ranch office: ledger, whiteboard and map table.

## 5. The decision engine (the core of the game)
Design principles:
1. **State-driven triggers, not randomness.** Each event template has conditions (season, weather, cash, herd health, staff morale or fatigue, traits, reputation) and a weight. The current state of the ranch decides what is likely to happen.
2. **Delayed consequences.** Decisions set flags or schedule follow-up events days or weeks later. For example, refusing leave can lead to a resignation hint three weeks on, and skipping a vet check can lead to an outbreak next month.
3. **Always a trade-off.** Every choice affects at least two things: money vs morale, short term vs long term, output vs animal welfare, reputation vs cost. There should be no obviously right answer.
4. **Staff as characters.** Each person has traits (e.g. loyal, ambitious, cautious, hot-headed), skills, needs, fatigue, morale and relationships with other staff. The same event plays out differently depending on who is involved.
5. **Templates with variables.** One template (e.g. equipment breakdown) produces many versions: the item, the cost, who found it, the timing. Cooldowns and history stop events repeating too soon.
6. **Two decision types:**
   - **Urgent** decisions with a deadline ("cattle are out on the highway")
   - **Inbox** items handled at your own pace (leave requests, supplier quotes, training courses, pay reviews)
7. **Location-aware events.** Events can be tied to places on the map, e.g. a fence down in the north pasture, or a creek running low in a particular field.
8. **Pacing in line with real time.** At 1 game day = 1 real day, each game day should produce enough decisions to fill 2–3 short check-ins, roughly 3–8 decisions a day plus the briefing and report. More happens in busy seasons such as calving, less in quiet stretches of winter.

### Event template — draft shape
- id, category, setting (ranch / UK)
- trigger conditions + base weight + weight modifiers
- cooldown, max occurrences
- variables to fill (staff member, item, cost range, map location)
- text (with variables)
- choices → immediate effects + scheduled follow-ups / flags
- urgency (deadline or inbox)
- **delegation outcome:** what happens if the player doesn't respond in time, and how standing orders apply (see section 7)
- **delegation class:** delegable / delegable within limits / never delegable

## 6. Time & real-time structure
- **Time ratio: 1 game day = 1 real day.** The game clock runs in real time and carries on while the app is closed (see section 7).
- **The day is split into three blocks**, matching the 2–3 check-ins:
  - **Morning (from 6am):** morning briefing (weather, herd, staff, cash)
  - **Midday (from 12pm)**
  - **Evening (from 6pm):** end-of-day report
- Decisions are generated across the blocks, so checking in once per block keeps you on top of things.
- The seasonal ranch calendar drives what kinds of events come up.

### Fast forward
- **"Next decision"** button: jumps the clock forward to the next decision that needs the player, **capped at the start of the next block (about 6 hours)**. It stops early if anything arrives, so nothing is skipped past unseen.
- **"Next day"** option: jumps to the next morning briefing. It **stops immediately for any urgent or never-delegable decision**. Routine items and delegable decisions are handled under standing orders along the way and appear in the summary.
- The game clock can run **ahead of the real clock**. Once it does, it carries on in real time from the new point; it never jumps back. Fast forward is how players choose their own speed.
- Quiet periods (e.g. deep winter) may jump further in one press, because fewer decisions are generated.

## 7. Delegation & standing orders (offline progress)
**Agreed model:** while the player is away, the ranch carries on with limited progress through delegation.
- Routine ranch work carries on.
- If an urgent decision isn't answered before its deadline, the **foreman (or most senior staff member present) handles it**, within the player's standing orders. The outcome depends on their skill, traits and judgement. A cautious foreman spends money to be safe; a hot-headed one might make things worse.
- **Never-delegable decisions** wait in the inbox, however long the player is away:
  - Hiring and firing
  - Disciplinaries
  - Pay changes
  - Large spends above the standing-order limit
  - Selling or buying cattle or land
  - Taking on loans
- On returning, the player gets a **"while you were away" summary**: what happened, what staff decided and why, and what is waiting.
- Training and promoting a trusted foreman becomes valuable, because it makes time away safer. This mirrors real delegation.

### Standing orders (delegation parameters) — first draft
Players set these on an "Instructions to foreman" screen:
- **Spending limit** without asking (e.g. $0 / $250 / $500 / $1,000), possibly split by category (repairs, vet, feed)
- **Animal welfare stance:**
  - Always call the vet
  - Use your judgement
  - Only for serious cases
- **Overtime:** allowed / allowed up to X hours / not allowed
- **Short-notice leave or sick cover:** approve if cover is available / always refer to me
- **Weather response:**
  - Move cattle to shelter proactively
  - Wait for my instruction
- **Supplier choices:** cheapest / usual supplier / best quality
- **Predators:**
  - Report only
  - Scare off
  - Contact wildlife services
- **Who is in charge** when the foreman is off or on leave

Delegation **quality** depends on who is in charge, their skills and traits, and their trust/experience level. Poor delegates may misread standing orders or push them to the limit.

## 8. Systems underneath
- **Finances:**
  - Cash flow vs profit
  - Operating loans and interest
  - Seasonal income (calves sold in autumn) against year-round costs
  - Cattle market prices that move over time
  - Bankruptcy / foreclosure as the fail state
  - A ranch valuation, for the sell-up option
- **Livestock & land:**
  - Herd size and health
  - Breeding and calving rates
  - Pasture condition, hay stocks, water
  - Predators
- **Staff:**
  - Hiring and firing
  - Pay reviews
  - Training that unlocks new abilities
  - Leave planning and cover
  - Wellbeing, burnout and sickness
  - Disciplinaries and disputes between staff
  - Delegation and trust
- **Ranch infrastructure:** fences, barns, equipment, vehicles, water systems; upgrades and repairs
- **Reputation & regulation:**
  - Standing in the community and with buyers
  - Animal welfare
  - Inspections, brand rules, compliance
- **Expansion (later):**
  - More land and new enterprises (e.g. horse breeding, guest ranch / dude ranch, hunting leases, contract grazing)

## 9. MVP / first prototype scope
Kept deliberately small, to prove the decisions are fun:
- One Montana ranch, cow-calf operation only
- 3–4 inherited staff with traits, including a foreman
- One season (probably spring: calving and branding)
- Around 40 event templates, including chained follow-ups and delegation outcomes
- Basic finances (cash, costs, one income event)
- Simple ranch map (a handful of pastures)
- Real-time clock (1:1), three daily blocks, offline progress via delegation, "Next decision" / "Next day" fast forward
- Basic standing orders (spending limit, vet stance, overtime, leave cover)
- Morning briefing, end-of-day report, "while you were away" summary
- Mobile-first web build with save on device

## 10. Decisions made
- 2026-11-18: Core concept agreed: decision-based ranch/farm employer sim, real time.
- 2026-11-18: **Setting:** American ranch first; UK farm as a possible later option, chosen at the start.
- 2026-11-18: **Platform:** web-based, primarily targeted at mobile.
- 2026-11-18: **Region:** Montana (Yellowstone-style tone, original content only).
- 2026-11-18: **Time:** real time; the game continues with limited progress while the app is closed; designed for 2–3 check-ins a day; fast forward available.
- 2026-11-18: **Structure:** open-ended. Fail state is financial collapse; the player can also choose to sell the ranch. Otherwise no end.
- 2026-11-18: **Visual style:** Football Manager style UI plus a top-down ranch map showing what is farmed where.
- 2026-11-18: **Time ratio:** 1 game day = 1 real day. Players set their own pace with fast forward.
- 2026-11-18: **Fast forward:** jumps to the next set of decisions (design in section 6: "Next decision", capped at about 6 hours / the next block, plus "Next day").
- 2026-11-18: **Delegation:** agreed. The foreman handles urgent decisions while the player is away, within player-set standing orders; big decisions are never delegated.
- 2026-11-18: **Never-delegable decisions past their deadline:** they stay in the inbox and the player still decides, but the template's "if no response" effects apply as lapse effects when the deadline passes, and some choices may become unavailable (e.g. Dale withdraws the hay offer).
- 2026-11-18: **"Next day" and delegable inbox items:** items with multi-day deadlines stay in the inbox until their deadline rather than being decided by the delegate during fast forward. "Next day" doesn't stop for them.
- 2026-11-18: **Game start time:** a new game starts on 1 March at the player's current local time of day.
- 2026-11-18: **Fast-forward design confirmed** as in section 6 (three blocks, "Next decision" capped at the next block, "Next day").
- 2026-11-18: **MVP standing orders:** spending limit, vet stance, overtime, short-notice leave cover, weather response, who is in charge.
- 2026-11-18: **Map style:** stylised flat illustration (SVG).
- 2026-11-18: **Tech approach:** see `design/tech-plan.md` (TypeScript, React, Vite, PWA, IndexedDB saves, YAML content, GitHub Pages).
- 2026-11-18: **First playable season** ends mid-April (end of batch 1). Extending to mid-June turnout needs batch 2 plus filler templates, to be drafted after milestone M5.

## 11. Open questions
- Push notifications for urgent decisions: deferred until after the MVP (they need a small backend)
