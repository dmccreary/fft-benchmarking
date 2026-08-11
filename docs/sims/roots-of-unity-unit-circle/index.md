---
title: Roots of Unity Unit Circle
description: Change N and see the twiddle factors land as N evenly spaced points on the same unit circle, with their exact complex values in a table.
image: /sims/roots-of-unity-unit-circle/roots-of-unity-unit-circle.png
og:image: /sims/roots-of-unity-unit-circle/roots-of-unity-unit-circle.png
twitter:image: /sims/roots-of-unity-unit-circle/roots-of-unity-unit-circle.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Roots of Unity Unit Circle

<iframe src="main.html" height="477px" width="100%" scrolling="no"></iframe>

[Run the Roots of Unity Unit Circle MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/roots-of-unity-unit-circle/main.html"
        height="477px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

"Twiddle factor" is a strange name for something completely ordinary. The twiddle
factors of an N-point FFT are:

$$W_N^k = e^{-i 2\pi k / N} \qquad k = 0, 1, \ldots, N-1$$

Compare that against Euler's formula from Chapter 7. These are points on the
**same unit circle**, at angles that divide the full turn into N equal parts.
That is all a twiddle factor is: a rotation by some whole fraction of a circle.

Change N and watch the points redistribute. They are always evenly spaced,
always exactly on the circle, and $k = 0$ is always $1 + 0i$.

## Why the Angle Is Negative

The exponent carries a minus sign, so the points advance **clockwise** from
$1 + 0i$. This is the forward-transform convention: the DFT correlates against
$e^{-i\omega t}$, and the inverse transform uses $e^{+i\omega t}$.

Getting this sign backwards is one of the most common FFT porting bugs. It does
not change magnitudes — so a magnitude spectrum looks perfectly fine — but every
phase comes out negated, and any code depending on phase silently produces
mirrored results.

## The Table Is the Point

The circle shows you the geometry. The table gives you the numbers, to three
decimals, for every k. Between them you can verify that the formula and the
picture agree, which is the difference between believing the definition and
checking it.

Notice how many entries are trivial: at N = 8, four of the eight roots are
$\pm 1$ or $\pm i$ — values needing no multiplication at all, just sign flips
and swaps. Optimized FFT implementations special-case exactly these.

## How to Use

1. At N = 8, click each point in turn and watch the table row and the readout
   follow.
2. Verify $W_8^1$ by hand: $\cos(-45°) = 0.707$, $\sin(-45°) = -0.707$. The
   readout says 0.707 − 0.707i.
3. Note the spacing readout: 360/8 = 45°. Change N to 16 and confirm it becomes
   22.5°.
4. Set N = 4. Now every root is $1$, $-i$, $-1$, or $i$ — no general multiplies
   needed anywhere in a 4-point FFT.
5. Set N = 32 and observe that the structure is unchanged, only finer.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Euler's formula on the complex plane
- Complex numbers in rectangular form

### Learning Objective

Students will be able to **calculate** the set of twiddle factors for a chosen N
and **demonstrate** that they always land as N evenly spaced points on the unit
circle.

### Activities

1. **Verify three roots** (5 min): For N = 8, students compute $W_8^1$,
   $W_8^2$, and $W_8^4$ by hand and check against the table.
2. **Spot the trivial ones** (4 min): Students list which roots at N = 8 require
   no real multiplication and explain why.
3. **Predict the spacing** (3 min): Before changing N, students predict the
   angular spacing at N = 16 and N = 32.

### Assessment

Ask: "For a 16-point FFT, what is $W_{16}^4$ in rectangular form, and what does
multiplying by it do geometrically?" ($-i$; a quarter-turn clockwise rotation.)

## Related Resources

- [Chapter 11: From DFT to FFT](../../chapters/11-from-dft-to-fft/index.md)

## References

1. [Root of unity](https://en.wikipedia.org/wiki/Root_of_unity) — the mathematical object these points are.
2. [Twiddle factor](https://en.wikipedia.org/wiki/Twiddle_factor) — the signal-processing name and its role in the FFT.
3. [Euler's formula](https://en.wikipedia.org/wiki/Euler%27s_formula) — the identity connecting the exponent to the coordinates.
