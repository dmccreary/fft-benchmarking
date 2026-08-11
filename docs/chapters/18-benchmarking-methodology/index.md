---
title: "Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison"
description: How benchmarks lie — observer effect, single-sample measurement, unstated exclusions — and the statistical practices that defend against each one
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison

## Summary

This chapter catalogs the ways a benchmark can lie: skipped warm-up runs, single-sample measurements, the observer effect of instrumentation overhead, and unstated exclusions that flatter a result. It introduces statistical sampling, mean and standard deviation, and best-of-N versus mean as concrete defenses against those failure modes. These practices are the methodology every later chapter's performance claims are held to.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Benchmark Results
2. Benchmarking Framework
3. Best Of N
4. Fair Comparison
5. Interrupt Interference
6. Latency Metric
7. Mean Execution Time
8. Memory Usage
9. Minimum Sample
10. Observer Effect
11. Performance Charts
12. Processing Latency
13. Reproducibility
14. Standard Deviation
15. Statistical Sampling
16. Test Harness
17. Throughput Metric
18. Timing Overhead
19. Variance Sources

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [16. Building a Real-Time Spectrum Analyzer](../16-building-a-real-time-spectrum-analyzer/index.md)
- [17. Measuring Time: The DWT Cycle Counter](../17-measuring-time/index.md)

---

!!! mascot-welcome "Time to transform — a timer into trustworthy evidence!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Chapter 17 gave you an instrument accurate to 6.7 nanoseconds. That's the easy part.
    A perfectly accurate timer, used carelessly, still produces a lie — just a very
    *precise* lie. This chapter is about the careless mistakes that turn good hardware
    into bad conclusions.

Run your FFT once, print the elapsed microseconds, and you have a number. That number is
not yet a **benchmark result** — a benchmark result is a measurement obtained under
conditions controlled and documented well enough that someone else could reproduce it and
get the same answer. A single, unrepeated reading rarely clears that bar. This chapter
walks through the specific ways a single reading misleads you, and the statistical habits
that fix each one.

## Variance Sources: Why the Same Code Gives Different Times

Run the identical FFT call ten times in a row on the same board, and you will *not* get
ten identical cycle counts. Small fluctuations are normal, and they come from several
independent **variance sources** — factors that make execution time vary even when the
code and input are unchanged.

The most disruptive of these is **interrupt interference**: the Pico 2's operating
firmware periodically pauses whatever code is running to service hardware interrupts —
USB polling, the system tick, background peripheral handling — and each pause adds extra,
unpredictable cycles to whatever you happen to be timing at that moment. A run that gets
interrupted mid-FFT will measure slower than one that doesn't, for reasons that have
nothing to do with your algorithm. Other variance sources include small differences in
which data happened to already be in fast on-chip memory versus needing a slower fetch,
and minor timing jitter in the clock circuitry itself. None of these are bugs — they are
simply the reality of measuring a real, shared piece of hardware.

!!! mascot-thinking "One reading tells you nothing about the spread"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    If interrupt interference can add a random delay to any single run, then any single
    run is really "the true time, plus an unknown amount of noise." You cannot separate
    signal from noise with one data point — you need many.

## Statistical Sampling: Measuring More Than Once

**Statistical sampling** is the practice of running the same measurement many times and
treating the resulting set of numbers — not any one of them — as the actual result. A
typical benchmark in this course runs the FFT 50 or 100 times back to back, recording
every individual execution time before doing anything else with the data. From that
sample, two summary statistics do almost all the work.

The **mean execution time** is the ordinary average of every recorded run:

\[
\bar{t} = \frac{1}{n}\sum_{i=1}^{n} t_i
\]

The **standard deviation** measures how spread out those individual times are around
that mean — a small standard deviation means the runs were consistent; a large one means
something (probably a variance source) is making some runs much slower than others:

\[
s = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(t_i - \bar{t})^2}
\]

Reporting both together — "412 μs ± 18 μs" rather than just "412 μs" — tells a reader not
just the typical time, but how much to trust that number as representative.

#### Diagram: Variance Source Explorer

<iframe src="../../sims/variance-source-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Variance Source Explorer</summary>
Type: microsim
**sim-id:** variance-source-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand (L2) — explain, interpret
Learning objective: Interpret a histogram of repeated timing measurements and explain how interrupt interference produces a right-skewed distribution rather than uniform noise.

Canvas layout:
- Left (400px): A live-updating histogram of 100 simulated FFT execution times
- Right (200px): Controls and running statistics readout (mean, standard deviation, min)

Visual elements:
- Histogram bars, x-axis "execution time (μs)", y-axis "count of runs"
- Most bars clustered tightly around a baseline value (e.g. 400 μs)
- A smaller cluster of outlier bars further right, representing interrupt-interfered runs
- Statistics panel showing live mean, standard deviation, and minimum as more samples are added

