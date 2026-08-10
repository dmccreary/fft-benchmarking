# Lab 03: ulab Test
# Checks whether the ulab (numpy-like) module is available and, if so,
# runs a small FFT using ulab.numpy.fft. ulab is a C module that must be
# compiled into the firmware itself -- the stock micropython.org build
# used on this Pico 2 does not include it (see 02-get-info.py), so this
# lab falls back to a tiny pure-Python DFT of the same signal when it's
# missing, to keep the test meaningful either way.

try:
    from ulab import numpy as np
    import ulab
    HAVE_ULAB = True
except ImportError:
    HAVE_ULAB = False

print("ulab available:", HAVE_ULAB)

# 8-point test signal: one full cycle of a square-ish wave.
signal = [0, 1, 0, -1, 0, 1, 0, -1]

if HAVE_ULAB:
    print("ulab version:", getattr(ulab, "__version__", "unknown"))

    arr = np.array(signal, dtype=np.float)
    real, imag = np.fft.fft(arr)
    print("input:", signal)
    print("fft real:", real)
    print("fft imag:", imag)
else:
    print("ulab is NOT installed on this firmware.")
    print("It has to be compiled into a custom firmware build, not just")
    print("copied into lib/ -- see the chat notes for the tradeoffs.")
    print()
    print("Falling back to a tiny pure-Python DFT of the same signal:")

    import cmath

    n = len(signal)
    spectrum = []
    for k in range(n):
        s = 0
        for t in range(n):
            angle = -2 * cmath.pi * k * t / n
            s += signal[t] * cmath.exp(1j * angle)
        spectrum.append(s)

    print("input:", signal)
    for k, c in enumerate(spectrum):
        print("bin", k, ":", c)

print()
print("Done.")
