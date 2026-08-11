# References: Windowing, Spectral Leakage, and Peak Detection

1. [Window function](https://en.wikipedia.org/wiki/Window_function) - Wikipedia - Catalogs the Hann, Hamming, and Blackman windows with their main-lobe-width and side-lobe-level tradeoffs, directly underlying this chapter's window comparison table and window table precomputation.

2. [Spectral leakage](https://en.wikipedia.org/wiki/Spectral_leakage) - Wikipedia - Explains how a signal that does not complete a whole number of cycles within a captured frame spreads its energy across neighboring bins, the exact edge-discontinuity mechanism this chapter opens with.

3. [Pitch detection algorithm](https://en.wikipedia.org/wiki/Pitch_detection_algorithm) - Wikipedia - Surveys approaches to estimating a signal's fundamental frequency, including frequency-domain peak-based methods, framing this chapter's argmax-search-plus-parabolic-interpolation pipeline within the broader field of pitch detection.

4. Discrete-Time Signal Processing (3rd Edition) - Alan V. Oppenheim and Ronald W. Schafer - Prentice Hall - This text's widely adopted comparison table of window main-lobe width versus side-lobe level, built on Fredric Harris's landmark 1978 windowing survey, is the standard reference other DSP textbooks' own window tradeoff tables are modeled on.

5. Spectral Audio Signal Processing - Julius O. Smith III - W3K Publishing - Smith is credited with the widely reused closed-form derivation of quadratic (parabolic) interpolation through three adjacent spectral samples for sub-bin peak-frequency estimation, the exact formula this chapter uses for parabolic interpolation.

6. [Understanding FFTs and Windowing](https://www.ni.com/en/shop/data-acquisition/measurement-fundamentals/analog-fundamentals/understanding-ffts-and-windowing.html) - National Instruments - Explains how windowing tapers a captured record toward zero at its edges to reduce spectral leakage, and surveys Hann, Hamming, and Blackman-Harris windows and when to choose each, mirroring this chapter's window selection guidance.

7. [Window Functions in Spectrum Analyzers](https://www.tek.com/en/blog/window-functions-spectrum-analyzers) - Tektronix - Compares Hann, Hamming, and Blackman-Harris windows by side-lobe suppression and main-lobe width, illustrating the identical no-free-lunch window tradeoff this chapter states as a fundamental, unavoidable relationship.

8. [Spectral Analysis of Signals](http://www.dspguide.com/ch9/1.htm) - dspguide.com (Steven W. Smith) - Free chapter covering spectral leakage, the resolution-versus-leakage tradeoff of different windows, and frequency resolution limits, closely paralleling this chapter's treatment of the same topics with additional worked spectral examples.

9. [FFT frequency measurement resolution by parabolic and other interpolations](https://mgasior.web.cern.ch/pap/FFT_resol_note.pdf) - CERN (M. Gasior) - Technical note quantifying how much parabolic interpolation improves frequency-measurement resolution beyond raw bin width, directly supporting this chapter's sub-bin accuracy claims for parabolic interpolation.

10. [Windowing - Fundamentals of Signal Processing](https://vru.vibrationresearch.com/lesson/windowing-process-data/) - Vibration Research University - Explains why an uncorrected edge discontinuity causes leakage and gives practical guidance for choosing between rectangular, flat-top, Hann, Hamming, and Blackman windows, reinforcing this chapter's window-selection decision.
