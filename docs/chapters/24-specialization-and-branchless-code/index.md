---
title: "Specialization and Branchless Code"
description: Exploiting trivial twiddle factors, avoiding branch misprediction, loop unrolling, and cache-aware memory access patterns to speed up an already-correct assembly FFT
generated_by: claude skill chapter-content-generator
date: 2026-08-10 21:05:45
version: 0.09
---

# Specialization and Branchless Code

## Summary

This chapter covers optimization techniques that exploit specific, known properties of a computation: recognizing trivial twiddle factors (multiply by one or by i), branchless code to avoid unpredictable-branch penalties, and loop unrolling. It also covers cache effects and memory access patterns as a second, independent source of performance difference from the algorithmic gains covered earlier. These techniques set up the instruction-encoding chapter that follows.

## Concepts Covered

This chapter covers the following 17 concepts from the learning graph:

1. Address Computation Cost
2. Branch Prediction
3. Branchless Code
4. Cache Effects
5. Code Size Tradeoff
6. Floating Point FFT
7. Loop Overhead
8. Loop Unrolling
9. Memory Access Patterns
10. Multiply By One
11. Multiply By i
12. Optimization Attribution
13. Precomputed Swap List
14. Special Case Optimization
15. Trivial Twiddle
16. Unpredictable Branch
17. Vectorization

## Prerequisites

This chapter builds on concepts from:

- [2. Know Your Board: ARM Cortex-M Architecture and the Pico 2](../02-know-your-board/index.md)
- [7. Complex Numbers and Wave Superposition](../07-complex-numbers-and-wave-superposition/index.md)
- [11. From DFT to FFT: Divide and Conquer, Twiddle Factors, and the Butterfly](../11-from-dft-to-fft/index.md)
- [12. Building the FFT: A Complete Recursive Implementation](../12-building-the-fft/index.md)
- [19. The Abstraction Ladder: Python, C, and Assembly Compared](../19-the-abstraction-ladder/index.md)
- [20. Does Your CPU Have an FPU?](../20-does-your-cpu-have-an-fpu/index.md)
- [21. Your First Assembly Function: Registers and Loops](../21-your-first-assembly-function/index.md)
- [22. Talking to the FPU: Floating-Point Assembly](../22-talking-to-the-fpu/index.md)
- [23. The Butterfly in Assembly: A Complete FFT and Production Libraries](../23-the-butterfly-in-assembly/index.md)

---

!!! mascot-welcome "Time to transform — a correct FFT into a faster one!"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your assembly FFT from Chapter 23 is correct, bit for bit. It is not yet as fast as
    it can be. This chapter is about looking at *this exact computation* — not FFTs in
    general — and finding the specific shortcuts only this one supports.

Every optimization in this chapter applies to the **floating point FFT** you built in
Chapter 23 — the single-precision, `s`-register implementation, as distinct from the
fixed-point alternative Chapter 25 discusses as a scoped tradeoff rather than something
this course builds. Floating-point is the version these techniques target directly.

## Trivial Twiddles: When Multiplication Isn't Needed at All

Look closely at the twiddle factors a small FFT actually uses, and a pattern jumps out:
several of them are not "ordinary" complex numbers at all, but the special values 1, -1,
i, and -i. A twiddle factor equal to one of these four values is called a **trivial
twiddle**, and multiplying by one requires no real arithmetic whatsoever.

**Multiply by one** is the simplest case: for any complex number \(z\), \(z \times 1 =
z\) — the twiddle-multiplied odd value is *already* the odd value, unchanged. The
butterfly's four multiply-accumulate instructions from Chapter 23 can be skipped entirely
for this butterfly; the output is simply the even value plus or minus the odd value,
directly.

**Multiply by i** is only slightly less trivial. Multiplying a complex number \(z =
a + bi\) by \(i\) gives \(ai + bi^2 = -b + ai\) — the real and imaginary parts swap
places, and the new real part is negated. No multiplication instruction is required at
all, only a register swap and a sign flip.

!!! mascot-thinking "Free speed, hiding in plain sight"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A general-purpose FFT routine has no way to know, ahead of time, which twiddle factors
    will turn out to be trivial for a specific size — but *you* do, because you compute
    the twiddle table yourself in Python before the hot loop ever runs. That's the whole
    opportunity: information the general algorithm doesn't have, but you do.

