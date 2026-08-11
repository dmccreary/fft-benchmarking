# MicroSim Generation Log: DFT Validation Dashboard

**Sim ID:** `dft-validation-dashboard`
**Chapter:** 9 — Computing and Validating the DFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/dft-validation-dashboard.json`

## Instructional Design Check

- **Bloom Level:** Evaluate (L5)
- **Bloom Verb:** Judge, validate
- **Learning Objective:** Let students judge whether a DFT implementation passes
  validation by comparing a computed spectrum's peak against an expected peak
  within a chosen numerical tolerance, across a swept range of test frequencies.
- **Recommended Pattern:** Rubric/criterion tool with explicit feedback — the
  Evaluate-level pattern.
- **Specification Alignment:** Aligned.
- **Rationale:** Evaluate requires an actual judgment with a defensible answer,
  not a lookup. The design supplies the criterion (tolerance), the evidence
  (relative error per case), and — critically — a **failure pattern that is not
  self-explanatory**. The learner has to decide whether three FAILs indicate a
  broken implementation or a badly chosen test.

## Routing Decision

Keywords "bar chart", "summary table", "pass/fail dashboard", "custom layout" →
`references/p5-guide.md`. Chart.js was considered for the spectrum but rejected:
the sim needs a spectrum, a verdict banner, and a live table in one canvas with
shared state.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + spectrum (158) + verdict (34) + summary table | 480 |
| controlHeight | 3 rows x 35 + 10 | 115 |
| canvasHeight | 480 + 115 | 595 |
| iframe height | canvasHeight + 2 | 597 |
| sliderLeftMargin | "Test frequency: 250 Hz" label + padding | 250 |

## Implementation Notes

- **The test-frequency list is the pedagogy.** Eight frequencies sit exactly on
  bin centers (250, 500, 750, 1000, 1500, 2000, 2500, 3000 Hz at 250 Hz spacing)
  and three deliberately fall between them (375, 625, 1125 Hz). That produces a
  failure pattern with a discoverable cause rather than a random scatter, which
  is what makes the judgment task tractable.
- The DFT is a plain O(N²) double loop. It is the implementation under test, so
  writing it the obvious way is correct here — an optimized version would
  obscure what is being validated.
- Spectrum results are cached on the test frequency, so dragging the slider does
  not recompute a 64-point DFT every frame. The sweep table does recompute all
  eleven cases per frame; at N = 64 that is cheap and it keeps the table honest
  when the tolerance slider moves.
- The verdict banner reports expected bin, detected bin, detected frequency, and
  relative error together, so a student can see *why* a case failed rather than
  only that it did.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 9 embed corrected to 597 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x597 with the full sweep run |

Numbers verified against the capture: 375 Hz reports 33.333% error (detected bin
1 = 250 Hz, |250-375|/375), 625 Hz reports 20.000% (bin 2 = 500 Hz), and 1125 Hz
reports 11.111% (bin 4 = 1000 Hz). All three are exactly the arithmetic the
formula gives.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — summary table overflowed the drawing region.** With `rowH = 15` and
   eleven rows starting at y = 313, the last row ended at y = 474 and the totals
   line at y = 484, past `drawHeight = 470`. The totals line rendered underneath
   the control region and collided with the sweep button. *Fix:* `rowH` 15 → 13,
   `drawHeight` 470 → 480 (canvas 585 → 595), and the trailing explanatory note
   shortened to one unwrapped line placed beside the totals rather than below.

Cycle 2: re-captured — spectrum, verdict banner, all eleven table rows, totals
line, and all three controls visible with clearance. All checklist items PASS.

## Files Written

- `docs/sims/dft-validation-dashboard/main.html`
- `docs/sims/dft-validation-dashboard/dft-validation-dashboard.js`
- `docs/sims/dft-validation-dashboard/index.md`
- `docs/sims/dft-validation-dashboard/metadata.json`
- `docs/sims/dft-validation-dashboard/dft-validation-dashboard.png`
