# Quiz: Windowing, Spectral Leakage, and Peak Detection

Test your understanding of spectral leakage, window functions, and sub-bin-accurate peak detection with these review questions.

---

#### 1. What causes spectral leakage in a DFT or FFT spectrum?

<div class="upper-alpha" markdown>
1. Using too few bits to store each sample's amplitude
2. Computing the FFT with a non-power-of-two input size
3. An edge discontinuity, where a signal's value at the end of a captured frame does not match its value at the start, forcing the DFT's implicit periodic-repetition assumption to produce an artificial jump
4. Applying a window function before running the transform
</div>

??? question "Show Answer"
    The correct answer is **C**. An edge discontinuity occurs when a captured frame's start and end values don't match, breaking the DFT's implicit assumption that the frame repeats forever. Representing that artificial jump requires energy spread across many frequencies, producing spectral leakage — and its visible consequence, the spectral leakage effect, is a peak that smears across several bins instead of appearing as one sharp spike.

    **Concept Tested:** Spectral Leakage

---

#### 2. What is the rectangular window, as defined in this chapter?

<div class="upper-alpha" markdown>
1. A window that boosts side lobe suppression at the cost of a wider main lobe
2. A window applied only to zero-padded frames
3. A window that requires the FFT size to be a multiple of four
4. The implicit "do-nothing" window applied whenever no explicit windowing is used — every sample keeps its full value with an abrupt cutoff to zero at the frame boundary
</div>

??? question "Show Answer"
    The correct answer is **D**. The rectangular window is what every captured frame receives by default when no explicit windowing is applied. Its abrupt cutoff at the frame edge is itself a source of edge discontinuity. It has the narrowest possible main lobe width of any common window, but also the highest (worst) side lobe level — the exact tradeoff the rest of the chapter addresses.

    **Concept Tested:** Rectangular Window

---

#### 3. What does the window tradeoff guarantee about every windowing function's main lobe width and side lobe level?

<div class="upper-alpha" markdown>
1. Reducing side lobe level (less leakage) always comes at the cost of increasing main lobe width (worse ability to distinguish close frequencies), with no window minimizing both
2. Both can always be minimized simultaneously by choosing a sufficiently long window
3. Main lobe width and side lobe level are unrelated properties that vary independently
4. Every window has an identical main lobe width, differing only in side lobe level
</div>

??? question "Show Answer"
    The correct answer is **A**. The window tradeoff is a fundamental, unavoidable relationship: whichever window suppresses side lobes more aggressively also widens its main lobe. No window can minimize both main lobe width and side lobe level simultaneously — choosing a window means choosing which cost matters less for a given application.

    **Concept Tested:** Window Tradeoff

---

#### 4. A student needs to isolate a very weak tone sitting right next to a much stronger one and can tolerate a wider main lobe to do it. Which window best fits this situation?

<div class="upper-alpha" markdown>
1. Rectangular window, for its narrowest possible main lobe
2. Hamming window, for its low side lobe level immediately next to the main lobe
3. Blackman window, for its substantially lower side lobe levels than Hann or Hamming, despite its widest main lobe
4. Hanning window, for its exact zero taper at both edges
</div>

??? question "Show Answer"
    The correct answer is **C**. The Blackman window uses a more elaborate combination of cosine terms to achieve substantially lower side lobe levels than either the Hanning window or the Hamming window, at the cost of the widest main lobe among the three — exactly the profile needed to isolate a weak tone next to a much stronger one, where suppressing side lobes matters more than distinguishing close frequencies.

    **Concept Tested:** Blackman Window

---

#### 5. A magnitude spectrum has values [2, 5, 40, 12, 3] across five bins, with a rejection threshold of 10. Using argmax search combined with threshold rejection, which bin index is reported as the peak bin?

<div class="upper-alpha" markdown>
1. Index 0
2. Index 2
3. Index 3
4. No peak is reported, since no bin exceeds the threshold
</div>

??? question "Show Answer"
    The correct answer is **B**. Argmax search, the simplest peak detection algorithm, scans the whole array and returns the index of its single largest value — here, bin 2 with magnitude 40, comfortably a local maximum above its neighbors. Since 40 exceeds the threshold of 10, threshold rejection does not discard it, so bin 2 is reported as the peak bin, corresponding to the signal's dominant frequency.

    **Concept Tested:** Argmax Search

---

