---
title: "The Butterfly in Assembly: A Complete FFT and Production Libraries"
description: Hand-writing the FFT's butterfly operation in ARM assembly, validating it bit-for-bit against Python, and why production systems call a library instead
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# The Butterfly in Assembly: A Complete FFT and Production Libraries

## Summary

This chapter hand-writes the FFT's butterfly operation in ARM assembly and assembles it into a complete transform that matches the Python version bit for bit. It then surveys production FFT libraries — CMSIS-DSP, KissFFT, FFTW, and others — and their licensing, to explain why real systems call a well-tested library rather than writing their own. This chapter is the assembly module's capstone result.

## Concepts Covered

This chapter covers the following 23 concepts from the learning graph:

1. API Documentation
2. Arm Math Library
3. Assembly Butterfly
4. Assembly Debugging
5. Bit For Bit Match
6. CMSIS DSP Library
7. FFT Libraries
8. FFTW Library
9. GPL License
10. Hot Loop
11. Kiss FFT
12. Library Integration
13. Library Licensing
14. Library Over Handwritten Code
15. MIT License
16. Open Source FFT
17. Pico SDK FFT
18. Python Assembly Boundary
19. Register Pressure
20. Register Spilling
21. Scratch Register
22. Stage Parameter Block
23. Work Split Strategy

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [9. Computing and Validating the DFT](../09-computing-and-validating-the-dft/index.md)
- [10. Why the DFT Is Too Slow](../10-why-the-dft-is-too-slow/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)
- [22. Talking to the FPU: Floating-Point Assembly](../22-talking-to-the-fpu/index.md)

---

!!! mascot-welcome "Time to transform — every FFT chapter into one working routine!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is the chapter everything since Chapter 11 has been building toward: a complete
    FFT, hand-written in assembly, that produces the exact same answer as the Python
    version you proved correct months ago. Let's assemble it — and then find out why the
    pros usually don't.

## One Butterfly, Written in Assembly

Chapter 11 defined the butterfly operation mathematically: combine one value from the
"even" half of a sub-transform with one value from the "odd" half, after multiplying the
odd value by a twiddle factor. Written out for the real and imaginary parts separately,
the **assembly butterfly** is a short, fixed sequence of the exact FPU instructions
Chapter 22 introduced — `VLDR` to bring in the even value, the odd value, and the twiddle
factor; `VMUL` and `VMLA` to compute the twiddle-multiplied odd term; `VADD` and `VSUB` to
produce the two outputs; `VSTR` to write both results back to the buffer:

```
; s0 = even.re, s1 = even.im
; s2 = odd.re,  s3 = odd.im
; s4 = tw.re,   s5 = tw.im   (twiddle factor for this butterfly)

VMUL s6, s2, s4          ; s6 = odd.re * tw.re
VMLA s6, -s3, s5           ; s6 -= odd.im * tw.im   -> s6 = twiddled.re
VMUL s7, s2, s5              ; s7 = odd.re * tw.im
VMLA s7, s3, s4                ; s7 += odd.im * tw.re -> s7 = twiddled.im

VADD s8, s0, s6           ; output_top.re    = even.re + twiddled.re
VADD s9, s1, s7            ; output_top.im   = even.im + twiddled.im
VSUB s10, s0, s6            ; output_bottom.re = even.re - twiddled.re
VSUB s11, s1, s7             ; output_bottom.im = even.im - twiddled.im
```

Every instruction above is one you already know from Chapter 22 — `VMUL`, `VMLA`,
`VADD`, `VSUB` — applied to the exact complex-multiplication formula Chapter 7 first
introduced. A complete FFT is nothing more than this eight-instruction pattern, repeated
once for every butterfly across every stage.

## Register Pressure and the Discipline of Scratch Registers

That butterfly alone already uses twelve floating-point registers simultaneously — `s0`
through `s11` — out of the thirty-two available. This is **register pressure**: the
demand a routine places on the available register file, which grows as more values must
stay live at once. A butterfly with real and imaginary parts for three complex numbers
(even, odd, twiddle) plus intermediate products has real, unavoidable pressure — but it
still comfortably fits within `s0`-`s31`, so nothing here needs to spill.

