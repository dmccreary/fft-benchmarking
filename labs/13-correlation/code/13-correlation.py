# Lab 13: Correlation -- Does My Signal Contain This Note?
#
# THIS IS THE BIG ONE. Everything else in this course is built on the idea in
# this file, so take your time with it.
#
# The question: given a signal, how do we find out whether a particular
# frequency is hiding inside it?
#
# The trick: multiply the signal by a test wave and add up the results.
#
#   - If they match, positive parts line up with positive parts and the sum
#     grows large.
#   - If they do not match, the products land randomly above and below zero
#     and cancel out to nearly nothing.
#
# That is it. That is the whole idea behind the Fourier transform.

import config
import math

RATE = config.SAMPLE_RATE      # 12800 Hz
N = 256
BIN = RATE / N                 # 50 Hz -- frequencies that fit whole cycles


def sine(freq, amp=1.0, phase=0.0, n=N):
    return [amp * math.sin(2 * math.pi * freq * (i / RATE) + phase)
            for i in range(n)]


def cosine(freq, amp=1.0, n=N):
    return [amp * math.cos(2 * math.pi * freq * (i / RATE)) for i in range(n)]


def correlate(signal, reference):
    """Multiply point by point, then add it all up. That is correlation."""
    total = 0.0
    for i in range(len(signal)):
        total += signal[i] * reference[i]
    return total / len(signal)     # divide by N so the scale is comparable


# =========================================================================
# PART 1 -- a mystery signal, and a guessing game
# =========================================================================
MYSTERY_FREQ = 6 * BIN          # 300 Hz. Pretend you do not know this.
mystery = sine(MYSTERY_FREQ)

print("=== PART 1: hunting for a hidden frequency ===")
print("A mystery signal is hiding one tone. Let's test some candidates.")
print()
print("%10s %14s" % ("candidate", "correlation"))
for k in range(1, 11):
    test_freq = k * BIN
    score = correlate(mystery, sine(test_freq))
    bar = "#" * int(abs(score) * 100)
    print("%8.0f Hz %14.4f  %s" % (test_freq, score, bar))

print()
print("One candidate scores far above the rest. That is the hidden tone:")
print("%.0f Hz." % MYSTERY_FREQ)

# =========================================================================
# PART 2 -- WHY it works: look inside the sum
# =========================================================================
print()
print("=== PART 2: why the sum grows or cancels ===")
print()
print("Sampling products from across the WHOLE window (not just the start --")
print("cancellation is something that happens over the full length).")
print()

step = N // 12

print("MATCHING (300 Hz signal x 300 Hz test):")
match = sine(MYSTERY_FREQ)
prods = [mystery[i] * match[i] for i in range(0, N, step)]
print("  ", " ".join("%+.2f" % p for p in prods))
neg = sum(1 for p in prods if p < 0)
print("   %d of %d are negative -- almost all pull the SAME way, so the"
      % (neg, len(prods)))
print("   total grows. (A squared sine is never negative.)")

print()
print("NOT MATCHING (300 Hz signal x 150 Hz test):")
wrong = sine(3 * BIN)
prods = [mystery[i] * wrong[i] for i in range(0, N, step)]
print("  ", " ".join("%+.2f" % p for p in prods))
neg = sum(1 for p in prods if p < 0)
print("   %d of %d are negative -- they fight each other, and the total"
      % (neg, len(prods)))
print("   collapses to zero.")

# =========================================================================
# PART 3 -- the trap: phase
# =========================================================================
print()
print("=== PART 3: the trap ===")
print("Same 300 Hz tone, but shifted a quarter cycle (a cosine now).")
shifted = sine(MYSTERY_FREQ, phase=math.pi / 2)
score = correlate(shifted, sine(MYSTERY_FREQ))
print()
print("correlation with a SINE test wave: %.6f" % score)
print()
print("Nearly zero! The tone is definitely there, but our detector says no.")
print("A sine test wave is blind to a signal that happens to be a cosine.")

# =========================================================================
# PART 4 -- the fix: test with sine AND cosine
# =========================================================================
print()
print("=== PART 4: the fix -- use two test waves ===")
print("Test with a sine AND a cosine, then combine them like the sides of a")
print("right triangle:   magnitude = sqrt(sine_score^2 + cosine_score^2)")
print()
print("%22s %10s %10s %12s" % ("signal", "sin", "cos", "magnitude"))

for label, sig in (("300 Hz sine", mystery),
                   ("300 Hz cosine", shifted),
                   ("300 Hz, phase 0.7", sine(MYSTERY_FREQ, phase=0.7)),
                   ("300 Hz, phase 2.5", sine(MYSTERY_FREQ, phase=2.5)),
                   ("150 Hz (wrong)", sine(3 * BIN))):
    s = correlate(sig, sine(MYSTERY_FREQ))
    c = correlate(sig, cosine(MYSTERY_FREQ))
    mag = math.sqrt(s * s + c * c)
    print("%22s %10.4f %10.4f %12.4f" % (label, s, c, mag))

print()
print("The sin and cos scores move around as the phase changes -- but the")
print("MAGNITUDE stays put. We now have a detector that answers")
print("'is this frequency present?' no matter when the wave started.")
print()
print("Next lab: run this test at EVERY frequency, and you have a spectrum.")
