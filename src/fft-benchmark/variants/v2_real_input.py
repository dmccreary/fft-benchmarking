# V2 -- Real-input FFT: exploit the fact that audio has no imaginary part.
#
# THIS IS THE VARIANT THAT SHOULD WIN, and it wins by changing the algorithm
# rather than by tuning instructions. Every other variant in this comparison
# shaves 10-30% off the same 2,304 butterflies. This one does roughly half the
# butterflies.
#
# The observation: all ten test signals are real-valued audio. The baseline
# loads them into a complex buffer with a zeroed imaginary array, then spends
# the entire transform multiplying zeros and adding them to things. Half the
# arithmetic computes information that was never there.
#
# The standard fix packs the real signal into a HALF-LENGTH complex array:
#
#     z[k] = x[2k] + i * x[2k+1]          k = 0 .. 255
#
# then runs a 256-point complex FFT (about 45% the work of a 512-point one)
# and untangles the result. Packing pairs even-indexed samples as the real
# part and odd-indexed as the imaginary part, so one complex transform carries
# both halves of the signal.
#
# The untangling ("split step") recovers the true 512-point spectrum:
#
#     Ze[k] = (Z[k] + conj(Z[N/2-k])) / 2        even-sample spectrum
#     Zo[k] = (Z[k] - conj(Z[N/2-k])) / 2i       odd-sample spectrum
#     X[k]        = Ze[k] + W_N^k * Zo[k]
#     X[k + N/2]  = Ze[k] - W_N^k * Zo[k]
#
# This is O(n) work against the O(n log n) transform, so it does not erase the
# saving.
#
# Cost of the win: the output layout and the code are both more complicated,
# and the routine is only valid for real input. Feeding it complex data
# silently produces nonsense. That restriction is the price of the speedup,
# and is worth making explicit to students -- a faster routine with a
# precondition is not strictly better than a slower general one.
#
# Note both the pack and the split step are written in assembly. An earlier
# attempt left them in Python and the marshalling cost more than the FFT it
# saved -- the same failure mode that sinks V6.

import micropython
from array import array
from uctypes import addressof

import fft_asm
from common import VariantBase, bit_reverse_table, twiddle_interleaved


@micropython.asm_thumb
def _pack_asm(r0, r1, r2, r3):
    # Pack a real signal into a half-length complex array.
    #   r0 = &x[0] (n real floats)   r1 = &zre[0]   r2 = &zim[0]   r3 = n/2
    #   z[k] = x[2k] + i*x[2k+1]
    mov(r4, 0)                      # k

    label(PK_LOOP)
    lsl(r6, r4, 3)                  # k*8 -> byte offset of x[2k]
    add(r6, r0, r6)
    vldr(s0, [r6, 0])               # x[2k]   -> real part
    vldr(s1, [r6, 4])               # x[2k+1] -> imaginary part
    lsl(r7, r4, 2)                  # k*4
    add(r6, r1, r7)
    vstr(s0, [r6, 0])
    add(r6, r2, r7)
    vstr(s1, [r6, 0])
    add(r4, 1)
    cmp(r4, r3)
    blt(PK_LOOP)


