# Lab 10: Bit Depth, Headroom and Clipping
#
# Three experiments on the same captured sound:
#
#   1. HEADROOM  -- how much louder could it get before it breaks?
#   2. BIT DEPTH -- throw away low bits and watch detail disappear
#   3. CLIPPING  -- turn it up too far and watch the peaks flatten
#
# All three matter for the FFT later: clipping invents frequencies that were
# never in the room, and too few bits buries quiet ones in noise.

import config
import math
import struct
import time

SAMPLES = 512
FULL_SCALE = 8388608          # 2^23
BITS = 24


def capture(mic, raw):
    n = mic.readinto(raw)
    words = struct.unpack("<%di" % (n // 4), raw[:n])
    samples = [w >> 8 for w in words]
    dc = sum(samples) / len(samples)
    return [s - dc for s in samples]


def rms_of(values):
    total = 0.0
    for v in values:
        total += v * v
    return math.sqrt(total / len(values))


def db_of(value):
    return 20 * math.log10(value / FULL_SCALE) if value >= 1 else -140.0


mic = config.init_microphone()
raw = bytearray(SAMPLES * 4)
for _ in range(5):
    mic.readinto(raw)
    time.sleep_ms(50)

print("Capturing... make some noise now!")
time.sleep(1)
ac = capture(mic, raw)
mic.deinit()

peak = max(abs(v) for v in ac)
rms = rms_of(ac)

# --- 1. headroom -----------------------------------------------------------
print()
print("=== 1. Headroom ===")
print("full scale : %d  (2^%d)" % (FULL_SCALE, BITS - 1))
print("your peak  : %d" % peak)
print("peak level : %.1f dBFS" % db_of(peak))
print("rms level  : %.1f dBFS" % db_of(rms))
print("headroom   : %.1f dB before clipping" % (-db_of(peak)))
print()
print("Theoretical dynamic range of %d bits: %.0f dB" % (BITS, 6.02 * BITS))
print("(each extra bit doubles the range -- worth about 6 dB)")

# --- 2. bit depth ----------------------------------------------------------
# Masking off low bits is exactly what a cheaper converter would do.
print()
print("=== 2. What happens when you throw away bits ===")
print("%6s %14s %14s" % ("bits", "step size", "quant. noise dB"))
for bits in (24, 16, 12, 8, 6, 4):
    drop = BITS - bits
    step = 1 << drop
    if drop == 0:
        quantized = ac
    else:
        # Integer divide then multiply back: this is rounding to a coarser grid.
        quantized = [(int(v) >> drop) << drop for v in ac]
    error = [q - v for q, v in zip(quantized, ac)]
    noise = rms_of(error) if any(error) else 0.0
    print("%6d %14d %14.1f" % (bits, step, db_of(noise) if noise else -140))

print()
print("Fewer bits = a coarser grid = more error = a louder noise floor.")
print("Quiet sounds fall below that floor and simply vanish.")

# --- 3. clipping -----------------------------------------------------------
print()
print("=== 3. Turning it up too far ===")
print("%8s %10s %12s" % ("gain", "clipped", "peak"))
for gain in (1, 4, 16, 64, 256, 1024):
    loud = []
    clipped = 0
    for v in ac:
        x = v * gain
        if x > FULL_SCALE:
            x = FULL_SCALE
            clipped += 1
        elif x < -FULL_SCALE:
            x = -FULL_SCALE
            clipped += 1
        loud.append(x)
    pct = 100.0 * clipped / len(loud)
    print("%8d %9.1f%% %12.0f" % (gain, pct, max(abs(v) for v in loud)))

print()
print("Once samples hit the wall they all read the SAME value, so the peaks")
print("of the wave flatten into plateaus. That squared-off shape contains")
print("frequencies the room never produced -- you will see them appear as")
print("extra spikes once we have an FFT in Lab 21.")
