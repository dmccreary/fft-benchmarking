---
title: Complex Numbers and Wave Superposition
description: Build the complex-number and superposition toolkit — Euler's formula, the unit circle, wave addition, and the Fourier series — that correlation and the DFT are built from.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 20:20:00
version: 0.09
---

# Complex Numbers and Wave Superposition

## Summary

This chapter introduces complex numbers, Euler's formula, and the unit circle as the mathematical language the Fourier transform is built from, then shows how multiple sine waves add together through superposition, producing constructive and destructive interference and beat frequencies. It connects this synthesis back to the harmonics from the waves chapter, letting students build arbitrary waveforms from simple sinusoids. This chapter is the direct mathematical foundation for correlation and the DFT that follow.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Additive Synthesis
2. Amplitude Envelope
3. Angular Frequency
4. Beat Frequency
5. Complex Conjugate
6. Complex Numbers
7. Constructive Interference
8. Continuous Fourier Transform
9. Destructive Interference
10. Euler's Formula
11. Fourier Series
12. Frequency Domain
13. Imaginary Unit
14. Jean Baptiste Fourier
15. Magnitude
16. Orthogonality
17. Phase Offset
18. Radians
19. Sample Index To Time
20. Signal Synthesis
21. Sine Synthesis
22. Superposition Principle
23. Unit Circle
24. Wave Addition
25. Waveform Plotting

## Prerequisites

This chapter builds on concepts from:

- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)

---

!!! mascot-welcome "The language the FFT is written in"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Everything from here through the end of this course leans on one compact piece of mathematics: complex numbers, and one elegant equation that ties them to rotation. It looks abstract at first. By the end of this chapter you'll see it's really just a precise way of describing a spinning point — and spinning points are exactly what waves are made of. Let's tune in.

You now know how to describe a single wave and how to capture one for real. This chapter builds the mathematical toolkit that the next three chapters — correlation, the DFT, and eventually the FFT itself — are built entirely on top of. None of it is new physics. It is a more powerful, more compact way of writing down ideas you already understand.

## A Two-Hundred-Year-Old Idea

The mathematics in this chapter traces back to one specific person. **Jean-Baptiste Fourier** was a French mathematician and physicist who, in the early 1800s, proved that essentially any periodic signal — no matter how complicated its shape — can be represented as a sum of simple sine and cosine waves. At the time, this claim was startling enough that other mathematicians doubted it. Two centuries later, it is the working principle behind an FFT running on a five-dollar microcontroller.

!!! note "Why this history matters here"
    Fourier's insight is the reason the "additive synthesis" section later in this chapter works at all, and the reason a spectrum analyzer can exist. Every frequency-domain tool in this course is, in some sense, still proving Fourier's original claim — just a lot faster than he could by hand.

## Radians: A Natural Way to Measure Angle

The wave equations from the previous chapters used degrees implicitly, but the mathematics of rotation — which is where this chapter is headed — works far more naturally in a different unit. A **radian** is a unit of angle measurement defined by the ratio of arc length to radius on a circle, where one full revolution equals \( 2\pi \) radians (approximately 6.283 radians) instead of 360 degrees. Radians are not an arbitrary alternative to degrees — they are the unit in which the calculus and algebra of waves simplify the most, which is why every equation from this point forward in the course uses them exclusively.

Frequency itself has a radian-based twin worth knowing before the unit circle below. **Angular frequency** is the rate of rotation expressed in radians per second rather than cycles per second, related to ordinary frequency by \( \omega = 2\pi f \) — angular frequency is what actually appears inside the sine and cosine functions once rotation, rather than repetition count, becomes the mental model.

#### Angular Frequency

\[ \omega = 2\pi f \]

where:

- \( \omega \) (omega) is the angular frequency, in radians per second
- \( f \) is the ordinary frequency, in Hertz

