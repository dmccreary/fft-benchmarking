---
title: 'From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly'
description: The Cooley-Tukey insight, twiddle factors, and the butterfly operation that let a DFT be computed in a fraction of the work.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:00
version: 0.09
---

# From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly

## Summary

This chapter introduces the Cooley-Tukey insight that a DFT can be split recursively into smaller DFTs on even- and odd-indexed samples, and defines the twiddle factors and butterfly operation that combine the results back together. It covers bit reversal and in-place computation as the bookkeeping the algorithm needs to run without extra memory. These pieces are assembled into a complete, validated implementation in the next chapter.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Amplitude Normalization
2. Audio Processing
3. Bit Reversal
4. Butterfly Diagram
5. Butterfly Operation
6. Complex Multiplication
7. Cooley Tukey Algorithm
8. DC Offset Removal
9. Data Flow Graph
10. Decimation In Time
11. FFT Algorithm
12. FFT History
13. FFT Stages
14. Four Multiply Form
15. In Place FFT
16. Interleaved Storage
17. Loop Invariant Hoisting
18. Normalization
19. Precomputation
20. Radix-2 FFT
21. Roots Of Unity
22. Signal Preprocessing
23. Twiddle Factor Table
24. Twiddle Factors

## Prerequisites

This chapter builds on concepts from:

- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)

---

!!! mascot-welcome "The trick that makes everything else in this course possible"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    530 times too slow was the cliffhanger. Here's the resolution: the DFT is doing an enormous amount of *redundant* work, and one clever restructuring throws almost all of it away without changing the answer by a single bit. Let's tune in — this is the chapter the whole course is named after.

## Preparing a Signal Before Transforming

Before any fast algorithm runs, a captured audio buffer usually needs a little housekeeping first — cleanup steps that make the transform's output more meaningful, even though they don't change *how* the transform itself is computed. Collectively, this housekeeping falls under **audio processing**: any computation applied to a captured or synthesized audio signal, from simple cleanup steps through the full frequency analysis pipeline this course builds. The specific cleanup steps applied immediately after capture and before transforming are called **signal preprocessing**: a set of operations performed on a raw captured signal before it is analyzed, intended to remove artifacts and normalize scale so the analysis that follows produces cleaner, more comparable results.

Two preprocessing steps are worth naming individually, because upcoming labs apply both to every captured buffer. Recall from Chapter 4 that a captured signal can carry an unwanted constant offset. **DC offset removal** is the preprocessing step that subtracts a signal's average (DC) value from every sample, centering the signal on zero before any frequency analysis — without it, the DFT's DC bin would absorb this offset and, worse, energy from the offset can leak into neighboring bins once windowing is introduced two chapters from now. Separately, captured signals can arrive at very different overall loudness levels depending on distance from the microphone or source volume. **Normalization** is the general process of rescaling a signal's values into a standard, predictable range, making results comparable regardless of the original signal's absolute size. Applied specifically to amplitude, **amplitude normalization** rescales a signal so its peak amplitude reaches a target value (often 1.0 or the full scale value from Chapter 6), ensuring a quiet whisper and a loud shout produce spectra that are comparable in overall scale, differing only in their frequency content.

| Preprocessing step | What it removes or fixes | Why it matters before transforming |
|---|---|---|
| DC offset removal | Constant, non-oscillating offset | Keeps offset energy out of the DC bin and away from neighboring bins |
| Amplitude normalization | Inconsistent overall loudness | Makes spectra comparable regardless of input volume |

## A Fast Idea, Rediscovered

The mathematics behind this chapter is not, strictly speaking, new. **FFT history** traces the fast Fourier transform's core idea back further than most students expect: Carl Friedrich Gauss sketched an equivalent method in 1805 to speed up astronomical calculations, but it went largely unnoticed for over a century. The version this course builds traces to a 1965 paper by James Cooley and John Tukey, published while working on unrelated seismic and nuclear test-detection data — their algorithm made frequency analysis practical on the computers of the era and is now considered one of the most important algorithms of the twentieth century.

!!! note "Same math, a hundred and sixty years apart"
    Gauss's version and the Cooley-Tukey version rest on the identical divide-and-conquer insight this chapter is about to build from scratch. The gap between them wasn't a missing mathematical idea — it was the absence of a machine that needed to compute Fourier transforms fast enough for the insight to matter. Once computers existed, the idea's moment arrived.

