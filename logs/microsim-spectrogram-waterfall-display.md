# MicroSim Generation Log: Spectrogram Waterfall Display

**Sim ID:** `spectrogram-waterfall-display`
**Chapter:** 16 — Building a Real-Time Spectrum Analyzer
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/spectrogram-waterfall-display.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, interpret
- **Learning Objective:** Let students examine a scrolling waterfall spectrogram
  and interpret how a changing pitch appears as a moving coloured trace over
  time.
- **Recommended Pattern:** Pattern-recognition display with recognizable
  reference cases. Animation is appropriate here because the subject *is* change
  over time.
- **Specification Alignment:** Aligned.
- **Rationale:** Interpretation of time-frequency data is learned by matching
  familiar sounds to their signatures. The four examples are chosen so that two
  are frequency-narrow and time-wide (tones) and one is the exact dual
  (the clap), which is what makes the uncertainty tradeoff discussable.

## Routing Decision

Keywords "scrolling 2D plot", "colour intensity", "waterfall" →
`references/p5-guide.md`. Per-cell colour mapping over a scrolling grid is
direct pixel work, not charting.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + waterfall (264) + axis captions | 380 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 380 + 45 | 425 |
| iframe height | canvasHeight + 2 | 427 |

Grid is 48 bins by 90 visible columns, with a colour legend to the right.

## Implementation Notes

- Frequency runs **bottom to top** (`g.bottom - (k+1)*ch`), matching every real
  analyzer. Drawing bin 0 at the top would have inverted every signature the sim
  is teaching.
- The colour map is a four-segment `lerpColor` ramp from dark navy through blue,
  cyan, and yellow to white. A single-hue ramp would have made the quiet noise
  floor and the loud peak hard to separate at a glance.
- The clap's broadband texture uses a deterministic hash of the bin index rather
  than `Math.random()`, so the same figure renders every time.
- Cells are drawn 0.6px oversized to avoid hairline seams between neighbouring
  rectangles at fractional cell sizes.
- Each example is precomputed into a 180-frame array on selection, so scrolling
  costs only drawing.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 16 embed corrected to 427 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `spectrogram-waterfall-display.png` captured at 427px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — rotated axis label collided with tick labels.** "Frequency" was drawn
   at x = 18 while the "4000 Hz" style tick labels were right-aligned at x = 56
   and extended back to x ≈ 4, printing over it. *Fix:* widened the plot's left
   gutter (62 → 78), dropped the redundant "Hz" from each tick, and moved the
   unit into the rotated label as "Frequency (Hz)".

Cycle 2: re-captured — rising whistle trace renders correctly as a sloping bright
line, axis labels clear, colour legend and both controls visible. All checklist
items PASS.

## Files Written

- `docs/sims/spectrogram-waterfall-display/main.html`
- `docs/sims/spectrogram-waterfall-display/spectrogram-waterfall-display.js`
- `docs/sims/spectrogram-waterfall-display/index.md`
- `docs/sims/spectrogram-waterfall-display/metadata.json`
- `docs/sims/spectrogram-waterfall-display/spectrogram-waterfall-display.png`
