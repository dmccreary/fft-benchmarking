# Quiz: FFT Variants, Complexity, and Correctness

Test your understanding of FFT variants beyond radix-2, the inverse transform, and calibrating against professional libraries with these review questions.

---

#### 1. How does decimation in frequency differ from the decimation in time strategy built in earlier chapters?

<div class="upper-alpha" markdown>
1. It requires a different, non-power-of-two input size
2. It splits the problem by output frequency bin instead of input sample index, performing the butterfly-like combination step first, then recursing
3. It computes a completely different, non-equivalent result
4. It eliminates the need for twiddle factors entirely
</div>

??? question "Show Answer"
    The correct answer is **B**. Decimation in frequency splits by output bin rather than input index, running the butterfly step before recursing instead of after. Both approaches compute the identical, mathematically correct result at the identical O(N log N) complexity — they differ only in where the butterfly falls relative to the recursive splits, and decimation in frequency's bit-reversal permutation lands on the output instead of the input.

    **Concept Tested:** Decimation In Frequency

---

#### 2. What distinguishes a radix-4 FFT from the radix-2 FFT built earlier in this course?

<div class="upper-alpha" markdown>
1. It only works for real-valued input signals
2. It computes the inverse transform instead of the forward transform
3. It eliminates the power-of-two size requirement entirely
4. It splits each stage into four sub-transforms instead of two, requiring only log₄N stages rather than log₂N
</div>

??? question "Show Answer"
    The correct answer is **D**. A radix-4 FFT splits each stage into four sub-transforms instead of two, needing only log₄N stages rather than log₂N — fewer stages, at the cost of a larger combination step within each one. Like split-radix FFT, it does not change the underlying O(N log N) complexity class, only the constant factor and implementation complexity.

    **Concept Tested:** Radix-4 FFT

---

#### 3. What tradeoff does a split-radix FFT make compared to the straightforward radix-2 version?

<div class="upper-alpha" markdown>
1. It requires a larger input size than radix-2 to work correctly
2. It sacrifices correctness for a modest speed gain
3. It minimizes the total number of multiplications, among the lowest known for power-of-two sizes, at the cost of a noticeably more intricate implementation
4. It cannot be validated using cross-validation techniques
</div>

??? question "Show Answer"
    The correct answer is **C**. A split-radix FFT is a hybrid technique mixing radix-2 and radix-4 splitting, specifically chosen to minimize total multiplications — among the lowest counts known for power-of-two sizes — achieved at the cost of more intricate, mixed butterfly shapes than the uniform radix-2 structure. It remains exactly correct and O(N log N), just harder to implement.

    **Concept Tested:** Split Radix FFT

---

#### 4. Why does a real FFT typically run roughly twice as fast as a general complex FFT when both process this course's captured audio?

<div class="upper-alpha" markdown>
1. Because a real FFT exploits spectrum symmetry to skip computing the redundant upper half of the spectrum for real-valued input, while a complex FFT computes the full result regardless
2. Because real FFT uses a fundamentally different algorithm unrelated to Cooley-Tukey
3. Because complex FFT skips computing the phase spectrum entirely
4. Because a real FFT uses fewer twiddle factors than are mathematically required
</div>

??? question "Show Answer"
    The correct answer is **A**. A real FFT is optimized specifically for real-valued input, exploiting spectrum symmetry to skip the redundant upper half of the spectrum. A complex FFT, by contrast, accepts input that may have a nonzero imaginary part and computes a full, general-purpose result — exactly the recursive and iterative functions built in earlier chapters — even though this course's microphone samples always have zero imaginary part.

    **Concept Tested:** Real FFT

---

#### 5. A library applies no scaling on its forward transform and divides by N on the inverse transform. If N = 100, what normalization factor is applied specifically on the inverse transform?

<div class="upper-alpha" markdown>
1. 100
2. 1/100
3. 1/10
4. No factor is applied
</div>

??? question "Show Answer"
    The correct answer is **B**. A normalization factor is the specific numeric multiplier — commonly 1/N, 1/√N, or none at all — applied to control a transform's output scale. In this convention, the inverse transform applies 1/N, so with N=100 the factor is 1/100. This is one specific choice of FFT scaling; other libraries split the scaling differently between the forward and inverse directions.

    **Concept Tested:** Normalization Factor

---

#### 6. What two specific changes does the IFFT algorithm make to the forward FFT's machinery to compute an inverse transform?

