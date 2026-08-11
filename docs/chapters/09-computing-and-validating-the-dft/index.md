---
title: Computing and Validating the DFT
description: Generalize correlation into the Discrete Fourier Transform, define frequency bins, and validate a working DFT against known ground truth.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 20:40:00
version: 0.09
---

# Computing and Validating the DFT

## Summary

This chapter sweeps the single-frequency correlation from the previous chapter across every frequency bin, producing the Discrete Fourier Transform, and defines frequency bins, bin resolution, and the symmetry of a real-valued signal's spectrum. It then validates the resulting implementation against hand-computed and known-signal test cases, introducing debugging by bisection and the ground-truth mindset used for every implementation later in the course. By the end, students have a working, verified DFT built entirely from first principles.

## Concepts Covered

This chapter covers the following 28 concepts from the learning graph:

1. Absolute Error
2. Bin Center Frequency
3. Bin Exact Frequency
4. Bin Index
5. Bin Resolution
6. Bin Width
7. Complex Exponential
8. DC Bin
9. DFT Definition
10. Debugging By Bisection
11. Discrete Fourier Transform
12. Eight Point DFT By Hand
13. Expected Peak
14. Frequency Bins
15. Frequency Resolution
16. Frequency Sweep
17. Ground Truth
18. Inverse DFT
19. Known Signal Test
20. Negative Frequencies
21. Numerical Tolerance
22. Nyquist Bin
23. Real And Imaginary Parts
24. Relative Error
25. Spectrum Array
26. Spectrum Symmetry
27. Test Signal Design
28. Validation Before Trust

## Prerequisites

This chapter builds on concepts from:

- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [8. Correlation: Does My Signal Contain This Note?](../08-correlation/index.md)

---

!!! mascot-welcome "You already built this — let's give it a name"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Last chapter you correlated a signal against one test frequency at a time. This chapter does something almost embarrassingly simple: repeat that exact process at every frequency you care about, and keep every result. That's it. That's the Discrete Fourier Transform. Let's tune in.

## From One Correlation to All of Them

The correlation-vs-test-frequency sweep at the end of the previous chapter already did almost everything this chapter formalizes — it just did it as a demonstration rather than as a defined, reusable transform. Making that sweep official, and running it systematically, produces one of the most important tools in this entire course.

The **Discrete Fourier Transform**, or DFT, is a mathematical operation that converts a finite sequence of time-domain samples into a corresponding sequence of frequency-domain values, each one measuring how strongly a specific frequency is present in the original signal — precisely the multiply-and-sum correlation from Chapter 8, computed once for every frequency in a defined set rather than just one. Its exact mathematical statement is worth having in one place, since every implementation in this course traces back to it directly.

The **DFT definition** states the transform formally, using the complex exponential form of the correlation test wave introduced conceptually last chapter:

#### DFT Definition

\[ X[k] = \sum_{n=0}^{N-1} x[n] \cdot e^{-i 2\pi k n / N} \]

where:

- \( X[k] \) is the complex-valued DFT output for frequency index \( k \)
- \( x[n] \) is the time-domain input signal's sample at index \( n \)
- \( N \) is the total number of samples in the signal
- \( i \) is the imaginary unit
- \( k \) ranges from 0 to \( N-1 \)

The term \( e^{-i 2\pi k n / N} \) inside the sum is not a new idea — it is Euler's formula from Chapter 7, applied as the combined in-phase and quadrature test wave from Chapter 8, written as a single expression. A **complex exponential** is a term of the form \( e^{i\theta} \), which — by Euler's formula — simultaneously represents a cosine (real part) and a sine (imaginary part) test wave at once, letting a single multiply-and-sum operation compute the in-phase and quadrature components together instead of running two separate correlations.

!!! mascot-thinking "One formula replaces two correlations"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Notice what just happened: last chapter needed two separate correlations — one against sine, one against cosine — to get phase-independent results. The complex exponential in the DFT definition does both at once, because its real and imaginary parts *are* the cosine and sine test waves. Complex numbers were not decoration in Chapter 7 — this is the payoff.

