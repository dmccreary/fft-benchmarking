# On-device benchmark driver.
#
# Reads each of the 10 test signals from /inputs, runs the assembly FFT on it
# with cycle-accurate timing, and writes two files per signal to /outputs:
#
#     NN-name-spectrum.csv   bin,real,imag        (correctness data)
#     NN-name-timing.csv     trial,cycles,us,...  (performance data)
#
# Spectrum and timing stay in separate files so correctness and performance are
# never conflated in one schema.
#
# Run with:  mpremote connect <port> run benchmark.py

import gc
import os
import time
from array import array

import dwt_timer
from fft_asm import FFT

N = 512
FS = 12800.0
TRIALS = 20          # timed runs per signal, after one discarded warm-up

IN_DIR = "/inputs"
OUT_DIR = "/outputs"


def ensure_dir(path):
    try:
        os.mkdir(path)
    except OSError:
        pass          # already exists


def load_signal(path, n):
    """Read a one-float-per-line CSV into an array('f')."""
    buf = array("f", bytearray(4 * n))
    i = 0
    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if i < n:
                buf[i] = float(line)
                i += 1
    if i != n:
        raise ValueError("%s had %d samples, expected %d" % (path, i, n))
    return buf


def list_inputs():
    names = [f for f in os.listdir(IN_DIR) if f.endswith(".csv")]
    names.sort()
    return names


def main():
    ensure_dir(OUT_DIR)

    mhz = dwt_timer.verify()
    print("DWT cycle counter: %.2f MHz" % mhz)
    if mhz < 1.0:
        raise RuntimeError("DWT counter is not running; timings would be invalid")

    fft = FFT(N)
    re, im = fft.make_buffers()

    files = list_inputs()
    print("found %d input signals\n" % len(files))
    print("%-26s %10s %10s %9s" % ("signal", "cycles", "us", "FFT/sec"))
    print("-" * 58)

    summary = []

    for fname in files:
        stem = fname[:-4]                     # strip .csv
        samples = load_signal(IN_DIR + "/" + fname, N)

        # Warm-up run, discarded: first touch of code paths and caches.
        for i in range(N):
            re[i] = samples[i]
            im[i] = 0.0
        fft.run(re, im)

        cycles = array("i", bytearray(4 * TRIALS))
        micros = array("i", bytearray(4 * TRIALS))

        for t in range(TRIALS):
            # Reload every trial: the transform is in-place and consumes input.
            for i in range(N):
                re[i] = samples[i]
                im[i] = 0.0
            gc.collect()                      # keep GC out of the timed window
            t0 = time.ticks_us()
            c = fft.run_timed(re, im)
            t1 = time.ticks_us()
            cycles[t] = c
            micros[t] = time.ticks_diff(t1, t0)

        # Statistics over the trials.
        total = 0
        best = cycles[0]
        for t in range(TRIALS):
            total += cycles[t]
            if cycles[t] < best:
                best = cycles[t]
        mean = total / TRIALS
        var = 0.0
        for t in range(TRIALS):
            d = cycles[t] - mean
            var += d * d
        sd = (var / TRIALS) ** 0.5
        mean_us = dwt_timer.to_us(mean)

        # The final trial's output is the spectrum we keep.
        with open("%s/%s-spectrum.csv" % (OUT_DIR, stem), "w") as f:
            f.write("bin,real,imag\n")
            for i in range(N):
                f.write("%d,%.7e,%.7e\n" % (i, re[i], im[i]))

        with open("%s/%s-timing.csv" % (OUT_DIR, stem), "w") as f:
            f.write("trial,dwt_cycles,ticks_us,derived_us\n")
            for t in range(TRIALS):
                f.write("%d,%d,%d,%.3f\n" %
                        (t, cycles[t], micros[t], dwt_timer.to_us(cycles[t])))
            f.write("# mean_cycles,%.1f\n" % mean)
            f.write("# stddev_cycles,%.1f\n" % sd)
            f.write("# min_cycles,%d\n" % best)
            f.write("# mean_us,%.3f\n" % mean_us)

        rate = 1000000.0 / mean_us
        print("%-26s %10d %10.1f %9.1f" % (stem, int(mean), mean_us, rate))
        summary.append((stem, mean, sd, mean_us, rate))
        gc.collect()

    print("-" * 58)
    grand = sum(s[1] for s in summary) / len(summary)
    print("mean across all signals: %d cycles (%.1f us)" %
          (int(grand), dwt_timer.to_us(grand)))
    print("\nwrote %d spectrum + %d timing files to %s" %
          (len(summary), len(summary), OUT_DIR))


main()