Recognizing and exploiting this is an instance of a broader technique, **special case
optimization**: identifying a known, recurring pattern in a specific computation's inputs
and writing a faster, narrower code path for exactly that pattern, alongside (or instead
of) the general-purpose path that handles everything else correctly but slower.

## Precomputed Swap List: Removing the Branch, Not Just the Multiply

The most naive way to exploit trivial twiddles would check, inside the hot loop, whether
each butterfly's twiddle factor happens to equal 1 or i, and branch to a shortcut if so.
But that check is itself a cost — and worse, it is exactly the kind of runtime branch the
next section explains you want to avoid inside a hot loop.

The fix is to move the *decision* out of the hot loop entirely. Because the twiddle table
is fixed and known before the FFT ever runs, Python can compute, once, a **precomputed
swap list** — the exact list of butterfly positions whose twiddle factor is trivial,
determined ahead of time during table setup, not discovered at runtime. With that list in
hand, the assembly code splits into two separate loops: one hot loop that runs only over
the positions on the precomputed list, using the free trivial-twiddle shortcut with no
comparison at all, and a second hot loop for every remaining position, using the full
butterfly from Chapter 23. Neither loop contains a single conditional branch checking
"is this one trivial?" — the classification already happened, once, in Python, well
before either loop starts.

## Branch Prediction and Why Some Branches Are Expensive

To see why avoiding that runtime check matters, you need to understand what a branch
costs a modern CPU pipeline in the first place. The Cortex-M33 uses **branch
prediction**: rather than stall and wait to find out which way a conditional branch will
go, the CPU guesses — based on the branch's recent history — and starts fetching and
decoding instructions down the predicted path *before* the branch actually resolves. When
the guess is right, this costs nothing extra. When the guess is wrong, the CPU must
discard everything it speculatively started and restart from the correct path, a real
cycle penalty called a misprediction stall.

A branch whose outcome is highly regular — like the loop-closing `BGT` from Chapter 21,
which is "taken" every single iteration except the very last — predicts almost perfectly,
because recent history is a near-perfect guide to what happens next. An **unpredictable
branch** is one whose outcome varies in a way the predictor cannot learn — exactly what a
runtime "is this twiddle trivial?" check would be, if the trivial and non-trivial
positions were scattered through the butterfly sequence with no exploitable pattern. Every
misprediction on that check would cost real cycles, potentially eating into or even
erasing the savings the trivial-twiddle shortcut was supposed to provide.

#### Diagram: Branch Misprediction Visualizer

<iframe src="../../sims/branch-misprediction-visualizer/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Branch Misprediction Visualizer</summary>
Type: microsim
**sim-id:** branch-misprediction-visualizer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Taxonomy: Understand (L2) — explain, interpret
Learning objective: Explain why a predictable branch costs nearly nothing while an unpredictable branch repeatedly stalls the pipeline, by stepping through both cases with visible pipeline state.

Canvas layout:
- Top (250px): "Predictable branch" pipeline lane — a horizontal row of pipeline stage boxes (Fetch, Decode, Execute) showing instructions flowing through smoothly across several loop iterations
- Bottom (250px): "Unpredictable branch" pipeline lane — same stage layout, but periodically shows a "flush" event (red flash, stages emptied) when a guess is wrong

Visual elements:
- Each lane processes a simulated sequence of 10 branch outcomes
- Predictable lane: outcomes follow an obvious pattern (taken, taken, taken, ..., not-taken once at the end) — predictor guesses correctly every time after the first
- Unpredictable lane: outcomes alternate unpredictably (simulating scattered trivial-twiddle positions) — predictor guesses wrong roughly half the time, each wrong guess shown as a pipeline flush with a small "wasted cycles" counter incrementing

Interactive controls:
- Button: "Step" — advances one branch outcome in both lanes simultaneously
- Button: "Run all 10"
- Running tally, per lane: "Total wasted cycles from mispredictions"
- Button: "Reset"

Instructional Rationale: Side-by-side pipeline lanes stepping through the same number of
branches let the learner directly compare (Understand-level) predictable versus
unpredictable outcomes and see the wasted-cycle cost accumulate concretely, rather than
being told the difference in the abstract.

