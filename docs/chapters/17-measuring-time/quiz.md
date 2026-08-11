# Quiz: Measuring Time: The DWT Cycle Counter

Test your understanding of the ARM DWT cycle counter and the performance vocabulary it enables with these review questions.

---

#### 1. What is benchmarking, as defined in this chapter?

<div class="upper-alpha" markdown>
1. The process of proving an algorithm's mathematical correctness against a reference implementation
2. A one-time visual comparison of two programs' outputs
3. The disciplined practice of measuring a program's performance under controlled, repeatable conditions
4. The act of optimizing code until it passes a fixed performance threshold
</div>

??? question "Show Answer"
    The correct answer is **C**. Benchmarking answers a different question than correctness: not *what* an algorithm computes, but *how long* it takes, measured in a way another person could reproduce and trust. Every specific performance claim later in this course — 146× faster, 3.5× over budget — rests on the disciplined, repeatable measurement practice this chapter builds.

    **Concept Tested:** Benchmarking

---

#### 2. What is a clock cycle, and why does it matter for timing an FFT precisely?

<div class="upper-alpha" markdown>
1. It is the smallest unit of time the processor's digital logic advances by; at 150 MHz, one cycle lasts 6.67 nanoseconds, giving far finer timer resolution than a millisecond clock
2. It is the time MicroPython takes to execute one line of source code, roughly one millisecond
3. It is a unit used only for measuring memory access speed, not instruction timing
4. It is the interval between two consecutive interrupt service routine calls
</div>

??? question "Show Answer"
    The correct answer is **A**. A clock cycle is the smallest unit of time the processor's digital logic advances by. At the Pico 2's 150 MHz clock speed, one cycle lasts 6.67 nanoseconds — the timer resolution counting cycles gives for free, compared to a millisecond-resolution software clock that cannot distinguish a 100-microsecond operation from a 200-microsecond one.

    **Concept Tested:** Clock Cycles

---

#### 3. What must happen before the Cortex-M33's CYCCNT register will begin incrementing?

<div class="upper-alpha" markdown>
1. Nothing — CYCCNT increments automatically from the moment the board powers on
2. Both the DEMCR register's TRCENA bit and the DWT unit's CYCCNTENA bit must be set to 1, using register bit manipulation that touches only those specific bits
3. The board must be running MicroPython version 1.20 or later
4. Only the DWT unit's CYCCNTENA bit needs to be set; DEMCR is not involved
</div>

??? question "Show Answer"
    The correct answer is **B**. The DWT unit's cycle counter, held in the CYCCNT register, only starts counting once the DEMCR register's master TRCENA bit and the DWT control register's CYCCNTENA bit are both set to 1. This requires register bit manipulation — using a bitmask and the OR operator to set exactly one bit without disturbing its neighbors.

    **Concept Tested:** DWT Unit

---

#### 4. Why does this chapter recommend verifying the cycle counter against a trusted millisecond timer before using it for real measurements?

<div class="upper-alpha" markdown>
1. Because a typo in a register address, an unexpected clock speed, or a counter that was never enabled can all produce plausible-looking but completely wrong numbers
2. Because CYCCNT only works correctly after being verified once per power cycle
3. Because MicroPython requires a calibration certificate before trusting hardware timers
4. Because the millisecond timer is always more accurate than the cycle counter
</div>

??? question "Show Answer"
    The correct answer is **A**. Counter verification confirms the cycle counter actually advances at the expected rate before trusting any measurement it produces. Comparing a measured 100-millisecond delta against the predicted 15,000,000 cycles at 150 MHz catches address typos, wrong clock assumptions, or a never-enabled counter — problems best found before recording a table of results, not after.

    **Concept Tested:** Counter Verification

---

#### 5. CYCCNT reads start = 4,294,966,000 right before wraparound, and end = 2,000 right after. Using the masked-subtraction formula `elapsed = (end - start) & 0xFFFFFFFF`, approximately how many cycles elapsed?

<div class="upper-alpha" markdown>
1. −4,294,964,000 cycles
2. 4,294,966,000 cycles
3. 2,000 cycles
4. 3,296 cycles
</div>

