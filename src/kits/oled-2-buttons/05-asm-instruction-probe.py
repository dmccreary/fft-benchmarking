# Lab 05: Extended Inline Assembler Instruction Probe
#
# Follow-up to 04-asm-thumb-probe.py. That probe established that the FPU
# instructions needed for a float FFT are available. This one asks which
# *optimization* instructions exist, because each one gates a different FFT
# variant we might build to compare architecture tradeoffs:
#
#   fused multiply-add (vfma/vmla)  -> fewer instructions per butterfly
#   DSP / SIMD integer (smlad etc.) -> a fixed-point Q15 FFT
#   load/store multiple (vldm)      -> cheaper buffer access
#   code emitters (native/viper)    -> intermediate rungs on a speed ladder
#
# An instruction that does not assemble here cannot be used from stock
# MicroPython, no matter what the Cortex-M33 silicon supports.

import micropython

GLOBALS = {"micropython": micropython}
results = {}


def probe(group, name, source):
    try:
        exec(source, GLOBALS)
        print("  ok       %s" % name)
        results.setdefault(group, []).append((name, True))
        return True
    except Exception as e:
        print("  MISSING  %s  (%s)" % (name, e))
        results.setdefault(group, []).append((name, False))
        return False


print("=== Fused / chained multiply-accumulate (gates the VFMA variant) ===")
probe("fma", "vfma (fused multiply-add)", """
@micropython.asm_thumb
def _f1():
    vfma(s0, s1, s2)
""")
probe("fma", "vfms (fused multiply-subtract)", """
@micropython.asm_thumb
def _f2():
    vfms(s0, s1, s2)
""")
probe("fma", "vmla (chained multiply-add)", """
@micropython.asm_thumb
def _f3():
    vmla(s0, s1, s2)
""")
probe("fma", "vmls (chained multiply-subtract)", """
@micropython.asm_thumb
def _f4():
    vmls(s0, s1, s2)
""")

print()
print("=== Other float helpers ===")
probe("float", "vneg", """
@micropython.asm_thumb
def _n1():
    vneg(s0, s1)
""")
probe("float", "vdiv", """
@micropython.asm_thumb
def _n2():
    vdiv(s0, s1, s2)
""")
probe("float", "vsqrt", """
@micropython.asm_thumb
def _n3():
    vsqrt(s0, s1)
""")
probe("float", "vldm (load multiple)", """
@micropython.asm_thumb
def _n4(r0):
    vldm(r0, s0, 4)
""")

print()
print("=== DSP / SIMD integer (gates the fixed-point Q15 variant) ===")
probe("dsp", "smulbb (16x16 multiply)", """
@micropython.asm_thumb
def _d1():
    smulbb(r0, r1, r2)
""")
probe("dsp", "smlabb (16x16 multiply-accumulate)", """
@micropython.asm_thumb
def _d2():
    smlabb(r0, r1, r2, r3)
""")
probe("dsp", "ssat (saturating)", """
@micropython.asm_thumb
def _d3():
    ssat(r0, 16, r1)
""")
probe("dsp", "qadd16 (packed saturating add)", """
@micropython.asm_thumb
def _d4():
    qadd16(r0, r1, r2)
""")
probe("dsp", "smuad (dual multiply-accumulate)", """
@micropython.asm_thumb
def _d5():
    smuad(r0, r1, r2)
""")
probe("dsp", "pkhbt (pack halfwords)", """
@micropython.asm_thumb
def _d6():
    pkhbt(r0, r1, r2)
""")
probe("dsp", "asr (arithmetic shift, Q-format scaling)", """
@micropython.asm_thumb
def _d7():
    asr(r0, r1)
""")
probe("dsp", "mla (32-bit multiply-accumulate)", """
@micropython.asm_thumb
def _d8():
    mla(r0, r1, r2, r3)
""")

print()
print("=== Alternative code emitters (rungs on the performance ladder) ===")
try:
    exec("""
@micropython.native
def _nat(a, b):
    return a + b
""", GLOBALS)
    print("  ok       @micropython.native ->", GLOBALS["_nat"](2, 3))
    results.setdefault("emitter", []).append(("native", True))
except Exception as e:
    print("  MISSING  @micropython.native (%s)" % e)
    results.setdefault("emitter", []).append(("native", False))

try:
    exec("""
@micropython.viper
def _vip(a: int, b: int) -> int:
    return a + b
""", GLOBALS)
    print("  ok       @micropython.viper ->", GLOBALS["_vip"](2, 3))
    results.setdefault("emitter", []).append(("viper", True))
except Exception as e:
    print("  MISSING  @micropython.viper (%s)" % e)
    results.setdefault("emitter", []).append(("viper", False))

print()
print("=== Verdict per FFT variant ===")


def verdict(label, group, required):
    have = dict(results.get(group, []))
    missing = [r for r in required if not have.get(r, False)]
    if not missing:
        print("  FEASIBLE     %s" % label)
    else:
        print("  BLOCKED      %s  (missing: %s)" % (label, ", ".join(missing)))


verdict("VFMA butterfly (fused)", "fma", ["vfma (fused multiply-add)"])
verdict("VMLA butterfly (chained)", "fma", ["vmla (chained multiply-add)"])
verdict("Fixed-point Q15 with SIMD", "dsp",
        ["smulbb (16x16 multiply)", "smlabb (16x16 multiply-accumulate)"])
verdict("Packed 2-way SIMD Q15", "dsp",
        ["smuad (dual multiply-accumulate)", "qadd16 (packed saturating add)"])
verdict("Viper-level baseline", "emitter", ["viper"])
