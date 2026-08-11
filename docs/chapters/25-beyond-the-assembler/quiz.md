# Quiz: Beyond the Assembler: Hand-Encoding and Instruction Formats

Test your understanding of hand-encoding machine instructions, opcode and bit-field structure, encoding verification, and fixed-point tradeoffs with these review questions.

---

#### 1. Why does writing `vfma(s0, s1, s2)` inside a MicroPython `asm_thumb` function produce an assembler error, even though the Cortex-M33's FPU actually supports the VFMA instruction?

<div class="upper-alpha" markdown>
1. Because this is an assembler limitation: MicroPython's inline assembler is a small, lightweight tool that was never implemented to cover every instruction the ARMv8-M ISA supports
2. Because the Cortex-M33's silicon does not actually implement VFMA, despite what the datasheet claims
3. Because VFMA requires a separate coprocessor that the Pico 2 does not have installed
4. Because VFMA can only be used from C, never from any assembly language
</div>

??? question "Show Answer"
    The correct answer is **A**. The gap is in the toolchain, not the hardware: MicroPython's inline assembler simply never implemented a mnemonic for VFMA, even though the chip can execute it. This is an assembler limitation, and the fix — hand-encoding the raw bits yourself — is only possible because the instruction genuinely exists in silicon; the assembler's ignorance of it does not make it unavailable.

    **Concept Tested:** Assembler Limitation

---

#### 2. What is an opcode?

<div class="upper-alpha" markdown>
1. The complete 32-bit binary pattern of an assembled instruction, including all its operands
2. The specific register number selected by an instruction's Sd field
3. The portion of an instruction's encoding that identifies which operation — add, move, branch, and so on — the processor should perform
4. A reference diagram published in ARM's architecture reference manual
</div>

??? question "Show Answer"
    The correct answer is **C**. The opcode is the specific portion of an instruction encoding that distinguishes one operation from another — `VADD` from `VMUL` from `VFMA` — at the hardware level. It is one field among several within the instruction's full binary pattern, which also determines whether the instruction fits in a single 16-bit halfword or needs two, under Thumb-2 encoding. Option A describes the whole encoded instruction, B describes a register field, and D describes an encoding table.

    **Concept Tested:** Opcode

---

#### 3. What is the general principle "ISA versus toolchain" describing, as applied to the VFMA gap in MicroPython's inline assembler?

<div class="upper-alpha" markdown>
1. That every ISA eventually becomes obsolete and is replaced by a new toolchain
2. That the ISA and the toolchain are two names for exactly the same specification
3. That a toolchain can execute instructions the ISA itself does not support
4. That an instruction set architecture defines the complete universe of instructions the silicon can execute, while a toolchain like an assembler implements support for only some subset of that universe, chosen by whoever wrote the tool
</div>

??? question "Show Answer"
    The correct answer is **D**. An ISA defines everything the silicon can execute; a toolchain such as an assembler or compiler is separate software that implements support for only part of that universe. VFMA sits inside the ARMv8-M ISA but outside what MicroPython's lightweight inline assembler happened to implement — the limitation belongs entirely to the tool, not the chip.

    **Concept Tested:** ISA Versus Toolchain

---

#### 4. Why is a fused multiply-add like VFMA typically more numerically accurate than issuing a separate `VMUL` followed by a separate `VADD`?

<div class="upper-alpha" markdown>
1. Because VFMA always uses double-precision internally, while VMUL and VADD are limited to single precision
2. Because VFMA computes the entire (a × b) + d expression at higher internal precision and rounds only once at the end, instead of rounding after the multiply and rounding again after the add
3. Because VFMA skips the multiplication step entirely when the two operands are floating-point registers
4. Because VFMA does not use IEEE 754 floating-point representation at all
</div>

??? question "Show Answer"
    The correct answer is **B**. Fused rounding is the property that gives a fused multiply-add its accuracy edge: the entire expression is computed at higher internal precision and rounded only once, rather than rounding after the multiplication and again after the addition. Across the thousands of accumulations a full FFT performs, this small per-operation gain can measurably improve final accuracy — the entire reason this chapter bothers hand-encoding VFMA instead of settling for Chapter 22's `VMLA`.

    **Concept Tested:** Fused Rounding

---

#### 5. In `data(4, 0xEE621A00)`, what does this instruction actually cause the assembler to do?

<div class="upper-alpha" markdown>
1. It places the literal 4-byte raw machine word 0xEE621A00 directly into the compiled instruction stream, unmodified and without any validation that it represents a legal instruction
2. It assembles the mnemonic VFMA using the assembler's built-in encoding rules
3. It reserves 4 bytes of RAM for a variable named 0xEE621A00
4. It calls a C function at the memory address 0xEE621A00
</div>

??? question "Show Answer"
    The correct answer is **A**. A data directive is an assembler feature that places a literal, fixed value directly into the compiled output rather than encoding a mnemonic. `data(4, 0xEE621A00)` inserts that exact 4-byte raw machine word into the instruction stream; the assembler performs no check that the value is a legal or correct instruction, which is exactly why encoding verification afterward is non-negotiable.

    **Concept Tested:** Data Directive

---

#### 6. A Q15 value is a 16-bit signed integer representing numbers in the range [-1, 1) using 15 fractional bits. If a Q31 value instead uses 31 fractional bits in a 32-bit integer, what is the practical consequence of choosing Q31 over Q15 for a fixed-point FFT?

