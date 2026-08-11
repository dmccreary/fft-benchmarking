# MicroSim Build Log: Instruction Encoding Bit Builder

- **MicroSim ID:** `instruction-encoding-bit-builder`
- **Chapter:** 25 — Beyond the Assembler: Hand-Encoding and Instruction Formats
- **Library:** p5.js 1.11.10
- **Bloom level:** Apply (construct, calculate)
- **Canvas height:** 470 (iframe 472px)
- **Date:** 2026-08-11

## Learning Objective

Apply encoding-table bit-field positions to construct a correct 32-bit raw
machine word for a chosen VFMA register combination, and verify it via a
built-in disassembly check.

## Encoding: Verified Against a Real Assembler

The spec asks for "hex computed via bitwise shifts and ORs matching the real ARM
encoding scheme", so guessing was not acceptable. The implemented layout is the
ARMv8-M VFMA T1 encoding:

```
1110 1110 1 D 1 0  Vn | Vd  101 sz  N 0 M 0  Vm
```

I assembled four instances with the system `clang` targeting
`thumbv8m.main-none-eabi` / `cortex-m33` and disassembled with `llvm-objdump`,
then compared against `encode()` evaluated inside the running page:

| Instruction | Toolchain | `encode()` |
|---|---|---|
| `vfma.f32 s2, s0, s1` | `eea0 1a20` | `0xEEA01A20` |
| `vfma.f32 s0, s1, s2` | `eea0 0a81` | `0xEEA00A81` |
| `vfma.f32 s7, s7, s7` | `eee3 3aa3` | `0xEEE33AA3` |
| `vfma.f32 s0, s0, s0` | `eea0 0a00` | `0xEEA00A00` |

All four match exactly.

## Discrepancy With the Chapter Text — Worth a Look

Chapter 25 uses `data(4, 0xEE621A00)` for `VFMA s2, s0, s1`, and the surrounding
prose labels it "(illustrative bit pattern)". It is not the real encoding: the
real one is `0xEEA01A20`. Decoded, `0xEE621A00` lands in the `VMUL`/`VNMUL` row
of the same table, which makes it an unusually good demonstration of the
chapter's own warning — but it is not VFMA.

Because the spec explicitly asks the sim for the real encoding, the sim uses
`0xEEA01A20` and the page carries an admonition explaining the difference rather
than silently contradicting the chapter. **If the chapter is intended to show
the real value, `0xEE621A00` should become `0xEEA01A20` in two places (the code
block around line 168 and the disassembly sentence around line 196).** That is a
text edit outside this sim's scope, so it has been flagged rather than made.

## Design Decisions

**Two halfword rows, because that is the storage format.** Bits 31-16 on one
row, 15-0 on the next, each cell labeled with its bit number. This is the layout
the chapter's Thumb-2 discussion describes, and it makes the halfword boundary
a visible thing rather than an assertion.

**Color by bit field, which exposes the split registers.** `Sd` is bits 15-12
*and bit 22*. Coloring bit 22 the same red as bits 15-12 makes the
non-contiguity impossible to miss — it sits alone in the middle of what looks
like solid opcode. This is the single most likely hand-encoding error and the
grid surfaces it without a word of explanation.

**Live rebuild plus an explicit Assemble button.** The spec asks for both a live
grid and an "Assemble word" button, which only makes sense if the two do
different things. Changing a selector rebuilds the grid immediately and flashes
the bits that flipped; hand edits and the random flip then diverge from that
canonical value; "Assemble word" resyncs and discards the edits. The panel says
which state you are in.

**Clickable bits.** The spec's Disassemble description refers to "if the learner
has manually edited a bit", so manual editing has to exist. Every cell is a hit
target.

**A real disassembler, covering the neighbors.** Rather than special-casing
"correct" versus "corrupted", `decode()` implements the whole floating-point
three-register table keyed on bit 23, bits 21-20, and bit 6 — sixteen slots,
thirteen of them real instructions. This is what makes the spec's warning land:
flip bit 23 and you get `VMUL.F32 s2, s0, s1`, a completely legal instruction.
The sim proves the claim instead of asserting it.

**Verdict is computed, not assumed.** The green/red judgment compares the
decoded mnemonic *and* all three decoded register numbers against the current
selector values, so a hand edit that happens to produce a valid VFMA with
different registers is still reported as a mismatch.

## Bug Found and Fixed

Control-row labels overlapped their neighbors: `Sd` at x=12 with a "destination"
caption at x=106 ran straight into the `Sn` label at x=128, rendering as
`destinatioSn`. Fixed by folding the captions into the labels
(`Sd (dest)`, `Sn (op 1)`, `Sm (op 2)`) and respacing the three selectors to
82 / 224 / 366.

## Verification

- `encode()` checked against the toolchain for four register combinations (table
  above), evaluated in the live page via `page.evaluate`.
- Round trip verified: `decode(0xEEA01A20)` returns
  `{mnem: 'VFMA', sd: 2, sn: 0, sm: 1}`.
- Single-bit corruption verified: `decode(0xEE201A20)` — bit 23 cleared —
  returns `VMUL.F32 s2, s0, s1`, and the panel reports the mismatch in red.
- Field colors spot-checked against the rendered grid for `VFMA.F32 s2, s0, s1`:
  bit 22 (D) = 0, bits 15-12 (Vd) = 0001, bits 19-16 (Vn) = 0000, bit 7 (N) = 0,
  bit 5 (M) = 1, bits 3-0 (Vm) = 0000. All correct for s2, s0, s1.
- Playwright capture at exactly 800×472 with pageerror and console-error
  listeners; both empty.
- `sync-iframe-heights.py`, `validate-sims.py`, and `test-iframe-heights.py`
  all pass.
