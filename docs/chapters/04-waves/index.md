---
title: 'Waves: Amplitude, Frequency, Phase, and Harmonics'
description: Build the sine-wave vocabulary — amplitude, frequency, phase, and harmonics — that the rest of the course depends on.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 19:30:21
version: 0.09
---

# Waves: Amplitude, Frequency, Phase, and Harmonics

## Summary

This chapter builds the wave vocabulary — amplitude, frequency, phase, and the periodic sine and cosine functions — that everything downstream in the course depends on. It introduces harmonics, overtones, and timbre as the reason two instruments playing the same note sound different. These concepts are taught here, ahead of the audio-capture chapter, because the sampling and aliasing discussion that follows assumes them.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. Amplitude
2. Cosine Wave
3. DC Component
4. Frequency
5. Fundamental Frequency
6. Harmonics
7. Hertz
8. Overtones
9. Peak Amplitude
10. Period Of A Wave
11. Periodic Functions
12. Phase
13. Sine Wave
14. Timbre
15. Time Domain
16. Time Domain Plot

## Prerequisites

This chapter builds on concepts from:

- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)

---

!!! mascot-welcome "Time to talk about wiggles"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    No hardware in this chapter — just math, and it's the math that makes everything else in this course possible. Every sound, every vibration, every signal you'll ever capture on this board is built from the shapes we're about to define. Let's tune in.

Before this course captures a single real sound, it needs a precise vocabulary for describing *any* sound — or any signal that rises and falls over time. That vocabulary starts with the single simplest repeating shape in all of mathematics.

## The Simplest Wave

A **sine wave** is a smooth, repeating curve described by the sine function, \( y = \sin(x) \), that rises from zero to a peak, falls back through zero to a trough, and returns to zero — over and over, forever, at perfectly even intervals. It is not just one shape among many worth knowing; it is the fundamental building block this entire course is built on, because — as later chapters prove directly — *any* repeating signal, no matter how complicated, can be built by adding together sine waves of different sizes and speeds.

A close relative uses the same curve, just starting from a different point: a **cosine wave** is the same smooth, repeating shape as a sine wave, described by \( y = \cos(x) \), except it starts at its peak instead of at zero — cosine is what sine looks like if you start watching a quarter-cycle later. Sine and cosine waves belong to a broader category worth naming precisely: **periodic functions** are functions whose output repeats in an identical, unchanging pattern at regular intervals forever — sine and cosine are the two periodic functions this course uses constantly, but the term itself applies to any repeating pattern, mathematical or physical.

## Describing a Wave

A bare sine or cosine shape does not, by itself, describe a *specific* real-world wave — a quiet, slow hum and a loud, piercing whistle are both "sine waves" in shape, yet clearly different. Telling them apart requires three numbers.

The first is how fast the wave repeats. **Frequency** is the number of complete wave cycles that occur in one second — a slow, low hum has a low frequency; a piercing whistle has a high frequency. Frequency is measured in a unit with its own name: the **Hertz**, abbreviated Hz, is the standard unit of frequency, defined as exactly one cycle per second — a 440 Hz tone (concert-pitch A, the note orchestras tune to) completes 440 full wave cycles every second.

Frequency and the time one single cycle takes are two sides of the same coin. The **period of a wave** is the amount of time one complete cycle takes to occur, measured in seconds, and it is mathematically the reciprocal of frequency:

#### Period and Frequency

\[ T = \frac{1}{f} \]

where:

- \( T \) is the period, in seconds
- \( f \) is the frequency, in Hertz

A 440 Hz tone, for example, has a period of \( \frac{1}{440} \approx 0.00227 \) seconds — just over two milliseconds per cycle. Higher frequency always means shorter period, and vice versa.

The second describing number is how big the wave's swing is. **Amplitude** is the size of a wave's swing away from its resting (zero) value — a louder sound or a bigger vibration has greater amplitude, while a quieter or gentler one has smaller amplitude, independent of how fast it repeats. The single largest value amplitude ever reaches during a cycle has its own name: **peak amplitude**, the maximum value a wave's amplitude reaches at the very top of its swing, used throughout this course to describe how "loud" or "large" a captured signal is without needing to describe its entire shape.

Real-world signals are not always perfectly centered on zero the way a textbook sine wave is — a microphone or sensor can add a constant offset to every sample. That offset is the **DC component**: a constant, non-oscillating offset added to a wave's amplitude, shifting the entire wave up or down without changing its shape, frequency, or peak-to-peak swing. ("DC" borrows its name from *direct current* in electronics — a steady value, as opposed to the *alternating* back-and-forth swing of the wave itself.) Later chapters remove the DC component from captured audio before analyzing it, precisely because it carries no information about the sound itself.

