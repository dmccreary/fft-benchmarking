---
title: Harmonic Stack Synthesizer
description: Mix overtones above a fixed 440 Hz fundamental and watch the waveform's shape change while its repetition rate stays put, separating timbre from pitch.
image: /sims/harmonic-stack-synthesizer/harmonic-stack-synthesizer.png
og:image: /sims/harmonic-stack-synthesizer/harmonic-stack-synthesizer.png
twitter:image: /sims/harmonic-stack-synthesizer/harmonic-stack-synthesizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Harmonic Stack Synthesizer

<iframe src="main.html" height="557px" width="100%" scrolling="no"></iframe>

[Run the Harmonic Stack Synthesizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/harmonic-stack-synthesizer/main.html"
        height="557px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A flute and a violin playing the same written note sound completely different,
yet a tuner reports the same pitch for both. This sim shows why.

The fundamental is pinned at 440 Hz. The four sliders above it add overtones at
exact integer multiples — 880, 1320, 1760, and 2200 Hz. As you raise them, the
combined waveform's **shape** changes dramatically. What does not change is the
dashed red spacing: the whole pattern still repeats every 1/440 second.

That is the separation you are meant to see:

- **Pitch** is the repetition rate of the pattern. It is set by the fundamental.
- **Timbre** is the shape of the pattern within one repetition. It is set by the
  overtone mixture.

This matters for the rest of the course because an FFT of any of these waveforms
puts a spike at 440 Hz and additional spikes at each active overtone. The
overtone mixture *is* the spectrum.

## How to Use

1. Start at the default pure tone: only the fundamental is on, and the wave is a
   plain sine. Note where the dashed cycle markers fall.
2. Raise the **2nd** slider to about 75%. The waveform develops a lopsided shape
   — but check the dashed markers. They have not moved.
3. Press **Violin**, then **Clarinet**. Compare the two shapes and the two slider
   patterns. The clarinet's near-empty even harmonics are why it sounds hollow.
4. Check **Show individual harmonics overlay** to see the component sine waves
   that are being summed. Count how many peaks the 3rd harmonic fits into one
   fundamental cycle. (Three.)
5. Return to **Pure tone** and confirm the shape resets while the period never
   budged through any of it.

## Presets

| Preset | 1st | 2nd | 3rd | 4th | 5th | Character |
|--------|-----|-----|-----|-----|-----|-----------|
| Flute | 100% | 20% | 5% | 0% | 0% | Nearly pure, breathy |
| Violin | 100% | 75% | 55% | 30% | 20% | Rich, many strong overtones |
| Clarinet | 100% | 5% | 70% | 5% | 45% | Hollow — odd harmonics dominate |
| Pure tone | 100% | 0% | 0% | 0% | 0% | A plain sine wave |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- A sine wave has an amplitude and a frequency
- Waves can be added together point by point

### Learning Objective

Students will be able to **examine** how the combined waveform's shape changes
with overtone mixture, and **differentiate** the role of the fundamental
frequency (pitch) from the role of the overtone mixture (timbre).

### Activities

1. **Move one overtone** (4 min): Students raise the 2nd harmonic alone and
   describe what changed and what stayed fixed, citing the cycle markers.
2. **Compare instruments** (6 min): Students record the slider patterns for
   violin and clarinet and articulate what distinguishes them.
3. **Predict the spectrum** (4 min): For the clarinet preset, students sketch
   where they expect spikes to appear in a frequency plot.

### Assessment

Ask: "Two waveforms have identical repetition periods but different shapes.
What is the same about them and what is different, in both musical and
signal-processing terms?"

## Related Resources

- [Chapter 4: Waves](../../chapters/04-waves/index.md)

## References

1. [Harmonic series (music)](https://en.wikipedia.org/wiki/Harmonic_series_(music)) — integer-multiple overtones above a fundamental.
2. [Timbre](https://en.wikipedia.org/wiki/Timbre) — why instruments differ at identical pitch.
3. [Fourier series](https://en.wikipedia.org/wiki/Fourier_series) — the formal statement that periodic waves decompose into harmonics.
