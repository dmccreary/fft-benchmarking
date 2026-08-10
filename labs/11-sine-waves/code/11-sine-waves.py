# Lab 11: Sine Waves -- Amplitude, Frequency, Phase
#
# No microphone this time. We MAKE the signal, so we know exactly what is in
# it. That matters more than it sounds: for the next five labs we are building
# tools, and you can only trust a tool you have tested on a known answer.
#
# A sine wave needs exactly three numbers:
#
#     value = amplitude * sin(2*pi*frequency*t + phase)
#              ^^^^^^^^^        ^^^^^^^^^        ^^^^^
#              how tall         how fast         where it starts

import config
import math

SAMPLE_RATE = config.SAMPLE_RATE      # 12800 Hz
N = 64                                # small enough to print


def make_sine(freq, amplitude=1.0, phase=0.0, n=N, rate=SAMPLE_RATE):
    """Generate n samples of a sine wave."""
    out = []
    for i in range(n):
        t = i / rate                  # sample index -> seconds
        out.append(amplitude * math.sin(2 * math.pi * freq * t + phase))
    return out


def plot(values, label, width=56):
    """Draw a waveform sideways in the console."""
    print()
    print("--- %s ---" % label)
    mid = width // 2
    for v in values:
        pos = int(mid + v * (mid - 1))
        pos = max(0, min(width - 1, pos))
        line = [" "] * width
        line[mid] = "|"
        line[pos] = "*"
        print("".join(line))


print("Sample rate: %d Hz" % SAMPLE_RATE)
print("Samples    : %d  (%.2f ms of signal)" % (N, N / SAMPLE_RATE * 1000))
print()

# --- frequency: how many cycles fit in the window -------------------------
# One full cycle across N samples means freq = rate / N.
one_cycle = SAMPLE_RATE / N
print("One cycle across %d samples = %.1f Hz" % (N, one_cycle))
print("Two cycles                  = %.1f Hz" % (2 * one_cycle))

plot(make_sine(one_cycle), "%.0f Hz -- exactly ONE cycle" % one_cycle)
plot(make_sine(2 * one_cycle), "%.0f Hz -- TWO cycles" % (2 * one_cycle))

# --- amplitude: how tall ---------------------------------------------------
plot(make_sine(one_cycle, amplitude=0.3), "same frequency, amplitude 0.3")

# --- phase: where it starts ------------------------------------------------
# A quarter turn (pi/2) converts a sine into a cosine. Same wave, shifted.
plot(make_sine(one_cycle, phase=math.pi / 2),
     "same frequency, phase shifted by pi/2 (a cosine)")

# --- the numbers behind the picture ---------------------------------------
print()
print("=== The first 8 samples of a %.0f Hz wave ===" % one_cycle)
s = make_sine(one_cycle)
for i in range(8):
    t = i / SAMPLE_RATE
    angle = 2 * math.pi * one_cycle * t
    print("  i=%d  t=%.6f s  angle=%.3f rad  sin=%+.4f" % (i, t, angle, s[i]))

print()
print("=== Why radians? ===")
print("A full circle is 2*pi = %.4f radians." % (2 * math.pi))
print("sin() repeats every 2*pi, which is exactly one cycle of the wave.")
print("Degrees would work too -- radians just make the formula tidier.")

print()
print("Period of a %.0f Hz wave = 1/%.0f = %.4f ms" %
      (one_cycle, one_cycle, 1000 / one_cycle))
print("At %d Hz sampling that is %.0f samples per cycle." %
      (SAMPLE_RATE, SAMPLE_RATE / one_cycle))