## Frequency Bins: Slicing the Spectrum

Running the DFT definition once for each value of \( k \) from 0 to \( N-1 \) produces \( N \) separate output values, each one a measurement of a specific, distinct frequency. Those distinct output slots have a name used throughout the rest of this course.

**Frequency bins** are the individual output slots of a DFT, each one corresponding to a specific frequency and containing a complex value that measures how strongly that frequency is present in the input signal. The integer that identifies which bin is which is the **bin index**: the integer \( k \), ranging from 0 to \( N-1 \), that labels which frequency bin a given DFT output value corresponds to.

Converting a bin index into an actual frequency in Hertz — the number that actually matters to a listener or a display — uses a direct formula. The **bin exact frequency** is the precise frequency, in Hertz, that a given bin index represents, computed as \( f_k = \frac{k \cdot f_s}{N} \), where \( f_s \) is the sampling rate. Because a real-world signal's frequency essentially never lands exactly on one of these computed values, each bin is better understood as covering a small range rather than a single infinitely precise point — which is why that computed frequency is more precisely called the **bin center frequency**: the specific frequency value a bin is centered on, understood as the middle of a small range of frequencies that bin actually represents, since real signal energy near — but not exactly at — that frequency still shows up primarily in that bin.

#### Bin Exact / Center Frequency

\[ f_k = \frac{k \cdot f_s}{N} \]

where:

- \( f_k \) is the frequency, in Hertz, that bin \( k \) represents
- \( k \) is the bin index
- \( f_s \) is the sampling rate, in Hertz
- \( N \) is the total number of samples (and bins)

How wide that small range around each bin center actually is has its own name and its own formula. The **bin width** is the span of frequency, in Hertz, covered by a single frequency bin, equal to \( \frac{f_s}{N} \) — the same value as the spacing between one bin's center frequency and the next. Zooming out from a single bin to the whole spectrum, the overall coarseness or fineness of a DFT's frequency axis is described by a related, broader term: **bin resolution** is the granularity of the frequency axis a DFT produces, jointly determined by the sampling rate and the number of samples used — a "high resolution" DFT has many closely-spaced bins; a "low resolution" DFT has few, widely-spaced ones.

That granularity has a direct, practical consequence worth naming on its own, because it determines whether two close-together real-world frequencies can be told apart at all. **Frequency resolution** is the smallest difference in frequency between two signal components that a DFT can distinguish as separate — numerically equal to the bin width, but framed as a practical limit rather than a formula: two tones closer together than one bin width blur into the same bin and cannot be told apart, no matter how the resulting spectrum is displayed.

!!! mascot-warning "Bigger N buys resolution, but it isn't free"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning">
    It's tempting to always want more frequency resolution — just increase N, right? It works, but N also directly controls how many samples (and how much time) the DFT needs before it can produce a single result, and — as the very next chapter shows — how much computation it costs. Resolution and speed pull in opposite directions, and balancing them is a real engineering decision, not a free upgrade.

Before the interactive explorer below, it helps to see all of these bin-related quantities computed together for a concrete, adjustable example, since the relationships between \( N \), sampling rate, bin width, and bin count are easiest to internalize by watching them move together.

#### Diagram: DFT Frequency Bin Explorer

<iframe src="../../sims/dft-frequency-bin-explorer/main.html" width="100%" height="422px" scrolling="no"></iframe>

<details markdown="1">
<summary>DFT Frequency Bin Explorer</summary>
Type: microsim
**sim-id:** dft-frequency-bin-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students adjust the number of samples (N) and the sampling rate and calculate the resulting bin width, frequency resolution, and each bin's center frequency, observing the tradeoff between frequency resolution and bin count directly.

Canvas layout:
- Top (300px): a horizontal row of labeled bin boxes (bin 0 through bin N-1, or a scrollable/collapsed view for large N), each showing its bin index and center frequency
- Bottom (200px): controls and a computed-values readout panel

