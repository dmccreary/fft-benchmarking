---
title: "Does Your CPU Have an FPU?"
description: How to detect floating-point and DSP hardware by reading ARM feature registers directly, rather than assuming it from a datasheet
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

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

!!! mascot-welcome "Time to transform — into a chip detective!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Before you write a single line of assembly, there's a question you cannot skip: does
    the chip in front of you even *have* the hardware you're about to program? Let's find
    out by asking the chip itself, not a datasheet.

## Instruction Set Architecture: The Real Contract

Every CPU understands a fixed, specific set of instructions — add this, load that, branch
if equal — and that complete vocabulary is called its **instruction set architecture**
(ISA). The ISA is the actual contract between hardware and software: a program compiled
or hand-written for one ISA will not run correctly on a chip implementing a different one,
no matter how similar the two chips look on a spec sheet. ARM does not sell one ISA — it
licenses a family of related but distinct ones, and three of them matter directly to this
course.

**ARMv6-M** is the smallest, oldest member of the Cortex-M family's architecture line —
a minimal integer-only instruction set found in chips like the Cortex-M0 and **Cortex
M0+**, the core used in the original Raspberry Pi Pico (RP2040). **ARMv7-M** is the
mid-range generation, adding a substantially larger instruction set including
floating-point and DSP extensions, found in cores like the Cortex-M3 and Cortex-M4.
**ARMv8-M** is the newest generation relevant here, adding security extensions and
further instruction refinements on top of ARMv7-M's capabilities, implemented in cores
like the Cortex-M23 and the Cortex-M33 — the core inside your Pico 2's RP2350. Knowing
which ISA generation a chip implements tells you, in broad strokes, what kind of
instructions it can possibly execute before you look at a single register.

## General-Purpose CPUs Versus DSP Chips

Historically, a **general purpose CPU** was built to handle a broad mix of ordinary
workloads — control logic, string handling, simple arithmetic — while a dedicated **DSP
chip** (Digital Signal Processor) was purpose-built with hardware specifically optimized
for the kind of work signal processing demands: rapid, repeated multiply-and-accumulate
operations on streams of numbers, exactly the pattern at the heart of correlation and the
FFT.

Modern Cortex-M cores blur that historical line on purpose. Starting with ARMv7-M, ARM
added optional **DSP instructions** — single-cycle multiply-accumulate operations,
saturating arithmetic, and packed-data instructions that process several small values at
once — directly into an otherwise general-purpose core. A Cortex-M4 or M33 is still a
general-purpose CPU in the sense that it also runs ordinary control code, GPIO handling,
and display drivers perfectly well, but it also carries hardware capability that used to
require a separate, dedicated DSP chip. That is precisely what makes real-time FFT
processing possible on a $5 general-purpose microcontroller in the first place.

## The Floating-Point Unit

A **floating point unit** (FPU) is a dedicated hardware block that performs
floating-point arithmetic — addition, multiplication, and more — directly in silicon, in
a small, fixed number of cycles. Without an FPU, a chip must emulate floating-point
operations entirely in software, one integer instruction at a time, which is dramatically
slower — often tens to hundreds of times slower for a single operation.

The specific FPU implementation built into the Cortex-M33 (and Cortex-M4) is called the
**FPv5-SP unit** — the fifth version of ARM's floating-point architecture, in its
single-precision (SP) configuration, meaning it operates on 32-bit floats directly in
hardware but does not accelerate 64-bit double-precision values. Every floating-point
instruction this course's assembly chapters use — `VADD`, `VMUL`, and the rest — is
executed by this exact unit.

!!! mascot-thinking "Not every Cortex-M has one"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The **Cortex M0 Plus** core — ARMv6-M, used in the original Pico's RP2040 — has no
    FPU and no DSP instructions at all. Every floating-point operation on that chip runs
    in slow software emulation. This is not a defect; the M0+ was designed for extreme
    low power and low cost, and an FPU was traded away to get there.

## The Portability Constraint This Creates

This difference is not a footnote — it is a hard **portability constraint** on any code
this course writes from here forward. Assembly instructions that use the FPU's register
bank simply do not exist on a Cortex-M0+; attempting to assemble or run them fails
outright, or on some tooling, produces confusing, indirect errors far from the actual
cause. A Pico 2 **W** works identically to a plain Pico 2 for every lab in this course,
because both use the Cortex-M33. The *original* Pico does not, because its RP2040 uses
the Cortex-M0+ — Labs 30 through 34 in the assembly module simply cannot run there. Table
below summarizes the relevant generations at a glance, now that each one has been
explained individually:

| ISA generation | Example cores | FPU? | DSP instructions? | Used in this course |
|---|---|---|---|---|
| ARMv6-M | Cortex-M0, Cortex-M0+ | No | No | Original Pico (RP2040) — cannot run Labs 30-34 |
| ARMv7-M | Cortex-M3, Cortex-M4 | M4: yes (FPv5-SP) | M4: yes | Common in industry; not this course's board |
| ARMv8-M | Cortex-M23, Cortex-M33 | M33: yes (FPv5-SP) | M33: yes | Pico 2 / Pico 2 W (RP2350) — this course's board |

## Capability Probing: Ask the Chip, Don't Assume

!!! mascot-warning "A datasheet is not the chip in front of you"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Assuming a board has an FPU because "it's a Pico 2" invites exactly the kind of bug
    that is painful to track down later — a typo'd board revision, a substituted chip, or
    simply a student who grabbed the wrong board from a shared bin. The fix costs three
    lines of code.

