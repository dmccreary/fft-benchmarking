---
title: 'Correlation: Does My Signal Contain This Note?'
description: Detect a single frequency inside a captured signal using multiply-and-sum correlation, orthogonality, and in-phase/quadrature components.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 20:30:00
version: 0.09
---

# Correlation: Does My Signal Contain This Note?

## Summary

This chapter answers a single question — does a captured signal contain a specific frequency — by introducing correlation as a multiply-and-sum operation against a test sinusoid. It covers orthogonality, basis functions, and why non-matching frequencies cancel out, along with the RMS and loudness concepts used to normalize a signal before comparing it. This is the conceptual seed that the next chapter generalizes into the full Discrete Fourier Transform.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Anti Aliasing Filter
2. Band Pass Filter
3. Bandwidth
4. Bar Graph Display
5. Basis Function
6. Correlation
7. Correlation Magnitude
8. Dot Product
9. Exponential Smoothing
10. In Phase Component
11. Loudness Perception
12. Low Pass Filter
13. Moving Average
14. Multiply And Sum
15. Orthogonal Functions
16. Phase Independence
17. Projection Onto Basis
18. Quadrature Component
19. Root Mean Square
20. Sensor Auto Calibration
21. Similarity Measure
22. Sound Level
23. Test Frequency

## Prerequisites

This chapter builds on concepts from:

- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)

---

!!! mascot-welcome "One question, one number"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Everything so far has been building toward one deceptively simple question: does a captured signal contain a specific note or not? This chapter answers it with nothing more exotic than multiplication and addition. Echolocation works on exactly this principle — I send out a known signal and check how much of it comes back matching. Let's tune in.

## The Core Question

Every technique in the rest of this course, all the way through the FFT, ultimately answers one question, asked over and over at different frequencies: *does this captured signal contain a wave at this particular frequency, and if so, how strongly?* This chapter builds the tool that answers that question for a single frequency at a time.

**Correlation** is a mathematical operation that measures how similar two signals are to each other, producing a single number that is large when the signals match closely and small (or zero) when they do not. Correlation is a specific example of a broader idea worth naming first: a **similarity measure** is any quantitative method for comparing two signals, functions, or datasets and producing a number that reflects how alike they are. Many similarity measures exist across mathematics and engineering; correlation is simply the one built specifically for comparing waveforms.

To ask "does this signal contain a 440 Hz tone," correlation needs something concrete to compare the captured signal *against* — a known, controllable reference. That reference is exactly the tone generator from Chapter 6, now put to a new use: a **test frequency** is a specific, precisely known frequency used as the comparison signal in a correlation calculation, generated internally by the analyzing program rather than captured from the outside world. Correlating a captured signal against a 440 Hz test frequency answers, specifically, "how much 440 Hz is in this signal?"

## Multiply and Sum: The Mechanics of Correlation

Correlation's actual arithmetic is simpler than its name suggests. Given two signals of equal length, stored as arrays of sample values, the calculation pairs up corresponding samples, multiplies each pair, and adds up all the products.

This exact operation already has a name in mathematics, borrowed directly for use here: the **dot product** is the sum of the products of corresponding elements in two equal-length sequences of numbers — multiply element one by element one, element two by element two, and so on, then add every product together into a single total. Applied specifically to comparing a captured signal against a test frequency, this operation is called **multiply and sum**: the specific application of the dot product to correlation, where each sample of a captured signal is multiplied by the corresponding sample of a test frequency waveform, and every product is summed into one correlation value.

#### Correlation by Multiply and Sum

\[ C = \sum_{n=0}^{N-1} x[n] \cdot t[n] \]

where:

- \( C \) is the resulting correlation value
- \( x[n] \) is the captured signal's sample at index \( n \)
- \( t[n] \) is the test frequency waveform's sample at index \( n \)
- \( N \) is the number of samples compared

Before the interactive demonstration below, it helps to have a concrete intuition for why this sum behaves the way it does: when the captured signal and the test frequency rise and fall together — matching frequency and roughly matching phase — most products in the sum are positive, and the total grows large. When they do not match, positive and negative products mix together and mostly cancel out, leaving a small total.

