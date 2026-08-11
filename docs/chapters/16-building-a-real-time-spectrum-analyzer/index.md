---
title: Building a Real-Time Spectrum Analyzer
description: Assemble capture, FFT, and display into a continuously running spectrum analyzer with double buffering, overlap processing, and stage-by-stage profiling.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 22:20:00
version: 0.09
---

# Building a Real-Time Spectrum Analyzer

## Summary

This chapter assembles capture, FFT, and display into a continuously running real-time spectrum analyzer, introducing block processing, double buffering, and hop size as the mechanics of keeping a live pipeline from stalling. It profiles the pipeline stage by stage — capture, compute, and draw time — to find the true bottleneck rather than guessing. This is the payoff chapter where every piece built so far runs together on real, live audio.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Block Processing
2. Bottleneck Identification
3. Buffer Swapping
4. Capture Time
5. Compute Time
6. Double Buffering
7. Draw Time
8. Frame Rate
9. Hop Size
10. Overlap Processing
11. Real Time Processing
12. Sound Processing
13. Spectrogram
14. Stage Profiling
15. Spectrum Analyzer
16. Streaming FFT
17. Waterfall Display

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [14. Computing and Displaying a Real Spectrum](../14-computing-and-displaying-a-real-spectrum/index.md)

---

!!! mascot-welcome "Everything you built, running at once, forever"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Capture, transform, window, detect, display — you've built every piece as a one-shot operation so far. This chapter wires them into a loop that never stops, updating live, the way a real instrument does. This is Module 5's payoff, and honestly, mine too — this is exactly what echolocation feels like from the inside. Let's tune in.

## Naming the Complete System

Every previous chapter in this module built one piece of a pipeline in isolation — a single captured frame, a single FFT, a single displayed spectrum. Running all of those pieces together, continuously, on live incoming audio is what actually turns this course's individual labs into an instrument.

A **spectrum analyzer** is a complete, integrated system that continuously captures audio, transforms it into a spectrum, and displays the result in near real time — combining every piece this course has built so far (capture, FFT, windowing, magnitude calculation, display) into one continuously running whole. Doing this continuously, without ever falling permanently behind the incoming stream of new audio, is **real-time processing**: processing incoming data at a rate that keeps pace with its arrival, indefinitely, rather than processing one fixed batch and stopping — the direct, ongoing application of the real-time budget concept from Chapter 10, now sustained frame after frame rather than measured just once. The general application area this whole system belongs to is worth naming too: **sound processing** is the application of audio processing techniques (Chapter 11) to a continuous, ongoing stream of incoming audio rather than a single isolated capture.

## Processing in Blocks

A live audio stream, at the sample level, is really just an endless sequence of individual numbers arriving one after another. Working with it one sample at a time would be far too slow and far too fussy — this course's entire pipeline instead works on small, manageable chunks.

**Block processing** is the strategy of processing audio in discrete, fixed-size chunks (frames of \( N \) samples) one at a time, rather than reacting to each individual incoming sample separately — the same frame capture and frame duration ideas from earlier chapters, now the standing operating procedure for a continuously running system rather than a one-time capture. How many complete capture-transform-display cycles a running spectrum analyzer completes each second has a name borrowed directly from video: the **frame rate** is the number of complete process-and-display cycles a real-time system completes per second — the practical, directly perceptible measure of how "live" and responsive a spectrum analyzer actually feels to someone watching it.

## Keeping the Pipeline From Stalling

A naive block-processing loop — capture a frame, then process it, then display it, then repeat — has an obvious weakness: the microphone cannot capture new samples while the previous frame is still being processed and drawn, so incoming audio gets silently dropped during every processing pause.

The standard fix uses two buffers instead of one. **Double buffering** is a memory management technique using two separate buffers, so that one buffer is actively being filled with new incoming samples by capture while the other buffer, already full, is simultaneously being processed and displayed — capture and processing run concurrently instead of taking turns waiting for each other. At the end of each cycle, the two buffers' roles need to switch. **Buffer swapping** is the act of exchanging the two double-buffers' roles at the end of each processing cycle — the buffer that was just filled by capture becomes the one handed off for processing and display, while the buffer that was just processed and displayed becomes available again to be filled with new incoming samples.

#### Diagram: Double Buffering Pipeline

