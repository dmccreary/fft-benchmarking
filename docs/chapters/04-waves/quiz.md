# Quiz: Waves: Amplitude, Frequency, Phase, and Harmonics

Test your understanding of amplitude, frequency, phase, and harmonics with these review questions.

---

#### 1. What is a sine wave?

<div class="upper-alpha" markdown>
1. A repeating curve that starts at its peak instead of at zero
2. A non-periodic function whose output never exactly repeats
3. A smooth, repeating curve described by y = sin(x), rising from zero to a peak, falling back through zero to a trough, and returning to zero at perfectly even intervals
4. A signal representing frequency content rather than time-domain value
</div>

??? question "Show Answer"
    The correct answer is **C**. A sine wave is the fundamental repeating shape described by y = sin(x): it rises from zero to a peak, falls back through zero to a trough, and returns to zero, over and over at perfectly even intervals. Option A describes a cosine wave instead, which is a periodic function too, just starting a quarter-cycle later. Option B describes the opposite of a periodic function.

    **Concept Tested:** Sine Wave

---

#### 2. What does a frequency of 440 Hz mean?

<div class="upper-alpha" markdown>
1. The wave completes 440 full cycles every second
2. The wave takes 440 seconds to complete one cycle
3. The wave's amplitude reaches 440 units at its peak
4. The wave is phase-shifted by 440 degrees
</div>

??? question "Show Answer"
    The correct answer is **A**. The Hertz (Hz) is the standard unit of frequency, defined as exactly one cycle per second, so 440 Hz means the wave completes 440 full cycles every second — concert-pitch A, the note orchestras tune to. Frequency describes repetition rate, not amplitude (peak size) or phase (timing offset within a cycle).

    **Concept Tested:** Hertz

---

#### 3. A captured audio signal appears to be centered around +50 instead of 0, even though its shape still swings up and down symmetrically around that offset. What does this offset represent, and why is it typically removed before frequency analysis?

<div class="upper-alpha" markdown>
1. It is the fundamental frequency, and removing it prevents aliasing
2. It is peak amplitude, and removing it makes the signal quieter
3. It is phase, and removing it resets the wave's starting point to zero
4. It is a DC component — a constant, non-oscillating offset added to the wave — and it carries no information about the sound itself, so later chapters remove it before analyzing frequency content
</div>

??? question "Show Answer"
    The correct answer is **D**. A DC component is a constant offset that shifts an entire wave up or down without changing its shape, frequency, or peak-to-peak swing — the name borrows from "direct current," a steady value as opposed to the wave's alternating swing. Because it carries no information about the sound's actual frequency content, it is removed before analysis rather than being mistaken for fundamental frequency, amplitude, or phase.

    **Concept Tested:** DC Component

---

#### 4. A tone has a period of 0.005 seconds. What is its frequency, and how are period and frequency related in general?

<div class="upper-alpha" markdown>
1. 5 Hz; period and frequency are always equal in value
2. 200 Hz; period and frequency are reciprocals of each other, so frequency = 1/period
3. 0.005 Hz; period is frequency divided by amplitude
4. 500 Hz; period and frequency both increase together
</div>

??? question "Show Answer"
    The correct answer is **B**. Period and frequency are reciprocals: T = 1/f. Given a period of 0.005 seconds, frequency = 1/0.005 = 200 Hz. Higher frequency always means a shorter period, and vice versa — they move in opposite directions, not together, and neither is calculated using amplitude.

    **Concept Tested:** Period Of A Wave

---

#### 5. Given the general sine wave equation y(t) = A sin(2πft + φ), what value of φ turns this equation into a cosine wave of the same amplitude and frequency?

<div class="upper-alpha" markdown>
1. φ = 0
2. φ = π (180°)
3. φ = 2π (360°)
4. φ = π/2 (90°)
</div>

??? question "Show Answer"
    The correct answer is **D**. A cosine wave is mathematically identical to a sine wave shifted by a phase of π/2 radians (90°): cos(x) = sin(x + π/2). φ = 0 leaves the equation as an ordinary sine wave; φ = π produces an inverted sine wave; φ = 2π is a full cycle, equivalent to no shift at all.

    **Concept Tested:** Phase

---

#### 6. In the sine wave parameter explorer, a student increases only the frequency slider while leaving amplitude and phase unchanged. What visible change should they expect in the plotted curve?

