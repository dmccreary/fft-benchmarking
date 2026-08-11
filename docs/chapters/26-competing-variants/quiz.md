# Quiz: Competing Variants: Predict, Measure, Explain

Test your understanding of variant comparison, kernel versus total time, sub-linear composition, and honest prediction-versus-measurement reporting with these review questions.

---

#### 1. What is a comparison matrix, as this chapter uses the term?

<div class="upper-alpha" markdown>
1. A single number summarizing the fastest variant's speedup over the slowest
2. A list of controlled variables held constant during a benchmark
3. A table with variants as rows and consistent metrics — such as kernel time, total time, code size, and memory usage — as columns
4. A chart showing only kernel time for a single variant across multiple runs
</div>

??? question "Show Answer"
    The correct answer is **C**. A comparison matrix extends Chapter 18's single-metric comparison table to several metrics at once, organizing every variant's results as rows against consistent columns like kernel time, total time, code size, and memory usage. A performance dashboard then turns that same matrix data into bar charts, one per metric, for a quicker visual comparison. Options A, B, and D each describe only a fragment of what the matrix actually contains.

    **Concept Tested:** Comparison Matrix

---

#### 2. What is a controlled variable in the context of a variant comparison?

<div class="upper-alpha" markdown>
1. A factor deliberately held constant across every variant being compared, so that any measured difference can be attributed only to the implementation itself
2. The single metric chosen to represent overall performance, such as total time
3. Any variable whose value is randomized between runs to increase statistical confidence
4. The specific FFT variant selected as the baseline for computing speedup ratios
</div>

??? question "Show Answer"
    The correct answer is **A**. A variant comparison holds every dimension except "which implementation is running" fixed — same FFT size, same clock speed, same sample size and statistic — as controlled variables, so that any difference in the resulting numbers can be attributed to the implementation and nothing else. Randomizing a variable (C) would work against this goal, not support it.

    **Concept Tested:** Controlled Variable

---

#### 3. How do kernel time and total time differ when comparing FFT variants?

<div class="upper-alpha" markdown>
1. Kernel time includes setup and I/O; total time measures only the hot loop
2. Kernel time and total time are two names for the same measurement, used interchangeably in this course
3. Kernel time is always larger than total time, since it includes compilation overhead
4. Kernel time is the raw execution time of just the core computation in isolation; total time adds everything surrounding it, including data marshalling and integration cost
</div>

??? question "Show Answer"
    The correct answer is **D**. Kernel time measures only the core computation — the hot loop running in isolation — while total time includes everything surrounding it: converting data into the format a variant expects, calling into it, and collecting the result. Conflating the two is a common source of misleading variant comparisons, which is exactly why the chapter's comparison matrix reports them as separate columns.

    **Concept Tested:** Kernel Versus Total Time

---

#### 4. Why does combining a 2x speedup optimization with a 3x speedup optimization usually yield less than the naively expected 6x combined speedup?

<div class="upper-alpha" markdown>
1. Because MicroPython caps the maximum possible speedup at 4x regardless of what is applied
2. Because optimizations frequently compete for the same limited resource, such as register pressure or instruction cache capacity, or address overlapping parts of the same bottleneck, so their gains partially cancel rather than stack cleanly
3. Because only one optimization can be active at a time on the Cortex-M33
4. Because measuring two optimizations together always doubles the measurement noise, masking the true combined gain
</div>

??? question "Show Answer"
    The correct answer is **B**. Optimization composition is the general question of how multiple optimizations behave when applied together; sub-linear composition describes the far more common outcome than the naive product-of-speedups expectation, because combined optimizations frequently compete for the same limited resource or overlap in what they are each trying to save, so their gains partially cancel instead of stacking. This is precisely why the specialized, fully-optimized assembly variant rarely hits the product of every individual Chapter 24 technique's measured gain.

    **Concept Tested:** Sub Linear Composition

---

#### 5. A comparison matrix shows the specialized assembly variant has by far the fastest kernel time, but its total-time advantage over `@viper` is much smaller than the kernel-time gap would suggest. What is the most likely explanation?

<div class="upper-alpha" markdown>
1. The variant comparison's harness must be broken, since kernel time and total time should always scale together
2. Viper's boxed values make its kernel time artificially fast, masking assembly's true advantage
3. Data marshalling cost and integration cost — converting input into a typed array and crossing the Python-assembly boundary — eat into the kernel's raw speed advantage once counted in total time
4. The specialized assembly variant must contain a bug, since a fast kernel should always produce the fastest total time
</div>

??? question "Show Answer"
    The correct answer is **C**. Data marshalling cost (converting data into the shape a variant requires) and integration cost (the overhead of wiring a variant into the surrounding pipeline, such as crossing the Python-assembly boundary) are paid on every call and do not shrink just because the kernel itself is fast. A blazing-fast kernel can still lose much of its total-time advantage once these costs are counted, which is exactly why the chapter reports kernel and total time as separate columns rather than assuming they track together.

    **Concept Tested:** Data Marshalling Cost

---

#### 6. A student predicts, before measuring, that hand-written assembly will beat `@viper` on every metric. After measuring, `@viper` turns out faster on total time specifically, though not on kernel time. How should this course's methodology treat this outcome?