<iframe src="../../sims/double-buffering-pipeline/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Double Buffering Pipeline</summary>
Type: microsim
**sim-id:** double-buffering-pipeline<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, interpret

Learning objective: Let students interpret how two buffers alternate roles between being filled by capture and being processed/displayed, explaining why this prevents the pipeline from ever having to pause capture while processing runs.

Canvas layout:
- Two labeled buffer boxes side by side ("Buffer A", "Buffer B"), each showing its current role ("Capturing..." or "Processing/Displaying...")
- A timeline strip below showing several cycles, with each buffer's role color-coded per cycle

Visual elements:
- Buffer A and Buffer B boxes, each filled with a color indicating current role (blue = capturing, orange = processing/displaying)
- Timeline strip showing 4-6 cycles, each split into two colored segments showing which buffer held which role during that cycle
- An animated "swap" arrow shown at each cycle boundary

Interactive controls:
- Button: "Advance one cycle" — swaps the two buffers' roles and advances the timeline
- Button: "Auto-play" — advances continuously at an adjustable speed

Behavior:
- Each time "Advance one cycle" is clicked, Buffer A and Buffer B's roles visibly swap (capturing becomes processing, and vice versa), and the timeline strip extends by one more color-coded segment
- A running caption confirms: "Capture never pauses — while one buffer processes, the other is already filling."

Instructional Rationale: An Understand-level pattern is appropriate because the objective is explaining the mechanism (concurrent roles prevented by swapping) rather than performing a calculation — an explicit, steppable role-swap animation makes the "why doesn't this drop samples" question directly observable.

Implementation notes:
- Use p5.js; maintain a simple two-state role tracker and a scrolling timeline history array
- Responsive width; buffer boxes and timeline scale to container width on resize
</details>

## Overlapping Frames for Smoother Updates

Double buffering solves *dropped samples*; it does not by itself address a separate, more subtle question: how much new data has to arrive before the next spectrum update happens at all? Non-overlapping blocks — process frame 1, then frame 2, then frame 3, with each frame entirely disjoint from its neighbors — are simple, but they update only as often as one full frame duration allows.

A hop-based approach updates more often than that, by reusing some of the previous frame's samples. The **hop size** is the number of new samples a real-time pipeline advances between one processed frame and the next — when hop size equals the full frame size, frames are non-overlapping; when hop size is smaller, consecutive frames share some of the same samples. Running frames with a hop size smaller than the frame size is called **overlap processing**: processing overlapping frames, where consecutive frames share some of their samples, producing more frequent spectrum updates (and a smoother-feeling frame rate) than non-overlapping block processing would allow, at the cost of recomputing an FFT over some samples more than once.

Running the FFT over and over, continuously, on this hop-advancing stream of frames — rather than once on a single static buffer — is the literal, mechanical core of the whole real-time system. A **streaming FFT** is the practice of running the FFT repeatedly and continuously on a live incoming audio stream, once per hop, forever, as opposed to computing it a single time on one fixed, already-captured buffer.

#### Diagram: Hop Size and Overlap Processing Visualizer

<iframe src="../../sims/hop-size-overlap-visualizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Hop Size and Overlap Processing Visualizer</summary>
Type: microsim
**sim-id:** hop-size-overlap-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, compare

Learning objective: Let students adjust the hop size relative to a fixed frame size and examine how much consecutive frames overlap, comparing the resulting update frequency against the extra recomputation cost overlap introduces.

Canvas layout:
- A horizontal timeline of the continuous sample stream, with successive frame windows drawn as overlapping colored bars beneath it
- Controls and a readout panel below

Visual elements:
- A long horizontal strip representing the continuous incoming sample stream
- Several semi-transparent colored bars beneath it, each representing one processed frame's window, positioned according to the current hop size (adjacent bars overlapping visually when hop size < frame size)
- Readout: "Frame size: [N] samples | Hop size: [value] samples | Overlap: [percentage]% | Updates per second: [value]"

