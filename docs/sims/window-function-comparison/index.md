---
title: Window Function Comparison
description: Compare rectangular, Hann, Hamming, and Blackman windows in both domains, and see exactly what each trades away.
image: /sims/window-function-comparison/window-function-comparison.png
og:image: /sims/window-function-comparison/window-function-comparison.png
twitter:image: /sims/window-function-comparison/window-function-comparison.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Window Function Comparison

<iframe src="main.html" height="471px" width="100%" scrolling="no"></iframe>

[Run the Window Function Comparison MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/window-function-comparison/main.html"
        height="471px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The previous MicroSim showed the problem: a frame that does not hold whole cycles
has a step at its boundary, and that step leaks across the spectrum.

A **window function** fixes the boundary instead of the frequency. Multiply your
samples by a shape that tapers to zero at both ends, and the periodic extension
joins at zero no matter what the signal was doing.

Nothing is free. Tapering the ends throws away real data near the frame edges,
and the cost shows up as a **wider main lobe**.

## The Trade, In Numbers

Click through the four windows in order and watch both numbers move together:

| Window | Main lobe width | Highest side lobe |
|--------|----------------|-------------------|
| Rectangular | 2.0 bins | -13.3 dB |
| Hann | 4.0 bins | -31.5 dB |
| Hamming | 4.0 bins | -41.7 dB |
| Blackman | 6.1 bins | -58.1 dB |

Every step down the table buys about 18-27 dB of side lobe suppression and pays
for it in main lobe width. These are not quoted from a table — the sim computes
them from the actual zero-padded transform of each window.

## Which One Should You Use?

It depends on what would ruin your measurement:

- **Two tones close together** → you need a narrow main lobe. Rectangular
  resolves best, at the cost of horrible leakage.
- **One loud tone masking a quiet one** → you need low side lobes. Blackman keeps
  the loud tone's skirts from burying the quiet one 50 dB down.
- **General-purpose** → Hann. It is the usual default because 31 dB of
  suppression for a 2× main lobe penalty is a good deal, and it is cheap to
  compute.

Notice that **Hamming and Hann have the same main lobe width** but Hamming's side
lobes are 10 dB lower. Hamming's coefficients are tuned to cancel the first side
lobe specifically — but look at its far side lobes, which fall off more slowly
than Hann's. There is no free lunch, only differently shaped bills.

## How to Use

1. Start with **Rectangular**. Note the narrow main lobe and the side lobes only
   13 dB down — barely suppressed at all.
2. Switch to **Hann**. The main lobe doubles; the side lobes drop by 18 dB.
3. Switch to **Hamming**. Same main lobe as Hann, side lobes 10 dB lower still.
   Compare their far side lobes at ±5 bins.
4. Switch to **Blackman**. The widest main lobe and the deepest side lobes.
5. Look at the time-domain shapes. The more aggressively a window tapers, the
   more it suppresses side lobes — and the less of your frame it actually uses.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- Spectral leakage and the periodic assumption
- Decibels

### Learning Objective

Students will be able to **compare** the time-domain shape and frequency-domain
response of four windows, and **distinguish** the specific tradeoff each makes.

### Activities

1. **Fill the table** (5 min): Students record both metrics for all four windows
   from the readout.
2. **Hann versus Hamming** (5 min): Students identify what is the same and what
   differs, including the far side lobe behavior.
3. **Choose for a purpose** (5 min): Given two scenarios — resolving two close
   tones, and finding a quiet tone beside a loud one — students choose a window
   and justify it with numbers from the table.

### Assessment

Ask: "You need to detect a component 45 dB below a nearby loud tone. Which
windows can possibly work, and which is the cheapest of those?"

## Related Resources

- [Chapter 15: Windowing, Spectral Leakage, and Peak Detection](../../chapters/15-windowing-spectral-leakage-and-peak-detection/index.md)
- [Periodic Assumption Edge Discontinuity](../periodic-assumption-edge-discontinuity/index.md)

## References

1. [Window function](https://en.wikipedia.org/wiki/Window_function) — definitions and comparison tables for these and many other windows.
2. [Harris, "On the Use of Windows for Harmonic Analysis"](https://web.mit.edu/xiphmont/Public/windows.pdf) — the definitive comparison paper.
3. [Spectral leakage](https://en.wikipedia.org/wiki/Spectral_leakage) — the problem windows exist to manage.
