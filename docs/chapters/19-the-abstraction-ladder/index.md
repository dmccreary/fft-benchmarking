---
title: "The Abstraction Ladder: Python, C, and Assembly Compared"
description: Comparing MicroPython's native and viper emitters, C, and assembly on the same computation, and the honest-reporting discipline that makes the comparison trustworthy
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# The Abstraction Ladder: Python, C, and Assembly Compared

## Summary

This chapter compares the same computation across MicroPython's native and viper code emitters, C, and assembly, introducing boxed versus unboxed values and compiler optimization as the reasons for the resulting spread in performance. It also covers the discipline of honest reporting — measurement caveats, cold-start effects, and stating what a benchmark excludes — using two real mistakes made while building this course as case studies. This chapter sets the stage for the assembly-language module that follows.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. ARM Compiler
2. Abstraction Cost
3. Assembly Language
4. Boxed Values
5. Bytecode Interpretation
6. C Compiler
7. C Language
8. Cache Memory
9. Calling C From MicroPython
10. Code Size
11. Cold Start Effect
12. Comparison Tables
13. Compiler Optimization
14. Compiler Settings
15. GCC Compiler
16. Honest Reporting
17. Language Tradeoff Analysis
18. Machine Types
19. Measurement Discipline
20. Memory Management
21. Native Code Emitter
22. Negative Result
23. Optimization Flags
24. Prediction Before Measurement
25. Type Annotation
26. Unboxed Values
27. Viper Code Emitter
28. Warm Up Discard
29. Warm Up Runs
30. What A Benchmark Excludes

## Prerequisites

This chapter builds on concepts from:

- [1. Hello World: Thonny, MicroPython, and Your First GPIO Program](../01-hello-world/index.md)
- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [3. Peripherals: The OLED Display, Buttons, and Deploying Standalone Code](../03-peripherals/index.md)
- [17. Measuring Time: The DWT Cycle Counter](../17-measuring-time/index.md)
- [18. Benchmarking Methodology: Warm-Up, Statistics, and Fair Comparison](../18-benchmarking-methodology/index.md)

---

!!! mascot-welcome "Time to transform — the same code into five different speeds!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You now have an accurate timer and the statistical discipline to trust what it tells
    you. Let's point both at the biggest question of this half of the course: what does
    the *language* you write in actually cost you, in cycles?

## Predicting Before Measuring

Before reading any further, write down a guess: if you run the exact same numeric loop as
plain MicroPython, as MicroPython's `@native` decorator, as MicroPython's `@viper`
decorator, as C, and as hand-written assembly, which order do you expect from slowest to
fastest — and roughly how many times faster do you think the fastest is than the slowest?

This is **prediction before measurement**: committing to a guess in writing *before*
running the benchmark, so you cannot quietly revise your expectations after seeing the
data and call it foresight. This course uses the pattern deliberately and repeatedly,
because almost every prediction made while building it turned out to be optimistic — and
that miscalibration is itself something worth discovering firsthand, not being told about.

## Six Rungs, One Ladder

The five approaches above form what this chapter calls the **abstraction cost** ladder —
the idea that every layer of convenience a language adds between you and the raw CPU
instructions has a price, paid in cycles, and that price can be measured directly rather
than guessed at. From top (most convenient, most abstracted) to bottom (least convenient,
closest to the hardware):

1. Plain MicroPython — **bytecode interpretation**
2. MicroPython with `@micropython.native`
3. MicroPython with `@micropython.viper`
4. **C language**, compiled ahead of time
5. **Assembly language**, written by hand (Module 7, starting next chapter)

Each rung down removes a layer of runtime convenience and, typically, gains speed. The
rest of this chapter explains *why* — what each layer is actually doing differently under
the hood — before Chapter 20 begins the descent into assembly itself.

## The Default: Bytecode Interpretation

When Thonny runs an ordinary `.py` file, MicroPython first compiles your source text into
**bytecode** — a compact, portable set of low-level instructions that is not the same
thing as ARM machine code. At runtime, MicroPython's virtual machine walks through that
bytecode one instruction at a time in a loop, decoding each instruction and carrying out
the corresponding operation. This process, **bytecode interpretation**, is what makes
MicroPython portable across wildly different chips with no recompilation — the same
bytecode can run on an ARM Cortex-M33 or a completely different processor, because the
interpreter loop, not the bytecode, is what talks to the actual hardware. That portability
is also exactly where the overhead comes from: every operation pays the cost of being
decoded and dispatched by the interpreter loop, every single time it runs, even inside a
tight loop that executes the same instruction thousands of times.

