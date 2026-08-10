# Lab 23: Peak Detection -- Build a Tuner
#
# Lab 21 reported the loudest BIN. With 50 Hz bins that is far too coarse to
# tune an instrument: the whole of A4 (440 Hz) to A#4 (466 Hz) fits inside
# half a bin.
#
# But a bin is not really a fence. When a tone sits between two bins, BOTH
# light up -- and the ratio between them tells you where inside the gap the
# true frequency lies. Fitting a parabola through the peak and its two
# neighbours recovers the frequency to a fraction of a bin.
#
# That is how you build a tuner out of a coarse spectrum.

import config
import math
import struct
import time
from fftlab import FFT

N = 512                       # bigger N = finer bins; worth it for tuning
RATE = config.SAMPLE_RATE
BIN_HZ = RATE / N             # 25 Hz per bin

MIN_BIN = 4
PEAK_RATIO = 3.0

NOTE_NAMES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]
A4 = 440.0

fft = FFT(N)

# Lab 22's Hanning window, precomputed once.
#
# This is not decoration. Parabolic interpolation below assumes the peak is
# shaped like a parabola -- and an UNWINDOWED peak is not. Without a window
# the refinement barely helps; with one it is accurate to a fraction of a
# hertz. Lab 22 earned its keep here.
WINDOW = [0.5 - 0.5 * math.cos(2 * math.pi * i / (N - 1)) for i in range(N)]


def note_of(freq):
    """Return (name, octave, cents_off) for a frequency."""
    semitones = 12 * math.log(freq / A4, 2)
    nearest = int(round(semitones))
    cents = (semitones - nearest) * 100
    name = NOTE_NAMES[nearest % 12]
    octave = 4 + (nearest + 9) // 12
    return name, octave, cents


def refine_peak(mags, k):
    """Parabolic interpolation: find the true peak between the bins.

    Fit a parabola through (k-1, k, k+1) and return the offset of its apex
    from bin k. The result is between -0.5 and +0.5 bins.
    """
    if k <= 0 or k >= len(mags) - 1:
        return 0.0
    y1 = mags[k - 1]
    y2 = mags[k]
    y3 = mags[k + 1]
    denom = y1 - 2 * y2 + y3
    if denom == 0:
        return 0.0
    return 0.5 * (y1 - y3) / denom


# =========================================================================
# PART 1 -- prove interpolation works, on tones we generate ourselves
# =========================================================================
print("=== PART 1: how accurate is interpolation? ===")
print("bin width = %.1f Hz" % BIN_HZ)
print()
print("%10s %12s %12s %10s %12s" %
      ("true Hz", "nearest bin", "bin only", "refined", "error"))

re, im = fft.buffers()
worst_raw = 0.0
worst_fine = 0.0