Visual elements:
- Row of bin boxes, index and frequency labeled on each
- Special highlight color on bin 0 (labeled "DC") and the middle bin (labeled "Nyquist")
- Readout panel: "Bin width = f_s / N = [value] Hz", "Frequency resolution = [value] Hz", "Number of bins = N = [value]"

Interactive controls:
- Slider: N (number of samples), values 8, 16, 32, 64, 128, 256, 512, default 512
- Slider: Sampling rate, range 4,000-16,000 Hz, default 16,000 Hz
- Clicking any bin box highlights it and displays its exact center frequency and covered range in the readout panel

Behavior:
- Changing N or sampling rate immediately recalculates and redraws every bin's center frequency, along with the bin width and frequency resolution readouts
- Increasing N visibly increases the number of bin boxes and shrinks the frequency gap between them, making the resolution/bin-count tradeoff directly visible

Instructional Rationale: An Apply-level calculator with live parameter sliders is appropriate because the objective is computational — students should be able to predict how changing N or sampling rate changes bin width and resolution, then confirm that prediction by dragging a slider and watching every computed value update together.

Implementation notes:
- Use p5.js; recompute all bin center frequencies as k * sample_rate / N for k = 0 to N-1 whenever a slider changes
- Responsive width; bin row becomes horizontally scrollable on narrow viewports rather than shrinking bins below a readable size
</details>

## Two Bins Worth Knowing by Name

Among all the frequency bins a DFT produces, two specific ones show up so often in later chapters that they deserve names of their own, along with an explanation of why half the spectrum turns out to be redundant for the kind of signal this course captures.

Bin index 0 always represents zero Hertz — no oscillation at all, just a constant offset. The **DC bin** is frequency bin 0, representing 0 Hz, whose value reflects the average (constant, non-oscillating) level of the input signal — the same "DC component" concept from Chapter 4, now appearing as a specific, isolated bin in the spectrum rather than an unwanted offset to be removed by hand. At the opposite end of the useful range sits the **Nyquist bin**: the frequency bin located at index \( N/2 \), representing exactly the Nyquist frequency from Chapter 6 — the highest frequency a given sampling rate can represent at all.

Bins beyond the Nyquist bin, from \( N/2 + 1 \) up to \( N-1 \), do not represent new, higher frequencies the way it might first seem. Because the complex exponential test wave in the DFT definition repeats periodically, these upper-index bins mathematically correspond to **negative frequencies**: frequency values that are, by the mathematics of the complex exponential basis, the mirror image of positive frequencies below the Nyquist bin, arising as a direct consequence of how the DFT's complex exponential basis functions are defined rather than describing any physically new information in a real-valued input signal.

For the microphone-captured, real-valued signals this course works with almost exclusively, this mirroring is not an inconvenience to work around — it is a guaranteed, exploitable structure. **Spectrum symmetry** is the property that, for a real-valued (not complex-valued) input signal, the upper half of the DFT output spectrum is always the complex conjugate of the lower half, mirrored around the Nyquist bin — meaning the bins from \( N/2+1 \) to \( N-1 \) carry no independent information beyond what bins 1 through \( N/2 - 1 \) already contain. This is precisely why spectrum displays in this course, from this chapter forward, only ever plot the lower half of the spectrum: the upper half is a guaranteed, redundant mirror.

#### Diagram: Spectrum Symmetry Mirror

<iframe src="../../sims/spectrum-symmetry-mirror/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Spectrum Symmetry Mirror</summary>
Type: infographic
**sim-id:** spectrum-symmetry-mirror<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, interpret

Learning objective: Let students interpret a full N-point DFT spectrum and explain why bins above the Nyquist bin mirror bins below it as complex conjugates, for a real-valued input signal.

Canvas layout:
- A full-width horizontal bar of N bin boxes, indices 0 through N-1, laid out left to right
- Infobox panel below, populated on click

