# References: From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly

1. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm) - Wikipedia - Describes the recursive divide-and-conquer structure that splits a DFT into even- and odd-indexed halves, the core algorithm this chapter introduces through decimation in time and the radix-2 FFT.

2. [Butterfly diagram](https://en.wikipedia.org/wiki/Butterfly_diagram) - Wikipedia - Explains the X-shaped flow-graph representation of the add/subtract recombination step, matching this chapter's butterfly operation and butterfly diagram sections, including the single shared twiddle-factor multiplication.

3. [Twiddle factor](https://en.wikipedia.org/wiki/Twiddle_factor) - Wikipedia - Defines the complex roots-of-unity multipliers used to recombine FFT sub-transforms and traces the term's origin, directly covering this chapter's twiddle factor and twiddle factor table concepts.

4. Numerical Recipes: The Art of Scientific Computing (3rd Edition) - William H. Press, Saul A. Teukolsky, William T. Vetterling, and Brian P. Flannery - Cambridge University Press - Famous for deriving the FFT via the Danielson-Lanczos lemma, splitting an N-point DFT into two N/2-point DFTs, and for the field's most widely copied version of the winged butterfly diagram this chapter presents.

5. The Fast Fourier Transform and Its Applications - E. Oran Brigham - Prentice Hall - Brigham's classic text is known for a pictorial, worked-figure derivation of how twiddle factors combine even and odd sub-transforms, favored by engineers over purely symbolic treatments for exactly the roots-of-unity material this chapter covers.

6. [How the Cooley-Tukey FFT Algorithm Works, Part 2 - Divide & Conquer](https://www.dsprelated.com/showarticle/1710.php) - dsprelated.com - Walks through the even/odd splitting step of the Cooley-Tukey algorithm using a merge-sort analogy, reinforcing this chapter's decimation-in-time and divide-and-conquer recursion-tree explanation.

7. [Fast Fourier Transformation for Polynomial Multiplication](https://www.geeksforgeeks.org/dsa/fast-fourier-transformation-poynomial-multiplication/) - GeeksforGeeks - Derives the FFT recurrence and shows twiddle factors combining sub-transform outputs with runnable code, directly illustrating this chapter's roots-of-unity and complex-multiplication material with a working example.

8. [Frequency Domain](https://pysdr.org/content/frequency_domain.html) - PySDR - Free, Python-based signal processing textbook chapter covering the FFT, negative frequencies, and windowing with runnable code, complementing this chapter's audio-processing and signal-preprocessing framing with a software-defined-radio perspective.

9. [The Fast Fourier Transform in Hardware: A Tutorial Based on an FPGA Implementation](https://web.mit.edu/6.111/www/f2017/handouts/FFTtutorial121102.pdf) - MIT OpenCourseWare - Hardware-oriented FFT tutorial covering butterfly structure and bit reversal for constrained digital logic, useful background for this chapter's eventual move toward hand-optimized microcontroller code.

10. [Root of Unity](https://mathworld.wolfram.com/RootofUnity.html) - Wolfram MathWorld - Rigorous mathematical definition of the N complex solutions to z^N = 1 and their placement on the unit circle, the precise objects this chapter names roots of unity before specializing them into twiddle factors.
