---
title: Course Description
description: Benchmarking FFT — a 35-lab hands-on course in real-time signal processing on a $5 microcontroller
quality_score: 97
---

# Course Description

**Title:** Benchmarking FFT — Real-Time Signal Processing on a $5 Microcontroller
**Course Length:** 10 weeks, or self-paced independent study
**Audience:** College juniors and seniors curious about signal processing
**Format:** Hands-on throughout — 35 laboratory exercises on physical hardware

## Summary

This course teaches you to make a $5 microcontroller listen to the real world and understand it
in real time.

You will build a Fast Fourier Transform from scratch — discovering the algorithm rather than
being handed it — then make it fast enough for live audio by hand-writing ARM assembly. Along
the way you will learn to benchmark honestly, which turns out to be a harder and rarer skill
than writing the fast code itself.

By the final week you will have taken a 512-point transform from **21 seconds** down to
**0.59 milliseconds** on the same chip, measured every step yourself, and be able to explain
precisely where each factor of improvement came from.

## Why This Course Exists

Raw sensor data — sound, vibration, radio, anything that wiggles — looks like noise until you
transform it into the frequency domain. Then patterns leap out. A whistle becomes a number. An
engine's rattle becomes a diagnosis. Doing that transformation *fast enough to keep up with the
world* is the closest thing signal processing has to a superpower.

For decades that superpower needed expensive dedicated hardware. In 2010 ARM added DSP
instructions to the Cortex-M4. In August 2024 the Raspberry Pi Foundation released the Pico 2
around the Cortex-M33 — hardware floating point, DSP instructions, 150 MHz, **$5**.

The capability arrived. The awareness did not. Many FFT libraries still target older
instruction sets, and many developers have no idea what the chip on their desk can already do.

**This is genuinely rare territory.** Very few undergraduate courses put real-time FFT
benchmarking directly on hardware this cheap; most treat live DSP as something requiring a lab
bench and a dedicated processor. Students who work through this book are doing something most
CS and EE graduates never get to do.

## Prerequisites

**You need no prior experience with FFTs, digital signal processing, or assembly language.**
This is the binding design constraint of the entire course — Lab 1 assumes only that you own a
computer.

What genuinely helps:

- **Basic programming** in any language. If you can write a loop and a function, you can do this.
- **Comfort with algebra**, including sine and cosine as functions. No calculus is required.
- **Willingness to plug in wires.** Five components on a breadboard, no soldering.

What is explicitly taught from zero, with no assumed background:

| Topic | First introduced |
|---|---|
| Microcontrollers and GPIO | Lab 2 |
| Digital audio, sampling, bit depth | Labs 7–10 |
| Sine waves, phase, superposition | Labs 11–12 |
| Correlation and the Fourier transform | Labs 13–14 |
| The FFT algorithm | Labs 17–20 |
| Benchmarking methodology | Labs 25–26 |
| ARM assembly language | Labs 28–31 |
| Instruction encoding | Lab 33 |

## The Hardware Kit

Every student needs one kit, at roughly **$19** total.

| Component | Approx. cost | First used | Purpose |
|---|---|---|---|
| Raspberry Pi Pico 2 (RP2350) | $5 | Lab 1 | Cortex-M33, 150 MHz, hardware FPU |
| SSD1306 OLED, 128×64, SPI | $5 | Lab 4 | Live spectrum display |
| Two momentary push buttons | $1 | Lab 5 | Mode switching |
| INMP441 I²S MEMS microphone | $3 | Lab 7 | Real audio capture |
| Breadboard and jumper wires | $5 | Lab 4 | Connections |

A Pico 2 **W** works identically for every lab. The original Pico (RP2040) does **not** — its
Cortex-M0+ core has no floating-point unit, so Labs 30–34 cannot run. Lab 28 teaches students to
detect this themselves by reading the CPU's registers.

