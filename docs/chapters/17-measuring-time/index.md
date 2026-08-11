---
title: "Measuring Time: The DWT Cycle Counter"
description: How the ARM DWT cycle counter measures execution time at 6.7-nanosecond resolution, and the vocabulary used for every benchmark in the rest of the course
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Measuring Time: The DWT Cycle Counter

## Summary

This chapter introduces the ARM DWT cycle counter as a 6.7-nanosecond-resolution timing tool, covering the registers involved, wraparound handling, and the conversion from raw cycle counts to microseconds. It establishes execution time, throughput, and speedup factor as the vocabulary used for every performance comparison in the rest of the course. This is the instrument the rest of the benchmarking module depends on.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. Benchmarking
2. CYCCNT Register
3. Clock Cycles
4. Counter Verification
5. Counter Wraparound
6. Cycle Counter
7. Cycles To Microseconds
8. DEMCR Register
9. DWT Unit
10. Execution Time
11. FFTs Per Second
12. Microsecond Timer
13. Microseconds Per FFT
14. Millisecond Timer
15. Performance Metrics
16. Register Bit Manipulation
17. Speedup Factor
18. Timer Resolution

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)

---

!!! mascot-welcome "Time to transform — into a benchmarking instrument!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You have a working FFT. You even have a rough sense that it feels faster than the DFT
    from Module 3. "Feels faster" is where most benchmarking goes wrong — so before you
    compare a single number, you need an instrument you can trust down to the nanosecond.
    Let's build it.

You already know your FFT is correct — Chapter 12 validated every output against the DFT
you proved correct in Chapter 9. Correctness answers *what* the algorithm computes.
**Benchmarking** answers a different question entirely: *how long does it take, measured
in a way another person could reproduce and trust?* Benchmarking is the disciplined
practice of measuring a program's performance under controlled, repeatable conditions,
rather than eyeballing a stopwatch or trusting a gut feeling about which version "seems
snappier." Every claim this course makes from here forward — 146× faster, 3.5× over
budget, 0.59 milliseconds — rests on the instrument this chapter builds.

## The Unit Underneath Every Measurement: Clock Cycles

A microcontroller does not have a built-in sense of "seconds." It has a crystal oscillator
ticking at a fixed rate, and every instruction the CPU executes takes some whole number of
those ticks. Each tick is called a **clock cycle** — the smallest unit of time the
processor's digital logic advances by. The Pico 2's Cortex-M33 core runs at 150 MHz by
default, meaning 150 million clock cycles occur every second. One clock cycle therefore
lasts:

\[
\frac{1}{150{,}000{,}000 \text{ Hz}} = 6.67 \text{ nanoseconds}
\]

That 6.67-nanosecond figure is not a marketing number — it is the **timer resolution**
you get for free the moment you can count cycles directly, instead of relying on a
software clock that only updates every millisecond. A millisecond-resolution timer cannot
distinguish between an operation that takes 100 microseconds and one that takes 200 —
both would round to "0 ms" or "1 ms." Measuring in cycles is the difference between a
ruler with millimeter marks and one with no marks at all.

!!! mascot-thinking "Why not just use `time.ticks_ms()`?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    MicroPython's built-in millisecond timer is perfect for timing a whole animation loop.
    But a single 512-point FFT on this chip finishes in well under a millisecond once
    you're deep into the course — timing it with a millisecond clock is like timing a
    sprinter with a sundial. You need something that ticks 150 million times a second, not
    once every 1,000.

## The DWT Unit: A Free-Running Hardware Counter

Fortunately, the Cortex-M33 already contains exactly this instrument, and it costs nothing
extra to use. The **DWT unit** — short for Data Watchpoint and Trace — is a block of
debug-and-trace hardware built into every Cortex-M3, M4, and M33 core, originally designed
to support breakpoints and instruction tracing. Buried inside it is a 32-bit hardware
**cycle counter**: a register that increments by exactly one, every single clock cycle,
with zero software overhead, for as long as it is enabled.

