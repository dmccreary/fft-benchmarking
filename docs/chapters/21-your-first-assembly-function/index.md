---
title: "Your First Assembly Function: Registers and Loops"
description: ARM Thumb assembly from zero — general-purpose registers, moves, comparisons, branches, and MicroPython's inline assembler
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Your First Assembly Function: Registers and Loops

## Summary

This chapter introduces ARM Thumb assembly from zero: general-purpose registers, the instruction set for moves, comparisons, and branches, and the calling convention MicroPython's inline assembler uses to pass arguments and return values. It builds a simple loop entirely in assembly as a first working program. This is the foundation the floating-point and butterfly assembly chapters build directly on.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

1. ARM Assembly
2. Add Instruction
3. Argument Passing Convention
4. Assembly Label
5. Assembly Loop
6. CPU Register
7. Compare Instruction
8. Conditional Branch
9. General Purpose Register
10. Inline Assembler
11. Instruction Mnemonic
12. Machine Code
13. Move Instruction
14. Reading Assembly Code
15. Register Allocation
16. Return Value Register
17. Thumb Instructions
18. asm_thumb Decorator

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)
- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)

---

!!! mascot-welcome "Time to transform — into an assembly programmer!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You confirmed your chip has the hardware. Now you get to program it directly, one
    instruction at a time, with nothing between your code and the CPU. Your first
    assembly function is smaller than it sounds — let's build it from the ground up.

## From Machine Code to Mnemonics

Underneath every program this course has run so far, the Cortex-M33 ultimately executes
**machine code** — raw binary patterns, each one telling the CPU to perform one specific
operation. No human reads or writes those binary patterns directly; instead, **ARM
assembly** gives each pattern a short, human-readable **instruction mnemonic** — `MOV`,
`ADD`, `CMP`, `B` — standing in for the exact binary encoding an assembler translates it
into. Cortex-M cores specifically execute **Thumb instructions** — a compact instruction
encoding, either 16 or 32 bits per instruction, that ARM designed for smaller code size
than its older 32-bit-only encoding. Every instruction in this chapter and the two that
follow is a Thumb instruction; there is no other kind available on this chip.

## Registers: The CPU's Own Scratch Space

Before any instruction can do useful work, it needs somewhere to keep the values it is
working on. A **CPU register** is a tiny, extremely fast storage location built directly
into the processor itself — reading or writing a register takes a single clock cycle,
far faster than reading from RAM. The Cortex-M33 provides thirteen **general purpose
registers**, named `r0` through `r12`, each holding one 32-bit value that your code is
free to use for any purpose — a loop counter, a memory address, an intermediate result.
Three additional registers have fixed, special jobs: `sp` (the stack pointer), `lr` (the
link register, holding a return address), and `pc` (the program counter, holding the
address of the next instruction) — this chapter's examples use only the thirteen
general-purpose ones.

!!! mascot-thinking "Thirteen boxes, infinite bookkeeping"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    In Python, you can have as many named variables as you want. In assembly, you have
    exactly thirteen general-purpose registers and nothing else to work with directly —
    every value your routine needs has to fit into that fixed set, or be temporarily
    saved to memory and reloaded later. Deciding what goes where is a real design step,
    not an afterthought.

## Three Instructions That Do Almost Everything

Three instruction types carry most of the work in a simple assembly routine.

The **move instruction**, `MOV`, copies a value into a register — either a small
constant, or the contents of another register:

```
MOV r0, #5      ; put the literal value 5 into r0
MOV r1, r0      ; copy the value in r0 into r1
```

The **add instruction**, `ADD`, adds two values and stores the result in a register:

```
ADD r0, r0, r1  ; r0 = r0 + r1
```

The **compare instruction**, `CMP`, subtracts one value from another *without* storing
the result anywhere — its only job is to set internal status flags recording whether the
result was zero, negative, or produced a carry. Nothing about `CMP` is visible in a
register afterward; its only effect is on those flags:

