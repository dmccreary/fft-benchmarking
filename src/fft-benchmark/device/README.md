# Device Code — What Runs on the Pico

Everything in this directory executes on the Raspberry Pi Pico 2 under stock MicroPython. No custom firmware, no cross-compiler.

## Files

| File | Role |
|---|---|
| [`fft_asm.py`](fft_asm.py) | **The student-facing deliverable.** 512-point FFT with an assembly core. |
| [`dwt_timer.py`](dwt_timer.py) | Cycle-accurate timing via the Cortex-M33 DWT counter. |
| [`fft_python.py`](fft_python.py) | Pure-Python reference. Validation baseline, not for production use. |
| [`benchmark.py`](benchmark.py) | Runs the 10 test signals through `fft_asm`, writes spectra + timing. |
| [`compare.py`](compare.py) | Runs every variant under identical conditions, writes `variant-results.csv`. |
| [`example_student_lab.py`](example_student_lab.py) | Minimal worked example of calling the FFT. |

## Deploying

```bash
mpremote connect /dev/cu.usbmodem14401 cp *.py :
mpremote connect /dev/cu.usbmodem14401 cp ../variants/*.py :
```

MicroPython imports from the filesystem root, so everything lands there flat. The variants
import `fft_asm` and `dwt_timer` by name, which is why they must be deployed together.

## fft_asm.py — the deliverable

```python
from fft_asm import FFT

fft = FFT(512)                  # builds twiddle + bit-reversal tables once
re, im = fft.make_buffers()     # array('f') of length 512

for i, sample in enumerate(my_samples):
    re[i] = sample              # samples in [-1.0, 1.0]

cycles = fft.run_timed(re, im)  # in-place transform, returns CPU cycles
mags = fft.magnitude(re, im)
```

Bin *k* corresponds to `k × sample_rate / 512` Hz. At the 12.8 kHz rate used throughout this
project, that is 25 Hz per bin.

### Why the API looks like this

Three design choices exist to keep the timed region honest, and they are worth explaining to
students rather than presenting as arbitrary:

- **Tables are built in the constructor.** If twiddle factors were computed per call, the
  benchmark would be measuring `math.cos` rather than the FFT.
- **Buffers are `array('f')` passed by address** via `uctypes.addressof()`. No copying, no
  marshalling. This is also what makes the assembly portable to a C build later.
- **The transform is in-place.** Nothing allocates inside `run()`, so no garbage collection can
  occur mid-measurement.

## dwt_timer.py — cycle-accurate timing

The Cortex-M33 contains a free-running 32-bit cycle counter in its Data Watchpoint and Trace
unit. At 150 MHz one cycle is **6.667 ns**, far finer than `time.ticks_us()`.

```
DEMCR      0xE000EDFC   bit 24 (TRCENA)     enable trace subsystem
DWT_CTRL   0xE0001000   bit 0  (CYCCNTENA)  enable cycle counter
DWT_CYCCNT 0xE0001004                       the counter itself
```

Reached from MicroPython with `machine.mem32`, the same technique
[`02-get-info.py`](../../kits/fft-lab-kit/probes/02-get-info.py) uses to read `CPUID`.

**Verify before trusting.** On some implementations the counter only runs while a debugger is
attached. `dwt_timer.verify()` measures the tick rate against a known delay and returns MHz;
on this board it reports ~149.9 against a nominal 150. A result near zero means the counter is
stalled and every timing below it is meaningless.

## benchmark.py vs compare.py

They answer different questions and should not be confused:

- **`benchmark.py`** — *is the FFT correct, and how fast?* Runs `fft_asm` over the 10 signals,
  writes a spectrum and a timing file per signal for host-side verification against numpy.
- **`compare.py`** — *which variant wins?* Runs every variant over the same signals, checking
  each against V0's output, and writes a single results CSV.

### Methodology built into compare.py

Each of these exists because omitting it produces a wrong answer, and each corresponds to a
concept in the course learning graph:

| Practice | Why | Concept |
|---|---|---|
| Discard one warm-up run per signal | V0's cold run costs ~186k cycles vs ~130k warm — a 43% error | Warm Up Runs |
| Report best-of-N with mean and stddev | Nothing makes a run faster than it truly is; interrupts only make it slower, so the minimum is the least contaminated sample | Statistical Sampling |
| Adaptive trial count | Pure Python takes ~180 ms/transform vs ~0.87 ms for assembly; a fixed count either takes an hour or undersamples | Fair Comparison |
| Compare against V0's output, not just numpy | Isolates "this variant broke the algorithm" from "float32 rounds differently" | Reproducibility |
| Report variants that fail to load | An absent table row is indistinguishable from a variant nobody wrote | — |

## Memory

A 512-point transform needs 4 KB of float buffers plus ~3 KB of tables per variant instance.
With ~485 KB free, loading all ten variants simultaneously is comfortable. `compare.py` still
calls `gc.collect()` between variants — not for memory, but to keep collection from happening
*inside* a timed region.
