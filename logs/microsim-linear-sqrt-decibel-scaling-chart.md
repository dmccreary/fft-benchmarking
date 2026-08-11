# MicroSim Generation Log: Linear Sqrt Decibel Scaling Chart

**Sim ID:** `linear-sqrt-decibel-scaling-chart`
**Chapter:** 14 — Computing and Displaying a Real Spectrum
**Library:** Chart.js 4.4.0
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/linear-sqrt-decibel-scaling-chart.json`

## Instructional Design Check

- **Bloom Level:** Evaluate (L5)
- **Bloom Verb:** Judge, compare
- **Learning Objective:** Let students compare the same fixed example spectrum
  under linear, square-root, and decibel scaling, and judge which best reveals
  quiet frequency content alongside a dominant peak.
- **Recommended Pattern:** Judgment task with explicit criteria and feedback.
- **Specification Alignment:** Aligned.
- **Rationale:** For a genuine Evaluate task the "right" answer must not be
  pre-baked. The documentation deliberately argues *against* a simple
  "decibels win" conclusion — dB understates the peak's true dominance — so the
  student has to weigh purpose against display, which is the actual engineering
  judgment.

## Routing Decision

Keywords "bar chart", "radio toggle", "tooltip", "fixed dataset" →
`references/chartjs-guide.md`.

## Layout Plan

| Value | Result |
|-------|--------|
| chart box | 314px fixed |
| controls row | ~42px |
| caption panel | ~62px min |
| CANVAS_HEIGHT | 480 |
| iframe height | 482 |

## Implementation Notes

- The caption is **computed, not written**. `invisibleBins()` measures each bar's
  height as a fraction of the plot area and lists the ones under 1.5%, so the
  linear-mode caption names the actually-invisible bins rather than a
  hand-guessed list that could drift from the data.
- The dB floor is -60 dB and `Math.max` clamps it, so a zero-power bin cannot
  produce `-Infinity` and blow up the axis.
- Tooltips report **raw power and displayed value together**, which is what lets
  a student confirm that an invisible bar still has real energy behind it.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 14 embed corrected to 482 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x482 in linear mode; dB mode verified separately |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — decibel bars rendered upside down.** Chart.js anchors bar charts at
   zero. With dB values all negative and the axis running -60 to +2, every bar
   hung *downward* from the zero line, and the 0 dB peak at bin 3 rendered as no
   bar at all — exactly inverting the meaning, with the loudest bin appearing
   smallest. Caught only because the dB state was rendered and inspected
   separately rather than assumed from the linear capture.
   *Fix:* set the dataset's `base` to `DB_FLOOR` in dB mode and 0 otherwise, and
   reassign it in `update()` so switching modes re-anchors correctly.

Cycle 2: re-captured in dB mode — bars rise from the -60 floor with bin 3 topping
out at 0 dB, and all sixteen bins are readable as the caption claims. Linear mode
re-verified unchanged. All checklist items PASS.

## Files Written

- `docs/sims/linear-sqrt-decibel-scaling-chart/main.html`
- `docs/sims/linear-sqrt-decibel-scaling-chart/style.css`
- `docs/sims/linear-sqrt-decibel-scaling-chart/linear-sqrt-decibel-scaling-chart.js`
- `docs/sims/linear-sqrt-decibel-scaling-chart/index.md`
- `docs/sims/linear-sqrt-decibel-scaling-chart/metadata.json`
- `docs/sims/linear-sqrt-decibel-scaling-chart/linear-sqrt-decibel-scaling-chart.png`