**Register spilling** is what happens when a routine needs *more* simultaneous values
than fit in the available registers: the excess must be temporarily written out to
memory and reloaded later, using ordinary `VSTR`/`VLDR` pairs that exist only to make
room, not to move data anywhere useful. Spilling is not free — it costs the same memory
traffic Chapter 22 discussed, so a well-designed routine minimizes it by reusing
registers deliberately once their current value is no longer needed. A **scratch
register** is exactly that: a register explicitly set aside for short-lived intermediate
values (like `s6` and `s7` above), which the routine is free to overwrite on the very
next butterfly with no consequence, because nothing later depends on its old contents.

!!! mascot-thinking "Twelve registers, one butterfly — and the FPU has room to spare"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    With 32 `s` registers available and only 12 needed per butterfly, this particular
    routine has comfortable headroom. That won't always be true — a more ambitious
    routine that tried to process several butterflies at once, for instance, could run
    into real register pressure and need spilling. Knowing the difference between "tight
    but fits" and "needs to spill" is exactly the judgment call register allocation
    requires.

## Architecture: Where Python Ends and Assembly Begins

A complete FFT is not *only* the butterfly — it also needs bit-reversal reordering, a
twiddle-factor table, and a loop structure walking through \(\log_2 N\) stages, each
touching every element once. Deciding which of this work runs in Python and which runs in
hand-written assembly is a real design decision, this chapter's **work split strategy**.

The twiddle-factor table only needs computing once, ever, regardless of how many times
the FFT itself runs afterward — so it stays in ordinary Python, computed with `math.sin`
and `math.cos` exactly as in Chapter 11, with no speed penalty worth chasing. The
per-stage orchestration — figuring out how many butterflies each stage needs and which
buffer positions they touch — also runs once per stage, a small, fixed number of times (9
stages for a 512-point transform), so it too stays in Python.

What *does* run in assembly is the **hot loop**: the innermost loop that executes the
eight-instruction butterfly pattern above, over and over, for every one of the \(N/2 \times
\log_2 N\) butterflies a full transform requires — for a 512-point FFT, 2,304 butterfly
executions per transform, every single frame, in a real-time spectrum analyzer. A hot
loop is, by definition, the specific piece of code that dominates total execution time
precisely because it runs so many more times than everything surrounding it — exactly the
part worth the effort of hand-written assembly, and the only part.

The exact handoff between the two — where Python's control flow ends and the assembly
routine's control flow begins for one stage — is the **Python assembly boundary**. Each
stage, Python calls into one `asm_thumb` function, passing it everything the hot loop
needs to run unsupervised until that stage is complete.

## Stage Parameter Block: Packaging What Each Stage Needs

Every stage of the FFT needs slightly different parameters — how far apart paired
elements are, how many butterflies happen at this stage, what stride to use walking
through the twiddle-factor table — and passing each of these as a separate argument would
quickly exceed the four-register argument convention from Chapter 21. Instead, this
course packages them into a **stage parameter block**: a small typed array holding every
parameter one stage's hot loop needs, with a single pointer to that block crossing the
Python-assembly boundary instead of half a dozen individual values.

```python
# stage parameter block: [span, twiddle_stride, butterfly_count]
stage_params = array.array('i', [span, tw_stride, count])

run_stage_hotloop(buffer_re, buffer_im, twiddle_re, twiddle_im, stage_params)
```

`run_stage_hotloop` receives five addresses — enough to cover the real and imaginary
signal buffers, the precomputed twiddle tables, and this one small parameter block —
comfortably within the four-argument convention once the individual stage numbers are
folded into a single block rather than passed one at a time.

#### Diagram: FFT Stage Architecture — Python and Assembly Boundary

<iframe src="../../sims/fft-stage-architecture/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>FFT Stage Architecture — Python and Assembly Boundary</summary>
Type: workflow
**sim-id:** fft-stage-architecture<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Analyze (L4) — differentiate, examine
Learning objective: Differentiate which parts of a full FFT run in Python versus hand-written assembly, and examine why the split falls where it does.