Two memory-mapped registers control this counter. The first is the **DEMCR register**
(Debug Exception and Monitor Control Register), which holds a master switch for the whole
debug-and-trace subsystem — bit 24, named `TRCENA`, must be set to `1` before the DWT
unit will do anything at all. The second is the **CYCCNT register**, the 32-bit counter
itself, which lives inside the DWT unit and only starts counting once its own enable bit
(`CYCCNTENA`, bit 0 of the DWT control register) is also set to `1`.

The following table summarizes the three registers involved, now that you know what each
one does:

| Register | Address | Purpose |
|---|---|---|
| DEMCR | 0xE000EDFC | Master enable (`TRCENA`, bit 24) for the debug/trace subsystem |
| DWT.CTRL | 0xE0001000 | Enables the cycle counter itself (`CYCCNTENA`, bit 0) |
| DWT.CYCCNT | 0xE0001004 | The 32-bit free-running cycle counter you read |

#### Diagram: DWT Register Explorer

<iframe src="../../sims/dwt-register-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>DWT Register Explorer</summary>
Type: microsim
**sim-id:** dwt-register-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand (L2) — explain, interpret
Learning objective: Explain how the DEMCR and DWT.CTRL enable bits gate access to the CYCCNT counter, and interpret a 32-bit register as individually addressable bits.

Canvas layout:
- Top (300px): Three register boxes drawn as 32-bit grids (DEMCR, DWT.CTRL, DWT.CYCCNT), each bit rendered as a small clickable square, MSB on the left
- Bottom (150px): Step-through controls and a status readout

Visual elements:
- DEMCR register: only bit 24 (TRCENA) highlighted as interactive; all other bits shown grayed out and labeled "reserved / not used here"
- DWT.CTRL register: only bit 0 (CYCCNTENA) highlighted as interactive
- DWT.CYCCNT register: all 32 bits shown as a live binary readout of a running count, with a decimal value printed below

Data Visibility Requirements:
  Stage 1: Show all three registers at power-on, every bit 0, CYCCNT frozen at 0
  Stage 2: Learner clicks the TRCENA bit in DEMCR — it flips to 1, status readout says "Trace subsystem enabled, DWT unit powered but cycle counter still off"
  Stage 3: Learner clicks CYCCNTENA in DWT.CTRL — it flips to 1, CYCCNT begins visibly incrementing in the display (simulated at a readable rate, not real 150 MHz)
  Stage 4: Learner clicks CYCCNTENA off again — CYCCNT freezes at its current value, demonstrating the counter holds its value rather than resetting

Interactive controls:
- Clickable bit squares (only the two functional bits are clickable; others show a tooltip "not used in this course" on hover)
- Button: "Reset to power-on state"
- Toggle: "Simulated speed" (slow / medium) purely so the incrementing CYCCNT display is human-readable

Instructional Rationale: Step-through with data visibility is appropriate because the
Understand-level objective requires the learner to trace cause and effect between two
gating bits and a running counter with concrete state at each stage, not a continuous
animation that would obscure which bit caused which change.

Implementation: p5.js, register bits stored as an array of booleans per register, redraw on click
</details>

## Register Bit Manipulation: Turning the Counter On

Both enable bits live inside 32-bit registers alongside other bits you must not disturb,
so enabling the DWT unit is an exercise in **register bit manipulation** — reading or
writing individual bits of a register without touching the rest. The standard technique
uses a *bitmask*: a value with a `1` in exactly the position you care about and `0`
everywhere else, combined with the OR operator to set a bit without changing its
neighbors.

