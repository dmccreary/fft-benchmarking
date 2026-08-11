---
title: DFT Frequency Bin Explorer
description: Adjust N and the sampling rate to calculate bin width, frequency resolution, and every bin's center frequency, and see the resolution-versus-cost trade directly.
image: /sims/dft-frequency-bin-explorer/dft-frequency-bin-explorer.png
og:image: /sims/dft-frequency-bin-explorer/dft-frequency-bin-explorer.png
twitter:image: /sims/dft-frequency-bin-explorer/dft-frequency-bin-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# DFT Frequency Bin Explorer

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the DFT Frequency Bin Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/dft-frequency-bin-explorer/main.html"
        height="422px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

A DFT does not report a continuous spectrum. It reports **N numbers**, one per
bin, and each bin is centered at a specific frequency:

$$f_k = k \cdot \frac{f_s}{N}$$

The spacing between those centers is the **bin width**, $f_s / N$, and it is also
your frequency resolution. Two tones closer together than one bin width land in
the same bin and cannot be separated.

That single formula contains the central engineering trade of this whole course:

- **More samples (larger N)** → narrower bins → finer resolution → **more
  computation**.
- **Fewer samples** → wider bins → coarser resolution → **faster**.

Nothing else changes it. You cannot get finer resolution from a shorter capture
by computing harder.

## Two Special Bins

- **Bin 0** is the **DC bin** at 0 Hz. It reports the signal's average value, not
  an oscillation.
- **Bin N/2** is the **Nyquist bin**, at half the sampling rate — the highest
  frequency the sampling rate can represent.

Bins above N/2 mirror the ones below for any real-valued input, which is why the
readout reports $N/2 + 1$ unique bins rather than N.

## How to Use

1. Set N to 16 and read the bin width. Verify by hand: 16,000 / 16 = 1,000 Hz.
2. Click individual bins and read their center frequency and covered range.
3. Double N to 32. Predict the new bin width before you look, then check.
4. Push N to 512. The boxes become too narrow to label — that density *is* the
   resolution you paid for. Note the bin width now.
5. Now leave N alone and halve the **Sampling rate**. The bin width halves too.
   Resolution improved — but what did you give up? (The top half of your
   frequency range.)

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- A DFT converts N samples into N frequency values
- Division and unit reasoning with Hz

### Learning Objective

Students will be able to **calculate** bin width, frequency resolution, and any
bin's center frequency from N and the sampling rate, and **demonstrate** the
tradeoff between resolution and bin count.

### Activities

1. **Compute before checking** (4 min): For three (N, f_s) pairs supplied by the
   instructor, students compute bin width by hand, then verify.
2. **Locate a frequency** (4 min): Given a 3,000 Hz tone at N = 32 and
   f_s = 16,000, students determine which bin it lands in.
3. **Two ways to improve resolution** (4 min): Students find both routes — raise
   N, or lower f_s — and state the cost of each.

### Assessment

Ask: "You need to distinguish two tones 40 Hz apart while sampling at 16 kHz.
What is the smallest N that will do it, and how many samples of capture time is
that?"

## Related Resources

- [Chapter 9: Computing and Validating the DFT](../../chapters/09-computing-and-validating-the-dft/index.md)

## References

1. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) — the bin definition used here.
2. [Spectral resolution](https://en.wikipedia.org/wiki/Spectral_resolution) — resolution as set by observation length.
