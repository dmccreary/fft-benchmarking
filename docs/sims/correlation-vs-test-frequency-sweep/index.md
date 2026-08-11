---
title: Correlation vs Test Frequency Sweep
description: Sweep the test frequency and watch correlation spike exactly at the signal's true frequency and collapse to near zero everywhere else.
image: /sims/correlation-vs-test-frequency-sweep/correlation-vs-test-frequency-sweep.png
og:image: /sims/correlation-vs-test-frequency-sweep/correlation-vs-test-frequency-sweep.png
twitter:image: /sims/correlation-vs-test-frequency-sweep/correlation-vs-test-frequency-sweep.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Analyze
---

# Correlation vs Test Frequency Sweep

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Correlation vs Test Frequency Sweep MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/correlation-vs-test-frequency-sweep/main.html"
        height="452px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The previous MicroSim correlated a captured signal against **one** test
frequency. This one does it against 200 of them, sweeping from 100 Hz to
1000 Hz, and plots the result.

The shape that comes out is the entire justification for the DFT. There is one
sharp peak, and it sits exactly at the frequency actually present in the signal.
Everywhere else the correlation collapses toward zero.

Drag the slider and the peak moves with it. The detector was never told what
frequency to look for — it simply reports where the correlation is large.

## Reading the Ripples

The response is not perfectly zero away from the peak. Those small ripples are
**sidelobes**, and they are real, not a rendering artifact. They come from
correlating over a finite window: a 256-sample window cannot perfectly
distinguish one frequency from its immediate neighbors.

Two consequences worth carrying forward:

- The main peak has a **width**. Two tones closer together than that width blur
  into one. That is frequency resolution, and it is set by the window length.
- The sidelobes mean a very loud tone can leave visible traces at frequencies
  that contain nothing. That is spectral leakage, which Chapter 15 addresses with
  window functions.

The peak also does not always reach exactly 1.0. When the signal frequency falls
between two bin centers, the correlation at the nearest test point misses the
true maximum slightly. This is scalloping loss.

## How to Use

1. At the default 440 Hz, confirm the peak sits on the dashed marker.
2. Hover along the curve. Read off the correlation at 300 Hz and at 600 Hz, then
   compare both to the value at the peak.
3. Drag the **Captured signal frequency** slider slowly. The whole response
   slides with it, keeping its shape.
4. Move the signal to 150 Hz, near the left edge of the sweep. Notice that the
   peak shape is unchanged — this detector has no preferred region.
5. Look closely at the ripples between 500 and 1000 Hz. Estimate their height
   relative to the peak.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Multiply-and-sum correlation of two signals
- Reading a line chart with a tooltip

### Learning Objective

Students will be able to **examine** a plot of correlation magnitude against test
frequency and **distinguish** the sharp peak at the signal's true frequency from
the near-zero correlation at non-matching frequencies.

### Activities

1. **Locate the peak** (3 min): Students set three different signal frequencies
   and confirm the peak tracks each one.
2. **Quantify the contrast** (4 min): Using tooltips, students record the peak
   value and a typical off-peak value, and express the ratio.
3. **Notice the width** (4 min): Students estimate the peak's width in Hz and
   predict whether two tones 20 Hz apart could be told apart.

### Assessment

Ask: "If this sweep had used a 64-sample window instead of 256, what would happen
to the width of the peak, and what would that cost you?"

## Technical Details

- **Library:** Chart.js 4.4.0
- **Window:** 256 samples at 8 kHz
- **Sweep:** 200 points from 100 Hz to 1000 Hz, recomputed live on slider input
- **Correlation:** magnitude of the in-phase and quadrature components, so the
  result does not depend on the captured signal's phase

## Related Resources

- [Chapter 8: Correlation](../../chapters/08-correlation/index.md)

## References

1. [Chart.js Documentation](https://www.chartjs.org/docs/latest/) — the charting library used here.
2. [Spectral leakage](https://en.wikipedia.org/wiki/Spectral_leakage) — the origin of the sidelobe ripples.
3. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) — this sweep, done at every bin at once.
