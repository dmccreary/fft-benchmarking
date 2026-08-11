# Quiz: Complex Numbers and Wave Superposition

Test your understanding of Euler's formula, the unit circle, wave superposition, and signal synthesis with these review questions.

---

#### 1. What is the imaginary unit, i?

<div class="upper-alpha" markdown>
1. A real number equal to negative one
2. The ratio of a circle's circumference to its diameter
3. The square root of −1, a number that does not exist among ordinary real numbers but is fully well-defined as its own mathematical object
4. The angle at which a sine wave crosses zero
</div>

??? question "Show Answer"
    The correct answer is **C**. The imaginary unit, written i, is defined as the square root of −1 — no real number multiplied by itself produces a negative result, yet i is fully well-defined as its own mathematical object. Combined with an ordinary real number, it is the building block of complex numbers, numbers of the form a + bi. Option A confuses i with an ordinary negative real number; option B describes π; option D describes a zero-crossing, unrelated to i.

    **Concept Tested:** Imaginary Unit

---

#### 2. What does Euler's formula state?

<div class="upper-alpha" markdown>
1. e^(iθ) = cos(θ) + i·sin(θ) — the complex exponential of an imaginary angle equals a complex number whose real part is cosine and whose imaginary part is sine of that angle
2. e^(iθ) always equals exactly 1, regardless of θ
3. Every complex number has a magnitude of exactly π
4. cos(θ) and sin(θ) are unrelated to any exponential function
</div>

??? question "Show Answer"
    The correct answer is **A**. Euler's formula, e^(iθ) = cos(θ) + i·sin(θ), ties the complex exponential directly to the unit circle: raising e to an imaginary power produces exactly the coordinates of the point at angle θ on a circle of radius 1. This single line lets an entire wave — amplitude, frequency, and timing — be written as one rotating complex number instead of a separate sine and cosine pair.

    **Concept Tested:** Euler's Formula

---

#### 3. How does angular frequency ω relate to ordinary frequency f?

<div class="upper-alpha" markdown>
1. They are identical; angular frequency is just another name for frequency in Hertz
2. ω = f / 2π, converting cycles per second into a smaller number
3. Angular frequency has no defined relationship to ordinary frequency
4. ω = 2πf; angular frequency expresses rotation rate in radians per second rather than cycles per second, and it is what actually appears inside sine and cosine functions once rotation becomes the mental model
</div>

??? question "Show Answer"
    The correct answer is **D**. Angular frequency, ω = 2πf, expresses how fast something rotates in radians per second rather than cycles per second. Radians are the natural unit for the rotational view of waves introduced in this chapter, which is why every equation involving rotation from this point forward in the course uses angular frequency rather than plain frequency in Hertz.

    **Concept Tested:** Angular Frequency

---

#### 4. What is the complex conjugate of a complex number a + bi, and how does it relate to magnitude?

<div class="upper-alpha" markdown>
1. It is −a − bi, the point reflected through the origin, and it always has zero magnitude
2. It is a − bi, the mirror image of a + bi reflected across the real axis; it shares the same real part but with the imaginary part's sign flipped
3. It is the same number written in polar form instead of rectangular form
4. It is a + bi with both parts doubled, used to compute magnitude directly
</div>

??? question "Show Answer"
    The correct answer is **B**. The complex conjugate of a + bi is a − bi: identical real part, imaginary part flipped in sign, geometrically the mirror image reflected across the real axis. A complex number and its conjugate always share the same magnitude, since magnitude depends on a² + b², which is unaffected by the sign of b. Phase offset — the starting angle of a rotating complex number — is a separate concept describing timing, not conjugation.

    **Concept Tested:** Complex Conjugate

---

#### 5. A complex number has a real part of 3 and an imaginary part of 4. What is its magnitude?

<div class="upper-alpha" markdown>
1. 7
2. 12
3. 1
4. 5
</div>

??? question "Show Answer"
    The correct answer is **D**. Magnitude is computed as |z| = √(a² + b²), a direct application of the Pythagorean theorem: √(3² + 4²) = √(9 + 16) = √25 = 5. Magnitude will reappear constantly starting in the DFT chapter, where it becomes the "how strong is this frequency" measurement read directly off a spectrum.

    **Concept Tested:** Magnitude

---

#### 6. Two sine waves of equal amplitude and frequency are combined with a phase offset of exactly π radians (180°) between them. What is the result, and which principle explains it?

<div class="upper-alpha" markdown>
1. Destructive interference: the waves nearly cancel out, since one wave's peak aligns exactly with the other's trough, and by the superposition principle the combined displacement at every point — the result of wave addition — is the sum of the two, here sums that are equal and opposite
2. Constructive interference: the combined wave reaches twice the original amplitude
3. A beat frequency is produced, audible as a slow pulsing in loudness
4. The two waves pass through each other with no interaction at all, since sound waves cannot interfere
</div>