Visual elements:
- Bin 0 highlighted distinctly and labeled "DC bin"
- Bin N/2 highlighted distinctly and labeled "Nyquist bin"
- Bins 1 through N/2-1 shaded blue, labeled "Positive frequencies (unique, useful)"
- Bins N/2+1 through N-1 shaded gray with a dashed mirror-line back to their corresponding lower bin, labeled "Negative frequencies (mirror / redundant for real input)"
- Connector arcs drawn between mirrored bin pairs (e.g., bin 5 and bin N-5) when either is clicked

Interactive elements:
- Clicking any bin in the blue (positive frequency) region draws a connecting arc to its mirror bin in the gray region and displays: "Bin [k] and bin [N-k] are complex conjugates — same magnitude, opposite-signed imaginary part — because the input signal is real-valued."
- Clicking the DC bin or Nyquist bin displays a note that these two bins are their own mirror (no separate partner)

Instructional Rationale: An Understand-level clickable infographic is appropriate because the objective is explaining a structural relationship (conjugate mirroring) between specific labeled parts of a static structure — click-triggered connector arcs make the abstract "bin k mirrors bin N-k" relationship spatially obvious rather than requiring students to compute it themselves.

Implementation notes:
- Use p5.js; draw N bin boxes proportioned to fit the container width, using a fixed example N (e.g., 16) for clarity regardless of the N used elsewhere in the chapter
- Responsive width; bin boxes shrink proportionally, wrapping to a second row only below a minimum readable bin width
</details>

## Storing the Result

Each frequency bin's DFT output is a single complex number, and a complete DFT produces \( N \) of them together. That complete collection needs a data structure to live in, and its two pieces need names of their own.

A **spectrum array** is the data structure — typically an array of complex numbers — that holds the complete set of DFT output values, one entry per frequency bin, indexed by bin index. Because MicroPython (like most languages) represents a complex number as two separate numbers rather than one combined type in performance-critical code, each entry in that array is usually stored as its **real and imaginary parts**: the two separate numeric components of a complex DFT output value — the real part corresponding to the in-phase component and the imaginary part corresponding to the quadrature component from the previous chapter — from which magnitude, and eventually phase, can be computed whenever needed.

Before the code below, it's worth stating exactly what it computes: for each bin index `k` from 0 to `N-1`, the function sums the product of every input sample against the real and imaginary parts of that bin's complex exponential test wave, accumulating the real and imaginary totals separately — a direct, literal implementation of the DFT definition above.

```python
import math

def dft(x):
    N = len(x)
    spectrum = []                      # Spectrum array
    for k in range(N):                 # One pass per frequency bin
        real_sum = 0.0
        imag_sum = 0.0
        for n in range(N):
            angle = -2 * math.pi * k * n / N
            real_sum += x[n] * math.cos(angle)   # In-phase (real) part
            imag_sum += x[n] * math.sin(angle)   # Quadrature (imaginary) part
        spectrum.append((real_sum, imag_sum))    # Real and imaginary parts
    return spectrum
```

## Going Backward: The Inverse DFT

The DFT converts a time-domain signal into a frequency-domain spectrum. The reverse operation also exists, and it will matter for a handful of specialized topics later in the course. The **inverse DFT** is the mathematical operation that reconstructs the original time-domain signal exactly from its complete spectrum array, defined as the DFT formula run in reverse with the sign of the exponent flipped and the result divided by \( N \):

#### Inverse DFT Definition

\[ x[n] = \frac{1}{N}\sum_{k=0}^{N-1} X[k] \cdot e^{i 2\pi k n / N} \]

where the symbols match the forward DFT definition, with the transform running from frequency bins \( X[k] \) back to time-domain samples \( x[n] \). This course does not build extensive applications on top of the inverse DFT, but its existence — and the fact that the forward and inverse transforms are near-mirror images of each other mathematically — is worth knowing, since it confirms that converting to the frequency domain never actually discards information: every bit of the original signal is recoverable, in principle, from its complete spectrum.

## Computing an Eight-Point DFT by Hand

Trusting a formula and trusting an implementation are two different things, and the gap between them is exactly what the rest of this chapter closes. Before validating code, it helps enormously to compute one small, complete example by hand, so there is a known-correct reference to compare against later.