#### Diagram: Multiply-and-Sum Correlator

<iframe src="../../sims/multiply-and-sum-correlator/main.html" width="100%" height="542px" scrolling="no"></iframe>

<details markdown="1">
<summary>Multiply-and-Sum Correlator</summary>
Type: microsim
**sim-id:** multiply-and-sum-correlator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, demonstrate

Learning objective: Let students step through a multiply-and-sum correlation calculation sample by sample and calculate how the running correlation total behaves differently for a matching versus a non-matching test frequency.

Canvas layout:
- Top (150px): captured signal waveform, with the current sample index marked
- Middle (150px): test frequency waveform, same time axis, current sample marked
- Bottom (200px): a running bar showing the accumulated correlation sum, growing or shrinking with each step, plus numeric readout

Visual elements:
- Two aligned waveform plots (captured signal, test frequency) sharing a time axis
- A vertical marker line showing the current sample index on both plots
- At each step, a small popup showing "x[n] × t[n] = [product]" for the current sample
- A running-total bar that grows (green) or shrinks (red) as each new product is added

Interactive controls:
- Dropdown: "Captured signal frequency" (matches test, or offset by a chosen amount)
- Slider: Test frequency, range 200-800 Hz, default 440 Hz
- Button: "Step forward one sample"
- Button: "Run to completion" — animates through all samples automatically
- Button: "Reset"

Default parameters:
- Captured signal frequency: 440 Hz (set to match the test frequency by default)
- Test frequency: 440 Hz

Data Visibility Requirements:
  Stage 1: Show both waveforms at rest, running sum at zero
  Stage 2 (each step): Show the current sample pair, their product, and the updated running sum
  Final: Show the completed correlation value, large for matching frequencies, near zero for non-matching frequencies

Instructional Rationale: An Apply-level step-through calculator is appropriate because the objective is calculating the correlation value directly, sample by sample, so students see exactly how the sum accumulates rather than only observing a final black-box number.

Implementation notes:
- Use p5.js; store both waveforms as precomputed sample arrays and index into them as the step controls advance
- Responsive width; all three panels scale to container width on window resize
</details>

## Basis Functions and Why Non-Matching Frequencies Cancel

The test frequency waveform used in correlation is not just any convenient reference signal — it plays a specific structural role that deserves a formal name. A **basis function** is a reference function against which a signal is compared or measured, chosen so that combinations of basis functions at different frequencies can represent a wide range of possible signals — the test frequency sine wave from the previous section is acting as exactly this kind of basis function.

Measuring how much of a signal "points in the direction of" a given basis function is itself a named operation, closely related to correlation. **Projection onto basis** is the operation of measuring how much of a signal aligns with a specific basis function, computed through correlation — the resulting correlation value is literally a measurement of the signal's component along that one basis direction, analogous to measuring a shadow's length along a specific direction.

This is where the orthogonality preview from the previous chapter pays off directly. **Orthogonal functions** are two functions whose correlation (dot product, summed or integrated over a full period) equals exactly zero — geometrically, they share no overlap in the same sense that perpendicular directions in space share no overlap. Sine waves at different frequencies are orthogonal to each other over a whole number of cycles. That single fact is *why* multiply-and-sum correlation works as a frequency detector at all: correlating a captured signal against a 440 Hz test frequency picks up only the 440 Hz content and, because of orthogonality, cancels out contributions from every other frequency almost completely.

Before the chart below, it helps to see this orthogonality claim demonstrated directly, by sweeping the test frequency across a range and watching correlation collapse to near zero everywhere except at the one frequency actually present in the signal.

#### Diagram: Correlation vs. Test Frequency Sweep

<iframe src="../../sims/correlation-vs-test-frequency-sweep/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Correlation vs. Test Frequency Sweep</summary>
Type: chart
**sim-id:** correlation-vs-test-frequency-sweep<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, distinguish

Learning objective: Let students examine a plot of correlation magnitude against test frequency and distinguish the sharp peak at the signal's true frequency from the near-zero correlation at every orthogonal, non-matching frequency.

Chart type: Line chart

