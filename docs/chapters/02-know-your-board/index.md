---
title: 'Know Your Board: ARM Cortex-M Architecture and the Pico 2'
description: Survey the ARM Cortex-M architecture behind the Pico 2, read the chip's own identity registers, and derive the CPU-cycle budget for real-time audio.
generated_by: claude skill chapter-content-generator
date: 2026-08-10 19:22:51
version: 0.09
---

# Know Your Board: ARM Cortex-M Architecture and the Pico 2

## Summary

This chapter surveys the ARM Cortex-M architecture underlying the Pico 2 — the M33 core, its clock speed, memory layout, and the CPUID and memory-mapped registers that let a program identify its own silicon. It introduces the CPU-cycle budget that governs every real-time calculation in the rest of the book. Students finish able to read their board's identity directly from its registers rather than from a datasheet.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. ARM Architecture
2. ARM Cortex M Series
3. ARM Cortex M33
4. ARM Cortex M4
5. CPU Clock Frequency
6. CPU Cycles
7. CPUID Register
8. Clock Speed
9. Embedded Systems
10. Filesystem Statistics
11. Firmware Version
12. Free Memory Query
13. Instruction Latency
14. Memory Architecture
15. Memory Mapped Register
16. Pipelining
17. RAM Versus Flash
18. RP2040 Chip
19. RP2350 Chip
20. Raspberry Pi Pico
21. Raspberry Pi Pico 2
22. Real Time Constraints
23. Silicon Revision
24. Unique Device ID

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)

---

!!! mascot-welcome "Time to meet the chip itself"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Echo the dolphin waving">
    Last chapter you blinked a light. This chapter, you're going to make the board tell you exactly what it is — clock speed, memory, even a serial number burned into the silicon. Let's tune in and find out what's actually under the hood.

You already know the Pico 2 as a **microcontroller** — a chip that runs one program directly on hardware, no operating system involved. That description covers a huge range of devices, from a thermostat to a car's anti-lock braking system, so it needs sharpening before it is useful for real engineering decisions. This chapter builds two ideas that, together, define that sharper category, then uses them to identify the exact silicon sitting on your desk.

## What Makes a System "Embedded"?

Every processor executes instructions written in some specific vocabulary of operations — add these two numbers, load this value from memory, jump to this address. That vocabulary, along with the rules for how instructions are encoded and how the processor's internal components are organized to execute them, is called an **instruction set architecture**, and the Pico 2's flavor of it is the **ARM architecture** — a widely licensed instruction set architecture, designed by ARM Holdings, that prioritizes power efficiency and is used in devices from smartphones to microcontrollers. Nearly every phone on Earth runs ARM instructions; so does the chip in your hand right now.

An instruction set alone does not explain where a program's data lives while the processor works on it. That is the job of **memory architecture** — the organization of a computer system's memory into distinct regions (such as working storage and permanent storage) with different speeds, sizes, and purposes, and the rules that govern how the processor addresses each one. Every microcontroller needs a memory architecture; the specific one used by the Pico 2 is explored later in this chapter.

With those two ideas in hand — an ARM instruction set and a defined memory architecture — the term **embedded systems** finally has a precise meaning: computer systems built into a larger device to perform one dedicated function, combining a processor running a specific instruction set architecture with a fixed memory architecture, rather than a general-purpose computer capable of running arbitrary user-installed software. Your laptop is a general-purpose computer; the Pico 2, running exactly the script you saved to it, is an embedded system.

## The Cortex-M Family — M4 and M33

ARM licenses several distinct processor *cores* — actual circuit designs, not just the instruction set on paper — and groups the ones built specifically for low-power embedded use under one family name: the **ARM Cortex-M series**, a family of ARM processor cores designed specifically for microcontrollers and other cost- and power-sensitive embedded applications, distinguished from ARM's higher-performance cores used in phones and servers.