The geometric object that makes radians concrete is a specific circle you have likely seen before but perhaps not by this name. The **unit circle** is a circle with radius exactly 1, centered at the origin of a coordinate plane, used to define sine and cosine geometrically as the vertical and horizontal coordinates of a point rotating around it. As a point travels once around the unit circle, its horizontal coordinate traces out a cosine wave and its vertical coordinate traces out a sine wave — the two waveforms from Chapter 4 are, quite literally, the shadow of one rotating point.

#### Diagram: Unit Circle and Radians Explorer

<iframe src="../../sims/unit-circle-radians-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Unit Circle and Radians Explorer</summary>
Type: microsim
**sim-id:** unit-circle-radians-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Interpret, explain

Learning objective: Let students interpret the relationship between a point rotating around the unit circle, its angle in radians, and the resulting sine and cosine waveforms traced out over time.

Canvas layout:
- Left (350px): a unit circle with a point rotating around it, showing the current angle and its horizontal/vertical projections
- Right (350px): a synchronized time-domain plot showing sine (from the vertical projection) and cosine (from the horizontal projection) building up over time as the point rotates

Visual elements:
- Unit circle with radius labeled "1"
- A rotating point (dot) on the circle's edge
- A dashed vertical line from the point down to the x-axis (showing the cosine projection) and a dashed horizontal line to the y-axis (showing the sine projection)
- Angle arc from the positive x-axis to the current point, labeled in both radians and degrees
- Right-hand plot: sine curve (solid) and cosine curve (dashed) growing left to right as the angle increases, synchronized with the rotating point

Interactive controls:
- Slider: Angle, range 0 to 2π radians (labeled in radians with degree equivalent shown), default 0
- Play/Pause button: animates the point rotating continuously at an adjustable speed
- Speed slider: controls rotation speed when playing

Behavior:
- Dragging the angle slider (or letting it animate) moves the point around the circle and simultaneously extends the sine and cosine curves on the right-hand plot
- The angle readout updates live in both radians (e.g., "1.57 rad") and degrees (e.g., "90°")
- At angle 0, π/2, π, and 3π/2, brief highlight markers appear on both the circle and the plot to anchor the four quarter-turn landmarks

Instructional Rationale: An Understand-level synchronized dual-view is appropriate because the objective is interpreting the geometric origin of sine and cosine, not solving a problem — watching the same rotating angle simultaneously as a point on a circle and as two growing waveforms directly connects the geometric and algebraic representations of angle.

Implementation notes:
- Use p5.js; compute point position as (cos(angle), sin(angle)) and append to two growing arrays for the right-hand plot
- Responsive width; circle and plot panels stack vertically below 700px width
</details>

## Complex Numbers: A Second Dimension for Numbers

Ordinary numbers — the kind used for amplitude, time, or frequency so far — live on a single number line. Describing rotation, it turns out, requires a number system with two dimensions instead of one.

The building block of that system starts from a number that has no ordinary square root. The **imaginary unit**, written \( i \), is defined as the square root of −1 — a number that does not exist among ordinary (real) numbers, since no real number multiplied by itself produces a negative result, but which is fully well-defined as its own mathematical object. Combining an ordinary real number with a multiple of \( i \) produces the full number system this chapter needs: **complex numbers** are numbers of the form \( a + bi \), consisting of a real part \( a \) and an imaginary part \( b \), that extend the ordinary number line into a two-dimensional plane.

#### A Complex Number

\[ z = a + bi \]

where:

- \( z \) is the complex number
- \( a \) is the real part
- \( b \) is the imaginary part
- \( i \) is the imaginary unit, \( \sqrt{-1} \)

Because a complex number carries two independent pieces of information, it plots naturally as a point — or equivalently, an arrow — on a two-dimensional plane, with the real part along one axis and the imaginary part along the other. That arrow has a length, and that length has a name: the **magnitude** of a complex number is its distance from the origin on the complex plane, calculated as \( |z| = \sqrt{a^2 + b^2} \) — a direct application of the Pythagorean theorem to the real and imaginary parts. Magnitude will reappear constantly starting in the DFT chapter, where it becomes the "how strong is this frequency" measurement read directly off a spectrum.

