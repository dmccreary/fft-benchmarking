# MicroSim Generation Log: Frequency To Musical Note Calculator

**Sim ID:** `frequency-to-musical-note-calculator`
**Chapter:** 15 — Windowing, Spectral Leakage, and Peak Detection
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/frequency-to-musical-note-calculator.json`

## Instructional Design Check

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** Calculate, demonstrate
- **Learning Objective:** Let students adjust a frequency value and calculate the
  nearest musical note name and octave, demonstrating the Hertz-to-note mapping
  anchored at A4 = 440 Hz.
- **Recommended Pattern:** Calculator with a familiar visual anchor.
- **Specification Alignment:** Aligned.
- **Rationale:** A keyboard is the representation the target audience already
  trusts, so it acts as an independent check on the formula rather than as
  decoration — a student who sees the wrong key light up will know immediately.

## Routing Decision

Keywords "piano keyboard strip", "highlighted key", "live readout" →
`references/p5-guide.md`.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + keyboard (118) + readout (112) | 340 |
| controlHeight | 1 row x 35 + 10 | 45 |
| canvasHeight | 340 + 45 | 385 |
| iframe height | canvasHeight + 2 | 387 |
| sliderLeftMargin | "Frequency: 440 Hz" label + padding | 210 |

Keyboard spans keys 28-63 (C3 to B5), three full octaves.

## Implementation Notes

- Key numbering follows the standard piano convention with key 1 = A0 and
  key 49 = A4, which is what the spec's formula assumes. `octaveOf()` uses
  `floor((k+8)/12)`, verified against C4 = key 40 → octave 4 and A4 = key 49 →
  octave 4.
- White keys are drawn first and black keys painted over them, which is the only
  order that produces a correct keyboard; black keys are offset by 0.3 of a white
  key width so they straddle the boundary as on a real instrument.
- The cents readout is color-graded — green under 5 cents, orange under 25, red
  beyond — because the *magnitude* of the error is what a tuner user acts on, not
  its sign.
- The documentation connects the cents requirement to bin spacing explicitly
  (5 cents at A4 is about 1.3 Hz against a 31 Hz bin), which is what motivates the
  parabolic interpolation sim that follows in the same chapter.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 15 embed corrected to 387 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `frequency-to-musical-note-calculator.png` captured at 387px |

Verified against the capture: 440 Hz maps to A4 with exact frequency 440.00 Hz
and +0.0 cents, and the A4 white key is the highlighted one.

## Layout Review (Claude Vision)

Cycle 1: no failures. The three-octave keyboard renders with correct white/black
key geometry, C markers on each octave, the matched key highlighted in gold, and
the full readout legible. All checklist items PASS on the first capture — no
patch cycle needed.

## Files Written

- `docs/sims/frequency-to-musical-note-calculator/main.html`
- `docs/sims/frequency-to-musical-note-calculator/frequency-to-musical-note-calculator.js`
- `docs/sims/frequency-to-musical-note-calculator/index.md`
- `docs/sims/frequency-to-musical-note-calculator/metadata.json`
- `docs/sims/frequency-to-musical-note-calculator/frequency-to-musical-note-calculator.png`
