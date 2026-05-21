<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---
name: OXYGY × Working Futures · Day 1 Stage
description: Presenter-driven stage surface for the Barcelona CHRO event Day 1 working session
---

# Design System: OXYGY × Working Futures · Day 1 Stage

## 1. Overview

**Creative North Star: "The Briefing Before the Decision"**

The physical scene: a senior advisor briefs a peer before they make a real decision. Dim conference room, late afternoon. The voice is patient, certain, willing to say something true. Nothing on the surface is decorative. Every element earns its presence by clarifying.

This system explicitly rejects three saturated lanes by name: **generic AI tool marketing** (purple gradients, glassmorphism, neon accents), **consulting-deck disease** (bullet farms, hedged frameworks, McKinsey-style anodyne minimal), and **editorial-magazine pastiche** (display serif italic + ruled separators + small-caps section labels). These are the reflex moves we don't make.

The surface is projected onto a room screen and read at distance. Type pushes large. Contrast pushes high. Motion is sparse. The one extravagance the system allows is a single choreographed reveal per frame entry — a signal that the surface is deliberate, not a Keynote deck on autopilot.

**Key Characteristics:**
- Restrained colour: a single teal accent does ≤10% of the surface; the dark base does the rest
- Single committed sans family, paired with a mono companion for technical labels
- Choreographed entrance (~400ms staggered) per frame; no scroll-triggered, no hover, no continuous motion
- Distance-readable type floor: body ≥20px, display clamp 60–96px, contrast ≥7:1 where aesthetic permits
- Flat by default. No drop shadows. Depth from layered fills and one quiet gradient mesh, not elevation effects.

## 2. Colors

Restrained strategy. The dark base does the heavy work; the teal accent carries the brand voice.

### Named Rules

**The One Accent Rule.** The teal accent appears on ≤10% of any given frame — title underlines, key labels, single highlights. If two teal moments compete in one frame, one of them is wrong.

**The Positional Soft-Accent Rule.** Soft accents carry semantic position, not decoration: pale yellow = strategy / top-down, lavender = data / bottom-up, peach = synthesis. Use one per frame at most. Two soft accents on the same frame muddy the meaning.