<div class="upper-alpha" markdown>
1. It uses a completely different set of butterfly operations and discards the twiddle factor table
2. It doubles the number of stages and skips bit reversal
3. It reuses the identical recursive structure and butterflies, flipping the sign inside the twiddle factor's exponent and dividing the final result by N
4. It only works for real-valued spectra, not complex ones
</div>

??? question "Show Answer"
    The correct answer is **C**. The IFFT algorithm is the fast, divide-and-conquer counterpart to the inverse DFT: it reuses the identical recursive structure, twiddle factors, and butterflies as the forward FFT, with two small changes — the twiddle factor's exponent sign flips from negative to positive, and the result is divided by N. Running it on a spectrum produces the inverse FFT, computed in O(N log N) time rather than the inverse DFT's O(N²).

    **Concept Tested:** IFFT Algorithm

---

#### 7. A student wants to cross-check their from-scratch FFT's output against a professionally engineered, desktop-only reference. Which two tools does this chapter recommend for that purpose?

<div class="upper-alpha" markdown>
1. The Pico 2's built-in MicroPython FFT module
2. A second, independently written radix-2 FFT on the same board
3. The Chapter 9 DFT and the Chapter 12 recursive FFT only
4. The NumPy library's numpy.fft.fft() and SciPy FFT's scipy.fft
</div>

??? question "Show Answer"
    The correct answer is **D**. The NumPy library provides a highly optimized, compiled numpy.fft.fft() function, and SciPy FFT (scipy.fft) offers additional specialized variants, including a dedicated real-FFT function. Neither runs on the Pico 2 itself — MicroPython includes neither library — so they serve strictly as a desktop-only reference point for cross-checking, independent of the from-scratch DFT and FFT already built in this course.

    **Concept Tested:** NumPy Library

---

#### 8. A student's FFT and a NumPy FFT are run on the same signal, but NumPy's magnitude values are consistently N times larger. What is the most likely explanation?

<div class="upper-alpha" markdown>
1. The two implementations apply their normalization factor at different points in the forward/inverse pair — a scaling mismatch, not a correctness bug
2. NumPy's FFT is buggy and should not be trusted
3. The student's FFT is incorrect and needs to be rewritten
4. NumPy always operates on real FFT input while the student's implementation is a complex FFT
</div>

??? question "Show Answer"
    The correct answer is **A**. FFT scaling is the convention a library adopts for where and how much normalization it applies across the forward and inverse transform. A consistent factor-of-N mismatch between two mathematically correct implementations is one of the most common false alarms in signal processing — always check each library's documented scaling convention before concluding a bug exists.

    **Concept Tested:** FFT Scaling

---

#### 9. A signal is forward-transformed and then immediately inverse-transformed back using a library's chosen scaling convention. What happens to the signal, regardless of which valid scaling convention (no forward scaling with 1/N inverse, or 1/√N on both directions) is used?

<div class="upper-alpha" markdown>
1. It is scaled up by a factor of N every time
2. It is always reconstructed exactly, since the forward-then-inverse round trip is scaling-convention-independent as long as the two stages together apply the correct total factor
3. It loses its imaginary component entirely
4. It only reconstructs correctly if N is a power of two
</div>

??? question "Show Answer"
    The correct answer is **B**. Different FFT scaling conventions place the normalization factor at different points in the forward/inverse pair, but a complete round trip always reconstructs the original signal exactly, because the two stages' factors combine to the same total regardless of how they are split. This is why comparing raw magnitude values across libraries requires checking scaling convention, even though round-trip correctness never depends on it.

    **Concept Tested:** Normalization Factor

---

#### 10. A microcontroller engineer must transform real-valued microphone samples as fast as possible, choosing between a general complex FFT and a real FFT, both using radix-2. Which choice better fits the situation, and why?

<div class="upper-alpha" markdown>
1. The complex FFT, because real FFT only works for synthetic test signals, not live microphone data
2. Neither — only a split-radix FFT can process real-valued microphone samples
3. The complex FFT, because it is the only variant validated by cross-validation against the DFT
4. The real FFT, because it exploits the guaranteed spectrum symmetry of real-valued input to skip computing the redundant half of the spectrum, while a complex FFT would waste effort computing values a real-valued signal makes unnecessary
</div>

??? question "Show Answer"
    The correct answer is **D**. Every microphone-captured signal in this course is a real FFT's ideal use case: since real-valued input guarantees the upper half of the spectrum mirrors the lower half, a real FFT skips that redundant computation and runs roughly twice as fast as a complex FFT processing the identical signal, without sacrificing any correctness.

    **Concept Tested:** Real FFT

