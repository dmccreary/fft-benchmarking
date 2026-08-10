# Lab 9: Sampling Rate and Aliasing
#
# This lab is designed to LIE TO YOU, and then explain why.
#
# Play a steady tone at the microphone and this program reports the frequency
# it thinks it hears. Start low and walk upward. Somewhere past half the
# sampling rate, the reported frequency stops rising and starts FALLING --
# even though the real tone keeps going up.
#
# That is aliasing. The reading is not noisy or approximate. It is confidently,
# precisely wrong.
#
# We measure frequency by counting zero crossings, because we have not built
# an FFT yet. A clean tone crosses zero exactly twice per cycle.

import config
import math
import struct
import time

SAMPLES = 512
FULL_SCALE = 8388608
NOISE_GATE = 20000        # ignore anything quieter than this (raw RMS)

# Try each of these. Nyquist -- the highest frequency each can represent --
# is half the sample rate.
RATES = [4000, 8000, 12800]


def capture(mic, raw):
    n = mic.readinto(raw)
    words = struct.unpack("<%di" % (n // 4), raw[:n])
    samples = [w >> 8 for w in words]
    dc = sum(samples) / len(samples)
    return [s - dc for s in samples]


def rms_of(ac):
    total = 0.0
    for v in ac:
        total += v * v
    return math.sqrt(total / len(ac))


def estimate_frequency(ac, rate):
    """Count zero crossings to estimate the dominant frequency.

    A sine wave crosses zero twice per cycle, so:
        cycles = crossings / 2
        frequency = cycles / duration
    """
    crossings = 0
    for i in range(1, len(ac)):
        # A crossing is a change of sign between consecutive samples.
        if (ac[i - 1] < 0) != (ac[i] < 0):
            crossings += 1
    duration = len(ac) / rate
    return (crossings / 2) / duration


def what_it_should_read(true_hz, rate):
    """What an ideal sampler reports for a tone at true_hz.

    Below Nyquist it reports the truth. Above it, the frequency FOLDS back
    down like light off a mirror.
    """
    nyq = rate / 2
    f = true_hz % rate
    return f if f <= nyq else rate - f


oled = config.init_display()

print("=== Aliasing demo ===")
print("Play a steady tone near the mic and slowly raise its pitch.")
print("A tone generator app or an online tone generator works well.")
print()
for rate in RATES:
    print("  at %5d Hz sampling, anything above %4d Hz will be a LIE"
          % (rate, rate // 2))
print()
print("Ctrl-C to stop.")
print()

try:
    while True:
        for rate in RATES:
            mic = config.init_microphone(rate=rate)
            raw = bytearray(SAMPLES * 4)
            for _ in range(3):                 # let the new rate settle
                mic.readinto(raw)
                time.sleep_ms(30)

            ac = capture(mic, raw)
            level = rms_of(ac)
            mic.deinit()

            if level < NOISE_GATE:
                reading = "-- too quiet --"
                hz = 0
            else:
                hz = estimate_frequency(ac, rate)
                reading = "%6.0f Hz" % hz

            nyq = rate // 2
            flag = "  <-- ABOVE NYQUIST!" if hz > nyq * 0.95 and hz > 0 else ""
            print("rate %5d Hz (Nyquist %4d) reads %s%s"
                  % (rate, nyq, reading, flag))

            oled.fill(config.BLACK)
            oled.text("Aliasing", 0, 0, config.WHITE)
            oled.hline(0, 10, config.WIDTH, config.WHITE)
            oled.text("rate  %5d" % rate, 0, 16, config.WHITE)
            oled.text("nyq   %5d" % nyq, 0, 28, config.WHITE)
            oled.text("reads %5d" % int(hz), 0, 40, config.WHITE)
            if hz > nyq * 0.95 and hz > 0:
                oled.text("SUSPECT!", 0, 52, config.WHITE)
            oled.show()
            time.sleep_ms(600)
        print()

except KeyboardInterrupt:
    oled.fill(config.BLACK)
    oled.text("Stopped.", 32, 28, config.WHITE)
    oled.show()
    print("Stopped.")
