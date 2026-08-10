#!/usr/bin/env python3
"""Generate the 10 synthetic sound-like test signals and their reference spectra.

Runs on the host (not the Pico). Writes:
    inputs/NN-name.csv            512 float samples, one per line
    inputs/manifest.json          what each signal is and why it exists
    reference/NN-name-reference.csv   numpy double-precision FFT ground truth

The signals are chosen so each one isolates a different FFT correctness
property. Several sit exactly on bin centres (fs/N = 25 Hz) so a human can
eyeball the result; a couple deliberately do not, so spectral leakage shows up
as a teaching point rather than looking like a bug.
"""

import json
import os

import numpy as np

N = 512               # FFT size
FS = 12800.0          # sample rate, matches the Cornell Labs reference
BIN_HZ = FS / N       # 25.0 Hz per bin

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INPUTS = os.path.join(ROOT, "inputs")
REFERENCE = os.path.join(ROOT, "reference")

t = np.arange(N) / FS


def tone(freq, amp=1.0, phase=0.0):
    return amp * np.sin(2 * np.pi * freq * t + phase)


def build_signals():
    """Return a list of (index, name, samples, description) tuples."""
    signals = []

    # 01 - the trivial baseline: nothing in, nothing out.
    signals.append((1, "silence", np.zeros(N),
                    "All zeros. Spectrum must be exactly zero in every bin."))

    # 02 - constant offset lands entirely in bin 0.
    signals.append((2, "dc-offset", np.full(N, 0.5),
                    "Constant 0.5. All energy in bin 0 (DC), nothing elsewhere."))

    # 03 - 450 Hz is exactly bin 18, so there is no leakage to confuse things.
    signals.append((3, "single-tone-450hz", tone(450.0, 0.8),
                    "Pure 450 Hz sine = bin 18 exactly. One sharp peak, no leakage."))

    # 04 - real DTMF frequencies, deliberately NOT on bin centres.
    signals.append((4, "two-tone-dtmf", 0.5 * tone(697.0) + 0.5 * tone(1209.0),
                    "DTMF '1' (697+1209 Hz). Not bin-aligned, so leakage is visible."))

    # 05 - known amplitude ratios test that the transform is linear.
    harmonics = tone(200.0, 1.0) + tone(400.0, 0.5) + tone(600.0, 0.25)
    signals.append((5, "harmonic-series", harmonics / 1.75,
                    "200/400/600 Hz at bins 8/16/24 with 1.0/0.5/0.25 amplitudes."))

    # 06 - a sweep puts energy everywhere; good for a Parseval energy check.
    f0, f1 = 200.0, 3000.0
    chirp = 0.8 * np.sin(2 * np.pi * (f0 * t + (f1 - f0) / (2 * t[-1]) * t ** 2))
    signals.append((6, "chirp-linear", chirp,
                    "Linear sweep 200->3000 Hz. Broadband, time-varying content."))

    # 07 - seeded so the file is reproducible across machines and runs.
    rng = np.random.default_rng(20260810)
    noise = np.clip(rng.normal(0.0, 0.25, N), -1.0, 1.0)
    signals.append((7, "white-noise", noise,
                    "Seeded Gaussian noise. Flat-ish spectrum, stability stress test."))

    # 08 - alternating +/-1 is the highest frequency 512 samples can represent.
    nyquist = np.where(np.arange(N) % 2 == 0, 1.0, -1.0)
    signals.append((8, "nyquist-tone", nyquist,
                    "Alternating +1/-1. All energy at bin 256 (fs/2). Edge case."))

    # 09 - an impulse has a mathematically flat magnitude spectrum.
    impulse = np.zeros(N)
    impulse[0] = 1.0
    signals.append((9, "impulse", impulse,
                    "Unit impulse at sample 0. Magnitude must be flat (1.0) in all bins."))

    # 10 - what an overdriven ADC actually looks like: odd harmonics.
    clipped = np.clip(tone(1000.0, 1.6), -1.0, 1.0)
    signals.append((10, "full-scale-clipping", clipped,
                    "1 kHz tone (bin 40) hard-clipped. Odd harmonics, must not overflow."))

    return signals


def main():
    os.makedirs(INPUTS, exist_ok=True)
    os.makedirs(REFERENCE, exist_ok=True)

    manifest = {
        "fft_size": N,
        "sample_rate_hz": FS,
        "bin_spacing_hz": BIN_HZ,
        "signals": [],
    }

    for idx, name, samples, description in build_signals():
        assert len(samples) == N, "%s has %d samples, expected %d" % (name, len(samples), N)
        assert np.all(np.abs(samples) <= 1.0 + 1e-9), "%s exceeds [-1, 1]" % name

        stem = "%02d-%s" % (idx, name)

        in_path = os.path.join(INPUTS, stem + ".csv")
        with open(in_path, "w") as f:
            for v in samples:
                f.write("%.9f\n" % v)

        # Double-precision reference. The device computes the same transform in
        # float32, so this is the ground truth we measure error against.
        spectrum = np.fft.fft(samples.astype(np.float64))
        ref_path = os.path.join(REFERENCE, stem + "-reference.csv")
        with open(ref_path, "w") as f:
            f.write("bin,real,imag\n")
            for k, c in enumerate(spectrum):
                f.write("%d,%.9e,%.9e\n" % (k, c.real, c.imag))

        peak = int(np.argmax(np.abs(spectrum[: N // 2 + 1])))
        manifest["signals"].append({
            "index": idx,
            "name": name,
            "file": stem + ".csv",
            "description": description,
            "peak_bin": peak,
            "peak_hz": peak * BIN_HZ,
            "rms": float(np.sqrt(np.mean(samples ** 2))),
        })
        print("%-24s peak bin %3d (%7.1f Hz)  rms %.4f" %
              (stem, peak, peak * BIN_HZ, np.sqrt(np.mean(samples ** 2))))

    with open(os.path.join(INPUTS, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    print("\nWrote %d signals to %s" % (len(manifest["signals"]), INPUTS))
    print("Wrote %d references to %s" % (len(manifest["signals"]), REFERENCE))


if __name__ == "__main__":
    main()
