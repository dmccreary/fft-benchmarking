# MicroSim Generation Log: DWT Register Explorer

**Sim ID:** `dwt-register-explorer`
**Chapter:** 17 — Measuring Time
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/dwt-register-explorer.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Explain how the DEMCR and DWT.CTRL enable bits gate
  access to CYCCNT, and interpret a 32-bit register as individually addressable
  bits.
- **Recommended Pattern:** Staged step-through with concrete data visible at
  every stage.
- **Specification Alignment:** Aligned — all four data-visibility stages from the
  spec are implemented.
- **Rationale:** `1 << 24` is opaque as syntax and obvious as a picture. Drawing
  the register as 32 squares and letting the learner click position 24 makes the
  shift operator's meaning structural rather than something to memorize.

## Routing Decision

Keywords "register bit grids", "clickable squares", "live binary readout",
"staged status" → `references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + three register rows (90 each) + status panel | 400 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 400 + 80 | 480 |
| iframe height | canvasHeight + 2 | 482 |

## Implementation Notes

- Bits are drawn MSB-left, so the visual position of bit 24 matches where a
  reader would point to it in a datasheet diagram.
- **The counter holds its value when disabled** rather than resetting, matching
  the real DWT.CYCCNT behaviour. Stage 4 of the spec exists to demonstrate this,
  and it is what makes gating a measurement region possible.
- A fourth state beyond the spec's four is handled: CYCCNTENA set *without*
  TRCENA. The status panel turns red and explains that on real hardware the write
  may not stick, since the peripheral is unpowered. Students will try this order,
  and leaving it unhandled would have shown a counter that appears enabled but
  does nothing with no explanation.
- Non-functional bits are greyed and carry a hover tooltip, so "reserved" is
  discoverable rather than merely implied by colour.
- Counter rate is driven by `deltaTime` and scaled by the speed slider, so the
  low bits flicker at a readable rate instead of at 150 MHz.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 17 embed corrected to 482 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x482 with both bits set and the counter running |

Binary readout verified against the capture: CYCCNT shows decimal 156 with green
bits at positions 2, 3, 4, and 7 — that is 4 + 8 + 16 + 128 = 156. Correct.

## Layout Review (Claude Vision)

Cycle 1: no failures. All three 32-bit rows render with legible bit values and
number rulers, both interactive bits are visually distinguished and annotated,
the decimal readout and running/frozen state are correct, and the status panel
and both controls are fully visible. All checklist items PASS on the first
capture — no patch cycle needed.

## Files Written

- `docs/sims/dwt-register-explorer/main.html`
- `docs/sims/dwt-register-explorer/dwt-register-explorer.js`
- `docs/sims/dwt-register-explorer/index.md`
- `docs/sims/dwt-register-explorer/metadata.json`
- `docs/sims/dwt-register-explorer/dwt-register-explorer.png`
