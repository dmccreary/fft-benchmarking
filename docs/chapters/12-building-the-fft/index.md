---
title: 'Building the FFT: A Complete Recursive Implementation'
description: Assemble divide-and-conquer, twiddle factors, and the butterfly into a complete, validated FFT, then convert it to an iterative in-place form.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:20:00
version: 0.09
---

# Building the FFT: A Complete Recursive Implementation

## Summary

This chapter assembles the divide-and-conquer decomposition, twiddle factors, and butterfly operation from the previous chapter into a complete, working recursive FFT, walking through the recombination step, the logarithmic stage count, and the resulting O(N log N) complexity. It cross-validates the result against the DFT built earlier to confirm correctness before ever discussing speed. This is the single largest chapter in the book because it is where the course's central algorithm actually comes together.

## Concepts Covered

This chapter covers the following 35 concepts from the learning graph:

1. Algorithm Assembly
2. Bit Reversal Permutation
3. Butterfly Count
4. Butterfly Pair
5. Butterfly Structure
6. Complexity Reduction
7. Correctness Before Speed
8. Cross Add And Subtract
9. Cross Validation
10. Divide And Conquer
11. Even Odd Split
12. FFT Complexity
13. FFT Size
14. Frame Duration
15. Function Decomposition
16. In Place Reordering
17. Index Reversal
18. Iterative FFT
19. Logarithmic Stages
20. Lookup Table
21. Motivation For Optimization
22. O(N log N)
23. Permutation Table
24. Power Of Two Constraint
25. Power Of Two Sizes
26. Processing Deadline
27. Recombination Step
28. Recursive Decomposition
29. Redundant Computation
30. Reference Implementation
31. Stage Loop
32. Stage Span
33. Subproblem
34. Swap Operation
35. Symmetry Exploitation

## Prerequisites

This chapter builds on concepts from:

- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)

---

!!! mascot-welcome "Every piece you built is about to click into place"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    This is the biggest chapter in the book, and it's biggest for a good reason: it's where divide-and-conquer, twiddle factors, and the butterfly stop being separate ideas and become one working function. By the end, you'll have an FFT you built yourself, and proof that it's correct. Let's tune in.

## From Idea to Function: Recursive Decomposition

The previous chapter described splitting a DFT problem into smaller pieces. Turning that description into working code means expressing it the way a recursive function naturally works: a function that calls itself on a smaller version of the same problem.

**Divide and conquer** is a general algorithm design strategy — not unique to the FFT — that solves a problem by splitting it into smaller instances of the same problem, solving each smaller instance, and combining their results into a solution for the original problem. Applied to computing a DFT, this becomes **recursive decomposition**: repeatedly breaking a size-\( N \) DFT calculation down into smaller DFT calculations of the same kind, each handled by a further recursive call, until the pieces become trivially small. Each of those smaller pieces has a name worth using precisely: a **subproblem** is one of the smaller instances a divide-and-conquer algorithm creates by splitting the original problem — in the FFT's case, a DFT of half the original size.

Writing this as working code means expressing the recursive decomposition as an actual function that calls itself — a pattern with its own name in software design. **Function decomposition** is the practice of breaking a larger computational task into smaller functions, each handling one well-defined piece of the overall work — recursive decomposition is a specific, self-referential case of function decomposition, where the smaller "piece" happens to be the exact same function, called again on a smaller input.

## Setting Up: Size and the Power-of-Two Constraint

Before writing the recursive function itself, two practical constraints need to be settled, because they shape how the recursion is allowed to bottom out.

The **FFT size** is the number of samples, \( N \), that a given FFT computation processes — the same \( N \) used throughout the DFT chapter, now carrying an extra requirement. Because radix-2 splitting divides a problem exactly in half at every level, that halving must come out even every single time, all the way down to a single sample. The **power-of-two constraint** is the requirement that a radix-2 FFT's input size \( N \) must be a power of two (2, 4, 8, ..., 512, 1024, ...), so that recursive halving always produces whole-number subproblem sizes with no leftover sample. This is why this course's labs standardize on specific, named **power-of-two sizes** — 256, 512, and 1024 — rather than arbitrary buffer lengths: any of these divides evenly by two, again and again, until reaching size 1.

