# Example: using the assembly FFT from ordinary MicroPython.
#
# This is the shape a student lab takes -- build a signal, transform it, find
# the peak. Nothing here touches assembly directly; fft_asm hides it behind a
# normal Python class.
#
# Run with:  mpremote connect <port> run example_student_lab.py

import math

from fft_asm import FFT
import dwt_timer

N = 512
FS = 12800.0                 # sample rate in Hz
BIN_HZ = FS / N              # 25 Hz per bin

fft = FFT(N)
re, im = fft.make_buffers()

# A 1 kHz tone with a quieter 2.5 kHz companion.
for i in range(N):
    t = i / FS
    re[i] = 0.7 * math.sin(2 * math.pi * 1000.0 * t) + \
            0.3 * math.sin(2 * math.pi * 2500.0 * t)
    im[i] = 0.0

cycles = fft.run_timed(re, im)
mags = fft.magnitude(re, im)

print("512-point FFT took %d cycles = %.1f us" % (cycles, dwt_timer.to_us(cycles)))
print("that is %.0f transforms per second\n" % (1e6 / dwt_timer.to_us(cycles)))

# Only the first half of the spectrum is meaningful for a real input signal;
# the second half mirrors it.
peaks = []
for k in range(1, N // 2):
    if mags[k] > mags[k - 1] and mags[k] > mags[k + 1] and mags[k] > 10.0:
        peaks.append((mags[k], k))
peaks.sort()
peaks.reverse()

print("strongest frequency components:")
for mag, k in peaks[:5]:
    print("  bin %3d = %6.1f Hz   magnitude %8.1f" % (k, k * BIN_HZ, mag))
