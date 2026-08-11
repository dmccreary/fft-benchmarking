# Lab 30: Talking to the FPU
#
# Lab 29 used the core registers r0-r7, which hold integers. The Cortex-M33
# has a SECOND set of registers -- s0 to s31 -- that hold single-precision
# floats, and a matching set of instructions that operate on them.
#
# These are the instructions that make a fast FFT possible. The hardware
# multiplies two floats in one cycle. MicroPython takes about a thousand.

import machine
import micropython
import math
from array import array
from uctypes import addressof

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1


def rd():
    return machine.mem32[0xE0001004]


# =========================================================================
# PART 1 -- load, add, store
# =========================================================================
print("=== PART 1: your first float instructions ===")
print()
print("Float registers are s0-s31. They are SEPARATE from r0-r7 -- you")
print("cannot add an s register to an r register.")
print()
print("  vldr(s0, [r0, 0])   load a float from memory into s0")
print("  vstr(s0, [r0, 0])   store s0 back to memory")
print("  vadd(s2, s0, s1)    s2 = s0 + s1")
print()
print("Note the addresses still come from CORE registers. The r registers")
print("say WHERE; the s registers hold WHAT.")
print()


@micropython.asm_thumb
def float_add(r0):
    # r0 = address of array('f', [a, b, result])
    vldr(s0, [r0, 0])           # s0 = buf[0]
    vldr(s1, [r0, 4])           # s1 = buf[1]   (4 bytes per float)
    vadd(s2, s0, s1)
    vstr(s2, [r0, 8])           # buf[2] = s0 + s1


buf = array("f", [3.5, 1.25, 0.0])
float_add(addressof(buf))
print("3.5 + 1.25 =", buf[2])


# =========================================================================
# PART 2 -- the four arithmetic instructions
# =========================================================================
print()
print("=== PART 2: arithmetic ===")


@micropython.asm_thumb
def float_ops(r0):
    # buf = [a, b, add, sub, mul, neg]
    vldr(s0, [r0, 0])
    vldr(s1, [r0, 4])
    vadd(s2, s0, s1)
    vstr(s2, [r0, 8])
    vsub(s2, s0, s1)
    vstr(s2, [r0, 12])
    vmul(s2, s0, s1)
    vstr(s2, [r0, 16])
    vneg(s2, s0)
    vstr(s2, [r0, 20])


buf = array("f", [6.0, 2.5, 0, 0, 0, 0])
float_ops(addressof(buf))
print("a = %.2f, b = %.2f" % (buf[0], buf[1]))
print("  a + b  = %8.3f" % buf[2])
print("  a - b  = %8.3f" % buf[3])
print("  a * b  = %8.3f" % buf[4])
print("  -a     = %8.3f" % buf[5])


# =========================================================================
# PART 3 -- a loop over an array of floats
# =========================================================================
print()
print("=== PART 3: scaling an array ===")
print()


@micropython.asm_thumb
def scale_array(r0, r1, r2):
    # r0 = address of float array
    # r1 = number of elements
    # r2 = address of a float holding the scale factor
    vldr(s1, [r2, 0])           # the multiplier, loaded once
    mov(r3, 0)                  # index

    label(SCALE_LOOP)
    lsl(r4, r3, 2)              # index * 4 bytes
    add(r4, r0, r4)
    vldr(s0, [r4, 0])
    vmul(s0, s0, s1)
    vstr(s0, [r4, 0])
    add(r3, 1)
    cmp(r3, r1)
    blt(SCALE_LOOP)


data = array("f", [1.0, 2.0, 3.0, 4.0, 5.0])
factor = array("f", [2.5])
print("before:", [round(v, 2) for v in data])
scale_array(addressof(data), len(data), addressof(factor))
print("after :", [round(v, 2) for v in data])
print()
print("The multiplier is loaded ONCE, outside the loop. Hoisting work out")
print("of the inner loop is the same idea as Lab 18's twiddle table.")


# =========================================================================
# PART 4 -- how much faster?
# =========================================================================
print()
print("=== PART 4: the payoff ===")

COUNT = 2000
pdata = [float(i) for i in range(COUNT)]
adata = array("f", pdata)
mult = array("f", [1.0001])


def scale_python(a, n, f):
    for i in range(n):
        a[i] = a[i] * f


def timeit(fn, *args):
    fn(*args)
    best = None
    for _ in range(5):
        s = rd()
        fn(*args)
        c = (rd() - s) & 0xFFFFFFFF
        if best is None or c < best:
            best = c
    return best


py_c = timeit(scale_python, pdata, COUNT, 1.0001)
asm_c = timeit(scale_array, addressof(adata), COUNT, addressof(mult))

freq = machine.freq()
print()
print("scaling %d floats:" % COUNT)
print("  Python   : %8d cycles  (%6.1f per element)" % (py_c, py_c / COUNT))
print("  assembly : %8d cycles  (%6.1f per element)" % (asm_c, asm_c / COUNT))
print("  speedup  : %.0fx" % (py_c / asm_c))
print()
print("About %.0f cycles per element in assembly -- a load, a multiply, a"
      % (asm_c / COUNT))
print("store, and the loop overhead. Compare Lab 25: MicroPython needed")
print("~1097 cycles for the multiply ALONE.")


# =========================================================================
# PART 5 -- the rules that keep you out of trouble
# =========================================================================
print()
print("=== PART 5: rules for float assembly ===")
print()
print("1. r registers hold ADDRESSES and counters. s registers hold DATA.")
print("   You cannot mix them without vmov.")
print()
print("2. Every float is 4 bytes, so element i lives at offset i*4.")
print("   'lsl(rd, ri, 2)' is how you multiply an index by 4.")
print()
print("3. array('f') gives you real float32 storage. addressof() gives you")
print("   its address. A Python list will NOT work -- it is a list of")
print("   pointers to objects, not a block of floats.")
print()
print("4. Load loop-invariant values ONCE, before the loop.")
print()
print("5. Allocate nothing inside a timed region. Assembly cannot allocate")
print("   anyway, which is part of why it is predictable.")
print()
print("That is everything you need for the butterfly. Next lab.")
