# MicroSim Generation Log: Aliasing Demonstrator

**Sim ID:** `aliasing-demonstrator`
**Chapter:** 6 — Sampling, Quantization, and Aliasing
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/aliasing-demonstrator.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, distinguish
- **Learning Objective:** Let students adjust a true signal frequency against a
  sampling rate and analyze how, once the true frequency crosses Nyquist, the
  samples trace out a different, lower ghost frequency.
- **Recommended Pattern:** Parameter exploration with an unambiguous correct /
  incorrect state change.
- **Specification Alignment:** Aligned.
- **Rationale:** The misconception being repaired is that aliasing is a gradual
  loss of quality. A binary green-to-red flip at exactly f_s/2 makes the hardness
  of the boundary the most visible property of the sim.

## Routing Decision

Keywords "waveform plot", "sample dots", "reconstructed curve", "live sliders" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + plot + readout rows | 350 |
| controlHeight | 3 rows x 35 + 10 | 115 |
| canvasHeight | 350 + 115 | 465 |
| iframe height | canvasHeight + 2 | 467 |
| sliderLeftMargin | "Sampling rate: 16,000 Hz" label + padding | 235 |

The time window is defined as `SAMPLES_SHOWN / sampleRate`, so exactly 32 sample
instants are always on screen. Changing the sampling rate rescales the time axis
rather than changing the dot count, which keeps attention on frequency rather
than on dot density.

## Implementation Notes

- The reconstructed curve is drawn as a **smooth sinusoid at the signed folded
  frequency**, not as a polyline through the dots. Deriving it as
  `f_signed = f_true - round(f_true/f_s) * f_s` is exact: `sin(2*pi*f_signed*t)`
  provably passes through every sample instant, because the two differ only by
  whole cycles at each sample time. This is what makes the demonstration
  honest — the ghost curve is not an artist's impression, it is a signal
  genuinely indistinguishable from the true one given only these samples.
- The signed form also handles the below-Nyquist case with no special-casing:
  `round(f/f_s)` is 0 there, so the reconstruction reduces to the true signal and
  overlays it exactly.
- Sample instants are drawn with stems to the zero line so the dots read as
  measurements rather than as another curve.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 6 embed corrected to 467 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `aliasing-demonstrator.png` captured at 467px |

## Layout Review (Claude Vision)

Cycle 1: no layout failures in the default state.

Because the aliased state is the entire point of this sim and does not appear in
the default capture, a second Playwright render was taken with the frequency
slider driven to 15,000 Hz. It confirms the intended behavior: the true curve
becomes visibly dense, the red dashed reconstruction traces a slow 1 kHz ghost,
every sample dot lies on both curves simultaneously, and the readout reads
"Apparent frequency: 1,000 Hz — ALIASED" in red. The folding arithmetic checks
out by hand as well: round(15000/16000) = 1, so f_signed = -1000 and the apparent
frequency is 1 kHz.

All checklist items PASS in both states — no patch cycle needed.

## Files Written

- `docs/sims/aliasing-demonstrator/main.html`
- `docs/sims/aliasing-demonstrator/aliasing-demonstrator.js`
- `docs/sims/aliasing-demonstrator/index.md`
- `docs/sims/aliasing-demonstrator/metadata.json`
- `docs/sims/aliasing-demonstrator/aliasing-demonstrator.png`