@micropython.asm_thumb
def _unpack_asm(r0, r1, r2, r3):
    # The split step: turn the n/2-point complex spectrum into the true
    # n-point spectrum of the original real signal.
    #
    #   r0 = &zre[0]   r1 = &zim[0]   r2 = &uparams[0]   r3 = n/2
    #   uparams[0] = &out_re   uparams[1] = &out_im
    #   uparams[2] = &twiddle (W_n, interleaved)   uparams[3] = &const_half
    #
    # Handles k = 1 .. n/2-1. k = 0 is a special case done in Python because
    # it needs Z[n/2], which wraps to Z[0].
    ldr(r4, [r2, 12])
    vldr(s26, [r4, 0])              # 0.5
    ldr(r4, [r2, 4])
    vmov(s28, r4)                   # park &out_im
    ldr(r4, [r2, 8])
    vmov(s27, r4)                   # park &twiddle
    ldr(r2, [r2, 0])                # r2 = &out_re
    lsl(r6, r3, 2)
    vmov(s30, r6)                   # park (n/2)*4
    mov(r4, 4)                      # byte offset of k, starting at k = 1

    label(UP_LOOP)
    vmov(r6, s30)
    sub(r5, r6, r4)                 # byte offset of m = n/2 - k

    add(r6, r0, r4)
    vldr(s2, [r6, 0])               # zr1 = Re Z[k]
    add(r6, r1, r4)
    vldr(s3, [r6, 0])               # zi1 = Im Z[k]
    add(r6, r0, r5)
    vldr(s4, [r6, 0])               # zr2 = Re Z[m]
    add(r6, r1, r5)
    vldr(s5, [r6, 0])               # zi2 = Im Z[m]

    # 2*Ze = (zr1+zr2, zi1-zi2)   and   2*Zo = (zi1+zi2, -(zr1-zr2))
    vadd(s6, s2, s4)                # a
    vsub(s7, s3, s5)                # b
    vadd(s8, s3, s5)                # c
    vsub(s9, s2, s4)
    vneg(s9, s9)                    # d

    vmov(r6, s27)
    add(r6, r6, r4)
    add(r6, r6, r4)                 # &twiddle[k] (interleaved: k*8 = 2 * k*4)
    vldr(s10, [r6, 0])              # wr
    vldr(s11, [r6, 4])              # wi

    # W * Zo
    vmul(s12, s10, s8)
    vmul(s13, s11, s9)
    vsub(s12, s12, s13)             # pr = wr*c - wi*d
    vmul(s13, s10, s9)
    vmul(s14, s11, s8)
    vadd(s13, s13, s14)             # pi = wr*d + wi*c

    # X[k] = 0.5 * (a + pr, b + pi)
    vadd(s14, s6, s12)
    vmul(s14, s14, s26)
    vadd(s15, s7, s13)
    vmul(s15, s15, s26)
    add(r6, r2, r4)
    vstr(s14, [r6, 0])
    vmov(r7, s28)
    add(r6, r7, r4)
    vstr(s15, [r6, 0])

    # X[k + n/2] = 0.5 * (a - pr, b - pi)
    vsub(s14, s6, s12)
    vmul(s14, s14, s26)
    vsub(s15, s7, s13)
    vmul(s15, s15, s26)
    vmov(r6, s30)
    add(r7, r4, r6)                 # byte offset of k + n/2
    add(r6, r2, r7)
    vstr(s14, [r6, 0])
    vmov(r6, s28)
    add(r6, r6, r7)
    vstr(s15, [r6, 0])

    add(r4, 4)
    vmov(r6, s30)
    cmp(r4, r6)
    blt(UP_LOOP)


class Variant(VariantBase):
    name = "v2"
    label = "real-input FFT (half-size complex transform)"

    def __init__(self, n=512):
        super().__init__(n)
        self.nh = n // 2
        # Tables for the inner half-size complex transform.
        self.table = bit_reverse_table(self.nh)
        self.tw_inner = twiddle_interleaved(self.nh)
        # Full-size twiddles W_n^k, needed by the split step.
        self.tw_outer = twiddle_interleaved(n)
        self.zre = array("f", bytearray(4 * self.nh))
        self.zim = array("f", bytearray(4 * self.nh))
        self.consts = array("f", [0.5])
        self.params = array("i", [0, 0, 0, 0, 0])
        self.uparams = array("i", [0, 0, 0, 0])

        self._table_addr = addressof(self.table)
        self._twi_addr = addressof(self.tw_inner)
        self._two_addr = addressof(self.tw_outer)
        self._zre_addr = addressof(self.zre)
        self._zim_addr = addressof(self.zim)
        self._params_addr = addressof(self.params)
        self._uparams_addr = addressof(self.uparams)
        self.uparams[2] = self._two_addr
        self.uparams[3] = addressof(self.consts)

    def run(self, re, im):
        # `re` holds the real signal on entry and receives the real part of
        # the spectrum on exit; `im` is written but not read.
        nh = self.nh
        zre_a = self._zre_addr
        zim_a = self._zim_addr
        p = self.params

        _pack_asm(addressof(re), zre_a, zim_a, nh)

        # Half-size complex FFT, reusing the baseline's assembly routines.
        fft_asm._bit_reverse_asm(zre_a, zim_a, self._table_addr, nh)
        p[0] = nh * 4
        half = 1
        while half < nh:
            p[1] = half * 4
            p[2] = (nh // (half * 2)) * 8
            p[4] = half
            fft_asm._fft_stage_asm(zre_a, zim_a, self._twi_addr, self._params_addr)
            half *= 2

        # k = 0 special case: needs Z[n/2], which wraps around to Z[0].
        #   X[0]    = Re Z[0] + Im Z[0]      (both purely real)
        #   X[n/2]  = Re Z[0] - Im Z[0]
        z0r = self.zre[0]
        z0i = self.zim[0]

        self.uparams[0] = addressof(re)
        self.uparams[1] = addressof(im)
        _unpack_asm(zre_a, zim_a, self._uparams_addr, nh)

        re[0] = z0r + z0i
        im[0] = 0.0
        re[nh] = z0r - z0i
        im[nh] = 0.0