Splitting a signal in half by even and odd index, first introduced conceptually in the previous chapter, becomes a concrete, two-line operation once written in code: the **even-odd split** is the specific slicing operation that separates an input array into its even-indexed elements (`x[0::2]`) and odd-indexed elements (`x[1::2]`) — MicroPython's slice notation with a step of 2 performs exactly this split directly.

## Where the Time Savings Actually Come From

Before assembling the recursive function, it is worth being precise about exactly what recursive decomposition eliminates, since "it's faster" alone does not explain *why*.

Chapter 10 established that a direct DFT recomputes, from scratch, a nearly identical sum for every one of its \( N \) output bins. Much of that repeated work is **redundant computation**: arithmetic that recalculates a value that another part of the same overall computation has already calculated (or could reuse), wasting effort duplicating work rather than sharing it. Recursive decomposition eliminates this waste directly, which is why complexity falls so dramatically — a pattern worth naming as its own concept: **complexity reduction** is the decrease in total operation count achieved by restructuring an algorithm to avoid redundant computation, without changing the correctness of its result.

Part of that reduction comes from a specific structural property of the roots of unity from the previous chapter. **Symmetry exploitation** is the technique of using a known mathematical symmetry — here, the periodic and symmetric structure of the twiddle factors around the unit circle — to compute a result once and reuse it for multiple outputs, instead of computing each output independently from raw first principles. The butterfly's shared \( W \cdot b \) product from the previous chapter is symmetry exploitation in its most direct form: the same twiddle-factor multiplication feeds two different final outputs.

## Assembling the Recursive Function

With the pieces from the previous chapter in hand, writing the actual recursive FFT is now mostly a matter of **algorithm assembly**: combining previously separate, individually understood pieces — the even-odd split, the recursive calls, the twiddle factor multiplication, and the butterfly — into one coherent, working function.

Before the code below, it helps to walk through what each part does in plain language. The function first checks whether it has reached the simplest possible case: an FFT of a single sample is just that sample, unchanged — recursion has to stop somewhere, and this is where. Otherwise, it performs the even-odd split, recursively calls itself on each half, and then performs the **recombination step**: the part of the FFT algorithm where two same-size sub-transform results (the even and odd recursive results) are combined, using twiddle factor multiplication and the butterfly operation, into one full-size result.

```python
import math

def twiddle(k, N):
    angle = -2 * math.pi * k / N
    return (math.cos(angle), math.sin(angle))     # (real, imaginary)

def fft_recursive(x):
    N = len(x)
    if N == 1:
        return x[:]                        # Base case: a single sample is its own FFT

    even = fft_recursive(x[0::2])          # Recurse on even-indexed samples
    odd  = fft_recursive(x[1::2])          # Recurse on odd-indexed samples

    combined = [(0.0, 0.0)] * N
    for k in range(N // 2):
        w_re, w_im = twiddle(k, N)
        o_re, o_im = odd[k]
        t_re = w_re * o_re - w_im * o_im   # Complex multiply: W * odd[k]
        t_im = w_re * o_im + w_im * o_re

        e_re, e_im = even[k]
        combined[k]          = (e_re + t_re, e_im + t_im)   # Cross add
        combined[k + N // 2] = (e_re - t_re, e_im - t_im)   # Cross subtract
    return combined
```

The two output lines at the bottom of the loop perform what this course calls **cross add and subtract**: the pair of butterfly output calculations, one adding the twiddle-multiplied odd value to the even value and the other subtracting it, which together produce both halves of the combined result from a single shared multiplication — exactly the "crossing lines" shape from the butterfly diagram in the previous chapter, now written as two lines of code. The two values these lines produce together form a **butterfly pair**: the two output values generated together by a single butterfly operation, always located exactly \( N/2 \) positions apart in the combined output array. Across an entire recombination step, the overall pattern of which inputs pair with which — and how those pairings repeat at every level of recursion — is called the **butterfly structure**: the specific, regular pattern governing which values combine with which twiddle factor at each stage of an FFT, visible directly in the nested `for` loop's index arithmetic above.

!!! mascot-thinking "Read the recursion, then read the recombination separately"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    This function can look intimidating as one block, but it's really two ideas stacked on top of each other: "call myself on two halves" (three lines), and "combine those two halves with butterflies" (the loop). If the recursive calls feel confusing, trust them completely and focus only on the loop — by the time control reaches it, `even` and `odd` are already guaranteed correct, smaller FFT results.

