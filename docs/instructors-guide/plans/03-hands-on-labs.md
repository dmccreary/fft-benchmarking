# Test Plan 03: Hands-On Lab Series

**Status:** Draft for review — design document, no lab content written yet.
**Depends on:** [Plan 01](01-fft-test-plan.md) (assembly FFT), [Plan 02](02-competing-variants.md) (variants).
**Deliverable:** 32 hands-on labs in `docs/labs/NN-name/`, plus updates to
[`course-description.md`](../course-description.md) and the
[learning graph](../learning-graph/index.md).

## 1. Goal and Audience

Build a lab series that takes a student from **"I have never opened Thonny"** to
**"I hand-wrote an ARM assembly FFT, benchmarked it against five competing variants, and can
explain why the one I expected to win came last."**

The binding constraint: **assume no prior experience with FFTs, signal processing, or assembly
language.** The existing course description targets juniors/seniors "with a curiosity in signal
processing" — curiosity, not background. Every concept must be introduced from zero.

The hardware kit is a Raspberry Pi Pico 2 with an SSD1306 OLED, two buttons, and an INMP441
I²S MEMS microphone. The microphone matters pedagogically out of proportion to its $3 cost: it
turns every abstract concept into something the student can *whistle at*.

## 2. What the Previous Kit Taught Us

An earlier lab kit by the same author exists at `spectrum-analyzer/src/fft-kit-1/` (16 numbered
MicroPython files). It is worth studying because its strengths and its failures both transfer
directly.

### What it got right, and we should keep

- **Peripheral bring-up in isolation** — display alone, then signal alone, then microphone
  alone, before any combination.
- **Thonny's plotter before the OLED.** Students see a waveform on a large screen before
  fighting a 128×64 framebuffer.
- **Measurement treated as a lab step.** A startup banner printing bin width, frequency range,
  FFT size and sample rate turns invisible DSP tradeoffs into visible numbers.
- **Honest attribution** (Mike Teachman for I²S, Peter Hinch for the assembly FFT).
- **A consistent `try / except KeyboardInterrupt / finally: deinit()` skeleton** in every file.

### The failures we must not repeat

| Problem in the old kit | Fix in this plan |
|---|---|
| **The 10 → 19 cliff.** One file prints a single RMS number; the next is 297 lines containing bit-reversal, twiddle factors, butterflies, windowing, magnitude approximation and peak detection all at once. Nothing teaches what a frequency bin *is*. | **Module 3 (Labs 11–16)** builds frequency analysis from correlation, one idea per lab. This is the centrepiece of the design. |
| **The assembly track was dead on arrival.** It targeted the original Pico — Cortex-M0+, ARMv6-M, **no FPU** — so every `vldr`/`vmul` in the vendored library was unassemblable. Four successive attempts wrapped in `try/except` and `inspect.signature` probing never converged, and the real blocker is never stated in the code. | **Lab 27 is an explicit CPU-capability gate** before any float assembly, using the probes already written this session. The failure becomes a *lesson* rather than a trap. |
| **No validation on a known signal.** The FFT is never checked against a synthetic sine. A student getting garbage cannot tell whether the mic, the wiring, the FFT, or the display is at fault. | **Lab 15 validates the student's own DFT on a synthetic sine before the microphone is ever involved.** Validation-first is a stated principle (§3). |
| **No windowing lesson.** A Hanning window appears fully formed with no before/after comparison; spectral leakage is never shown. | **Lab 22** is a dedicated productive-failure lab: leakage first, window second. |
| **Pin maps drift silently** between files (OLED on SPI0 in most, SPI1 in one; I²S on 10/11/12 in most, 16/17/18 in others), with no warning. | **A single shared `config.py`** imported by every lab. Pin numbers appear in exactly one file. |
| **Broken code shipped as labs.** Two files cannot run at all (`import array` then `array('f',…)`; a library that does `import pyb` on an RP2 board). | Every lab file must run on the physical board before the lab ships. Non-negotiable. |
| **Duplicate files with no differentiator** (three exact byte-identical pairs) and version suffixes where `55-fft-asm-working` is *not* the endpoint — `56` is. | **Contiguous numbering, one canonical file per lab, no version suffixes.** |
| **Two variables changed at once** (FFT size *and* profiling added in the same file), so speed changes cannot be attributed. | One new variable per lab, enforced in review. |
| **Buttons never used** despite being in the kit. | **Lab 5** introduces them; later labs use them for mode switching. |
| **No deployment lesson** — nothing explains that `lib/` must be copied to the board. | **Lab 6** covers file transfer, `lib/`, import paths and `main.py`. |

