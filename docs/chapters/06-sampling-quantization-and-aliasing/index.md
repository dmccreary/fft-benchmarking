---
title: 'Sampling, Quantization, and Aliasing'
description: The core theory of digitizing sound — sample rate, the Nyquist theorem, aliasing, quantization, bit depth, and the limits they impose.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 20:10:00
version: 0.09
---

# Sampling, Quantization, and Aliasing

## Summary

This chapter covers the core theory of digitizing a continuous signal: sampling rate, the Nyquist theorem, aliasing, quantization, and bit depth. It works through the deliberately engineered failure of playing a tone above the Nyquist limit and watching the system report a confidently wrong frequency, then examines clipping, headroom, and dynamic range as the practical limits of a fixed bit depth. These are the concepts a student needs before any frequency-domain analysis makes sense.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. ADC Conversion
2. Aliasing
3. Aliasing Artifact
4. Arithmetic Right Shift
5. Bit Depth
6. Clipping
7. Clipping Distortion
8. Dynamic Range
9. Frequency Folding
10. Full Scale Value
11. Headroom
12. Integer Overflow
13. Noise Floor
14. Nyquist Frequency
15. Nyquist Theorem
16. Quantization
17. Quantization Error
18. Sample Period
19. Sample Rate Selection
20. Sample Rate Selection Tradeoff
21. Sample Word Format
22. Sampling
23. Sampling Rate
24. Sampling Theorem
25. Signal Noise
26. Signal To Noise Ratio
27. Tone Generator
28. Twenty Four Bit In Thirty Two
29. Undersampling
30. Unpacking Binary Data

## Prerequisites

This chapter builds on concepts from:

- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)

---

!!! mascot-welcome "Two ways a signal can lie to you"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Last chapter you captured a real sound. This chapter explains exactly how that capture can go wrong — and it will, on purpose, in an upcoming lab. There are only two knobs that control digitizing a sound: how *often* you measure it, and how *precisely* you measure it. Get either one wrong and the numbers you capture will confidently describe a sound that never happened. Let's tune in.

Digitizing a signal — turning the continuous analog voltage from your microphone into the discrete digital numbers your program stores — actually involves two entirely separate decisions. One decision is about *time*: how frequently do you take a measurement? The other is about *amplitude*: how precisely do you record each measurement's value? This chapter treats them one at a time, because they fail in completely different ways.

## Sampling: Measuring a Signal in Time

**Sampling** is the process of measuring a continuous signal's value at regular, discrete moments in time, producing a sequence of individual numbers from what was originally a smooth, unbroken wave. Each individual measurement is a *sample*; the rate at which those measurements happen has its own name and its own units.

The **sampling rate** (also called the sample rate) is the number of samples taken per second, measured in Hertz — the same unit used for frequency in the waves chapter, because a sampling rate is itself a kind of frequency: the frequency of *measuring*. A sampling rate of 16,000 Hz means the system captures 16,000 individual amplitude values every second. The time gap between one sample and the next has a name too: the **sample period** is the fixed time interval between one sample and the next, and it is the reciprocal of the sampling rate — a 16,000 Hz sampling rate produces a sample period of \( \frac{1}{16{,}000} \approx 0.0000625 \) seconds, or 62.5 microseconds.

Choosing a sampling rate is not automatic — it is a deliberate engineering decision your code makes explicitly, as you already saw in the `rate=16000` parameter back in the previous chapter's capture code. **Sample rate selection** is the process of choosing an appropriate sampling rate for a given application, balancing the range of frequencies that must be captured against the cost of capturing them. That balancing act has real consequences worth naming directly: the **sample rate selection tradeoff** is the tension between capturing a wider range of frequencies (requiring a higher sampling rate) and the resulting increase in data volume, memory use, and processing load that a higher sampling rate demands. Doubling your sampling rate doubles how much data your program must store and process every second — for a resource-constrained microcontroller, that cost is never free.

