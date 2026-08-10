# V7 -- Hand-encoded VFMA: using an instruction the assembler refuses.
#
# THE POINT OF THIS VARIANT is not its speed. It is that the instruction set
# and the assembler are different things.
#
# The Cortex-M33 r1p0 in this Pico 2 implements VFMA.F32 (fused multiply-add).
# It is documented in section 3.12 of the ARM guide saved in this repo.
# But MicroPython's inline assembler does not recognise the mnemonic:
#
#     >>> vfma(s0, s1, s2)
#     unsupported Thumb instruction 'vfma' with 3 arguments
#
# The instruction exists in silicon; only the toolchain is missing. So we
# encode it by hand and emit the raw halfwords with data().
#
# ---------------------------------------------------------------------------
# Deriving the encoding (VFP data-processing format, ARM guide section 3.12)
#
#   VFMA.F32 <Sd>, <Sn>, <Sm>       base word 0xEEA00A00
#
#   Single-precision registers are split across two fields each:
#       Sd -> Vd = Sd >> 1 at bits 15:12,  D = Sd & 1 at bit 22
#       Sn -> Vn = Sn >> 1 at bits 19:16,  N = Sn & 1 at bit 7
#       Sm -> Vm = Sm >> 1 at bits  3:0,   M = Sm & 1 at bit 5
#
#   Worked example, VFMA.F32 s6, s0, s4  (s6 += s0 * s4):
#       Sd=6 -> Vd=3, D=0        3 << 12 = 0x3000
#       Sn=0 -> Vn=0, N=0                 0
#       Sm=4 -> Vm=2, M=0                 2
#       0xEEA00A00 | 0x3000 | 0x2 = 0xEEAff... -> 0xEEA03A02
#
#   A Thumb-2 32-bit instruction is stored as two halfwords, high first:
#       data(2, 0xEEA0, 0x3A02)
#
# Verified on hardware before use: a hand-encoded VFMA computing 1 + 2*3
# returned exactly 7.0.
# ---------------------------------------------------------------------------
#
# What it buys: the butterfly's four multiply-then-add/subtract sequences
# collapse from three instructions to two:
#
#     before:  vmul s6, s0, s4     ;  vmul s9, s1, s5  ;  vsub s6, s6, s9
#     after:   vmul s6, s0, s4     ;  vfms s6, s1, s5
#
# That removes 2 instructions from a ~28-instruction body: a ceiling of about
# 7%. The Plan 02 profile predicted this would be modest because loop overhead
# and memory access dominate, not arithmetic. Measuring it is how students
# find out whether the prediction holds.
#
# Bonus accuracy note: VFMA is FUSED -- the product is not rounded before the
# add, so a*b+c carries a single rounding instead of two. Results may differ
# very slightly from the baseline, and be slightly more accurate.

import micropython
from array import array
from uctypes import addressof

import fft_asm
from common import VariantBase, bit_reverse_table, twiddle_interleaved


def encode_vfma(sd, sn, sm, subtract=False):
    """Return the two Thumb-2 halfwords for VFMA/VFMS.F32 sd, sn, sm.

    Kept as a function so students can verify the arithmetic against the
    manual, and reuse it for other unsupported VFP instructions.
    """
    base = 0xEEA00A00
    if subtract:
        base |= 1 << 6                       # VFMS is VFMA with op bit set
    word = (base
            | ((sd >> 1) << 12) | ((sd & 1) << 22)
            | ((sn >> 1) << 16) | ((sn & 1) << 7)
            | (sm >> 1) | ((sm & 1) << 5))
    return (word >> 16) & 0xFFFF, word & 0xFFFF


@micropython.asm_thumb
def _fft_stage_vfma(r0, r1, r2, r3):
    # Same structure as the baseline stage routine, but the two
    # multiply-accumulate sequences use hand-encoded fused instructions.
    #
    #   r0 = &real[0]  r1 = &imag[0]  r2 = &twiddle[0]  r3 = &params[0]
    ldr(r4, [r3, 4])                # half*4
    ldr(r5, [r3, 16])               # half (j countdown)
    ldr(r7, [r3, 8])                # twiddle stride in bytes
    ldr(r6, [r3, 0])                # n*4
    vmov(s30, r6)
    mov(r6, 0)
    vmov(s29, r6)

    label(JV_LOOP)
    vldr(s0, [r2, 0])               # wr
    vldr(s1, [r2, 4])               # wi
    vmov(r3, s29)

    label(KV_LOOP)
    add(r6, r0, r3)
    vldr(s2, [r6, 0])               # ar
    add(r6, r6, r4)
    vldr(s4, [r6, 0])               # xr
    add(r6, r1, r3)
    vldr(s3, [r6, 0])               # ai
    add(r6, r6, r4)
    vldr(s5, [r6, 0])               # xi

    # tr = wr*xr - wi*xi   ->   s6 = s0*s4 ; s6 -= s1*s5
    vmul(s6, s0, s4)
    data(2, 0xEEA0, 0x3AE2)         # vfms.f32 s6, s1, s5   (encode_vfma(6,1,5,True))

    # ti = wr*xi + wi*xr   ->   s7 = s0*s5 ; s7 += s1*s4
    vmul(s7, s0, s5)
    data(2, 0xEEE0, 0x3A82)         # vfma.f32 s7, s1, s4   (encode_vfma(7,1,4,False))
    # Note the high halfword differs (0xEEE0 vs 0xEEA0): Sd=7 is odd, so the
    # D bit (bit 22) is set, and bit 22 lives in the FIRST halfword. Getting
    # this wrong assembles cleanly and silently computes the wrong result --
    # which is why the encodings are verified against hardware before use.

    vsub(s8, s2, s6)                # real[i2] = ar - tr
    vadd(s2, s2, s6)                # real[i1] = ar + tr
    vsub(s9, s3, s7)                # imag[i2] = ai - ti
    vadd(s3, s3, s7)                # imag[i1] = ai + ti

    add(r6, r0, r3)
    vstr(s2, [r6, 0])
    add(r6, r6, r4)
    vstr(s8, [r6, 0])
    add(r6, r1, r3)
    vstr(s3, [r6, 0])
    add(r6, r6, r4)
    vstr(s9, [r6, 0])

    add(r3, r3, r4)
    add(r3, r3, r4)
    vmov(r6, s30)
    cmp(r3, r6)
    blt(KV_LOOP)

    add(r2, r2, r7)
    vmov(r6, s29)
    add(r6, 4)
    vmov(s29, r6)
    sub(r5, 1)
    cmp(r5, 0)
    bgt(JV_LOOP)


class Variant(VariantBase):
    name = "v7"
    label = "hand-encoded VFMA (fused multiply-add)"

    def __init__(self, n=512):
        super().__init__(n)
        self.table = bit_reverse_table(n)
        self.twiddle = twiddle_interleaved(n)
        self.params = array("i", [0, 0, 0, 0, 0])
        self._table_addr = addressof(self.table)
        self._tw_addr = addressof(self.twiddle)
        self._params_addr = addressof(self.params)

    def run(self, re, im):
        n = self.n
        ra = addressof(re)
        ia = addressof(im)
        p = self.params

        fft_asm._bit_reverse_asm(ra, ia, self._table_addr, n)

        p[0] = n * 4
        half = 1
        while half < n:
            p[1] = half * 4
            p[2] = (n // (half * 2)) * 8
            p[4] = half
            _fft_stage_vfma(ra, ia, self._tw_addr, self._params_addr)
            half *= 2
