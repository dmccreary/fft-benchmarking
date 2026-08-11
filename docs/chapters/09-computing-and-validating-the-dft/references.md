# References: Computing and Validating the DFT

1. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) - Wikipedia - Formal definition, properties, and matrix form of the DFT and its relationship to the continuous Fourier transform, the direct mathematical foundation for this chapter's DFT definition and spectrum array.

2. [Nyquist frequency](https://en.wikipedia.org/wiki/Nyquist_frequency) - Wikipedia - Explains the highest frequency representable at a given sampling rate, directly grounding this chapter's Nyquist bin, spectrum symmetry, and the negative-frequency mirroring of bins above index N/2.

3. [Approximation error](https://en.wikipedia.org/wiki/Approximation_error) - Wikipedia - Defines absolute and relative error precisely, the same distinction this chapter uses to set a numerical tolerance for judging whether a computed DFT bin matches its expected ground-truth value.

4. The Scientist and Engineer's Guide to Digital Signal Processing (2nd Edition) - Steven W. Smith - California Technical Publishing - Smith is known for presenting the DFT as a bank of correlations against sine and cosine basis waves rather than an abstract summation, the exact framing this chapter builds directly from Chapter 8's correlation.

5. Understanding Digital Signal Processing (3rd Edition) - Richard G. Lyons - Prentice Hall - Lyons is widely credited for unusually explicit, fully worked numeric DFT bin calculations that let readers check every intermediate sum by hand, the same by-hand verification habit this chapter's eight-point DFT example teaches.

6. [DSP - DFT Introduction](https://www.tutorialspoint.com/digital_signal_processing/dsp_discrete_fourier_transform_introduction.htm) - TutorialsPoint - Short, formula-driven introduction to the DFT covering frequency-domain sampling and core properties, useful as a second, more terse pass over this chapter's DFT definition and bin structure.

7. [Discrete Fourier Transform and its Inverse using C](https://www.geeksforgeeks.org/c/discrete-fourier-transform-and-its-inverse-using-c/) - GeeksforGeeks - Presents both the forward DFT and inverse DFT formulas alongside working procedural code, mirroring this chapter's Python implementation and illustrating the round-trip the inverse DFT section describes.

8. [FFT](https://ocw.mit.edu/courses/2-161-signal-processing-continuous-and-discrete-fall-2008/resources/fft) - MIT OpenCourseWare - Graduate-level lecture handout covering the DFT, FFT, and inverse FFT together, offering a more rigorous treatment of the spectrum array and inverse DFT concepts this chapter introduces at an applied level.

9. [An Interactive Guide To The Fourier Transform](https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/) - BetterExplained - Builds intuition for how a transform decomposes a signal into frequency components using interactive visuals, complementing this chapter's formal bin-by-bin DFT definition with a visual, exploratory entry point.

10. [git-bisect Documentation](https://git-scm.com/docs/git-bisect) - Git - Official documentation for git's binary-search bug-finding tool, the same halve-the-search-space strategy this chapter formalizes as debugging by bisection for isolating a failing DFT calculation.