## Boxed Values: The Deeper Cost

The interpreter loop is only half the story. The other half is *how Python represents a
number in memory* — and this is where **boxed values** enter the picture.

!!! mascot-thinking "What does 'boxing' a number actually mean?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    In C, a `float` is just four bytes sitting in memory or a register — nothing else. In
    plain Python, even the number `3.14` is wrapped in a small heap-allocated object that
    also carries a pointer to its type, a reference count for garbage collection, and only
    then the actual bytes of the value. That wrapper is the "box."

A **boxed value** is a value stored inside this heap-allocated wrapper object rather than
directly as raw bits. Boxing is what gives Python its flexibility — a variable can hold an
integer, then a float, then a string, because the box, not the raw memory location,
carries the type information. It is also expensive: every arithmetic operation on boxed
values means following a pointer to the box, checking its type, unwrapping the value,
computing, and allocating a brand-new box for the result. An **unboxed value**, by
contrast, is the raw machine representation — the same four bytes a C `float` or ARM FPU
register would hold, with no wrapper, no pointer chase, and no allocation.

#### Diagram: Boxed vs. Unboxed Memory Layout Explorer

<iframe src="../../sims/boxed-unboxed-memory-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Boxed vs. Unboxed Memory Layout Explorer</summary>
Type: microsim
**sim-id:** boxed-unboxed-memory-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand (L2) — explain, compare
Learning objective: Explain why arithmetic on a boxed value requires more memory accesses than the same arithmetic on an unboxed value, by comparing their memory layouts step by step.

Canvas layout:
- Top (250px): "Boxed" memory diagram — a variable slot pointing (arrow) to a heap object containing [type tag][refcount][value bytes]
- Bottom (250px): "Unboxed" memory diagram — a variable slot containing the value bytes directly, no arrow, no separate object

Visual elements:
- Both diagrams represent computing `a + b` where a and b are floats
- Boxed diagram shows: variable → pointer → heap box (3 labeled fields) for both a and b, then a NEW heap box allocated for the result
- Unboxed diagram shows: variable slots holding raw bytes directly, an ADD operation writing straight into a result slot, no allocation

Data Visibility Requirements:
  Stage 1: Show both starting states (a and b represented each way) side by side
  Stage 2 (Boxed path): highlight pointer-follow step, then type-check step, then value-extraction step, then new-allocation step, counting each as "1 memory operation" in a running tally
  Stage 3 (Unboxed path): highlight the single direct ADD step, tally stays at 1
  Final: Show final tallies side by side — Boxed: 7 operations, Unboxed: 1 operation (illustrative counts, not a precise cycle count)

Interactive controls:
- Button: "Step forward" / "Step back" through both paths in lockstep
- Button: "Run both to completion"
- Toggle: "Show operation tally"

Instructional Rationale: Step-through with an explicit operation tally is appropriate for
this Understand-level objective because it makes the abstract idea of "pointer chasing has
a cost" concrete and countable, rather than relying on an animation that would obscure
exactly which steps are extra.

Implementation: p5.js, two parallel diagrams drawn as boxes and arrows, tally counter updates per step
</details>

## Native Code Emitter: Skip the Interpreter Loop

MicroPython offers a way to opt out of the interpreter loop for a specific function
without leaving Python syntax at all. Adding the `@micropython.native` decorator marks a
function to use the **native code emitter**, which compiles that function directly into
ARM machine code ahead of time, once, rather than re-interpreting its bytecode on every
call.

```python
@micropython.native
def dot_product(a, b, n):
    total = 0.0
    for i in range(n):
        total += a[i] * b[i]
    return total
```

The `@micropython.native` line above the function is the entire change required — no new
syntax inside the function body. This removes the interpreter's per-instruction decode
overhead, but the native emitter still uses **boxed values** for every number, so it does
not remove the pointer-chasing and allocation cost described above. Native code is
typically noticeably faster than interpreted bytecode, but it is not yet close to what C
or assembly can do.

