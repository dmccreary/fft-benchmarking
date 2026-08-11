---
title: "Beyond the Assembler: Hand-Encoding and Instruction Formats"
description: Hand-encoding a machine instruction the assembler refuses to emit, plus fixed-point Q15/Q31 arithmetic as a scoped tradeoff this course discusses but does not implement
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Beyond the Assembler: Hand-Encoding and Instruction Formats

## Summary

This chapter goes one level below the assembler, hand-encoding a machine instruction the assembler itself refuses to emit, and covers opcode formats, bit fields, and Thumb-2 encoding along the way. It also discusses fixed-point Q15/Q31 arithmetic and why this course doesn't implement it, as a scoped tradeoff rather than an oversight. This is the deepest point in the book's abstraction ladder.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. Assembler Limitation
2. Data Directive
3. Disassembly
4. Encoding Bit Field
5. Encoding Table
6. Encoding Verification
7. Fixed Point Arithmetic
8. Fixed Point FFT
9. Fused Multiply Add
10. Fused Rounding
11. Halfword
12. ISA Versus Toolchain
13. Instruction Encoding
14. Integer FFT
15. Opcode
16. Precision Tradeoffs
17. Q Format Numbers
18. Q15 Format
19. Q31 Format
20. Raw Machine Word
21. Saturating Arithmetic
22. Thumb-2 Encoding
23. VFMA Instruction

## Prerequisites

This chapter builds on concepts from:

- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)
- [22. Talking to the FPU: Floating-Point Assembly](../22-talking-to-the-fpu/index.md)
- [24. Specialization and Branchless Code](../24-specialization-and-branchless-code/index.md)

---

!!! mascot-welcome "Time to transform — past the assembler itself!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You've written assembly by hand. This chapter asks what happens when even the
    assembler can't help you anymore — when the instruction you want exists on your chip,
    but nothing in your toolchain knows how to write it for you.

## An Instruction the Assembler Won't Write

MicroPython's `asm_thumb` inline assembler, faithful as it has been through three
chapters, does not implement every instruction the Cortex-M33's FPU actually supports.
One specific gap motivates this entire chapter: the **VFMA instruction** — vector fused
multiply-add — has no mnemonic in `asm_thumb` at all. Write `vfma(s0, s1, s2)` in a
MicroPython assembly function, and the assembler reports an error, not because the chip
can't execute this instruction, but because nobody has taught this particular assembler
how to translate that mnemonic into bits.

This is an **assembler limitation**, not a hardware one, and the distinction matters
enormously: it means the instruction is still available to you, just not through the
normal mnemonic-based route. Getting it anyway is what the rest of this chapter teaches.

## Why Bother: What VFMA Buys You

Before hand-encoding anything, it's worth being clear about why VFMA is worth the
trouble at all, rather than just using Chapter 22's `VMLA`. Both are a **fused multiply
add**: an operation that computes `d = d + (a × b)` as a single hardware step rather than
a separate multiply followed by a separate add. The word "fused" refers specifically to
rounding behavior. An ordinary multiply-then-add rounds the multiplication's result to
fit single-precision format, *then* rounds again after the addition — two rounding
events, two small opportunities to lose precision. A fused instruction computes the
entire `(a × b) + d` expression at higher internal precision and rounds only once, at the
very end — this single-rounding behavior is called **fused rounding**, and it is the
entire reason chips bother implementing a fused variant instead of just relying on
separate multiply and add instructions. Across the thousands of accumulations a full FFT
performs, fused rounding's small per-operation precision gain can measurably improve the
final result's accuracy — valuable enough that this chapter goes to the trouble of
hand-encoding an instruction the assembler won't give you for free.

## ISA Versus Toolchain: Two Separate Things

!!! mascot-thinking "The chip and the tool that talks to it are not the same thing"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Chapter 20 taught you to distinguish what a chip's *instruction set architecture*
    actually supports from what a datasheet claims. This chapter draws a second, equally
    important line: what an ISA supports, and what a specific piece of *software* — an
    assembler, in this case — has been programmed to generate for you.

**ISA versus toolchain** is the general principle behind the VFMA gap: a CPU's
instruction set architecture defines the complete universe of instructions the silicon
can execute, while a toolchain (an assembler, compiler, or IDE) is separate software that
implements support for some subset of that universe, chosen by whoever wrote the tool.
MicroPython's inline assembler is a small, deliberately lightweight tool — it was never
meant to cover every corner of the ARMv8-M instruction set, and VFMA simply fell outside
what its authors implemented. The ISA does not have this limitation; only the tool does.

## How an Instruction Becomes Bits: Opcodes and Encoding

To write VFMA's bits yourself, you need to understand how *any* instruction becomes bits
in the first place. Every machine instruction, once assembled, is a fixed-width binary
pattern, and a specific portion of that pattern — the **opcode** — identifies which
operation the instruction performs, distinguishing `VADD` from `VMUL` from `VFMA` at the
hardware level. The complete scheme for how an instruction's meaning maps onto its binary
representation is its **instruction encoding**: which bit positions hold the opcode,
which hold register numbers, which hold immediate values or condition codes.

