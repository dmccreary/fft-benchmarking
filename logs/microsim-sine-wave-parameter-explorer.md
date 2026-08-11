# MicroSim Generation Log: Sine Wave Parameter Explorer

**Sim ID:** `sine-wave-parameter-explorer`
**Chapter:** 4 — Waves
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/sine-wave-parameter-explorer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Demonstrate, calculate
- **Learning Objective:** Let students manipulate amplitude, frequency, and phase
  independently and observe exactly which visual feature of the plotted wave each
  parameter controls, connecting y(t) = A sin(2*pi*f*t + phi) to its graph.
- **Recommended Pattern:** One-variable-at-a-time parameter exploration with a
  live equation readout.
- **Specification Alignment:** Aligned.
- **Rationale:** The objective is about *isolation* — the misconception is that
  the three parameters all vaguely "change the wave." Three independent sliders
  plus color-matched equation terms make each parameter's effect separable, and
  the t=0 dot gives phase a concrete observable it would otherwise lack.

## Routing Decision

Keywords "waveform plot", "live redraw", "equation readout", "overlay curve" →
`references/p5-guide.md`. Plotly was considered for the function plot but
rejected: the spec wants per-frame recomputation from live sliders plus a custom
t=0 marker and color-keyed equation, all of which are simpler drawn directly.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + equation + plot + axis labels | 350 |
| controlHeight | 4 rows x 35 + 10 | 150 |
| canvasHeight | 350 + 150 | 500 |
| iframe height | canvasHeight + 2 | 502 |
| sliderLeftMargin | longest label "Frequency (f): 1.0 Hz" + padding | 210 |

Control inventory (4 total, within the 1-5 guideline): three sliders on rows 1-3,
cosine overlay checkbox on row 4.

## Implementation Notes

- `drawEquation()` reuses the auto-shrinking colored-token renderer developed for
  the Cycle Budget Calculator: tokens are measured with `textWidth()` and the
  type size steps down until the whole equation fits the container.
- The y-scale is derived from `MAX_AMPLITUDE * 1.1` rather than the current
  amplitude, so the curve grows and shrinks *within* a fixed frame. Auto-scaling
  would have hidden the very effect the amplitude slider is meant to show.
- The cosine overlay is drawn with phase pinned at `HALF_PI` regardless of the
  phase slider, per the spec, so the quarter-cycle relationship holds at any
  slider setting.
- `drawingContext.setLineDash()` is used for the zero reference and reset
  immediately after, so no later stroke inherits the dash pattern.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 4 embed corrected to 502 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `sine-wave-parameter-explorer.png` captured at 502px |

## Layout Review (Claude Vision)

Cycle 1: no failures. Title, color-keyed equation, gridded plot with labeled
axes, dashed zero reference, red t=0 marker with the value dot, and four
color-matched controls all render correctly with no overlap or clipping. All
checklist items PASS on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/sine-wave-parameter-explorer/main.html`
- `docs/sims/sine-wave-parameter-explorer/sine-wave-parameter-explorer.js`
- `docs/sims/sine-wave-parameter-explorer/index.md`
- `docs/sims/sine-wave-parameter-explorer/metadata.json`
- `docs/sims/sine-wave-parameter-explorer/sine-wave-parameter-explorer.png`
