# References: Talking to the FPU: Floating-Point Assembly

1. [Floating-point unit](https://en.wikipedia.org/wiki/Floating-point_unit) - Wikipedia - Overview of dedicated FPU hardware and its separate register file, the architectural background for this chapter's introduction of the s0-s31 register bank alongside the general-purpose registers.

2. [Single-precision floating-point format](https://en.wikipedia.org/wiki/Single-precision_floating-point_format) - Wikipedia - Details the 32-bit IEEE 754 layout every `s` register holds, the exact data format this chapter's VLDR/VSTR instructions move between memory and the FPU.

3. [Multiply–accumulate operation](https://en.wikipedia.org/wiki/Multiply%E2%80%93accumulate_operation) - Wikipedia - Explains the fused multiply-add pattern computing `d = d + (a * b)` in one step, directly matching this chapter's VMLA instruction and its accuracy and speed advantages.

4. Definitive Guide to Arm Cortex-M23 and Cortex-M33 Processors - Joseph Yiu - Newnes/Elsevier - The most directly matched reference for this exact chip family, with Yiu's widely used instruction-by-instruction tables covering VLDR, VSTR, VADD, VMUL, and VMLA on the Cortex-M33's floating-point extension.

5. ARM System Developer's Guide: Designing and Optimizing System Software - Andrew N. Sloss, Dominic Symes, and Chris Wright - Morgan Kaufmann - Known for its practical treatment of implementing DSP-style multiply-accumulate loops and pointer-based buffer addressing directly in ARM/Thumb assembly, the pattern this chapter's `dot_product_fpu` follows.

6. [Arm Cortex-M33 Devices Generic User Guide: List of floating-point instructions](https://developer.arm.com/documentation/100235/0004/the-cortex-m33-instruction-set/floating-point-instructions/list-of-floating-point-instructions) - Arm Developer - Official per-instruction reference for VLDR, VSTR, VADD, VSUB, VMUL, and VMLA, the complete instruction set this chapter teaches for moving and computing on single-precision floats.

7. [Memory Instructions: Load and Store (Part 4)](https://azeria-labs.com/memory-instructions-load-and-store-part-4/) - Azeria Labs - Tutorial on base-register-plus-immediate-offset addressing such as `[r1, #4]`, the same byte-offset pointer arithmetic this chapter applies to VLDR when reading successive elements of a typed array.

8. [array — arrays of numeric data](https://docs.micropython.org/en/latest/library/array.html) - MicroPython Documentation - Reference for the `array.array('f', ...)` typed array this chapter relies on for a buffer with a fixed, predictable 4-byte-per-element stride that byte-offset arithmetic depends on.

9. [gc — control the garbage collector](https://docs.micropython.org/en/latest/library/gc.html) - MicroPython Documentation - Explains that collections trigger on allocation or a byte threshold, the mechanism behind this chapter's "no allocation in timed region" rule for keeping garbage-collection pauses out of a benchmarked routine.

10. [Fused Multiply-Add: The Key to Faster Calculations](https://www.kdab.com/fma-woes/) - KDAB - Explains why an FMA instruction rounds once instead of twice, giving the numerical-accuracy reasoning behind this chapter's claim that VMLA is slightly more accurate than separate VMUL and VADD instructions.
