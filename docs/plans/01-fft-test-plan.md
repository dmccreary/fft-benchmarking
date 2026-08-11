# Test Plan 01: ARM Assembly-Language FFT on the Pico 2

**Status:** ✅ Complete — implemented and verified on hardware. All 10 signals pass.
**Target hardware:** Raspberry Pi Pico 2 (RP2350), connected at `/dev/cu.usbmodem14401`.
**Implementation:** [`src/fft-benchmark/`](../../src/fft-benchmark/) · **Results:** [`verification-report.md`](../../src/fft-benchmark/outputs/verification-report.md)

| Outcome | Measured |
|---|---|
| Time per 512-point FFT | 885.4 µs (132,808 cycles) |
| Throughput | 1,129 FFT/sec |
| Speedup over pure MicroPython | 178× |
| Accuracy vs. numpy | ~10⁻⁷ relative (float32 epsilon) |
| Correctness | 10/10 signals PASS |

## 1. Overview & Goal

Build a hand-written **ARM assembly-language** 512-point FFT that students can **call directly
from their MicroPython code**, run it against 10 synthetic sound-like test signals, verify the
output is numerically correct, and measure execution time with cycle-accurate timestamps taken
immediately before and after the FFT call.

Two requirements drive every decision below:

1. **Maximum performance** — the FFT core is real assembly using the hardware FPU, not
   interpreted Python.
2. **MicroPython-callable** — all existing course lessons are MicroPython, so the deliverable
   must be `import`-able from a student's `.py` file.

### Confirmed hardware facts

Read directly off the physical chip's registers (not from a datasheet):

| Fact | Value | How confirmed |
|---|---|---|
| CPU core | Arm **Cortex-M33**, revision **r1p0** | `CPUID` = `0x411FD210` |
| Hardware FPU | Present (single-precision, FPv5-SP) | `MVFR0` = `0x10110021` |
| Clock speed | 150 MHz | `machine.freq()` |
| Firmware | MicroPython v1.28.0 (stock, `RPI_PICO2`) | `sys.implementation` |

Instruction reference, matched to the exact core revision, saved in this repo at
[`arm-programming-guide/arm-cortex-m33-r1p0-generic-user-guide.pdf`](../../arm-programming-guide/arm-cortex-m33-r1p0-generic-user-guide.pdf):
§3.12 Floating-point instructions, §4.6 Floating-Point Unit, §3.8 Saturating instructions,
§3.9 Packing and unpacking instructions.

### The architectural decision: inline assembly on stock firmware

The original draft of this plan assumed a standalone Pico SDK C firmware project, because
MicroPython's inline assembler was assumed to lack floating-point coverage. **That assumption
was tested on the board and proved wrong.**
[`src/kits/oled-2-buttons/04-asm-thumb-probe.py`](../../src/kits/oled-2-buttons/04-asm-thumb-probe.py)
probes the runtime directly and found **full VFP support** in `@micropython.asm_thumb`:

```
ok  vldr / vstr        (load & store float)
ok  vadd / vsub / vmul (float arithmetic)
ok  vmov               (core <-> float register)
ok  vcvt_f32_s32       (int -> float conversion)
ok  s16+               (high float registers)
```

This is a significantly better outcome for a MicroPython-based course:

| | Inline asm (chosen) | Custom firmware / C module |
|---|---|---|
| Student setup | copy one `.py` file | flash custom firmware |
| Toolchain needed | none | arm-none-eabi-gcc, CMake, Ninja, Pico SDK |
| Works on stock MicroPython | yes | no |
| Uses hardware FPU | yes | yes |
| Callable from MicroPython | yes, natively | needs a C wrapper |

Since no embedded toolchain is installed on the development machine either, the inline-assembly
path removes a substantial bootstrap barrier for both instructor and students.

## 2. Student-Facing API (Reuse in MicroPython)

This is the primary deliverable and the reason the design is shaped the way it is. A student
writes:

