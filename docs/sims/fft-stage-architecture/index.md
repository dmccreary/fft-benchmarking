---
title: FFT Stage Architecture
description: See which parts of a full FFT stay in Python and which single part is hand-written assembly, and why execution frequency decides the split.
image: /sims/fft-stage-architecture/fft-stage-architecture.png
og:image: /sims/fft-stage-architecture/fft-stage-architecture.png
twitter:image: /sims/fft-stage-architecture/fft-stage-architecture.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# FFT Stage Architecture

<iframe src="main.html" height="517px" width="100%" scrolling="no"></iframe>

[Run the FFT Stage Architecture MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/fft-stage-architecture/main.html"
        height="517px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A hand-optimized FFT is not written in assembly. Almost all of it is written in
Python, and one small routine is written in assembly. This diagram shows the
split, and — more usefully — shows the number that decides it.

The top band holds everything Python does. The twiddle table is computed once,
at startup. The bit-reversal permutation runs once per transform. The stage
parameter block is rebuilt once per stage, which for a 512-point transform means
nine times. Add those up and Python is doing eleven things.

The bottom band holds the single assembly routine. For a 512-point transform it
runs 2,304 times, because a radix-2 FFT performs N/2 butterflies in each of
log₂(N) stages: 256 × 9 = 2,304. At roughly eight instructions per butterfly,
that one routine accounts for over eighteen thousand instructions per transform.

Eleven versus 2,304. That ratio is the entire argument for where the boundary
sits. It is not that the butterfly is the hardest code to write — it is that the
butterfly is the only code that runs often enough for a saved cycle to be worth
anything. Save one cycle in the butterfly and you save 2,304 cycles per
transform. Save one cycle in the parameter-block builder and you save nine.

The orange arrow is worth clicking on its own. Only one thing crosses the
language boundary — a five-address parameter block — and it crosses nine times,
not 2,304 times. A design that called into assembly once per *butterfly* would
have spent more time on call overhead than on butterflies.

Change N with the selector and watch the ratio move. Doubling N roughly doubles
the butterfly count while adding a single Python step.

## How to Use

1. Click each of the three Python boxes in turn. Each explains what it does, how
   often it runs, and why that frequency keeps it on the Python side.
2. Click the large green `run_stage_hotloop` box for the counterargument.
3. Click the orange arrow to see what actually crosses the boundary, and how
   often.
4. Change **FFT size N** between 256, 512, and 1024. Watch the butterfly count
   and the Python step count separately — one grows much faster than the other.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 12-15 minutes

**Prerequisites:**

- A radix-2 FFT has log₂(N) stages of N/2 butterflies each
- Assembly is faster per instruction but far slower to write and debug
- Calling between languages has a per-call cost

**Learning Objective:** Differentiate which parts of a full FFT implementation
belong in Python and which belong in hand-written assembly, and justify the
placement of each part by its execution frequency.

**Activities:**

1. **Predict first (2 min).** Before opening the simulation, ask students which
   parts of an FFT they would write in assembly. Most name the twiddle
   computation, because trigonometry feels expensive. Record the guesses.
2. **Count the executions (4 min).** Have students click each box and write down
   the run count. The twiddle table — the guess most students make — runs once.
3. **Compute the payoff (4 min).** For each box, ask: if you made this piece
   twice as fast, how many cycles would one transform save? The answer separates
   the four boxes cleanly.
4. **Examine the boundary (3 min).** Click the arrow. Ask what would change if
   the assembly routine handled one butterfly per call instead of one stage per
   call. (The boundary would be crossed 2,304 times, and the call overhead alone
   would likely exceed the butterfly work.)
5. **Scale it (2 min).** Switch to N = 1024. Butterflies go from 2,304 to 5,120
   while Python steps go from 11 to 12.

**Assessment:** A student proposes rewriting the bit-reversal permutation in
assembly to speed up the transform. Using the run counts in this diagram,
explain why the payoff is small, and identify what measurement you would take
before agreeing.

## Related Resources

- [Complete 8-Point FFT Flow Graph](../complete-8-point-fft-flow-graph/index.md) — where the butterfly count comes from
- [Iterative FFT Stage Loop Visualizer](../iterative-fft-stage-loop-visualizer/index.md) — the stage loop that the parameter block drives
- [Address and Byte Offset Explorer](../address-byte-offset-explorer/index.md) — the addressing the hot loop uses
- [Register Tracer](../register-tracer/index.md) — reading the instructions inside the loop

## References

- [ARM Cortex-M33 Devices Generic User Guide](https://developer.arm.com/documentation/100235/latest/) — instruction timing for the butterfly's operations
- [CMSIS-DSP Library](https://github.com/ARM-software/CMSIS-DSP) — a production FFT with exactly this Python-side/assembly-side division of labour
