# 512-point radix-2 FFT with the arithmetic hand-written in ARM assembly.
#
# Runs on stock MicroPython -- no custom firmware, no toolchain. The inner
# loops are @micropython.asm_thumb using the Cortex-M33 hardware FPU
# (VLDR/VSTR/VADD/VSUB/VMUL on s0-s31), so the heavy arithmetic executes as
# native instructions rather than interpreted bytecode.
#
# Student use:
#     from fft_asm import FFT
#     fft = FFT(512)
#     re, im = fft.make_buffers()
#     for i, sample in enumerate(my_samples):
#         re[i] = sample
#     cycles = fft.run_timed(re, im)      # in-place, returns CPU cycles
#     mags = fft.magnitude(re, im)
#
# Design notes:
#   - Buffers are array('f') and are passed to assembly by address, so no
#     copying happens per call and nothing is allocated inside the timed region.
#   - Work split: Python drives the 9-iteration stage loop (negligible), and
#     assembly does every butterfly within a stage (2304 total) in one call.
#   - asm_thumb allows at most 4 arguments, so per-stage constants travel in a
#     small array('i') that the routine reads on entry.

import math
import micropython
from array import array
from uctypes import addressof

import dwt_timer


@micropython.asm_thumb
def _bit_reverse_asm(r0, r1, r2, r3):
    # r0 = &real[0]   r1 = &imag[0]   r2 = &table[0] (uint16)   r3 = n
    #
    # Swaps element i with element table[i] when table[i] > i, so each pair is
    # exchanged exactly once. A float32 swap is just a 32-bit word swap, but we
    # move the values through FPU registers to keep r6/r7 free for addresses.
    mov(r4, 0)                      # i = 0

    label(BR_LOOP)
    lsl(r6, r4, 1)                  # i*2 (uint16 table)
    add(r6, r2, r6)
    ldrh(r5, [r6, 0])               # j = table[i]
    cmp(r5, r4)
    ble(BR_NEXT)                    # only act when j > i

    lsl(r6, r4, 2)                  # i*4
    add(r6, r0, r6)                 # &real[i]
    lsl(r7, r5, 2)                  # j*4
    add(r7, r0, r7)                 # &real[j]
    vldr(s0, [r6, 0])
    vldr(s1, [r7, 0])
    vstr(s1, [r6, 0])
    vstr(s0, [r7, 0])

    lsl(r6, r4, 2)
    add(r6, r1, r6)                 # &imag[i]
    lsl(r7, r5, 2)
    add(r7, r1, r7)                 # &imag[j]
    vldr(s0, [r6, 0])
    vldr(s1, [r7, 0])
    vstr(s1, [r6, 0])
    vstr(s0, [r7, 0])

    label(BR_NEXT)
    add(r4, 1)
    cmp(r4, r3)
    blt(BR_LOOP)


@micropython.asm_thumb
def _fft_stage_asm(r0, r1, r2, r3):
    # r0 = &real[0]   r1 = &imag[0]   r2 = &twiddle[0] (interleaved re,im)
    # r3 = &params[0], an array('i'):
    #        params[0] = n * 4            end byte offset
    #        params[1] = half * 4         byte gap between the butterfly pair
    #        params[2] = stride bytes     twiddle advance per j
    #        params[3] = unused
    #        params[4] = half             inner iteration count
    #
    # Loop order is j-major: for each twiddle factor, sweep every block that
    # uses it. That loads each twiddle pair once per stage rather than once per
    # butterfly. Two spill slots live in FPU registers (s29, s30) because the
    # eight low core registers are all committed.
    ldr(r4, [r3, 4])                # r4 = half*4  (pair gap, stays put)
    ldr(r5, [r3, 16])               # r5 = half    (j countdown)
    ldr(r7, [r3, 8])                # r7 = twiddle stride in bytes
    ldr(r6, [r3, 0])                # n*4
    vmov(s30, r6)                   # park the end offset
    mov(r6, 0)
    vmov(s29, r6)                   # park j's byte offset (starts at 0)

    label(J_LOOP)
    vldr(s0, [r2, 0])               # wr
    vldr(s1, [r2, 4])               # wi
    vmov(r3, s29)                   # i1 = j  (first block, k = 0)

    label(K_LOOP)
    # --- load the pair -------------------------------------------------
    add(r6, r0, r3)                 # &real[i1]
    vldr(s2, [r6, 0])               # ar
    add(r6, r6, r4)                 # &real[i2]
    vldr(s4, [r6, 0])               # xr
    vmul(s6, s0, s4)                # wr*xr
    vmul(s8, s1, s4)                # wi*xr
    add(r6, r1, r3)                 # &imag[i1]
    vldr(s3, [r6, 0])               # ai
    add(r6, r6, r4)                 # &imag[i2]
    vldr(s5, [r6, 0])               # xi
    vmul(s7, s0, s5)                # wr*xi
    vmul(s9, s1, s5)                # wi*xi

    # --- the butterfly -------------------------------------------------
    vsub(s6, s6, s9)                # tr = wr*xr - wi*xi
    vadd(s7, s7, s8)                # ti = wr*xi + wi*xr
    vsub(s8, s2, s6)                # real[i2] = ar - tr
    vadd(s2, s2, s6)                # real[i1] = ar + tr
    vsub(s9, s3, s7)                # imag[i2] = ai - ti
    vadd(s3, s3, s7)                # imag[i1] = ai + ti

    # --- store back ----------------------------------------------------
    add(r6, r0, r3)
    vstr(s2, [r6, 0])
    add(r6, r6, r4)
    vstr(s8, [r6, 0])
    add(r6, r1, r3)
    vstr(s3, [r6, 0])
    add(r6, r6, r4)
    vstr(s9, [r6, 0])

    # --- next block: i1 += 2*half --------------------------------------
    add(r3, r3, r4)
    add(r3, r3, r4)
    vmov(r6, s30)                   # end offset
    cmp(r3, r6)
    blt(K_LOOP)

    # --- next twiddle ---------------------------------------------------
    add(r2, r2, r7)                 # advance twiddle by one stride
    vmov(r6, s29)
    add(r6, 4)                      # j += 1 element
    vmov(s29, r6)
    sub(r5, 1)
    cmp(r5, 0)
    bgt(J_LOOP)


