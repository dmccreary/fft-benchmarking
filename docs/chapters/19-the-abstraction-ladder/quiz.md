# Quiz: The Abstraction Ladder: Python, C, and Assembly Compared

Test your understanding of the abstraction ladder — MicroPython, C, and assembly compared — with these review questions.

---

#### 1. What is the term for the performance penalty paid for using a higher-level, more convenient programming construct instead of a lower-level, more direct one?

<div class="upper-alpha" markdown>
1. Cold start effect
2. Warm-up discard
3. Abstraction cost
4. Measurement discipline
</div>

??? question "Show Answer"
    The correct answer is **C**. Abstraction cost is the performance penalty paid at each rung of convenience — bytecode interpretation, native, viper, C, and assembly each trade some abstraction cost for control over the raw CPU. Recognizing this cost at every rung is the foundation of the chapter's language tradeoff analysis, which weighs speed against development effort, portability, and safety. Cold start effect is a first-call timing artifact, warm-up discard is a measurement technique, and measurement discipline is the practice of measuring fairly, not the cost being measured.

    **Concept Tested:** Abstraction Cost

---

#### 2. What is a boxed value?

<div class="upper-alpha" markdown>
1. A value wrapped in a heap-allocated object carrying type and reference-count information along with the data
2. A raw 32-bit machine word stored directly in a CPU register
3. A compiled function cached ahead of time by the native code emitter
4. A variable whose type has been declared using a viper type annotation
</div>

??? question "Show Answer"
    The correct answer is **A**. A boxed value is stored inside a heap-allocated wrapper that carries a type pointer, a reference count, and only then the actual bytes — this is how standard MicroPython represents every number, and it is what makes arithmetic on plain Python values require pointer-chasing and allocation. Option B describes an unboxed value; C and D describe unrelated or partial mechanisms.

    **Concept Tested:** Boxed Values

---

#### 3. In plain MicroPython, what does bytecode interpretation mean?

<div class="upper-alpha" markdown>
1. Source code is translated once into ARM machine code before the program runs
2. Source code is translated by a commercial toolchain into optimized assembly
3. Source code is annotated with machine types before being compiled ahead of time
4. Source code is compiled to a portable intermediate format that a virtual machine loop decodes and executes one instruction at a time
</div>

??? question "Show Answer"
    The correct answer is **D**. Bytecode interpretation is MicroPython's default execution model: source is compiled to compact bytecode, and at runtime the interpreter loop decodes and dispatches each instruction, which is what makes MicroPython portable across chips but also adds per-instruction overhead. Option A describes ahead-of-time compilation (C or native/viper), and B and C describe other rungs of the ladder.

    **Concept Tested:** Bytecode Interpretation

---

#### 4. A student adds `@micropython.native` to a function that does heavy floating-point math but sees only a modest speedup. What is the most likely explanation?

<div class="upper-alpha" markdown>
1. The native code emitter only works on integer arithmetic, never on floats
2. The native code emitter still uses boxed values, so pointer-chasing and allocation overhead remain even though interpreter dispatch is removed
3. The function must be missing warm-up runs, which always eliminates any native speedup
4. The native code emitter requires type annotations to have any effect
</div>

??? question "Show Answer"
    The correct answer is **B**. `@micropython.native` compiles the function to machine code ahead of time, eliminating interpreter dispatch overhead, but it still represents every number as a boxed value, so the pointer-chasing, type-checking, and allocation costs of boxing remain. That is exactly why viper — which supports true unboxed values via type annotations — typically outperforms native on numeric code. Warm-up runs (C) address a separate, unrelated timing artifact.

    **Concept Tested:** Native Code Emitter

---

#### 5. In a `@micropython.viper` function signature such as `def dot_product(a: ptr32, b: ptr32, n: int) -> int:`, what role do `ptr32` and `int` play?

<div class="upper-alpha" markdown>
1. They are compiler optimization flags passed on the command line
2. They are comments that document intent but have no effect on compiled code
3. They are type annotations that declare machine types, telling the compiler to treat the values as raw pointers and integers instead of general Python objects
4. They enable automatic memory management for the annotated variables
</div>

??? question "Show Answer"
    The correct answer is **C**. `ptr32` and `int` are type annotations that declare machine types — representations mapping directly onto CPU registers and memory words. Once a value is annotated this way, the viper compiler stores and operates on it as a genuinely unboxed value, skipping the boxing overhead that plain and native MicroPython still pay. They are not compiler flags, comments, or memory-management aids; in fact, viper annotated values lose the automatic memory-management safety net.

    **Concept Tested:** Type Annotation

---

#### 6. Why does using `@micropython.viper` on raw pointers remove one of MicroPython's normal safety guarantees?

