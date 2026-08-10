# Host Tools

Python scripts that run on the development machine, not on the Pico. They generate test data,
and turn raw device output into verified reports.

Requires `numpy` and `mpremote`. `pyserial` is pulled in by `mpremote`.

## The pipeline

```
generate_test_signals.py          host    -> inputs/*.csv, reference/*.csv
        |
        |  mpremote cp inputs/*.csv :/inputs/
        v
device/benchmark.py               Pico    -> /outputs/*-spectrum.csv, *-timing.csv
device/compare.py                 Pico    -> /outputs/variant-results.csv
        |
        |  mpremote cp :/outputs/* outputs/
        v
verify_results.py                 host    -> outputs/verification-report.md
build_comparison.py               host    -> outputs/variant-comparison.md
```

## generate_test_signals.py

Writes the 10 synthetic test signals and their double-precision numpy reference spectra.

Each signal isolates a different correctness property rather than being arbitrary data. At
512 samples and 12.8 kHz the bin spacing is exactly 25 Hz, which several signals exploit:

| Signal | Property under test |
|---|---|
| silence | zero in → zero out |
| dc-offset | all energy in bin 0 |
| single-tone-450hz | 450 Hz = bin 18 exactly → one sharp peak, no leakage |
| two-tone-dtmf | 697 + 1209 Hz, deliberately *not* bin-aligned → visible leakage |
| harmonic-series | bins 8/16/24 at amplitudes 1.0/0.5/0.25 → linearity |
| chirp-linear | broadband sweep → Parseval energy check |
| white-noise | seeded, so results are reproducible across machines |
| nyquist-tone | alternating ±1 → energy exactly at bin 256 |
| impulse | flat magnitude spectrum, exactly 1.0 in every bin |
| full-scale-clipping | odd harmonics, overflow/NaN robustness |

The bin-exact signals let a human verify by eye; the automated verifier treats all ten
identically.

## verify_results.py

Compares device output against the numpy reference bin by bin.

Tolerance is **relative to each signal's own spectral peak**, not a flat absolute number — a
512-point transform of a full-scale signal produces bins in the hundreds, so one epsilon cannot
serve signals whose magnitudes differ by orders of magnitude. The threshold is 1e-4 of full
scale, comfortably above correct float32 noise (~1e-7 observed) and far below any real bug.

## build_comparison.py

Turns `outputs/variant-results.csv` into the comparison report.

It deliberately emits interpretation alongside the numbers. A bare ranking would place V6 last
and V7 near the bottom without recording that V6 has the fastest kernel of any variant, or that
V7's ceiling was *predicted* to be small. A benchmark that ranks without explaining teaches
students to optimize the number instead of understanding the machine.

## Full reproduction

```bash
python3 tools/generate_test_signals.py

mpremote connect /dev/cu.usbmodem14401 cp device/*.py :
mpremote connect /dev/cu.usbmodem14401 cp variants/*.py :
for f in inputs/*.csv; do mpremote connect /dev/cu.usbmodem14401 cp "$f" :/inputs/; done

mpremote connect /dev/cu.usbmodem14401 run device/benchmark.py
mpremote connect /dev/cu.usbmodem14401 run device/compare.py

for f in $(mpremote connect /dev/cu.usbmodem14401 exec "import os; print(' '.join(os.listdir('/outputs')))"); do
  mpremote connect /dev/cu.usbmodem14401 cp ":/outputs/$f" "outputs/$f"
done

python3 tools/verify_results.py
python3 tools/build_comparison.py
```

Create `/inputs` and `/outputs` on the device first if they do not exist:

```bash
mpremote connect /dev/cu.usbmodem14401 exec "import os
for d in ('/inputs','/outputs'):
    try: os.mkdir(d)
    except OSError: pass"
```
