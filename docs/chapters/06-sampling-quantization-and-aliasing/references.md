# References: Sampling, Quantization, and Aliasing

1. [Nyquist–Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem) - Wikipedia - Formal statement of the theorem establishing that a signal must be sampled at more than twice its highest frequency for perfect reconstruction, the core mathematical limit this chapter builds its Nyquist frequency discussion around.

2. [Aliasing](https://en.wikipedia.org/wiki/Aliasing) - Wikipedia - Explains how frequency components above the Nyquist frequency fold down into false lower frequencies upon sampling, directly matching this chapter's treatment of aliasing artifacts and frequency folding.

3. [Quantization (signal processing)](https://en.wikipedia.org/wiki/Quantization_(signal_processing)) - Wikipedia - Covers mapping a continuous amplitude range onto a finite set of discrete values and the resulting quantization error, the foundation for this chapter's bit depth and full scale value discussion.

4. The Scientist and Engineer's Guide to Digital Signal Processing - Steven W. Smith - California Technical Publishing - Chapter 3, "ADC and DAC," is credited for teaching sampling, quantization, and aliasing through concrete numeric examples and minimal formal math rather than a proof-first derivation, exactly the approach this chapter follows.

5. Discrete-Time Signal Processing (3rd Edition) - Alan V. Oppenheim and Ronald W. Schafer - Prentice Hall - Originated the now-standard additive white-noise model of quantization error, letting engineers treat a nonlinear rounding operation as simple additive noise when computing the signal-to-noise ratio this chapter introduces.

6. [Nyquist Sampling Theorem - Statement, Working, Aliasing, Applications](https://www.geeksforgeeks.org/electronics-engineering/nyquist-sampling-theorem/) - GeeksforGeeks - Worked-example tutorial on the Nyquist rate and Nyquist frequency, reinforcing the fs/2 boundary this chapter uses to determine whether a captured tone will alias.

7. [Aliasing Effect - Definition, Effects, Causes, Prevention](https://www.geeksforgeeks.org/electronics-engineering/aliasing-effect/) - GeeksforGeeks - Describes how undersampling produces aliasing artifacts and how anti-aliasing filters or oversampling prevent them, complementing this chapter's productive-failure lab on deliberately aliased tones.

8. [Right Shift Operator (>>) in Programming](https://www.geeksforgeeks.org/right-shift-operator-in-programming/) - GeeksforGeeks - Explains how an arithmetic right shift preserves the sign bit while dividing a signed integer by a power of two, the exact operation this chapter uses to unpack the INMP441's 24-bit-in-32-bit sample word.

9. [How to Fix Audio Clipping](https://www.izotope.com/en/learn/how-to-fix-audio-clipping.html) - iZotope - Explains clipping, full scale (0 dBFS), and headroom in practical recording terms, reinforcing this chapter's discussion of why exceeding a fixed bit depth's maximum value is unrecoverable.

10. [Understanding Bit Depth](https://www.sonarworks.com/blog/learn/understanding-bit-depth) - Sonarworks - Explains how each additional bit of depth adds roughly 6 dB of dynamic range, directly supporting this chapter's table relating bit depth to distinct levels and quantization error.
