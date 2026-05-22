# Day 1 Stage — Build Plan & Source of Truth

> Living document. The single reference for any subagent or parallel session implementing Day 1 slides.
> Last updated: 2026-05-22

---

## 0 · Quick orientation

**What we're building.** A presenter-driven web stage that delivers the OXYGY × Working Futures CHRO event in Barcelona, June 10–11, 2026. ~100 senior CHROs in the room. Facilitators: Joseph Thomas, Edoardo Monopoli, Yuji Develle. The site is projected on a room screen and driven from a single laptop with keyboard navigation.

**Where it lives.** `/barcelona/` subfolder inside the existing OXYGY-AI-upskilling-Sale-page repo. Separate Vite entry (`barcelona.html`). Will deploy to its own Firebase Hosting site at a later phase.

**The deliverable goal.** Match the printed deck (`Day 1 pdf.pdf` at repo root, 20 pages) in narrative arc, but elevate each slide with motion, embedded visuals, and grounding logos that a PDF can't carry. Each slide fits one viewport. No scrolling.

**Pre-built chassis already shipped (do not rebuild).**
- `barcelona/components/StagePage.tsx` — keyboard nav, URL hash sync, brand mark + frame counter chrome, cockpit overlay
- `barcelona/components/Cockpit.tsx` — facilitator overlay (Esc to open) with speaker notes + thumbnails + elapsed timer
- `barcelona/components/Frame.tsx` — base slide wrapper (`h-screen overflow-hidden`, light surface)
- `barcelona/hooks/useHashState.ts`, `useKeyboardNav.ts` — refresh-safe URL state + key handlers
- `barcelona/components/OxygyLogo.tsx` — OXYGY wordmark + mark icon
- `barcelona/components/BrandLogos.tsx` — OpenAI / Anthropic / Gemini / Meta / Microsoft / Mistral / open-source SVG icons

---

## 1 · Source of truth — the deck → slides mapping

The deck is **20 pages, 13 unique slides** (because pages 8/9 and 10–15 mirror across Table A / Table B):

### Shared framing (Slides 1–7) — all attendees see the same screen
| Slide | Deck page | Title |
|---|---|---|
| 1 | p.1 | Title — "Strategic Workforce Planning in the Age of AI" |
| 2 | p.3 | The Hook — "What will set yours apart?" |
| 3 | p.4 | The Shift — three-layer stack |
| 4 | p.5 | The Old Playbook Is Gone — four shifts |
| 5 | p.6 | What You're About To Do — 1 case · 2 angles · 1 question |
| 6 | p.7 | Meet HorizonWorks — case company brief |
| 7 | p.8, p.9 | 40 min · Two tables · One question — table assignment |

### Per-table activity (Slides 8–13) — Table A and Table B see different screens
| Slide | Deck page (A / B) | Title | Table-variant |
|---|---|---|---|
| 8 | p.10 / p.16 | Your Lens — big A or B card | Variant per table |
| 9 | p.11 / p.17 | The Brief — question + deliverable + constraint + time | Identical content |
| 10 | p.12 / p.18 | What You Know — your dossier (2×2) | **Variant per table** |
| 11 | p.13 / p.19 | What You Don't Know — your blind spot | **Variant per table** |
| 12 | p.14 / p.20 | Work The Problem — use-case template + timer | Identical content |
| 13 | p.15 / p.21 | Five Minutes Left — pick your top 3 | Identical content |

### Routing model
- `/barcelona.html#day-1` → shared framing only (slides 1–7) — used during the opening segment with one main screen in the room
- `/barcelona.html#table-a` → slides 1–13 with Table A's variants (one of the two table screens during the activity)
- `/barcelona.html#table-b` → slides 1–13 with Table B's variants (the other table screen)

Each table screen runs its own laptop in the room. The facilitator at each table drives that screen.

---

## 2 · Brand system (locked) — these tokens are non-negotiable

### Colours

All defined in `barcelona.html` Tailwind config. Use these tokens, **never raw hex**.

