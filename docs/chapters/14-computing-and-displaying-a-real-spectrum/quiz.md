# Quiz: Computing and Displaying a Real Spectrum

Test your understanding of turning FFT output into a displayed spectrum, from magnitude and phase through decibel scaling and the whistle test, with these review questions.

---

#### 1. What is the whistle test, and what does it validate?

<div class="upper-alpha" markdown>
1. A calibration procedure that compares FFT output against NumPy's reference implementation
2. A unit test that checks whether decibel conversion produces values within a numerical tolerance
3. A hardware diagnostic that verifies the OLED display's refresh rate
4. An end-to-end validation in which a student whistles a rising or falling pitch while watching the live spectrum display, confirming the displayed peak visibly follows the pitch change in real time
</div>

??? question "Show Answer"
    The correct answer is **D**. The whistle test exercises every piece of this chapter's pipeline simultaneously — frame capture, spectral analysis, magnitude computation, scaling, and display — using nothing but a human ear and eye as the reference. Unlike earlier validations that compared numbers to numbers, this is the first end-to-end proof that the whole pipeline works on real, live sound.

    **Concept Tested:** Whistle Test

---

#### 2. A complex spectrum bin has a real part of 3 and an imaginary part of 4. Using magnitude calculation, what is its magnitude?

<div class="upper-alpha" markdown>
1. |X[k]| = √(re² + im²) = 5
2. |X[k]| = re + im = 7
3. |X[k]| = re × im = 12
4. |X[k]| = re² + im² = 25
</div>

??? question "Show Answer"
    The correct answer is **A**. Magnitude calculation combines a complex bin's real and imaginary parts using the Pythagorean formula |X[k]| = √(re² + im²) = √(9+16) = √25 = 5. Option D computes re² + im² without taking the square root, which is actually the formula for the power spectrum, not magnitude — a common point of confusion this chapter addresses directly.

    **Concept Tested:** Magnitude Calculation

---

#### 3. A complex spectrum bin has a real part of 0 and an imaginary part of 5. Using phase calculation with atan2(im, re), what is its phase angle?

<div class="upper-alpha" markdown>
1. 0 radians
2. π radians
3. π/2 radians
4. Undefined, since re = 0
</div>

??? question "Show Answer"
    The correct answer is **C**. Phase calculation uses θ = atan2(im, re) specifically because the two-argument form correctly determines the angle's quadrant, unlike a plain single-argument arctangent, which would be undefined when re = 0. With re=0 and im=5, the point lies straight up the imaginary axis, giving an angle of π/2 radians (90 degrees).

    **Concept Tested:** Phase Calculation

---

#### 4. Why does this course's spectrum analyzer display the magnitude spectrum almost exclusively, rather than the phase spectrum?

<div class="upper-alpha" markdown>
1. Because phase spectrum values are always zero for real-valued audio signals
2. Because magnitude answers "how strong is each frequency," the question a tuner or level meter needs answered, while phase — though genuinely useful for synthesis and filtering — doesn't address that question
3. Because computing phase spectrum values is mathematically impossible for FFT output
4. Because magnitude spectrum requires less memory to store than phase spectrum
</div>

??? question "Show Answer"
    The correct answer is **B**. The magnitude spectrum shows how strongly each frequency is present, which is exactly what a tuner, level meter, or spectrum analyzer needs. The phase spectrum carries real information and matters for synthesis and filtering, but it doesn't answer "which notes are present" — the question this course's labs are built around — so it is computed but rarely displayed.

    **Concept Tested:** Magnitude Spectrum

---

#### 5. A drum hit's power spectrum makes its dominant frequency look overwhelmingly dominant compared to displaying the same hit's magnitude spectrum. What explains this difference?

<div class="upper-alpha" markdown>
1. Power spectrum values are computed from a completely different FFT than magnitude spectrum values
2. Magnitude spectrum only displays even-indexed bins, hiding odd-indexed peaks
3. Power is the square of magnitude, so squaring differences makes strong peaks stand out more dramatically than magnitude's more compressed dynamic range
4. Power spectrum applies a decibel conversion automatically, while magnitude spectrum never does
</div>

