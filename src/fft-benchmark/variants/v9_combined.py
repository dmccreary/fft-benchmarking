# V9 -- Combined: every winning optimization stacked together.
#
# The other variants each change one thing, so a measurement can be attributed
# to a cause. This one answers the follow-up question: do the wins COMPOSE, or
# do they overlap and cancel?
#
# Stacked here:
#   V2  real-input FFT        half the butterflies (the algorithmic win)
#   V4  swap-list bit-reversal   branchless permutation
#   V1  specialized stages 1-2   trivial twiddles need no multiplier
#   V7  hand-encoded VFMA        fused multiply-add in the generic stages
#
# Deliberately NOT included: V6's interleaved layout. Its kernel is the
# fastest of any variant, but it requires a format conversion that costs more
# than the entire transform. Combining it would make this variant slower --
# a useful reminder that "stack all the optimizations" is not a strategy.
#
# Expected behaviour: the wins should mostly compose, because they attack
# different costs (algorithm, permutation, multiplies, instruction count).
# They will not compose perfectly -- V1 and V7 both target stage arithmetic,
# and V1 removes the very multiplies V7 would have fused, so their gains
# partially overlap.

import micropython
from array import array
from uctypes import addressof

import fft_asm
from common import VariantBase, swap_pairs, twiddle_interleaved
from v1_specialized import _stage1_asm, _stage2_asm
from v2_real_input import _pack_asm, _unpack_asm
from v4_fast_bitrev import _bitrev_pairs_asm
from v7_vfma_raw import _fft_stage_vfma


class Variant(VariantBase):
    name = "v9"
    label = "combined: real-input + specialized + branchless + VFMA"

    def __init__(self, n=512):
        super().__init__(n)
        self.nh = n // 2

        # Tables sized for the HALF-length inner transform.
        self.pairs, self.n_pairs = swap_pairs(self.nh)
        self.tw_inner = twiddle_interleaved(self.nh)
        self.tw_outer = twiddle_interleaved(n)

        self.zre = array("f", bytearray(4 * self.nh))
        self.zim = array("f", bytearray(4 * self.nh))
        self.consts = array("f", [0.5])
        self.params = array("i", [0, 0, 0, 0, 0])
        self.uparams = array("i", [0, 0, 0, 0])

        self._pairs_addr = addressof(self.pairs)
        self._twi_addr = addressof(self.tw_inner)
        self._zre_addr = addressof(self.zre)
        self._zim_addr = addressof(self.zim)
        self._params_addr = addressof(self.params)
        self._uparams_addr = addressof(self.uparams)
        self.uparams[2] = addressof(self.tw_outer)
        self.uparams[3] = addressof(self.consts)

    def run(self, re, im):
        nh = self.nh
        zre_a = self._zre_addr
        zim_a = self._zim_addr
        p = self.params
        end = nh * 4

        # --- V2: pack the real signal into a half-length complex array -----
        _pack_asm(addressof(re), zre_a, zim_a, nh)

        # --- V4: branchless bit-reversal -----------------------------------
        _bitrev_pairs_asm(zre_a, zim_a, self._pairs_addr, self.n_pairs)

        # --- V1: stages with trivial twiddles need no multiplications ------
        _stage1_asm(zre_a, zim_a, end, 0)
        _stage2_asm(zre_a, zim_a, end, 0)

        # --- V7: remaining stages use fused multiply-add -------------------
        p[0] = end
        half = 4
        while half < nh:
            p[1] = half * 4
            p[2] = (nh // (half * 2)) * 8
            p[4] = half
            _fft_stage_vfma(zre_a, zim_a, self._twi_addr, self._params_addr)
            half *= 2

        # --- V2: split step back to the full spectrum ----------------------
        z0r = self.zre[0]
        z0i = self.zim[0]
        self.uparams[0] = addressof(re)
        self.uparams[1] = addressof(im)
        _unpack_asm(zre_a, zim_a, self._uparams_addr, nh)
        re[0] = z0r + z0i
        im[0] = 0.0
        re[nh] = z0r - z0i
        im[nh] = 0.0
