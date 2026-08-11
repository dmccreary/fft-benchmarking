# MicroSim Generation Log: Eight Point DFT By Hand Calculator

**Sim ID:** `eight-point-dft-by-hand-calculator`
**Chapter:** 9 — Computing and Validating the DFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/eight-point-dft-by-hand-calculator.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Let students step through the full arithmetic of an
  8-point DFT bin by bin, seeing every multiplication and sum with concrete
  numbers.
- **Recommended Pattern:** Step-through worked example with total data
  visibility. No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** This is the canonical Understand-level case from the Bloom
  guidance — concrete data visible, learner-paced stepping, no motion. The spec
  also names a second purpose: producing a test vector students can validate
  their own code against, which is why exact values matter more than pretty ones.

## Routing Decision

Keywords "step through arithmetic", "bar chart with values", "results table",
"Next/Previous" → `references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + input bars (104) + arithmetic panel (128) + results table | 470 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 470 + 80 | 550 |
| iframe height | canvasHeight + 2 | 552 |

## Implementation Notes

- **The example signal was chosen for its arithmetic, not its shape.**
  `x[n] = 1 + 2cos(2πn/8)` yields X[0] = 8, X[1] = 8, X[7] = 8, and exact zeros
  elsewhere. A student hand-checking a bin gets whole numbers, and the result
  doubles as a validation test vector for their own implementation — which the
  spec calls out as the point.
- `fmt()` clamps magnitudes below 1e-9 to zero before formatting. Without it the
  supposedly-exact zeros render as `-0.000` or `0.000` inconsistently depending on
  floating-point rounding, which would undercut the "these are exactly zero"
  claim the whole example rests on.
- All eight bins are computed once in `setup()` and stored, so the results table
  is populated from the same code path that produces the per-bin detail. The
  table and the detail cannot disagree.
- The Nyquist bin (k = 4) and DC bin (k = 0) are labeled in both the arithmetic
  header and the results table.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 9 embed corrected to 552 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x552 on bin 1, the most informative bin |

Arithmetic spot check against the capture: bin 1 real terms are
3.000, 1.707, 0.000, 0.293, 1.000, 0.293, 0.000, 1.707 which sum to 8.000, and
the imaginary terms cancel to 0.000. Bins 0, 1, and 7 all read 8.000; bins 2-6
read exactly 0.000. This matches the analytic result.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — results table header inside the arithmetic panel.** With the detail
   expanded the panel runs to y = 284, while the table header was drawn at
   y = 276, printing "All eight bins" on top of the panel border. *Fix:* moved
   the table down (310 with detail, 244 without) and tightened `rowH` from 18 to
   16 so all eight rows still fit inside `drawHeight`.

Cycle 2: re-captured — header clear of the panel, all eight rows visible, current
row highlighted, DC and Nyquist tagged. All checklist items PASS.

## Files Written

- `docs/sims/eight-point-dft-by-hand-calculator/main.html`
- `docs/sims/eight-point-dft-by-hand-calculator/eight-point-dft-by-hand-calculator.js`
- `docs/sims/eight-point-dft-by-hand-calculator/index.md`
- `docs/sims/eight-point-dft-by-hand-calculator/metadata.json`
- `docs/sims/eight-point-dft-by-hand-calculator/eight-point-dft-by-hand-calculator.png`