Testing exactly how a sampling system behaves requires a signal with a known, precisely controlled frequency — not a whistle or a clap, which vary unpredictably. A **tone generator** is a device or software routine that produces a pure tone at a precisely specified, controllable frequency, used throughout this course to test how sampling and frequency-analysis code behave against a known ground truth. Later labs use a software tone generator to feed exact frequencies into your sampling code and confirm — or, as you're about to see, deliberately break — its behavior.

## The Nyquist Theorem: A Hard Speed Limit

Sampling rate is not just a matter of "more is better, less is cheaper." There is a hard mathematical limit on what frequencies a given sampling rate can capture correctly at all — cross it, and no amount of clever processing afterward can fix the result.

This limit has two names you will see used interchangeably in datasheets and textbooks. The **sampling theorem** — formally the Nyquist–Shannon sampling theorem — is the mathematical principle establishing that a continuous signal can be perfectly reconstructed from its samples only if it was sampled at a rate greater than twice its highest frequency component. Named after one of the two engineers who established it, the **Nyquist theorem** is the common shorthand name for this same rate requirement, usually stated as the practical rule: "sample at more than twice the highest frequency you care about."

That "twice the highest frequency" boundary is important enough to have its own name. The **Nyquist frequency** is exactly half of the sampling rate, and it represents the highest frequency that a given sampling rate can capture correctly — any signal frequency above it cannot be represented accurately, no matter how good the rest of your system is.

#### Nyquist Frequency

\[ f_{Nyquist} = \frac{f_{s}}{2} \]

where:

- \( f_{Nyquist} \) is the Nyquist frequency, in Hertz
- \( f_{s} \) is the sampling rate, in Hertz

At a 16,000 Hz sampling rate — the rate used in this course's microphone labs — the Nyquist frequency is 8,000 Hz. Any sound above 8,000 Hz entering the microphone cannot be captured correctly at that rate. That is not a rare edge case to guard against occasionally; it is a hard ceiling every sampling decision in this course must respect.

## Aliasing: What Happens When You Break the Limit

Sampling a frequency above the Nyquist limit does not simply produce a blurry or degraded version of that frequency — it produces something far stranger: a completely different, incorrect frequency, reported with total confidence. This phenomenon is why the productive-failure lab previewed at the end of the last chapter works the way it does.

**Aliasing** is the phenomenon in which a signal frequency above the Nyquist frequency, once sampled, becomes indistinguishable from — and is measured as — a different, lower frequency that was never actually present in the original signal. The specific wrong signal that results is worth naming on its own: an **aliasing artifact** is the false, lower-frequency signal that appears in sampled data as a direct result of aliasing, visually or audibly indistinguishable from a real signal at that lower frequency. Once aliasing has occurred, there is no way to look at the sampled data alone and tell that anything went wrong — the artifact looks exactly as legitimate as a real signal would.

The specific mechanism behind this false result has a descriptive name: **frequency folding** is the mathematical process by which a frequency component above the Nyquist frequency gets reflected — "folded" — back down into the representable range below it, landing at a new, incorrect frequency determined by how far past the Nyquist frequency the original signal was. A signal sampled below the rate needed to represent it correctly is said to suffer from **undersampling**: sampling a signal at a rate too low to satisfy the Nyquist theorem for that signal's frequency content, the root cause that makes aliasing possible in the first place.

Before the interactive demonstration below, it's worth being concrete about what folding actually produces: sample an 11,000 Hz tone at a 16,000 Hz rate (Nyquist frequency 8,000 Hz), and the frequency-folding math reflects it back down to exactly 5,000 Hz — not garbage, not silence, but a clean, confident, completely wrong 5,000 Hz reading.

#### Diagram: Aliasing Demonstrator

<iframe src="../../sims/aliasing-demonstrator/main.html" width="100%" height="467px" scrolling="no"></iframe>

