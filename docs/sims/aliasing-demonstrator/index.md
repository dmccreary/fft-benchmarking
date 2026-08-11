---
title: Aliasing Demonstrator
description: Raise a signal past the Nyquist frequency and watch the samples start tracing a slower ghost wave that is not there.
image: /sims/aliasing-demonstrator/aliasing-demonstrator.png
og:image: /sims/aliasing-demonstrator/aliasing-demonstrator.png
twitter:image: /sims/aliasing-demonstrator/aliasing-demonstrator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Aliasing Demonstrator

<iframe src="main.html" height="467px" width="100%" scrolling="no"></iframe>

[Run the Aliasing Demonstrator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/aliasing-demonstrator/main.html"
        height="467px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Sampling only ever records the signal's value at discrete instants. Everything
between those instants is lost, and the system has no way to know what happened
there. Usually that is fine. Past a specific frequency it stops being fine, and
the failure is not a gradual blur — it is a hard boundary with a wrong answer on
the other side.

The blue curve is the true analog signal. The black dots are the sample instants.
The dashed curve is the signal a system would reconstruct from those dots alone.

Below the **Nyquist frequency** (half the sampling rate) the dashed curve sits
right on top of the true curve and the readout is green. Push the true frequency
past Nyquist and the dashed curve peels away into a completely different, slower
wave — and it still passes through every single sample dot. That is the whole
problem: the samples are perfectly consistent with a signal that was never there.

## The Folding Formula

The apparent frequency is the true frequency folded down by whole multiples of
the sampling rate:

$$f_{apparent} = \left| f_{true} - \text{round}\!\left(\frac{f_{true}}{f_s}\right) \cdot f_s \right|$$

At the default 16 kHz sampling rate, a 15 kHz tone folds to 1 kHz. A recording of
it would contain a low tone that the microphone never heard.

## How to Use

1. At the defaults (1 kHz signal, 16 kHz sampling), confirm the dashed curve
   tracks the true curve and the readout is green.
2. Raise **True frequency** slowly. Watch the readout the moment you pass 8,000
   Hz — the Nyquist frequency. It flips to red at once, not gradually.
3. Push on to 15,000 Hz. The blue curve is now very fast, but the red dashed
   curve is slow. Check that the dots lie on both curves at once.
4. Now leave the frequency high and drag **Sampling rate** down. Watch the
   Nyquist frequency and the apparent frequency both recompute.
5. Find a sampling rate that makes a 12,000 Hz signal read correctly. (Anything
   above 24,000 Hz — which the slider cannot reach, so this signal simply cannot
   be captured correctly at these rates.)

## Controls

| Control | Range | Default |
|---------|-------|---------|
| True signal frequency | 100 - 15,000 Hz | 1,000 Hz |
| Sampling rate | 4,000 - 16,000 Hz | 16,000 Hz |
| Show reconstructed (aliased) curve | — | on |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- A sine wave has a frequency
- Sampling records values at discrete instants

### Learning Objective

Students will be able to **examine** the relationship between true frequency,
sampling rate, and reconstruction, and **distinguish** correct sampling from
aliased sampling.

### Activities

1. **Find the boundary** (5 min): At a fixed 16 kHz rate, students find the exact
   frequency at which the readout turns red and relate it to the sampling rate.
2. **Same dots, two signals** (5 min): At 15 kHz, students verify the dots lie on
   both the true and the ghost curve, and explain why the system cannot tell them
   apart.
3. **Fix it two ways** (4 min): Students list the two possible remedies — raise
   the sampling rate, or filter out the offending frequency before sampling —
   and identify which one an anti-aliasing filter implements.

### Assessment

Ask: "You sample at 8 kHz and a 5 kHz tone is present. What frequency appears in
your data, and could you tell from the data alone that it is wrong?"
(3 kHz; no — the samples are perfectly consistent with a real 3 kHz tone.)

## Related Resources

- [Chapter 6: Sampling, Quantization, and Aliasing](../../chapters/06-sampling-quantization-and-aliasing/index.md)

## References

1. [Nyquist–Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem) — the formal statement of the limit shown here.
2. [Aliasing](https://en.wikipedia.org/wiki/Aliasing) — the general phenomenon across signals and images.
3. [Anti-aliasing filter](https://en.wikipedia.org/wiki/Anti-aliasing_filter) — why the fix has to happen before the sampler, not after.
