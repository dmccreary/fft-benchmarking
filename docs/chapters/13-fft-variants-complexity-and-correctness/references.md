# References: FFT Variants, Complexity, and Correctness

1. [Cooley–Tukey FFT algorithm](https://en.wikipedia.org/wiki/Cooley%E2%80%93Tukey_FFT_algorithm) - Wikipedia - Explains decimation-in-time and decimation-in-frequency splitting strategies plus radix-4 and mixed-radix variants, directly grounding this chapter's survey of alternatives to the radix-2 FFT built earlier in the course.

2. [Split-radix FFT algorithm](https://en.wikipedia.org/wiki/Split-radix_FFT_algorithm) - Wikipedia - Describes the hybrid radix-2/radix-4 technique that achieves among the lowest known multiplication counts for power-of-two FFT sizes, matching the chapter's split-radix discussion and its implementation-complexity tradeoff.

3. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) - Wikipedia - Covers the inverse DFT formula and the differing normalization conventions (1/N, 1/sqrt(N), or none) that different libraries adopt, the exact source of the FFT-scaling mismatches this chapter warns about.

4. Computational Frameworks for the Fast Fourier Transform - Charles Van Loan - SIAM - Van Loan is credited with representing radix-2, radix-4, and split-radix algorithms as distinct matrix factorizations of the DFT matrix, a unifying notation that makes comparing FFT variants concrete rather than purely verbal.

5. The Fast Fourier Transform and Its Applications - E. Oran Brigham - Prentice Hall - Brigham is widely credited with the clearest classical derivation of decimation in frequency as a structural mirror of decimation in time, and of the real-input spectrum-symmetry argument this chapter's real FFT discussion relies on.

6. [Fourier Transforms (numpy.fft)](https://numpy.org/doc/stable/reference/routines.fft.html) - NumPy - Official reference for numpy.fft's complex, real, and Hermitian FFT routines and normalization options, the exact desktop-only library this chapter uses to cross-validate the course's from-scratch FFT.

7. [Discrete Fourier Transforms (scipy.fft)](https://docs.scipy.org/doc/scipy/tutorial/fft.html) - SciPy - Official tutorial covering scipy.fft's real-input rfft/irfft functions and normalization modes, the specialized real-FFT alternative to NumPy this chapter names as a second calibration reference.

8. [NumPy for Fast Fourier Transform (FFT) Analysis](https://www.geeksforgeeks.org/numpy/numpy-for-fast-fourier-transform-fft-analysis/) - GeeksforGeeks - Worked walkthrough of computing and plotting an FFT with numpy.fft, illustrating in code the exact professional-library comparison point this chapter recommends running against the course's own implementation.

9. [A Block Floating Point Implementation for an N-Point FFT (SPRA948)](https://www.ti.com/lit/an/spra948/spra948.pdf) - Texas Instruments - Application note on fixed-point FFT scaling strategies and the tradeoffs between per-stage scaling and block floating point, illustrating concretely why normalization and scaling conventions differ across real implementations.

10. [8.4: The Split-Radix FFT Algorithm](https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Signal_Processing_and_Modeling/Fast_Fourier_Transforms_(Burrus)/08%3A_The_Cooley-Tukey_Fast_Fourier_Transform_Algorithm/8.04%3A_The_Split-Radix_FFT_Algorithm) - LibreTexts (C.S. Burrus, Fast Fourier Transforms) - Derives the split-radix algorithm's radix-2/radix-4 combination and its reduced arithmetic operation count, extending this chapter's table comparing radix-2, radix-4, and split-radix implementation complexity.
