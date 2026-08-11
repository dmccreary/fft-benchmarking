# MicroSim Generation Log: Dynamic Range Ladder

**Sim ID:** `dynamic-range-ladder`
**Chapter:** 6 — Sampling, Quantization, and Aliasing
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/dynamic-range-ladder.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Let students interpret a vertical amplitude scale
  showing where full scale, headroom, typical signal level, noise floor, and the
  clipping zone sit relative to one another, and explain what happens at each.
- **Recommended Pattern:** Persistent clickable diagram with progressive
  disclosure. No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** The misconception is that these are four unrelated vocabulary
  items. A single persistent ladder makes "these are positions on one scale" the
  structural claim of the visual itself, which is exactly what an "interpret a
  scale" objective calls for.

## Routing Decision

Keywords "vertical bar", "labeled bands", "clickable", "infobox" →
`references/p5-guide.md`. Same family as the Pico 2 Memory Map Explorer, and the
implementation reuses that sim's compute-layout-then-hit-test pattern.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + subtitle + ladder (350) + margins | 450 |
| controlHeight | 1 row x 35 + 10 | 50 |
| canvasHeight | 450 + 50 | 500 |
| iframe height | canvasHeight + 2 | 502 |

Five bands: clipping 58, headroom 62, typical 118, noise 66, silence 46.

## Implementation Notes

- The extra-bit toggle is implemented as a **transfer** of 28px from the noise
  band into the typical band, with every other boundary held fixed. This is the
  pedagogical claim made structural: adding a bit does not raise full scale, it
  lowers the noise floor. A naive implementation that grew the whole bar would
  have taught the opposite.
- `zoneHeights()` returns copies rather than mutating `ZONES`, so toggling the
  checkbox repeatedly cannot accumulate drift in the band heights.
- The dB figures in the subtitle and on the noise-floor annotation are both
  derived from `6.02 * bits`, so they cannot disagree with each other.
- A vertical double-headed arrow spans full scale to noise floor and is labeled
  "usable range", giving the abstract term a measured extent on screen.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 6 embed corrected to 502 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `dynamic-range-ladder.png` captured at 502px |

## Layout Review (Claude Vision)

Cycle 1: no failures. All five bands render with legible labels, the full-scale
and noise-floor annotations sit clear of the bar, the usable-range arrow and its
rotated label are positioned correctly between the two boundaries, and the info
panel and control are fully visible. All checklist items PASS on the first
capture — no patch cycle needed.

## Files Written

- `docs/sims/dynamic-range-ladder/main.html`
- `docs/sims/dynamic-range-ladder/dynamic-range-ladder.js`
- `docs/sims/dynamic-range-ladder/index.md`
- `docs/sims/dynamic-range-ladder/metadata.json`
- `docs/sims/dynamic-range-ladder/dynamic-range-ladder.png`
