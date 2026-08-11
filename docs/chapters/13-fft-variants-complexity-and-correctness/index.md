---
title: FFT Variants, Complexity, and Correctness
description: A lighter survey of FFT variants beyond radix-2 — decimation in frequency, radix-4, split-radix, real FFT, the inverse transform, and scaling conventions — calibrated against NumPy and SciPy.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:35:00
version: 0.09
---

# FFT Variants, Complexity, and Correctness

## Summary

This chapter surveys FFT variants beyond the radix-2 case built in the previous chapter — radix-4, split-radix, real-input, and inverse transforms — along with the normalization and scaling conventions that differ between libraries. It briefly compares the from-scratch implementation against NumPy and SciPy's FFT to calibrate expectations before the course moves on to real audio spectra. This is a deliberately lighter wrap-up chapter after the heavy construction work that precedes it.

## Concepts Covered

This chapter covers the following 11 concepts from the learning graph:

1. Complex FFT
2. Decimation In Frequency
3. FFT Scaling
4. IFFT Algorithm
5. Inverse FFT
6. Normalization Factor
7. NumPy Library
8. Radix-4 FFT
9. Real FFT
10. SciPy FFT
11. Split Radix FFT

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)

---

!!! mascot-welcome "A breather before real audio"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    You built and proved a real FFT — that was the hard part. This chapter is a shorter, calmer survey: other ways people split the problem, what "inverse" means for a fast transform, and why comparing your numbers against a library like NumPy needs one small caveat first. Let's tune in.

## Other Ways to Split the Problem

The radix-2 FFT from the previous two chapters always splits by even and odd sample *index*, in the time domain, before recursing — a choice with its own name once a second option exists to contrast it against. **Decimation in frequency** is an alternative Cooley-Tukey strategy that splits the problem by *output* frequency bin instead of input sample index — performing a butterfly-like combination step first, then recursing on the two resulting halves, effectively running the same operations as decimation in time in a different order. Both approaches compute the identical, mathematically correct result at the identical O(N log N) complexity; they differ only in exactly where the butterfly step falls relative to the recursive splits, and in decimation in frequency's case, the bit-reversal permutation lands on the *output* instead of the input.

Radix-2 splitting is not the only way to divide a problem, either. A **radix-4 FFT** splits each stage into four sub-transforms instead of two, requiring only \( \log_4 N \) stages rather than \( \log_2 N \) — fewer stages, at the cost of a larger, more complex combination step within each one. Pushing further, a **split-radix FFT** is a hybrid technique that mixes radix-2 and radix-4 splitting within the same transform, specifically chosen to minimize the total number of multiplications — among the lowest multiplication counts known for power-of-two FFT sizes, achieved at the cost of noticeably more intricate implementation code than the straightforward radix-2 version this course built.

Before the table below, it's worth being clear about the actual tradeoff these variants represent: none of them changes the O(N log N) complexity class established in the previous chapter — they only change the *constant factor* multiplying that complexity, trading implementation simplicity for a modest additional speedup.

| Variant | Stages | Multiplications (relative) | Implementation complexity |
|---|---|---|---|
| Radix-2 (this course) | \( \log_2 N \) | Baseline | Simple, uniform butterfly structure |
| Radix-4 | \( \log_4 N \) | Somewhat fewer | Larger per-stage combination step |
| Split-radix | Mixed | Fewest known for power-of-two N | Most intricate; mixed butterfly shapes |

!!! mascot-thinking "Every variant is still the same idea underneath"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    It's easy to see a new name — radix-4, split-radix, decimation in frequency — and assume it's a different algorithm. It isn't. Every one of these is still divide-and-conquer with twiddle factors and butterflies; they only disagree about exactly how and when to split. The radix-2 version you built is a completely legitimate, correct FFT — these variants are refinements, not replacements.

## Real Input Deserves a Specialized Transform