**Capability probing** is the practice of asking the hardware itself what it supports at
startup, rather than assuming a capability from a part number, a datasheet, or last
semester's notes. The specific check this chapter builds is **FPU presence detection** —
reading a register that reports, in hardware, whether a floating-point unit actually
exists on this exact chip, right now.

ARM Cortex-M cores expose this information through the **MVFR0 register** (Media and VFP
Feature Register 0) — a read-only system register that reports, in a set of small bit
fields, exactly which floating-point capabilities are implemented in silicon. Reading
MVFR0 and checking its relevant bit field tells you definitively whether single-precision
floating point is present, with no ambiguity and no dependence on documentation that
might be stale or wrong for the specific unit in your hand.

```python
import machine

MVFR0 = 0xE000EF40

def has_single_precision_fpu():
    value = machine.mem32[MVFR0]
    single_precision_field = value & 0xF          # bits [3:0]
    return single_precision_field == 0x2           # 0x2 means "single-precision supported"

if has_single_precision_fpu():
    print("FPU detected — Module 7's assembly chapters will run here.")
else:
    print("No FPU detected — this board cannot run Labs 30-34.")
```

`value & 0xF` isolates the lowest four bits of the 32-bit MVFR0 register — the specific
bit field ARM's architecture reference defines as reporting single-precision
floating-point support. A value of `0x2` in that field means "single-precision supported
as defined by the VFP architecture"; any other value means it is absent. This is exactly
the same **register bit manipulation** pattern from Chapter 17, now used to read a
capability instead of controlling a counter.

#### Diagram: FPU Capability Probe Simulator

<iframe src="../../sims/fpu-capability-probe/main.html" width="100%" height="502px" scrolling="no"></iframe>

<details markdown="1">
<summary>FPU Capability Probe Simulator</summary>
Type: microsim
**sim-id:** fpu-capability-probe<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply (L3) — execute, demonstrate
Learning objective: Apply the MVFR0 bit-field check to determine FPU presence for several simulated chips, demonstrating that the same code correctly reports different verdicts on different hardware.

Canvas layout:
- Left (300px): A chip selector showing three labeled chip cards (Cortex-M0+, Cortex-M4, Cortex-M33)
- Right (300px): A register-read panel showing the simulated MVFR0 value for the selected chip, the bitmask operation, and the resulting verdict

Visual elements:
- Each chip card shows its name, ISA generation, and a "?" placeholder for FPU status until probed
- Register panel shows MVFR0 as a 32-bit hex value appropriate to the selected chip (e.g. `0x00000000` for Cortex-M0+, `0x10110021` for a Cortex-M4/M33 style value)
- A visual AND-mask animation showing `value & 0xF` isolating the low nibble
- Verdict readout: green checkmark + "FPU detected" or red X + "No FPU"

Interactive controls:
- Click a chip card to select it
- Button: "Run has_single_precision_fpu()" — animates the mask operation and reveals the verdict for the selected chip
- Button: "Reset all"

Default parameters:
- Chip selected: Cortex-M33 (matches the reader's own Pico 2)

Behavior:
- Selecting Cortex-M0+ and running the probe always yields "No FPU" (bit field 0x0)
- Selecting Cortex-M4 or Cortex-M33 always yields "FPU detected" (bit field 0x2)
- The chip card's "?" placeholder updates to the verdict icon once probed, and stays until a different chip is selected

Instructional Rationale: Apply-level objectives call for direct execution and
demonstration — letting the learner run the exact same probing function against multiple
simulated chips and see it produce different, correct verdicts each time reinforces that
the function is reading real hardware state, not returning a hardcoded answer.

Implementation: p5.js, chip data as an array of {name, mvfr0_value} objects, bitmask math performed in JS matching the Python logic exactly
</details>

## Hardware Feature Gates and Failure Root Cause

The pattern `has_single_precision_fpu()` demonstrates is general enough to have its own
name: a **hardware feature gate** is any point in code where execution branches based on
a runtime capability check, rather than proceeding under an unverified assumption. Feature
gates show up constantly in embedded and systems programming — checking for a peripheral
before configuring it, checking for a co-processor before dispatching work to it — and the
FPU probe above is this course's first hands-on example.

The payoff of gating on a real capability check, instead of failing partway through an
assembly routine with a cryptic fault, is a clear **failure root cause**: when
`has_single_precision_fpu()` returns `False`, the program can say exactly why it cannot
proceed — "no FPU on this chip" — rather than crashing three instructions into a
hand-written routine with no indication of what went wrong. Treating a missing capability
as diagnostic information, reported plainly, rather than a dead end reached by accident,
is the actual engineering skill this chapter teaches. It is also directly reusable: any
future project on unfamiliar ARM hardware starts with exactly this kind of probe before
trusting any hardware-specific code path.

??? question "You run `has_single_precision_fpu()` on a board and get `False`, but you were told it was a Pico 2. What should you check first? Click to check."
    Before assuming the probe code itself is wrong, verify the board's actual identity —
    it's easy to grab an original Pico (RP2040, Cortex-M0+) from a shared parts bin by
    mistake, since they look nearly identical. Chapter 2's board-identification technique
    (reading the chip's own ID registers) is the fastest way to confirm which silicon is
    actually in your hand before debugging anything else.

!!! mascot-celebration "You can now trust your own hardware"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Not bad for three lines of code! You've confirmed, from the chip itself rather than a
    datasheet, that your Pico 2's Cortex-M33 has exactly the floating-point hardware
    Module 7 needs. Chapter 21 puts that confirmed hardware to work — your very first
    hand-written ARM assembly function.

[See Annotated References](./references.md)
