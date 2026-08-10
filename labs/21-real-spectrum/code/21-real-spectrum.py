# Lab 21: Spectrum of a Real Sound
#
# THIS IS THE PAYOFF.
#
# Everything since Lab 7 has been building toward this: point the microphone
# at the world, transform what it hears, and draw the frequencies on screen.
#
# Then whistle at it. Slide your pitch up and down and watch the peak move.
# That moment -- when a sound becomes a NUMBER you can see -- is what the
# whole course is about.

import config
import math
import struct
import time
from fftlab import FFT

N = 256                       # smaller than 512 so the display stays lively
RATE = config.SAMPLE_RATE     # 12800 Hz
BIN_HZ = RATE / N             # 50 Hz per bin

# Rooms are full of low-frequency rumble -- traffic, fans, your own
# building. It falls off as 1/f, so bin 1 or 2 almost always "wins" even in
# silence. We ignore everything below this bin when hunting for a peak.
MIN_BIN = 6                   # 300 Hz -- above the rumble, below a whistle
PEAK_RATIO = 3.0              # a real peak must stand this far above average

BARS = 32                     # bars across the 128-pixel display
BAR_W = config.WIDTH // BARS
TOP = 14                      # leave room for the title
BAR_H = config.HEIGHT - TOP - 10

fft = FFT(N)
oled = config.init_display()
mic = config.init_microphone()
raw = bytearray(N * 4)
re, im = fft.buffers()

print("Settling the microphone...")
for _ in range(5):
    mic.readinto(raw)
    time.sleep_ms(50)

print()
print("=== Live spectrum ===")
print("bin width : %.0f Hz" % BIN_HZ)
print("range     : 0 to %.0f Hz" % (RATE / 2))
print()
print("WHISTLE AT IT. Slide your pitch up and down and watch the peak move.")
print("Ctrl-C to stop.")
print()


def capture():
    """Read one frame of audio into the FFT's real buffer."""
    n = mic.readinto(raw)
    words = struct.unpack("<%di" % (n // 4), raw[:n])
    count = min(N, len(words))
    # Remove the DC offset (Lab 7) -- otherwise bin 0 swamps everything.
    total = 0
    for i in range(count):
        total += words[i] >> 8
    dc = total / count
    for i in range(count):
        re[i] = (words[i] >> 8) - dc
        im[i] = 0.0
    for i in range(count, N):
        re[i] = 0.0
        im[i] = 0.0


def find_peak(mags):
    """Loudest bin above the rumble, but only if it really stands out.

    Returns (bin, hz) or (None, 0) when nothing convincing is present.
    """
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

    if best_v < PEAK_RATIO * average:
        return None, 0.0        # just noise -- no honest answer to give
    if best_k == MIN_BIN:
        # The winner is sitting right on the edge of the rumble we excluded.
        # That is nearly always the rumble leaning in, not a real tone --
        # you can see it in a pitch track as spurious readings during the
        # gaps when the whistler takes a breath.
        return None, 0.0
    return best_k, best_k * BIN_HZ


def draw(mags, peak_bin, peak_hz):
    oled.fill(config.BLACK)
    if peak_bin is None:
        oled.text("  listening", 0, 0, config.WHITE)
    else:
        oled.text("%5d Hz" % peak_hz, 0, 0, config.WHITE)
    oled.hline(0, 11, config.WIDTH, config.WHITE)

    # Group the bins into display bars. We only plot the lower part of the
    # spectrum -- most interesting sound lives below a few kHz.
    usable = N // 2
    per_bar = usable // BARS
    biggest = 1.0
    heights = []
    for b in range(BARS):
        s = 0.0
        for k in range(b * per_bar, (b + 1) * per_bar):
            if mags[k] > s:
                s = mags[k]
        heights.append(s)
        if s > biggest:
            biggest = s

    for b, h in enumerate(heights):
        # Square-root scaling: makes quiet detail visible without a log.
        norm = math.sqrt(h / biggest)
        px = int(norm * BAR_H)
        if px > 0:
            oled.fill_rect(b * BAR_W, TOP + BAR_H - px, BAR_W - 1, px,
                           config.WHITE)

    # Mark the peak bar, when there is one worth marking.
    if peak_bin is not None:
        pb = min(BARS - 1, peak_bin // per_bar)
        oled.fill_rect(pb * BAR_W, config.HEIGHT - 8, BAR_W - 1, 3, config.WHITE)
    oled.show()


try:
    while True:
        capture()
        fft.run(re, im)
        mags = fft.fast_magnitudes(re, im)

        peak_bin, peak_hz = find_peak(mags)

        draw(mags, peak_bin, peak_hz)
        if peak_bin is None:
            print("listening... (no clear tone)")
        else:
            print("peak: bin %3d = %5.0f Hz" % (peak_bin, peak_hz))

except KeyboardInterrupt:
    mic.deinit()
    oled.fill(config.BLACK)
    oled.text("Stopped.", 32, 28, config.WHITE)
    oled.show()
    print("Stopped.")
