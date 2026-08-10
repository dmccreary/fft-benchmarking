# Lab 18: Bit Reversal and Twiddle Factors
#
# Lab 17 showed that splitting into evens and odds saves half the work, and
# that doing it repeatedly saves almost everything. But repeated splitting
# leaves the data in a strange order -- and we would rather not shuffle
# lists around at every level.
#
# It turns out the final order has a beautiful description: each index is
# the ORIGINAL index with its bits written backwards. So instead of
# splitting the data over and over, we reorder ONCE at the start and then
# work in place.
#
# The other half of this lab: stop calling sin() and cos() millions of times.
# There are only a few distinct angles. Compute them once, keep them in a
# table, look them up. That is a TWIDDLE FACTOR TABLE.

import config
import math
import time


# =========================================================================
# PART 1 -- where the strange order comes from
# =========================================================================
print("=== PART 1: what repeated splitting does to the order ===")
N = 8
order = list(range(N))
print("start                :", order)

level = 1
current = [order]
while len(current[0]) > 1:
    nxt = []
    for group in current:
        # MicroPython has no slice steps, so pick out evens and odds by hand
        nxt.append([group[i] for i in range(0, len(group), 2)])   # evens
        nxt.append([group[i] for i in range(1, len(group), 2)])   # odds
    current = nxt
    flat = [x for g in current for x in g]
    print("after split %d        : %s" % (level, flat))
    level += 1

final = [x for g in current for x in g]

# =========================================================================
# PART 2 -- that order IS bit reversal
# =========================================================================
print()
print("=== PART 2: the pattern ===")
bits = int(math.log(N, 2) + 0.5)
print("%6s %10s %12s %8s" % ("index", "binary", "reversed", "value"))
computed = []
for i in range(N):
    b = "".join(str((i >> (bits - 1 - p)) & 1) for p in range(bits))
    r = "".join(str((i >> p) & 1) for p in range(bits))   # same bits, backwards
    v = int(r, 2)
    computed.append(v)
    print("%6d %10s %12s %8d" % (i, b, r, v))

print()
print("split order    :", final)
print("bit-reversed   :", computed)
print("same?          :", final == computed)
print()
print("Write the index in binary, read it backwards, and you have the")
print("position it belongs in. No recursion, no list shuffling -- just a")
print("permutation we can do once, in place.")


# =========================================================================
# PART 3 -- doing the reorder in place
# =========================================================================
def bit_reverse_table(n):
    """Precompute where each element belongs."""
    bits = 0
    while (1 << bits) < n:
        bits += 1
    table = []
    for i in range(n):
        r = 0
        x = i
        for _ in range(bits):
            r = (r << 1) | (x & 1)
            x >>= 1
        table.append(r)
    return table


def bit_reverse_in_place(data, table):
    """Swap elements into bit-reversed order without copying the list."""
    swaps = 0
    for i in range(len(data)):
        j = table[i]
        if j > i:                      # only swap each pair once
            data[i], data[j] = data[j], data[i]
            swaps += 1
    return swaps


print()
print("=== PART 3: reordering in place ===")
data = list(range(N))
table = bit_reverse_table(N)
swaps = bit_reverse_in_place(data, table)
print("after in-place reorder:", data)
print("swaps performed       : %d (not %d -- half the entries stay put or" % (swaps, N))
print("                        pair up with one already moved)")

for n in (64, 512):
    t = bit_reverse_table(n)
    s = sum(1 for i in range(n) if t[i] > i)
    print("N=%4d needs %3d swaps for %4d elements (%.0f%%)" % (n, s, n, 100 * s / n))


# =========================================================================
# PART 4 -- twiddle factors, computed once
# =========================================================================
print()
print("=== PART 4: the twiddle factor table ===")
print()
print("A twiddle factor is a point on the unit circle:")
print("    W_N^k = cos(-2*pi*k/N) + i*sin(-2*pi*k/N)")
print()

n = 8
print("The %d twiddle factors for N=%d:" % (n // 2, n))
print("%4s %10s %10s %10s" % ("k", "angle", "cos", "sin"))
for k in range(n // 2):
    angle = -2 * math.pi * k / n
    print("%4d %10.4f %10.4f %10.4f" % (k, angle, math.cos(angle), math.sin(angle)))
print()
print("They march evenly around the circle -- these are the ROOTS OF UNITY.")
print("For an N-point FFT you need only N/2 of them, ever.")


def twiddle_table(n):
    """cos and sin for every twiddle we will need, computed once."""
    half = n // 2
    tw_re = [0.0] * half
    tw_im = [0.0] * half
    for k in range(half):
        angle = -2 * math.pi * k / n
        tw_re[k] = math.cos(angle)
        tw_im[k] = math.sin(angle)
    return tw_re, tw_im


# =========================================================================
# PART 5 -- how much does a lookup table buy?
# =========================================================================
print()
print("=== PART 5: table lookup vs recomputing ===")
n = 256
reps = 20

start = time.ticks_ms()
for _ in range(reps):
    for k in range(n // 2):
        angle = -2 * math.pi * k / n
        c = math.cos(angle)
        s = math.sin(angle)
compute_ms = time.ticks_diff(time.ticks_ms(), start)

tw_re, tw_im = twiddle_table(n)
start = time.ticks_ms()
for _ in range(reps):
    for k in range(n // 2):
        c = tw_re[k]
        s = tw_im[k]
lookup_ms = time.ticks_diff(time.ticks_ms(), start)

print("N = %d, %d passes over %d twiddles" % (n, reps, n // 2))
print("  recomputing sin/cos : %5d ms" % compute_ms)
print("  table lookup        : %5d ms" % lookup_ms)
if lookup_ms > 0:
    print("  speedup             : %.1fx" % (compute_ms / lookup_ms))
print()
print("Building the table costs one pass. After that every lookup is free.")
print("Move work OUT of the inner loop -- this is the single most reliable")
print("optimization there is, and it costs only memory.")
print()
print("Bonus: remember Lab 15's precision problem? Recomputing")
print("2*pi*k*t/N gave angles up to ~390 radians, which single-precision")
print("floats handle badly. A table only ever holds angles in one turn of")
print("the circle. Faster AND more accurate.")