## Viper Code Emitter: Unboxed, On Purpose

The **viper code emitter**, enabled with `@micropython.viper`, goes a step further: it
lets you declare the actual machine type of a variable explicitly, and once declared,
viper stores and operates on that variable as a genuinely **unboxed value** — raw bytes,
no wrapper, no allocation.

```python
@micropython.viper
def dot_product(a: ptr32, b: ptr32, n: int) -> int:
    total = 0
    for i in range(n):
        total += a[i] * b[i]
    return total
```

The `a: ptr32` and `n: int` annotations after each parameter name are **type
annotations** — they tell the viper compiler "treat this as a raw 32-bit pointer" or "a
raw machine integer," rather than a general Python object. `ptr32`, `int`, and similar
viper types are what this chapter calls **machine types**: representations that map
directly onto the CPU's own registers and memory words, in contrast to Python's dynamic
object types which carry extra bookkeeping. Once every value in a hot loop is a machine
type, viper-compiled code can approach hand-written C in speed — at a real cost, covered
next.

!!! mascot-warning "Viper trades away Python's safety net"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Outside a viper function, MicroPython's automatic **memory management** — reference
    counting and a garbage collector that tracks every boxed object and frees it once
    nothing points to it anymore — protects you from most memory bugs. Inside a viper
    function operating on raw pointers, that safety net is gone. A wrong pointer
    arithmetic mistake in viper code can corrupt memory the same way it could in C. Speed
    and safety are genuinely in tension here, not just in theory.

Now that all three MicroPython execution modes have been explained individually, the
table below simply organizes what you already know — it introduces no new ideas, only a
side-by-side view:

| Emitter | Value representation | Type declared? | Typical relative speed |
|---|---|---|---|
| Plain (bytecode) | Boxed | No | Baseline (1×) |
| `@micropython.native` | Boxed | No | Faster — skips interpreter dispatch |
| `@micropython.viper` | Unboxed (for annotated types) | Yes, via type annotations | Fastest of the three — skips dispatch *and* boxing |