An **eight-point DFT by hand** is a fully worked numerical example computing all eight output bins of a DFT for a small, specific eight-sample input signal, performed with pencil, calculator, or a simple spreadsheet rather than running code — deliberately small enough to check every multiplication and addition by hand, yet large enough to exhibit real bin structure, a DC bin, a Nyquist bin, and spectrum symmetry all at once.

#### Diagram: Eight-Point DFT by Hand Calculator

<iframe src="../../sims/eight-point-dft-by-hand-calculator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Eight-Point DFT by Hand Calculator</summary>
Type: microsim
**sim-id:** eight-point-dft-by-hand-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, interpret

Learning objective: Let students step through the full arithmetic of an 8-point DFT calculation bin by bin, seeing every multiplication and sum with concrete numbers, so they can explain how the abstract DFT definition becomes a specific numeric result.

Canvas layout:
- Top (200px): the fixed 8-sample input signal shown as a small bar chart, values visible as numbers above each bar
- Middle (200px): the current bin's calculation worked out step by step (each of the 8 sample-times-test-wave-value products, then the running sum)
- Bottom (150px): Next/Previous bin controls and a running results table (bin index, real part, imaginary part, magnitude) that fills in as each bin is completed

Visual elements:
- 8-sample input bar chart with exact numeric values labeled (a fixed example signal, e.g., a simple combination of a DC offset and one clean sinusoid sampled at exactly one full cycle across the 8 points)
- Step-by-step arithmetic display for the current bin: each term x[n] × cos(angle) and x[n] × sin(angle), then the accumulating real and imaginary sums
- Results table growing one row at a time as each bin (0 through 7) is completed

Interactive controls:
- Button: "Next bin" — advances to computing the next bin index's full arithmetic
- Button: "Previous bin"
- Button: "Show all 8 samples' individual products for this bin" (expand/collapse detail)

Data Visibility Requirements:
  Stage 1: Show the fixed 8-sample input signal with exact values
  Stage 2 (per bin): Show each of the 8 individual products for both real and imaginary parts
  Stage 3 (per bin): Show the summed real and imaginary totals for that bin
  Final: Show the complete 8-row results table with every bin's real part, imaginary part, and magnitude, with bin 0 (DC) and bin 4 (Nyquist, since N=8) specially labeled

Instructional Rationale: An Understand-level step-through worked example is appropriate because the objective is explaining how the DFT definition produces a specific numeric result — concrete, fully-visible arithmetic at every step lets students verify the formula themselves rather than trusting a black-box calculation, directly preparing them to validate their own code against this exact worked answer.

Implementation notes:
- Use p5.js; precompute the fixed 8-sample example and its correct DFT result once, then reveal it progressively through the step controls
- Responsive width; the three stacked panels scale to container width on window resize
</details>

!!! mascot-tip "This worked example is your answer key"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    Keep the results table from this calculator open in another tab when you write your own DFT code. Feeding your code the exact same 8-sample input and comparing its output bin by bin against this worked answer is the fastest, most reliable way to catch a bug before it hides inside a more complicated signal.

## Validation Before Trust

A DFT implementation that merely runs without crashing has proven almost nothing — it could easily produce plausible-looking numbers that are still completely wrong. This course treats a stronger standard as non-negotiable, starting here and continuing through every implementation that follows.

**Validation before trust** is the governing principle that no implementation should be relied upon for further work until it has been checked against an independently known correct answer — a working-looking result is not the same as a *correct* result, and this course treats the difference as the entire point of engineering discipline. That independently known correct answer needs a name of its own: **ground truth** is a correct, independently verified reference result — such as the hand-computed eight-point DFT above — used as the standard a new implementation's output is checked against.

Producing ground truth for a DFT implementation is easiest with input signals specifically chosen to make the correct answer obvious in advance, rather than a real, messy recorded sound. A **known signal test** validates an implementation by feeding it an input signal whose correct frequency-domain output is already known in advance, then comparing the implementation's actual output against that known-correct answer. Choosing exactly what that input signal should look like is itself a deliberate skill worth naming: **test signal design** is the practice of deliberately constructing a test input — such as a pure sine wave at a frequency that lands exactly on a bin center — specifically to make the correct expected output simple, unambiguous, and easy to verify by hand.