The general term for any algorithm in this family is worth defining before diving into the specific one this course builds. The **FFT algorithm** — Fast Fourier Transform — is any of a family of algorithms that compute the same result as the Discrete Fourier Transform, exactly, using dramatically fewer operations than the direct DFT definition requires. The **Cooley-Tukey algorithm** is the specific, most widely used FFT algorithm, based on recursively breaking a DFT of size \( N \) into smaller DFTs, then combining their results — the version this chapter and the next build in full.

## Divide and Conquer: Splitting the Problem in Half

The DFT's quadratic cost, derived in the previous chapter, comes from treating every output bin as an independent, from-scratch calculation. Cooley-Tukey's insight is that these \( N \) calculations are not actually independent — they share an enormous amount of duplicated arithmetic that a smarter structure can compute once and reuse.

The specific restructuring this course builds is called **decimation in time**: a Cooley-Tukey strategy that splits an \( N \)-sample input signal into two smaller sequences — one containing every even-indexed sample, one containing every odd-indexed sample — computes a smaller DFT on each, and combines the two results back into the full-size answer. Each of those two smaller DFTs can itself be split the same way, and the one after that, all the way down to trivially small problems — this repeated halving is exactly the **radix-2 FFT**: an FFT variant that always splits the current problem into exactly two equal halves at every stage, which requires the input size \( N \) to be a power of two (256, 512, 1024, and so on) for the splitting to divide evenly all the way down.

Before the diagram below, it's worth being explicit about why splitting helps at all: a size-\( N \) DFT costs \( N^2 \) operations, but two size-\( \frac{N}{2} \) DFTs together cost only \( 2 \times \left(\frac{N}{2}\right)^2 = \frac{N^2}{2} \) operations — already half the work, before even reaching the combination step. Splitting recursively, all the way down, is what eventually produces the dramatic \( O(N \log N) \) result the next chapter proves in full.

#### Diagram: Divide-and-Conquer Recursion Tree

<iframe src="../../sims/divide-and-conquer-recursion-tree/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Divide-and-Conquer Recursion Tree</summary>
Type: infographic
**sim-id:** divide-and-conquer-recursion-tree<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, interpret

Learning objective: Let students interpret how an 8-sample DFT problem is recursively split by decimation in time into even- and odd-indexed halves, down to trivial size-1 problems, explaining what happens at each level of the tree.

Canvas layout:
- Full-width tree diagram, root at top (400px tall), growing downward through 4 levels
- Infobox panel below the tree, populated on click

Visual elements:
- Root node: "8 samples: x[0]...x[7]"
- Level 1: two child nodes — "Even: x[0],x[2],x[4],x[6]" and "Odd: x[1],x[3],x[5],x[7]"
- Level 2: four nodes, each splitting its parent again by even/odd index within that subsequence
- Level 3 (leaves): eight single-sample nodes, each labeled with its original index
- Lines connecting each parent to its two children, labeled "even" and "odd"

Interactive elements:
- Clicking any node highlights the path from that node back to the root and displays in the infobox: "This subsequence contains [N] samples. Splitting it costs one comparison of index parity, an operation done once regardless of N."
- A "Play split animation" button that visually animates the split happening level by level, top to bottom

Instructional Rationale: An Understand-level clickable infographic is appropriate because the objective is explaining the recursive structure itself, not performing a calculation — seeing the full tree at once, with click-triggered path highlighting, makes the "keep splitting until trivial" idea concrete before any butterfly arithmetic is introduced.

Implementation notes:
- Use p5.js; the tree structure and its 8-sample example are fixed for clarity, matching the eight-point DFT worked example from the previous chapter
- Responsive width; tree nodes and connecting lines scale proportionally, with horizontal scrolling as a fallback on very narrow viewports
</details>

!!! mascot-thinking "Splitting is free; the DFT arithmetic is what got expensive"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Notice that dividing the samples into even and odd groups costs almost nothing — it's just sorting by index. All the actual savings come from the fact that two small DFTs, run separately, need far fewer total operations than one big DFT run directly. That's the entire mechanism. Everything else in this chapter is about recombining those small results correctly.

## Roots of Unity: The Numbers That Combine the Pieces

Splitting the problem in half is only useful if the two smaller results can be stitched back together into the correct full-size answer — and stitching them together correctly requires a specific, precisely defined set of complex numbers.

The **roots of unity** are the complex number solutions to the equation \( z^N = 1 \) — there are exactly \( N \) of them for a given \( N \), and geometrically they land at evenly spaced points around the unit circle from Chapter 7, each one exactly \( \frac{2\pi}{N} \) radians apart from its neighbors. The specific roots of unity used to recombine the even and odd sub-transforms in an FFT have their own name: **twiddle factors** are the complex numbers \( W_N^k = e^{-i 2\pi k / N} \) used to multiply and rotate the output of one sub-transform before adding or subtracting it from the other, correctly accounting for the phase relationship between the even-indexed and odd-indexed halves of the original signal.

