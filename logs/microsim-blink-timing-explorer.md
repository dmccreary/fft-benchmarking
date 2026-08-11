# MicroSim Generation Log: Blink Timing Explorer

**Sim ID:** `blink-timing-explorer`
**Chapter:** 1 — Hello World
**Library:** p5.js 1.11.10
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/blink-timing-explorer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Demonstrate, calculate
- **Learning Objective:** Let students manipulate the sleep-delay parameter and
  directly observe its effect on the LED pin's logic-high/logic-low timeline and
  blink frequency, connecting the `sleep()` argument to a physical rate they can
  predict.
- **Recommended Pattern:** Parameter exploration with a live strip chart, plus a
  single-step button for isolated transitions.
- **Specification Alignment:** Aligned.
- **Rationale:** Apply-level objectives call for a control the learner drives and
  a quantity they can predict before observing. The delay slider is the input,
  "Blinks per second" is the predictable output, and the square wave is the
  evidence connecting them. Continuous animation is appropriate here because the
  concept under study *is* a rate, not a static structure — but the sim still
  defaults to paused per MicroSim standards.

## Routing Decision

Keywords "square wave", "strip chart", "simulation", "real-time timing" →
`references/p5-guide.md` (p5.js). No charting library was needed since the trace
is a two-level square wave drawn from transition events rather than a dataset.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | strip chart + LED + readouts + code panel | 400 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 400 + 80 | 480 |
| iframe height | canvasHeight + 2 | 482 |
| sliderLeftMargin | "Sleep delay: 0.50 s" label width + padding | 180 |

Control inventory (4 total, within the 1-5 guideline):

| # | Type | Label | Row |
|---|------|-------|-----|
| 1 | Button | Run / Pause | 1 |
| 2 | Button | Toggle Once | 1 |
| 3 | Checkbox | Show code | 1 |
| 4 | Slider | Sleep delay (0.05-2.0 s, default 0.5) | 2 |

## Implementation Notes

- Timing is driven by `deltaTime` (real milliseconds), not the frame counter, so
  wave speed matches wall-clock seconds as the spec required.
- The waveform is stored as a list of transition events `{time, state}` rather
  than a per-pixel sample buffer. Events older than the 4-second window are
  purged, keeping one event before the window so the leading segment still draws.
- `Toggle Once` pauses automatic running, advances simulated time by 250 ms, then
  flips the pin once. The small time advance is what makes the new edge visible
  instead of pinning it to the right border.
- The readout uses `blinks per second = 1 / (2 x delay)` — the factor of two is
  the main misconception this sim targets.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 90/100, grade A (screenshot pending at time of run) |
| `sync-iframe-heights.py` | Chapter 1 embed corrected 500 → 482 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `blink-timing-explorer.png` captured at 482px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — opening trace collapsed to a single dot.** The initial event sat at
   `simTime = 0`, so the whole visible window mapped to the right edge.
   *Fix:* seed `simTime` and `lastToggleTime` at one full window (4000 ms) so the
   opening flat trace spans the entire chart.
2. **FAIL — sub-16px label text.** Gridline labels were 14px and the time-axis
   caption 13px, below the "readable from the back of the classroom" floor.
   *Fix:* gridline labels raised to 16px, caption to 15px; `chartLeft` moved
   120 → 130 to keep the wider labels clear of the plot.
3. **Adjustment — vertical spacing.** Chart rails widened (highY 110 → 100,
   lowY 270 → 285) to use the dead space, readouts and code panel repositioned so
   the panel fits inside `drawHeight` without colliding with the readouts.

Cycle 2: re-captured and re-reviewed — all checklist items PASS. No residual
defects.

## Files Written

- `docs/sims/blink-timing-explorer/main.html`
- `docs/sims/blink-timing-explorer/blink-timing-explorer.js`
- `docs/sims/blink-timing-explorer/index.md`
- `docs/sims/blink-timing-explorer/metadata.json`
- `docs/sims/blink-timing-explorer/blink-timing-explorer.png`