```python
from fft_asm import FFT

fft = FFT(512)                 # precomputes twiddle + bit-reversal tables once
re, im = fft.make_buffers()    # array('f', ...) of length 512
# ... fill re[] with samples ...
cycles = fft.run_timed(re, im) # in-place FFT, returns CPU cycles elapsed
mags = fft.magnitude(re, im)   # optional helper
```

Design constraints this imposes, all satisfied by the assembly design in §3:

- **Buffers are `array('f')`** — the natural MicroPython float32 buffer, passed to assembly by
  address via `uctypes.addressof()`. No data copying or marshalling per call.
- **In-place transform** — no allocation inside the timed region, so timing measures the FFT
  and nothing else.
- **Tables precomputed once** in the constructor, not per call.
- **Pointer-only assembly ABI** — nothing crosses the Python/assembly boundary in FP registers,
  so the same `.s`-equivalent routine could later be lifted into a C user module or standalone
  firmware unchanged if maximum-performance comparison work ever needs it.

## 3. FFT Algorithm & Assembly Design

**Algorithm:** iterative radix-2 decimation-in-time (DIT) Cooley-Tukey, in-place,
single-precision float, N = 512 (2⁹ → 9 stages). This matches the concepts already committed to
in [`docs/chapters/12-building-the-fft/index.md`](../chapters/12-building-the-fft/index.md) (Radix-2,
Decimation In Time, Bit Reversal Permutation, Twiddle Factors, In-Place Computation) and the
512-sample buffer size used by the [Cornell Labs reference](../cornell-labs/pico-example.md).

**Work split — assembly does the hot loop, Python does the sequencing.**
`@micropython.asm_thumb` accepts at most 4 arguments (r0–r3) and register pressure in a
triple-nested loop is severe. So:

- **Python drives the 9-iteration stage loop** — runs 9 times total, negligible overhead.
- **Assembly performs every butterfly within a stage** in a single call — 2304 butterflies
  total across all stages, essentially all of the arithmetic.

Two assembly routines:

```python
bit_reverse_asm(re_addr, im_addr, table_addr, n)
    # integer-only permutation; the tractable "first win"

fft_stage_asm(re_addr, im_addr, tw_addr, params_addr)
    # one full DIT stage: all butterflies, FPU arithmetic
    # params = array('i', [n, half, twiddle_stride])
```

The butterfly, per pair:

```
tr = wr*re[i2] - wi*im[i2]
ti = wr*im[i2] + wi*re[i2]
re[i2] = re[i1] - tr    im[i2] = im[i1] - ti
re[i1] = re[i1] + tr    im[i1] = im[i1] + ti
```

Twiddle factors (`cos/sin` of `-2πk/N`, k = 0..255) and the 512-entry bit-reversal permutation
are precomputed **on the device at construction time** — they are pure arithmetic, need no host
tooling, and keep the module a single self-contained `.py` file with no generated headers.

## 4. Test Data — 10 Synthetic Sound-Like Signals

512 samples each, 12.8 kHz sample rate (matching the Cornell reference), giving 25 Hz per bin.
Each signal targets a distinct, individually meaningful correctness property — not 10 arbitrary
arrays. Several sit exactly on bin centres so results can be checked by eye; two deliberately
do not, to make spectral leakage visible as a teaching point.

| # | File | Signal | Property under test |
|---|------|--------|---------------------|
| 01 | `01-silence.csv` | all zeros | zero in → zero out |
| 02 | `02-dc-offset.csv` | constant 0.5 | all energy in bin 0 |
| 03 | `03-single-tone-450hz.csv` | sine, 450 Hz = bin 18 exactly | one sharp peak, no leakage |
| 04 | `04-two-tone-dtmf.csv` | 697 + 1209 Hz (DTMF "1") | realistic composite; not bin-exact → leakage |
| 05 | `05-harmonic-series.csv` | 200/400/600 Hz, amplitudes 1.0/0.5/0.25 | linearity, known ratios |
| 06 | `06-chirp-linear.csv` | linear sweep 200 → 3000 Hz | broadband, Parseval energy check |
| 07 | `07-white-noise.csv` | seeded Gaussian noise | numerical stability, flat spectrum |
| 08 | `08-nyquist-tone.csv` | alternating +1/−1 | energy exactly at bin 256 (fs/2) |
| 09 | `09-impulse.csv` | unit impulse at sample 0 | flat magnitude across all bins |
| 10 | `10-full-scale-clipping.csv` | 1 kHz tone hard-clipped to ±1.0 | odd harmonics, no NaN/overflow |

