# MicroSim Generation Log: Periodic Assumption Edge Discontinuity

**Sim ID:** `periodic-assumption-edge-discontinuity`
**Chapter:** 15 — Windowing, Spectral Leakage, and Peak Detection
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/periodic-assumption-edge-discontinuity.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Let students interpret how the DFT's implicit
  periodic-repetition assumption produces an edge discontinuity when a frame does
  not contain a whole number of cycles, and explain why that causes leakage.
- **Recommended Pattern:** Cause-and-effect dual view, learner-paced.
- **Specification Alignment:** Aligned.
- **Rationale:** The objective is causal explanation, so cause (the boundary) and
  effect (the smeared spectrum) must be visible in the same frame and must change
  together under one control. That is exactly the layout.

## Routing Decision

Keywords "repeated frame copies", "boundary markers", "resulting spectrum" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + repeated frames (124) + spectrum (118) + verdict panel | 430 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 430 + 45 | 475 |
| iframe height | canvasHeight + 2 | 477 |
| sliderLeftMargin | Snap button + "Cycles per frame: 6.50" label | 352 |

## Implementation Notes

- The spectrum is a **live 64-point DFT** of the synthesized frame, recomputed
  whenever the cycle count changes. The leakage on screen is therefore the real
  transform's output, not a drawn approximation of what leakage looks like.
- The test signal carries a **π/4 starting phase**. This is not cosmetic — see
  the layout review below.
- The three frame copies are drawn as one continuous sweep with `nInFrame`
  wrapping modulo N, so the discontinuity appears because of the wrap rather than
  being drawn in deliberately.
- The verdict panel and the spectrum share a colour (green when whole, crimson
  when not), which ties cause and effect together at a glance.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 15 embed corrected to 477 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x477 at 6.5 cycles; the whole-cycle case verified separately |

Both states verified by driving the sim: at 7.00 cycles the joins show green
markers and the spectrum is a single bar at bin 7; at 6.50 cycles the boundary
jump reads 1.414 and the energy spreads over roughly a dozen bins.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — the edge jump always read 0.000.** `edgeJump()` compared
   `sampleAt(N)` against `sampleAt(0)`, which are identically equal for a signal
   defined as `sin(2π·cycles·n/N)` regardless of the cycle count. Worse, with a
   zero starting phase a half-integer cycle count genuinely lands on zero at both
   ends, so the mismatch was a *slope* break with no amplitude step — and the
   panel drew no visible jump while the spectrum smeared dramatically. The sim
   was showing a smeared spectrum with no visible cause, which is precisely the
   causal link it exists to establish.
   *Fix:* gave the signal a π/4 starting phase and computed the jump as
   `|sin(2π·cycles + φ) − sin(φ)|`. Integer cycle counts still give exactly zero;
   6.5 cycles now gives 1.414, and the red boundary segments are clearly drawn.
2. **FAIL — slider label overlapped the slider.** "Cycles per frame: 6.50" began
   at x = 172 and ran to roughly x = 352, under a slider starting at x = 250.
   *Fix:* `sliderLeftMargin` 250 → 352 with the label at x = 164.

Cycle 2: re-captured in both states — jump segments visible and correctly
measured, spectrum consistent, no overlaps. All checklist items PASS.

## Files Written

- `docs/sims/periodic-assumption-edge-discontinuity/main.html`
- `docs/sims/periodic-assumption-edge-discontinuity/periodic-assumption-edge-discontinuity.js`
- `docs/sims/periodic-assumption-edge-discontinuity/index.md`
- `docs/sims/periodic-assumption-edge-discontinuity/metadata.json`
- `docs/sims/periodic-assumption-edge-discontinuity/periodic-assumption-edge-discontinuity.png`
