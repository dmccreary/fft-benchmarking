---
title: Magnitude Phase From Complex Bin
description: Adjust a bin's real and imaginary parts and calculate its magnitude and phase, with the complex-plane picture and both formulas side by side.
image: /sims/magnitude-phase-from-complex-bin/magnitude-phase-from-complex-bin.png
og:image: /sims/magnitude-phase-from-complex-bin/magnitude-phase-from-complex-bin.png
twitter:image: /sims/magnitude-phase-from-complex-bin/magnitude-phase-from-complex-bin.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Magnitude Phase From Complex Bin

<iframe src="main.html" height="462px" width="100%" scrolling="no"></iframe>

[Run the Magnitude Phase From Complex Bin MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/magnitude-phase-from-complex-bin/main.html"
        height="462px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Every FFT output bin is a complex number, and it carries two independent pieces
of information:

$$\text{magnitude} = \sqrt{re^2 + im^2} \qquad \text{phase} = \operatorname{atan2}(im, re)$$

**Magnitude** is how much of that frequency is present. It is the length of the
vector.

**Phase** is where in its cycle that frequency started. It is the angle of the
vector.

Drag the sliders and watch both change together. The default values, 6 and 8,
give a magnitude of exactly 10 — a scaled 3-4-5 triangle, so you can check the
square root by hand.

## Why atan2 and Not atan

The formula is `atan2(im, re)`, taking **two** arguments, not
`atan(im / re)`.

Plain `atan` cannot tell the difference between $(6, 8)$ and $(-6, -8)$ — the
ratio is the same, so it returns the same angle for points in opposite
quadrants. `atan2` sees the signs separately and returns the correct angle over
the full circle.

Try it: set re = 6, im = 8 and note the phase. Now set re = -6, im = -8. The
magnitude is identical, but the phase differs by π. Using plain `atan` here is a
real and easy bug to write.

## What a Spectrum Plot Throws Away

Almost every spectrum display you will build in this course shows magnitude only.
Phase is computed, then discarded.

That is usually the right call — the ear is largely insensitive to absolute
phase, and a magnitude plot is what looks like a spectrum. But it is worth
knowing that half of each bin's information is being dropped, and that anything
requiring reconstruction, filtering, or time alignment needs the phase back.

## How to Use

1. At the defaults, verify magnitude by hand: $\sqrt{36 + 64} = \sqrt{100} = 10$.
2. Set im = 0. The vector lies flat along the real axis; phase is 0.
3. Set re = 0, im positive. Phase is π/2 — straight up.
4. Move both sliders to negative values and watch the phase move into the third
   quadrant. Confirm the magnitude is unaffected by the signs.
5. Find two different (re, im) pairs with the same magnitude but different phase.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- Complex numbers in rectangular form
- The Pythagorean theorem

### Learning Objective

Students will be able to **calculate** magnitude and phase from a bin's real and
imaginary parts, and **demonstrate** the connection between the complex-plane
point and both formulas.

### Activities

1. **Hand-check** (3 min): Students compute magnitude and phase for (3, 4) and
   verify against the readout.
2. **Quadrant test** (4 min): Students compare (6, 8) against (-6, -8) and
   explain why `atan` alone would be wrong.
3. **Same magnitude, different phase** (3 min): Students find three pairs with
   magnitude 10 and record their phases.

### Assessment

Ask: "A bin reads re = -5, im = 5. What are its magnitude and phase in degrees,
and what would `atan(im/re)` have returned instead?" (7.07 and 135°; atan gives
-45°.)

## Related Resources

- [Chapter 14: Computing and Displaying a Real Spectrum](../../chapters/14-computing-and-displaying-a-real-spectrum/index.md)

## References

1. [atan2](https://en.wikipedia.org/wiki/Atan2) — why the two-argument form is required.
2. [Complex number](https://en.wikipedia.org/wiki/Complex_number#Polar_form) — the polar form these two quantities constitute.
