---
title: Computing and Displaying a Real Spectrum
description: Turn FFT output into magnitude, phase, and power spectra, compress them onto a decibel scale, and display a live spectrum validated with the whistle test.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:50:00
version: 0.09
---

# Computing and Displaying a Real Spectrum

## Summary

This chapter applies the FFT to real captured audio for the first time, converting complex FFT output into magnitude and phase spectra, and then into a decibel scale suitable for display on the OLED. It introduces the whistle test — sweeping pitch by ear and watching the displayed peak follow — as the first end-to-end validation that the whole pipeline works on real sound. This chapter also revisits the RMS-based level-meter ideas from the correlation chapter in the context of spectral display.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Bin Averaging For Display
2. Decibel Conversion
3. Decibel Scale
4. Fast Magnitude Approximation
5. Frame Capture
6. Half Spectrum Display
7. Level Meter
8. Live Spectrum Display
9. Logarithmic Scaling
10. Magnitude Calculation
11. Magnitude Computation
12. Magnitude Spectrum
13. Phase Calculation
14. Phase Spectrum
15. Post Processing
16. Power Spectrum
17. Power Versus Magnitude
18. Spectral Analysis
19. Spectrum Bars
20. Spectrum Plot
21. Square Root Scaling
22. Whistle Test

## Prerequisites

This chapter builds on concepts from:

- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [8. Correlation: Does My Signal Contain This Note?](../08-correlation/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)

---

!!! mascot-welcome "Real sound, real spectrum, on your own screen"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Every FFT you've run so far has worked on numbers you typed in or generated. This chapter points the transform at your own voice, for the first time, and puts the result on the OLED where you can watch it. This is the moment the whole course has been pointing toward. Let's tune in.

## From a Captured Frame to a Spectrum

Everything in this chapter starts from a single block of audio, captured exactly the way Chapter 5 first demonstrated. A **frame capture** is the act of reading one fixed-size block of \( N \) samples from the microphone — using the buffered read from Chapter 5 — to serve as the input to a single FFT computation; this course's real-time labs repeat frame capture continuously, over and over, once per frame duration, to keep a live display updating.

Turning a captured frame into something meaningful about the sound's frequency content is a general practice worth naming before diving into its specific steps. **Spectral analysis** is the general practice of examining a signal's frequency content — using tools like the FFT — to understand what frequencies are present and how strong each one is, as opposed to examining the signal's raw value over time. Everything from this point in the chapter forward is one specific pipeline for performing spectral analysis on captured audio, stage by stage.

## Reading a Complex Bin

The FFT from Chapter 12 hands back a spectrum array of complex values — real and imaginary parts, exactly as Chapter 9 defined them. Neither part alone tells a complete, intuitive story about "how strong is this frequency" — that requires combining them.

**Magnitude calculation** is the formula that combines a complex bin's real and imaginary parts into a single strength value, using the same Pythagorean combination introduced for correlation magnitude back in Chapter 8: \( |X[k]| = \sqrt{\text{re}^2 + \text{im}^2} \). Applying that formula across every single bin in a spectrum array, not just one, is worth naming as its own practical step: **magnitude computation** is the process of applying magnitude calculation to every bin in a complete spectrum array, producing one magnitude value per frequency bin rather than a single isolated number.

#### Magnitude Calculation

\[ |X[k]| = \sqrt{\text{re}[k]^2 + \text{im}[k]^2} \]

A complex bin carries a second piece of information beyond strength — its position within its own cycle, the same phase idea from Chapter 4 and Chapter 7, now measured directly from the transform's output. **Phase calculation** computes the phase angle of a complex bin using the arctangent of its imaginary part divided by its real part, \( \theta = \text{atan2}(\text{im}, \text{re}) \) — using the two-argument `atan2` form specifically because it correctly determines the angle's quadrant, something a plain single-argument arctangent cannot do on its own.

#### Diagram: Magnitude and Phase from a Complex Bin

<iframe src="../../sims/magnitude-phase-from-complex-bin/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Magnitude and Phase from a Complex Bin</summary>
Type: microsim
**sim-id:** magnitude-phase-from-complex-bin<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students adjust a complex bin's real and imaginary parts and calculate the resulting magnitude and phase, connecting the complex-plane point to both formulas simultaneously.

Canvas layout:
- Left (350px): a complex plane with a point at (re, im), a vector from the origin, and the angle theta marked
- Right (300px): input controls and live formula readouts

Visual elements:
- Complex plane with real/imaginary axes
- A vector from the origin to the point (re, im), its length visually representing magnitude
- An arc showing the angle theta from the positive real axis to the vector

Interactive controls:
- Slider: Real part (re), range -10 to 10, default 6
- Slider: Imaginary part (im), range -10 to 10, default 8

