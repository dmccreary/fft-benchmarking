# Appendix: How Our 512-Point Assembly FFT Compares to Published Libraries

This project built a hand-written ARM assembly-language FFT, callable directly from
MicroPython, that computes a 512-bin FFT in **621.7 µs** on a Raspberry Pi Pico 2 (RP2350,
Cortex-M33 @ 150 MHz) — about 289× faster than the same transform in pure interpreted
MicroPython. Reaching that result took a series of experiments exercising both the RP2350's
hardware floating-point unit (FPU) and its DSP instruction extensions, combining a
real-input algorithm, specialized trivial-twiddle stages, branchless bit-reversal, and a
hand-encoded fused multiply-add (VFMA) instruction. This appendix compares that result
against other published FFT implementations.

**Status:** Web research, August 2026. No published MicroPython library was found benchmarked
at exactly 512 points on RP2040/RP2350, so most comparisons below required scaling a
different transform size to 512 points using the FFT's O(N log₂N) cost, or comparing across
chips. Every number that required scaling or an assumption is flagged in the Notes column.

## Our measured result

From [`variant-comparison.md`](../../../src/fft-benchmark/outputs/variant-comparison.md),
measured on a Raspberry Pi Pico 2 (RP2350, Cortex-M33 @ 150 MHz), best-of-15 trials after a
discarded warm-up:

| Variant | Best cycles | Mean cycles | Time (mean) | Speedup vs. baseline |
|---|---:|---:|---:|---:|
| **V9 — combined (real-input + specialized + branchless + VFMA)** | 91,923 | 93,257 | **621.7 µs** | 1.41× |
| V0 — baseline radix-2 DIT (assembly) | 130,024 | 131,099 | 874.0 µs | 1.00× |
| V3-python — pure interpreted MicroPython | 26,501,319 | 26,936,832 | 179.6 ms | 0.003× |

## Comparison to published/external sources

