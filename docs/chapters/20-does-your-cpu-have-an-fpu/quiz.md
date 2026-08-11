# Quiz: Does Your CPU Have an FPU?

Test your understanding of ARM feature detection, floating-point hardware, and capability probing with these review questions.

---

#### 1. What is an instruction set architecture (ISA)?

<div class="upper-alpha" markdown>
1. A read-only register that reports which floating-point capabilities a chip's silicon implements
2. A dedicated hardware block that performs floating-point arithmetic directly in silicon
3. A conditional check in code that only runs a routine once a required capability is confirmed present
4. The complete, fixed set of instructions a CPU understands, forming the actual contract between hardware and software
</div>

??? question "Show Answer"
    The correct answer is **D**. The instruction set architecture is the real contract between hardware and software — a program written for one ISA will not run correctly on a chip implementing a different one, regardless of how similar the chips look on a spec sheet. Option A describes the MVFR0 register, B describes a floating-point unit, and C describes a hardware feature gate — related but distinct ideas from this chapter.

    **Concept Tested:** Instruction Set Architecture

---

#### 2. Which statement about the Cortex-M0+ core used in the original Raspberry Pi Pico (RP2040) is correct?

<div class="upper-alpha" markdown>
1. It implements ARMv8-M and includes the FPv5-SP floating-point unit
2. It implements ARMv6-M and has no FPU or DSP instructions, so floating-point operations run in slow software emulation
3. It implements ARMv7-M and includes DSP instructions but no FPU
4. It implements ARMv6-M but includes a stripped-down FPv5-SP unit for single-precision math only
</div>

??? question "Show Answer"
    The correct answer is **B**. The Cortex-M0+ implements the minimal, integer-only ARMv6-M architecture, with no FPU and no DSP instructions at all, so every floating-point operation must be emulated in software one integer instruction at a time. This was a deliberate design tradeoff for extreme low power and low cost, not a defect. Options A, C, and D each misassign the architecture generation or hardware capability.

    **Concept Tested:** Cortex M0 Plus

---

#### 3. How does the ARMv8-M architecture used in the Pico 2's Cortex-M33 differ from the ARMv7-M architecture used in a Cortex-M4?

<div class="upper-alpha" markdown>
1. ARMv8-M adds security extensions and further instruction refinements on top of ARMv7-M's floating-point and DSP capabilities
2. ARMv8-M removes DSP instructions that ARMv7-M included, trading them for lower power consumption
3. ARMv8-M is the minimal integer-only profile, while ARMv7-M is the full-featured generation
4. ARMv8-M and ARMv7-M are functionally identical; the difference is only in marketing name
</div>

??? question "Show Answer"
    The correct answer is **A**. ARMv8-M is the newest architecture generation covered in this course, building on ARMv7-M's floating-point and DSP extensions and adding security extensions plus further instruction refinements, as implemented in cores like the Cortex-M23 and Cortex-M33. Option C describes ARMv6-M instead, and B and D misstate the actual relationship between the two generations.

    **Concept Tested:** ARMv8-M

---

#### 4. Why is floating-point arithmetic on a chip without a floating-point unit dramatically slower than on a chip with one?

<div class="upper-alpha" markdown>
1. Chips without an FPU must run at a reduced clock speed for all instructions
2. The MVFR0 register disables integer arithmetic when no FPU is present
3. Without an FPU, floating-point operations must be emulated entirely in software, one integer instruction at a time, instead of executing directly in dedicated hardware
4. Software emulation is only slower for double-precision values, not single-precision ones
</div>

??? question "Show Answer"
    The correct answer is **C**. A floating-point unit performs operations like addition and multiplication directly in silicon in a small, fixed number of cycles; without one, the same operations must be built up from many integer instructions in software, which can be tens to hundreds of times slower for a single operation. Options A, B, and D describe mechanisms the chapter does not support.

    **Concept Tested:** Floating Point Unit

---

#### 5. In the `has_single_precision_fpu()` function, `machine.mem32[MVFR0]` returns `0x00000000` for a particular chip. What does the function report, and what does that imply?

<div class="upper-alpha" markdown>
1. It reports `True`, implying the chip has a double-precision FPU only
2. It reports `True`, implying the chip supports DSP instructions but not floating point
3. It raises an error, because `0x00000000` is not a valid MVFR0 value
4. It reports `False`, because the low nibble is `0x0`, not `0x2`, meaning no single-precision FPU is present — consistent with a Cortex-M0+
</div>

??? question "Show Answer"
    The correct answer is **D**. The function isolates the register's low four bits with `value & 0xF` and compares the result to `0x2`, the code meaning "single-precision supported." A raw value of `0x00000000` has a low nibble of `0x0`, so the function returns `False`, correctly identifying a chip like the Cortex-M0+ that has no floating-point hardware at all. The function performs a comparison, not an error-raising check.

    **Concept Tested:** MVFR0 Register

---

#### 6. A student's assembly routine from Module 7 assembles and runs fine on their Pico 2 but fails outright when a classmate tries the identical code on an original Raspberry Pi Pico. What is the most likely cause?

