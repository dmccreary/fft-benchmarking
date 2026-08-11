---
title: Multiply and Sum Correlator
description: Step through a correlation one sample at a time and watch the running total march upward for a matching frequency and wander near zero for a non-matching one.
image: /sims/multiply-and-sum-correlator/multiply-and-sum-correlator.png
og:image: /sims/multiply-and-sum-correlator/multiply-and-sum-correlator.png
twitter:image: /sims/multiply-and-sum-correlator/multiply-and-sum-correlator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Multiply and Sum Correlator

<iframe src="main.html" height="542px" width="100%" scrolling="no"></iframe>

[Run the Multiply and Sum Correlator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/multiply-and-sum-correlator/main.html"
        height="542px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Correlation sounds like a sophisticated operation. It is two lines of code:

```
total = 0
for n in range(N):
    total += signal[n] * test[n]
```

Multiply the two signals sample by sample; add up the products. That is the
entire mechanism the DFT is built from, and this sim runs it one sample at a
time so you can watch the total behave.

**When the frequencies match**, the two waveforms are positive together and
negative together. Every product is positive — a negative times a negative is
still positive — so the running total climbs steadily and never backs up.

**When they do not match**, the waves drift in and out of step. Sometimes the
product is positive, sometimes negative, and the contributions cancel. The total
wanders near zero and ends there.

That difference is the entire basis of frequency detection.

## How to Use

1. With the default matching setup, press **Step one sample** repeatedly. Watch
   the product readout. Are any of them negative? Why not?
2. Press **Run to completion** and note the final normalized correlation.
3. Change **Captured signal** to *Offset by +250 Hz* and press **Reset**, then
   run again. Watch the bar swing both ways and end near zero.
4. Try *Offset by +500 Hz*. Same result — and that is the point. Every
   non-matching frequency gives near zero, not just one of them.
5. Move the **Test frequency** slider and repeat. The behavior depends on the
   *relationship* between the two frequencies, not on their absolute values.

## Why the Offsets Are 250 Hz

The window holds 32 samples at 8 kHz, so the bin spacing is
$f_s / N = 8000 / 32 = 250$ Hz. Frequencies separated by a whole multiple of that
spacing are exactly orthogonal over this window — their products cancel to
precisely zero rather than merely nearly zero. The offsets are chosen to land on
those exact nulls.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- A signal can be stored as an array of samples
- Multiplication of signed numbers

### Learning Objective

Students will be able to **calculate** a multiply-and-sum correlation sample by
sample and **demonstrate** how the running total behaves differently for a
matching versus a non-matching test frequency.

### Activities

1. **Sign analysis** (4 min): Stepping through the matched case, students explain
   why every single product is non-negative.
2. **The mismatch** (5 min): Students run an offset case and identify the samples
   where the product turns negative and cancels earlier gains.
3. **Predict the total** (4 min): Before running, students predict the final
   normalized value for a matched pair (near 1) and a mismatched pair (near 0).

### Assessment

Ask: "Without running the sim, what will the running total look like halfway
through if the test frequency is exactly one bin away from the signal? Sketch it."

## Related Resources

- [Chapter 8: Correlation](../../chapters/08-correlation/index.md)

## References

1. [Cross-correlation](https://en.wikipedia.org/wiki/Cross-correlation) — the general operation this sim performs.
2. [Orthogonality](https://en.wikipedia.org/wiki/Orthogonal_functions) — why non-matching sinusoids cancel to zero over a full window.
