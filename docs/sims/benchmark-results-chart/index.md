---
title: Benchmark Results Chart
description: The same three implementations under mean-with-error-bars and best-of-N, and what changes when you switch statistic.
image: /sims/benchmark-results-chart/benchmark-results-chart.png
og:image: /sims/benchmark-results-chart/benchmark-results-chart.png
twitter:image: /sims/benchmark-results-chart/benchmark-results-chart.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Analyze
---

# Benchmark Results Chart

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Benchmark Results Chart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/benchmark-results-chart/main.html"
        height="472px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Three implementations, measured many times each. Which is fastest?

The answer depends on which number you report, and this is where benchmarks
quietly mislead.

| Implementation | Mean | Std dev | Best of N |
|---------------|------|---------|-----------|
| A | 410 µs | ± 35 | 380 µs |
| B | **395 µs** | ± 60 | **340 µs** |
| C | 430 µs | ± 12 | 415 µs |

## The Ranking Does Not Change — the Meaning Does

B wins under both statistics. That is deliberate, and it is more instructive than
a ranking flip would be.

Under **mean ± std dev**, B is fastest on average but its error bar spans
335-455 µs. Look at the chart: B's upper whisker reaches *higher than C's entire
bar*. On any given run, B might well be slower than the implementation with the
worst mean.

Under **best of N**, B is fastest again — but "best of N" reports the single run
that happened to escape interference. It tells you what the code can do when
nothing gets in its way, and says nothing whatsoever about how often that
happens.

So "B is fastest" is true in both views and means two different things.

## Which Should You Report?

Neither, alone.

- **Best-of-N** estimates the code's intrinsic cost, with OS and interrupt noise
  filtered out. Good for comparing algorithms.
- **Mean with spread** estimates what you will actually experience. Good for
  deciding whether a real-time deadline will be met.

For a real-time system, C may well be the right choice despite losing both
comparisons. A 430 µs worst case you can count on beats a 395 µs average that
sometimes takes 455 — because a deadline missed is a frame dropped, and the mean
does not care.

**Report both.** A benchmark table with only one column is hiding something.

## How to Use

1. Start in **Mean ± std dev**. Compare the error bar heights, not just the bar
   heights.
2. Hover each bar to read the mean, standard deviation, and implied range.
3. Switch to **Best of N**. Note that the ranking is unchanged but every bar
   moved down — best-of-N is always optimistic.
4. Ask: if your deadline were 440 µs, which implementation would you ship?
5. Note that the y-axis stays fixed at 300-500 µs across both views, so the
   switch does not silently rescale the comparison.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Mean and standard deviation
- Reading a bar chart with error bars

### Learning Objective

Students will be able to **compare** mean-with-error-bars against best-of-N
across implementations, and **examine** what each statistic does and does not
tell them.

### Activities

1. **Read both views** (4 min): Students tabulate all three implementations under
   both statistics.
2. **Deadline test** (4 min): Given a 440 µs deadline, students choose an
   implementation and justify it from the spread rather than the mean.
3. **Spot the omission** (4 min): Students describe what a table reporting only
   best-of-N would hide.

### Assessment

Ask: "A paper reports best-of-N times only, and implementation B wins. What
question would you ask the authors before adopting B for a real-time system?"

## Related Resources

- [Chapter 18: Benchmarking Methodology](../../chapters/18-benchmarking-methodology/index.md)
- [Variance Source Explorer](../variance-source-explorer/index.md)

## References

1. [Standard deviation](https://en.wikipedia.org/wiki/Standard_deviation) — the spread measure shown by the error bars.
2. [Benchmark (computing)](https://en.wikipedia.org/wiki/Benchmark_(computing)) — reporting conventions and their pitfalls.