The FFT built across the previous two chapters accepts input samples with both a real and an imaginary part, making it a general-purpose tool. A **complex FFT** is an FFT implementation designed to accept input samples that may have a nonzero imaginary part, computing a full, general-purpose complex-to-complex transform — exactly the `fft_recursive` and `fft_iterative` functions from the previous chapter, which work correctly even though this course's captured audio samples happen to always have an imaginary part of exactly zero.

That last detail is not wasted information — it is an optimization opportunity. Recall spectrum symmetry from Chapter 9: for a real-valued input, the upper half of the output spectrum is always the complex conjugate of the lower half, meaning roughly half the transform's computed values are redundant before the computation even starts. A **real FFT** is an FFT variant specifically optimized for real-valued (not complex-valued) input, exploiting spectrum symmetry to skip computing the redundant upper half of the spectrum directly, typically running roughly twice as fast as a general complex FFT on the same real-valued input. Every microphone-captured signal in this course is a real FFT's ideal use case — a detail worth remembering when later chapters discuss further speed improvements.

## Running the Transform Backward, Fast

Chapter 9 defined the inverse DFT and noted that this course does not build extensive applications on top of it — but the same divide-and-conquer speedup that turned the DFT into the FFT applies equally well in reverse, and it is worth naming precisely before moving on.

The **IFFT algorithm** is the fast, divide-and-conquer counterpart to the inverse DFT — it reuses the identical recursive structure, twiddle factors, and butterfly operations as the forward FFT, with two small, specific changes: the sign inside the twiddle factor's exponent flips from negative to positive, and the final result is divided by \( N \). Running the IFFT algorithm on a spectrum produces the **inverse FFT**: the specific reconstructed time-domain signal that results from applying the IFFT algorithm to a frequency-domain spectrum, computed in O(N log N) time rather than the inverse DFT's O(N²).

That final division by \( N \), mentioned almost in passing above, is actually the source of a common, entirely avoidable source of confusion when comparing results across different tools. A **normalization factor** is the specific numeric multiplier — commonly \( \frac{1}{N} \), \( \frac{1}{\sqrt{N}} \), or sometimes no factor at all — applied to a transform's output to control its overall amplitude scale. Different libraries make different, equally valid choices about exactly where that factor gets applied, and that choice has its own name worth knowing before comparing any two implementations' raw output numbers directly. **FFT scaling** is the convention a given library or implementation adopts for where and how much normalization it applies across the forward and inverse transform pair — some libraries apply no scaling on the forward transform and a full \( \frac{1}{N} \) on the inverse; others split the scaling evenly, applying \( \frac{1}{\sqrt{N}} \) to both directions.

!!! mascot-warning "Two correct FFTs can still disagree in raw numbers"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning">
    If you ever compare your FFT's raw output magnitude against another library's and the numbers don't match, don't assume a bug before checking scaling convention first. A factor-of-N (or square-root-of-N) mismatch between two mathematically correct implementations is one of the most common false alarms in signal processing — always check each library's documented normalization convention before concluding anything is actually wrong.

#### Diagram: Normalization Factor Explorer

<iframe src="../../sims/normalization-factor-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>Normalization Factor Explorer</summary>
Type: microsim
**sim-id:** normalization-factor-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Demonstrate, calculate

Learning objective: Let students select different FFT scaling conventions and calculate how the same underlying spectrum's displayed magnitude values change purely due to normalization choice, not due to any actual difference in the signal.

Canvas layout:
- Top (300px): a fixed example spectrum bar chart, magnitude by bin
- Bottom (150px): scaling convention selector and a readout showing the applied normalization factor

Visual elements:
- Bar chart of a fixed example spectrum's magnitude values
- Readout: "Forward scaling: [value] | Inverse scaling: [value] | Round-trip scaling: [value]"

Interactive controls:
- Radio buttons: "No forward scaling, 1/N inverse" / "1/sqrt(N) both directions (unitary)" / "1/N forward, no inverse scaling"
- N selector: 8, 512, 1024

