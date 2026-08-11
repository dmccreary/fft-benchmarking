# References: Know Your Board: ARM Cortex-M Architecture and the Pico 2

1. [ARM Cortex-M](https://en.wikipedia.org/wiki/ARM_Cortex-M) - Wikipedia - Overview of the Cortex-M processor family, including the Cortex-M33 core inside the Pico 2's RP2350 chip, its ARMv8-M architecture, and how it compares to the Cortex-M4 discussed in this chapter.

2. [Memory-mapped I/O](https://en.wikipedia.org/wiki/Memory-mapped_I/O) - Wikipedia - Explains how a processor reads and writes hardware registers using ordinary load and store instructions, the exact concept behind this chapter's CPUID register and unique device ID discussion.

3. [Instruction pipelining](https://en.wikipedia.org/wiki/Instruction_pipelining) - Wikipedia - Describes how overlapping instruction fetch, decode, and execute stages lets a processor approach one completed instruction per clock cycle, the mechanism behind this chapter's pipelining and instruction latency discussion.

4. The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors (3rd Edition) - Joseph Yiu - Newnes (Elsevier) - Yiu, an ARM architect, is credited with the register-by-register walkthrough of the Cortex-M programming model that has become the standard way the industry teaches CPUID and memory-mapped registers.

5. Computer Organization and Design ARM Edition: The Hardware/Software Interface - David A. Patterson and John L. Hennessy - Morgan Kaufmann - Patterson and Hennessy are credited with the widely imitated laundry-load analogy mapping wash/dry/fold stages onto fetch/decode/execute, the standard way this chapter's pipelining concept is taught.

6. [Raspberry Pi Pico 2 Datasheet](https://datasheets.raspberrypi.com/pico/pico-2-datasheet.pdf) - Raspberry Pi Ltd - Official datasheet for the Pico 2 board, covering its RP2350 chip, pinout, power specifications, and physical dimensions that this chapter's board-identification discussion is built around.

7. [RP2350 Datasheet](https://datasheets.raspberrypi.com/rp2350/rp2350-datasheet.pdf) - Raspberry Pi Ltd - Official chip datasheet detailing the dual Cortex-M33 core configuration, clock domains, and memory map, the primary source for this chapter's discussion of registers and RAM versus flash.

8. [Cortex-M33](https://www.arm.com/products/silicon-ip-cpu/cortex-m/cortex-m33) - Arm - Official Arm product page describing the Cortex-M33's three-stage pipeline, TrustZone security, and optional DSP/FPU extensions, the newer core this chapter contrasts against the Cortex-M4.

9. [machine – MicroPython Library Reference](https://docs.micropython.org/en/latest/library/machine.html) - MicroPython Documentation - Documents `machine.freq()` and `machine.unique_id()`, the two functions this chapter uses in MicroPython to read the Pico 2's clock frequency and factory-programmed unique device ID.

10. [Memory Mapped I/O and Isolated I/O](https://www.geeksforgeeks.org/computer-organization-architecture/memory-mapped-i-o-and-isolated-i-o/) - GeeksforGeeks - Compares memory-mapped and port-mapped I/O, reinforcing this chapter's distinction between ordinary RAM, non-volatile flash, and the separate memory-mapped register block that exposes live hardware state.
