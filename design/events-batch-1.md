# Ranch Manager — Event Templates, Batch 1 (Opening Weeks: Calving)

_Agreed 2026-11-18. Companion to the concept, staff and starting-ranch docs._

Covers roughly **1 March to mid-April** (the first six weeks). Sixteen templates, including chained follow-ups.

---

## How to read these

Each template uses this shape:

- **ID / category**
- **Triggers:** state conditions that make it eligible, plus anything that raises or lowers its weight
- **Type:** Urgent (with a deadline) or Inbox (handled at your own pace)
- **Delegation class:**
  - Delegable
  - Delegable within limits (standing orders apply)
  - Never delegable
- **Variables:** things filled in at generation time
- **Situation:** the text the player sees (draft)
- **Choices:** each with immediate effects and follow-ups. Every choice has a cost: money, morale, trust, risk, time or reputation.
- **If no response:** what the person in charge does, which depends on who they are and the standing orders
- **Follow-ups:** events this one can schedule or make more likely

### Effect shorthand
| Shorthand | Meaning |
|---|---|
| `+` / `−` | Small change |
| `++` / `−−` | Large change |
| `Cash`, `Rep` | Cash, reputation |
| `Morale(X)`, `Trust(X)` | That person's morale, or trust in the owner |
| `Fatigue(X)` | That person's fatigue |
| `Rel(X↔Y)` | Relationship between two people |
| `Herd`, `Pasture(X)` | Herd health/condition, pasture condition |
| `Flag: x` | A remembered fact other events can check |
| `→ EVENT` | Schedules or raises the weight of a follow-up event |
| `Note` | Adds a written note to someone's staff file (counts as process evidence) |

Costs are placeholders.

### Consequence hints (AGREED)
- Choices show **no consequence hints by default**. The player finds out what happens afterwards.
- **Hints unlock per staff member** once the player knows them well enough: enough trust, plus the relevant trait range narrowed through one-to-ones and time together. Examples:
  - "Walt won't like this"
  - "Rosa will see this as a sign of respect"
  - "Ty is likely to take this badly"
- Hints only cover **people's reactions**, never hidden outcomes such as whether a bull is infertile or how bad a storm will be.
- Hints can be wrong if the player's read of the person is wrong. A trait range that hasn't fully narrowed gives a softer hint ("Walt might not like this").
- This makes one-to-ones and getting to know the team pay off directly in decision-making.

### Choices per event (AGREED)
Up to four choices per event, which suits mobile. Simpler events can have three.

---