ARM documents every instruction's encoding in an **encoding table** — a reference
diagram, published in ARM's architecture reference manual, that shows exactly which bit
range means what for a given instruction class. Reading VFMA's encoding table tells you,
for instance, that bits 6, 12, and 22 together select which of the 32 floating-point
registers is the destination, spread across the word in a pattern chosen for the
hardware's convenience, not for human readability. Each such named bit range is called an
**encoding bit field** — a specific, labeled subset of an instruction's bits carrying one
piece of meaning (an opcode, a register number, a condition).

## Thumb-2 Encoding and the Halfword

Not every Thumb instruction is the same width. Chapter 21 introduced Thumb instructions
generally; **Thumb-2 encoding** specifically allows some instructions to be a single
16-bit **halfword** — the natural unit Thumb instructions are measured in — while others,
including VFMA, are 32 bits wide, built from two consecutive halfwords read together as
one instruction. Recognizing which category an instruction falls into is the first thing
its encoding table tells you, because it determines how many bits you'll ultimately need
to compute.

## Hand-Encoding VFMA, Bit Field by Bit Field

With the encoding table in hand, hand-encoding VFMA means computing the exact 32-bit
pattern for a specific instance of the instruction — say, `VFMA s2, s0, s1` — by placing
the correct opcode bits and the correct register-number bits into their documented
positions, then combining them:

| Encoding bit field | Purpose | Example value for `VFMA s2, s0, s1` |
|---|---|---|
| Opcode bits | Identifies this as VFMA, not another FPU instruction | fixed pattern from the encoding table |
| Sd (destination register) | Selects `s2` as the accumulator | register-number bits for s2 |
| Sn (first operand) | Selects `s0` | register-number bits for s0 |
| Sm (second operand) | Selects `s1` | register-number bits for s1 |

Combining these fields — shifting each into its documented bit position and OR-ing them
together, the exact **register bit manipulation** technique from Chapter 17 — produces a
single 32-bit **raw machine word**: the literal binary value the CPU will decode and
execute, with no assembler mnemonic involved at any point.

Because `asm_thumb` cannot generate this word from a mnemonic, it must be inserted
directly into the instruction stream using a **data directive** — an assembler feature
that places a literal, fixed value at a specific point in the compiled output, rather than
encoding a mnemonic:

```python
@micropython.asm_thumb
def butterfly_step(r0, r1, r2):
    # ... ordinary asm_thumb instructions before and after ...
    data(4, 0xEE621A00)     # hand-encoded VFMA s2, s0, s1 (illustrative bit pattern)
    # ... continues ...
```

`data(4, 0xEE621A00)` tells the assembler "place these exact 4 bytes here, unmodified" —
the assembler trusts you completely at this point; it performs no validation that the
word you supplied actually represents a legal or correct instruction. That trust is
exactly why the next two sections matter so much.

!!! mascot-warning "One wrong bit doesn't produce an error — it produces a different, valid instruction"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Flip one bit in a hand-encoded word, and you very likely will not get a crash or an
    assembler complaint. You will get a *different, perfectly legal* instruction — maybe
    `VFMA` with the wrong operand register, maybe an entirely different FPU operation —
    executing silently and producing plausible-looking wrong answers. This is the single
    riskiest step in the entire course.

## Verifying What You Just Encoded

**Encoding verification** is the non-negotiable follow-up step: confirming that a
hand-encoded raw machine word actually behaves the way you intended, before trusting it
anywhere near real data. The most direct check runs the routine on known inputs where you
can compute the mathematically correct fused multiply-add result by hand, and compares —
exactly the **bit-for-bit match** discipline from Chapter 23, now applied to a single
hand-encoded instruction instead of a whole routine.

A second, complementary check is **disassembly** — running your hand-encoded word through
a disassembler, a tool that performs the reverse translation, taking raw machine code and
producing the mnemonic and operands it represents. If disassembling `0xEE621A00` reports
back `VFMA S2, S0, S1`, that is strong, independent confirmation that your bit-field
arithmetic was correct — the disassembler has no idea what you *intended*, only what the
bits actually say, which makes it a genuinely independent witness rather than a repeat of
your own reasoning.

#### Diagram: Instruction Encoding Bit Field Builder

<iframe src="../../sims/instruction-encoding-bit-builder/main.html" width="100%" height="472px" scrolling="no"></iframe>

<details markdown="1">
<summary>Instruction Encoding Bit Field Builder</summary>
Type: microsim
**sim-id:** instruction-encoding-bit-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply (L3) — construct, calculate
Learning objective: Apply encoding-table bit-field positions to construct a correct 32-bit raw machine word for a chosen VFMA register combination, and verify it via a built-in disassembly check.

Canvas layout:
- Top (200px): A 32-bit grid (two rows of 16 bits each, representing the two halfwords of a Thumb-2 instruction), with labeled, color-coded regions for opcode, Sd, Sn, Sm bit fields
- Middle (150px): Three register-selector dropdowns (destination, operand 1, operand 2), each choosing from s0-s7 for simplicity
- Bottom (150px): Computed hex word output, plus a "Disassemble" button and its result