Two members of that family matter for this course. The **ARM Cortex-M4** is a Cortex-M series core that added a floating-point unit and DSP (digital signal processing) instructions to the family — hardware support for exactly the kind of math this course is built around. The **ARM Cortex-M33**, the core actually inside your Pico 2, is a newer Cortex-M series core that builds on the Cortex-M4's floating-point and DSP capabilities while adding stronger security features and improved efficiency.

Before comparing the two cores in a table, it is worth naming why this comparison matters at all: whether a chip has a *hardware* floating-point unit — real circuitry that does floating-point math directly — versus doing that math the slow way, in software, is one of the biggest performance differences you will measure in this entire course.

| Feature | ARM Cortex-M4 | ARM Cortex-M33 (Pico 2) |
|---|---|---|
| Hardware floating-point unit | Optional (present on many implementations) | Yes |
| DSP instructions | Yes | Yes |
| Security extensions | No | Yes (TrustZone) |
| Typical use in this course | Reference comparison point | The chip you actually program |

One more architectural detail explains *how* a single core executes instructions quickly in the first place: **pipelining**, a processor design technique that overlaps the execution of multiple instructions — while one instruction is being decoded, the next is already being fetched, and the one after that is being read from memory — so that, on average, close to one instruction completes every clock cycle instead of one instruction taking several cycles from start to finish. Both the M4 and M33 are pipelined; you will feel the practical consequences of pipelining later in this chapter, when instruction timing turns out to be less predictable than a naive cycle count would suggest.

## From Core to Board — Pico and Pico 2

A processor core is a design, not a physical object you can hold. To get an actual chip, ARM's core design has to be licensed, combined with supporting circuitry, and manufactured — and to get a board you can plug into a breadboard, that chip has to be mounted with power regulation, USB circuitry, and pin headers.

The **Raspberry Pi Pico** is the original board in this product line: a small, low-cost microcontroller development board from the Raspberry Pi Foundation, built around an ARM Cortex-M series core, designed for hobbyist and educational use. The specific chip soldered onto that original board is the **RP2040**, the Raspberry Pi Foundation's first custom silicon chip, built around a Cortex-M series core.

This course uses its successor. The **Raspberry Pi Pico 2** is the second-generation board in the same product line, built around the ARM Cortex-M33 core, released in August 2024. The chip on that board is the **RP2350**, the Raspberry Pi Foundation's second custom silicon chip, built around the Cortex-M33 core and adding the hardware floating-point unit that the FFT work in this course depends on.

| | Raspberry Pi Pico | Raspberry Pi Pico 2 |
|---|---|---|
| Chip | RP2040 | RP2350 |
| Core | Cortex-M series (no hardware FPU) | Cortex-M33 |
| Hardware floating point | No | Yes |
| Runs Labs 30–34 (assembly FPU work)? | No | Yes |

!!! mascot-tip "Check your board before Module 7"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Echo giving a tip">
    A Pico 2 **W** (the wireless variant) works identically for every lab in this course — the radio just sits unused. An *original* Pico, though, is missing the hardware floating-point unit later labs assume. Lab 28 teaches you to detect this yourself by reading the chip's own registers, which is exactly the skill this chapter is building toward.

## How Memory Is Organized — RAM, Flash, and Registers

Memory architecture is not one undifferentiated pool of storage. The Pico 2 splits it into two fundamentally different regions, described by the comparison **RAM versus flash**: RAM (random-access memory) is fast, volatile working memory that holds a running program's variables and loses its contents the instant power is removed, while flash memory is slower, non-volatile storage that holds the MicroPython firmware and any files saved to the device, and keeps its contents even after the board is unplugged. That distinction is why last chapter's `main.py`, saved to the device filesystem, survives a power cycle, while a variable you set in the REPL does not.

Beyond ordinary memory, a microcontroller reserves certain memory addresses for a different purpose entirely: a **memory-mapped register** is a hardware register — a small storage location built directly into the chip's circuitry, distinct from RAM — that is given its own memory address, so that reading or writing to that specific address reads or writes hardware state directly, rather than reading or writing ordinary data. Some memory-mapped registers report information about the chip itself; others control peripherals you will meet in the next chapter, like the display and buttons.

