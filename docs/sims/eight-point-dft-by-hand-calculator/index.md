---
title: Eight Point DFT By Hand Calculator
description: Every multiplication and every sum of an 8-point DFT, bin by bin, on an example whose answers come out to whole numbers.
image: /sims/eight-point-dft-by-hand-calculator/eight-point-dft-by-hand-calculator.png
og:image: /sims/eight-point-dft-by-hand-calculator/eight-point-dft-by-hand-calculator.png
twitter:image: /sims/eight-point-dft-by-hand-calculator/eight-point-dft-by-hand-calculator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Eight Point DFT By Hand Calculator

<iframe src="main.html" height="552px" width="100%" scrolling="no"></iframe>

[Run the Eight Point DFT By Hand Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/eight-point-dft-by-hand-calculator/main.html"
        height="552px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The DFT definition is compact:

$$X[k] = \sum_{n=0}^{N-1} x[n] \left( \cos\frac{2\pi kn}{N} - i \sin\frac{2\pi kn}{N} \right)$$

This sim runs it for N = 8 with nothing hidden. Every product, every sum, every
bin.

The input is chosen so the answers are exact:

$$x[n] = 1 + 2\cos\!\left(\frac{2\pi n}{8}\right)$$

That is a DC offset of 1 plus one cosine completing exactly one cycle across the
eight points. The correct answer is:

| Bin | Real | Imag | Magnitude |
|-----|------|------|-----------|
| 0 (DC) | 8 | 0 | 8 |
| 1 | 8 | 0 | 8 |
| 2, 3, 4, 5, 6 | 0 | 0 | 0 |
| 7 | 8 | 0 | 8 |

Whole numbers, with exact zeros. **This is your test vector.** When you write your
own DFT, feed it this input and check these eight rows.

## Reading the Results

- **Bin 0 is 8** because the DC offset of 1 appears in all eight samples, and
  bin 0 sums them: 8 × 1 = 8.
- **Bin 1 is 8** because the cosine completes exactly one cycle in the window,
  which is precisely what bin 1 tests for. A cosine of amplitude 2 over N = 8
  gives 2 × 8/2 = 8.
- **Bin 7 is also 8** because it is bin 1's conjugate mirror. The input is real,
  so the upper half duplicates the lower half.
- **Every other bin is exactly 0** because the input contains no other frequency,
  and those test waves are orthogonal to what is there.

## How to Use

1. Start at bin 0. Look at the real terms row — every one is just x[n] × 1,
   because cos(0) = 1. The sum is the plain average times 8.
2. Press **Next bin**. At bin 1, note that the imaginary terms cancel in pairs
   while the real terms all reinforce.
3. Continue to bin 2. Watch the real terms cancel out to exactly zero. Trace
   which pairs cancel.
4. Jump to bin 4, the Nyquist bin. The test wave alternates +1, -1, +1, -1.
5. Reach bin 7 and compare its row with bin 1. Identical — the mirror.
6. Uncheck **Show all 8 products** when you only want the sums.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

15 minutes

### Prerequisites

- The DFT definition as a sum over n
- Sine and cosine values at multiples of π/4

### Learning Objective

Students will be able to **explain** how the abstract DFT definition becomes a
specific numeric result, and **interpret** each bin's real part, imaginary part,
and magnitude.

### Activities

1. **Hand-check one bin** (6 min): Students compute bin 2's real sum on paper and
   compare against the sim, term by term.
2. **Explain the zeros** (4 min): Students explain why bins 2 through 6 vanish
   using orthogonality rather than by inspection.
3. **Find the mirror** (5 min): Students identify which bins pair up and state
   the general rule.

### Assessment

Ask: "If the input's DC offset changed from 1 to 3, which bin's value changes and
what does it become?" (Bin 0, to 24. No other bin changes.)

## Related Resources

- [Chapter 9: Computing and Validating the DFT](../../chapters/09-computing-and-validating-the-dft/index.md)

## References

1. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) — the definition being evaluated.
2. [DFT matrix](https://en.wikipedia.org/wiki/DFT_matrix) — the same computation viewed as a matrix product.
