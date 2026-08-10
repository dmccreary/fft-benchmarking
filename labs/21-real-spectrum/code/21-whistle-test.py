# Lab 21: The Whistle Test
#
# A guided version of the spectrum analyzer. The screen asks you to whistle,
# tracks your pitch live, and then draws the whole sweep back to you as a
# graph.
#
# It is the same pipeline as 21-real-spectrum.py -- microphone, FFT,
# magnitudes, peak -- wrapped in something that tells you what to do and
# shows you how you did.
#
# Try to sweep from as low as you can whistle to as high as you can.

import config
import math
import struct
import time
from fftlab import FFT

N = 256
RATE = config.SAMPLE_RATE
BIN_HZ = RATE / N             # 50 Hz per bin

MIN_BIN = 6                   # ignore rumble below 300 Hz
PEAK_RATIO = 3.0              # a peak must stand this far above average
TEST_SECONDS = 10

fft = FFT(N)
oled = config.init_display()
mic = config.init_microphone()
raw = bytearray(N * 4)
re, im = fft.buffers()


def centre(text, y, colour=None):
    """Draw text centred on the 128-pixel-wide screen."""
    x = (config.WIDTH - len(text) * 8) // 2
    oled.text(text, max(0, x), y, config.WHITE if colour is None else colour)


def capture():
    n = mic.readinto(raw)
    words = struct.unpack("<%di" % (n // 4), raw[:n])
    count = min(N, len(words))
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

    if best_v < PEAK_RATIO * average or best_k == MIN_BIN:
        return None
    return best_k


# --- settle the microphone ------------------------------------------------
oled.fill(config.BLACK)
centre("WHISTLE TEST", 20)
centre("getting ready", 36)
oled.show()
for _ in range(6):
    mic.readinto(raw)
    time.sleep_ms(50)

# --- countdown ------------------------------------------------------------
for count in (3, 2, 1):
    oled.fill(config.BLACK)
    centre("WHISTLE TEST", 8)
    centre(str(count), 30)
    centre("get ready...", 50)
    oled.show()
    print(count, "...")
    time.sleep(1)

# --- the test -------------------------------------------------------------
oled.fill(config.BLACK)
centre("PLEASE", 14)
centre("WHISTLE NOW!", 30)
centre("low to high", 48)
oled.show()
print()
print("PLEASE WHISTLE NOW -- slide from low to high!")
print()

track = []
start = time.ticks_ms()

while time.ticks_diff(time.ticks_ms(), start) < TEST_SECONDS * 1000:
    capture()
    fft.run(re, im)
    mags = fft.fast_magnitudes(re, im)
    k = find_peak(mags)

    remaining = TEST_SECONDS - time.ticks_diff(time.ticks_ms(), start) // 1000

    oled.fill(config.BLACK)
    if k is None:
        centre("PLEASE", 4)
        centre("WHISTLE NOW!", 16)
        oled.text("%ds" % remaining, 108, 54, config.WHITE)
    else:
        hz = k * BIN_HZ
        track.append(hz)
        centre("%d Hz" % int(hz), 4)
        # A bar showing where this pitch sits in the whistling range.
        frac = (k - MIN_BIN) / (N // 2 - MIN_BIN)
        oled.fill_rect(0, 20, int(frac * config.WIDTH), 10, config.WHITE)
        oled.rect(0, 20, config.WIDTH, 10, config.WHITE)
        oled.text("keep going!", 20, 40, config.WHITE)
        oled.text("%ds" % remaining, 108, 54, config.WHITE)
        print("%5.0f Hz  %s" % (hz, "#" * int(frac * 40)))
    oled.show()

mic.deinit()

# --- results --------------------------------------------------------------
print()
if not track:
    oled.fill(config.BLACK)
    centre("no whistle", 20)
    centre("detected", 32)
    centre("try louder!", 48)
    oled.show()
    print("No clear tone detected. Whistle louder, or closer to the mic.")
    raise SystemExit

low = min(track)
high = max(track)
span = high - low
octaves = math.log(high / low, 2) if low > 0 else 0

print("=== Results ===")
print("frames with a clear tone : %d" % len(track))
print("lowest note              : %.0f Hz" % low)
print("highest note             : %.0f Hz" % high)
print("range                    : %.0f Hz  (%.1f octaves)" % (span, octaves))

# Draw the pitch track as a little graph.
oled.fill(config.BLACK)
oled.text("Your whistle", 12, 0, config.WHITE)
oled.hline(0, 10, config.WIDTH, config.WHITE)

plot_top = 14
plot_h = 34
step = max(1, len(track) // config.WIDTH)
x = 0
for i in range(0, len(track), step):
    if x >= config.WIDTH:
        break
    frac = (track[i] - low) / span if span > 0 else 0.5
    y = plot_top + plot_h - int(frac * plot_h)
    oled.pixel(x, y, config.WHITE)
    oled.pixel(x, min(plot_top + plot_h, y + 1), config.WHITE)
    x += 1

oled.text("%d-%d Hz" % (int(low), int(high)), 0, 54, config.WHITE)
oled.text("%.1f oct" % octaves, 84, 54, config.WHITE)
oled.show()

print()
if octaves >= 1.5:
    print("Impressive range! That is over an octave and a half.")
elif octaves >= 1.0:
    print("Nice -- more than a full octave.")
elif octaves >= 0.5:
    print("Good sweep. Try starting lower and finishing higher.")
else:
    print("Try a wider slide: start as low as you can, end as high as you can.")
print()
print("The graph on screen is your pitch over time -- an FFT peak,")
print("tracked live, drawn back to you. Not bad for a $5 chip.")
