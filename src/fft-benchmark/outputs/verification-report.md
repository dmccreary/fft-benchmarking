# FFT Verification Report

Assembly FFT on Raspberry Pi Pico 2 (RP2350, Cortex-M33 r1p0), compared bin-by-bin against a double-precision numpy reference.

- **FFT size:** 512 (radix-2 DIT, in-place, single-precision float)
- **Tolerance:** relative error <= 1e-04 of each signal's spectral peak
- **Result:** ALL SIGNALS PASS

## Correctness

| # | Signal | Max abs err | RMS err | Rel err | Peak bin (got/ref) | Result |
|---|--------|-------------|---------|---------|--------------------|--------|
| 01 | silence | 0.000e+00 | 0.000e+00 | 0.00e+00 | 0 / 0 | PASS |
| 02 | dc-offset | 0.000e+00 | 0.000e+00 | 0.00e+00 | 0 / 0 | PASS |
| 03 | single-tone-450hz | 4.878e-05 | 2.717e-06 | 2.38e-07 | 18 / 18 | PASS |
| 04 | two-tone-dtmf | 1.815e-05 | 2.060e-06 | 1.45e-07 | 28 / 28 | PASS |
| 05 | harmonic-series | 2.524e-05 | 1.937e-06 | 1.73e-07 | 8 / 8 | PASS |
| 06 | chirp-linear | 8.813e-06 | 2.862e-06 | 3.85e-07 | 111 / 111 | PASS |
| 07 | white-noise | 3.955e-06 | 1.268e-06 | 3.21e-07 | 118 / 118 | PASS |
| 08 | nyquist-tone | 0.000e+00 | 0.000e+00 | 0.00e+00 | 256 / 256 | PASS |
| 09 | impulse | 0.000e+00 | 0.000e+00 | 0.00e+00 | 0 / 0 | PASS |
| 10 | full-scale-clipping | 5.726e-05 | 3.873e-06 | 1.89e-07 | 40 / 40 | PASS |

## Performance

Cycle counts from the Cortex-M33 DWT counter at 150 MHz (1 cycle = 6.667 ns), 20 trials per signal after a discarded warm-up.

| # | Signal | Mean cycles | Std dev | Mean us | FFT/sec |
|---|--------|-------------|---------|---------|---------|
| 01 | silence | 132877 | 1902.3 | 885.8 | 1129 |
| 02 | dc-offset | 133028 | 1789.4 | 886.9 | 1128 |
| 03 | single-tone-450hz | 132839 | 1863.6 | 885.6 | 1129 |
| 04 | two-tone-dtmf | 132899 | 1816.5 | 886.0 | 1129 |
| 05 | harmonic-series | 132809 | 1892.0 | 885.4 | 1129 |
| 06 | chirp-linear | 132900 | 1822.9 | 886.0 | 1129 |
| 07 | white-noise | 132710 | 1908.7 | 884.7 | 1130 |
| 08 | nyquist-tone | 132695 | 1965.4 | 884.6 | 1130 |
| 09 | impulse | 132834 | 1993.3 | 885.6 | 1129 |
| 10 | full-scale-clipping | 132494 | 1669.1 | 883.3 | 1132 |

**Mean across all signals:** 132808 cycles (885.4 us), 1129 FFT/sec.

**Data independence:** spread between the fastest and slowest signal is 0.40% of the mean. Radix-2 DIT executes the same butterflies regardless of input values, so timing should not depend on signal content -- and it does not.

**Real-time headroom:** a 512-sample frame at 12.8 kHz spans 40000 us. At 885.4 us per FFT this uses 2.2% of the frame budget (4.4% with the 50%-overlap framing the Cornell lab uses), so real-time audio FFT is comfortably achievable.

## Signal descriptions

- **01-silence** - All zeros. Spectrum must be exactly zero in every bin.
- **02-dc-offset** - Constant 0.5. All energy in bin 0 (DC), nothing elsewhere.
- **03-single-tone-450hz** - Pure 450 Hz sine = bin 18 exactly. One sharp peak, no leakage.
- **04-two-tone-dtmf** - DTMF '1' (697+1209 Hz). Not bin-aligned, so leakage is visible.
- **05-harmonic-series** - 200/400/600 Hz at bins 8/16/24 with 1.0/0.5/0.25 amplitudes.
- **06-chirp-linear** - Linear sweep 200->3000 Hz. Broadband, time-varying content.
- **07-white-noise** - Seeded Gaussian noise. Flat-ish spectrum, stability stress test.
- **08-nyquist-tone** - Alternating +1/-1. All energy at bin 256 (fs/2). Edge case.
- **09-impulse** - Unit impulse at sample 0. Magnitude must be flat (1.0) in all bins.
- **10-full-scale-clipping** - 1 kHz tone (bin 40) hard-clipped. Odd harmonics, must not overflow.