Implementation: p5.js, two pipeline lanes as arrays of stage-boxes, flush animation triggered on simulated mispredict events
</details>

## Branchless Code: Removing the Guess Entirely

**Branchless code** takes the idea one step further: instead of writing a conditional
branch at all, rewrite the logic as arithmetic or bitwise operations whose result is
computed unconditionally, with no guess for the predictor to get wrong in the first
place. A classic tiny example — selecting the larger of two values without a branch —
shows the pattern:

```
; branch version: compare, then branch to pick the max
CMP r0, r1
BGE use_r0
MOV r2, r1
B done
use_r0:
MOV r2, r0
done:

; branchless version: compute both possibilities, select without branching
; (conceptual — ARM's conditional-select style instructions do this in hardware)
CMP r0, r1
MOVGE r2, r0     ; conditionally executed instruction, not a branch
MOVLT r2, r1
```

`MOVGE` and `MOVLT` are conditionally *executed* instructions — the CPU still fetches and
decodes both, but only commits the one whose condition matches, with no separate branch
instruction and therefore nothing for the predictor to guess about. The precomputed swap
list from earlier achieves the same goal by a different route: rather than making any
single instruction conditional, it removes the decision from the hot loop's control flow
altogether, which is the stronger and more broadly applicable version of the same idea.

!!! mascot-warning "Branchless code trades readability for speed — spend that trade carefully"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A branchless routine is almost always harder to read than its branching equivalent —
    the control flow that used to be visible in the code's structure is now hidden inside
    arithmetic tricks. Reach for it only after profiling shows the branch actually costs
    something measurable; branchless code applied to a branch that already predicts well
    is added complexity with no benefit at all.

## Loop Overhead and Loop Unrolling

Every pass through the hot loop from Chapter 23 pays for more than just one butterfly's
arithmetic — it also pays **loop overhead**: the `ADD`, `SUB`, `CMP`, and `BGT`
instructions that advance pointers, decrement a counter, and check whether to loop again.
For a loop body as short as a single butterfly, that bookkeeping can be a genuinely large
fraction of the total instructions executed per iteration.

**Loop unrolling** amortizes that fixed cost across more real work: instead of looping
once per butterfly, the loop body is manually duplicated — two, four, or more butterflies
processed per iteration — so the pointer-advance-and-branch overhead is paid once for
every several butterflies computed, rather than once per single butterfly.

```
; unrolled ×2: two butterflies' worth of work per loop iteration,
; one shared pointer-advance-and-branch at the end
loop_body:
    ; ... butterfly instructions for pair 1 ...
    ; ... butterfly instructions for pair 2 ...
    add(r0, r0, 8)      ; advance by two floats' worth
    sub(r2, r2, 2)        ; decrement count by two butterflies
    cmp(r2, 0)
    bgt(loop_body)
```

This is a direct **code size tradeoff**, the same one Chapter 19 introduced for compiler
optimization flags: unrolling duplicates instructions in the compiled routine, trading
larger code size for fewer loop-overhead instructions executed overall. On a chip with
limited flash and a small instruction cache, unrolling too aggressively can backfire —
exactly the same cache-capacity concern Chapter 19 raised about `-O3` compiler flags,
now showing up in hand-written assembly instead of compiler output.

Unrolling also touches the **address computation cost** paid every time a pointer is
advanced by a byte offset — the `ADD` instructions from Chapter 22's pointer arithmetic.
An unrolled loop can sometimes compute several element addresses from one base pointer
using fixed offsets (`[r0]`, `[r0, #4]`, `[r0, #8]`) rather than re-adding to the pointer
before every single access, trimming a real, if small, per-butterfly cost.

## Memory Access Patterns and Cache Effects

The optimizations so far all target *instructions* — fewer branches, fewer multiplies,
less loop overhead. A second, entirely independent source of speed difference comes from
**memory access patterns**: the order in which a routine actually reads and writes
memory addresses, which determines how well that traffic is served by the chip's fast
on-chip **cache memory** from Chapter 19, versus falling through to slower main memory.

