---
title: Variant Performance Dashboard
description: Five implementations of the same kernel, measured four ways — switch metrics and watch the winner change.
image: /sims/variant-performance-dashboard/variant-performance-dashboard.png
og:image: /sims/variant-performance-dashboard/variant-performance-dashboard.png
twitter:image: /sims/variant-performance-dashboard/variant-performance-dashboard.png
social:
   cards: false
status: implemented
library: Chart.js
bloom_level: Evaluate
---

# Variant Performance Dashboard

<iframe src="main.html" height="566px" width="100%" scrolling="no"></iframe>

[Run the Variant Performance Dashboard MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/variant-performance-dashboard/main.html"
        height="566px" width="100%" scrolling="no"></iframe>
```

!!! note "Illustrative values"
    These numbers are plausible and internally consistent, but invented. They
    are here to show what a multi-metric comparison looks like and what it does
    to a ranking, not to describe any particular measurement.

## About This MicroSim

Five variants of the same kernel. Four metrics. The question the chapter asks is
"which variant should I ship?", and the reason it is a hard question is visible
the moment you switch the dropdown.

On **kernel time**, specialized assembly wins by 29.6×. On **code size**, the
ranking is *exactly reversed* — the fastest variant is the biggest, at 3.5× the
size of plain Python. On **memory**, a third order appears, and it has ties.
Nothing about the variants changed between those three charts. Only the question
did.

Two comparisons are worth dwelling on:

**Kernel time versus total time.** These two produce the same ranking, which
makes them look redundant. They are not. The gap between them is fixed overhead:
50 μs for plain Python, 240 μs for specialized assembly. Because that overhead is
untouched by the optimization, the honest end-to-end speedup is 22.2×, not the
29.6× the kernel-time chart shows. Quote the kernel number and you are
describing your code; quote the total and you are describing your user's
experience.

**Ties are information.** Both assembly variants use 512 bytes, because both
transform in place. If memory is your binding constraint, this metric cannot
choose between them — and the correct response is to notice that and go find
another criterion, not to pick arbitrarily.

The prediction overlay is the point of the exercise. Record a ranking, then
change the metric without touching it. A prediction that scores 3 of 5 on kernel
time scores 0 of 5 on code size. You were not wrong; the question changed
underneath you. That is the difference between "which variant is fastest" and
"which variant should I ship", and only the second one is a decision.

## How to Use

1. Start on **Kernel time**. Hover any bar for its exact value and its rank.
2. Tick **Overlay my ranking prediction** and drag the chips — or use the ◀ ▶
   buttons — into the order you would predict, best first. Do this *before*
   looking closely at the other metrics.
3. Switch the metric dropdown through all four options without changing your
   prediction. Watch the score change.
4. Note where the gold bar moves. It marks the best variant on the active
   metric.
5. Answer the real question: given a device with 32 KB of flash and a 1 ms
   deadline, which variant ships? Then change the flash budget to 512 KB and
   answer again.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 12-15 minutes

**Prerequisites:**

- Familiarity with the five implementation strategies compared here
- The difference between kernel time and end-to-end time
- Embedded resource constraints: flash and RAM budgets

**Learning Objective:** Assess how a predicted ranking compares to a measured
ranking across multiple metrics, and critique which metric best answers "which
variant should I actually ship?"

**Activities:**

1. **Commit to a prediction (3 min).** Before revealing any data, have students
   set the prediction overlay to the order they expect. Ask them to write down
   *which metric they were ranking by* — most will not have decided, which is
   the first finding.
2. **Score across metrics (4 min).** Cycle through all four metrics with the
   prediction fixed. Record the score each time. Discuss why one prediction
   cannot be simultaneously right.
3. **Find the hidden overhead (3 min).** Have students subtract kernel time from
   total time for each variant. Ask why the overhead grows as the kernel
   shrinks, and what that implies about how far this optimization can ever go.
4. **Make the shipping decision (4 min).** Give two scenarios — 32 KB flash with
   a 1 ms deadline, and 512 KB flash with a 1 ms deadline — and require a
   written justification naming the deciding metric. The two answers differ.

**Assessment:** A colleague reports "the assembly version is 30× faster" and
proposes shipping it. Using this dashboard, write three questions you would ask
before agreeing, and state which metric each question is really about.

## Related Resources

- [Optimization Attribution Waterfall](../optimization-attribution-waterfall/index.md) — attributing a speedup to individual changes
- [FFT Stage Architecture](../fft-stage-architecture/index.md) — why the assembly variants exist at all
- [Experimental Design Anatomy](../experimental-design-anatomy/index.md) — designing the comparison that produces numbers like these

## References

- [MicroPython Documentation: Native and Viper emitters](https://docs.micropython.org/en/latest/reference/speed_python.html) — what `@native` and `@viper` actually do
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/) — the bar chart and tooltip callbacks used here
