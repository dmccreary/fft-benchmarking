# Lab 15: Validating Your DFT on a Known Signal
#
# You wrote a DFT last lab and the output LOOKED right. That is not the same
# as being right.
#
# This lab builds signals whose spectra we can predict on paper, then checks
# the code against those predictions. If the DFT ever disagrees with theory,
# we find out here -- in a controlled test with a known answer -- and not in
# Lab 21 with a microphone attached and four things that could be at fault.
#
# This habit has a name: VALIDATE BEFORE YOU TRUST.

import config
import math

RATE = config.SAMPLE_RATE
N = 64
BIN = RATE / N

# How close is "equal"? This is a real decision, not a formality.
#
# MicroPython on this board uses SINGLE-precision floats -- about 7 digits.
# Worse, our angle 2*pi*k*t/N reaches ~390 radians for the highest bins, and
# a float32 can only pin that down to about 4e-5 radians. So bins that should
# be exactly zero come out around 1e-4 instead.
#
# A tolerance of 1e-6 would therefore fail every time, not because the DFT is
# wrong but because the tolerance is a fantasy. We express it RELATIVE to the
# size of the signal instead.
REL_TOL = 1e-3            # 0.1% of the largest expected value


def dft(signal):
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


def magnitudes(real, imag):
    return [math.sqrt(real[k] ** 2 + imag[k] ** 2) for k in range(len(real))]


def sine(freq, amp=1.0, phase=0.0, n=N):
    return [amp * math.sin(2 * math.pi * freq * (i / RATE) + phase)
            for i in range(n)]


# =========================================================================
# The test cases. Each one has a spectrum we can work out on paper.
# =========================================================================
#
#  signal                     expected spectrum
#  -----------------------    -------------------------------------------
#  all zeros                  every bin 0
#  constant D                 bin 0 = D*N, everything else 0
#  sine, amplitude A, bin k   bin k = A*N/2  (and mirrored at N-k)
#  impulse at sample 0        EVERY bin = 1.0  (perfectly flat)
#  alternating +1/-1          bin N/2 = N, everything else 0

tests = []

tests.append((
    "silence",
    [0.0] * N,
    "every bin zero",
    lambda m: all(v < REL_TOL for v in m),
))

D = 0.5
tests.append((
    "constant %.1f" % D,
    [D] * N,
    "bin 0 = %.1f, rest zero" % (D * N),
    lambda m: abs(m[0] - D * N) < REL_TOL * D * N
              and all(v < REL_TOL * D * N for v in m[1:]),
))

A, K = 1.0, 3
tests.append((
    "sine amp %.1f at bin %d" % (A, K),
    sine(K * BIN, amp=A),
    "bin %d = %.1f" % (K, A * N / 2),
    lambda m: abs(m[K] - A * N / 2) < REL_TOL * A * N / 2,
))

A2, K2 = 0.25, 7
tests.append((
    "sine amp %.2f at bin %d" % (A2, K2),
    sine(K2 * BIN, amp=A2),
    "bin %d = %.1f" % (K2, A2 * N / 2),
    lambda m: abs(m[K2] - A2 * N / 2) < REL_TOL * A2 * N / 2,
))

tests.append((
    "phase-shifted sine",
    sine(K * BIN, phase=1.234),
    "bin %d still = %.1f (phase must not matter)" % (K, N / 2),
    lambda m: abs(m[K] - N / 2) < REL_TOL * N / 2,
))

impulse = [0.0] * N
impulse[0] = 1.0
tests.append((
    "impulse at sample 0",
    impulse,
    "every bin = 1.0 (flat spectrum)",
    lambda m: all(abs(v - 1.0) < REL_TOL for v in m),
))

alt = [1.0 if i % 2 == 0 else -1.0 for i in range(N)]
tests.append((
    "alternating +1/-1",
    alt,
    "bin %d = %d (Nyquist)" % (N // 2, N),
    lambda m: abs(m[N // 2] - N) < REL_TOL * N,
))

# =========================================================================
# Run them
# =========================================================================
print("Validating the DFT against hand-computed answers")
print("N = %d, bin width = %.0f Hz, relative tolerance = %g" % (N, BIN, REL_TOL))
print()
print("%-26s %-34s %s" % ("test signal", "expected", "result"))
print("-" * 74)

passed = failed = 0
for name, signal, expectation, check in tests:
    mags = magnitudes(*dft(signal))
    ok = check(mags)
    print("%-26s %-34s %s" % (name, expectation, "PASS" if ok else "*** FAIL ***"))
    if ok:
        passed += 1
    else:
        failed += 1
        # A failure should tell you WHERE to look, not just that it happened.
        top = max(range(len(mags)), key=lambda k: mags[k])
        print("      -> largest bin was %d (%.0f Hz) at magnitude %.4f"
              % (top, top * BIN, mags[top]))

print("-" * 74)
print("%d passed, %d failed" % (passed, failed))
print()

if failed == 0:
    print("Every prediction confirmed. The DFT is trustworthy -- so when")
    print("something looks wrong in a later lab, the DFT is not the suspect.")
else:
    print("Something disagrees with theory. Debug by BISECTION: start with")
    print("the simplest failing case and shrink N until you can check the")
    print("arithmetic by hand.")

# =========================================================================
# Where the expected numbers come from
# =========================================================================
print()
print("=== How close to zero is zero? ===")
zeros = magnitudes(*dft([0.5] * N))
worst = max(zeros[1:])
print("For a constant signal every bin above 0 should be EXACTLY zero.")
print("Largest one actually measured: %.3e" % worst)
print()
print("That is not a bug in the DFT. This board uses single-precision")
print("floats (repr(1/3) = %s), and our angle 2*pi*k*t/N climbs to about" % repr(1/3))
print("%.0f radians for the top bins. float32 cannot hold a number that" % (2 * math.pi * (N-1) * (N-1) / N))
print("large to better than ~1e-4 radians, so cos() starts out inaccurate")
print("before it even runs.")
print()
print("Two lessons:")
print("  1. A tolerance must match the arithmetic you actually have.")
print("  2. Recomputing big angles is wasteful AND imprecise -- which is")
print("     exactly why Lab 18 precomputes a small table of twiddle factors")
print("     instead of calling cos() half a million times.")

print()
print("=== Why a sine of amplitude A peaks at A*N/2 ===")
print("A real sine splits its energy between the positive frequency (bin k)")
print("and its mirror (bin N-k). Each half gets A*N/2.")
print()
mags = magnitudes(*dft(sine(K * BIN)))
print("amplitude 1.0, N = %d  ->  expected %.1f" % (N, N / 2))
print("  bin %2d  = %.4f" % (K, mags[K]))
print("  bin %2d  = %.4f   <- the mirror" % (N - K, mags[N - K]))
print("  total   = %.4f   = A * N" % (mags[K] + mags[N - K]))
