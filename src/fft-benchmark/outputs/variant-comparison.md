# FFT Variant Comparison

Competing 512-point FFT implementations measured on a Raspberry Pi Pico 2 (RP2350, Cortex-M33 r1p0 @ 150 MHz, MicroPython v1.28.0).

All variants ran the same 10 test signals under identical conditions: one discarded warm-up per signal, then up to 15 timed trials, timed with the DWT cycle counter.

## Results

| Variant | Best cycles | Mean | Std dev | µs | Speedup | Max err vs V0 |
|---------|------------:|-----:|--------:|---:|--------:|--------------:|
| **v9** combined: real-input + specialized + branchless + VFMA | 91923 | 93257 | 719 | 621.7 | **1.41x** | 3.8e-05 |
| **v2** real-input FFT (half-size complex transform) | 103076 | 104729 | 703 | 698.2 | **1.26x** | 4.6e-05 |
| **v1** specialized trivial-twiddle stages | 116648 | 117655 | 588 | 784.4 | **1.11x** | 3.8e-06 |
| **v4** swap-list bit-reversal (branchless) | 126060 | 126964 | 579 | 846.4 | **1.03x** | exact |
| **v7** hand-encoded VFMA (fused multiply-add) | 128785 | 130332 | 644 | 868.9 | **1.01x** | 1.5e-05 |
| **v0** baseline radix-2 DIT (assembly) | 130024 | 131099 | 447 | 874.0 | **1.00x** | exact |
| **v6** interleaved complex layout | 2133832 | 2134938 | 724 | 14232.9 | **0.06x** | exact |
| **v3-viper** @micropython.viper (typed ints, boxed floats) | 22693209 | 23123396 | 586102 | 154156.0 | **0.01x** | exact |
| **v3-native** @micropython.native (compiled, boxed floats) | 23119348 | 23552932 | 585021 | 157019.5 | **0.01x** | exact |
| **v3-python** pure Python (interpreted) | 26501319 | 26936832 | 584716 | 179578.9 | **0.00x** | exact |

## What each result means

**v9 — combined: real-input + specialized + branchless + VFMA**  
All the compatible wins stacked. Deliberately excludes V6, whose layout conversion would cost more than it saves.

**v2 — real-input FFT (half-size complex transform)**  
Algorithmic win: transforms 512 real samples via a 256-point complex FFT. Does roughly half the butterflies, but pays an O(n) split step that eats part of the saving.

**v1 — specialized trivial-twiddle stages**  
Stages 1 and 2 have twiddles of (1,0) and (0,-1), so their butterflies need no multiplier at all -- just adds, subtracts and a sign flip.

**v4 — swap-list bit-reversal (branchless)**  
Bit-reversal walking a precomputed swap list instead of testing all 512 indices. Removes an unpredictable data-dependent branch.

**v7 — hand-encoded VFMA (fused multiply-add)**  
Uses VFMA, an instruction MicroPython's assembler does not support, emitted as hand-encoded machine words. Proves the technique works; the speedup is near zero because arithmetic was never the bottleneck.

**v0 — baseline radix-2 DIT (assembly)**  
Reference point. Radix-2 DIT, split buffers, generic stages throughout.

**v6 — interleaved complex layout**  
The interleaved KERNEL is the fastest measured (1.28x vs V0), but converting between split and interleaved layout costs ~95% of the run. Net: 15x slower. Worth it only if your data arrives interleaved already.

**v3-viper — @micropython.viper (typed ints, boxed floats)**  
Viper types integers natively but has no float pointer type, so the FFT's float work stays boxed. Barely faster than @native.

**v3-native — @micropython.native (compiled, boxed floats)**  
Compiles bytecode to machine code, removing interpreter dispatch, but values remain MicroPython objects.

**v3-python — pure Python (interpreted)**  
No acceleration. Same algorithm, same operation count as V0.

## Findings

### Optimizations compose, but sub-linearly

Multiplying the individual speedups of V2, V1, V4 and V7 predicts **1.46x**; the combined V9 actually delivers **1.41x**. They stack well because they attack different costs, but V1 and V7 partially overlap — V1 deletes the very multiplications V7 would have fused.

### The predicted small win was even smaller

Plan 02 predicted VFMA would yield 5–7%, reasoning that it removes only 2 instructions from a ~28-instruction butterfly. Measured: **1.0%**. Loop control, address arithmetic and memory access dominate so thoroughly that removing arithmetic barely registers. The prediction was directionally right and still too optimistic.

### Compiled Python is not fast Python

`@micropython.native` gives 1.15x over plain Python and `@micropython.viper` 1.17x — both far short of assembly's **204x**. The reason is specific and worth teaching: viper's native types are integer types. It has `ptr32` but no float pointer, so an FFT's float arithmetic stays boxed no matter how the loop counters are typed. Viper is excellent for integer and bit manipulation work; this is not that.

### An optimization can be correct and still lose

V6's interleaved kernel is the fastest transform measured — 1.28x faster than the baseline kernel. But the harness feeds every variant split buffers, so V6 must convert in and out, and that conversion costs about 95% of its runtime. Net result: **0.06x**, or 15x slower. The optimization is real; the integration cost destroys it. In a system where the ADC or DMA delivered interleaved samples directly, V6 would be the winner.

### Measurement discipline changed the headline number

An early ad-hoc measurement of V2 — no warm-up, single trial — reported **1.93x**. Under the disciplined harness the honest figure is **1.26x**. The difference was entirely a cold-start baseline: V0's first run costs ~186k cycles against ~130k warm, so the sloppy comparison flattered V2 by over 50%. This is the course's own subject matter caught in the act.

## Reproducing

```bash
# copy variants + harness to the device, then
mpremote connect /dev/cu.usbmodem14401 run device/compare.py
mpremote connect /dev/cu.usbmodem14401 cp :/outputs/variant-results.csv outputs/
python3 tools/build_comparison.py
```

