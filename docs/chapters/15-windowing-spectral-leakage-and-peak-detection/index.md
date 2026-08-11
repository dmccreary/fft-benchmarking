---
title: Windowing, Spectral Leakage, and Peak Detection
description: Fix spectral leakage with window functions, then build a sub-bin-accurate peak detector with parabolic interpolation and musical note mapping.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 22:05:00
version: 0.09
---

# Windowing, Spectral Leakage, and Peak Detection

## Summary

This chapter explains spectral leakage — the smearing of a signal's energy across neighboring bins when it doesn't divide evenly into the FFT's period — and introduces window functions (Hann, Hamming, Blackman) as the fix, along with the resolution-versus-leakage tradeoff each window makes. It then builds a peak detector with parabolic interpolation for sub-bin frequency accuracy, and maps detected frequencies to musical pitch and octave. By the end, students have the accuracy needed to build a working tuner.

## Concepts Covered

This chapter covers the following 32 concepts from the learning graph:

1. Argmax Search
2. Bin To Frequency
3. Blackman Window
4. Coherent Gain
5. Dominant Frequency
6. Edge Discontinuity
7. Frequency Estimation
8. Frequency Resolution Limit
9. Hamming Window
10. Hanning Window
11. Local Maximum
12. Main Lobe Width
13. Music Analysis
14. Musical Note Mapping
15. Octave
16. Parabolic Interpolation
17. Peak Bin
18. Peak Detection
19. Pitch
20. Pitch Detection
21. Rectangular Window
22. Side Lobe Level
23. Spectral Leakage
24. Spectral Leakage Effect
25. Sub Bin Accuracy
26. Threshold Rejection
27. Window Application
28. Window Table
29. Window Tradeoff
30. Windowing Functions
31. Zero Padding
32. Zero Padding Input

## Prerequisites

This chapter builds on concepts from:

- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [14. Computing and Displaying a Real Spectrum](../14-computing-and-displaying-a-real-spectrum/index.md)

---

!!! mascot-welcome "That blurry peak isn't a bug — let's fix it anyway"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    If you ran the whistle test in the last chapter, you may have noticed your peak doesn't land as one crisp spike — it smears across a few bins. That's not your implementation's fault. It's a real, well-understood effect, and fixing it is exactly what turns a spectrum display into a working tuner. Let's tune in.

## A Blurry Peak, Explained

The Discrete Fourier Transform, going all the way back to its definition in Chapter 9, carries a hidden assumption that has not mattered until now: it treats the captured frame of samples as if that exact frame repeats over and over, forever, back to back. Most captured signals do not actually happen to complete a whole number of cycles inside a single frame — and when they don't, that assumption breaks in a specific, visible way.

An **edge discontinuity** occurs when a signal's value at the very end of a captured frame does not match its value at the very start, so the DFT's implicit "repeat forever" assumption produces an abrupt jump every time the frame notionally restarts — even though the original, continuous signal had no such jump at all. This artificial jump is not free: representing a sudden jump requires energy spread across *many* frequencies at once, not the one clean frequency the original signal actually contained.

That spreading has a name, and it is the central problem this chapter exists to solve. **Spectral leakage** is the smearing of a signal's true frequency energy across many neighboring bins, rather than concentrating cleanly in the one bin that matches the signal's actual frequency, caused directly by the edge discontinuity described above. The visible result on an actual spectrum display is worth naming separately from its cause: the **spectral leakage effect** is the practical, visual consequence of spectral leakage — a peak that should appear as one sharp, narrow spike instead appears smeared or blurred across several adjacent bins, with a trailing "skirt" of lower-level energy extending outward on both sides.

#### Diagram: The Periodic Assumption and Edge Discontinuity

<iframe src="../../sims/periodic-assumption-edge-discontinuity/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>The Periodic Assumption and Edge Discontinuity</summary>
Type: microsim
**sim-id:** periodic-assumption-edge-discontinuity<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, interpret

Learning objective: Let students interpret how the DFT's implicit periodic-repetition assumption produces an edge discontinuity when a captured frame does not contain a whole number of signal cycles, and explain why that discontinuity causes spectral leakage.

Canvas layout:
- Top (250px): three repeated copies of a captured frame drawn side by side, showing the signal as the DFT implicitly assumes it repeats
- Bottom (250px): the resulting spectrum, showing either a clean single peak or a smeared, leaked peak depending on the current frequency setting

