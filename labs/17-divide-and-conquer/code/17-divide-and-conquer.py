# Lab 17: Divide and Conquer -- From DFT to FFT
#
# Last lab we found the DFT is 530x too slow, and that it recomputes the same
# angles thousands of times. That is a hint: there is REDUNDANT WORK in there.
#
# Here is the observation that unlocks everything. Split your samples into
# the even-numbered ones and the odd-numbered ones. Transform each half
# separately. Then the full transform can be rebuilt from those two halves:
#
#     X[k]         = E[k] + W^k * O[k]
#     X[k + N/2]   = E[k] - W^k * O[k]
#
# Look at the second line. It reuses E[k] and O[k] -- ALREADY COMPUTED for
# the first line. One multiplication buys you two output bins.
#
# Do that recursively and N^2 collapses to N log N.

import config
import math
import time


def dft(signal):
    """The brute-force DFT from Lab 14."""
    n = len(signal)
    real, imag = [], []
    for k in range(n):
        re = im = 0.0
        for t in range(n):
            angle = 2 * math.pi * k * t / n
            re += signal[t] * math.cos(angle)
            im -= signal[t] * math.sin(angle)
        real.append(re)
        imag.append(im)
    return real, imag


def dft_split(signal):
    """One level of divide and conquer, done by hand.

    Transform the even samples and the odd samples separately, then stitch
    the results together. The answer is identical to dft() -- but the two
    half-size DFTs cost 2*(N/2)^2 = N^2/2 instead of N^2.
    """
    n = len(signal)
    half = n // 2

    evens = [signal[i] for i in range(0, n, 2)]
    odds = [signal[i] for i in range(1, n, 2)]

    e_re, e_im = dft(evens)
    o_re, o_im = dft(odds)

    real = [0.0] * n
    imag = [0.0] * n
    for k in range(half):
        # W^k, the "twiddle factor" -- a rotation by -2*pi*k/n
        angle = -2 * math.pi * k / n
        wr = math.cos(angle)
        wi = math.sin(angle)

        # W^k * O[k]  (complex multiply)
        tr = wr * o_re[k] - wi * o_im[k]
        ti = wr * o_im[k] + wi * o_re[k]

        # Two outputs from one multiplication. THIS is the saving.
        real[k] = e_re[k] + tr
        imag[k] = e_im[k] + ti
        real[k + half] = e_re[k] - tr
        imag[k + half] = e_im[k] - ti

    return real, imag


def magnitudes(real, imag):
    return [math.sqrt(real[k] ** 2 + imag[k] ** 2) for k in range(len(real))]


# =========================================================================
# PART 1 -- prove the split gives the same answer
# =========================================================================
N = 32
signal = [math.sin(2 * math.pi * 3 * i / N) + 0.5 * math.sin(2 * math.pi * 7 * i / N)
          for i in range(N)]

direct = magnitudes(*dft(signal))
split = magnitudes(*dft_split(signal))

print("=== PART 1: does splitting change the answer? ===")
print("%4s %12s %12s %12s" % ("bin", "direct DFT", "split DFT", "difference"))
worst = 0.0
for k in range(N // 2 + 1):
    d = abs(direct[k] - split[k])
    if d > worst:
        worst = d
    if direct[k] > 0.01 or k < 9:
        print("%4d %12.4f %12.4f %12.2e" % (k, direct[k], split[k], d))
print()
print("largest difference anywhere: %.2e" % worst)
print("Identical (to float precision). The split is exact, not an approximation.")

# =========================================================================
# PART 2 -- count the work
# =========================================================================
print()
print("=== PART 2: how much work did we save? ===")
print()
print("%8s %14s %16s %10s" % ("N", "direct (N^2)", "one split", "saved"))
for n in (16, 32, 64, 128, 256, 512):
    direct_ops = n * n
    # two half-size DFTs, plus n/2 recombinations
    split_ops = 2 * (n // 2) ** 2 + n // 2
    print("%8d %14d %16d %9.0f%%"
          % (n, direct_ops, split_ops, 100 * (1 - split_ops / direct_ops)))

print()
print("One split saves about half the work. But why stop at one split?")

# =========================================================================
# PART 3 -- keep splitting
# =========================================================================
print()
print("=== PART 3: splitting all the way down ===")
print()
print("Each split halves the work again. Keep going until each piece is a")
print("single sample -- whose DFT is just itself, requiring no arithmetic.")
print()
print("%8s %10s %14s %16s %12s" % ("N", "splits", "direct N^2", "FFT N*log2(N)", "speedup"))
for n in (16, 64, 256, 512, 1024, 4096):
    stages = int(math.log(n, 2) + 0.5)
    fft_ops = n * stages
    print("%8d %10d %14d %16d %11.0fx"
          % (n, stages, n * n, fft_ops, (n * n) / fft_ops))

print()
print("At N=512 that is a %.0fx reduction in arithmetic." % (512 * 512 / (512 * 9)))
print("This is why the FFT matters. Same answer, a fraction of the work.")

# =========================================================================
# PART 4 -- why powers of two
# =========================================================================
print()
print("=== PART 4: why N must be a power of two ===")
print("Halving only works cleanly if the size keeps dividing by 2.")
print()
for n in (512, 500):
    print("N = %d:" % n, end=" ")
    x = n
    chain = []
    while x % 2 == 0 and x > 1:
        chain.append(x)
        x //= 2
    chain.append(x)
    print(" -> ".join(str(c) for c in chain),
          "  (clean)" if x == 1 else "  <- STUCK at %d, cannot halve" % x)

# =========================================================================
# PART 5 -- measure it
# =========================================================================
print()
print("=== PART 5: measured, not just counted ===")
n = 128
sig = [math.sin(2 * math.pi * 5 * i / n) for i in range(n)]

start = time.ticks_ms()
dft(sig)
direct_ms = time.ticks_diff(time.ticks_ms(), start)

start = time.ticks_ms()
dft_split(sig)
split_ms = time.ticks_diff(time.ticks_ms(), start)

print("N = %d" % n)
print("  direct DFT      : %5d ms" % direct_ms)
print("  ONE split       : %5d ms   (%.1fx faster)" % (split_ms, direct_ms / split_ms))
print()
print("And that is from a single split. Lab 20 does all %d of them."
      % int(math.log(512, 2) + 0.5))
