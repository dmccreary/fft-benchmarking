---
title: Complete 8-Point FFT Flow Graph
description: The full three-stage, twelve-butterfly data flow of a radix-2 FFT, with click-to-highlight for any butterfly, stage, or output path.
image: /sims/complete-8-point-fft-flow-graph/complete-8-point-fft-flow-graph.png
og:image: /sims/complete-8-point-fft-flow-graph/complete-8-point-fft-flow-graph.png
twitter:image: /sims/complete-8-point-fft-flow-graph/complete-8-point-fft-flow-graph.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Complete 8-Point FFT Flow Graph

<iframe src="main.html" height="477px" width="100%" scrolling="no"></iframe>

[Run the Complete 8-Point FFT Flow Graph MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/complete-8-point-fft-flow-graph/main.html"
        height="477px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

This is the whole algorithm on one screen. Eight inputs on the left in
bit-reversed order, three stages of four butterflies each, eight outputs on the
right in natural order. Twelve butterflies total, and that is a complete
8-point FFT.

The thing worth looking at closely is what changes between stages and what does
not.

**What does not change:** every stage performs exactly four butterflies. Four,
four, four. That is $N/2$, and it holds at every stage of every radix-2 FFT.

**What does change:** the *span* — how far apart the paired rows sit.

| Stage | Span | Pairs |
|-------|------|-------|
| 1 | 1 | (0,1) (2,3) (4,5) (6,7) |
| 2 | 2 | (0,2) (1,3) (4,6) (5,7) |
| 3 | 4 | (0,4) (1,5) (2,6) (3,7) |

The span doubles each stage. After $\log_2 N$ stages it has reached $N/2$ and
every input has had a chance to influence every output.

## The Twiddles Are Not Uniform Either

Stage 1 is **entirely $W^0$** — every twiddle is 1, so no multiplication is
needed at all. Stage 2 uses $W^0$ and $W^2$; $W^2 = -i$, which is a swap and a
sign flip rather than a real multiply. Only stage 3 needs genuine complex
multiplications, and only for half its butterflies.

This is why hand-optimized FFT implementations often special-case the first stage
entirely: it is a quarter of the butterflies and none of the multiplies.

## How to Use

1. Click a **stage label** to highlight all four of its butterflies. Compare the
   shape of stage 1 against stage 3.
2. Click an individual **butterfly** to read its input rows, twiddle, and span.
3. Click an **output node** on the right. Every butterfly and input feeding it
   lights up. Notice that *all eight* inputs contribute — each output still
   depends on the entire record, exactly as the DFT definition requires.
4. Count the twiddle labels in stage 1. All $W^0$. Now count in stage 3.
5. Verify the total: 3 stages × 4 butterflies = 12, against the DFT's 64
   multiply-accumulates.

## How to Read the Inputs

The left column is labeled x[0], x[4], x[2], x[6], x[1], x[5], x[3], x[7] — the
bit-reversed order from the recursion tree. Feeding the FFT in this order is
what allows every butterfly afterward to read and write the same array positions
in place, with no extra buffer.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- The butterfly operation
- Bit-reversed ordering from the recursion tree

### Learning Objective

Students will be able to **examine** the complete three-stage flow graph and
**distinguish** how butterfly pairings change shape from stage to stage even
though every stage performs exactly four butterflies.

### Activities

1. **Compare stages** (5 min): Students highlight each stage in turn and record
   the pairings, then state the span rule.
2. **Trace an output** (5 min): Students trace X[3] and count how many inputs
   contribute.
3. **Count the multiplies** (4 min): Students count how many butterflies need a
   genuine complex multiply once $W^0$ and $W^2$ are excluded.

### Assessment

Ask: "In a 16-point FFT, how many stages are there, how many butterflies per
stage, and what is the span at the final stage?" (4 stages, 8 butterflies each,
span 8.)

## Related Resources

- [Chapter 12: Building the FFT](../../chapters/12-building-the-fft/index.md)

## References

1. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm) — the radix-2 decimation-in-time structure drawn here.
2. [Butterfly diagram](https://en.wikipedia.org/wiki/Butterfly_diagram) — the flow-graph notation.
3. [Bit-reversal permutation](https://en.wikipedia.org/wiki/Bit-reversal_permutation) — why the inputs are in that order.
