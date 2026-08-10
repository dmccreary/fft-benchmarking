# V3a -- Pure Python: the same algorithm with no acceleration at all.
#
# The bottom rung of the abstraction ladder. Every arithmetic operation goes
# through the MicroPython interpreter: each multiply allocates or unboxes
# float objects, each array index is a method dispatch, each loop iteration
# decodes bytecode.
#
# This exists to answer "what does the interpreter actually cost?" with a
# number rather than an assertion. It is the same radix-2 DIT algorithm as V0
# -- identical operation count, identical order -- so the entire difference in
# runtime is attributable to execution model, not to algorithm.
#
# Expect roughly 28.7 million cycles, about 225x slower than the assembly
# version.

from common import VariantBase, bit_reverse_table, twiddle_split


class Variant(VariantBase):
    name = "v3-python"
    label = "pure Python (interpreted)"

    def __init__(self, n=512):
        super().__init__(n)
        self.table = bit_reverse_table(n)
        self.tw_re, self.tw_im = twiddle_split(n)

    def run(self, re, im):
        n = self.n
        table = self.table
        tw_re = self.tw_re
        tw_im = self.tw_im

        for i in range(n):
            j = table[i]
            if j > i:
                re[i], re[j] = re[j], re[i]
                im[i], im[j] = im[j], im[i]

        half = 1
        while half < n:
            step = n // (half * 2)
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
