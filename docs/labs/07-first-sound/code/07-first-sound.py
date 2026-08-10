# Lab 7: Your First Sound Capture
#
# Reads real audio off the INMP441 microphone and shows you what a sound
# actually looks like as numbers.
#
# Three things happen here that trip up almost everyone:
#   1. The mic needs a moment to settle after power-up. The first reads are
#      garbage, so we throw them away.
#   2. Samples arrive as 32-bit words but only the top 24 bits are audio.
#      We shift right by 8 to recover the real value.
#   3. There is a DC offset -- the numbers sit above or below zero even in
#      silence. Sound is the WOBBLE, not the value, so we subtract the mean.

import config
import struct
import time

SAMPLES = 256

mic = config.init_microphone()
raw = bytearray(SAMPLES * 4)          # 4 bytes per 32-bit sample

print("Settling the microphone...")
for _ in range(5):
    mic.readinto(raw)
    time.sleep_ms(50)

print("Capturing %d samples at %d Hz (%.1f ms of sound)\n"
      % (SAMPLES, config.SAMPLE_RATE, SAMPLES / config.SAMPLE_RATE * 1000))

n = mic.readinto(raw)
mic.deinit()

# --- step 1: turn bytes into numbers ---------------------------------------
# '<' little-endian, 'i' signed 32-bit integer. One 'i' per sample.
words = struct.unpack("<%di" % (n // 4), raw[:n])

# --- step 2: recover the real 24-bit audio value ---------------------------
samples = [w >> 8 for w in words]

print("=== What one sample looks like ===")
print("raw 32-bit word : %d  (%s)" % (words[0], hex(words[0] & 0xFFFFFFFF)))
print("after >> 8      : %d" % samples[0])
print("full scale      : +/-8388608  (2^23)")

# --- step 3: separate the DC offset from the actual sound ------------------
dc = sum(samples) / len(samples)
ac = [s - dc for s in samples]

peak = max(abs(v) for v in ac)
print()
print("=== The capture ===")
print("DC offset  : %10.0f   <- constant bias, NOT sound" % dc)
print("peak swing : %10.0f   <- this IS the sound" % peak)
print("as %% of full scale: %.3f%%" % (peak / 8388608 * 100))

# --- step 4: draw it ------------------------------------------------------
print()
print("=== The waveform ===")
print("(spread across the whole capture, so you see complete cycles)")
scale = peak if peak > 0 else 1
WIDTH = 60
ROWS = 40
mid = WIDTH // 2
step = max(1, len(ac) // ROWS)
for i in range(0, len(ac), step):
    v = ac[i]
    pos = int(mid + (v / scale) * (mid - 1))
    pos = max(0, min(WIDTH - 1, pos))
    line = [" "] * WIDTH
    line[mid] = "|"                    # the zero line
    line[pos] = "*"
    print("".join(line))

print()
print("Silence is a flat line down the middle. Make a noise and run it again.")
