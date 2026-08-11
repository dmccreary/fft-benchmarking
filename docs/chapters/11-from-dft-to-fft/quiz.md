# Quiz: From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly

Test your understanding of the Cooley-Tukey insight, twiddle factors, and the butterfly operation with these review questions.

---

#### 1. What does DC offset removal specifically do to a captured audio signal?

<div class="upper-alpha" markdown>
1. Subtracts the signal's average value from every sample, centering it on zero
2. Rescales the signal so its peak amplitude reaches a target value
3. Applies a window function to taper the signal's edges toward zero
4. Converts the signal into the frequency domain before any transform runs
</div>

??? question "Show Answer"
    The correct answer is **A**. DC offset removal subtracts a signal's average (DC) value from every sample, centering it on zero before any frequency analysis. It is one of two named preprocessing steps in this chapter's signal preprocessing pipeline — the other being amplitude normalization (option B), which rescales loudness rather than removing offset. Both fall under the broader category of audio processing.

    **Concept Tested:** DC Offset Removal

---

#### 2. According to the chapter, whose 1965 paper is the FFT algorithm this course builds most directly traced to?

<div class="upper-alpha" markdown>
1. Carl Friedrich Gauss
2. John von Neumann and Alan Turing
3. James Cooley and John Tukey
4. Joseph Fourier and Pierre-Simon Laplace
</div>

??? question "Show Answer"
    The correct answer is **C**. The Cooley-Tukey algorithm traces to a 1965 paper by James Cooley and John Tukey, published while working on unrelated seismic and nuclear test-detection data. FFT history notes that Gauss (option A) sketched an equivalent method in 1805, but it went largely unnoticed for over a century — the underlying idea existed long before computers made the general FFT algorithm family practical to use.

    **Concept Tested:** Cooley Tukey Algorithm

---

#### 3. What does decimation in time specifically do to an N-sample input before computing smaller DFTs?

<div class="upper-alpha" markdown>
1. Splits the output spectrum by frequency bin instead of input sample index
2. Splits the input into even-indexed and odd-indexed sub-sequences
3. Splits the input into its real and imaginary parts
4. Pads the input with zeros to the next power of two
</div>

??? question "Show Answer"
    The correct answer is **B**. Decimation in time splits an N-sample input into two smaller sequences — one containing every even-indexed sample, one containing every odd-indexed sample — computes a smaller DFT on each, and combines the results. Option A describes decimation in frequency, an alternative strategy covered in a later chapter, not the time-domain splitting used here.

    **Concept Tested:** Decimation In Time

---

#### 4. Why must a radix-2 FFT's input size N be a power of two?

<div class="upper-alpha" markdown>
1. Because twiddle factors are only defined for powers of two
2. Because bit reversal only works on even numbers
3. Because MicroPython's array slicing requires power-of-two lengths
4. Because the algorithm always splits the current problem into exactly two equal halves at every stage, requiring even division all the way down
</div>

??? question "Show Answer"
    The correct answer is **D**. A radix-2 FFT always splits the current problem into exactly two equal halves at every stage of recursion, so N must divide evenly by two, repeatedly, all the way down to size 1. This is why this course standardizes on power-of-two sizes like 256, 512, and 1024 rather than arbitrary buffer lengths.

    **Concept Tested:** Radix-2 FFT

---

#### 5. What are twiddle factors, and how do they relate to the roots of unity?

<div class="upper-alpha" markdown>
1. Twiddle factors are the specific roots of unity, W_N^k = e^(-i2πk/N), used to multiply and rotate one sub-transform's output before combining it with the other
2. Twiddle factors are real-valued scaling constants unrelated to complex numbers
3. Twiddle factors are computed only for the final stage of an FFT, not any earlier stage
4. Twiddle factors are a completely different set of numbers from roots of unity, computed independently for each FFT
</div>

??? question "Show Answer"
    The correct answer is **A**. Twiddle factors are the specific roots of unity used to recombine the even and odd sub-transforms in an FFT, correctly accounting for the phase relationship between the two halves. Because they depend only on N and k, never on the input's actual values, this course stores them once in a twiddle factor table via precomputation rather than recalculating sine and cosine on every use.

    **Concept Tested:** Twiddle Factors

---

