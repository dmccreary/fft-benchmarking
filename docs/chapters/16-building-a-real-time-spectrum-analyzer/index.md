# Building a Real-Time Spectrum Analyzer

## Summary

This chapter assembles capture, FFT, and display into a continuously running real-time spectrum analyzer, introducing block processing, double buffering, and hop size as the mechanics of keeping a live pipeline from stalling. It profiles the pipeline stage by stage — capture, compute, and draw time — to find the true bottleneck rather than guessing. This is the payoff chapter where every piece built so far runs together on real, live audio.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Block Processing
2. Bottleneck Identification
3. Buffer Swapping
4. Capture Time
5. Compute Time
6. Double Buffering
7. Draw Time
8. Frame Rate
9. Hop Size
10. Overlap Processing
11. Real Time Processing
12. Sound Processing
13. Spectrogram
14. Spectrum Analyzer
15. Stage Profiling
16. Streaming FFT
17. Waterfall Display

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [14. Computing and Displaying a Real Spectrum](../14-computing-and-displaying-a-real-spectrum/index.md)

---

TODO: Generate Chapter Content
