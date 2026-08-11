# Quiz: Correlation: Does My Signal Contain This Note?

Test your understanding of multiply-and-sum correlation, orthogonality, and in-phase/quadrature detection with these review questions.

---

#### 1. What is correlation, as used in this chapter?

<div class="upper-alpha" markdown>
1. A filter that removes frequencies above a chosen cutoff
2. A mathematical operation that measures how similar two signals are, producing a single number that is large when the signals match closely and small when they do not
3. The process of converting a digital signal back into an analog voltage
4. A measurement of a signal's loudness in decibels
</div>

??? question "Show Answer"
    The correct answer is **B**. Correlation measures how similar two signals are, producing one number that grows large when the signals match closely and shrinks toward zero when they do not. It is a specific example of a broader similarity measure — any quantitative method for comparing two signals and producing a number reflecting how alike they are — built specifically for comparing waveforms.

    **Concept Tested:** Correlation

---

#### 2. What arithmetic does "multiply and sum" perform when correlating a captured signal against a test frequency?

<div class="upper-alpha" markdown>
1. It divides each sample of the captured signal by the corresponding sample of the test frequency
2. It finds the maximum value in each signal and compares the two maxima
3. It counts how many times the two signals cross zero at the same instant
4. It multiplies each pair of corresponding samples from the two signals together, then adds every product into a single total — the dot product applied specifically to comparing a captured signal against a test frequency
</div>

??? question "Show Answer"
    The correct answer is **D**. Multiply and sum pairs up corresponding samples of the captured signal and the test frequency, multiplies each pair, and sums every product into one correlation value — the dot product, borrowed directly from mathematics, applied to comparing waveforms. When the two signals rise and fall together, most products are positive and the total grows large; when they do not match, positive and negative products cancel.

    **Concept Tested:** Multiply And Sum

---

#### 3. Why does correlating a captured signal against a 440 Hz test frequency pick up almost none of a 900 Hz component that might also be present in the signal?

<div class="upper-alpha" markdown>
1. Because 900 Hz is always above the Nyquist frequency and therefore never sampled at all
2. Because the correlation calculation automatically applies a band-pass filter centered on the test frequency before multiplying
3. Because sine waves at different frequencies are orthogonal functions — their correlation, summed over a full period, equals exactly zero — so contributions from non-matching frequencies cancel out almost completely
4. Because 900 Hz components are always quieter than 440 Hz components in real audio
</div>

??? question "Show Answer"
    The correct answer is **C**. Sine waves at different frequencies are orthogonal functions: their dot product, summed over a full period, equals exactly zero. This single fact is why multiply-and-sum correlation works as a frequency detector at all — correlating against a 440 Hz test frequency picks up 440 Hz content while non-matching frequencies like 900 Hz cancel out almost completely, with no filtering step required.

    **Concept Tested:** Orthogonal Functions

---

#### 4. A correlation calculation produces an in-phase component of 6 and a quadrature component of 8. What is the correlation magnitude?

<div class="upper-alpha" markdown>
1. 10
2. 14
3. 48
4. 2
</div>

??? question "Show Answer"
    The correct answer is **A**. Correlation magnitude combines the in-phase and quadrature components as M = √(I² + Q²): √(6² + 8²) = √(36 + 64) = √100 = 10. This is the same Pythagorean combination used for complex-number magnitude, since I and Q are, in effect, the real and imaginary parts of a complex correlation result.

    **Concept Tested:** Correlation Magnitude

---

#### 5. A single test wave (just cosine) correlated against a signal at the same frequency but 90 degrees out of phase produces a correlation value near zero, even though the signal clearly contains that frequency. How does using in-phase and quadrature components together solve this problem?

<div class="upper-alpha" markdown>
1. It doesn't solve the problem; a single test wave is always sufficient regardless of phase
2. It solves the problem by ignoring phase entirely and only measuring amplitude
3. Combining the two components as √(I² + Q²) into a correlation magnitude produces a phase-independent strength measurement, since whenever one component is near zero due to phase mismatch, the other component picks up the signal instead
4. It solves the problem by doubling the sampling rate to compensate for phase mismatch
</div>

??? question "Show Answer"
    The correct answer is **C**. A single cosine test wave is phase-sensitive: it can read near zero even when the signal genuinely contains that frequency, simply because of a bad phase alignment. Using a sine-shaped quadrature component alongside the cosine-shaped in-phase component and combining both into correlation magnitude guarantees at least one component picks up the signal strongly, regardless of its actual phase — this is phase independence.

    **Concept Tested:** Phase Independence

---

#### 6. What does the root mean square (RMS) of a signal measure, and why is it preferred over a simple average?

