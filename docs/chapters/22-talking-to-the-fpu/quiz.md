# Quiz: Talking to the FPU: Floating-Point Assembly

Test your understanding of the FPU's register bank, load-store architecture, and floating-point instructions with these review questions.

---

#### 1. What does it mean that ARM cores use a load-store architecture?

<div class="upper-alpha" markdown>
1. Every instruction automatically loads its operands from memory and stores results back without any register use
2. Arithmetic instructions like `ADD` or `VMUL` can only operate on values already in registers; a value in memory must be explicitly loaded into a register before computing with it, then stored back afterward
3. Only floating-point instructions require explicit loads and stores; integer instructions can operate directly on memory
4. Load and store instructions are optional convenience features that assembly programmers may skip
</div>

??? question "Show Answer"
    The correct answer is **B**. A load-store architecture keeps arithmetic instructions register-only, so a value in memory must be explicitly loaded into a register, computed on, and explicitly stored back when finished. This deliberate design lets each arithmetic instruction execute in a single, predictable cycle, with all slower memory-access work concentrated into dedicated load and store instructions like `VLDR` and `VSTR`. It applies equally to integer and floating-point instructions.

    **Concept Tested:** Load Store Architecture

---

#### 2. How many dedicated floating-point registers does the FPU's register bank provide, and what does each hold?

<div class="upper-alpha" markdown>
1. 13 registers, r0 through r12, each holding a 32-bit integer or address
2. 16 registers, shared between integer and floating-point values
3. 8 registers, each holding a 64-bit double-precision float
4. 32 registers, s0 through s31, each holding one 32-bit single-precision float
</div>

??? question "Show Answer"
    The correct answer is **D**. The FPU has its own completely separate register bank, `s0` through `s31`, thirty-two registers each exactly wide enough to hold one single-precision float — a 32-bit IEEE 754 value. This is distinct from the thirteen general-purpose integer registers `r0`-`r12`; general-purpose instructions like `ADD` cannot touch the `s` registers, and FPU instructions cannot touch `r0`-`r12` for arithmetic.

    **Concept Tested:** Register Bank s0 to s31

---

#### 3. Which statement correctly distinguishes `VLDR` and `VSTR` from `VADD`, `VSUB`, and `VMUL`?

<div class="upper-alpha" markdown>
1. `VLDR` and `VSTR` move floats between memory and floating-point registers, while `VADD`, `VSUB`, and `VMUL` perform arithmetic entirely between floating-point registers
2. `VLDR` and `VSTR` perform arithmetic, while `VADD`, `VSUB`, and `VMUL` move data between memory and registers
3. `VLDR` and `VSTR` only work on integers, while `VADD`, `VSUB`, and `VMUL` only work on floats
4. `VLDR` and `VSTR` are optional aliases for `VADD` and `VSUB` with no functional difference
</div>

??? question "Show Answer"
    The correct answer is **A**. `VLDR` ("vector load register") and `VSTR` ("vector store register") move single-precision floats between memory and a floating point register, while `VADD`, `VSUB`, and `VMUL` perform arithmetic directly between values already sitting in `s` registers, writing the result into a third `s` register. This mirrors the load-store pattern from general-purpose registers, applied to the FPU's separate register bank.

    **Concept Tested:** FPU Operations

---

#### 4. Why must the offset in `VLDR s1, [r0, #4]` be expressed in bytes rather than in array element positions?

<div class="upper-alpha" markdown>
1. Because MicroPython silently converts byte offsets to element indices before assembling
2. Because `VLDR` can only address the first four bytes of any buffer
3. Because memory addresses count individual bytes regardless of data type, so software must convert an element index into a byte offset by multiplying by the element's size
4. Because array elements are always exactly one byte wide on the Cortex-M33
</div>

??? question "Show Answer"
    The correct answer is **C**. Hardware has no concept of "the third float" — memory addresses always count individual bytes. Software is entirely responsible for converting an element index into a byte offset by multiplying by the element size, which is 4 bytes for a single-precision float. `VLDR s1, [r0, #4]` therefore reaches element index 1 in a buffer of 4-byte floats, not element index 4.

    **Concept Tested:** Byte Offset

---

#### 5. Why does the byte-offset formula `base_address + i * 4` only work reliably on a MicroPython typed array, not a plain Python list?

<div class="upper-alpha" markdown>
1. Because plain Python lists cannot hold floating-point numbers at all
2. Because a typed array stores its values contiguously with a fixed, predictable stride, while a plain list holds boxed values scattered across the heap with no fixed distance between elements
3. Because typed arrays are always exactly 32 elements long, matching the FPU's register bank
4. Because a plain list stores its values contiguously but a typed array does not
</div>

??? question "Show Answer"
    The correct answer is **B**. A typed array, created with `array.array('f', ...)`, stores its values contiguously and back to back in memory, each exactly 4 bytes wide with no wrapper — a fixed, predictable stride that makes the byte-offset formula valid. A plain list holds boxed values scattered across the heap with no fixed distance between elements, so no consistent multiplier could locate a given element's address.

    **Concept Tested:** Typed Array

---

#### 6. A typed array of 32-bit floats begins at the address in `r0`. Which instruction correctly loads element index 5 into `s3`?

