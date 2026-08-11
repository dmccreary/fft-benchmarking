# MicroSim Generation Log: Benchmark Results Chart

**Sim ID:** `benchmark-results-chart`
**Chapter:** 18 — Benchmarking Methodology
**Library:** Chart.js 4.4.0
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/benchmark-results-chart.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Compare, examine
- **Learning Objective:** Compare mean-with-error-bars against best-of-N across
  several implementations, and examine which comparison changes the apparent
  ranking.
- **Recommended Pattern:** Same-data comparison tool, one statistic shown at a
  time per the spec.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec's data is chosen so the ranking **does not** flip, and
  the callout leans into that. A flip would let the learner conclude "pick the
  right statistic and you get the right answer"; an unchanged ranking forces the
  harder and more useful observation that the same true statement means two
  different things.

## Routing Decision

Keywords "bar chart with error bars", "toggle", "hover values", "callout" →
`references/chartjs-guide.md`.

## Layout Plan

| Value | Result |
|-------|--------|
| HTML heading | ~24px |
| chart box | 286px fixed |
| controls row | ~42px |
| callout | ~62px min |
| CANVAS_HEIGHT | 470 |
| iframe height | 472 |

The heading lives in HTML rather than in Chart.js, following the fix established
in `stage-profiling-breakdown-chart` — Chart.js titles move with layout padding
and collide with canvas-drawn annotations.

## Implementation Notes

- Error bars are a custom plugin on `afterDatasetsDraw`, drawing whisker and caps
  from `y.getPixelForValue(mean ± stddev)` so they track the axis exactly.
- **The y-axis is pinned to 300-500 µs across both views.** Letting Chart.js
  auto-scale would have redrawn the bars at a different scale on toggle, making
  the two statistics look more different than they are — a subtle way for the sim
  to mislead about the very thing it is teaching.
- The mean-view tooltip reports mean, standard deviation, **and** the implied
  range, since the range is what actually answers "will this meet my deadline".
- The documentation extends past the spec to name the practical consequence: for
  a real-time system, implementation C may be the right choice despite losing
  both comparisons, because a predictable worst case beats a better average.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 18 embed corrected to 472 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `benchmark-results-chart.png` captured at 472px |

Callout claim verified against the render: B's upper whisker sits at 455 µs and
C's bar top at 430 µs, so "B's error bar reaches higher than C's entire bar" is
accurate.

## Layout Review (Claude Vision)

Cycle 1: no failures. Three bars with correctly positioned error bars and caps,
legend, axis titles, fixed axis range, controls, and callout all render cleanly.
All checklist items PASS on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/benchmark-results-chart/main.html`
- `docs/sims/benchmark-results-chart/style.css`
- `docs/sims/benchmark-results-chart/benchmark-results-chart.js`
- `docs/sims/benchmark-results-chart/index.md`
- `docs/sims/benchmark-results-chart/metadata.json`
- `docs/sims/benchmark-results-chart/benchmark-results-chart.png`
