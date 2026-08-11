# MicroSim Generation Log: Window Function Comparison

**Sim ID:** `window-function-comparison`
**Chapter:** 15 — Windowing, Spectral Leakage, and Peak Detection
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/window-function-comparison.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Compare, distinguish
- **Learning Objective:** Let students compare the time-domain shape and the
  resulting main lobe width and side lobe level of the rectangular, Hann,
  Hamming, and Blackman windows, distinguishing the tradeoff each makes.
- **Recommended Pattern:** Identical layout across all options, switchable in one
  click.
- **Specification Alignment:** Aligned.
- **Rationale:** Comparison requires holding the presentation constant so only
  the subject varies. All four windows render through the same two panels with
  the same axes and the same two computed metrics, so any difference the learner
  sees is a real difference between windows.

## Routing Decision

Keywords "window shape", "frequency response", "dB scale", "radio buttons" →
`references/p5-guide.md`. The spec explicitly calls for computing the response
via an internal transform, which rules out a charting library fed static data.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + time panel (104) + frequency panel (150) + readout | 424 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 424 + 45 | 469 |
| iframe height | canvasHeight + 2 | 471 |

## Implementation Notes

- **Both metrics are measured, not quoted.** `analyze()` walks the computed
  response to find the first null (main lobe half-width) and then the highest
  point beyond it (worst side lobe). The results land on the textbook values —
  rectangular 2.0 bins / -13.3 dB, Blackman 6.1 bins / -58.1 dB — which is a
  strong check that both the window coefficients and the transform are right.
- The window is **zero-padded from N = 64 to M = 1024** before transforming.
  Without zero padding the response would only be sampled at bin centres, where
  every window looks like a single spike and the entire lobe structure is
  invisible. The 16× oversampling is what makes the comparison possible at all.
- Results are cached per window, so the O(M·N) transform runs once per selection
  rather than every frame.
- The side lobe level is drawn as a dashed reference line across the whole plot,
  which makes "how far down are the side lobes" a visual measurement rather than
  a number to take on faith.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 15 embed corrected to 471 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x471 showing Blackman; rectangular verified separately |

Computed metrics cross-checked against standard references: rectangular
2.0 bins / -13.3 dB, Hann 4.0 / -31.5, Hamming 4.0 / -41.7, Blackman 6.1 / -58.1.
All within rounding of the published figures.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **Adjustment — section label crowding the main title.** The time-domain
   section label sat at y = 22 with the main title occupying y = 4-28, so their
   bounding boxes just touched at the overlap in x. *Fix:* main title 21px → 20px
   at y = 2, time panel top 36 → 44 with height 112 → 104 so the base stays put.

No other defects: both panels, axis labels, dB gridlines, the side lobe reference
line, the readout, and the radio group all render cleanly. Cycle 2 re-captured
and all checklist items PASS.

## Files Written

- `docs/sims/window-function-comparison/main.html`
- `docs/sims/window-function-comparison/window-function-comparison.js`
- `docs/sims/window-function-comparison/index.md`
- `docs/sims/window-function-comparison/metadata.json`
- `docs/sims/window-function-comparison/window-function-comparison.png`
