---
title: DFT Scaling Behavior Chart
description: Compare the DFT's quadratic growth against a linear algorithm across the sample sizes this course actually uses.
image: /sims/dft-scaling-behavior-chart/dft-scaling-behavior-chart.png
og:image: /sims/dft-scaling-behavior-chart/dft-scaling-behavior-chart.png
twitter:image: /sims/dft-scaling-behavior-chart/dft-scaling-behavior-chart.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Analyze
---

# DFT Scaling Behavior Chart

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the DFT Scaling Behavior Chart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/dft-scaling-behavior-chart/main.html"
        height="472px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The direct DFT computes N outputs, and each output requires a sum over all N
inputs. That is $N \times N$ operations — quadratic growth.

Quadratic sounds mild until you plot it against the sizes real audio work uses.
At the default marker of N = 512:

| Algorithm | Operations |
|-----------|-----------|
| DFT (N²) | 262,144 |
| Hypothetical linear (N) | 512 |

The blue line is not missing from the chart. It is there, pinned to the bottom
axis, because 512 next to 262,144 is visually indistinguishable from zero. That
flatness is the finding, not a rendering problem.

Turn on **Logarithmic Y-axis** to see both curves as real curves rather than one
curve and one flat line. On a log axis, quadratic growth appears as a line with
twice the slope of linear growth — which is exactly what the exponent means.

## The Multiplier Is Itself N

The ratio between the two curves at any N is:

$$\frac{N^2}{N} = N$$

So the penalty for using the direct DFT is not a fixed constant you can engineer
away. It is N itself, and it gets worse every time you lengthen the window. Drag
the marker and watch the ratio in the readout track the marker value exactly.

This is why the answer cannot be "write faster code." Going from 262,144
operations to something a microcontroller can do in a few milliseconds requires a
different algorithm, not a better implementation of this one. That algorithm is
the FFT, and it is the subject of the next chapter.

## How to Use

1. At the default marker of N = 512, read both values and the ratio.
2. Drag the marker to N = 64. Note the ratio is now 64. Drag to N = 1024 and
   confirm the ratio is 1024.
3. Toggle **Logarithmic Y-axis** on. Both curves become visible. Compare their
   slopes.
4. Hover along the orange curve to read exact operation counts at several N.
5. Estimate: if a Pico 2 manages roughly 10 million simple operations per second,
   how long does a 512-point direct DFT take? (About 26 ms — most of a 40 ms
   real-time budget, for one frame.)

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- The direct DFT is a double loop over N
- Reading a line chart

### Learning Objective

Students will be able to **examine** operation count as a function of N and
**compare** quadratic against linear growth at realistic audio window sizes.

### Activities

1. **Read the gap** (3 min): Students record both curves' values at three N
   settings and compute the ratio each time.
2. **The log view** (4 min): Students switch to a log axis and explain why the
   quadratic curve has twice the slope of the linear one.
3. **Connect to the budget** (3 min): Using the Cycle Budget Calculator's 40 ms
   deadline, students judge whether a 512-point direct DFT fits.

### Assessment

Ask: "Your DFT takes 26 ms at N = 512. A colleague suggests hand-optimizing the
inner loop for a 30% speedup. You need N = 1024. Does the optimization save you?"
(No — N = 1024 costs four times as much, roughly 104 ms; a 30% cut leaves 73 ms.)

## Technical Details

- **Library:** Chart.js 4.4.0
- **Series:** N² and N, sampled every 8 points from N = 8 to N = 1024
- **Y-axis:** togglable between linear and logarithmic
- **Annotations:** a fixed marker at N = 512 and a draggable marker via slider

## Related Resources

- [Chapter 10: Why the DFT Is Too Slow](../../chapters/10-why-the-dft-is-too-slow/index.md)

## References

1. [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation) — the growth-rate language used here.
2. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Computational_complexity) — the operation count of the direct evaluation.
3. [Chart.js Documentation](https://www.chartjs.org/docs/latest/) — the charting library.
