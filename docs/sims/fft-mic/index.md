---
title: FFT Microphone Spectrum Analyzer
description: Whistle, hum, or talk into your computer's microphone and watch the FFT of your own voice update live, with the peak labeled in hertz and musical notes.
image: /sims/fft-mic/fft-mic.png
og:image: /sims/fft-mic/fft-mic.png
twitter:image: /sims/fft-mic/fft-mic.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# FFT Microphone Spectrum Analyzer

<iframe src="main.html" height="492px" width="100%" scrolling="no"></iframe>

[Run the FFT Microphone Spectrum Analyzer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/fft-mic/main.html"
        height="492px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Every other spectrum in this book is computed from numbers someone typed in.
This one is computed from **you**.

Click **Start microphone**, grant the browser permission, and whistle. The tall
bar that appears is your voice's fundamental frequency, and it moves the instant
your pitch does. That is the whistle test from
[Chapter 14](../../chapters/14-computing-and-displaying-a-real-spectrum/index.md),
running in a browser tab instead of on a Pico.

No microphone, or a locked-down lab machine? Click **Demo sweep** for a synthetic
whistle that glides up and down. Everything below works the same way.

## What You Are Looking At

- **The bars** are the magnitudes of a 512-bin FFT, colored blue at the low end
  of the displayed range and red at the high end.
- **The dashed line** marks the strongest bin — the peak.
- **The peak trail** across the top records where the peak has been over the last
  second or so. Glide your pitch upward and the trail becomes a comet tail
  climbing to the right. That trail *is* the whistle test's evidence.
- **The readout** gives the peak in hertz, its bin index, and the nearest musical
  note with a cents offset.

## Things to Try

1. **Whistle a slow glide** from low to high. Watch the trail. The peak should
   track your pitch with no perceptible lag — that is a working real-time
   pipeline.
2. **Hum instead of whistling.** A hum is far richer: you should see evenly
   spaced harmonics at 2x, 3x, 4x the fundamental. A whistle is nearly a pure
   tone and shows almost nothing above the fundamental.
3. **Say "ssss" and then "shhhh."** Both are noise, not tones, so no single peak
   dominates. "Ssss" pushes energy much higher in frequency than "shhhh."
4. **Sing a steady note and read the cents offset.** Can you hold a note within
   10 cents? Most people cannot, and the display is unforgiving about it.
5. **Tick the decibel-scale box.** The room's noise floor jumps up from nothing
   to clearly visible, and the peak stops towering over everything else. Nothing
   about the sound changed — only the mapping from magnitude to bar height.

## Why the Readout Jumps

Whistle a *very* slow glide and watch the hertz value. It does not slide
smoothly; it steps. At a 44.1 kHz sample rate with 512 bins the bin width is
about 43 Hz, so the peak can only ever report a multiple of 43 Hz. Everything
between two bins gets rounded to one of them.

That step size is exactly the limitation
[Chapter 15](../../chapters/15-windowing-spectral-leakage-and-peak-detection/index.md)
fixes with parabolic interpolation, which reads the two bins on either side of
the peak and estimates where the true frequency falls between them. This
MicroSim deliberately does *not* do that, so you can see the raw resolution the
FFT hands you.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

15 minutes

### Prerequisites

- An FFT turns a block of samples into a magnitude per frequency bin
- Bin width equals the sample rate divided by the FFT size
- Harmonics are integer multiples of a fundamental

### Learning Objective

Students will be able to **apply** their understanding of the magnitude spectrum
to real audio by predicting, then verifying, how whistles, hums, and noise
differ in the frequency domain.

### Activities

1. **Predict then test** (5 min): Before touching the microphone, students write
   down what they expect the spectrum of a whistle, a hum, and "ssss" to look
   like. They then produce each sound and compare.
2. **The whistle test** (4 min): Students glide their pitch from low to high and
   describe, in their own words, what the peak trail shows and why it counts as
   evidence that the whole pipeline works.
3. **Find the resolution limit** (4 min): Students glide slowly and record the
   smallest change in reported frequency they can produce, then check that value
   against the bin width printed in the readout.
4. **Linear versus decibel** (2 min): Students toggle the scale and state which
   view they would choose for spotting a quiet harmonic, and which for showing
   off a loud fundamental.

### Assessment

Ask: "Your whistle reads 1077 Hz, and the bin width is 43.1 Hz. What is the
widest range of true frequencies that could have produced that reading? What
would you have to change to narrow it?"

## Privacy Note

The microphone stream is analyzed entirely in your browser. Nothing is recorded,
stored, or transmitted, and the audio is never routed to your speakers, so there
is no feedback risk. Closing the page ends microphone access.

## Related Resources

- [Chapter 14: Computing and Displaying a Real Spectrum](../../chapters/14-computing-and-displaying-a-real-spectrum/index.md)
- [Chapter 15: Windowing, Spectral Leakage, and Peak Detection](../../chapters/15-windowing-spectral-leakage-and-peak-detection/index.md)
- [Live Spectrum Display Bin Averaging](../live-spectrum-display-bin-averaging/index.md)
- [Frequency to Musical Note Calculator](../frequency-to-musical-note-calculator/index.md)
- [Harmonic Stack Synthesizer](../harmonic-stack-synthesizer/index.md)

## References

1. [Spectral density](https://en.wikipedia.org/wiki/Spectral_density) — what the bars are actually estimating.
2. [Web Audio API](https://en.wikipedia.org/wiki/Web_Audio_API) — the browser machinery p5.sound builds on to reach the microphone.
3. [Cent (music)](https://en.wikipedia.org/wiki/Cent_(music)) — the logarithmic pitch unit used in the readout.