Visual elements:
- Bit grid updates live as each register selector changes, highlighting exactly which bits flip
- Color legend matching the table in the chapter text (opcode / Sd / Sn / Sm)
- Hex output field showing the assembled 32-bit word

Interactive controls:
- Three dropdowns: destination register, operand 1, operand 2
- Button: "Assemble word" — computes and displays the hex value from current selections
- Button: "Disassemble" — takes the current hex value and reports the mnemonic and operands it decodes back to, confirming (or, if the learner has manually edited a bit, contradicting) the original selections
- Checkbox: "Flip one random bit" — demonstrates the warning from the text: flipping a single bit still disassembles to a valid-looking, but different, instruction

Instructional Rationale: An Apply-level objective calling for construction and
calculation is best served by letting the learner directly build a word from register
choices and immediately verify it via disassembly — closing the loop between encoding and
verification the way the chapter's own worked example does.

Implementation: p5.js, bit grid as 32 individually colored rectangles, hex computed via bitwise shifts and ORs matching the real ARM encoding scheme
</details>

## The Road Not Taken: Fixed-Point Arithmetic

Hand-encoding VFMA is the deepest this course goes into floating-point assembly. A
parallel universe of optimization exists that this course deliberately does not build:
**fixed point arithmetic** — representing fractional values as scaled whole numbers
instead of IEEE 754 floats, so that ordinary integer instructions (which every Cortex-M
core has, with or without an FPU) can perform what amounts to fractional-value math.

The standard notation for this is **Q format numbers**: a `QM.N` format uses `M` bits for
the integer part and `N` bits for the fractional part of a fixed-point value, packed into
one integer register. Two specific formats matter for ARM DSP work: **Q15 format**, a
16-bit signed integer representing values in the range \([-1, 1)\) using 15 fractional
bits, and **Q31 format**, its 32-bit counterpart with 31 fractional bits, offering finer
precision at the cost of twice the storage.

Fixed-point arithmetic depends on a companion technique, **saturating arithmetic**:
instead of silently wrapping around on overflow (the ordinary behavior of integer
addition, and the exact bug pattern Chapter 17's counter-wraparound section covered),
saturating operations clamp their result to the largest or smallest representable value
when the true mathematical result would exceed the format's range. This matters
enormously for audio: an ordinary integer overflow could flip a very loud sample from
maximum-positive to maximum-negative in one wrapped step, producing a jarring pop;
saturation instead clips cleanly at the format's ceiling, the far less harmful failure
mode.

Combining these ideas, an **integer FFT** — equivalently, a **fixed point FFT** — performs
every butterfly using Q15 or Q31 saturating integer arithmetic rather than the
single-precision floats this course's assembly module builds throughout. On hardware
without an FPU (a Cortex-M0+, for instance), this is not an optional speedup — it is the
*only* way to do a fast FFT at all, since floating-point would otherwise require slow
software emulation.

## Precision Tradeoffs, and Why This Course Stops Here

Choosing between floating-point and fixed-point is a genuine set of **precision
tradeoffs**, not a strictly-better-or-worse decision: floating point offers wide dynamic
range and forgiving scaling (Chapter 19's FPU chapters never needed to worry about a
value exceeding some fixed bound), at the cost of requiring FPU hardware. Fixed point
runs on any core, integer-only included, but demands careful manual scaling at every
stage of a computation to avoid saturating away real signal — get the scaling wrong, and
saturation silently discards precision rather than raising any error.

This course scopes fixed-point arithmetic deliberately as something to understand, not
implement. As the course description states directly: MicroPython's inline assembler
exposes none of the actual DSP saturating instructions a real Q15 implementation would
need, so no working fixed-point FFT gets built here. A scoping study — analyzing what a
Q15 FFT would require on this hardware, without necessarily completing a working
implementation — remains an available capstone topic in Chapter 27, for exactly the
students this gap leaves curious.

??? question "Why might a Q15 FFT be a bad choice for a signal with a very wide dynamic range — quiet passages and loud transients in the same recording? Click to check."
    Q15's fixed 15 fractional bits give every value the same fixed precision regardless of
    magnitude, unlike floating point's exponent, which lets precision automatically track
    a value's size. A very quiet passage represented in Q15 uses only a small fraction of
    the format's range, losing relative precision, while a loud transient risks
    saturating near the format's ceiling — floating point handles both extremes
    gracefully in the same representation; fixed point requires you to choose (and
    potentially adjust) the scaling by hand.

!!! mascot-celebration "You've reached the floor of the abstraction ladder"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Not bad for a $5 chip! You hand-encoded an instruction your own toolchain refused to
    write, verified it two independent ways, and can now explain precisely why this
    course stopped at floating point instead of chasing fixed point too. Chapter 26 pulls
    every variant you've built — from Chapter 12's Python FFT through today's hand-encoded
    instruction — into one honest, predicted-then-measured comparison.

[See Annotated References](./references.md)