**Software:** Thonny and stock MicroPython. No compiler, no build system, no SDK. All 35 labs'
code ships pre-loaded on the board.

## The Laboratory Series

Thirty-five labs of roughly 45 minutes each, in eight modules.

### Module 0 — Getting Started (Labs 1–3)

Thonny, the REPL, GPIO, and reading the CPU's own identification registers. Students finish
knowing their chip's clock speed, memory, and the number that governs everything afterwards:
**6,000,000 cycles per audio frame**.

### Module 1 — Peripherals (Labs 4–6)

SPI and the OLED display, buttons with debouncing, and deployment — libraries, import paths, and
`main.py` so the board runs untethered from a phone charger.

### Module 2 — Sound as Numbers (Labs 7–10)

The microphone arrives early and deliberately, because it makes everything afterwards tangible.
I²S capture, the 24-bit-in-32-bit sample format, DC offset removal, RMS loudness, and a live VU
meter.

Two labs are engineered as **productive failures**: students play a tone above the Nyquist limit
and watch the instrument report a confidently wrong frequency, then deliberately clip audio and
watch harmonics appear that were never in the room.

### Module 3 — Discovering Frequency (Labs 11–16)

**The heart of the course.** Students do not receive the Fourier transform — they build it.

Lab 13 asks a single question: *does my signal contain this note?* The answer is
multiply-and-sum. Lab 14 loops that over every frequency, and students discover they have
written a Discrete Fourier Transform. Lab 15 validates it against hand-computed answers. Lab 16
times it and finds it **530× too slow for real time**.

That gap is what earns the FFT.

### Module 4 — The FFT (Labs 17–20)

Divide and conquer, bit reversal, twiddle factor tables, and the butterfly. Students assemble a
working FFT and validate it against the DFT they already proved correct — **146× faster**, but
still 3.5× short of real time.

### Module 5 — Real Spectra (Labs 21–24)

The payoff. A live spectrum analyzer, a guided **whistle test** where students sweep their pitch
and watch the peak follow, spectral leakage and windowing, a working chromatic tuner accurate to
1.3 Hz, and a stage-profiled real-time pipeline.

### Module 6 — Measuring Performance (Labs 25–27)

The DWT cycle counter at 6.7 nanosecond resolution, four demonstrated ways benchmarks lie, and
the abstraction ladder — pure Python, `@native`, `@viper`, C, and assembly — measured against
each other.

### Module 7 — Assembly Language (Labs 28–31)

A capability probe first (Lab 28), then registers, loops, memory, the floating-point instruction
set, and finally the butterfly in assembly. The complete transform runs **165× faster** than the
Python version and agrees with it **bit for bit**.

### Module 8 — Optimization and Capstone (Labs 32–35)

Specialization, branchless code, hand-encoding an instruction the assembler refuses to write,
a six-way variant comparison, and an independent capstone project.

## What Students Measure Themselves

Every number below is produced by students on their own hardware, not quoted from a datasheet.

| Implementation | Time per 512-point FFT | vs. 40 ms real-time budget |
|---|---|---|
| Brute-force DFT (Lab 16) | ~21,000 ms | **530× over** |
| Pure-Python FFT (Lab 20) | 140 ms | 3.5× over |
| Assembly FFT (Lab 31) | 0.85 ms | **2.1% of budget** |
| Best optimized variant (Lab 34) | 0.59 ms | **1.5% of budget** |

Supporting measurements students take along the way:

- **~1,097 cycles** for one MicroPython float multiply, versus **1 cycle** in hardware
- **6 dB of dynamic range per bit**, confirmed by deliberately discarding bits
- **8× accuracy improvement** from parabolic interpolation — but only with a window applied
- **66% of a real-time frame** spent in the FFT, and only **1%** in microphone capture
- A **2.1× measurement inflation** caused purely by timing operations individually

## Content Covered

