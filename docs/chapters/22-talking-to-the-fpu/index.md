---
title: "Talking to the FPU: Floating-Point Assembly"
description: The FPU's own register bank and instruction set — load, store, add, multiply, subtract, and multiply-accumulate on single-precision floats, plus the pointer arithmetic to address a buffer from assembly
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Talking to the FPU: Floating-Point Assembly

## Summary

This chapter extends the assembly skills from the previous chapter to the floating-point register bank and the FPU instruction set — load, store, add, multiply, and subtract on single-precision floats — along with pointer arithmetic for addressing a buffer from assembly. It covers the multiply-accumulate instruction that makes fused operations possible. These are exactly the instructions the assembly FFT butterfly needs.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Address Of Buffer
2. Byte Offset
3. FPU Operations
4. Floating Point Register
5. Hardware Multiplier
6. Load Store Architecture
7. MAC Instruction
8. Memory Address
9. Multiply Accumulate
10. No Allocation In Timed Region
11. Pointer Arithmetic
12. Register Bank s0 to s31
13. SIMD Instructions
14. Single Precision Float
15. Typed Array
16. VADD Instruction
17. VLDR Instruction
18. VMUL Instruction
19. VSTR Instruction
20. VSUB Instruction

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)

---

!!! mascot-welcome "Time to transform — into floating-point fluency!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Chapter 21 gave you integers and loops. The FFT butterfly needs floating-point
    multiplication and addition, running on real audio data sitting in memory. Both of
    those need a skill you haven't used yet — talking directly to the FPU.

## Load-Store Architecture: Registers Do the Work, Memory Just Holds Data

Before touching a single FPU instruction, one architectural rule from Chapter 21 needs to
be made explicit, because everything in this chapter depends on it. ARM cores use a
**load-store architecture**: arithmetic instructions like `ADD` or `VMUL` can only operate
on values already sitting in registers — never directly on a value still in memory. To
work on a number stored in RAM, you must first explicitly *load* it into a register,
compute with it there, and then explicitly *store* the result back to memory when you're
done. This is a deliberate design choice, not a limitation — keeping arithmetic
instructions register-only lets each one execute in a single, predictable cycle, with all
the slower memory-access work concentrated into two clearly named instruction types.

## A Second Register File, Just for Floats

Chapter 21's general-purpose registers, `r0` through `r12`, hold integers and memory
addresses, but they cannot hold floating-point values directly in a form the FPU can
compute on. The FPU has its own, completely separate set of storage: the **register bank
s0 to s31**, thirty-two dedicated **floating point registers** named `s0` through `s31`,
each one exactly wide enough to hold one **single precision float** — a 32-bit IEEE 754
value, the same format Chapter 19 introduced when comparing boxed and unboxed
representations. Just as `r0`-`r12` are the FPU's counterpart on the integer side,
`s0`-`s31` exist purely for floating-point work, and general-purpose instructions like
`ADD` cannot touch them at all — floating-point work requires floating-point
instructions, described next.

## FPU Operations: Load, Store, Add, Multiply, Subtract

The FPU's instruction set — its **FPU operations** — mirrors the load-store pattern from
general-purpose registers, with a `V` prefix marking each one as an FPU instruction
(short for "Vector," from ARM's broader vector floating-point architecture, even though
this chapter uses only single scalar values per instruction).

The **VLDR instruction** ("vector load register") loads one single-precision float from a
memory address into an `s` register. The **VSTR instruction** ("vector store register")
does the reverse — writes the value in an `s` register out to a memory address. Both
require a general-purpose register holding the actual address to read from or write to,
which is exactly why Chapter 21's integer-register skills remain essential here.

```
VLDR s0, [r0]        ; load a float from the address in r0 into s0
VLDR s1, [r0, #4]     ; load a float from 4 bytes past that address into s1
VSTR s2, [r1]          ; store the float in s2 to the address in r1
```

Once values are in `s` registers, three arithmetic instructions cover this chapter's
needs: the **VADD instruction** adds two floating-point registers, the **VSUB
instruction** subtracts one from another, and the **VMUL instruction** multiplies two
together — each writing its result into a third `s` register:

```
VADD s3, s0, s1        ; s3 = s0 + s1
VSUB s4, s0, s1         ; s4 = s0 - s1
VMUL s5, s0, s1          ; s5 = s0 * s1
```

Now that each instruction has been introduced individually, the table below simply
organizes what you already know, for quick reference while writing your own routines:

| Instruction | Operation | Operand location |
|---|---|---|
| `VLDR sD, [rN]` | Load a float from memory into `sD` | Memory → register |
| `VSTR sD, [rN]` | Store the float in `sD` to memory | Register → memory |
| `VADD sD, sN, sM` | `sD = sN + sM` | Register → register |
| `VSUB sD, sN, sM` | `sD = sN - sM` | Register → register |
| `VMUL sD, sN, sM` | `sD = sN * sM` | Register → register |

## Finding a Buffer's Address: Pointers and Byte Offsets

`VLDR s0, [r0]` only works once `r0` actually holds a valid **memory address** — the
numeric location in RAM where a value lives. Getting that starting address is the job of
the **address of buffer** operation: MicroPython exposes the underlying memory location
of an array-like object, which you pass into your `asm_thumb` function as an ordinary
integer argument, arriving in `r0` per Chapter 21's calling convention.

Reading a single float at that starting address is easy — but reading the *second* float
in a buffer of many requires **pointer arithmetic**: computing a new address by adding to
the base address, rather than starting from scratch. Because each single-precision float
occupies exactly 4 bytes, the address of element `i` in a buffer is `base_address + i × 4`
— that multiple of 4 is a **byte offset**, the distance in bytes (not elements) you must
add to a base address to reach a specific array element. `VLDR s1, [r0, #4]` in the
example above is exactly this: "load the float sitting 4 bytes past whatever address is
in `r0`" — element index 1, in a buffer of 4-byte floats.

!!! mascot-thinking "Why does the offset have to be in bytes, not array positions?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Memory addresses always count individual bytes, regardless of what data type lives
    there — the hardware has no concept of "the third float." It only knows "the byte at
    this address." Software (a compiler, or you, writing assembly by hand) is entirely
    responsible for converting "element 3" into "byte offset 12," by multiplying the
    element index by the size of one element.

## Typed Arrays: Buffers With a Predictable Stride

That byte-offset arithmetic only works if you know exactly how many bytes separate one
element from the next — and that is precisely what a plain Python list does *not*
guarantee, since a list holds boxed values scattered across the heap with no fixed
distance between them. A **typed array** — created with `array.array('f', ...)` in
MicroPython, using the `'f'` type code for 32-bit single-precision floats — instead
stores its values contiguously, back to back in memory, each one exactly 4 bytes wide with
no wrapper. That fixed, predictable stride is what makes `base_address + i × 4` a valid
formula at all. Every buffer this course's assembly routines touch, from here through the
final butterfly implementation, is a typed array for exactly this reason.

#### Diagram: Address and Byte Offset Explorer

<iframe src="../../sims/address-byte-offset-explorer/main.html" width="100%" height="492px" scrolling="no"></iframe>

<details markdown="1">
<summary>Address and Byte Offset Explorer</summary>
Type: microsim
**sim-id:** address-byte-offset-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Apply (L3) — calculate, demonstrate
Learning objective: Apply the byte-offset formula to compute the correct VLDR offset for a chosen element index in a typed array of floats.

Canvas layout:
- Top (200px): A horizontal memory strip showing 8 contiguous 4-byte float slots, each labeled with its element index (0-7) and its byte address, starting from a base address like 0x20001000
- Bottom (300px): A calculator panel: element index input, computed byte offset, computed full address, and the resulting VLDR instruction text

Visual elements:
- Memory strip drawn as 8 equal-width boxes, each 4 bytes wide, with a running byte-address label under each box
- Selected element highlighted in a distinct color
- Calculator shows the formula `offset = index * 4` filled in with live numbers

Interactive controls:
- Slider or click-to-select: choose element index (0-7)
- Base address input (default 0x20001000, editable)
- Live output: "VLDR s0, [r0, #<offset>]" text, updating as the index changes

Behavior:
- Selecting element index 3 highlights the 4th box, shows offset = 12, full address = base + 12, and displays "VLDR s0, [r0, #12]"
- An intentional wrong-answer check: entering a non-multiple-of-4 "manual offset" in an optional advanced field shows a warning that misaligned offsets do not correspond to any real element boundary

Instructional Rationale: Apply-level objectives call for a parameter-driven calculator —
letting the learner pick any element index and see the exact instruction text it produces
directly exercises the byte-offset formula rather than just displaying it.

Implementation: p5.js, memory strip drawn as rectangles with text labels, offset computed live from a numeric input
</details>

## Hardware Multiplier and the Multiply-Accumulate Instruction

Underneath `VMUL`, the FPU contains a dedicated **hardware multiplier** — a piece of
silicon built specifically to multiply two floating-point values in a small, fixed number
of cycles, rather than emulating multiplication through repeated addition in software.
That same hardware multiplier also powers a more specialized instruction: **multiply
accumulate**, computed by a **MAC instruction** (on this FPU, `VMLA` — vector multiply
accumulate), which performs `d = d + (a × b)` as a single fused operation rather than a
separate multiply followed by a separate add.