**Format:** CSV, one float per line, 512 lines, range [−1.0, 1.0]. `inputs/manifest.json`
records each signal's parameters and expected properties.

**Flow:** generated on the host by `tools/generate_test_signals.py` (numpy), copied to the
device filesystem with `mpremote cp` (10 × 512 floats ≈ 60 KB, trivial against 3 MB free),
processed on-device, and results copied back. This keeps `inputs/` and `outputs/` as real
directories on the host where they can be inspected and version-controlled.

## 5. Precise Timing Methodology

**Primary: the DWT cycle counter**, read from MicroPython via `machine.mem32` — the same
technique already used in [`02-get-info.py`](../../src/kits/oled-2-buttons/02-get-info.py) to
read `CPUID`/`MVFR0`. No C required.

```
DEMCR     0xE000EDFC   bit 24 (TRCENA)     -> enable trace subsystem
DWT_CTRL  0xE0001000   bit 0  (CYCCNTENA)  -> enable cycle counter
DWT_CYCCNT 0xE0001004                       -> free-running cycle count
```

At 150 MHz one cycle is **6.667 ns**, so this brackets the FFT call with nanosecond-class
resolution — far finer than `time.ticks_us()`.

**Verification gate:** DWT must be confirmed actually free-running on this specific RP2350
silicon before any FFT timing is trusted — on some implementations the counter only runs during
an attached debug session. The check is a dedicated milestone (§8, step 2): read `CYCCNT` twice
across a known delay and confirm it advances at ~150 MHz.

**Cross-check:** `time.ticks_us()` around the same call. If cycles/150 disagrees materially
with the microsecond delta, DWT is not behaving as assumed.

**Per-signal protocol:** one warm-up run (discarded), then N timed trials (default 20), each
recording DWT cycles, derived microseconds, and the `ticks_us` cross-check. Mean and standard
deviation are computed per signal.

## 6. Correctness Verification

"Working correctly" means the on-device spectrum agrees with a host-computed numpy reference,
bin by bin, within a float32-appropriate tolerance, across all 10 signals — including the edge
cases — not merely "it ran without crashing."

1. `tools/generate_test_signals.py` computes the double-precision `numpy.fft.fft` ground truth →
   `reference/NN-name-reference.csv`.
2. The device runs the assembly FFT on each signal and writes
   `outputs/NN-name-spectrum.csv` (512 rows of `re,im`) plus `outputs/NN-name-timing.csv`.
   Spectrum and timing stay in separate files so correctness and performance data are never
   conflated in one schema.
3. `tools/verify_results.py` compares each output against its reference, computing per-bin
   absolute error, max error, and RMS error, applying a tolerance appropriate to float32
   accumulation over 9 stages, and writes a consolidated PASS/FAIL table to
   `outputs/verification-report.md`.

A **three-way validation** guards against a subtle failure mode: a pure-Python reference FFT
runs first and is checked against numpy, so if the assembly later disagrees we can tell an
*algorithm* bug from an *assembly-encoding* bug.

## 7. Directory Layout

