# Does Your CPU Have an FPU?

## Summary

This chapter teaches students to detect their own chip's floating-point and DSP capability by reading ARM architecture and feature registers, rather than assuming it from a datasheet. It distinguishes the Cortex-M0+ (no FPU) from the M4 and M33, and treats a missing capability as diagnostic information rather than a dead end. This capability probe is a prerequisite for every assembly-language chapter that follows.

## Concepts Covered

This chapter covers the following 16 concepts from the learning graph:

1. ARMv6-M
2. ARMv7-M
3. ARMv8-M
4. Capability Probing
5. Cortex M0 Plus
6. DSP Chip
7. DSP Instructions
8. FPU Presence Detection
9. FPv5-SP Unit
10. Failure Root Cause
11. Floating Point Unit
12. General Purpose CPU
13. Hardware Feature Gate
14. Instruction Set Architecture
15. MVFR0 Register
16. Portability Constraint

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)
- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)

---

TODO: Generate Chapter Content
