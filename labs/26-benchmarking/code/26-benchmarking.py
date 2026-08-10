# Lab 26: Benchmarking Methodology
#
# You now have a cycle-accurate stopwatch. That is necessary but nowhere
# near sufficient -- a precise instrument used carelessly produces precise
# nonsense.
#
# This lab demonstrates four ways a benchmark lies to you. Every one of them
# was found the hard way while building this course, and one of them turned
# a reported "1.93x speedup" into an honest 1.26x.

import gc
import machine
import math
import fft_asm
from fftlab import FFT

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)   # TRCENA
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1           # CYCCNTENA
FREQ = machine.freq()


def rd():
    return machine.mem32[0xE0001004]


def stats(values):
    lo = min(values)
    mean = sum(values) / len(values)
    var = sum((v - mean) ** 2 for v in values) / len(values)
    return lo, mean, var ** 0.5


N = 512
asm = fft_asm.FFT(N)
re, im = asm.make_buffers()
signal = [math.sin(2 * math.pi * 40 * i / N) for i in range(N)]


def load():
    for i in range(N):
        re[i] = signal[i]
        im[i] = 0.0


def run_once():
    load()
    s = rd()
    asm.run(re, im)
    e = rd()
    return (e - s) & 0xFFFFFFFF


# =========================================================================
# LIE 1 -- the first run is not like the others
# =========================================================================
print("=== LIE 1: the cold start ===")
print()
first = run_once()
rest = [run_once() for _ in range(15)]
lo, mean, sd = stats(rest)

print("first run ever : %d cycles" % first)
print("best of next 15: %d cycles" % lo)
print("penalty        : %.1f%%" % (100 * (first - lo) / lo))
print()
print("The very first call is measurably slower. Code paths are untouched,")
print("branch predictors are empty, the flash cache has not seen these")
print("instructions before.")
print()
print("How big this effect is DEPENDS on the workload. For the pure-Python")
print("FFT it is under 1%; for this assembly one it is over 15%. You cannot")
print("know in advance, which is exactly why you always discard a warm-up.")
print()
print("FIX: throw away the first run. Always.")


# =========================================================================
# LIE 2 -- the mean hides the truth
# =========================================================================
print()
print("=== LIE 2: mean versus best-of-N ===")
print()
runs = [run_once() for _ in range(30)]
lo, mean, sd = stats(runs)
hi = max(runs)

print("30 runs of the SAME code on the SAME data:")
print("  best   : %d cycles" % lo)
print("  mean   : %d cycles" % int(mean))
print("  worst  : %d cycles" % hi)
print("  stddev : %.0f cycles" % sd)
print("  spread : %.1f%% between best and worst" % (100 * (hi - lo) / lo))
print()
print("Identical work, different answers. Interrupts, the USB stack and")
print("memory refresh all steal time at random moments.")
print()
print("The distribution is ASYMMETRIC: nothing can make code run faster")
print("than it truly is, but plenty can make it slower. So there is a hard")
print("floor and a long tail -- and the floor is the honest number.")
print()
print("FIX: report best-of-N as the speed, and the spread as the honesty.")


# =========================================================================
# LIE 3 -- measuring changes what you measure
# =========================================================================
print()
print("=== LIE 3: the observer effect ===")
print()
REPS = 500

s = rd()
for i in range(REPS):
    x = 3.7 * 2.1
whole = (rd() - s) & 0xFFFFFFFF

total = 0
for i in range(REPS):
    a = rd()
    x = 3.7 * 2.1
    b = rd()
    total += (b - a) & 0xFFFFFFFF

print("%d tiny multiplications" % REPS)
print("  timed as one block : %8d cycles" % whole)
print("  timed one by one   : %8d cycles" % total)
print("  inflation          : %.1fx" % (total / whole))
print()
print("Same work. Timing each operation individually made it look almost")
print("three times more expensive, because each probe costs more than the")
print("multiply it was measuring.")
print()
print("This is not hypothetical: while building Lab 16 for this course,")
print("timing the FFT's 9 stages separately summed to 206,000 cycles when")
print("the whole transform took 127,000.")
print()
print("FIX: profile in pieces to FIND the bottleneck. Then measure the")
print("     whole operation to REPORT the number.")


# =========================================================================
# LIE 4 -- what the benchmark quietly leaves out
# =========================================================================
print()
print("=== LIE 4: what is not in the timed region ===")
print()
s = rd()
load()
load_cost = (rd() - s) & 0xFFFFFFFF

s = rd()
extra = fft_asm.FFT(N)
setup_cost = (rd() - s) & 0xFFFFFFFF

print("the FFT itself      : %8d cycles" % lo)
print("loading the buffers : %8d cycles  (%.0f%% of the FFT)"
      % (load_cost, 100 * load_cost / lo))
print("building the tables : %8d cycles  (%.1f FFTs' worth)"
      % (setup_cost, setup_cost / lo))
print()
print("Our headline number excludes both. That is defensible -- tables are")
print("built once at startup, and the microphone fills the buffers anyway --")
print("but it has to be STATED.")
print()
print("A real example from this project: one variant looked 15x SLOWER than")
print("the baseline until you noticed its timed region included a data")
print("format conversion the others did not need. Its actual transform was")
print("the fastest of the lot. Same code, opposite conclusion, depending")
print("entirely on where the stopwatch started.")


# =========================================================================
# Putting it together
# =========================================================================
print()
print("=== A benchmark you can defend ===")
print()


def benchmark(fn, trials=20):
    fn()                                # warm-up, discarded
    runs = [fn() for _ in range(trials)]
    return stats(runs)


gc.collect()
lo, mean, sd = benchmark(run_once)
print("%d-point assembly FFT, 20 trials after one discarded warm-up:" % N)
print("  best   : %8d cycles = %7.1f us" % (lo, lo * 1e6 / FREQ))
print("  mean   : %8d cycles = %7.1f us" % (int(mean), mean * 1e6 / FREQ))
print("  stddev : %8.0f cycles (%.1f%%)" % (sd, 100 * sd / mean))
print("  excludes table construction and buffer loading")
print()
print("Five lines. The last one is what separates a measurement from a")
print("marketing claim.")
