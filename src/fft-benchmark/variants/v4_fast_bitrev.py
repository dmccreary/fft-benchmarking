# V4 -- Faster bit-reversal: iterate over swaps, not over indices.
#
# The Plan 02 profile found bit-reversal costing ~22,000 cycles, about 17% of
# the whole transform -- for a permutation that performs no arithmetic at all.
#
# The baseline loops over all 512 indices and tests `if table[i] > i` on each:
#
#     for i in 0..511:
#         j = table[i]
#         if j > i:            <- true only ~240 times out of 512
#             swap(i, j)
#
# So more than half the iterations execute a load, a compare and a branch in
# order to do nothing. Worse, the branch is data-dependent and unpredictable,
# which is expensive on a pipelined core.
#
# This variant precomputes the ~240 (i, j) pairs that actually swap and walks
# that list directly. No test, no branch, no wasted iterations -- the loop body
# is unconditionally useful work.
#
# The cost is a slightly larger table (2 entries per swap instead of 1 per
# index) and a construction step. Both happen once at startup, outside any
# timed region. This is a classic precomputation-versus-runtime tradeoff.

import micropython
from array import array
from uctypes import addressof

import fft_asm
from common import VariantBase, swap_pairs, twiddle_interleaved


@micropython.asm_thumb
def _bitrev_pairs_asm(r0, r1, r2, r3):
    # r0 = &real[0]   r1 = &imag[0]   r2 = &pairs[0] (uint16 i,j,i,j,...)
    # r3 = number of pairs
    #
    # Every iteration performs a real swap. There is no conditional test in
    # the loop body at all.
    mov(r4, 0)                      # pair counter

    label(BP_LOOP)
    lsl(r6, r4, 2)                  # each pair is two uint16 = 4 bytes
    add(r6, r2, r6)
    ldrh(r5, [r6, 0])               # i
    ldrh(r7, [r6, 2])               # j

    lsl(r5, r5, 2)                  # i*4 -> byte offset
    lsl(r7, r7, 2)                  # j*4

    add(r6, r0, r5)                 # &real[i]
    vldr(s0, [r6, 0])
    add(r6, r0, r7)                 # &real[j]
    vldr(s1, [r6, 0])
    vstr(s0, [r6, 0])               # real[j] = old real[i]
    add(r6, r0, r5)
    vstr(s1, [r6, 0])               # real[i] = old real[j]

    add(r6, r1, r5)                 # &imag[i]
    vldr(s0, [r6, 0])
    add(r6, r1, r7)                 # &imag[j]
    vldr(s1, [r6, 0])
    vstr(s0, [r6, 0])
    add(r6, r1, r5)
    vstr(s1, [r6, 0])

    add(r4, 1)
    cmp(r4, r3)
    blt(BP_LOOP)


class Variant(VariantBase):
    name = "v4"
    label = "swap-list bit-reversal (branchless)"

    def __init__(self, n=512):
        super().__init__(n)
        self.pairs, self.n_pairs = swap_pairs(n)
        self.twiddle = twiddle_interleaved(n)
        self.params = array("i", [0, 0, 0, 0, 0])
        self._pairs_addr = addressof(self.pairs)
        self._tw_addr = addressof(self.twiddle)
        self._params_addr = addressof(self.params)

    def run(self, re, im):
        n = self.n
        ra = addressof(re)
        ia = addressof(im)
        p = self.params

        _bitrev_pairs_asm(ra, ia, self._pairs_addr, self.n_pairs)

        p[0] = n * 4
        half = 1
        while half < n:
            p[1] = half * 4
            p[2] = (n // (half * 2)) * 8
            p[4] = half
            fft_asm._fft_stage_asm(ra, ia, self._tw_addr, self._params_addr)
            half *= 2
