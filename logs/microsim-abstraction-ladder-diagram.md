# MicroSim Generation Log: Abstraction Ladder Diagram

**Sim ID:** `abstraction-ladder-diagram`
**Chapter:** 19 — The Abstraction Ladder
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/abstraction-ladder-diagram.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Organize, differentiate
- **Learning Objective:** Organize the five approaches into a ranked ladder and
  differentiate what each rung gives up in exchange for speed.
- **Recommended Pattern:** Clickable ranked comparison.
- **Specification Alignment:** Aligned.
- **Rationale:** "Differentiate" needs the differences stated in parallel form.
  Every rung's panel has the same three fields — runner, value representation,
  what you give up — so comparing two rungs is reading the same three lines
  twice rather than reconciling differently-shaped descriptions.

## Routing Decision

Keywords "stacked rungs", "proportional bars", "clickable details panel" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + five rungs (56 pitch) + caption | 430 |
| controlHeight | 1 row x 30 + 10 | 40 |
| canvasHeight | 430 + 40 | 470 |
| iframe height | canvasHeight + 2 | 472 |

## Implementation Notes

- Each bar is drawn over a **full-width grey track**, so a short bar reads as "a
  small fraction of the baseline" rather than just "a small bar". Without the
  track, the ×0.07 assembly bar would carry no visual sense of what it is 7% of.
- The "illustrative, not measured" caveat is drawn on the canvas, not only in the
  documentation, because the bars invite being read as data.
- Hit-testing uses the **full track width**, not the coloured bar, so the
  assembly rung is as easy to click as the bytecode one.
- The value-representation field is included on every rung specifically so the
  boxed-to-unboxed boundary at `@viper` is discoverable by comparison — that
  boundary is the setup for the next MicroSim in the chapter.
- The `×0.28` style label flips inside/outside the bar depending on width, so it
  stays legible on the short rungs.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 19 embed corrected to 472 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `abstraction-ladder-diagram.png` captured at 472px |

## Layout Review (Claude Vision)

Cycle 1: no failures. All five rungs render with tracks, bars, names, and
ratio labels; the direction arrow and its rotated caption are clear; the details
panel shows all three fields untruncated. All checklist items PASS on the first
capture — no patch cycle needed.

## Files Written

- `docs/sims/abstraction-ladder-diagram/main.html`
- `docs/sims/abstraction-ladder-diagram/abstraction-ladder-diagram.js`
- `docs/sims/abstraction-ladder-diagram/index.md`
- `docs/sims/abstraction-ladder-diagram/metadata.json`
- `docs/sims/abstraction-ladder-diagram/abstraction-ladder-diagram.png`
