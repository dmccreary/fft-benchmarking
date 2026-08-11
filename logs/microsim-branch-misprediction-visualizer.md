# MicroSim Build Log: Branch Misprediction Visualizer

- **MicroSim ID:** `branch-misprediction-visualizer`
- **Chapter:** 24 — Specialization and Branchless Code
- **Library:** p5.js 1.11.10
- **Bloom level:** Understand (explain, interpret)
- **Canvas height:** 489 (iframe 491px)
- **Date:** 2026-08-11

## Learning Objective

Explain why a predictable branch costs nearly nothing while an unpredictable
branch repeatedly stalls the pipeline, by stepping through both cases with
visible pipeline state.

## Design Decisions

**A real predictor, not a scripted one.** Rather than hard-coding which branches
"go wrong", the sim implements an actual one-bit predictor — guess that this
branch does what it did last time — and derives every correct/wrong verdict from
it. This matters pedagogically: students can run the same rule in their heads
and get the same answers, which is the difference between watching an animation
and understanding a mechanism.

**Chosen outcome sequences.** The predictable lane is `T T T T T T T T T N`: the
`BNE` at the bottom of a counted loop, wrong exactly once, on exit. The
unpredictable lane is `T T N N T N T T N N`, chosen so the one-bit predictor
misses exactly five of ten — the spec's "roughly half" made exact and
countable. Final totals: 2 wasted cycles versus 10.

**The flush is shown as discarded work, not as a stall.** On a mispredict the
Fetch and Decode boxes turn red, say FLUSHED, and name the instruction that was
thrown away — `discarded: VMUL.F32 s2, s0, s4`. Speculative work being
*destroyed* is the actual mechanism, and a generic "stall" graphic hides it.
Which instructions were speculatively fetched follows the guessed direction, so
a lane that guessed "taken" shows the loop-body instructions being discarded
while a lane that guessed "not taken" shows the fall-through path.

**Two cycles, stated everywhere.** Three-stage pipeline, two speculative stages,
two cycles lost per mispredict. The number appears in the subtitle, in each
status line, and in the tallies, because the whole argument is arithmetic and
the constant should never be a mystery.

**Extrapolation in the summary.** Ten branches is too few to feel expensive. The
completed-state summary scales the result to the 2,304 butterflies of a
512-point FFT — about 2,300 cycles thrown away per transform — which connects
this sim to `fft-stage-architecture` and to the chapter's actual decision.

## Bug Found and Fixed

**`textWidth()` measured under the wrong font.** The lane sub-caption was
positioned at `left + textWidth(lane.name) * 1.16 + 8`, but `textSize(12)` had
already been applied before the measurement while the name itself was drawn at
14px bold. The fudge factor was covering for the mismatch and still came up
short: the rendered output read `Predictable branch— BNE at the bottom...` with
no gap. Fixed by capturing `textWidth()` while the bold 14px face is still
active and dropping the fudge factor.

## Verification

- Predictor trace verified by hand for both lanes. Predictable: one mispredict
  (branch 10), 2 cycles. Unpredictable: mispredicts at branches 3, 5, 6, 7, 9 —
  five of ten, 10 cycles. The finished screenshot reports exactly these numbers.
- Speculative-path contents checked against the guess: at branch 3 the
  unpredictable lane guessed taken, and the discarded instructions shown are the
  loop-body pair, not the fall-through pair.
- Screenshots reviewed in three states: unstarted, mid-run at branch 3 (one lane
  clean, one flushing), and complete at branch 10.
- Playwright capture at exactly 800×491 with a pageerror listener; no errors.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
