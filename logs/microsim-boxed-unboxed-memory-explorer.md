# MicroSim Generation Log: Boxed vs Unboxed Memory Explorer

**Sim ID:** `boxed-unboxed-memory-explorer`
**Chapter:** 19 — The Abstraction Ladder
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/boxed-unboxed-memory-explorer.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, compare
- **Learning Objective:** Explain why arithmetic on a boxed value requires more
  memory accesses than the same arithmetic unboxed, by comparing their memory
  layouts step by step.
- **Recommended Pattern:** Lockstep step-through with concrete data visible.
- **Specification Alignment:** Aligned — all four data-visibility stages plus the
  final tally comparison are implemented.
- **Rationale:** The two paths must advance **together** or the comparison
  becomes a memory test. Stepping both in lockstep means the learner sees, at
  each stage, what one path is doing and that the other is doing nothing.

## Routing Decision

Keywords "memory diagram", "pointer arrows", "step controls", "running tally" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + boxed panel (228) + unboxed panel (120) | 420 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 420 + 80 | 500 |
| iframe height | canvasHeight + 2 | 502 |

## Implementation Notes

- The **unboxed panel is deliberately shorter** than the boxed one. That
  asymmetry is content: there is genuinely less to draw, and equalizing the
  panels would have implied a symmetry the representations do not have.
- The refcount field never lights up, because this addition never touches it.
  Showing it greyed throughout is more honest than omitting it — it is part of
  the object's cost in memory even when it is not read.
- The result allocation appears only at the final stage, so the learner sees the
  allocation *arrive* rather than finding it pre-drawn.
- Operation counts are labeled illustrative in the documentation. The 7:1 ratio
  is defensible for the memory traffic shown, and the log notes that interpreter
  dispatch adds further cost on top, so the figure is conservative rather than
  inflated.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 19 embed corrected to 502 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x502 at the final stage, showing 7 versus 1 |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — result-allocation box printed over the note text.** The allocation
   box sat at panel y+148 while the stage note began at y+152, so at the final
   stage the two overlapped and both became unreadable. *Fix:* boxed panel height
   194 → 228, allocation box moved to y+150, and the unboxed panel shifted from
   258 to 292 to follow.

Cycle 2: re-captured — both panels, all six heap fields, the pointer arrows, the
allocation box, both stage notes, and both tallies render cleanly. All checklist
items PASS.

## Files Written

- `docs/sims/boxed-unboxed-memory-explorer/main.html`
- `docs/sims/boxed-unboxed-memory-explorer/boxed-unboxed-memory-explorer.js`
- `docs/sims/boxed-unboxed-memory-explorer/index.md`
- `docs/sims/boxed-unboxed-memory-explorer/metadata.json`
- `docs/sims/boxed-unboxed-memory-explorer/boxed-unboxed-memory-explorer.png`
