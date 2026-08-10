# Lab 25: How Long Did That Take?
#
# Lab 24 measured stages in microseconds and that was fine. But we are about
# to start shaving small percentages off an FFT, and ticks_us() cannot see
# differences that small.
#
# Hidden inside your Cortex-M33 is a counter that ticks once per CPU CLOCK.
# At 150 MHz that is one tick every 6.667 nanoseconds -- a thousand times
# finer than a microsecond. It lives in the DWT (Data Watchpoint and Trace)
# unit, and we can read it straight from MicroPython.

import machine
import time

# These addresses are fixed by ARM. Every Cortex-M33 has them here.
DEMCR = 0xE000EDFC          # Debug Exception and Monitor Control Register
DWT_CTRL = 0xE0001000       # DWT Control Register
DWT_CYCCNT = 0xE0001004     # the cycle counter itself

TRCENA = 1 << 24            # DEMCR bit 24: switch on the trace unit
CYCCNTENA = 1 << 0          # DWT_CTRL bit 0: switch on the counter


# =========================================================================
# PART 1 -- what ticks_us can and cannot see
# =========================================================================
print("=== PART 1: the limits of a microsecond timer ===")
print()
print("Timing something very short, ten times:")
for trial in range(10):
    t0 = time.ticks_us()
    x = 1 + 1                       # about as small as work gets
    t1 = time.ticks_us()
    print("  trial %d: %d us" % (trial, time.ticks_diff(t1, t0)))
print()
print("Mostly 1 or 2 microseconds -- and most of that is the cost of")
print("CALLING ticks_us twice, not the addition. At this scale the")
print("measurement is bigger than the thing being measured.")


# =========================================================================
# PART 2 -- switching on the cycle counter
# =========================================================================
print()
print("=== PART 2: turning on the DWT cycle counter ===")
print()
print("Two bits in two registers:")
print("  DEMCR    bit 24 (TRCENA)    -> enable the trace unit")
print("  DWT_CTRL bit 0  (CYCCNTENA) -> enable the cycle counter")
print()

print("DEMCR before : %s" % hex(machine.mem32[DEMCR]))
machine.mem32[DEMCR] = machine.mem32[DEMCR] | TRCENA
print("DEMCR after  : %s" % hex(machine.mem32[DEMCR]))

print("CTRL before  : %s" % hex(machine.mem32[DWT_CTRL]))
machine.mem32[DWT_CTRL] = machine.mem32[DWT_CTRL] | CYCCNTENA
print("CTRL after   : %s" % hex(machine.mem32[DWT_CTRL]))

print()
print("Read it twice in a row:")
a = machine.mem32[DWT_CYCCNT]
b = machine.mem32[DWT_CYCCNT]
print("  %d then %d  (moved by %d cycles)" % (a, b, b - a))
print()
print("It is counting. Those few cycles between the two reads are the cost")
print("of the reads themselves.")


# =========================================================================
# PART 3 -- VERIFY it, do not just trust it
# =========================================================================
print()
print("=== PART 3: verify before you trust ===")
print()
print("On some chips this counter only runs while a debugger is attached.")
print("A stalled counter reports 0 cycles for everything, which looks")
print("like infinitely fast code. Check it against a known delay.")
print()

t0 = time.ticks_us()
c0 = machine.mem32[DWT_CYCCNT]
time.sleep_ms(100)
c1 = machine.mem32[DWT_CYCCNT]
t1 = time.ticks_us()

cycles = (c1 - c0) & 0xFFFFFFFF
micros = time.ticks_diff(t1, t0)
mhz = cycles / micros

print("cycles counted over ~100 ms : %d" % cycles)
print("microseconds elapsed        : %d" % micros)
print("implied clock               : %.2f MHz" % mhz)
print("machine.freq() says         : %.2f MHz" % (machine.freq() / 1e6))
print()
if mhz < 1:
    print("COUNTER IS STALLED -- do not trust any timing below this line.")
else:
    print("Agrees with the real clock. The counter is trustworthy.")


# =========================================================================
# PART 4 -- now measure something small
# =========================================================================
print()
print("=== PART 4: measuring things ticks_us cannot see ===")
print()


import math


def read():
    return machine.mem32[DWT_CYCCNT]


REPS = 2000

# Measuring ONE operation is hopeless: a MicroPython function call costs
# thousands of cycles, which swamps the thing you wanted to measure. So we
# run each operation REPS times inside a single timed region, subtract the
# cost of an empty loop of the same length, and divide.
#
# This is the standard trick for measuring anything smaller than your
# measurement apparatus.

start = read()
for i in range(REPS):
    pass
empty = (read() - start) & 0xFFFFFFFF

results = []

start = read()
for i in range(REPS):
    x = 1 + 1
results.append(("integer add", (read() - start) & 0xFFFFFFFF))

start = read()
for i in range(REPS):
    x = 3.7 * 2.1
results.append(("float multiply", (read() - start) & 0xFFFFFFFF))

start = read()
for i in range(REPS):
    x = 3.7 / 2.1
results.append(("float divide", (read() - start) & 0xFFFFFFFF))

start = read()
for i in range(REPS):
    x = math.sqrt(2.0)
results.append(("math.sqrt", (read() - start) & 0xFFFFFFFF))

start = read()
for i in range(REPS):
    x = math.cos(1.0)
results.append(("math.cos", (read() - start) & 0xFFFFFFFF))

freq = machine.freq()
print("Each operation run %d times, empty loop subtracted." % REPS)
print("Empty loop costs %d cycles (%.1f per iteration).\n"
      % (empty, empty / REPS))
print("%-18s %14s %12s" % ("operation", "cycles each", "nanoseconds"))
for label, total in results:
    net = (total - empty) / REPS
    print("%-18s %14.1f %12.0f" % (label, net, net * 1e9 / freq))

print()
print("A float multiply is about %.0f cycles. The RP2350 hardware can do"
      % ((results[1][1] - empty) / REPS))
print("one in a single cycle -- so almost all of that is the interpreter")
print("fetching bytecode, boxing objects and checking types.")
print()
print("That gap is the entire subject of Modules 6 and 7.")


# =========================================================================
# PART 5 -- the 32-bit wrap
# =========================================================================
print()
print("=== PART 5: the counter wraps ===")
print()
print("CYCCNT is 32 bits, so it overflows every 2^32 cycles:")
print("  2^32 / %.0f MHz = %.1f seconds" % (freq / 1e6, 2**32 / freq))
print()
print("Subtracting with a 32-bit mask handles the wrap correctly:")
print("    elapsed = (end - start) & 0xFFFFFFFF")
print()
print("Without the mask a measurement that straddles the wrap comes out")
print("hugely negative. With it, anything shorter than %.1f seconds is fine."
      % (2**32 / freq))