<div class="upper-alpha" markdown>
1. The curve compresses horizontally, fitting more complete cycles into the same time window, with no change in peak height
2. The curve stretches vertically, reaching a higher peak, with no change in cycle spacing
3. The entire curve slides left or right without changing shape
4. The curve's trough disappears, leaving only positive values
</div>

??? question "Show Answer"
    The correct answer is **A**. Frequency controls how fast a wave repeats, so increasing it compresses the curve horizontally, packing more cycles into the same time window, without affecting peak height. Vertical stretching (option B) is what changing amplitude does instead, and horizontal sliding without shape change (option C) is what changing phase does instead — each parameter affects one specific visual feature independently.

    **Concept Tested:** Frequency

---

#### 7. A flute and a violin both play a note with a 440 Hz fundamental frequency. Why do they sound noticeably different even though they share the same pitch?

<div class="upper-alpha" markdown>
1. The flute's fundamental frequency is actually higher than the violin's, despite both being labeled 440 Hz
2. Pitch and timbre are the same property, so they should sound identical
3. The violin has a longer period than the flute at the same frequency
4. The two instruments produce different mixtures and relative loudness of overtones above the shared fundamental frequency, and that overtone mixture — not the fundamental — is what timbre describes
</div>

??? question "Show Answer"
    The correct answer is **D**. Pitch is set by the fundamental frequency alone, but timbre is a whole "recipe" — which overtones are present above the fundamental and how loud each one is relative to it. A flute has few strong overtones, producing a pure tone, while a violin has many strong overtones, producing a rich, bright tone, even though both share the identical 440 Hz fundamental and therefore the same perceived pitch.

    **Concept Tested:** Timbre

---

#### 8. What does a time domain plot show?

<div class="upper-alpha" markdown>
1. The strength of each frequency component present in a signal
2. A graph with time on the horizontal axis and signal amplitude on the vertical axis, showing how a signal's value rises and falls moment to moment
3. Only the fundamental frequency of a periodic signal, with overtones removed
4. The phase relationship between two separate signals only, with no amplitude information
</div>

??? question "Show Answer"
    The correct answer is **B**. A time domain plot graphs a signal's amplitude against time, showing directly how the value rises and falls moment to moment — the natural, direct way any sensor or microphone actually records a signal. Option A describes a frequency-domain view instead, which this course introduces only in a later module, once the time domain representation is second nature.

    **Concept Tested:** Time Domain Plot

---

#### 9. A complex tone's spectrum shows strong energy at 220 Hz, 440 Hz, 660 Hz, and 880 Hz, with no energy at any other frequency. Based on the relationship between harmonics and fundamental frequency, what is this tone's fundamental frequency, and why?

<div class="upper-alpha" markdown>
1. 880 Hz, because the fundamental is always the highest-frequency component present
2. 660 Hz, because it is the middle value among the four frequencies listed
3. 220 Hz, because the fundamental frequency is the lowest-frequency harmonic present, and the remaining frequencies (440, 660, 880 Hz) are whole-number multiples of it — its overtones
4. There is not enough information to determine the fundamental frequency
</div>

??? question "Show Answer"
    The correct answer is **C**. The fundamental frequency is defined as the lowest-frequency harmonic in a complex tone, and it is the one a listener perceives as the pitch. Here, 220 Hz is the lowest component, and 440, 660, and 880 Hz are exactly 2×, 3×, and 4× that value — the whole-number-multiple pattern that defines overtones layered above a fundamental.

    **Concept Tested:** Fundamental Frequency

---

#### 10. Two recorded tones have identical peak amplitude, but one clearly sounds "fuller" or richer than the other despite both having exactly the same 440 Hz fundamental frequency and the same overall loudness. Which concept from this chapter best explains the perceived difference, and why does peak amplitude alone fail to capture it?

<div class="upper-alpha" markdown>
1. Timbre, because peak amplitude only measures the maximum size of a wave's swing and says nothing about which overtones are present or how loud each one is relative to the fundamental — the actual source of the perceptual difference
2. Period, because a longer period always sounds fuller regardless of overtone content
3. Hertz, because higher-Hertz signals always sound richer than lower-Hertz signals
4. DC component, because an unremoved DC offset makes a signal sound fuller
</div>

??? question "Show Answer"
    The correct answer is **A**. Peak amplitude only captures how large a wave's swing is — it says nothing about the wave's internal shape. Two tones can share identical peak amplitude and fundamental frequency, and therefore identical measured loudness and pitch, yet still differ in timbre because of their different overtone mixtures — the exact scenario this chapter uses to distinguish "how loud" from "what it's made of."

    **Concept Tested:** Peak Amplitude