One more operation on complex numbers is worth defining now, because it appears repeatedly once the DFT is built. The **complex conjugate** of a complex number \( a + bi \) is the number \( a - bi \) — identical real part, imaginary part flipped in sign — geometrically, the mirror image of the original point reflected across the real axis.

## Euler's Formula: Rotation and Complex Numbers, Unified

The unit circle and complex numbers describe the same idea — position determined by an angle — using two different notations. One of the most celebrated equations in mathematics ties them together exactly.

**Euler's formula** states that \( e^{i\theta} = \cos(\theta) + i\sin(\theta) \) — the complex exponential of an imaginary angle equals a complex number whose real part is the cosine of that angle and whose imaginary part is the sine of that angle. In plain terms: raising a special constant, \( e \), to an imaginary power produces exactly the coordinates of the point at angle \( \theta \) on the unit circle from the previous section.

#### Euler's Formula

\[ e^{i\theta} = \cos(\theta) + i\sin(\theta) \]

where:

- \( e \) is Euler's number, approximately 2.71828
- \( \theta \) (theta) is the angle, in radians
- \( i \) is the imaginary unit

This single line is why complex numbers matter to this course at all: it lets an entire wave — its amplitude, its frequency, and its timing all at once — be written as one rotating complex number instead of a separate sine and cosine pair. The timing piece has a name of its own here: **phase offset** is the starting angle \( \theta_0 \) of a rotating complex number (or a sine wave) at time zero, shifting exactly when in its cycle the wave begins — the same idea as the "phase" introduced in Chapter 4, now expressed as an angle on the unit circle rather than a fraction of a cycle.

#### Diagram: Complex Plane and Euler's Formula Visualizer

<iframe src="../../sims/complex-plane-euler-visualizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Complex Plane and Euler's Formula Visualizer</summary>
Type: microsim
**sim-id:** complex-plane-euler-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Demonstrate, calculate

Learning objective: Let students manipulate the angle of a rotating complex number and demonstrate that its real and imaginary parts continuously match cos(theta) and sin(theta), connecting Euler's formula to the complex plane.

Canvas layout:
- Left (400px): a complex plane (real axis horizontal, imaginary axis vertical) with a vector from the origin to the point e^(i*theta)
- Right (300px): live numeric readout panel

Visual elements:
- Real and imaginary axes, labeled "Re" and "Im"
- A vector (arrow) from the origin to the current point, with its magnitude always exactly 1 (since |e^(i*theta)| = 1)
- Dashed projection lines onto both axes showing the real part (cos theta) and imaginary part (sin theta) separately
- Live readout: "e^(i × [theta]) = [cos value] + [sin value]i" with numeric values substituted
- Live readout of magnitude, always showing 1.00 regardless of angle

Interactive controls:
- Slider: theta, range 0 to 2π radians, default 0
- Play/Pause button to animate continuous rotation

Behavior:
- Moving the theta slider rotates the vector and updates both the real/imaginary projections and the numeric readout live
- The magnitude readout stays fixed at 1.00 no matter the angle, reinforcing that Euler's formula traces the unit circle exactly

Instructional Rationale: An Apply-level parameter-exploration pattern is appropriate because the objective is calculating and confirming, for specific angle values, that the abstract formula e^(i*theta) = cos(theta) + i*sin(theta) produces the exact coordinates shown geometrically — direct manipulation with a live numeric readout lets students verify the equation rather than take it on faith.

Implementation notes:
- Use p5.js; compute point position directly from Math.cos(theta) and Math.sin(theta)
- Responsive width; complex plane and readout panel stack vertically below 650px width
</details>

!!! mascot-thinking "One equation, three ideas at once"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Euler's formula is doing three jobs simultaneously: it's a rotation (angle theta), it's a point on a circle (real and imaginary parts), and it's a wave (cosine and sine). Every one of those three views is correct at the same time. When correlation and the DFT start using complex exponentials in two chapters, this is the equation making that possible.

