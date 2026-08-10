# Lab 22: Windowing and Spectral Leakage
#
# In Lab 21 a steady whistle sometimes made one clean spike and sometimes
# smeared across several bars. That was not the microphone being flaky. It
# is a real and unavoidable property of the DFT, and it has a fix.
#
# The cause: the DFT assumes your window of samples repeats forever. If the
# wave does not complete a whole number of cycles inside the window, the
# repeat has a JUMP in it -- and a jump contains lots of frequencies that
# were never in the original sound.
#
# The fix: fade the window in and out at the edges so there is no jump.
# That is a WINDOW FUNCTION.

import config
import math
from fftlab import FFT

N = 128
RATE = config.SAMPLE_RATE
BIN_HZ = RATE / N

fft = FFT(N)


def tone(freq, n=N):
    return [math.sin(2 * math.pi * freq * (i / RATE)) for i in range(n)]


def spectrum(signal, window=None):
    re, im = fft.buffers()
    for i in range(N):
        re[i] = signal[i] * (window[i] if window else 1.0)
        im[i] = 0.0
    fft.run(re, im)
    return fft.magnitudes(re, im)


def show(mags, label, lo=0, hi=20):
    peak = max(mags) or 1.0
    print()
    print("--- %s ---" % label)
    for k in range(lo, hi):
        bar = "#" * int(mags[k] / peak * 46)
        print("%4d %7.0f Hz %s" % (k, k * BIN_HZ, bar))


# =========================================================================
# PART 1 -- a tone that fits, and one that does not
# =========================================================================
print("=== PART 1: the problem ===")
print("bin width = %.0f Hz" % BIN_HZ)

on_bin = 8 * BIN_HZ                 # exactly bin 8
off_bin = 8.5 * BIN_HZ              # right between bins 8 and 9

show(spectrum(tone(on_bin)), "%.0f Hz -- lands exactly on bin 8" % on_bin, 4, 14)
show(spectrum(tone(off_bin)), "%.0f Hz -- falls BETWEEN bins" % off_bin, 4, 14)

print()
print("The first is one clean spike. The second smears across many bins.")
print("Same purity of tone, same amplitude -- only the frequency changed.")

# =========================================================================
# PART 2 -- why: look at the edges
# =========================================================================
print()
print("=== PART 2: why it happens ===")
print()
print("The DFT assumes your window repeats forever. Check the seam:")
for label, f in (("on-bin  ", on_bin), ("off-bin ", off_bin)):
    s = tone(f)
    jump = abs(s[0] - s[N - 1])
    print("  %s first=%+.3f last=%+.3f  jump at the seam = %.3f"
          % (label, s[0], s[N - 1], jump))
print()
print("The on-bin tone joins up smoothly. The off-bin one has a step in it,")
print("and a step is a sharp edge -- full of frequencies that were never")
print("in the sound. That is SPECTRAL LEAKAGE.")


# =========================================================================
# PART 3 -- window functions
# =========================================================================
def rectangular(n):
    return [1.0] * n


def hanning(n):
    return [0.5 - 0.5 * math.cos(2 * math.pi * i / (n - 1)) for i in range(n)]


def hamming(n):
    return [0.54 - 0.46 * math.cos(2 * math.pi * i / (n - 1)) for i in range(n)]


def blackman(n):
    return [0.42 - 0.5 * math.cos(2 * math.pi * i / (n - 1))
            + 0.08 * math.cos(4 * math.pi * i / (n - 1)) for i in range(n)]


print()
print("=== PART 3: the fix ===")
print()
print("A window fades the samples in and out, so the ends meet at zero and")
print("there is no seam. Here is the Hanning window's shape:")
w = hanning(32)
for i in range(0, 32, 2):
    print("  %2d %s" % (i, "*" * int(w[i] * 40)))

show(spectrum(tone(off_bin), hanning(N)),
     "%.0f Hz WITH a Hanning window" % off_bin, 4, 14)
print()
print("Still wider than a bin-exact peak -- windows cannot work miracles --")
print("but the smear is dramatically reduced.")

# =========================================================================
# PART 4 -- comparing windows
# =========================================================================
print()
print("=== PART 4: which window? ===")
print()
print("%-14s %10s %14s %12s" % ("window", "peak", "spread", "worst sidelobe"))

for name, fn in (("rectangular", rectangular), ("hanning", hanning),
                 ("hamming", hamming), ("blackman", blackman)):
    mags = spectrum(tone(off_bin), fn(N))
    peak = max(mags)

    # SPREAD: how many bins this one pure tone contaminates above 1% of its
    # own peak. This is the practically useful number -- it says how much of
    # your spectrum a single tone ruins.
    #
    # (Textbooks usually quote "main lobe width" measured to the first null.
    # That is a cleaner theoretical quantity but it is fragile to measure on
    # real data, where the tail has no crisp null. We measure the thing we
    # actually care about instead, and label it honestly.)
    wide = sum(1 for m in mags[:N // 2] if m > 0.01 * peak)

    # worst sidelobe: the largest value well away from the peak
    pk = mags.index(peak)
    side = 0.0
    for k in range(N // 2):
        if abs(k - pk) > 4 and mags[k] > side:
            side = mags[k]
    db = 20 * math.log10(side / peak) if side > 0 else -99

    print("%-14s %10.1f %10d bins %10.1f dB" % (name, peak, wide, db))

print()
print("Read that table as a TRADEOFF, not a ranking:")
print("  rectangular : biggest peak, but it contaminates the whole spectrum")
print("  hanning     : good all-round compromise")
print("  blackman    : cleanest spectrum, smallest peak")
print()
print("Low sidelobes  = spot a quiet tone sitting next to a loud one.")
print("Narrow lobe    = tell two CLOSE tones apart.")
print("Windows buy the first by giving up a little of the second, and they")
print("all cost you peak height. Choose based on what you are hunting.")

# =========================================================================
# PART 5 -- what a window costs you
# =========================================================================
print()
print("=== PART 5: windows lose amplitude ===")
clean = max(spectrum(tone(on_bin)))
for name, fn in (("rectangular", rectangular), ("hanning", hanning),
                 ("blackman", blackman)):
    p = max(spectrum(tone(on_bin), fn(N)))
    print("  %-12s peak %8.1f   (%.2f of unwindowed)" % (name, p, p / clean))
print()
print("A window multiplies most samples by less than 1, so the total energy")
print("drops. That factor is called COHERENT GAIN -- divide by it if you")
print("need true amplitudes rather than just a nice-looking picture.")
