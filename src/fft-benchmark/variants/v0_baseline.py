# V0 -- Baseline: radix-2 DIT, hand-written assembly, split complex buffers.
#
# This is the implementation from Plan 01, wrapped in the variant interface so
# the comparison harness can drive it alongside everything else. It is the
# reference point every other variant's speedup is quoted against.
#
# Measured in Plan 01: 132,808 cycles mean, 127,086 best-of-15.
#
# Structure:
#   - Python drives a 9-iteration stage loop (negligible cost).
#   - Assembly performs all 2,304 butterflies, using the hardware FPU.
#   - Loop order within a stage is j-major: each twiddle pair is loaded once
#     per stage rather than once per butterfly.
#
# Known cost centres, from the Plan 02 profile:
#   - bit-reversal is ~17% of total runtime
#   - per-butterfly cost varies 73-93 cycles depending on stage
#   - loop overhead and memory access dominate the arithmetic

from uctypes import addressof

import fft_asm
from common import VariantBase


class Variant(VariantBase):
    name = "v0"
    label = "baseline radix-2 DIT (assembly)"

    def __init__(self, n=512):
        super().__init__(n)
        self._fft = fft_asm.FFT(n)

    def make_buffers(self):
        return self._fft.make_buffers()

    def run(self, re, im):
        self._fft.run(re, im)