Visual elements:
- Three side-by-side copies of the same captured sine wave frame, with the boundary between copies marked by a vertical dashed line
- A highlighted circle or marker at each frame boundary showing whether the signal value matches smoothly (no jump) or discontinues (visible jump) across the boundary
- Corresponding spectrum below: a single clean narrow bar when frequency divides evenly into the frame, or several smeared bars when it does not

Interactive controls:
- Slider: Signal frequency, continuously adjustable, with specific "snap to clean" marks at frequencies that complete a whole number of cycles in the frame

Behavior:
- At a frequency that completes a whole number of cycles in the frame, the three repeated copies join seamlessly (no visible jump), and the spectrum below shows one clean, narrow peak
- At any other frequency, a visible jump appears at each frame boundary, and the spectrum below visibly smears the peak across several neighboring bins

Instructional Rationale: An Understand-level pattern is appropriate because the objective is explaining the causal mechanism (discontinuity causes leakage) rather than performing a calculation — showing the repeated-frame visualization directly makes the DFT's hidden periodic assumption, and its consequence, visible rather than abstract.

Implementation notes:
- Use p5.js; compute the actual small DFT of the current frame live to drive the bottom spectrum panel, so the leakage shown is genuinely computed, not merely illustrated
- Responsive width; top and bottom panels stack vertically below 600px width
</details>

!!! mascot-thinking "Leakage isn't a flaw in your FFT — it's a property of finite data"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    It's worth sitting with this: your FFT from Chapter 12 is completely correct. Spectral leakage isn't a bug it introduces — it's an unavoidable consequence of ever capturing a *finite* slice of an infinite, continuous sound. Every FFT implementation on every piece of hardware in the world faces exactly this same tradeoff. The question is never "how do I eliminate it" — it's "how do I manage it."

## The Default Window You Didn't Know You Were Using

Every captured frame processed so far in this course has, without any explicit code to cause it, already been treated with a specific — if minimal — shape. A **rectangular window** is the implicit "do-nothing" window applied whenever no explicit windowing is used: every sample within the frame keeps its full, original value, with an abrupt cutoff to exactly zero immediately outside the frame's boundary. That abrupt cutoff is itself a significant source of the edge discontinuity from the previous section — the sudden drop from a sample's real value to zero right at the frame edge is, in effect, its own small jump.

Describing exactly how much leakage a given window produces requires two more precise, measurable terms. The **main lobe width** is the width, measured in bins, of the central peak that a single pure tone produces when passed through a given window — a narrower main lobe means better ability to tell two close-together frequencies apart. The **side lobe level** is the height of the smaller, secondary ripples that flank a window's main lobe in its frequency response, typically expressed in decibels below the main lobe's peak — a lower (more negative) side lobe level means less energy leaks out into bins far from the true frequency. The rectangular window has the narrowest possible main lobe of any common window, but also the *highest* (worst) side lobe level — a real tradeoff, and the exact one the rest of this chapter addresses directly.

## Shaping the Signal to Reduce Leakage

If an abrupt cutoff at the frame edges is the source of the discontinuity, the fix is straightforward in concept: taper the signal smoothly down toward zero at both edges *before* the cutoff happens, so there is no longer a sudden jump to cause leakage in the first place.

**Windowing functions** are a family of tapering functions applied to a captured frame before running the FFT, specifically to reduce spectral leakage by smoothly shaping the signal toward zero at both edges rather than cutting it off abruptly. Applying one to an actual captured frame is a simple, sample-by-sample operation: **window application** multiplies each sample in a captured frame by the corresponding value of a chosen window function at that same position, producing a tapered version of the frame that gets fed into the FFT in place of the original.

Three specific windowing functions are common enough, and different enough in their tradeoffs, to be worth knowing by name and shape.

- The **Hanning window** (often called the Hann window) uses a raised-cosine shape that tapers smoothly all the way to exactly zero at both edges, offering a solid, general-purpose balance between a moderate main lobe width and a meaningfully reduced side lobe level compared to the rectangular window.
- The **Hamming window** uses a similarly shaped raised cosine but does *not* taper all the way to zero at the edges — a small residual value remains — trading a slightly reintroduced edge discontinuity for an even lower side lobe level in the region immediately next to the main lobe.
- The **Blackman window** uses a more elaborate combination of multiple cosine terms, achieving substantially lower side lobe levels than either Hann or Hamming, at the cost of a noticeably wider main lobe than both.