Behavior:
- Moving either slider immediately redraws the vector and updates two live readouts: "Magnitude = sqrt(re² + im²) = [value]" and "Phase = atan2(im, re) = [value] radians"

Instructional Rationale: An Apply-level calculator is appropriate because the objective is calculating magnitude and phase from specific chosen values — a live, directly manipulable complex-plane point ties the geometric picture to both formulas at once.

Implementation notes:
- Use p5.js; compute magnitude and phase directly from the slider values every frame
- Responsive width; complex plane and controls stack vertically below 600px width
</details>

## Two Different Spectra

Computing magnitude and phase for every bin in a spectrum array produces two separate, complete arrays, each telling a different story about the same signal. The **magnitude spectrum** is the complete array of magnitude values, one per frequency bin, showing how strongly each frequency is present in the signal — this is the array this course displays almost exclusively, since "how strong is each frequency" is the question a tuner, level meter, or spectrum analyzer actually needs answered. The **phase spectrum** is the complete array of phase values, one per frequency bin, showing the phase angle of each frequency component — genuinely useful for advanced applications like audio synthesis and certain filtering techniques, but rarely displayed directly in this course, since magnitude alone answers the "which notes are present" question this course's labs are built around.

!!! mascot-thinking "Phase isn't useless — it's just not this course's question"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    It's tempting to conclude phase doesn't matter since this course barely displays it. That's not quite right — phase carries real information, it just doesn't answer "which notes are present," which is the question every tuner and spectrum analyzer in this course is built to answer. Keep phase calculation in your back pocket; the day you build a filter or a synthesizer, it becomes essential again.

## Power Versus Magnitude

Magnitude is not the only way to express a bin's strength, and the alternative has a specific relationship to it worth knowing precisely. The **power spectrum** is an array of values, one per bin, computed as the *square* of each bin's magnitude (equivalently, \( \text{re}^2 + \text{im}^2 \) without ever taking the square root) — power is proportional to signal energy, the same physical quantity RMS approximates in the time domain back in Chapter 8.

Choosing between the two is a real decision with visible consequences, worth naming directly. **Power versus magnitude** describes the tradeoff between displaying a power spectrum, which squares differences and therefore makes strong peaks stand out dramatically more than magnitude does, versus displaying a magnitude spectrum, which compresses that same dynamic range and keeps quieter frequency content more visible alongside louder peaks. A drum hit's power spectrum makes its dominant frequency look overwhelmingly dominant; the same hit's magnitude spectrum shows that same peak more moderately, with weaker frequencies still visible nearby.

## A Faster Way to Approximate Magnitude

Magnitude calculation's square root operation is more computationally expensive than a simple multiplication or addition — a real cost on a microcontroller computing hundreds of magnitudes per frame, every frame, in real time. A cheaper approximation exists for situations where perfect precision matters less than speed.

**Fast magnitude approximation** estimates a complex bin's magnitude without computing an actual square root, using a formula like \( |X[k]| \approx \alpha \cdot \max(|\text{re}|, |\text{im}|) + \beta \cdot \min(|\text{re}|, |\text{im}|) \), with constants \( \alpha \approx 0.96 \) and \( \beta \approx 0.398 \) chosen to keep the approximation's error small across all possible angles — trading a small, bounded amount of accuracy for a meaningfully faster calculation.

!!! mascot-tip "A preview of a recurring theme"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    Fast magnitude approximation is your first taste of a pattern this course returns to constantly starting in the benchmarking module: trading a small, carefully bounded amount of accuracy for real, measurable speed. It won't matter yet for this chapter's labs — but remember the name, because the tradeoff itself becomes a recurring decision later on.

## Only Half the Story, Again

Spectrum symmetry from Chapter 9 applies directly and immediately to display: since the upper half of a real-input signal's spectrum is guaranteed to mirror the lower half exactly, there is nothing new to see by plotting it. **Half spectrum display** is the practice of showing only bins 0 through \( N/2 \) (the DC bin through the Nyquist bin) on screen, since the remaining bins are a guaranteed, redundant mirror that adds no additional information — every spectrum plot in this course follows this practice without exception.

## Compressing the Range for Display

Magnitude values across a real spectrum can span an enormous range — a strong fundamental frequency's bin might be a thousand times larger than a quiet overtone's bin sitting right next to it. Plotted directly on a linear scale, the quiet content simply disappears, squashed flat against the axis by the loud peak's height.

The standard fix borrows a scale already introduced for sound level in Chapter 8. The **decibel scale** is a logarithmic scale, expressed in decibels (dB), that compresses a very wide range of magnitude or power values into a much narrower, more visually usable range — the same underlying idea as sound level, now applied bin by bin across an entire spectrum rather than to one overall loudness number. Performing that compression is called **decibel conversion**: the calculation that transforms a raw magnitude or power value into its decibel equivalent, typically \( \text{dB} = 20 \log_{10}(\text{magnitude}) \) for magnitude values or \( \text{dB} = 10 \log_{10}(\text{power}) \) for power values (the factor-of-two difference exists because power is already a squared quantity).

