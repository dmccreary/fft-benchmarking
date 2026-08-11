# Lab 33: Beyond the Assembler -- Hand-Encoding an Instruction
#
# Your Cortex-M33 implements VFMA.F32 -- fused multiply-add. It computes
# a = a + b*c as a SINGLE instruction with a single rounding.
#
# MicroPython's assembler refuses to write it:
#
#     >>> vfma(s0, s1, s2)
#     unsupported Thumb instruction 'vfma' with 3 arguments
#
# The silicon can do it. The toolchain cannot express it. That gap is the
# subject of this lab, and the point is bigger than one instruction:
#
#     THE ASSEMBLER IS NOT THE INSTRUCTION SET.
#
# So we look up the encoding in the ARM manual, build the machine word
# ourselves, and emit it as raw data.

import machine
import micropython
from array import array
from uctypes import addressof

machine.mem32[0xE000EDFC] = machine.mem32[0xE000EDFC] | (1 << 24)
machine.mem32[0xE0001000] = machine.mem32[0xE0001000] | 1


def rd():
    return machine.mem32[0xE0001004]


# =========================================================================
# PART 1 -- confirm the assembler really refuses
# =========================================================================
print("=== PART 1: the assembler says no ===")
try:
    exec("@micropython.asm_thumb\ndef _f():\n    vfma(s0, s1, s2)\n",
         {"micropython": micropython})
    print("vfma assembled -- your MicroPython supports it directly!")
except Exception as e:
    print("vfma(s0, s1, s2) ->", e)
print()
print("The instruction exists in the chip. Only the assembler is missing.")


# =========================================================================
# PART 2 -- read the encoding out of the manual
# =========================================================================
print()
print("=== PART 2: building the instruction by hand ===")
print()
print("From the VFP data-processing format (ARM Cortex-M33 user guide,")
print("section 3.12), VFMA.F32 <Sd>, <Sn>, <Sm> has base word 0xEEA00A00.")
print()
print("Single-precision registers are SPLIT across two fields each:")
print("    Sd -> Vd = Sd>>1 at bits 15:12,   D = Sd&1 at bit 22")
print("    Sn -> Vn = Sn>>1 at bits 19:16,   N = Sn&1 at bit 7")
print("    Sm -> Vm = Sm>>1 at bits  3:0,    M = Sm&1 at bit 5")
print()


def encode_vfma(sd, sn, sm, subtract=False):
    """Return the two Thumb-2 halfwords for VFMA/VFMS.F32 sd, sn, sm."""
    word = 0xEEA00A00
    if subtract:
        word |= 1 << 6                      # VFMS is VFMA with the op bit set
    word |= (sd >> 1) << 12
    word |= (sd & 1) << 22
    word |= (sn >> 1) << 16
    word |= (sn & 1) << 7
    word |= (sm >> 1)
    word |= (sm & 1) << 5
    return (word >> 16) & 0xFFFF, word & 0xFFFF


print("Worked example -- VFMA.F32 s0, s1, s2  (s0 += s1*s2):")
print("    Sd=0 -> Vd=0, D=0")
print("    Sn=1 -> Vn=0, N=1  -> bit 7 set  -> 0x80")
print("    Sm=2 -> Vm=1, M=0  -> 0x1")
print("    0xEEA00A00 | 0x80 | 0x1 = 0xEEA00A81")
hi, lo = encode_vfma(0, 1, 2)
print("    encode_vfma(0,1,2) = %s %s" % (hex(hi), hex(lo)))
print()
print("A 32-bit Thumb-2 instruction is stored as two halfwords, high first.")


# =========================================================================
# PART 3 -- emit it and check it works
# =========================================================================
print()
print("=== PART 3: does it actually run? ===")
print()


@micropython.asm_thumb
def try_vfma(r0):
    # buf = [a, b, c, result]     computes a + b*c
    vldr(s0, [r0, 0])
    vldr(s1, [r0, 4])
    vldr(s2, [r0, 8])
    data(2, 0xEEA0, 0x0A81)         # vfma.f32 s0, s1, s2
    vstr(s0, [r0, 12])


buf = array("f", [1.0, 2.0, 3.0, 0.0])
try_vfma(addressof(buf))
print("1.0 + 2.0*3.0 = %.1f   (expect 7.0)" % buf[3])
print()
if abs(buf[3] - 7.0) < 1e-6:
    print("It ran. You just executed an instruction your assembler cannot")
    print("write, by constructing the machine code yourself.")
else:
    print("Wrong result -- check the encoding.")