### Lineage worth stating in the labs

The old kit vendored **Peter Hinch's `micropython-fourier`** assembly FFT. Our implementation is
independent but sits in the same tradition, and uses the same underlying idea: hardware
single-precision VFP arithmetic driven from `@micropython.asm_thumb`. The difference in outcome
is *hardware*, not approach — the Pico 2's Cortex-M33 has the FPv5-SP unit the RP2040 lacked.
Labs 27–30 should say this explicitly and credit Hinch.

## 3. Instructional Design Principles

These are the rules the labs are held to in review. Each exists because violating it caused a
concrete failure in the previous kit.

1. **Zero-prerequisite entry.** Lab 1 assumes only that the student owns a computer.
2. **Concrete before abstract.** Hear or see the phenomenon before the mathematics. Students
   meet aliasing as *a tone that lies about its pitch* before they meet the Nyquist criterion.
3. **Bounded cognitive load.** 3–6 new concepts per lab. A 297-line lab is a design failure.
4. **One new variable per lab.** If a lab changes both FFT size and adds profiling, the student
   cannot attribute the result.
5. **Validation before trust.** Every subsystem is proven against a known input before it is
   used on unknown input. The FFT meets a synthetic sine before it meets a microphone.
6. **Productive failure.** Some labs deliberately hit a wall before the fix arrives: aliasing
   (Lab 9), spectral leakage (Lab 22), a hopelessly slow DFT (Lab 16). The struggle is the
   lesson; the fix is the reward.
7. **Predict, then measure.** Carried forward from Plan 02, where *every* quantitative
   prediction proved optimistic. Students write a prediction down before running the benchmark.
8. **Scaffolding that fades.** Early labs supply complete, runnable code. Middle labs supply
   skeletons with gaps. Late labs supply a specification and a test.
9. **Every lab ships something observable.** No lab ends with only a number in a console — there
   is a blinking light, a plot, a display, a tone identified, or a measured speedup.
10. **Spiral, don't sprint.** The butterfly appears in Lab 19 (concept), Lab 20 (Python), Lab 29
    (assembly), Lab 31 (optimized). Each pass adds depth to a familiar object.

## 4. Hardware and Shared Configuration

| Peripheral | Interface | GPIO | Notes |
|---|---|---|---|
| Onboard LED | — | 25 | Lab 2 |
| SSD1306 OLED, 128×64 | SPI0 | SCL 2, SDA 3, RES 4, DC 5, CS 6 | matches existing `src/kits/oled-2-buttons/config.py` |
| Button A / B | GPIO in | 14, 15 | `PULL_UP`, active low |
| INMP441 microphone | I²S0 | SCK 10, WS 11, SD 12 | 24-bit samples in 32-bit words |

**Verified this session:** no pin conflicts, and `machine.I2S` constructs successfully on
10/11/12 on stock MicroPython v1.28.0.

**`config.py`** — one module, imported by every lab, holding every pin number, the sample
rate, the FFT size, and the display constants. This single file eliminates the entire class of
silent-no-output failures that the old kit's pin drift produced.

## 5. The Lab Sequence

32 labs in 8 modules. Mapped to a 10-week course: roughly one module per week, plus a midterm
week and a capstone week.

Column key: **New** = approximate count of new learning-graph concepts introduced.

