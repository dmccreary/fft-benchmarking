# Lab 16: Your DFT Is Too Slow
#
# Your DFT is correct. Lab 15 proved it.
#
# Correct is not the same as useful. Audio arrives continuously, so a
# real-time system has a DEADLINE: finish this frame before the next one
# turns up. This lab measures whether we can meet it.
#
# Spoiler: not even close. And the way it fails -- getting four times worse
# every time the problem doubles -- is exactly why the FFT was invented.

import config
import math
import time

RATE = config.SAMPLE_RATE


def dft(signal):
    """The Lab 14 DFT, unchanged."""
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


def make_signal(n):
    return [math.sin(2 * math.pi * 3 * i / n) for i in range(n)]


print("=== How long does a DFT take? ===")
print()
print("%6s %12s %14s %12s" % ("N", "time (ms)", "vs previous", "operations"))
print("-" * 48)

sizes = [16, 32, 64, 128, 256]
previous_ms = None
results = []

for n in sizes:
    sig = make_signal(n)
    start = time.ticks_ms()
    dft(sig)
    elapsed = time.ticks_diff(time.ticks_ms(), start)

    ratio = ("%.1fx" % (elapsed / previous_ms)) if previous_ms else "-"
    print("%6d %12d %14s %12d" % (n, elapsed, ratio, n * n))
    results.append((n, elapsed))
    previous_ms = elapsed if elapsed > 0 else 1

print()
print("Every time N doubles, the work goes up FOUR times.")
print("That is what O(N^2) means: the inner loop runs N times for each of")
print("N output bins, so the total is N * N.")

# --- extrapolate to the size we actually want -----------------------------
print()
print("=== What about N = 512, the size we need? ===")
big_n, big_ms = results[-1]
predicted = big_ms * (512 / big_n) ** 2
print("Measured at N=%d      : %d ms" % (big_n, big_ms))
print("Predicted at N=512    : %.0f ms  (%.1f x %.1f = 4x per doubling)"
      % (predicted, big_ms, (512 / big_n) ** 2))

# --- the deadline ----------------------------------------------------------
frame_ms = 512 / RATE * 1000
print()
print("=== The deadline ===")
print("512 samples at %d Hz is %.0f ms of sound." % (RATE, frame_ms))
print("So a real-time system has %.0f ms to process each frame." % frame_ms)
print()
print("We need   : %.0f ms" % frame_ms)
print("We take   : %.0f ms" % predicted)
print("Over by   : %.0fx" % (predicted / frame_ms))
print()
if predicted > frame_ms:
    print("We are %.0f times too slow. While we finish one frame, %d more" %
          (predicted / frame_ms, int(predicted / frame_ms)))
    print("have already arrived and been thrown away.")

# --- where the time goes ---------------------------------------------------
print()
print("=== Where does the time actually go? ===")
n = 128
sig = make_signal(n)

start = time.ticks_us()
for k in range(n):
    for t in range(n):
        pass
loop_us = time.ticks_diff(time.ticks_us(), start)

start = time.ticks_us()
for k in range(n):
    for t in range(n):
        angle = 2 * math.pi * k * t / n
trig_setup_us = time.ticks_diff(time.ticks_us(), start)

start = time.ticks_us()
for k in range(n):
    for t in range(n):
        angle = 2 * math.pi * k * t / n
        math.cos(angle)
        math.sin(angle)
full_us = time.ticks_diff(time.ticks_us(), start)

print("N = %d, so the inner body runs %d times." % (n, n * n))
print("  empty loops only        : %6d us" % loop_us)
print("  + computing the angle   : %6d us" % trig_setup_us)
print("  + calling sin and cos   : %6d us" % full_us)
print()
print("The trig calls dominate. We compute sin and cos %d times," % (2 * n * n))
print("but there are only %d distinct angles -- we are recomputing the" % n)
print("same handful of values over and over.")
print()
print("Hold that thought. It is the first crack in the problem, and Lab 17")
print("prises it wide open.")
