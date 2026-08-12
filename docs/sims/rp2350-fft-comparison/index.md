---
title: "512-Point FFT Time on RP2350 @ 150 MHz: Our Result vs. Published Libraries"
description: "Interactive Chart.js MicroSim comparing 512-point FFT execution time on RP2350 @ 150 MHz: our result vs. published libraries."
image: /sims/rp2350-fft-comparison/rp2350-fft-comparison.png
og:image: /sims/rp2350-fft-comparison/rp2350-fft-comparison.png
twitter:image: /sims/rp2350-fft-comparison/rp2350-fft-comparison.png
social:
   cards: false
quality_score: 0
---

# 512-Point FFT Time on RP2350 @ 150 MHz: Our Result vs. Published Libraries

<iframe src="main.html" height="422px" width="100%" scrolling="no"></iframe>

[Run the 512-Point FFT Time on RP2350 @ 150 MHz: Our Result vs. Published Libraries MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This horizontal bar chart compares 512-point FFT execution time across three
implementations, all on the **same board and the same clock speed** — a
Raspberry Pi Pico 2 (RP2350, Cortex-M33 @ 150 MHz). Holding the board and
clock constant is what makes the comparison fair: a faster chip or a higher
clock speed would make an implementation look better for reasons that have
nothing to do with the code itself.

| Implementation | Time | How it was obtained |
|---|---:|---|
| **Our V9** (combined optimizations) | **621.7 µs** | Directly measured, best-of-15 trials |
| pschatzmann C++ (bare-metal) | ≈ 1.10 ms | Scaled from a measured 91.78 µs, N=64 FFT using O(N·log₂N) |
| micropython-fourier (Peter Hinch) | ≈ 3.14 ms | Scaled from a measured 6.97 ms, 1024-point FFT using O(N·log₂N) |

Our V9 kernel — a hand-written ARM assembly FFT combining a real-input
algorithm, specialized trivial-twiddle stages, branchless bit-reversal, and a
hand-encoded fused multiply-add (VFMA) instruction — is roughly **1.8× faster**
than the same-chip C++ reference and **5× faster** than the only other
published MicroPython library benchmarked on this exact board. Full source
data, methodology, and caveats are in
[Appendix: How Our 512-Point Assembly FFT Compares to Published Libraries](../../appendices/benchmark-comparison/index.md).

## How to Use

Hover over any bar to see its exact time and how that number was obtained —
whether it was measured directly at 512 points or scaled from a different
transform size published by the original source.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/rp2350-fft-comparison/main.html"
        height="422px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level
College juniors/seniors (embedded systems / DSP course)

### Duration
5-10 minutes

### Prerequisites
FFT computational complexity (O(N log N)), basic benchmarking methodology,
familiarity with the RP2350/Cortex-M33 platform used throughout this course

### Activities

1. **Exploration** (2 min): Hover each bar and read the tooltip. Note which
   bars are "measured" versus "scaled."
2. **Guided Discussion** (5 min): Ask why it would be misleading to add a
   fourth bar for the Cortex-M4 (`Cortex-M-FFT`) or OpenMV H7 (`ulab_samples`)
   results from the appendix. Discuss why board and clock speed must be held
   constant for a benchmark comparison to be meaningful.
3. **Assessment** (3 min): Have students explain, in their own words, why
   scaling a 64-point or 1024-point benchmark to an equivalent 512-point time
   via O(N·log₂N) produces an estimate rather than a measurement.

### Assessment
Students should be able to identify which bar is directly measured, explain
the O(N·log₂N) scaling used for the other two, and state why same board/same
clock is a precondition for comparing FFT benchmarks at all.

## References

1. [Appendix: How Our 512-Point Assembly FFT Compares to Published Libraries](../../appendices/benchmark-comparison/index.md) — full source data and caveats
2. [peterhinch/micropython-fourier](https://github.com/peterhinch/micropython-fourier) — published MicroPython inline-assembler FFT library
3. [Microcontroller FFT & IFFT Performance Benchmark (N=64) — Phil Schatzmann](https://www.pschatzmann.ch/home/2026/07/17/microcontroller-fft-ifft-performance-benchmark-n64/)