```
CMP r0, #0      ; compare r0 against 0, setting status flags accordingly
```

## Labels and Conditional Branches: Building a Loop

`CMP`'s status flags become useful the instant you pair them with a **conditional
branch** — an instruction that jumps to a different point in the program, but only if a
specific flag condition holds. `BNE` (branch if not equal) jumps only if the most recent
comparison found the two values unequal; `BEQ` branches only if they were equal, and
several other condition codes exist for greater-than, less-than, and so on. A branch
target is marked with an **assembly label** — a name followed by a colon, placed at the
exact instruction you want to jump to:

```
    MOV r0, #5          ; r0 = counter, starting at 5
loop_start:
    ; ... do something with r0 here ...
    SUB r0, r0, #1       ; r0 = r0 - 1
    CMP r0, #0           ; compare r0 against 0
    BNE loop_start        ; if r0 != 0, jump back to loop_start
```

This pattern — initialize, label, do work, decrement, compare, conditionally branch back
— is an **assembly loop**, the direct, hardware-level equivalent of a Python `for` or
`while` loop, built from individual instructions rather than a single keyword.

#### Diagram: Register Tracer

<iframe src="../../sims/register-tracer/main.html" width="100%" height="442px" scrolling="no"></iframe>

<details markdown="1">
<summary>Register Tracer</summary>
Type: microsim
**sim-id:** register-tracer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand (L2) — interpret, trace
Learning objective: Interpret a short assembly loop by tracing register contents and status flags one instruction at a time, building the "reading assembly code" skill.

Canvas layout:
- Top (300px): The five-instruction loop source code shown line by line, with the currently executing line highlighted
- Bottom (200px): A register panel showing r0 and the Z (zero) status flag, updating live

