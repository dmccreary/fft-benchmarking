# MicroSim Build Log: Optimization Attribution Waterfall

- **MicroSim ID:** `optimization-attribution-waterfall`
- **Chapter:** 24 — Specialization and Branchless Code
- **Library:** Chart.js 4.4.0
- **Bloom level:** Evaluate (justify, assess)
- **Canvas height:** 516 (iframe 518px)
- **Date:** 2026-08-11

## Learning Objective

Assess how much of a total speedup each individual optimization contributed, by
inspecting a waterfall chart built from one-change-at-a-time measurements.

## Design Decisions

**Waterfall via floating bars.** Chart.js has no waterfall type, but a bar
dataset accepts `[from, to]` pairs, which is exactly a floating bar. The two
totals are drawn from zero and the four steps float between the running levels.
A custom `afterDatasetsDraw` plugin adds the dashed connectors between adjacent
bars and the value label above each bar, using `scales.y.getPixelForValue()` on
the running level so the connectors stay correct in both unit modes.

**`beginAtZero: true`, deliberately.** Zooming the y-axis to 700–860 would make
the four steps look dramatic. Left at zero they look modest, which is the honest
picture: four optimizations move 140 μs off 850. The documentation makes this
explicit rather than apologizing for it — a chart that inflates the win hides
the decision the chapter is teaching.

**Order-dependence is called out.** The branchless-butterfly step is worth 15 μs
only because the step before it introduced the branch. Measured first, against
the baseline, it would be worth zero. This is stated in that step's detail text,
in the page prose, and in a lesson-plan activity, because it is the single most
common way a waterfall gets misread.

**Every number is derived.** `FINAL` is computed from the baseline and the four
deltas rather than hard-coded, and the running `LEVELS` array is built by
accumulation. Shares of the total speedup and of the baseline are computed at
render time. Nothing in the chart can drift out of agreement with the data.

**Two units, one dataset.** The percentage toggle rescales `barData()`, the axis
title, the value labels, and the tooltips through a single `toUnits()` helper,
so no branch of the code can display one unit while another displays a different
one. Step labels get two decimals in percentage mode (−7.06%) because at one
decimal the 1.76% step and the 2.94% step read too similarly.

**Legend as HTML, not Chart.js.** The spec calls for a legend keyed by direction
(green decrease / red increase) rather than by dataset, which the built-in legend
cannot express for a single dataset. It is rendered as two swatches in the
controls bar. The red entry stays visible even though no step here is a
regression — a waterfall that could not show a failed optimization would not be
worth much.

## Verification

- Arithmetic checked: 850 − 60 − 15 − 40 − 25 = 710, total 140 μs, 1.20×
  speedup, 16.5% of baseline. Shares: 43%, 11%, 29%, 18% — summing to 101% from
  rounding of individually rounded values, which is why the summary text quotes
  "100 of the 140 μs" for the two largest rather than adding percentages.
- Both unit modes captured and reviewed. Percentage mode reports 100.0% baseline
  and 83.5% final, with step labels −7.06%, −1.76%, −4.71%, −2.94%.
- Connector lines verified against the bar tops in both modes; they land on the
  running levels, not on the bar edges.
- Playwright capture at exactly 800×518 with pageerror and console-error
  listeners; both empty. Canvas height taken from the measured
  `document.body.scrollHeight` of 516 rather than estimated from the CSS.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