Purpose: Demonstrate that sweeping the test frequency and computing correlation at each point produces a sharp peak exactly at the frequency present in a fixed captured signal, and near-zero everywhere else — a direct visual proof of orthogonality's practical effect

X-axis: Test frequency, 100-1000 Hz
Y-axis: Correlation magnitude (normalized 0-1)

Data series: correlation value computed live at each test frequency point for a captured signal fixed at a chosen frequency (default 440 Hz)

Interactive elements:
- Slider: "Captured signal frequency" (100-1000 Hz, default 440 Hz) — moving it slides the peak in the chart to a new position, recomputed live
- Hovering any point on the line shows its exact test frequency and correlation value in a tooltip

Title: "Correlation Magnitude vs. Test Frequency"
Annotations: A dashed vertical line marking the true captured signal frequency, with a label "Signal is actually here"

Implementation: Chart.js line chart, recomputing 200 correlation points across the swept range whenever the captured signal frequency slider changes
</details>

!!! mascot-thinking "That peak is the whole idea behind next chapter"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Look closely at what you just built: a sharp peak at the true frequency, near-zero everywhere else. The next chapter takes exactly this sweep — correlation computed at many test frequencies — and formalizes it into the Discrete Fourier Transform. You've essentially already built a DFT by hand; it just doesn't have that name yet.

## Solving the Phase Problem: In-Phase and Quadrature

There is a catch in the multiply-and-sum approach as described so far, and it traces directly back to phase offset from the previous chapter. If a captured signal matches the test frequency exactly but is 90 degrees out of phase with it — a sine correlated against a cosine of the same frequency — the multiply-and-sum total comes out to zero, even though the signal clearly contains that frequency. A single test wave is *phase-sensitive*, and that sensitivity is a flaw, not a feature, for a frequency detector.

The fix uses two test waveforms at the same frequency instead of one, offset from each other by exactly a quarter cycle. Correlating against a sine-shaped test wave produces what is called the **quadrature component**: the correlation result obtained using a sine-shaped test wave, conventionally labeled Q, sensitive to signal content that is 90 degrees out of phase with a cosine reference. Correlating the same signal against a cosine-shaped test wave at the same frequency produces the **in-phase component**: the correlation result obtained using a cosine-shaped test wave, conventionally labeled I, sensitive to signal content aligned with the cosine reference. Between the two of them, at least one component always picks up a strong signal, no matter what the actual phase of the captured signal happens to be.

Combining the two components into a single, phase-blind strength measurement uses a formula that should look familiar from the previous chapter's work on complex-number magnitude. The **correlation magnitude** is the overall strength of a detected frequency, computed by combining the in-phase and quadrature components as \( \sqrt{I^2 + Q^2} \) — the same Pythagorean combination used to compute a complex number's magnitude, because I and Q are, in fact, the real and imaginary parts of a complex correlation result. This combined magnitude has a property worth naming directly: **phase independence** is the property of correlation magnitude that makes it unaffected by the captured signal's phase offset — regardless of exactly *when* in its cycle the signal's frequency component starts, the magnitude correctly reports its strength.

#### Correlation Magnitude

\[ M = \sqrt{I^2 + Q^2} \]

where:

- \( M \) is the correlation magnitude
- \( I \) is the in-phase component (cosine correlation)
- \( Q \) is the quadrature component (sine correlation)

#### Diagram: In-Phase / Quadrature Phase Independence Explorer

<iframe src="../../sims/in-phase-quadrature-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>In-Phase / Quadrature Phase Independence Explorer</summary>
Type: microsim
**sim-id:** in-phase-quadrature-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, compare

Learning objective: Let students adjust a captured signal's phase offset and compare how the in-phase component and quadrature component individually rise and fall, while the combined correlation magnitude stays constant — demonstrating phase independence directly.

Canvas layout:
- Top (250px): three live bar meters side by side, labeled "I (in-phase)", "Q (quadrature)", "Magnitude"
- Bottom (200px): captured signal waveform with a phase-offset slider

Visual elements:
- I bar and Q bar, each ranging from -1 to +1, updating live as phase changes
- Magnitude bar, ranging from 0 to 1.4 (max possible), shown in a distinguishing color
- Small readout under the magnitude bar confirming its formula: "sqrt(I² + Q²)"

