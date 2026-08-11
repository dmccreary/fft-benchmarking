# Lab 31: The Butterfly in Assembly, and a Complete FFT
#
# Everything converges here.
#
#   Lab 19  the butterfly: 4 multiplies, 6 adds, two outputs
#   Lab 29  registers, loops, memory
#   Lab 30  the float instructions
#
# Put them together and you have an FFT that runs 157x faster than the
# Python one you wrote in Lab 20 -- computing exactly the same numbers.

import machine
import micropython
import math
from array import array
from uctypes import addressof

import fft_asm                    # the finished implementation
from fftlab import FFT            # your Lab 20 Python FFT, for comparison

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1
FREQ = machine.freq()


def rd():
    return machine.mem32[0xE0001004]


# =========================================================================
# PART 1 -- one butterfly, in assembly
# =========================================================================
print("=== PART 1: a single butterfly ===")
print()
print("Recall from Lab 19:")
print("    tr = wr*xr - wi*xi")
print("    ti = wr*xi + wi*xr")
print("    out1 = a + t      out2 = a - t")
print()


@micropython.asm_thumb
def one_butterfly(r0):
    # r0 -> array('f', [ar, ai, xr, xi, wr, wi, o1r, o1i, o2r, o2i])
    vldr(s2, [r0, 0])       # ar
    vldr(s3, [r0, 4])       # ai
    vldr(s4, [r0, 8])       # xr
    vldr(s5, [r0, 12])      # xi
    vldr(s0, [r0, 16])      # wr
    vldr(s1, [r0, 20])      # wi

    # tr = wr*xr - wi*xi
    vmul(s6, s0, s4)
    vmul(s9, s1, s5)
    vsub(s6, s6, s9)

    # ti = wr*xi + wi*xr
    vmul(s7, s0, s5)
    vmul(s8, s1, s4)
    vadd(s7, s7, s8)

    # cross add and subtract
    vadd(s8, s2, s6)        # out1 real
    vadd(s9, s3, s7)        # out1 imag
    vstr(s8, [r0, 24])
    vstr(s9, [r0, 28])
    vsub(s8, s2, s6)        # out2 real
    vsub(s9, s3, s7)        # out2 imag
    vstr(s8, [r0, 32])
    vstr(s9, [r0, 36])


angle = -math.pi / 4
b = array("f", [3.0, 1.0, 2.0, -1.0,
                math.cos(angle), math.sin(angle),
                0, 0, 0, 0])
one_butterfly(addressof(b))

# Same thing in Python, to check.
ar, ai, xr, xi, wr, wi = b[0], b[1], b[2], b[3], b[4], b[5]
tr = wr * xr - wi * xi
ti = wr * xi + wi * xr

print("assembly : out1 = %+.4f %+.4fi   out2 = %+.4f %+.4fi"
      % (b[6], b[7], b[8], b[9]))
print("python   : out1 = %+.4f %+.4fi   out2 = %+.4f %+.4fi"
      % (ar + tr, ai + ti, ar - tr, ai - ti))
print()
print("Nineteen instructions. That is the whole engine of the FFT.")


# =========================================================================
# PART 2 -- how the full routine is structured
# =========================================================================
print()
print("=== PART 2: from one butterfly to 2304 ===")
print()
print("A 512-point FFT needs 9 stages of 256 butterflies. Doing all of that")
print("in one assembly function would need more registers than exist, so")
print("the work is SPLIT:")
print()
print("  Python  drives the 9-iteration stage loop   (9 calls, negligible)")
print("  assembly does every butterfly in a stage    (2304 total)")
print()
print("Almost all the arithmetic is in assembly; almost none of the")
print("bookkeeping is. That division is the practical answer to 'how much")
print("should I write in assembly?' -- the hot loop, and nothing else.")
print()
print("The routine takes four arguments, all pointers:")
print("    fft_stage_asm(real_addr, imag_addr, twiddle_addr, params_addr)")
print()
print("asm_thumb allows at most 4 arguments, so per-stage constants travel")
print("in a small array('i') the routine reads on entry.")


# =========================================================================
# PART 3 -- does it agree with your Python FFT?
# =========================================================================
print()
print("=== PART 3: correctness first ===")
print()

N = 512
asm = fft_asm.FFT(N)
py = FFT(N)

signal = [0.7 * math.sin(2 * math.pi * 40 * i / N)
          + 0.3 * math.sin(2 * math.pi * 111 * i / N) for i in range(N)]

are, aim = asm.make_buffers()
pre, pim = py.buffers()
for i in range(N):
    are[i] = signal[i]
    aim[i] = 0.0
    pre[i] = signal[i]
    pim[i] = 0.0

asm.run(are, aim)
py.run(pre, pim)

worst = 0.0
for i in range(N):
    d = max(abs(are[i] - pre[i]), abs(aim[i] - pim[i]))
    if d > worst:
        worst = d

print("largest difference between assembly and Python: %.3e" % worst)
if worst == 0.0:
    print()
    print("EXACTLY ZERO -- bit for bit identical.")
    print()
    print("That is stronger than 'within tolerance'. Both versions perform")
    print("the same float32 operations in the same order, so they round")
    print("identically. Any difference at all would mean the assembly does")
    print("something subtly different from what you think it does.")
else:
    print("Close, but not identical -- worth investigating why.")


# =========================================================================
# PART 4 -- the speedup
# =========================================================================
print()
print("=== PART 4: how fast? ===")
print()


def load(re, im):
    for i in range(N):
        re[i] = signal[i]
        im[i] = 0.0


def time_asm():
    load(are, aim)
    s = rd()
    asm.run(are, aim)
    return (rd() - s) & 0xFFFFFFFF


def time_py():
    load(pre, pim)
    s = rd()
    py.run(pre, pim)
    return (rd() - s) & 0xFFFFFFFF


time_asm()
asm_best = min(time_asm() for _ in range(15))
time_py()
py_best = min(time_py() for _ in range(3))

budget_us = N / 12800 * 1e6
asm_us = asm_best * 1e6 / FREQ
py_us = py_best * 1e6 / FREQ

print("%-18s %12s %12s" % ("", "cycles", "microseconds"))
print("%-18s %12d %12.1f" % ("Python (Lab 20)", py_best, py_us))
print("%-18s %12d %12.1f" % ("assembly", asm_best, asm_us))
print()
print("speedup : %.0fx" % (py_best / asm_best))
print()
print("cycles per butterfly: %.1f" % (asm_best / 2304))
print()
print("=== The whole journey ===")
print("%-24s %12s %10s" % ("implementation", "time (ms)", "vs budget"))
print("%-24s %12.0f %9.0fx" % ("Lab 16 brute-force DFT", 21196, 21196 / 40))
print("%-24s %12.1f %9.1fx" % ("Lab 20 Python FFT", py_us / 1000, py_us / 1000 / 40))
print("%-24s %12.2f %9.1f%%" % ("Lab 31 assembly FFT", asm_us / 1000,
                                asm_us / 1000 / 40 * 100))
print()
print("From 530x over budget to using %.1f%% of it." % (asm_us / 1000 / 40 * 100))
print("Real-time audio analysis, on a $5 chip, with room to spare.")
