# Quiz: The Butterfly in Assembly: A Complete FFT and Production Libraries

Test your understanding of hand-writing the FFT butterfly in ARM assembly, validating it, and why production systems reach for a library instead with these review questions.

---

#### 1. What does it mean for the hand-written assembly FFT to achieve a bit-for-bit match against the Python reference implementation?

<div class="upper-alpha" markdown>
1. Every output value is within a small numerical tolerance of the Python version's output
2. The assembly and Python versions produce the same number of output values, though not necessarily the same values
3. Every output value from the assembly implementation equals the corresponding Python output exactly, down to the last bit of the floating-point representation
4. The assembly implementation runs bit-for-bit as fast as the Python version
</div>

??? question "Show Answer"
    The correct answer is **C**. A bit-for-bit match is a stricter standard than "close enough" — every output value must equal the Python reference exactly, down to the last bit of the floating-point representation, which is achievable only because the assembly butterfly performs its multiply-accumulate steps in the same order as the Python version, since floating-point addition is not perfectly associative. Option A describes a looser numerical-tolerance standard, and B and D confuse correctness with count or speed.

    **Concept Tested:** Bit For Bit Match

---

#### 2. Why does the FFT's per-butterfly hot loop specifically get hand-written in assembly, while the twiddle-factor table computation does not?

<div class="upper-alpha" markdown>
1. Because the twiddle-factor table is too large to fit in a typed array
2. Because assembly cannot perform trigonometric functions like sin and cos at all
3. Because the hot loop is the only part of the program that uses floating-point registers
4. Because the hot loop executes far more times than surrounding code — thousands of times per transform — so it dominates total execution time, while the twiddle table is computed once and reused
</div>

??? question "Show Answer"
    The correct answer is **D**. A hot loop is, by definition, the code that dominates total execution time because it runs so much more often than everything around it — for a 512-point FFT, the assembly butterfly executes 2,304 times per transform, while the twiddle-factor table is computed exactly once and reused by every future transform, leaving no speed benefit worth chasing by rewriting it in assembly.

    **Concept Tested:** Hot Loop

---

#### 3. A company wants to ship a closed-source commercial product and needs to choose between an MIT-licensed and a GPL-licensed FFT library. Which statement correctly distinguishes the two?

<div class="upper-alpha" markdown>
1. The MIT license permits use inside a closed-source product with little more than preserving the copyright notice, while the GPL license generally obligates releasing derivative source code under the same terms
2. The GPL license permits closed-source use freely, while the MIT license forbids commercial use entirely
3. Both licenses require paying a royalty per unit shipped, differing only in the royalty rate
4. The MIT license only applies to libraries written in Python, while GPL applies only to C libraries
</div>

??? question "Show Answer"
    The correct answer is **A**. The MIT license is permissive, allowing code to be used, modified, and shipped inside a closed-source commercial product with minimal obligation. The GPL license is copyleft: shipping GPL-licensed code generally obligates a project to release its own derivative source under the same terms, which many commercial embedded products cannot accept. Library licensing is a real legal and business decision, not just a technical one — neither license involves per-unit royalties, and both apply regardless of implementation language.

    **Concept Tested:** MIT License

---

#### 4. How are register pressure and register spilling related?

<div class="upper-alpha" markdown>
1. Register spilling always happens first, and register pressure is a measurement of how much spilling already occurred
2. Register pressure is the demand a routine places on the available register file; register spilling is what happens when that demand exceeds the available registers, forcing values to be temporarily written to memory
3. They are unrelated; register pressure concerns the FPU while register spilling concerns general-purpose registers only
4. Register pressure only occurs in Python code, since assembly routines never run out of registers
</div>

??? question "Show Answer"
    The correct answer is **B**. Register pressure grows as more values must stay live at once; register spilling is what happens once that pressure exceeds the available register file, forcing the excess to be temporarily written to memory using ordinary `VSTR`/`VLDR` pairs and reloaded later. The chapter's own butterfly uses twelve scratch and working registers out of thirty-two available, comfortable enough that no spilling is required — but a more ambitious routine processing several butterflies at once could need it.

    **Concept Tested:** Register Pressure

---

#### 5. The course's work split strategy keeps the twiddle-factor table computation and per-stage orchestration in Python, while the innermost butterfly loop runs in assembly. What principle explains this split?

<div class="upper-alpha" markdown>
1. Python code always runs faster than assembly for trigonometric functions
2. MicroPython's inline assembler cannot call `math.sin` or `math.cos`, so trigonometry must stay in Python
3. Code that runs rarely gains little from hand-optimization, while code that runs extremely often is worth the effort of writing in assembly
4. Assembly can only operate on integers, so any floating-point setup work must happen in Python first
</div>

??? question "Show Answer"
    The correct answer is **C**. The twiddle-factor table is computed once, ever, and the per-stage orchestration runs only a handful of times per transform, so neither gains meaningfully from hand-optimization. The hot loop, by contrast, runs thousands of times per transform, so its per-execution savings multiply enough to justify the effort of hand-writing it in assembly. Assembly fully supports floating-point work through the FPU, contradicting options A, B, and D.

    **Concept Tested:** Work Split Strategy

---

#### 6. A student is deciding whether to hand-write a routine in assembly. The routine runs once per program startup and takes negligible time either way. Applying this chapter's work split strategy, what is the most defensible choice?

