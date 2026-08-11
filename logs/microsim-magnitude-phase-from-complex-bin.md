# MicroSim Generation Log: Magnitude Phase From Complex Bin

**Sim ID:** `magnitude-phase-from-complex-bin`
**Chapter:** 14 — Computing and Displaying a Real Spectrum
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/magnitude-phase-from-complex-bin.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students adjust a complex bin's real and imaginary
  parts and calculate the resulting magnitude and phase, connecting the
  complex-plane point to both formulas simultaneously.
- **Recommended Pattern:** Live calculator with a directly manipulable geometric
  view.
- **Specification Alignment:** Aligned.
- **Rationale:** Both formulas are shown with their operands substituted
  (`√(36.0 + 64.0)`), not only their results, so the learner can follow the
  arithmetic rather than trust it.

## Routing Decision

Keywords "complex plane", "vector", "live readouts", "sliders" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + complex plane + readout panel | 380 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 380 + 80 | 460 |
| iframe height | canvasHeight + 2 | 462 |
| sliderLeftMargin | "Imaginary part (im): 8.0" label + padding | 200 |

## Implementation Notes

- Defaults are re = 6, im = 8, giving a magnitude of exactly 10.000 — a scaled
  3-4-5 triangle. A student's first hand-check therefore lands on a whole number,
  which builds confidence in the readout before they explore awkward values.
- The real and imaginary components are drawn as thick colored legs forming a
  right triangle with the vector as hypotenuse, so the Pythagorean structure of
  the magnitude formula is visible rather than merely asserted.
- Phase is computed with `Math.atan2(im, re)` and the documentation makes the
  atan-versus-atan2 distinction an explicit exercise, since substituting
  `atan(im/re)` is a genuine and common bug that silently breaks two quadrants.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 14 embed corrected to 462 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `magnitude-phase-from-complex-bin.png` captured at 462px |

Verified against the capture: re = 6.0, im = 8.0 gives magnitude 10.000 and
phase 0.927 rad = 53.1°, which matches atan2(8, 6) exactly.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — panel text overflowed its border.** The closing note ran from
   y = 314 to 360 while the panel ended at y = 352, so the last line crossed the
   rounded border. *Fix:* panel height 290 → 302.

Cycle 2: re-captured — grid, axes, component legs, phase arc, vector, and the
full readout all render inside their bounds. All checklist items PASS.

## Files Written

- `docs/sims/magnitude-phase-from-complex-bin/main.html`
- `docs/sims/magnitude-phase-from-complex-bin/magnitude-phase-from-complex-bin.js`
- `docs/sims/magnitude-phase-from-complex-bin/index.md`
- `docs/sims/magnitude-phase-from-complex-bin/metadata.json`
- `docs/sims/magnitude-phase-from-complex-bin/magnitude-phase-from-complex-bin.png`
