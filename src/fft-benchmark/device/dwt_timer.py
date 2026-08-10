# Cycle-accurate timing using the Cortex-M33 DWT unit.
#
# The Data Watchpoint and Trace unit contains a free-running 32-bit cycle
# counter. At 150 MHz one cycle is 6.667 ns, which is far finer than
# time.ticks_us() and fine enough to time a single FFT call meaningfully.
#
# The registers live in the ARM private peripheral bus and are reachable from
# MicroPython with machine.mem32 -- the same technique 02-get-info.py uses to
# read CPUID. No C or custom firmware is needed.
#
# Verified on this board: the counter free-runs (it does NOT require an
# attached debugger) and ticks at a measured 149.87 MHz.

import machine
import time

DEMCR = 0xE000EDFC       # Debug Exception and Monitor Control Register
DWT_CTRL = 0xE0001000    # DWT Control Register
DWT_CYCCNT = 0xE0001004  # DWT Cycle Count Register

TRCENA = 1 << 24         # DEMCR bit: enable the trace subsystem
CYCCNTENA = 1 << 0       # DWT_CTRL bit: enable the cycle counter

MASK32 = 0xFFFFFFFF


def enable():
    """Turn on the cycle counter. Safe to call more than once."""
    machine.mem32[DEMCR] = machine.mem32[DEMCR] | TRCENA
    machine.mem32[DWT_CTRL] = machine.mem32[DWT_CTRL] | CYCCNTENA


def cycles():
    """Current raw cycle count."""
    return machine.mem32[DWT_CYCCNT] & MASK32


def reset():
    machine.mem32[DWT_CYCCNT] = 0


def elapsed(start, end):
    """Cycles between two reads, correct across the 32-bit wrap."""
    return (end - start) & MASK32


def verify(sleep_ms=100):
    """Confirm the counter is actually running and at what rate.

    Returns the measured clock in MHz. A result near machine.freq()/1e6 means
    DWT is trustworthy on this silicon; a result of 0 means the counter is
    stalled and no DWT timing below it should be believed.
    """
    enable()
    t0 = time.ticks_us()
    c0 = cycles()
    time.sleep_ms(sleep_ms)
    c1 = cycles()
    t1 = time.ticks_us()
    us = time.ticks_diff(t1, t0)
    cyc = elapsed(c0, c1)
    return (cyc / us) if us > 0 else 0.0


def to_us(cyc, freq_hz=None):
    """Convert a cycle count to microseconds."""
    if freq_hz is None:
        freq_hz = machine.freq()
    return cyc * 1000000.0 / freq_hz
