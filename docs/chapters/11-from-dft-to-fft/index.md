# From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly

## Summary

This chapter introduces the Cooley-Tukey insight that a DFT can be split recursively into smaller DFTs on even- and odd-indexed samples, and defines the twiddle factors and butterfly operation that combine the results back together. It covers bit reversal and in-place computation as the bookkeeping the algorithm needs to run without extra memory. These pieces are assembled into a complete, validated implementation in the next chapter.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Amplitude Normalization
2. Audio Processing
3. Bit Reversal
4. Butterfly Diagram
5. Butterfly Operation
6. Complex Multiplication
7. Cooley Tukey Algorithm
8. DC Offset Removal
9. Data Flow Graph
10. Decimation In Time
11. FFT Algorithm
12. FFT History
13. FFT Stages
14. Four Multiply Form
15. In Place FFT
16. Interleaved Storage
17. Loop Invariant Hoisting
18. Normalization
19. Precomputation
20. Radix-2 FFT
21. Roots Of Unity
22. Signal Preprocessing
23. Twiddle Factor Table
24. Twiddle Factors

## Prerequisites

This chapter builds on concepts from:

- [4. Waves: Amplitude, Frequency, Phase, and Harmonics](../04-waves/index.md)
- [5. Capturing Real Audio: The I2S Microphone](../05-capturing-real-audio/index.md)
- [6. Sampling, Quantization, and Aliasing](../06-sampling-quantization-and-aliasing/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)

---

TODO: Generate Chapter Content
