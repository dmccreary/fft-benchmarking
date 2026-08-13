# Lab 04: Inline Assembler Capability Probe
# Asks the MicroPython runtime on THIS board which @micropython.asm_thumb
# instructions it actually supports. The answer decides how the course's
# assembly-language FFT can be delivered:
#   - if the floating-point (VFP) instructions assemble, students can run
#     hand-written assembly from a plain .py file on stock firmware
#   - if they do not, the FFT has to ship as a compiled module inside a
#     custom firmware build, which every student would have to flash
#
# Each probe is compiled on its own via exec() because @micropython.asm_thumb
# assembles at function-definition time: an unsupported mnemonic raises then,
# not when the function is called.

import micropython

GLOBALS = {"micropython": micropython}
supported = []
missing = []


def probe(name, source):
    try:
        exec(source, GLOBALS)
        print("  ok      ", name)
        supported.append(name)
        return True
    except Exception as e:
        print("  MISSING ", name, "->", e)
        missing.append(name)
        return False


print("=== Baseline: does asm_thumb work at all? ===")
probe("integer add (r0+r1)", """
@micropython.asm_thumb
def _add(r0, r1):
    add(r0, r0, r1)
""")

if "_add" in GLOBALS:
    print("  runtime check: 40 + 2 =", GLOBALS["_add"](40, 2))

print()
print("=== Integer / DSP-ish instructions ===")
probe("mul", """
@micropython.asm_thumb
def _mul(r0, r1):
    mul(r0, r1)
""")
probe("ldr/str (memory access)", """
@micropython.asm_thumb
def _ld(r0):
    ldr(r0, [r0, 0])
""")

print()
print("=== Floating point (VFP) -- the deciding question ===")
probe("vldr (load float)", """
@micropython.asm_thumb
def _vldr(r0):
    vldr(s0, [r0, 0])
""")
probe("vstr (store float)", """
@micropython.asm_thumb
def _vstr(r0):
    vstr(s0, [r0, 0])
""")
probe("vadd (float add)", """
@micropython.asm_thumb
def _vadd():
    vadd(s0, s1, s2)
""")
probe("vsub (float sub)", """
@micropython.asm_thumb
def _vsub():
    vsub(s0, s1, s2)
""")
probe("vmul (float multiply)", """
@micropython.asm_thumb
def _vmul():
    vmul(s0, s1, s2)
""")
probe("vmov core<->float reg", """
@micropython.asm_thumb
def _vmov(r0):
    vmov(s0, r0)
""")
probe("vcvt int->float", """
@micropython.asm_thumb
def _vcvt():
    vcvt_f32_s32(s0, s1)
""")
probe("high float regs (s16+)", """
@micropython.asm_thumb
def _vhigh():
    vadd(s16, s17, s18)
""")

print()
print("=== Argument passing ===")
probe("4 arguments", """
@micropython.asm_thumb
def _four(r0, r1, r2, r3):
    add(r0, r0, r1)
    add(r0, r0, r2)
    add(r0, r0, r3)
""")
if "_four" in GLOBALS:
    print("  runtime check: 1+2+3+4 =", GLOBALS["_four"](1, 2, 3, 4))

print()
print("=== Summary ===")
print("supported:", len(supported))
print("missing:  ", len(missing))
if missing:
    print("missing list:", missing)
vfp = [n for n in supported if n.startswith("v")]
print()
if len(missing) == 0:
    print("VERDICT: full support -- a pure-.py assembly FFT is viable on stock firmware.")
elif any(n.startswith("v") for n in missing):
    print("VERDICT: VFP support is incomplete -- a float FFT in inline asm is")
    print("         constrained. Consider fixed-point inline asm, or a compiled")
    print("         module in custom firmware.")
else:
    print("VERDICT: floating point looks usable; check the missing list above.")