#### 6. Using the four multiply form of complex multiplication, what is the result of (2 + 3i) × (4 + 1i)?

<div class="upper-alpha" markdown>
1. 8 + 3i
2. 11 + 10i
3. 5 − 14i
4. 5 + 14i
</div>

??? question "Show Answer"
    The correct answer is **D**. Complex multiplication follows (a+bi)(c+di) = (ac−bd) + (ad+bc)i. With a=2, b=3, c=4, d=1: real part = (2×4)−(3×1) = 8−3 = 5, imaginary part = (2×1)+(3×4) = 2+12 = 14, giving 5+14i. This is the four multiply form every butterfly operation in this course's FFT relies on, using four real multiplications and two real additions/subtractions.

    **Concept Tested:** Complex Multiplication

---

#### 7. A butterfly operation combines even-transform value a = 4 with odd-transform value b = 2, using a twiddle factor W = 1. What are output1 and output2?

<div class="upper-alpha" markdown>
1. output1 = 8, output2 = 8
2. output1 = 6, output2 = 2
3. output1 = 2, output2 = 6
4. output1 = 6, output2 = −6
</div>

??? question "Show Answer"
    The correct answer is **B**. The butterfly operation computes output1 = a + W×b and output2 = a − W×b, reusing the identical product W×b for both. Here W×b = 1×2 = 2, so output1 = 4+2 = 6 and output2 = 4−2 = 2. This shared-product structure, drawn as the classic X-shaped butterfly diagram (an instance of a data flow graph), is what makes the operation cheap: one multiplication produces two outputs.

    **Concept Tested:** Butterfly Operation

---

#### 8. For an 8-sample array, bit reversal is applied before an in-place radix-2 FFT using 3-bit indices. What position does the sample originally at index 1 move to?

<div class="upper-alpha" markdown>
1. Index 1
2. Index 2
3. Index 4
4. Index 7
</div>

??? question "Show Answer"
    The correct answer is **C**. Index 1 in 3-bit binary is `001`. Reversing the bit order gives `100`, which is 4 in decimal, so the sample at index 1 moves to index 4 before the in-place butterflies begin. This reordering is a mechanical consequence of how repeated even/odd splitting scrambles sample order, and the results are typically stored using interleaved storage (real, imaginary pairs) in memory.

    **Concept Tested:** Bit Reversal

---

#### 9. A colleague suggests allocating a brand-new array at every recursive call instead of using bit reversal and in-place computation, arguing it would be "simpler to reason about." What cost does this trade-off ignore on a memory-constrained microcontroller?

<div class="upper-alpha" markdown>
1. It would eliminate the need for twiddle factors
2. It would make the algorithm's complexity worse than O(N log N)
3. It would require recomputing the DFT reference implementation
4. It would consume significantly more RAM by allocating separate memory at every recursive stage, which an in-place FFT avoids
</div>

??? question "Show Answer"
    The correct answer is **D**. An in-place FFT overwrites its own input array with intermediate and final results rather than allocating new memory at every recursive step, which is essential on a device with only kilobytes of RAM. Allocating a fresh array at each call would not change the algorithm's O(N log N) complexity (B) or affect twiddle factors (A) — its real cost is memory pressure, which bit reversal and in-place reordering are specifically designed to avoid.

    **Concept Tested:** In Place FFT

---

#### 10. An FFT implementation recalculates cos() and sin() inside every single butterfly rather than using a precomputed twiddle factor table. What optimization principle does this violate?

<div class="upper-alpha" markdown>
1. Loop invariant hoisting — the twiddle factor value never changes for a given N, so recomputing it on every pass wastes effort that computing it once, before any stage runs, would avoid
2. Bit reversal — the twiddle factors must be reordered before use, and skipping this step produces wrong results
3. Symmetry exploitation — recalculating trig functions doubles the total butterfly count needed
4. In-place reordering — recalculating twiddle factors requires allocating a second array
</div>

??? question "Show Answer"
    The correct answer is **A**. Loop invariant hoisting moves a computation out of a loop when its result does not change across iterations. Since a twiddle factor's value depends only on N and k, not on the data being transformed, looking it up from a precomputed table instead of recalculating cos() and sin() at every one of an FFT's log₂N stages is this principle in its purest form — the chapter's first optimization habit.

    **Concept Tested:** Loop Invariant Hoisting

