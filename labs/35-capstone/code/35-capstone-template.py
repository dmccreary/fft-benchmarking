# Lab 35: Capstone Template
#
# A starting skeleton for your capstone experiment. It already does the
# things that are easy to get wrong:
#
#   * builds every variant before measuring any of them   (Lab 32)
#   * discards a warm-up run                              (Lab 26)
#   * reports best, mean AND spread                       (Lab 26)
#   * checks correctness before reporting speed           (Lab 15)
#   * states its exclusions                               (Lab 26)
#
# Replace MyVariant with your own idea and fill in the write-up prompts at
# the bottom.

import gc
import machine
import math

import v0_baseline          # the reference every claim is measured against

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1
FREQ = machine.freq()

N = 512
TRIALS = 20
SAMPLE_RATE = 12800


def rd():
    return machine.mem32[0xE0001004]


# =========================================================================
# 1. Your research question
# =========================================================================
RESEARCH_QUESTION = "..."          # e.g. "Does processing two frames at
                                   # once amortise the loop overhead?"
HYPOTHESIS = "..."                 # e.g. "Expect 5-10%, because Lab 24
                                   # showed loop control is ~30% of cost."
PREDICTION_WRITTEN_BEFORE_MEASURING = True    # be honest about this


# =========================================================================
# 2. Test signals -- design them, do not just grab noise
# =========================================================================
# Each signal should test something specific (see Lab 15).
signals = {
    "single tone (bin-exact)": [math.sin(2 * math.pi * 40 * i / N)
                                for i in range(N)],
    "two tones": [0.7 * math.sin(2 * math.pi * 40 * i / N)
                  + 0.3 * math.sin(2 * math.pi * 111 * i / N)
                  for i in range(N)],
    "impulse (flat spectrum)": [1.0 if i == 0 else 0.0 for i in range(N)],
    "silence": [0.0] * N,
}


# =========================================================================
# 3. Build everything BEFORE measuring anything  (Lab 32)
# =========================================================================
baseline = v0_baseline.Variant(N)
# candidate = my_variant.Variant(N)
candidate = v0_baseline.Variant(N)      # <-- replace with your variant
gc.collect()


# =========================================================================
# 4. The harness
# =========================================================================
def bench(variant, signal, trials=TRIALS):
    re, im = variant.make_buffers()

    def once():
        for i in range(N):
            re[i] = signal[i]
            im[i] = 0.0
        s = rd()
        variant.run(re, im)
        return (rd() - s) & 0xFFFFFFFF

    once()                                       # warm-up, discarded
    runs = [once() for _ in range(trials)]
    lo = min(runs)
    mean = sum(runs) / len(runs)
    sd = (sum((r - mean) ** 2 for r in runs) / len(runs)) ** 0.5
    return lo, mean, sd, re, im


def check(variant, signal):
    """Return relative error against the baseline on this signal."""
    bre, bim = baseline.make_buffers()
    for i in range(N):
        bre[i] = signal[i]
        bim[i] = 0.0
    baseline.run(bre, bim)
    peak = max(max(abs(x) for x in bre), max(abs(x) for x in bim)) or 1.0

    cre, cim = variant.make_buffers()
    for i in range(N):
        cre[i] = signal[i]
        cim[i] = 0.0
    variant.run(cre, cim)

    worst = 0.0
    for i in range(N):
        worst = max(worst, abs(cre[i] - bre[i]), abs(cim[i] - bim[i]))
    return worst / peak


# =========================================================================
# 5. Correctness FIRST
# =========================================================================
print("Research question: %s" % RESEARCH_QUESTION)
print("Hypothesis       : %s" % HYPOTHESIS)
print()
print("=== Correctness ===")
all_ok = True
for name, sig in signals.items():
    err = check(candidate, sig)
    ok = err < 1e-3
    all_ok = all_ok and ok
    print("  %-26s rel err %.2e  %s" % (name, err, "PASS" if ok else "FAIL"))

if not all_ok:
    print()
    print("Correctness failed. Speed numbers below are meaningless until")
    print("this is fixed. Stop here and debug (Lab 15: bisection).")


# =========================================================================
# 6. Speed
# =========================================================================
print()
print("=== Speed ===")
print("%-26s %10s %10s %8s %10s" % ("signal", "baseline", "candidate",
                                    "speedup", "stddev"))
speedups = []
for name, sig in signals.items():
    b_lo, b_mean, b_sd, _, _ = bench(baseline, sig)
    c_lo, c_mean, c_sd, _, _ = bench(candidate, sig)
    speedups.append(b_lo / c_lo)
    print("%-26s %10d %10d %7.3fx %9.0f"
          % (name, b_lo, c_lo, b_lo / c_lo, c_sd))

avg = sum(speedups) / len(speedups)
print()
print("mean speedup across signals: %.3fx" % avg)

budget_us = N / SAMPLE_RATE * 1e6
c_lo, c_mean, c_sd, _, _ = bench(candidate, signals["two tones"])
print("candidate: %.1f us = %.2f%% of the %.0f us frame budget"
      % (c_lo * 1e6 / FREQ, c_lo * 1e6 / FREQ / budget_us * 100, budget_us))


# =========================================================================
# 7. Report honestly
# =========================================================================
print()
print("=== Report ===")
print("Trials per signal        : %d, after one discarded warm-up" % TRIALS)
print("Statistic reported       : best-of-N, with mean and stddev")
print("Excluded from the timing : table construction, buffer loading")
print("Prediction written first : %s" % PREDICTION_WRITTEN_BEFORE_MEASURING)
print()
print("Now answer these in your write-up:")
print("  1. Did the result match your hypothesis? By how much?")
print("  2. If it did not, what does the gap tell you about the machine?")
print("  3. What does this benchmark EXCLUDE that a user would care about?")
print("  4. What would you measure next, and why?")
print()
print("A negative result, honestly reported and explained, is worth more")
print("than a positive one you cannot account for.")
