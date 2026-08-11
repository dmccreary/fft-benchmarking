# Quiz: Know Your Board: ARM Cortex-M Architecture and the Pico 2

Test your understanding of the ARM Cortex-M architecture, the Pico 2's identity registers, and the CPU-cycle budget with these review questions.

---

#### 1. What is an embedded system?

<div class="upper-alpha" markdown>
1. A general-purpose computer capable of running any user-installed software
2. A software library that emulates hardware peripherals
3. A computer system built into a larger device to perform one dedicated function, combining a specific instruction set architecture with a fixed memory architecture
4. Any chip that includes a hardware floating-point unit
</div>

??? question "Show Answer"
    The correct answer is **C**. An embedded system combines a processor running a specific instruction set architecture (such as ARM) with a defined memory architecture, dedicated to one function — unlike a general-purpose computer that runs arbitrary user-installed software. A laptop is a general-purpose computer; the Pico 2, running exactly the script saved to it, is an embedded system.

    **Concept Tested:** Embedded Systems

---

#### 2. What is the ARM architecture?

<div class="upper-alpha" markdown>
1. A widely licensed instruction set architecture prioritizing power efficiency, used in devices from smartphones to microcontrollers
2. A specific physical chip manufactured only by the Raspberry Pi Foundation
3. A memory architecture standard for organizing RAM versus flash
4. A programming language used exclusively for embedded systems
</div>

??? question "Show Answer"
    The correct answer is **A**. The ARM architecture is a widely licensed instruction set architecture — the vocabulary of operations a processor understands, plus the rules for encoding them — designed by ARM Holdings and used across devices from smartphones to microcontrollers, including the Pico 2. It is not a single chip, a memory standard, or a programming language.

    **Concept Tested:** ARM Architecture

---

#### 3. Which statement correctly compares the ARM Cortex-M4 and ARM Cortex-M33 processor cores from the Cortex-M series?

<div class="upper-alpha" markdown>
1. The Cortex-M33 lacks the hardware floating-point unit that the Cortex-M4 has.
2. The Cortex-M4 and Cortex-M33 are the same processor core marketed under two different names.
3. The Cortex-M33 is an older, simpler core than the Cortex-M4.
4. The Cortex-M33 builds on the Cortex-M4's floating-point and DSP capabilities while adding stronger security features and improved efficiency.
</div>

??? question "Show Answer"
    The correct answer is **D**. The Cortex-M33, the core inside the Pico 2, is a newer member of the Cortex-M series that builds on the Cortex-M4's floating-point and DSP capabilities while adding features like TrustZone security and improved efficiency. It is not older or simpler than the M4, and the two cores are distinct designs, not the same core under different names.

    **Concept Tested:** ARM Cortex M33

---

#### 4. Which chip is soldered onto the Raspberry Pi Pico 2 board?

<div class="upper-alpha" markdown>
1. RP2040
2. RP2350
3. Cortex-M0+
4. ATmega328
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2350 is the Raspberry Pi Foundation's second custom silicon chip, built around the Cortex-M33 core, and it is what powers the Pico 2 — including the hardware floating-point unit the FFT work in this course depends on. The RP2040 was the chip on the original Pico, without a hardware FPU.

    **Concept Tested:** RP2350 Chip

---

#### 5. Why does a `main.py` file saved to the device filesystem survive a power cycle, while a variable set in the REPL does not?

<div class="upper-alpha" markdown>
1. Because main.py is stored in flash memory, which is non-volatile and retains its contents when power is removed, while a REPL variable lives in RAM, which is volatile and loses its contents immediately
2. Because the REPL variable is stored in flash, which resets on every reboot, while main.py is stored in RAM, which is non-volatile
3. Because RAM and flash are actually the same physical memory, so there is no real difference
4. Because the REPL automatically copies every variable to flash memory in the background
</div>

??? question "Show Answer"
    The correct answer is **A**. Flash memory is slower but non-volatile, holding the firmware and saved files (like main.py) even after power is removed. RAM is fast but volatile, holding a running program's variables only as long as power is applied. This is exactly why a saved script survives unplugging the Pico 2 while a REPL-typed variable does not.

    **Concept Tested:** RAM Versus Flash

---

#### 6. What is a memory-mapped register?