### Module 0 — Environment (Week 1)

| # | Lab | Introduces | New |
|---|---|---|---|
| 1 | Hello World with Thonny | Thonny, REPL, MicroPython vs Python, running from editor vs saving to device, Ctrl-C | 12 |
| 2 | Blink: Your First Hardware Program | GPIO, `Pin`, output mode, loops, `sleep`, the infinite-loop pattern | 10 |
| 3 | Know Your Board | `sys.implementation`, clock speed, RAM vs flash, `CPUID`, what "Cortex-M33" means | 12 |

*Reuses [`02-get-info.py`](../../src/kits/oled-2-buttons/02-get-info.py) from this session.*

### Module 1 — Peripherals (Week 2)

| # | Lab | Introduces | New |
|---|---|---|---|
| 4 | The OLED Display | SPI, framebuffer, pixels vs text, `show()`, `config` pattern | 12 |
| 5 | Buttons and Interaction | Digital input, pull-up resistors, active-low, bounce and debounce, event loops, mode switching | 11 |
| 6 | Deploying Code and Libraries | File transfer, `lib/`, import paths, `main.py`, running standalone on power-up | 9 |

### Module 2 — Sound as Numbers (Week 3)

| # | Lab | Introduces | New |
|---|---|---|---|
| 7 | Your First Sound Capture | MEMS microphones, I²S, `readinto`, buffers, 24-bit-in-32-bit words, the `>> 8` shift, `struct.unpack` | 16 |
| 8 | Sound Levels: RMS and a VU Meter | RMS, the Thonny plotter, moving averages, smoothing, dB, bar-graph output | 13 |
| 9 | **Sampling Rate and Aliasing** *(productive failure)* | Sampling rate, Nyquist criterion, aliasing, anti-alias filtering — student plays a tone above Nyquist and watches the reading lie | 12 |
| 10 | Bit Depth, Headroom and Clipping | Quantization, bit depth, dynamic range, full scale, clipping distortion, noise floor | 12 |

### Module 3 — Discovering Frequency (Weeks 4–5) — **the cliff-fix**

This module is the single most important part of the design. It is what the previous kit lacked
entirely, and it is where a student with no DSP background either gains or loses the FFT.

| # | Lab | Introduces | New |
|---|---|---|---|
| 11 | Sine Waves: Amplitude, Frequency, Phase | Generating a sine in software, the three parameters, period vs frequency, radians | 12 |
| 12 | Adding Waves: Superposition and Beats | Superposition, constructive/destructive interference, beat frequencies, harmonics, timbre | 12 |
| 13 | **Correlation: Does My Signal Contain This Note?** | Multiply-and-sum against a test sine; large answer = present, near zero = absent. Orthogonality, the sine *and* cosine pair, phase independence | 14 |
| 14 | **Sweeping All Frequencies: You Just Built a DFT** | Loop the correlation over every test frequency. Bins, bin width, the spectrum. Worked by hand at N = 8 first | 14 |
| 15 | **Validating Your DFT on a Known Signal** | Synthetic sine in → single peak out. Ground truth, tolerance, bin-exact vs leaky frequencies, debugging by bisection | 12 |
| 16 | **Your DFT Is Too Slow** *(productive failure)* | Time it. O(n²). Doubling N quadruples the work. Real-time budget: a 512-sample frame at 12.8 kHz lasts 40 ms | 11 |

**The pedagogical spine:** a student who has written correlation by hand (Lab 13) and looped it
over frequencies (Lab 14) *owns* the DFT. The FFT then arrives in Module 4 not as magic, but as
"the same answer, computed cleverly" — and they already have a working reference implementation
to validate it against.

### Module 4 — The FFT (Week 6)

