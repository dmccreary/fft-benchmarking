---
title: Variance Source Explorer
description: Watch interrupt interference build a right-skewed timing histogram, and see why the minimum resists it while the mean does not.
image: /sims/variance-source-explorer/variance-source-explorer.png
og:image: /sims/variance-source-explorer/variance-source-explorer.png
twitter:image: /sims/variance-source-explorer/variance-source-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Variance Source Explorer

<iframe src="main.html" height="492px" width="100%" scrolling="no"></iframe>

[Run the Variance Source Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/variance-source-explorer/main.html"
        height="492px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Time the same FFT a hundred times and you will not get the same number a hundred
times. The interesting question is *what shape* the variation has, because the
shape tells you where it came from.

Press **Run 20 more samples** a few times and look at the histogram.

It is not a bell curve. There is a tight blue cluster at 400 µs — that is the
code's actual cost, varying by a few microseconds from cache and pipeline
effects. And there is a scatter of red bars stretching off to the right, dozens
of microseconds slower.

## Noise Would Be Symmetric. This Is Not.

If the variation were measurement noise, it would spread evenly on both sides of
the true value — sometimes reading high, sometimes low.

It does not, and it cannot, because **an interrupt can only add time**. A timer
tick, a USB event, or a DMA completion steals cycles from your measured region.
Nothing ever gives cycles back.

That one-sidedness is the signature. A right-skewed timing distribution is not
noisy measurement — it is *interference*, and the tail is a census of how often
something interrupted you.

## Why This Decides Your Statistic

Watch the three numbers as you add samples:

- **Minimum** stays pinned near 400 µs. It is the one run where nothing
  interfered — the closest you get to the code's intrinsic cost.
- **Mean** climbs steadily as outliers accumulate. It is measuring your code
  *plus* your interrupt load.
- **Standard deviation** climbs too, and it is nearly all tail.

Drag the interference rate to 30% and press Reset, then re-sample. The mean moves
a long way. The minimum barely moves at all.

This is the mechanism behind the best-of-N convention from the previous MicroSim.
Best-of-N is not a trick to make numbers look good — it is a principled estimator
for a quantity contaminated by strictly one-sided interference.

## How to Use

1. Press **Run 20 more samples** five times and watch the tail appear.
2. Compare mean and minimum. Note how far apart they drift.
3. Set the interference rate to 0%, press **Reset**, and re-sample. The
   distribution is now symmetric and the mean and minimum nearly agree.
4. Set it to 30% and repeat. The tail dominates and the mean is badly inflated.
5. Ask: which number would you report as "the execution time", and what would you
   report alongside it?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Mean, standard deviation, and minimum
- Interrupts steal CPU time

### Learning Objective

Students will be able to **interpret** a histogram of repeated timing
measurements and **explain** how interrupt interference produces a right-skewed
distribution rather than uniform noise.

### Activities

1. **Build the distribution** (4 min): Students sample to 100+ runs and describe
   the shape in their own words.
2. **Zero interference** (4 min): Students set the rate to 0% and articulate what
   changed about the shape and about the mean-minimum gap.
3. **Justify the estimator** (4 min): Students explain why the minimum is the
   better estimate of intrinsic cost given one-sided interference.

### Assessment

Ask: "Your timing histogram is symmetric around 500 µs with no tail. What does
that tell you about interrupts during the measurement, and would best-of-N still
be the right statistic?"

## Related Resources

- [Chapter 18: Benchmarking Methodology](../../chapters/18-benchmarking-methodology/index.md)
- [Benchmark Results Chart](../benchmark-results-chart/index.md)

## References

1. [Skewness](https://en.wikipedia.org/wiki/Skewness) — the asymmetry measure this distribution exhibits.
2. [Interrupt latency](https://en.wikipedia.org/wiki/Interrupt_latency) — the mechanism producing the tail.
3. [Robust statistics](https://en.wikipedia.org/wiki/Robust_statistics) — why some estimators resist outliers.
