---
title: Dynamic Range Ladder
description: One vertical amplitude scale placing clipping, headroom, the working range, and the noise floor relative to each other, plus what one extra bit buys.
image: /sims/dynamic-range-ladder/dynamic-range-ladder.png
og:image: /sims/dynamic-range-ladder/dynamic-range-ladder.png
twitter:image: /sims/dynamic-range-ladder/dynamic-range-ladder.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Dynamic Range Ladder

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Dynamic Range Ladder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/dynamic-range-ladder/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Clipping, headroom, dynamic range, and noise floor usually arrive as four
separate vocabulary items. They are not four things. They are four **positions on
one scale**, and once you can see them stacked up, the relationships between them
become almost obvious.

Reading top to bottom:

- **Clipping zone** — above full scale. Nothing can be represented here, so
  anything that lands here gets flattened to full scale.
- **Full scale (0 dBFS)** — the largest value your bit depth can express.
- **Headroom** — deliberately unused space. Insurance against transients.
- **Typical signal level** — where you actually want to be.
- **Noise floor** — the level of noise present even in silence.
- **Below the noise floor** — indistinguishable from nothing.

Click any band to read what it means and what happens to a signal there.

## What One More Bit Buys

Check **Add 1 bit of depth** and watch carefully. Full scale does not move. The
clipping zone does not move. What moves is the **noise floor**, which drops about
6 dB, and the usable range grows into the space it vacated.

That is the whole content of the "6 dB per bit" rule. More bits do not let you
record anything louder — they let you record something quieter without it being
swallowed by noise.

## How to Use

1. Click each band in turn, top to bottom, and note the consequence line for
   each.
2. Before toggling the extra bit, predict which boundary will move: full scale,
   or the noise floor?
3. Toggle **Add 1 bit of depth** and check your prediction against the ladder and
   the dB figures in the subtitle.
4. Consider the trade: headroom protects against clipping but pushes your signal
   closer to the noise floor. Where would you sit a quiet signal you cannot
   re-record?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- A sample is stored as a fixed-width integer
- Familiarity with the idea of a decibel as a ratio

### Learning Objective

Students will be able to **interpret** a vertical amplitude scale showing where
full scale, headroom, typical signal level, noise floor, and the clipping zone
sit relative to one another, and **explain** what happens to a signal in each
zone.

### Activities

1. **Zone tour** (4 min): Students click each band and summarize each in their
   own words.
2. **Predict the shift** (3 min): Students predict which boundary moves when a
   bit is added, then verify.
3. **Place a signal** (3 min): Given a quiet source, students decide where on the
   ladder they would aim to sit and justify the headroom they leave.

### Assessment

Ask: "Two recordings clip identically at full scale, but one used 16-bit and one
used 24-bit. What is different about them, and which zone accounts for the
difference?"

## Related Resources

- [Chapter 6: Sampling, Quantization, and Aliasing](../../chapters/06-sampling-quantization-and-aliasing/index.md)

## References

1. [Dynamic range](https://en.wikipedia.org/wiki/Dynamic_range) — the ratio between the largest and smallest representable signal.
2. [dBFS](https://en.wikipedia.org/wiki/DBFS) — the decibels-relative-to-full-scale convention used on the left of the ladder.
3. [Quantization (signal processing)](https://en.wikipedia.org/wiki/Quantization_(signal_processing)) — where the roughly 6 dB per bit figure comes from.
