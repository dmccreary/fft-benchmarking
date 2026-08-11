---
title: Instruction Encoding Bit Builder
description: Build the 32-bit Thumb-2 word for VFMA.F32 from three register choices, edit any bit by hand, and disassemble it back to check your work.
image: /sims/instruction-encoding-bit-builder/instruction-encoding-bit-builder.png
og:image: /sims/instruction-encoding-bit-builder/instruction-encoding-bit-builder.png
twitter:image: /sims/instruction-encoding-bit-builder/instruction-encoding-bit-builder.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Instruction Encoding Bit Builder

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Instruction Encoding Bit Builder MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/instruction-encoding-bit-builder/main.html"
        height="472px" width="100%" scrolling="no"></iframe>
```

!!! note "Real encoding, not an illustration"
    The chapter text uses `0xEE621A00` as an *illustrative* bit pattern for
    `VFMA s2, s0, s1`. This simulation uses the actual ARMv8-M encoding, so the
    same instruction assembles to `0xEEA01A20`. Every value the simulation
    produces was checked against a real assembler — see
    [Verification](#verification) below.

## About This MicroSim

The assembler has no mnemonic for `VFMA`, so if you want the instruction you
have to write its bits yourself and drop them into the instruction stream with
`data(4, ...)`. This simulation is that process, made visible.

The 32-bit word is drawn as two halfwords, because that is how Thumb-2 stores
it. Each cell is colored by which encoding bit field it belongs to, and the
first thing worth noticing is that **the register fields are not contiguous**.
A single-precision register number `Sx` is split in two: the top four bits go
in a `V` field and the bottom bit goes somewhere else entirely. `Sd` lives in
bits 15-12 *plus bit 22*, on the other side of the word, embedded in the middle
of what otherwise looks like opcode. That split is not decoration — it is a
consequence of VFP being retrofitted into an encoding space that was already
mostly full, and it is exactly the kind of detail a hand-encoder gets wrong.

The encoding this simulation implements is:

```
1110 1110 1 D 1 0  Vn | Vd  101 sz  N 0 M 0  Vm
```

Where `Vd:D` is the destination register, `Vn:N` is the first operand, `Vm:M`
is the second, `sz = 0` selects single precision, and the `1`, `1`, `0` at bits
23, 21, and 20 together with the `0` at bit 6 are what make this `VFMA` rather
than one of its fifteen neighbors in the same encoding table.

Which brings us to the point of the whole exercise. Press **Disassemble** and
the word decodes back to `VFMA.F32 s2, s0, s1` — independent confirmation that
every field landed correctly. Now tick **Flip one random bit**, or click any
cell in the grid, and press Disassemble again. Sometimes you get an undefined
instruction. Far more often you get something like `VMUL.F32 s2, s0, s1` or
`VFMA.F32 s2, s0, s5`: a perfectly legal instruction that assembles, links,
loads, and runs without a single warning from anything, and computes the wrong
answer.

That is why encoding verification is not optional. A typo in source code is a
compiler error. A typo in a hand-encoded word is a different program.

## How to Use

1. Choose **Sd**, **Sn**, and **Sm** from the three selectors. The bit grid
   rebuilds live, and the bits that changed flash orange — watch how a single
   register change can flip bits in both halfwords at once.
2. Read the assembled word and the `data(4, ...)` line you would paste into
   your source.
3. Press **Disassemble**. Green means the word decodes back to what you asked
   for.
4. Click any cell in the grid to flip that bit by hand, or tick **Flip one
   random bit**. Press Disassemble again and read what you actually built.
5. Try flipping bit 23, then bit 6, then bit 12, disassembling after each. Bit
   23 changes the operation, bit 6 changes it differently, bit 12 changes a
   register. All three produce runnable instructions.
6. Press **Assemble word** to discard your edits and rebuild the canonical
   encoding.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 12-15 minutes

**Prerequisites:**

- Binary and hexadecimal notation
- An instruction is a number the processor interprets
- Thumb-2 instructions are one or two 16-bit halfwords

**Learning Objective:** Apply encoding-table bit-field positions to construct a
correct 32-bit raw machine word for a chosen `VFMA` register combination, and
verify it via a built-in disassembly check.

**Activities:**

1. **Encode by hand first (5 min).** Give students the field layout above and
   ask them to compute the word for `VFMA.F32 s5, s3, s6` on paper before
   touching the simulation. Remind them that `Sx` splits into `Vx = x >> 1` and
   a low bit. Then select those registers and compare. (Answer: `0xEEE21A83`.)
2. **Find the split fields (2 min).** Ask which bits hold `Sd`. Students who
   answer "15 through 12" have missed bit 22 — and would have encoded every
   odd-numbered destination register incorrectly.
3. **Break it on purpose (4 min).** Have each student flip one bit of their
   choice, predict what the instruction will become, then disassemble. Collect
   the results: how many produced an undefined instruction, and how many
   produced a valid but wrong one?
4. **Argue for verification (3 min).** Ask what would have happened if the
   flipped-bit version had been shipped. Establish that no tool in the
   toolchain would have objected, and that the only defense is disassembling
   what you wrote.

**Assessment:** You hand-encode an instruction, run your FFT, and the output is
wrong but not obviously garbage — the spectrum has peaks in roughly the right
places with wrong magnitudes. Describe the first thing you would check and how.

## Related Resources

- [Register Tracer](../register-tracer/index.md) — what these register fields refer to
- [Address and Byte Offset Explorer](../address-byte-offset-explorer/index.md) — the immediate field of a load instruction
- [FFT Stage Architecture](../fft-stage-architecture/index.md) — where in the FFT this instruction would go

## Verification

The encoder in this simulation was checked against a real toolchain rather than
against a reading of the manual. Four `VFMA.F32` instructions were assembled
with `clang -target thumbv8m.main-none-eabi -mcpu=cortex-m33` and disassembled
with `llvm-objdump`:

| Instruction | Assembler output | Simulation output |
|---|---|---|
| `vfma.f32 s2, s0, s1` | `eea0 1a20` | `0xEEA01A20` |
| `vfma.f32 s0, s1, s2` | `eea0 0a81` | `0xEEA00A81` |
| `vfma.f32 s7, s7, s7` | `eee3 3aa3` | `0xEEE33AA3` |
| `vfma.f32 s0, s0, s0` | `eea0 0a00` | `0xEEA00A00` |

## References

- [ARMv8-M Architecture Reference Manual](https://developer.arm.com/documentation/ddi0553/latest/) — the VFMA encoding table and the floating-point three-register instruction space
- [ARM Cortex-M33 Devices Generic User Guide](https://developer.arm.com/documentation/100235/latest/) — the FPU instruction set available on the RP2350's cores
