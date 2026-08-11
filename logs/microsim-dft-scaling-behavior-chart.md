# MicroSim Generation Log: DFT Scaling Behavior Chart

**Sim ID:** `dft-scaling-behavior-chart`
**Chapter:** 10 — Why the DFT Is Too Slow
**Library:** Chart.js 4.4.0
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/dft-scaling-behavior-chart.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, compare
- **Learning Objective:** Let students examine a plotted curve of operation count
  versus N and compare the DFT's quadratic growth against a hypothetical linear
  algorithm.
- **Recommended Pattern:** Comparison tool with a read-off marker.
- **Specification Alignment:** Aligned.
- **Rationale:** Comparing two growth rates requires reading both at the same N,
  which is what the draggable marker plus the numeric readout provide. The log
  toggle exists because on a linear axis one of the two series is visually
  indistinguishable from zero — and noticing *that* is part of the lesson.

## Routing Decision

Keywords "line chart", "two series", "log-scale toggle", "tooltip", "annotation"
→ `references/chartjs-guide.md`.

## Layout Plan

| Value | Result |
|-------|--------|
| chart box | 330px fixed |
| controls row | ~42px |
| readout panel | ~56px |
| CANVAS_HEIGHT | 470 |
| iframe height | 472 |

## Implementation Notes

- Both the fixed N = 512 annotation and the movable marker are drawn by one
  custom plugin hooked to `afterDatasetsDraw`, per the Chart.js guide's note that
  `afterDraw` paints over tooltips.
- The y-scale is rebuilt by `yScaleConfig()` and reassigned on toggle rather than
  mutated in place, so switching to logarithmic also swaps in the appropriate
  tick formatting (thousands separators on linear, default on log).
- Marker drags call `chart.update('none')` to skip the animation, so dragging
  stays responsive while the annotation follows.
- The readout states the ratio **and** names it as equal to N. That identity is
  the actual takeaway — the penalty is not a constant factor, it scales — and
  saying it in the readout means the learner meets it while looking at the
  numbers rather than only in the prose.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 10 embed corrected to 472 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x472 with the exact-height helper |

## Layout Review (Claude Vision)

Cycle 1: no failures. Both series render, the legend is clear, the fixed
annotation and the movable marker are both visible and legibly labeled, axis
titles and thousands-separated ticks are readable, and the controls and readout
panels are fully visible. The linear series correctly appears flat against the
axis at this scale — verified as expected behavior, not a defect. All checklist
items PASS on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/dft-scaling-behavior-chart/main.html`
- `docs/sims/dft-scaling-behavior-chart/style.css`
- `docs/sims/dft-scaling-behavior-chart/dft-scaling-behavior-chart.js`
- `docs/sims/dft-scaling-behavior-chart/index.md`
- `docs/sims/dft-scaling-behavior-chart/metadata.json`
- `docs/sims/dft-scaling-behavior-chart/dft-scaling-behavior-chart.png`
