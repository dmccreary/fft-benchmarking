# V3c -- @micropython.viper: compiled with native machine types.
#
# Viper goes further than @native: annotated values become raw machine words
# rather than MicroPython objects, and ptr8/ptr16/ptr32 give direct unboxed
# memory access.
#
# The catch, and the lesson: viper's native types are INTEGER types. There is
# no ptr_f32, so a float array cannot be accessed unboxed the way an int array
# can. Loop counters and index arithmetic get the full viper speedup; the
# float multiplies and the array element access do not.
#
# This makes viper an awkward fit for a floating-point FFT specifically -- and
# that is worth measuring rather than asserting, because viper is often
# recommended as "assembly-speed Python" without that caveat. Expect a real
# but modest gain over @native, far short of the assembly version.
#
# (A viper implementation operating on fixed-point INTEGER data would fare
# much better. That is a different variant, and is what makes the blocked Q15
# work in Plan 02 section V9 interesting.)

import micropython

from common import VariantBase, bit_reverse_table, twiddle_split


@micropython.viper
def _bitrev_viper(re, im, table, n: int):
    # Index arithmetic and the loop are fully typed; the element swap still
    # goes through object access because the payload is float.
    i = 0
    while i < n:
        j = int(table[i])
        if j > i:
            tr = re[i]
            re[i] = re[j]
            re[j] = tr
            ti = im[i]
            im[i] = im[j]
            im[j] = ti
        i += 1


@micropython.viper
def _stage_viper(re, im, tw_re, tw_im, n: int, half: int, step: int):
    k = 0
    while k < n:
        j = 0
        while j < half:
            idx = j * step
            wr = tw_re[idx]
            wi = tw_im[idx]
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


class Variant(VariantBase):
    name = "v3-viper"
    label = "@micropython.viper (typed ints, boxed floats)"

    def __init__(self, n=512):
        super().__init__(n)
        self.table = bit_reverse_table(n)
        self.tw_re, self.tw_im = twiddle_split(n)

    def run(self, re, im):
        n = self.n
        _bitrev_viper(re, im, self.table, n)
        half = 1
        while half < n:
            _stage_viper(re, im, self.tw_re, self.tw_im, n, half, n // (half * 2))
            half *= 2
