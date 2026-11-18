# Ranch Manager — Staff Design

_Companion to `design/game-concept-and-design.md`. All characters are original._

## 1. Staff attribute model (Football Manager style)

### Visible skills (1–20)
| Skill | Covers |
|---|---|
| Stockmanship | Cattle handling, calving, spotting illness |
| Horsemanship | Riding, gathering cattle, training horses |
| Mechanical | Fixing vehicles, equipment, water pumps |
| Land & Hay | Pasture management, haying, irrigation, fencing |
| Admin | Records, brand paperwork, ordering, books |
| Leadership | Running a crew, delegation quality |
| Judgement | Decisions under pressure, reading standing orders sensibly |
| Work rate | Output, willingness to put in hours |
| Physical | Stamina, injury resistance |

### Hidden personality: shown as ranges first (AGREED)
Loyalty, Ambition, Temperament, Professionalism, Adaptability (attitude to change), Honesty, Injury proneness.

- Each trait starts as a **range or impression**, e.g. "Ambition: seems high (12–18)" or "Temperament: unknown".
- The range **narrows over time** through events, how staff react to decisions, one-to-ones (section 3) and time served together. Eventually it becomes an exact value.
- First impressions can be wrong: a range can shift as well as narrow.
- **Getting to know your staff** is part of the game, like scouting in Football Manager.

