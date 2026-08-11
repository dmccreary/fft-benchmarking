# Lab 32: Specialization and Branchless Code
#
# Your assembly FFT is 165x faster than Python. Can it be faster still?
#
# Not by writing cleverer arithmetic -- by doing LESS of it. Two ideas:
#
#   1. Some multiplications are multiplications by 1. Delete them.
#   2. Some branches are unpredictable. Delete those too.
#
# Both trade code size for speed, which on a microcontroller is a real
# decision rather than a free win.

import gc
import machine
import math
import v0_baseline
import v1_specialized
import v4_fast_bitrev

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1
FREQ = machine.freq()


def rd():
    return machine.mem32[0xE0001004]


N = 512
signal = [math.sin(2 * math.pi * 40 * i / N) for i in range(N)]


# Build EVERY variant before measuring ANY of them.
#
# This matters more than it looks. Constructing a variant allocates several
# kilobytes of tables. Build-measure-build-measure leaves the heap in a
# different state for each one, and the later variants measure slower for
# reasons that have nothing to do with their code.
#
# While writing this lab that mistake made a genuinely faster variant look
# 3% SLOWER than the baseline. Allocate first, collect once, then measure.
v0 = v0_baseline.Variant(N)
v1 = v1_specialized.Variant(N)
v4 = v4_fast_bitrev.Variant(N)
gc.collect()


def bench(variant, trials=15):
    re, im = variant.make_buffers()

    def once():
        for i in range(N):
            re[i] = signal[i]
            im[i] = 0.0
        s = rd()
        variant.run(re, im)
        return (rd() - s) & 0xFFFFFFFF

    once()                                  # warm-up, discarded (Lab 26)
    return min(once() for _ in range(trials)), re, im


# =========================================================================
# PART 1 -- multiplying by one
# =========================================================================
print("=== PART 1: stop multiplying by 1 ===")
print()
print("Look at the twiddle factors for the first two stages of any FFT:")
print()
for stage, half in ((1, 1), (2, 2)):
    print("  stage %d (half=%d):" % (stage, half))
    for j in range(half):
        step = N // (half * 2)
        angle = -2 * math.pi * (j * step) / N
        print("      W = (%+.3f, %+.3f)" % (math.cos(angle), math.sin(angle)))

print()
print("Stage 1's only twiddle is (1, 0). Multiplying by 1 and adding 0:")
print("    tr = 1*xr - 0*xi = xr")
print("    ti = 1*xi + 0*xr = xi")
print("So the butterfly collapses to a plain add and subtract -- FOUR")
print("multiplications deleted, per butterfly, 256 times.")
print()
print("Stage 2 adds (0, -1). Multiplying by -i maps (xr, xi) -> (xi, -xr):")
print("a register swap and a sign flip. No multiplier involved at all.")


# =========================================================================
# PART 2 -- measure it
# =========================================================================
print()
print("=== PART 2: what specialization buys ===")
print()

base_cycles, _, _ = bench(v0)
spec_cycles, spec_re, spec_im = bench(v1)

# correctness first, always
ref_re, ref_im = v0.make_buffers()
for i in range(N):
    ref_re[i] = signal[i]
    ref_im[i] = 0.0
v0.run(ref_re, ref_im)
worst = 0.0
for i in range(N):
    worst = max(worst, abs(spec_re[i] - ref_re[i]), abs(spec_im[i] - ref_im[i]))

print("%-28s %12s %10s" % ("variant", "cycles", "speedup"))
print("%-28s %12d %9.2fx" % ("v0 baseline", base_cycles, 1.0))
print("%-28s %12d %9.2fx"
      % ("v1 specialized stages", spec_cycles, base_cycles / spec_cycles))
print()
print("max difference vs baseline: %.2e  %s"
      % (worst, "(float rounding -- different op order)" if worst else ""))
print()
print("Stages 1 and 2 are 512 of the 2304 butterflies -- 22%% of them --")
print("and we removed nearly all their arithmetic.")


# =========================================================================
# PART 3 -- the branch nobody predicts
# =========================================================================
print()
print("=== PART 3: branchless bit-reversal ===")
print()
print("The baseline's reordering loop looks harmless:")
print()
print("    for i in range(n):")
print("        j = table[i]")
print("        if j > i:          <- true only ~47%% of the time")
print("            swap(i, j)")
print()
print("More than half those iterations do a load, a compare and a branch")
print("in order to accomplish nothing. Worse, the branch is DATA-DEPENDENT")
print("and effectively random, so the CPU's branch predictor is wrong")
print("about half the time and has to discard work it already started.")
print()
print("The fix: precompute the ~240 pairs that actually swap and walk that")
print("list. No test, no branch, no wasted iteration.")
print()

bitrev_cycles, _, _ = bench(v4)

print("%-28s %12s %10s" % ("variant", "cycles", "speedup"))
print("%-28s %12d %9.2fx" % ("v0 baseline", base_cycles, 1.0))
print("%-28s %12d %9.2fx"
      % ("v4 branchless bit-reversal", bitrev_cycles, base_cycles / bitrev_cycles))


# =========================================================================
# PART 4 -- what it costs
# =========================================================================
print()
print("=== PART 4: the bill ===")
print()
print("Neither of these is free:")
print()
print("  specialization  -> two extra assembly routines. More code to")
print("                     write, read, test and keep correct. Flash is")
print("                     finite.")
print()
print("  branchless      -> a bigger table (2 entries per swap instead of")
print("                     1 per index) and a construction step at startup.")
print()
print("Both are the same trade: SPEND MEMORY AND COMPLEXITY, BUY TIME.")
print("On a chip with 3 MB of flash and a 40 ms deadline, that is usually")
print("a good trade. On one with 32 KB, it might not be.")


# =========================================================================
# PART 5 -- predict, then measure
# =========================================================================
print()
print("=== PART 5: do they compose? ===")
print()
print("Individually: specialization %.2fx, branchless %.2fx."
      % (base_cycles / spec_cycles, base_cycles / bitrev_cycles))
print("If they were independent you would expect %.2fx together."
      % ((base_cycles / spec_cycles) * (base_cycles / bitrev_cycles)))
print()
print("Write down your prediction, then run Lab 34 and find out.")
print()
print("=== A warning from the making of this lab ===")
print()
print("The first version of this program built each variant just before")
print("measuring it. That fragmented the heap differently for each one and")
print("reported the specialized version as 3%% SLOWER than the baseline --")
print("the opposite of the truth.")
print()
print("Allocating everything first and collecting once gave a stable")
print("1.11x, reproducible across runs and independent of order.")
print()
print("Lab 26 warned you that benchmarks lie. They lie to the people")
print("writing the course too.")
print("(Spoiler for the impatient: optimizations rarely compose perfectly,")
print("and understanding WHY is more useful than the number itself.)")
