# MicroSim Generation Log: DFT Frequency Bin Explorer

**Sim ID:** `dft-frequency-bin-explorer`
**Chapter:** 9 — Computing and Validating the DFT
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/dft-frequency-bin-explorer.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students adjust N and the sampling rate and
  calculate the resulting bin width, frequency resolution, and each bin's center
  frequency, observing the resolution/bin-count tradeoff directly.
- **Recommended Pattern:** Live calculator with parameter sliders.
- **Specification Alignment:** Aligned.
- **Rationale:** The readout shows the division worked out with the actual
  operands (`16,000 / 16 = 1000.00 Hz`) rather than only its result, so a learner
  can check their own arithmetic against the same expression they were asked to
  evaluate.

## Routing Decision

Keywords "row of bin boxes", "clickable", "computed readout" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + bin row (62) + labels + readout panel (106) | 340 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 340 + 80 | 420 |
| iframe height | canvasHeight + 2 | 422 |
| sliderLeftMargin | "Sampling rate: 16,000 Hz" label + padding | 250 |

## Implementation Notes

- The N slider runs 3 to 9 and N is `2^value`, which gives exactly the powers of
  two the spec lists while keeping a single continuous control.
- **Rendering degrades deliberately.** Above roughly 22px per bin the row draws
  labeled boxes; below that it draws a comb of ticks plus a caption naming what
  is happening. The spec suggested scrolling for large N, but degrading to a comb
  is better here: at N = 512 the *unreadable density* is the lesson, and a
  scrollbar would hide it behind an interaction.
- Bin hit-testing is computed from the same `binBoxes` geometry used to draw, so
  clicks stay accurate at every N and width.
- The readout reports both N and `N/2 + 1` unique bins, which sets up the
  conjugate-symmetry sim later in the same chapter.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 9 embed corrected to 422 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | captured at 800x422 with N driven to 16 so the labeled-box view is shown |

## Layout Review (Claude Vision)

Cycle 1: no failures. All 16 boxes are labeled with index and center frequency,
the DC and Nyquist bins are distinctly colored and captioned, the readout
arithmetic is correct (16,000 / 16 = 1000.00 Hz, 9 unique bins), and both
sliders are fully visible. All checklist items PASS on the first capture — no
patch cycle needed.

## Files Written

- `docs/sims/dft-frequency-bin-explorer/main.html`
- `docs/sims/dft-frequency-bin-explorer/dft-frequency-bin-explorer.js`
- `docs/sims/dft-frequency-bin-explorer/index.md`
- `docs/sims/dft-frequency-bin-explorer/metadata.json`
- `docs/sims/dft-frequency-bin-explorer/dft-frequency-bin-explorer.png`
