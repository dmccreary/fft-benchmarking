# Quiz: Sampling, Quantization, and Aliasing

Test your understanding of sample rate, the Nyquist theorem, aliasing, quantization, and bit depth with these review questions.

---

#### 1. What is the sampling rate?

<div class="upper-alpha" markdown>
1. The total number of bits used to represent one sample's amplitude
2. The number of samples taken per second, measured in Hertz
3. The reciprocal of the Nyquist frequency
4. The maximum amplitude a system can represent before clipping
</div>

??? question "Show Answer"
    The correct answer is **B**. The sampling rate is the number of samples taken per second, measured in Hertz — the frequency of measuring. Its reciprocal is the sample period, the fixed time gap between one sample and the next. Choosing an appropriate sampling rate for a given application is called sample rate selection, which balances the sample rate selection tradeoff between capturing a wider frequency range and the resulting increase in data volume and processing load.

    **Concept Tested:** Sampling Rate

---

#### 2. What does the Nyquist frequency represent for a given sampling rate?

<div class="upper-alpha" markdown>
1. The lowest frequency a sampling rate can capture
2. The exact frequency at which aliasing is guaranteed to be inaudible
3. The number of bits needed to avoid quantization error
4. Exactly half of the sampling rate — the highest frequency that sampling rate can capture correctly
</div>

??? question "Show Answer"
    The correct answer is **D**. The Nyquist frequency is exactly half the sampling rate, and it represents the highest frequency that sampling rate can capture correctly. This boundary comes directly from the Nyquist theorem (formally the Nyquist–Shannon sampling theorem), which requires sampling at more than twice the highest frequency of interest for accurate reconstruction. It is a hard ceiling, not a suggestion.

    **Concept Tested:** Nyquist Frequency

---

#### 3. A system undersamples a signal, capturing it below the rate the Nyquist theorem requires. What is the direct consequence, and what is the underlying mechanism called?

<div class="upper-alpha" markdown>
1. Aliasing occurs: the true frequency, sampled too slowly, becomes indistinguishable from a different, lower aliasing artifact frequency through a mechanism called frequency folding
2. The signal is simply recorded at reduced volume, with no change to its measured frequency
3. The ADC automatically raises its sampling rate to compensate, preventing any error
4. The signal's bit depth is reduced to compensate for the lower sampling rate
</div>

??? question "Show Answer"
    The correct answer is **A**. Undersampling — sampling below the rate the Nyquist theorem requires — produces aliasing: the true frequency becomes indistinguishable from a different, lower frequency. That false reading is called an aliasing artifact, and the mechanism that produces it, frequency folding, reflects the too-high frequency back down into the representable range at a new, incorrect frequency.

    **Concept Tested:** Aliasing

---

#### 4. A system samples audio at 16,000 Hz. What is the Nyquist frequency, and can a 9,000 Hz tone be captured correctly at this rate according to the sampling theorem?

<div class="upper-alpha" markdown>
1. 32,000 Hz; yes, easily, since 9,000 Hz is far below it
2. 16,000 Hz; yes, since the Nyquist frequency always equals the sampling rate
3. 8,000 Hz; no, because 9,000 Hz exceeds the Nyquist frequency and will alias
4. 4,000 Hz; no, because 9,000 Hz is more than four times the Nyquist frequency
</div>

??? question "Show Answer"
    The correct answer is **C**. The Nyquist frequency is half the sampling rate: 16,000 / 2 = 8,000 Hz. The sampling theorem requires sampling above twice the highest frequency of interest, so any signal above the Nyquist frequency — including a 9,000 Hz tone here — cannot be represented accurately and will alias, no matter how good the rest of the system is.

    **Concept Tested:** Sampling Theorem

---

#### 5. A tone generator produces a precisely known 11,000 Hz test tone, which is then sampled at a 16,000 Hz rate. Using the frequency-folding relationship, what apparent (aliased) frequency will this produce?

<div class="upper-alpha" markdown>
1. 5,000 Hz
2. 11,000 Hz
3. 16,000 Hz
4. 27,000 Hz
</div>

??? question "Show Answer"
    The correct answer is **A**. Frequency folding reflects a frequency above the Nyquist frequency back down into the representable range: |sampling rate − true frequency| = |16,000 − 11,000| = 5,000 Hz. The system reports this folded value with total confidence, even though 5,000 Hz was never actually present in the original signal — a direct, calculable consequence of undersampling, not a random error.

    **Concept Tested:** Frequency Folding

