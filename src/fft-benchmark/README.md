# Assembly FFT Benchmark for the Raspberry Pi Pico 2

A 512-point radix-2 FFT with the arithmetic hand-written in ARM assembly, callable
directly from MicroPython on **stock firmware** — no custom firmware build, no
`arm-none-eabi-gcc`, no Pico SDK.

## Results

Measured on a Raspberry Pi Pico 2 (RP2350, Cortex-M33 r1p0, 150 MHz) running
MicroPython v1.28.0:

| Metric | Value |
|---|---|
| Mean time per 512-point FFT | **885.4 µs** (132,808 CPU cycles) |
| Throughput | **1,129 FFT/sec** |
| Speedup vs. pure MicroPython | **178×** |
| Accuracy vs. numpy (float64) | relative error ~10⁻⁷ (float32 epsilon) |
| Correctness | **10 / 10 signals PASS** |
| Real-time headroom | 2.2 % of a 12.8 kHz / 512-sample frame |

See [`outputs/verification-report.md`](outputs/verification-report.md) for the
full per-signal breakdown.

## Student usage

Copy `device/fft_asm.py` and `device/dwt_timer.py` to the Pico, then:

```python
from fft_asm import FFT

fft = FFT(512)                  # builds twiddle + bit-reversal tables once
re, im = fft.make_buffers()     # array('f') buffers, length 512

for i, sample in enumerate(my_samples):   # samples in [-1.0, 1.0]
    re[i] = sample

cycles = fft.run_timed(re, im)  # in-place transform, returns CPU cycles
mags = fft.magnitude(re, im)    # magnitude spectrum

print("took", cycles, "cycles")
print("peak bin:", max(range(256), key=lambda k: mags[k]))
```

Bin *k* corresponds to `k * sample_rate / 512` Hz. At the 12.8 kHz sample rate
used here, that is 25 Hz per bin.

## How it works

The FFT is split so that assembly does the arithmetic and Python does only the
sequencing:

- **`_bit_reverse_asm`** — integer-only permutation of the input into
  bit-reversed order.
- **`_fft_stage_asm`** — one complete radix-2 stage: every butterfly in that
  stage, using the hardware FPU (`vldr`/`vstr`/`vadd`/`vsub`/`vmul` on `s0`–`s31`).

Python's loop runs 9 times (once per stage of a 512-point transform); assembly
performs all 2,304 butterflies. Loop order inside a stage is *j-major* — for each
twiddle factor, sweep every block that uses it — so each twiddle pair is loaded
once per stage instead of once per butterfly.

Buffers are `array('f')` passed by address via `uctypes.addressof()`, so no data
is copied per call and nothing is allocated inside the timed region.

## Timing

`dwt_timer.py` reads the Cortex-M33 **DWT cycle counter** through `machine.mem32`
— the same memory-mapped register technique used in
`src/kits/fft-lab-kit/probes/02-get-info.py`. At 150 MHz one cycle is 6.667 ns, far
finer than `time.ticks_us()`.

The counter was verified to free-run on this silicon (it does *not* require an
attached debugger), measuring 149.9 MHz against a nominal 150 MHz.

## Reproducing

```bash
# 1. generate the 10 test signals + numpy reference spectra (host)
python3 tools/generate_test_signals.py

# 2. copy the device modules and inputs to the Pico
mpremote connect /dev/cu.usbmodem14401 cp device/*.py :
for f in inputs/*.csv; do mpremote connect /dev/cu.usbmodem14401 cp "$f" :/inputs/; done

# 3. run the benchmark on the device
mpremote connect /dev/cu.usbmodem14401 run device/benchmark.py

# 4. copy results back, then verify against the numpy reference
python3 tools/verify_results.py
```

Host requirements: `numpy`, `mpremote`. Device requirements: stock MicroPython.

## Competing variants

Nine further implementations explore the architecture tradeoffs — see
[`variants/README.md`](variants/README.md) for the full analysis.

| Variant | Best cycles | Speedup | Verdict |
|---|---:|---:|---|
| v9 combined | 91,923 | **1.41×** | wins stack, sub-linearly |
| v2 real-input FFT | 103,076 | 1.26× | algorithm beats micro-optimization |
| v1 specialized stages | 116,648 | 1.11× | stop multiplying by 1 |
| v4 branchless bit-reversal | 126,060 | 1.03× | modest payoff |
| v7 hand-encoded VFMA | 128,785 | 1.01× | the assembler is not the ISA |
| v0 baseline | 130,024 | 1.00× | reference point |
| v6 interleaved layout | 2,133,832 | 0.06× | fastest kernel, worst result |
| v3 viper / native / python | 22.7M–26.5M | ~0.005× | compiled Python is not fast Python |

The headline findings: **V7 hand-encodes an instruction MicroPython's assembler refuses to
emit — advanced work — and gains 1%**, while V2's algorithmic change gains 26%. **V6 has the
fastest kernel measured yet is 15× slower overall**, because layout conversion costs 95% of its
runtime. And an undisciplined early measurement reported V2 at 1.93× when the honest figure is
1.26× — the difference was entirely a cold-start baseline.

## Layout

```
device/     runs on the Pico              (see device/README.md)
  fft_asm.py       the deliverable: assembly FFT, student-facing API
  fft_python.py    pure-Python reference FFT (validation + speedup baseline)
  dwt_timer.py     DWT cycle-counter helper
  benchmark.py     on-device driver for all 10 signals
  compare.py       variant comparison harness
variants/   competing implementations     (see variants/README.md)
  v0_baseline, v1_specialized, v2_real_input, v3_{python,native,viper},
  v4_fast_bitrev, v6_interleaved, v7_vfma_raw, v9_combined, common.py
tools/      runs on the host              (see tools/README.md)
  generate_test_signals.py
  verify_results.py
  build_comparison.py
inputs/     10 test signals (512 samples each) + manifest.json
reference/  numpy double-precision ground-truth spectra
outputs/    device spectra, timing data, verification + comparison reports
```

## Validation strategy

Three layers, so a failure points at its own cause:

1. `fft_python.py` is checked against numpy — validates the *algorithm*.
2. The assembly is checked against `fft_python.py` — validates the *instruction
   encoding*. These currently agree **bit-for-bit** (max difference 0.0).
3. Device output is checked against numpy — validates the *whole pipeline*.

See [`docs/plans/01-fft-test-plan.md`](../../docs/plans/01-fft-test-plan.md) for
the full test plan and design rationale.
