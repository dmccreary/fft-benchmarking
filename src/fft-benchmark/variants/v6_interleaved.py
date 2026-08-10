# V6 -- Interleaved complex layout: one array instead of two.
#
# The baseline keeps real and imaginary parts in separate buffers ("split
# complex"):
#
#     real: [r0][r1][r2][r3]...      imag: [i0][i1][i2][i3]...
#
# This variant interleaves them, the layout a C `complex float` array uses:
#
#     data: [r0][i0][r1][i1][r2][i2]...
#
# What changes in the inner loop:
#
#   Baseline    two base pointers (r0, r1), so every element access costs a
#               separate address computation. The butterfly does four of them
#               per iteration: add r6,r0,r3 / add r6,r6,r4 / add r6,r1,r3 /
#               add r6,r6,r4.
#
#   Interleaved one base pointer. A complex value's real and imaginary parts
#               are 4 bytes apart, so both are reachable from ONE address with
#               different VLDR immediate offsets: vldr s2,[r6,0] and
#               vldr s3,[r6,4]. Two address computations become one.
#
# Expected: fewer `add` instructions per butterfly, so a modest gain.
#
# Note on why this is NOT primarily a cache-locality argument: the RP2350 runs
# this data from SRAM, which has no data cache. On a desktop CPU interleaving
# would also improve cache line utilisation; here the benefit is purely fewer
# address computations. A good reminder that an optimization's justification
# is platform-specific -- measure, do not transplant assumptions.
#
# The cost: the caller must convert between layouts. The harness measures only
# run(), so the conversion is charged honestly to setup, not hidden -- but a
# real application would need to produce interleaved data natively for this
# variant to be worth it.

import micropython
from array import array
from uctypes import addressof

from common import VariantBase, bit_reverse_table, twiddle_interleaved


@micropython.asm_thumb
def _bitrev_inter_asm(r0, r1, r2, r3):
    # r0 = &data[0] (interleaved)   r1 = &table[0]   r2 = n   r3 = unused
    # A complex element is 8 bytes, so index i lives at byte offset i*8.
    mov(r4, 0)                      # i

    label(BI_LOOP)
    lsl(r6, r4, 1)
    add(r6, r1, r6)
    ldrh(r5, [r6, 0])               # j = table[i]
    cmp(r5, r4)
    ble(BI_NEXT)

    lsl(r6, r4, 3)                  # i*8
    add(r6, r0, r6)
    lsl(r7, r5, 3)                  # j*8
    add(r7, r0, r7)
    # swap both halves of the complex value with one base each
    vldr(s0, [r6, 0])
    vldr(s1, [r6, 4])
    vldr(s2, [r7, 0])
    vldr(s3, [r7, 4])
    vstr(s2, [r6, 0])
    vstr(s3, [r6, 4])
    vstr(s0, [r7, 0])
    vstr(s1, [r7, 4])

    label(BI_NEXT)
    add(r4, 1)
    cmp(r4, r2)
    blt(BI_LOOP)


@micropython.asm_thumb
def _stage_inter_asm(r0, r1, r2, r3):
    # r0 = &data[0] (interleaved)   r1 = &twiddle[0]   r2 = &params[0]
    # r3 = unused
    #   params[0] = n*8       end byte offset (complex elements are 8 bytes)
    #   params[1] = half*8    byte gap to the paired element
    #   params[2] = stride    twiddle advance in bytes
    #   params[4] = half      j countdown
    ldr(r4, [r2, 4])                # half*8
    ldr(r5, [r2, 16])               # half
    ldr(r7, [r2, 8])                # twiddle stride
    ldr(r6, [r2, 0])                # n*8
    vmov(s30, r6)
    mov(r6, 0)
    vmov(s29, r6)

    label(JI_LOOP)
    vldr(s0, [r1, 0])               # wr
    vldr(s1, [r1, 4])               # wi
    vmov(r3, s29)                   # byte offset of i1

    label(KI_LOOP)
    add(r6, r0, r3)                 # &data[i1] -- ONE address for both parts
    vldr(s2, [r6, 0])               # ar
    vldr(s3, [r6, 4])               # ai
    add(r6, r6, r4)                 # &data[i2]
    vldr(s4, [r6, 0])               # xr
    vldr(s5, [r6, 4])               # xi

    vmul(s6, s0, s4)
    vmul(s9, s1, s5)
    vsub(s6, s6, s9)                # tr
    vmul(s7, s0, s5)
    vmul(s8, s1, s4)
    vadd(s7, s7, s8)                # ti

    vsub(s8, s2, s6)                # real out, i2
    vsub(s9, s3, s7)                # imag out, i2
    vstr(s8, [r6, 0])
    vstr(s9, [r6, 4])
    vadd(s2, s2, s6)                # real out, i1
    vadd(s3, s3, s7)                # imag out, i1
    add(r6, r0, r3)
    vstr(s2, [r6, 0])
    vstr(s3, [r6, 4])

    add(r3, r3, r4)
    add(r3, r3, r4)
    vmov(r6, s30)
    cmp(r3, r6)
    blt(KI_LOOP)

    add(r1, r1, r7)
    vmov(r6, s29)
    add(r6, 8)                      # next j = next complex element
    vmov(s29, r6)
    sub(r5, 1)
    cmp(r5, 0)
    bgt(JI_LOOP)


class Variant(VariantBase):
    name = "v6"
    label = "interleaved complex layout"

    def __init__(self, n=512):
        super().__init__(n)
        self.table = bit_reverse_table(n)
        self.twiddle = twiddle_interleaved(n)
        self.data = array("f", bytearray(8 * n))     # interleaved work buffer
        self.params = array("i", [0, 0, 0, 0, 0])
        self._table_addr = addressof(self.table)
        self._tw_addr = addressof(self.twiddle)
        self._data_addr = addressof(self.data)
        self._params_addr = addressof(self.params)

    def _kernel(self):
        """The transform itself, operating on already-interleaved data."""
        n = self.n
        da = self._data_addr
        p = self.params
        _bitrev_inter_asm(da, self._table_addr, n, 0)

        p[0] = n * 8
        half = 1
        while half < n:
            p[1] = half * 8
            p[2] = (n // (half * 2)) * 8
            p[4] = half
            _stage_inter_asm(da, self._tw_addr, self._params_addr, 0)
            half *= 2

    def run(self, re, im):
        n = self.n
        data = self.data
        # Convert split -> interleaved. Charged to run() honestly rather than
        # hidden in setup, because a fair comparison must include whatever the
        # variant needs to consume the same input as everyone else.
        for i in range(n):
            data[2 * i] = re[i]
            data[2 * i + 1] = im[i]

        self._kernel()

        for i in range(n):
            re[i] = data[2 * i]
            im[i] = data[2 * i + 1]

    def kernel_cycles(self, re, im):
        """Time ONLY the transform, excluding layout conversion.

        The conversion cost is real and run() charges it. But an application
        that produced interleaved data natively would pay only this. Reporting
        both numbers is what makes the tradeoff legible rather than just
        showing a variant that "lost".
        """
        import dwt_timer
        n = self.n
        data = self.data
        for i in range(n):
            data[2 * i] = re[i]
            data[2 * i + 1] = im[i]
        start = dwt_timer.cycles()
        self._kernel()
        end = dwt_timer.cycles()
        return dwt_timer.elapsed(start, end)