#### Diagram: Window Function Comparison

<iframe src="../../sims/window-function-comparison/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Window Function Comparison</summary>
Type: microsim
**sim-id:** window-function-comparison<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Compare, distinguish

Learning objective: Let students compare the time-domain shape and resulting frequency-domain main lobe width and side lobe level of the rectangular, Hann, Hamming, and Blackman windows, distinguishing the specific tradeoff each one makes.

Canvas layout:
- Top (250px): the selected window's shape plotted in the time domain, over the frame duration
- Bottom (250px): the resulting frequency response (main lobe and side lobes) for a single test tone processed with that window, on a decibel scale

Visual elements:
- Time-domain window shape curve
- Frequency-domain response curve showing a central main lobe and several visible side lobes, with the side lobe level marked with a dashed horizontal reference line

Interactive controls:
- Radio buttons: "Rectangular" / "Hann" / "Hamming" / "Blackman"
- Readout: "Main lobe width: [value] bins | Highest side lobe: [value] dB below peak"

Behavior:
- Selecting a different window redraws both the time-domain shape and the frequency-domain response, with the readout updating to show that window's specific main lobe width and side lobe level numbers
- Switching between windows in sequence (Rectangular → Hann → Hamming → Blackman) visibly shows the main lobe widening while the side lobes shrink

Instructional Rationale: An Analyze-level comparison pattern is appropriate because the objective is distinguishing the specific tradeoff each window makes — presenting all four windows through the identical dual-view layout, switchable with one click, makes their relative differences directly comparable rather than requiring memorized numbers.

Implementation notes:
- Use p5.js; compute each window's coefficients using its standard formula, and compute its frequency response via a small internal FFT
- Responsive width; top and bottom panels stack vertically below 600px width
</details>

## The Tradeoff Every Window Makes

Comparing the four windows above reveals a pattern with no exception: whichever window suppresses side lobes more aggressively also widens the main lobe. This is not a coincidence or an engineering shortfall — it is a fundamental, unavoidable **window tradeoff**: the mathematical relationship guaranteeing that reducing a window's side lobe level (less leakage) always comes at the cost of increasing its main lobe width (worse ability to distinguish close frequencies), with no window able to minimize both simultaneously.

Tapering a signal toward zero at its edges has one more side effect worth correcting for directly: it necessarily reduces the frame's overall average amplitude compared to an untapered (rectangular-windowed) frame, since much of the signal near the edges is being multiplied by values less than 1. **Coherent gain** is a correction factor, specific to each window function, that accounts for this amplitude reduction — dividing a windowed spectrum's magnitude values by the window's coherent gain restores magnitude and decibel readings that are properly comparable to an unwindowed spectrum, rather than appearing artificially quieter simply because a window was applied.

The main lobe's widening has a direct, measurable consequence for exactly the kind of resolution question Chapter 9 first raised. The **frequency resolution limit** is the practical floor on how close two distinct frequencies can be and still be told apart as separate peaks — set by the FFT's bin width at best, but made *wider* (worse) by whichever window's main lobe width is currently in use; windowing can only ever raise this limit, never lower it below the bare bin-width floor.

Before the table below, it helps to see these tradeoffs placed side by side now that each window has been explained individually.

| Window | Main lobe width | Side lobe level | Best suited for |
|---|---|---|---|
| Rectangular | Narrowest | Worst (highest) | Distinguishing very close frequencies, when leakage is tolerable |
| Hann | Moderate | Good | General-purpose default |
| Hamming | Moderate | Very good near main lobe | Cases dominated by one strong, nearby interfering tone |
| Blackman | Widest | Best (lowest) overall | Isolating a weak tone next to a much stronger one |

!!! mascot-warning "There is no window that wins on every axis"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning">
    It's tempting to go looking for "the best window" as if one exists. It doesn't — the window tradeoff guarantees that every improvement in side lobe level costs something in main lobe width, and vice versa. Choosing a window means choosing which cost matters less for your specific application, not finding a free upgrade.

## Precomputing the Window