### Primary
- **OXYGY Teal** (#38B2AC, final OKLCH to be confirmed at implementation): the brand accent. Underlines on key words. Frame counters and labels. Highlights for moments worth singling out. Never used for body text.

### Neutral
- **Stage Base** [hex TBD at implementation; dark navy tinted toward teal at chroma ~0.005, with a subtle multi-stop gradient mesh]: the canvas the whole experience sits on.
- **Speaker White** [hex TBD; off-white tinted warm, never #fff]: primary text on the dark base.
- **Murmur Gray** [hex TBD; mid-tone with teal cast]: supporting text, metadata, low-priority labels.

### Soft Accents (positional, one per frame max)
- **Pale Yellow** (#F7E8A4, final OKLCH TBD): strategy / top-down half of split-room exercises.
- **Lavender** (#C3D0F5, final OKLCH TBD): data / bottom-up half of split-room exercises.
- **Soft Peach** (#F5B8A0, final OKLCH TBD): synthesis. Where strategy and data meet.

## 3. Typography

**Display + Body:** single committed sans family doing both. Final font name chosen during first `/impeccable craft` pass.

**Label/Mono:** mono companion for metadata (frame numbers, speaker-notes UI, technical labels).

**Character:** restrained colour means typography is the brand. The pairing should read confident-without-loud, mechanical-without-cold, generous-without-soft. Stripe Sessions / Figma Config lane.

### Candidate families (evaluate at implementation; final pick committed at first frame)

**For display + body (non-reflex):**
- ABC Diatype (Dinamo)
- GT America (Grilli Type)
- NB International Pro
- Suisse Int'l (Swiss Typefaces)
- Söhne (Klim) — *use only with deliberate rationale; borderline reflex*
- Open-source: Funnel Display, Hanken Grotesk, Onest, Geist Sans

**For mono companion:**
- ABC Diatype Mono
- GT America Mono
- Berkeley Mono
- Geist Mono
- *Avoid: IBM Plex Mono, JetBrains Mono — reflex-reject*

### Reflex-reject (banned for this surface)
Inter · Plus Jakarta Sans · DM Sans · DM Serif · Outfit · Manrope · Fraunces · Newsreader · Cormorant · Playfair · Space Grotesk · Space Mono · IBM Plex (any variant) · Instrument Sans/Serif

### Hierarchy
- **Display** (semibold, clamp(3.75rem, 7vw, 6rem), line-height 1.0): hook lines and frame openers. One per frame max.
- **Headline** (medium, clamp(2rem, 4vw, 2.75rem), line-height 1.1): frame titles.
- **Title** (medium, 1.5rem, line-height 1.2): card or section labels within a frame.
- **Body** (regular, 1.25rem floor, line-height 1.6): supporting text. Max line-length 65ch.
- **Label** (mono medium, 0.875rem, letter-spacing 0.05em, uppercase): metadata, frame numbers, kicker tags.

### Named Rules

**The Single-Voice Rule.** One sans family does display + body. The mono is a companion, not a co-equal. If a frame uses display + headline + body + label simultaneously, the label is the only thing in mono.

**The Distance Rule.** Body type never below 20px. Display never below 60px on smallest viewport. If a frame is unreadable from the back row of a 30-person conference room, the type is too small.

## 4. Elevation

Flat by default. The system has no drop shadows. Depth comes from three sources:

- The single subtle multi-stop gradient mesh in the base background (atmosphere, not elevation)
- Layered fills with tinted neutrals (a card uses a slightly lighter tone of the base, never a shadow)
- One semi-transparent overlay for the facilitator cockpit (Esc modal)

No drop shadows on cards. No glow effects (the surface is never hovered). No glassmorphism. No depth-of-field tricks.

### Named Rule

**The No-Lift Rule.** Surfaces do not lift. Elements distinguish themselves through colour, scale, and position, not through suggested altitude.

## 5. Components

*Omitted — seed mode. No components exist yet. Will be populated when `/impeccable document` runs in scan mode after the first frames are built.*

## 6. Do's and Don'ts

### Do:
- **Do** keep one accent per frame. One teal moment OR one soft-accent moment, never both layered.
- **Do** push body type to 20px or larger. The projector eats contrast and resolution.
- **Do** use mono only for metadata — frame numbers, kicker labels, speaker-notes UI.
- **Do** treat the dark base as the canvas, not a background. Tint neutrals toward the teal cast.
- **Do** let frames breathe. A frame with three sentences and a single graphic is finished, not empty.
- **Do** push contrast toward 7:1 wherever the aesthetic permits — projection eats contrast.
- **Do** respect `prefers-reduced-motion`: the staggered entrance must short-circuit to instant.

### Don't:
- **Don't** use Inter, Plus Jakarta Sans, DM Sans, Outfit, Manrope, or Fraunces. Reflex-reject across this surface.
- **Don't** drop into the editorial-magazine aesthetic (display serif + italic drop caps + ruled separators + small-caps section labels). The Impeccable skill flags this lane as saturated.
- **Don't** ship purple gradients, glassmorphism, neon accents, or generic AI tool marketing tropes.
- **Don't** stack two soft accents in the same frame. They carry semantic position; doubling muddies the meaning.
- **Don't** add scroll-triggered animations, hover effects, or continuous motion. One staggered entrance per frame is the whole motion budget.
- **Don't** use animated checkmarks, scaling pyramids, abstract network-node diagrams, or other conference-keynote tropes.
- **Don't** stuff a frame with more than seven discrete content items. If you need more, the frame is too dense — split or cut.
- **Don't** ship below WCAG AA contrast. Push toward 7:1.
- **Don't** treat this surface as the parent AI Upskilling sales page. Same palette tokens, distinct atmosphere — soft departure, not continuity.