---

#### 6. How do sampling and quantization differ as two separate steps in digitizing a signal?

<div class="upper-alpha" markdown>
1. Sampling and quantization are two names for the exact same operation
2. Quantization decides when to measure a signal; sampling decides how precisely to record each measured value
3. Sampling only applies to audio signals, while quantization only applies to video signals
4. Sampling measures a continuous signal's value at regular moments in time; quantization then rounds each measured amplitude to the nearest of a finite set of representable digital values
</div>

??? question "Show Answer"
    The correct answer is **D**. Sampling answers the question of *when* to measure, producing individual amplitude values at regular time intervals. Quantization answers a separate question of *how precisely* to record each of those values, rounding to the nearest representable number and introducing a small quantization error. Together, sampling and quantization performed in one physical step make up ADC conversion.

    **Concept Tested:** Quantization

---

#### 7. For a signed 16-bit sample format, what is the full scale value?

<div class="upper-alpha" markdown>
1. 65,536
2. 32,767
3. 16
4. 8,388,607
</div>

??? question "Show Answer"
    The correct answer is **B**. A signed 16-bit format has a full scale value of 32,767 — the maximum representable amplitude magnitude in the positive direction. 65,536 is the total number of distinct levels a 16-bit format can represent (2^16), not the full scale value itself, and 8,388,607 is the full scale value for a 24-bit format instead.

    **Concept Tested:** Bit Depth

---

#### 8. Why does leaving headroom below the full scale value help prevent clipping distortion?

<div class="upper-alpha" markdown>
1. Headroom increases a system's bit depth automatically, adding more representable levels
2. Headroom removes quantization error entirely from every sample
3. Headroom leaves a margin between a signal's typical peak amplitude and the full scale value, so an unexpectedly loud moment has room to be represented accurately instead of being forced to the maximum representable value
4. Headroom lowers the noise floor, which has no relationship to clipping
</div>

??? question "Show Answer"
    The correct answer is **C**. Headroom is the deliberate safety margin between a signal's typical peak and the full scale value. Without it, a signal has nowhere to go if it briefly gets louder than expected, and clipping — every sample above full scale being forced to the maximum representable value — produces clipping distortion, an unrecoverable, permanent form of damage to the recording.

    **Concept Tested:** Headroom

---

#### 9. The INMP441 outputs a genuine 24-bit sample left-justified inside a 32-bit word (a format called twenty-four-bit-in-thirty-two). A student unpacks the raw bytes as a signed 32-bit integer but forgets to apply an arithmetic right shift before using the value. What is the most likely consequence?

<div class="upper-alpha" markdown>
1. No consequence — the value is already numerically correct without any shift
2. Integer overflow occurs immediately, crashing the MicroPython interpreter
3. The signal's dynamic range doubles unexpectedly
4. The resulting value is wildly incorrect, because the real 24 bits of signal sit in the upper portion of the 32-bit word rather than being right-aligned, and only an arithmetic right shift by 8 bits moves them back into correct numeric range
</div>

??? question "Show Answer"
    The correct answer is **D**. Unpacking binary data recovers a raw 32-bit integer from the byte buffer, but because the genuine 24-bit sample is left-justified (padded on the right), that raw value is not yet numerically correct. An arithmetic right shift by 8 bits — preserving the sign bit — divides the value back down into its true, correctly-scaled range. Skipping this step leaves every sample scaled up by a factor of 256.

    **Concept Tested:** Sample Word Format

---

#### 10. A system's noise floor rises closer to its typical signal level. What happens to its signal-to-noise ratio and its practical dynamic range as a result?

<div class="upper-alpha" markdown>
1. Both signal-to-noise ratio and dynamic range increase, since more noise gives the system more information to work with
2. Signal-to-noise ratio decreases, and the practical dynamic range — the usable gap between the quietest reliably distinguishable signal and the loudest non-clipped signal — shrinks
3. Signal-to-noise ratio is unaffected, since it only depends on bit depth, not noise floor
4. Dynamic range increases while signal-to-noise ratio stays exactly the same
</div>

??? question "Show Answer"
    The correct answer is **B**. Signal-to-noise ratio compares the power of a genuine signal to the power of accompanying signal noise; a higher noise floor means less separation between real signal and noise, lowering that ratio. Because dynamic range spans from the noise floor up to the loudest non-clipped signal, a rising noise floor directly shrinks the usable range in between.

    **Concept Tested:** Signal To Noise Ratio
