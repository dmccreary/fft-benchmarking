---
title: Stage Profiling Breakdown Chart
description: A measured split of capture, compute, and draw time — and the judgment about which stage to optimize.
image: /sims/stage-profiling-breakdown-chart/stage-profiling-breakdown-chart.png
og:image: /sims/stage-profiling-breakdown-chart/stage-profiling-breakdown-chart.png
twitter:image: /sims/stage-profiling-breakdown-chart/stage-profiling-breakdown-chart.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Evaluate
---

# Stage Profiling Breakdown Chart

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Stage Profiling Breakdown Chart MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/stage-profiling-breakdown-chart/main.html"
        height="472px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

You have a working spectrum analyzer and it is too slow. Where do you start?

The wrong answer is wherever your intuition points. Intuition is famously bad at
this — programmers routinely optimize the code they find most interesting rather
than the code that is actually expensive.

The right answer is: **measure first.** This chart is the measurement.

| Stage | Share of frame time |
|-------|--------------------|
| Capture | 1% |
| Compute (FFT) | 66% |
| Draw (SPI to OLED) | 33% |

## What the Numbers Decide

**Capture is not worth touching.** It is 1%. Even reducing it to literally zero
buys you 1% of frame time. Any effort spent here is effort not spent where it
matters.

**Compute is the bottleneck, and it is not close.** Two thirds of every frame.
A 25% improvement to the FFT saves 16.5% of total frame time — more than
eliminating capture *and* halving draw combined.

**Draw is worth revisiting second.** A third of the frame is real, and it is not
nothing. But per unit of effort, compute pays roughly twice as well.

This is Amdahl's law in its most practical form: the speedup available from
optimizing any stage is capped by that stage's share of the total. You cannot get
more than 1% back from capture no matter how brilliant your optimization is.

## How to Use

1. Click each segment in turn and read its verdict.
2. Compute the maximum possible speedup from perfectly optimizing each stage.
3. Switch to the **Pie chart** view. Same data, and the same conclusion — the
   view does not change the answer, which is the point.
4. Ask: if you had time to optimize exactly one stage, which one, and what is the
   best case you could hope for?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- The pipeline has capture, compute, and draw stages
- Percentages of a total

### Learning Objective

Students will be able to **judge**, from a stacked breakdown of stage times,
which stage should be **prioritized** for optimization, using measured
percentages rather than intuition.

### Activities

1. **Rank by payoff** (3 min): Students rank the three stages by maximum
   achievable savings.
2. **Amdahl bound** (4 min): Students compute the best-case overall speedup from
   making compute infinitely fast (about 3× — the other 34% remains).
3. **Argue against intuition** (3 min): Students describe a plausible wrong
   guess about the bottleneck and what measurement would have corrected it.

### Assessment

Ask: "A colleague spends a week hand-optimizing the capture routine and reports a
40% speedup in that stage. How much faster is the overall frame?" (0.4% — a week
for four parts in a thousand.)

## Technical Details

- **Library:** Chart.js 4.4.0
- **Views:** horizontal stacked bar and pie, toggled without changing the data
- **Interaction:** click any segment for its share and verdict

## Related Resources

- [Chapter 16: Building a Real-Time Spectrum Analyzer](../../chapters/16-building-a-real-time-spectrum-analyzer/index.md)
- [Cycle Budget Calculator](../cycle-budget-calculator/index.md)

## References

1. [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law) — the bound on speedup from optimizing one part.
2. [Profiling (computer programming)](https://en.wikipedia.org/wiki/Profiling_(computer_programming)) — why measurement precedes optimization.