Putting frequency and amplitude together produces the general equation for a sine wave used throughout the rest of this course:

#### General Sine Wave

\[ y(t) = A \sin(2\pi f t) \]

where:

- \( y(t) \) is the wave's value at time \( t \)
- \( A \) is the amplitude
- \( f \) is the frequency, in Hertz
- \( t \) is time, in seconds

Before defining the third and final describing number, it helps to name why one is still missing: two sine waves can share the exact same frequency and amplitude and still not overlap — one could be at its peak exactly when the other is crossing zero. That timing offset is **phase**: the position of a wave within its own cycle at a specific moment, relative to a reference starting point, typically expressed in degrees (0°–360°) or radians (0–2π). Adding a phase term to the general sine wave equation makes the timing offset explicit:

#### Sine Wave With Phase

\[ y(t) = A \sin(2\pi f t + \phi) \]

where:

- \( \phi \) (phi) is the phase, in radians

Phase is exactly what distinguishes sine from cosine mathematically: a cosine wave is precisely a sine wave with a phase of \( \frac{\pi}{2} \) radians (90°) — \( \cos(x) = \sin\left(x + \frac{\pi}{2}\right) \). Two waves with identical frequency and amplitude but different phase will not add together the same way two perfectly aligned waves do — a fact that becomes critically important when this course reaches correlation and the Discrete Fourier Transform in Module 3.

Before the interactive explorer below, it's worth naming exactly what each of its three sliders controls, since they map directly onto the equation just introduced: amplitude scales the wave's height, frequency scales how fast it repeats, and phase slides the whole wave left or right in time without changing its shape.

#### Diagram: Sine Wave Parameter Explorer

<iframe src="../../sims/sine-wave-parameter-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Sine Wave Parameter Explorer</summary>
Type: microsim
**sim-id:** sine-wave-parameter-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Demonstrate, calculate

Learning objective: Let students manipulate amplitude, frequency, and phase independently and observe exactly which visual feature of the plotted wave each parameter controls, connecting the equation y(t) = A sin(2*pi*f*t + phi) to its graph.

Canvas layout:
- Top (350px): a continuous waveform plot, x-axis labeled "Time (seconds)", y-axis labeled "Amplitude", showing 2-3 full cycles of the current wave at default settings
- Bottom (150px): controls

Visual elements:
- A single smooth sine curve redrawn live as sliders move
- A dashed horizontal reference line at y=0
- A vertical marker line showing t=0, with a small dot on the curve showing the wave's exact value there (visually demonstrating phase's effect at the origin)
- A live equation readout: "y(t) = [A] sin(2π × [f] × t + [phi])" with current slider values substituted

Interactive controls:
- Slider: Amplitude (A), range 0.2 to 2.0, default 1.0
- Slider: Frequency (f), range 0.5 to 5 Hz, default 1 Hz (kept low for visual clarity of individual cycles)
- Slider: Phase (phi), range 0 to 2π (displayed in degrees, 0-360°), default 0°
- Toggle: "Overlay cosine wave" — draws a second curve (same A and f, phase fixed at 90°) in a contrasting color, to let students directly see that cosine is sine shifted by a quarter cycle

Default parameters:
- Amplitude: 1.0
- Frequency: 1 Hz
- Phase: 0°
- Cosine overlay: off

Behavior:
- Moving the Amplitude slider visibly stretches or compresses the curve vertically only, with no change to spacing between peaks
- Moving the Frequency slider visibly compresses or stretches the curve horizontally, changing how many cycles fit in the visible window, with no change to peak height
- Moving the Phase slider slides the entire curve left or right without changing its height or cycle spacing
- Enabling "Overlay cosine wave" draws a second curve offset exactly 90° from the first, letting students see the sine/cosine relationship directly regardless of the current phase slider value

Instructional Rationale: An Apply-level parameter-exploration pattern is appropriate because the objective is to let students isolate the independent visual effect of each of the three parameters (amplitude, frequency, phase) by manipulating one at a time and observing the specific, predictable change in the graph.

Implementation notes:
- Use p5.js; recompute the plotted points every frame from the live slider values rather than pre-rendering
- Responsive width; waveform plot and controls both scale to container width on window resize
</details>

## Seeing a Wave

