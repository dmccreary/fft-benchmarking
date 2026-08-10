# Pure-Python radix-2 decimation-in-time FFT.
#
# This is NOT the deliverable -- fft_asm.py is. This module exists so the
# algorithm itself can be validated against numpy before any assembly is
# written. If the assembly version later disagrees with numpy, comparing it
# against this tells us whether the bug is in the algorithm or in the
# hand-written instruction encoding.
#
# It also provides the baseline that the assembly speedup is measured against.

import math
from array import array


def bit_reverse_table(n):
    """Permutation table: element i moves to position table[i]."""
    bits = 0
    while (1 << bits) < n:
        bits += 1
    table = array("H", bytearray(2 * n))
    for i in range(n):
        r = 0
        x = i
        for _ in range(bits):
            r = (r << 1) | (x & 1)
            x >>= 1
        table[i] = r
    return table


def twiddle_tables(n):
    """Twiddle factors W_n^k = exp(-2*pi*i*k/n) for k in 0..n/2-1."""
    half = n // 2
    tw_re = array("f", bytearray(4 * half))
    tw_im = array("f", bytearray(4 * half))
    for k in range(half):
        angle = -2.0 * math.pi * k / n
        tw_re[k] = math.cos(angle)
        tw_im[k] = math.sin(angle)
    return tw_re, tw_im


def bit_reverse_reorder(re, im, table, n):
    for i in range(n):
        j = table[i]
        if j > i:
            re[i], re[j] = re[j], re[i]
            im[i], im[j] = im[j], im[i]


def fft(re, im, tw_re, tw_im, table, n):
    """In-place radix-2 DIT FFT. re/im are array('f') of length n."""
    bit_reverse_reorder(re, im, table, n)

    half = 1
    while half < n:
        step = n // (half * 2)   # twiddle stride for this stage
        k = 0
        while k < n:
            j = 0
            while j < half:
                wr = tw_re[j * step]
                wi = tw_im[j * step]
                i1 = k + j
                i2 = i1 + half
                xr = re[i2]
                xi = im[i2]
                tr = wr * xr - wi * xi
                ti = wr * xi + wi * xr
                ar = re[i1]
                ai = im[i1]
                re[i2] = ar - tr
                im[i2] = ai - ti
                re[i1] = ar + tr
                im[i1] = ai + ti
                j += 1
            k += half * 2
        half *= 2


class FFTPython:
    """Same interface shape as fft_asm.FFT, for apples-to-apples comparison."""

    def __init__(self, n=512):
        self.n = n
        self.table = bit_reverse_table(n)
        self.tw_re, self.tw_im = twiddle_tables(n)

    def make_buffers(self):
        return (array("f", bytearray(4 * self.n)),
                array("f", bytearray(4 * self.n)))

    def run(self, re, im):
        fft(re, im, self.tw_re, self.tw_im, self.table, self.n)
