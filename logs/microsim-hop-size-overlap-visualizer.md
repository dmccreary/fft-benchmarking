# MicroSim Generation Log: Hop Size Overlap Visualizer

**Sim ID:** `hop-size-overlap-visualizer`
**Chapter:** 16 — Building a Real-Time Spectrum Analyzer
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/hop-size-overlap-visualizer.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, compare
- **Learning Objective:** Let students adjust hop size relative to a fixed frame
  size and examine how much consecutive frames overlap, comparing the resulting
  update frequency against the extra recomputation cost.
- **Recommended Pattern:** Geometric comparison with a quantitative readout.
- **Specification Alignment:** Aligned.
- **Rationale:** The overlap is a picture and the cost is a number, and the
  learner has to hold both at once. Putting the staircase directly above a
  readout that states the cost multiplier in the same breath as the update rate
  is what makes the trade legible rather than abstract.

## Routing Decision

Keywords "timeline strip", "overlapping bars", "readout", "slider" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + stream strip + frame stack + readout | 340 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 340 + 80 | 420 |
| iframe height | canvasHeight + 2 | 422 |
| sliderLeftMargin | "Hop size: 512 samples" label + padding | 260 |

Frame size is displayed as a fixed label rather than a control, per the spec, so
hop size is the only variable.

## Implementation Notes

- The hop slider steps in units of 64, so every setting is a power-of-two
  divisor of the 512-sample frame and the overlap percentages come out to round
  numbers a student can check.
- The readout states the cost multiplier explicitly ("processed 4 times, so the
  FFT runs 4× as often") rather than leaving it to be inferred from the update
  rate. That framing is the point of the sim.
- **The frame stack is capped to what fits the panel, and says so.** At small hop
  sizes there are far more frames in the window than can be drawn; the caption
  reports "showing the first N of M frames" rather than silently truncating,
  which would understate the density the student is being asked to judge.
- The documentation adds the second motivation for overlap — that windowed frames
  discard their edge samples, so overlap recovers them — and connects 50% overlap
  with Hann to the constant-overlap-add condition.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 16 embed corrected to 422 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x422 with hop driven to 128 so the overlap is visible |

Arithmetic verified at hop = 128: overlap (512−128)/512 = 75%, updates
16000/128 = 125.0 per second, cost factor 512/128 = 4×. All match the readout.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **Adjustment — silent truncation of the frame stack.** Only the frames fitting
   the panel were drawn, with no indication that more existed. *Fix:* compute the
   true frame count for the window and state the truncation in the caption.

No other defects: stream strip, colored overlapping bars, readout panel, and both
control rows render cleanly. Cycle 2 re-captured and all checklist items PASS.

## Files Written

- `docs/sims/hop-size-overlap-visualizer/main.html`
- `docs/sims/hop-size-overlap-visualizer/hop-size-overlap-visualizer.js`
- `docs/sims/hop-size-overlap-visualizer/index.md`
- `docs/sims/hop-size-overlap-visualizer/metadata.json`
- `docs/sims/hop-size-overlap-visualizer/hop-size-overlap-visualizer.png`
