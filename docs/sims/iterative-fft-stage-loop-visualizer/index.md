---
title: Iterative FFT Stage Loop Visualizer
description: Step through the iterative FFT's stage loop on an 8-element array and watch the span double while the butterfly count never moves.
image: /sims/iterative-fft-stage-loop-visualizer/iterative-fft-stage-loop-visualizer.png
og:image: /sims/iterative-fft-stage-loop-visualizer/iterative-fft-stage-loop-visualizer.png
twitter:image: /sims/iterative-fft-stage-loop-visualizer/iterative-fft-stage-loop-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Iterative FFT Stage Loop Visualizer

<iframe src="main.html" height="447px" width="100%" scrolling="no"></iframe>

[Run the Iterative FFT Stage Loop Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/iterative-fft-stage-loop-visualizer/main.html"
        height="447px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The recursive FFT is easy to understand and expensive to run — every recursive
call costs a stack frame, and a microcontroller has very little stack. Production
FFTs are written **iteratively**: permute the array once, then run a loop of
$\log_2 N$ stages over it in place.

This sim runs that loop one stage at a time on a real 8-element array, with the
values updating as each stage executes.

The structure of the loop is:

```
bit_reverse_permute(a)
for s in 1 .. log2(N):
    m = 2**s
    for base in range(0, N, m):
        for j in range(m // 2):
            butterfly(a[base+j], a[base+j+m//2], W(j, m))
```

## What Changes and What Does Not

Press **Run next stage** three times and watch the readout:

| Stage | Span | Butterflies |
|-------|------|-------------|
| 1 | 1 | 4 |
| 2 | 2 | 4 |
| 3 | 4 | 4 |

The **span doubles** every stage. The **butterfly count never moves** — it is
$N/2$ at every stage, always.

That is where $N \log_2 N$ comes from. Not "roughly N log N" as an asymptotic
hand-wave: literally $N/2$ butterflies times $\log_2 N$ stages. For N = 8 that is
4 × 3 = 12, and you can count all twelve in the flow graph.

## The Permutation Comes First

Press **Apply permutation** before anything else. The array reorders from
x[0..7] into x[0], x[4], x[2], x[6], x[1], x[5], x[3], x[7].

This has to happen first. The whole point of the iterative form is that every
butterfly afterward reads and writes the array **in place**, with no scratch
buffer. That only works if the data starts in bit-reversed order — which is why
memory-constrained implementations always pay the permutation cost up front.

## Checking the Answer

The input is the same signal used in the [Eight Point DFT By Hand
Calculator](../eight-point-dft-by-hand-calculator/index.md):
$x[n] = 1 + 2\cos(2\pi n/8)$.

Run all three stages and read the array: **8, 8, 0, 0, 0, 0, 0, 8**.

That is exactly what the by-hand DFT produced. The FFT and the DFT compute the
same thing — the FFT just gets there in 12 butterflies instead of 64
multiply-accumulates.

## How to Use

1. Press **Apply permutation** and note the new ordering under each box.
2. Press **Run next stage**. Read the span and the butterfly count.
3. Repeat twice more, watching the arcs stretch wider each time while the number
   of arcs stays at four.
4. Compare the final array against the by-hand DFT result.
5. Press **Reset** and try again, this time predicting each stage's span first.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12 minutes

### Prerequisites

- The butterfly operation
- Bit-reversed ordering
- Nested loops

### Learning Objective

Students will be able to **examine** the iterative FFT's stage loop and
**compare** how the stage span doubles while the number of butterflies per stage
stays constant at $N/2$.

### Activities

1. **Tabulate** (4 min): Students run all three stages and fill in a span and
   butterfly-count table.
2. **Derive the total** (4 min): From the table, students derive
   $(N/2)\log_2 N$ and evaluate it for N = 512.
3. **Verify** (4 min): Students compare the final array against the Chapter 9
   by-hand DFT result and state what that agreement demonstrates.

### Assessment

Ask: "For N = 1024, how many stages does the loop run, how many butterflies per
stage, and how many butterflies in total?" (10 stages, 512 each, 5,120 total.)

## Related Resources

- [Chapter 12: Building the FFT](../../chapters/12-building-the-fft/index.md)
- [Eight Point DFT By Hand Calculator](../eight-point-dft-by-hand-calculator/index.md)

## References

1. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm#Data_reordering,_bit_reversal,_and_in-place_algorithms) — the in-place iterative formulation.
2. [Bit-reversal permutation](https://en.wikipedia.org/wiki/Bit-reversal_permutation) — the reordering applied first.
