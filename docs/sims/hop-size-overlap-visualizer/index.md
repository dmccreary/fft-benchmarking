---
title: Hop Size Overlap Visualizer
description: Shrink the hop between frames and watch the display update faster — and the FFT run proportionally more often.
image: /sims/hop-size-overlap-visualizer/hop-size-overlap-visualizer.png
og:image: /sims/hop-size-overlap-visualizer/hop-size-overlap-visualizer.png
twitter:image: /sims/hop-size-overlap-visualizer/hop-size-overlap-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Hop Size Overlap Visualizer

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the Hop Size Overlap Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/hop-size-overlap-visualizer/main.html"
        height="422px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

With no overlap, you capture 512 samples, transform them, capture the next 512,
transform those. At 16 kHz that gives 31.3 updates per second — a display that
refreshes every 32 ms.

If that feels sluggish, you can update more often without capturing faster: start
the next frame before the previous one has finished being consumed. The distance
between frame starts is the **hop size**, and when it is smaller than the frame
size, consecutive frames **overlap**.

$$\text{overlap} = \frac{N - H}{N} \qquad \text{updates/sec} = \frac{f_s}{H}$$

## Nothing Comes Free Here Either

Drag the hop down to 128 samples. Overlap becomes 75%, and updates jump from 31.3
to 125 per second — four times smoother.

Now read the second line of the readout. Every sample is being processed **four
times**, and the FFT runs four times as often. You did not get a smoother display
by being clever; you bought it with four times the compute.

That is the entire trade:

| Hop | Overlap | Updates/sec | FFT cost |
|-----|---------|-------------|----------|
| 512 | 0% | 31.3 | 1× |
| 256 | 50% | 62.5 | 2× |
| 128 | 75% | 125.0 | 4× |
| 64 | 87.5% | 250.0 | 8× |

On a Pico 2 where a 512-point FFT already eats a real fraction of the cycle
budget, going to 75% overlap may simply not fit. Check the arithmetic before
choosing a hop.

## Overlap Is Not Only About Smoothness

There is a second reason overlap exists, which matters once you are windowing.
A window tapers the frame edges to zero, so samples near a frame boundary
contribute almost nothing to that frame's result. With no overlap, those samples
are effectively discarded. Overlapping frames means every sample lands near the
middle of *some* frame, so nothing is thrown away.

The standard choice of 50% overlap with a Hann window comes from exactly this:
it is the smallest overlap at which the tapered frames sum back to a constant.

## How to Use

1. Start at hop = 512. The bars sit edge to edge with no overlap.
2. Drag to 256. The bars now overlap by half, and the readout shows 2× cost.
3. Continue to 128 and 64. Watch the staircase get denser and the cost multiplier
   climb.
4. At each setting, check that overlap %, updates/sec, and cost factor are
   consistent with each other.
5. Using the Cycle Budget Calculator's 40 ms deadline, decide the smallest hop
   your Pico could actually sustain.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- A frame is a fixed block of samples fed to the FFT
- Sampling rate and frames per second

### Learning Objective

Students will be able to **examine** how much consecutive frames overlap at a
given hop size and **compare** the resulting update rate against the extra
recomputation cost.

### Activities

1. **Fill the table** (4 min): Students record overlap, update rate, and cost
   factor at all four hop sizes.
2. **Find the relationship** (4 min): Students state the formula connecting hop
   size to cost factor.
3. **Budget check** (4 min): Given a measured FFT time, students determine the
   smallest sustainable hop.

### Assessment

Ask: "Your FFT plus draw takes 12 ms and you sample at 16 kHz with 512-sample
frames. What is the smallest hop size you can sustain, and what overlap does that
give?"

## Related Resources

- [Chapter 16: Building a Real-Time Spectrum Analyzer](../../chapters/16-building-a-real-time-spectrum-analyzer/index.md)
- [Window Function Comparison](../window-function-comparison/index.md)

## References

1. [Short-time Fourier transform](https://en.wikipedia.org/wiki/Short-time_Fourier_transform) — the framework in which hop size is defined.
2. [Overlap-add method](https://en.wikipedia.org/wiki/Overlap%E2%80%93add_method) — where the constant-overlap-add condition comes from.