for true_hz in (440.0, 466.2, 493.9, 1000.0, 1234.5, 2093.0):
    for i in range(N):
        re[i] = math.sin(2 * math.pi * true_hz * (i / RATE)) * WINDOW[i]
        im[i] = 0.0
    fft.run(re, im)
    mags = fft.magnitudes(re, im)

    k = MIN_BIN
    best = 0.0
    for j in range(MIN_BIN, N // 2):
        if mags[j] > best:
            best = mags[j]
            k = j

    raw_hz = k * BIN_HZ
    fine_hz = (k + refine_peak(mags, k)) * BIN_HZ

    worst_raw = max(worst_raw, abs(raw_hz - true_hz))
    worst_fine = max(worst_fine, abs(fine_hz - true_hz))

    print("%10.1f %12d %12.1f %10.1f %+11.2f" %
          (true_hz, k, raw_hz, fine_hz, fine_hz - true_hz))

print()
print("worst error, bin only : %.2f Hz" % worst_raw)
print("worst error, refined  : %.2f Hz" % worst_fine)
print("improvement           : %.0fx" % (worst_raw / max(worst_fine, 0.01)))
print()
print()
print("A bin is %.0f Hz wide, yet we locate the tone far more precisely than" % BIN_HZ)
print("that. We did not change the FFT at all -- we just read its output")
print("more carefully, and applied the window from Lab 22 so the peak is")
print("actually parabola-shaped. Try deleting the window and re-running:")
print("the refinement stops helping almost entirely.")

# =========================================================================
# PART 2 -- frequencies to note names
# =========================================================================
print()
print("=== PART 2: naming the note ===")
print()
print("Musical pitch is logarithmic: every octave DOUBLES the frequency,")
print("and each octave is 12 equal semitones. So:")
print("    semitones from A4 = 12 * log2(freq / 440)")
print()
print("%10s %8s %10s" % ("frequency", "note", "cents off"))
for f in (440.0, 445.0, 466.2, 261.6, 329.6, 880.0):
    name, octave, cents = note_of(f)
    print("%10.1f %6s%-2d %+9.0f" % (f, name, octave, cents))
print()
print("A 'cent' is 1/100 of a semitone. Musicians can hear about 5 cents,")
print("so anything inside +/-5 counts as in tune.")

# =========================================================================
# PART 3 -- the live tuner
# =========================================================================
print()
print("=== PART 3: live tuner ===")
print("Play or sing a steady note. Ctrl-C to stop.")
print()

oled = config.init_display()
mic = config.init_microphone()
raw = bytearray(N * 4)

for _ in range(5):
    mic.readinto(raw)
    time.sleep_ms(50)


def capture():
    n = mic.readinto(raw)
    words = struct.unpack("<%di" % (n // 4), raw[:n])
    count = min(N, len(words))
    total = 0
    for i in range(count):
        total += words[i] >> 8
    dc = total / count
    for i in range(count):
        re[i] = ((words[i] >> 8) - dc) * WINDOW[i]
        im[i] = 0.0
    for i in range(count, N):
        re[i] = 0.0
        im[i] = 0.0


try:
    while True:
        capture()
        fft.run(re, im)
        mags = fft.magnitudes(re, im)

        top = N // 2
        total = 0.0
        for k in range(MIN_BIN, top):
            total += mags[k]
        average = total / (top - MIN_BIN)

        best_k = MIN_BIN
        best_v = 0.0
        for k in range(MIN_BIN, top):
            if mags[k] > best_v:
                best_v = mags[k]
                best_k = k

        oled.fill(config.BLACK)

        if best_v < PEAK_RATIO * average or best_k == MIN_BIN:
            oled.text("   listening", 0, 24, config.WHITE)
            oled.show()
            continue

        hz = (best_k + refine_peak(mags, best_k)) * BIN_HZ
        name, octave, cents = note_of(hz)

        oled.text("%s%d" % (name, octave), 4, 4, config.WHITE)
        oled.text("%.1f Hz" % hz, 52, 4, config.WHITE)
        oled.hline(0, 16, config.WIDTH, config.WHITE)

        # A needle: centre means in tune, left is flat, right is sharp.
        mid = config.WIDTH // 2
        oled.vline(mid, 22, 18, config.WHITE)
        pos = mid + int(max(-50, min(50, cents)) / 50 * (mid - 6))
        oled.fill_rect(pos - 2, 24, 5, 14, config.WHITE)

        if abs(cents) <= 5:
            oled.text("IN TUNE", 36, 46, config.WHITE)
        elif cents < 0:
            oled.text("flat  <<", 32, 46, config.WHITE)
        else:
            oled.text(">>  sharp", 28, 46, config.WHITE)

        oled.text("%+d cents" % int(cents), 30, 56, config.WHITE)
        oled.show()

        print("%7.1f Hz  %s%d  %+4d cents  %s" %
              (hz, name, octave, int(cents),
               "IN TUNE" if abs(cents) <= 5 else ("flat" if cents < 0 else "sharp")))

except KeyboardInterrupt:
    mic.deinit()
    oled.fill(config.BLACK)
    oled.text("Stopped.", 32, 28, config.WHITE)
    oled.show()
    print("Stopped.")