<div class="upper-alpha" markdown>
1. It measures only the signal's highest single peak value, ignoring all other samples
2. It measures a signal's overall magnitude by squaring every sample, averaging those squares, and taking the square root — squaring makes every contribution positive first, so positive and negative swings do not cancel out the way a plain average would
3. It measures the signal's frequency in Hertz, not its amplitude
4. It is identical to peak amplitude, just computed with extra steps
</div>

??? question "Show Answer"
    The correct answer is **B**. RMS squares every sample before averaging, which makes every contribution positive, so a signal's positive and negative swings do not cancel each other out the way they would in a plain average. RMS underlies sound level measurements in decibels, though loudness perception — how loud a sound actually seems to a human listener — depends on frequency as well, since hearing is more sensitive to some frequencies than others.

    **Concept Tested:** Root Mean Square

---

#### 7. How does an anti-aliasing filter's role differ from a general-purpose low pass filter used for noise reduction?

<div class="upper-alpha" markdown>
1. An anti-aliasing filter boosts high frequencies instead of attenuating them
2. There is no difference; both terms describe the exact same filter used for the exact same purpose in every context
3. An anti-aliasing filter only works on digital signals, while a low pass filter only works on analog signals
4. Both are low pass filters that attenuate frequencies above a cutoff, but an anti-aliasing filter is applied specifically before sampling to remove content above the Nyquist frequency and prevent aliasing, while a general low pass filter is used more broadly for noise reduction
</div>

??? question "Show Answer"
    The correct answer is **D**. An anti-aliasing filter is a specific, critical application of a low pass filter: applied before sampling, it removes frequency content above the Nyquist frequency to prevent aliasing. A general low pass filter serves broader noise-reduction purposes. The width of any filter's passing range — how many Hertz it lets through — is called its bandwidth.

    **Concept Tested:** Anti Aliasing Filter

---

#### 8. A student needs to smooth a jittery correlation-magnitude reading but wants to avoid storing a window of past values in limited microcontroller RAM. Which smoothing technique fits this constraint, and why?

<div class="upper-alpha" markdown>
1. Exponential smoothing, because it blends each new raw value with only the previous smoothed value, weighted by a smoothing factor, so it never needs to store a history of past samples
2. Moving average, because averaging automatically frees memory as soon as a value is used
3. Root mean square, because it is a smoothing technique that requires no memory at all
4. Neither technique is memory-efficient; both require storing the full signal history
</div>

??? question "Show Answer"
    The correct answer is **A**. Exponential smoothing blends each new raw value with only the single previous smoothed value, weighted by a chosen factor, so recent readings influence the result more than older ones without ever storing a history of past samples. A moving average, by contrast, must keep a window of recent readings (such as the last eight) in memory to average them together — a real cost on a resource-constrained microcontroller.

    **Concept Tested:** Exponential Smoothing

---

#### 9. What role does the test frequency waveform play when described as a "basis function"?

<div class="upper-alpha" markdown>
1. It is simply background noise the correlation calculation must filter out first
2. It replaces the need for the dot product in the correlation calculation
3. It serves as a reference function against which a signal is compared; correlation measures how much of the signal aligns with that basis function, a projection onto basis analogous to measuring a shadow's length along a specific direction
4. It only matters for signals that contain a beat frequency
</div>

??? question "Show Answer"
    The correct answer is **C**. A basis function is a reference function chosen so combinations of basis functions at different frequencies can represent a wide range of signals — the test frequency sine wave plays exactly this role. Measuring how much a signal aligns with that basis function is called projection onto basis, computed through correlation, analogous to measuring a shadow's length along one specific direction.

    **Concept Tested:** Basis Function

---

#### 10. A tuner's bar graph display works well for loud input but is either too twitchy for quiet sounds or pinned at maximum for very loud ones, depending on how loud the room happens to be. Which technique addresses this, and how?

<div class="upper-alpha" markdown>
1. Increasing the sampling rate, since a higher sampling rate always fixes display scaling issues
2. Sensor auto calibration, which automatically rescales the bar graph's range based on recently observed signal characteristics — such as the loudest correlation magnitude seen over the past few seconds — so the display stays readable regardless of current input loudness
3. Switching from correlation magnitude to sound level, which is immune to any scaling problems
4. Adding more decimal places to the displayed number, which resolves the twitchiness directly
</div>

??? question "Show Answer"
    The correct answer is **B**. Sensor auto calibration automatically adjusts a display's baseline or scaling based on recently observed signal characteristics, such as rescaling a bar graph's range to the loudest correlation magnitude seen over the past few seconds. This keeps the display readable and responsive whether the current input is quiet or loud, without requiring a change to sampling rate or the underlying measurement itself.

    **Concept Tested:** Sensor Auto Calibration