Plotting a wave's value against time, the way the explorer above just did, is common enough to have a formal name. The **time domain** is a way of representing a signal as its value changes over time — the natural, direct way any sensor or microphone actually records a signal, one sample after another. A **time domain plot** is a graph with time on the horizontal axis and signal amplitude on the vertical axis, visualizing exactly how a signal's value rises and falls moment to moment — the specific kind of chart the parameter explorer above draws.

Nearly everything this course captures directly from the microphone in Module 2 arrives first as a time domain signal. Module 3 later introduces a *different* way of looking at the same signal — the frequency domain — but that transformation only makes sense once the time domain representation is second nature.

## Why Two Instruments Sound Different

A single, pure sine wave is a mathematical idealization — real instruments and voices essentially never produce one. Instead, they produce several sine waves simultaneously, layered on top of each other, and it is that layering that gives every instrument its distinctive character.

**Harmonics** are the family of sine-wave components — periodic functions of specific, related frequencies — that combine to form most real-world periodic sounds; rather than one pure tone, a plucked guitar string or a sung note is actually a *sum* of many sine waves at once. The lowest, quietest-sounding member of that family sets the pitch you actually perceive: the **fundamental frequency** is the lowest-frequency harmonic in a complex tone, and the one that determines the pitch a listener identifies — a note perceived as "A4" has a fundamental frequency of 440 Hz, even though the actual sound contains many additional frequencies layered on top.

Those additional frequencies layered above the fundamental are the **overtones**: the higher-frequency harmonics present above the fundamental frequency in a complex tone, typically at whole-number multiples of the fundamental (twice, three times, four times its frequency, and so on) — it is the specific mixture and relative loudness of these overtones, not the fundamental frequency alone, that makes a violin playing A4 sound completely different from a flute playing the exact same A4 pitch.

That perceptual difference — same pitch, different-sounding instrument — has a name of its own: **timbre** (pronounced "TAM-ber"), the quality that distinguishes two sounds with the identical fundamental frequency (and therefore the same perceived pitch) as sounding different, determined by which overtones are present and how loud each one is relative to the fundamental. A violin and a flute playing the same 440 Hz note share an identical fundamental frequency; their different overtone mixtures are the entire reason your ear can tell them apart instantly.

Before comparing a few instruments' overtone patterns in a table, it is worth being concrete about what "mixture of overtones" actually means in numbers: for a note with a 440 Hz fundamental, the overtones sit near 880 Hz (2×), 1,320 Hz (3×), 1,760 Hz (4×), and so on — and different instruments make some of these louder and others nearly silent.

| Instrument | Fundamental (A4) | Overtone character | Result |
|---|---|---|---|
| Flute | 440 Hz | Very few strong overtones | Pure, breathy timbre |
| Violin | 440 Hz | Many strong overtones, especially odd multiples | Rich, bright timbre |
| Clarinet | 440 Hz | Strong odd-numbered overtones, weak even ones | Hollow, reedy timbre |

!!! mascot-thinking "Timbre is a mixing recipe, not a single number"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Here's the idea worth holding onto: pitch is a single number (the fundamental frequency), but timbre is a whole recipe — which overtones are present, and how loud each one is relative to the others. Later in this course, the FFT you build is precisely the tool that takes a captured sound and reads that recipe back out, overtone by overtone.

Building a wave out of a fundamental plus overtones is easiest to understand by doing it yourself, one harmonic at a time, and watching the combined shape change while the fundamental frequency — and therefore the pitch — stays fixed.

#### Diagram: Harmonic Stack Synthesizer

<iframe src="../../sims/harmonic-stack-synthesizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Harmonic Stack Synthesizer</summary>
Type: microsim
**sim-id:** harmonic-stack-synthesizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, differentiate

Learning objective: Let students adjust the relative amplitude of several overtones above a fixed fundamental frequency and analyze how the combined waveform's shape (timbre) changes while its repetition rate (pitch) does not, differentiating the roles of fundamental frequency and overtone mixture.

Canvas layout:
- Top (300px): combined waveform plot showing the sum of the fundamental and all active overtones, x-axis "Time", y-axis "Amplitude"
- Middle (150px): small stacked bar-style sliders, one per harmonic (1st through 5th), showing each harmonic's individual contribution
- Bottom (100px): preset buttons and readout

Visual elements:
- Main plot: the combined (summed) waveform, redrawn live
- Optional faint overlay of each individual harmonic sine wave in a light, distinguishing color, toggleable
- Five small vertical sliders labeled "1st (fundamental)", "2nd", "3rd", "4th", "5th", each showing relative amplitude 0-100%
- Readout: "Fundamental frequency: 440 Hz (fixed — this is the pitch)" to reinforce that pitch does not change regardless of slider settings

