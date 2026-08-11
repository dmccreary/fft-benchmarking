---
title: Performance Metrics Calculator
description: Convert a raw cycle count into execution time, throughput, and a speedup factor, and watch the 146× figure emerge from real numbers.
image: /sims/performance-metrics-calculator/performance-metrics-calculator.png
og:image: /sims/performance-metrics-calculator/performance-metrics-calculator.png
twitter:image: /sims/performance-metrics-calculator/performance-metrics-calculator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Performance Metrics Calculator

<iframe src="main.html" height="492px" width="100%" scrolling="no"></iframe>

[Run the Performance Metrics Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/performance-metrics-calculator/main.html"
        height="492px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

`DWT->CYCCNT` gives you an integer. That integer is not a result — nobody can act
on "21,000,000". Three conversions turn it into something you can put in a table.

$$t_{\mu s} = \frac{\text{cycles}}{f_{MHz}} \qquad
\text{ops/s} = \frac{10^6}{t_{\mu s}} \qquad
\text{speedup} = \frac{t_{compare}}{t_{\mu s}}$$

The first one is easier than it looks. **Frequency in MHz is cycles per
microsecond**, so dividing cycles by MHz gives microseconds directly with no
unit juggling: 21,000,000 ÷ 150 = 140,000 µs = 140 ms.

## Watch the 146× Appear

Press **Load Chapter 12 example**. The sliders reproduce the numbers this course
already quoted: a 140 ms FFT against a 20.5 second brute-force DFT.

The speedup readout shows **146.4×**.

That number was asserted earlier in the book. Here it falls out of two measured
times and one division — which is the difference between a claim and a result.

## Report All Three, Always

The green panel makes a point worth taking seriously. A speedup factor alone is
not a reproducible measurement:

- **21,000,000 cycles** is the raw measurement.
- **150 MHz** is what makes it a time.
- **140 ms** is the derived time.
- **146.4×** is a comparison, and it is only valid if the baseline measured the
  same work on the same input.

Publish the cycle count and the clock frequency alongside the ratio. A bare
"146× faster" cannot be checked by anyone, including you in six months.

## How to Use

1. Press **Load Chapter 12 example** and confirm 140.00 ms and 146.4×.
2. Drag **Clock frequency** to 250 MHz. Execution time drops, throughput rises,
   and the speedup improves — all from the same cycle count.
3. Now think about what that means. The *cycles* did not change. Overclocking
   improves the time without improving the algorithm.
4. Set cycles to 150,000. Note throughput climbs into the thousands per second.
5. Drag **Comparison time** and watch only the speedup change. It is the only
   metric that depends on a baseline.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- A cycle counter yields elapsed cycles
- Unit conversion

### Learning Objective

Students will be able to **apply** the conversion formulas to compute execution
time, throughput, and speedup factor from a raw cycle count, and **use** those
metrics to report a benchmark result.

### Activities

1. **Convert by hand** (4 min): For 4,500,000 cycles at 133 MHz, students compute
   execution time on paper and verify.
2. **Isolate the variables** (3 min): Students identify which metrics change when
   only the clock changes, and which do not.
3. **Write the report line** (3 min): Students draft a one-sentence benchmark
   result containing every number a reader would need.

### Assessment

Ask: "A paper reports '3.2× faster' with no other numbers. List three things you
cannot determine, and what you would ask the authors for."

## Related Resources

- [Chapter 17: Measuring Time](../../chapters/17-measuring-time/index.md)
- [Cycle Budget Calculator](../cycle-budget-calculator/index.md)
- [DWT Register Explorer](../dwt-register-explorer/index.md)

## References

1. [Speedup](https://en.wikipedia.org/wiki/Speedup) — the definition and its pitfalls.
2. [Benchmark (computing)](https://en.wikipedia.org/wiki/Benchmark_(computing)) — reporting practices.
