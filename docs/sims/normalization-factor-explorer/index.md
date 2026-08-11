---
title: Normalization Factor Explorer
description: Switch FFT scaling conventions and watch the same spectrum's displayed magnitudes change by orders of magnitude while the signal does not.
image: /sims/normalization-factor-explorer/normalization-factor-explorer.png
og:image: /sims/normalization-factor-explorer/normalization-factor-explorer.png
twitter:image: /sims/normalization-factor-explorer/normalization-factor-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Normalization Factor Explorer

<iframe src="main.html" height="482px" width="100%" scrolling="no"></iframe>

[Run the Normalization Factor Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/normalization-factor-explorer/main.html"
        height="482px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Run the same signal through two different FFT libraries and you can get answers
that differ by a factor of 512. Neither library is wrong. They picked different
**scaling conventions**, and there is no universal standard.

Three conventions are in common use:

| Convention | Forward | Inverse | Round trip |
|-----------|---------|---------|-----------|
| No forward scaling | 1 | 1/N | exact |
| Unitary | 1/√N | 1/√N | exact |
| Forward-normalized | 1/N | 1 | exact |

Every one of them reconstructs the original signal **exactly** on a
forward-then-inverse round trip. The scaling has to land somewhere; the only
question is which side of the transform pair carries it.

## Why This Matters for Benchmarking

This is a trap when comparing implementations. If you benchmark library A against
library B and their magnitudes differ by a factor of N, your first instinct will
be that one of them has a bug. Usually neither does — you are comparing a sum
against an average.

Before you compare *any* two FFT implementations numerically, find out what each
one does with the scaling. It is often buried in a single sentence of the
documentation, and sometimes it is not documented at all and you have to
determine it by feeding in a known signal.

## How to Use

1. At N = 512 with the default convention, note the peak reads 8.00.
2. Switch to **1/N forward**. The same peak now reads 0.016 — the bars have
   collapsed to nothing against the fixed axis. Nothing about the signal changed.
3. Switch to **unitary**. The peak reads 0.354, between the two extremes.
4. Now change N to 8 and cycle through the conventions again. Note how much less
   the conventions differ when N is small — and why that makes the problem easy
   to miss during small-scale testing.
5. Read the round-trip figure at every setting. It is always exactly 1.000.

## The Axis Does Not Auto-Scale

The y-axis is deliberately pinned to the unscaled peak of 8.0. An auto-scaling
chart would make all three conventions look identical, which would hide the
entire point. The numeric label above each bar stays readable even when the bar
itself has vanished.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- The DFT produces a magnitude per bin
- Forward and inverse transforms as a pair

### Learning Objective

Students will be able to **calculate** how a chosen scaling convention changes
displayed magnitude values, and **demonstrate** that the choice does not affect
correctness.

### Activities

1. **Compute the factors** (4 min): For N = 1024, students compute all three
   forward factors by hand and verify against the readout.
2. **Predict the peak** (3 min): Before switching conventions, students predict
   the displayed peak value under each.
3. **Design a test** (3 min): Students describe how they would determine an
   undocumented library's convention using a single known input.

### Assessment

Ask: "Library A reports a peak of 256 for a signal; library B reports 0.5 for the
same signal at N = 512. Are they inconsistent? What is each one's likely
convention?" (No — A uses no forward scaling, B uses 1/N.)

## Related Resources

- [Chapter 13: FFT Variants, Complexity, and Correctness](../../chapters/13-fft-variants-complexity-and-correctness/index.md)

## References

1. [DFT normalization conventions](https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Definition) — the standard formulations and where the factor is placed.
2. [Parseval's theorem](https://en.wikipedia.org/wiki/Parseval%27s_theorem) — why the unitary convention is the energy-preserving one.
