# Lab 12: Adding Waves -- Superposition and Beats
#
# Real sound is never one pure tone. A voice, a guitar string, a car engine --
# all of them are many sine waves stacked on top of each other, added together
# sample by sample.
#
# That is the whole reason the FFT matters. If sounds are SUMS of sine waves,
# then "what is in this sound?" becomes "which sine waves were added, and how
# much of each?" Answering that question is what we spend the next four labs
# learning to do.

import config
import math

RATE = config.SAMPLE_RATE
N = 64
BASE = RATE / N              # 200 Hz -- one cycle across the window


def sine(freq, amp=1.0, phase=0.0, n=N):
    return [amp * math.sin(2 * math.pi * freq * (i / RATE) + phase)
            for i in range(n)]


def add(*waves):
    """Superposition: at every instant, just add the values."""
    return [sum(w[i] for w in waves) for i in range(len(waves[0]))]


def plot(values, label, width=56):
    print()
    print("--- %s ---" % label)
    peak = max(abs(v) for v in values) or 1.0
    mid = width // 2
    for v in values:
        pos = int(mid + (v / peak) * (mid - 1))
        pos = max(0, min(width - 1, pos))
        line = [" "] * width
        line[mid] = "|"
        line[pos] = "*"
        print("".join(line))


# --- two tones an octave apart ---------------------------------------------
a = sine(BASE)                       # 200 Hz
b = sine(2 * BASE, amp=0.5)          # 400 Hz, half as loud
plot(add(a, b), "200 Hz + 400 Hz (an octave) -- still repeats once")

# --- adding odd harmonics builds a square wave ----------------------------
# This is additive synthesis. Every extra odd harmonic makes the corners
# sharper. A perfect square wave needs infinitely many.
square = add(sine(BASE),
             sine(3 * BASE, amp=1 / 3),
             sine(5 * BASE, amp=1 / 5),
             sine(7 * BASE, amp=1 / 7),
             sine(9 * BASE, amp=1 / 9))
plot(square, "200 + 600 + 1000 + 1400 + 1800 Hz -- becoming a SQUARE")

# --- interference ----------------------------------------------------------
print()
print("=== Interference: same frequency, different phase ===")
same = add(sine(BASE), sine(BASE))
opposite = add(sine(BASE), sine(BASE, phase=math.pi))
print("in phase  (0)  -> peak amplitude %.2f   CONSTRUCTIVE" %
      max(abs(v) for v in same))
print("anti-phase(pi) -> peak amplitude %.2f   DESTRUCTIVE" %
      max(abs(v) for v in opposite))
print("Two identical sounds can cancel to silence. That is how noise-")
print("cancelling headphones work.")

# --- beats -----------------------------------------------------------------
# Two frequencies that are CLOSE but not equal drift in and out of step.
# The wobble rate is the difference between them.
print()
print("=== Beats: two close tones ===")
f1, f2 = 200.0, 205.0
long_n = 2048
beat = [math.sin(2 * math.pi * f1 * (i / RATE)) +
        math.sin(2 * math.pi * f2 * (i / RATE)) for i in range(long_n)]

print("%.0f Hz + %.0f Hz -> you hear a wobble at %.0f Hz" % (f1, f2, abs(f2 - f1)))
print()
print("Envelope over %.0f ms (each row is the local peak):" %
      (long_n / RATE * 1000))
CHUNK = 64
width = 50
for start in range(0, long_n, CHUNK):
    chunk = beat[start:start + CHUNK]
    level = max(abs(v) for v in chunk)
    bar = int(level / 2.0 * width)
    print("  %5.1f ms |%s" % (start / RATE * 1000, "#" * bar))

print()
print("The envelope swells and fades %.0f times a second -- that is the beat." %
      abs(f2 - f1))
print("Piano tuners listen for exactly this, and tighten the string until")
print("the wobble stops.")
