# Quiz: Computing and Validating the DFT

Test your understanding of the Discrete Fourier Transform, frequency bins, and validating an implementation against ground truth with these review questions.

---

#### 1. What does the Discrete Fourier Transform (DFT) compute?

<div class="upper-alpha" markdown>
1. A finite sequence of time-domain samples converted into a corresponding sequence of frequency-domain values, each measuring how strongly a specific frequency is present in the original signal
2. The exact physical voltage present at a microphone's diaphragm at a single instant
3. A single correlation value comparing a signal to exactly one fixed test frequency
4. The average amplitude of a signal over its entire duration
</div>

??? question "Show Answer"
    The correct answer is **A**. The Discrete Fourier Transform, stated precisely by the DFT definition, converts a finite sequence of time-domain samples into frequency-domain values, one per frequency bin — precisely the multiply-and-sum correlation from the previous chapter, run once for every frequency in a defined set instead of just one. The reverse operation, the inverse DFT, reconstructs the original time-domain samples from a complete spectrum.

    **Concept Tested:** Discrete Fourier Transform

---

#### 2. What is a frequency bin's bin index?

<div class="upper-alpha" markdown>
1. The physical memory address where a sample is stored in RAM
2. The number of samples used to compute the DFT
3. The integer k, ranging from 0 to N−1, that labels which frequency bin a given DFT output value corresponds to
4. The amplitude of the loudest frequency component in the spectrum
</div>

??? question "Show Answer"
    The correct answer is **C**. The bin index is the integer k, from 0 to N−1, that labels which of the DFT's N output frequency bins a given value belongs to. It is not a memory address, the sample count itself, or an amplitude — it is purely a label identifying which frequency slot is being described.

    **Concept Tested:** Bin Index

---

#### 3. What do the DC bin and the Nyquist bin each represent in an N-point DFT?

<div class="upper-alpha" markdown>
1. Both represent the same frequency; "DC bin" and "Nyquist bin" are two names for bin index 0
2. The DC bin represents the highest frequency the DFT can resolve, and the Nyquist bin represents 0 Hz
3. Both bins are always empty and carry no signal information
4. The DC bin (index 0) represents 0 Hz — the signal's constant, non-oscillating average level — while the Nyquist bin (index N/2) represents exactly the Nyquist frequency, the highest frequency the sampling rate can represent
</div>

??? question "Show Answer"
    The correct answer is **D**. The DC bin is bin index 0, reflecting the signal's constant average level, while the Nyquist bin sits at index N/2, representing the highest frequency the sampling rate can capture. Bins beyond the Nyquist bin correspond to negative frequencies — a direct consequence of how the DFT's complex exponential basis repeats, not new physical information for a real-valued signal.

    **Concept Tested:** DC Bin

---

#### 4. A 512-sample DFT is computed on a signal sampled at 16,000 Hz. What frequency does bin index 32 represent?

<div class="upper-alpha" markdown>
1. 500 Hz
2. 1,000 Hz
3. 16,000 Hz
4. 32 Hz
</div>

??? question "Show Answer"
    The correct answer is **B**. Bin exact frequency is computed as f_k = k·f_s/N: 32 × 16,000 / 512 = 1,000 Hz. This computed value is also called the bin center frequency, since real signal energy near — but not exactly at — that frequency still shows up primarily in this one bin.

    **Concept Tested:** Bin Exact Frequency

---

#### 5. Using the same 512-sample DFT sampled at 16,000 Hz from the previous scenario, what is the frequency resolution (bin width)?

<div class="upper-alpha" markdown>
1. 512 Hz
2. 16 Hz
3. 8,000 Hz
4. 31.25 Hz
</div>

??? question "Show Answer"
    The correct answer is **D**. Bin width equals f_s/N: 16,000 / 512 = 31.25 Hz — the same value as frequency resolution, the smallest difference in frequency the DFT can distinguish as separate. This bin width also determines a DFT's overall bin resolution: the granularity of its frequency axis for a given sampling rate and N.

    **Concept Tested:** Frequency Resolution

---

#### 6. For a real-valued (not complex-valued) captured audio signal, why do spectrum displays in this course only ever plot the lower half of the DFT output?

<div class="upper-alpha" markdown>
1. Because spectrum symmetry guarantees the upper half of the spectrum is always the complex conjugate of the lower half, carrying no independent information beyond what the lower half already contains
2. Because the upper half of the spectrum always contains only silence for real-valued signals
3. Because plotting the upper half would require twice as much CPU time as the DFT itself
4. Because the upper half represents time-domain data rather than frequency-domain data
</div>

