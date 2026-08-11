---
title: In-Phase Quadrature Explorer
description: Change a signal's phase and watch I and Q swing while their combined magnitude refuses to move.
image: /sims/in-phase-quadrature-explorer/in-phase-quadrature-explorer.png
og:image: /sims/in-phase-quadrature-explorer/in-phase-quadrature-explorer.png
twitter:image: /sims/in-phase-quadrature-explorer/in-phase-quadrature-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# In-Phase Quadrature Explorer

<iframe src="main.html" height="492px" width="100%" scrolling="no"></iframe>

[Run the In-Phase Quadrature Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/in-phase-quadrature-explorer/main.html"
        height="492px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

There is a problem with correlating against a single sine wave: the answer
depends on when you started listening. A 500 Hz tone that arrives a quarter cycle
late correlates to *zero* against a sine — not because the tone is absent, but
because it is out of phase.

The fix is to correlate against **two** test waves, a sine and a cosine, and
combine the results:

- **I** (in-phase) is the correlation against the sine.
- **Q** (quadrature) is the correlation against the cosine.
- **Magnitude** is $\sqrt{I^2 + Q^2}$.

Drag the phase slider. The blue and orange bars swing across their full range,
one hitting zero exactly where the other peaks. The green bar does not move.

The bottom plot shows all three across the entire phase range at once: I traces a
cosine, Q traces a sine, and the magnitude is a flat line. That flat line is the
reason every FFT bin is a complex number rather than a single value.

## How to Use

1. Start at phase 0. Read the three values. I is at its maximum, Q is zero.
2. Drag to π/2 (about 1.57). Now I is zero and Q is at maximum. If you had only
   the I detector, you would conclude the signal vanished.
3. Watch the green magnitude readout throughout. Confirm it reads 1.000 at every
   phase you try.
4. Look at the bottom plot. Identify the phases where I crosses zero, and check
   what Q is doing at those exact moments.
5. Ask yourself: what would the magnitude look like if the signal really were
   absent? (Zero at every phase — a flat line at the bottom, not the top.)

## Why This Is Exactly 1.000

The window is 128 samples at 8 kHz, giving a bin spacing of 62.5 Hz. The signal
sits at 500 Hz, which is exactly 8 bins. On an exact bin the correlation sums are
exact, so the magnitude comes out to 1.000 rather than 0.998. The sim computes
this numerically from the actual sums — it is not substituting the analytic
answer.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Multiply-and-sum correlation
- Sine and cosine differ by a quarter cycle

### Learning Objective

Students will be able to **examine** how the in-phase and quadrature components
individually rise and fall with phase, and **compare** that behavior against the
combined magnitude, which stays constant.

### Activities

1. **Find the blind spot** (4 min): Students find the phase at which I alone
   reports zero, and explain why a single-sine detector would fail there.
2. **Trace both** (4 min): Using the bottom plot, students describe the shape of
   each curve and state the phase relationship between them.
3. **Generalize** (4 min): Students explain why an FFT bin must carry two numbers
   rather than one.

### Assessment

Ask: "A detector correlates only against a sine and reports zero. Name two
completely different situations that could produce that reading, and describe the
measurement that would tell them apart."

## Related Resources

- [Chapter 8: Correlation](../../chapters/08-correlation/index.md)

## References

1. [In-phase and quadrature components](https://en.wikipedia.org/wiki/In-phase_and_quadrature_components) — the standard treatment of I/Q representation.
2. [Analytic signal](https://en.wikipedia.org/wiki/Analytic_signal) — the broader framework in which magnitude and phase are separated.
