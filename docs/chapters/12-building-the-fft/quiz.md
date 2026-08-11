# Quiz: Building the FFT: A Complete Recursive Implementation

Test your understanding of assembling, validating, and converting the FFT from recursive to iterative form with these review questions.

---

#### 1. What is divide and conquer, as a general algorithm design strategy?

<div class="upper-alpha" markdown>
1. A strategy that solves a problem by splitting it into smaller instances of the same problem, solving each, and combining their results
2. A strategy that iterates over an array exactly once, keeping a running total
3. A strategy unique to Fourier transforms, not used in other areas of computing
4. A strategy that increases input size to make patterns easier to detect
</div>

??? question "Show Answer"
    The correct answer is **A**. Divide and conquer is a general strategy, not unique to the FFT, that splits a problem into smaller instances, solves each, and combines results. Applied to computing a DFT, this becomes recursive decomposition, where each smaller instance is a subproblem handled through function decomposition — breaking one large task into smaller, self-contained functions.

    **Concept Tested:** Divide And Conquer

---

#### 2. What does O(N log N) notation describe about the FFT's algorithmic complexity?

<div class="upper-alpha" markdown>
1. An operation count that is constant regardless of N
2. An operation count that grows with the square of N
3. An operation count that grows proportionally to N multiplied by the logarithm of N
4. An operation count that grows exponentially with N
</div>

??? question "Show Answer"
    The correct answer is **C**. O(N log N) describes an operation count that grows proportionally to N times the logarithm of N — dramatically slower-growing than the DFT's O(N²), especially at large N. This is the formally derived FFT complexity, built from exactly log₂N logarithmic stages, each performing N/2 butterflies, giving a total butterfly count of (N/2)log₂N.

    **Concept Tested:** O(N log N)

---

#### 3. Why does this course's labs standardize on FFT sizes of 256, 512, and 1024 rather than arbitrary lengths like 300 or 600?

<div class="upper-alpha" markdown>
1. Because MicroPython only supports arrays with power-of-two lengths
2. Because twiddle factors are undefined for non-power-of-two sizes
3. Because the OLED display can only render power-of-two numbers of bars
4. Because the even-odd split must divide the array evenly at every recursive level, and only power-of-two sizes satisfy this constraint all the way down to size 1
</div>

??? question "Show Answer"
    The correct answer is **D**. The power-of-two constraint requires a radix-2 FFT's input size N to be a power of two so that recursive halving via the even-odd split always produces whole-number subproblem sizes with no leftover sample. This is why standard power-of-two sizes like 256, 512, and 1024 are chosen for a given FFT size, rather than arbitrary buffer lengths.

    **Concept Tested:** Power Of Two Constraint

---

#### 4. How does recursive decomposition achieve complexity reduction compared to the direct DFT?

<div class="upper-alpha" markdown>
1. It reduces the number of output bins the transform needs to produce
2. It eliminates redundant computation by reusing shared results instead of recalculating nearly identical sums from scratch for every output bin
3. It approximates the DFT's result rather than computing it exactly
4. It skips computing the imaginary part of each complex value
</div>

??? question "Show Answer"
    The correct answer is **B**. Complexity reduction is the decrease in operation count achieved by restructuring an algorithm to avoid redundant computation without changing correctness. The direct DFT recalculates a nearly identical sum for every output bin; recursive decomposition eliminates this waste directly, in part through symmetry exploitation of the twiddle factors' periodic structure.

    **Concept Tested:** Complexity Reduction

---

#### 5. An FFT of size N = 256 is computed. How many stages does it have, and how many total butterflies run across the whole transform?

<div class="upper-alpha" markdown>
1. 256 stages, 256 total butterflies
2. 16 stages, 2,048 total butterflies
3. 8 stages, 1,024 total butterflies
4. 8 stages, 256 total butterflies
</div>

??? question "Show Answer"
    The correct answer is **C**. Logarithmic stages means an FFT of size N performs exactly log₂N levels of recombination — log₂256 = 8 stages. Each stage performs N/2 = 128 butterflies, so the total butterfly count is (N/2) × log₂N = 128 × 8 = 1,024, matching the formula derived directly from the FFT size.

    **Concept Tested:** Butterfly Count

---