Interactive controls:
- Button: "Run 1 more sample" — adds one new simulated timing value to the histogram
- Button: "Run 20 more samples"
- Slider: "Interrupt interference rate" (0% to 30% of runs affected) — controls how often an outlier appears
- Button: "Reset"

Default parameters:
- Baseline execution time: 400 μs, small Gaussian jitter ± 5 μs
- Interrupt interference rate: 8%, adding 50-150 μs to affected runs

Behavior:
- Each "run" adds one bar-contributing value to the histogram, drawn from the baseline distribution or, with the interference-rate probability, from the elevated outlier distribution
- Mean and standard deviation update live and visibly shift as outliers accumulate
- Minimum stays anchored near the baseline, visually demonstrating why the minimum resists interference while the mean does not

Instructional Rationale: A live histogram with adjustable interference rate lets the
learner directly observe (Understand-level) how variance sources shape a distribution,
rather than only being told that interrupts add noise.

Implementation: p5.js, histogram as an array of bin counts, statistics recomputed on each new sample
</details>

## Best of N Versus the Mean

Because interrupt interference tends to make runs *slower*, never faster, than the true
best-case time, a second useful statistic is the **minimum sample** — the single fastest
execution time observed across the whole run. Taking the **best of N** approach means
reporting that minimum, on the reasoning that the fastest run is the one least likely to
have been disturbed by an interrupt, and therefore the closest estimate of the algorithm's
true, unburdened speed.

Mean and best-of-N answer different questions, and conflating them is a common source of
misleading benchmarks:

| Statistic | Answers | Sensitive to interference? | Best used when |
|---|---|---|---|
| Mean execution time | What should I expect on a typical run, interference included? | Yes — pulled upward by every outlier | Estimating real-world, in-context performance |
| Minimum sample (best of N) | How fast can this code run under ideal conditions? | No — a single interrupted run doesn't change the minimum | Comparing the raw speed of two algorithms or implementations |

This course reports best-of-N when comparing *algorithms* (DFT versus FFT versus assembly
FFT), because the question is "which one is fundamentally faster," and reports the mean
when describing what a deployed spectrum analyzer will *actually feel like* to a user,
interference included.

## The Observer Effect and Timing Overhead

!!! mascot-warning "The act of measuring changes what you measure"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Every call to read CYCCNT, every `print()` statement inside a timing loop, and every
    extra function call you add "just to measure" also takes cycles — cycles that get
    counted as part of your result if you're not careful.

The **observer effect** is the general principle that measurement itself is not free —
inserting instrumentation into a system changes the very quantity being measured. In
software timing, this shows up as **timing overhead**: the handful of cycles consumed by
the timing code itself (reading CYCCNT, computing the masked subtraction, storing the
result) rather than by the thing you actually wanted to measure. If you time a very short
operation, that overhead can become a significant fraction of the reported result.

The defense is to measure the overhead itself, once, and either report it separately or
subtract it out. A simple way to estimate timing overhead is to time an *empty* block —
call the exact same timing code around nothing at all, and see what elapsed time it
reports. That number is your instrumentation's own floor; any measurement smaller than a
few times that floor should be treated with real skepticism.

## Fair Comparison and Reproducibility

Two more disciplines matter as much as the statistics themselves. A **fair comparison**
holds every condition constant except the one thing being compared — same input data,
same board, same clock speed, same ambient temperature, same number of samples — so that
a difference in measured time can only be attributed to the one variable that actually
changed. Comparing an FFT run on a freshly powered-on board against one run after twenty
minutes of continuous operation is not a fair comparison of two algorithms; it may just be
a comparison of a cool chip against a warmer one.

**Reproducibility** is the property that another person, given your code, your input
data, and your stated conditions, gets the same result (within normal statistical
variance) that you got. A benchmark result nobody else can reproduce is not evidence of
anything — it is an anecdote. Every benchmark in this course states its sample size,
statistic (mean or best-of-N), board, and clock speed for exactly this reason.

## Latency and Throughput, Formally

Chapter 17 introduced execution time and FFTs per second informally; this chapter gives
the general versions their formal names. The **latency metric** is the general term for
"time from when a unit of work becomes available to when its result is ready" — execution
time is latency for a single FFT call. The specific case that matters for a live spectrum
analyzer is **processing latency**: the time from "a fresh audio sample is ready in the
buffer" to "its contribution to the displayed spectrum is on screen," which includes the
FFT itself plus every surrounding step from Chapter 16's pipeline. The **throughput
metric** is the general term for "amount of work completed per unit time" — FFTs per
second is throughput, specifically.

## Memory Usage: The Other Half of "Performance"

