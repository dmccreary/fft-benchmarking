---
title: Optimization Attribution Waterfall
description: A waterfall chart of four individually measured optimizations, showing how much of the total speedup each one actually contributed.
image: /sims/optimization-attribution-waterfall/optimization-attribution-waterfall.png
og:image: /sims/optimization-attribution-waterfall/optimization-attribution-waterfall.png
twitter:image: /sims/optimization-attribution-waterfall/optimization-attribution-waterfall.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Evaluate
---

# Optimization Attribution Waterfall

<iframe src="main.html" height="518px" width="100%" scrolling="no"></iframe>

[Run the Optimization Attribution Waterfall MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/optimization-attribution-waterfall/main.html"
        height="518px" width="100%" scrolling="no"></iframe>
```

!!! note "Illustrative values"
    The numbers in this chart are plausible but invented. They exist to show the
    *shape* of an attribution result and the reasoning it supports, not to
    describe any particular measurement. Your own numbers will differ, and the
    interesting question is always why.

## About This MicroSim

Apply four optimizations, measure once at the start and once at the end, and you
learn one thing: the code got 1.20× faster. You do not learn which change earned
it. If a maintainer later asks whether the branchless butterfly is worth the
unreadable code, you have no answer.

Attribution is what fixes that. Each of the four steps in this chart was
measured by re-running the entire benchmark harness with only that one change
added on top of the previous ones. That is four extra full runs to earn four
numbers — and those numbers are what let you defend, or abandon, each change
individually.

The result is not evenly distributed, and that is the point. The trivial-twiddle
skip alone accounts for 43% of the whole speedup. Loop unrolling accounts for
another 29%. Together those two changes deliver 100 of the 140 μs. The other two
changes bought 40 μs between them — real, measurable, and worth considerably
less than the effort they cost.

Two subtleties are worth pushing on:

**Order affects attribution.** The branchless-butterfly step is only worth 15 μs
*because the step before it introduced the branch*. Measure it first, against the
baseline, and it would be worth nothing at all — there would be no branch to
remove. A one-change-at-a-time waterfall attributes each change **in the context
of the changes already applied**, which is exactly what you want for deciding
whether to keep the current stack, and exactly not what you want for deciding
which single change to try first.

**Small bars are honest.** Switch to the percentage view. The whole optimization
campaign moves the bar from 100% to 83.5%. Four changes, several of them
delicate, for a sixth of the runtime. Whether that is a triumph or a waste
depends on a requirement — and a chart that made the win look bigger would be
hiding the question rather than answering it.

## How to Use

1. Read the chart left to right. The two solid bars at the ends are absolute
   times; the four floating bars between them are the measured steps that connect
   one to the other.
2. Click any green step bar. The panel below reports the change in μs, its share
   of the baseline, its share of the total speedup, and what the change actually
   was.
3. Click the **Final** bar for the summary arithmetic.
4. Switch to **Show as percentage of baseline** and re-read the same chart. Ask
   which view you would put in a report, and to whom.
5. Rank the four changes by benefit, then rank them by how much of the code they
   complicate. The two rankings do not match, and that mismatch is the decision.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 12-15 minutes

**Prerequisites:**

- A benchmark harness that produces repeatable timings
- Familiarity with the four optimizations named in the chart
- Percentage and speedup-ratio arithmetic

**Learning Objective:** Assess how much of a total speedup each individual
optimization contributed, by inspecting a waterfall chart built from
one-change-at-a-time measurements.

**Activities:**

1. **Guess before looking (2 min).** Show only the four change names and the
   140 μs total. Ask students to allocate the 140 μs among the four. Collect the
   guesses; most over-value the branchless change because it sounds clever.
2. **Read the attribution (3 min).** Reveal the chart. Compare against the
   guesses. Discuss why the least glamorous change — skipping multiplies you do
   not need — won.
3. **Count the cost of measuring (3 min).** Ask how many full harness runs
   produced this chart, and what a two-measurement before/after would have told
   them instead.
4. **Attack the ordering (4 min).** Point out that the branchless step is worth
   15 μs only because the previous step added a branch. Ask what the chart would
   look like if the two were swapped, and what that implies about reporting a
   waterfall without stating the order.
5. **Make the call (3 min).** Given a requirement of 800 μs, which changes would
   you keep? Given 700 μs? The first answer needs one change; the second needs
   all four and still misses.

**Assessment:** You are handed a waterfall showing five optimizations totaling a
2.0× speedup, where one step contributes 3%. Write the recommendation you would
make about that step, and name the one piece of information the chart does not
give you that you would need first.

## Related Resources

- [Branch Misprediction Visualizer](../branch-misprediction-visualizer/index.md) — the mechanism behind the branchless step
- [FFT Stage Architecture](../fft-stage-architecture/index.md) — why only the hot loop is worth optimizing at all
- [Variant Performance Dashboard](../variant-performance-dashboard/index.md) — comparing whole implementations rather than individual changes

## References

- [ARM Cortex-M33 Devices Generic User Guide](https://developer.arm.com/documentation/100235/latest/) — instruction costs behind each optimization
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/) — floating-bar datasets, used here for the waterfall steps
