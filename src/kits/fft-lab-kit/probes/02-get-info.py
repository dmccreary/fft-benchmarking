# Lab 02: Get Info
# Prints detailed Pico 2 (RP2350) system information over the serial
# console: firmware/build, CPU, RAM, flash/filesystem, and the math/array
# module support needed to plan and interpret FFT benchmark runs.

import sys
import os
import gc
import machine
import array


def section(title):
    print()
    print("=== " + title + " ===")


section("Firmware / Implementation")
print("implementation:", sys.implementation)
print("sys.version:", sys.version)
print("sys.platform:", sys.platform)
print("mpy version tag:", sys.implementation._mpy if hasattr(sys.implementation, "_mpy") else "n/a")

section("Board")
try:
    u = os.uname()
    print("sysname:", u.sysname)
    print("nodename:", u.nodename)
    print("release:", u.release)
    print("version:", u.version)
    print("machine:", u.machine)
except Exception as e:
    print("os.uname() failed:", e)

print("unique_id (hex):", machine.unique_id().hex())

section("CPU")
freq = machine.freq()
print("freq (Hz):", freq)
print("freq (MHz):", freq / 1000000)

section("CPU ID (Arm core identification)")
# CPUID base register, defined by the Arm architecture at a fixed address
# for every Cortex-M core: bits [31:24] implementer, [23:20] variant (r),
# [19:16] architecture constant, [15:4] part number, [3:0] revision (p).
cpuid = machine.mem32[0xE000ED00]
implementer = (cpuid >> 24) & 0xFF
variant = (cpuid >> 20) & 0xF
partno = (cpuid >> 4) & 0xFFF
revision = cpuid & 0xF
print("CPUID raw:", hex(cpuid))
print("implementer:", hex(implementer), "(0x41 = Arm)")
print("part number:", hex(partno), "(0xd21 = Cortex-M33)")
print("core revision: r%dp%d" % (variant, revision))
if implementer == 0x41 and partno == 0xD21 and variant == 1 and revision == 0:
    print("-> Arm Cortex-M33 r1p0, as used in the RP2350 (Pico 2)")
    print("   programming guide: arm-programming-guide/arm-cortex-m33-r1p0-generic-user-guide.pdf")

# MVFR0 reports which floating-point features are implemented; a nonzero
# value here confirms the hardware single-precision FPU is present.
mvfr0 = machine.mem32[0xE000EF40]
print("MVFR0 (FPU features):", hex(mvfr0))

section("Memory (RAM)")
gc.collect()
free = gc.mem_free()
alloc = gc.mem_alloc()
print("mem_free (bytes):", free)
print("mem_alloc (bytes):", alloc)
print("total seen by gc (bytes):", free + alloc)
print("total seen by gc (KB):", (free + alloc) / 1024)

section("Flash / Filesystem")
try:
    fs = os.statvfs("/")
    block_size = fs[0]
    total_blocks = fs[2]
    free_blocks = fs[3]
    total_bytes = block_size * total_blocks
    free_bytes = block_size * free_blocks
    print("block size (bytes):", block_size)
    print("total blocks:", total_blocks)
    print("filesystem total (bytes):", total_bytes)
    print("filesystem total (KB):", total_bytes / 1024)
    print("filesystem free (bytes):", free_bytes)
    print("filesystem free (KB):", free_bytes / 1024)
except Exception as e:
    print("os.statvfs('/') failed:", e)

section("Concurrency (for split/parallel FFT work)")
try:
    import _thread
    print("_thread: available (RP2350 has 2 usable cores)")
except ImportError as e:
    print("_thread: NOT available (", e, ")")

section("Math / FFT-related module availability")
for name in ("math", "cmath", "array", "ulab"):
    try:
        __import__(name)
        print(name, ": available")
    except ImportError as e:
        print(name, ": NOT available (", e, ")")

# ulab (if installed) is a numpy-like C library and usually ships its own
# FFT implementation, so check its submodules separately.
try:
    import ulab
    print("ulab version:", getattr(ulab, "__version__", "unknown"))
    try:
        from ulab import numpy as ulab_np
        print("ulab.numpy: available, has fft:", hasattr(ulab_np, "fft"))
    except ImportError as e:
        print("ulab.numpy: NOT available (", e, ")")
except ImportError:
    print("ulab not installed (pure-Python FFT will rely on math/cmath/array only)")

section("Array typecodes (for sample/twiddle-factor buffers)")
for tc in ("b", "B", "h", "H", "i", "I", "l", "L", "q", "Q", "f", "d"):
    try:
        a = array.array(tc, [0])
        # itemsize isn't exposed on this build; derive it from a
        # single-element array's raw byte length instead.
        itemsize = len(bytes(a))
        print(tc, ": ok, itemsize =", itemsize)
    except Exception as e:
        print(tc, ": NOT supported (", e, ")")

section("Float behavior")
import math
print("math.pi:", math.pi)
print("repr(1/3):", repr(1 / 3))
print("1.0 + 1e-16 == 1.0 ->", (1.0 + 1e-16) == 1.0)

section("Done")
print("Info collection complete.")
