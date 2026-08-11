# MicroSim Generation Log: Roots of Unity Unit Circle

**Sim ID:** `roots-of-unity-unit-circle`
**Chapter:** 11 — From DFT to FFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/roots-of-unity-unit-circle.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students adjust N and calculate the resulting set of
  twiddle factors, observing that they always land as N evenly spaced points on
  the unit circle from Chapter 7.
- **Recommended Pattern:** Parameter exploration paired with an exact numeric
  table.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec is explicit that the picture alone is not enough —
  students should verify the formula, not just see a diagram. Hence the table
  with three-decimal values beside the circle, and a readout that writes the
  exponential form and its rectangular result side by side.

## Routing Decision

Keywords "unit circle", "points", "table", "clickable" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + circle + table + selected-root readout | 430 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 430 + 45 | 475 |
| iframe height | canvasHeight + 2 | 477 |

The N slider runs 2-5 with `N = 2^value`, giving exactly the four sizes the spec
lists.

## Implementation Notes

- The sign convention is the forward-transform one, `e^(-i*2*pi*k/N)`, so points
  advance **clockwise**. This is stated in a code comment and in the
  documentation, because a reversed sign is a real and common porting bug that
  leaves magnitudes correct while negating every phase.
- The table's row height and font size are derived from N
  (`constrain((h-26)/N, 9, 20)`), so all 32 rows still fit at the largest N
  rather than overflowing or requiring a scroll region.
- k-index labels around the circle are drawn for every point at N ≤ 8, and only
  for k = 0 and the selection at larger N, which keeps the ring readable at
  N = 32 without hiding the two points that matter most.
- `fmt()` clamps near-zero values so roots like `0.000 + 1.000i` do not display
  floating-point dust in a table students are asked to check by hand.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 11 embed corrected to 477 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `roots-of-unity-unit-circle.png` captured at 477px |

Values verified against the capture at N = 8: k=0 gives 1.000 + 0.000i, k=1 gives
0.707 − 0.707i, k=2 gives 0.000 − 1.000i, k=4 gives −1.000 − 0.000i — all correct
for the clockwise convention.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — bottom label and caption hidden behind the readout panel.** With
   `cy = 196` and `r = 128`, the circle's bottom sat at y = 324, putting the
   `k=2` label at y = 342 and the "k = 0 is always 1 + 0i" caption at y = 354 —
   both underneath the readout panel that starts at y = 336. *Fix:* radius cap
   128 → 112 and centre 196 → 182, clearing both.
2. **FAIL — axis label collision.** The "Im" label sat at `cx + 14` directly on
   top of the `k=6` label at the top of the circle. *Fix:* moved to `cx + 38`.

Cycle 2: re-captured — all eight k labels visible, the k=0 caption legible, axis
labels clear, table and readout correct. All checklist items PASS.

## Files Written

- `docs/sims/roots-of-unity-unit-circle/main.html`
- `docs/sims/roots-of-unity-unit-circle/roots-of-unity-unit-circle.js`
- `docs/sims/roots-of-unity-unit-circle/index.md`
- `docs/sims/roots-of-unity-unit-circle/metadata.json`
- `docs/sims/roots-of-unity-unit-circle/roots-of-unity-unit-circle.png`