## Counting Stages and Butterflies

With a working recursive function in hand, the exact complexity this restructuring achieves can now be derived directly, the same way Chapter 10 derived the DFT's \( N^2 \) cost from its nested loop.

Every recursive call halves the problem size; starting from \( N \) and halving repeatedly until reaching size 1 takes exactly \( \log_2 N \) halvings. This gives the **logarithmic stages** result: an FFT of size \( N \) performs exactly \( \log_2 N \) levels of recombination, each level handling twice as many, half-as-small subproblems as the level above it — for \( N = 512 \), that is exactly 9 stages, regardless of how large \( N \) grows beyond that.

At every stage, across the whole array, exactly \( N/2 \) butterfly operations run — half of \( N \) values pair up into butterflies, no matter how many separate recursive calls that stage's work is spread across. This gives the **butterfly count**: the total number of butterfly operations an FFT performs, equal to \( \frac{N}{2} \log_2 N \) — \( N/2 \) butterflies per stage, multiplied by \( \log_2 N \) stages. Multiplying the butterfly count by the small, constant amount of arithmetic each butterfly performs (one complex multiply, one complex add, one complex subtract) produces the algorithm's total complexity, and it is worth stating formally now that it has been derived from first principles rather than merely asserted.

#### FFT Complexity

\[ O(N \log N) \]

**\( O(N \log N) \)** is the algorithmic complexity notation describing an operation count that grows proportionally to \( N \) multiplied by the logarithm of \( N \) — dramatically slower-growing than the DFT's \( O(N^2) \), especially as \( N \) gets large. This result is precisely the **FFT complexity**: the algorithmic complexity of the Fast Fourier Transform, \( O(N \log N) \), derived directly from \( \log_2 N \) stages of \( N/2 \) butterflies each.

Before the diagram below, it helps to see the complete structure this section just derived laid out visually, stage by stage, for a small concrete example — exactly the kind of full picture that makes "\( \log_2 N \) stages of \( N/2 \) butterflies" feel countable rather than abstract.

#### Diagram: Complete 8-Point FFT Data Flow Graph

<iframe src="../../sims/complete-8-point-fft-flow-graph/main.html" width="100%" height="477px" scrolling="no"></iframe>

<details markdown="1">
<summary>Complete 8-Point FFT Data Flow Graph</summary>
Type: diagram
**sim-id:** complete-8-point-fft-flow-graph<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, distinguish

Learning objective: Let students examine the complete 3-stage, 12-butterfly data flow graph of an 8-point FFT and distinguish how butterfly pairings change shape from stage to stage even though every stage performs exactly 4 butterflies.

Canvas layout:
- Full-width diagram (900px wide equivalent, horizontally scrollable on narrow screens), three vertical column groups labeled "Stage 1", "Stage 2", "Stage 3", input column on the far left labeled with bit-reversed indices, output column on the far right in natural order

Visual elements:
- 8 input nodes on the left, labeled with their bit-reversed source index
- 3 columns of 4 butterfly diagrams each (12 total), matching the classic radix-2 FFT flow-graph shape
- Connecting lines showing exactly which nodes feed which butterfly at each stage
- 8 output nodes on the right, labeled X[0] through X[7]
- Twiddle factor label (e.g., W_8^0, W_8^1) on the appropriate line of each butterfly

Interactive elements:
- Clicking any single butterfly highlights its two inputs, its twiddle factor, and its two outputs, and displays in an infobox: "Butterfly pair: inputs a=[node], b=[node], twiddle=W_8^[k]. Outputs: a+Wb and a−Wb."
- Clicking a stage label (Stage 1/2/3) highlights all 4 butterflies in that stage simultaneously and displays: "Stage [n]: 4 butterflies, span = [value]"
- A "Trace one output" mode: clicking an output node on the right highlights the complete path of butterflies and inputs that feed into it, back to the original samples

Instructional Rationale: An Analyze-level examination pattern is appropriate because the objective requires distinguishing structural differences between stages (which inputs pair with which) despite each stage having an identical butterfly count — click-triggered highlighting isolates one relationship at a time within an otherwise dense diagram.

