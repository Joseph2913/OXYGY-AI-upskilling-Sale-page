# Barcelona CHRO Event — Day 1 Stage Page Design Spec

**Date**: 2026-05-21
**Status**: Draft (awaiting user review)
**Author**: Claude + Joseph Thomas

## Context

OXYGY is delivering two 1-hour working sessions at the Working Futures CHRO event in Barcelona, June 10–11, 2026. The audience is ~100 senior HR leaders (CHROs, Chief People Officers). Facilitators: Joseph Thomas, Edoardo Monopoli, Yuji Develle.

The previous Working Futures event (Bird & Bird) was a successful workshop but a commercial flop — attendees "evaporated" after the session because the call-to-action was weak. This site exists to support a sharper, more sales-aware version of the same workshop format.

This spec defines **Day 1 only**. Day 2 stage page, case study facilitation, gamification, and pre/post-event marketing surfaces are scoped in future rounds.

## Goals

- Provide a clean, projected stage surface for facilitating the Day 1 working session
- Communicate OXYGY's positioning in the Strategy + Data space at a **high level** — discussion-driven, not content-heavy
- Reuse the OXYGY brand language while differentiating the Barcelona surface aesthetically (different register, different audience moment)
- Production-grade execution. No generic AI aesthetics.

## Non-Goals (this round)

- Day 2 stage page — next round
- Case study facilitation content within frames — third round
- Workshop activity / gamification frames — third round
- Pre-event teaser landing page — fourth round
- Post-event leave-behind / marketing surfaces — fourth round
- Attendee-facing interactive features — out of scope entirely. Facilitator-driven only.

## Sitemap

| Route | Purpose | Surface | Status this round |
|---|---|---|---|
| `/` | Public landing (pre + post-event) | Sales-page style | Placeholder only |
| `/day-1` | Day 1 stage page | Full-screen, projected | **Primary focus** |
| `/day-2` | Day 2 stage page | Full-screen, projected | Placeholder only |

## Build approach

Vertical slice — build Day 1 end-to-end first, iterate from rendered output.

1. Bootstrap Barcelona entry point (`barcelona.html`, `barcelona/` subfolder)
2. Build `StagePage` shell — keyboard nav, hash sync, frame counter, cockpit overlay
3. Build Day 1 narrative frames in order
4. (Future) Day 1 case + activity frames
5. (Future) Day 1 polish + iteration
6. (Future) Day 2 by forking Day 1
7. (Future) Marketing landing

## Stage page mechanics (shared)

### Surface
- Full viewport, no nav chrome, no scrolling
- One frame visible at a time
- Dark base with subtle gradient mesh (final hex TBD during DESIGN.md authoring)
- Brand mark bottom-left at low opacity: `OXYGY × WORKING FUTURES — DAY 1`
- Frame counter bottom-right at low opacity: `3 / 7`

### Navigation
- `→` / `Space` / `PageDown` — next frame
- `←` / `PageUp` — previous frame
- `Home` / `End` — jump to first / last
- `Esc` — toggle facilitator cockpit
- `T` — toggle per-frame timer badge (off by default)
- URL reflects state via hash: `/day-1#3` (refresh-safe, bookmarkable)

### Frame transitions
- 200ms crossfade. No slide-in. Calm on a projector.

### Facilitator cockpit (Esc)
- Semi-transparent overlay
- Thumbnail grid of all frames, click to jump
- Speaker notes for current frame (text-only, never displayed on stage)
- Total elapsed time + per-frame target minutes

### Frame component model
- Each frame = single React component, zero props
- Frames registered in ordered array per day (`day1Frames`)
- Shared `<StagePage>` wrapper owns navigation, cockpit, hash sync — frames just render content

## Day 1 narrative — 7 frames

| # | Frame | Gist | Time |
|---|---|---|---|
| 1 | **Opener + Hook** | Title slide that IS the hook. *"AI use cases don't live in your strategy deck OR your data lake. They live at the meeting of both."* Subtle Venn behind. | 1 min |
| 2 | **CHRO's unique position** | Three-card row: strategic asset · messiest data · authority to broker both | 1 min |
| 3 | **Accurate data picture** | 2×3 grid: who · what · skills · processes · standards · duplicates | 2 min |
| 4 | **Steer + POV (merged)** | *"Your job isn't to build the data layer. Your job is to demand it."* → *"Strategy without data is fantasy. Data without strategy is noise."* → callout: data has to be ongoing. | 1.5 min |
| 5 | **Our offering: two halves that meet** | Side-by-side preview: Leadership Strategic Agenda ↔ Data Foundation Mapping → AI Use Cases | 1 min |
| 6 | **The two pillars (high-level)** | Single high-level frame anchoring both pillars at a glance. No deep dives. | 1.5 min |
| 7 | **What we deliver** | *"A focused diagnostic that produces a defendable, prioritised use case portfolio."* No week numbers, no use case counts. | 1 min |

