# MicroSim Generation Log: I2S Protocol Timing Explorer

**Sim ID:** `i2s-protocol-timing-explorer`
**Chapter:** 5 — Capturing Real Audio
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/i2s-protocol-timing-explorer.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, distinguish
- **Learning Objective:** Let students step through an I2S transmission bit by
  bit and analyze how BCLK, WS, and SD relate in time, distinguishing which bits
  belong to the left channel versus the right.
- **Recommended Pattern:** Manual step-through with a playhead. Explicitly not
  continuous animation.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec's own reasoning is correct and matches the Bloom
  guidance: a continuously animated waveform moves faster than bit-to-channel
  correspondence can be inspected. Manual stepping lets the learner stop exactly
  on the WS transition, which is the one instant that carries the lesson. A Play
  control is still provided, but paused is the default.

## Routing Decision

Keywords "timing traces", "logic analyzer view", "square waves", "playhead" →
`references/p5-guide.md`. Three synchronized digital traces with per-bit hit
geometry and a movable playhead are custom drawing, not charting.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + 3 traces + bit values + readout panel | 350 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 350 + 80 | 430 |
| iframe height | canvasHeight + 2 | 432 |
| sliderLeftMargin | "Word length: 16-bit" label + padding | 190 |

Control inventory (5 total): four buttons on row 1, word-length slider on row 2.

## Implementation Notes

- All three traces derive their x-coordinates from a single `geom()` helper, so
  the shared time axis is structural rather than something to keep in sync by
  hand.
- WS is drawn as a **level held for the whole word**, not a pulse at the
  boundary. That is the misconception this sim targets, and the "WS flips here"
  annotation marks the single transition.
- SD bit values are printed under the trace only when `cell >= 13` px, so the
  24-bit view degrades to an unlabeled-but-legible trace at narrow widths instead
  of overprinting.
- The word-length control is a slider with `step: 8` over the range 16-24, giving
  exactly the two positions the spec calls for while remaining a slider.
- The readout implements the spec's four data-visibility stages: opening state,
  per-step bit and channel, new-word announcement at the boundary, and the fully
  assembled binary value with its unsigned decimal at the last bit of a word.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 5 embed corrected to 432 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `i2s-protocol-timing-explorer.png` captured at 432px |

## Layout Review (Claude Vision)

Cycle 1: no failures. All three traces render with correct edges, channel
shading spans the full trace stack, the playhead and its marker are clear of the
title, per-bit values are legible at 16-bit, and the readout panel and both
control rows are fully visible. All checklist items PASS on the first capture —
no patch cycle needed.

## Files Written

- `docs/sims/i2s-protocol-timing-explorer/main.html`
- `docs/sims/i2s-protocol-timing-explorer/i2s-protocol-timing-explorer.js`
- `docs/sims/i2s-protocol-timing-explorer/index.md`
- `docs/sims/i2s-protocol-timing-explorer/metadata.json`
- `docs/sims/i2s-protocol-timing-explorer/i2s-protocol-timing-explorer.png`
