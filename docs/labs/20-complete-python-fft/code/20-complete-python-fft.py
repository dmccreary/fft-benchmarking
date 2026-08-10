# Lab 20: A Complete Python FFT
#
# Time to put it together. Everything here you have already built:
#
#   Lab 17  split evens and odds, recombine with a twiddle
#   Lab 18  bit-reverse once, then work in place; precompute twiddles
#   Lab 19  the butterfly, and how stages are arranged
#
# The whole FFT is about twenty lines. Then we do the important part:
# check it against the DFT we already proved correct in Lab 15, and measure
# how much faster it is than the one we timed in Lab 16.
#
# Correctness first. Speed only counts if the answer is right.

import config
import math
import time


# =========================================================================
# The FFT
# =========================================================================
def make_tables(n):
    """Precompute the bit-reversal permutation and the twiddle factors."""
    bits = 0
    while (1 << bits) < n:
        bits += 1

    rev = []
    for i in range(n):
        r = 0
        x = i
        for _ in range(bits):
            r = (r << 1) | (x & 1)
            x >>= 1
        rev.append(r)

    half = n // 2
    tw_re = [0.0] * half
    tw_im = [0.0] * half
    for k in range(half):
        angle = -2 * math.pi * k / n
        tw_re[k] = math.cos(angle)
        tw_im[k] = math.sin(angle)

    return rev, tw_re, tw_im


def fft(re, im, rev, tw_re, tw_im):
    """In-place iterative radix-2 FFT. Modifies re and im directly."""
    n = len(re)

    # --- Lab 18: reorder once, in place -----------------------------------
    for i in range(n):
        j = rev[i]
        if j > i:
            re[i], re[j] = re[j], re[i]
            im[i], im[j] = im[j], im[i]

    # --- Lab 19: log2(n) stages of butterflies ----------------------------
    half = 1
    while half < n:
        step = n // (half * 2)      # how far apart the twiddles we need are
        k = 0
        while k < n:                # for each block
            j = 0
            while j < half:         # for each butterfly in the block
                wr = tw_re[j * step]
                wi = tw_im[j * step]
                i1 = k + j
                i2 = i1 + half

                tr = wr * re[i2] - wi * im[i2]
                ti = wr * im[i2] + wi * re[i2]

                ar, ai = re[i1], im[i1]
                re[i1] = ar + tr
                im[i1] = ai + ti
                re[i2] = ar - tr
                im[i2] = ai - ti
                j += 1
            k += half * 2
        half *= 2


# =========================================================================
# The DFT from Lab 14, kept as our reference
# =========================================================================
def dft(signal):
    n = len(signal)
    real, imag = [], []
    for k in range(n):
        rr = ii = 0.0
        for t in range(n):
            angle = 2 * math.pi * k * t / n
            rr += signal[t] * math.cos(angle)
            ii -= signal[t] * math.sin(angle)
        real.append(rr)
        imag.append(ii)
    return real, imag


def magnitudes(real, imag):
    return [math.sqrt(real[k] ** 2 + imag[k] ** 2) for k in range(len(real))]


def run_fft(signal):
    n = len(signal)
    rev, tw_re, tw_im = make_tables(n)
    re = list(signal)
    im = [0.0] * n
    fft(re, im, rev, tw_re, tw_im)
    return re, im


# =========================================================================
# PART 1 -- does it agree with the DFT?
# =========================================================================
N = 64
RATE = config.SAMPLE_RATE
BIN = RATE / N
signal = [math.sin(2 * math.pi * 3 * BIN * (i / RATE))
          + 0.5 * math.sin(2 * math.pi * 7 * BIN * (i / RATE))
          for i in range(N)]

dft_mag = magnitudes(*dft(signal))
fft_mag = magnitudes(*run_fft(signal))