<div class="upper-alpha" markdown>
1. Viper disables the DWT cycle counter used for timing
2. Viper functions cannot call other MicroPython functions
3. Viper always runs slower than plain MicroPython, so the safety loss is not worth it
4. Viper's unboxed, annotated values bypass the automatic memory management (reference counting and garbage collection) that protects boxed values, so a pointer mistake can corrupt memory as in C
</div>

??? question "Show Answer"
    The correct answer is **D**. Outside a viper function, MicroPython's reference counting and garbage collector track every boxed object and protect against most memory bugs. Inside a viper function operating on raw pointers like `ptr32`, that safety net does not apply, so incorrect pointer arithmetic can corrupt memory the same way it could in C — speed and safety are genuinely in tension. Options A, B, and C misstate viper's actual tradeoffs.

    **Concept Tested:** Memory Management

---

#### 7. Which pair of compilers does this course identify as the two common C compilers in the ARM embedded world?

<div class="upper-alpha" markdown>
1. The GCC compiler (`arm-none-eabi-gcc`) and the ARM compiler (`armclang`)
2. Clang and MSVC
3. The native code emitter and the viper code emitter
4. GCC and the Thonny interpreter
</div>

??? question "Show Answer"
    The correct answer is **A**. The chapter names `arm-none-eabi-gcc`, a free and open-source toolchain, and `armclang`, ARM's commercial compiler often used in professional embedded development, as the two common C compilers for Cortex-M targets. Both produce machine code for the same instruction set but differ in tooling, licensing, and default optimization aggressiveness. The native and viper emitters are MicroPython execution modes, not C compilers.

    **Concept Tested:** GCC Compiler

---

#### 8. A team compiles the same C source with `-O3` instead of `-O0` and observes both a runtime speedup and a larger compiled binary. What is the most likely reason the binary grew?

<div class="upper-alpha" markdown>
1. Optimization flags like `-O3` always add debug symbols to the binary
2. Aggressive optimizations such as loop unrolling and function inlining duplicate instructions to avoid the overhead of jumps and calls, increasing code size
3. `-O3` forces the compiler to include the full standard library regardless of usage
4. Higher optimization levels always disable dead-code elimination to preserve traceability
</div>

??? question "Show Answer"
    The correct answer is **B**. Compiler optimization at higher levels applies transformations like loop unrolling and inlining that trade code size for speed by duplicating instructions instead of paying repeated jump or call overhead. This is the code size tradeoff the chapter highlights: larger code competes for limited flash and can even overflow cache memory, sometimes making "more optimized" code run slower in practice. The other options misdescribe what optimization flags actually do.

    **Concept Tested:** Compiler Optimization

---

#### 9. Why can code that overflows the microcontroller's cache memory run slower even though it was compiled with a higher optimization level?

<div class="upper-alpha" markdown>
1. Because optimization flags automatically reduce the clock speed on cache overflow
2. Because cache memory only stores boxed values, and optimized code always uses unboxed values
3. Because the CPU can no longer keep the larger set of instructions in the small, fast on-chip cache, forcing more waits on slower main memory
4. Because the native code emitter refuses to run code larger than the cache
</div>

??? question "Show Answer"
    The correct answer is **C**. Cache memory is a small, very fast on-chip store for recently used instructions and data; when aggressive optimization (like loop unrolling) inflates code size beyond what fits comfortably in cache, the CPU must fetch more from slower main memory, which can offset or reverse the intended speedup. This is why the chapter treats optimization level, code size, and cache behavior as a linked tradeoff rather than separate concerns.

    **Concept Tested:** Cache Memory

---

#### 10. A student measures a function's execution time on its very first call and finds it noticeably slower than the second and later calls, even though the function's logic never changes. Which practice specifically addresses this, and why?

<div class="upper-alpha" markdown>
1. Prediction before measurement, because writing a guess down first prevents the first call from being slow
2. Comparison tables, because organizing results into rows and columns removes cold-start variance
3. Compiler optimization at `-O3`, because a more aggressive compiler eliminates first-call overhead
4. Warm-up runs with warm-up discard, because a handful of untimed calls let one-time setup work (like finalizing compiled machine code) happen before the timed sample begins
</div>

??? question "Show Answer"
    The correct answer is **D**. This is the cold start effect: the first call to a `@native` or `@viper` function can be slower because MicroPython performs one-time setup, such as finalizing compiled machine code or populating internal tables, only on that first invocation. The fix is running warm-up calls before timing begins and explicitly discarding them from the recorded statistics, so the timed sample reflects steady-state performance. Prediction before measurement and comparison tables address different parts of honest benchmarking, not this specific artifact.

    **Concept Tested:** Cold Start Effect

---