Behavior:
- Selecting a different scaling convention rescales every bar in the chart according to that convention's forward-transform factor, while a small annotation confirms that a full forward-then-inverse round trip always reconstructs the original signal exactly, regardless of which convention is chosen

Instructional Rationale: An Apply-level calculator is appropriate because the objective is calculating how a chosen scaling convention changes displayed numbers — direct, immediate recalculation on selection lets students confirm that scaling is a display/convention choice, not a correctness issue.

Implementation notes:
- Use p5.js; use a single fixed example spectrum's unscaled values as the source of truth, multiplying by the selected convention's factor for display only
- Responsive width; chart and controls stack vertically below 600px width
</details>

## Calibrating Against the Professionals

Before trusting this course's from-scratch FFT for the real-audio work ahead, it helps to see how it compares against the industry-standard tools most working engineers reach for first — not to replace the from-scratch implementation, but to calibrate expectations about what "fast" really means once dedicated engineering effort goes into an implementation.

The **NumPy library** is the standard Python library for numerical computing, providing, among many other tools, a highly optimized `numpy.fft.fft()` function written in compiled C code rather than plain Python. A closely related library offers a similar, sometimes more specialized, alternative: **SciPy FFT** refers to `scipy.fft`, an FFT implementation in the SciPy scientific computing library that includes additional specialized variants — including a dedicated real-FFT function — beyond what NumPy's FFT module provides on its own.

Neither library runs on the Pico 2 itself — MicroPython does not include NumPy or SciPy, and this course's actual hardware implementation stays pure MicroPython throughout, deliberately, as stated back in the course description. NumPy and SciPy appear here strictly as a desktop-only reference point: running the exact same 512-sample test signal through `numpy.fft.fft()` on a laptop, and comparing its output against this course's from-scratch FFT (after accounting for each library's normalization factor), is one more cross-validation check — now against a professionally engineered, independently written implementation rather than only against the from-scratch DFT built in Chapter 9.

!!! mascot-tip "Agreement with NumPy is the strongest validation you'll get"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    Your Chapter 9 DFT and your Chapter 12 FFT agreeing with each other is good evidence. Both of *those* independently agreeing with NumPy — a library used and trusted by millions of engineers and scientists — is about as strong a correctness signal as a self-taught implementation can ever get.

## Chapter Summary

You now know the landscape of FFT variants beyond radix-2, how the inverse transform reuses the same fast machinery, and why raw magnitude numbers can differ across libraries without either one being wrong.

Key ideas to carry forward:

- **Decimation in frequency** splits by output bin instead of input index; **radix-4 FFT** and **split-radix FFT** split into more than two pieces per stage — all remain O(N log N), differing only in constant factors and implementation complexity.
- A **complex FFT** handles general input; a **real FFT** exploits spectrum symmetry to run roughly twice as fast on the real-valued signals this course actually captures.
- The **IFFT algorithm** reuses the forward FFT's machinery to compute the **inverse FFT** in O(N log N); its **normalization factor** and a library's overall **FFT scaling** convention explain why two correct implementations can still show different raw numbers.
- The **NumPy library** and **SciPy FFT** provide professionally engineered, desktop-only reference implementations used here purely to calibrate and cross-check this course's from-scratch work.

??? note "Quick check: your FFT and a NumPy FFT are run on the same signal, but the magnitude values don't match — NumPy's are consistently N times larger. Is one of them wrong? — Click to expand"
    Not necessarily. This is the classic signature of an FFT scaling mismatch — the two implementations likely apply their normalization factor at different points (for example, one divides by N on the inverse transform only, while the other doesn't apply any factor at all on the forward transform). Check each library's documented scaling convention before concluding either implementation has a bug.

!!! mascot-celebration "You can now navigate the whole FFT family, not just one variant"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Radix-2, radix-4, split-radix, real, complex, forward, inverse — you now know where your own implementation sits in the much larger FFT landscape, and you've calibrated it against the professionals. Next up: pointing this transform at real, live captured sound and watching an actual spectrum appear on your OLED. Time to transform!
