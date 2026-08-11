---
title: Live Spectrum Display Bin Averaging
description: Trade FFT bins for display bars and watch frequency detail disappear into a spectrum that actually fits a 128-pixel OLED.
image: /sims/live-spectrum-display-bin-averaging/live-spectrum-display-bin-averaging.png
og:image: /sims/live-spectrum-display-bin-averaging/live-spectrum-display-bin-averaging.png
twitter:image: /sims/live-spectrum-display-bin-averaging/live-spectrum-display-bin-averaging.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Live Spectrum Display Bin Averaging

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Live Spectrum Display Bin Averaging MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/live-spectrum-display-bin-averaging/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A 256-point FFT gives you 129 useful bins. Your OLED is 128 pixels wide, and you
want gaps between the bars, so you have room for maybe 32.

Something has to give. The usual answer is **bin averaging**: group the bins into
as many buckets as you have bars, and display each bucket's average.

The top panel is the simulated OLED. The bottom panel is the full 256-bin
spectrum with shaded bands showing exactly which bins collapse into which bar.

## The Trade Is Real

Drag **Displayed bars** down to 8 and watch the shaded bands widen. Each bar now
represents 32 bins — a wide swath of frequency reduced to one number. Two tones
inside the same band become one bar, and you cannot tell from the display that
there were ever two.

Push it all the way to 256 and the averaging disappears: one bin per bar, and the
OLED silhouette matches the reference curve exactly. It also needs 256 pixels of
width, which you do not have.

## Averaging Flattens Peaks

Look at the single-tone example. In the reference plot the peak reaches nearly
1.0. On the OLED at 32 bars it is much shorter.

That is not a bug. A narrow peak occupies one or two bins out of the eight being
averaged, so the mean lands at roughly a quarter of the peak's height. The energy
is real; the *average* over a mostly-empty band is genuinely low.

This is why many real spectrum displays use **maximum** rather than mean within
each group — max-hold preserves peak height at the cost of overstating how much
of the band is occupied. Neither is more correct. Averaging answers "how much
energy is in this band"; max answers "how loud is the loudest thing in it".

## How to Use

1. At the default 32 bars, compare the OLED silhouette against the reference.
   Note how the peak's height differs.
2. Press **Next simulated frame** to cycle through a single tone, a three-tone
   chord, and white noise. Which signal survives averaging best?
3. Drop to 8 bars. Can you still tell the chord has three components?
4. Raise to 256. Confirm the two panels now agree exactly.
5. Decide: for a tuner that needs to identify one dominant pitch, how few bars
   could you get away with?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12 minutes

### Prerequisites

- An FFT produces a magnitude per bin
- Bin width and frequency resolution

### Learning Objective

Students will be able to **examine** the relationship between display resolution
and underlying frequency detail, and **compare** how bin averaging affects
different signal shapes.

### Activities

1. **Signal comparison** (5 min): For each of the three example signals, students
   record the smallest bar count at which the signal is still recognizable.
2. **Explain the flattening** (4 min): Students explain why the peak is shorter
   on the OLED than in the reference.
3. **Mean versus max** (3 min): Students state which grouping rule they would
   choose for a tuner and which for a level meter.

### Assessment

Ask: "You have 129 useful bins and 32 display bars. Two tones fall 3 bins apart.
Can the display separate them? What if they fall 30 bins apart?"

## Related Resources

- [Chapter 14: Computing and Displaying a Real Spectrum](../../chapters/14-computing-and-displaying-a-real-spectrum/index.md)
- [DFT Frequency Bin Explorer](../dft-frequency-bin-explorer/index.md)

## References

1. [Spectrogram](https://en.wikipedia.org/wiki/Spectrogram) — the same binning tradeoff in a time-frequency display.
2. [Downsampling](https://en.wikipedia.org/wiki/Downsampling_(signal_processing)) — the general operation being performed on the bin axis.