Two everyday MicroPython operations reach into ordinary RAM and flash to answer practical questions, and are worth knowing before diving into the registers that answer identity questions. A **free memory query** — the `gc.mem_free()` function — reports how many bytes of RAM remain available for your program to use, which matters because a Pico 2 running out of RAM crashes rather than gracefully slowing down. **Filesystem statistics** — the `os.statvfs()` function — reports how much flash storage space remains on the device filesystem, the same filesystem you saved `main.py` to in Chapter 1.

```python
import gc, os

print("Free RAM (bytes):", gc.mem_free())
print("Flash stats:", os.statvfs("/"))
```

Here, `gc.mem_free()` returns a single integer — bytes of RAM currently free — and `os.statvfs("/")` returns a tuple describing the root of the device filesystem, including total space and space available, in the same units a desktop `df` command would report.

## Ask the Chip Who It Is

Every Pico 2 you will ever hold is, in one specific way, unique: during manufacturing, each chip is programmed with its own permanent identifier. The **unique device ID** is a factory-programmed serial number, unique to each individual chip, readable through a memory-mapped register and exposed in MicroPython through `machine.unique_id()` — useful whenever a program needs to tell two otherwise-identical boards apart, such as logging which physical unit produced a given benchmark result.

A related but different register answers a different question — not "which specific chip is this" but "what *kind* of chip is this." The **CPUID register** is a memory-mapped register, defined by the ARM Cortex-M33 architecture itself, that reports the processor's part number, architecture version, and implementation details in a standardized, machine-readable format. Reading it in MicroPython looks like this:

```python
import machine

print("Unique ID:", machine.unique_id())
print("Frequency:", machine.freq())
```

That same register, and others near it, expose one more detail worth knowing before you trust a chip's behavior: the **silicon revision** — a version number identifying a specific manufacturing revision of a chip design, since even chips sharing the same part number can differ in minor bug fixes or capabilities between revisions. Finally, one more piece of "who am I" information lives not in hardware but in software: the **firmware version** — the version identifier of the specific MicroPython firmware build installed on the device, retrievable through `sys.implementation` or `sys.version`, distinct from the silicon revision because the same chip can run many different firmware versions over its lifetime as you update it.

Before looking at how all of these registers relate to each other spatially in the chip's address space, it helps to name what the diagram below will show: RAM, flash, and the block of memory-mapped registers sit at different, non-overlapping address ranges, and the CPUID register, unique device ID, and other identity registers are simply specific addresses within that register block.

#### Diagram: Pico 2 Memory Map Explorer

<iframe src="../../sims/pico2-memory-map-explorer/main.html" width="100%" height="512px" scrolling="no"></iframe>

<details markdown="1">
<summary>Pico 2 Memory Map Explorer</summary>
Type: diagram
**sim-id:** pico2-memory-map-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand
Bloom Taxonomy Verb: Explain, classify

Learning objective: Help students classify a given address or piece of data as belonging to RAM, flash, or the memory-mapped register block, and explain why reading a register address behaves differently from reading ordinary RAM.

Purpose: Give a spatial, clickable mental model of the Pico 2's address space so "memory-mapped register" stops being an abstract phrase and becomes a specific labeled region students can point to.

Components to show:
- A single tall vertical bar representing the full address space, divided into three labeled, differently colored horizontal bands (not to scale, but ordered top-to-bottom): "Flash (program + saved files)", "RAM (running variables)", "Memory-Mapped Registers (hardware)"
- Within the "Memory-Mapped Registers" band, four smaller labeled sub-blocks: "CPUID Register", "Unique Device ID", "Clock Control", "Peripheral Registers (SPI, GPIO, etc.)"
- A small "You are here" style pointer that moves to the relevant band when a code snippet is selected

Interactive features:
- Clicking any band or sub-block opens an infobox with: the term's definition (matching this chapter's prose), an example of what lives there, and whether it is volatile (lost on power-off) or non-volatile
- A row of three buttons above the diagram, each labeled with a code snippet (`gc.mem_free()`, `machine.unique_id()`, `open("main.py")`); clicking one highlights the memory band that snippet actually reads from, reinforcing which concept maps to which region
- Hover over any band shows a one-line tooltip summary before the full infobox is opened by click