<div class="upper-alpha" markdown>
1. `VLDR s3, [r0, #20]`
2. `VLDR s3, [r0, #5]`
3. `VLDR s3, [r0, #4]`
4. `VLDR s3, [r0, #32]`
</div>

??? question "Show Answer"
    The correct answer is **A**. Each single-precision float occupies 4 bytes, so the address of element index 5 is `base_address + 5 * 4 = base_address + 20`. The base address itself comes from the address of buffer operation, which MicroPython exposes and passes into `r0` per Chapter 21's calling convention. Option B uses the element index directly as a byte count, ignoring element size; C computes the offset for element index 1 instead of 5; D uses an unrelated multiple.

    **Concept Tested:** Pointer Arithmetic

---

#### 7. What does the instruction `VMLA s2, s0, s1` compute, and why is it typically preferred over issuing `VMUL` followed by `VADD` separately?

<div class="upper-alpha" markdown>
1. It computes `s2 = s0 * s1`, discarding whatever was previously in s2, and is preferred because it uses fewer registers
2. It computes `s2 = s0 / s1`, and is preferred because division is otherwise unavailable on this FPU
3. It computes `s2 = s2 - (s0 * s1)`, matching the subtract-then-multiply pattern used in the butterfly operation
4. It computes `s2 = s2 + (s0 * s1)` as one fused operation, saving a cycle and avoiding an extra rounding step compared to a separate multiply and add
</div>

??? question "Show Answer"
    The correct answer is **D**. `VMLA` is this FPU's MAC (multiply-accumulate) instruction, powered by the same hardware multiplier that drives `VMUL`, and it computes `d = d + (a * b)` as a single fused operation. Fusing the two steps saves a cycle compared to separate `VMUL` and `VADD` instructions, and avoids rounding the intermediate product before adding, which is slightly more numerically accurate — exactly the pattern at the heart of every butterfly operation.

    **Concept Tested:** MAC Instruction

---

#### 8. A student benchmarks an assembly dot-product routine but calls `array.array('f', [0]*128)` to create a fresh output buffer inside the timed loop, once per iteration. What is the most likely consequence?

<div class="upper-alpha" markdown>
1. The FPU will refuse to execute any instruction that references a newly allocated buffer
2. Nothing — allocation only affects plain Python code, never assembly routines
3. The new allocation may trigger MicroPython's garbage collector at an unpredictable moment inside the timed region, silently inflating the measured time with cycles unrelated to the algorithm
4. The typed array's stride will become unpredictable, breaking the byte-offset formula
</div>

??? question "Show Answer"
    The correct answer is **C**. MicroPython's garbage collector can only run in response to allocations, so a fresh `array.array` call inside a timed loop risks a collector pause landing inside the measured region — exactly the hidden variance source "no allocation in timed region" is meant to prevent. The fix is allocating every buffer a routine needs before starting the timer and passing in only pre-allocated buffers.

    **Concept Tested:** No Allocation In Timed Region

---

#### 9. In a routine modeled on `dot_product_fpu`, a programmer writes `add(r0, r0, 8)` to advance the pointer into a buffer of single-precision floats after each `VLDR`. What is the effect on the second iteration's load?

<div class="upper-alpha" markdown>
1. It has no effect, because `VLDR` ignores the address in r0 after the first load
2. It skips one element and loads element index 2 instead of element index 1, because the pointer advances by 8 bytes (two elements) instead of 4
3. It correctly loads the next float, because single-precision floats are 8 bytes wide
4. It reads the same element twice, because 8 is a multiple of the register bank size
</div>

??? question "Show Answer"
    The correct answer is **B**. A single-precision float is 4 bytes, so the correct per-element step is `add(r0, r0, 4)`. Advancing by 8 bytes instead moves the pointer two elements forward each time, so the second `VLDR` reads element index 2 instead of element index 1, silently skipping every other element in the buffer — the same byte-offset-versus-element-count mistake the chapter's own worked example warns about, applied here to a doubled rather than reduced step.

    **Concept Tested:** Memory Address

---

#### 10. The chapter mentions that some ARM cores support SIMD instructions, which pack several values into one register and process them together, but defers using them until Chapter 24. What is the stated reasoning for this ordering?

<div class="upper-alpha" markdown>
1. SIMD instructions are not supported on the Cortex-M33 at all, so they are irrelevant to this course
2. Vectorized code is always slower than scalar code for floating-point work, so SIMD is skipped entirely
3. SIMD instructions require a hardware multiplier that the FPU does not have
4. Establishing a working, validated scalar (one-value-at-a-time) version first is part of writing correct code before writing fast code, and SIMD is a genuinely more advanced optimization layered on afterward
</div>

??? question "Show Answer"
    The correct answer is **D**. The chapter names SIMD (Single Instruction, Multiple Data) explicitly to signal that a faster path exists, while deliberately choosing not to reach for it yet — every instruction in this chapter, including the multiply-accumulate that uses the same hardware multiplier as `VMUL`, still operates on one float at a time. Knowing a faster path exists and choosing correctness first is itself part of the engineering discipline this course teaches, distinct from claiming SIMD is unsupported or always worse.

    **Concept Tested:** SIMD Instructions

---
