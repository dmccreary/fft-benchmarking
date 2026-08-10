# V1 -- Specialized early stages: skip the multiplications that do nothing.
#
# The profile in Plan 02 found that stage 1 is the MOST expensive stage per
# butterfly (92.7 cycles) even though its twiddle factor is always (1, 0).
# Multiplying by 1 and adding 0 costs exactly as much as any other multiply if
# you use the same generic code path.
#
# Two stages have trivial twiddles:
#
#   Stage 1 (half=1): the only twiddle is W^0 = (1, 0).
#       tr = 1*xr - 0*xi = xr
#       ti = 1*xi + 0*xr = xi
#     So the butterfly collapses to plain add/subtract -- four VMULs removed.
#
#   Stage 2 (half=2): twiddles are W^0 = (1, 0) and W^(n/4) = (0, -1).
#       Multiplying by -i maps (xr, xi) -> (xi, -xr): a register swap and a
#       sign flip, no multiplier involved at all.
#
# Stages 3-9 keep the generic routine. This trades code size for speed, which
# is a real tradeoff on a microcontroller and is exactly the sort of decision
# this variant exists to make visible.

import micropython
from uctypes import addressof

import fft_asm
from common import VariantBase, bit_reverse_table, twiddle_interleaved


@micropython.asm_thumb
def _stage1_asm(r0, r1, r2, r3):
    # Stage 1: half=1, twiddle is always (1, 0).
    #   r0 = &real[0]   r1 = &imag[0]   r2 = n*4 (end offset)   r3 = unused
    # Pairs are adjacent: (0,1), (2,3), (4,5), ...
    # butterfly reduces to:  a' = a + b,  b' = a - b
    mov(r4, 0)                      # byte offset of the pair's first element

    label(S1_LOOP)
    add(r6, r0, r4)                 # &real[i]
    vldr(s0, [r6, 0])               # ar
    vldr(s1, [r6, 4])               # br   (adjacent element)
    vadd(s2, s0, s1)                # ar + br
    vsub(s3, s0, s1)                # ar - br
    vstr(s2, [r6, 0])
    vstr(s3, [r6, 4])

    add(r6, r1, r4)                 # &imag[i]
    vldr(s0, [r6, 0])               # ai
    vldr(s1, [r6, 4])               # bi
    vadd(s2, s0, s1)
    vsub(s3, s0, s1)
    vstr(s2, [r6, 0])
    vstr(s3, [r6, 4])

    add(r4, 8)                      # next pair (two elements = 8 bytes)
    cmp(r4, r2)
    blt(S1_LOOP)


@micropython.asm_thumb
def _stage2_asm(r0, r1, r2, r3):
    # Stage 2: half=2, twiddles are (1, 0) for j=0 and (0, -1) for j=1.
    #   r0 = &real[0]   r1 = &imag[0]   r2 = n*4 (end offset)   r3 = unused
    # Each block spans 4 elements: indices k..k+3, pairs (k,k+2) and (k+1,k+3).
    #
    #   j=0, w=(1,0):   plain add/subtract
    #   j=1, w=(0,-1):  tr = 0*xr - (-1)*xi = xi
    #                   ti = 0*xi + (-1)*xr = -xr
    #                 so multiplying by -i is a swap plus a negate.
    mov(r4, 0)                      # byte offset of the block start

    label(S2_LOOP)
    # ---- j = 0 : indices (k, k+2), twiddle (1, 0) ----------------------
    add(r6, r0, r4)
    vldr(s0, [r6, 0])               # ar = real[k]
    vldr(s1, [r6, 8])               # br = real[k+2]
    vadd(s2, s0, s1)
    vsub(s3, s0, s1)
    vstr(s2, [r6, 0])
    vstr(s3, [r6, 8])
    add(r6, r1, r4)
    vldr(s0, [r6, 0])               # ai = imag[k]
    vldr(s1, [r6, 8])               # bi = imag[k+2]
    vadd(s2, s0, s1)
    vsub(s3, s0, s1)
    vstr(s2, [r6, 0])
    vstr(s3, [r6, 8])

    # ---- j = 1 : indices (k+1, k+3), twiddle (0, -1) -------------------
    # tr = xi, ti = -xr  where (xr, xi) is element k+3
    add(r6, r0, r4)
    vldr(s0, [r6, 4])               # ar = real[k+1]
    vldr(s4, [r6, 12])              # xr = real[k+3]
    add(r7, r1, r4)
    vldr(s1, [r7, 4])               # ai = imag[k+1]
    vldr(s5, [r7, 12])              # xi = imag[k+3]

    # tr = xi (s5), ti = -xr (s4)
    vadd(s2, s0, s5)                # real[k+1] = ar + tr
    vsub(s3, s0, s5)                # real[k+3] = ar - tr
    vstr(s2, [r6, 4])
    vstr(s3, [r6, 12])
    vsub(s2, s1, s4)                # imag[k+1] = ai + ti = ai - xr
    vadd(s3, s1, s4)                # imag[k+3] = ai - ti = ai + xr
    vstr(s2, [r7, 4])
    vstr(s3, [r7, 12])

    add(r4, 16)                     # next block (four elements = 16 bytes)
    cmp(r4, r2)
    blt(S2_LOOP)


class Variant(VariantBase):
    name = "v1"
    label = "specialized trivial-twiddle stages"

    def __init__(self, n=512):
        super().__init__(n)
        self.table = bit_reverse_table(n)
        self.twiddle = twiddle_interleaved(n)
        from array import array
        self.params = array("i", [0, 0, 0, 0, 0])
        self._table_addr = addressof(self.table)
        self._tw_addr = addressof(self.twiddle)
        self._params_addr = addressof(self.params)

    def run(self, re, im):
        n = self.n
        ra = addressof(re)
        ia = addressof(im)
        p = self.params
        end = n * 4

        fft_asm._bit_reverse_asm(ra, ia, self._table_addr, n)

        _stage1_asm(ra, ia, end, 0)          # half = 1, twiddle (1, 0)
        _stage2_asm(ra, ia, end, 0)          # half = 2, twiddles (1,0) & (0,-1)

        p[0] = end
        half = 4                              # stages 3..9 use the generic path
        while half < n:
            p[1] = half * 4
            p[2] = (n // (half * 2)) * 8
            p[4] = half
            fft_asm._fft_stage_asm(ra, ia, self._tw_addr, self._params_addr)
            half *= 2