Visual style: Simple vertical block diagram, flat colors, no 3D effects

Color scheme: Flash in amber, RAM in blue, Memory-Mapped Registers in green with darker-green sub-blocks

Implementation: p5.js, responsive width, fixed regions recalculated proportionally on window resize
</details>

!!! mascot-thinking "A register isn't 'data' — it's a window into hardware"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Echo thinking">
    Here's the idea worth sitting with: when you read an ordinary variable, you get back whatever your program stored there. When you read a memory-mapped register, you get back whatever the *hardware* is doing right now — live, not cached. That's a fundamentally different kind of "reading," and it's why register access in assembly, later in this course, has its own special rules.

## The Cycle Budget

Everything so far has been about identity — what chip, what core, what memory. This last section introduces the number that will follow you through the rest of the book: how much *time* the chip actually gives you.

A processor does not run continuously in a smooth, analog sense — it advances in discrete, evenly spaced steps, driven by an internal oscillator. The **clock speed** is the rate at which a processor's internal clock ticks, measured in cycles per second, that paces every operation the processor performs. The Pico 2 runs at 150 MHz by default, meaning its clock ticks 150 million times every second. Expressed formally, that rate is the chip's **CPU clock frequency** — clock speed, specifically expressed in Hertz (cycles per second) — which for the Pico 2 is:

\[ f = 150 \times 10^6 \text{ Hz} = 150 \text{ MHz} \]

Each individual tick of that clock is one **CPU cycle** — a single tick of the processor's clock, the smallest unit of time in which the processor can make forward progress on an instruction. A cycle is not automatically the same as "one instruction finished," though — and this is exactly where pipelining, introduced earlier, and **instruction latency** meet. Instruction latency is the number of clock cycles a specific instruction actually takes to complete, which varies by instruction type: a simple integer addition might complete in one cycle, while a floating-point division might take many cycles even on a chip with a hardware FPU, and a pipeline stall (waiting on a value that is not ready yet) can add cycles no instruction-count estimate would predict.

That gap between "clock speed" and "actual completed work" is precisely why this course insists on measuring rather than estimating — a theme that returns with force in Module 6. For now, one number matters most: the **real-time constraints** every audio-processing lab in this course must satisfy — a hard deadline, derived from clock speed, CPU cycles, and instruction latency, by which a computation must finish in order to keep up with a continuous, live input stream, such as audio arriving from a microphone.

Before showing the interactive budget calculator below, it's worth walking through the exact arithmetic it performs, since the reasoning matters more than the tool. If a real-time audio pipeline must process each new chunk of audio within a 40-millisecond window to avoid falling behind, and the Pico 2's clock ticks 150 million times per second, then the number of CPU cycles available in that window is:

\[ 150{,}000{,}000 \ \tfrac{\text{cycles}}{\text{second}} \times 0.040 \ \text{seconds} = 6{,}000{,}000 \ \text{cycles} \]

Six million cycles sounds like a lot — until you remember that a single unoptimized floating-point multiply on this chip, measured later in this course, can cost over a thousand cycles by itself.

#### Diagram: Cycle Budget Calculator

<iframe src="../../sims/cycle-budget-calculator/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>Cycle Budget Calculator</summary>
Type: microsim
**sim-id:** cycle-budget-calculator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply
Bloom Taxonomy Verb: Calculate, apply

Learning objective: Let students calculate the CPU-cycle budget available for a real-time task, given clock speed and a time deadline, and see how that budget shrinks as the deadline tightens or grows as clock speed increases.

Canvas layout:
- Top (250px): large readout showing the calculation as it updates: "Clock speed × Time budget = Cycles available", with live numeric substitution
- Middle (150px): a horizontal bar showing the cycle budget being "spent" by a sample workload (adjustable), so students see how much headroom remains
- Bottom (150px): controls

