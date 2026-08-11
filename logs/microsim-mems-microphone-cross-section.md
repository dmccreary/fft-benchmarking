# MicroSim Generation Log: MEMS Microphone Cross Section

**Sim ID:** `mems-microphone-cross-section`
**Chapter:** 5 — Capturing Real Audio
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/mems-microphone-cross-section.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, describe
- **Learning Objective:** Let students identify the internal parts of a MEMS
  microphone package and explain, in one sentence per part, what each part does
  to turn sound into a digital bitstream.
- **Recommended Pattern:** Clickable labeled diagram with progressive disclosure.
  No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** Nothing here is a live process the learner can drive — the
  content is structural and definitional. Click-to-reveal keeps the diagram
  uncluttered while letting each part carry a full sentence, which is exactly
  what an "explain in one sentence per part" objective needs.

## Routing Decision

Keywords "cross-section illustration", "clickable labeled parts", "infobox" →
`references/p5-guide.md`. The infographic-overlay guide was considered and
rejected: that generator overlays callouts on a supplied raster image, and this
spec explicitly calls for the cut-away to be drawn from simple shapes.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + package (210) + pins + caption | 430 |
| controlHeight | 1 row x 35 + 10 | 50 |
| canvasHeight | 430 + 50 | 480 |
| iframe height | canvasHeight + 2 | 482 |

Eight clickable parts: sound port, diaphragm, back plate, ASIC, and four pins.
Package width and pin spacing are derived from the live canvas width so the
cut-away rescales rather than clipping.

### Deviation from spec

The spec asks the layout to stack vertically below 600px. This version keeps the
diagram and panel side by side at all widths, with the panel clamped to a 150px
minimum and the package taking the remainder. Stacking would require a taller
`drawHeight` at every width, including the common case where there is no need
for it.

## Implementation Notes

- `computeLayout()` rebuilds all eight hit rectangles each frame from the current
  width, so click and hover targets can never drift from what is drawn.
- The back plate is rendered as seven separate segments rather than one bar,
  which is what makes its perforations visible — and those holes are the answer
  to one of the assessment questions.
- Flow arrows are drawn from the actual part rectangles rather than hard-coded
  points, so they follow the parts when the layout rescales.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 5 embed corrected to 482 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `mems-microphone-cross-section.png` captured at 482px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — overlapping captions.** "INMP441 package (cut away)" was drawn above
   the package at y = py-22 and the "Sound Port" part label at y = port.y-12;
   the two strings printed on top of each other. *Fix:* moved the package caption
   below the pin row.
2. **FAIL — mis-aimed arrow.** The ASIC-to-pins arrow terminated at
   `sd.x + sd.w/2 + 40`, landing in empty space beside the pin row rather than on
   it. *Fix:* retargeted to the SD pin's center, 8px above its top edge.
3. **Adjustment — floating sound port.** The port rectangle sat entirely above
   the package lid, reading as a detached object. *Fix:* moved down so it
   straddles the lid edge, which is what an opening in a lid looks like.

Cycle 2: re-captured and re-reviewed — no overlaps, arrows land on their targets,
all eight parts labeled and legible. All checklist items PASS.

## Files Written

- `docs/sims/mems-microphone-cross-section/main.html`
- `docs/sims/mems-microphone-cross-section/mems-microphone-cross-section.js`
- `docs/sims/mems-microphone-cross-section/index.md`
- `docs/sims/mems-microphone-cross-section/metadata.json`
- `docs/sims/mems-microphone-cross-section/mems-microphone-cross-section.png`
