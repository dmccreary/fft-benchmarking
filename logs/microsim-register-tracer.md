# MicroSim Generation Log: Register Tracer

**Sim ID:** `register-tracer`
**Chapter:** 21 — Your First Assembly Function
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/register-tracer.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Interpret, trace
- **Learning Objective:** Interpret a short assembly loop by tracing register
  contents and status flags one instruction at a time.
- **Recommended Pattern:** Step-through with visible concrete state at every
  stage — the spec is explicit that continuous animation is wrong here.
- **Specification Alignment:** Aligned; all the spec's data-visibility stages are
  implemented.
- **Rationale:** The mental model being built is "instruction executes, state
  changes". That requires the learner to control the clock, so Step is the
  primary control and Run is secondary.

## Routing Decision

Keywords "source listing", "current-instruction indicator", "register panel",
"flag lamp" → `references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + 6-line listing (34 pitch) + action panel + state panel | 360 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 360 + 80 | 440 |
| iframe height | canvasHeight + 2 | 442 |

## Implementation Notes

- **This is an interpreter, not a script.** `step()` dispatches on the
  instruction text and mutates `pc`, `r0`, and `zFlag`. The branch is a real
  conditional on the flag, so the loop runs five times because the arithmetic
  says so, not because a step count was hard-coded.
- The label occupies a listing row and is executed as a no-op that only advances
  `pc`. Skipping it in the model would have hidden the fact that labels are
  addresses rather than instructions — which the spec's stage list calls for.
- The "Last action" panel explains each instruction **after** it executes,
  including the detail that CMP discards its result. That sentence is the
  sim's core content and it appears at the moment the learner needs it.
- Only the Z flag is modeled. Showing N, C, and V unused would have added four
  lamps of noise to a sim whose point is a single hand-off.
- MOV is modeled as not setting flags, matching the non-`S` form — so the learner
  sees the lamp stay dark through the first instruction and can ask why.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 21 embed corrected to 442 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x442 after MOV, label, SUB, CMP |

Trace verified against the capture: after four steps r0 = 4, Z = 0, the arrow
sits on BNE, and the action panel reads "CMP computed r0 − 0 = 4 and discarded
it, setting Z = 0" — correct on every count.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **Adjustment — excess empty space.** Content ended near y = 344 against a
   `drawHeight` of 420, leaving a large dead band above the controls. *Fix:*
   `drawHeight` 420 → 360 and canvas 500 → 440.

No defects: listing, current-instruction highlight, action panel, register
readout, and flag lamp all render cleanly. Cycle 2 re-captured and all checklist
items PASS.

## Files Written

- `docs/sims/register-tracer/main.html`
- `docs/sims/register-tracer/register-tracer.js`
- `docs/sims/register-tracer/index.md`
- `docs/sims/register-tracer/metadata.json`
- `docs/sims/register-tracer/register-tracer.png`