<div class="upper-alpha" markdown>
1. A block of RAM reserved exclusively for storing the results of past benchmark runs
2. A register that can only be accessed through the REPL, never from a saved script
3. A hardware register given its own memory address, so reading or writing that address directly reads or writes live hardware state rather than ordinary stored data
4. A temporary variable created automatically each time a function is called
</div>

??? question "Show Answer"
    The correct answer is **C**. A memory-mapped register is a small hardware storage location built into the chip's circuitry that is assigned its own memory address, so accessing that address interacts directly with live hardware state — not cached data the way an ordinary variable would be. The CPUID register and unique device ID are both examples of memory-mapped registers.

    **Concept Tested:** Memory Mapped Register

---

#### 7. The Pico 2 runs at its default clock speed of 150 MHz. How many CPU cycles are available in a 20-millisecond real-time processing window?

<div class="upper-alpha" markdown>
1. 150,000 cycles
2. 1,500,000 cycles
3. 20,000,000 cycles
4. 3,000,000 cycles
</div>

??? question "Show Answer"
    The correct answer is **D**. Cycle budget is computed as clock speed multiplied by the available time: 150,000,000 cycles/sec × 0.020 sec = 3,000,000 cycles. This kind of calculation is the basis for every real-time deadline in the course — clock speed sets the size of the budget, but it says nothing about whether a given piece of code actually fits inside it.

    **Concept Tested:** CPU Cycles

---

#### 8. Why can a pipelined processor complete close to one instruction per clock cycle on average, even though individual instructions vary in latency?

<div class="upper-alpha" markdown>
1. Pipelining eliminates instruction latency entirely, guaranteeing every instruction completes in exactly one cycle.
2. Pipelining overlaps the execution of multiple instructions — fetching, decoding, and executing different instructions simultaneously — so throughput approaches one instruction per cycle even though any single instruction's latency may span several cycles.
3. Pipelining only affects floating-point instructions, leaving integer instruction latency unchanged.
4. Pipelining works by running the clock faster whenever a slow instruction is detected.
</div>

??? question "Show Answer"
    The correct answer is **B**. Pipelining overlaps stages of instruction execution — while one instruction decodes, the next is being fetched, and another is being read from memory — so that, on average, close to one instruction completes every cycle, even though a specific instruction (like a floating-point division) may still take several cycles of latency to finish. Pipelining does not eliminate latency; it hides it through overlap.

    **Concept Tested:** Pipelining

---

#### 9. What is the key difference between the CPUID register and the unique device ID?

<div class="upper-alpha" markdown>
1. They report identical information and exist purely for redundancy.
2. The unique device ID reports clock speed, while the CPUID register reports RAM availability.
3. The CPUID register identifies what kind of chip a processor is (part number, architecture version), while the unique device ID is a factory-programmed serial number that distinguishes one individual chip from another of the same kind.
4. The CPUID register is stored in flash memory, while the unique device ID is stored in RAM.
</div>

??? question "Show Answer"
    The correct answer is **C**. The CPUID register answers "what kind of chip is this," reporting standardized part-number and architecture information defined by the ARM Cortex-M33 architecture. The unique device ID answers a different question — "which specific chip is this" — since every Pico 2 is programmed during manufacturing with its own permanent serial number, readable through `machine.unique_id()`.

    **Concept Tested:** CPUID Register

---

#### 10. Two Pico 2 boards run the exact same script. `machine.unique_id()` returns a different value on each board, but `machine.freq()` returns an identical value on both. What does this combination of results indicate?

<div class="upper-alpha" markdown>
1. Each chip carries its own factory-programmed unique identifier (which differs by chip), while both boards share the same default clock configuration for the same chip family (which is identical); these two registers answer different questions — "which specific chip" versus "how fast is it running."
2. The boards must have different silicon revisions, which always forces different clock speeds.
3. One board's firmware version must be out of date, which is why its unique ID differs.
4. The unique device ID and clock frequency are actually read from the same register, so this result is impossible.
</div>

??? question "Show Answer"
    The correct answer is **A**. `machine.unique_id()` reads a factory-programmed serial number that is, by design, different for every individual chip, while `machine.freq()` reports the clock configuration, which defaults to the same value across identical boards of the same model. These are independent pieces of identity information — one distinguishes individual chips, the other describes how the chip is currently configured to run — so this exact combination of results is expected, not a contradiction.

    **Concept Tested:** Unique Device ID
