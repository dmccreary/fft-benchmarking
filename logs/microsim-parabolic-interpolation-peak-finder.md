# MicroSim Generation Log: Parabolic Interpolation Peak Finder

**Sim ID:** `parabolic-interpolation-peak-finder`
**Chapter:** 15 — Windowing, Spectral Leakage, and Peak Detection
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/parabolic-interpolation-peak-finder.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students adjust three neighboring bin magnitudes
  and calculate the resulting parabolic interpolation offset, observing how the
  estimated true peak shifts smoothly between bins.
- **Recommended Pattern:** Calculator whose output has an immediately visible
  geometric meaning.
- **Specification Alignment:** Aligned.
- **Rationale:** The formula is opaque on the page and obvious on the picture.
  Drawing the fitted parabola means the marker is not an illustration of the
  answer — it is literally the curve's vertex, so the geometry and the arithmetic
  are the same object.

## Routing Decision

Keywords "bar chart", "fitted parabola", "marker", "sliders" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + bars/parabola panel + formula readout | 320 |
| controlHeight | 3 rows x 35 + 10 | 115 |
| canvasHeight | 320 + 115 | 435 |
| iframe height | canvasHeight + 2 | 437 |
| sliderLeftMargin | "γ (bin above peak): 70" label + padding | 250 |

## Implementation Notes

- The parabola coefficients are derived analytically from the three samples
  (`a = (α+γ)/2 − β`, `b = (γ−α)/2`, `c = β`), and the vertex of that parabola is
  algebraically identical to the interpolation formula. The drawn curve and the
  computed offset therefore cannot disagree — they are two renderings of the same
  quadratic.
- The denominator is guarded (`|α − 2β + γ| < 1e-9 → 0`) so three collinear
  magnitudes do not produce a division by zero.
- The readout substitutes the actual operands into the formula
  (`0.5(60 − 70) / (60 − 200 + 70)`) so a student can follow the arithmetic to
  the printed result.
- The symmetric case is called out in the readout text when `α === γ`, since
  "symmetric neighbours must give exactly zero" is the standard implementation
  sanity check.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 15 embed corrected to 437 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `parabolic-interpolation-peak-finder.png` captured at 437px |

Arithmetic verified against the capture: α=60, β=100, γ=70 gives
0.5(−10)/(−70) = 0.0714 and an interpolated magnitude of 100.18, both matching
the displayed values.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — overlapping labels.** The "true peak ≈ bin k + 0.071" callout and the
   "β = 100" bar label were both drawn near the top of the tallest bar and
   printed over each other. *Fix:* bar value labels now render **inside** their
   bars in white when the bar is tall enough (falling back to above-bar black
   text for short bars), which frees the strip above the bars for the peak
   callout.

Cycle 2: re-captured — parabola, three bars with interior labels, peak marker and
callout, dashed centre reference, and the formula readout all clear. All
checklist items PASS.

## Files Written

- `docs/sims/parabolic-interpolation-peak-finder/main.html`
- `docs/sims/parabolic-interpolation-peak-finder/parabolic-interpolation-peak-finder.js`
- `docs/sims/parabolic-interpolation-peak-finder/index.md`
- `docs/sims/parabolic-interpolation-peak-finder/metadata.json`
- `docs/sims/parabolic-interpolation-peak-finder/parabolic-interpolation-peak-finder.png`
