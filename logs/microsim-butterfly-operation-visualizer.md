# MicroSim Generation Log: Butterfly Operation Visualizer

**Sim ID:** `butterfly-operation-visualizer`
**Chapter:** 11 — From DFT to FFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/butterfly-operation-visualizer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students set values for a, b, and a twiddle factor
  W, then calculate and observe the two butterfly outputs, confirming that both
  derive from the single shared product W×b.
- **Recommended Pattern:** Calculator with a data-flow visualization.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec's rationale is precise: showing the single shared
  multiplication feeding both outputs answers "why is this efficient", not just
  "what is the answer". The animation exists solely to make *sharing* visible —
  two markers leave one node simultaneously — rather than to decorate.

## Routing Decision

Keywords "butterfly diagram", "numeric inputs", "live readout", "animated flow" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + butterfly diagram + calculation panel | 380 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 380 + 80 | 460 |
| iframe height | canvasHeight + 2 | 462 |

Four `createInput` fields on row 1 (a and b, real and imaginary) with their
`=`, `+`, and `i` separators drawn on the canvas between them; twiddle select and
Compute button on row 2. Using inputs rather than four sliders keeps the control
region at two rows instead of five.

## Implementation Notes

- `complexMultiply()` is written in the explicit four-multiply form the chapter
  uses, not with any algebraic shortcut, because the panel displays that exact
  expansion and the two must agree.
- The animation draws **two** markers leaving the multiply node in the same
  frame, one to each output. A single marker traversing one path and then the
  other would have implied sequential recomputation — the opposite of the point.
- The multiply node is drawn as one circle with two outgoing wires, so the
  topology itself says "computed once, used twice" even before the animation
  runs.
- `fmtComplex()` formats the sign into the separator (`1.71 − 1.62i` rather than
  `1.71 + -1.62i`), which matters because students are comparing these against
  hand calculations.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 11 embed corrected to 462 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `butterfly-operation-visualizer.png` captured at 462px |

Arithmetic verified by hand against the capture: with a = 1 + 0.5i, b = 2 − 1i,
W = W_8^1 = 0.707 − 0.707i, the product is 0.707 − 2.121i (panel: 0.71 − 2.12i),
output1 = 1.707 − 1.621i (panel: 1.71 − 1.62i), output2 = 0.293 + 2.621i
(panel: 0.29 + 2.62i). All correct.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — input value labels clipped off the left edge.** The a and b values
   are drawn right-aligned at `leftX - 18` with `leftX = 70`, so an 85px string
   began at roughly x = -33 and rendered as "0 + 0.50i" instead of
   "1.00 + 0.50i". *Fix:* `leftX` 70 → 112, giving the labels a full gutter.

Cycle 2: re-captured — both input values fully legible, wires and nodes clear,
panel arithmetic correct and unclipped, all controls visible. All checklist items
PASS.

## Files Written

- `docs/sims/butterfly-operation-visualizer/main.html`
- `docs/sims/butterfly-operation-visualizer/butterfly-operation-visualizer.js`
- `docs/sims/butterfly-operation-visualizer/index.md`
- `docs/sims/butterfly-operation-visualizer/metadata.json`
- `docs/sims/butterfly-operation-visualizer/butterfly-operation-visualizer.png`
