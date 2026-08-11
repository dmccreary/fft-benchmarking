# MicroSim Generation Log: Harmonic Stack Synthesizer

**Sim ID:** `harmonic-stack-synthesizer`
**Chapter:** 4 — Waves
**Library:** p5.js 1.11.10
**Date:** 2026-08-11
**Source spec:** `docs/sims/TODO/harmonic-stack-synthesizer.json`

## Instructional Design Check

- **Bloom Level:** Analyze (L4)
- **Bloom Verb:** Examine, differentiate
- **Learning Objective:** Let students adjust the relative amplitude of overtones
  above a fixed fundamental and analyze how the combined waveform's shape
  (timbre) changes while its repetition rate (pitch) does not.
- **Recommended Pattern:** Parameter exploration plus preset-based comparison —
  the Analyze-level pattern of "comparison tools".
- **Specification Alignment:** Aligned.
- **Rationale:** Differentiating two co-varying properties requires holding one
  visibly constant while the other changes. The dashed per-period markers are the
  design's answer: they are the invariant the student checks after every slider
  move, which converts "pitch doesn't change" from an assertion into an
  observation.

## Routing Decision

Keywords "combined waveform plot", "sum of sines", "live redraw", "overlay" →
`references/p5-guide.md`. This is additive synthesis drawn per pixel column, not
a dataset, so no charting library applies.

## Layout Plan

| Value | Calculation | Result |
|-------|-------------|--------|
| drawHeight | title + subtitle + waveform plot + cycle labels + caption | 300 |
| controlHeight | 7 rows x 35 + 10 | 255 |
| canvasHeight | 300 + 255 | 555 |
| iframe height | canvasHeight + 2 | 557 |
| sliderLeftMargin | longest label "1st — 440 Hz: 100%" + padding | 220 |

Control inventory: five harmonic sliders (rows 1-5), four preset buttons (row 6),
overlay checkbox (row 7). This exceeds the 1-5 control guideline, but each slider
*is* the subject matter — the mixture is what the student manipulates — so
reducing the count would remove content rather than clutter.

### Deviation from spec

The spec calls for five **vertical** sliders. p5's `createSlider()` has no
vertical mode, and rotating it via `style()` conflicts with the guide's rule that
slider geometry be controlled only through `size()`. Five horizontal sliders in
the standard control region are used instead, each labeled with its harmonic
number, its actual frequency, and its percentage, and each tinted to match its
overlay curve.

## Implementation Notes

- The plot normalizes to `max|y|` over the visible window. A uniform scale factor
  preserves waveform shape exactly, and it keeps the trace filling the frame at
  any mix — important because a pure fundamental and a five-harmonic stack differ
  by more than 2x in peak amplitude.
- Preset buttons write through to both `sliders[i].value()` and the `amplitudes`
  array so the thumbs move with the waveform.
- Overlay curves use `color()` with `setAlpha(110)` so the summed trace stays
  dominant.
- Harmonic frequencies (440/880/1320/1760/2200 Hz) appear directly in the slider
  labels, making the integer-multiple relationship explicit at the point of
  interaction.

## Validation

| Step | Result |
|------|--------|
| `validate-sims.py` | see run below |
| `sync-iframe-heights.py` | Chapter 4 embed corrected to 557 |
| `test-iframe-heights.py` (Playwright) | PASS |
| Screenshot | `harmonic-stack-synthesizer.png` captured at 557px |

## Layout Review (Claude Vision)

Cycle 1 findings and fixes:

1. **FAIL — harmonic bar chart collided with the time caption.** A per-harmonic
   bar chart occupied y=272-312 while the axis caption was drawn at y=276; the
   caption ran straight through the bars and both became unreadable.
   *Fix:* removed the bar chart entirely rather than fighting for the space. Its
   only unique content was the harmonic frequencies, which now live in the slider
   labels where they sit next to the control that sets them. `drawHeight` came
   down 320 → 300 and the plot bottom moved 252 → 236, giving the cycle labels
   and caption clear room.

Cycle 2: re-captured and re-reviewed — waveform, dashed period markers, cycle
labels, caption, five color-matched sliders, presets, and checkbox all clear.
All checklist items PASS.

## Files Written

- `docs/sims/harmonic-stack-synthesizer/main.html`
- `docs/sims/harmonic-stack-synthesizer/harmonic-stack-synthesizer.js`
- `docs/sims/harmonic-stack-synthesizer/index.md`
- `docs/sims/harmonic-stack-synthesizer/metadata.json`
- `docs/sims/harmonic-stack-synthesizer/harmonic-stack-synthesizer.png`