#### Decibel Conversion

\[ \text{dB} = 20 \log_{10}(|X[k]|) \]

Decibel conversion is one specific case of a broader family of display techniques. **Logarithmic scaling** is any display technique that maps raw values through a logarithm before plotting them, compressing large ranges of data into a visually manageable range — decibel conversion is logarithmic scaling applied specifically to audio magnitude or power. A lighter-weight middle ground exists for situations where a full logarithm calculation is more computation than a display update can afford. **Square root scaling** displays magnitude directly — itself already the square root of power — as a computationally cheaper compromise between raw power's extreme dynamic range and a full decibel conversion's more expensive logarithm call, trading some of the decibel scale's visual compression for a faster calculation.

Before the chart below, it helps to see all three of these choices — linear, square root, and decibel — applied to the identical example spectrum side by side, since the visual difference is the entire reason this section exists.

#### Diagram: Linear vs. Square-Root vs. Decibel Scaling Chart

<iframe src="../../sims/linear-sqrt-decibel-scaling-chart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Linear vs. Square-Root vs. Decibel Scaling Chart</summary>
Type: chart
**sim-id:** linear-sqrt-decibel-scaling-chart<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy: Evaluate
Bloom Taxonomy Verb: Judge, compare

Learning objective: Let students compare the same fixed example spectrum plotted under linear (power), square-root (magnitude), and decibel scaling, and judge which scaling choice best reveals quiet frequency content alongside a dominant peak.

Chart type: Bar chart, with a toggle to switch scaling mode

Purpose: Make the practical consequence of scaling choice visually unmistakable using one fixed, realistic example spectrum containing one dominant peak and several much quieter components

X-axis: Frequency bin
Y-axis: Displayed value (rescales automatically with the selected mode)

