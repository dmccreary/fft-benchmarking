# Lab 3: Know Your Board
#
# Ask the chip to describe itself. Some of these numbers come from Python,
# and some we read straight out of the CPU's own registers -- memory
# addresses the ARM designers guaranteed would hold specific facts.
#
# Write down the numbers this prints. You'll need them from Lab 16 onward,
# when we start caring about speed.

import gc
import machine
import os
import sys


def section(title):
    print()
    print("=== " + title + " ===")


section("Firmware")
print("MicroPython :", sys.version)
print("board       :", sys.implementation._machine)
print("platform    :", sys.platform)

section("Speed")
hz = machine.freq()
print("clock       : %d Hz  (%.0f MHz)" % (hz, hz / 1e6))
print("one cycle   : %.3f nanoseconds" % (1e9 / hz))

section("Memory")
gc.collect()                       # tidy up first, so the number is honest
free = gc.mem_free()
used = gc.mem_alloc()
print("RAM free    : %d bytes (%.1f KB)" % (free, free / 1024))
print("RAM used    : %d bytes" % used)
print("RAM total   : %.1f KB" % ((free + used) / 1024))

fs = os.statvfs("/")
total = fs[0] * fs[2]
avail = fs[0] * fs[3]
print("flash total : %.0f KB" % (total / 1024))
print("flash free  : %.0f KB" % (avail / 1024))

section("The CPU, straight from its own registers")
# 0xE000ED00 is the CPUID register. Every ARM Cortex-M chip has one, at
# this exact address, and it describes the core you're running on.
cpuid = machine.mem32[0xE000ED00]
implementer = (cpuid >> 24) & 0xFF
variant = (cpuid >> 20) & 0xF
partno = (cpuid >> 4) & 0xFFF
revision = cpuid & 0xF

print("CPUID raw   :", hex(cpuid))
print("made by     :", hex(implementer), "(0x41 means ARM)")
print("part number :", hex(partno), "(0xd21 means Cortex-M33)")
print("revision    : r%dp%d" % (variant, revision))

print("device ID   :", machine.unique_id().hex())

section("What this means for us")
print("A Cortex-M33 at %.0f MHz gives us %.1f million cycles per second." % (
    hz / 1e6, hz / 1e6))
print("A 512-point FFT has to finish inside 40 ms to keep up with audio.")
print("That is %d cycles of budget. Remember that number." % (hz * 0.040))
