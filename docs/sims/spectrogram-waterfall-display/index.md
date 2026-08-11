---
title: Spectrogram Waterfall Display
description: A scrolling frequency-versus-time display where a rising whistle becomes a rising line and a clap becomes a vertical stripe.
image: /sims/spectrogram-waterfall-display/spectrogram-waterfall-display.png
og:image: /sims/spectrogram-waterfall-display/spectrogram-waterfall-display.png
twitter:image: /sims/spectrogram-waterfall-display/spectrogram-waterfall-display.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Spectrogram Waterfall Display

<iframe src="main.html" height="427px" width="100%" scrolling="no"></iframe>

[Run the Spectrogram Waterfall Display MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/spectrogram-waterfall-display/main.html"
        height="427px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A single spectrum is a snapshot. A **spectrogram** is what you get by stacking
those snapshots side by side as time passes, so you can see how the frequency
content changes.

Three axes on a two-dimensional screen:

- **Vertical** — frequency, low at the bottom
- **Horizontal** — time, newest at the right
- **Color** — magnitude, dark for quiet through blue, cyan, and yellow to white
  for loud

Each column is one processed frame. The display scrolls left as new frames
arrive, exactly as it would on a real analyzer.

## Learning to Read It

Every sound has a visual signature, and once you know a few you can read a
spectrogram at a glance:

| Sound | Signature |
|-------|-----------|
| Rising whistle | A bright line sloping upward |
| Falling whistle | A bright line sloping downward |
| Two-tone chord | Two parallel horizontal lines |
| Clap | A single vertical stripe spanning all frequencies |

The clap is the most instructive one. A sharp transient is not a frequency — it
is *all* frequencies at once, briefly. That is why it appears as a vertical
stripe rather than a horizontal line, and it is the time-frequency dual of the
tone.

## The Uncertainty Underneath

Look at how the whistle's line has thickness rather than being infinitely thin.
That thickness is your frequency resolution, set by the frame size.

Make frames longer and the line gets thinner — but each column now covers more
time, so a fast sweep smears horizontally instead. Make frames shorter and you
track time precisely but frequency blurs.

You cannot have both. This is the **time-frequency uncertainty principle**, and
a spectrogram is where it becomes something you can see rather than a theorem.

## How to Use

1. Select **Rising whistle** and press **Play**. Watch the bright trace climb.
2. Switch to **Falling whistle** and confirm the mirror image.
3. Select **Two-tone chord**. Two steady horizontal lines — the pitches are not
   changing, so the traces do not move.
4. Select **Silence then a clap**. Nothing, then one vertical stripe across the
   whole frequency range, fading over a few frames.
5. Compare the chord and the clap. One is narrow in frequency and wide in time;
   the other is the exact opposite.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- A spectrum is a magnitude per frequency bin
- Frames and hop size

### Learning Objective

Students will be able to **examine** a scrolling waterfall spectrogram and
**interpret** how a changing pitch appears as a moving colored trace over time.

### Activities

1. **Match signatures** (4 min): Students view all four examples and sketch each
   signature from memory afterward.
2. **Explain the clap** (4 min): Students explain why a transient appears as a
   vertical stripe rather than a horizontal line.
3. **Predict** (4 min): Students describe what a siren, a hand clap in a
   reverberant room, and a sustained hum would each look like.

### Assessment

Ask: "You see a spectrogram with a bright horizontal line at 440 Hz and faint
parallel lines at 880 and 1320 Hz. What is the sound, and what are the faint
lines?"

## Related Resources

- [Chapter 16: Building a Real-Time Spectrum Analyzer](../../chapters/16-building-a-real-time-spectrum-analyzer/index.md)
- [Harmonic Stack Synthesizer](../harmonic-stack-synthesizer/index.md)

## References

1. [Spectrogram](https://en.wikipedia.org/wiki/Spectrogram) — the display type and its conventions.
2. [Short-time Fourier transform](https://en.wikipedia.org/wiki/Short-time_Fourier_transform) — how the columns are produced.
3. [Time-frequency uncertainty](https://en.wikipedia.org/wiki/Uncertainty_principle#Signal_processing) — the resolution tradeoff visible in the trace thickness.
