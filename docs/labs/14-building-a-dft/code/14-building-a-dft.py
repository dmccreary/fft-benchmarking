# Lab 14: Sweeping All Frequencies -- You Just Built a DFT
#
# Lab 13 gave you a detector for ONE frequency. This lab does something
# almost embarrassingly simple with it:
#
#     run it at every frequency and keep all the answers.
#
# That list of answers is a SPECTRUM. And the loop that produces it is the
# Discrete Fourier Transform. Not a simplified version. The actual thing.

import config
import math

RATE = config.SAMPLE_RATE      # 12800 Hz
N = 64                         # small, so pure Python stays quick
BIN = RATE / N                 # 200 Hz per bin


def sine(freq, amp=1.0, phase=0.0, n=N):
    return [amp * math.sin(2 * math.pi * freq * (i / RATE) + phase)
            for i in range(n)]


# =========================================================================
# The DFT. This is the entire algorithm.
# =========================================================================
def dft(signal):
    """Return (real, imag) lists -- one entry per frequency bin.

    For every bin k we correlate the signal against a cosine and a sine at
    that bin's frequency. Exactly the Lab 13 detector, run in a loop.
    """
    n = len(signal)
    real = []
    imag = []
    for k in range(n):                      # for every frequency...
        re = 0.0
        im = 0.0
        for t in range(n):                  # ...correlate against the signal
            angle = 2 * math.pi * k * t / n
            re += signal[t] * math.cos(angle)
            im -= signal[t] * math.sin(angle)
        real.append(re)
        imag.append(im)
    return real, imag


def magnitudes(real, imag):
    return [math.sqrt(real[k] * real[k] + imag[k] * imag[k])
            for k in range(len(real))]


def show_spectrum(mags, label, limit=None):
    print()
    print("--- %s ---" % label)
    limit = limit or (len(mags) // 2 + 1)
    peak = max(mags[:limit]) or 1.0
    print("%4s %9s  %s" % ("bin", "Hz", "magnitude"))
    for k in range(limit):
        bar = "#" * int(mags[k] / peak * 44)
        print("%4d %8.0f  %s" % (k, k * BIN, bar))


# =========================================================================
# PART 1 -- an 8-point DFT you can check by hand
# =========================================================================
print("=== PART 1: a tiny DFT, small enough to verify by hand ===")
tiny_n = 8
# A signal that goes up, down, up, down: the fastest wiggle 8 samples can hold.
tiny = [1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, -1.0]
print("signal:", tiny)
print()
tre = []
tim = []
for k in range(tiny_n):
    re = im = 0.0
    for t in range(tiny_n):
        angle = 2 * math.pi * k * t / tiny_n
        re += tiny[t] * math.cos(angle)
        im -= tiny[t] * math.sin(angle)
    tre.append(re)
    tim.append(im)
    print("bin %d: real %+7.3f  imag %+7.3f  magnitude %6.3f"
          % (k, re, im, math.sqrt(re * re + im * im)))
print()
print("All the energy sits in bin 4 -- exactly half of 8. That is the")
print("fastest frequency 8 samples can represent: the Nyquist bin.")

# =========================================================================
# PART 2 -- a real spectrum
# =========================================================================
print()
print("=== PART 2: the spectrum of a single tone ===")
print("Bin width = %.0f Hz, so bin k covers k * %.0f Hz." % (BIN, BIN))
sig = sine(3 * BIN)                       # 600 Hz -- exactly bin 3
mags = magnitudes(*dft(sig))
show_spectrum(mags, "600 Hz tone (should peak at bin 3)")

# =========================================================================
# PART 3 -- two tones at once
# =========================================================================
print()
print("=== PART 3: two tones ===")
mixed = [a + b for a, b in zip(sine(2 * BIN), sine(5 * BIN, amp=0.5))]
mags = magnitudes(*dft(mixed))
show_spectrum(mags, "400 Hz (full) + 1000 Hz (half) -> bins 2 and 5")
print()
print("Two peaks, and the second is half the height of the first --")
print("exactly the recipe we mixed. The DFT unmixed it.")

# =========================================================================
# PART 4 -- the mirror
# =========================================================================
print()
print("=== PART 4: why we only ever plot half ===")
full = magnitudes(*dft(sine(3 * BIN)))
print("%4s %9s %10s" % ("bin", "Hz", "magnitude"))
for k in list(range(0, 6)) + list(range(N - 5, N)):
    print("%4d %8.0f %10.3f" % (k, k * BIN, full[k]))
print()
print("Bin %d matches bin 3, bin %d matches bin 2, and so on." % (N - 3, N - 2))
print("The top half is a mirror image of the bottom half. For a real-valued")
print("signal it carries no new information, so we throw it away and plot")
print("only bins 0 to %d." % (N // 2))
print()
print("bin 0        = DC (the average of the signal)")
print("bin %d       = Nyquist (%.0f Hz), the fastest we can represent"
      % (N // 2, RATE / 2))