#### 6. A peak bin has magnitude 100, its lower neighbor has magnitude 40, and its upper neighbor has magnitude 90. In which direction does parabolic interpolation shift the estimated true peak?

<div class="upper-alpha" markdown>
1. Toward the lower-magnitude neighbor (downward)
2. Exactly at the peak bin's center, with zero offset
3. Toward the higher-magnitude neighbor (upward), since gamma (90) exceeds alpha (40)
4. The formula cannot determine a direction without knowing the sampling rate
</div>

??? question "Show Answer"
    The correct answer is **C**. Parabolic interpolation fits a parabola through the peak bin and its two neighbors to achieve sub-bin accuracy in frequency estimation. Because the upper neighbor (γ=90) is larger than the lower neighbor (α=40), the fitted parabola is not symmetric around the peak bin — it leans toward the neighbor carrying more energy, shifting the estimated true peak upward.

    **Concept Tested:** Parabolic Interpolation

---

#### 7. Using f = (k + δ) × fs / N, what frequency does bin position k = 10 with fractional offset δ = 0.5 correspond to, given fs = 16,000 Hz and N = 512?

<div class="upper-alpha" markdown>
1. 328.125 Hz
2. 312.5 Hz
3. 500 Hz
4. 164.06 Hz
</div>

??? question "Show Answer"
    The correct answer is **A**. Bin to frequency conversion substitutes the interpolated bin position (k+δ) for a plain integer index: f = (10 + 0.5) × 16,000 / 512 = 10.5 × 31.25 = 328.125 Hz. Option B (312.5 Hz) is what a plain integer bin index of 10 would give without the parabolic interpolation offset applied.

    **Concept Tested:** Bin To Frequency

---

#### 8. What relationship does an octave describe between two musical notes sharing the same name, such as A4 (440 Hz) and A5 (880 Hz)?

<div class="upper-alpha" markdown>
1. A4 and A5 differ by exactly 12 Hz
2. A4 and A5 are the same frequency measured in different units
3. A5's frequency is exactly half of A4's frequency
4. A5's frequency is exactly double A4's frequency — a doubling (or halving) of frequency defines an octave
</div>

??? question "Show Answer"
    The correct answer is **D**. An octave is a doubling (or halving) of frequency: A5 at 880 Hz is exactly twice A4's 440 Hz, and both share the note name "A" despite sounding at clearly different pitches. Musical note mapping uses this relationship, anchored to A4 = 440 Hz, as part of the broader process of music analysis that converts pitch detection results into a labeled note and octave.

    **Concept Tested:** Octave

---

#### 9. A student zero-pads a captured frame before running the FFT, hoping to improve the true frequency resolution limit. What actually happens?

<div class="upper-alpha" markdown>
1. The frequency resolution limit improves proportionally to how many zeros are appended
2. Zero padding makes the spectrum plot appear smoother with more, closer-spaced bins, but it does not improve the frequency resolution limit, which is set by how much real signal duration was actually captured
3. Zero padding always increases spectral leakage, regardless of windowing
4. Zero padding replaces the need for a windowing function entirely
</div>

??? question "Show Answer"
    The correct answer is **B**. Zero padding appends zero-valued samples to form a longer zero padding input, increasing the FFT's effective size and giving more, closer-spaced bins to interpolate between — a genuine aid to parabolic interpolation's visual smoothness. But the frequency resolution limit is set by how much real signal was actually captured; padding adds points to look at, not new information to distinguish with.

    **Concept Tested:** Zero Padding

---

#### 10. After applying a Hann window to a captured frame and computing its spectrum, the reported magnitude values appear artificially quieter than an unwindowed spectrum of the identical signal. What is the correct explanation and fix?

<div class="upper-alpha" markdown>
1. This indicates a bug in the FFT implementation that must be re-validated against the DFT
2. The window table was not precomputed correctly and must be regenerated for a different N
3. This is expected and requires switching to a rectangular window to fix it
4. Windowing tapers the signal toward zero at its edges, reducing overall amplitude; dividing by the window's coherent gain correction factor restores magnitude values properly comparable to an unwindowed spectrum
</div>

??? question "Show Answer"
    The correct answer is **D**. Window application, using coefficient values stored in a precomputed window table, necessarily reduces a frame's overall average amplitude because samples near the edges are multiplied by values less than 1. Coherent gain is the correction factor, specific to each of the windowing functions, that undoes this reduction so windowed magnitude and decibel readings stay properly comparable to an unwindowed spectrum.

    **Concept Tested:** Coherent Gain

