# Quiz: Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison

Test your understanding of how benchmarks can mislead and the statistical practices that defend against it with these review questions.

---

#### 1. What qualifies as a benchmark result, according to this chapter?

<div class="upper-alpha" markdown>
1. A measurement obtained under conditions controlled and documented well enough that someone else could reproduce it and get the same answer
2. A single, unrepeated timing reading printed to the console
3. Any number that includes the word "microseconds" in its output
4. The fastest possible execution time a chip could theoretically achieve
</div>

??? question "Show Answer"
    The correct answer is **A**. A benchmark result must be obtained under conditions controlled and documented well enough for someone else to reproduce it and get the same answer. A single, unrepeated reading rarely clears that bar — reproducibility, alongside a stated sample size and statistic, is what separates a citable result from an anecdote.

    **Concept Tested:** Benchmark Results

---

#### 2. What is the most disruptive variance source identified in this chapter for timing code on the Pico 2?

<div class="upper-alpha" markdown>
1. Ambient room temperature changes during the benchmark run
2. The programmer's typing speed while entering commands
3. Interrupt interference — the operating firmware periodically pausing running code to service hardware interrupts, adding unpredictable extra cycles
4. Differences in how MicroPython formats printed output
</div>

??? question "Show Answer"
    The correct answer is **C**. Interrupt interference — USB polling, the system tick, and background peripheral handling — pauses whatever code is running and adds extra, unpredictable cycles to any measurement taken at that moment. It is the most disruptive of several variance sources that make identical code produce different execution times run to run.

    **Concept Tested:** Interrupt Interference

---

#### 3. Why does this chapter recommend running an FFT 50 or 100 times rather than timing it once?

<div class="upper-alpha" markdown>
1. Because a single run is always exactly 50 times slower than the true value
2. Because MicroPython requires a minimum of 50 iterations before printing any output
3. Because running fewer than 50 times would exceed the real-time budget
4. Because statistical sampling treats the resulting set of numbers, not any single reading, as the actual result — enabling a mean execution time and standard deviation that together show both a typical value and how much to trust it
</div>

??? question "Show Answer"
    The correct answer is **D**. Statistical sampling runs the same measurement many times and treats the whole resulting set as the result. From that sample, mean execution time reports the typical value while standard deviation reports how spread out the individual runs were — reporting "412 μs ± 18 μs" together tells a reader far more than a single unrepeated number ever could.

    **Concept Tested:** Statistical Sampling

---

#### 4. Five FFT runs are timed at 400, 410, 395, 420, and 405 microseconds. What is the mean execution time?

<div class="upper-alpha" markdown>
1. 406 microseconds
2. 400 microseconds
3. 420 microseconds
4. 395 microseconds
</div>

??? question "Show Answer"
    The correct answer is **A**. Mean execution time is the ordinary average of every recorded run: (400+410+395+420+405) / 5 = 2,030 / 5 = 406 microseconds. Reporting this figure alongside its standard deviation, rather than any single one of the five readings, is what statistical sampling is built to produce.

    **Concept Tested:** Mean Execution Time

---

#### 5. When comparing two different FFT algorithms to determine which is fundamentally faster, why does this chapter recommend reporting best-of-N rather than the mean?

<div class="upper-alpha" markdown>
1. Best-of-N is easier to compute than a mean, requiring no division
2. The minimum sample resists interrupt interference, since a single interrupted run cannot raise it — making it the closest estimate of an algorithm's true, unburdened speed
3. Best-of-N always produces a larger number than the mean, making results look more impressive
4. The mean cannot be computed unless exactly 100 samples were collected
</div>

??? question "Show Answer"
    The correct answer is **B**. Because interrupt interference only ever makes runs slower, never faster, than the true best case, the minimum sample — the fastest run observed — is unaffected by any single interrupted run. Best-of-N reports this minimum, making it the better choice when comparing raw algorithm speed, while the mean is better suited to describing real-world, interference-included performance.

    **Concept Tested:** Best Of N

---

#### 6. A very short operation is timed, and the reported result seems suspiciously large relative to what the code should take. What effect does this chapter warn about?

