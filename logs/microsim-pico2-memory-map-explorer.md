# MicroSim Generation Log: Pico 2 Memory Map Explorer

**Sim ID:** `pico2-memory-map-explorer`
**Chapter:** 2 — Know Your Board
**Library:** p5.js 1.11.10
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/pico2-memory-map-explorer.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, classify
- **Learning Objective:** Help students classify a given address or piece of data
  as belonging to RAM, flash, or the memory-mapped register block, and explain
  why reading a register address behaves differently from reading ordinary RAM.
- **Recommended Pattern:** Clickable static diagram with concrete data visible at
  rest. No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** An Understand-level "classify" objective needs the categories
  visible simultaneously so they can be compared, and needs each category's
  defining property stated in words. The three-band bar gives the spatial model;
  the infobox supplies the definition, an example, and the volatility line that
  is the actual discriminator. The code-snippet buttons close the loop from
  abstract region back to a call students have already typed.

## Routing Decision

Keywords "vertical block diagram", "clickable bands", "infobox", "custom layout"
→ `references/p5-guide.md`. vis-network was rejected: there are no edges here,
only nested containment, and the spec calls for proportional bands recalculated
on resize rather than a node-link graph.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | address bar (342px) + title + padding | 430 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 430 + 80 | 510 |
| iframe height | canvasHeight + 2 | 512 |

Band heights: Flash 88, RAM 88, Registers header 42, four sub-blocks 31 each
(342 total). Bar width is `constrain(canvasWidth * 0.34, 140, 250)` so the
diagram stays proportional on resize; the infobox takes the remaining width.

Control inventory (4 total, within the 1-5 guideline): three code-snippet
buttons on row 1, Reset on row 2.

## Implementation Notes

- `computeLayout()` rebuilds every band rectangle each frame from the live
  canvas width, so `hitTest()` for clicks and hovers is always consistent with
  what is drawn. There is no separate stored geometry to fall out of sync.
- The info panel's height is derived from the last band's bottom edge rather than
  hard-coded, so the panel and the bar always end on the same line.
- The hover tooltip is clamped to the canvas (`canvasWidth - w - 8`,
  `drawHeight - 34`) so it never escapes the drawing region near the edges.
- Register sub-blocks report volatility as "Neither", which is the pedagogical
  point: the volatile/non-volatile question presupposes storage, and a register
  is not storage.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 100/100, grade A |
| `sync-iframe-heights.py` | Chapter 2 embed corrected 500 → 512 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `pico2-memory-map-explorer.png` captured at 512px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — the "Memory-Mapped Registers (hardware)" header band rendered with
   no label at all.** Its 30px height minus 6px padding left 24px for bold 15px
   text that wrapped to two lines, so p5's bounded `text()` drew nothing. This is
   the failure mode where a too-small box silently renders empty rather than
   overflowing. *Fix:* header height 30 → 42, font 15 → 14, and Flash/RAM
   trimmed 95 → 88 with sub-blocks 32 → 31 to keep the bar inside `drawHeight`.
2. **Adjustment — infobox whitespace.** Definition and example text boxes were
   over-allocated (110px / 60px); tightened to 96px / 48px so the volatility line
   sits closer to the text it qualifies.

Cycle 2: re-captured and re-reviewed — every band labeled, panel aligned to the
bar, controls clear. All checklist items PASS.

## Files Written

- `docs/sims/pico2-memory-map-explorer/main.html`
- `docs/sims/pico2-memory-map-explorer/pico2-memory-map-explorer.js`
- `docs/sims/pico2-memory-map-explorer/index.md`
- `docs/sims/pico2-memory-map-explorer/metadata.json`
- `docs/sims/pico2-memory-map-explorer/pico2-memory-map-explorer.png`