**Mathematical and signal foundations**
Complex numbers, Euler's formula, sine waves, phase, superposition, harmonics, orthogonality,
correlation, the DFT, frequency bins and resolution, spectral leakage, window functions.

**Digital audio**
Sampling, the Nyquist criterion, aliasing, quantization, bit depth, dynamic range, headroom,
clipping distortion, RMS, decibels, noise floor, pitch and musical note mapping.

**The FFT algorithm**
Cooley-Tukey, divide and conquer, decimation in time, bit-reversal permutation, twiddle factor
tables, the butterfly, in-place computation, O(N log N) complexity, real-input transforms.

**Hardware and embedded systems**
ARM Cortex-M architecture, CPUID and feature registers, GPIO, SPI, I²S, MEMS microphones,
framebuffers, memory-mapped registers, the DWT cycle counter, RAM versus flash.

**Programming and assembly**
MicroPython, the native and viper code emitters, boxed versus unboxed values, ARM assembly,
Thumb instructions, the FPU register file, load-store architecture, calling conventions,
instruction encoding, and reading assembly critically.

**Benchmarking and methodology**
Real-time budgets, warm-up runs, best-of-N versus mean, variance and its sources, the observer
effect, instrumentation overhead, fair comparison, reproducibility, honest reporting of
exclusions and negative results.

**Languages in comparison**
MicroPython, C and assembly are compared directly on the same problem. C is covered at the level
of *tradeoff analysis and reading*, not implementation — the course runs entirely on stock
MicroPython plus inline assembly, deliberately, so no toolchain setup blocks a student. Students
learn why production systems almost always call a well-tested assembly library rather than
writing one, and why **reading** low-level code is the durable skill.

## Concepts Not Covered

- Assembly language for non-ARM instruction sets
- FPGA and ASIC implementations of FFTs
- Fixed-point Q15 arithmetic **in implementation** — Lab 28 demonstrates that MicroPython's
  assembler exposes none of the required DSP instructions, and the tradeoff is discussed, but no
  working Q15 FFT is built. A scoping study is an available capstone topic.
- Multi-dimensional and non-power-of-two transforms
- Filter design beyond the windowing needed for clean spectra

## Learning Outcomes

Organized by Bloom's Taxonomy. Outcomes marked **(lab)** are demonstrated by producing working
hardware or measurements, not by written answer alone.

### Remember

- Recall the key properties of the Fast Fourier Transform
- List the floating-point and DSP instructions available on the Cortex-M33
- Identify the three I²S signals and the SPI signals **(lab)**
- Define FFT size, frequency bin, twiddle factor, butterfly, bit reversal, and windowing
- State the Nyquist criterion and the real-time frame budget for a given sample rate
- Name the tradeoffs between integer and floating-point implementations

### Understand

- Explain how correlation detects a frequency, and why non-matching frequencies cancel **(lab)**
- Describe how the FFT eliminates the DFT's redundant work
- Explain why phase requires two measurements per frequency
- Interpret assembly code and describe how data moves through registers and memory **(lab)**
- Explain why aliasing and clipping destroy information irrecoverably **(lab)**
- Summarize how DSP hardware acceleration developed and why it now reaches $5 chips
- Explain why a benchmark's exclusions can reverse its conclusion

### Apply

- Capture real audio over I²S and convert raw samples to usable values **(lab)**
- Implement a DFT from correlation, then an FFT from divide-and-conquer **(lab)**
- Configure FFT size, sample rate and window function for a stated application **(lab)**
- Write ARM assembly routines using both core and floating-point registers **(lab)**
- Measure execution time with the DWT cycle counter and verify it before trusting it **(lab)**
- Apply parabolic interpolation to obtain sub-bin frequency accuracy **(lab)**
- Deploy a standalone program that runs on power-up without a computer **(lab)**

### Analyze