| # | Lab | Introduces | New |
|---|---|---|---|
| 17 | Divide and Conquer: From DFT to FFT | Splitting even/odd samples, recursion, why n log n, Cooley-Tukey, the power-of-two constraint | 13 |
| 18 | Bit Reversal and Twiddle Factors | Bit-reversal permutation, twiddle factors, roots of unity on the unit circle, precomputed tables, in-place computation | 14 |
| 19 | The Butterfly | The butterfly operation, complex multiply, stages, decimation in time vs frequency | 12 |
| 20 | A Complete Python FFT | Assemble the pieces; validate against the Lab 15 DFT; measure the speedup over Lab 16 | 10 |

### Module 5 — Real Spectra (Week 7)

| # | Lab | Introduces | New |
|---|---|---|---|
| 21 | Spectrum of a Real Sound | Microphone → FFT → magnitude → OLED bars. Magnitude vs power, fast magnitude approximation, bin averaging for display, log scaling | 14 |
| 22 | **Windowing and Spectral Leakage** *(productive failure)* | Non-bin-exact tone smears; Hanning, Hamming, Blackman; main lobe vs sidelobes; coherent gain | 13 |
| 23 | Peak Detection: Build a Tuner | Argmax over bins, bin → Hz conversion, frequency resolution limits, interpolation, musical note mapping | 12 |
| 24 | Real-Time Spectrum Analyzer | Frame rate, three-stage profiling (capture / FFT / draw), overlap, the real-time budget, double buffering | 13 |

*Lab 24 carries forward the old kit's best instrumentation idea: separate timers for capture,
FFT and draw — which usually reveals the FFT is not the bottleneck.*

### Module 6 — Measuring Performance (Week 8)

| # | Lab | Introduces | New |
|---|---|---|---|
| 25 | How Long Did That Take? | `ticks_us`, resolution limits, the DWT cycle counter, `machine.mem32`, enabling `TRCENA`/`CYCCNTENA`, verifying a counter before trusting it | 14 |
| 26 | **Benchmarking Methodology** | Warm-up runs, best-of-N vs mean, standard deviation, observer effect, fair comparison, reproducibility, what a benchmark excludes | 15 |
| 27 | The Abstraction Ladder | `@micropython.native`, `@micropython.viper`, boxed vs unboxed values, why viper's integer typing does not help float code | 12 |

*Reuses [`dwt_timer.py`](../../src/fft-benchmark/device/dwt_timer.py) and the Plan 02 harness.
Lab 26 uses this session's real finding: an undisciplined measurement reported 1.93× where the
honest figure was 1.26×.*

### Module 7 — Assembly Language (Week 9)

| # | Lab | Introduces | New |
|---|---|---|---|
| 28 | **Does Your CPU Have an FPU?** *(the gate)* | CPU registers, `CPUID`, `MVFR0`, instruction sets, ARMv6-M vs ARMv8-M, why the previous generation's assembly FFT could never have worked | 14 |
| 29 | Your First Assembly Function | `@micropython.asm_thumb`, registers r0–r7, `mov`/`add`/`cmp`, labels and branches, argument passing, return values | 16 |
| 30 | Talking to the FPU | `s0`–`s31`, `vldr`/`vstr`/`vadd`/`vsub`/`vmul`, `array('f')`, `uctypes.addressof`, pointers, why nothing is allocated in the timed region | 15 |
| 31 | The Butterfly in Assembly, and a Complete FFT | One stage in assembly, then the full transform; validate bit-for-bit against the Lab 20 Python FFT | 14 |

*Reuses [`04-asm-thumb-probe.py`](../../src/kits/oled-2-buttons/04-asm-thumb-probe.py),
[`05-asm-instruction-probe.py`](../../src/kits/oled-2-buttons/05-asm-instruction-probe.py) and
[`fft_asm.py`](../../src/fft-benchmark/device/fft_asm.py).*

### Module 8 — Optimization and Capstone (Week 10)