print("=== PART 1: FFT vs the DFT we already trust ===")
print("%4s %12s %12s %12s" % ("bin", "DFT", "FFT", "difference"))
worst = 0.0
for k in range(N // 2 + 1):
    d = abs(dft_mag[k] - fft_mag[k])
    if d > worst:
        worst = d
    if dft_mag[k] > 0.5:
        print("%4d %12.4f %12.4f %12.2e" % (k, dft_mag[k], fft_mag[k], d))
print()
print("largest difference across all bins: %.3e" % worst)
peak = max(dft_mag)
print("as a fraction of the peak (%.1f): %.2e" % (peak, worst / peak))
print()
print("AGREEMENT CONFIRMED" if worst / peak < 1e-3 else "*** MISMATCH ***")

# =========================================================================
# PART 2 -- the validation suite from Lab 15, now on the FFT
# =========================================================================
print()
print("=== PART 2: the Lab 15 tests, run against the FFT ===")
REL = 1e-3
checks = []

checks.append(("silence", [0.0] * N,
               lambda m: all(v < REL for v in m)))
checks.append(("constant 0.5", [0.5] * N,
               lambda m: abs(m[0] - 0.5 * N) < REL * 0.5 * N))
imp = [0.0] * N
imp[0] = 1.0
checks.append(("impulse", imp,
               lambda m: all(abs(v - 1.0) < REL for v in m)))
alt = [1.0 if i % 2 == 0 else -1.0 for i in range(N)]
checks.append(("alternating +/-1", alt,
               lambda m: abs(m[N // 2] - N) < REL * N))
checks.append(("sine at bin 5", [math.sin(2 * math.pi * 5 * i / N) for i in range(N)],
               lambda m: abs(m[5] - N / 2) < REL * N / 2))

passed = 0
for name, sig, check in checks:
    ok = check(magnitudes(*run_fft(sig)))
    print("  %-20s %s" % (name, "PASS" if ok else "*** FAIL ***"))
    passed += 1 if ok else 0
print("  %d/%d passed" % (passed, len(checks)))

# =========================================================================
# PART 3 -- how much faster?
# =========================================================================
print()
print("=== PART 3: speed ===")
print("%6s %12s %12s %10s" % ("N", "DFT (ms)", "FFT (ms)", "speedup"))

for n in (32, 64, 128, 256):
    sig = [math.sin(2 * math.pi * 5 * i / n) for i in range(n)]

    start = time.ticks_ms()
    dft(sig)
    dft_ms = time.ticks_diff(time.ticks_ms(), start)

    rev, twr, twi = make_tables(n)
    re = list(sig)
    im = [0.0] * n
    start = time.ticks_ms()
    fft(re, im, rev, twr, twi)
    fft_ms = time.ticks_diff(time.ticks_ms(), start)

    ratio = ("%.0fx" % (dft_ms / fft_ms)) if fft_ms > 0 else ">100x"
    print("%6d %12d %12d %10s" % (n, dft_ms, fft_ms, ratio))

# =========================================================================
# PART 4 -- the deadline, revisited
# =========================================================================
print()
print("=== PART 4: can we hit the deadline now? ===")
n = 512
rev, twr, twi = make_tables(n)
sig = [math.sin(2 * math.pi * 40 * i / n) for i in range(n)]

re = list(sig)
im = [0.0] * n
start = time.ticks_ms()
fft(re, im, rev, twr, twi)
ms = time.ticks_diff(time.ticks_ms(), start)

budget = 512 / RATE * 1000
print("512-point FFT in pure Python : %d ms" % ms)
print("real-time budget             : %.0f ms" % budget)
print("Lab 16's DFT estimate        : 21196 ms")
print()
print("improvement over the DFT     : %.0fx" % (21196 / ms))
if ms > budget:
    print("still over budget by         : %.1fx" % (ms / budget))
    print()
    print("Enormous progress -- but pure Python is still too slow for")
    print("real time. The algorithm is now right; what remains is the")
    print("cost of the LANGUAGE. That is Module 6 and Module 7.")
else:
    print("WE MADE IT with %.0f ms to spare." % (budget - ms))