## Adding Waves Together

Complex numbers and Euler's formula describe a single rotating wave precisely. The next question is what happens when more than one wave exists in the same place at the same time — which is, after all, the normal situation for any real sound.

The physical rule governing this is remarkably simple. The **superposition principle** states that when two or more waves overlap in the same medium at the same time, the resulting displacement at every point is simply the sum of each individual wave's displacement — waves do not distort, block, or interfere with each other's underlying identity, they just add. Applying that rule directly produces **wave addition**: the process of combining two or more waveforms by adding their amplitude values together at each corresponding point in time, producing a single combined waveform.

Wave addition can strengthen a signal or nearly erase it, entirely depending on how the waves line up in phase. When two waves happen to be in phase — peak lining up with peak — **constructive interference** occurs: the combination of two or more waves whose peaks and troughs align, producing a resulting wave with larger amplitude than either individual wave. When two waves are out of phase — one wave's peak lining up with the other's trough — **destructive interference** occurs: the combination of two or more waves whose peaks and troughs oppose each other, producing a resulting wave with smaller amplitude, potentially canceling out almost entirely.

| Interference type | Phase relationship | Resulting amplitude |
|---|---|---|
| Constructive | Peaks align with peaks | Larger than either wave alone |
| Destructive | Peaks align with troughs | Smaller than either wave alone, possibly near zero |

A related, audible phenomenon happens when two waves have frequencies that are close but not identical. A **beat frequency** is the slow rise-and-fall pulsing in loudness heard when two tones of slightly different frequency are played together, occurring at a rate equal to the absolute difference between the two frequencies. Two guitar strings tuned almost, but not quite, to the same pitch produce a distinctive wavering "wah-wah-wah" sound — that pulsing rate is the beat frequency, and it is a direct, audible consequence of alternating constructive and destructive interference as the two waves drift in and out of phase with each other.

#### Diagram: Wave Superposition and Beats Simulator

<iframe src="../../sims/wave-superposition-beats-simulator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Wave Superposition and Beats Simulator</summary>
Type: microsim
**sim-id:** wave-superposition-beats-simulator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, compare

Learning objective: Let students set the frequency and phase of two independent sine waves, examine the summed waveform, and compare regions of constructive interference, destructive interference, and — when frequencies are close but unequal — the resulting beat pattern.

Canvas layout:
- Top (150px): Wave 1, plotted alone
- Middle (150px): Wave 2, plotted alone
- Bottom (250px): the summed waveform (Wave 1 + Wave 2), all three sharing the same time axis

Visual elements:
- Three stacked waveform plots sharing a common horizontal time axis
- On the summed plot, shaded green regions where the two input waves are approximately in phase (constructive) and shaded red regions where approximately out of phase (destructive)
- When frequencies are close but not equal, a slowly-varying dashed "envelope" curve is overlaid on the summed waveform, tracing the beat pattern

Interactive controls:
- Slider: Wave 1 frequency, range 200-500 Hz, default 300 Hz
- Slider: Wave 2 frequency, range 200-500 Hz, default 300 Hz
- Slider: Wave 2 phase offset, range 0 to 2π radians, default 0
- Readout: "Beat frequency: |f1 - f2| = [X] Hz" (only shown when frequencies differ)

Default parameters:
- Wave 1 frequency: 300 Hz
- Wave 2 frequency: 300 Hz (identical, so students first see pure constructive/destructive interference via phase alone)
- Wave 2 phase offset: 0 (fully constructive at start)

Behavior:
- With equal frequencies, moving the phase slider from 0 to π smoothly morphs the summed wave from fully constructive (double amplitude) to fully destructive (near zero amplitude)
- Setting Wave 2's frequency slightly different from Wave 1's frequency replaces the static interference pattern with a visibly pulsing beat envelope on the summed plot, and the beat frequency readout appears and updates live

