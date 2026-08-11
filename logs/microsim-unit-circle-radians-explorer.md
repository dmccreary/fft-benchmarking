# MicroSim Generation Log: Unit Circle Radians Explorer

**Sim ID:** `unit-circle-radians-explorer`
**Chapter:** 7 — Complex Numbers and Wave Superposition
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/unit-circle-radians-explorer.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Interpret, explain
- **Learning Objective:** Let students interpret the relationship between a point
  rotating around the unit circle, its angle in radians, and the resulting sine
  and cosine waveforms traced out over time.
- **Recommended Pattern:** Synchronized dual view, driven by a slider, with an
  optional animation.
- **Specification Alignment:** Aligned.
- **Rationale:** The objective is connecting two representations of one object.
  Animation is permitted here — and useful — but the *default is paused with a
  draggable angle*, so a learner can stop at π/2 and read both views at the same
  instant. That inspectability is what the "interpret" verb requires.

## Routing Decision

Keywords "unit circle", "rotating point", "projections", "synchronized plot" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + circle (r up to 118) + angle readout | 380 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 380 + 80 | 460 |
| iframe height | canvasHeight + 2 | 462 |
| sliderLeftMargin | Play button + "Angle: 2.40 rad (138°)" label | 285 |

Circle center and radius, and the plot's left edge, are all derived from
`canvasWidth`, so the two panels keep their relationship on resize.

## Implementation Notes

- The wave plot's x-axis is fixed at 0 to 2π and the curves are drawn only up to
  the current angle. This is simpler and more stable than appending to growing
  arrays, and it means the landmark gridlines stay in fixed positions the learner
  can rely on.
- Landmark proximity uses `angularDistance()` with wraparound, so the marker at 0
  also lights up as the point completes a revolution.
- When playing, the slider is written back from the animation
  (`angleSlider.value(angle)`), so the control never disagrees with the display.
- The cosine curve is dashed and the sine solid, matching the dashed/solid
  convention used for the two projections on the circle.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 7 embed corrected to 462 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x462, driven to 2.40 rad so the curves are visibly grown |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — label struck through by its own projection line.** The "sin = 0.68"
   readout was drawn at `(cx - 8, py)` with `CENTER` vertical alignment, and the
   dashed horizontal projection runs along exactly that y, so the line crossed
   the glyphs. *Fix:* switched to `RIGHT, BOTTOM` alignment at `py - 5`, seating
   the label just above its line.
2. **FAIL — radius label sitting on the radius.** The "1" was offset by a fixed
   (-8, -4), which lands on the line at most angles. *Fix:* compute the radius's
   perpendicular unit vector and push the label 15px along it, so it clears the
   line at every angle rather than at some of them.

Cycle 2: re-captured — both labels clear, circle, projections, arc, plot, and
controls all legible. All checklist items PASS.

## Files Written

- `docs/sims/unit-circle-radians-explorer/main.html`
- `docs/sims/unit-circle-radians-explorer/unit-circle-radians-explorer.js`
- `docs/sims/unit-circle-radians-explorer/index.md`
- `docs/sims/unit-circle-radians-explorer/metadata.json`
- `docs/sims/unit-circle-radians-explorer/unit-circle-radians-explorer.png`
