# MicroSim Generation Log: Live Spectrum Display Bin Averaging

**Sim ID:** `live-spectrum-display-bin-averaging`
**Chapter:** 14 — Computing and Displaying a Real Spectrum
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/live-spectrum-display-bin-averaging.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, compare
- **Learning Objective:** Let students adjust the number of displayed spectrum
  bars relative to the number of underlying FFT bins and analyze how bin
  averaging trades frequency detail for a display that fits a small screen.
- **Recommended Pattern:** Synchronized dual view — constrained display above,
  full-resolution reference below.
- **Specification Alignment:** Aligned.
- **Rationale:** The tradeoff is only visible as a *difference between two
  views*. Showing the averaged display alone would look fine; showing the
  reference alone would look unconstrained. The shaded grouping bands are what
  connect them, making "these eight bins became that one bar" a spatial fact.

## Routing Decision

Keywords "simulated OLED", "bar spectrum", "reference plot", "shaded groupings" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + OLED (h = w/2) + reference (104) + readout | 420 |
| controlHeight | 2 rows x 35 + 10 | 80 |
| canvasHeight | 420 + 80 | 500 |
| iframe height | canvasHeight + 2 | 502 |
| sliderLeftMargin | "Displayed bars: 256" label + padding | 230 |

The OLED is drawn at a true 2:1 aspect with a bezel, so it reads as a device
rather than as another chart.

## Implementation Notes

- The bar slider runs 3-8 with `bars = 2^value`, so the bar count always divides
  256 evenly and no group is ragged.
- Example spectra are **deterministic**. The noise example uses a fixed-seed
  linear congruential generator rather than `Math.random()`, so the figure is
  reproducible across captures and across students.
- Tone examples include harmonics and realistic Lorentzian skirts rather than
  single-bin spikes, so averaging behaves the way it does on real data.
- Grouping bands alternate two opacities of the same blue, which keeps the
  grouping legible at 8 bars and unobtrusive at 256.
- At `displayBars === BINS` the readout switches to a green "no averaging" state
  and names the cost — 256 pixels of width — which is the constraint the whole
  sim exists to respect.

### Note on mean versus max

The spec calls for averaging, and averaging is implemented. It has a visible
consequence worth naming: a narrow peak spread across a mostly-empty group
averages down to roughly a quarter of its height. That is arithmetically correct
but can read as a bug, so the documentation explains it and contrasts it with the
max-hold rule many real analyzers use.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 14 embed corrected to 502 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `live-spectrum-display-bin-averaging.png` captured at 502px |

## Layout Review (Claude Vision)

Cycle 1: no failures. The OLED bezel and glass, the 32 averaged bars, the
full-resolution reference curve with its peak and harmonics, the alternating
grouping bands, the readout, and both controls all render cleanly. All checklist
items PASS on the first capture — no patch cycle needed.

## Files Written

- `docs/sims/live-spectrum-display-bin-averaging/main.html`
- `docs/sims/live-spectrum-display-bin-averaging/live-spectrum-display-bin-averaging.js`
- `docs/sims/live-spectrum-display-bin-averaging/index.md`
- `docs/sims/live-spectrum-display-bin-averaging/metadata.json`
- `docs/sims/live-spectrum-display-bin-averaging/live-spectrum-display-bin-averaging.png`