## 1. EVT_HAY_SHORTFALL — "Not enough to make grass"
- **Category:** Feed / Finance
- **Triggers:** Game day 1–3 (opening event). Raised if hay stocks < days to turnout × daily need.
- **Type:** Inbox, with a 5-day deadline
- **Delegation class:** Delegable within limits
- **Variables:** hay price ($210–245/ton delivered), tons needed (~100–130)
- **Situation:** Walt walks you round the hay barn. "We've got about 90 ton. With calving coming and if April's anything like last year, we'll be out by mid-April. Grass won't be ready till the middle of May."
- **Choices:**
  1. **Buy from Harlan Feed & Supply** (~120 tons at the going rate, ~$27k)
     - Cash −−. Hay security ++.
     - If `Flag: feed_invoice_unpaid` is set, they **won't deliver on credit** until the old balance is settled → EVT_JUNE_INVOICES (forced early)
  2. **Ask the Kesslers.** Cheaper, and they're next door.
     - Cash −. Opens the neighbour relationship.
     - → EVT_KESSLER_HAY_DEBT (they mention Frank's unpaid hay)
  3. **Cut rations by ~15%** and stretch what's there
     - Cash 0. Herd condition −.
     - Calving difficulty risk + (raises EVT_CALVING_DIFFICULTY weight)
     - Autumn weaning weights −. Trust(Walt) − ("Frank did that once. Never again.")
  4. **Plan an early turnout** onto Home Pasture in late April
     - Cash 0. Pasture(Home) −− for the season.
     - Summer grazing capacity −. `Flag: early_turnout`
- **If no response:**
  - **Walt:** rings the Kesslers on a handshake (option 2 without telling you)
  - **Rosa:** orders from Feed & Supply up to the spending limit, and partially cuts rations for the rest
- **Follow-ups:** EVT_JUNE_INVOICES, EVT_KESSLER_HAY_DEBT; later hay crisis events if the shortfall isn't solved

---

## 2. EVT_NIGHT_CHECK_ROTA — "Who's watching the heifers?"
- **Category:** Staff / Livestock
- **Triggers:** First calf born (game day ~3–6)
- **Type:** Inbox, with a 2-day deadline
- **Delegation class:** Delegable
- **Situation:** The first calf of the season is on the ground. Calving will run for six weeks, and someone needs to check the heifers every few hours through the night. Walt says he'll "do it like always". Rosa catches you afterwards: "He did every night himself last year. He was dead on his feet by April."
- **Choices:**
  1. **Three-way rota** (Walt, Rosa, Ty)
     - Fatigue(all) + steadily. Fair.
     - Ty's reliability is tested → EVT_TY_LATE weight +
  2. **Walt does it as he always has**
     - Trust(Walt) +. Fatigue(Walt) ++. Walt injury risk ++ (→ EVT_WALT_LIMP)
     - Morale(Rosa) − ("you've just let him")
  3. **Hire a temporary night calver** (~$200/night for 6 weeks, ~$8k)
     - Cash −−. Fatigue stays low.
     - Walt sees it as a slight → Trust(Walt) − (unless trust is already high)
  4. **Install a calving camera** in the shed and calving pasture (~$2,500)
     - Cash −. Fatigue + (checks are quicker, but someone still has to watch the screen at night).
     - Walt resists: "Don't need a TV to tell me a cow's calving". Trust(Walt) −, Morale(Rosa) +
     - `Flag: calving_camera`. Halves future night-fatigue gains.
- **If no response:** Walt does it himself (option 2)
- **Follow-ups:** EVT_CALVING_FATIGUE, EVT_WALT_LIMP, EVT_TY_LATE

---

## 3. EVT_BLIZZARD_WARNING — "Big one coming"
- **Category:** Weather / Livestock
- **Triggers:** Weather system generates a blizzard (Mar–Apr chance). Weight + with cows due to calve.
- **Type:** Urgent, with a 12-hour deadline (warning issued 36 hours ahead)
- **Delegation class:** Delegable within limits
- **Variables:** severity (heavy snow / full blizzard), number of cows close to calving
- **Situation:** The weather service has issued a blizzard warning: 18 inches of snow and 50 mph winds from tomorrow night. There are {N} cows close to calving in the calving pasture, and the calving shed roof still leaks.
- **Choices (pick up to 2):**
  1. **Move the close-up cows into the shed and patch the roof** (tarps and timber, ~$800, half a day's work)
     - Cash −. Calf losses −−. Fatigue(all) +
  2. **Bed the calving pasture with straw and put up windbreaks** (~$1,500 of straw)
     - Cash −. Calf losses −
  3. **All hands on overnight, with overtime pay** (overtime is optional in agriculture)
     - Cash −. Calf losses −−. Morale(all) + if paid, − if unpaid
     - Fatigue(all) ++
  4. **Ride it out.** Cattle have survived storms before.
     - No cost now. Calf losses ++ (scaled by severity). Rep − if losses are heavy.
- **If no response:** depends on the standing order "Weather response":
  - **Proactive:** whoever is in charge picks options by skill. Walt picks 1+2 and does it well. Ty picks 3 but forgets the straw.
  - **Wait for instruction:** they hold off until it's too late → nearly option 4
- **Follow-ups:** EVT_CALVING_DIFFICULTY (weight ++ during the storm), EVT_CALVING_FATIGUE; frostbitten calves (vet costs, lower sale value); EVT_INSURANCE_CLAIM if `Flag: insurance_lapsed`

---

## 4. EVT_CALVING_DIFFICULTY — "Heifer in trouble"
- **Category:** Livestock (recurring, weighted)
- **Triggers:** Calving season. Weight + for first-calf heifers, storms, cut rations, fatigued checkers. Time of day follows the night-check rota.
- **Type:** Urgent, with a 1–2 hour deadline
- **Delegation class:** Delegable (vet stance standing order applies)
- **Variables:** who's on check, heifer or cow, severity (pull / malpresentation / C-section needed), road conditions
- **Situation (example):** 2:14am. {Checker} radios: "Got a heifer been straining an hour, nothing showing but one foot. Looks like a leg back."
- **Choices:**
  1. **Call Dr Marsh out** (~$450 night call-out, 1.5–3 hours depending on roads)
     - Cash −. Best outcome odds if she gets there in time.
     - Vet relationship + (you're a paying client), or − if you call her for trivial things too often
  2. **Let {checker} handle it.** Success odds = Stockmanship skill check (Walt 18, Rosa 16, Ty 9).
     - Free. Success builds that person's confidence and morale, and +Delegation trust.
     - Failure can mean a dead calf, an injured heifer, or both. Morale(checker) − (they blame themselves).
  3. **Get the most skilled person out of bed** to help (e.g. wake Rosa)
     - Free. Better odds. Fatigue(woken person) +
     - If Walt is woken when injured → EVT_WALT_LIMP weight +
- **If no response:** vet stance standing order:
  - **Always call the vet:** option 1
  - **Use your judgement:** the checker decides based on confidence. Ty overestimates himself.
  - **Only serious cases:** option 2 unless it's a C-section
- **Follow-ups:**
  - Calf/heifer losses feed into herd stats
  - A dead heifer (a costly loss) → possible guilt / wellbeing event for the checker
  - Repeated vet calls → EVT_VET_RELATIONSHIP (later batch)

---

## 5. EVT_WALT_LIMP — "It's nothing"
- **Category:** Staff / Health
- **Triggers:** Fatigue(Walt) high, or night checks done by Walt, or a cold snap. From game day ~7 onwards.
- **Type:** Inbox, with a 4-day deadline
- **Delegation class:** Never delegable (personnel)
- **Situation:** You notice Walt favouring his left leg climbing into the tractor. When you mention it he says, "Old knee. It's nothing." Ty later says he saw Walt sitting in the truck for twenty minutes after feeding, "just staring".
- **Choices:**
  1. **Have a private word, man to man and no pressure** (a disclosure check based on Trust(Walt))
     - **High trust:** he admits his back and knee have been bad for a year and he's scared of being pensioned off. `Flag: walt_health_known`. You get better options in future. Trust(Walt) +
     - **Low trust:** "I said it's nothing." Trust(Walt) − (you're prying). `Note`
  2. **Insist he sees a doctor before he does any more night checks**
     - Health is protected. Trust(Walt) −− (pride).
     - He may comply grudgingly → the diagnosis becomes known
  3. **Quietly adjust his duties:** take him off night checks and give him the feeding and the youngsters
     - Fatigue(Walt) −. Injury risk −
     - Depends on his trait: a proud Walt notices and resents it, Trust(Walt) −; otherwise he's relieved but won't say so
     - Workload moves to others: Fatigue(Rosa, Ty) +
  4. **Leave it.** He's a grown man.
     - No immediate effect. Injury risk ++ → EVT_WALT_FALL scheduled in 1–4 weeks (sooner if fatigue is high)
- **If no response:** treated as option 4
- **Follow-ups:** EVT_WALT_FALL; later Walt retirement and succession events become more likely once his health is known

---

## 6. EVT_WALT_FALL — "Walt's down in the corral" _(follow-up)_
- **Category:** Staff / Health / Compliance
- **Triggers:** Scheduled by EVT_WALT_LIMP (option 4 or no response), or high Walt injury risk during physical work
- **Type:** Urgent, with a 1-hour deadline, then an inbox follow-up
- **Delegation class:** The urgent part is delegable; the decisions afterwards are never delegable
- **Situation:** Ty radios in a panic. Walt went down hard in the corral moving a cow and can't get up. "He's saying don't call anyone."
- **Choices (urgent):**
  1. **Call an ambulance** (an hour away; expensive if uninsured)
  2. **Rosa drives him to hospital in the truck** (faster, but riskier if he's badly hurt, and the ranch is two people down for the day)
  3. **Respect his wishes and get him to the house** (risky; Trust(Walt) + but his health could get worse)
- **Inbox follow-up (next day):** Walt is off for 3–6 weeks (severity varies). Decisions:
  - **Pay while he's off:** full / half / none. There's no legal duty in this setting, so it's your call.
    - Full pay: Cash −, Morale(all) ++, Rep +
    - None: Morale(all) −−, Trust(Walt) −−, Rep −
  - **Who runs the crew:**
    - **Rosa as acting foreman:** Morale(Rosa) ++, Rel(Walt↔Rosa) −−
    - **Walt directing from the porch:** keeps his pride, but his recovery is slower and Rosa is frustrated
    - **Run it yourself:** you get a load of extra decisions, and less is delegated
  - **Insurance check:** if `Flag: insurance_lapsed`, June reports the lapsed policy included the ranch's employee injury cover. The ranch faces the medical costs directly (−− cash), plus a compliance headache. _(Exact workers' compensation rules for Montana agriculture to be verified.)_
- **Follow-ups:**
  - Walt's return-to-work and phased-duties event
  - The succession storyline is accelerated
  - Walt's daughter rings to pressure him to retire

---

## 7. EVT_ROSA_SCHOOL_CALL — "Mateo's sick"
- **Category:** Staff / Family
- **Triggers:** Weekday; Rosa on shift; her ex-partner unavailable. Weight + during school terms and winter illness season. Recurring (cooldown about 2 weeks).
- **Type:** Urgent, with a 1-hour deadline
- **Delegation class:** Delegable within limits (leave-cover standing order)
- **Situation:** Rosa comes to find you, phone in hand. "School just called. Mateo's running a fever and they need him collected. His dad's not answering. I'm sorry. I know we're mid-calving."
- **Choices:**
  1. **"Go. We'll manage."**
     - Morale(Rosa) +, Trust(Rosa) +
     - Gap in cover → Fatigue(Ty, Walt) +; calving risk + for the day
  2. **"Bring him back here."** He can rest in the ranch house.
     - Morale(Rosa) ++ (she can keep working part of the day)
     - Small risk to the ranch if a sick child is on site; it sets a precedent
     - Other staff notice: Rel(Rosa↔June) +. June offers to sit with him if she's in.
  3. **"Is there anyone else who can get him?"**
     - Morale(Rosa) −, Trust(Rosa) −
     - She'll likely go anyway, upset → Note on file (it could become a "conduct" issue unless handled well)
  4. **Agree a standing flexible arrangement:** she can leave for childcare emergencies and make the time up
     - Morale(Rosa) ++, Trust(Rosa) ++. Future requests are approved automatically.
     - `Flag: rosa_flex_agreement`
     - **Precedent:** Ty asks for similar flexibility for rodeo weekends later (→ EVT_TY_RODEO_FLEX, later batch)
- **If no response:** depends on the standing order "Short-notice leave":
  - **Approve if cover is available:** she goes (option 1)
  - **Always refer to me:** she waits, then goes anyway after the deadline → Morale(Rosa) −
- **Follow-ups:** recurring childcare events; Rosa's 1:1 may raise flexibility formally

---

## 8. EVT_TY_LATE — "Missed feeding"
- **Category:** Staff / Conduct
- **Triggers:** Fatigue(Ty) high, or the day after a weekend or rodeo, or `Flag: ty_night_out`. Weight ++ if Ty is on the night rota.
- **Type:** Inbox, with a 3-day deadline
- **Delegation class:** Never delegable (conduct)
- **Situation:** Ty turned up 90 minutes late this morning, looking rough, and Walt did the feeding alone. Walt says: "Kid's alright. He'll learn." Rosa says: "This is the third time this month."
- **Choices:**
  1. **Informal chat:** find out what's going on, set expectations
     - Disclosure check on Trust(Ty): may reveal the money worries, the girlfriend or a second job
     - Morale(Ty) neutral. `Note` (informal).
     - Recurrence chance − (moderately)
  2. **Formal verbal warning, documented**
     - `Note` (formal), which starts a good-cause evidence trail
     - Morale(Ty) −, Trust(Ty) −. Recurrence chance −−
     - Rosa approves; Walt thinks it's heavy-handed: Rel(Walt) − with you
  3. **Let Walt handle it**
     - Delegation trust(Walt) +
     - Walt is soft on him → recurrence chance barely changes
     - No note on file
  4. **Dock his pay for the time missed**
     - Cash +. Trust(Ty) −−. Morale(Ty) −−
     - _(Montana wage deduction rules to be verified. This may carry a legal risk flag.)_
- **If no response:** treated as option 3, but Rosa's morale dips ("nobody does anything")
- **Follow-ups:** repeat lateness (weighted by choice); EVT_TY_ATV_ACCIDENT (a fatigue-driven accident, later); money-advance request if his money worries came out in the chat

---

## 9. EVT_JUNE_INVOICES — "There's something you should see"
- **Category:** Finance / Compliance (June discovery thread #1)
- **Triggers:** Game day 4–10 (June's first full week), or forced by EVT_HAY_SHORTFALL option 1
- **Type:** Inbox, with a 7-day deadline
- **Delegation class:** Never delegable (spend above limit)
- **Situation:** June closes the office door. "Harlan Feed rang. There's $11,400 outstanding from November and December. Frank told me it was paid. I've found two more like it, the vet and the fuel company. About $18,000 all told. I'm sorry, I should have caught it."
- **Choices:**
  1. **Pay everything now** (~$18k)
     - Cash −−. Supplier relationships ++. Credit terms restored. Trust(June) +
     - Rep + ("pays their bills, unlike Frank at the end")
  2. **Agree payment plans with each supplier**
     - Cash − gradually. Relationships neutral
     - Feed & Supply only sells to you for cash until it's cleared
  3. **Dispute it: these are Frank's debts**
     - You bought the company, so legally they're yours. Legal advice costs money and you'll likely lose.
     - Relationships −−. Rep −
  4. **Ask June to go through everything properly** before deciding
     - Delays the payment decision by a week; suppliers are irritated
     - Brings the next discoveries forward (EVT_JUNE_INSURANCE sooner)
     - Trust(June) ++ ("finally, someone who wants to know")
- **If no response:** June won't pay without authority. Suppliers chase you; relationships −
- **Follow-ups:** EVT_JUNE_INSURANCE; property tax and operating line covenant discoveries (later batch)

---

## 10. EVT_JUNE_INSURANCE — "We're not covered"
- **Category:** Finance / Compliance (June discovery thread #2)
- **Triggers:** After EVT_JUNE_INVOICES (sooner if option 4 was picked), game day ~8–18
- **Type:** Urgent-ish, with a 3-day deadline
- **Delegation class:** Never delegable
- **Situation:** June: "The ranch policy lapsed in January. The renewal letter was in a drawer in Frank's desk. We've had no property, livestock or liability cover for six weeks. Or employee cover."
- **Choices:**
  1. **Reinstate the policy with the old insurer straight away**
     - Premium is higher than before because of the lapse (Cash −). Covered tomorrow.
  2. **Shop around for a better deal:** about a week uninsured
     - Cheaper long term. Any disaster in that week is uncovered.
  3. **Minimal cover:** liability and employees only, no livestock or property
     - Cash − (small). Storm losses or a barn fire aren't covered.
- **If no response:** stays uninsured until decided (`Flag: insurance_lapsed` stays set)
- **Follow-ups:** any disaster while the flag is set costs the full amount (EVT_WALT_FALL, the blizzard, a barn fire); a later "insurance review" event

---

## 11. EVT_KESSLER_HAY_DEBT — "Frank owed us"
- **Category:** Neighbours / Finance
- **Triggers:** EVT_HAY_SHORTFALL option 2, or Walt contacting the Kesslers under delegation, or a random visit in the first month
- **Type:** Inbox, with a 5-day deadline
- **Delegation class:** Never delegable
- **Situation:** Dale Kessler drives over, polite but firm. "Happy to help with hay. But Frank never settled for the 40 ton we sent last spring. Walt and I shook on it. Eight thousand dollars." Walt, standing behind him, nods. "That's right." There's no paperwork.
- **Choices:**
  1. **Honour it.** A handshake's a handshake.
     - Cash −. Rel(Kesslers) ++. Trust(Walt) ++. Rep ++ (word spreads in town)
     - The Kesslers sell this year's hay at a fair price
  2. **Ask for some proof**
     - Rel(Kesslers) −− (insulted). Trust(Walt) −− (you've doubted his word)
     - You might save money if there's no proof
  3. **Negotiate:** pay half now, and **put the Spring Gulch water arrangement in writing** as part of the deal
     - Cash − (half). Rel(Kesslers) neutral
     - `Flag: spring_gulch_documented`, which removes a future dispute risk
     - Walt is uneasy ("we never needed paper"), Trust(Walt) −; June approves
- **If no response:** Dale leaves cool; Rel(Kesslers) −. The hay offer is withdrawn.
- **Follow-ups:**
  - Brings the Spring Gulch water-sharing question into the open
  - A future Kessler poaching approach to Rosa is weighted by this relationship

---

## 12. EVT_BULL_SOUNDNESS — "About those bulls"
- **Category:** Livestock / Long-term
- **Triggers:** Game day 14–40 (before June turnout). Weight + if any bulls are 7+ years old.
- **Type:** Inbox, with a deadline of 3 weeks before turnout
- **Delegation class:** Delegable within limits
- **Situation:** Rosa flags it in passing: "Three of those bulls are old, and nobody tested them last year. If one's firing blanks, we won't know till preg-check in October."
- **Choices:**
  1. **Breeding soundness exam for all 8** (vet visit plus ~$75/head)
     - Cash −. Any failures are revealed now; you then decide whether to buy a replacement.
  2. **Test only the 3 old ones**
     - Cash − (smaller). Small risk remains.
  3. **Skip it.** Walt says they're fine.
     - Free. Trust(Walt) +
     - Hidden roll: if a bull is infertile → in **October**, preg-check shows extra open cows (−calves next year, −− income in 18 months)
  4. **Buy a new young bull now** (~$8–10k)
     - Cash −−. Genetics +. Reduces the risk whatever happens.
- **If no response:** treated as option 3
- **Follow-ups:** a very long delayed consequence (the October preg-check event), and a good example of decisions with long tails

---

## 13. EVT_CALVING_FATIGUE — "Running on empty"
- **Category:** Staff / Wellbeing
- **Triggers:** Average fatigue of the night-rota staff above threshold, typically after 10–14 days of calving. Not triggered if a night calver was hired.
- **Type:** Inbox, with a 3-day deadline. Can also surface early in a 1:1 if trust is high.
- **Delegation class:** Never delegable
- **Situation:** Rosa: "We're all on our knees. Ty fell asleep in the truck at the calving pasture last night. Somebody's going to get hurt, or we'll lose calves we shouldn't."
- **Choices:**
  1. **Hire temporary help** for the rest of calving
     - Cash −−. Fatigue(all) −− over a few days
     - The new hand is an unknown quantity (could spawn a new-hire event)
  2. **Give everyone a rotating day off**
     - Fatigue(all) −. Cover gaps on those days. Calving risk +
  3. **Pay a calving bonus** for pushing through
     - Cash −. Morale(all) +. Fatigue unchanged, so the risk stays.
  4. **"Two more weeks and we're through. Push on."**
     - Fatigue(all) ++. Mistake and injury risk ++. Morale(all) −
     - Trust(Rosa) −. Ty is likely to make a mistake (→ EVT_TY_ATV_ACCIDENT weight ++)
- **If no response:** treated as option 4
- **Follow-ups:** the accident chain; Rosa's trust affects how receptive she is to a future Kessler approach

---

## 14. EVT_CALF_SCOURS — "Calves are scouring"
- **Category:** Livestock / Health
- **Triggers:** Wet or snow-melt weather; calving pasture crowded; game day ~20+. Weight + if `Flag: vacc_records_incomplete` and no pre-calving scours vaccination.
- **Type:** Urgent, with a 24-hour deadline
- **Delegation class:** Delegable within limits
- **Variables:** number of calves affected
- **Situation:** Ty: "Got six calves with the scours down by the creek end, two of them looking pretty flat." The calving pasture is muddy and packed.
- **Choices:**
  1. **Vet visit and treat every affected calf** (~$1,500)
     - Cash −. Losses −−. Vet relationship +
  2. **Treat them ourselves** (electrolytes, isolation pen, extra labour)
     - Cash −. Fatigue(all) +. Losses − (depends on stockmanship)
  3. **Move pairs out to clean ground** (Home Pasture)
     - Spread is cut −−
     - Pasture(Home) − (early grazing), and it combines with `Flag: early_turnout` damage
  4. **Monitor and wait**
     - It may spread: affected calves can double; losses +
- **If no response:** vet stance standing order applies (Walt treats them himself and moves pairs; Rosa calls the vet)
- **Follow-ups:**
  - A note to vaccinate cows pre-calving next year (a planning item)
  - Fewer calves sold in autumn
  - Raises the importance of the records discovery

---

## 15. EVT_SUMMIT_LETTER — "A polite reminder"
- **Category:** Neighbours / Summit Ridge (background thread)
- **Triggers:** Game day 10–25 (introductory, one-off)
- **Type:** Inbox, no deadline
- **Delegation class:** Never delegable
- **Variables:** current standing offer (starts around 10% above valuation)
- **Situation:** A letter on heavy paper from Summit Ridge Holdings congratulates you on the purchase. It notes that "our offer remains open, should your circumstances change", gives a figure, and includes a card for their land manager.
- **Choices:**
  1. **Reply politely and keep the door open**
     - Neutral. The standing offer stays visible on the finance screen.
  2. **Decline firmly:** Thistle Creek isn't for sale
     - Rep + if word gets round (via June). Their next offer starts lower.
  3. **Ignore it**
     - Neutral
  4. **Meet their land manager** to hear them out
     - You learn their plans (useful information)
     - The town hears about it → Rep −, and June raises an eyebrow
- **If no response:** treated as option 3
- **Follow-ups:**
  - The standing offer is tracked from here, and rises if the ranch is struggling
  - Occasional low-key Summit Ridge events in later batches

---

## 16. EVT_TICK_SLOWING — "Old dog"
- **Category:** Animals / Staff (light, emotional)
- **Triggers:** Cold weather plus heavy cattle work; game day ~10–30
- **Type:** Inbox, with a 7-day deadline
- **Delegation class:** Delegable
- **Situation:** Tick, the old Border Collie, couldn't get up this morning after yesterday's gather. Walt carried him to the truck himself. Juno is keen but only half-trained.
- **Choices:**
  1. **Retire Tick to the porch**
     - Juno takes over before she's ready (−efficiency moving cattle for a few weeks)
     - Walt is quiet but grateful: Trust(Walt) + _(he may read it as a parallel to himself, depending on trust)_
  2. **Invest time in training Juno** (assign Rosa or Ty: their time is less available)
     - Juno improves over weeks. Training Ty to train her: Morale(Ty) +
  3. **Keep working Tick through calving.** He's still the best dog on the place.
     - Efficiency maintained. Risk Tick collapses (→ a sad follow-up). Morale(Walt) − if that happens
  4. **Vet check for Tick** (~$200)
     - Pain relief keeps him going a bit longer. Cash −
- **If no response:** Walt keeps Tick working (option 3)
- **Follow-ups:** Tick's later retirement and passing (handled gently); Juno's development

---

## Chains in this batch (summary)

| Starts with | Can lead to |
|---|---|
| HAY_SHORTFALL | JUNE_INVOICES (forced), KESSLER_HAY_DEBT, later hay crises |
| NIGHT_CHECK_ROTA | CALVING_FATIGUE, WALT_LIMP, TY_LATE |
| WALT_LIMP | WALT_FALL (if ignored), succession thread |
| WALT_FALL | Insurance consequences, acting foreman (Rosa vs Walt), daughter's pressure |
| JUNE_INVOICES | JUNE_INSURANCE (sooner), later discoveries |
| ROSA_SCHOOL_CALL (flex agreement) | TY_RODEO_FLEX (precedent) |
| TY_LATE | Repeat lateness, ATV accident, wage advance |
| CALVING_FATIGUE (push on) | TY_ATV_ACCIDENT, mistakes, Rosa's trust → poaching risk |
| KESSLER_HAY_DEBT | Spring Gulch water question, Kessler relationship |
| BULL_SOUNDNESS (skipped) | October preg-check surprise |
| SUMMIT_LETTER | Standing offer tracked; occasional later events |

## Referenced but not yet written (for batch 2)
- EVT_TY_ATV_ACCIDENT
- EVT_TY_RODEO_FLEX
- EVT_WALT_RETURN_TO_WORK
- EVT_WALT_DAUGHTER_CALL
- EVT_INSURANCE_CLAIM
- EVT_VET_RELATIONSHIP
- EVT_PROPERTY_TAX / EVT_LOAN_COVENANT (June discoveries #3 and #4)
- EVT_PREG_CHECK_RESULTS (October)
- EVT_NEW_HIRE (from temporary help)

## Items to verify (real-world accuracy)
- Montana workers' compensation rules for agricultural employers
- Montana rules on deducting pay for lateness
- Typical night calver and breeding soundness exam costs

## Decisions made
- 2026-11-18: Batch 1 agreed as drafted (content and tone: realistic, with warmth).
- 2026-11-18: Up to four choices per event; three for simpler ones.
- 2026-11-18: Consequence hints appear only once the player knows the staff member well enough. They cover people's reactions only, and can be soft or wrong if the read is incomplete.
- 2026-11-18: For never-delegable events, "If no response" is applied as lapse effects when the deadline passes; the item stays in the inbox for the player to decide (see `tech-plan.md`).
