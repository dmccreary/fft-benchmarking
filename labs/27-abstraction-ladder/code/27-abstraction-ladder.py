# Lab 27: The Abstraction Ladder
#
# Same algorithm. Same operations. Same answer. Five different ways of
# telling the machine to do it -- and a speed range of over 150x.
#
#   pure Python  -> every operation interpreted, every value a boxed object
#   @native      -> compiled to machine code, values still boxed objects
#   @viper       -> compiled AND using raw machine types (integers only)
#   assembly     -> you choose the instructions
#   C            -> discussed, not run (see the lab notes)
#
# This lab measures the cost of abstraction. It is not an argument for
# writing everything in assembly -- it is an argument for knowing what each
# layer costs so you can spend it deliberately.

import gc
import machine
import math
import micropython
import fft_asm
from fftlab import FFT

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1
FREQ = machine.freq()


def rd():
    return machine.mem32[0xE0001004]


N = 512
signal = [math.sin(2 * math.pi * 40 * i / N) for i in range(N)]


# =========================================================================
# A single butterfly-like inner loop, written four ways.
# We use a simple weighted sum so viper's integer types can play fairly.
# =========================================================================
def sum_python(data, n):
    total = 0
    for i in range(n):
        total += data[i] * 3
    return total


@micropython.native
def sum_native(data, n):
    total = 0
    for i in range(n):
        total += data[i] * 3
    return total


@micropython.viper
def sum_viper(data, n: int) -> int:
    total = 0
    for i in range(n):
        total += int(data[i]) * 3
    return total


@micropython.asm_thumb
def sum_asm(r0, r1):
    # r0 = address of an array('i'), r1 = count
    mov(r2, 0)                  # total
    mov(r3, 0)                  # index
    label(LOOP)
    lsl(r4, r3, 2)              # index * 4 bytes
    add(r4, r0, r4)
    ldr(r5, [r4, 0])            # load data[i]
    mov(r6, 3)
    mul(r5, r6)                 # * 3
    add(r2, r2, r5)             # accumulate
    add(r3, 1)
    cmp(r3, r1)
    blt(LOOP)
    mov(r0, r2)                 # return total


from array import array
from uctypes import addressof

COUNT = 2000
data_list = [i for i in range(COUNT)]
data_arr = array("i", data_list)

print("=== The same loop, four ways ===")
print("Summing %d integers, each multiplied by 3." % COUNT)
print()


def timeit(fn, *args):
    fn(*args)                                   # warm-up
    best = None
    for _ in range(5):
        s = rd()
        r = fn(*args)
        c = (rd() - s) & 0xFFFFFFFF
        if best is None or c < best:
            best = c
    return best, r


results = []
c, r = timeit(sum_python, data_list, COUNT)
results.append(("pure Python", c, r))
c, r = timeit(sum_native, data_list, COUNT)
results.append(("@native", c, r))
c, r = timeit(sum_viper, data_arr, COUNT)
results.append(("@viper", c, r))
c, r = timeit(sum_asm, addressof(data_arr), COUNT)
results.append(("assembly", c, r))

base = results[0][1]
print("%-14s %12s %10s %14s" % ("version", "cycles", "speedup", "result"))
for label, cycles, value in results:
    print("%-14s %12d %9.1fx %14d" % (label, cycles, base / cycles, value))

print()
print("All four produce the same number, so this is a fair race.")


# =========================================================================
# The same ladder, on the real FFT
# =========================================================================
print()
print("=== The real thing: a 512-point FFT ===")
print()

py = FFT(N)
asm = fft_asm.FFT(N)

pre, pim = py.buffers()
are, aim = asm.make_buffers()


def load(re, im):
    for i in range(N):
        re[i] = signal[i]
        im[i] = 0.0


def time_py():
    load(pre, pim)
    s = rd()
    py.run(pre, pim)
    return (rd() - s) & 0xFFFFFFFF


def time_asm():
    load(are, aim)
    s = rd()
    asm.run(are, aim)
    return (rd() - s) & 0xFFFFFFFF


time_py()
py_best = min(time_py() for _ in range(3))
time_asm()
asm_best = min(time_asm() for _ in range(10))

print("%-16s %14s %12s %10s" % ("implementation", "cycles", "microseconds", "speedup"))
print("%-16s %14d %12.1f %9.1fx"
      % ("pure Python", py_best, py_best * 1e6 / FREQ, 1.0))
print("%-16s %14d %12.1f %9.1fx"
      % ("assembly", asm_best, asm_best * 1e6 / FREQ, py_best / asm_best))

budget_us = N / 12800 * 1e6
print()
print("real-time budget for %d samples: %.0f us" % (N, budget_us))
print("  pure Python uses %.0f%% of it" % (py_best * 1e6 / FREQ / budget_us * 100))
print("  assembly uses    %.1f%% of it" % (asm_best * 1e6 / FREQ / budget_us * 100))


# =========================================================================
# Why viper does not save the FFT
# =========================================================================
print()
print("=== Why not just put @viper on the FFT? ===")
print()
print("Viper's speed comes from using raw machine types instead of Python")
print("objects. But its native types are INTEGER types -- it has ptr8,")
print("ptr16 and ptr32, and no float pointer at all.")
print()
print("An FFT is float arithmetic on float arrays. Viper can type the loop")
print("counters, but every multiply and every array element still goes")
print("through the object layer. You get a little back, not a lot.")
print()
print("Viper is excellent for integer and bit work. This is not that.")
print("It is worth knowing WHICH tool fits, not just which is fastest.")


# =========================================================================
# Where C fits
# =========================================================================
print()
print("=== And what about C? ===")
print()
print("C sits between viper and assembly: real machine types, real float")
print("hardware, and a compiler that optimises for you. For an FFT it lands")
print("close to hand-written assembly -- often within a few percent.")
print()
print("We do not use it in this course, for one practical reason: C on the")
print("Pico needs a cross-compiler, CMake, and a firmware rebuild, while")
print("assembly runs from a plain .py file on stock MicroPython.")
print()
print("The honest summary for real work:")
print("  * MicroPython   -- write it here first. Clarity beats speed.")
print("  * C             -- when you need speed and portability.")
print("  * assembly      -- when you need the last 10%%, or the instruction")
print("                     you want has no C equivalent.")
print()
print("Almost nobody writes production FFTs in assembly. They use a library")
print("someone else wrote in assembly, once, and tested exhaustively.")
print("The skill that matters is READING it -- knowing what the machine is")
print("actually doing, so you can tell a good library from a bad one and")
print("know why the fast one is fast.")
