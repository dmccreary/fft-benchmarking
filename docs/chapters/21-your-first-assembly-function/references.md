# References: Your First Assembly Function: Registers and Loops

1. [Assembly language](https://en.wikipedia.org/wiki/Assembly_language) - Wikipedia - Overview of assembly language as a human-readable stand-in for machine code, covering mnemonics, assemblers, and the register-based programming model this chapter introduces from zero.

2. [Thumb (instruction set)](https://en.wikipedia.org/wiki/Thumb_(instruction_set)) - Wikipedia - Explains ARM's compact 16/32-bit Thumb encoding used by every Cortex-M core, directly matching the chapter's claim that all Cortex-M33 instructions are Thumb instructions.

3. [Processor register](https://en.wikipedia.org/wiki/Processor_register) - Wikipedia - Describes CPU registers as fast on-chip storage, background for the chapter's introduction of the Cortex-M33's thirteen general-purpose registers r0-r12.

4. The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors (3rd Edition) - Joseph Yiu - Newnes/Elsevier - The standard, most widely cited clear explanation of Cortex-M registers, Thumb instruction mnemonics, and the argument/return-value register convention this chapter builds its first routine on.

5. Computer Organization and Design ARM Edition - David A. Patterson and John L. Hennessy - Morgan Kaufmann - Known for exceptionally clear, worked-example pedagogy on register allocation and calling conventions, the exact skill this chapter frames as "deciding what goes where" in `sum_to_n`.

6. [Arm Cortex-M33 Devices Generic User Guide: The Cortex-M33 Instruction Set](https://developer.arm.com/documentation/100235/0100/The-Cortex-M33-Instruction-Set) - Arm Developer - Official Arm reference listing every Cortex-M33 Thumb instruction, including MOV, ADD, CMP, and the conditional branches this chapter's loop example is built from.

7. [ARM Data Types and Registers (Part 2)](https://azeria-labs.com/arm-data-types-and-registers-part-2/) - Azeria Labs - Tutorial covering the general-purpose register file r0-r15 and the CPSR status flags, reinforcing this chapter's explanation of how CMP sets flags that BNE later reads.

8. [Inline assembler](https://docs.micropython.org/en/latest/pyboard/tutorial/assembler.html) - MicroPython Documentation - Official tutorial on the `@micropython.asm_thumb` decorator, argument passing through r0-r3, and writing labeled branch loops, the exact mechanism this chapter's `sum_to_n` example uses.

9. [Procedure Call Standard for the Arm Architecture (AAPCS32)](https://github.com/ARM-software/abi-aa/blob/main/aapcs32/aapcs32.rst) - Arm Software (GitHub) - The official specification defining how r0-r3 pass arguments and how r0 returns a result, the formal basis for this chapter's argument-passing and return-value-register convention.

10. [Arm Cortex-M33 Processor Technical Reference Manual: Processor core registers summary](https://developer.arm.com/documentation/100230/0004/functional-description/programmers-model/processor-core-registers-summary) - Arm Developer - Authoritative summary of r0-r12, sp, lr, and pc on the exact processor this course targets, supporting the chapter's register-allocation discussion.
