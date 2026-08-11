# MicroSim Build Log: Variant Performance Dashboard

- **MicroSim ID:** `variant-performance-dashboard`
- **Chapter:** 26 — Competing Variants: Predict, Measure, Explain
- **Library:** Chart.js 4.4.0
- **Bloom level:** Evaluate (assess, critique)
- **Canvas height:** 564 (iframe 566px)
- **Date:** 2026-08-11

## Learning Objective

Assess how a predicted ranking compares to a measured ranking across multiple
metrics, and critique which metric best answers "which variant should I actually
ship?"

## Design Decisions

**The prediction persists across metric changes.** This is the whole mechanism.
The learner commits to one ranking, then switches metrics without touching it,
and watches the score move — 3 of 5 on kernel time becomes 0 of 5 on code size.
Resetting the prediction when the metric changed would have destroyed the point,
so `predOrder` is deliberately independent of `metric`.

**Drag *and* buttons.** The spec asks for drag-to-reorder. HTML5 drag-and-drop
is unusable with a keyboard and awkward on touch, so each chip also carries ◀ ▶
nudge buttons that call the same `moveTo()`. Both paths go through one function,
so they cannot disagree.

**Ties are shown, not broken.** `measuredOrder()` sorts ascending and leaves
equal values adjacent in their natural order; memory usage genuinely has two
ties (2048 twice, 512 twice). The winner highlight uses `filter(v === min)` so
both 512-byte variants get the gold bar. The insight text makes the point that a
tie is a real result that pushes the decision onto another criterion.

**Fixed panel height.** The prediction panel is `height: 150px` rather than
`min-height`, because toggling the overlay otherwise changed
`document.body.scrollHeight` from 548 to 592 and the iframe would have clipped
or gapped. Measured both states after the change: 564 either way.

**Gold marks the winner, per metric.** The per-variant colors stay constant so a
variant is recognizable across metrics, and the best variant on the active
metric is overridden to gold. Switching to code size visibly moves the gold bar
from the right end of the chart to the left end.

## An Honest Note on the Title

The spec's title is "Same Five Variants, Four Different Rankings", and it is
used verbatim. Strictly, the supplied data yields **three** distinct rankings
across four metrics: kernel time and total time produce the same order. Rather
than change the data or the title, the page prose treats this as a finding —
the two metrics agree on order but disagree on margin (29.6× versus 22.2×), and
that gap is fixed overhead. This turns an apparent inconsistency into the most
useful observation in the sim, and it is called out in both the page text and a
lesson-plan activity.

## Verification

- Rankings computed and checked against the data by hand. Kernel time:
  Specialized (710) < Assembly (850) < @viper (3,200) < @native (9,800) <
  Plain (21,000). Code size: exactly reversed. Memory: two ties.
- Speedup figures in the insight text verified: 21000/710 = 29.58 → 29.6×;
  21050/950 = 22.16 → 22.2×; 1400/400 = 3.5×.
- Overheads verified: 50, 100, 150, 250, 240 μs — the specialized variant's
  240 μs is the second largest despite having the smallest kernel, which is the
  point the prose makes.
- Prediction scoring exercised with `predOrder = [4, 2, 3, 1, 0]`: reports 3 of 5
  on kernel time and 0 of 5 on code size, both captured in screenshots.
- Playwright capture at exactly 800×566 with pageerror and console-error
  listeners; both empty. Body height measured in both overlay states before
  fixing CANVAS_HEIGHT.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
