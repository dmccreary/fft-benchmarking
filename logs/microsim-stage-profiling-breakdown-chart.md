# MicroSim Generation Log: Stage Profiling Breakdown Chart

**Sim ID:** `stage-profiling-breakdown-chart`
**Chapter:** 16 — Building a Real-Time Spectrum Analyzer
**Library:** Chart.js 4.4.0
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/stage-profiling-breakdown-chart.json`

## Instructional Design Check

- **Bloom Level:** Evaluate (L5)
- **Bloom Verb:** Judge, prioritize
- **Learning Objective:** Let students judge, from a stacked breakdown of
  capture, compute, and draw time, which stage should be prioritized for
  optimization, using measured percentages rather than intuition.
- **Recommended Pattern:** Rubric/criterion tool with explicit feedback per
  option.
- **Specification Alignment:** Aligned.
- **Rationale:** The judgment is only meaningful if the criterion is stated. Each
  segment's infobox gives not just its share but the *consequence* of that share
  for optimization payoff, which is the reasoning step the objective wants.

## Routing Decision

Keywords "stacked bar", "pie chart toggle", "clickable segments", "callout" →
`references/chartjs-guide.md`.

## Layout Plan

| Value | Result |
|-------|--------|
| HTML heading | ~24px |
| chart box | 268px fixed |
| controls row | ~42px |
| infobox | ~66px min |
| CANVAS_HEIGHT | 470 |
| iframe height | 472 |

## Implementation Notes

- The callout is a custom plugin on `afterDatasetsDraw`, per the Chart.js guide's
  tooltip-layering note.
- Both views are built from **one** `STAGES` array, so the bar and the pie cannot
  show different numbers — which matters, because the documentation asks students
  to confirm the view does not change the conclusion.
- `chart.destroy()` runs before rebuilding on a view switch, since Chart.js will
  not re-type an existing chart instance in place.
- The infobox opens showing Compute rather than empty, so the sim's finding is
  visible before any interaction.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 16 embed corrected to 472 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x472 with the exact-height helper |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — callout pointed at the wrong place.** The arrow used
   `el.x - el.width/2 + el.width/2`, which for a horizontal stacked bar element
   is its **right edge** — so the arrow landed on the compute/draw boundary
   rather than on compute. *Fix:* use `(el.base + el.x) / 2`, the true segment
   midpoint.
2. **FAIL — callout text overlapped the chart title.** Increasing
   `layout.padding.top` to make room moved the Chart.js title down with it, so
   the collision persisted no matter how much padding was added.
   *Fix (cycle 2):* moved the heading out of Chart.js into an HTML `<h2>` above
   the canvas. The chart's top padding is now purely callout space and is
   independent of the heading's position.

Cycle 3: re-captured — heading, two-line callout, correctly-anchored arrow,
stacked bar, legend, controls, and infobox all clear. All checklist items PASS.

## Files Written

- `docs/sims/stage-profiling-breakdown-chart/main.html`
- `docs/sims/stage-profiling-breakdown-chart/style.css`
- `docs/sims/stage-profiling-breakdown-chart/stage-profiling-breakdown-chart.js`
- `docs/sims/stage-profiling-breakdown-chart/index.md`
- `docs/sims/stage-profiling-breakdown-chart/metadata.json`
- `docs/sims/stage-profiling-breakdown-chart/stage-profiling-breakdown-chart.png`