class FFT:
    """In-place radix-2 FFT with an assembly core.

    The tables are built once here, so nothing is computed or allocated during
    a transform -- run() and run_timed() touch only the assembly routines.
    """

    def __init__(self, n=512):
        bits = 0
        while (1 << bits) < n:
            bits += 1
        if (1 << bits) != n:
            raise ValueError("n must be a power of two")

        self.n = n
        self.bits = bits

        # Bit-reversal permutation.
        self.table = array("H", bytearray(2 * n))
        for i in range(n):
            r = 0
            x = i
            for _ in range(bits):
                r = (r << 1) | (x & 1)
                x >>= 1
            self.table[i] = r

        # Twiddle factors, interleaved as [re0, im0, re1, im1, ...] so the
        # assembly reads a pair with two VLDRs off one pointer.
        half = n // 2
        self.twiddle = array("f", bytearray(8 * half))
        for k in range(half):
            angle = -2.0 * math.pi * k / n
            self.twiddle[2 * k] = math.cos(angle)
            self.twiddle[2 * k + 1] = math.sin(angle)

        self.params = array("i", [0, 0, 0, 0, 0])

        # Cache the addresses so run() does no attribute-heavy work per stage.
        self._table_addr = addressof(self.table)
        self._tw_addr = addressof(self.twiddle)
        self._params_addr = addressof(self.params)

        dwt_timer.enable()

    def make_buffers(self):
        """Two zeroed float32 buffers of length n (real, imag)."""
        return (array("f", bytearray(4 * self.n)),
                array("f", bytearray(4 * self.n)))

    def run(self, re, im):
        """In-place forward FFT. re and im must be array('f') of length n."""
        n = self.n
        re_addr = addressof(re)
        im_addr = addressof(im)
        params = self.params

        _bit_reverse_asm(re_addr, im_addr, self._table_addr, n)

        params[0] = n * 4
        half = 1
        while half < n:
            step = n // (half * 2)
            params[1] = half * 4
            params[2] = step * 8        # interleaved pairs -> 8 bytes each
            params[4] = half
            _fft_stage_asm(re_addr, im_addr, self._tw_addr, self._params_addr)
            half *= 2

    def run_timed(self, re, im):
        """Run the FFT and return the elapsed CPU cycles.

        The DWT reads bracket the transform itself; the buffers and tables
        already exist, so nothing but the FFT is inside the measured window.
        """
        start = dwt_timer.cycles()
        self.run(re, im)
        end = dwt_timer.cycles()
        return dwt_timer.elapsed(start, end)

    def magnitude(self, re, im, out=None):
        """Magnitude spectrum. Allocates unless a buffer is supplied."""
        n = self.n
        if out is None:
            out = array("f", bytearray(4 * n))
        for i in range(n):
            out[i] = math.sqrt(re[i] * re[i] + im[i] * im[i])
        return out
