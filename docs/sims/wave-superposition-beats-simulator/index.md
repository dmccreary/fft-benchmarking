---
title: Wave Superposition Beats Simulator
description: Set the frequency and phase of two sine waves and compare constructive interference, destructive interference, and the beat pattern that appears when frequencies differ.
image: /sims/wave-superposition-beats-simulator/wave-superposition-beats-simulator.png
og:image: /sims/wave-superposition-beats-simulator/wave-superposition-beats-simulator.png
twitter:image: /sims/wave-superposition-beats-simulator/wave-superposition-beats-simulator.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Wave Superposition Beats Simulator

<iframe src="main.html" height="572px" width="100%" scrolling="no"></iframe>

[Run the Wave Superposition Beats Simulator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/wave-superposition-beats-simulator/main.html"
        height="572px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

When two waves arrive at the same place, their displacements simply add. That one
sentence produces two very different-looking outcomes, and this sim puts them
side by side.

The top two plots are the input waves alone. The bottom plot is their sum, on the
same time axis, so you can line any moment up across all three.

**Equal frequencies.** The relationship between the two waves never changes, so
the interference is steady. Phase alone decides the outcome: in phase and they
reinforce to double amplitude; a half cycle apart and they cancel to nothing.

**Unequal frequencies.** Now the relationship drifts. The waves slide in and out
of phase over and over, and the sum's amplitude pulses. That pulsing is a
**beat**, and it repeats at exactly $|f_1 - f_2|$ Hz.

The dashed purple envelope traces that pulsing. It comes straight out of the
identity

$$\sin A + \sin B = 2 \sin\!\frac{A+B}{2} \cos\!\frac{A-B}{2}$$

where the slow $\cos$ factor is the envelope and its zero crossings are the
moments of complete cancellation.

## How to Use

1. Start with both frequencies at 300 Hz. Drag **Wave 2 phase offset** from 0
   toward π and watch the sum shrink to nothing. Note that neither input wave
   changed size.
2. Return phase to 0. Now set **Wave 2 frequency** to 320 Hz. The steady pattern
   is replaced by a pulsing envelope, and the beat readout appears.
3. Count the pulses in the 100 ms window. At a 20 Hz beat you should see two.
4. Widen the gap to 350 Hz. The beat gets faster; the readout confirms 50 Hz.
5. Set the frequencies equal again and confirm the envelope and readout disappear
   — with no frequency difference there is no beat.

## Reading the Shading

| Shading | Meaning |
|---------|---------|
| Green | The waves are near in phase — constructive |
| Red | The waves are near opposite phase — destructive |
| Dashed purple | Beat envelope (only drawn when frequencies differ) |

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

12-15 minutes

### Prerequisites

- A sine wave has frequency, amplitude, and phase
- Waves add point by point

### Learning Objective

Students will be able to **examine** the summed waveform of two sine waves and
**compare** regions of constructive interference, destructive interference, and
the beat pattern produced when the frequencies are close but unequal.

### Activities

1. **Phase only** (5 min): At equal frequencies, students find the phase offsets
   for maximum and minimum sum amplitude and state them in radians.
2. **Introduce a difference** (5 min): Students set a 20 Hz difference, count the
   beats in the window, and verify against the readout.
3. **Predict the beat rate** (4 min): Given 440 Hz and 444 Hz, students predict
   the beat frequency and describe what a listener would hear.

### Assessment

Ask: "Two guitar strings are played together and you hear the loudness pulse
three times per second. What can you conclude about their frequencies, and what
would you do to fix it?"

## Related Resources

- [Chapter 7: Complex Numbers and Wave Superposition](../../chapters/07-complex-numbers-and-wave-superposition/index.md)

## References

1. [Superposition principle](https://en.wikipedia.org/wiki/Superposition_principle) — why displacements simply add.
2. [Beat (acoustics)](https://en.wikipedia.org/wiki/Beat_(acoustics)) — the beat frequency result and its use in tuning.
3. [Wave interference](https://en.wikipedia.org/wiki/Wave_interference) — constructive and destructive interference in general.