Visual elements:
- Source listing exactly matching the loop example in the chapter text (MOV r0 #5, loop_start:, SUB r0 r0 #1, CMP r0 #0, BNE loop_start)
- Highlighted current-instruction indicator (an arrow or highlighted background)
- r0 value shown as a large readable number
- Z flag shown as a lit/unlit indicator with the label "Zero flag"

Data Visibility Requirements:
  Stage 1: Show initial state — r0 undefined, Z flag off, arrow at MOV instruction
  Stage 2: After MOV — r0 = 5
  Stage 3: After first SUB — r0 = 4
  Stage 4: After first CMP — Z flag off (4 != 0)
  Stage 5: After first BNE — arrow jumps back to loop_start, taken because Z was off
  ... continues through iterations until r0 reaches 0, Z flag turns on, BNE is NOT taken, arrow falls through to end

Interactive controls:
- Button: "Step" — advances exactly one instruction
- Button: "Run to completion" — auto-steps at a readable pace
- Button: "Reset"

Instructional Rationale: A Bloom Understand-level "trace and interpret" objective calls
for step-through with visible concrete state at every stage, not continuous animation —
the learner must see r0 and the Z flag update after every single instruction to build a
mental model of how CMP and BNE cooperate.

Implementation: p5.js, instruction list as an array with a program-counter index, register/flag state as simple variables updated per step() call
</details>

## Assembling Inside MicroPython: The `asm_thumb` Decorator

Writing raw assembly normally requires a separate toolchain — an assembler, a linker, a
way to load the resulting machine code onto the chip. MicroPython removes all of that
friction with its **inline assembler**: the ability to write Thumb assembly instructions
directly inside a `.py` file, translated to machine code automatically the moment the
function is defined, with no external tools at all.

The mechanism is the **`asm_thumb` decorator** — `@micropython.asm_thumb` placed above a
function definition tells MicroPython to treat everything inside that function's body not
as Python statements, but as a sequence of Thumb assembly instructions:

```python
@micropython.asm_thumb
def sum_to_n(r0):
    label(loop_start)
    mov(r1, 0)          # r1 will accumulate the running sum
loop_body:
    add(r1, r1, r0)      # r1 = r1 + r0 (add current counter value)
    sub(r0, r0, 1)        # r0 = r0 - 1
    cmp(r0, 0)
    bgt(loop_body)         # branch back while r0 > 0
    mov(r0, r1)             # move the final sum into r0 to return it
```

Calling `sum_to_n(5)` from ordinary Python runs this entire routine as real, compiled
Thumb machine code — no interpreter loop, no boxed values, exactly the speed advantage
Chapter 19 predicted for the bottom rung of the abstraction ladder.

## Passing Arguments and Returning a Result

That last example relied on a convention it never explained: why does the parameter list
say `def sum_to_n(r0):`, and why does moving a value into `r0` at the end make it come
back out as the function's return value? The answer is the ARM **argument passing
convention** MicroPython's inline assembler follows: the first argument to an
`asm_thumb` function arrives already sitting in register `r0`, the second (if any) in
`r1`, and so on up through `r3`. Whatever value sits in `r0` at the moment the function
ends becomes the value Python receives back — `r0` doing double duty as both the first
argument register and the **return value register** is not a coincidence; it is the
standard convention every ARM-targeting compiler and hand-written routine follows, so
that hand-written assembly and compiled code can call each other reliably.

!!! mascot-tip "Read the parameter names as a promise, not just syntax"
    ![Echo giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Writing `def sum_to_n(r0):` isn't just a naming choice — it's you telling
    MicroPython's assembler exactly which register your first argument will already be
    sitting in when the function starts. Name it anything else in the parameter list and
    the assembler still puts the first argument in `r0`; the parameter name is really
    documentation for *you*, not an instruction to the hardware.

## Register Allocation: Deciding Who Gets Which Box

With only thirteen general-purpose registers and no automatic variable management,
writing anything beyond a trivial routine requires deliberate **register allocation** —
consciously deciding which register holds which value for how long, and making sure two
different purposes never collide in the same register at the same time. In `sum_to_n`
above, the allocation was simple: `r0` holds the loop counter (and later, the return
value), `r1` holds the running sum. A slightly longer routine might need four or five
values live simultaneously, and keeping track of which register means what — on paper, in
a comment, or simply in your head — is a real, transferable skill, not busywork.

!!! mascot-warning "Overwriting a register you still needed is the single most common assembly bug"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If `sum_to_n` had written its running sum into `r0` instead of `r1`, it would have
    silently destroyed the loop counter it still needed to decrement — the loop would
    either never end or end after the wrong number of iterations, with no error message
    at all. Assembly does not stop you from reusing a register you still need; it simply
    does what you told it to.

## Reading Assembly Code You Didn't Write

Writing your own short loop is one skill; **reading assembly code** someone else wrote —
tracing what a register holds at each step, without running it — is a separate, arguably
more important one. This course leans on reading deliberately: production systems call
well-tested assembly libraries far more often than they write new ones, and the durable
skill for most working engineers is confidently tracing what an unfamiliar routine does,
not authoring one from scratch. The `sum_to_n` walkthrough above is exactly that exercise
in miniature — five instructions, one register holding the counter, one accumulating the
result, and a conditional branch tying them into a loop, entirely readable once you know
what each mnemonic does.

??? question "In `sum_to_n`, what would happen if the line `bgt(loop_body)` were changed to branch unconditionally, every time, with no comparison at all? Click to check."
    The loop would never terminate — `r0` would keep decrementing forever (eventually
    wrapping around past zero, since it's an unsigned register), and the function would
    never return. This is the assembly-level version of an infinite loop, and it's a
    direct consequence of removing the `CMP`-driven condition that `BGT` depends on to
    decide whether to branch.

!!! mascot-celebration "Your first real assembly function — running at full hardware speed"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Time to transform, indeed — you just wrote and ran genuine ARM Thumb machine code,
    with full control over every register. Chapter 22 extends this exact skill set to the
    FPU's own register bank, which is the last piece you need before hand-writing the
    FFT's butterfly operation itself.
