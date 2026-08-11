---
title: Complex Plane Euler Visualizer
description: Rotate a complex number and confirm that its real and imaginary parts are exactly cos and sin, with a magnitude that never leaves 1.00.
image: /sims/complex-plane-euler-visualizer/complex-plane-euler-visualizer.png
og:image: /sims/complex-plane-euler-visualizer/complex-plane-euler-visualizer.png
twitter:image: /sims/complex-plane-euler-visualizer/complex-plane-euler-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Complex Plane Euler Visualizer

<iframe src="main.html" height="452px" width="100%" scrolling="no"></iframe>

[Run the Complex Plane Euler Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/complex-plane-euler-visualizer/main.html"
        height="452px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Euler's formula is the single most useful identity in this course:

$$e^{i\theta} = \cos\theta + i\sin\theta$$

Written down, it looks like a claim you have to take on faith — an exponential
with an imaginary exponent somehow producing trigonometry. Drawn on the complex
plane it stops being mysterious. It says: *rotate a unit-length arrow by θ, and
read off its shadow on each axis.*

- The blue segment along the real axis is $\cos\theta$.
- The red segment up the imaginary axis is $\sin\theta$.
- The black arrow is $e^{i\theta}$ itself.

The readout substitutes live values into the formula so you can check the
arithmetic at any angle rather than trusting it.

## The Invariant

Watch the green box. As θ sweeps all the way around, the magnitude reads
**1.00** and never moves. That is why $e^{i\theta}$ traces the unit circle
exactly: it has constant length and only its direction changes.

This is the reason twiddle factors in the FFT are written as powers of
$e^{-2\pi i/N}$ — multiplying by one rotates a value without scaling it.

## How to Use

1. Set θ = 0. Read the components: $\cos 0 = 1$, $\sin 0 = 0$. The arrow lies
   flat along the real axis.
2. Drag to θ = π/2 (about 1.57). The arrow stands straight up; the real part is
   0 and the imaginary part is 1.
3. Continue to π. The real part is now -1. Note that the magnitude readout still
   says 1.00 — a negative real part is not a negative length.
4. Pick any awkward angle, compute $\cos\theta$ and $\sin\theta$ on a calculator,
   and check them against the panel.
5. Press **Play** and watch the arrow sweep the dashed circle.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Sine and cosine as coordinates on the unit circle
- A complex number has a real and an imaginary part

### Learning Objective

Students will be able to **demonstrate** that the real and imaginary parts of
$e^{i\theta}$ continuously match $\cos\theta$ and $\sin\theta$, and **calculate**
those components for a given angle.

### Activities

1. **Check three angles** (5 min): For θ = 0, π/2, and π, students predict both
   components before dragging, then verify.
2. **The magnitude question** (3 min): Students explain why the magnitude is 1
   even when a component is negative.
3. **Connect to the FFT** (4 min): Students explain what "multiplying by
   $e^{i\theta}$ rotates without scaling" will mean for a twiddle factor.

### Assessment

Ask: "What are the real and imaginary parts of $e^{i\pi}$, and what is its
magnitude?" (-1, 0, and 1.)

## Related Resources

- [Chapter 7: Complex Numbers and Wave Superposition](../../chapters/07-complex-numbers-and-wave-superposition/index.md)

## References

1. [Euler's formula](https://en.wikipedia.org/wiki/Euler%27s_formula) — statement, proof sketches, and consequences.
2. [Complex plane](https://en.wikipedia.org/wiki/Complex_plane) — the geometric representation used here.
3. [Root of unity](https://en.wikipedia.org/wiki/Root_of_unity) — where these rotations become FFT twiddle factors.