Canvas layout:
- Top band, labeled "Python (runs once, or once per stage)": three boxes — "Compute twiddle table (once)", "Bit-reversal reorder (once)", "For each of 9 stages: build stage parameter block"
- Bottom band, labeled "Assembly (the hot loop, runs 2,304 times per transform)": one large box — "run_stage_hotloop: butterfly × count"
- A single connecting arrow crossing from the Python band to the assembly band, labeled "Python/assembly boundary"

Visual elements:
- Clear visual separation (a horizontal divider) between the two bands
- Boxes sized loosely proportional to how often that code actually executes (small boxes for once-only steps, one large box for the loop that runs thousands of times)
- The connecting arrow highlighted distinctly, since it's the single most important line in the diagram

Interactive controls:
- Hover or click each box to reveal: what it does, how many times it runs for one 512-point FFT, and why it's placed on that side of the boundary
- Click the boundary arrow itself to reveal: "This is the stage parameter block — five addresses, one block, crossing once per stage."

Behavior:
- Clicking "run_stage_hotloop" reveals: "Runs the eight-instruction butterfly pattern 2,304 times for a 512-point transform. This is the only code worth hand-optimizing, because it's the only code that runs enough times for the optimization to matter."
- Clicking "Compute twiddle table (once)" reveals: "Computed exactly once, ever, reused by every future transform — no speed benefit to writing this in assembly."

Instructional Rationale: An Analyze-level objective calling for differentiation between
two categories is best served by a clickable two-band workflow diagram — the visual
separation itself teaches the categorization, and the click-to-reveal execution counts
justify *why* the split was drawn where it was, not just *that* it was drawn there.

Implementation: p5.js, two colored bands with box objects, execution-count annotations stored per box, click detection via bounding boxes
</details>

## Debugging Assembly You Cannot Print From

!!! mascot-warning "There is no `print()` inside an asm_thumb function"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The debugging techniques you're used to from ordinary Python — inserting a `print()`
    to inspect a variable — simply don't exist inside hand-written assembly. When a
    butterfly routine produces wrong output, you need a different approach entirely.

**Assembly debugging** in this course relies on a technique that needs no visibility
inside the routine itself: bisection against a known-good reference. Because Chapter 12's
pure-Python FFT is already proven correct, and because the assembly version is meant to
compute identical values, any disagreement between the two pinpoints the bug. Running
both implementations on the same input, then comparing their outputs *stage by stage*
rather than only at the very end, narrows down exactly which stage — and therefore which
few lines of assembly — first produces a wrong value. This is the same diagnose-by-bisection
philosophy the learning outcomes describe for this course generally, applied to a domain
where you cannot simply print your way to an answer.

## The Standard: Bit-for-Bit Match

The validation bar for the finished assembly FFT is stricter than "close enough" — it is
a **bit for bit match**: every output value from the assembly implementation must equal
the corresponding output from the pure-Python implementation exactly, down to the last
bit of the floating-point representation, not merely within some small numerical
tolerance.

This is achievable, but only because the assembly routine is structured to perform its
floating-point operations in the *same order* as the Python reference. Floating-point
addition and multiplication are not perfectly associative — `(a + b) + c` can produce a
tiny, last-bit-different result from `a + (b + c)`, purely from how rounding accumulates
differently depending on operation order. The assembly butterfly earlier in this chapter
was written specifically to multiply and accumulate in the same sequence Chapter 11's
Python version uses, precisely so that no such divergence has room to appear. A bit-for-bit
match is strong, direct evidence that the assembly routine implements the *same
algorithm*, not merely a numerically similar one.

??? question "Your assembly FFT matches the Python version bit-for-bit for stages 1 through 7, but stage 8 diverges. What does bisection tell you to check first? Click to check."
    Stages 1 through 7 are proven correct by the match, so the bug is isolated to
    whatever is specific to stage 8 — most likely its stage parameter block (span,
    twiddle stride, or butterfly count) or the twiddle-factor indices it reads, not the
    butterfly instruction sequence itself, since that same instruction sequence already
    produced correct results seven times over.

## Why Production Systems Call a Library Instead

