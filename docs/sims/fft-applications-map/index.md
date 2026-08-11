---
title: FFT Applications Map
description: Six real-world FFT application domains, each traced back to the chapter of this course that taught the technique it depends on.
image: /sims/fft-applications-map/fft-applications-map.png
og:image: /sims/fft-applications-map/fft-applications-map.png
twitter:image: /sims/fft-applications-map/fft-applications-map.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# FFT Applications Map

<iframe src="main.html" height="487px" width="100%" scrolling="no"></iframe>

[Run the FFT Applications Map MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/fft-applications-map/main.html"
        height="487px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Voice recognition, noise cancellation, machine health monitoring, radar,
software defined radio, and the Wi-Fi you are probably reading this over. All
six run on an FFT, and none of them requires anything you have not already
built.

That last part is the point of this map. Each card names the chapter whose
technique the application leans on most directly, and in every case it is a
chapter you have finished:

| Domain | Leans on | Because |
|---|---|---|
| Voice Recognition | Chapter 16 | the frame-by-frame real-time pipeline |
| Noise Cancellation | Chapter 7 | phase, which is what the complex part of a bin carries |
| Machine Monitoring | Chapter 15 | peak detection under leakage |
| Radar Processing | Chapter 8 | correlation |
| Software Defined Radio | Chapter 6 | aliasing, used deliberately |
| Communication Systems | Chapter 13 | the inverse transform |

A few of these connections are worth stating out loud because they are not
obvious:

**Noise cancellation is a phase problem, not a magnitude problem.** Getting the
amplitude of the inverted copy right and the phase wrong does not reduce the
noise — it can double it. That is Chapter 7's material doing real work.

**Radar is correlation.** A radar looks for a known transmitted pulse inside a
noisy return, which is precisely the question Chapter 8 asked about a musical
note. The reason it is done with an FFT is that correlation in the frequency
domain is a multiplication, and multiplication is cheap.

**In OFDM, the inverse FFT is the transmitter.** Not a preprocessing step for
the transmitter — the modulator itself. Data goes into frequency bins, an
inverse FFT comes out as a waveform, and that waveform is what is broadcast.

Each card also carries a capstone project idea, sized to be genuinely buildable
on a Pico 2 with the code you already have.

## How to Use

1. Hover any card for a one-line preview of what that domain does with an FFT.
2. Click a card for the full entry: what the application is, which chapter's
   technique it depends on and why, and one capstone project idea.
3. Work through all six. Then pick the one whose *chapter* you found most
   interesting, rather than the one whose domain sounds coolest — the chapter is
   what you will actually be doing.
4. Press **Clear selection** to return to the overview.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 10-12 minutes

**Prerequisites:**

- Chapters 6, 7, 8, 13, 15, and 16 completed
- A working FFT on the target hardware

**Learning Objective:** Connect each of six real-world FFT application domains
back to the specific course chapter that taught its underlying technique.

**Activities:**

1. **Guess the chapter (4 min).** Before clicking anything, show the six card
   names and ask students to name the chapter each one depends on most. Collect
   answers, then reveal. The two most often missed are noise cancellation
   (students say "windowing"; it is phase) and radar (students say "peak
   detection"; it is correlation).
2. **Trace one connection in detail (3 min).** Pick machine monitoring. Ask what
   goes wrong if you use a rectangular window: the running-speed peak leaks
   across the fault frequency and hides it. This is Chapter 15's tradeoff with
   money on it.
3. **Choose a capstone (4 min).** Have each student pick a domain and restate
   its project idea as a benchmark question in the form used by the
   [Experimental Design Anatomy](../experimental-design-anatomy/index.md)
   simulation. The two exercises are designed to be run back to back.

**Assessment:** Choose one of the six domains and write the three things you
would need to measure to know whether your implementation works — not whether it
is fast, whether it is *correct*.

## Related Resources

- [Experimental Design Anatomy](../experimental-design-anatomy/index.md) — turn a project idea into a testable question
- [Variant Performance Dashboard](../variant-performance-dashboard/index.md) — comparing implementations once you have one
- [FFT Stage Architecture](../fft-stage-architecture/index.md) — what runs inside all six of these

## References

- [IEEE 802.11 and OFDM overview](https://en.wikipedia.org/wiki/Orthogonal_frequency-division_multiplexing) — the inverse FFT as a modulator
- [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf) — the hardware every capstone idea here targets