```
src/fft-benchmark/
  README.md
  device/                       # runs on the Pico
    fft_asm.py                  # ** the student-facing module **
    fft_python.py               # pure-Python reference FFT (validation only)
    dwt_timer.py                # DWT cycle-counter helper
    benchmark.py                # on-device driver: load -> FFT -> time -> write
  tools/                        # runs on the host
    generate_test_signals.py    # -> inputs/, reference/
    deploy.py                   # mpremote copy helpers
    verify_results.py           # outputs/ vs reference/ -> verification-report.md
  inputs/                       # 10 input signals + manifest.json
  reference/                    # 10 numpy ground-truth spectra
  outputs/                      # 10 spectra + 10 timing files + report
```

Kept separate from `src/kits/oled-2-buttons/` (a different hardware kit), though it follows the
same MicroPython conventions. This plan document stays out of `mkdocs.yml`'s `nav:` — it is a
maintainer-facing artifact, not student-facing curriculum.

## 8. Implementation Milestones

1. ✅ **Inline assembler capability probe** — full VFP support confirmed (see §1).
2. ✅ **DWT timing verification** — counter free-runs without a debugger, measured 149.9 MHz
   against 150 MHz nominal.
3. ✅ **Host test-signal generation** — 10 input CSVs, 10 numpy reference spectra, manifest.
4. ✅ **Pure-Python reference FFT** — validated against numpy, max error 2×10⁻⁵ (float32
   rounding), all peak bins correct.
5. ✅ **Assembly implementation** — bit-reversal then the FPU butterfly stage. Assembly output
   agrees with the Python reference **bit-for-bit** (max difference 0.0).
6. ✅ **End-to-end correctness run** — 10/10 signals PASS, relative error ~10⁻⁷.
7. ✅ **Timing instrumentation** — 20 trials per signal after a discarded warm-up; 885.4 µs
   mean, 178× faster than pure MicroPython.
8. ✅ **Results & documentation** — [`outputs/verification-report.md`](../../src/fft-benchmark/outputs/verification-report.md).
   At 885.4 µs the FFT consumes 2.2 % of a 12.8 kHz / 512-sample frame budget (4.4 % with the
   Cornell reference's 50 % overlap), so real-time audio processing has ample headroom.

### Notable findings

- **Timing is data-independent.** Spread across the 10 signals is 0.40 % of the mean — radix-2
  DIT executes the same butterflies regardless of input values. This is a useful teaching point:
  it means benchmark results generalise across signal content, unlike data-dependent algorithms.
- **The assembly matches pure Python exactly**, not just within tolerance. Both use the same
  float32 operations in the same order, so they round identically — which is strong evidence the
  instruction encoding is correct rather than merely approximately right.

## 9. Future Work

- **Fixed-point Q15 variant** — the learning graph already has unused `Q15 Format`,
  `Q31 Format`, `Saturating Arithmetic`, and `Fixed Point Arithmetic` concept nodes; a
  companion comparison against hardware float would use the DSP-extension saturating and
  packing instructions (ARM guide §3.8–3.9).
- **Real-time ADC input** — streaming live audio rather than compiled-in test vectors, closer
  to the Cornell pipeline.
- **Compiled-module comparison** — if a maximum-performance ceiling is ever needed, the same
  pointer-ABI routine can be rebuilt as a C user module or standalone firmware; the assembly
  itself would not need redesign.

## 10. References

- [ARM Cortex-M33 Devices Generic User Guide, r1p0](../../arm-programming-guide/arm-cortex-m33-r1p0-generic-user-guide.pdf) — matched to the confirmed CPU revision
- [Cornell Labs: FFT/iFFT on the Pico 2](../cornell-labs/pico-example.md) — prior-art 512-sample real-time audio pipeline on the same chip
- [`docs/chapters/12-building-the-fft/index.md`](../chapters/12-building-the-fft/index.md) — course concepts implemented here
- [`src/kits/oled-2-buttons/02-get-info.py`](../../src/kits/oled-2-buttons/02-get-info.py) — established the `machine.mem32` register-read technique reused for DWT
- [`src/kits/oled-2-buttons/04-asm-thumb-probe.py`](../../src/kits/oled-2-buttons/04-asm-thumb-probe.py) — the probe that settled the architecture