```
VMLA s2, s0, s1        ; s2 = s2 + (s0 * s1), in one instruction
```

Fusing the multiply and the add saves a cycle compared to issuing `VMUL` then `VADD`
separately, and — more subtly — it avoids rounding the intermediate multiplication result
before adding, which is slightly more numerically accurate than two separate operations.
This exact instruction pattern is the arithmetic heart of correlation and the FFT: every
butterfly operation in Chapter 23 is fundamentally a handful of multiply-accumulate steps
combining a sample with a twiddle factor.

## SIMD Instructions: A Preview, Not a Detour

You may notice that so far, every instruction here operates on exactly one float at a
time. Some ARM cores also support **SIMD instructions** — Single Instruction, Multiple
Data — which pack several values into one register and operate on all of them with a
single instruction, processing multiple data points per cycle instead of one. That
technique, called vectorization, is a genuinely more advanced optimization this course
returns to directly in Chapter 24, once the scalar (one-value-at-a-time) version you're
building now is working and validated. Naming it here is deliberate: knowing a faster
path exists, and choosing not to reach for it yet, is itself part of writing correct code
before writing fast code.

## No Allocation in the Timed Region

!!! mascot-warning "The one rule that protects every benchmark from here forward"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    MicroPython's automatic memory manager, from Chapter 19, can pause your program at
    unpredictable moments to reclaim memory — a garbage-collection pause. If one of those
    pauses lands inside code you are timing, it silently inflates your measurement with
    cycles that have nothing to do with your algorithm.

**No allocation in timed region** is the discipline of guaranteeing that nothing inside a
block of code you are about to benchmark ever triggers a new memory allocation — no new
list, no new typed array, no new object of any kind — because MicroPython's garbage
collector can only run in response to allocations, and a collector pause inside your
timed loop is exactly the kind of hidden variance source Chapter 18 warned about. The
concrete practice this chapter establishes: allocate every typed array your routine needs
*before* you start the timer, pass in only pre-allocated buffers, and let your assembly
routine touch nothing but `VLDR`/`VSTR` against memory that already exists. Every assembly
example for the rest of this course follows this rule without exception.

## Putting the Pieces Together

The routine below combines everything above — general-purpose registers holding
addresses (Chapter 21), floating-point registers holding values, byte-offset pointer
arithmetic, and a fused multiply-accumulate — to multiply two typed-array buffers
element-by-element and accumulate the total into a single result, entirely in assembly:

```python
@micropython.asm_thumb
def dot_product_fpu(r0, r1, r2):
    # r0 = address of buffer a, r1 = address of buffer b, r2 = element count
    vldr(s2, [r0, 0])
    vsub(s2, s2, s2)          # s2 = 0.0, our running accumulator

loop_body:
    vldr(s0, [r0, 0])          # load a[i]
    vldr(s1, [r1, 0])           # load b[i]
    vmla(s2, s0, s1)             # s2 += a[i] * b[i]
    add(r0, r0, 4)                 # advance pointer a by one float (4 bytes)
    add(r1, r1, 4)                  # advance pointer b by one float
    sub(r2, r2, 1)                    # decrement remaining count
    cmp(r2, 0)
    bgt(loop_body)

    vstr(s2, [r0, 0])            # placeholder store; real routines return via r0/s0 convention
```

`dot_product_fpu` receives two buffer addresses and a count in `r0`, `r1`, and `r2` — the
same argument-passing convention from Chapter 21. Each iteration loads one float from
each buffer, multiply-accumulates their product into `s2`, and advances both pointers by
4 bytes before checking the loop condition — the exact structure Chapter 23's butterfly
operation builds on directly.

??? question "If `add(r0, r0, 4)` were changed to `add(r0, r0, 1)`, what would go wrong? Click to check."
    Every `VLDR` after the first would read from the *wrong* address — advancing the
    pointer by only 1 byte instead of 4 means each load would land in the middle of a
    float's byte representation rather than at the start of the next one, producing
    garbage values. This is the byte-offset arithmetic from earlier in the chapter,
    applied incrementally: the pointer's step size must match the element size, every
    time it advances.

!!! mascot-celebration "You can now move real numbers between memory and the FPU"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You're right on frequency! Load, store, add, subtract, multiply, and the fused
    multiply-accumulate — that's every FPU instruction the butterfly operation needs.
    Chapter 23 assembles all of it, plus everything from Chapters 21 and 22, into a
    complete, working FFT written entirely in hand-crafted ARM assembly.

[See Annotated References](./references.md)
