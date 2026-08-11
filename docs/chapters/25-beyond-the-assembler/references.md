# References: Beyond the Assembler: Hand-Encoding and Instruction Formats

1. [ARM architecture family](https://en.wikipedia.org/wiki/ARM_architecture_family) - Wikipedia - Covers the ARM instruction set family including the Thumb and Thumb-2 extensions, explaining how instructions mix 16-bit and 32-bit halfwords for code density and performance, the foundation for this chapter's hand-encoding.

2. [Multiply–accumulate operation](https://en.wikipedia.org/wiki/Multiply%E2%80%93accumulate_operation) - Wikipedia - Explains fused multiply-add arithmetic, contrasting single-rounding fused operations against separate multiply-then-add steps, directly clarifying why VFMA's fused rounding improves precision over a plain multiply followed by an add.

3. [Q (number format)](https://en.wikipedia.org/wiki/Q_(number_format)) - Wikipedia - Describes the Qm.n fixed-point notation, showing how integer and fractional bits are allocated and how saturating arithmetic clamps out-of-range results, the exact scheme behind Q15 and Q31.

4. The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors (3rd Edition) - Joseph Yiu - Newnes/Elsevier - Yiu's quick-reference appendices lay out instruction-encoding diagrams bit field by bit field for the Thumb and Thumb-2 instruction sets, the same opcode/register bit-field breakdown this chapter's hand-encoding exercise walks through by hand.

5. Write Great Code, Volume 1: Understanding the Machine (2nd Edition) - Randall Hyde - No Starch Press - Hyde's Chapter 2 walks through fixed-point representation and saturating arithmetic from first principles, an unusually clear, machine-level derivation of exactly the Q-format tradeoffs this chapter scopes but does not implement.

6. [ARM Architecture Reference Manual: Thumb-2 Supplement](https://class.ece.iastate.edu/cpre288/resources/docs/Thumb-2SupplementReferenceManual.pdf) - ARM Limited (official manual, course-hosted copy) - Official ARM reference manual with complete Thumb-2 instruction encoding diagrams, showing exact bit-field layouts for 16-bit and 32-bit instructions, the primary source this chapter's encoding table technique is based on.

7. [CMSIS-DSP: Vector Multiplication](https://arm-software.github.io/CMSIS-DSP/main/group__BasicMult.html) - ARM Software (CMSIS-DSP documentation) - Official ARM library documentation showing Q7, Q15, and Q31 fixed-point function variants alongside floating-point ones, with explicit saturation ranges, illustrating the fixed-point ecosystem this chapter describes but does not build.

8. [Instruction Formats](https://www.geeksforgeeks.org/computer-organization-architecture/computer-organization-instruction-formats-zero-one-two-three-address-instruction/) - GeeksforGeeks - Explains how opcode and operand fields combine into an instruction format, with worked encoding examples, reinforcing the general bit-field concept this chapter applies specifically to hand-encoding VFMA.

9. [ARM Binary Analysis — Part 7: Understanding ARM Instruction Encoding](https://medium.com/@mohamad.aerabi/arm-binary-analysis-part7-613d1dc9b9e2) - Medium (Mohamad Aerabi) - Walks through manually encoding ARM instructions field by field and verifying the result against a disassembler's output, mirroring this chapter's own hand-encode-then-verify workflow for VFMA.

10. [Using as: Pseudo-Ops](https://sourceware.org/binutils/docs-2.38/as.html) - GNU Binutils (Sourceware) - Official documentation for the GNU assembler's .byte, .hword, and .word directives that insert literal raw values into assembled output, the same role MicroPython's data() directive plays when embedding VFMA's raw machine word.
