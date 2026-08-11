---
title: Spectrum Symmetry Mirror
description: Click any DFT bin to see its conjugate partner, and why a real-valued input makes half the spectrum redundant.
image: /sims/spectrum-symmetry-mirror/spectrum-symmetry-mirror.png
og:image: /sims/spectrum-symmetry-mirror/spectrum-symmetry-mirror.png
twitter:image: /sims/spectrum-symmetry-mirror/spectrum-symmetry-mirror.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Spectrum Symmetry Mirror

<iframe src="main.html" height="427px" width="100%" scrolling="no"></iframe>

[Run the Spectrum Symmetry Mirror MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/spectrum-symmetry-mirror/main.html"
        height="427px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Run a 16-point DFT and you get 16 complex numbers back. Only 9 of them tell you
anything new.

For a **real-valued** input — which is every signal a microphone produces — the
output has a strict symmetry:

$$X[N-k] = \overline{X[k]}$$

Bin $N-k$ is the complex conjugate of bin $k$: same magnitude, opposite-signed
imaginary part. Click any blue bin and the arc shows you its partner in the gray
region.

Two bins have no partner because they are their own mirror:

- **Bin 0 (DC)** — $N - 0 = 0$, so it maps to itself.
- **Bin N/2 (Nyquist)** — $N - N/2 = N/2$, likewise.

Both are purely real for a real input, so there is no imaginary sign to flip.

## Why This Matters for Benchmarking

Counting from the diagram: bins 0 through 8 are 9 unique values out of 16. In
general a real input gives $N/2 + 1$ useful bins.

This is not a curiosity — it is a **factor-of-two saving**. A real-input FFT can
skip computing the mirror half entirely, and a magnitude spectrum only ever needs
plotting up to Nyquist. When you benchmark an FFT library, check whether it
exploits this. Many do, and the ones that do not are doing twice the necessary
work on the back half.

## How to Use

1. Click bin 3. The arc connects it to bin 13. Check: 16 - 3 = 13.
2. Click bin 6, then bin 10. Confirm they are each other's partner.
3. Click a gray bin directly. The same pair lights up — the relationship is
   symmetric.
4. Click bin 0, then bin 8. Read why these two have no partner.
5. Count the blue bins plus the two special ones. That is your unique-bin count.

## How to Read the Colors

| Color | Bins | Meaning |
|-------|------|---------|
| Orange | 0 | DC — the average value, its own mirror |
| Blue | 1 to 7 | Positive frequencies, unique and useful |
| Magenta | 8 | Nyquist — highest representable frequency, its own mirror |
| Gray | 9 to 15 | Mirrors of the blue bins, redundant for real input |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- A DFT of N samples produces N complex outputs
- Complex conjugate: same real part, negated imaginary part

### Learning Objective

Students will be able to **interpret** a full N-point DFT spectrum and
**explain** why bins above Nyquist mirror bins below it as complex conjugates for
a real-valued input.

### Activities

1. **Pair them up** (3 min): Students click four blue bins and record each
   partner, then state the rule from their data.
2. **The two loners** (3 min): Students explain why bins 0 and N/2 have no
   partner, using the formula rather than the picture.
3. **Count the savings** (3 min): For N = 1024, students compute how many bins
   are unique and what fraction of the output is redundant.

### Assessment

Ask: "A 256-point FFT of a microphone signal returns 256 complex values. How many
do you actually need to keep, and which bin numbers can you discard?"

## Related Resources

- [Chapter 9: Computing and Validating the DFT](../../chapters/09-computing-and-validating-the-dft/index.md)

## References

1. [DFT symmetry properties](https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Symmetry_properties) — the conjugate relation stated formally.
2. [Complex conjugate](https://en.wikipedia.org/wiki/Complex_conjugate) — the operation relating each mirrored pair.