Instructional Rationale: An Analyze-level comparison pattern is appropriate because the objective requires examining how phase and frequency differences between two waves produce distinct, comparable outcomes (steady interference versus pulsing beats) — three synchronized stacked plots let students directly compare each input wave against the combined result.

Implementation notes:
- Use p5.js; compute the summed waveform as wave1(t) + wave2(t) sample by sample every frame
- Responsive width; all three stacked plots scale to container width on window resize
</details>

!!! mascot-tip "Beats are interference you can literally hear"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    If you've ever tuned a guitar by listening for the wobble to slow down and disappear, you were using beat frequency without knowing its name. The wobble *is* the beat frequency, and it hits zero exactly when both strings reach the same pitch — a genuinely useful trick, and now you know why it works.

## Building Signals from Scratch

Superposition works in reverse too: instead of two waves accidentally combining, a program can deliberately add together sine waves of chosen frequencies, amplitudes, and phases to construct a signal with any desired shape. This is precisely how Chapter 4's harmonic stack simulator built different instrument timbres, and it deserves a formal name now.

**Signal synthesis** is the process of deliberately generating a signal by computing its values from a mathematical formula, rather than capturing it from a physical sensor. The most common technique for doing this builds directly on this chapter's tools: **additive synthesis** is a signal synthesis technique that constructs a complex waveform by adding together multiple sine waves of different frequencies, amplitudes, and phases — the exact operation performed by the harmonic stack simulator two chapters ago, now named precisely. Constructing a signal from a single sine component, before combining several, is worth naming on its own: **sine synthesis** is the generation of a single sine wave from its frequency, amplitude, and phase parameters using the general sine wave equation from Chapter 4.

Real instruments rarely sustain a constant amplitude the instant a note starts and stops — a plucked string starts loud and fades, a bowed note swells in. That shape, layered on top of a wave's regular oscillation, has its own name: an **amplitude envelope** is a curve describing how a sound's overall amplitude changes over the duration of a note — typically rising quickly at the start (attack) and falling off gradually at the end (decay) — multiplied against a synthesized wave to make it sound more like a real instrument rather than a flat, mechanical tone.

Writing a synthesized signal in code requires converting between two ways of indexing time. A captured or synthesized signal is stored as an array, where each entry corresponds to one sample — but the sine and cosine equations from Chapter 4 expect an actual time value in seconds, not an array position. **Sample index to time** is the conversion from a sample's position (index) in an array to the actual time, in seconds, that sample represents, calculated as \( t = \frac{n}{f_s} \), where \( n \) is the sample index and \( f_s \) is the sampling rate.

#### Sample Index to Time

\[ t = \frac{n}{f_{s}} \]

where:

- \( t \) is time, in seconds
- \( n \) is the sample index (0, 1, 2, ...)
- \( f_{s} \) is the sampling rate, in Hertz

Before the code below, it's worth stating plainly what each line does: the loop below builds a synthesized array by converting each sample index to a time value, then evaluating the sine wave equation at that exact time, for a specified number of samples at a specified sampling rate.

```python
import math

def synthesize_sine(frequency, amplitude, sample_rate, num_samples):
    samples = []
    for n in range(num_samples):
        t = n / sample_rate              # Sample index to time
        value = amplitude * math.sin(2 * math.pi * frequency * t)
        samples.append(value)
    return samples
```

Once a signal, real or synthesized, exists as an array of numbers, seeing its shape again requires plotting it the same way Chapter 4 did. **Waveform plotting** is the process of rendering a sequence of amplitude values, indexed by sample or by time, as a visual curve — the practical, repeated act of turning an array of numbers back into the kind of time domain plot introduced two chapters ago, used constantly throughout the rest of this course to sanity-check that captured or synthesized data looks the way it should.

