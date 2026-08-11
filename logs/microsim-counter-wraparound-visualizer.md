# MicroSim Generation Log: Counter Wraparound Visualizer

**Sim ID:** `counter-wraparound-visualizer`
**Chapter:** 17 — Measuring Time
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/counter-wraparound-visualizer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Apply the masked-subtraction formula to compute elapsed
  cycles across a wraparound, and demonstrate why naive subtraction fails.
- **Recommended Pattern:** Side-by-side calculator showing the correct and the
  incorrect computation on the same inputs.
- **Specification Alignment:** Aligned.
- **Rationale:** Showing only the right formula would leave the failure abstract.
  Computing both from the same inputs, side by side, makes the difference a
  observation rather than a warning.

## Routing Decision

Keywords "circular dial", "draggable markers", "calculator panels" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + dial + two calculator panels (146) | 440 |
| controlHeight | 3 rows x 35 + 10 | 115 |
| canvasHeight | 440 + 115 | 555 |
| iframe height | canvasHeight + 2 | 557 |
| sliderLeftMargin | "Start value: 950" label + padding | 230 |

## Implementation Notes

- The demo counter is **10 bits (0-1023), not a round decimal like 0-1000**. This
  matters: masking only cancels a wraparound when the range is a power of two,
  and a 0-999 counter would need a modulo instead. Using 1024 makes `& 0x3FF` the
  exact structural analogue of `& 0xFFFFFFFF`, so the demo teaches the real
  reason rather than a coincidence.
- The green arc on the dial is drawn from the start angle through the *masked*
  elapsed count, so the picture and the correct formula are the same quantity.
  The arc cannot agree with the naive result, which is the point.
- The naive panel's note changes depending on whether a wrap occurred, so the
  no-wrap case is labeled "right by luck, not by design" rather than simply
  looking correct.
- The documentation covers the language-dependent part: C `uint32_t` subtraction
  wraps implicitly, Python's arbitrary-precision integers do not.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 17 embed corrected to 557 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `counter-wraparound-visualizer.png` captured at 557px |

Arithmetic verified: start 950, end 50 gives naive -900 and masked 124, and
1024 − 950 + 50 = 124 by hand.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — three labels collided at the top of the dial.** The "0 / 1024 ← wrap
   point" caption sat between the "start 950" and "end 50" marker callouts, all
   within a few pixels. *Fix:* replaced the caption with a plain "0" tick label
   matching the existing 256/512/768 quarter labels, which removes the collision
   and makes the dial's labeling consistent.
2. **FAIL — naive panel note truncated** mid-sentence at "...or, in unsigned
   arithmetic, an". *Fix:* panel height 138 → 146 and note box 32 → 44.
3. **Adjustment — bottom quarter label overlapped the panels.** Dial radius
   88 → 82, quarter-label offset 18 → 16, panel top 284 → 290.

Cycle 2: re-captured — dial, markers, arc, both panels with complete text, and
both sliders all clear. All checklist items PASS.

## Files Written

- `docs/sims/counter-wraparound-visualizer/main.html`
- `docs/sims/counter-wraparound-visualizer/counter-wraparound-visualizer.js`
- `docs/sims/counter-wraparound-visualizer/index.md`
- `docs/sims/counter-wraparound-visualizer/metadata.json`
- `docs/sims/counter-wraparound-visualizer/counter-wraparound-visualizer.png`
