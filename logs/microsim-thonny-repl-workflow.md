# MicroSim Generation Log: Thonny REPL Workflow

**Sim ID:** `thonny-repl-workflow`
**Chapter:** 1 — Hello World
**Library:** vis-network (standalone UMD)
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/thonny-repl-workflow.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, summarize
- **Learning Objective:** Help students explain how the editor pane, the
  Shell/REPL, and the physical board relate to one another, and why "Run" behaves
  differently from typing directly into the Shell.
- **Recommended Pattern:** Static labeled flow graph with on-demand definitions
  and two contrasting highlighted paths. No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** For an Understand-level "explain" objective the guidance is
  explicit — concrete structure visible at rest, no continuous animation. The
  learner needs to *see* which boxes participate in each route, so the design
  makes both routes selectable and dims the one not in use. The contrast between
  the two highlighted states is the entire lesson.

## Routing Decision

Keywords "clickable nodes", "connections", "left-to-right flow", "flowchart with
labeled arrows" → `references/vis-network-guide.md`. Mermaid was considered and
rejected: the spec requires per-node hover definitions and click-to-highlight
path state, which needs a live graph API rather than a rendered diagram.

## Layout Plan

| Value | Result |
|-------|--------|
| CANVAS_HEIGHT (from spec) | 500 |
| iframe height | 502 |
| Right panel width | 250px (190px under 640px container) |
| Nodes | 7 |
| Edges | 7 |

Node groups and colors follow the spec: software (Editor Pane, Shell Panel) blue,
hardware (Pico 2 Board) orange, links and commands gray.

## Implementation Notes

- Mouse zoom and pan are disabled when running inside an iframe (`isInIframe()`)
  so the sim never captures the textbook page's scroll. Navigation buttons are
  always on, and full pan/zoom returns in fullscreen.
- Overlay elements (title, legend, right panel) are siblings of `#network`, never
  children — vis-network wipes its container's innerHTML on init.
- The vis-network CSS file is loaded alongside the UMD build, without which the
  navigation buttons render as invisible click targets.
- `highlightPath()` classifies each edge as `script`, `direct`, or `both`. The
  shared `both` segment — Shell → USB → Board → print() → Shell — stays lit under
  either selection, which is what makes "the REPL is the shared part" visible.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 93/100, grade A |
| `sync-iframe-heights.py` | Chapter 1 embed corrected 500 → 502 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `thonny-repl-workflow.png` at 800x502 |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — left column clipped off-canvas.** The template's fixed
   `moveTo(pos.x + 95, scale 0.78)` pan pushed the diagram past the left edge,
   cutting off "Editor Pane", "Run Button / F5", and "Type directly here".
   *Fix:* replaced the fixed pan with `positionView()`, which measures the live
   container, subtracts the title band, legend band, and right-panel width, then
   computes both scale and camera position from what is actually left over. Also
   bound to `resize` so it survives container changes.
2. **Adjustment — node span compressed.** Graph x-range narrowed from
   -330..310 to -300..250 so the fitted scale stays legible.

Tooling note discovered here: `bk-capture-screenshot` renders at
*target height + 200* and then crops the top. For p5.js sims that is harmless
because the canvas height is fixed, but for a `100vh` vis-network layout it
centers the graph against the wrong viewport height and the cropped image looks
wrong even when the sim is correct. Verified instead with an exact-viewport
Playwright capture at 800x502, which is the real embedded size.

Cycle 2: re-captured at true height — all nodes visible and well placed,
navigation buttons clear of content. All checklist items PASS.

## Files Written

- `docs/sims/thonny-repl-workflow/main.html`
- `docs/sims/thonny-repl-workflow/style.css`
- `docs/sims/thonny-repl-workflow/thonny-repl-workflow.js`
- `docs/sims/thonny-repl-workflow/index.md`
- `docs/sims/thonny-repl-workflow/metadata.json`
- `docs/sims/thonny-repl-workflow/thonny-repl-workflow.png`