!!! mascot-tip "Reading the code below"
    ![Echo giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    `machine.mem32[address]` in MicroPython reads or writes a 32-bit value directly at a
    memory address — this is how you talk to hardware registers that have no Python
    wrapper. The `|=` operator is "read the current value, OR in this bit, write it back,"
    which sets one bit to `1` while leaving every other bit exactly as it was.

```python
import machine

DEMCR    = 0xE000EDFC
DWT_CTRL = 0xE0001000
DWT_CYCCNT = 0xE0001004

TRCENA     = 1 << 24   # bit 24 of DEMCR
CYCCNTENA  = 1 << 0    # bit 0 of DWT.CTRL

machine.mem32[DEMCR] |= TRCENA          # enable the trace/debug subsystem
machine.mem32[DWT_CTRL] |= CYCCNTENA    # start the cycle counter
machine.mem32[DWT_CYCCNT] = 0           # reset the counter to a known value
```

With those three lines run once at startup, `machine.mem32[DWT_CYCCNT]` now returns the
current cycle count on every read, incrementing once per clock cycle with no further setup.

## Counter Verification: Trust, but Check

!!! mascot-warning "Never trust a clock you haven't checked"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A typo in a register address, a board running at an unexpected clock speed, or a
    counter that silently never got enabled can all produce numbers that *look*
    plausible and are completely wrong. Before you time anything real, verify the
    instrument.

**Counter verification** means confirming the cycle counter actually advances at the rate
you expect, before trusting a single measurement it produces. The most direct check
compares CYCCNT against a timer you already trust: read CYCCNT, sleep for exactly 100
milliseconds using MicroPython's built-in **millisecond timer**, read CYCCNT again, and
check that the difference is close to `150,000,000 × 0.1 = 15,000,000` cycles. If your
board runs at 150 MHz and the counter is wired up correctly, the measured cycle delta
should land within a fraction of a percent of that prediction — any larger gap means
something upstream is wrong, and it is far better to find that out now than after you've
recorded a table of "results."

## Counter Wraparound: What Happens After 28.6 Seconds

CYCCNT is only 32 bits wide, which means it can count from 0 up to \(2^{32} - 1 =
4{,}294{,}967{,}295\) before it runs out of room. At 150 MHz, that ceiling arrives after:

\[
\frac{4{,}294{,}967{,}295}{150{,}000{,}000 \text{ Hz}} \approx 28.6 \text{ seconds}
\]

At that point the counter does not stop or raise an error — it silently rolls back over
to 0 and keeps counting. This behavior, called **counter wraparound**, is completely
normal and by design, but it breaks the naive way of computing elapsed time if you are not
careful.

!!! mascot-encourage "This trips up experienced programmers too"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If subtracting two register values to get "elapsed time" and getting a negative or
    absurdly large number feels confusing at first, you're in good company — wraparound
    bugs have shipped in real production firmware. The fix below is a pattern worth
    memorizing, not just for this course.

Suppose you read `start = 4,294,960,000` right before wraparound, do some work, and read
`end = 5,000` right after. A naive `end - start` gives a large negative number, which is
nonsense for an elapsed time. The reliable fix is to compute the difference using
unsigned 32-bit arithmetic, which makes the wraparound cancel out automatically:

```python
elapsed = (end - start) & 0xFFFFFFFF
```

Masking the subtraction with `& 0xFFFFFFFF` keeps only the low 32 bits of the result,
which is exactly the correct wrapped-around elapsed cycle count as long as the *true*
elapsed time was less than one full wraparound period (28.6 seconds) — comfortably true
for every measurement in this course, since a single FFT takes at most a few hundred
milliseconds even in the slowest pure-Python version.

#### Diagram: Counter Wraparound Visualizer

<iframe src="../../sims/counter-wraparound-visualizer/main.html" width="100%" height="557px" scrolling="no"></iframe>

<details markdown="1">
<summary>Counter Wraparound Visualizer</summary>
Type: microsim
**sim-id:** counter-wraparound-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply (L3) — calculate, demonstrate
Learning objective: Apply the masked-subtraction formula to correctly compute elapsed cycles across a wraparound event, and demonstrate why naive subtraction fails.

Canvas layout:
- Top (250px): A circular clock face representing the 32-bit counter range (0 at top, wrapping clockwise back to 0), with a moving dot showing the current CYCCNT value
- Bottom (250px): Two side-by-side calculator panels — "Naive subtraction" and "Masked subtraction" — each showing start value, end value, and computed elapsed time

Visual elements:
- Circular counter dial scaled to a compressed demo range (e.g. 0 to 1,000 "demo cycles") rather than the real 4.29 billion, so wraparound is visible within a few seconds of simulated time
- A draggable "start" marker and "end" marker on the dial
- Naive panel shows `end - start` including negative results in red when wraparound occurred
- Masked panel shows `(end - start) & 0xFFFFFFFF` always producing a correct positive elapsed value, shown in green

Interactive controls:
- Slider: place the start marker anywhere on the dial
- Slider: place the end marker anywhere on the dial (including past the wraparound point)
- Checkbox: "Force a wraparound between start and end"
- Button: "Compute both ways"

Default parameters:
- Start marker: 950 (near the wraparound point on the compressed 0-1000 demo range)
- End marker: 50 (just after wraparound)

Behavior:
- When start > end on the dial (wraparound occurred), the naive panel visibly produces a negative or nonsensical number
- The masked panel always produces the correct short arc-length between start and end going clockwise
- A short text explanation updates live: "Naive subtraction fails here because the counter wrapped. Masked subtraction succeeds because it wraps the math to match the wrapped hardware."

Instructional Rationale: A draggable dial with two live calculators lets the learner
directly cause and observe the failure mode (Apply-level) rather than only reading about
it, which matches the objective of being able to compute correct elapsed time under
wraparound conditions.

Implementation: p5.js, circular dial drawn with arc(), demo range 0-1000 mapped conceptually to the real 32-bit range in the text explanation
</details>

## From Cycles to Time: Cycles to Microseconds

A raw cycle count is precise but not intuitive — nobody thinks in cycles when comparing
implementations. The conversion **cycles to microseconds** turns that raw count into a
human-readable duration, using the clock frequency as the conversion factor:

\[
\text{microseconds} = \frac{\text{elapsed cycles}}{\text{clock frequency in MHz}}
\]

At 150 MHz, dividing an elapsed cycle count by 150 gives elapsed microseconds directly.
A **microsecond timer** wraps this conversion into a single reusable function, and a
**millisecond timer** simply divides that result by 1,000 again for the rare
long-running operation you want to describe in coarser units:

```python
def elapsed_us(start, end, clock_mhz=150):
    cycles = (end - start) & 0xFFFFFFFF
    return cycles / clock_mhz

def elapsed_ms(start, end, clock_mhz=150):
    return elapsed_us(start, end, clock_mhz) / 1000
```

From here forward, every timing measurement in this course goes through a function that
looks like `elapsed_us` — read CYCCNT before, read it after, mask the subtraction, divide
by the clock frequency. That is the entire measurement discipline this chapter exists to
teach.

## The Vocabulary of Performance Metrics

With a working timer in hand, you need a shared vocabulary for talking about what it
measures — a small set of **performance metrics** used consistently for the rest of the
course.

Before comparing them, let's define each term precisely, since the next several chapters
use all four without re-explaining them:

- **Execution time** — the elapsed time, in microseconds or milliseconds, for one
  specific run of a specific operation. This is the direct output of `elapsed_us`.
- **Throughput** — how much *work* completes per unit of time, rather than how long one
  unit of work takes. For this course, the natural throughput metric is **FFTs per
  second**: how many complete 512-point transforms the chip could compute if it ran back
  to back, computed as \(1{,}000{,}000 / \text{microseconds per FFT}\).
- **Microseconds per FFT** — the execution time of one complete FFT, specifically —
  the number this course reports most often, because it maps directly onto the real-time
  frame budget from Module 2.
- **Speedup factor** — a ratio comparing two execution times for the *same* task:
  \(\text{old time} / \text{new time}\). A speedup factor of 146 means the new version
  finishes in 1/146th of the time the old version took — this is exactly the number
  Chapter 12 reported for the recursive FFT versus the brute-force DFT.

Now that each term has a precise definition, the table below simply organizes them —
it introduces no new concepts, only a side-by-side comparison of the ones just explained:

| Metric | Answers | Units | Formula |
|---|---|---|---|
| Execution time | How long did *this one run* take? | microseconds (μs) | `elapsed_us(start, end)` |
| Microseconds per FFT | Execution time, specifically for one FFT | μs | same as execution time, applied to an FFT call |
| FFTs per second | How much throughput does this give me? | FFTs/sec | \(1{,}000{,}000 / \mu s\text{ per FFT}\) |
| Speedup factor | How many times faster is version B than version A? | unitless ratio | \(\text{time}_A / \text{time}_B\) |

#### Diagram: Performance Metrics Calculator

<iframe src="../../sims/performance-metrics-calculator/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Performance Metrics Calculator</summary>
Type: microsim
**sim-id:** performance-metrics-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply (L3) — calculate, use
Learning objective: Apply the conversion formulas to compute execution time, throughput, and speedup factor from a raw cycle count the learner controls.

Canvas layout:
- Left (300px): Input controls
- Right (300px): Live-computed output panel

Visual elements:
- Slider: "Elapsed cycles" (range 1,000 to 30,000,000, default 21,000 representing a fast operation)
- Slider: "Clock frequency (MHz)" (range 50 to 250, default 150)
- Slider: "Comparison time (μs), for speedup" (range 1 to 200,000, default 20,500 representing the brute-force DFT time from Chapter 16)
- Output readout, updating live: Execution time (μs and ms), FFTs per second, Speedup factor vs. the comparison time

Interactive controls:
- All three sliders drag live, recalculating every field on the right instantly
- Button: "Load Chapter 12 example" — sets sliders to reproduce the recursive-FFT-vs-DFT numbers already stated in the course (140 ms FFT vs. ~21,000 ms DFT)

Default parameters:
- Elapsed cycles: 21,000,000 (representing 140 ms at 150 MHz)
- Clock frequency: 150 MHz
- Comparison time: 21,000,000 μs (21 seconds, the brute-force DFT time)

Behavior:
- Dragging any slider immediately recomputes and redraws all four output metrics
- Speedup factor updates to reflect the live ratio, so the learner can watch the number ~146 emerge from real values rather than being told it

Instructional Rationale: Apply-level objectives call for parameter exploration with a
calculator pattern rather than animation — the learner directly manipulates the inputs
that appear in the formulas just defined and immediately sees the four vocabulary terms
computed from them, reinforcing the definitions through use.

Implementation: p5.js, plain arithmetic on slider values, redraw() on every input event
</details>

## Checking Your Understanding

Before moving on to Chapter 18, make sure the wraparound arithmetic is second nature —
it will not be re-explained.

??? question "If `start = 4,294,965,000` and `end = 3,000`, what is the correctly masked elapsed cycle count? Click to check."
    Using `(end - start) & 0xFFFFFFFF`: `3,000 - 4,294,965,000 = -4,294,962,000`.
    Masking to 32 bits wraps this to `4,296 - 1 = ` … more directly: the true elapsed
    distance is `(2^32 - 4,294,965,000) + 3,000 = 2,295 + 3,000 = 5,295` cycles. At
    150 MHz that's about **35 nanoseconds** — a perfectly ordinary, small elapsed time
    that a naive subtraction would have reported as a huge negative number instead.

!!! mascot-celebration "You built the instrument"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Not bad for a $5 chip! You can now measure any operation on this board down to 6.7
    nanoseconds, handle the one edge case that trips up most first attempts, and speak
    the same performance vocabulary the rest of this course uses. Chapter 18 puts this
    instrument to work — and shows you all the ways a careless benchmark can lie even
    with a perfectly good timer in hand.