A window function's coefficient values depend only on the frame size \( N \) and the choice of window — never on the actual captured signal. That should sound familiar: it is exactly the same precomputation opportunity the twiddle factor table exploited in Chapter 11. A **window table** is a precomputed array holding a chosen window function's coefficient values for every sample position in a frame, calculated once and reused for every subsequent captured frame, avoiding the cost of recalculating cosine terms from scratch on every single frame.

```python
import math

def hann_window_table(N):
    return [0.5 - 0.5 * math.cos(2 * math.pi * n / (N - 1)) for n in range(N)]

def apply_window(samples, window_table):
    return [s * w for s, w in zip(samples, window_table)]   # Window application
```

## Finding the Peak

With a windowed spectrum in hand — leakage suppressed, side lobes lowered — the next task is locating exactly which bin represents the signal's most significant frequency content.

The most basic building block is a purely local comparison. A **local maximum** is any bin whose magnitude value exceeds both of its immediate neighboring bins' values — a "bump" in the spectrum, without yet judging whether that bump is significant or just noise. The bin index identified as representing a genuinely significant frequency component is called the **peak bin**, and the overall process of locating one is **peak detection**: scanning a magnitude spectrum to identify the bin (or bins) representing the strongest or most locally prominent frequency content present in a signal.

For a signal expected to contain a single dominant note — a whistle, a plucked string, a tuning fork — the simplest and most direct peak detector is worth naming precisely. **Argmax search** is a peak-detection algorithm that scans an entire array and returns the index of its single largest value, with no consideration of local bumps or secondary peaks — the simplest possible peak detector, and the one this course's monophonic pitch-detection labs use directly. The bin an argmax search locates corresponds to the signal's **dominant frequency**: the single frequency, identified through peak detection, carrying the most energy in a captured signal — for a cleanly whistled note, the dominant frequency is normally very close to that note's fundamental frequency from Chapter 4.

Argmax search alone has one weakness worth guarding against directly: with no signal present at all, background noise still has *some* largest value, and an unguarded argmax search will confidently report that noise as a detected pitch. **Threshold rejection** is a peak-detection safeguard that discards any candidate peak whose magnitude falls below a chosen minimum threshold, preventing the noise floor itself from ever being mistakenly reported as a genuine detected frequency.

!!! mascot-tip "Set your threshold above the noise floor you already measured"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    You already measured a real noise floor value back in Chapter 6. Reuse it directly: set threshold rejection's cutoff comfortably above that measured noise floor, rather than guessing at an arbitrary number. A threshold that's too low lets noise masquerade as pitch; one that's too high makes quiet, legitimate notes vanish.

## Landing Between Bins: Sub-Bin Accuracy

A peak bin identified by argmax search answers "which bin is loudest" — but a real-world tone's true frequency essentially never lands exactly on a bin center. The overall goal of pinning down that true frequency more precisely deserves its own name.

**Frequency estimation** is the goal of determining, as precisely as possible, the actual real-world frequency a detected peak represents — going beyond simply reporting a bin index toward reporting an accurate frequency value in Hertz. Precision finer than one whole bin width has a specific name: **sub-bin accuracy** is frequency-estimation precision better than one full bin width — the difference between "somewhere in this 31 Hz-wide bin" and "very close to this specific Hertz value," and exactly the precision a working tuner requires.

The standard technique for achieving sub-bin accuracy uses the peak bin's two immediate neighbors, not just the peak bin alone. **Parabolic interpolation** estimates a signal's true peak frequency by fitting a smooth parabola (a curved, U-shaped or inverted-U-shaped function) through the peak bin's magnitude value and its two adjacent bins' magnitude values, then calculating the exact location of that fitted parabola's own peak — a location that can fall anywhere within, not only exactly at, one of the three original bin positions.

#### Parabolic Interpolation Offset

\[ \delta = \frac{1}{2} \cdot \frac{\alpha - \gamma}{\alpha - 2\beta + \gamma} \]

where:

- \( \delta \) is the estimated fractional bin offset from the peak bin (typically between -0.5 and 0.5)
- \( \alpha \) is the magnitude of the bin just below the peak bin
- \( \beta \) is the magnitude of the peak bin itself
- \( \gamma \) is the magnitude of the bin just above the peak bin

#### Diagram: Parabolic Interpolation Peak Finder