#### Twiddle Factor

\[ W_N^k = e^{-i 2\pi k / N} \]

where:

- \( W_N^k \) is the twiddle factor for index \( k \) at transform size \( N \)
- \( N \) is the size of the DFT being combined
- \( k \) is an integer index, \( 0 \le k < N/2 \)

Because twiddle factors depend only on \( N \) and \( k \) — never on the actual input signal's values — they are exactly the same for every FFT computed at a given size. Computing them freshly, with a sine and cosine call, every single time an FFT runs would waste effort recalculating an answer that never changes. **Precomputation** is the general strategy of calculating a value once, in advance, and reusing the stored result instead of recalculating it every time it's needed. Applied here, a **twiddle factor table** is a precomputed array holding every twiddle factor value an FFT of a given size will need, calculated once (often when a program starts) and simply looked up by index during every actual transform — a direct, high-value application of precomputation that every FFT implementation in this course relies on.

#### Diagram: Roots of Unity on the Unit Circle

<iframe src="../../sims/roots-of-unity-unit-circle/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Roots of Unity on the Unit Circle</summary>
Type: microsim
**sim-id:** roots-of-unity-unit-circle<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students adjust N and calculate the resulting set of twiddle factors, observing that they always land as N evenly spaced points on the unit circle from Chapter 7.

Canvas layout:
- Left (400px): the unit circle with all N roots of unity plotted as points, connected to the origin by thin lines
- Right (300px): a table listing each root's index k, its angle, and its value as a + bi

Visual elements:
- Unit circle with N evenly spaced points marked
- Point at k=0 always highlighted distinctly (this is always the value 1 + 0i)
- Clicking any point highlights it on the circle and its corresponding row in the table

Interactive controls:
- Slider or dropdown: N (4, 8, 16, 32), default 8
- Clicking a point on the circle (or a table row) highlights the matching entry in both views and shows the twiddle factor formula with that k substituted

Behavior:
- Changing N redraws the circle with the new number of evenly spaced points and regenerates the table
- Each point's exact angle is 2*pi*k/N, and hovering shows this computation explicitly

Instructional Rationale: An Apply-level parameter exploration with calculation display is appropriate because the objective is calculating specific twiddle factor values for a chosen N and confirming their geometric placement — pairing the visual circle with an exact numeric table lets students verify the formula rather than only see a picture.

Implementation notes:
- Use p5.js; compute each point as (cos(-2*pi*k/N), sin(-2*pi*k/N)) for k = 0 to N-1
- Responsive width; circle and table stack vertically below 650px width
</details>

## Multiplying Complex Numbers Efficiently

Every twiddle factor eventually multiplies a complex sub-transform result, so an FFT implementation needs to perform complex multiplication efficiently and often. **Complex multiplication** follows a fixed algebraic rule: multiplying two complex numbers \( (a + bi) \) and \( (c + di) \) distributes across both terms and uses \( i^2 = -1 \) to simplify, producing \( (ac - bd) + (ad + bc)i \).

#### Complex Multiplication

\[ (a + bi)(c + di) = (ac - bd) + (ad + bc)i \]

where \( a, b, c, d \) are real numbers and \( i \) is the imaginary unit.

Written out directly like this, the formula requires four real-number multiplications (\( ac \), \( bd \), \( ad \), \( bc \)) along with one addition and one subtraction. This specific, standard way of implementing complex multiplication has a name worth knowing, since later optimization chapters return to it directly: the **four multiply form** is the straightforward implementation of complex multiplication using exactly four real multiplications and two real additions/subtractions, as shown in the formula above — the version every butterfly operation in this chapter's FFT uses, and the version whose four multiplications later become a specific, countable cost when this course starts optimizing in assembly language.

## The Butterfly Operation

Complex multiplication supplies the tool; the **butterfly operation** is where it gets used to actually recombine an even sub-transform result with an odd one. The butterfly operation takes one value from the even sub-transform (call it \( a \)), one value from the odd sub-transform (call it \( b \)), and a twiddle factor \( W \), and produces two new output values using a single pair of computations:

#### Butterfly Operation

\[ \text{output}_1 = a + W \cdot b \]

\[ \text{output}_2 = a - W \cdot b \]

where:

- \( a \) is a value from the even-indexed sub-transform
- \( b \) is a value from the odd-indexed sub-transform
- \( W \) is the twiddle factor for this position