- Profile a real-time pipeline by stage and identify the true bottleneck **(lab)**
- Determine whether a performance difference is real or measurement noise **(lab)**
- Examine assembly code to find optimization opportunities
- Differentiate algorithmic gains from language-level and instruction-level gains **(lab)**
- Investigate how FFT size trades frequency resolution against frame rate **(lab)**
- Diagnose a failing implementation by bisection against a known-good reference **(lab)**

### Evaluate

- Assess whether an optimization justifies its cost in code size and complexity
- Critique a benchmark for warm-up, statistic choice, and undisclosed exclusions **(lab)**
- Judge the credibility of a published FFT performance claim
- Determine appropriate FFT parameters under stated real-time constraints
- Justify a choice between MicroPython, C and assembly for a given requirement
- Decide when a faster routine with a precondition is *not* an improvement

### Create

- Design and build a complete real-time signal processing application **(lab)**
- Develop an original FFT variant and measure it against established baselines **(lab)**
- Construct a benchmarking harness that resists the failure modes of Lab 26 **(lab)**
- Produce a capstone report with hypothesis, method, results, limitations and conclusions **(lab)**
- Generate recommendations for implementation strategy on a given platform

## Weekly Schedule

| Week | Module | Labs | Milestone |
|---|---|---|---|
| 1 | Getting Started | 1–3 | Board running; cycle budget understood |
| 2 | Peripherals | 4–6 | Display, buttons, standalone operation |
| 3 | Sound as Numbers | 7–10 | Live VU meter; aliasing demonstrated |
| 4–5 | Discovering Frequency | 11–16 | **Working DFT, built from scratch** |
| 6 | The FFT | 17–20 | **Working FFT, validated against the DFT** |
| 7 | Real Spectra | 21–24 | Live spectrum analyzer and tuner |
| 8 | Measuring Performance | 25–27 | Trustworthy benchmarking harness |
| 9 | Assembly Language | 28–31 | **Assembly FFT, bit-for-bit correct** |
| 10 | Optimization and Capstone | 32–35 | Variant comparison; capstone begins |

Midterm assessment falls at the end of Week 5, immediately after students complete their own
DFT — the point at which the conceptual core is in place.

The capstone is scoped for one to three weeks and may extend past Week 10 in an independent
study arrangement.

## Grading

| Component | Weight | Notes |
|---|---|---|
| Laboratory work | 30% | 35 labs; instructor decides completion vs. artifact grading |
| Homework and quizzes | 15% | Chapter quizzes and check-your-understanding items |
| Midterm | 20% | End of Week 5, covering Modules 0–3 |
| Capstone project | 25% | Report weighted toward method and honesty, not raw speedup |
| Final exam | 10% | Cumulative, emphasizing analysis and evaluation |

**On grading the capstone:** a negative result, honestly reported and explained, receives full
marks. An unexplained positive result does not. The single unacceptable error is revising a
hypothesis after seeing the data and presenting it as a prediction.

Instructors may reweight these components; the lab series is designed so that individual labs
can be skipped without breaking later ones, with two exceptions — Module 3 (Labs 11–16) and
Lab 28 are load-bearing for everything that follows.

## Instructor Notes

A separate Instructor's Guide covers lab logistics, common student difficulties, hardware
troubleshooting, capstone track selection, and assessment rubrics.

Three design decisions worth knowing about in advance:

1. **Labs 9, 16 and 22 are engineered to fail first.** Students hit aliasing, an unusably slow
   DFT, and spectral leakage *before* the fix is offered. The struggle is the lesson; resist the
   urge to pre-empt it.
2. **Every quantitative prediction made while designing this course proved optimistic.** That
   pattern is preserved deliberately — labs ask students to predict before measuring, and being
   wrong on paper is the intended experience.
3. **Two labs teach from real mistakes made building the course.** Lab 32 documents a benchmark
   that reported a faster variant as slower due to heap fragmentation; Lab 33 documents an
   instruction encoding error that produced silently wrong results. Both are presented as
   findings rather than trivia.