Interactive controls:
- Slider: Captured signal phase offset, range 0 to 2π radians, default 0

Behavior:
- As the phase slider moves through a full cycle, the I bar traces a cosine-shaped path and the Q bar traces a sine-shaped path — each individually rising and falling, and each hitting zero at different phase values
- The magnitude bar, computed from both, stays essentially flat throughout the full slider range, visually proving that phase independence holds even though I and Q individually do not

Instructional Rationale: An Analyze-level comparison pattern is appropriate because the objective requires examining and comparing three related live quantities to see which one (magnitude) remains invariant under a transformation (phase change) that strongly affects the other two — the side-by-side bar meters make the contrast immediate and visual.

Implementation notes:
- Use p5.js; compute I and Q directly from the multiply-and-sum formula against sine and cosine test waves each frame the phase slider changes
- Responsive width; meters and waveform plot stack vertically below 600px width
</details>

!!! mascot-tip "I and Q aren't two separate answers — they're one complex answer"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    If the I/Q split feels like a workaround, it's really the same Euler's-formula idea from last chapter showing up again: correlating against cosine and sine simultaneously is exactly the real and imaginary parts of correlating against a single complex exponential test wave. The DFT in the next chapter makes that connection explicit.

## Measuring How Loud, Not Just Whether

Correlation tells you *whether* and *how strongly* a frequency is present, but reading that number usefully often requires comparing it against an overall sense of the signal's loudness. Several concepts from the earlier VU-meter style labs are worth formalizing here, since a correlation-based tuner or analyzer needs them too.

The standard way to summarize a signal's overall size with a single number is the **root mean square**, or RMS: a statistical measure of a signal's magnitude computed by squaring every sample, averaging those squares, and taking the square root of the result — RMS is preferred over a simple average because squaring makes every contribution positive before averaging, so positive and negative swings do not cancel each other out the way a plain average would.

#### Root Mean Square

\[ \text{RMS} = \sqrt{\frac{1}{N}\sum_{n=0}^{N-1} x[n]^2} \]

where:

- \( \text{RMS} \) is the root-mean-square value
- \( x[n] \) is the signal's sample at index \( n \)
- \( N \) is the number of samples

Converting an RMS value into a number that reflects how a system reports loudness typically uses a logarithmic scale. **Sound level** is a measurement of a signal's intensity, typically expressed in decibels, derived from RMS amplitude on a logarithmic scale that compresses a very wide range of physical intensities into a manageable range of numbers. That measured sound level does not translate directly into how loud a sound seems to a human listener — human hearing itself is a variable in the equation. **Loudness perception** is the subjective, human experience of how loud a sound seems, which depends not only on the sound's physical intensity but also on its frequency — human hearing is measurably more sensitive to some frequencies than others, so two tones with identical measured sound levels can seem noticeably different in perceived loudness.

## Cleaning the Signal Before Correlating

Correlation performs best on a signal that has already been prepared, not raw, unfiltered captured audio. A family of tools called filters shapes a signal's frequency content before any correlation calculation runs.

A **low pass filter** allows frequencies below a chosen cutoff to pass through largely unaffected while attenuating (reducing) frequencies above that cutoff. A **band pass filter** allows only frequencies within a specific range — a "band" — to pass through, attenuating both lower and higher frequencies outside that range. The width of that allowed range has its own name: **bandwidth** is the width of the frequency range a filter (or a signal) occupies, measured as the difference between its upper and lower frequency limits.

One specific, critically important application of a low pass filter connects directly back to the Nyquist theorem from Chapter 6. An **anti-aliasing filter** is a low pass filter applied to a signal *before* it is sampled, specifically to remove any frequency content above the Nyquist frequency, preventing the aliasing that Chapter 6 demonstrated as a productive failure. Without an anti-aliasing filter in place ahead of the ADC, any stray high-frequency content — even content the system has no interest in measuring — can fold down into the range of frequencies being analyzed and corrupt the result.

Before comparing these filter types directly, it is worth summarizing their distinct roles now that each has been explained individually.

