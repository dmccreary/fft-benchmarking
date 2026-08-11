---
title: Frequency To Musical Note Calculator
description: Convert a detected frequency to a note name, octave, and cents error against the A4 = 440 Hz standard.
image: /sims/frequency-to-musical-note-calculator/frequency-to-musical-note-calculator.png
og:image: /sims/frequency-to-musical-note-calculator/frequency-to-musical-note-calculator.png
twitter:image: /sims/frequency-to-musical-note-calculator/frequency-to-musical-note-calculator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Frequency To Musical Note Calculator

<iframe src="main.html" height="387px" width="100%" scrolling="no"></iframe>

[Run the Frequency To Musical Note Calculator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/frequency-to-musical-note-calculator/main.html"
        height="387px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Your FFT gives you a frequency in Hertz. A musician wants a note name. The
conversion is one formula:

$$k = \text{round}\!\left(12 \log_2\!\frac{f}{440} + 49\right)$$

where $k$ is the piano key number and key 49 is A4 = 440 Hz. Every semitone is a
factor of $2^{1/12}$, so twelve of them double the frequency.

## Cents Are What Matter for a Tuner

Knowing the nearest note is easy. Knowing *how far off* it is is the useful part,
and that is measured in **cents** — hundredths of a semitone:

$$\text{cents} = 1200 \log_2\!\frac{f_{measured}}{f_{exact}}$$

- 100 cents = one semitone
- About 5 cents is the threshold a trained ear notices
- A guitar tuner needs to resolve well under that

This sets a hard requirement on your peak detection. At A4, five cents is about
1.3 Hz. If your FFT bin spacing is 31 Hz, the nearest-bin answer is nowhere near
good enough — which is exactly why the next MicroSim covers parabolic
interpolation.

## How to Use

1. At the default 440 Hz, confirm A4 with 0.0 cents error.
2. Move the slider to 442 Hz. Still A4, but now about +8 cents sharp — audibly
   out of tune to a trained ear.
3. Find the frequency where the readout flips from A4 to A#4. It is halfway
   between them in *cents*, not in Hertz.
4. Compare the Hz gap between A3 and A#3 against the gap between A5 and A#5. The
   cents are identical; the Hertz are not. That is what logarithmic pitch means.
5. Set the slider to 880 Hz. One octave above A4, and exactly double the
   frequency.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

8-10 minutes

### Prerequisites

- Logarithms base 2
- A detected peak frequency in Hertz

### Learning Objective

Students will be able to **calculate** the nearest note name and octave from a
frequency, and **demonstrate** the mapping between Hertz and note naming anchored
at A4 = 440 Hz.

### Activities

1. **Verify the anchor** (2 min): Students check that 440 Hz gives A4 with zero
   cents.
2. **Semitone spacing** (4 min): Students measure the Hz width of one semitone at
   low and high pitch and explain why they differ.
3. **Set a requirement** (4 min): Students compute the Hz resolution needed for
   5-cent accuracy at 440 Hz and compare it against a 31 Hz bin spacing.

### Assessment

Ask: "Your tuner reports 329.0 Hz. What note is that, how many cents off, and
would a guitarist accept it?" (E4, about -3 cents, yes.)

## Related Resources

- [Chapter 15: Windowing, Spectral Leakage, and Peak Detection](../../chapters/15-windowing-spectral-leakage-and-peak-detection/index.md)
- [Parabolic Interpolation Peak Finder](../parabolic-interpolation-peak-finder/index.md)

## References

1. [Piano key frequencies](https://en.wikipedia.org/wiki/Piano_key_frequencies) — the key numbering used by the formula.
2. [Cent (music)](https://en.wikipedia.org/wiki/Cent_(music)) — the logarithmic pitch interval unit.
3. [Equal temperament](https://en.wikipedia.org/wiki/Equal_temperament) — why every semitone is the same ratio.