Implementation notes:
- Use p5.js; hardcode the classic 8-point radix-2 decimation-in-time flow graph topology, since it is a fixed, well-known structure
- Responsive width; diagram scales down proportionally with a horizontal-scroll fallback below 700px width
</details>

## From Recursive to Iterative

The recursive function above is correct and relatively easy to read, but recursion carries real costs on a memory-constrained microcontroller — every recursive call consumes stack space, and MicroPython's function-call overhead is not free. Production FFT implementations, including the one this course eventually optimizes in assembly, are almost always written as a single loop-based function instead.

An **iterative FFT** is an FFT implementation that produces the exact same result as the recursive version but computes it using explicit loops over stages, rather than recursive function calls — trading a small amount of code complexity for reduced memory use and typically faster execution. Converting from recursive to iterative requires solving one problem the recursive version handled automatically: recursive calls naturally reassemble each `even`/`odd` split back into place through the call stack, but an iterative version must reorder the entire input array up front, in one pass, before any butterflies run at all.

That upfront reordering is a whole-array application of the per-index bit reversal from the previous chapter. A **bit reversal permutation** is the complete reordering of an entire \( N \)-element array according to each element's bit-reversed index, applied once before the iterative stage loop begins — as opposed to **index reversal**, which refers to the reversal calculation for one single index. Rather than recomputing every index's bit-reversed value on the fly, this course reuses the precomputed array from Chapter 11 directly: a **permutation table** is a precomputed lookup table storing, for each original array position, the position its element should move to — the bit-reversed indices table from the previous chapter is exactly this kind of permutation table.

Physically applying that permutation table to reorder an array in place, without allocating a second array, uses one elementary operation repeated many times. A **swap operation** exchanges the contents of two array positions directly, without requiring any additional storage beyond one temporary variable — the entire mechanism behind **in-place reordering**: rearranging an array's elements into their permuted positions by performing swap operations directly within the original array, rather than copying elements into a newly allocated array.

Once the array is correctly reordered, the iterative version processes it through a straightforward outer loop over stages. A **stage loop** is the outer loop of an iterative FFT that advances through each of the \( \log_2 N \) stages in sequence, performing that stage's full set of butterflies before moving to the next. Within each pass of that loop, the distance separating a butterfly's two input positions is not fixed — it changes predictably from stage to stage. The **stage span** is the distance, in array positions, between the two elements a single butterfly combines at a given stage — the stage span starts at 1 in the first stage and exactly doubles at every subsequent stage, mirroring how the recursive version's subproblems doubled in size at each level of recombination.

Before the code below, one more term is worth having ready: a **lookup table** is any precomputed table of values accessed by index rather than recalculated — a general term covering both the permutation table and the twiddle factor table from the previous chapter, both used directly in the loop below.

```python
def bit_length(n):
    length = 0
    while n:
        length += 1
        n >>= 1
    return length

def fft_iterative(x):
    N = len(x)
    if N & (N - 1) != 0:
        raise ValueError("FFT size must be a power of two")   # Power-of-two constraint

    num_stages = bit_length(N) - 1
    perm = bit_reverse_indices(num_stages)         # Permutation table (Chapter 11)

    a = list(x)
    for i in range(N):
        j = perm[i]
        if j > i:
            a[i], a[j] = a[j], a[i]                 # Swap operation

    size = 2
    while size <= N:                                # Stage loop
        half = size // 2                            # Stage span
        for start in range(0, N, size):
            for k in range(half):
                w_re, w_im = twiddle(k, size)        # Lookup table access
                o_re, o_im = a[start + k + half]
                t_re = w_re * o_re - w_im * o_im
                t_im = w_re * o_im + w_im * o_re
                e_re, e_im = a[start + k]
                a[start + k]        = (e_re + t_re, e_im + t_im)
                a[start + k + half] = (e_re - t_re, e_im - t_im)
        size *= 2
    return a
```

#### Diagram: Iterative FFT Stage Loop Visualizer

<iframe src="../../sims/iterative-fft-stage-loop-visualizer/main.html" width="100%" height="447px" scrolling="no"></iframe>

<details markdown="1">
<summary>Iterative FFT Stage Loop Visualizer</summary>
Type: microsim
**sim-id:** iterative-fft-stage-loop-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, compare

Learning objective: Let students step through the iterative FFT's stage loop for an 8-element array and compare how the stage span doubles (1, then 2, then 4) while the number of butterflies per stage stays constant at N/2.