**Total intro time**: ~9 min. Leaves the rest of the hour for activity, share-back, and close (designed in future rounds).

After the activity, three closing frames (designed in future rounds): synthesis, Day 1→Day 2 bridge, continue-the-diagnostic CTA.

## Aesthetic direction

**Register**: brand (design IS the product)
**Aesthetic**: editorial / refined-minimalism, dark mode by default

- **Background**: dark navy base with subtle multi-stop gradient mesh — depth without distraction. Exact hex defined in DESIGN.md.
- **Display typography**: distinctive serif or expressive sans (Fraunces, Editorial New, or similar). NOT Inter, Roboto, Arial. Differentiates this surface from the AI Upskilling sales page.
- **Body typography**: Plus Jakarta Sans / Manrope (continuity with the broader OXYGY system)
- **Color strategy**: restrained — tinted neutrals + teal accent (`#38B2AC`) carrying ≤10% of surface
- **Soft accents** (one per frame max): pale yellow `#F7E8A4` (strategy), lavender `#C3D0F5` (data), soft peach `#F5B8A0` (synthesis)
- **Spatial composition**: generous asymmetric layouts. Text left + visual right, or one big visual breaking grid. No centred boxes by default.
- **Motion**: one staggered reveal on frame entry (~400ms, eased). No scroll-triggered animations, no busy micro-interactions.
- **Banned**: shadows, glassmorphism, purple gradients, generic stock imagery, the existing site's heading-text color treatment (we want underline-only accent decoration here too)

## Tech architecture

### Repo structure (within existing `OXYGY-AI-upskilling-Sale-page`)

```
/OXYGY-AI-upskilling-Sale-page/
├── App.tsx                    [existing — untouched]
├── index.html                 [existing — untouched]
├── barcelona.html             [NEW — Barcelona entry]
├── barcelona/
│   ├── main.tsx                  app bootstrap
│   ├── App.tsx                   route switcher
│   ├── pages/
│   │   ├── Day1.tsx
│   │   ├── Day2.tsx              [placeholder]
│   │   └── Landing.tsx           [placeholder]
│   ├── components/
│   │   ├── StagePage.tsx         keyboard nav + cockpit shell
│   │   ├── Frame.tsx             base frame layout
│   │   └── frames/day1/
│   │       └── [one component per frame]
│   ├── content/
│   │   └── day1.ts               frame metadata (titles, times, speaker notes)
│   ├── PRODUCT.md                Impeccable context (Barcelona-specific)
│   └── DESIGN.md                 Impeccable context (Barcelona-specific)
├── components/                [existing shared design — reused selectively]
└── vite.config.ts             [extended to support two entry points]
```

### Build outputs
- `dist/` — existing AI Upskilling site (unchanged)
- `dist-barcelona/` — new Barcelona site

### Hosting (parked — flagged)
- Two Firebase Hosting **sites** under one Firebase project
- Second `hosting` target in `firebase.json` pointing at `dist-barcelona/`
- `.firebaserc` `targets` mapping
- Custom domain to be selected (candidates: `chro.oxygyconsulting.com`, `barcelona.oxygyconsulting.com`)
- Deployment work happens after Day 1 design is locked

## Impeccable skill integration

The Impeccable Design skill (`pbakaus/impeccable`) is installed at `.agents/skills/impeccable/`. Required workflow:

- **Context files**: author Barcelona-specific `PRODUCT.md` + `DESIGN.md` at `barcelona/`. Set `IMPECCABLE_CONTEXT_DIR=barcelona` when invoking.
- **Per-frame workflow**:
  - `/impeccable shape <frame>` — confirm direction before implementing
  - `/impeccable craft <frame>` — implement
  - `/impeccable polish` | `bolder` | `quieter` <frame> — iterate
  - `/impeccable live` — in-browser iteration on the rendered surface
  - `/impeccable audit <frame>` — final review

## Open items / TBD (resolve at next phase)

- **Display font final choice** — decide during DESIGN.md authoring or first `shape` call
- **Gradient mesh hex values** — define in DESIGN.md
- **Hosting domain** — select before deployment phase
- **Speaker notes** — drafted by Joseph during frame implementation phase
- **Day 1 close + activity frames** — designed in next round (Day 1 case study facilitation + gamification)

## Success criteria for this round

1. `/day-1` route renders with all 7 narrative frames navigable via keyboard
2. Each frame visually production-grade per Impeccable audit
3. Cockpit (Esc) reveals speaker notes + thumbnail nav
4. Hash-based URL state survives refresh
5. Joseph approves rendered output frame by frame as final