<iframe src="../../sims/parabolic-interpolation-peak-finder/main.html" width="100%" height="437px" scrolling="no"></iframe>

<details markdown="1">
<summary>Parabolic Interpolation Peak Finder</summary>
Type: microsim
**sim-id:** parabolic-interpolation-peak-finder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students adjust three neighboring bin magnitude values and calculate the resulting parabolic interpolation offset, observing how the estimated true peak shifts smoothly within the space between bins.

Canvas layout:
- Top (300px): three bin bars (peak bin and its two neighbors) with a fitted parabola curve overlaid, and a marker showing the interpolated true peak position
- Bottom (150px): sliders for each bin's magnitude and a live formula readout

Visual elements:
- Three bar chart bars representing alpha, beta, gamma
- A smooth parabola curve fitted through the tops of the three bars
- A vertical marker at the parabola's true peak, positioned between bins according to the calculated offset

Interactive controls:
- Slider: alpha (magnitude of bin below peak), range 0-100, default 60
- Slider: beta (magnitude of peak bin), range 0-100, default 100
- Slider: gamma (magnitude of bin above peak), range 0-100, default 70

Behavior:
- Adjusting any slider immediately recalculates the offset using the parabolic interpolation formula and moves the marker to the new estimated true-peak position
- Setting alpha exactly equal to gamma (symmetric case) places the marker exactly at the peak bin's center, with an offset of zero