With a working, validated assembly FFT in hand, the honest next question is whether you
should ever actually ship it. The answer, almost always, is **library over handwritten
code**: real production systems call an existing, extensively tested **FFT library**
rather than hand-rolling their own, even when — especially when — a team has engineers
capable of writing one. A library used across thousands of projects and millions of
device-hours has been exercised against far more edge cases, hardware revisions, and
compiler versions than any single hand-written routine realistically can be, and every bug
fixed in it benefits every project using it at once.

Several **FFT libraries** are worth knowing by name for exactly this reason:

- The **CMSIS-DSP library** — often still called by its older name, the **Arm Math
  library** — is ARM's own official signal-processing library, hand-optimized by ARM
  engineers for every Cortex-M core, including FFT routines tuned specifically for chips
  like the Cortex-M33.
- The **Pico SDK FFT** support refers to FFT functionality reachable through the
  Raspberry Pi Pico C SDK ecosystem, typically by linking in CMSIS-DSP or a similar
  library from C code — the same **calling C from MicroPython** boundary Chapter 19
  introduced, now applied to a real, shipped library instead of a hypothetical one.
- **KissFFT** is a small, deliberately simple **open source FFT** library prized for how
  easy it is to read and integrate into a new project, at some cost in raw speed compared
  to more aggressively optimized alternatives.
- The **FFTW library** ("Fastest Fourier Transform in the West") is a highly optimized,
  widely used open-source FFT library common in desktop and server signal-processing
  work, generally too large and dependency-heavy for a microcontroller like the Pico 2,
  but a name worth recognizing in any broader signal-processing context.

## Licensing Is Part of the Engineering Decision

Choosing a library is not purely a technical decision — **library licensing** carries
real legal and business consequences for any product built on top of it. The **MIT
license** is permissive: it allows the code to be used, modified, and shipped inside a
closed-source commercial product, requiring little more than preserving the original
copyright notice. The **GPL license** is copyleft: shipping GPL-licensed code inside a
product generally obligates you to make your own derivative source code available under
the same terms, which many commercial embedded products are unwilling or unable to do.
CMSIS-DSP ships under a permissive license suitable for closed-source products; KissFFT
also uses a permissive (BSD-style) license; FFTW is available under the GPL, with a
separate commercial license sold specifically for companies that need to avoid GPL's
obligations.

Now that each library and license type has been explained individually, the table below
organizes them for quick comparison — introducing no new facts, only arranging the ones
above:

| Library | Type | Typical license | Fits on Pico 2? |
|---|---|---|---|
| CMSIS-DSP (Arm Math) | Vendor-optimized | Permissive (Apache 2.0) | Yes — designed for Cortex-M |
| KissFFT | Open source, simple | Permissive (BSD-style) | Yes — small and portable |
| FFTW | Open source, highly optimized | GPL (or paid commercial) | Rarely — heavier than typical MCU needs |

## Reading Documentation and Integrating a Library

Using any of these libraries in a real project — rather than reading about them — means
two more practical skills. **API documentation** is the reference material describing a
library's function signatures, expected argument types, and behavior, without requiring
you to read its internal implementation; the whole point of a well-documented library is
that you can use it correctly from its documentation alone. **Library integration** is
the practical work of pulling that library into your own build — linking it, matching its
calling conventions to your code, and wiring its expected data layout to your own
buffers, using exactly the same load-store, pointer-arithmetic, and calling-convention
concepts this chapter and the two before it just spent three chapters teaching you from
first principles.

!!! mascot-encourage "You didn't waste three chapters"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    It might feel strange to build something by hand and then be told professionals reach
    for a library instead. But you can now read CMSIS-DSP's source code, understand
    exactly what its register allocation and hot loop are doing, and recognize a good
    integration from a fragile one — because you've done the harder version yourself.
    That's the actual point.

!!! mascot-celebration "The assembly module's capstone, complete"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Not bad for a $5 chip! A hand-written, bit-for-bit-correct FFT in ARM assembly, plus
    the judgment to know when *not* to ship your own. Chapter 24 pushes further still —
    exploiting specific properties of this exact computation to make the hot loop even
    faster.