Time is not the only resource worth measuring. **Memory usage** — how much RAM an
implementation consumes, for buffers, twiddle-factor tables, and intermediate arrays — is
a second, independent performance dimension. A variant that runs faster by keeping a
larger precomputed table in memory has made a real tradeoff, not a pure win, on a board
with a fixed, modest amount of RAM. Later chapters that compare implementation variants
report memory usage alongside execution time for exactly this reason — a "fastest"
implementation that doesn't fit in available memory is not actually usable.

## Building a Test Harness

All of the practices above compose into reusable code. A **test harness** is the specific
piece of code that runs an operation a fixed number of times, records each execution time,
and computes the summary statistics — the thing that actually presses the stopwatch,
repeatedly, in a controlled loop. A **benchmarking framework** is the larger, reusable
system built around one or more test harnesses: shared timing utilities, a consistent way
to report results, and the conventions (sample size, which statistic to use, how to state
exclusions) that keep every benchmark in a project comparable to every other one.

```python
def run_harness(func, n=50):
    times = []
    for _ in range(n):
        start = machine.mem32[DWT_CYCCNT]
        func()
        end = machine.mem32[DWT_CYCCNT]
        times.append(elapsed_us(start, end))

    mean = sum(times) / n
    variance = sum((t - mean) ** 2 for t in times) / n
    std_dev = variance ** 0.5
    return {
        "mean_us": mean,
        "std_dev_us": std_dev,
        "min_us": min(times),
        "n": n,
    }
```

`run_harness` takes any zero-argument function `func` and a sample size `n`, times it `n`
times using the wraparound-safe `elapsed_us` helper from Chapter 17, and returns a
dictionary holding the mean, standard deviation, minimum (best-of-N), and sample size
together — everything a reproducible benchmark result needs to report in one place.

## Presenting Benchmark Results

Raw numbers in a dictionary are hard to compare at a glance, which is why **performance
charts** — bar charts with error bars showing mean ± standard deviation, or grouped bars
comparing several implementations side by side — accompany almost every benchmark result
in this course from here forward.

#### Diagram: Benchmark Results Chart

<iframe src="../../sims/benchmark-results-chart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Benchmark Results Chart</summary>
Type: chart
**sim-id:** benchmark-results-chart<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze (L4) — compare, examine
Learning objective: Compare mean-with-error-bars against best-of-N across several implementations, and examine which comparison changes the apparent ranking.

Chart type: Bar chart with error bars, plus a toggle overlay

Purpose: Show the same three placeholder implementations ("A", "B", "C") under two different statistics, so learners see whether the ranking changes

X-axis: Implementation (A, B, C)
Y-axis: Execution time (μs), linear scale

Data series (toggle between the two with a control, do not show both by default):
1. Mean execution time with error bars showing ± 1 standard deviation
   - A: mean 410 μs, std dev 35 μs
   - B: mean 395 μs, std dev 60 μs
   - C: mean 430 μs, std dev 12 μs
2. Minimum sample (best of N)
   - A: 380 μs
   - B: 340 μs
   - C: 415 μs

Interactive elements:
- Toggle switch: "Mean ± std dev" vs "Best of N"
- Hover over any bar to see the exact value and, for the mean view, the standard deviation
- Callout text below the chart that updates with the toggle: for the mean view, "B has the lowest mean but the widest spread — B is inconsistent." For the best-of-N view, "B is also fastest at its best — but note how differently 'B is best' reads once you know why."

Title: "Same Three Implementations, Two Statistics"
Legend: top-right, labeling which statistic is active

Implementation: Chart.js bar chart with a custom error-bar plugin, data array swapped on toggle
</details>

## Naming What a Benchmark Excludes

Even a statistically careful benchmark can still mislead if it quietly leaves something
out — display refresh time, memory allocation, or the cost of preparing input data,
excluded without saying so. Stating every exclusion explicitly, alongside the sample size
and statistic used, is what separates a **benchmark result** worth citing from one that
only looks rigorous.

??? question "You benchmark an FFT and report '380 μs, best of 50 runs.' What is still missing before another researcher could trust this number? Click to check."
    At minimum: the board and clock speed (150 MHz Pico 2?), the FFT size (512-point?),
    whether timing overhead was subtracted or estimated, whether any warm-up runs were
    discarded before the 50 were recorded, and what — if anything — was excluded from the
    timed region (buffer preparation? display update?). Chapter 19 formalizes the
    warm-up question specifically; this chapter's job was making you ask it.

!!! mascot-celebration "You can now catch a lying benchmark"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You're right on frequency! Statistical sampling, mean and standard deviation,
    best-of-N, fair comparison, and stated exclusions — that's the full toolkit for
    telling a trustworthy result from a flattering one. Chapter 19 puts it straight to
    work, comparing MicroPython, C, and assembly on the very same computation.
