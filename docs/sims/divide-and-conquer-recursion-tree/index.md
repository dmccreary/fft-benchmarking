---
title: Divide and Conquer Recursion Tree
description: Watch an 8-sample DFT split by even and odd index down to single samples, and see why it takes exactly three levels.
image: /sims/divide-and-conquer-recursion-tree/divide-and-conquer-recursion-tree.png
og:image: /sims/divide-and-conquer-recursion-tree/divide-and-conquer-recursion-tree.png
twitter:image: /sims/divide-and-conquer-recursion-tree/divide-and-conquer-recursion-tree.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Divide and Conquer Recursion Tree

<iframe src="main.html" height="477px" width="100%" scrolling="no"></iframe>

[Run the Divide and Conquer Recursion Tree MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/divide-and-conquer-recursion-tree/main.html"
        height="477px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The FFT's first move is not arithmetic. It is **bookkeeping**: take the samples
and separate them by whether their index is even or odd.

Then do it again to each half. And again. After three splits, an 8-sample problem
has become eight 1-sample problems — and a 1-sample DFT is just the sample
itself, so the recursion terminates with no work to do.

This is **decimation in time**, and the tree shows all of it at once.

## Where the Savings Come From

Splitting is nearly free. Deciding whether an index is even or odd is one bit
test, and no arithmetic on sample values happens during a split at all.

The saving comes from what the splitting enables. Once the problem is broken
into halves, the two half-results can be recombined with a single layer of
butterflies. And because the tree has $\log_2 N$ levels with $N/2$ butterflies at
each, the total work is $N \log_2 N$ instead of $N^2$.

For N = 8 that is 24 operations instead of 64. For N = 512 it is roughly 4,608
instead of 262,144.

## The Leaf Order Is Not Sorted

Read the bottom row left to right: **0, 4, 2, 6, 1, 5, 3, 7**.

That is not an accident and it is not a bug. Repeatedly separating even from odd
lands the samples in **bit-reversed order** — write each index in binary, reverse
the bits, and you get its position in that row. This is why real FFT
implementations either pre-shuffle their input or produce shuffled output, and
it is a genuine source of bugs when porting FFT code.

| Index | Binary | Reversed | Position |
|-------|--------|----------|----------|
| 0 | 000 | 000 | 0 |
| 1 | 001 | 100 | 4 |
| 2 | 010 | 010 | 2 |
| 4 | 100 | 001 | 1 |

## How to Use

1. Press **Play split animation** to watch the tree build one level at a time.
2. Click any node. The path back to the root lights up, showing which sequence of
   even/odd choices produced that subsequence.
3. Click a leaf. Read why the recursion stops there.
4. Count the levels. Three splits for eight samples — check that against
   $\log_2 8$.
5. Read the bottom row aloud and compare it against the bit-reversal table above.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- A DFT computes N outputs from N inputs
- Binary representation of small integers

### Learning Objective

Students will be able to **interpret** how an 8-sample DFT problem is recursively
split into even- and odd-indexed halves, and **explain** what happens at each
level of the tree.

### Activities

1. **Trace a path** (3 min): Students pick a leaf and write down the sequence of
   even/odd choices leading to it.
2. **Count the levels** (3 min): Students relate the depth to $\log_2 N$ and
   predict the depth for N = 512.
3. **Discover bit reversal** (4 min): Students write the leaf order in binary and
   find the pattern themselves.

### Assessment

Ask: "For a 16-point FFT, how many levels does the tree have, and what index ends
up in position 1 of the bottom row?" (4 levels; index 8.)

## Related Resources

- [Chapter 11: From DFT to FFT](../../chapters/11-from-dft-to-fft/index.md)

## References

1. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm) — the decimation-in-time decomposition shown here.
2. [Bit-reversal permutation](https://en.wikipedia.org/wiki/Bit-reversal_permutation) — the ordering the leaves land in.
3. [Divide-and-conquer algorithm](https://en.wikipedia.org/wiki/Divide-and-conquer_algorithm) — the general strategy.