| # | Lab | Introduces | New |
|---|---|---|---|
| 32a | Making It Faster: Specialization and Branchless Code | Trivial twiddles, multiply-by-one elimination, branch prediction, precomputation, code size vs speed | 13 |
| 32b | Beyond the Assembler: Hand-Encoding an Instruction | Instruction encoding, bit fields, `data()`, fused multiply-add, the assembler is not the ISA | 13 |
| 32c | Competing Variants: Predict, Measure, Explain | Runs the Plan 02 harness; students rank variants before measuring | 10 |
| 32d | **Capstone**: Design, Benchmark and Report Your Own Variant | Experimental design, hypothesis, controls, technical writing, honest reporting of negative results | 12 |

*(Module 8 is written as 32a–d for review convenience; renumber to 32–35 if the series runs to
35 labs. See §11 open questions.)*

**Approximate total: ~350 new concepts** across 32 labs, averaging 11 per lab.

## 6. Lab Document Template

Every `docs/labs/NN-name/index.md` follows the same structure. Consistency lets students build
navigation habits, and lets us audit coverage mechanically.

```markdown
# Lab NN: Title

**Time:** ~45 minutes | **Prerequisites:** Lab NN-1 | **Hardware:** Pico 2, OLED, mic

## What You'll Build
One paragraph and a photo or screenshot of the finished result. Motivation first.

## Learning Objectives
Bloom-tagged, 3-5 items. "Explain why...", "Measure...", "Predict then verify..."

## Concepts Introduced
Bulleted, each linked to its learning-graph concept ID.

## Background
Short. Under 400 words. Links to the relevant chapter for depth.

## Wiring
Diagram or table. Omitted when the lab adds no new connections.

## Procedure
Numbered steps. Complete code early in the series, skeletons later.

## Expected Output
What success looks like — text, a plot, a photo of the display.

## Predict, Then Measure         (labs with a measurable outcome)
A prediction the student writes down before running anything.

## Troubleshooting
Symptom → cause → fix. Populated from real failures during authoring.

## Challenges
2-3 extensions, from "change a parameter" to "add a feature".

## Check Your Understanding
3-5 questions feeding the quiz-generator skill later.
```

Directory layout per lab:

```
docs/labs/07-first-sound-capture/
  index.md
  code/            MicroPython files the student runs
    07-mic-raw.py
  images/          wiring photo, output screenshot
```

Runnable code is duplicated into `src/kits/fft-lab-kit/` so the whole kit can be deployed to a
board in one command, with `docs/labs/*/code/` as the canonical copy.

## 7. Learning Graph Expansion

Current state: **200 concepts**, IDs 1–200, in 12 taxonomy categories, defined in
`learning-graph.csv` (`ConceptID,ConceptLabel,Dependencies,TaxonomyID`, dependencies
pipe-separated) and rendered via `csv-to-json.py`.

Target: **~550 concepts**, comfortably under the 600 ceiling.

### Five new taxonomy categories (12 → 17)

| Code | Name | Scope | ~Count |
|---|---|---|---|
| `TOOL` | Development Environment | Thonny, REPL, mpremote, file transfer, firmware, `main.py` | 30 |
| `MCIO` | Microcontroller I/O | GPIO, SPI, I²S, pull-ups, debounce, buffers, framebuffers | 45 |
| `AUDI` | Audio and Acoustics | MEMS mics, PCM, RMS, dB, pitch, timbre, notes, clipping | 50 |
| `ASMP` | Assembly Programming | Registers, Thumb, addressing, ABI, FPU registers, encoding | 55 |
| `LABM` | Laboratory Method | Validation-first, ground truth, debugging by bisection, prediction, honest reporting | 25 |

### Expansion of existing categories (~145 concepts)

Weighted toward the categories the labs exercise most: `SIGP` +40, `FFTA` +30, `BNCH` +30,
`MATH` +20, `FOUR` +25.

### Process

1. Extract the concept list per lab from §5 into `docs/learning-graph/lab-concepts.csv`
   (`LabNumber, ConceptLabel, TaxonomyID, Dependencies`).
2. Assign IDs 201+ in **lab order**, so ID sequence follows teaching sequence. This is a
   deliberate property: a monotonically increasing ID within a lab's prerequisites means the
   graph and the curriculum agree.
