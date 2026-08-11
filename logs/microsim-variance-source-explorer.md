# MicroSim Generation Log: Variance Source Explorer

**Sim ID:** `variance-source-explorer`
**Chapter:** 18 — Benchmarking Methodology
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/variance-source-explorer.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Interpret a histogram of repeated timing measurements
  and explain how interrupt interference produces a right-skewed distribution
  rather than uniform noise.
- **Recommended Pattern:** Accumulating live distribution the learner builds by
  sampling.
- **Specification Alignment:** Aligned.
- **Rationale:** The learner adds samples one batch at a time and watches the
  tail form, so the skew is something they observe accumulating rather than a
  finished picture they are told to interpret.

## Routing Decision

Keywords "live histogram", "statistics readout", "sampling buttons" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + histogram (270) + axis and legend | 410 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 410 + 80 | 490 |
| iframe height | canvasHeight + 2 | 492 |
| sliderLeftMargin | "Interrupt interference rate: 30%" label + padding | 290 |

## Implementation Notes

- Baseline jitter is **Gaussian via Box-Muller**, not `Math.random()`. A uniform
  baseline would have produced a flat-topped cluster, and the contrast between a
  symmetric core and a one-sided tail is the entire lesson.
- Interference is modeled as **strictly additive** (`t += 50 + rand*100`). This
  is the physical claim the sim is making — an interrupt steals cycles and never
  returns them — and encoding it as addition-only means the right skew emerges
  from the model rather than being drawn in.
- Bars are colored by threshold (`> baseline + 4σ`), so the blue/red split is
  computed from the data rather than from knowing which draw produced each
  sample. A run that happened to land in the tail by chance would be colored red
  too, which is honest: from the histogram alone you cannot tell them apart.
- Mean and minimum are drawn as markers on the histogram itself, so their
  divergence is spatial rather than only numeric.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 18 embed corrected to 492 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x492 after 160 samples at 8% interference |

Behaviour verified against the capture: mean 409.3 µs sits well right of the
minimum 389.2 µs, standard deviation is 29.4 µs against a 5 µs baseline jitter,
and every red bar lies to the right of the blue cluster — never to the left.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — legend collided with the marker labels.** The "clean runs" and
   "interrupt-affected runs" colour key was drawn at the top of the plot, on top
   of the "min" and "mean" marker captions. *Fix:* moved the key below the x-axis
   label where there was free space.
2. **FAIL — statistics panel text truncated** at "...which is why best-of-N
   resists". *Fix:* panel height 300 → 320, note box 84 → 100, and the sentence
   shortened to fit the narrow column.

Cycle 2: re-captured — histogram, both markers, colour key, and the complete
statistics panel all render cleanly. All checklist items PASS.

## Files Written

- `docs/sims/variance-source-explorer/main.html`
- `docs/sims/variance-source-explorer/variance-source-explorer.js`
- `docs/sims/variance-source-explorer/index.md`
- `docs/sims/variance-source-explorer/metadata.json`
- `docs/sims/variance-source-explorer/variance-source-explorer.png`