# =========================================================================
# PART 4 -- the trap that costs an afternoon
# =========================================================================
print()
print("=== PART 4: a trap worth knowing about ===")
print()
print("Encode VFMA.F32 s7, s1, s4 and look carefully:")
hi7, lo7 = encode_vfma(7, 1, 4)
hi6, lo6 = encode_vfma(6, 1, 5, subtract=True)
print("    vfma.f32 s7, s1, s4  ->  %s %s" % (hex(hi7), hex(lo7)))
print("    vfms.f32 s6, s1, s5  ->  %s %s" % (hex(hi6), hex(lo6)))
print()
print("The HIGH halfwords differ: 0xEEE0 versus 0xEEA0.")
print()
print("Sd=7 is odd, so the D bit is set -- and D lives at bit 22, which is")
print("in the FIRST halfword. Get that wrong and the instruction still")
print("assembles, still runs, and quietly writes to the wrong register.")
print()
print("No error. No crash. Just a spectrum that is subtly wrong.")
print()
print("This exact mistake was made while building this course. Which is")
print("why the next section exists.")


# =========================================================================
# PART 5 -- verify every encoding before trusting it
# =========================================================================
print()
print("=== PART 5: verify, do not assume ===")
print()


@micropython.asm_thumb
def check_pair(r0):
    # buf = [10.0, 2.0, 3.0, out_fms, out_fma]
    vldr(s6, [r0, 0])           # 10.0
    vldr(s7, [r0, 0])           # 10.0
    vldr(s1, [r0, 4])           # 2.0
    vldr(s5, [r0, 8])           # 3.0
    vldr(s4, [r0, 8])           # 3.0
    data(2, 0xEEA0, 0x3AE2)     # vfms.f32 s6, s1, s5  -> 10 - 2*3 = 4
    data(2, 0xEEE0, 0x3A82)     # vfma.f32 s7, s1, s4  -> 10 + 2*3 = 16
    vstr(s6, [r0, 12])
    vstr(s7, [r0, 16])


b = array("f", [10.0, 2.0, 3.0, 0.0, 0.0])
check_pair(addressof(b))
print("vfms: 10 - 2*3 = %.1f  (expect 4.0)   %s"
      % (b[3], "ok" if abs(b[3] - 4.0) < 1e-6 else "WRONG"))
print("vfma: 10 + 2*3 = %.1f  (expect 16.0)  %s"
      % (b[4], "ok" if abs(b[4] - 16.0) < 1e-6 else "WRONG"))
print()
print("Two lines of arithmetic with a known answer. Always do this before")
print("a hand-encoded instruction goes anywhere near real data.")


# =========================================================================
# PART 6 -- what does it actually buy?
# =========================================================================
print()
print("=== PART 6: was it worth it? ===")
print()
import gc
import v0_baseline
import v7_vfma_raw

N = 512
import math
signal = [math.sin(2 * math.pi * 40 * i / N) for i in range(N)]

v0 = v0_baseline.Variant(N)
v7 = v7_vfma_raw.Variant(N)
gc.collect()


def bench(v, trials=15):
    re, im = v.make_buffers()

    def once():
        for i in range(N):
            re[i] = signal[i]
            im[i] = 0.0
        s = rd()
        v.run(re, im)
        return (rd() - s) & 0xFFFFFFFF

    once()
    return min(once() for _ in range(trials))


base = bench(v0)
vfma = bench(v7)

print("%-26s %12s %10s" % ("variant", "cycles", "speedup"))
print("%-26s %12d %9.3fx" % ("v0 baseline", base, 1.0))
print("%-26s %12d %9.3fx" % ("v7 hand-encoded VFMA", vfma, base / vfma))
print()
print("The butterfly's two multiply-then-add sequences drop from three")
print("instructions to two. That removes 2 of about 28 instructions -- a")
print("ceiling of roughly 7%%, and the measurement lands below even that.")
print()
print("=== The real lesson ===")
print()
print("This variant is the most technically demanding in the course and")
print("very nearly the least effective. That is not a failure -- it is the")
print("finding.")
print()
print("Lab 24 showed the FFT's cost is dominated by loop control, address")
print("arithmetic and memory access, NOT by the multiplies. Optimising")
print("arithmetic in a loop that is not arithmetic-bound barely registers.")
print()
print("What you actually gained: the ability to reach any instruction your")
print("chip implements, whether or not your toolchain has heard of it.")
print("Some day you will need an instruction nobody exposed, and now you")
print("know it is a lookup in a manual rather than a dead end.")