!!! mascot-encourage "You've already built this, just without the vocabulary"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Additive synthesis, sine synthesis, sample index to time — three new terms in a row can feel like a lot. But you already did every one of these things when you explored the harmonic stack simulator back in Chapter 4. This section just gave the process its formal name and its formal code.

## A First Look at Orthogonality

One more idea deserves a preview here, even though its full power does not arrive until the next chapter. **Orthogonality** describes a relationship between two functions (or signals) in which they are, in a precise mathematical sense, completely independent of each other — combining or comparing them produces zero net interaction, similar to how two perpendicular directions in space share no overlap. Sine waves of different frequencies turn out to be orthogonal to each other in exactly this sense. That single fact is the entire mechanism the next chapter uses to detect whether a captured signal contains a specific frequency — a preview worth holding onto as this chapter closes.

## From Series to Spectrum

Fourier's original claim, stated formally, gives this chapter's tools a name and a destination. A **Fourier series** is a representation of a periodic signal as an infinite (or, in practice, finite) sum of sine and cosine waves at integer-multiple frequencies of the signal's fundamental frequency — precisely the additive-synthesis process from this chapter, but running in the *reverse* direction: instead of building a signal from known sine waves, a Fourier series describes an *existing* signal in terms of the sine waves hiding inside it.

Fourier's insight was later generalized beyond strictly periodic signals. The **continuous Fourier transform** is a mathematical operation that decomposes any continuous signal — periodic or not — into the continuous range of frequencies that compose it, producing a description of the signal's frequency content rather than its value over time. That frequency-based description has a name shared throughout the rest of this course: the **frequency domain** is a way of representing a signal by the strength of each frequency component it contains, rather than by its value at each moment in time — the direct counterpart to the time domain representation from Chapter 4, and the representation every remaining chapter in Module 3 and beyond is building toward.

The continuous Fourier transform, exactly as stated, needs a signal defined at every instant in continuous time — something no digital computer can ever actually possess, since Chapter 6 established that every captured signal already consists of discrete samples. Making the frequency domain computable from real, sampled data is precisely the unfinished business the next two chapters resolve.

## Chapter Summary

You now have the complete mathematical toolkit — complex numbers, Euler's formula, and superposition — that correlation, the DFT, and eventually the FFT are all built from.

Key ideas to carry forward:

- **Radians** and **angular frequency** describe angle and rotation rate the way the rest of this course's math expects; the **unit circle** makes that rotation geometric.
- **Complex numbers**, built from the **imaginary unit** \( i \), have a **magnitude** and a **complex conjugate**; **Euler's formula** ties them directly to rotation and to sine and cosine, with **phase offset** as the starting angle.
- The **superposition principle** governs **wave addition**: waves in phase produce **constructive interference**, waves out of phase produce **destructive interference**, and two close-but-different frequencies produce an audible **beat frequency**.
- **Signal synthesis**, especially **additive synthesis** built from **sine synthesis** and shaped by an **amplitude envelope**, builds a signal from scratch — using **sample index to time** conversion and verified with **waveform plotting**.
- **Orthogonality** is a first preview of the mechanism the next chapter uses to detect frequencies.
- A **Fourier series** decomposes a periodic signal into sine waves; the **continuous Fourier transform** generalizes this into the **frequency domain** — the destination the rest of this course is built to reach, computably, from real sampled data.

??? note "Quick check: two identical-amplitude sine waves at 440 Hz meet with a phase offset of exactly π radians. What happens to the combined wave, and why? — Click to expand"
    They cancel out almost completely through destructive interference. A phase offset of π radians (180°) means one wave's peak aligns exactly with the other wave's trough — by the superposition principle, adding equal and opposite displacements at every point in time produces a resulting amplitude near zero.

!!! mascot-celebration "You can now describe a wave as a rotating number"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Complex numbers, Euler's formula, superposition — that is genuinely graduate-level mathematical machinery, and you just built working intuition for all of it. Next stop: using orthogonality to answer one precise question — does my signal contain this note? — which is the exact seed the DFT grows from. Now *that's* a superpower.