| Filter type | Passes | Blocks | Typical use in this course |
|---|---|---|---|
| Low pass filter | Frequencies below cutoff | Frequencies above cutoff | General noise reduction |
| Band pass filter | A specific frequency range | Everything outside that range | Isolating a note or instrument range |
| Anti-aliasing filter | Frequencies below the Nyquist frequency | Frequencies above the Nyquist frequency | Protecting the ADC from aliasing |

## Smoothing a Live Reading

A correlation magnitude computed fresh on every new block of audio tends to jitter rapidly from one reading to the next, even for a perfectly steady input tone, simply because each new block of samples differs slightly from the last. Smoothing that jitter into a stable, readable display uses one of two common techniques.

A **moving average** smooths a sequence of readings by continuously averaging together the most recent fixed-size window of values, replacing each raw reading with the average of, say, the last eight readings. A lighter-weight alternative achieves a similar smoothing effect without needing to store a window of past values at all: **exponential smoothing** produces a smoothed reading by blending each new raw value with the *previous smoothed value*, weighted by a chosen smoothing factor, so recent readings influence the result more than older ones without ever needing to store a history of past samples.

## Displaying and Calibrating the Result

The final step turns a smoothed correlation magnitude into something a person can read at a glance on the OLED display from Chapter 3. A **bar graph display** presents a numeric value as a filled bar whose length is proportional to that value, growing and shrinking in real time as the underlying reading changes — the visual format used throughout this course's VU meters and tuner displays.

One practical wrinkle remains before a bar graph is genuinely useful: raw correlation magnitude values can vary enormously depending on how loud a signal is to begin with, making a fixed bar-length scale either too twitchy for quiet sounds or clipped at maximum for loud ones. **Sensor auto calibration** is the automatic adjustment of a sensor's baseline or scaling based on recently observed signal characteristics — for example, automatically rescaling a bar graph's range based on the loudest correlation magnitude seen over the past few seconds, so the display stays readable and responsive regardless of how loud the current input happens to be.

!!! mascot-encourage "Every piece here reappears, renamed, in the next chapter"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Twenty-three new terms in one chapter is a lot to hold at once. Take comfort in this: you are not about to leave any of it behind. The next chapter takes this exact multiply-and-sum, I/Q, magnitude toolkit and simply runs it at many frequencies at once — nothing here was a detour.

## Chapter Summary

You can now answer, with a single number, whether a captured signal contains a specific frequency — and you understand exactly why the answer is trustworthy regardless of phase or loudness.

Key ideas to carry forward:

- **Correlation** is a **similarity measure** between a captured signal and a **test frequency**, computed by the **dot product** — specifically **multiply and sum**.
- The test frequency acts as a **basis function**; correlation is **projection onto basis**, and it works because sine waves at different frequencies are **orthogonal functions**.
- A single test wave is phase-sensitive, so correlation uses an **in-phase component** and a **quadrature component** together, combined into a phase-blind **correlation magnitude** — the source of **phase independence**.
- **Root mean square** summarizes signal size; **sound level** and **loudness perception** connect that number to how loud a sound actually seems.
- **Low pass**, **band pass**, and **anti-aliasing filters** shape a signal's **bandwidth** before correlation runs; **moving average** and **exponential smoothing** stabilize a jittery live reading.
- A **bar graph display**, aided by **sensor auto calibration**, turns the final number into something readable at a glance.

??? note "Quick check: why does correlating a captured 440 Hz sine wave against a 440 Hz cosine test wave produce a value near zero, even though the signal clearly contains 440 Hz? — Click to expand"
    A sine wave and a cosine wave at the same frequency are 90 degrees out of phase with each other — this is exactly the phase problem the in-phase/quadrature split solves. The cosine (in-phase) correlation is near zero in this case, but the sine (quadrature) correlation is strong. Combining both into the correlation magnitude, sqrt(I² + Q²), correctly reports the 440 Hz content regardless of this phase mismatch.

!!! mascot-celebration "You just built a one-frequency detector from scratch"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Multiply, sum, and combine in-phase with quadrature — that's the entire mechanism, and you now understand every piece of it. Next chapter takes this exact tool and sweeps it across every frequency bin at once, and you'll have a name for what you just built by hand: the Discrete Fourier Transform. Time to transform!
