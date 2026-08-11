# MicroSim Generation Log: Multiply and Sum Correlator

**Sim ID:** `multiply-and-sum-correlator`
**Chapter:** 8 — Correlation
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/multiply-and-sum-correlator.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students step through a multiply-and-sum
  correlation sample by sample and calculate how the running total behaves
  differently for a matching versus a non-matching test frequency.
- **Recommended Pattern:** Step-through calculator with every intermediate value
  on screen.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec's rationale is exactly right — the objective is
  defeated by a black-box final number. Each step therefore prints the actual
  `x[n] × t[n] = product` arithmetic, so the learner can verify a step by hand
  before trusting the total.

## Routing Decision

Keywords "step forward one sample", "aligned waveforms", "running bar",
"per-step popup" → `references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + signal (100) + test (100) + sum panel | 425 |
| controlHeight | 3 rows x 35 + 10 | 115 |
| canvasHeight | 425 + 115 | 540 |
| iframe height | canvasHeight + 2 | 542 |
| sliderLeftMargin | "Test frequency: 440 Hz" label + padding | 250 |

Control inventory (5): three buttons on row 1, the captured-signal select on
row 2, the test-frequency slider on row 3.

## Implementation Notes

- N = 32 samples at fs = 8 kHz gives a bin spacing of exactly 250 Hz. The
  select's offsets (+250, +500 Hz) are whole multiples of that spacing, so the
  mismatched cases land on **exact** orthogonality nulls rather than merely small
  values. This makes "near zero" an honest claim rather than an approximation the
  student has to squint at.
- Sample stems are colored once processed and gray while pending, so how far the
  accumulation has progressed is readable from the waveforms themselves, not only
  from the counter.
- The running-sum bar is zero-centered with a fixed ±N/2 range. A bar that
  auto-scaled would have hidden the difference between "climbing steadily to the
  maximum" and "wandering around nothing", which is the entire comparison.
- Both waveforms are drawn as a continuous curve *plus* discrete stems, so the
  distinction between the underlying signal and the samples actually multiplied
  stays visible.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 8 embed corrected to 542 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x542 after 12 steps, so a mid-accumulation state is shown |

## Layout Review (Claude Vision)

Cycle 1: no failures. Both waveform panels align on the sample axis, the current
sample marker spans both, the per-step arithmetic line reads correctly
(-0.613 × -0.613 = +0.376 for the matched case), the running-sum bar fills green
to the right of zero, and all five controls are visible. All checklist items PASS
on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/multiply-and-sum-correlator/main.html`
- `docs/sims/multiply-and-sum-correlator/multiply-and-sum-correlator.js`
- `docs/sims/multiply-and-sum-correlator/index.md`
- `docs/sims/multiply-and-sum-correlator/metadata.json`
- `docs/sims/multiply-and-sum-correlator/multiply-and-sum-correlator.png`
