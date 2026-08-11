---
title: "Competing Variants: Predict, Measure, Explain"
description: Predicting the fastest FFT variant before measuring, then explaining why combined optimizations rarely add up to their full predicted speedup
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Competing Variants: Predict, Measure, Explain

## Summary

This chapter has students predict which of several FFT variants will be fastest before measuring any of them, then explains the gap between prediction and result. It introduces sub-linear composition — why combining two optimizations rarely gives their full combined speedup — as the reason predictions frequently miss. This exercise in being wrong on paper is a deliberate, repeated pattern in the course.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. Comparison Matrix
2. Controlled Variable
3. Data Marshalling Cost
4. Integration Cost
5. Kernel Versus Total Time
6. Optimization Composition
7. Performance Dashboard
8. Ranking Prediction
9. Speed Accuracy Tradeoff
10. Sub Linear Composition
11. Surprising Result
12. Variant Comparison

## Prerequisites

This chapter builds on concepts from:

- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [18. Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison](../18-benchmarking-methodology/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [24. Specialization and Branchless Code](../24-specialization-and-branchless-code/index.md)
- [25. Beyond the Assembler: Hand-Encoding and Instruction Formats](../25-beyond-the-assembler/index.md)

---

!!! mascot-welcome "Time to transform — predictions into humility, and humility into insight!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You've now built six or seven different versions of the same FFT — plain Python,
    native, viper, assembly, specialized assembly. Before you measure a single one of
    them against the others, write down your guess. You're going to be wrong, and that's
    the actual lesson.

## Ranking Prediction, Before a Single Measurement

Chapter 19 asked you to predict a rough speed order for individual language rungs. This
chapter asks a sharper version of the same question: a **ranking prediction** — a
complete, ordered list, fastest to slowest, of every FFT variant you've built across this
course, committed to writing before you run a single one of them through Chapter 18's
harness. Include a guess at *how much* faster the fastest is than the slowest, not just
the order. Nothing about this chapter works as intended if you skip straight to
measuring — the value here is entirely in comparing your guess against reality afterward.

## Variant Comparison: One Harness, Every Implementation

A **variant comparison** runs every implementation — plain Python FFT, `@native`,
`@viper`, hand-written assembly, and the specialized/branchless assembly from Chapter
24 — through the *identical* test harness from Chapter 18, on the identical input signal,
on the identical board. Every dimension except "which implementation is running" is held
fixed as a **controlled variable**: same FFT size, same clock speed, same sample size and
statistic (best-of-N, since the question here is raw variant speed, exactly as Chapter 18
recommended for algorithm comparisons). Any difference in the resulting numbers can then
be attributed to the implementation itself, and nothing else.

## Building a Comparison Matrix

The result of running every variant through the same harness is naturally organized as a
**comparison matrix** — a table with variants as rows and consistent metrics as columns,
extending Chapter 18's single-metric comparison table to several metrics at once:

| Variant | Kernel time | Total time | Code size | Memory usage |
|---|---|---|---|---|
| Plain Python FFT | — | slowest | smallest | lowest |
| `@micropython.native` | — | faster | slightly larger | similar |
| `@micropython.viper` | — | faster still | larger (type annotations) | similar |
| Hand-written assembly | fastest kernel | fast | larger (hand-unrolled) | lowest at runtime |
| Specialized/branchless assembly | fastest kernel | fastest overall (usually) | largest | lowest at runtime |

*(Illustrative structure — fill in your own measured numbers from your own board; the
point of this table is its shape, not any specific value printed here.)*

A visual companion to this matrix — bar charts, one per metric, letting you compare
variants at a glance rather than scanning table cells — is what this chapter calls a
**performance dashboard**: a compact, multi-metric visual summary built directly from the
comparison matrix's data, not a separate measurement.

#### Diagram: Variant Performance Dashboard

<iframe src="../../sims/variant-performance-dashboard/main.html" width="100%" height="566px" scrolling="no"></iframe>

<details markdown="1">
<summary>Variant Performance Dashboard</summary>
Type: chart
**sim-id:** variant-performance-dashboard<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy: Evaluate (L5) — assess, critique
Learning objective: Assess how a predicted ranking compares to a measured ranking across multiple metrics, and critique which metric best answers "which variant should I actually ship?"

Chart type: Grouped bar chart with a metric selector

Purpose: Let the learner switch between metrics (kernel time, total time, code size, memory) for the same five variants and observe that the "winner" can change depending on which metric is active

X-axis: Variant (Plain Python, @native, @viper, Assembly, Specialized Assembly)
Y-axis: Value in the selected metric's units, rescaled per metric

Data series (illustrative, editable by the learner — see interactive elements):
- Kernel time (μs): 21000, 9800, 3200, 850, 710
- Total time (μs): 21050, 9900, 3350, 1100, 950
- Code size (bytes): 400, 480, 620, 900, 1400
- Memory usage (bytes): 2048, 2048, 1536, 512, 512

Interactive elements:
- Dropdown: select active metric, bars re-render with that metric's values and units
- Toggle: "Overlay my ranking prediction" — lets the learner input their own predicted order (drag to reorder a small list) and see it displayed alongside the measured bars for direct visual comparison
- Hover any bar for its exact value

Title: "Same Five Variants, Four Different Rankings"
Legend: metric name shown as the active axis label

Implementation: Chart.js bar chart, metric switch re-maps the underlying dataset, drag-to-reorder implemented as a simple sortable list overlay
</details>

## Kernel Time Versus Total Time

The comparison matrix above deliberately splits **kernel versus total time**, because
conflating them is a common source of misleading variant comparisons. *Kernel time* is
the raw execution time of just the core computation — the hot loop from Chapter 23,
running in isolation. *Total time* includes everything surrounding it: converting input
data into whatever format the variant expects, calling into it, and collecting its
result.

Two costs specifically separate kernel time from total time. **Data marshalling cost** is
the price of converting data into the shape a particular variant requires before it can
even start — copying a plain Python list into a typed array before calling an assembly
routine, for instance, is real work that a plain-Python variant never has to pay at all,
because it can operate directly on the list it was already given. **Integration cost** is
the broader overhead of wiring a variant into the surrounding pipeline — crossing the
Python-assembly boundary from Chapter 23, argument passing, and any per-call setup — paid
every time the variant is invoked, not just once.

!!! mascot-thinking "A blazing-fast kernel can still lose on total time"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    If a hand-written assembly kernel is ten times faster than viper's, but marshalling
    the input into a typed array and crossing the Python-assembly boundary costs almost
    as much as viper's *entire* execution time, the assembly variant's total-time
    advantage shrinks dramatically — sometimes to the point of barely winning at all.
    Kernel time answers "how fast is the core idea," not "how fast is this in my actual
    program."

## Why Combined Optimizations Undersell Themselves: Sub-Linear Composition

Chapter 24 ended with a preview of this chapter's central idea, and it's worth stating in
full now. **Optimization composition** is the general question of how multiple
independent optimizations behave when applied together, rather than one at a time. The
naive expectation — that a 2× speedup and a 3× speedup, combined, should yield roughly a
6× speedup — is usually wrong. **Sub-linear composition** describes what actually happens
far more often: the combined speedup falls short of the product of the individual
speedups, because optimizations frequently compete for the same limited resource
(register pressure, instruction cache capacity, the same few cycles of loop overhead)
or address overlapping parts of the same bottleneck, so their gains partially cancel
rather than stack cleanly.

This is precisely why the specialized, fully-optimized assembly variant in the comparison
matrix above rarely hits the product of every individual Chapter 24 technique's
measured gain — trivial-twiddle skipping, branchless selection, loop unrolling, and
cache-aware ordering all compete, in some small way, for the same hot loop's limited
budget of registers and cache lines.

## When the Measurement Surprises You

!!! mascot-warning "A surprising result is data, not a failure"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If your measured ranking doesn't match your prediction — and it almost certainly
    won't, at least in part — resist the urge to treat that as something to fix or hide.
    Explaining *why* your prediction was wrong is worth more than a prediction that
    happened to be right.

A **surprising result** is any measured outcome that diverges meaningfully from the
ranking prediction made at the start of this chapter — viper beating hand-written
assembly on total time because of integration cost, say, or two variants tying because
one variant's larger code size pushed it out of the instruction cache. This course treats
a surprising result as valuable evidence about *why* the prediction failed, not as
something to quietly smooth over. Every quantitative prediction made while building this
course turned out optimistic in exactly this way — that pattern is preserved
deliberately, because being wrong on paper and then figuring out precisely why is a far
more durable lesson than a prediction landing right.

## One More Axis: The Speed-Accuracy Tradeoff

Raw speed is not the only axis worth comparing. A **speed accuracy tradeoff** exists
whenever a faster variant achieves its speed by giving up some precision or correctness
guarantee — Chapter 25's unbuilt fixed-point FFT is the clearest hypothetical example,
trading floating point's forgiving dynamic range for raw integer speed. Even among the
variants this course actually built, it's worth asking the question explicitly for each
one: does this variant produce the same bit-for-bit correct answer as the reference
implementation, or does its speed come with a quieter cost somewhere in the result?
A comparison matrix that reports only speed, with no column acknowledging this question,
is an incomplete comparison.

??? question "Your comparison matrix shows the specialized assembly variant has the fastest kernel time but only the second-fastest total time. What's the most likely explanation? Click to check."
    Integration cost or data marshalling cost eating into its kernel advantage — the
    specialized variant may require more setup (building the precomputed swap list from
    Chapter 24, for instance) before its fast hot loop can even start, work that a
    simpler variant skips entirely. This is exactly why kernel time and total time are
    reported separately rather than as one number.

!!! mascot-celebration "You've learned to distrust your own predictions, on purpose"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You're right on frequency! Predicting, measuring, and then explaining the gap between
    the two — that loop is the single most transferable skill this course teaches, and
    you've now run it on the hardest comparison yet: every variant you've built, head to
    head. Chapter 27 turns this same discipline outward, onto a project entirely of your
    own design.