??? question "Show Answer"
    The correct answer is **A**. Spectrum symmetry guarantees that, for a real-valued input signal, the upper half of the DFT output is always the complex conjugate of the lower half, mirrored around the Nyquist bin. Because this mirror is guaranteed and redundant, plotting only the lower half loses no information — not a performance shortcut, but a mathematical fact.

    **Concept Tested:** Spectrum Symmetry

---

#### 7. What is "ground truth" in the context of validating a DFT implementation?

<div class="upper-alpha" markdown>
1. The literal, uncorrected output of a newly written, unvalidated implementation
2. Any frequency value greater than the Nyquist frequency
3. A correct, independently verified reference result — such as a hand-computed eight-point DFT by hand — used as the standard a new implementation's output is checked against
4. The average of several different implementations' outputs, regardless of correctness
</div>

??? question "Show Answer"
    The correct answer is **C**. Ground truth is a correct, independently verified reference — such as an eight-point DFT by hand, built through deliberate test signal design so the correct answer is known in advance. This reflects the validation-before-trust principle: no implementation should be relied upon for further work until it has been checked against an independently known correct answer.

    **Concept Tested:** Ground Truth

---

#### 8. Why might relative error be preferred over absolute error when comparing DFT outputs across bins of very different magnitudes?

<div class="upper-alpha" markdown>
1. Relative error is always numerically smaller than absolute error, making tests easier to pass
2. Relative error expresses the discrepancy as a fraction of the expected value's size, so the same numeric gap is judged differently depending on whether the expected value is large or small, making comparisons meaningful across very different magnitudes
3. Absolute error already accounts for magnitude differences automatically, so relative error is redundant
4. Relative error cannot be computed for complex-valued spectrum output
</div>

??? question "Show Answer"
    The correct answer is **B**. Absolute error is the plain numeric difference between computed and expected values, with no adjustment for scale — the same absolute error can be negligible for a large value and enormous for a small one. Relative error expresses that difference as a fraction of the expected value, making it comparable across bins of very different sizes. A numerical tolerance threshold then decides, in advance, how much relative error still counts as correct.

    **Concept Tested:** Relative Error

---

#### 9. A student's DFT implementation fails a known signal test. Following debugging by bisection, what should the student check first, before inspecting every bin one by one in order?

<div class="upper-alpha" markdown>
1. Every bin from index N-1 down to index 0, in strict reverse order
2. Only the bins corresponding to negative frequencies, since those are most likely to contain a sign error
3. The exact numerical tolerance setting, since a tighter tolerance is always the true cause of a failing test
4. The input signal itself against ground truth first, then the simplest possible case (the DC bin), before jumping to the middle of the spectrum (around the Nyquist bin) to repeatedly halve the remaining search space rather than checking every bin sequentially
</div>

??? question "Show Answer"
    The correct answer is **D**. Debugging by bisection converges on a fault by repeatedly narrowing the search space in half rather than checking everything in sequence: confirm the input signal itself is correct, check the simplest case (the DC bin) first, then jump to the middle of the spectrum instead of scanning bin by bin. A frequency sweep — checking that a detected peak tracks its expected peak across many test frequencies — is a separate technique for confirming correctness across the whole usable range, not a bisection step.

    **Concept Tested:** Debugging By Bisection

---

#### 10. Why does the DFT definition use a complex exponential term, e^(−i2πkn/N), instead of separate sine and cosine test waves?

<div class="upper-alpha" markdown>
1. Because, by Euler's formula, a complex exponential simultaneously represents a cosine (real part) and a sine (imaginary part) test wave at once, letting a single multiply-and-sum operation compute the in-phase and quadrature components together instead of running two separate correlations
2. Because complex exponentials execute faster on a microcontroller than any real-valued arithmetic
3. Because sine and cosine test waves cannot be represented in MicroPython at all
4. Because the complex exponential eliminates the need for a spectrum array entirely
</div>

??? question "Show Answer"
    The correct answer is **A**. A complex exponential is a term of the form e^(iθ), which — by Euler's formula — simultaneously represents a cosine and sine test wave, so one multiply-and-sum operation replaces two separate correlations from the previous chapter. Each bin's result is still stored in the spectrum array as its real and imaginary parts, from which magnitude is computed whenever needed.

    **Concept Tested:** Complex Exponential
