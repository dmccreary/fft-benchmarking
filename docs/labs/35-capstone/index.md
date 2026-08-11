# Lab 35: Capstone — Design, Benchmark and Report

**Time:** one to three weeks  |  **Prerequisites:** [Lab 34](../34-variants/index.md)  |  **Hardware:** Pico 2 + kit

!!! mascot-welcome "Your turn"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Thirty-four labs ago you'd never opened Thonny. Now you can capture audio, transform it,
    hand-write the assembly that does the transforming, and — the part most engineers never
    learn — measure it honestly. Time to use all of it on a question nobody handed you.

## What You'll Deliver

An experiment of your own: a question, a hypothesis written down **before** measuring, an
implementation, measurements taken under the discipline of Lab 26, and a written report that
states what your benchmark excludes.

A negative result, honestly reported and explained, earns full marks. An unexplained positive
one does not.

## Learning Objectives

- **Formulate** a research question with a measurable answer
- **Design** an experiment with controls and a stated hypothesis
- **Implement** a variant or application using the techniques from Modules 4–8
- **Measure** with warm-up, best-of-N, and stated exclusions
- **Report** results including limitations and negative findings

## Concepts Introduced

| ID | Concept |
|---|---|
| 478 | Experimental Design |
| 479 | Research Question |
| 480 | Independent Variable |
| 481 | Dependent Variable |
| 482 | Methodology Section |
| 483 | Results Presentation |
| 484 | Limitations Statement |
| 485 | Conclusion Drawing |
| 486 | Project Scoping |
| 487 | Peer Review |

## Choosing a Project

Your instructor will select which of these tracks are available. They differ in difficulty, not
in how much you'll learn.

### Track A — Optimize (hardest)

Invent a new FFT variant and measure it against the six from Lab 34.

| Idea | Why it's interesting |
|---|---|
| **Radix-4** | ~25% fewer multiplies in theory. But it needs four complex values plus three twiddles live at once, and the baseline already spills registers. Does the saving survive the spill traffic? **Genuinely open — nobody in this course has measured it.** |
| **Dual-core** | The RP2350 has two M33 cores and `_thread` is available. The transform is under a millisecond, so synchronization may cost more than it saves. Expected to disappoint, which makes it instructive. |
| **Interleaved layout** | Store `[re,im]` pairs to halve address arithmetic. Plan 02 measured the *kernel* at 1.28× — the fastest of any variant — but conversion cost destroyed it. Can you avoid the conversion? |
| **Fixed-point Q15** | Would need a C toolchain, since MicroPython's assembler exposes no DSP instructions (Lab 28 proves it). A scoping study is a legitimate deliverable. |

### Track B — Apply

Build something that uses the FFT for a real purpose.

- A **spectrogram** that scrolls, showing frequency over time
- A **DTMF decoder** that recognises phone keypad tones
- A **vibration monitor** that learns a machine's normal spectrum and flags changes
- A **musical instrument identifier** using harmonic ratios from Lab 12
- A **voice-activity detector** distinguishing speech from silence and noise

Deliverable: a working device *plus* measurements showing it meets its real-time deadline.

### Track C — Investigate

Answer a question with an experiment. No new FFT required.

- How does **FFT size** trade resolution against frame rate? Map the curve.
- Does **clock speed** scale performance linearly? Try 100–200 MHz.
- How much does **window choice** cost in cycles, and is Hanning always right?
- Does the **Lab 24 stage profile** change with N? At what size does drawing overtake the FFT?
- How accurate is the **Lab 23 tuner** against a reference source, across its range?

### Track D — Replicate and Challenge

Take a result from these labs and try to break it.

- Lab 33 found VFMA worth ~0%. Under what conditions would it pay?
- Lab 32 found specialization worth 1.11×. Does that hold at N=128? N=2048?
- Lab 26 claims best-of-N beats mean. Construct a case where it misleads.

Replication is real science and is treated as such here.

## Required Structure

### 1. Question and hypothesis

State both **before** measuring. Include your reasoning — a hypothesis without a "because" is a
guess.

> *"Processing two frames per call should save 5–10%, because Lab 24 showed loop control is
> roughly 30% of the cost and this halves the per-frame setup."*

### 2. Method

- What varies (independent variable), what you measure (dependent variable)
- What you hold constant
- Test signals and why you chose them (Lab 15)
- Trials, warm-up, and the statistic you report (Lab 26)

### 3. Correctness

Speed numbers are meaningless until correctness is established. Show your variant agrees with a
trusted reference on every test signal, with the tolerance you chose and why (Lab 15).

### 4. Results

Tables and, where useful, a chart. Report **best, mean and spread** — never a bare number.

### 5. Discussion

- Did it match your hypothesis? By how much?
- If not, what does the gap reveal about the machine?
- What does your benchmark **exclude**?
- What would you measure next?

### 6. Limitations

At minimum: one board, one firmware, one temperature, one set of signals. Say so.

## The Starter Template

```python
--8<-- "docs/labs/35-capstone/code/35-capstone-template.py"
```

It already handles the things that are easy to get wrong: allocating before measuring (Lab 32),
discarding a warm-up (Lab 26), reporting spread, checking correctness first (Lab 15), and
stating exclusions.

!!! mascot-tip "Establish your noise floor first"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Run the template unmodified — comparing the baseline against *itself*. It reports about
    **0.996×**, which tells you your harness has roughly ±0.4% of noise. Any effect smaller
    than that is not a result, it's weather. Measure this before you trust a small number.

## Assessment

| Criterion | What good looks like |
|---|---|
| **Question** | Specific, measurable, with a stated reason for expecting the answer |
| **Method** | Controlled, reproducible, exclusions stated |
| **Correctness** | Verified before speed, tolerance justified |
| **Measurement** | Warm-up, best-of-N, spread reported |
| **Honesty** | Negative results reported plainly; predictions not retro-fitted |
| **Insight** | Explains *why*, not just *what* |

!!! mascot-warning "The one unforgivable error"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Changing your hypothesis after seeing the data and presenting it as a prediction. Every
    engineer is tempted; it destroys the value of the measurement. If you were wrong, say you
    were wrong — that page is usually the most interesting one in the report.

## What You've Actually Learned

Look back at the numbers you've measured yourself:

| Implementation | Time per 512-point FFT | vs. real-time budget |
|---|---|---|
| Brute-force DFT (Lab 16) | ~21,000 ms | 530× over |
| Python FFT (Lab 20) | 140 ms | 3.5× over |
| Assembly FFT (Lab 31) | 0.85 ms | **2.1% of budget** |
| Best variant (Lab 34) | 0.59 ms | **1.5% of budget** |

A 35,000× improvement from your first working transform to your best one — on a chip that
costs less than a sandwich.

But the durable skill isn't the assembly. It's that you can now **look at a performance claim
and ask the right questions**: what was excluded, was there a warm-up, is that best or mean, and
does the fast version still compute the right answer?

That transfers to every system you'll ever work on.

!!! mascot-celebration "You made it, signal hunter"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Thirty-five labs from "what's a Thonny?" to hand-encoded ARM instructions and a
    benchmark you can defend. You taught a $5 chip to listen to the world and understand
    it in real time. **Now that's a superpower.** Go build something with it.

---

**Previous:** [Lab 34](../34-variants/index.md)  |  [Back to all labs](../index.md)
