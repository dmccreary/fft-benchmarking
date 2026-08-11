---
title: Sine Wave Parameter Explorer
description: Manipulate amplitude, frequency, and phase independently to see exactly which visual feature of a sine wave each one controls.
image: /sims/sine-wave-parameter-explorer/sine-wave-parameter-explorer.png
og:image: /sims/sine-wave-parameter-explorer/sine-wave-parameter-explorer.png
twitter:image: /sims/sine-wave-parameter-explorer/sine-wave-parameter-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Sine Wave Parameter Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Sine Wave Parameter Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/sine-wave-parameter-explorer/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Every sine wave in this course is described by the same three numbers:

$$y(t) = A \sin(2\pi f t + \varphi)$$

The trouble is that all three are usually introduced at once, so it is easy to
leave with a vague sense that they all "change the wave somehow." They do not.
Each one changes exactly one visual property and leaves the other two alone:

| Parameter | Changes | Leaves alone |
|-----------|---------|--------------|
| Amplitude $A$ | Height of the peaks | Peak spacing, position |
| Frequency $f$ | How many cycles fit the window | Peak height, y(0) shape |
| Phase $\varphi$ | Horizontal position of the whole curve | Peak height, peak spacing |

Each numeral in the on-screen equation is tinted to match the slider that
controls it, so you can always see which term you just moved.

The red line at $t = 0$ with a dot on the curve is where phase makes itself
visible. At $\varphi = 0$ the wave starts at zero and rises. Change nothing but
phase and watch that dot climb.

## How to Use

1. Move **Amplitude** alone. Confirm the peaks get taller but stay in exactly the
   same horizontal positions.
2. Return amplitude to 1.0 and move **Frequency** alone. Count the cycles in the
   3-second window at 1 Hz, then at 3 Hz. Confirm peak height never changes.
3. Return frequency to 1.0 and move **Phase** alone. The whole curve slides
   sideways; the dot at $t=0$ traces out the wave's value at the origin.
4. Set phase to 90°. Now check **Overlay cosine wave**. The two curves land on
   top of each other — that is the whole content of the identity
   $\cos\theta = \sin(\theta + 90°)$.

## Controls

| Control | Range | Default |
|---------|-------|---------|
| Amplitude (A) | 0.2 - 2.0 | 1.0 |
| Frequency (f) | 0.5 - 5 Hz | 1 Hz |
| Phase (φ) | 0 - 360° | 0° |
| Overlay cosine wave | — | off |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior) or advanced high school

### Duration

10-15 minutes

### Prerequisites

- Familiarity with the sine function on the unit circle
- Reading a plot with labeled axes

### Learning Objective

Students will be able to **demonstrate** which visual feature of a plotted wave
each of $A$, $f$, and $\varphi$ controls, and **calculate** $y(0)$ for a given
set of parameters.

### Activities

1. **One at a time** (6 min): Students vary each slider in isolation and write
   one sentence per parameter describing what changed and what did not.
2. **Predict y(0)** (4 min): For $A = 1.5$, $f = 2$, $\varphi = 90°$, students
   compute $y(0)$ by hand, then set the sliders and check the readout.
3. **The cosine identity** (4 min): Students use the overlay to explain in their
   own words why cosine is "sine with a head start."

### Assessment

Ask: "Two waves have identical peak heights and identical peak spacing, but one
is shifted a third of a cycle to the right. Which parameter differs, and by how
many degrees?" (Phase, 120°.)

## Related Resources

- [Chapter 4: Waves](../../chapters/04-waves/index.md)

## References

1. [Sine wave](https://en.wikipedia.org/wiki/Sine_wave) — the standard parameterization and its terminology.
2. [Phase (waves)](https://en.wikipedia.org/wiki/Phase_(waves)) — phase offset, phase difference, and the sine/cosine relationship.
