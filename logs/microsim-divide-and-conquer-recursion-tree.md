# MicroSim Generation Log: Divide and Conquer Recursion Tree

**Sim ID:** `divide-and-conquer-recursion-tree`
**Chapter:** 11 — From DFT to FFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/divide-and-conquer-recursion-tree.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Let students interpret how an 8-sample DFT problem is
  recursively split by decimation in time into even- and odd-indexed halves, down
  to trivial size-1 problems.
- **Recommended Pattern:** Whole-structure diagram with click-triggered
  highlighting. Animation is optional and off by default.
- **Specification Alignment:** Aligned.
- **Rationale:** For "explain the recursive structure", seeing the entire tree at
  rest beats watching it build — a learner can trace any path at their own pace.
  The play animation is offered because the *order* of splitting is itself
  content, but the sim opens with the full tree visible.

## Routing Decision

Keywords "tree diagram", "clickable nodes", "path highlighting", "infobox" →
`references/p5-guide.md`. vis-network was considered but rejected: a strict
binary tree with computed spans is simpler to lay out directly than to coax a
force-free graph library into, and the click behavior needed is path-to-root
rather than neighbor selection.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + 4 levels (72/146/220/292) + info panel | 430 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 430 + 45 | 475 |
| iframe height | canvasHeight + 2 | 477 |

## Implementation Notes

- The tree is **generated**, not hard-coded: `buildTree()` recursively filters
  each subsequence by position parity. That means the leaf order (0, 4, 2, 6, 1,
  5, 3, 7) emerges from the algorithm rather than being typed in, so it is
  correct by construction — and it is the bit-reversal ordering the chapter needs
  students to notice.
- `layout()` gives each node a horizontal span and splits it in half for the
  children, so the tree stays balanced and proportional at any container width
  without per-level position tables.
- The play animation drives `revealLevel` from `deltaTime`, so the pacing is in
  real milliseconds rather than frames.
- Clicks are rejected for nodes above `revealLevel`, so a partially revealed tree
  cannot be clicked into an inconsistent state mid-animation.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 11 embed corrected to 477 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `divide-and-conquer-recursion-tree.png` captured at 477px |

Correctness check on the capture: level 1 splits into {0,2,4,6} and {1,3,5,7};
level 2 into {0,4},{2,6},{1,5},{3,7}; leaves read 0,4,2,6,1,5,3,7 — the correct
bit-reversed permutation for N = 8.

## Layout Review (Claude Vision)

Cycle 1: no failures. All fifteen nodes render with legible labels, every edge is
tagged even or odd, the four levels are color-distinguished, and the info panel
and both controls are fully visible. All checklist items PASS on the first
capture — no patch cycle needed.

## Files Written

- `docs/sims/divide-and-conquer-recursion-tree/main.html`
- `docs/sims/divide-and-conquer-recursion-tree/divide-and-conquer-recursion-tree.js`
- `docs/sims/divide-and-conquer-recursion-tree/index.md`
- `docs/sims/divide-and-conquer-recursion-tree/metadata.json`
- `docs/sims/divide-and-conquer-recursion-tree/divide-and-conquer-recursion-tree.png`
