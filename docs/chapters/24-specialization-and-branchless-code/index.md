# Specialization and Branchless Code

## Summary

This chapter covers optimization techniques that exploit specific, known properties of a computation: recognizing trivial twiddle factors (multiply by one or by i), branchless code to avoid unpredictable-branch penalties, and loop unrolling. It also covers cache effects and memory access patterns as a second, independent source of performance difference from the algorithmic gains covered earlier. These techniques set up the instruction-encoding chapter that follows.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Address Computation Cost
2. Branch Prediction
3. Branchless Code
4. Cache Effects
5. Code Size Tradeoff
6. Floating Point FFT
7. Loop Overhead
8. Loop Unrolling
9. Memory Access Patterns
10. Multiply By One
11. Multiply By i
12. Optimization Attribution
13. Precomputed Swap List
14. Special Case Optimization
15. Trivial Twiddle
16. Unpredictable Branch
17. Vectorization

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)
- [22. Talking to the FPU: Floating-Point Assembly](../22-talking-to-the-fpu/index.md)
- [23. The Butterfly in Assembly: A Complete FFT and Production Libraries](../23-the-butterfly-in-assembly/index.md)

---

TODO: Generate Chapter Content
