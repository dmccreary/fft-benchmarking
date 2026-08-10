# fftlab.py -- the FFT you built in Lab 20, packaged as a library.
#
# Nothing new here. This is exactly the algorithm from
# docs/labs/20-complete-python-fft, moved into /lib so the later labs can
# import it instead of pasting twenty lines into every file.
#
# That is what libraries are FOR, and you now know precisely what is inside
# this one -- which is a much better position than trusting a black box.
#
#     from fftlab import FFT
#     f = FFT(256)
#     re, im = f.buffers()
#     ...fill re with samples...
#     f.run(re, im)
#     mags = f.magnitudes(re, im)

import math


class FFT:
    """In-place iterative radix-2 FFT with precomputed tables."""

    def __init__(self, n):
        bits = 0
        while (1 << bits) < n:
            bits += 1
        if (1 << bits) != n:
            raise ValueError("n must be a power of two")

        self.n = n
        self.bits = bits

        # Lab 18: the bit-reversal permutation, computed once.
        self.rev = []
        for i in range(n):
            r = 0
            x = i
            for _ in range(bits):
                r = (r << 1) | (x & 1)
                x >>= 1
            self.rev.append(r)

        # Lab 18: the twiddle factors, computed once.
        half = n // 2
        self.tw_re = [0.0] * half
        self.tw_im = [0.0] * half
        for k in range(half):
            angle = -2 * math.pi * k / n
            self.tw_re[k] = math.cos(angle)
            self.tw_im[k] = math.sin(angle)

    def buffers(self):
        """A fresh pair of real/imaginary buffers."""
        return [0.0] * self.n, [0.0] * self.n

    def run(self, re, im):
        """Transform in place. Lab 20's algorithm, unchanged."""
        n = self.n
        rev = self.rev
        tw_re = self.tw_re
        tw_im = self.tw_im

        for i in range(n):
            j = rev[i]
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
                    tr = wr * re[i2] - wi * im[i2]
                    ti = wr * im[i2] + wi * re[i2]
                    ar = re[i1]
                    ai = im[i1]
                    re[i1] = ar + tr
                    im[i1] = ai + ti
                    re[i2] = ar - tr
                    im[i2] = ai - ti
                    j += 1
                k += half * 2
            half *= 2

    def magnitudes(self, re, im, out=None):
        """Magnitude of every bin. Only the first n/2+1 are meaningful."""
        n = self.n
        if out is None:
            out = [0.0] * (n // 2 + 1)
        for k in range(len(out)):
            out[k] = math.sqrt(re[k] * re[k] + im[k] * im[k])
        return out

    def fast_magnitudes(self, re, im, out=None):
        """Approximate magnitude without sqrt.

            |z| ~= max(|re|,|im|) + 0.4 * min(|re|,|im|)

        Within about 4% of the true value, and noticeably faster -- worth it
        when the answer is going to be drawn as a bar 40 pixels tall.
        """
        n = self.n
        if out is None:
            out = [0.0] * (n // 2 + 1)
        for k in range(len(out)):
            a = re[k] if re[k] >= 0 else -re[k]
            b = im[k] if im[k] >= 0 else -im[k]
            out[k] = (a + 0.4 * b) if a > b else (b + 0.4 * a)
        return out

    def bin_hz(self, k, sample_rate):
        return k * sample_rate / self.n

    def bin_width(self, sample_rate):
        return sample_rate / self.n
