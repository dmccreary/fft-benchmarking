# Lab 34: Competing Variants -- Predict, Measure, Explain
#
# Six implementations of the same 512-point FFT, measured against each other
# under one harness.
#
# The rule for this lab: WRITE YOUR PREDICTED RANKING DOWN FIRST. Every
# quantitative prediction made while designing this course turned out to be
# optimistic, and being wrong on paper is how you learn what the machine
# really does.

import gc
import machine
import math

import v0_baseline
import v1_specialized
import v2_real_input
import v4_fast_bitrev
import v7_vfma_raw
import v9_combined

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1
FREQ = machine.freq()
N = 512
TRIALS = 15


def rd():
    return machine.mem32[0xE0001004]


signals = {
    "single tone": [math.sin(2 * math.pi * 40 * i / N) for i in range(N)],
    "two tones": [0.7 * math.sin(2 * math.pi * 40 * i / N)
                  + 0.3 * math.sin(2 * math.pi * 111 * i / N) for i in range(N)],
    "impulse": [1.0 if i == 0 else 0.0 for i in range(N)],
}

# Lab 32's lesson: build EVERYTHING before measuring ANYTHING, or heap
# state contaminates the comparison.
print("Building all variants before measuring (see Lab 32)...")
variants = [
    ("v0", "baseline radix-2", v0_baseline.Variant(N)),
    ("v1", "specialized stages", v1_specialized.Variant(N)),
    ("v2", "real-input FFT", v2_real_input.Variant(N)),
    ("v4", "branchless bit-reversal", v4_fast_bitrev.Variant(N)),
    ("v7", "hand-encoded VFMA", v7_vfma_raw.Variant(N)),
    ("v9", "all of the above combined", v9_combined.Variant(N)),
]
gc.collect()
print("built %d variants\n" % len(variants))


def bench(v, signal):
    re, im = v.make_buffers()

    def once():
        for i in range(N):
            re[i] = signal[i]
            im[i] = 0.0
        s = rd()
        v.run(re, im)
        return (rd() - s) & 0xFFFFFFFF

    once()                                      # warm-up (Lab 26)
    runs = [once() for _ in range(TRIALS)]
    return min(runs), sum(runs) / len(runs), re, im


# =========================================================================
# Correctness before speed
# =========================================================================
print("=== Correctness: does every variant agree with the baseline? ===")
print()
sig = signals["two tones"]
v0 = variants[0][2]
ref_re, ref_im = v0.make_buffers()
for i in range(N):
    ref_re[i] = sig[i]
    ref_im[i] = 0.0
v0.run(ref_re, ref_im)
# The peak must consider BOTH parts. A sine's energy lands in the
# imaginary component, so taking the max of ref_re alone gives a tiny
# divisor and makes every variant look broken. (Found the hard way.)
peak = max(max(abs(x) for x in ref_re), max(abs(x) for x in ref_im)) or 1.0

print("%-28s %14s %10s" % ("variant", "max error", "verdict"))
for name, label, v in variants:
    _, _, re, im = bench(v, sig)
    worst = 0.0
    for i in range(N):
        worst = max(worst, abs(re[i] - ref_re[i]), abs(im[i] - ref_im[i]))
    rel = worst / peak
    print("%-28s %14.2e %10s"
          % ("%s %s" % (name, label), rel, "PASS" if rel < 1e-3 else "FAIL"))

print()
print("A fast variant that computes the wrong answer is not a fast variant.")


# =========================================================================
# The comparison
# =========================================================================
print()
print("=== Speed, averaged over %d signals ===" % len(signals))
print()

results = []
for name, label, v in variants:
    bests = []
    for sig_name, sig in signals.items():
        b, m, _, _ = bench(v, sig)
        bests.append(b)
    results.append((name, label, min(bests), sum(bests) / len(bests)))
    gc.collect()

base = results[0][2]
print("%-28s %12s %12s %10s" % ("variant", "best", "mean", "speedup"))
for name, label, best, mean in results:
    print("%-28s %12d %12d %9.3fx"
          % ("%s %s" % (name, label), best, int(mean), base / best))

print()
print("budget for a 512-sample frame: %.0f us" % (N / 12800 * 1e6))
for name, label, best, mean in results:
    us = best * 1e6 / FREQ
    print("  %-8s %8.1f us  = %.1f%% of budget" % (name, us, us / 40000 * 100))


# =========================================================================
# Do optimizations compose?
# =========================================================================
print()
print("=== Do they stack? ===")
print()
by_name = {r[0]: r[2] for r in results}
product = 1.0
for n in ("v1", "v2", "v4", "v7"):
    product *= base / by_name[n]

print("individually:")
for n in ("v1", "v2", "v4", "v7"):
    print("  %-4s %.3fx" % (n, base / by_name[n]))
print()
print("product of all four        : %.3fx" % product)
print("v9, which combines them    : %.3fx" % (base / by_name["v9"]))
print()
if base / by_name["v9"] < product:
    print("They stack, but SUB-LINEARLY. v1 and v7 overlap: v1 deletes the")
    print("very multiplications v7 would have fused, so v7 has less left to")
    print("improve once v1 has been applied.")
print()
print("Optimizations are not independent. Measuring the combination is the")
print("only way to know what you actually get.")


# =========================================================================
# What the numbers do not say
# =========================================================================
print()
print("=== What this table leaves out ===")
print()
print("1. v2 (real-input) only works for REAL signals. Feed it complex")
print("   data and it silently produces nonsense. A faster routine with a")
print("   precondition is not strictly better than a slower general one.")
print()
print("2. Every variant costs code size and reading effort. v9 is the")
print("   fastest and by far the hardest to debug at 3am.")
print()
print("3. These are best-of-%d on one board at one temperature. Report the" % TRIALS)
print("   spread, not just the winner.")
print()
print("4. Table construction and buffer loading are excluded (Lab 26).")
print()
print("The ranking is the easy part. Knowing what it hides is the skill.")
