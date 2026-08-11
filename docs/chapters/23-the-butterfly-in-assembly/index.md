# The Butterfly in Assembly: A Complete FFT and Production Libraries

## Summary

This chapter hand-writes the FFT's butterfly operation in ARM assembly and assembles it into a complete transform that matches the Python version bit for bit. It then surveys production FFT libraries — CMSIS-DSP, KissFFT, FFTW, and others — and their licensing, to explain why real systems call a well-tested library rather than writing their own. This chapter is the assembly module's capstone result.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. API Documentation
2. Arm Math Library
3. Assembly Butterfly
4. Assembly Debugging
5. Bit For Bit Match
6. CMSIS DSP Library
7. FFT Libraries
8. FFTW Library
9. GPL License
10. Hot Loop
11. Kiss FFT
12. Library Integration
13. Library Licensing
14. Library Over Handwritten Code
15. MIT License
16. Open Source FFT
17. Pico SDK FFT
18. Python Assembly Boundary
19. Register Pressure
20. Register Spilling
21. Scratch Register
22. Stage Parameter Block
23. Work Split Strategy

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)
- [22. Talking to the FPU: Floating-Point Assembly](../22-talking-to-the-fpu/index.md)

---

TODO: Generate Chapter Content