Visual elements:
- Large equation display: "150,000,000 cycles/sec × 0.040 sec = 6,000,000 cycles" with each number highlighted in the color of its corresponding slider
- Horizontal capacity bar: total width = cycle budget; a filled colored segment = cycles consumed by the sample workload; remaining gray segment = headroom
- Text readout: "Headroom: X cycles (Y% of budget)" or, if over budget, "OVER BUDGET by X cycles" in red

Interactive controls:
- Slider: Clock speed, range 1–200 MHz, default 150 MHz (the Pico 2's actual speed)
- Slider: Real-time deadline, range 5–100 ms, default 40 ms
- Slider: Sample workload cost, range 100,000–20,000,000 cycles, default 8,000,000 cycles (deliberately set slightly over the default budget to demonstrate an over-budget state on load)
- Checkbox: "Show formula" — toggles visibility of the full equation with units

Default parameters:
- Clock speed: 150 MHz
- Deadline: 40 ms
- Workload: 8,000,000 cycles (intentionally over budget to make the "OVER BUDGET" state visible immediately)

Behavior:
- Cycle budget recalculates live as either slider moves: budget = clock_speed_hz × deadline_seconds
- Capacity bar and headroom text update immediately to reflect the new budget versus the fixed workload slider
- When workload exceeds budget, the capacity bar fills entirely red and the readout switches to the "OVER BUDGET" message

Instructional Rationale: An Apply-level calculator with live parameter sliders is appropriate because the objective is computational — students should be able to predict how changing clock speed or deadline changes the cycle budget, then confirm that prediction by dragging a slider and watching the equation and bar update together.

Implementation notes:
- Use p5.js; recompute and redraw on every slider `input` event, not just on release
- Responsive width; equation text and capacity bar both scale to container width on window resize
</details>

!!! mascot-warning "A fast clock does not mean a fast program"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Echo warning">
    It is tempting to look at "150 MHz" and assume any reasonable computation fits easily. It does not. Module 3 of this course builds a brute-force DFT that blows through this exact 6,000,000-cycle budget by more than 500×. Clock speed tells you the size of your budget — it says nothing about whether your code respects it.

!!! mascot-encourage "You don't need to memorize register addresses"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Echo encouraging">
    If CPUID registers and memory maps feel like a lot of new vocabulary at once, that's fair — this chapter front-loads identity concepts so later chapters can move fast without re-explaining them. You will never need to memorize a specific register address in this course; MicroPython's `machine` module handles that translation for you every time.

## Chapter Summary

You can now describe precisely what kind of chip is running your code and how much time it gives you to work with.

Key ideas to carry forward:

- An **embedded system** combines a specific instruction set architecture (**ARM**) with a defined **memory architecture** — the Pico 2 is one, your laptop is not.
- The **Cortex-M33** core inside the Pico 2 builds on the **Cortex-M4**, adding a hardware floating-point unit — the single biggest reason this course requires the Pico *2*, not the original Pico.
- **RAM** is fast and volatile; **flash** is slower and non-volatile; **memory-mapped registers** are a third category entirely — live hardware state, not stored data.
- The **CPUID register**, **unique device ID**, **silicon revision**, and **firmware version** let a program identify its own hardware and software without a datasheet.
- **Clock speed** sets the size of your time budget; **instruction latency** and **pipelining** determine how much real work fits inside it — and **real-time constraints** are what happens when that budget has a hard deadline.

??? note "Quick check: the Pico 2 runs at 150 MHz. How many CPU cycles are available in a 20-millisecond window? — Click to expand"
    150,000,000 cycles/sec × 0.020 sec = 3,000,000 cycles. Half the deadline means half the cycle budget — the relationship is directly proportional.

!!! mascot-celebration "You just read your board's mind"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Echo celebrating">
    You can now ask a Pico 2 what it is, how much memory it has, and how many cycles it gets per second — and derive exactly how tight a real-time deadline really is. That 6,000,000-cycle number isn't trivia. You'll watch it get spent, wasted, and eventually respected across the rest of this book. Not bad for a $5 chip!

[See Annotated References](./references.md)