<details markdown="1">
<summary>Aliasing Demonstrator</summary>
Type: microsim
**sim-id:** aliasing-demonstrator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, distinguish

Learning objective: Let students adjust a true signal frequency against a fixed sampling rate and analyze how, once the true frequency crosses the Nyquist frequency, the samples taken start to trace out a different, lower "ghost" frequency — distinguishing correct sampling from aliased sampling.

Canvas layout:
- Top (350px): a continuous waveform plot showing the true analog signal as a smooth curve, with sample points marked as dots at each sampling instant
- Bottom (150px): controls and a readout panel

Visual elements:
- The true continuous signal, drawn as a smooth sine curve
- Sample dots placed exactly where the sampling rate captures the signal
- A second, dashed curve connecting the sample dots — the "reconstructed" curve a system would see from the samples alone
- Readout: "True frequency: [X] Hz | Sampling rate: [Y] Hz | Nyquist frequency: [Y/2] Hz | Apparent frequency: [Z] Hz"
- Color change: the dashed reconstructed curve turns from green to red the moment true frequency exceeds the Nyquist frequency

Interactive controls:
- Slider: True signal frequency, range 100 Hz to 15,000 Hz, default 1,000 Hz
- Slider: Sampling rate, range 4,000 Hz to 16,000 Hz, default 16,000 Hz (fixed at course's standard rate by default)
- Toggle: "Show reconstructed (aliased) curve"

Default parameters:
- True frequency: 1,000 Hz
- Sampling rate: 16,000 Hz
- Reconstructed curve: on

Behavior:
- While true frequency stays below the Nyquist frequency, the dashed reconstructed curve closely tracks the true curve and the readout shows "Apparent frequency" equal to the true frequency, displayed in green
- Once true frequency exceeds the Nyquist frequency, the dashed reconstructed curve visibly diverges into a slower, different-looking wave, and the readout computes and displays the folded apparent frequency in red, using the frequency-folding formula
- Moving the sampling rate slider immediately recalculates and redraws the Nyquist frequency and both curves

Instructional Rationale: An Analyze-level parameter exploration with a correct/incorrect color-coded readout is appropriate because the objective is for students to examine the direct relationship between sampling rate, true frequency, and the point at which the reconstructed signal stops matching reality — direct manipulation with an unambiguous visual state change (green to red) makes the abstract Nyquist boundary concrete and self-evidently a hard limit rather than a gradual degradation.

Implementation notes:
- Use p5.js; compute the folded apparent frequency as abs(round(true_freq / sample_rate) * sample_rate - true_freq) when true_freq exceeds the Nyquist frequency
- Responsive width; waveform plot and controls scale to container width on window resize
</details>

!!! mascot-thinking "This is the lab that's designed to fool you"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Remember the productive-failure preview from last chapter? This is it. When your instrument reports a wrong frequency with total confidence, it isn't lying to you out of malice — it's doing exactly what frequency folding predicts. The fix is never "debug the code" — it's "raise the sampling rate, or filter out anything above the Nyquist frequency before you sample."

## Quantization: Measuring a Signal in Amplitude

Sampling solves *when* to measure. A separate question remains: once you measure, how precisely can you record the value? A microphone's voltage can, in principle, take on infinitely many possible values — but computer memory can only store a finite, fixed set of numbers.

**Quantization** is the process of mapping a continuous range of analog amplitude values onto a finite set of discrete digital values, rounding each measured amplitude to the nearest representable number. The physical circuit that performs both sampling and quantization together, converting a continuous voltage into a discrete digital number, is the **ADC conversion**: the process performed by an analog-to-digital converter, which samples a continuous voltage at a given instant and quantizes it to the nearest value representable in a fixed number of bits. In the previous chapter, the INMP441's on-chip ASIC performs exactly this ADC conversion internally, before the digital bitstream ever reaches your Pico 2.

Because quantization always rounds to the *nearest* representable value, it always introduces some small error. **Quantization error** is the difference between a signal's true, continuous amplitude value and the nearest discrete value it gets rounded to during quantization — an unavoidable, small distortion present in every digitized signal, no matter how carefully it is captured.

How much precision quantization can achieve depends entirely on how many discrete values are available to round to, which depends directly on how many bits are used to store each sample. **Bit depth** is the number of bits used to represent each individual sample's amplitude value, directly determining how many distinct discrete levels are available — a 16-bit sample can take on \( 2^{16} = 65{,}536 \) distinct values, while an 8-bit sample can take on only 256. The single largest magnitude a given bit depth can represent has its own name: the **full scale value** is the maximum representable amplitude magnitude for a given bit depth — for a signed 16-bit format, the full scale value is 32,767 in the positive direction.

Before comparing bit depths directly, it helps to see concretely how much quantization error shrinks as bit depth grows — doubling the number of available levels halves the size of the largest possible rounding error.

| Bit depth | Distinct levels | Full scale value (signed) | Max quantization error |
|---|---|---|---|
| 8-bit | 256 | 127 | ~0.4% of full scale |
| 16-bit | 65,536 | 32,767 | ~0.0015% of full scale |
| 24-bit | 16,777,216 | 8,388,607 | ~0.000006% of full scale |

## Headroom, Clipping, and Dynamic Range

Bit depth does not just control precision — it also sets a hard ceiling on the *largest* signal a system can represent at all, and that ceiling has real consequences for how a system should be used in practice.

Well-designed systems avoid recording signals that get close to that ceiling. **Headroom** is the margin, or safety buffer, between a signal's typical peak amplitude and the full scale value — deliberately leaving room so that unexpectedly loud moments do not exceed what the bit depth can represent. Without headroom, a signal has nowhere to go if it briefly gets louder than expected.

Crossing that ceiling anyway produces a specific, ugly failure. **Clipping** occurs when a signal's amplitude exceeds the full scale value a system can represent, forcing every sample above that value to be recorded as the maximum representable value instead of its true, larger amplitude. The audible consequence has its own name: **clipping distortion** is the harsh, distorted sound that results from clipping, caused by the flattened tops and bottoms of a clipped waveform introducing new, unwanted frequency content that was never present in the original sound. Unlike aliasing, which produces one clean wrong frequency, clipping distortion typically produces many new frequencies at once — a later chapter's spectrum analyzer makes this visually unmistakable.

The overall range a system can usefully capture, from its quietest reliably-distinguishable signal to its loudest non-clipped signal, is its **dynamic range**: the ratio, typically expressed in decibels, between the largest and smallest signal amplitudes a system can represent or measure accurately. Bit depth sets dynamic range directly — each additional bit roughly doubles the number of representable levels, which works out to approximately 6 decibels of additional dynamic range per bit added.

At the quiet end of that range, quantization error itself becomes an audible limit. The **noise floor** is the level of residual background noise — largely made up of accumulated quantization error — below which a genuine signal cannot be reliably distinguished from noise. More broadly, any unwanted random variation riding along with a signal, from any source, is called **signal noise**: unwanted, random variation present in a captured signal that was not part of the original source, arising from quantization error, electrical interference, or the sensor itself. The ratio between how strong a genuine signal is and how much noise accompanies it is the single most important quality number for any capture system: the **signal to noise ratio** (SNR) is the ratio, typically expressed in decibels, between the power of a genuine signal and the power of the noise accompanying it — a higher SNR means a cleaner, more trustworthy capture.

Before the diagram below, it helps to see all four of these ideas — headroom, clipping, dynamic range, and noise floor — positioned together on a single amplitude scale, since each one only makes sense relative to the others.

!!! mascot-warning "Clipping can't be undone after the fact"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning">
    Once a sample clips, the information above full scale is simply gone — there is no processing trick later in this course that can recover it. Unlike a slightly noisy recording, which can be improved, a clipped recording is permanently damaged at the moment of capture. Watch your levels before you hit record, not after.

#### Diagram: Dynamic Range Ladder

<iframe src="../../sims/dynamic-range-ladder/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Dynamic Range Ladder</summary>
Type: infographic
**sim-id:** dynamic-range-ladder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, interpret

Learning objective: Let students interpret a vertical amplitude scale showing where full scale, headroom, typical signal level, noise floor, and the clipping zone sit relative to one another, and explain what happens to a signal at each zone.

Canvas layout:
- A single tall vertical bar (500px tall, 120px wide) representing the full amplitude range of a fixed bit depth, with labeled horizontal zone boundaries
- Right side: infobox panel revealing details when a zone is clicked

Visual elements, top (loudest) to bottom (quietest):
- "Clipping zone" (red band) at the very top, above the full scale value
- "Full scale value" boundary line
- "Headroom" band (yellow) just below full scale
- "Typical signal level" band (green), the main working range
- "Noise floor" band (gray) near the bottom
- "Silence / below noise floor" (dark gray) at the very bottom

Interactive elements:
- Clicking any labeled band highlights it and shows its definition and one consequence in the infobox (e.g., clicking "Clipping zone" shows: "Signal amplitude here gets forced down to the full scale value — clipping distortion results.")
- A toggle: "Add 1 bit of depth" — animates the whole ladder's noise floor band shrinking and the usable green zone growing, demonstrating the roughly 6 dB per bit improvement

Instructional Rationale: An Understand-level clickable infographic is appropriate because the objective is explaining what each zone on a shared amplitude scale means and how it relates to the others — a single persistent spatial layout, explored via click, reinforces that headroom, clipping, dynamic range, and noise floor are all positions on one continuous scale rather than unrelated concepts.

Implementation notes:
- Use p5.js; draw the vertical bar as a stack of colored rectangles with clear boundary lines and labels
- Responsive width; ladder and infobox stack vertically below 600px width
</details>

!!! mascot-tip "Headroom is insurance you hope you never need"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    When you set input levels in an upcoming lab, resist the urge to push the signal as loud as possible for a "strong" reading. A signal sitting right at full scale has zero headroom — one unexpectedly loud moment and you're clipping. Leave margin on purpose.

## The Sample Word Format: Bits on the Wire

Everything above explains *why* a captured value looks the way it does. This last section explains exactly *how* that value is packaged as bits, because the INMP441 microphone from the previous chapter uses a format that is not immediately obvious from the raw bytes alone.

The **sample word format** is the specific arrangement of bits used to represent one audio sample within a fixed-size data word — how many bits are signal, how many are padding, and where the sign bit lives. The INMP441 has a particular, named quirk here: it outputs a genuine 24-bit sample, but delivers it inside a 32-bit data word. **Twenty-four-bit-in-thirty-two** describes exactly this format — a 24-bit audio sample left-justified within a larger 32-bit container, with the remaining 8 bits either padded with zeros or, on some hardware configurations, simply unused. Reading that 32-bit word as if it were a clean, right-aligned 32-bit number would produce a wildly incorrect value, because the real 24 bits of signal are sitting in the *upper* portion of the word, not the lower.

Extracting the correct value from a raw byte buffer requires two steps, and both need explaining before the code that performs them makes sense. First, the raw bytes captured by `readinto()` in the previous chapter need to be reassembled into actual integers — a step called **unpacking binary data**: the process of interpreting a sequence of raw bytes as one or more numeric values, according to a specified size, byte order, and signedness. Second, because the real 24-bit sample sits in the upper bits of each 32-bit word, that value must be shifted down into normal range using an **arithmetic right shift**: a bit-shifting operation that moves all bits in a binary number to the right by a specified amount while preserving the sign bit, correctly dividing a signed number by a power of two.

!!! mascot-encourage "Bit shifting looks scarier than it is"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    The code block below has a right-shift operator and a byte-unpacking call together, which can look intimidating the first time. Hold onto one plain idea while you read it: the microphone is just handing you a number parked eight bits too far to the left, and a right shift slides it back to where it belongs.

```python
import struct

# audio_buffer holds raw bytes from the previous chapter's readinto() call
# Each sample is a 32-bit (4-byte) word; unpack as signed 32-bit integers
raw_samples = struct.unpack("<" + "i" * (len(audio_buffer) // 4), audio_buffer)

# The real 24-bit sample sits in the upper bits of each 32-bit word
samples = [s >> 8 for s in raw_samples]   # Arithmetic right shift to correct position
```

The `struct.unpack()` call performs the unpacking step: `"<i"` tells it to read each group of four bytes as one little-endian signed 32-bit integer (`<` means little-endian byte order, `i` means signed 32-bit integer). The list comprehension that follows performs the arithmetic right shift, dividing each raw value by \( 2^{8} \) — moving the genuine 24-bit sample down out of the padding and back into its correct numeric range, while the `>>` operator's sign-preserving behavior keeps negative sample values correctly negative.

One more hazard is worth naming before it causes a confusing bug later in the course: when adding or accumulating many sample values together — as several upcoming labs do — the running total can, in principle, exceed the largest value a fixed-size integer can hold. **Integer overflow** occurs when the result of an arithmetic operation exceeds the maximum value representable in the number of bits allotted, causing the value to wrap around to an incorrect, often negative, result instead of the true sum. MicroPython's integers grow automatically and do not silently overflow the way fixed-size integers in languages like C do — but the assembly language chapters later in this course work directly with fixed-size registers, where this exact failure mode becomes a real and specific danger worth having already met by name.

## Chapter Summary

You now have the complete theory behind every number your captured audio buffer contains — and, just as importantly, you know exactly how that number can quietly become wrong.

Key ideas to carry forward:

- **Sampling** measures a signal in time, at the **sampling rate**, with a fixed **sample period** between measurements; picking that rate is **sample rate selection**, governed by the **sample rate selection tradeoff** between frequency range and data cost.
- The **sampling theorem** (commonly called the **Nyquist theorem**) sets a hard limit: sample above twice your highest frequency of interest, or the **Nyquist frequency**, or lose information permanently.
- Sampling below that limit is **undersampling**, and it produces **aliasing** — an **aliasing artifact** caused by **frequency folding**, a confidently wrong frequency reading.
- **Quantization** measures a signal in amplitude, rounding each sample during **ADC conversion**, always introducing some **quantization error**. **Bit depth** sets how many discrete levels — and how large a **full scale value** — are available.
- **Headroom** protects against **clipping** and its audible **clipping distortion**; **dynamic range**, **noise floor**, **signal noise**, and **signal to noise ratio** together describe how cleanly a system captures a real signal.
- The INMP441's **sample word format** is **twenty-four-bit-in-thirty-two**, requiring **unpacking binary data** and an **arithmetic right shift** to extract the correct value — and accumulating many samples risks **integer overflow** in fixed-size arithmetic.

??? note "Quick check: a lab samples a 12,000 Hz tone at a 16,000 Hz sampling rate. Is this safe, or will it alias — and why? — Click to expand"
    It will alias. The Nyquist frequency at a 16,000 Hz sampling rate is 8,000 Hz (half the sampling rate), and 12,000 Hz is above that limit. The 12,000 Hz tone will fold down to an incorrect apparent frequency of |16,000 − 12,000| = 4,000 Hz.

!!! mascot-celebration "You can now predict exactly how digitizing fails"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Sampling rate, Nyquist frequency, aliasing, quantization, bit depth, clipping — that's the complete toolkit for reasoning about *why* a digitized signal looks the way it does, good or bad. Next up: the math language — complex numbers — that the rest of this course uses to actually pull frequencies back out of a signal like this. Now *that's* a superpower.
