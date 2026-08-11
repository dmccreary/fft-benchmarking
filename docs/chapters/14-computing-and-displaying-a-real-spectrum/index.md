# Computing and Displaying a Real Spectrum

## Summary

This chapter applies the FFT to real captured audio for the first time, converting complex FFT output into magnitude and phase spectra, and then into a decibel scale suitable for display on the OLED. It introduces the whistle test — sweeping pitch by ear and watching the displayed peak follow — as the first end-to-end validation that the whole pipeline works on real sound. This chapter also revisits the RMS-based level-meter ideas from the correlation chapter in the context of spectral display.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Bin Averaging For Display
2. Decibel Conversion
3. Decibel Scale
4. Fast Magnitude Approximation
5. Frame Capture
6. Half Spectrum Display
7. Level Meter
8. Live Spectrum Display
9. Logarithmic Scaling
10. Magnitude Calculation
11. Magnitude Computation
12. Magnitude Spectrum
13. Phase Calculation
14. Phase Spectrum
15. Post Processing
16. Power Spectrum
17. Power Versus Magnitude
18. Spectral Analysis
19. Spectrum Bars
20. Spectrum Plot
21. Square Root Scaling
22. Whistle Test

## Prerequisites

This chapter builds on concepts from:

- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [8. Correlation: Does My Signal Contain This Note?](../08-correlation/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)

---

TODO: Generate Chapter Content