<div class="upper-alpha" markdown>
1. Counter wraparound, which always inflates short-operation measurements
2. The mean execution time formula only works for operations longer than one millisecond
3. The observer effect — inserting timing instrumentation is not free, and the resulting timing overhead can become a significant fraction of the reported result for very short operations
4. Interrupt interference, which only affects operations shorter than 100 microseconds
</div>

??? question "Show Answer"
    The correct answer is **C**. The observer effect is the general principle that measurement itself is not free — reading a cycle counter, computing a masked subtraction, and storing a result all take cycles. This shows up as timing overhead, and for a very short operation, that overhead can dominate the reported result unless it is measured and accounted for separately.

    **Concept Tested:** Observer Effect

---

#### 7. A developer wants to estimate their instrumentation's own timing overhead before trusting any real measurement. What is the simplest way to do this, according to this chapter?

<div class="upper-alpha" markdown>
1. Time an empty block — call the exact same timing code around nothing at all, and see what elapsed time it reports
2. Compare results against a published benchmark from another research team
3. Double the reported execution time to account for instrumentation cost
4. Disable interrupts permanently before every benchmark run
</div>

??? question "Show Answer"
    The correct answer is **A**. Timing an empty block using the identical timing code reveals the instrumentation's own floor — the timing overhead contributed by reading the counter and recording a value, with no real work happening at all. Any measurement smaller than a few times that floor should be treated with real skepticism.

    **Concept Tested:** Timing Overhead

---

#### 8. A student benchmarks an FFT on a freshly powered-on board, then benchmarks a second implementation after twenty minutes of continuous operation. What is wrong with this comparison?

<div class="upper-alpha" markdown>
1. Nothing is wrong, since both runs used the same board
2. It violates reproducibility, because no other researcher owns the same physical board
3. It is invalid because best-of-N was not used for both runs
4. It is not a fair comparison, because it changes more than the one variable being tested — a warmer chip after twenty minutes may run differently regardless of which algorithm is faster
</div>

??? question "Show Answer"
    The correct answer is **D**. A fair comparison holds every condition constant except the one thing being compared — same input, same board, same clock speed, same temperature — so a measured difference can only be attributed to the one variable that changed. Comparing a cool, freshly powered board against a warmer one after twenty minutes may just be measuring temperature, not the two algorithms.

    **Concept Tested:** Fair Comparison

---

#### 9. How does processing latency, as defined in this chapter, differ from the general latency metric?

<div class="upper-alpha" markdown>
1. Processing latency is the general term, and latency metric is the specific case for a live spectrum analyzer
2. Processing latency is the specific case — time from a fresh sample being ready to its contribution appearing on screen — while the latency metric is the general term for "time from work becoming available to its result being ready"
3. Processing latency is measured in FFTs per second, while the latency metric is measured in microseconds
4. Processing latency and the throughput metric are two names for the same measurement
</div>

??? question "Show Answer"
    The correct answer is **B**. The latency metric is the general concept: time from when a unit of work becomes available to when its result is ready. Processing latency is the specific case for a live spectrum analyzer, covering the FFT itself plus every surrounding pipeline step, and is distinct from the throughput metric, which measures completed work per unit time rather than delay per unit of work.

    **Concept Tested:** Processing Latency

---

#### 10. A team builds a reusable system with shared timing utilities, a consistent way to report results, and stated conventions for sample size and statistic used across every benchmark in a project. What is this system called, and how does it relate to a single test harness?

<div class="upper-alpha" markdown>
1. A test harness; a benchmarking framework is one single run of that harness
2. Performance charts; a test harness is simply the visual output of that system
3. A benchmarking framework — the larger, reusable system built around one or more individual test harnesses, each of which presses the stopwatch repeatedly in a controlled loop
4. Memory usage tracking; a test harness only measures execution time, never memory
</div>

??? question "Show Answer"
    The correct answer is **C**. A test harness is the specific code that runs an operation a fixed number of times and computes summary statistics. A benchmarking framework is the larger system built around one or more such harnesses — shared conventions, reporting via performance charts, and consistent handling of dimensions like memory usage — that keeps every benchmark in a project comparable to every other one.

    **Concept Tested:** Benchmarking Framework

