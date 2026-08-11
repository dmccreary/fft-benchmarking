# MicroSim Generation Log: Spectrum Symmetry Mirror

**Sim ID:** `spectrum-symmetry-mirror`
**Chapter:** 9 — Computing and Validating the DFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/spectrum-symmetry-mirror.json`

## Instructional Design Check

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** Explain, interpret
- **Learning Objective:** Let students interpret a full N-point DFT spectrum and
  explain why bins above the Nyquist bin mirror bins below it as complex
  conjugates for a real-valued input.
- **Recommended Pattern:** Clickable static diagram; click-triggered connectors.
  No animation.
- **Specification Alignment:** Aligned.
- **Rationale:** The relationship "bin k pairs with bin N-k" is index arithmetic
  that a student can compute but rarely *sees*. Drawing the arc converts it into
  a spatial fact, which is what an "interpret the structure" objective needs.

## Routing Decision

Keywords "row of bin boxes", "clickable", "connector arcs", "infobox" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + arc band + bin row (62) + region brackets + info panel | 380 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 380 + 45 | 425 |
| iframe height | canvasHeight + 2 | 427 |

N is fixed at 16 per the spec, independent of the N used elsewhere in the
chapter, because the pairing is easier to read at a size where every box can be
labeled.

## Implementation Notes

- `partnerOf(k)` returns `k` itself for bin 0 and bin N/2 rather than special-casing
  in the drawing code. That makes the "these two are their own mirror" case fall
  out of the same function that computes every other pairing, and the info panel
  simply branches on `partner === selectedBin`.
- Clicking a *gray* bin works exactly like clicking its blue partner, because the
  relation is symmetric. Handling only the blue side would have suggested a
  directionality the mathematics does not have.
- The default selection is bin 3, so the sim opens already showing a pair rather
  than an unexplained row of boxes.
- The unique-bin count `N/2 + 1` appears in both the control-region caption and
  the info panel text, computed rather than written, so a change to N stays
  consistent.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 9 embed corrected to 427 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `spectrum-symmetry-mirror.png` captured at 427px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **Adjustment — arc label sitting on the arc.** The "conjugate pair" caption was
   placed at `apex + 26`, which lands below the bezier's actual peak (near
   `apex + 14`), so the dashed curve ran through the text. *Fix:* moved to
   `apex + 8`, above the peak, in the empty band between the subtitle and the arc.

No other defects: all 16 bins labeled, DC and Nyquist captioned, region brackets
correct, info panel text accurate for the selected pair. Cycle 2 re-captured and
all checklist items PASS.

## Files Written

- `docs/sims/spectrum-symmetry-mirror/main.html`
- `docs/sims/spectrum-symmetry-mirror/spectrum-symmetry-mirror.js`
- `docs/sims/spectrum-symmetry-mirror/index.md`
- `docs/sims/spectrum-symmetry-mirror/metadata.json`
- `docs/sims/spectrum-symmetry-mirror/spectrum-symmetry-mirror.png`
