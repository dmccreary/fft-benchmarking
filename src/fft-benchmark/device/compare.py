# Comparison harness for the competing FFT variants.
#
# Runs every available variant over the same 10 test signals under identical
# conditions and reports cycles and accuracy for each. Writes machine-readable
# results to /outputs/variant-results.csv for the host to turn into a report.
#
# Methodology, matching Plan 02 section 6:
#
#   Warm-up          One discarded run per variant per signal. The Plan 02
#                    profile showed a cold first run costing ~186k cycles
#                    against ~127k warm -- a 46% error if you forget this.
#
#   Best-of-N        Reported alongside mean and standard deviation. For a
#                    deterministic algorithm the minimum is the least
#                    contaminated sample: nothing makes a run faster than it
#                    truly is, but interrupts and cache misses make runs
#                    slower. Mean alone hides that asymmetry.
#
#   Adaptive trials  Pure Python takes ~190ms per transform against ~0.9ms
#                    for assembly. A fixed trial count would either make the
#                    slow variants take an hour or give the fast ones too few
#                    samples, so the count scales with measured cost.
#
#   Shared reference V0's output on the same signal is the correctness
#                    reference, so a variant is checked against the exact
#                    algorithm it claims to optimize.
#
# Run with:  mpremote connect <port> run compare.py

import gc
import os
import sys
import time
from array import array

import dwt_timer

N = 512
IN_DIR = "/inputs"
OUT_DIR = "/outputs"

# Total cycle budget per variant per signal; trial count is derived from it so
# a 200x slower variant does not take 200x longer to benchmark.
BUDGET = 12000000
MIN_TRIALS = 3
MAX_TRIALS = 15

VARIANT_MODULES = [
    "v0_baseline",
    "v2_real_input",
    "v9_combined",
    "v1_specialized",
    "v4_fast_bitrev",
    "v6_interleaved",
    "v7_vfma_raw",
    "v3_viper",
    "v3_native",
    "v3_python",
]


def load_signal(path, n):
    buf = array("f", bytearray(4 * n))
    i = 0
    with open(path, "r") as f:
        for line in f:
            line = line.strip()
            if line and i < n:
                buf[i] = float(line)
                i += 1
    return buf


def stats(values):
    total = 0
    best = values[0]
    for v in values:
        total += v
        if v < best:
            best = v
    mean = total / len(values)
    var = 0.0
    for v in values:
        d = v - mean
        var += d * d
    return best, mean, (var / len(values)) ** 0.5


def main():
    dwt_timer.enable()
    mhz = dwt_timer.verify()
    print("DWT: %.1f MHz\n" % mhz)

    signals = sorted(f for f in os.listdir(IN_DIR) if f.endswith(".csv"))
    print("signals: %d\n" % len(signals))

    # Load every variant that imports cleanly. A variant that fails to build
    # is reported rather than silently skipped -- an absent row in a
    # comparison table is indistinguishable from a variant nobody wrote.
    variants = []
    for modname in VARIANT_MODULES:
        try:
            mod = __import__(modname)
            v = mod.Variant(N)
            variants.append(v)
            print("loaded  %-12s %s" % (v.name, v.label))
        except Exception as e:
            print("FAILED  %-12s %s" % (modname, e))
        gc.collect()

    print()
    rows = []

    for v in variants:
        re, im = v.make_buffers()
        ref_re = array("f", bytearray(4 * N))
        ref_im = array("f", bytearray(4 * N))

        all_best = []
        all_mean = []
        all_sd = []
        worst_err = 0.0

        for sname in signals:
            samples = load_signal(IN_DIR + "/" + sname, N)

            # Warm-up, discarded.
            v.load(re, im, samples)
            v.run(re, im)

            # One measured run to size the trial count.
            v.load(re, im, samples)
            probe = v.run_timed(re, im)
            trials = BUDGET // max(probe, 1)
            if trials < MIN_TRIALS:
                trials = MIN_TRIALS
            elif trials > MAX_TRIALS:
                trials = MAX_TRIALS

            cycles = []
            for _ in range(trials):
                v.load(re, im, samples)
                cycles.append(v.run_timed(re, im))

            b, m, sd = stats(cycles)
            all_best.append(b)
            all_mean.append(m)
            all_sd.append(sd)

            # Correctness against V0 on this same signal.
            if v.name == "v0":
                for i in range(N):
                    ref_re[i] = re[i]
                    ref_im[i] = im[i]
            else:
                v0 = variants[0]
                r2, i2 = v0.make_buffers()
                v0.load(r2, i2, samples)
                v0.run(r2, i2)
                if v.half_spectrum:
                    # Real-input variants produce n/2+1 unique bins; compare
                    # only that range against the full complex reference.
                    limit = N // 2 + 1
                else:
                    limit = N
                for i in range(limit):
                    d = abs(re[i] - r2[i])
                    if d > worst_err:
                        worst_err = d
                    d = abs(im[i] - i2[i])
                    if d > worst_err:
                        worst_err = d
                del r2, i2
            gc.collect()

        best = min(all_best)
        mean = sum(all_mean) / len(all_mean)
        sd = sum(all_sd) / len(all_sd)
        rows.append((v.name, v.label, best, mean, sd, worst_err))

        print("%-12s best %9d  mean %9d  sd %7.0f  us %8.1f  maxerr %.2e" % (
            v.name, best, int(mean), sd, dwt_timer.to_us(mean), worst_err))
        gc.collect()

    # Write results for the host to format.
    with open(OUT_DIR + "/variant-results.csv", "w") as f:
        f.write("variant,label,best_cycles,mean_cycles,stddev_cycles,max_err_vs_v0\n")
        for name, label, best, mean, sd, err in rows:
            f.write("%s,%s,%d,%.1f,%.1f,%.6e\n" % (name, label, best, mean, sd, err))

    print("\nwrote %s/variant-results.csv" % OUT_DIR)


main()