??? question "Show Answer"
    The correct answer is **D**. Counter wraparound means the 32-bit CYCCNT rolls back to 0 after reaching 4,294,967,295. The true elapsed distance is (4,294,967,296 − 4,294,966,000) + 2,000 = 1,296 + 2,000 = 3,296 cycles. A naive subtraction (option A) produces a nonsensical large negative number instead, which masked subtraction correctly avoids.

    **Concept Tested:** Counter Wraparound

---

#### 6. An operation takes 9,000 elapsed cycles on a board running at 150 MHz. Using the cycles-to-microseconds conversion, approximately how long did the operation take?

<div class="upper-alpha" markdown>
1. 9,000 microseconds
2. 60 microseconds
3. 6 microseconds
4. 1,350,000 microseconds
</div>

??? question "Show Answer"
    The correct answer is **B**. Cycles to microseconds divides the elapsed cycle count by the clock frequency in MHz: 9,000 / 150 = 60 microseconds. A microsecond timer wraps exactly this calculation into a reusable function, and a millisecond timer simply divides that result by 1,000 again for coarser reporting.

    **Concept Tested:** Cycles To Microseconds

---

#### 7. A 512-point FFT takes 200 microseconds per FFT to execute. Using the throughput formula 1,000,000 / microseconds per FFT, approximately how many FFTs per second could the chip compute if run back to back?

<div class="upper-alpha" markdown>
1. 500 FFTs per second
2. 50,000 FFTs per second
3. 5,000 FFTs per second
4. 200 FFTs per second
</div>

??? question "Show Answer"
    The correct answer is **C**. FFTs per second, this course's throughput metric, is computed as 1,000,000 / microseconds per FFT: 1,000,000 / 200 = 5,000 FFTs per second. Microseconds per FFT and FFTs per second describe the same underlying speed from two different angles — one a per-run duration, the other a rate — and both belong to this chapter's shared vocabulary of performance metrics.

    **Concept Tested:** FFTs Per Second

---

#### 8. An old implementation takes 21,000 microseconds; a new implementation takes 140 microseconds for the same task. What is the speedup factor?

<div class="upper-alpha" markdown>
1. 0.0067×
2. 21,140×
3. 20,860×
4. 150×
</div>

??? question "Show Answer"
    The correct answer is **D**. Speedup factor is computed as old time divided by new time: 21,000 / 140 = 150. A speedup factor of 150 means the new version finishes in 1/150th of the time the old version took — the same kind of ratio Chapter 12 reported (146×) for the recursive FFT compared against the brute-force DFT.

    **Concept Tested:** Speedup Factor

---

#### 9. How does execution time differ from throughput as performance metrics?

<div class="upper-alpha" markdown>
1. Execution time measures how long one specific run takes; throughput measures how much work completes per unit of time, such as FFTs per second
2. Execution time and throughput are two names for the exact same measurement
3. Execution time is always measured in FFTs per second, while throughput is measured in microseconds
4. Throughput can only be computed after a speedup factor has been calculated
</div>

??? question "Show Answer"
    The correct answer is **A**. Execution time is the elapsed time for one specific run of an operation — the direct output of a cycle-based timer. Throughput answers a different question, how much work completes per unit of time, with FFTs per second serving as this course's natural throughput metric. These are two distinct, independently useful performance metrics, not interchangeable labels for the same number.

    **Concept Tested:** Performance Metrics

---

#### 10. A benchmark occasionally reports large negative or absurdly huge "elapsed time" values for otherwise ordinary, short operations. What is the most likely root cause?

<div class="upper-alpha" markdown>
1. The DWT unit was disabled partway through the benchmark run
2. The clock frequency changed from 150 MHz to 50 MHz mid-run
3. The millisecond timer and the cycle counter are being averaged together incorrectly
4. The benchmark is subtracting two CYCCNT readings naively across a counter wraparound event instead of using masked subtraction
</div>

??? question "Show Answer"
    The correct answer is **D**. Counter wraparound is completely normal — CYCCNT silently rolls over to 0 roughly every 28.6 seconds at 150 MHz — but a naive `end - start` subtraction across that rollover produces a huge negative or nonsensical number. The fix, `(end - start) & 0xFFFFFFFF`, wraps the arithmetic to match the wrapped hardware and is a pattern worth memorizing beyond this one course.

    **Concept Tested:** Counter Wraparound

