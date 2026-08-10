# Shared infrastructure for the competing FFT variants.
#
# Every variant builds the same tables from here and exposes the same
# interface, so the comparison harness can drive them uniformly. If one
# variant built its tables differently, or was called through a different
# pattern, a timing difference could come from the harness rather than from
# the variant -- which would make the whole comparison meaningless.
#
# This is the "Fair Comparison" concept from the course learning graph made
# concrete: identical inputs, identical tables, identical call shape.

import math
from array import array

import dwt_timer


def bit_reverse_table(n):
    """Permutation table: element i belongs at position table[i].

    For n=512 this is a 512-entry uint16 array. Roughly half the entries map
    to themselves or to an index already visited, which variant v4 exploits.
    """
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


def swap_pairs(n):
    """Only the (i, j) index pairs that actually need exchanging.

    The baseline walks all n indices and tests `if table[i] > i` on every one.
    That test fails for most of them, so most iterations do nothing but the
    loop overhead. Precomputing just the real swaps removes both the branch
    and the wasted iterations. Used by variant v4.
    """
    table = bit_reverse_table(n)
    pairs = []
    for i in range(n):
        j = table[i]
        if j > i:
            pairs.append(i)
            pairs.append(j)
    # Flat array of alternating i, j values -- one contiguous block for asm.
    out = array("H", bytearray(2 * len(pairs)))
    for k, v in enumerate(pairs):
        out[k] = v
    return out, len(pairs) // 2


def twiddle_interleaved(n):
    """Twiddle factors as [re0, im0, re1, im1, ...] for k in 0..n/2-1.

    Interleaving lets assembly read a cos/sin pair with two VLDRs off a single
    pointer, instead of tracking two separate table pointers.
    """
    half = n // 2
    tw = array("f", bytearray(8 * half))
    for k in range(half):
        angle = -2.0 * math.pi * k / n
        tw[2 * k] = math.cos(angle)
        tw[2 * k + 1] = math.sin(angle)
    return tw


def twiddle_split(n):
    """Twiddle factors as two separate arrays (cos, sin).

    Used by variants that keep real and imaginary data in separate buffers.
    """
    half = n // 2
    tw_re = array("f", bytearray(4 * half))
    tw_im = array("f", bytearray(4 * half))
    for k in range(half):
        angle = -2.0 * math.pi * k / n
        tw_re[k] = math.cos(angle)
        tw_im[k] = math.sin(angle)
    return tw_re, tw_im


class VariantBase:
    """Common interface every variant implements.

    A variant must provide make_buffers() and run(). run_timed() is shared so
    that every variant is measured with exactly the same instrumentation --
    two DWT reads bracketing the call, nothing else inside the window.
    """

    name = "unnamed"
    label = "unnamed variant"
    # Variants that consume a real-valued signal and produce a half-spectrum
    # set this, because they cannot be compared bin-for-bin against a full
    # complex transform without a conversion step.
    half_spectrum = False
    # Set when the variant could not be built on this platform.
    unavailable_reason = None

    def __init__(self, n=512):
        self.n = n
        dwt_timer.enable()

    def make_buffers(self):
        return (array("f", bytearray(4 * self.n)),
                array("f", bytearray(4 * self.n)))

    def run(self, re, im):
        raise NotImplementedError

    def run_timed(self, re, im):
        start = dwt_timer.cycles()
        self.run(re, im)
        end = dwt_timer.cycles()
        return dwt_timer.elapsed(start, end)

    def load(self, re, im, samples):
        """Fill buffers from a sample array. Not part of the timed region."""
        n = self.n
        for i in range(n):
            re[i] = samples[i]
            im[i] = 0.0