??? question "Show Answer"
    The correct answer is **A**. A phase offset of π radians means one wave's peak lines up exactly with the other's trough. The superposition principle states that overlapping waves simply add their displacements at every point (wave addition); here, those displacements are equal and opposite, producing destructive interference and a resulting amplitude near zero, not the doubled amplitude of constructive interference.

    **Concept Tested:** Superposition Principle

---

#### 7. How does a Fourier series relate to the frequency domain representation of a signal?

<div class="upper-alpha" markdown>
1. A Fourier series has nothing to do with the frequency domain; it only describes time-domain plots
2. A Fourier series can only be computed for signals captured by a microphone, never for synthesized signals
3. A Fourier series represents a periodic signal as a sum of sine and cosine waves at specific frequencies, which is precisely a description of the signal in the frequency domain — the strength of each frequency component rather than its value over time
4. A Fourier series and the frequency domain are two unrelated nineteenth-century mathematical inventions
</div>

??? question "Show Answer"
    The correct answer is **C**. A Fourier series, named for Jean-Baptiste Fourier, decomposes a periodic signal into sine and cosine waves at integer-multiple frequencies — exactly a frequency domain description. The continuous Fourier transform later generalizes this idea beyond strictly periodic signals, but both describe a signal by the strength of its frequency components rather than its value at each moment in time.

    **Concept Tested:** Fourier Series

---

#### 8. Two guitar strings are tuned to 220 Hz and 223 Hz respectively and played together. What will a listener hear, and at what rate?

<div class="upper-alpha" markdown>
1. Two clearly separate, unrelated pitches with no interaction between them
2. A slow rise-and-fall pulsing in loudness — a beat frequency — occurring at a rate equal to the absolute difference between the two frequencies, here 3 Hz
3. Complete silence, since the two frequencies are too close to be distinguished
4. A single new tone at exactly 221.5 Hz, the average of the two frequencies
</div>

??? question "Show Answer"
    The correct answer is **B**. A beat frequency is the slow pulsing in loudness heard when two tones of slightly different frequency play together, occurring at a rate equal to the absolute difference between them: |223 − 220| = 3 Hz. This is the same "wah-wah-wah" wobble guitarists listen for when tuning two strings toward the same pitch.

    **Concept Tested:** Beat Frequency

---

#### 9. A program generates a single 440 Hz sine wave from its frequency, amplitude, and phase parameters, then separately combines that wave with several higher-frequency sine waves at different amplitudes to build a more complex, violin-like tone. Which two techniques does this describe, in order?

<div class="upper-alpha" markdown>
1. Sine synthesis (the single wave), followed by additive synthesis (the combined, multi-wave result) — sine synthesis produces one component, additive synthesis layers several components into a complex waveform
2. Additive synthesis followed by sine synthesis, in that exact order, since combination must always precede generation
3. Waveform plotting followed by amplitude enveloping, with no synthesis actually occurring
4. Both steps describe the same operation: additive synthesis and sine synthesis are interchangeable names for identical code
</div>

??? question "Show Answer"
    The correct answer is **A**. Sine synthesis generates a single sine wave from frequency, amplitude, and phase parameters; additive synthesis then combines multiple such waves into a complex waveform, exactly as the harmonic stack simulator does. Both are forms of signal synthesis — generating a signal from a formula rather than capturing it from a sensor — and typically use sample index to time conversion internally, with waveform plotting used afterward to sanity-check the result, and an amplitude envelope added if a natural attack and decay are desired.

    **Concept Tested:** Sine Synthesis

---

#### 10. This chapter previews orthogonality by noting that sine waves of different frequencies are, in a precise mathematical sense, "completely independent" of each other. Based on this preview, what capability does orthogonality make possible for later chapters?

<div class="upper-alpha" markdown>
1. It allows any two sine waves to be added together without producing constructive or destructive interference
2. It eliminates the need for the imaginary unit in later frequency-domain calculations
3. It guarantees that every signal captured by a microphone is automatically noise-free
4. It provides the mechanism for detecting whether a captured signal contains a specific frequency, since combining or comparing orthogonal sine waves produces zero net interaction — the seed idea the next chapter's correlation technique grows from
</div>

??? question "Show Answer"
    The correct answer is **D**. Orthogonality describes two functions that share zero net interaction when combined or compared, similar to how perpendicular directions in space share no overlap. Because sine waves of different frequencies are orthogonal to each other, comparing a signal against one specific frequency reveals only that frequency's content — precisely the mechanism the next chapter's correlation technique is built from.

    **Concept Tested:** Orthogonality