| Token | Hex | Use for |
|---|---|---|
| `navy-900` | `#1A202C` | Display headings, primary text |
| `navy-800` | `#2D3748` | Bold body |
| `navy-700` | `#4A5568` | Body text |
| `navy-600` | `#718096` | Supporting text |
| `navy-500` | `#A0AEC0` | Low-emphasis labels |
| `navy-400` | `#CBD5E0` | Disabled / muted text |
| `teal` (DEFAULT) | `#38B2AC` | Primary accent — underlines, key words, CTAs, kickers |
| `teal-dark` | `#2C9A94` | Pressed teal, dark-bg teal text |
| `teal-light` | `#4FD1C5` | Highlights, glints |
| `teal-bg` | `#E6FFFA` | Teal-tinted backgrounds |
| `teal-pale` | `#F0FBFA` | Subtle teal washes |
| `oxygy-yellow` + `-light` | `#F7E8A4` / `#FDF8DE` | Strategy / top-down side |
| `oxygy-lavender` + `-light` | `#C3D0F5` / `#E7EBF9` | Data / bottom-up side |
| `oxygy-peach` + `-light` | `#F5B8A0` / `#FCEAE0` | Synthesis / convergence |
| `oxygy-mint` | `#A8F0E0` | Optional accent |
| `surface` (DEFAULT) | `#FFFFFF` | Slide background — every slide |
| `surface-alt` | `#F7FAFC` | Card backgrounds (muted) |
| `surface-muted` | `#EDF2F7` | Tag backgrounds |
| `surface-border` | `#E2E8F0` | All borders |

**The One Accent Rule** — one teal accent per slide. Soft accents (yellow/lavender/peach) are positional (strategy / data / synthesis), one per slide unless the slide literally depicts convergence.

### Typography

| Token | Family | Use for |
|---|---|---|
| `font-display` | Plus Jakarta Sans | Slide headlines (clamp(2.25rem, 4vw, 3.5rem)) |
| `font-sans` | DM Sans | Body, card titles |
| `font-mono` | DM Mono | Kickers, metadata, labels (always tracking-[0.22em–0.3em] uppercase) |

**The Distance Rule** — body type never below 18px. Slide-level headlines clamp from 2.25rem floor. Optimised for back-row reading.

### Layout

- `Frame` component wraps every slide. Uses `h-screen overflow-hidden` (no scrolling, ever).
- Default container: `max-w-[1280px] mx-auto px-16 py-12 flex flex-col`. Use `<Frame noContainer>` to opt out for full-bleed compositions (slides 1 and 2 use this).
- Slides should fit any 1366×768+ viewport without clipping. Use `clamp()` for all font sizes.
- Two-column splits should be `grid-cols-12` with 7/5, 6/6, or 8/4 ratios.

### Animation vocabulary

All keyframes defined in `barcelona.html`. Apply via class names. Stagger via `animationDelay` inline style.