<div class="upper-alpha" markdown>
1. Q31 and Q15 offer identical precision; only the storage size differs
2. Q31 removes the need for saturating arithmetic entirely
3. Q31 can only be used on chips that also have an FPU
4. Q31 offers finer precision than Q15, at the cost of twice the storage per value
</div>

??? question "Show Answer"
    The correct answer is **D**. Both Q15 and Q31 are Q format numbers used in fixed-point arithmetic, representing fractional values as scaled whole numbers rather than IEEE 754 floats. Q31's 31 fractional bits in a 32-bit register offer finer precision than Q15's 15 fractional bits in a 16-bit register, but at twice the storage cost per value — a genuine precision-versus-size tradeoff, not a free upgrade. Neither format eliminates the need for saturating arithmetic, and fixed-point formats exist specifically to avoid requiring an FPU.

    **Concept Tested:** Q31 Format

---

#### 7. A student hand-encodes an instruction but transposes two encoding bit fields, accidentally swapping the bit ranges meant for the Sn and Sm operand registers as listed in the encoding table. What is the most likely observable symptom when the routine runs?

<div class="upper-alpha" markdown>
1. The assembler will refuse to accept the `data()` directive and report a syntax error
2. No error appears at all; the CPU executes a different, still-legal instruction — likely VFMA with its operands swapped — silently producing a plausible-looking but wrong result
3. The Cortex-M33 will raise a hardware fault immediately, halting execution
4. MicroPython's garbage collector will detect the malformed word and discard it before execution
</div>

??? question "Show Answer"
    The correct answer is **B**. Flipping or transposing bits in a hand-encoded raw machine word almost never produces an error — it produces a different, perfectly legal instruction, executing silently with plausible-looking but wrong output. This is exactly why this chapter treats hand-encoding as the riskiest step in the course, and why encoding verification against a known-good reference is required rather than optional.

    **Concept Tested:** Encoding Bit Field

---

#### 8. A hand-encoded fixed-point routine processes a very loud audio sample using Q15 arithmetic without saturating arithmetic enabled, and the computed sum exceeds Q15's representable range. What is the most likely consequence, and why does the chapter treat this as worse than the saturating alternative?

<div class="upper-alpha" markdown>
1. The FPU automatically intervenes to correct the overflow, so no audible artifact occurs either way
2. The program crashes immediately with a divide-by-zero error
3. The value silently wraps around, potentially flipping a maximum-positive sample to maximum-negative in one step and producing a jarring pop, whereas saturating arithmetic would clip cleanly at the format's ceiling instead
4. The value is silently promoted to Q31 format to make room for the larger result
</div>

??? question "Show Answer"
    The correct answer is **C**. Ordinary integer overflow wraps silently, which for audio can flip a maximum-positive sample to maximum-negative in a single step, producing a jarring pop. Saturating arithmetic instead clamps the result to the largest or smallest representable value, clipping cleanly at the format's ceiling — a far less harmful failure mode. This is the companion technique fixed-point arithmetic depends on, and it has nothing to do with the FPU, which fixed-point code avoids using in the first place.

    **Concept Tested:** Saturating Arithmetic

---

#### 9. A signal contains both very quiet passages and loud transients within the same recording. Why might representing this signal in Q15 fixed-point format be a worse choice than floating point?

<div class="upper-alpha" markdown>
1. Q15 cannot represent negative values at all, unlike floating point
2. Floating point requires saturating arithmetic while Q15 does not, making Q15 strictly safer
3. Q15 always runs slower than floating point on every Cortex-M core, regardless of FPU presence
4. Q15's fixed number of fractional bits gives every value the same fixed precision regardless of magnitude, so quiet passages lose relative precision while loud transients risk saturating near the format's ceiling — floating point's exponent lets precision track a value's size automatically
</div>

??? question "Show Answer"
    The correct answer is **D**. This is the core of the chapter's precision tradeoffs discussion: floating point's exponent lets precision automatically track a value's magnitude, handling both extremes of a wide dynamic range gracefully, while an integer FFT — equivalently, a fixed point FFT — built on Q15 or Q31 gives every value the same fixed number of fractional bits regardless of size, forcing careful manual scaling to avoid discarding precision at either end. Q15 does represent negative values, and Q15's speed advantage (not disadvantage) is precisely why it matters on FPU-less chips.

    **Concept Tested:** Precision Tradeoffs

---

#### 10. Given the effort required — reading an encoding table, computing bit fields by hand, and performing both bit-for-bit and disassembly-based encoding verification — which justification best supports hand-encoding VFMA instead of simply using Chapter 22's `VMLA` throughout the FFT?

<div class="upper-alpha" markdown>
1. Hand-encoding is justified mainly because it demonstrates advanced skill, regardless of any measurable benefit to the final FFT's output
2. Hand-encoding is justified because fused rounding's single-rounding behavior can measurably improve accuracy across the thousands of accumulations a full FFT performs, and this benefit is confirmed independently through both a known-answer check and disassembly before being trusted
3. Hand-encoding is not justified in this course, since VMLA and VFMA are functionally identical in every respect
4. Hand-encoding is justified purely because it is faster to execute than VMLA, independent of any accuracy consideration
</div>

??? question "Show Answer"
    The correct answer is **B**. The chapter's own justification ties the effort directly to a measurable payoff: fused rounding's small per-operation accuracy gain compounds across a full FFT's many accumulations, and that benefit is only trusted after encoding verification — a known-answer bit-for-bit check plus an independent disassembly confirmation — rather than accepted on faith. Skill demonstration alone, unverified functional equivalence, and speed-only claims all fail to justify the real risk hand-encoding introduces.

    **Concept Tested:** Encoding Verification

---