#### 6. In the iterative FFT's stage loop, the stage span starts at 1 in stage 1 and doubles at every subsequent stage. What is the stage span during stage 4?

<div class="upper-alpha" markdown>
1. 4
2. 8
3. 16
4. 1
</div>

??? question "Show Answer"
    The correct answer is **B**. The stage span is the distance, in array positions, between the two elements a butterfly combines at a given stage, starting at 1 and doubling every stage: stage 1 = 1, stage 2 = 2, stage 3 = 4, stage 4 = 8. This doubling pattern, executed by the iterative FFT's outer stage loop, mirrors how the recursive version's subproblems doubled in size at each level of recombination.

    **Concept Tested:** Stage Span

---

#### 7. Before the iterative FFT's stage loop begins, what operation reorders the entire input array using a precomputed permutation table?

<div class="upper-alpha" markdown>
1. The recombination step
2. The even-odd split
3. Cross validation
4. The bit reversal permutation, applied via swap operations for in-place reordering
</div>

??? question "Show Answer"
    The correct answer is **D**. A bit reversal permutation reorders an entire N-element array according to each element's bit-reversed index — as opposed to index reversal, which is the calculation for just one index — applied once before any butterflies run. This is performed using a lookup table called a permutation table, and physically carried out through repeated swap operations, achieving in-place reordering without allocating a second array.

    **Concept Tested:** Bit Reversal Permutation

---

#### 8. Why does this chapter cross-validate the new FFT against the Chapter 9 DFT before ever measuring its speed?

<div class="upper-alpha" markdown>
1. Because correctness before speed demands that a new algorithm be proven to produce identical results to a trusted reference implementation before its performance is measured or celebrated
2. Because the DFT is actually faster than the FFT for small N, so timing it first would be misleading
3. Because MicroPython cannot time two functions in the same script
4. Because cross validation only works after speed has already been measured
</div>

??? question "Show Answer"
    The correct answer is **A**. Correctness before speed is the governing principle that a faster algorithm must be proven correct before its performance is measured or celebrated, since a fast wrong answer is worthless. The Chapter 9 DFT serves as the reference implementation, and cross validation compares the FFT's output against it, bin by bin, within a numerical tolerance, before any speed claim is trusted.

    **Concept Tested:** Correctness Before Speed

---

#### 9. A cross-validated FFT computes a 512-point transform in 140 ms, but the frame duration for 512 samples at 16,000 Hz is only 32 ms, rounded to a 40 ms processing deadline. What does this 3.5× gap represent?

<div class="upper-alpha" markdown>
1. A precisely quantified motivation for optimization — the remaining gap between validated performance and the real-time deadline, not a vague sense that faster would be nice
2. Evidence that the FFT algorithm itself is still mathematically incorrect
3. Proof that the recombination step needs to be redesigned
4. An indication that a larger FFT size should be used instead
</div>

??? question "Show Answer"
    The correct answer is **A**. The motivation for optimization is the specific, quantified gap between a correct, validated implementation's current performance and the real-time budget it must meet — here, a precise 3.5× gap against the processing deadline derived from the frame duration, not a vague impression. Because cross-validation already proved the FFT correct, this remaining gap comes entirely from execution speed, not algorithmic error.

    **Concept Tested:** Motivation For Optimization

---

#### 10. In the recursive FFT function, the recombination step performs cross add and subtract to produce each butterfly pair. What would happen to correctness if this step were skipped and the even and odd results were simply concatenated instead?

<div class="upper-alpha" markdown>
1. The result would still be correct, since concatenation preserves the original sample order
2. The result would be incorrect, because the even and odd subproblems' results must be combined with twiddle-factor multiplication to reconstruct the full-size transform — simple concatenation ignores the phase relationship between them
3. The result would be correct only for N = 8
4. The result would be correct as long as bit reversal was applied first
</div>

??? question "Show Answer"
    The correct answer is **B**. The recombination step is where the two same-size subproblem results are combined using twiddle-factor multiplication and cross add and subtract, following the overall butterfly structure defined by algorithm assembly. Skipping it and merely concatenating the even and odd subproblem outputs would ignore the phase relationship the twiddle factors encode, producing an array that is not a valid transform result — function decomposition alone does not replace the recombination arithmetic.

    **Concept Tested:** Recombination Step