A well-designed test signal makes a strong, specific prediction about where in the spectrum a peak should appear. The **expected peak** is the specific frequency bin, computed in advance from ground truth, where a known test signal's energy should concentrate in the resulting spectrum — a pure 2,000 Hz tone sampled at 16,000 Hz across 512 samples has an expected peak at a bin index computable directly from the bin exact frequency formula, before the DFT ever runs.

## Measuring How Wrong Is Too Wrong

Floating-point arithmetic virtually never produces a computed result that matches an expected value to the last decimal digit — some tiny discrepancy is normal and expected, not necessarily a bug. Deciding how much discrepancy is acceptable requires a precise way to measure it.

The **absolute error** is the plain numeric difference between a computed value and its expected value, \( |{\text{computed} - \text{expected}}| \), with no adjustment for the size of the numbers involved. Because the same absolute error can be negligible for a large expected value and enormous for a small one, a scaled version is often more meaningful: the **relative error** is the absolute error expressed as a fraction (or percentage) of the expected value's magnitude, \( \frac{|\text{computed} - \text{expected}|}{|\text{expected}|} \), making error comparable across values of very different sizes.

Deciding, in advance, exactly how much error is acceptable for a given comparison to still count as "correct" is the last piece needed before writing an actual test. **Numerical tolerance** is a deliberately chosen threshold below which a computed value's error, relative to its expected value, is still considered correct — accounting for the unavoidable tiny discrepancies inherent to floating-point arithmetic, without being so loose that a genuine bug slips through undetected.

| Term | Formula | When to prefer it |
|---|---|---|
| Absolute error | \( \lvert \text{computed} - \text{expected} \rvert \) | Comparing values of similar, known scale |
| Relative error | \( \dfrac{\lvert \text{computed} - \text{expected} \rvert}{\lvert \text{expected} \rvert} \) | Comparing values across very different magnitudes |
| Numerical tolerance | A chosen threshold, e.g. 0.1% | Deciding pass/fail for an automated test |

Confirming a DFT implementation works correctly not just at one single frequency but across its entire usable range uses one more validation technique, already previewed informally in the last chapter's correlation chart. A **frequency sweep** — used here specifically as a validation technique — feeds a known test signal at a systematically increasing series of frequencies into an implementation and confirms that the detected peak correctly tracks the input frequency at every step, catching bugs that a single fixed-frequency test might miss entirely.

#### Diagram: DFT Validation Dashboard

<iframe src="../../sims/dft-validation-dashboard/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>DFT Validation Dashboard</summary>
Type: infographic
**sim-id:** dft-validation-dashboard<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Evaluate
Bloom Taxonomy Verb: Judge, validate

Learning objective: Let students judge whether a DFT implementation passes validation by comparing a computed spectrum's peak against an expected peak within a chosen numerical tolerance, across a swept range of test frequencies.

Canvas layout:
- Top (250px): computed spectrum bar chart for the currently selected test frequency, expected peak bin marked with a dashed line
- Bottom (200px): pass/fail summary table across a full frequency sweep, plus a tolerance slider

Visual elements:
- Bar chart of spectrum magnitude by bin index, for the current known test signal
- Dashed vertical marker at the expected peak bin, computed from ground truth
- Color-coded pass (green) / fail (red) indicator based on whether relative error at the expected peak is within the chosen tolerance
- Summary table: one row per swept test frequency, showing expected bin, actual detected bin, relative error, and pass/fail

Interactive controls:
- Slider: "Test frequency" (manually move through the swept range one at a time)
- Slider: "Numerical tolerance" (0.01% to 5%), default 0.1%
- Button: "Run full frequency sweep" — automatically steps through the full range and populates the summary table

Behavior:
- Selecting a test frequency updates the spectrum bar chart and shows whether that specific case passes or fails at the current tolerance
- Running the full sweep populates every row of the summary table at once, letting students see at a glance whether validation passes uniformly across the entire usable frequency range or fails at specific points

