# References: Does Your CPU Have an FPU?

1. [Floating-point unit](https://en.wikipedia.org/wiki/Floating-point_unit) - Wikipedia - Explains what a dedicated FPU does in silicon and why chips without one must emulate floating-point math in slow software, the core distinction this chapter's capability probe is built to detect.

2. [ARM Cortex-M](https://en.wikipedia.org/wiki/ARM_Cortex-M) - Wikipedia - Surveys the Cortex-M family including the M0+, M4, and M33 cores and notes which implement an optional FPU, matching the chapter's comparison table of ISA generations and their hardware capabilities.

3. [Instruction set architecture](https://en.wikipedia.org/wiki/Instruction_set_architecture) - Wikipedia - Defines the ISA as the contract between hardware and software, the concept this chapter uses to explain why ARMv6-M, ARMv7-M, and ARMv8-M chips can execute different instruction vocabularies despite sharing a processor family name.

4. ARM System-on-Chip Architecture (2nd Edition) - Steve Furber - Addison-Wesley - Furber, who co-designed the original ARM processor, wrote the definitive account of ARM's instruction-set evolution and the hardware tradeoffs behind general-purpose versus DSP-oriented processor extensions, the lineage this chapter's ARMv6-M/v7-M/v8-M comparison surveys.

5. The Definitive Guide to Arm Cortex-M23 and Cortex-M33 Processors - Joseph Yiu - Newnes (Elsevier) - Yiu's chapter on the Cortex-M33's FPU is the standard reference for probing MVFR0 and CPACR in code to confirm floating-point hardware exists before using it, the exact capability-probing pattern this chapter builds.

6. [Detecting and Enabling Floating-Point Unit (FPU) on ARM Cortex-M4 Processors](https://www.systemonchips.com/detecting-and-enabling-floating-point-unit-fpu-on-arm-cortex-m4-processors/) - System on Chips - Shows how to read the CPACR register and check its bit fields in code to confirm FPU presence before enabling it, the same register-read-then-branch pattern this chapter's `has_single_precision_fpu()` function uses on MVFR0.

7. [Raspberry Pi RP2350](https://www.raspberrypi.com/products/rp2350/) - Raspberry Pi Ltd - Official product page confirming the RP2350's dual Cortex-M33 cores include hardware single-precision floating point and DSP instructions, the exact chip and capability this chapter's probe is written to confirm on the reader's own Pico 2.

8. [Co-Processor - Computer Architecture](https://www.geeksforgeeks.org/computer-organization-architecture/co-processor-computer-architecture/) - GeeksforGeeks - Explains floating-point units as a category of direct-control coprocessor that the main CPU dispatches work to, background for this chapter's distinction between general-purpose CPUs and dedicated DSP hardware.

9. [Profiling Firmware on Cortex-M](https://interrupt.memfault.com/blog/profiling-firmware-on-cortex-m) - Memfault Interrupt Blog - Notes that DWT cycle counting is unavailable on the Cortex-M0+, reinforcing this chapter's point that hardware capability, not just clock speed, differs across the ARM Cortex-M family the reader's board might belong to.

10. [Instruction Set Architecture and Microarchitecture](https://www.geeksforgeeks.org/computer-organization-architecture/microarchitecture-and-instruction-set-architecture/) - GeeksforGeeks - Explains that an ISA defines what operations a CPU can perform while different chips can implement the same ISA differently, background for this chapter's ARMv6-M/v7-M/v8-M generation comparison and why FPU support varies within one ISA family.
