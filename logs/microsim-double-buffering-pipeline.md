# MicroSim Generation Log: Double Buffering Pipeline

**Sim ID:** `double-buffering-pipeline`
**Chapter:** 16 — Building a Real-Time Spectrum Analyzer
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/double-buffering-pipeline.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Let students interpret how two buffers alternate roles
  between being filled by capture and being processed, explaining why this
  prevents the pipeline from pausing capture.
- **Recommended Pattern:** Steppable mechanism, learner-paced, with auto-play
  available but not the default.
- **Specification Alignment:** Aligned.
- **Rationale:** The claim "capture never pauses" is only convincing if it can be
  *checked*. The timeline strip exists so the learner can scan columns and verify
  the invariant themselves rather than accepting the caption.

## Routing Decision

Keywords "buffer boxes", "timeline strip", "swap animation", "step control" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + buffer boxes (116) + timeline + caption | 380 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 380 + 45 | 425 |
| iframe height | canvasHeight + 2 | 427 |

## Implementation Notes

- Role assignment is derived from parity (`cycle % 2 === 0`) rather than stored
  as mutable state, so the timeline's history and the current boxes are computed
  from the same rule and cannot drift apart.
- The timeline shows a **row per buffer** rather than a single strip, which is
  what makes the one-blue-per-column invariant scannable. A single-row
  representation would have shown the alternation without showing the guarantee.
- The swap arrows flash crimson for 500 ms after an advance, marking the event
  without requiring a continuous animation.
- The documentation names the constraint double buffering does *not* remove —
  processing must fit inside one capture period — and links it back to the cycle
  budget from Chapter 2.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 16 embed corrected to 427 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x427 after four advances, so the timeline has history |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — caption text truncated.** The explanatory paragraph was allotted 24px
   for three lines of 12px text and cut off mid-sentence at "...processing time
   would be time the". *Fix:* shortened the sentence to two lines and grew the
   caption panel from 52 to 58px with a 30px text box.

Cycle 2: re-captured — both buffer boxes, swap arrows, two-row timeline with
five cycles of history, legend, and full caption all render correctly. All
checklist items PASS.

## Files Written

- `docs/sims/double-buffering-pipeline/main.html`
- `docs/sims/double-buffering-pipeline/double-buffering-pipeline.js`
- `docs/sims/double-buffering-pipeline/index.md`
- `docs/sims/double-buffering-pipeline/metadata.json`
- `docs/sims/double-buffering-pipeline/double-buffering-pipeline.png`
