---
title: Periodic Assumption Edge Discontinuity
description: See what the DFT assumes happens outside your frame, and why a fractional cycle count smears one tone across many bins.
image: /sims/periodic-assumption-edge-discontinuity/periodic-assumption-edge-discontinuity.png
og:image: /sims/periodic-assumption-edge-discontinuity/periodic-assumption-edge-discontinuity.png
twitter:image: /sims/periodic-assumption-edge-discontinuity/periodic-assumption-edge-discontinuity.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Periodic Assumption Edge Discontinuity

<iframe src="main.html" height="477px" width="100%" scrolling="no"></iframe>

[Run the Periodic Assumption Edge Discontinuity MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/periodic-assumption-edge-discontinuity/main.html"
        height="477px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The DFT has an assumption baked into it that nobody tells you about: it treats
your captured frame as **one period of a signal that repeats forever**.

You captured 64 samples. The DFT behaves as though those 64 samples are followed
by the same 64 samples, again and again, in both directions. The top panel draws
that assumption out — three copies of your frame, laid end to end.

Now the question that decides everything: **do the copies join smoothly?**

## Whole Cycles Join, Fractions Do Not

Press **Snap to whole cycles**. At exactly 7 cycles per frame, the end of one
copy continues seamlessly into the start of the next. The green dots mark clean
joins, and the spectrum below is a single bar at bin 7. All the energy in one
bin, which is the correct answer.

Now drag to 6.5 cycles. The signal ends its frame mid-cycle, so the repeat
restarts at the wrong place. A red vertical jump of 1.414 appears at every
boundary — and the spectrum below smears across a dozen bins.

## The Leakage Is the Boundary's Fault

This is the part worth sitting with. **The signal did not change.** It is still
one pure sine wave. The only thing that changed is where the frame happened to
cut it.

But the DFT is not analyzing your sine wave. It is analyzing the *periodic
extension* of your frame — and that extension contains a sharp step every 64
samples. A step is not a sinusoid, and no single bin can represent it, so the
DFT spends energy across many bins reconstructing the discontinuity.

That smearing is **spectral leakage**. It is not noise, not a bug, and not a
property of your signal. It is what the transform must do to represent an edge
you accidentally created.

## Why This Motivates Windowing

You cannot generally arrange for whole cycles. You do not know the signal's
frequency in advance — finding it is the whole point — and a real signal has
many components that cannot all land on bin centers at once.

So instead of fixing the frequency, we fix the edges: taper the frame to zero at
both ends so that whatever the cycle count, the copies always join at zero. That
is a **window function**, and it is the subject of the next MicroSim.

## How to Use

1. Press **Snap to whole cycles**. Note the green joins and the single spectrum
   bar.
2. Nudge the slider by 0.05. Watch how quickly the clean single bar degrades.
3. Go to 6.5 cycles — the worst case, exactly halfway between bins. Note the jump
   size and how wide the smearing gets.
4. Try 7.05 cycles. A small mismatch still leaks, just less.
5. Trace one boundary in the top panel and follow the red segment. That vertical
   distance is what the spectrum is reacting to.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12 minutes

### Prerequisites

- The DFT operates on a finite frame of samples
- A spectrum is a magnitude per bin

### Learning Objective

Students will be able to **interpret** how the DFT's implicit periodic-repetition
assumption produces an edge discontinuity, and **explain** why that discontinuity
causes spectral leakage.

### Activities

1. **Find the clean case** (3 min): Students locate cycle counts producing a
   single-bin spectrum and state what they have in common.
2. **Worst case** (4 min): Students find the cycle count that leaks most and
   explain why halfway between bins is worst.
3. **Argue the cause** (5 min): Students explain, in their own words, why the
   leakage is a property of the frame boundary rather than of the signal.

### Assessment

Ask: "A colleague sees leakage and concludes the microphone is noisy. Give two
pieces of evidence from this sim that the leakage is not noise."

## Related Resources

- [Chapter 15: Windowing, Spectral Leakage, and Peak Detection](../../chapters/15-windowing-spectral-leakage-and-peak-detection/index.md)
- [Window Function Comparison](../window-function-comparison/index.md)

## References

1. [Spectral leakage](https://en.wikipedia.org/wiki/Spectral_leakage) — the effect demonstrated here.
2. [Window function](https://en.wikipedia.org/wiki/Window_function) — the standard remedy.
3. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Periodicity) — the periodicity property that creates the assumption.
