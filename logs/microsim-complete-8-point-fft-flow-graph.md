# MicroSim Generation Log: Complete 8-Point FFT Flow Graph

**Sim ID:** `complete-8-point-fft-flow-graph`
**Chapter:** 12 — Building the FFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/complete-8-point-fft-flow-graph.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, distinguish
- **Learning Objective:** Let students examine the complete 3-stage,
  12-butterfly data flow graph of an 8-point FFT and distinguish how butterfly
  pairings change shape from stage to stage even though every stage performs
  exactly four butterflies.
- **Recommended Pattern:** Dense static diagram with click-triggered isolation.
- **Specification Alignment:** Aligned.
- **Rationale:** The spec's reasoning is the right one — a full flow graph is
  visually dense, and the analytical work is comparing one relationship against
  another. Three separate highlight modes (butterfly, stage, output trace) let
  the learner isolate exactly the comparison they are making.

## Routing Decision

Keywords "flow graph", "butterflies", "clickable highlighting", "twiddle labels"
→ `references/p5-guide.md`. This is a fixed-geometry technical diagram with
custom hit regions, not a node-link graph a layout engine would help with.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + stage headers + 8 rows x 27px + info panel | 430 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 430 + 45 | 475 |
| iframe height | canvasHeight + 2 | 477 |

Four node columns (input, after stage 1, after stage 2, output) with 8 rows each;
column x positions derived from the live width.

## Implementation Notes

- The topology is **generated**, not hard-coded. `buildStages()` derives the
  pairings and twiddle exponents from the standard radix-2 recurrence: group size
  `m = 2^(s+1)`, span `m/2`, twiddle exponent `j·N/m`. The spec suggested
  hard-coding "since it is a fixed, well-known structure", but deriving it means
  the diagram cannot disagree with the algorithm, and the span/count relationship
  the sim is teaching is visibly a consequence of the formula.
- Output tracing walks **backwards** through the stages, accumulating
  contributing rows at each level. It correctly shows that all eight inputs
  reach every output, which is the reassurance that the FFT computes the same
  thing as the DFT.
- When any highlight is active, non-highlighted edges are drawn in a pale gray
  rather than hidden, so the isolated relationship reads against the full
  structure rather than floating in space.
- Butterfly hit-testing uses the band between two columns spanning the
  butterfly's two rows, which stays accurate at every container width because it
  is computed from the same `geom` used for drawing.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 12 embed corrected to 477 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `complete-8-point-fft-flow-graph.png` captured at 477px |

Topology verified against the standard radix-2 DIT graph: stage 1 pairs
(0,1)(2,3)(4,5)(6,7) all with W0; stage 2 pairs (0,2)(1,3)(4,6)(5,7) with W0 and
W2; stage 3 pairs (0,4)(1,5)(2,6)(3,7) with W0, W1, W2, W3. Inputs read
x[0], x[4], x[2], x[6], x[1], x[5], x[3], x[7]. All correct.

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **Adjustment — inconsistent twiddle labeling.** The original condition
   (`bf.k !== 0 || s === 2`) suppressed W0 labels in stages 1 and 2 but showed
   them in stage 3, which reads as an omission rather than a choice. *Fix:* label
   all twelve butterflies. "Stage 1 is entirely W0" is itself worth seeing — it
   is why the first stage can be implemented multiply-free.

No other defects: all four columns, sixteen input/output labels, three stage
headers, and the info panel render without overlap. Cycle 2 re-captured and all
checklist items PASS.

## Files Written

- `docs/sims/complete-8-point-fft-flow-graph/main.html`
- `docs/sims/complete-8-point-fft-flow-graph/complete-8-point-fft-flow-graph.js`
- `docs/sims/complete-8-point-fft-flow-graph/index.md`
- `docs/sims/complete-8-point-fft-flow-graph/metadata.json`
- `docs/sims/complete-8-point-fft-flow-graph/complete-8-point-fft-flow-graph.png`