Interactive controls:
- Five vertical sliders, one per harmonic, range 0-100%, default: 1st=100%, 2nd=0%, 3rd=0%, 4th=0%, 5th=0% (pure sine wave / flute-like on load)
- Preset buttons: "Flute-like" (mostly fundamental), "Violin-like" (fundamental + strong 2nd/3rd), "Clarinet-like" (fundamental + strong odd harmonics, weak even), "Reset to pure tone"
- Checkbox: "Show individual harmonics overlay"

Default parameters:
- 1st harmonic (fundamental): 100%
- All other harmonics: 0%
- Overlay: off

Behavior:
- The combined waveform plot recomputes as the sum of all active harmonic sine waves (each at its slider-set relative amplitude and at its harmonic multiple of 440 Hz) every time any slider moves
- Clicking a preset button animates all five sliders to that preset's values and updates the combined plot
- The combined waveform's overall repetition rate (period) never changes as sliders move — only its shape within each cycle changes — visually demonstrating that pitch is independent of timbre

Instructional Rationale: An Analyze-level pattern (parameter exploration plus explicit comparison via presets) is appropriate because the objective requires students to examine the relationship between overtone mixture and waveform shape, and differentiate that from the separate, fixed concept of fundamental frequency/pitch — direct manipulation with instrument-based presets makes the abstract "timbre" concept concrete.

Implementation notes:
- Use p5.js; sum harmonic sine waves as A_n * sin(2*pi*n*440*t) for n = 1 to 5, scaled by each slider's percentage
- Responsive width; plot, harmonic sliders, and preset buttons all scale to container width on window resize
</details>

!!! mascot-tip "You already know this by ear"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    Try the "Violin-like" and "Clarinet-like" presets back to back in the synthesizer above and just look at how differently shaped the combined wave is — even though both are still built on the same 440 Hz fundamental. Your ears have been distinguishing exactly this kind of overtone recipe your entire life without knowing the math behind it.

That intuition is not a coincidence — it is the entire reason this chapter comes before the sampling, correlation, and DFT chapters that follow. Every technique this course later uses to detect a frequency, from correlation in Module 3 through the DFT and FFT themselves, is built directly on the amplitude, frequency, and phase vocabulary just introduced here. The math ahead does not replace your ear's judgment; it formalizes something your ear already does effortlessly, so a computer can do it too.

!!! mascot-encourage "The equations will click once you can see them move"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Four new Greek-letter-adjacent terms in one chapter — amplitude, frequency, phase, and now harmonics on top — is genuinely a lot of vocabulary at once. If it feels abstract right now, that's expected; Lab 11, right after this chapter, has you build these exact waves yourself and watch them plotted live. Seeing them move is where this vocabulary actually sticks.

## Chapter Summary

You now have the complete vocabulary for describing any repeating signal — the foundation every later chapter on sound, sampling, and frequency analysis builds on directly.

Key ideas to carry forward:

- A **sine wave** (and its phase-shifted twin, the **cosine wave**) is the fundamental repeating shape this entire course is built from; both are **periodic functions**.
- **Frequency** (measured in **Hertz**) and **period** are reciprocals of each other — faster repetition means a shorter period.
- **Amplitude** describes a wave's size; **peak amplitude** is its maximum swing; a **DC component** is an unwanted constant offset riding along with the wave.
- **Phase** describes *where* in its cycle a wave currently sits — it is what makes cosine different from sine, and it matters enormously once waves start being compared to each other.
- A **time domain plot** shows a signal's value against time — the natural, direct way any sensor captures a signal.
- **Harmonics** — a **fundamental frequency** plus its **overtones** — combine to produce **timbre**, the reason two instruments playing an identical pitch still sound completely different.

??? note "Quick check: two sine waves have the same 440 Hz frequency and the same amplitude, but one is a sine wave and the other is a cosine wave. What single parameter explains the difference? — Click to expand"
    Phase. A cosine wave is mathematically identical to a sine wave shifted by a phase of π/2 radians (90°) — same frequency, same amplitude, different position within the cycle.

!!! mascot-celebration "You can now describe any wave precisely"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Amplitude, frequency, phase, harmonics, timbre — that's the complete vocabulary this course uses to talk about sound from here forward, and you built it without touching a single wire. Next stop: capturing a real sound with the I²S microphone and watching these exact shapes appear in your own recorded audio. Time to transform!
