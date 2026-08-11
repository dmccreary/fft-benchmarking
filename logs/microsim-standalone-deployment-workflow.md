# MicroSim Generation Log: Standalone Deployment Workflow

**Sim ID:** `standalone-deployment-workflow`
**Chapter:** 3 — Peripherals
**Library:** vis-network (standalone UMD)
**Date:** 2026-08-10
**Source spec:** `docs/sims/TODO/standalone-deployment-workflow.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Summarize, explain
- **Learning Objective:** Help students summarize the correct order of steps
  required to move from "code that only runs while Thonny is attached" to "code
  that runs standalone on power-up", and diagnose which step was skipped when
  standalone operation fails.
- **Recommended Pattern:** Ordered linear sequence, clickable for detail, with a
  failure-mode overlay. No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** The objective has two halves — recall the order, and reason
  backwards from a symptom. A numbered linear chain serves the first; the
  "Common failures" overlay serves the second by making the three silent failure
  points visible as a set rather than as isolated footnotes.

## Routing Decision

Keywords "sequence of nodes", "linear arrows", "clickable infobox", "hover
summary" → `references/vis-network-guide.md`. Same reasoning as the Thonny REPL
sim: rendered diagram formats cannot carry click-and-hover state.

## Layout Plan

| Value | Result |
|-------|--------|
| CANVAS_HEIGHT (from spec) | 500 |
| iframe height | 502 |
| Right panel width | 250px (190px under 640px container) |
| Nodes | 6, single vertical column |
| Edges | 5, straight |

Steps 1-4 (computer attached) are blue; steps 5-6 (standalone) are green, per the
spec's color scheme.

## Implementation Notes

- `style.css` was copied from `thonny-repl-workflow` and re-keyed for this sim's
  two-color legend, keeping the vis-network layout consistent across the book.
- `positionView()` is the same container-aware fit developed for the Thonny sim:
  it measures the live container, subtracts the title band, legend, and right
  panel, then derives both scale and camera position.
- `escapeHtml()` guards the command strings before they are written into the
  panel with `innerHTML`, since those strings contain shell redirection-looking
  characters.
- The failure overlay changes border color and weight rather than adding separate
  icon nodes, so the graph topology stays a clean six-step chain.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | 98/100, grade A |
| `sync-iframe-heights.py` | Chapter 3 embed corrected 500 → 502 |
| `test-iframe-heights.py` (Playwright) | PASS — all controls fully visible |
| Screenshot | `standalone-deployment-workflow.png` at 800x502 |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — crossing diagonal edges.** The initial 3-rows-of-2 snake layout put
   consecutive steps in opposite columns, so edges 2→3 and 4→5 ran as long
   diagonals across the middle of the diagram. The result read as a tangle, not
   as a sequence — directly against the spec's "simple linear arrows".
   *Fix:* switched to a single vertical column of six nodes with `smooth: false`
   for straight arrows. Labels were shortened to one line each
   ("2. Copy driver libraries to /lib" → "2. Copy drivers to /lib") so six nodes
   fit vertically at a legible scale, and `widthConstraint` was raised to 250.
2. **Adjustment — bottom crowding.** Node 6 sat about 10px off the canvas edge.
   *Fix:* declared `GRAPH_H` as 450 against an actual extent near 410, which
   makes the fit calculation reserve padding.

Cycle 2: re-captured at true height — clean top-to-bottom chain, straight arrows,
blue/green phase split obvious, controls clear. All checklist items PASS.

## Files Written

- `docs/sims/standalone-deployment-workflow/main.html`
- `docs/sims/standalone-deployment-workflow/style.css`
- `docs/sims/standalone-deployment-workflow/standalone-deployment-workflow.js`
- `docs/sims/standalone-deployment-workflow/index.md`
- `docs/sims/standalone-deployment-workflow/metadata.json`
- `docs/sims/standalone-deployment-workflow/standalone-deployment-workflow.png`
