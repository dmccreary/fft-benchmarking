# Lab 8: Sound Levels -- RMS and a VU Meter
#
# Turns a buffer of wobbling numbers into ONE number that means "how loud".
#
# Why RMS and not just the average? Because a sound wave spends as much time
# below zero as above it, so its plain average is roughly zero no matter how
# loud it is. Squaring makes everything positive, then we take the square
# root to get back to the original units. Root-Mean-Square.
#
# Watch the Shell: Thonny's plotter draws any bare number you print, so this
# doubles as a live oscilloscope. (View -> Plotter to open it.)

import config
import math
import struct
import time

SAMPLES = 512
FULL_SCALE = 8388608          # 2^23, the largest a 24-bit sample can be
SMOOTHING = 4                 # how many readings to average together

mic = config.init_microphone()
oled = config.init_display()
raw = bytearray(SAMPLES * 4)

# The mic needs a moment after power-up before its output means anything.
for _ in range(5):
    mic.readinto(raw)
    time.sleep_ms(50)


def read_level():
    """Return (rms, decibels) for one buffer of audio."""
    n = mic.readinto(raw)
    words = struct.unpack("<%di" % (n // 4), raw[:n])
    samples = [w >> 8 for w in words]

    # Subtract the DC offset. Without this the meter reads a big constant
    # number in dead silence, which is a very confusing bug to chase.
    dc = sum(samples) / len(samples)

    total = 0.0
    for s in samples:
        v = s - dc
        total += v * v
    rms = math.sqrt(total / len(samples))

    # Decibels relative to full scale. 0 dBFS is as loud as it gets;
    # everything real is negative. Ears work logarithmically, so dB matches
    # perception far better than raw numbers do.
    if rms < 1:
        db = -90.0
    else:
        db = 20 * math.log10(rms / FULL_SCALE)
    return rms, db


def draw_meter(db, peak_db):
    oled.fill(config.BLACK)
    oled.text("Sound Level", 0, 0, config.WHITE)
    oled.hline(0, 10, config.WIDTH, config.WHITE)

    # Map -80..0 dB onto the full width of the screen.
    width = int((db + 80) / 80 * config.WIDTH)
    width = max(0, min(config.WIDTH, width))
    oled.fill_rect(0, 18, width, 14, config.WHITE)
    oled.rect(0, 18, config.WIDTH, 14, config.WHITE)

    # A peak marker that falls back slowly -- like a real VU meter.
    pk = int((peak_db + 80) / 80 * config.WIDTH)
    pk = max(0, min(config.WIDTH - 1, pk))
    oled.vline(pk, 16, 18, config.WHITE)

    oled.text("%6.1f dB" % db, 0, 40, config.WHITE)
    oled.text("peak %5.1f" % peak_db, 0, 52, config.WHITE)
    oled.show()


print("Make some noise! Ctrl-C to stop.")
print("Tip: View -> Plotter to see this as a graph.")

history = [-90.0] * SMOOTHING
peak_db = -90.0

try:
    while True:
        rms, db = read_level()

        # Moving average: a simple low-pass filter that stops the meter
        # twitching. Bigger window = smoother but slower to react.
        history.pop(0)
        history.append(db)
        smooth = sum(history) / len(history)

        # Peak hold with slow decay.
        if smooth > peak_db:
            peak_db = smooth
        else:
            peak_db -= 0.5

        draw_meter(smooth, peak_db)

        # A bare number is what Thonny's plotter wants.
        print(smooth)

        time.sleep_ms(50)

except KeyboardInterrupt:
    mic.deinit()
    oled.fill(config.BLACK)
    oled.text("Stopped.", 32, 28, config.WHITE)
    oled.show()
    print("Stopped.")
