# MicroSim Generation Log: Correlation vs Test Frequency Sweep

**Sim ID:** `correlation-vs-test-frequency-sweep`
**Chapter:** 8 — Correlation
**Library:** Chart.js 4.4.0
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/correlation-vs-test-frequency-sweep.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, distinguish
- **Learning Objective:** Let students examine a plot of correlation magnitude
  against test frequency and distinguish the sharp peak at the signal's true
  frequency from the near-zero correlation at every non-matching frequency.
- **Recommended Pattern:** Swept-parameter response curve with hover inspection
  and a marked ground truth.
- **Specification Alignment:** Aligned.
- **Rationale:** "Distinguish" requires the learner to compare magnitudes at
  chosen points, which is what tooltips provide. The dashed ground-truth marker
  matters because it lets a learner confirm the peak's *position* independently
  rather than assuming the chart put it in the right place.

## Routing Decision

Keywords "line chart", "x-axis test frequency", "y-axis correlation",
"tooltip", "dashed annotation" → `references/chartjs-guide.md`. This is a genuine
dataset (200 computed points) with a conventional axis pair, which is exactly
what Chart.js is for.

## Layout Plan

| Value | Result |
|-------|--------|
| chart box | 356px fixed |
| controls row | ~44px |
| padding | 16px |
| CANVAS_HEIGHT | 450 |
| iframe height | 452 |

Fixed pixel heights are used rather than viewport units, so the layout does not
depend on the iframe's height being interpreted as the viewport.

## Implementation Notes

- Correlation uses **both** the in-phase and quadrature components and takes the
  magnitude. A sine-only correlation would have made the peak height depend on
  the captured signal's phase, which would be a distracting artifact in a chart
  whose whole subject is peak height.
- The ground-truth marker is a custom plugin hooked to `afterDatasetsDraw`, not
  `afterDraw`. The Chart.js guide flags this specifically: `afterDraw` runs after
  tooltips render, so the annotation would paint over the tooltip box.
- The marker label flips to the left of the line when the marker is close to the
  right edge, so dragging the signal frequency to 1000 Hz does not push the label
  off the plot area.
- `pointRadius: 0` with `pointHitRadius: 8` keeps the 200-point line clean while
  leaving it easy to hover.
- The sidelobes and the sub-1.0 peak are genuine consequences of a finite
  rectangular window, and the documentation names them (spectral leakage and
  scalloping loss) rather than smoothing them away.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 8 embed corrected to 452 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x452 with the exact-height helper |

## Layout Review (Claude Vision)

Cycle 1: no failures. The peak sits on the dashed marker at 440 Hz, the label is
clear of the curve, both axis titles and all tick labels are legible, the fill
reads clearly against the grid, and the slider row is fully visible. All
checklist items PASS on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/correlation-vs-test-frequency-sweep/main.html`
- `docs/sims/correlation-vs-test-frequency-sweep/style.css`
- `docs/sims/correlation-vs-test-frequency-sweep/correlation-vs-test-frequency-sweep.js`
- `docs/sims/correlation-vs-test-frequency-sweep/index.md`
- `docs/sims/correlation-vs-test-frequency-sweep/metadata.json`
- `docs/sims/correlation-vs-test-frequency-sweep/correlation-vs-test-frequency-sweep.png`