Notice that both outputs reuse the *identical* product \( W \cdot b \) — computed once, then simply added for one output and subtracted for the other. This single-multiply, double-reuse structure is the specific reason the butterfly is so cheap: it produces two frequency-domain values from one complex multiplication and two complex additions, not two.

The characteristic X-shaped diagram used to draw this operation gives it its name. A **butterfly diagram** is the standard visual representation of a butterfly operation, showing two input values on the left, two output values on the right, and crossing lines between them — with the twiddle-factor multiplication marked on the line feeding into the subtraction — resembling a butterfly's wings. A butterfly diagram is itself one small example of a broader kind of diagram used throughout computing: a **data flow graph** is a diagram representing how data moves through and is transformed by a sequence of operations, with nodes representing computations and edges representing data moving between them — an entire FFT, once fully assembled in the next chapter, can be drawn as one large data flow graph built from many connected butterfly diagrams.

#### Diagram: Butterfly Operation Visualizer

<iframe src="../../sims/butterfly-operation-visualizer/main.html" width="100%" height="462px" scrolling="no"></iframe>

<details markdown="1">
<summary>Butterfly Operation Visualizer</summary>
Type: microsim
**sim-id:** butterfly-operation-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students set values for a, b, and a twiddle factor W, then calculate and observe the two butterfly outputs, confirming that output1 and output2 both derive from the single shared product W×b.

Canvas layout:
- Left (350px): the classic X-shaped butterfly diagram, with a and b entering on the left and output1/output2 exiting on the right
- Right (300px): input controls and a step-by-step calculation readout

Visual elements:
- Two input nodes (a, b), two output nodes (output1, output2), crossing lines between them
- The twiddle factor W marked on the line from b, feeding into the multiply
- A "+" symbol at output1's combining point, a "−" symbol at output2's combining point
- Live readout: "W × b = [value]", "output1 = a + (W×b) = [value]", "output2 = a − (W×b) = [value]"

Interactive controls:
- Numeric inputs (or small sliders): a (real, imaginary), b (real, imaginary)
- Dropdown: W, selectable from a small set of common twiddle factor values (e.g., W_8^0, W_8^1, W_8^2)
- Button: "Compute" — animates the multiply flowing along the line, then both additions/subtractions resolving at the outputs

Behavior:
- Changing any input immediately recalculates and redisplays every intermediate and final value
- The shared W×b product is visually computed once and shown flowing into both output calculations, reinforcing that it is not recomputed

Instructional Rationale: An Apply-level calculator with a data-flow visualization is appropriate because the objective is calculating specific butterfly outputs from chosen inputs — showing the single shared multiplication feeding both outputs directly addresses the "why is this efficient" question, not just "what is the answer."

Implementation notes:
- Use p5.js; implement complex multiplication using the four multiply form shown in this chapter
- Responsive width; diagram and controls stack vertically below 650px width
</details>

!!! mascot-tip "One multiply, two answers — that's the whole savings"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    If you only remember one sentence from this chapter, make it this: the butterfly computes W×b exactly once and reuses it for both outputs. Multiply that single saved operation by thousands of butterflies across a full FFT, and you can already see where the next chapter's big speedup number comes from.

## Bit Reversal and Computing in Place

Recursively splitting samples into even and odd groups, over and over, scrambles the original sample order in a very specific, predictable way — and putting the pieces back together correctly, without wasting memory, requires understanding exactly how they got scrambled.

Running an FFT on a memory-constrained microcontroller strongly favors an implementation that reuses its input buffer as scratch space rather than allocating new arrays at every recursive step. An **in-place FFT** is an FFT implementation that overwrites its own input array with intermediate and final results as it computes, rather than allocating separate memory for each stage of the algorithm — essential on a device with only kilobytes of RAM to work with. Making this work correctly requires the input samples to start out in a specific scrambled order rather than their original natural order. **Bit reversal** is the specific reordering required before an in-place radix-2 FFT: writing each sample's array index in binary, reversing the order of its bits, and using that reversed value as the sample's new position — a direct, mechanical consequence of how repeated even/odd splitting reorders data.

Before the table below, it helps to see bit reversal worked out concretely for a small example: for an 8-sample array, index 3 in binary is `011`; reversed, it becomes `110`, which is 6 in decimal — so the sample originally at index 3 moves to index 6 before the in-place butterflies begin.

| Natural index | Binary | Reversed binary | Bit-reversed index |
|---|---|---|---|
| 0 | 000 | 000 | 0 |
| 1 | 001 | 100 | 4 |
| 2 | 010 | 010 | 2 |
| 3 | 011 | 110 | 6 |
| 4 | 100 | 001 | 1 |
| 5 | 101 | 101 | 5 |
| 6 | 110 | 011 | 3 |
| 7 | 111 | 111 | 7 |