Canvas layout:
- Top (150px): the 8-element array shown as boxes, initially in bit-reversed order (after the permutation step)
- Middle (250px): the current stage's butterfly pairings drawn as connecting arcs over the array boxes
- Bottom (150px): step controls and a readout showing current stage number, stage span, and butterfly count

Visual elements:
- 8 array-position boxes, values updating live as each stage completes
- Arcs connecting each butterfly's two input positions for the current stage, color-coded by which butterfly they belong to
- Readout: "Stage [n] of [log2(N)] | Span = [value] | Butterflies this stage = N/2 = [value]"

Interactive controls:
- Button: "Apply permutation" — animates the swap operations that bit-reverse the initial array
- Button: "Run next stage" — advances through stages 1, 2, 3 in sequence, redrawing the arcs and updating array values each time
- Button: "Reset"

Behavior:
- Clicking "Apply permutation" visually swaps array boxes into bit-reversed order, one swap operation at a time
- Clicking "Run next stage" redraws the connecting arcs to match the new, doubled stage span, and updates the readout panel

Instructional Rationale: An Analyze-level step-through comparison is appropriate because the objective is examining how stage span changes across stages while butterfly count per stage does not — sequential stage-by-stage stepping makes this pattern directly observable rather than requiring students to trace index arithmetic by hand.

Implementation notes:
- Use p5.js; hardcode the N=8 example matching the flow graph diagram earlier in this chapter for visual consistency
- Responsive width; array boxes and arc diagram scale proportionally on resize
</details>

## Correctness Before Speed

An FFT implementation that runs without crashing and produces plausible-looking numbers has not yet earned any trust — this course's Chapter 9 standard applies here with even more force, because the iterative version above involves considerably more bookkeeping (permutation, stage spans) than the DFT ever did, and bookkeeping errors are easy to make and easy to miss.

**Correctness before speed** is the governing principle that a new, faster algorithm must be proven to produce identical results to a known-correct implementation *before* its speed is measured or celebrated — a fast wrong answer is worthless, and measuring performance before confirming correctness risks optimizing a bug. The known-correct implementation to check against is not hard to find — this course already built and validated one. A **reference implementation** is an already-validated, trusted implementation used as the standard of correctness that a new implementation is checked against — the DFT from Chapter 9 serves as exactly this reference for every FFT implementation in this course.

Comparing the new FFT's output against that reference, bin by bin, is a direct application of the error-measurement tools from Chapter 9. **Cross validation**, in this context, is the process of running the same input signal through both the FFT and the reference DFT implementation and confirming that their outputs agree within the numerical tolerance established earlier, bin index by bin index.

```python
def cross_validate(signal, tolerance=1e-6):
    dft_result = dft([(s, 0.0) for s in signal])          # Reference implementation
    fft_result = fft_iterative([(s, 0.0) for s in signal])  # New implementation under test

    for k in range(len(signal)):
        dft_re, dft_im = dft_result[k]
        fft_re, fft_im = fft_result[k]
        error = ((dft_re - fft_re) ** 2 + (dft_im - fft_im) ** 2) ** 0.5
        if error > tolerance:
            print(f"Mismatch at bin {k}: DFT={dft_result[k]}, FFT={fft_result[k]}")
            return False
    return True
```

!!! mascot-tip "Cross-validate against the same signal you already trust"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    Don't reach for a brand-new test signal here — feed this cross-validation function the exact same known signal test from Chapter 9, the one you already hand-verified. If your FFT and your already-trusted DFT agree on a signal you've independently checked twice before, that agreement means something far stronger than two implementations merely agreeing with each other.

## Still Not Fast Enough — On Purpose

With correctness confirmed, it is finally safe to talk about speed. And the honest answer is: better, dramatically better, but not yet good enough — which is exactly the state this chapter is designed to leave you in.

Measured on the Pico 2, a pure-Python FFT of the kind built in this chapter computes a 512-point transform in roughly 140 milliseconds — compare that to the brute-force DFT's roughly 21,000 milliseconds for the same size, a speedup of about 146×. Real as that improvement is, it needs to be measured against the same deadline Chapter 10 introduced. The **frame duration** is the real-world time span, in seconds, that one captured block of \( N \) samples actually represents — for 512 samples captured at 16,000 Hz, that is \( 512 / 16{,}000 = 32 \) milliseconds of real audio. The **processing deadline** is the point by which a pipeline stage must finish processing one frame in order to keep up with the next frame's arrival — this course rounds that figure to a 40-millisecond real-time budget once capture and display overhead are included, matching Chapter 2's derived cycle budget.

