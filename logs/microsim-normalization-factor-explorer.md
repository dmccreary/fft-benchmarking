# MicroSim Generation Log: Normalization Factor Explorer

**Sim ID:** `normalization-factor-explorer`
**Chapter:** 13 — FFT Variants, Complexity, and Correctness
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/normalization-factor-explorer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Demonstrate, calculate
- **Learning Objective:** Let students select different FFT scaling conventions
  and calculate how the same underlying spectrum's displayed magnitudes change
  purely due to normalization, not due to any difference in the signal.
- **Recommended Pattern:** Live calculator; immediate recalculation on selection.
- **Specification Alignment:** Aligned.
- **Rationale:** The misconception being repaired is that a magnitude difference
  between implementations means one is broken. The design makes the *identity* of
  the underlying data structural — a single `UNSCALED` array is the only source
  of truth and everything displayed is that array times a factor — so "the signal
  did not change" is a property of the code, not a claim in the caption.

## Routing Decision

Keywords "bar chart", "radio selector", "readout", "live rescale" →
`references/p5-guide.md`. Chart.js was considered, but the pinned-axis behavior
below (deliberately *not* auto-scaling) is easier to guarantee with direct
drawing, and the sim needs the readout panel in the same canvas.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + chart (190) + readout (92) | 400 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 400 + 80 | 480 |
| iframe height | canvasHeight + 2 | 482 |

## Implementation Notes

- **The y-axis is pinned to the unscaled peak of 8.0 and never auto-scales.**
  This is the single most important implementation decision in the sim. An
  auto-scaling chart would render all three conventions identically and destroy
  the entire lesson. Because the axis is fixed, choosing 1/N at N = 512 visibly
  collapses the bars to a sliver — which is exactly the experience of comparing
  two libraries with mismatched conventions.
- Bars for nonzero bins are floored at 2px so a collapsed bar is still locatable,
  and every nonzero bar carries a numeric label formatted with `toExponential`
  below 0.01, so values stay readable when the bar is not.
- The round-trip figure is 1.000 under every convention because
  `forward × inverse × N = 1` in all three cases. Stating it in the readout at
  every setting is what makes "this is a display choice, not a correctness issue"
  land.
- Convention definitions are data (`CONVENTIONS`), each carrying its own factor
  function and label formatters, so adding a fourth convention is a data change.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 13 embed corrected to 482 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `normalization-factor-explorer.png` captured at 482px |

Factors spot-checked at N = 512: no-forward-scaling gives peak 8.00, unitary
gives 8/√512 = 0.354, forward-normalized gives 8/512 = 0.0156. All three match
the displayed values.

## Layout Review (Claude Vision)

Cycle 1: no failures. Chart, gridlines, per-bar value labels, axis captions, the
three-factor readout, the radio group, and the N selector all render cleanly with
no overlap or clipping. All checklist items PASS on the first capture — no patch
cycle needed.

## Files Written

- `docs/sims/normalization-factor-explorer/main.html`
- `docs/sims/normalization-factor-explorer/normalization-factor-explorer.js`
- `docs/sims/normalization-factor-explorer/index.md`
- `docs/sims/normalization-factor-explorer/metadata.json`
- `docs/sims/normalization-factor-explorer/normalization-factor-explorer.png`
