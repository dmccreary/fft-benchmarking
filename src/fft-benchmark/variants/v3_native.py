# V3b -- @micropython.native: the same Python source, compiled to machine code.
#
# The native emitter compiles Python bytecode into ARM machine instructions
# instead of interpreting it. Control flow, function calls and local variable
# access become native code. But values are still MicroPython objects: a float
# multiply still goes through the runtime's object layer, allocating and
# unboxing.
#
# So this rung isolates one specific cost: bytecode dispatch. Whatever
# improvement appears here came from removing the interpreter loop, not from
# changing how arithmetic is performed. The gap that remains between this and
# V0 is the cost of boxed object arithmetic.
#
# Middle rung of the ladder: V3-python -> V3-native -> V3-viper -> V0.

import micropython

from common import VariantBase, bit_reverse_table, twiddle_split


@micropython.native
def _fft_native(re, im, tw_re, tw_im, table, n):
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


class Variant(VariantBase):
    name = "v3-native"
    label = "@micropython.native (compiled, boxed floats)"

    def __init__(self, n=512):
        super().__init__(n)
        self.table = bit_reverse_table(n)
        self.tw_re, self.tw_im = twiddle_split(n)

    def run(self, re, im):
        _fft_native(re, im, self.tw_re, self.tw_im, self.table, self.n)