| Implementation | Time for 512-point transform | vs. 40 ms real-time budget |
|---|---|---|
| Brute-force DFT (Chapter 10) | ~21,000 ms | 530× over |
| Recursive/iterative FFT (this chapter) | ~140 ms | 3.5× over |

A 146× improvement that still finishes 3.5× too slow is not a failure of this chapter's work — it is a precise, honest measurement, and precise honest measurements are what motivate what comes next. The **motivation for optimization** is the specific, quantified gap between a correct, validated implementation's current performance and the real-time budget it must eventually meet — in this case, closing a 3.5× gap, not a vague sense that faster would be nice. Later modules of this course close exactly this remaining gap using code emitters, native compilation, and hand-written assembly — never by revisiting whether the algorithm itself is correct, since this chapter's cross-validation has already settled that question for good.

!!! mascot-warning "Don't confuse 'still too slow' with 'still wrong'"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning">
    It's tempting, seeing 3.5× over budget, to start second-guessing the algorithm itself. Resist that. Cross-validation already proved this FFT computes the mathematically correct answer. Every millisecond of the remaining gap comes from *how* MicroPython executes this code, not from any flaw in the algorithm — and that distinction is exactly what the benchmarking and assembly modules later in this course are built to address.

That distinction — correct algorithm, slow execution — is worth sitting with for a moment, because it reframes everything that follows. Nothing about the FFT itself needs to change from here on; every remaining chapter is about *how* this exact, already-proven algorithm gets executed faster, not about finding a better algorithm.

!!! mascot-encourage "You just built the algorithm that changed computing"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Thirty-five concepts, two complete implementations, and a full cross-validation pass is a genuinely large amount of work for one chapter. Take a moment before moving on: the function you just wrote and proved correct is, in structure, the same algorithm running inside phones, WiFi chips, and MRI machines. You didn't just learn about the FFT — you built one.

## Chapter Summary

You now have a complete, correct, cross-validated FFT — in both recursive and iterative form — and a precisely quantified reason to keep optimizing.

Key ideas to carry forward:

- **Divide and conquer** becomes **recursive decomposition** in code, breaking each **subproblem** apart through **function decomposition**, respecting the **FFT size**'s **power-of-two constraint** (using standard **power-of-two sizes**) via the **even-odd split**.
- Recursion eliminates **redundant computation**, achieving **complexity reduction** through **symmetry exploitation** in the twiddle factors.
- **Algorithm assembly** combines these pieces through the **recombination step** — **cross add and subtract** producing each **butterfly pair**, following the overall **butterfly structure**.
- \( \log_2 N \) **logarithmic stages**, each with \( N/2 \) butterflies, gives a **butterfly count** of \( \frac{N}{2}\log_2 N \) and an **FFT complexity** of **O(N log N)**.
- An **iterative FFT** avoids recursion overhead using a **bit reversal permutation** (built from **index reversal** and a **permutation table**), applied via **swap operation**s for **in-place reordering**, then a **stage loop** where the **stage span** doubles each pass, using a **lookup table** for twiddle factors.
- **Correctness before speed** demands **cross validation** against a trusted **reference implementation** — only then does the **frame duration** and **processing deadline** reveal the remaining **motivation for optimization**.

??? note "Quick check: an FFT of size N=1024 is being profiled. How many stages does it have, and how many total butterfly operations does it perform? — Click to expand"
    log2(1024) = 10 stages. Each stage performs N/2 = 512 butterflies, so the total butterfly count is (N/2) × log2(N) = 512 × 10 = 5,120 butterflies — compare that to the DFT's 1,048,576 operations at the same size, from the scaling table in Chapter 10.

!!! mascot-celebration "A real, correct, working FFT — built entirely from scratch"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    You now own a complete FFT implementation, proven correct against a reference you built and validated yourself. 146× faster than where you started, with a precisely measured 3.5× still to close. The next module takes this exact validated algorithm and puts it to work on real, live captured audio. Now *that's* a superpower.
