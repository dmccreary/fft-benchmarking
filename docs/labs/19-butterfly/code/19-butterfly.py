# Lab 19: The Butterfly
#
# We have the pieces now:
#   Lab 17 -- split into evens and odds, recombine with a twiddle factor
#   Lab 18 -- reorder once by bit reversal, then work in place
#
# The recombination step is where all the arithmetic happens, and it has a
# name. Draw it and it looks like a butterfly's wings:
#
#        a ------+-------> a + W*b
#                 \     /
#                  \   /
#                   \ /
#                    X
#                   / \
#                  /   \
#                 /     \
#        b --[W]--+-------> a - W*b
#
# Two inputs, two outputs, ONE complex multiplication shared between them.
# That sharing is the whole reason the FFT is fast.

import config
import math

# =========================================================================
# PART 1 -- one butterfly, step by step
# =========================================================================
print("=== PART 1: a single butterfly ===")
print()

# Two complex numbers, a and b
ar, ai = 3.0, 1.0
br, bi = 2.0, -1.0
# A twiddle factor: a rotation of -45 degrees
angle = -math.pi / 4
wr, wi = math.cos(angle), math.sin(angle)

print("input a  = %+.3f %+.3fi" % (ar, ai))
print("input b  = %+.3f %+.3fi" % (br, bi))
print("twiddle W= %+.3f %+.3fi   (rotate by %.0f degrees)"
      % (wr, wi, math.degrees(angle)))
print()

# Step 1: multiply b by the twiddle factor.
# Complex multiply: (wr + wi*i)(br + bi*i)
#                 = wr*br - wi*bi  +  (wr*bi + wi*br)i
tr = wr * br - wi * bi
ti = wr * bi + wi * br
print("Step 1 -- W * b  (four real multiplies):")
print("   real = wr*br - wi*bi = %+.3f*%+.3f - %+.3f*%+.3f = %+.4f"
      % (wr, br, wi, bi, tr))
print("   imag = wr*bi + wi*br = %+.3f*%+.3f + %+.3f*%+.3f = %+.4f"
      % (wr, bi, wi, br, ti))
print()

# Step 2: add and subtract. Both outputs reuse the SAME product.
out1r, out1i = ar + tr, ai + ti
out2r, out2i = ar - tr, ai - ti
print("Step 2 -- combine (no more multiplying):")
print("   top    = a + W*b = %+.4f %+.4fi" % (out1r, out1i))
print("   bottom = a - W*b = %+.4f %+.4fi" % (out2r, out2i))
print()
print("Total cost: 4 real multiplies and 6 real adds, for TWO outputs.")

# =========================================================================
# PART 2 -- the butterfly as a function
# =========================================================================
print()
print("=== PART 2: as reusable code ===")


def butterfly(re, im, i1, i2, wr, wi):
    """One butterfly, performed in place on two positions of an array."""
    # W * x[i2]
    tr = wr * re[i2] - wi * im[i2]
    ti = wr * im[i2] + wi * re[i2]
    # cross add and subtract
    ar, ai = re[i1], im[i1]
    re[i1] = ar + tr
    im[i1] = ai + ti
    re[i2] = ar - tr
    im[i2] = ai - ti


re = [3.0, 2.0]
im = [1.0, -1.0]
butterfly(re, im, 0, 1, wr, wi)
print("same numbers through the function:")
print("   x[0] = %+.4f %+.4fi" % (re[0], im[0]))
print("   x[1] = %+.4f %+.4fi" % (re[1], im[1]))

# =========================================================================
# PART 3 -- how butterflies are arranged into stages
# =========================================================================
print()
print("=== PART 3: stages ===")
print()
N = 8
stages = int(math.log(N, 2) + 0.5)
print("For N=%d there are %d stages, each with %d butterflies."
      % (N, stages, N // 2))
print("Total: %d butterflies. Compare to %d operations for the direct DFT."
      % (stages * N // 2, N * N))
print()

half = 1
stage = 1
while half < N:
    span = half * 2
    print("Stage %d: pairs are %d apart, blocks of %d" % (stage, half, span))
    pairs = []
    for k in range(0, N, span):
        for j in range(half):
            pairs.append((k + j, k + j + half))
    print("         ", " ".join("(%d,%d)" % p for p in pairs))
    half *= 2
    stage += 1

print()
print("Stage 1 pairs neighbours. Each stage the reach doubles, until the")
print("last stage pairs elements half the array apart. Nine stages covers")
print("512 samples -- that is the log2(N) in N*log2(N).")

# =========================================================================
# PART 4 -- how many butterflies, really
# =========================================================================
print()
print("=== PART 4: counting the work ===")
print("%8s %8s %14s %16s %10s" % ("N", "stages", "butterflies", "direct DFT ops", "ratio"))
for n in (8, 64, 256, 512, 1024):
    st = int(math.log(n, 2) + 0.5)
    bf = st * n // 2
    print("%8d %8d %14d %16d %9.0fx" % (n, st, bf, n * n, (n * n) / bf))

print()
print("512 samples: 2304 butterflies instead of 262144 operations.")
print("Each butterfly is 4 multiplies -- so about 9216 multiplications")
print("where the DFT needed over half a million.")