<div class="upper-alpha" markdown>
1. As proof that the benchmark harness is unreliable and should be discarded
2. As evidence that the ranking prediction step should be skipped in future chapters, since predictions are unreliable
3. As a result that should be quietly re-measured until it matches the original prediction
4. As a surprising result worth investigating and explaining — for instance, checking whether integration cost or data marshalling cost ate into assembly's kernel advantage — rather than something to hide or dismiss
</div>

??? question "Show Answer"
    The correct answer is **D**. This ranking prediction exercise — committing to a fastest-to-slowest guess before measuring — sets up exactly this kind of divergence. A surprising result is any measured outcome that diverges meaningfully from that prediction, and this course treats it as valuable evidence about why the prediction failed, not something to fix or hide. Every quantitative prediction made while building this course turned out optimistic in a similar way — the point of ranking prediction is not to be right, but to create something concrete to explain once reality disagrees with it.

    **Concept Tested:** Surprising Result

---

#### 7. Two variants report identical kernel times in a comparison matrix, yet one variant consistently loses on total time. Applying kernel-versus-total-time reasoning, which additional column in the matrix would most directly help explain the gap?

<div class="upper-alpha" markdown>
1. A column breaking out data marshalling cost and integration cost separately from kernel time
2. A column reporting each variant's code size in bytes
3. A column reporting the board's clock speed, since both variants presumably ran on the same board
4. A column reporting which programming language was used to write each variant
</div>

??? question "Show Answer"
    The correct answer is **A**. If kernel times match but total times diverge, the gap must live in what total time adds on top of the kernel — data marshalling cost and integration cost. Breaking those out as their own column turns an unexplained gap into a specific, attributable cause, rather than leaving the difference buried inside one combined "total time" number. Code size, clock speed, and language choice do not directly explain a kernel-time-versus-total-time gap.

    **Concept Tested:** Integration Cost

---

#### 8. A hypothetical fixed-point FFT variant is 20% faster than the course's floating-point assembly variant on kernel time, but does not guarantee a bit-for-bit match against the Python reference. How should a comparison matrix that reports only speed handle this situation?

<div class="upper-alpha" markdown>
1. It should simply report the fixed-point variant as the winner, since kernel time is the only metric that matters
2. It should omit the fixed-point variant entirely, since any accuracy difference makes it disqualified from comparison
3. It should recognize a speed accuracy tradeoff and include a column acknowledging whether each variant preserves bit-for-bit correctness, since a matrix reporting only speed is an incomplete comparison
4. It should average the fixed-point variant's speed with its accuracy loss into a single combined score
</div>

??? question "Show Answer"
    The correct answer is **C**. A speed accuracy tradeoff exists whenever a faster variant achieves its speed by giving up some precision or correctness guarantee. A comparison matrix that reports only speed, with no column acknowledging this question, is an incomplete comparison — the chapter is explicit that this question is worth asking for every variant, not only the hypothetical fixed-point case.

    **Concept Tested:** Speed Accuracy Tradeoff

---

#### 9. A performance dashboard lets a team switch between four metrics — kernel time, total time, code size, and memory usage — and the "winner" variant changes depending on which metric is selected. For a product that calls the FFT once per audio frame in a real-time pipeline, which metric best answers "which variant should we actually ship," and why?

<div class="upper-alpha" markdown>
1. Code size, because flash usage is always the most business-critical constraint regardless of application
2. Total time, because it captures the full per-call cost — including data marshalling and integration cost — that the real-time pipeline actually pays on every frame
3. Kernel time, because it isolates the core algorithm's raw speed independent of any implementation detail
4. Memory usage, because a variant with lower memory usage is always preferable in an embedded system
</div>

??? question "Show Answer"
    The correct answer is **B**. Kernel time answers "how fast is the core idea," not "how fast is this in my actual program." A real-time pipeline that calls the FFT once per frame pays the full per-call cost every time, including data marshalling and integration cost, so total time is the metric that reflects what actually happens in production — exactly the distinction a variant comparison is built to expose rather than obscure behind one flattering number.

    **Concept Tested:** Variant Comparison

---

#### 10. You are designing a comparison matrix for a battery-powered wearable device that calls the FFT continuously and where every joule matters as much as every microsecond. Which additional column would best extend this chapter's comparison matrix to support that specific decision?

<div class="upper-alpha" markdown>
1. A column listing each variant's original author, to give credit for the implementation
2. A column listing the GitHub star count of any library each variant depends on
3. A column recording the total number of lines of source code for each variant
4. A column recording energy consumed per call (or per frame), alongside the existing kernel time, total time, code size, and memory columns, since neither raw speed nor code size alone captures power draw
</div>

??? question "Show Answer"
    The correct answer is **D**. The comparison matrix's whole design principle is choosing columns that make the actual decision visible — kernel time, total time, code size, and memory usage answer speed and footprint questions, but none of them capture energy per call. For a battery-constrained wearable, extending the matrix with a measured energy column follows the same logic the chapter applies to speed and accuracy: report the dimension that actually matters for the decision at hand, rather than assuming faster always means better.

    **Concept Tested:** Performance Dashboard

---
