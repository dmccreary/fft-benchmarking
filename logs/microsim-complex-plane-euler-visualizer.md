# MicroSim Generation Log: Complex Plane Euler Visualizer

**Sim ID:** `complex-plane-euler-visualizer`
**Chapter:** 7 — Complex Numbers and Wave Superposition
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/complex-plane-euler-visualizer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Demonstrate, calculate
- **Learning Objective:** Let students manipulate the angle of a rotating complex
  number and demonstrate that its real and imaginary parts continuously match
  cos(theta) and sin(theta).
- **Recommended Pattern:** Parameter exploration with a live numeric readout the
  learner can check against their own arithmetic.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec is explicit that the point is verification rather than
  faith, so the readout substitutes actual numbers into the formula at three
  decimal places — enough precision that a student can confirm against a
  calculator instead of eyeballing a picture.

## Routing Decision

Keywords "complex plane", "vector", "projections", "live readout" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + plane (r up to 135) + margins | 400 |
| controlHeight | 1 row x 35 + 10 | 50 |
| canvasHeight | 400 + 50 | 450 |
| iframe height | canvasHeight + 2 | 452 |
| sliderLeftMargin | Play button + theta label | 250 |

Plane radius is derived from the width left over after the readout panel, so the
two never overlap as the container narrows.

## Implementation Notes

- The real and imaginary components are drawn twice each: once as thin dashed
  projection lines from the arrow tip, and once as thick colored segments lying
  **on** the axes. The thick segments are what make the components read as
  measurable lengths rather than as construction lines.
- The unit circle is drawn dashed and light, so it reads as the path the vector
  traces rather than as a competing object.
- The magnitude is computed as `sqrt(re*re + im*im)` from the same values that
  drive the drawing, not hard-coded to 1. It displays 1.00 because the identity
  holds, which is a stronger demonstration than printing a constant.
- Panel text is color-keyed to the axes: blue for real, red for imaginary,
  matching the segments on the plane.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 7 embed corrected to 452 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x452, driven to θ = 0.95 rad so both components are nonzero |

## Layout Review (Claude Vision)

Cycle 1: no failures. The vector, arrowhead, both projection styles, the angle
arc, the axis labels, and the full readout panel including the green magnitude
callout all render without overlap or clipping. All checklist items PASS on the
first capture — no patch cycle needed.

## Files Written

- `docs/sims/complex-plane-euler-visualizer/main.html`
- `docs/sims/complex-plane-euler-visualizer/complex-plane-euler-visualizer.js`
- `docs/sims/complex-plane-euler-visualizer/index.md`
- `docs/sims/complex-plane-euler-visualizer/metadata.json`
- `docs/sims/complex-plane-euler-visualizer/complex-plane-euler-visualizer.png`