??? question "Show Answer"
    The correct answer is **C**. The power spectrum squares each bin's magnitude (equivalently re² + im² without the square root), and power versus magnitude describes exactly this tradeoff: squaring differences makes strong peaks stand out dramatically more, while magnitude's smaller dynamic range keeps quieter content more visible alongside louder peaks.

    **Concept Tested:** Power Versus Magnitude

---

#### 6. Using dB = 20 log₁₀(|X[k]|), what is the decibel value of a bin with magnitude 100?

<div class="upper-alpha" markdown>
1. 40 dB
2. 20 dB
3. 200 dB
4. 2 dB
</div>

??? question "Show Answer"
    The correct answer is **A**. Decibel conversion computes dB = 20 log₁₀(magnitude). Since log₁₀(100) = 2, the result is 20 × 2 = 40 dB. This logarithmic scaling is what lets the decibel scale compress a magnitude spectrum's enormous dynamic range into a much narrower, visually usable range for display.

    **Concept Tested:** Decibel Conversion

---

#### 7. What is square root scaling, as applied to a magnitude spectrum for display?

<div class="upper-alpha" markdown>
1. Squaring every magnitude value before it is displayed
2. Taking the square root of the decibel value before display
3. A scaling method that requires computing an FFT twice
4. Displaying magnitude directly — itself already the square root of power — as a computationally cheaper compromise between raw power's dynamic range and full decibel conversion
</div>

??? question "Show Answer"
    The correct answer is **D**. Square root scaling displays magnitude directly, since magnitude is already the square root of power, trading some of decibel conversion's stronger visual compression for a faster calculation that avoids a full logarithm call — useful when a display update cannot afford the extra computation.

    **Concept Tested:** Square Root Scaling

---

#### 8. Why does every spectrum plot in this course show only bins 0 through N/2 rather than the full N bins the FFT produces?

<div class="upper-alpha" markdown>
1. Because bins above N/2 always contain zero energy
2. Because the OLED display's resolution physically cannot render more than N/2 pixels
3. Because the upper half of a real-input signal's spectrum is a guaranteed, redundant mirror of the lower half, adding no new information
4. Because bins above N/2 represent negative frequencies that cannot be displayed
</div>

??? question "Show Answer"
    The correct answer is **C**. Half spectrum display shows only the DC bin through the Nyquist bin because, for a real-valued input, spectrum symmetry guarantees the upper half exactly mirrors the lower half. Plotting the redundant mirror would add no additional information, so every spectrum plot in this course follows this practice without exception.

    **Concept Tested:** Half Spectrum Display

---

#### 9. A 512-point FFT produces 256 usable bins in its half spectrum, but an OLED display has room for only 64 bar positions. What technique does this chapter use to fit the full spectrum onto the available bars?

<div class="upper-alpha" markdown>
1. Discarding every fourth bin so only 64 bins remain
2. Bin averaging for display, which groups several adjacent bins and averages their values into one displayed spectrum bar, so every bin still contributes rather than being discarded
3. Reducing the FFT size to 128 points so it naturally produces 64 bins
4. Displaying only the loudest 64 bins and ignoring the rest
</div>

??? question "Show Answer"
    The correct answer is **B**. Bin averaging for display groups adjacent frequency bins and averages their magnitude or decibel values into a single displayed value, reducing the number of spectrum bars shown without simply discarding the bins that don't fit. The resulting averaged values are what actually get drawn as the spectrum plot's bars, whether on a full live spectrum display or a simpler level meter.

    **Concept Tested:** Bin Averaging For Display

---

#### 10. What is the correct order of this chapter's post-processing pipeline, applied to raw FFT output before display?

<div class="upper-alpha" markdown>
1. Bin averaging, then decibel conversion, then magnitude calculation
2. Decibel conversion first, then magnitude calculation, then phase calculation
3. Fast magnitude approximation, then phase calculation, then half spectrum display
4. Magnitude calculation first, then scale conversion (decibel or square root), then bin averaging last
</div>

??? question "Show Answer"
    The correct answer is **D**. Post-processing covers every computation applied after the transform itself finishes, and this course's pipeline always runs in the same order: magnitude computation first, scale conversion second, bin averaging last, before the result feeds a live spectrum display or level meter. Reversing this order — for instance averaging raw complex values before computing magnitude — would produce a meaningless result, and using fast magnitude approximation would only change the first step's cost, not its position in the sequence.

    **Concept Tested:** Post Processing