Once samples are rearranged into bit-reversed order, complex values need to actually live somewhere in memory — and MicroPython, like most languages, has no single built-in "complex number" type suited to tight, fast array access. **Interleaved storage** is a storage layout in which the real and imaginary parts of a sequence of complex numbers are stored alternately in a single flat array (real, imaginary, real, imaginary, ...) rather than in two separate arrays — a memory layout used throughout this course's FFT implementation, matching the `(real_sum, imag_sum)` pairs already produced by the previous chapter's DFT code.

```python
def bit_reverse_indices(n_bits):
    N = 1 << n_bits                       # N = 2^n_bits
    reversed_indices = [0] * N
    for i in range(N):
        b = format(i, f'0{n_bits}b')      # Binary string, zero-padded
        reversed_indices[i] = int(b[::-1], 2)   # Reverse and convert back
    return reversed_indices
```

This function computes the bit-reversed position for every index in one pass, exactly as shown in the table above (`n_bits=3` reproduces every row for the 8-sample example). The next chapter uses this table to reorder a signal's samples before running the in-place butterfly stages.

## Stages and a First Optimization Habit

A complete radix-2 FFT does not perform all of its butterflies at once — it works through a fixed number of sequential passes over the data. The **FFT stages** are the sequential steps a radix-2 FFT proceeds through, where each stage performs a full set of butterfly operations across the entire (bit-reversed) array before the next stage begins — the next chapter shows that the total number of stages is exactly \( \log_2 N \), which is the direct source of the FFT's \( N \log N \) complexity.

One coding habit, introduced here because the twiddle factor table makes it so natural, deserves a name before the next chapter's implementation puts it to constant use. **Loop invariant hoisting** is an optimization technique that moves a computation out of a loop when its result does not change across loop iterations, computing it once beforehand instead of repeatedly recomputing an identical value on every pass. Looking up a twiddle factor from the precomputed table, instead of recalculating `cos()` and `sin()` inside every single butterfly, is loop invariant hoisting in its purest, most direct form — the value the twiddle factor table stores never changes for a given \( N \), so computing it once, before any stage runs, is strictly better than recomputing it thousands of times during the transform.

!!! mascot-encourage "Every piece here is small — the next chapter just connects them"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Twenty-four new terms is a lot, but look at what they actually are: split in half, multiply by a precomputed number, add and subtract once, reorder with bit reversal. None of these pieces is individually hard. The next chapter's job — and it's the biggest chapter in this book — is simply wiring them together into one working recursive function.

## Chapter Summary

You now understand every individual piece the Fast Fourier Transform is built from — the next chapter's entire job is assembling them into one working implementation.

Key ideas to carry forward:

- **Audio processing** and **signal preprocessing** — especially **DC offset removal**, **normalization**, and **amplitude normalization** — clean a signal before any transform runs.
- **FFT history** traces back to Gauss and forward to the **Cooley-Tukey algorithm**, one member of the broader **FFT algorithm** family.
- **Decimation in time** recursively splits a signal by even/odd index; the **radix-2 FFT** always splits into exactly two halves, requiring a power-of-two size.
- **Roots of unity** are evenly-spaced points on the unit circle; **twiddle factors** are the specific roots of unity used to recombine sub-transforms, stored in a precomputed **twiddle factor table** via **precomputation**.
- **Complex multiplication**, in its standard **four multiply form**, powers the **butterfly operation** — visualized with a **butterfly diagram**, one instance of a general **data flow graph**.
- **Bit reversal** reorders samples for an **in-place FFT**, stored using **interleaved storage**; the algorithm proceeds through \( \log_2 N \) **FFT stages**, with **loop invariant hoisting** (like the twiddle factor table itself) as a first optimization habit.

??? note "Quick check: why does the butterfly operation only need one complex multiplication to produce two outputs, instead of two? — Click to expand"
    Because both outputs are built from the identical product W×b — one output adds it to a, the other subtracts it from a. Computing W×b once and reusing it for both the addition and the subtraction avoids a second, redundant multiplication that would otherwise recompute the exact same value.

!!! mascot-celebration "Every gear of the machine is on the table"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Divide and conquer, twiddle factors, the butterfly, bit reversal — you now understand every mechanism a real FFT implementation needs. Next chapter, all of it comes together into one working, validated function, and you'll watch the operation count fall off a cliff. Time to transform!
