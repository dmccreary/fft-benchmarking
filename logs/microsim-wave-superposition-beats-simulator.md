# MicroSim Generation Log: Wave Superposition Beats Simulator

**Sim ID:** `wave-superposition-beats-simulator`
**Chapter:** 7 — Complex Numbers and Wave Superposition
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/wave-superposition-beats-simulator.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, compare
- **Learning Objective:** Let students set the frequency and phase of two sine
  waves, examine the summed waveform, and compare constructive interference,
  destructive interference, and the beat pattern when frequencies are close but
  unequal.
- **Recommended Pattern:** Comparison tool — multiple synchronized views of the
  same phenomenon.
- **Specification Alignment:** Aligned.
- **Rationale:** Comparison at L4 requires the things being compared to be
  simultaneously visible. Three stacked plots on one time axis let a learner
  point at a null in the sum and trace straight up to see what the two inputs
  were doing at that instant — which is the reasoning step the objective asks
  for.

## Routing Decision

Keywords "stacked waveform plots", "shared time axis", "summed waveform",
"envelope overlay" → `references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + wave1 (95) + wave2 (95) + sum (150) + axis + readout | 455 |
| controlHeight | 3 rows x 35 + 10 | 115 |
| canvasHeight | 455 + 115 | 570 |
| iframe height | canvasHeight + 2 | 572 |
| sliderLeftMargin | "Wave 2 phase offset: 0.00 rad" label + padding | 270 |

The spec's suggested panel heights (150/150/250) would have pushed the canvas
past 700px; they are scaled to 95/95/150 while keeping the sum panel visibly
larger than its inputs.

## Implementation Notes

- The beat envelope is **derived, not fitted**. From
  `sin A + sin B = 2 sin((A+B)/2) cos((A-B)/2)`, the slow factor is
  `2*cos(pi*(f1-f2)*t - phase/2)`, which is exactly what `envelope()` returns.
  The dashed curve therefore touches the summed waveform's peaks by
  construction rather than by tuning.
- The same `envelope()` drives the green/red shading, so the shading, the
  envelope, and the beat readout can never tell three different stories.
- The envelope and the beat readout are suppressed when `f1 === f2`, per the
  spec — with no frequency difference there is no beat to report, and drawing a
  flat envelope would imply otherwise.
- The equal-frequency readout classifies the interference state from
  `|cos(phase/2)|`, so the "fully destructive" message appears exactly when the
  waves actually cancel.
- A fixed 100 ms window is used at all settings. An adaptive window was
  considered and rejected: rescaling the time axis as frequencies change would
  undermine the cross-panel comparison the sim exists to support.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 7 embed corrected to 572 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x572 with Wave 2 at 320 Hz, so the beat envelope is visible |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — clipped panel label.** "Wave 1 + Wave 2" was drawn right-aligned at
   `left - 10` with `left = 92`, so the string began at roughly x = -28 and the
   first characters were cut off the canvas. *Fix:* widened the label gutter to
   `left = 112` and shortened the label to "Wave 1 + 2", which fits with margin
   at every container width.
2. **Adjustment — readout crowding.** The beat-frequency line at y=432 sat close
   to the time-axis labels; moved to y=438.

Cycle 2: re-captured in the beats state — three panels aligned on one axis,
envelope touching the sum's peaks, green/red shading alternating with the
envelope, beat readout correct at 20 Hz. All checklist items PASS.

## Files Written

- `docs/sims/wave-superposition-beats-simulator/main.html`
- `docs/sims/wave-superposition-beats-simulator/wave-superposition-beats-simulator.js`
- `docs/sims/wave-superposition-beats-simulator/index.md`
- `docs/sims/wave-superposition-beats-simulator/metadata.json`
- `docs/sims/wave-superposition-beats-simulator/wave-superposition-beats-simulator.png`