!!! mascot-tip "Measure your own hardware — don't trust a table of multipliers"
    ![Echo giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The exact speedup from `@native` and `@viper` depends heavily on what the code
    actually does — a function dominated by floating-point math benefits differently than
    one dominated by array indexing. Treat any number you read (including in this
    chapter) as a starting guess, and let your own Chapter 18 test harness give you the
    real answer for your own code.

## One Rung Lower: C

Below all three MicroPython modes sits the **C language** — a statically typed, compiled
language with no interpreter and no automatic memory management at runtime; a C program
manages its own memory explicitly. This course studies C at the level of **language
tradeoff analysis and reading code**, not by building and flashing C programs — every lab
runs on stock MicroPython with inline assembly, precisely so no toolchain installation
ever blocks a student from finishing a lab.

A C source file is translated to ARM machine code ahead of time by a **C compiler** —
software that performs this translation once, before the program ever runs, unlike
MicroPython's interpreter which translates (or partially translates) on the fly. Two C
compilers are common in the ARM embedded world: the **GCC compiler** (`arm-none-eabi-gcc`,
free and open source, the de facto standard for hobbyist and open-source embedded work)
and the **ARM compiler** (`armclang`, a commercial toolchain from ARM itself, often used
in professional embedded development for its diagnostics and certification support). Both
compile the same C language to the same Cortex-M33 instruction set; they differ mainly in
tooling, licensing, and how aggressively their optimizers work by default.

It is technically possible to combine the two worlds — **calling C from MicroPython**, by
compiling a C function into a precompiled native module that MicroPython's firmware loads
and calls into directly, bypassing the interpreter entirely for that function. Production
systems that need C-level speed with Python-level convenience for the rest of the program
often do exactly this. Building that bridge is outside this course's scope, but knowing
it exists — and why a team would reach for it — is part of the tradeoff analysis this
chapter is building toward.

## Compiler Optimization: Same Source, Different Machine Code

Unlike MicroPython's viper emitter, which you control by writing type annotations by
hand, a C compiler decides *for itself* how to translate your source into fast machine
code, through **compiler optimization** — automated transformations like reordering
instructions, keeping values in registers instead of memory, and eliminating redundant
computation, all while preserving the program's observable behavior. How aggressively the
compiler optimizes is controlled by **optimization flags** passed as **compiler
settings** on the command line — `-O0` (no optimization, fastest to compile, easiest to
debug), up through `-O2` or `-O3` (aggressive optimization, often several times faster at
runtime), or `-Os` (optimize for smaller code rather than raw speed).

That last option points at a genuine tradeoff: aggressive optimization for speed can
increase **code size** — the number of bytes the compiled program occupies in flash
memory — sometimes substantially, because techniques like loop unrolling and function
inlining duplicate instructions to avoid the overhead of jumps and function calls. On a
memory-constrained microcontroller, larger code size is not free; it competes for the same
flash and can even hurt speed if the resulting code no longer fits comfortably in the
chip's **cache memory** — a small, very fast on-chip memory that holds recently used
instructions and data so the CPU doesn't have to wait on slower main memory. Code that
overflows the cache can run *slower* despite being "more optimized," which is why
optimization level, code size, and cache behavior are usually discussed together rather
than in isolation.

## The Bottom Rung: Assembly Language

**Assembly language** is source code written in the CPU's own instruction mnemonics —
one line, roughly, per actual machine instruction — with no compiler translating your
intent into instructions on your behalf. There is nothing left to abstract away below
assembly except the literal bit patterns the CPU decodes, which Chapter 25 explores
directly. Writing assembly by hand means you control exactly which instructions execute,
in exactly what order, using exactly which registers — the same control a C compiler's
optimizer exercises automatically, except every decision is now yours. Module 7, starting
with the next chapter, teaches this skill from zero.

#### Diagram: The Abstraction Ladder

<iframe src="../../sims/abstraction-ladder-diagram/main.html" width="100%" height="472px" scrolling="no"></iframe>

<details markdown="1">
<summary>The Abstraction Ladder</summary>
Type: infographic
**sim-id:** abstraction-ladder-diagram<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze (L4) — organize, differentiate
Learning objective: Organize the five approaches into a ranked ladder and differentiate what each rung gives up in exchange for speed.

Canvas layout:
- Full canvas: five horizontal rungs stacked vertically, labeled top to bottom: "MicroPython (bytecode)", "MicroPython @native", "MicroPython @viper", "C", "Assembly"
- Right margin: a details panel that fills in when a rung is clicked

Visual elements:
- Each rung drawn as a horizontal bar, width proportional to illustrative relative execution time (longest bar for bytecode, shortest for assembly) — labeled "illustrative, not measured" in small text
- Each rung colored on a gradient from cool (interpreted) to warm (hand-written machine code)
- A small icon per rung: interpreter loop icon, gear icon, wrench icon, compiler icon, chip icon

Interactive controls:
- Click any rung to open its details panel with: what runs the code (interpreter / compiler / you), value representation (boxed / unboxed), and one sentence on what you give up moving to this rung from the one above
- Hover any rung for a one-line tooltip summary

Behavior:
- Clicking "MicroPython @viper" for example reveals: "Values are unboxed machine types you declare yourself. You give up automatic memory safety for values you've annotated."
- Clicking "Assembly" reveals: "You write every instruction. You give up the compiler entirely — every optimization decision is now yours."

Instructional Rationale: A clickable ranked ladder matches the Analyze-level objective of
organizing five approaches and differentiating their tradeoffs; requiring a click to
reveal each tradeoff (rather than showing all text at once) encourages the learner to
engage with each rung individually before moving to the next.

Implementation: p5.js, rungs as an array of rectangle objects with associated detail text, click detection via mouseX/mouseY bounds
</details>

## Measurement Discipline Applied

Comparing five approaches fairly demands applying every habit from Chapter 18 at once —
what this chapter calls **measurement discipline**: the same input, the same board, the
same statistic (best-of-N, since the question here is raw algorithmic speed), and the
same number of samples, for every one of the five rungs.

One new wrinkle appears specifically when timing native and viper functions: the **cold
start effect**. The very first call to a `@native` or `@viper` function can be slower
than every subsequent call, because MicroPython performs some one-time setup work
(finalizing the compiled machine code, populating certain internal tables) on that first
invocation only. If that first call lands inside your timed sample, it inflates the
result in a way that has nothing to do with the function's steady-state speed.

The fix is a set of **warm-up runs**: calling the function a handful of times *before*
starting the timed sample, specifically to get past any one-time setup cost. Practicing
**warm-up discard** means explicitly not recording those warm-up calls in your statistics
at all — they exist only to put the system into a representative, steady state before
the real measurement begins.

```python
def run_harness_with_warmup(func, n=50, warmup=5):
    for _ in range(warmup):        # warm-up discard: these calls are not recorded
        func()

    times = []
    for _ in range(n):
        start = machine.mem32[DWT_CYCCNT]
        func()
        end = machine.mem32[DWT_CYCCNT]
        times.append(elapsed_us(start, end))

    return {"min_us": min(times), "n": n, "warmup": warmup}
```

This is Chapter 18's `run_harness` from before, extended with a `warmup` loop that runs
and discards `func()` five times before any timed sample begins — the only change needed
to make cold-start effects stop contaminating the result.

## Comparison Tables and Honest Reporting

The standard way this course presents a multi-way result like "bytecode vs. native vs.
viper vs. C vs. assembly" is a **comparison table** — a table with implementations as
rows and consistent metrics (execution time, code size, memory usage) as columns, built
directly from the harness output above rather than from memory or intuition.

Building one honestly requires **honest reporting**: stating the sample size, the
statistic used, the board and clock speed, and — critically — **what a benchmark
excludes**. For a language comparison specifically, that usually means disclosing whether
compile time or one-time setup cost was included, whether warm-up runs were discarded,
and whether code size was measured at all. Leaving any of these unstated, even
accidentally, can make one implementation look better than a full accounting would
support.

!!! mascot-encourage "Thirty concepts in one chapter — that's the density talking, not you"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    This chapter packs in more named terms than any other so far, because comparing five
    execution models honestly touches nearly every idea from the last two chapters at
    once. You don't need to memorize `armclang` versus `arm-none-eabi-gcc` by heart —
    what matters is the pattern: name each rung, measure it fairly, report what you left
    out.

Not every optimization pays off, and that is worth stating plainly rather than quietly
adjusting the comparison until it looks better. A **negative result** — a case where
`@micropython.viper` turns out no faster than `@micropython.native` for a particular
function, say, because the function was never bottlenecked on boxing to begin with — is a
completely legitimate, reportable finding. This course's grading philosophy treats a
negative result, honestly explained, as equal in value to a positive one; the single
unacceptable move is deciding after the fact which result to keep quiet about.

## Language Tradeoff Analysis: Putting It All Together

With every rung defined, a full **language tradeoff analysis** weighs speed against the
other things that matter in a real project — development effort, portability, and safety:

| Approach | Relative speed | Development effort | Portability | Memory safety |
|---|---|---|---|---|
| MicroPython (bytecode) | Slowest | Lowest | Highest | Full (automatic) |
| `@micropython.native` | Faster | Low (one decorator) | High | Full (automatic) |
| `@micropython.viper` | Fast | Medium (type annotations required) | Medium | Partial (only for boxed values still in play) |
| C | Very fast | High (manual memory, toolchain setup) | Medium (recompile per target) | None (manual) |
| Assembly | Fastest | Highest | Lowest (chip-specific) | None (manual) |

No row in this table is simply "the best" — a research prototype iterated on daily has
different needs than a certified medical device's signal-processing core, and this
table's real job is making that tradeoff visible rather than picking a winner for you.

??? question "Your harness reports `@micropython.viper` running only 5% faster than `@micropython.native` for a specific function. Is this a bad benchmark result? Click to check."
    Not necessarily — it may be an honest **negative result**. If the function's time was
    already dominated by something viper can't help with (waiting on a peripheral,
    memory access patterns, or `n` being too small to amortize any setup cost), then a
    small gap is the correct answer, not a sign the benchmark is broken. The next step is
    to check measurement discipline (warm-up discarded? same sample size? same input?)
    before concluding the gap itself is meaningful — and then to report the small gap
    honestly rather than searching for a way to make it look bigger.

!!! mascot-celebration "You just climbed most of the ladder"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Now *that's* a superpower — being able to explain, in cycles, exactly what Python's
    convenience costs you, and exactly what each layer of optimization buys back.
    Chapter 20 asks the one question that decides whether you can even take the next step
    down this ladder on your own board: does your chip's CPU actually have the hardware
    to run the assembly you're about to write?