**Cache effects** are performance differences that come purely from this pattern, with no
change to the algorithm's instruction count at all. Chapter 11's bit-reversal permutation
is a concrete example: it reorders array elements according to the bit-reversed value of
their index, which means consecutive steps of the reordering touch memory addresses that
jump around unpredictably, rather than marching through memory in a straight line.
Sequential access tends to be cache-friendly — the cache can fetch a whole nearby block
in one trip and serve several subsequent accesses from it — while scrambled,
bit-reversed access defeats that advantage, potentially costing real cycles that have
nothing to do with the arithmetic being performed.

## Vectorization: A Preview Worth Repeating

Chapter 22 introduced **vectorization** — using SIMD instructions to process several
values in a single instruction — as a technique this course names but does not implement.
It belongs in this chapter's catalog for a specific reason: like cache effects, it is a
source of speedup *independent* of the algorithmic and branch-related techniques above.
Production libraries like CMSIS-DSP lean heavily on vectorization precisely because it
compounds with, rather than replaces, everything in this chapter — a vectorized,
cache-aware, trivial-twiddle-exploiting routine stacks all four gains at once, which is
part of why a hand-tuned vendor library can outrun even a careful hand-written routine
that only reaches for some of them.

## Optimization Attribution: Crediting the Right Change

Stack trivial-twiddle skipping, branchless selection, loop unrolling, and a cache-aware
access order all into one routine, and a single before-and-after benchmark can no longer
tell you *which* change earned how much of the total improvement. **Optimization
attribution** is the practice of changing exactly one thing at a time and re-measuring
with the full Chapter 18 harness after each change, so that the final report can honestly
say "trivial-twiddle skipping accounted for roughly this much, loop unrolling for that
much" rather than crediting the whole gain to whichever change felt most clever.

#### Diagram: Optimization Attribution Waterfall

<iframe src="../../sims/optimization-attribution-waterfall/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Optimization Attribution Waterfall</summary>
Type: chart
**sim-id:** optimization-attribution-waterfall<br/>
**Library:** Chart.js<br/>
**Status:** Specified

Bloom Taxonomy: Evaluate (L5) — justify, assess
Learning objective: Assess how much of a total speedup each individual optimization contributed, by inspecting a waterfall chart built from one-change-at-a-time measurements.

Chart type: Waterfall (cumulative step) bar chart

Purpose: Show a baseline execution time and four sequential, individually-measured optimizations, each narrowing the gap toward a final time — illustrative values, explicitly labeled as such

X-axis categories, left to right:
- "Baseline (Chapter 23 assembly FFT)": 850 μs
- "+ Trivial twiddle skip": -60 μs step
- "+ Branchless butterfly select": -15 μs step
- "+ Loop unrolling ×2": -40 μs step
- "+ Cache-aware ordering": -25 μs step
- "Final": 710 μs

Y-axis: Execution time (μs)

Interactive elements:
- Hover any step bar to see the exact μs change and a one-line description of that specific change
- Toggle: "Show as percentage of baseline" vs "Show as raw μs" recomputes bar heights and labels
- Callout text: "Each step was measured by re-running the full harness with only that one change added — this is optimization attribution in practice."

Title: "Where the Speedup Actually Came From (illustrative)"
Legend: color-coded by whether a step decreased time (green) — all steps here do, but the chart type supports a red increase for a negative result

Implementation: Chart.js waterfall-style bar chart (floating bars with connector lines), data array with per-step deltas
</details>

??? question "After adding all four optimizations, total speedup is smaller than the sum of each optimization's individually-measured gain. Is your attribution benchmark broken? Click to check."
    Not necessarily — this is a preview of **sub-linear composition**, which Chapter 26
    covers in depth: combined optimizations frequently don't add up to their sum, because
    they can compete for the same resource (register pressure, instruction cache space)
    or overlap in what they're each trying to save. Attribution still did its job here —
    it told you honestly how much each *individual* change was worth; it never promised
    those numbers would add up perfectly once combined.

!!! mascot-celebration "You've squeezed real speed out of what you already knew"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Now *that's* a superpower — turning knowledge of this exact computation into free
    performance nobody else's general-purpose code can claim. Chapter 25 goes one level
    deeper still: hand-encoding a machine instruction the assembler itself refuses to
    write.