3. Merge into `learning-graph.csv`; every new concept's dependencies must point at concepts
   introduced in the *same or an earlier* lab.
4. Regenerate `learning-graph.json` (`csv-to-json.py`), quality metrics (`analyze-graph.py`),
   `concept-list.md`, `concept-taxonomy.md`, `taxonomy-distribution.md`.
5. Update `color-config.json` and `taxonomy-names.json` for the five new categories.

### Pre-existing issue to resolve first

`quality-metrics.md` currently reports **"Valid DAG Structure: ❌ No"** while simultaneously
reporting **0 cycles detected**. That contradiction should be diagnosed and fixed *before*
adding 350 concepts on top, or we will not be able to tell new breakage from old.

## 8. Course Description Updates

[`course-description.md`](../course-description.md) predates the lab series and this session's
work. Proposed changes:

- **Add a Hardware Kit section** listing the Pico 2, OLED, buttons and INMP441 with approximate
  cost, and stating that the course is hands-on throughout.
- **Revise Audience/Prerequisites** to say explicitly that no prior FFT, DSP, or assembly
  experience is assumed — currently implied but never stated, and it is the central design
  constraint.
- **Add lab-derived outcomes** to the Bloom sections. The current list is written for a reading
  course; it has no outcome covering "capture real audio," "wire a peripheral," "debug a signal
  chain," or "validate an implementation against ground truth."
- **Add a Lab Series section** with the 8-module structure and the 10-week mapping.
- **Update the Content list** with the new topic areas (I²S audio capture, real-time
  constraints, instruction encoding, measurement methodology).
- **Revise Grading** to include lab work. The current split (25% homework / 25% midterm /
  25% capstone / 25% final) has no line for 32 labs.

## 9. MicroSim and Visual Asset Opportunities

The abstract concepts in Module 3 and 4 are where an interactive simulation earns its cost.
Candidates, roughly in priority order:

| MicroSim | Lab | Why it helps |
|---|---|---|
| Correlation explorer | 13 | Drag a test frequency, watch multiply-and-sum area change. **The highest-value sim in the series.** |
| Sampling and aliasing | 9 | Slide the sample rate below Nyquist and watch a wheel spin backwards |
| Sine wave explorer | 11 | Amplitude / frequency / phase sliders |
| Superposition and beats | 12 | Add two sines, see and hear the envelope |
| DFT bin explorer | 14 | Hover a bin, see which test sine it corresponds to |
| Windowing and leakage | 22 | Toggle window functions, compare spectra side by side |
| Butterfly diagram | 19 | Animated data flow through one stage |
| Bit-reversal permutation | 18 | Watch indices shuffle |
| Twiddle factors on the unit circle | 18 | Roots of unity, rotating |
| Variant benchmark chart | 32c | Plan 02's measured results as a comparison chart |

Static assets needed: wiring diagrams per peripheral (Labs 4, 5, 7), a kit photo, and OLED
output screenshots for expected-output sections.

## 10. Repository Changes

- **Fix the navigation bug.** `mkdocs.yml` currently points "Hands-On Labs" at
  `tutorials/tutorial-1.md`, which **does not exist**. It should point at `labs/index.md`.
- `docs/labs/index.md` exists as a stub and is not in the nav; `docs/labs/01-setup/index.md`
  exists and is **empty**. Both need replacing under the new structure.
- Add `src/kits/fft-lab-kit/` containing `config.py`, `lib/ssd1306.py`, and the deployable
  copy of every lab's code.
- Add the 32 lab directories under `docs/labs/`.

## 11. Milestones

1. **Review this plan** and settle the open questions in §12.
2. **Fix the learning-graph DAG issue** and the mkdocs nav bug.
3. **Author `config.py`** and verify every peripheral on the physical board — OLED, both
   buttons, and the INMP441 with a real microphone attached. *Nothing else starts until the
   hardware is proven.*
