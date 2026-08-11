---
title: "Capstone: Applications, Design, and Reporting"
description: Real-world FFT applications as capstone inspiration, plus the experimental design and reporting discipline that turns a project into rigorous, honest evidence
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Capstone: Applications, Design, and Reporting

## Summary

This chapter surveys real-world applications of FFT-based signal processing — music analysis, radar, vibration monitoring, software-defined radio, and biomedical signals — as inspiration for an independent capstone project. It covers experimental design: research questions, independent and dependent variables, and the methodology and limitations sections a rigorous report needs. It closes the course with the same standard applied throughout: a negative result, honestly reported, is a successful outcome.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Benchmark Suite
2. Capstone Project
3. Communication Systems
4. Conclusion Drawing
5. Dependent Variable
6. Experimental Design
7. Independent Variable
8. Limitations Statement
9. Machine Monitoring
10. Methodology Section
11. Noise Cancellation
12. Peer Review
13. Project Scoping
14. Radar Processing
15. Report Generation
16. Research Question
17. Results Presentation
18. Software Defined Radio
19. Vibration Analysis
20. Voice Recognition

## Prerequisites

This chapter builds on concepts from:

- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [8. Correlation: Does My Signal Contain This Note?](../08-correlation/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [14. Computing and Displaying a Real Spectrum](../14-computing-and-displaying-a-real-spectrum/index.md)
- [15. Windowing, Spectral Leakage, and Peak Detection](../15-windowing-spectral-leakage-and-peak-detection/index.md)
- [18. Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison](../18-benchmarking-methodology/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [26. Competing Variants: Predict, Measure, Explain](../26-competing-variants/index.md)

---

!!! mascot-welcome "Time to transform — everything you've built into something entirely your own!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every chapter until now handed you a specific problem to solve. This one hands you the
    steering wheel. You've earned it — from a 21-second brute-force DFT down to a
    sub-millisecond hand-tuned assembly FFT, you now have every tool this course has to
    give. Let's point it somewhere real.

## Where Real-Time FFTs Actually Work

The techniques this course built — capture, transform, window, benchmark, optimize — are
not academic exercises confined to a $5 board. They are the same techniques running,
right now, inside a wide range of real systems. Six application domains, each already
connected to something you've built, are worth knowing as capstone inspiration.

**Voice recognition** systems extract frequency-domain features from short windows of
speech as their very first processing step — the same windowing and spectral analysis
from Chapter 15, applied to human speech instead of a single whistled tone. **Noise
cancellation** works by analyzing incoming sound in the frequency domain, identifying an
unwanted periodic component, and generating an inverted version to cancel it — a direct
extension of the spectral leakage and peak-detection skills from Chapter 15. **Machine
monitoring**, often called **vibration analysis** in industrial contexts, applies the FFT
to accelerometer data from rotating machinery: specific frequencies in the spectrum
correspond to specific mechanical faults — bearing wear, shaft imbalance — turning "an
engine's rattle" into an actual diagnosis, exactly as this course's opening motivation
promised.

**Radar processing** applies FFTs (often two-dimensional ones) to reflected radio signals
to extract a target's range and velocity — a more advanced application of the same
divide-and-conquer butterfly structure from Chapter 11. **Software defined radio** (SDR)
replaces dedicated radio hardware with general-purpose processing that performs
demodulation and filtering in software, with FFT-based spectrum analysis as one of its
core operations — conceptually, the live spectrum analyzer from Chapter 16, tuned to
radio frequencies instead of audio. And the broader category of **communication
systems** — including the OFDM modulation scheme underlying most modern Wi-Fi and cellular
standards — relies on FFTs to convert between the time domain a radio actually transmits
in and the frequency domain a receiver needs to decode the signal.

#### Diagram: Applications of Real-Time FFT

<iframe src="../../sims/fft-applications-map/main.html" width="100%" height="487px" scrolling="no"></iframe>

<details markdown="1">
<summary>Applications of Real-Time FFT</summary>
Type: infographic
**sim-id:** fft-applications-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand (L2) — exemplify, connect
Learning objective: Connect each of six real-world FFT application domains back to the specific course chapter that taught its underlying technique.

Canvas layout:
- A 2×3 grid of six cards, one per application domain, each with an icon and short label
- A details panel below the grid that fills in when a card is clicked

Visual elements:
- Six cards: Voice Recognition, Noise Cancellation, Machine Monitoring / Vibration Analysis, Radar Processing, Software Defined Radio, Communication Systems
- Each card has a simple representative icon (microphone, headphone, gear, radar dish, antenna, signal bars)

Interactive controls:
- Click any card to reveal: a one-sentence description of the application, which earlier chapter's technique it relies on most directly, and one open-ended capstone project idea in that domain
- Hover any card for a one-line tooltip preview

Behavior:
- Clicking "Machine Monitoring / Vibration Analysis" reveals: "Rotating machinery vibration, sampled by an accelerometer, analyzed for fault-specific frequency peaks — builds directly on Chapter 15's peak detection. Capstone idea: build a bearing-fault classifier using peak frequency and window choice."
- Each of the six reveals follows the same three-part structure (description / chapter link / project idea)

Instructional Rationale: An Understand-level "exemplify and connect" objective is well
served by a clickable card grid — it lets the learner explore all six domains at their
own pace and explicitly ties each one back to a specific, already-learned technique,
reinforcing that these applications are extensions of skills already built, not new
material.

Implementation: p5.js, six card objects with associated detail text, click detection via bounding boxes
</details>

## From Inspiration to a Scoped Project

A **capstone project** is this course's final deliverable: an independent piece of work,
one to three weeks in scope, that applies what you've learned to a question you chose.
None of the six domains above needs to be tackled in its full industrial complexity —
**project scoping** is the deliberate practice of narrowing a broad application area down
to a specific, achievable question that fits your remaining time and your actual
hardware. "Build a production noise-cancellation headset" is not a scoped capstone;
"measure how accurately a windowed FFT can identify a single dominant noise frequency in
a recorded fan hum, and how that accuracy changes with window choice" is.

!!! mascot-tip "A small, well-executed question beats a large, vague one"
    ![Echo giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The grading philosophy for this capstone rewards methodology and honesty over raw
    ambition. A tightly scoped project, rigorously measured and honestly reported, earns
    more credit than a sprawling one with unclear success criteria — scope down until you
    could actually finish it in the time you have.

## Designing a Rigorous Experiment

Once scoped, a capstone project needs **experimental design**: the structured plan for
what you will vary, what you will measure, and how you will know whether your question
has been answered. Every rigorous experimental design starts from a single, precisely
stated **research question** — not "is windowing good?" but something answerable with a
measurement, like "does applying a Hann window improve peak-frequency accuracy, compared
to no window, when detecting a 3.2 kHz tone in a signal with added noise?"

A well-formed research question implies its own **independent variable** — the one
condition you deliberately change across trials, window type in the example above — and
its **dependent variable** — the outcome you measure in response, frequency estimation
error in that same example. Everything else about the experiment (signal length, sample
rate, noise level, board, clock speed) becomes a controlled variable, held fixed exactly
as Chapter 26 described, so that any change in the dependent variable can be attributed
to the independent variable alone.

#### Diagram: Experimental Design Anatomy

<iframe src="../../sims/experimental-design-anatomy/main.html" width="100%" height="437px" scrolling="no"></iframe>

<details markdown="1">
<summary>Experimental Design Anatomy</summary>
Type: infographic
**sim-id:** experimental-design-anatomy<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply (L3) — classify, construct
Learning objective: Classify the components of a stated research question into research question, independent variable, dependent variable, and controlled variables, and construct a benchmark suite around them.

Canvas layout:
- A worked example sentence at the top: "Does Hann windowing improve peak-frequency accuracy versus no window, when detecting a 3.2 kHz tone in noisy audio, at 150 MHz on a Pico 2, with a fixed 512-point FFT size?"
- Below it, four labeled boxes the learner fills by dragging highlighted phrases from the sentence: Research Question, Independent Variable, Dependent Variable, Controlled Variables (multiple)

Visual elements:
- The example sentence with key phrases pre-highlighted in distinct colors matching the four target boxes
- Drag targets clearly labeled and empty until filled

Interactive controls:
- Drag each highlighted phrase into its matching labeled box
- Button: "Check my answers" — confirms correct placement or highlights a mismatch with a one-line hint
- Button: "Try a new example" — cycles to a second worked sentence from a different application domain (e.g., vibration analysis) for additional practice

Behavior:
- Correct placement: "Window type (Hann vs. none)" → Independent Variable; "Peak-frequency error" → Dependent Variable; "150 MHz, Pico 2, 512-point FFT" → Controlled Variables
- Incorrect placement gives a hint rather than the answer, e.g. "This phrase describes what you're measuring as an outcome, not what you're deliberately changing — try Dependent Variable instead."

Instructional Rationale: An Apply-level "classify and construct" objective calls for
direct manipulation — dragging phrases into categories requires the learner to actively
apply the definitions just given, rather than passively reading a labeled diagram.

Implementation: p5.js, draggable text objects with drop-zone collision detection, a small library of 2-3 worked example sentences
</details>

Testing a research question properly rarely means running just one signal once. A
**benchmark suite** is a curated, reusable collection of representative test signals and
conditions — several noise levels, several tone frequencies, several window functions —
built once and run consistently across every trial, extending Chapter 18's single-test
harness into a full, repeatable evaluation set for an entire project rather than one
measurement.

## Writing the Report

A capstone project is only as convincing as its report, and this course expects a
specific structure, each section serving a distinct purpose:

| Report section | Purpose |
|---|---|
| **Methodology section** | States the research question, independent/dependent variables, benchmark suite, hardware, and exact procedure — detailed enough that someone else could reproduce your results, per Chapter 18's reproducibility standard |
| **Results presentation** | Reports what was actually measured — tables, performance charts, comparison matrices — without interpretation mixed in |
| **Limitations statement** | States plainly what the experiment did *not* control for, test, or rule out — the capstone-scale version of Chapter 18's "what a benchmark excludes" |
| **Conclusion drawing** | Interprets the results in light of the original research question, stating clearly whether the hypothesis was supported, refuted, or the evidence was inconclusive |

**Report generation** is the overall skill of assembling these four sections, plus your
raw data and code, into one coherent, readable document — the actual deliverable a
capstone project produces, whether that document is a formal write-up, a lab notebook, or
a project README, as your instructor specifies.

!!! mascot-encourage "A limitations section is a strength, not a confession"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    It can feel like admitting weakness to write down what your experiment didn't cover.
    It's the opposite — a limitations statement tells a reader exactly how far to trust
    your conclusion, which is precisely what separates a scientific report from a sales
    pitch. Every strong result this course has shown you included one.

## One More Set of Eyes: Peer Review

Before a report is finished, **peer review** — having someone else read your methodology
and results critically, looking specifically for unstated assumptions, missed controlled
variables, or a conclusion that overreaches what the data actually shows — catches
mistakes that are genuinely difficult to see in your own work, precisely because you
already know what you meant to measure. A classmate reading only what you wrote, not
what you intended, is exactly the perspective a limitations statement and a
reproducibility-focused methodology section are written for.

??? question "Your capstone measures a 12% speedup from a new optimization, but a peer reviewer points out your controlled variables didn't include ambient temperature, and your lab ran noticeably warmer on the 'after' measurements. What's the right response? Click to check."
    Report it as a genuine limitation, not something to quietly fix and rerun without
    disclosure — add ambient temperature as an unstated controlled variable to your
    limitations statement, and if time allows, rerun the comparison with temperature
    controlled to see whether the 12% holds. If it doesn't hold, that revised,
    lower (or even negative) result, honestly explained, is worth full credit under this
    course's grading standard — exactly as much as the original 12% would have been.

## The Standard This Whole Course Has Held

This chapter closes on the same principle that opened Chapter 18: a **negative result** —
a hypothesis that measurement did not support — honestly reported and explained, is a
completely successful outcome. The only genuinely unacceptable move, in this capstone or
anywhere else, is revising a hypothesis *after* seeing the data and presenting the
revision as if it had been the original prediction. Prediction before measurement,
honest reporting of what was excluded, and a conclusion that follows the evidence rather
than the other way around — that is the actual throughline connecting Chapter 1's first
GPIO blink to whatever you build for this capstone.

!!! mascot-celebration "Not bad for a $5 chip — and not bad for you, either"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You're right on frequency — for the whole course, not just this chapter. You built a
    DFT from correlation, discovered the FFT for yourself, timed it to the nanosecond,
    and hand-wrote assembly that runs faster than 99% of the code most engineers will
    ever touch by hand. Whatever question you choose for your capstone, you already have
    every tool you need to answer it honestly. Time to transform — one more time, on your
    own terms.