| Class | What it does | Use for |
|---|---|---|
| `.frame-enter > *` | Auto-staggers direct children with fade+rise on mount (6 children, 0–600ms) | The default Frame entry — every slide gets this for free |
| `.underline-sweep` | Scales an underline `from scaleX(0) to scaleX(1)` left-to-right over 0.9s | Keyword underlines |
| `.word-reveal` | Per-word blur+rise reveal (0.5s) | Slide 2 (Hook), any "phrase building" moment |
| `.layer-slide` | Slides up from below with fade (0.7s) | Slide 3 (Shift) layers |
| `.card-break` | Card breaks in with slight overshoot (0.6s) | Slide 4 (Old Playbook) cards |
| `.number-rise` | Number rises with scale (0.7s) | Slide 5 (What You'll Do) numerals |
| `.pixel-fall` | Falls in from above with scale (1.1s), reads CSS var `--pixel-op` for final opacity | Slide 1 (Title) voxel tower |
| `.drift-a`, `.drift-b` | Slow continuous drift (8s / 11s) | Ambient particles, floating logos |
| `.float-soft` | Soft vertical float (4s) | Floating elements on Slide 2 |
| `.teal-pulse` | Gentle opacity pulse (3.5s) | The question on Slide 2 |
| `.arrow-draw` | SVG `stroke-dashoffset` draw (1.2s, 0.8s delay) | TO/FROM arrow on Slide 3 |

### Components that exist (use, don't rebuild)

| Component | Purpose | Path |
|---|---|---|
| `<Frame>` | Slide wrapper | `barcelona/components/Frame.tsx` |
| `<OxygyLogo variant="wordmark" \| "mark" />` | OXYGY brand mark | `barcelona/components/OxygyLogo.tsx` |
| `<OpenAIIcon />`, `<AnthropicIcon />`, `<GeminiIcon />`, `<MetaIcon />`, `<MicrosoftIcon />`, `<MistralIcon />`, `<OpenSourceIcon />` | AI brand icons | `barcelona/components/BrandLogos.tsx` |

---

## 3 · Current state

### Done (Phase 0)
- ✅ Multi-entry Vite + barcelona.html with brand tokens
- ✅ StagePage + Cockpit + keyboard nav + URL hash state
- ✅ Frame.tsx (light surface, h-screen overflow-hidden)
- ✅ OxygyLogo + BrandLogos components
- ✅ Slide 1 — Title (voxel tower, OXYGY mark, Let's Begin CTA)
- ✅ Slide 2 — Hook (word reveal, floating brand logos)
- ✅ Slide 3 — Shift (three-layer stack with company logos, TO/FROM axis)
- ✅ Slide 4 — Old Playbook (2×2 with custom icons)
- ✅ Slide 5 — What You're About To Do (1·2·3 with big teal numerals)
- ✅ Content map (`barcelona/content/day1.ts`) for slides 1–5 + 6–7 placeholders

### Pending
- ⏳ Slide 6 — Meet HorizonWorks (currently legacy placeholder)
- ⏳ Slide 7 — 40 min · Two tables (currently legacy placeholder)
- ⏳ Routing fork — `/table-a` and `/table-b` routes
- ⏳ Slides 8–13 — Per-table activity (six slides × two tables)
- ⏳ Cleanup — remove unused `BackgroundMesh.tsx` (no longer imported)
- ⏳ Frame 1 polish — Venn stagger order, label sizes
- ⏳ Final audit + hosting deployment

---

## 4 · Slide-by-slide build specs (8 slides remaining)

Each spec below is **self-contained** — a subagent can implement from this spec alone.

### Slide 6 — Meet HorizonWorks
**Deck reference:** p.7 · **File:** `barcelona/components/frames/day1/06-MeetHorizonWorks.tsx` (rename from `06-TwoPillars.tsx`, update `content/day1.ts` import) · **Frame ID:** `meet-horizonworks`

**Job:** introduce the fictional case company that the whole 40-minute exercise will work with.

**Layout (deck p.7):**
- Two-column composition (40/60 — image left, content right)
- Left column: a tinted image-block (placeholder for a real image of a modern office / professional services firm) with a teal-to-lavender gradient overlay
- Right column: kicker, company name, stat grid, descriptive paragraph, CEO quote

**Content (exact):**
- Kicker (mono caps, teal): `A familiar profile`
- Company name (display, navy-900): `Meet HorizonWorks`
- Four-cell stat grid (2×2, each cell: big number in navy-900 display, teal underline, label below in navy-600):
  - `7,500` — Global employees
  - `3` — Regions · Europe · NA · APAC
  - `30 · 50 · 20` — Advisory · Delivery · Managed services
  - `Medium` — AI maturity · No coordinated strategy
- Description (sans, navy-700): "A global professional services firm. Experimentation with AI is happening in pockets — a few off-the-shelf tools rolled out unevenly, no coordinated strategy."
- CEO quote block (teal left border, italic): "Documented, measurable AI impact by end of 2026." — `— THE CEO, TO THE BOARD`

**Animations:**
- Numbers count up from 0 to final value over ~1.2s with cubic-bezier easing (use `useEffect` + `requestAnimationFrame` or hardcode keyframes for each value)
- Stats reveal in sequence (~150ms apart)
- Image fades in with slight scale-down (1.04 → 1.0)
- CEO quote: type-in effect OR simple fade with the teal border drawing first

**Acceptance criteria:**
- All content in one viewport, no scroll
- Stats are immediately legible from back of room (60px+ for numbers)
- The CEO quote reads as a separable "moment"
- One teal accent (kicker + the teal border on the quote — those count as the one accent system since they pair)

### Slide 7 — 40 min · Two tables · One question
**Deck reference:** p.8 (Table A view) + p.9 (Table B view) · **File:** `barcelona/components/frames/day1/07-TwoTables.tsx` (rename from `07-WhatWeDeliver.tsx`) · **Frame ID:** `two-tables`

**Job:** show both tables side-by-side, mark which one is "YOUR TABLE" based on route. Sets the room for the split.

**Layout (deck p.8/9):**
- Headline: `40 minutes. Two tables. One question.`
- Sub-kicker (mono caps, teal): `Table A · Strategy Lens` OR `Table B · Data Lens` (depends on route — see Phase 2 routing)
- Two equal-width cards side-by-side
- The card matching the current table gets a teal background + "YOUR TABLE" pill in the top-right
- The other card stays gray
- Below the cards: a horizontal teal divider + the question "What AI use cases would you take to the CEO?" + a 40:00 timer label on the right

**Content per card:**
- Title (mono caps): `Table A · Strategy Lens` or `Table B · Data Lens`
- Starting point label + sentence:
  - Table A: "HorizonWorks' leadership vision and capability priorities."
  - Table B: "HorizonWorks' workforce data — utilisation, pipeline, capacity, capabilities, project history."
- Facilitator name (filled per route)
- Working from: `Top-down` (Table A) or `Bottom-up` (Table B)

**Animations:**
- The two table cards animate in side-by-side
- The "YOUR TABLE" pill animates in with a slight scale-pop
- The 40:00 numerals can have a subtle pulse

**Routing note:** This is the first slide where the per-table fork matters. The component reads the route key from a `useTableContext` hook (to be built — see Phase 2).

### Phase 2 — The routing fork (must be built before Slides 8–13)

Before any per-table slide can be implemented, the routing needs to support per-table state.

**New plumbing required:**

1. **`barcelona/types.ts`**: add `Table = 'a' | 'b' | null` type
2. **`barcelona/App.tsx`**: extend `Route` parsing to recognise `#table-a` and `#table-b` and expose the table identity to the page tree
3. **`barcelona/pages/Day1.tsx`**: accept a `table?: Table` prop and forward to a `TableContext`
4. **`barcelona/context/TableContext.tsx`** (new): provides `{ table: 'a' | 'b' | null, facilitator: string, lens: string }` to any frame that needs it. Slides 1–5 ignore it; slides 7–13 read from it.
5. **`barcelona/content/tables.ts`** (new): static map of per-table data (facilitator, lens label, dossier content, blind-spot content)
6. **`StagePage`**: optionally show a small "TABLE A" / "TABLE B" indicator next to the frame counter

**Routes after this phase:**
- `#day-1` → shared framing, no table context. Slides 1–7 with Slide 7 showing neutral "two tables" view.
- `#table-a` → table-A context. Slides 1–13 with table-A variants.
- `#table-b` → table-B context. Slides 1–13 with table-B variants.

### Slide 8 — Your Lens
**Deck reference:** p.10 (Table A) / p.16 (Table B) · **File:** `barcelona/components/frames/day1/08-YourLens.tsx` · **Frame ID:** `your-lens`

**Job:** brand the table. The big A or B card with the lens name.

**Layout (deck p.10/p.16):**
- Two-column composition (50/50)
- Left: a giant letter "A" (teal background) or "B" (navy background) filling the column. White letter, ultra-bold, display font.
- Right: kicker "Your lens", lens name in big display ("Strategy Lens" or "Data Lens"), then "Working from", "Starting point", "Facilitated by" labels.

**Content (per table):**

| | Table A | Table B |
|---|---|---|
| Letter | A | B |
| Background | `bg-teal` | `bg-navy-700` |
| Lens name | `Strategy Lens` | `Data Lens` |
| Working from | `Top-down from leadership` | `Bottom-up from data` |
| Starting point | `HorizonWorks' leadership vision and capability priorities.` | `HorizonWorks' workforce data — utilisation, pipeline, capacity, capabilities, project history.` |
| Facilitator | Edoardo Francesco Monopoli | Joseph Thomas |

**Animations:**
- Letter scale-pops in from 0.9 to 1.0 with ~0.6s ease-out
- Right-column content reveals in sequence (kicker → lens name → starting point → facilitator)
- Teal underline below "Your Lens" sweeps in

**Acceptance criteria:**
- Reads correctly per table (component uses `useTableContext`)
- The letter is the single dominant element
- One accent — the teal underline + teal background of the letter card together count as the brand context, not competing accents

### Slide 9 — The Brief
**Deck reference:** p.11 / p.17 · **File:** `barcelona/components/frames/day1/09-TheBrief.tsx` · **Frame ID:** `brief`

**Job:** state the assignment. Same content per table.

**Layout (deck p.11):**
- Headline: `The brief.`
- Sub-kicker (mono caps): `Table A · Your Assignment` or `Table B · Your Assignment` (per route)
- A teal-bordered "Question" callout: "You are advising HorizonWorks' new CHRO. The CEO has committed to documented, measurable AI impact by end of 2026. From the information you have, identify 3–5 AI use cases you would put on the CHRO's roadmap."
- Three side-by-side cards:
  - Deliverable — "3–5 use cases. For each, name: What it does · Who sponsors it · What success looks like"
  - Constraint — "Your lens only. You only see your lens. The other table has the other lens. Use what you have — don't speculate about what they have."
  - Time — `40:00 minutes` (giant teal display number)

**Animations:**
- Question callout: teal border draws first, then content fades in
- Three bottom cards card-break in sequence
- The 40:00 timer pulses gently

**Acceptance criteria:**
- The three bottom cards are equal width
- The constraint card is visually distinct (different background — try `bg-surface-alt`)
- The time card is the only one with a coloured background (teal-pale or teal)

### Slide 10 — What You Know (per-table)
**Deck reference:** p.12 (Table A) / p.18 (Table B) · **File:** `barcelona/components/frames/day1/10-WhatYouKnow.tsx` · **Frame ID:** `what-you-know`

**Job:** show the dossier. Content varies per table.

**Layout (deck p.12):**
- Headline: `What you know.`
- Sub-kicker (mono caps, teal): `Table A · Your Dossier` or `Table B · Your Dossier`
- Italic explainer (varies per table)
- 2×2 grid of four dossier cards (each with a teal top-bar)
- Footer link: `→ Full dossier on your printed pack.`

**Content — Table A (Strategy Lens):**
- Explainer: "You have access to HorizonWorks' top-down direction — leadership intent, board mandate, capability priorities."
- Card 1 · The CEO Mandate: "Documented, measurable AI impact by end of 2026." Bullets: Board commitment in place · CEO personally sponsoring · Public commitment to investors
- Card 2 · Board-Level Priorities: "Three strategic shifts the leadership team has set." Bullets: Shift the revenue mix toward managed services · Build AI-native delivery capability · Defend margin under pricing pressure
- Card 3 · Organisational Priorities: "Where the leadership wants to focus." Bullets: Faster project staffing decisions · Reduce time spent on internal admin · Surface capability across regions
- Card 4 · Future Capability Needs: "What the CHRO has identified as gaps." Bullets: AI literacy across delivery roles · Data-fluent managers · Cross-region capability mobility

**Content — Table B (Data Lens):**
- Explainer: "You have access to HorizonWorks' operational reality — what the workforce data actually says."
- Card 1 · Utilisation & Pipeline: "How time and demand are flowing." Bullets: Utilisation rate by practice and region · Pipeline coverage 6 months out · Bench size and time-to-staff
- Card 2 · Capability Inventory: "What people actually know how to do." Bullets: Self-declared skills (incomplete) · Certifications and training records · Project-derived capability signals
- Card 3 · Project History: "What's been delivered, by whom, where." Bullets: Past projects by client, industry, type · Roles played per consultant · Outcome and renewal data
- Card 4 · Process & Tooling Map: "Which systems are in use, where duplication exists." Bullets: Multiple time-tracking systems in parallel · Inconsistent capability tagging across regions · SOPs vary by practice — no central source

**Animations:**
- Cards card-break in left-to-right, top-to-bottom (~120ms apart)
- Each card's teal top-bar can draw first, then content fades in
- Footer link gets a teal arrow hover

**Acceptance criteria:**
- Content sources from `useTableContext` → `tables.ts`
- All four cards equal size
- One teal accent system (top-bars + footer arrow share the role)
- Fits one viewport with the bottom link visible

### Slide 11 — What You Don't Know (per-table)
**Deck reference:** p.13 (Table A) / p.19 (Table B) · **File:** `barcelona/components/frames/day1/11-BlindSpot.tsx` · **Frame ID:** `blind-spot`

**Job:** name the blind spot — pedagogically the most important slide. The split-card layout dramatises "here's what you don't have, here's why it doesn't matter."

**Layout (deck p.13):**
- Headline: `What you don't know.`
- Sub-kicker (mono caps): `Table A · Your Blind Spot` or `Table B · Your Blind Spot`
- Two side-by-side cards (50/50):
  - LEFT card (teal-bordered, light bg): "You don't have access to..." + the missing data + bullet list
  - RIGHT card (teal background, white text): "Don't worry about it." + paragraph reframing the constraint as a feature
- Footer line (bold, navy-900): "At the end, your list and Table [other]'s list come back together. The overlap is where deliverable use cases live."

**Content — Table A:**
- Left card title: `HorizonWorks' operational data.`
- Bullets: How people actually spend their time · Where utilisation is high or low · What capabilities exist in the workforce today · Which processes are duplicated or broken · What project history reveals about real strengths
- Right card paragraph: "Don't speculate about HorizonWorks' operational reality. Work from what you have — the leadership intent and the capability priorities. Your job is to identify use cases that flow from strategy. Whether they're operationally feasible is the other table's problem."

**Content — Table B:**
- Left card title: `HorizonWorks' strategic mandate.`
- Bullets: What the CEO has committed to the board · What the strategic priorities are · Which capabilities leadership wants to build · Where leadership has chosen to invest · What 'AI impact' is meant to deliver for the firm
- Right card paragraph: "Don't try to guess HorizonWorks' strategy. Work from the data you have — what the workforce actually looks like and how it operates. Your job is to identify use cases the data could actually support. Whether they ladder to a strategic mandate is the other table's problem."

**Animations:**
- Left card fades in first (the gap)
- Right card slides in over it with a slight scale-pop (the reframe)
- Footer line types in or reveals last with the closing teal underline

**Acceptance criteria:**
- The right card visually "answers" the left card — same height, the contrast in colour is the message
- One accent — the teal that frames left card + fills right card is the brand context

### Slide 12 — Work The Problem
**Deck reference:** p.14 / p.20 · **File:** `barcelona/components/frames/day1/12-WorkProblem.tsx` · **Frame ID:** `work-problem`

**Job:** show the use-case capture template + the timer. Same per table.

**Layout (deck p.14):**
- Headline: `Work the problem.`
- Sub-kicker (mono caps, teal): `Table A · Strategy Lens` or `Table B · Data Lens`
- Main left area: a teal-bordered "Your Question" callout with "What 3–5 AI use cases would you put on the CHRO's roadmap?" + a "For each use case" header + four columns (Name · What it does · Sponsor · Success), each with a guidance line in italic
- Right sidebar (~25% width): a teal card with "TIME REMAINING" + giant `40:00` + "REMINDERS" section with bullets

**Content:**
- Question: "What 3–5 AI use cases would you put on the CHRO's roadmap?"
- Four columns (each shows label + guidance):
  - 01 · NAME — "Short — 3–5 words"
  - 02 · WHAT IT DOES — "One sentence"
  - 03 · SPONSOR — "Which leader owns it"
  - 04 · SUCCESS — "How you'd measure it"
- Footer: "Next: both tables reconvene. Your list and the other lens' list come together."
- Reminders sidebar bullets: "Use only your lens." · "Cap at 3–5 use cases." · "Be concrete, not aspirational."

**Animations:**
- The four template columns reveal in sequence with the numerals rising
- The timer pulses gently
- Reminders sidebar fades in last

**Acceptance criteria:**
- The four columns are equal width and easy to read across
- The right sidebar (teal card) visually stands apart from the question
- Frame's `frame-enter` stagger respects the visual reading order

**Future enhancement:** the timer becomes a **live countdown** when the facilitator presses a key (`Space` to start? new keybinding?). Not in scope for first build but mark for Phase 4.

### Slide 13 — Five Minutes Left
**Deck reference:** p.15 / p.21 · **File:** `barcelona/components/frames/day1/13-FiveMinutes.tsx` · **Frame ID:** `five-min`

**Job:** signal the wrap-up. Same per table.

**Layout (deck p.15):**
- Sub-kicker (mono caps): `Table A · Wrap Up` or `Table B · Wrap Up`
- Headline: `Pick your top 3.`
- Secondary headline (teal): `Get ready to share with the other table.`
- A teal divider line
- "Bring to the synthesis" mono-caps label + bullet list:
  - Your top 3 use cases — name, what, sponsor, success
  - Anything you couldn't answer because of your blind spot
  - One thing you wish you'd had access to

**Animations:**
- Headline reveals with the teal underline-sweep
- Bullets fade in in sequence
- The teal divider can sweep in left-to-right

**Acceptance criteria:**
- Simple, calm slide — wind-down energy, not urgency
- Single big headline + bullet list, lots of whitespace

---

## 5 · Build phases (parallel-friendly)

### Phase 1 — Complete the shared framing (sequential)
Must be done first because Slide 7 sets up routing context that Slides 8–13 depend on.

- **Phase 1a:** Build Slide 6 (Meet HorizonWorks) — can be done in isolation
- **Phase 1b:** Build Slide 7 (Two Tables) — depends on Phase 2 routing being in place (or stub the route context for now)

### Phase 2 — Routing fork
Must precede per-table slides. Single session.

- Add `Table` type and `TableContext` provider
- Add `tables.ts` content map
- Extend `App.tsx` to recognise `#table-a` / `#table-b`
- Update `StagePage` to optionally show a "TABLE A/B" indicator next to the frame counter

### Phase 3 — Per-table activity slides (PARALLELISABLE)
Slides 8–13 are each independent components reading from `useTableContext`. **Six parallel sessions, one per slide**, each builds the component and tests it for both `#table-a` and `#table-b`.

| Slide | Variant burden | Estimated time |
|---|---|---|
| 8 — Your Lens | Per-table letter, colour, lens name | Medium (visual letter card) |
| 9 — The Brief | Identical content; sub-kicker varies | Small |
| 10 — What You Know | **Per-table dossier content** (4 cards × 2 variants) | Large (most content) |
| 11 — What You Don't Know | **Per-table content** (split-card structure × 2 variants) | Medium |
| 12 — Work The Problem | Identical content; sub-kicker varies | Medium (template + timer) |
| 13 — Five Minutes Left | Identical content; sub-kicker varies | Small |

### Phase 4 — Polish + audit
After all slides exist:
- Cross-slide audit: typography consistency, contrast, motion budget
- Remove dead code (`BackgroundMesh.tsx`)
- Cockpit speaker notes updated with the final facilitator scripts
- Frame 1: fix the Venn stagger order, label sizes from earlier feedback
- Add a live countdown timer that the facilitator can start (Space key on Slide 12)
- Run `/impeccable audit` (or manual visual review) on the whole sequence

### Phase 5 — Deployment
- Add a second Firebase Hosting site for Barcelona
- Update `firebase.json` with the new hosting target pointing at `dist-barcelona/`
- Custom domain (TBD — `chro.oxygyconsulting.com` candidate)
- Test on real conference projector at venue (or matched resolution)

---

## 6 · Handoff prompt template — for dispatching parallel sessions

Use this template when delegating a single slide to a parallel agent session. **Copy from here, fill in `<<placeholders>>`, send.**

```markdown
You are implementing Slide <<N>> of the Day 1 Barcelona CHRO stage page.

# Read first (mandatory)
1. `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/BUILD-PLAN.md` — Sections 0, 1, 2, 4 (your slide spec)
2. `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/Day 1 pdf.pdf` page <<deck page number>> — visual reference
3. An existing built slide as a pattern reference: `/Users/josephthomas/OXYGY-AI-upskilling-Sale-page/barcelona/components/frames/day1/<<03-DataPicture.tsx or similar>>`

# Slide spec
- Frame ID: `<<frame-id>>`
- File to create/modify: `barcelona/components/frames/day1/<<NN-Name.tsx>>`
- Deck reference: page <<N>>

[Paste the relevant slide spec from BUILD-PLAN.md Section 4 here]

# Hard constraints (non-negotiable)
- One viewport, no scroll (use `<Frame>` wrapper)
- Brand tokens only (BUILD-PLAN.md Section 2). No raw hex.
- Animations from the vocabulary in BUILD-PLAN.md (Section 2 → Animation vocabulary). No new keyframes unless absolutely needed; if needed, add to barcelona.html.
- TypeScript strict, no `any`
- Named exports
- NO `git push` — commit locally only
- `git add` with specific filenames

# Acceptance criteria
[Paste the slide's acceptance criteria from Section 4]

# Self-review before reporting
- One viewport check: open `http://localhost:5173/barcelona.html#day-1#<<N>>` (or table-specific URL) — does it scroll?
- Banned fonts check: only DM Sans / Plus Jakarta Sans / DM Mono used
- Banned colours check: only brand tokens, no raw hex
- Animation check: respects `prefers-reduced-motion`
- Logo grounding: if your slide should carry a brand logo (BUILD-PLAN.md Section 4 will say), it's in there

# Commit format
git add <specific files>
git commit -m "Craft Slide <<N>>: <<slide name>>

<two-sentence description of what was built and any decisions made>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"

# Report back
Status: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
What you built (one paragraph)
Files changed (list)
Self-review notes (any deviations or open questions)
```

---

## 7 · Open decisions (resolve before relevant build)

| # | Decision | Needed before | Default if not resolved |
|---|---|---|---|
| 1 | Does the "Let's Begin" button on Slide 1 actually do anything? | Anytime | Treat it as visual only — keyboard nav handles flow |
| 2 | Should Slide 12's timer be a live countdown the facilitator starts? | Phase 4 | Visual only for first build, mark for Phase 4 |
| 3 | Real images on Slides 1 and 6? Or keep SVG compositions? | Phase 1 (slide 6) and Phase 4 (revisit slide 1) | SVG for first pass; user can swap in real assets later |
| 4 | Photos of the actual facilitators on Slide 8 (Your Lens) and Slide 7? | Phase 3 | Name-only for first pass |
| 5 | Final hosting domain | Phase 5 | `barcelona.oxygyconsulting.com` placeholder |
| 6 | True crossfade between frames (vs. current hard-cut + entrance) | Phase 4 | Current hard-cut + entrance — acceptable |
| 7 | Cockpit lock — can attendees see the cockpit if Esc is pressed by accident? | Phase 4 | Currently anyone can open it; add a key combo guard in Phase 4 |
| 8 | Day 2 — do we plan it now or after Day 1 is signed off? | After Phase 4 | After Day 1 signed off |

---

## 8 · Quick reference — file structure

```
barcelona/
├── BUILD-PLAN.md             ← this file
├── PRODUCT.md                ← Impeccable strategic context (legacy, dark-stage era)
├── DESIGN.md                 ← Impeccable visual context (legacy, dark-stage era — note: superseded by Sections 2 of this doc)
├── main.tsx
├── App.tsx                   ← route switcher; extend in Phase 2 for #table-a / #table-b
├── types.ts                  ← Frame meta types; extend in Phase 2 with Table type
├── pages/
│   ├── Day1.tsx              ← stage page composition for #day-1; extend in Phase 2
│   ├── Day2.tsx              ← placeholder
│   └── Landing.tsx           ← placeholder
├── components/
│   ├── StagePage.tsx
│   ├── Frame.tsx
│   ├── Cockpit.tsx
│   ├── BackgroundMesh.tsx    ← UNUSED — remove in Phase 4 cleanup
│   ├── OxygyLogo.tsx
│   ├── BrandLogos.tsx
│   └── frames/day1/
│       ├── 01-OpenerHook.tsx       ← Slide 1 (Title) — DONE
│       ├── 02-ChroPosition.tsx     ← Slide 2 (Hook) — DONE
│       ├── 03-DataPicture.tsx      ← Slide 3 (Shift) — DONE
│       ├── 04-SteerPov.tsx         ← Slide 4 (Old Playbook) — DONE
│       ├── 05-TwoHalves.tsx        ← Slide 5 (What You'll Do) — DONE
│       ├── 06-TwoPillars.tsx       ← Slide 6 placeholder — RENAME + REBUILD
│       └── 07-WhatWeDeliver.tsx    ← Slide 7 placeholder — RENAME + REBUILD
├── content/
│   ├── day1.ts               ← frame metadata array
│   └── tables.ts             ← Phase 2 NEW — per-table content (dossiers, blind spots)
├── context/
│   └── TableContext.tsx      ← Phase 2 NEW — table identity provider
└── hooks/
    ├── useHashState.ts
    └── useKeyboardNav.ts
```

---

## 9 · Communication conventions

When iterating on a slide:
- Reference the slide by **number + title** (e.g. "Slide 3 — The Shift")
- Reference content by **deck page** when comparing to the printed deck (e.g. "p.4 in the PDF")
- Use these tokens in any review comment: `SCOPE` (out of scope) · `POLISH` (defer to Phase 4) · `BLOCKER` (cannot proceed until resolved)

Commit message convention:
- `Craft Slide N: <title>` for new slides
- `Polish Slide N: <what changed>` for tweaks
- `Refactor: <area>` for non-slide changes
- Always end with the `Co-Authored-By: Claude Opus 4.7` trailer
