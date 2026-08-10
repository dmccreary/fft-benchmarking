# Lab 26: Benchmarking Methodology
#
# You now have a cycle-accurate stopwatch. That is necessary but nowhere
# near sufficient -- a precise instrument used carelessly produces precise
# nonsense.
#
# This lab demonstrates four ways a benchmark lies to you, using the real
# FFT as the thing under test. Every effect here was found the hard way
# while building this course.

import gc
import machine
import math
import time
from fftlab import FFT

DEMCR = 0xE000EDFC
DWT_CTRL = 0xE0001000
DWT_CYCCNT = 0xE0001004
machine.mem32[DEMCR] = machine.mem32[DEMCR] | (1 << 24)
machine.mem32[DWT_CTRL] = machine.mem32[DWT_CTRL] | 1

N = 256
fft = FFT(N)
signal = [math.sin(2 * math.pi * 20 * i / N) for i in range(N)]
re, im = fft.buffers()


def load():
    for i in range(N):
        re[i] = signal[i]
        im[i] = 0.0


def timed_run():
    load()
    start = machine.mem32[DWT_CYCCNT]
    fft.run(re, im)
    end = machine.mem32[DWT_CYCCNT]
    return (end - start) & 0xFFFFFFFF


def stats(values):
    lo = min(values)
    mean = sum(values) / len(values)
    var = sum((v - mean) ** 2 for v in values) / len(values)
    return lo, mean, var ** 0.5


# =========================================================================
# LIE 1 -- the first run is not like the others
# =========================================================================
print("=== LIE 1: the cold start ===")
print()
first = timed_run()
rest = [timed_run() for _ in range(10)]
lo, mean, sd = stats(rest)

print("first run ever     : %d cycles" % first)
print("next 10, best      : %d cycles" % lo)
print("next 10, mean      : %d cycles" % int(mean))
print("first run is %.1f%% slower than the best" % (100 * (first - lo) / lo))
print()
print("Caches are cold, code paths are untouched, allocations have not")
print("settled. Benchmark the first run and you measure startup, not speed.")
print()
print("FIX: always discard one warm-up run.")


# =========================================================================
# LIE 2 -- the mean hides the truth
# =========================================================================
print()
print("=== LIE 2: mean versus best-of-N ===")
print()
runs = [timed_run() for _ in range(30)]
lo, mean, sd = stats(runs)
hi = max(runs)

print("30 runs of the SAME code on the SAME data:")
print("  best   : %d cycles" % lo)
print("  mean   : %d cycles" % int(mean))
print("  worst  : %d cycles" % hi)
print("  stddev : %.0f cycles" % sd)
print("  spread : %.1f%% between best and worst" % (100 * (hi - lo) / lo))
print()
print("Identical work, different answers. Something outside your program --")
print("interrupts, the USB stack, memory refresh -- steals time at random.")
print()
print("Notice the asymmetry: nothing can make code run FASTER than it truly")
print("is, but plenty can make it slower. So the distribution has a hard")
print("floor and a long tail.")
print()
print("FIX: report BEST-OF-N as the speed, and the spread as the honesty.")


# =========================================================================
# LIE 3 -- measuring changes what you measure
# =========================================================================
print()
print("=== LIE 3: the observer effect ===")
print()

# Time the whole transform in one go.
whole = min(timed_run() for _ in range(5))

# Now time it "in pieces", as if profiling each stage.
def timed_in_pieces():
    load()
    total = 0
    # pretend we are profiling: read the counter around each stage
    for _ in range(9):                  # 9 stages in a 512-pt FFT
        s = machine.mem32[DWT_CYCCNT]
        e = machine.mem32[DWT_CYCCNT]
        total += (e - s) & 0xFFFFFFFF
    start = machine.mem32[DWT_CYCCNT]
    fft.run(re, im)
    end = machine.mem32[DWT_CYCCNT]
    return ((end - start) & 0xFFFFFFFF) + total

pieces = min(timed_in_pieces() for _ in range(5))

print("whole transform, timed once      : %d cycles" % whole)
print("same transform + 9 timing probes : %d cycles" % pieces)
print("cost of the instrumentation      : %d cycles (%.1f%%)"
      % (pieces - whole, 100 * (pieces - whole) / whole))
print()
print("Every measurement costs something. Time small pieces and the")
print("stopwatch itself becomes part of the result.")
print()
print("FIX: measure whole operations. Use fine-grained profiling to find")
print("     the bottleneck, then re-measure the whole thing to report it.")


# =========================================================================
# LIE 4 -- what the benchmark leaves out
# =========================================================================
print()
print("=== LIE 4: what is NOT in the timed region ===")
print()

start = machine.mem32[DWT_CYCCNT]
load()
end = machine.mem32[DWT_CYCCNT]
load_cost = (end - start) & 0xFFFFFFFF

start = machine.mem32[DWT_CYCCNT]
f2 = FFT(N)
end = machine.mem32[DWT_CYCCNT]
setup_cost = (end - start) & 0xFFFFFFFF

print("the FFT itself           : %d cycles" % whole)
print("loading the buffers      : %d cycles (%.0f%% of the FFT)"
      % (load_cost, 100 * load_cost / whole))
print("building the tables once : %d cycles (%.1f FFTs' worth)"
      % (setup_cost, setup_cost / whole))
print()
print("Our headline number excludes both. That is defensible -- tables are")
print("built once and buffers get filled by the microphone anyway -- but it")
print("must be STATED. A benchmark without its exclusions is a sales pitch.")


# =========================================================================
# Putting it together
# =========================================================================
print()
print("=== A benchmark you can trust ===")
print()


def benchmark(fn, trials=20):
    fn()                                    # warm-up, discarded
    runs = [fn() for _ in range(trials)]
    lo, mean, sd = stats(runs)
    return lo, mean, sd


gc.collect()
lo, mean, sd = benchmark(timed_run)
freq = machine.freq()
print("%d-point FFT, 20 trials after one discarded warm-up:" % N)
print("  best   : %8d cycles  = %7.1f us" % (lo, lo * 1e6 / freq))
print("  mean   : %8d cycles  = %7.1f us" % (int(mean), mean * 1e6 / freq))
print("  stddev : %8.0f cycles  (%.1f%%)" % (sd, 100 * sd / mean))
print()
print("Excludes: table construction (once at startup) and buffer loading.")
print()
print("That last line is what separates a measurement from a claim.")
