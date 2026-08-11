# MicroSim Generation Log: In-Phase Quadrature Explorer

**Sim ID:** `in-phase-quadrature-explorer`
**Chapter:** 8 — Correlation
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/in-phase-quadrature-explorer.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, compare
- **Learning Objective:** Let students adjust a captured signal's phase offset and
  compare how the in-phase and quadrature components individually rise and fall
  while the combined magnitude stays constant.
- **Recommended Pattern:** Comparison tool — three related quantities visible
  simultaneously so an invariant can be spotted against two variables.
- **Specification Alignment:** Aligned, with one addition (below).
- **Rationale:** Recognizing an invariant requires seeing what *does* change
  alongside what does not. Three meters side by side deliver that at the current
  phase; the added phase-response plot delivers it across the whole range at
  once.

## Routing Decision

Keywords "live bar meters", "waveform", "phase slider" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + meters (190) + waveform (66) + phase plot (78) | 445 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 445 + 45 | 490 |
| iframe height | canvasHeight + 2 | 492 |
| sliderLeftMargin | "Phase offset: 0.00 rad (0°)" label + padding | 265 |

### Addition beyond spec

The spec calls for three bar meters and a waveform. A fourth element was added: a
compact plot of I, Q, and magnitude across the *entire* phase range with a marker
at the current setting. The spec's own behavior description — "the I bar traces a
cosine-shaped path and the Q bar traces a sine-shaped path" — describes something
a learner can only infer by dragging and remembering. Plotting it makes the claim
directly checkable, and the flat green magnitude line is the single most
convincing artifact in the sim.

## Implementation Notes

- I and Q are computed by **running the actual correlation sums** in
  `components()`, not by substituting cos(phase) and sin(phase). The point of the
  sim is that the invariance falls out of the arithmetic, so shortcutting the
  arithmetic would have hollowed it out.
- The signal is placed at 500 Hz against a 128-sample window at 8 kHz. That is
  exactly 8 bins, so the correlation sums are exact and the magnitude reads
  1.000 rather than something like 0.997 that a student would rightly question.
- The phase-response plot calls `components()` across the sweep each frame. At
  N=128 and roughly 105 sample points this is inexpensive and keeps the curves
  consistent with the meters by construction.
- The magnitude meter uses a 0-1.4 scale per the spec while I and Q use ±1, and
  each meter is labeled with its own end values so the different scales cannot be
  misread.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 8 embed corrected to 492 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x492 with phase driven to 2.10 rad |

## Layout Review (Claude Vision)

Cycle 1: no failures. Numerical spot check against the capture confirms
correctness: at φ = 2.10 the sim reports I = -0.505 (cos 2.10 = -0.5048),
Q = 0.863 (sin 2.10 = 0.8632), magnitude = 1.000. The phase-response plot shows
I as a cosine, Q as a sine, and magnitude as a flat line at the top, exactly as
intended. All checklist items PASS on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/in-phase-quadrature-explorer/main.html`
- `docs/sims/in-phase-quadrature-explorer/in-phase-quadrature-explorer.js`
- `docs/sims/in-phase-quadrature-explorer/index.md`
- `docs/sims/in-phase-quadrature-explorer/metadata.json`
- `docs/sims/in-phase-quadrature-explorer/in-phase-quadrature-explorer.png`