Interactive controls:
- Slider: Frame size, fixed at 512 for this example (labeled, not adjustable, to isolate hop size's effect)
- Slider: Hop size, range 64 to 512 samples, default 512 (no overlap)

Behavior:
- Reducing hop size below frame size visibly increases the overlap between adjacent frame-window bars and increases the "updates per second" readout, while a caption notes that total FFT computations per second rises proportionally
- Setting hop size equal to frame size returns to the simple non-overlapping case, with bars sitting exactly edge to edge

Instructional Rationale: An Analyze-level comparison pattern is appropriate because the objective is examining the tradeoff between update smoothness and computational cost as hop size changes — a visual, adjustable overlap display makes this tradeoff concrete rather than requiring students to reason about it abstractly.

Implementation notes:
- Use p5.js; draw frame-window bars procedurally based on the current hop size and a fixed total stream length
- Responsive width; timeline strip and controls scale to container width on resize
</details>

!!! mascot-tip "Overlap trades CPU time for smoother motion"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    A 50% overlap (hop size equal to half the frame size) roughly doubles how often your display updates — and roughly doubles how many FFTs per second your Pico 2 has to compute. Overlap processing isn't free smoothness; it's a direct trade against the exact real-time budget from Chapter 10.

## Profiling the Pipeline, Stage by Stage

With a continuously running system in place, the natural next question is: where does all the time actually go? Guessing is unreliable — the only trustworthy answer comes from measuring each stage separately.

Three specific stages make up one cycle of this chapter's pipeline, and each has its own measured duration. **Capture time** is the measured time spent specifically reading one frame's worth of samples over I2S during a single pipeline cycle. **Compute time** is the measured time spent specifically computing the FFT and its post-processing (magnitude, scaling, bin averaging) during a single cycle. **Draw time** is the measured time spent specifically rendering the resulting spectrum to the OLED display during a single cycle. Measuring all three separately, rather than only measuring one combined total, is called **stage profiling**: instrumenting a multi-stage pipeline to record the time spent in each individual stage separately, rather than only the pipeline's overall end-to-end time.

Stage profiling turns the abstract idea of a performance bottleneck from Chapter 10 into a concrete, measured answer for this specific pipeline. **Bottleneck identification** uses stage profiling's separated measurements to determine which specific stage consumes the largest share of total pipeline time — the stage that must be optimized first, since improving any other stage barely moves the total while the bottleneck remains. Measured on this course's actual pipeline, the answer is not close: computing the spectrum consumes roughly 66% of a real-time frame's total time, while capturing the audio that feeds it takes roughly 1% — draw time fills most of the remainder.

| Stage | Approximate share of frame time |
|---|---|
| Capture time | ~1% |
| Compute time (FFT + post-processing) | ~66% |
| Draw time | Remainder |

#### Diagram: Stage Profiling Breakdown Chart

<iframe src="../../sims/stage-profiling-breakdown-chart/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Stage Profiling Breakdown Chart</summary>
Type: chart
**sim-id:** stage-profiling-breakdown-chart<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy: Evaluate
Bloom Taxonomy Verb: Judge, prioritize

Learning objective: Let students judge, from a stacked breakdown of capture, compute, and draw time, which stage should be prioritized for optimization, using the measured percentages rather than intuition.

Chart type: Horizontal stacked bar (single bar, three segments) plus a companion pie chart toggle

Purpose: Make the true bottleneck (compute time) visually unmistakable against the other two stages combined

Data: Capture time ~1%, Compute time ~66%, Draw time ~33% (remainder), of one total pipeline cycle

Interactive elements:
- Clicking any segment (Capture / Compute / Draw) displays an infobox: "This stage takes [X]% of total frame time. [Note on whether this is a bottleneck.]"
- Toggle: "Stacked bar" / "Pie chart" view

Title: "Where Does the Frame Time Actually Go?"
Annotations: A callout arrow pointing at the Compute segment reading "The clear bottleneck — this is what the next module optimizes"

Implementation: Chart.js with a stacked horizontal bar dataset and an alternate pie dataset toggled via a button
</details>

!!! mascot-warning "Don't optimize draw time first just because it's easy to see"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo giving a warning">
    It's tempting to start optimizing whatever code you personally find messiest — often the display-drawing code, since it's the most visible. Resist that instinct here. Stage profiling says compute time is the real bottleneck, at roughly 66% of every frame. Polishing draw code first would be effort spent exactly where Chapter 10's motivation-for-optimization lesson warns against: away from where the actual cost lives.

## Seeing Time Unfold

A single spectrum snapshot shows frequency content at one instant. Stacking many consecutive spectra together, one per processed frame, reveals something a single snapshot cannot: how a sound's frequency content changes over time.

A **spectrogram** is a two-dimensional visualization plotting frequency on one axis and time on another, using color or brightness to represent magnitude at each time-frequency point — built directly by stacking this chapter's continuously produced stream of individual spectra side by side. A specific, commonly used visual style for displaying a spectrogram live gives it a distinctive, descriptive name: a **waterfall display** presents a spectrogram so that new spectra continuously scroll onto the display from one edge while older spectra scroll off the opposite edge, creating the visual impression of frequency data flowing downward (or sideways) like a waterfall.

#### Diagram: Spectrogram / Waterfall Display

<iframe src="../../sims/spectrogram-waterfall-display/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Spectrogram / Waterfall Display</summary>
Type: microsim
**sim-id:** spectrogram-waterfall-display<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze
Bloom Taxonomy Verb: Examine, interpret

Learning objective: Let students examine a scrolling waterfall spectrogram built from a sequence of example spectra and interpret how a changing pitch appears as a moving, colored trace over time.

Canvas layout:
- Full-width scrolling 2D plot, frequency on the vertical axis, time scrolling horizontally (newest data at the right edge), magnitude shown as color intensity (dark = quiet, bright = loud)
- Controls below: play/pause and a selector for a small set of example sound sequences

Visual elements:
- A continuously scrolling color-mapped grid, each new column representing the latest processed frame's spectrum
- A color legend mapping intensity to magnitude in dB

Interactive controls:
- Dropdown: example sequence ("Rising whistle", "Falling whistle", "Two-tone chord", "Silence then a clap")
- Play/Pause button
- Hovering any point on the waterfall shows its exact frequency, time offset, and magnitude in a tooltip

Behavior:
- Selecting an example sequence and pressing play scrolls a precomputed series of spectra across the display in real time, visibly tracing a rising or falling bright line for a swept whistle, or a broadband vertical flash for a clap
- Hovering pauses the scroll and reveals the exact tooltip value at that point

Instructional Rationale: An Analyze-level examination pattern is appropriate because the objective is interpreting patterns across combined frequency-and-time data — a scrolling color-mapped display, paired with recognizable example sounds, lets students connect a familiar sound (a rising whistle) to its visual signature directly.

Implementation notes:
- Use p5.js; precompute each example sequence's frame-by-frame spectra and render as a scrolling texture or pixel grid
- Responsive width; waterfall plot and controls scale to container width on resize
</details>

!!! mascot-encourage "You just built the same tool audio engineers pay thousands for"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    Double buffering, overlap processing, stage profiling, a waterfall display — this is not a simplified classroom toy anymore. This is, mechanically, the same architecture behind professional audio analysis tools that cost real money. You built it on a five-dollar board, and you know exactly why every piece of it is there.

## Chapter Summary

You now have a complete, continuously running spectrum analyzer, profiled and understood stage by stage, running entirely on real, live captured audio.

Key ideas to carry forward:

- A **spectrum analyzer** performs **real-time processing** as a form of continuous **sound processing**, built from **block processing** at a measured **frame rate**.
- **Double buffering** with **buffer swapping** keeps capture from ever pausing for processing.
- **Hop size** smaller than the frame size enables **overlap processing**, powered by a continuously running **streaming FFT**.
- **Stage profiling** separately measures **capture time**, **compute time**, and **draw time**, enabling real **bottleneck identification** — compute time, at roughly 66% of every frame, is this pipeline's clear bottleneck.
- A **spectrogram**, often shown as a **waterfall display**, reveals how a sound's frequency content changes over time, not just at one instant.

??? note "Quick check: capture time is 1% of a frame, compute time is 66%, and draw time is the remainder. If you could somehow make capture instantaneous (0%), roughly how much would total frame time improve? — Click to expand"
    Only about 1% — capture was already a tiny fraction of the total. Bottleneck identification exists precisely to prevent this mistake: optimizing the smallest-share stage feels productive but barely moves the total, while the 66% compute-time bottleneck remains completely untouched.

!!! mascot-celebration "A real-time spectrum analyzer, built entirely by you"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    Capture, FFT, windowing, peak detection, and display, all running together, continuously, on your own five-dollar board — that's Module 5, complete. You've also found, with real measurements, exactly where the next module needs to focus: compute time. Time to go measure it properly. Time to transform!