<div class="upper-alpha" markdown>
1. The original Pico's RP2040 uses the Cortex-M0+ (ARMv6-M), which has no FPU register bank, so instructions using FPU registers cannot exist on that chip — a portability constraint
2. The original Pico runs a different version of Thonny that disables inline assembly entirely
3. The classmate forgot to run warm-up calls before the timed sample
4. The original Pico's registers cannot be read using `machine.mem32`, unlike the Pico 2's
</div>

??? question "Show Answer"
    The correct answer is **A**. The original Pico's RP2040 implements the Cortex-M0+ core and the ARMv6-M architecture, which has no floating-point register bank at all; assembly instructions referencing FPU registers simply do not exist on that chip and fail to assemble or run. This is exactly the portability constraint the chapter describes — Labs 30 through 34 cannot run on that board regardless of how correct the code is on a Cortex-M33.

    **Concept Tested:** Portability Constraint

---

#### 7. How do modern Cortex-M4 and Cortex-M33 cores blur the historical distinction between a general-purpose CPU and a dedicated DSP chip?

<div class="upper-alpha" markdown>
1. They remove all general-purpose instructions so only DSP workloads can run
2. They require an external DSP chip to be attached for any signal-processing work
3. They add optional DSP instructions, such as single-cycle multiply-accumulate and saturating arithmetic, directly into an otherwise general-purpose core
4. They replace the FPU entirely with DSP-only hardware, losing floating-point support
</div>

??? question "Show Answer"
    The correct answer is **C**. Starting with ARMv7-M, ARM added optional DSP instructions — single-cycle multiply-accumulate, saturating arithmetic, and packed-data instructions — directly into cores that still run ordinary control code, GPIO handling, and display drivers. This blending is exactly what makes real-time FFT processing possible on a $5 general-purpose microcontroller instead of requiring a dedicated DSP chip.

    **Concept Tested:** DSP Chip

---

#### 8. What is the underlying engineering benefit of wrapping FPU-dependent assembly behind a hardware feature gate like `has_single_precision_fpu()`, rather than simply attempting to run the routine and seeing what happens?

<div class="upper-alpha" markdown>
1. It automatically rewrites FPU instructions into software-emulated equivalents at runtime
2. It converts a cryptic, indirect failure partway through the routine into a clear, reportable failure root cause stated before any FPU instruction executes
3. It increases the routine's execution speed by skipping unnecessary register checks
4. It eliminates the need for capability probing on any future hardware
</div>

??? question "Show Answer"
    The correct answer is **B**. A hardware feature gate branches execution based on a real capability check instead of an unverified assumption. The payoff is a clear failure root cause: when the check fails, the program can state plainly "no FPU on this chip" instead of crashing partway through a hand-written routine with no indication of what went wrong. It does not speed up execution or auto-convert instructions, and future hardware still needs its own probe.

    **Concept Tested:** Failure Root Cause

---

#### 9. A team is writing firmware that must run on several different ARM Cortex-M boards, some with an FPU and some without. Which approach best reflects the capability probing philosophy this chapter teaches?

<div class="upper-alpha" markdown>
1. Assume every board matches its datasheet and hardcode the FPU-using code path for all of them
2. Only test the firmware on the newest board and document that older boards are unsupported without checking further
3. Ship two separate firmware builds and let the customer guess which one matches their board
4. Read the chip's MVFR0 register at startup and branch to the appropriate code path based on what the hardware actually reports
</div>

??? question "Show Answer"
    The correct answer is **D**. Capability probing means asking the hardware itself what it supports at startup rather than assuming a capability from a part number or datasheet. Reading MVFR0 at startup and branching accordingly is exactly what FPU presence detection does, letting one firmware image behave correctly across boards with different FPU support. The other options rely on unverified assumptions or push the decision onto someone else instead of checking.

    **Concept Tested:** Capability Probing

---

#### 10. Given the course's ISA comparison table, which combination of chip and expected `has_single_precision_fpu()` result is correct?

<div class="upper-alpha" markdown>
1. Cortex-M0+ (ARMv6-M) returns `True`, because all Cortex-M cores include a single-precision FPU
2. Cortex-M33 (ARMv8-M) returns `True`, because it implements the FPv5-SP unit, while Cortex-M0+ (ARMv6-M) returns `False`, because it has no FPU at all
3. Cortex-M4 (ARMv7-M) always returns `False`, because DSP instructions and FPU support are mutually exclusive
4. Every ARM Cortex-M core returns `False` unless the MVFR0 register is manually configured by software first
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter's comparison table shows ARMv6-M cores like the Cortex-M0+ have no FPU and no DSP instructions, while ARMv8-M cores like the Cortex-M33 (and ARMv7-M's Cortex-M4) implement the FPv5-SP unit and support DSP instructions. DSP support and FPU support are not mutually exclusive — the Cortex-M4 and M33 have both — and MVFR0 is read-only, reporting fixed silicon capability rather than something software configures.

    **Concept Tested:** ARMv6-M

---