Instructional Rationale: An Apply-level calculator is appropriate because the objective is calculating a specific numeric offset from chosen input values — direct manipulation with an immediately visible geometric result (the marker's position) connects the formula to its geometric meaning.

Implementation notes:
- Use p5.js; implement the parabolic interpolation formula directly and redraw the fitted parabola using the three bar heights each frame
- Responsive width; bar/parabola panel and sliders stack vertically below 600px width
</details>

Applying that fractional offset to convert a peak bin back into an actual frequency reuses a formula already familiar from Chapter 9. **Bin to frequency** conversion computes the estimated frequency in Hertz from a (now possibly fractional, post-interpolation) bin position, using the same bin-exact-frequency formula from Chapter 9 — \( f = \frac{(k + \delta) \cdot f_s}{N} \) — simply substituting the interpolated bin position \( k + \delta \) for a plain integer bin index.

## From Frequency to Musical Note

A precise frequency estimate is the raw ingredient a tuner needs, but a musician does not think in Hertz — they think in notes. The remaining step converts one into the other.

**Pitch** is the perceived quality of a sound most directly corresponding to its dominant frequency — the everyday, musical sense of "pitch" from Chapter 4's harmonics discussion, now the direct target this chapter's whole pipeline has been building toward. **Pitch detection** is the complete process — peak detection, threshold rejection, and sub-bin frequency estimation via parabolic interpolation, used together — that determines a signal's perceived pitch as one precise, trustworthy frequency value.

Naming that frequency in musical terms uses a fixed, well-known mapping. **Musical note mapping** converts a detected frequency in Hertz into the name of the nearest standard musical note, using the equal-tempered tuning system's standard relationship between note number and frequency, anchored to the internationally standard reference of A4 = 440 Hz. Central to that mapping is the relationship between notes that share a name: an **octave** is a doubling (or halving) of frequency — A4 at 440 Hz and A5 at 880 Hz are exactly one octave apart, sharing the same note name (A) despite sounding at clearly different pitches. Together, converting a captured signal's dominant frequency all the way through to a labeled note and octave is a specific application of the broader field this section belongs to: **music analysis** is the application of spectral analysis and pitch detection specifically to identify musical content — notes, pitch, and octave — in captured audio.

#### Diagram: Frequency-to-Musical-Note Calculator

<iframe src="../../sims/frequency-to-musical-note-calculator/main.html" width="100%" height="387px" scrolling="no"></iframe>

<details markdown="1">
<summary>Frequency-to-Musical-Note Calculator</summary>
Type: microsim
**sim-id:** frequency-to-musical-note-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students adjust a frequency value and calculate the nearest musical note name and octave, demonstrating the mapping between Hertz and standard note naming anchored at A4 = 440 Hz.

Canvas layout:
- Top (200px): a piano-keyboard-style strip spanning several octaves, with the currently matched key highlighted
- Bottom (150px): a frequency slider/input and a live readout

Visual elements:
- A simplified piano keyboard strip (white and black keys) spanning roughly 3 octaves
- The nearest matching key highlighted in a distinct color as the frequency changes
- Readout: "Frequency: [value] Hz → Nearest note: [note name][octave] ([cents] cents off exact)"

Interactive controls:
- Slider or numeric input: Frequency, range 80-2000 Hz, default 440 Hz

Behavior:
- Moving the frequency slider recalculates and highlights the nearest note on the keyboard strip live, along with the exact note name, octave number, and how many cents sharp or flat the input frequency is from that note's exact standard value

Instructional Rationale: An Apply-level calculator is appropriate because the objective is calculating a specific note and octave from a chosen frequency — a visual keyboard mapping makes the abstract Hertz-to-note formula concrete and immediately checkable against familiar musical intuition.

Implementation notes:
- Use p5.js; compute note number as round(12 * log2(frequency / 440) + 49), matching standard piano key numbering with A4 = key 49
- Responsive width; keyboard strip and controls scale proportionally, remaining usable down to mobile widths
</details>

!!! mascot-encourage "This is the exact pipeline a real tuner app uses"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Windowing, peak detection, parabolic interpolation, note mapping — that's not a simplified teaching version of pitch detection. That is, structurally, the same pipeline a commercial guitar tuner app runs on your phone. You're not approximating a real tool anymore; you're building one.

## Padding for a Smoother Estimate

One more technique is worth knowing, precisely because it is so easy to misunderstand. **Zero padding** appends additional zero-valued samples onto the end of a captured frame before running the FFT, increasing the FFT's effective size \( N \) — and therefore the number of output bins — without adding any new real information about the signal. The resulting, longer array fed into the FFT is the **zero padding input**: the original captured samples followed by the appended zero values, used in place of the shorter, unpadded frame as the actual input to the transform.

Zero padding makes a spectrum plot look smoother, with more, closer-spaced bins to interpolate between — a genuinely useful visual and numerical aid for parabolic interpolation. But it is worth being precise about what it does *not* do: zero padding does not improve the frequency resolution limit established earlier in this chapter. That limit is set by how much real, original signal duration was actually captured — padding with zeros adds more points to look at, not more real information to distinguish with.

## Chapter Summary

You now understand exactly why a peak blurs, how to fix it with the right window for the job, and how to pin down a detected frequency precisely enough to name the actual musical note being played.

Key ideas to carry forward:

- An **edge discontinuity**, caused by a signal not completing a whole cycle within a frame, produces **spectral leakage** and its visible **spectral leakage effect**.
- The implicit **rectangular window** has the narrowest **main lobe width** but the worst **side lobe level**; **windowing functions**, applied through **window application**, trade this differently — the **Hanning window**, **Hamming window**, and **Blackman window** each make a different **window tradeoff**, correctable for amplitude loss via **coherent gain**, and bounded by the **frequency resolution limit**. A **window table** precomputes the coefficients.
- **Peak detection** starts from a **local maximum**, locating a **peak bin** via **argmax search** to find the **dominant frequency**, guarded by **threshold rejection**.
- **Frequency estimation** achieves **sub-bin accuracy** through **parabolic interpolation**, then **bin to frequency** conversion produces a precise Hertz value.
- **Pitch** and **pitch detection** feed **musical note mapping**, using the **octave** relationship, for **music analysis**.
- **Zero padding** (producing a **zero padding input**) smooths a spectrum's appearance but never improves true frequency resolution.

??? note "Quick check: a peak bin has neighbors with magnitudes 40 (below) and 90 (above), and the peak bin itself is 100. Which direction does parabolic interpolation shift the estimated true peak, and why? — Click to expand"
    Toward the higher-magnitude neighbor — in this case, upward (toward the bin above). Since gamma (90) is larger than alpha (40), the fitted parabola is not symmetric around the peak bin; it leans toward whichever neighbor has more energy, and the interpolation formula shifts the estimated true peak in that same direction.

!!! mascot-celebration "Sub-bin accuracy — you can now build a real tuner"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Windowing to fight leakage, parabolic interpolation to land between bins, note mapping to name what you found — that's precision far beyond "which bin is loudest." Next chapter assembles capture, FFT, and this exact pipeline into one continuously running, real-time spectrum analyzer. You're right on frequency.