Instructional Rationale: An Evaluate-level pattern is appropriate because the objective is judging pass/fail against a defined standard (numerical tolerance) — a dashboard that surfaces the comparison explicitly, rather than hiding it inside a script's exit code, makes the judgment process itself visible and teachable.

Implementation notes:
- Use p5.js; compute the DFT of each synthesized test signal directly in JavaScript for the swept frequencies
- Responsive width; chart and summary table stack vertically below 700px width
</details>

## Debugging by Bisection

Even a carefully validated DFT implementation will, at some point, fail a test — and when it does, this course teaches one specific, systematic strategy for finding out why, rather than guessing.

**Debugging by bisection** is a systematic debugging strategy that locates the source of an error by repeatedly narrowing the search space in half — checking an intermediate point between known-good and known-bad states, determining which half still contains the problem, and repeating — converging on the exact faulty step far faster than checking every step in order.

Applied to a failing DFT implementation, debugging by bisection typically looks like this:

1. Confirm the failure is real by re-running the known signal test — rule out a one-time fluke.
2. Check the input signal itself against ground truth before suspecting the DFT code at all — a wrong test signal produces a wrong expected peak.
3. Compare the DC bin (bin 0) alone against its known expected value — the simplest possible case, isolating whether the basic summation logic works at all.
4. If the DC bin passes, jump to the middle of the spectrum (around the Nyquist bin) rather than checking every bin in sequence — a bisection step that immediately halves the remaining search space.
5. Continue bisecting between the last known-good bin and the first known-bad bin until the exact failing calculation is isolated.

!!! mascot-encourage "Every implementation in this course gets this same treatment"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Twenty-eight concepts in one chapter, and a lot of them are about testing rather than the transform itself — that's deliberate. The validation habit you're building right now is the exact same habit the FFT chapters, the assembly chapters, and the capstone all lean on. Learn it once here, on code you can already check by hand, and it pays off for the rest of the course.

## Chapter Summary

You now have a complete, working, *validated* Discrete Fourier Transform — the first frequency-domain tool in this course built entirely from first principles and proven correct against known answers.

Key ideas to carry forward:

- The **DFT definition** generalizes Chapter 8's correlation across every **frequency bin**, using a **complex exponential** to combine in-phase and quadrature in one term; the **Discrete Fourier Transform** is the resulting operation.
- Each bin has a **bin index**, a **bin exact frequency** and **bin center frequency**, and a **bin width**; together these determine **bin resolution** and, practically, **frequency resolution**.
- Bin 0 is the **DC bin**; bin \( N/2 \) is the **Nyquist bin**; bins above it represent **negative frequencies**, producing **spectrum symmetry** for real-valued input.
- Results are stored in a **spectrum array** of **real and imaginary parts**; the **inverse DFT** reconstructs the original signal from that spectrum.
- An **eight-point DFT by hand** produces trustworthy **ground truth** for a **known signal test**, built through deliberate **test signal design** with a computable **expected peak**.
- **Absolute error**, **relative error**, and **numerical tolerance** define what "close enough" means; a **frequency sweep** validates correctness across the whole range — all in service of **validation before trust**, with **debugging by bisection** as the systematic fallback when a test fails.

??? note "Quick check: a 512-sample DFT is computed on a signal sampled at 16,000 Hz. What is the frequency resolution, and which bin index is the Nyquist bin? — Click to expand"
    Frequency resolution (= bin width) is f_s / N = 16,000 / 512 = 31.25 Hz per bin. The Nyquist bin is at index N/2 = 256, representing exactly the Nyquist frequency of 8,000 Hz.

!!! mascot-celebration "A working, validated DFT — built entirely by hand"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    This is the milestone the whole first half of the course has been building toward: a Discrete Fourier Transform you built, understand completely, and have actually proven correct — not just trusted. There's just one problem left, and it's a big one: this implementation is astonishingly slow. The next chapter measures exactly how slow, and why. Not bad for a $5 chip — yet.