Each row's source name links to the original. "Scaled to 512-pt" estimates use the FFT's
O(N log₂N) cost to convert a different transform size to an equivalent 512-point figure;
see [Caveats](#caveats) before treating any scaled number as a measurement. How each row
compares to our V9 (621.7 µs) is discussed in [Analysis](#analysis) below, not repeated here.

| Source | Measured | Board / chip | Language | Result | Scaled to 512-pt |
|---|---|---|---|---:|---:|
| [micropython-fourier](https://github.com/peterhinch/micropython-fourier) | 1024-pt forward FFT | **Pico 2 (RP2350)** — same board | MicroPython (asm) | 6.97 ms | ≈3.14 ms |
| [pschatzmann blog](https://www.pschatzmann.ch/home/2026/07/17/microcontroller-fft-ifft-performance-benchmark-n64/) | N=64 FFT, float | **RP2350 @ 150 MHz** — same chip | C++ (bare-metal) | 91.78 µs | ≈1.10 ms |
| same source | N=64 FFT, float | RP2040 (no hardware FPU) | C++ | 939.43 µs | not scaled — different chip |
| [fixedpoint-fft](https://github.com/pschatzmann/fixedpoint-fft) `Performance.md` | N=64, several boards | STM32F411, ESP32(-S3), STM32H7, UNO R4, Nano | C++ | 23.4–17,166 µs | not scaled — supporting data |
| [Cortex-M-FFT](https://github.com/PY1CX/Cortex-M-FFT) | 512-pt FFT, float32 (CMSIS-DSP) | Cortex-M4 (ST Nucleo) | Bare C, SIMD — not MicroPython | 7,113 cycles (≈71 µs @ 100 MHz, assumed) | already 512-pt |
| [ulab_samples](https://github.com/rcolistete/ulab_samples) | 1024-pt FFT, float32, best board | OpenMV H7 (Cortex-M7 @ 480 MHz) | CircuitPython (C module) | 0.397 ms | not scaled — 3.2× our clock |
| [Adafruit ulab guide](https://learn.adafruit.com/ulab-crunch-numbers-fast-with-circuitpython/a-simple-benchmark) | general ulab speed claims | various CircuitPython boards | CircuitPython | no FFT-specific number found | — |

The chart below isolates the three rows above that share the same board and
clock speed (RP2350 @ 150 MHz), so their bar lengths are directly comparable
without the scaling caveats that apply across chips.

<iframe src="../../sims/rp2350-fft-comparison/main.html" height="442px" width="100%" scrolling="no"></iframe>

## Analysis

- **The one apples-to-apples MicroPython comparison** is Peter Hinch's `micropython-fourier`,
  because it is (a) a real published MicroPython library, (b) hand-written assembler like this
  project's, and (c) benchmarked on the exact same board (Pico 2 / RP2350). Scaled to 512
  points, this project's V9 is about **5× faster**, and even the unoptimized V0 baseline is
  about **3.6× faster**. This is the strongest evidence for the "faster than most other
  published MicroPython libraries" claim.
- **Same-chip, non-Python reference** (pschatzmann's C++ library on RP2350): our V9 is still
  about **1.8× faster** than the scaled estimate, even though that comparison isn't running
  under MicroPython at all and therefore pays none of the interpreter/boxing overhead our own
  V3-python variant shows costing ~289× (26.9 ms mean vs. 93,257 cycles / 621.7 µs mean for V9).
- **CMSIS-DSP is faster, but it isn't a MicroPython library.** ARM's own hand-tuned production
  DSP library outperforms our V9 outright, which is expected — it has no Python call boundary,
  no `viper`/`native` compilation step, nothing. It represents a ceiling for "FFT on this class
  of core," not a competing MicroPython implementation.
- **No RP2040/RP2350 ulab number could be found.** ulab is the library most people mean by
  "a MicroPython FFT library," but every published ulab FFT benchmark located during this
  research used STM32/SAMD/OpenMV-class boards, not RP2040 or RP2350, and most used
  CircuitPython rather than stock MicroPython. If a truly direct ulab comparison is needed, it
  would have to be measured directly on this project's own Pico 2 board rather than sourced
  from a search, since none currently exists in the literature.

## Caveats

1. **Scaling by N·log₂N is an estimate, not a measurement.** It assumes constant per-butterfly
   cost is independent of transform size, which is approximately but not exactly true (table
   setup, twiddle computation, and cache/pipeline effects can shift with size).
2. **Timing windows differ.** This project's numbers are kernel time only (excludes table
   construction and buffer loading, per [26-benchmarking/index.md](../../labs/26-benchmarking/index.md)).
   Peter Hinch's number is "end of acquisition to result available," which may include a small
   amount beyond pure kernel time. CMSIS-DSP's figure is pure kernel cycles.
3. **The CMSIS-DSP clock speed is an assumption.** The source cycle count (7,113 cycles) did
   not publish the clock speed used; 100 MHz was chosen only because it matches a comparable
   Cortex-M4 board (STM32F411) seen elsewhere in this research, not because it was confirmed for
   this specific benchmark.
4. **No comparison here is a substitute for a same-board, same-methodology measurement.** The
   only fully controlled comparison in this research is against Peter Hinch's library, and even
   that required scaling from 1024 to 512 points.

## Sources

- [peterhinch/micropython-fourier](https://github.com/peterhinch/micropython-fourier) — published MicroPython inline-assembler FFT library, Pico 2 benchmark
- [Microcontroller FFT & IFFT Performance Benchmark (N=64) — Phil Schatzmann](https://www.pschatzmann.ch/home/2026/07/17/microcontroller-fft-ifft-performance-benchmark-n64/) — RP2350/RP2040/ESP32/STM32 N=64 benchmark table
- [pschatzmann/fixedpoint-fft](https://github.com/pschatzmann/fixedpoint-fft) — header-only C++ FFT library and its `Performance.md`
- [PY1CX/Cortex-M-FFT](https://github.com/PY1CX/Cortex-M-FFT) — CMSIS-DSP `arm_cfft_f32` cycle counts across Cortex-M cores
- [rcolistete/ulab_samples](https://github.com/rcolistete/ulab_samples) — ulab FFT benchmark tables across CircuitPython boards
- [ulab: Crunch Numbers fast in CircuitPython — Adafruit Learning System](https://learn.adafruit.com/ulab-crunch-numbers-fast-with-circuitpython/a-simple-benchmark) — canonical ulab reference guide
- [This project's `variant-comparison.md`](../../../src/fft-benchmark/outputs/variant-comparison.md) — our own measured V0–V9 results
