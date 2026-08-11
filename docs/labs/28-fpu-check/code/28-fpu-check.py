# Lab 28: Does Your CPU Have an FPU?
#
# Before writing a single line of floating-point assembly, ask the chip
# whether it can run it.
#
# This is not a formality. An earlier version of this very course targeted
# the original Raspberry Pi Pico, whose Cortex-M0+ core has NO FLOATING
# POINT UNIT AT ALL. Every vldr and vmul in that code was unassemblable on
# the hardware it was written for. Four successive attempts were made,
# wrapped in try/except blocks and library-probing, and none of them ever
# worked -- because the real problem was never stated anywhere in the code.
#
# Five minutes of asking the silicon would have saved all of it.

import machine
import micropython
import sys

print("=== Who am I talking to? ===")
print("board    :", sys.implementation._machine)
print("firmware :", sys.version)
print("clock    : %d MHz" % (machine.freq() // 1000000))

# =========================================================================
# PART 1 -- the CPUID register (you met this in Lab 3)
# =========================================================================
print()
print("=== PART 1: which core is this? ===")
cpuid = machine.mem32[0xE000ED00]
implementer = (cpuid >> 24) & 0xFF
variant = (cpuid >> 20) & 0xF
partno = (cpuid >> 4) & 0xFFF
revision = cpuid & 0xF

CORES = {
    0xC20: ("Cortex-M0", "ARMv6-M", False),
    0xC60: ("Cortex-M0+", "ARMv6-M", False),
    0xC23: ("Cortex-M3", "ARMv7-M", False),
    0xC24: ("Cortex-M4", "ARMv7E-M", None),     # FPU optional
    0xC27: ("Cortex-M7", "ARMv7E-M", None),
    0xD20: ("Cortex-M23", "ARMv8-M Baseline", False),
    0xD21: ("Cortex-M33", "ARMv8-M Mainline", None),
}

name, arch, has_fpu = CORES.get(partno, ("unknown", "unknown", None))
print("CPUID    : %s" % hex(cpuid))
print("core     : %s  (%s)" % (name, arch))
print("revision : r%dp%d" % (variant, revision))

# =========================================================================
# PART 2 -- MVFR0: ask about the FPU directly
# =========================================================================
print()
print("=== PART 2: is there an FPU? ===")
print()
print("The Media and VFP Feature Register 0 describes the floating-point")
print("hardware. Zero means there is none.")
print()
try:
    mvfr0 = machine.mem32[0xE000EF40]
    print("MVFR0    : %s" % hex(mvfr0))
    if mvfr0 == 0:
        print("VERDICT  : NO FPU. Float assembly is impossible on this chip.")
        fpu = False
    else:
        print("single precision : %s" % ("yes" if (mvfr0 & 0xF0) else "no"))
        print("double precision : %s" % ("yes" if (mvfr0 & 0xF00) else "no"))
        print("VERDICT  : FPU present.")
        fpu = True
except Exception as e:
    print("could not read MVFR0:", e)
    fpu = False

# =========================================================================
# PART 3 -- the assembler is a separate question
# =========================================================================
print()
print("=== PART 3: can the ASSEMBLER emit the instructions? ===")
print()
print("Having the hardware is necessary but not sufficient. MicroPython's")
print("inline assembler supports a SUBSET of the instruction set. A chip")
print("can implement an instruction that the assembler refuses to write.")
print()

available = []
missing = []


def probe(label, body):
    src = "@micropython.asm_thumb\ndef _t(r0):\n    %s\n" % body
    try:
        exec(src, {"micropython": micropython})
        available.append(label)
        print("  ok       %s" % label)
    except Exception as e:
        missing.append(label)
        print("  MISSING  %s" % label)


print("Floating point:")
for label, body in (("vldr  (load float)", "vldr(s0, [r0, 0])"),
                    ("vstr  (store float)", "vstr(s0, [r0, 0])"),
                    ("vadd  (add)", "vadd(s0, s1, s2)"),
                    ("vsub  (subtract)", "vsub(s0, s1, s2)"),
                    ("vmul  (multiply)", "vmul(s0, s1, s2)"),
                    ("vmov  (core <-> float)", "vmov(s0, r0)"),
                    ("vcvt  (int -> float)", "vcvt_f32_s32(s0, s1)"),
                    ("s16+  (high registers)", "vadd(s16, s17, s18)")):
    probe(label, body)

print()
print("Other useful things:")
probe("data() raw encoding", "data(2, 0xEEA0, 0x0A81)")

# =========================================================================
# PART 4 -- the verdict
# =========================================================================
print()
print("=== VERDICT ===")
print()
if not fpu:
    print("This chip has no FPU. Labs 30-33 cannot run here.")
    print("You need a Cortex-M4F, M7 or M33 -- a Raspberry Pi Pico 2, not a")
    print("Pico 1.")
elif missing:
    print("FPU present, but the assembler is missing: %s" % ", ".join(missing))
    print("Some later labs may need adjusting.")
else:
    print("FPU present and the assembler can drive it.")
    print("Everything in Module 7 will work on this board.")

print()
print("=== The lesson ===")
print()
print("The previous generation of this course spent enormous effort on an")
print("assembly FFT that could never have run, because nobody asked the")
print("chip this question first. The code was correct. The silicon was")
print("wrong. Nothing in the source said so.")
print()
print("Five minutes of probing beats four attempts at debugging.")
