# Beyond the Assembler: Hand-Encoding and Instruction Formats

## Summary

This chapter goes one level below the assembler, hand-encoding a machine instruction the assembler itself refuses to emit, and covers opcode formats, bit fields, and Thumb-2 encoding along the way. It also discusses fixed-point Q15/Q31 arithmetic and why this course doesn't implement it, as a scoped tradeoff rather than an oversight. This is the deepest point in the book's abstraction ladder.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Assembler Limitation
2. Data Directive
3. Disassembly
4. Encoding Bit Field
5. Encoding Table
6. Encoding Verification
7. Fixed Point Arithmetic
8. Fixed Point FFT
9. Fused Multiply Add
10. Fused Rounding
11. Halfword
12. ISA Versus Toolchain
13. Instruction Encoding
14. Integer FFT
15. Opcode
16. Precision Tradeoffs
17. Q Format Numbers
18. Q15 Format
19. Q31 Format
20. Raw Machine Word
21. Saturating Arithmetic
22. Thumb-2 Encoding
23. VFMA Instruction

## Prerequisites

This chapter builds on concepts from:

- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)
- [22. Talking to the FPU: Floating-Point Assembly](../22-talking-to-the-fpu/index.md)
- [24. Specialization and Branchless Code](../24-specialization-and-branchless-code/index.md)

---

TODO: Generate Chapter Content
