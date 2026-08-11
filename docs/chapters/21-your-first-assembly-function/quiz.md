# Quiz: Your First Assembly Function: Registers and Loops

Test your understanding of ARM Thumb assembly, registers, loops, and MicroPython's inline assembler with these review questions.

---

#### 1. What is machine code, and how does it relate to an instruction mnemonic like `MOV` or `ADD`?

<div class="upper-alpha" markdown>
1. Machine code is the raw binary pattern the CPU directly executes; an instruction mnemonic is the short, human-readable text that stands in for one specific machine code encoding
2. Machine code is the human-readable assembly source file; an instruction mnemonic is the binary output produced after assembling it
3. Machine code only exists inside MicroPython's bytecode interpreter, while mnemonics are used exclusively in C
4. Machine code and instruction mnemonics are two names for the exact same thing, used interchangeably
</div>

??? question "Show Answer"
    The correct answer is **A**. No human reads or writes raw binary machine code directly; ARM assembly gives each binary pattern a short mnemonic like `MOV`, `ADD`, or `CMP` that an assembler translates into the actual machine code the Cortex-M33 executes as Thumb instructions. Option B reverses the relationship, and C and D misdescribe how mnemonics and machine code connect across the languages this course compares.

    **Concept Tested:** Machine Code

---

#### 2. How many general-purpose registers does the Cortex-M33 provide, and what can each one hold?

<div class="upper-alpha" markdown>
1. Sixteen general-purpose registers, each holding a 64-bit floating-point value
2. Eight general-purpose registers, reserved exclusively for loop counters
3. Three general-purpose registers, supplemented by unlimited stack-based variables
4. Thirteen general-purpose registers, named r0 through r12, each holding one 32-bit value for any purpose the code chooses
</div>

??? question "Show Answer"
    The correct answer is **D**. The Cortex-M33 provides thirteen general-purpose registers, r0 through r12, each a 32-bit CPU register free for any use — a loop counter, a memory address, an intermediate result. Three further registers (`sp`, `lr`, `pc`) have fixed special jobs and are not part of this general-purpose set. Unlike Python's unlimited named variables, every value in an assembly routine must fit into this fixed pool.

    **Concept Tested:** General Purpose Register

---

#### 3. What does the `CMP` instruction actually do when it executes, for example `CMP r0, #0`?

<div class="upper-alpha" markdown>
1. It subtracts 0 from r0 and stores the result back into r0
2. It jumps to a label if r0 equals 0
3. It subtracts one value from another without storing the result anywhere, only updating status flags for a later conditional branch to use
4. It copies the value 0 into r0, overwriting whatever was there before
</div>

??? question "Show Answer"
    The correct answer is **C**. The compare instruction subtracts one operand from the other purely to set internal status flags — recording whether the result was zero, negative, or produced a carry — without writing that result anywhere. Those flags only become useful once paired with a conditional branch like `BNE` or `BGT`. Option A confuses `CMP` with `SUB`, B confuses it with a branch, and D confuses it with the move instruction, `MOV`.

    **Concept Tested:** Compare Instruction

---

#### 4. How do an assembly label and a conditional branch instruction like `BNE` work together to build a loop?

<div class="upper-alpha" markdown>
1. The label stores the loop's current count, and `BNE` increments it automatically
2. The label marks the instruction address to jump back to, and the conditional branch jumps to that label only when the preceding comparison's flag condition holds, repeating the block until the condition fails
3. The label is optional decoration for readability; `BNE` branches to the next instruction regardless of any label
4. The conditional branch defines the label's memory address at assembly time
</div>

??? question "Show Answer"
    The correct answer is **B**. An assembly label is a named marker at a specific instruction, and a conditional branch jumps to that label only if the flag condition set by a prior `CMP` holds — `BNE` jumps only while the compared values are unequal. Together they form an assembly loop, the hardware-level equivalent of a Python `for` or `while` loop. The label is required as the branch's actual target, not optional decoration.

    **Concept Tested:** Assembly Label

---

#### 5. What does adding `@micropython.asm_thumb` above a function definition change about how MicroPython treats that function's body?

<div class="upper-alpha" markdown>
1. It tells MicroPython to run the function body through the native code emitter instead of the interpreter
2. It requires the function body to be annotated with viper machine types before it compiles
3. It links a separately compiled C object file into the function body
4. It tells MicroPython to treat the function body as a sequence of Thumb assembly instructions rather than ordinary Python statements, translating them to machine code when the function is defined
</div>

??? question "Show Answer"
    The correct answer is **D**. The `asm_thumb` decorator is the mechanism behind MicroPython's inline assembler: it marks a function body as Thumb assembly rather than Python, and MicroPython translates it directly into machine code the moment the function is defined, with no external assembler or linker involved. Options A, B, and C describe other MicroPython or toolchain mechanisms covered elsewhere in the course, not this one.

    **Concept Tested:** asm_thumb Decorator

---

#### 6. Using the chapter's `sum_to_n` routine — where `r1` accumulates the sum, `r0` counts down and is added to `r1` on each pass before being decremented, and the final sum is moved into `r0` before returning — what does calling `sum_to_n(3)` return?