### State (changes daily)
- Morale
- Fatigue
- Stress
- Health
- **Trust in owner** (how much they trust the player)
- **Delegation trust** (how much experience they have acting on the player's behalf)
- Relationships with each other staff member (−100 to +100)

### Priorities (what matters to them right now)
Each person has a weighted set of priorities. These shift with age and life events (section 4):

- Money
- Security (stable job, housing, a pension)
- Family time
- Career progression
- Recognition
- Flexibility
- Health
- Ranch life / purpose (love of the work and the land)

Priorities decide:
- What motivates each person
- What they ask for
- How they value what you offer (a pay rise vs flexible hours vs a title)
- How tempted they are by outside offers

### Employment
- Role, pay, perks (ranch housing, beef allowance, truck use)
- Hours and leave agreements
- Years of service, and whether past probation

### Realism notes for the US / Montana setting
- **No statutory paid holiday in the US.** Leave is whatever the employer offers. The player decides the leave policy, which creates its own events and morale effects.
- **Agricultural workers are largely exempt from federal overtime rules.** Overtime pay is a generosity choice, not a legal duty. _(To verify.)_
- **Family and medical leave:** the federal FMLA only covers larger employers, so a small ranch like this one isn't obliged to offer it. Parental, compassionate and sick leave are the player's choice, and morale and reputation follow from it. _(To verify.)_
- **Montana is the one US state that is not "at will".** Under its Wrongful Discharge from Employment Act, once an employee has completed the probationary period (12 months by default), they can only be dismissed for "good cause". The employer's own written policies also count. Firing someone during probation is easy; afterwards it needs a documented reason, or the player risks a wrongful discharge claim.
  - **Game rule (AGREED): inherited staff count as past probation.** You can't simply clear out the old team. This also makes dismissals feel familiar to UK players (similar to unfair dismissal protection after a qualifying period).
  - Writing an employee handbook is an optional project. It gives clarity, but also creates rules the player must then follow.
- Ranch housing and perks are part of the package. A dispute over housing is a real lever (and a risk).

_Pay figures below are placeholders to tune later._

---

## 2. Whole-life model (AGREED: every aspect of a person's life plays a part)

Staff are whole people. Things that happen outside work spill into the ranch, and how the player responds shapes loyalty, morale and reputation.

### Life domains
Each staff member has a profile across these domains. Each domain has its own state, and **life events** can be generated from it:

| Domain | Examples of what it tracks | Example events |
|---|---|---|
| **Physical health** | Chronic conditions, injuries, age, fitness | Hidden injury worsening, surgery needed, recovery and phased return, seasonal illness |
| **Mental wellbeing** | Stress, burnout, grief, isolation (remote ranch life) | Withdrawn and making mistakes, asks for time off, conflict caused by stress |
| **Family** | Partner, children, parents, siblings; life stage | New baby, sick child, ageing parent needing care, divorce, bereavement, wedding |
| **Money** | Debts, savings, housing, outside costs | Asks for a wage advance, takes a second job, considers leaving for better pay |
| **Ambition & career** | Goals, training wishes, outside dreams | Wants a promotion, a qualification, a career change, rodeo, college |
| **Relationships** | With colleagues, romance, friendships | Workplace romance, falling out, feud with a neighbour's hand |
| **Community** | Church, rodeo, volunteer fire department, town life | Called out as a volunteer firefighter during wildfire season, a community role, local reputation |
| **Legal & life admin** | Licences, court dates, housing | Loses driving licence, needs time for court, housing problem |

### How it works in the engine
- **Life stage drives probabilities.** Ty (22) is more likely to have romance, rodeo and money events. Rosa (34) gets more childcare ones. Walt (61) gets more health and retirement ones. June (68) gets more family-care and retirement ones.
- **Life events are threaded,** like work events. A parent's illness may run for weeks: first a mention, then time off requests, then a crisis, then bereavement or recovery.
- **Disclosure depends on trust.** Staff only tell you what's going on when they trust you enough. Low trust means you see only the symptoms: lateness, mistakes, bad temper. Higher trust means they come to you early, often in a one-to-one, and you get more and better options. Walt's hidden health problem is the first example.
- **The player's response options** are the employer toolkit:
  - Compassionate leave (paid or unpaid)
  - Flexible hours
  - A wage advance or loan
  - Adjusting duties
  - Paying for treatment or training
  - A quiet word
  - Formal process
  - Doing nothing
- **Consequences ripple:**
  - Other staff notice how you treat people, which affects morale and trust across the team.
  - The community notices too, which affects reputation.
  - Being too generous costs money and output. Being too hard costs loyalty and staff.
- **Tone:** serious subjects (grief, mental health, divorce, addiction) are handled with care and realism, never played for laughs. They should feel like the real dilemmas a manager faces.

---

## 3. One-to-ones (AGREED: fortnightly)

A regular catch-up with each staff member: the main tool for building trust and getting to know people.

### Scheduling
- **Every 14 game days per person.** Staggered, so with 4 staff there are about 2 a week.
- They appear in the inbox and calendar as a due item with a window of a few days, so they fit around check-ins.
- They can be **rescheduled** once without penalty. Cancelling or repeatedly pushing them back lowers trust ("they don't make time for us").
- **Designed for mobile:** each one-to-one takes about a minute of play.

### Format
1. **Opener:** the staff member's mood shows through how they greet you (open, guarded, short).
2. **Choose 2–3 topics** from:
   - How are you doing? (wellbeing)
   - Workload and fatigue
   - Goals and development
   - Feedback: praise or a concern
   - Pay and career
   - Anything on your mind? (open question, the most likely way to surface hidden issues)
   - Team: how are you getting on with others?
3. **Responses** depend on trust, mood, personality and current life events. Low trust gets vague or deflecting answers. High trust gets honesty, early warnings and real requests.
4. **Close:** optionally **agree actions**.

### Outcomes
- **Trait ranges narrow.** Each one-to-one has a chance to tighten one or two hidden trait ranges, and more topics give more insight.
- **Early disclosure:** life events, health problems, poaching approaches and conflicts come out here first if trust is high enough.
- **Trust and morale** move depending on topic choice and how well it matches what the person needs. Asking Walt about "goals and development" may annoy him; asking Rosa makes her feel seen.
- **Agreed actions become commitments.** For example, "I'll look at your pay by next month" or "I'll get you cover for Mateo's school play".
  - Commitments are tracked.
  - Keeping them builds trust strongly.
  - Breaking them damages it more than never promising at all.
- **Notes log:** every one-to-one leaves a written record on the staff member's file.
  - This doubles as **documentation for good-cause processes** (Montana's dismissal rules). Raising a concern in one-to-ones and recording it builds the evidence trail.
  - Skip the one-to-ones and a later dismissal is riskier.

### Delegation of one-to-ones (later)
Once a trusted foreman is in place, the player could delegate one-to-ones for junior hands. It takes less of the player's time, but gives less insight, and the quality depends on the foreman's Leadership skill.

---

## 4. Ageing, milestones & changing priorities (AGREED)

The game is open-ended, so staff live out their lives over many in-game years.

### Ageing
- Everyone ages a year on their **birthday**, which is a small event where recognition is optional.
- **Skills change with age:**
  - Young staff with high potential improve faster with training and mentoring.
  - Physical declines gradually from the late 40s onwards.
  - Judgement and experience-based skills keep growing well into later years.
  - Injury proneness and recovery time worsen with age.
- **Potential** is realised (or wasted) through training, mentoring, playing time and morale. Ty is the test case.

### Milestones by life stage (examples)
| Life stage | Typical milestones |
|---|---|
| **Early 20s** | Serious relationship, moving out, big purchases, debt, career doubts, chasing a dream (rodeo, college) |
| **Late 20s–30s** | Marriage, children, buying a house, promotion ambitions, studying, caring for young families |
| **40s–50s** | Teenage children, divorce, ageing parents, health warnings, seeking security, mentoring others |
| **60s+** | Retirement planning, grandchildren, health decline, caring for a partner, passing on knowledge |
| **Any age** | Bereavement, illness, windfalls, a move, community roles, burnout |

Milestones are **weighted by life stage and current situation**, not fixed. Some never happen, and some come early.

### Changing priorities
- Priority weights **shift with age and milestones**. Examples:
  - New baby: Family time and Money up, Career down for a while.
  - Health scare: Health and Security up.
  - Approaching retirement: Security up (pension, housing), Career down.
  - Promotion: Recognition is met; Ambition may drift to the next goal or settle.
- The player sees priorities change mainly **through one-to-ones and behaviour**, not a stat screen. The first sign might be someone asking for different things than before.
- What used to keep someone happy may stop working. A pay rise that would have thrilled Ty at 22 may matter less than flexible hours at 30 with a young family.

### Long service & leaving
- **Service anniversaries** (5, 10, 20, 30 years) are recognition decisions: a bonus, a gift, a party or nothing.
- People **leave for life reasons**, not just unhappiness: retirement, moving away, a career change, family. A good send-off affects morale and reputation.
- **Legacy and continuity:**
  - Departing staff can recommend a replacement (Ty's younger brother, Rosa's cousin).
  - Former staff stay in the community and can come back as contractors, advisers or problems.
  - Walt's retirement and handover is a designed storyline.

### Scope note
The MVP covers one spring, so ageing barely shows. The data model (birthdays, life stage, priority weights, milestone history) should still be built in from the start, so multi-year play works without a rewrite.

---

## 5. The inherited team

### Walt Haskins — Foreman
- **Age:** 61
- **Service:** 34 years on the ranch, foreman for 19
- **Pay:** ~$52k + house on the ranch + beef + truck
- **Background:** Came to the ranch at 27 and has worked for the previous owner's family his whole career. He knows every acre, every water source and every neighbour. He ran the place on handshakes while the old owner declined.
- **Skills:**

  | Stockmanship | Horsemanship | Mechanical | Land & Hay | Admin | Leadership | Judgement | Work rate | Physical |
  |---|---|---|---|---|---|---|---|---|
  | 18 | 15 | 11 | 16 | 4 | 14 | 15 | 13 | 8 |

- **Hidden:**
  - Loyalty: high, but to the *ranch and the old family*, not yet to you
  - Ambition: low
  - Temperament: steady
  - Adaptability: very low
  - Honesty: high, but keeps things to himself
  - Injury proneness: rising
- **Starting priorities:** Ranch life (very high), Security, Recognition (wants his experience respected). Money is low.
- **Starting state:** Trust in owner low; morale middling (grieving the old way of doing things)
- **Life outside the ranch:**
  - Widower (wife died 5 years ago)
  - A daughter in Billings who wants him to retire and move closer to her and his grandchildren
  - Elder at the local church
- **Delegation style:**
  - Cautious and protective of the cattle
  - Overspends on animal welfare
  - Ignores paperwork entirely
  - Follows the "old way", even if standing orders say otherwise, until trust is built
- **One-to-ones:** guarded at first. He finds "goals and development" pointless, but opens up over "how are you doing?" once trust builds.
- **Baggage and hooks:**
  - **Hidden health problem:** a bad back and knee he isn't admitting to. It shows up as slower work, then a fall. He discloses it early only if trust is high.
  - **Handshake deals:** has an informal water-sharing arrangement with the neighbouring ranch and a hay deal on credit, none of it written down. These surface when something goes wrong.
  - **Succession:** he's near retirement and won't raise it. He sees nobody as ready, especially not Rosa.
  - **Family pull:** his daughter's pressure to retire grows, especially after a health scare or the birth of another grandchild. His Family and Health priorities rise over time.
  - **Resists change:** pushes back on new equipment, record systems and grazing methods. Overrule him and you lose his trust; win him round and he's the best asset you have.
  - **Grief:** the anniversary of his wife's death each year is a quiet low point for his morale.
  - **The big question:** keep him, nurse him to retirement, or move him on? Firing him without good cause is a legal risk, and also a community scandal.

### Rosa Delgado — Senior Ranch Hand
- **Age:** 34
- **Service:** 7 years
- **Pay:** ~$38k + small cabin on the ranch
- **Background:** Grew up on a ranch near Miles City. She's the best rider on the place and very good with calving. She's been doing a lot of the foreman's job unofficially for two years without the title or pay.
- **Skills:**

  | Stockmanship | Horsemanship | Mechanical | Land & Hay | Admin | Leadership | Judgement | Work rate | Physical |
  |---|---|---|---|---|---|---|---|---|
  | 16 | 19 | 9 | 12 | 11 | 12 | 14 | 17 | 15 |

- **Hidden:**
  - Loyalty: moderate and conditional
  - Ambition: high
  - Temperament: fiery when she feels disrespected
  - Adaptability: high
  - Professionalism: high
- **Starting priorities:** Career progression, Recognition, Money, Family time / Flexibility (for Mateo)
- **Starting state:** Morale lowish (feels overlooked), trust in owner neutral and hopeful
- **Life outside the ranch:**
  - Single mother to Mateo (8)
  - Her ex-partner is unreliable with childcare and money
  - Her mother in Miles City helps out but is getting older
  - Is taking an online ranch-management course in the evenings
- **Delegation style:**
  - Decisive and efficient
  - Willing to try new methods
  - May go beyond standing orders if she thinks she's right
- **One-to-ones:** keen; uses them to push for progression. She'll test whether your commitments are real.
- **Baggage and hooks:**
  - **Pay and recognition:** she knows she's underpaid. A pay review request comes early, and her expectations rise if she covers for Walt.
  - **Poaching:** a neighbouring ranch (or a developer's new operation) offers her a foreman job. Match the offer, promote her, or let her go?
  - **Childcare clashes:** school events, Mateo getting sick, summer holidays, the ex-partner letting her down. These are short-notice leave requests, usually at the worst moments, such as during calving.
  - **Her course:** asks the ranch to fund her studies, or for study leave. If you invest in her, she becomes more loyal and skilled, but also more marketable.
  - **Tension with Walt:** he won't give her authority and she's tired of waiting. Disputes escalate if left alone, and you may have to pick a side.
  - **Leadership potential:** training her Leadership skill makes her a future foreman and a strong delegate.
  - **Future milestones:** her mother needing care; possibly a new relationship; Mateo becoming a teenager (who might want ranch work himself one day).

### Tyler "Ty" Brennan — Ranch Hand
- **Age:** 22
- **Service:** 14 months, so he passed his 12-month probation just before you arrived
- **Pay:** ~$32k + bunkhouse room
- **Background:** A local kid with real talent and no discipline. He rides saddle broncs on the amateur rodeo circuit and dreams of going pro. He works hard when motivated, and is careless when tired or hungover.
- **Skills:**

  | Stockmanship | Horsemanship | Mechanical | Land & Hay | Admin | Leadership | Judgement | Work rate | Physical |
  |---|---|---|---|---|---|---|---|---|
  | 9 | 14 | 13 | 8 | 3 | 3 | 6 | 14 | 17 |

- **Hidden:**
  - Loyalty: grows quickly if treated well
  - Ambition: high, but for rodeo, not ranching
  - Temperament: hot-headed
  - Professionalism: low
  - Injury proneness: high (rodeo)
  - **Potential:** high
- **Starting priorities:** Money, Flexibility (rodeo weekends), Recognition. Security is low.
- **Starting state:** Morale good, trust in owner neutral, fatigue often high
- **Life outside the ranch:**
  - New girlfriend in town
  - Credit card debt from rodeo entry fees and a new truck
  - His dad is a struggling rancher nearby, who may need his help or start leaning on him
  - Volunteer firefighter
- **Delegation style:** shouldn't be in charge. If he is, he acts fast and rashly: chasing wolves himself, driving tired, cutting corners.
- **One-to-ones:** chatty but shallow at first. Feedback lands hard with him, either way.
- **Baggage and hooks:**
  - **Rodeo season:** weekend leave requests all summer, which clash with haying. Injuries from rodeo affect his ranch work.
  - **Reliability:** turning up late after nights in town. A warning, informal chat or disciplinary is a good first test of the player's management style. He's past probation, so it needs proper process, and one-to-one notes count.
  - **Money troubles:** asks for an advance on his wages; might take weekend work elsewhere and turn up exhausted.
  - **Fire call-outs:** during wildfire season he may be called away at short notice, which is both a civic good and a staffing gap.
  - **Equipment accidents:** rolling an ATV, damaging the truck. Who pays? Was it training or carelessness?
  - **Relationship:** the girlfriend wants him to leave ranching, or moves in.
  - **Mentoring:** pair him with Walt or Rosa and he could become excellent. Leave him alone and he may drift or get hurt.
  - **Social media:** posts a video from the ranch that goes viral, good or bad.
  - **Future milestones (the biggest arc on the team):**
    - Turns pro at rodeo and leaves, or
    - Gets injured and has to rethink, or
    - Settles down, gets engaged, has a family, and grows into a future foreman

    His priorities swing hard depending on which path he takes.

### June Albright — Bookkeeper / Office (part-time)
- **Age:** 68
- **Service:** 22 years, 3 days a week
- **Pay:** ~$22k (part-time)
- **Background:** Lives in town and has kept the ranch's books in paper ledgers and a 2009 copy of accounting software. She's scrupulously honest, but the previous owner hid things from her near the end, and she has her suspicions.
- **Skills:**

  | Stockmanship | Horsemanship | Mechanical | Land & Hay | Admin | Leadership | Judgement | Work rate | Physical |
  |---|---|---|---|---|---|---|---|---|
  | 2 | 1 | 1 | 3 | 16 | 5 | 15 | 11 | 5 |

- **Hidden:**
  - Loyalty: high to whoever is honest with her
  - Ambition: none
  - Temperament: calm
  - Adaptability: low with technology
  - Honesty: very high
- **Starting priorities:** Flexibility, Family time (caring for Earl), Security. Money is low.
- **Starting state:** Morale neutral; quietly thinking about retiring
- **Life outside the ranch:**
  - Married to Earl, whose health is declining; she is becoming his carer
  - Grandmother; very involved in town life
  - Knows everyone's business in town
- **Delegation style:** doesn't run ranch decisions, but handles paperwork, payments and supplier chasing. She refuses anything that looks irregular.
- **One-to-ones:** warm and frank. She's the most likely to raise the skeletons in the books if asked "anything on your mind?"
- **Baggage and hooks (the compliance thread):**
  - **Skeletons in the books:**
    - Unpaid supplier invoices
    - A lapsed insurance policy
    - Overdue property tax
    - An operating loan with terms the player didn't know about

    These are discovered gradually over the first weeks.
  - **Records gaps:** incomplete brand and vaccination records, which matter at sale time and if a brand inspector or buyer asks.
  - **Carer pressure:** Earl's health means short-notice absences, and eventually a request to cut her hours or work from home.
  - **Retirement:** wants to cut to 2 days, then retire. Do you train a replacement, move to new software, or do it yourself? Each has costs and risks.
  - **Modernising:** wants to help but struggles with new systems. Training her vs replacing her is a real people dilemma.
  - **Town grapevine:** an early source of information (and gossip) about neighbours, developers and buyers. Keep her onside and you hear things first.
  - **Whistleblower moment:** finds something the old owner did that could cause trouble for the ranch. Disclose it or bury it?

---

## 6. Relationship web (starting values)
| | Walt | Rosa | Ty | June |
|---|---|---|---|---|
| **Walt** | — | −20 (respects her skill, won't share authority) | +30 (fond, paternal, frustrated) | +50 (old allies) |
| **Rosa** | −30 (resents being held back) | — | +10 (big sister, impatient) | +20 |
| **Ty** | +40 (looks up to him) | +20 | — | +10 |
| **June** | +50 | +30 | 0 (despairs of his timesheets) | — |

Relationships move with events and decisions. Siding with someone in a dispute shifts the others. People who get on well cover for each other, which gives smoother leave cover and better morale. Bad relationships cause friction events.

## 7. Why this team works for the decision engine
- **Built-in central tension:** old guard (Walt) vs rising talent (Rosa). The succession question runs through the whole first year.
- **A clear first management test:** Ty's reliability. It's low stakes but formative, and Montana's good-cause rule makes process (and one-to-one notes) matter.
- **A compliance and discovery thread:** June uncovers the true state of the ranch gradually. This creates early cash shocks and decisions.
- **Whole-life pressure points that collide with seasonal peaks such as calving, haying and wildfire season:**
  - Walt: health and his daughter
  - Rosa: childcare and her course
  - Ty: rodeo, debt and fire call-outs
  - June: caring for Earl and retirement
- **Delegation contrast:**
  - Walt: safe but old-fashioned
  - Rosa: good but independent
  - Ty: risky
  - June: paperwork only

  The choice of who's in charge while the player is away matters.
- **Long arcs over the years:**
  - Walt's retirement
  - Rosa's rise (or departure)
  - Ty's fork in the road
  - June's handover
- **Room to grow:** later hires (seasonal hands for haying, a mechanic, a new bookkeeper) bring new personalities into an existing dynamic.

## 8. Decisions made
- 2026-11-18: Hidden traits start as ranges or impressions, and narrow (or shift) over time.
- 2026-11-18: Inherited staff count as past probation (Montana good-cause rule applies). This also suits UK players, as it resembles unfair dismissal protection.
- 2026-11-18: Whole-life model: every aspect of a person's life (health, mental wellbeing, family, money, ambition, relationships, community, life admin) can generate events that spill into work.
- 2026-11-18: **Fortnightly one-to-ones** with each staff member (design in section 3).
- 2026-11-18: **Staff age, reach life milestones and change priorities over time** (design in section 4).

## 9. Open questions
- Ages, pay and skill numbers to tune during playtesting
- One-to-one details: confirm the topic list, the reschedule/cancel penalties and commitment tracking
- Should priorities ever be shown directly (e.g. after very high trust), or only inferred?
- Verify the US overtime exemption and FMLA thresholds for farms
