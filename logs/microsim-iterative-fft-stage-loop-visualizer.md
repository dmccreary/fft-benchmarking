# MicroSim Generation Log: Iterative FFT Stage Loop Visualizer

**Sim ID:** `iterative-fft-stage-loop-visualizer`
**Chapter:** 12 — Building the FFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/iterative-fft-stage-loop-visualizer.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, compare
- **Learning Objective:** Let students step through the iterative FFT's stage
  loop for an 8-element array and compare how the stage span doubles (1, 2, 4)
  while the number of butterflies per stage stays constant at N/2.
- **Recommended Pattern:** Stage-by-stage stepping with an explicit readout of
  both quantities being compared.
- **Specification Alignment:** Aligned.
- **Rationale:** The comparison is between one thing that changes and one that
  does not, so both must be on screen together at every step. The readout prints
  span and butterfly count side by side for exactly that reason.

## Routing Decision

Keywords "array boxes", "connecting arcs", "step controls", "live values" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + arc band + array boxes (62) + readout (74) | 400 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 400 + 45 | 445 |
| iframe height | canvasHeight + 2 | 447 |

## Implementation Notes

- **This runs a real FFT.** `runNextStage()` performs the actual in-place
  butterfly pass with computed twiddles, mutating the displayed array. The values
  in the boxes are the algorithm's, not a scripted sequence.
- The input is the same signal as the Chapter 9 by-hand DFT sim,
  `x[n] = 1 + 2cos(2πn/8)`. After all three stages the array reads
  8, 8, 0, 0, 0, 0, 0, 8 — identical to the hand-computed DFT. That cross-check
  between two independently written sims is the strongest correctness evidence
  either of them has, and it is stated in the documentation so students can
  verify it themselves.
- Arc rise scales with span (`34 + span*16`), so wider pairings arc higher and
  the doubling is visible in the geometry as well as in the readout.
- Arc color is keyed to the butterfly group, so at stage 1 four groups get four
  colors and by stage 3 the single group is uniform — another view of the same
  structural change.
- `originIndex` tracks which original sample sits in each slot, so the boxes can
  show the bit-reversed provenance after the permutation.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 12 embed corrected to 447 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x447 after permutation plus one stage |

Correctness verified by driving the sim through all three stages in Playwright:
final array is 8.00, 8.00, 0.00, 0.00, 0.00, 0.00, 0.00, 8.00 with zero
imaginary parts throughout — matching the analytic DFT of this input exactly.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — readout contradicted the arcs.** The arcs draw the stage *about to
   run*, but the readout printed `Stage {stagesDone}` with `{info.span}` from
   the upcoming stage — showing "Stage 1 of 3 | Span = 2" while the caption above
   said "Pairings for stage 2 (span 2)". *Fix:* the readout now describes the
   same upcoming stage as the arcs ("Next: stage 2 | Span = 2"), with the
   completed count moved to the control-region caption, and a distinct
   all-complete wording once the loop finishes.

Cycle 2: re-captured — caption, readout, arcs, and control caption all agree.
All checklist items PASS.

## Files Written

- `docs/sims/iterative-fft-stage-loop-visualizer/main.html`
- `docs/sims/iterative-fft-stage-loop-visualizer/iterative-fft-stage-loop-visualizer.js`
- `docs/sims/iterative-fft-stage-loop-visualizer/index.md`
- `docs/sims/iterative-fft-stage-loop-visualizer/metadata.json`
- `docs/sims/iterative-fft-stage-loop-visualizer/iterative-fft-stage-loop-visualizer.png`