<div class="upper-alpha" markdown>
1. 6, because the loop adds r0's current value into r1 on each pass before decrementing, computing 3 + 2 + 1
2. 3, because r0 is returned unchanged after the loop finishes
3. 0, because r1 is never actually moved into r0 before the function returns
4. 9, because the loop multiplies r0 by itself before returning
</div>

??? question "Show Answer"
    The correct answer is **A**. Tracing register allocation through the loop: `r1` starts at 0 and accumulates `3 + 2 + 1 = 6` as an add instruction folds `r0`'s current value into it on each pass while `r0` counts down from 3 to 0, and the final `mov(r0, r1)` moves that accumulated sum into `r0` for the return. This kind of instruction-by-instruction trace is exactly the reading-assembly-code skill the chapter builds, since nothing about the result is visible without following each register's value.

    **Concept Tested:** Assembly Loop

---

#### 7. A student defines `@micropython.asm_thumb` `def add_two(r0, r1): add(r0, r0, r1)`. When called as `add_two(4, 7)` from Python, what values do `r0` and `r1` hold when the function body begins executing?

<div class="upper-alpha" markdown>
1. r0 holds 7 and r1 holds 4, because arguments are passed in reverse order
2. r0 holds 4 (the first argument) and r1 holds 7 (the second argument), following the ARM argument passing convention
3. Both r0 and r1 hold 4, because only the first argument is passed to inline assembly
4. r0 and r1 are both undefined until explicitly set with a `MOV` instruction inside the function
</div>

??? question "Show Answer"
    The correct answer is **B**. Under the ARM argument passing convention MicroPython's inline assembler follows, the first argument arrives already sitting in `r0` and the second in `r1`, in order. This is why the parameter list names registers directly rather than ordinary variable names — the names document which register each argument will already occupy when the function starts, not an instruction to the hardware. `r0` doing double duty as both the first argument register and the return value register is the same convention every ARM-targeting compiler follows.

    **Concept Tested:** Argument Passing Convention

---

#### 8. A routine needs to keep a loop counter, a running total, and a memory pointer all live at the same time, using only general-purpose registers. What does correct register allocation require?

<div class="upper-alpha" markdown>
1. Storing all three values in r0 simultaneously, since r0 is large enough to hold any 32-bit value
2. Declaring each value with a Python type annotation so the assembler assigns registers automatically
3. Deliberately assigning each value to a distinct register for as long as it is needed, and making sure no two live values are written to the same register at the same time
4. Using the stack pointer register (sp) to hold all three values instead of general-purpose registers
</div>

??? question "Show Answer"
    The correct answer is **C**. With no automatic variable management, register allocation means consciously deciding which register holds which value for how long and ensuring two different purposes never collide in the same register simultaneously. Cramming all three values into one register (A) would overwrite them, viper-style type annotations (B) apply to MicroPython's viper emitter, not raw assembly, and `sp` (D) has a fixed, reserved role as the stack pointer.

    **Concept Tested:** Register Allocation

---

#### 9. In `sum_to_n`, suppose the running sum were accumulated into `r0` instead of `r1`, so the code updated `r0` at each step instead of `r1`. What is the most likely consequence?

<div class="upper-alpha" markdown>
1. The function would still return the correct sum, just using one fewer register
2. MicroPython would raise a compile-time error refusing to reuse r0 for two purposes
3. The FPU would automatically detect the conflict and halt execution
4. The loop counter itself would be silently destroyed by the accumulation, causing the loop to run for the wrong number of iterations or never terminate, with no error message
</div>

??? question "Show Answer"
    The correct answer is **D**. Assembly does not stop a program from reusing a register it still needs — it simply does what it is told. If the accumulator overwrote `r0`, the value the loop depends on to count down and eventually trigger the branch's exit condition would be destroyed, producing a wrong iteration count or an infinite loop, silently and without any error message. This is exactly the kind of register-collision bug the chapter identifies as the most common assembly mistake.

    **Concept Tested:** Reading Assembly Code

---

#### 10. You are handed this unfamiliar routine and asked to determine its behavior without running it, given `r1` is passed in: `MOV r0, #0` / `loop: CMP r1, #0` / `BEQ done` / `ADD r0, r0, #1` / `SUB r1, r1, #1` / `B loop` / `done:`. What does the routine compute?

<div class="upper-alpha" markdown>
1. It multiplies r1 by 2 and stores the result in r0
2. It counts down r1 to zero while counting up r0, so r0 ends up equal to the original value of r1
3. It leaves r0 at 0 regardless of r1's value
4. It computes r1 minus r0 and stores the result in r1
</div>

??? question "Show Answer"
    The correct answer is **B**. Tracing the instructions: `r0` starts at 0, and each pass through the loop adds 1 to `r0` and subtracts 1 from `r1` until `r1` reaches 0, at which point `BEQ done` exits. Since `r0` gains exactly what `r1` loses each iteration, `r0` ends up equal to `r1`'s original value — a plain copy implemented the long way, using a compare instruction and conditional branch pair instead of a `MOV`.

    **Concept Tested:** CPU Register

---