<div class="upper-alpha" markdown>
1. Leave it in Python, since the effort of hand-writing assembly only pays off for code that runs often enough for the speedup to matter
2. Write it in assembly regardless, since assembly is always faster and there is no reason not to use it
3. Split it evenly, writing half the routine in Python and half in assembly
4. Rewrite it in C instead, since C is a compromise between Python and assembly
</div>

??? question "Show Answer"
    The correct answer is **A**. The work split strategy this chapter teaches is not "assembly is always better" — it is a deliberate tradeoff: only code that executes often enough for per-call savings to add up is worth the effort and risk of hand-writing in assembly. A startup routine that runs once, taking negligible time, is exactly the kind of code that belongs in Python, mirroring how the chapter keeps the twiddle table and per-stage setup out of the hot loop.

    **Concept Tested:** Work Split Strategy

---

#### 7. A full FFT needs several parameters per stage — span, twiddle stride, and butterfly count — that would otherwise need to be passed as separate arguments into the hot loop's assembly function. Why does the course package them into a stage parameter block instead?

<div class="upper-alpha" markdown>
1. Because MicroPython's inline assembler only accepts a single argument of any kind
2. Because a stage parameter block runs faster than any argument passed through a register
3. Because assembly instructions cannot read from a typed array, only from individual registers
4. Because passing each parameter separately would quickly exceed the four-register argument-passing convention, so bundling them into one small typed array lets a single pointer cross the Python-assembly boundary instead
</div>

??? question "Show Answer"
    The correct answer is **D**. Chapter 21's argument-passing convention only covers four registers, `r0` through `r3`, so passing span, twiddle stride, and butterfly count as separate arguments alongside the buffer addresses would quickly run out of room. A stage parameter block packages them into one small typed array, so a single pointer — not half a dozen individual values — crosses the Python-assembly boundary each stage.

    **Concept Tested:** Stage Parameter Block

---

#### 8. A team must ship a closed-source commercial product on a memory-constrained microcontroller and needs an FFT library. Based on this chapter's licensing table, which choice avoids GPL obligations while still fitting comfortably on a small MCU?

<div class="upper-alpha" markdown>
1. FFTW, since it is the most heavily optimized option available
2. CMSIS-DSP or KissFFT, since both use permissive licenses and are sized for microcontroller use, unlike FFTW's GPL default and heavier footprint
3. Any library is acceptable, since licensing has no bearing on shipping a closed-source product
4. Only a hand-written assembly FFT avoids licensing concerns entirely
</div>

??? question "Show Answer"
    The correct answer is **B**. CMSIS-DSP (also known as the Arm Math library) ships under a permissive Apache 2.0-style license and is hand-optimized for Cortex-M cores, while KissFFT, a small open source FFT library, uses a permissive BSD-style license — both fit comfortably on a Pico 2, and CMSIS-DSP is exactly what Pico SDK FFT support typically links in from C. FFTW is generally GPL-licensed (with a separate paid commercial option) and too large and dependency-heavy for a typical microcontroller. This is the library-over-handwritten-code tradeoff in practice: reading a library's API documentation and handling library integration is usually less risk than shipping untested custom code.

    **Concept Tested:** Library Licensing

---

#### 9. An assembly FFT matches the Python reference bit-for-bit through stage 5 of a 9-stage transform, then diverges starting at stage 6. Following this chapter's debugging approach, what should be investigated first?

<div class="upper-alpha" markdown>
1. The entire butterfly instruction sequence, since it must be wrong for every stage even though stages 1 through 5 happened to produce correct results by chance
2. The Python reference implementation, since a bit-for-bit mismatch always indicates the reference, not the assembly, is wrong
3. Whatever is specific to stage 6 — its stage parameter block values or the twiddle-factor indices it reads — since the same butterfly instruction sequence already proved correct across five earlier stages
4. The MVFR0 register, to confirm the FPU is still present at stage 6
</div>

??? question "Show Answer"
    The correct answer is **C**. Assembly debugging in this course relies on bisection against a known-good Python reference, comparing outputs stage by stage rather than only at the end. Since the identical butterfly instruction sequence already produced correct results through stage 5, the bug is most likely isolated to something specific to stage 6, such as its stage parameter block values or the twiddle-factor indices it reads — not the instruction sequence itself, which cannot be "wrong" in a way that only appears intermittently.

    **Concept Tested:** Assembly Debugging

---

#### 10. Suppose a routine crossed the Python-assembly boundary once per individual butterfly, calling a separate `asm_thumb` function 2,304 times per 512-point transform, instead of once per stage. What is the most likely consequence for performance?

<div class="upper-alpha" markdown>
1. Performance would be unaffected, since the Python-assembly boundary has no measurable cost
2. MicroPython would refuse to compile more than one asm_thumb function per program
3. The FPU's register bank would reset between each call, forcing every twiddle factor to be reloaded from Python
4. The repeated call overhead of crossing the Python-assembly boundary thousands of extra times per transform would erode much of the speed advantage assembly is meant to provide
</div>

??? question "Show Answer"
    The correct answer is **D**. Crossing the Python-assembly boundary carries real overhead; calling into assembly once per stage (only 9 times for a 512-point transform) instead of once per butterfly (2,304 times) is a deliberate part of the work split strategy that keeps that overhead from eating into the speedup the assembly butterfly provides. Calling a separate function per butterfly would multiply that crossing cost by more than 250 times, working directly against the reason to write the hot loop in assembly at all.

    **Concept Tested:** Python Assembly Boundary

---
