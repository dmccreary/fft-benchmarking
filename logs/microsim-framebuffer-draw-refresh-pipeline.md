# MicroSim Generation Log: Framebuffer Draw Refresh Pipeline

**Sim ID:** `framebuffer-draw-refresh-pipeline`
**Chapter:** 3 — Peripherals
**Library:** p5.js 1.11.10
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/framebuffer-draw-refresh-pipeline.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, summarize
- **Learning Objective:** Help students explain why changes to a framebuffer are
  invisible until `.show()` is called, and trace how a text-rendering call
  becomes lit pixels on the physical screen.
- **Recommended Pattern:** Step-through with Next control and concrete data
  visible at every stage. Explicitly **not** continuous animation.
- **Specification Alignment:** Aligned.
- **Rationale:** This is the textbook case from the Bloom guidance — an
  Understand-level "explain" objective where the guide calls for step-through and
  warns against continuous animation. The learner must be able to stop at the
  moment before `show()` and observe that the buffer and the glass disagree. A
  continuous animation would sweep straight past the one frame that matters.

## Routing Decision

Keywords "pipeline", "nodes", "step button", "pixel-grid mockups inside nodes" →
`references/p5-guide.md`. The spec explicitly asks for small 128x64 pixel grids
rendered *inside* two of the nodes, which rules out a pure graph library.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | caption + 2 node rows (112 each) + wrap gutter + info strip | 420 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 420 + 80 | 500 |
| iframe height | canvasHeight + 2 | 502 |

Six nodes are laid out as two rows of three, both reading left to right, with a
wrap-around connector carrying the flow from the end of row 1 down and back to
the start of row 2. A single row of six was rejected: at a 400px container each
node would be under 50px wide.

Control inventory (3 controls plus node clicks): Step and Reset on row 1, the
"draw without show()" checkbox on row 2.

## Implementation Notes

- The sim **opens at stage 2**, with "Hi" already in the framebuffer and the
  glass still black. The p5 guide asks that the default state demonstrate the
  concept without interaction, and here the default state *is* the misconception
  under repair.
- `screenHasHi` / `screenHasLine` are separate from the framebuffer state and are
  only assigned when `advanceStep()` reaches the `oled` stage. That separation is
  what makes the checkbox behave correctly: toggling it changes the buffer grid
  instantly and provably does not touch the glass.
- Step wraps from the last stage back to the first so a newly toggled line can be
  pushed through on a second pass without a full reset.
- Pixel grids are drawn from a hand-defined `HI_GLYPH` string-art array scaled
  into the node, so the same pattern renders identically in the buffer node and
  the screen node.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 100/100, grade A |
| `sync-iframe-heights.py` | Chapter 3 embed corrected 500 → 502 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `framebuffer-draw-refresh-pipeline.png` captured at 502px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — connector labels clipped by the node boxes.** Two-line edge labels
   were centered in a 16px gutter, so they rendered across the node edges and
   were cut to fragments ("es ple", "d o trig"). *Fix:* gutter widened 16 → 52,
   labels reduced to single short words ("bits", "trigger", "burst", "lights"),
   and the full sentences moved to a caption line with room to breathe.
2. **FAIL — washed-out default.** With `currentStep = -1` every node rendered
   dimmed and the sim looked broken on load. *Fix:* open at stage 2 (see above),
   which is both livelier and pedagogically the right frame.

Cycle 2 findings and fixes:

3. **FAIL — caption overlapped row 2.** Placed at y=330, inside the 240-352 node
   band. *Fix:* moved to the free strip at y=36 between title and row 1.
4. **FAIL — caption ran off the right edge.** The box form of p5's `text()` takes
   the box's **left** edge as `x`; passing `canvasWidth/2` with
   `textAlign(CENTER)` started the box at the midpoint so the text overflowed.
   *Fix:* pass `margin` as `x` with a full-width box and let `textAlign(CENTER)`
   center within it.

Cycle 3: re-captured and re-reviewed — caption centered, all six nodes and both
pixel grids clear, controls visible. All checklist items PASS.

## Files Written

- `docs/sims/framebuffer-draw-refresh-pipeline/main.html`
- `docs/sims/framebuffer-draw-refresh-pipeline/framebuffer-draw-refresh-pipeline.js`
- `docs/sims/framebuffer-draw-refresh-pipeline/index.md`
- `docs/sims/framebuffer-draw-refresh-pipeline/metadata.json`
- `docs/sims/framebuffer-draw-refresh-pipeline/framebuffer-draw-refresh-pipeline.png`