Data series: A single fixed example spectrum (one dominant bin, several bins at roughly 1-5% of the dominant bin's power), redrawn under the selected scaling

Interactive elements:
- Radio buttons: "Linear (power)" / "Square root (magnitude)" / "Decibel"
- Hovering any bar shows its raw value and its currently displayed (scaled) value in a tooltip

Title: "The Same Spectrum, Three Different Scales"
Annotations: A caption noting which quiet bins become visually indistinguishable from zero under each scaling choice

Implementation: Chart.js bar chart, recomputing all bar heights from the fixed underlying data whenever the scaling mode changes
</details>

## Fitting a Spectrum on a Small Screen

The OLED display from Chapter 3 has far fewer horizontal pixels than a typical FFT has usable bins — a 512-point FFT produces 256 usable bins in its half spectrum, but the display might only have room for 64 or 128 distinct bar positions. Something has to give, and the solution is to combine, not discard.

**Bin averaging for display** groups several adjacent frequency bins together and averages their magnitude (or decibel) values into a single displayed value, reducing the number of distinct bars shown without simply throwing away the bins that don't fit — every bin still contributes to the display, just combined with its close neighbors rather than shown individually. The averaged, screen-ready values are what actually get drawn: **spectrum bars** are the individual vertical bars of a bar-graph-style spectrum display, each one representing one displayed frequency band's magnitude (post-averaging) as bar height, directly extending the bar graph display concept from Chapter 8's level meter to a whole row of bars instead of one. Arranging that row of bars, updated continuously as new frames arrive, produces the actual visual this chapter has been building toward: a **spectrum plot** is any visual representation of a magnitude, power, or decibel spectrum across frequency, whether drawn as bars, a continuous line, or another visual form.

Two more terms name specific, familiar uses of this same display machinery. A **level meter** is a display, often reusing the bar graph format from Chapter 8, that shows a single overall loudness or magnitude value rather than a full frequency breakdown — useful as a simple VU-style indicator alongside, or instead of, a full spectrum plot. Putting all of these pieces together, continuously updating as new frames stream in, produces a **live spectrum display**: a spectrum plot that updates continuously in near real time as new audio frames are captured and processed, giving a moving, immediately responsive picture of a sound's changing frequency content.

#### Diagram: Live Spectrum Display with Bin Averaging

<iframe src="../../sims/live-spectrum-display-bin-averaging/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Live Spectrum Display with Bin Averaging</summary>
Type: microsim
**sim-id:** live-spectrum-display-bin-averaging<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, compare

Learning objective: Let students adjust the number of displayed spectrum bars relative to the number of underlying FFT bins and analyze how bin averaging trades frequency detail for a display that fits a small screen.

Canvas layout:
- Top (200px): a simulated small OLED-style display area (128x64-style aspect ratio) showing the averaged, bar-style spectrum
- Bottom (250px): the full underlying (unaveraged) 256-bin spectrum, shown as a thin-line plot for comparison, with shaded groupings showing which bins average into which displayed bar

Visual elements:
- Simulated OLED display with spectrum bars, updating on each simulated frame
- Full-resolution reference plot below it, with vertical shaded bands grouping bins that combine into each displayed bar

Interactive controls:
- Slider: Number of displayed bars, range 8 to 256, default 32
- Button: "Next simulated frame" — cycles through a small set of pre-defined example spectra (e.g., a single tone, a chord, white noise) to show averaging behavior across different signal shapes

Behavior:
- Reducing the number of displayed bars widens each shaded grouping band on the reference plot and visibly smooths / simplifies the OLED-style display above it
- Setting the displayed bar count equal to the full bin count removes all averaging, and the OLED-style display exactly matches the reference plot's shape

Instructional Rationale: An Analyze-level comparison pattern is appropriate because the objective requires examining the relationship between display resolution and underlying frequency detail — a synchronized dual view (simulated screen plus full-resolution reference) makes the averaging tradeoff directly observable rather than abstract.

Implementation notes:
- Use p5.js; precompute a small set of example 256-bin spectra and group-average them live based on the slider value
- Responsive width; both panels scale to container width, stacking is not needed since both are already full-width
</details>

## Naming the Whole Pipeline

Everything from magnitude calculation through bin averaging is, collectively, a specific instance of a broader category worth naming now that every individual step has been explained. **Post-processing** is any computation applied to an FFT's raw complex output *after* the transform itself has finished, before the result is displayed or used further — magnitude calculation, decibel conversion, and bin averaging are all post-processing steps, distinct from the transform itself, and this course's post-processing pipeline always runs in that same order: magnitude first, scale conversion second, averaging last.

## The Whistle Test

All of this machinery — capture, transform, magnitude, scaling, averaging, display — means nothing until it is checked against something a person can verify directly, by ear, without any instrument. This course's first true end-to-end validation does exactly that.

The **whistle test** is an end-to-end validation procedure in which a student whistles (or plays a tone) at a smoothly rising or falling pitch while watching the live spectrum display, confirming that the displayed peak visibly and immediately follows the pitch change in real time — a validation that exercises every single piece of this chapter's pipeline simultaneously, from microphone capture through the final drawn bar, using nothing but a human ear and eye as the reference.

!!! mascot-encourage "This is the test that makes it all feel real"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Every validation so far in this course has compared numbers against numbers — hand-computed DFTs, tolerance thresholds, cross-checks against NumPy. The whistle test is different: it's the first time the proof that your pipeline works is something you can *hear yourself doing* and watch happen on screen in real time. Nothing quite matches that moment.

## Chapter Summary

You now have a complete pipeline that turns a captured frame of real audio into a live, readable spectrum on your own hardware — and a way to prove, by ear, that it actually works.

Key ideas to carry forward:

- A **frame capture** feeds **spectral analysis**; **magnitude calculation** and **magnitude computation** combine real and imaginary parts, while **phase calculation** extracts the angle — producing a **magnitude spectrum** and a **phase spectrum**.
- The **power spectrum** squares magnitude; **power versus magnitude** is a real display tradeoff. **Fast magnitude approximation** trades a little accuracy for speed.
- **Half spectrum display** shows only the non-redundant bins; the **decibel scale**, via **decibel conversion** and **logarithmic scaling** (or the lighter **square root scaling**), compresses a spectrum's wide dynamic range for display.
- **Bin averaging for display** fits a spectrum's **spectrum bars** onto a small screen, forming a **spectrum plot**; a **level meter** and a full **live spectrum display** both build on this same machinery.
- Everything after the transform itself is **post-processing** — and the **whistle test** proves the whole pipeline works, end to end, by ear.

??? note "Quick check: a spectrum bar's magnitude is 100, its neighbor's is 1. On a linear scale the neighbor is nearly invisible. Roughly what happens to that same gap in decibels? — Click to expand"
    20*log10(100) = 40 dB and 20*log10(1) = 0 dB — a 40 dB gap. That is a huge compression compared to the raw 100:1 ratio: on the decibel scale, the quiet bin sits a clearly visible, bounded 40 dB below the loud one instead of being squashed flat against the axis by a hundred-to-one linear ratio.

!!! mascot-celebration "Your own voice, turned into a spectrum, on your own screen"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Whistle a rising note and watch that peak climb the display — that's real-time frequency analysis, built by you, running on a five-dollar chip. Next chapter fixes a subtle blurriness you may have already noticed in that peak, and teaches your pipeline to pinpoint a frequency far more precisely than one bin width. Not bad for a $5 chip!