4. **Draft the concept list** (`lab-concepts.csv`) for all 32 labs and merge into the learning
   graph. Doing this before writing prose keeps labs and graph in sync from the start.
5. **Write Module 0–2 (Labs 1–10)** end to end, including running every code file on hardware.
   Review as a batch to settle voice, depth and template before scaling.
6. **Write Module 3 (Labs 11–16)** — the highest-risk, highest-value module. Consider
   pilot-testing this module on a real beginner before continuing.
7. **Write Modules 4–8 (Labs 17–32).**
8. **Build the priority MicroSims**, starting with the correlation explorer.
9. **Update `course-description.md`** to match what was actually built.
10. **Regenerate all learning-graph artifacts** and re-run quality metrics.

## 12. Open Questions for Review

1. **Lab count.** 32 labs at ~45 minutes is roughly 24 contact hours. Is that the right weight
   for a 10-week course, or should Modules 4 and 7 compress?
   **Dan's Answer:** 32 labs @45 minutes/lab is fine.  Do not compress.  An instructor can opt to skip over some labs.
2. **Module 8 numbering** — 32a–d as written, or expand the series to 35 labs? **Dan's Answer:** expand to 35 distinct labs
3. **Does the microphone arrive in Module 2 (Lab 7) or later?** Current design brings it in
   early so that sampling, aliasing and bit depth are taught on *real* audio. The alternative is
   synthetic signals only until Module 5, which is safer but less motivating. **Dan's Answer:** Bring the microphone labs in early.  They provide a fun interactive display for students.  Ask the students to try to whistle into the mic at different pitches and see if they can see the peak frequency in an FFT move.  We want to make this class FUN!!!
4. **How much C?** The course description lists "C Language" and "Python Libraries" as content,
   but this lab series is MicroPython and assembly throughout. Either the labs need a C strand,
   or the course description should be narrowed. Related: Plan 02 identified fixed-point Q15 as
   genuinely blocked without a C toolchain — that is the natural home for a C module if we want
   one.  **Dan's Answer:** We need to mention C because it is used in other courses, but it is not the intent of this course to go in depth.  Give a basic coverage and some comparison of Assembler, C and MicroPython and the tradeoffs of each.  Note that since we can call both C and Assembler from MicroPython that we will usually prefer the solution that gives the best results.  Very few people will modify assembly language code in production since there will usually be a library of well tested assembly-language functions.  Reading both assembly language and C and having a crystal clear image of the way data moves through the hardware is the key in this course.
5. **Capstone scope.** "Design your own variant" assumes assembly fluency by Week 10. A gentler
   alternative is "benchmark an existing variant on a new signal class and report."  **Dan's Answer:** - provide options for the capstone scope and allow the instructor to select the options.  Note that an Instructor's Guide MUST be generated after most of the hands-on labs and the chapter content has been generated.  Please remind me to run the /book-installer Instructor's guide after the chapters have been written.
6. **Assessment.** Are labs graded on completion, on a submitted artifact, or on the
   check-your-understanding questions? This determines how much scaffolding each lab needs.  **Dan's Answer:** it is up to the instructor to decide if labs will be graded.  Provide simple check-your-understanding at the end of each hands-on-lab, but we will use the quiz-generator skill to add formal quiz questions to each chapter directory later.

## 13. References

- [Plan 01](01-fft-test-plan.md), [Plan 02](02-competing-variants.md) — the implementation this series teaches
- [`src/fft-benchmark/variants/README.md`](../../src/fft-benchmark/variants/README.md) — the five architecture lessons, written for lesson generation
- [`arm-programming-guide/`](../../arm-programming-guide/) — Cortex-M33 r1p0 user guide, matched to this silicon
- `spectrum-analyzer/src/fft-kit-1/` — the previous kit; Peter Hinch's `micropython-fourier` and Mike Teachman's I²S examples
- [Cornell ECE4760 FFT/iFFT on the Pico](../cornell-labs/pico-example.md) — the 512-sample / 12.8 kHz framing this course uses
