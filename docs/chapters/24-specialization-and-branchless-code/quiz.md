# Quiz: Specialization and Branchless Code

Test your understanding of trivial-twiddle shortcuts, branch prediction, loop unrolling, cache effects, and honest optimization attribution with these review questions.

---

#### 1. What defines a trivial twiddle factor?

<div class="upper-alpha" markdown>
1. Any twiddle factor whose magnitude is less than 1
2. A twiddle factor equal to exactly 1, -1, i, or -i, for which the general complex multiplication can be replaced by a much simpler operation
3. The twiddle factor used in the very last stage of every FFT
4. Any twiddle factor computed using `math.sin` instead of `math.cos`
</div>

??? question "Show Answer"
    The correct answer is **B**. A trivial twiddle is exactly one of the four special values 1, -1, i, or -i; multiplying by one of these requires no real arithmetic, only a sign flip or a register swap. Recognizing this is an instance of special case optimization, and it applies specifically to the floating point FFT from Chapter 23 — the multiply-by-one shortcut and the multiply-by-i shortcut are the two concrete forms this chapter builds.

    **Concept Tested:** Trivial Twiddle

---

#### 2. What is an unpredictable branch, in the context of the Cortex-M33's branch prediction hardware?

<div class="upper-alpha" markdown>
1. Any branch instruction that appears inside a hot loop, regardless of its outcome pattern
2. A branch instruction that the assembler refuses to encode
3. A branch whose target label has not yet been defined at assembly time
4. A conditional branch whose outcome varies in a way the predictor cannot learn, causing a real cycle penalty (a misprediction stall) whenever the guess is wrong
</div>

??? question "Show Answer"
    The correct answer is **D**. Branch prediction lets the CPU guess a branch's outcome and speculatively execute down that path before the branch resolves; a predictable branch, like a loop-closing `BGT` taken every iteration but the last, predicts almost perfectly. An unpredictable branch is one whose outcome the predictor cannot learn, so every wrong guess forces the pipeline to discard speculative work and restart, a real and avoidable cost.

    **Concept Tested:** Unpredictable Branch

---

#### 3. Why does multiplying a complex number by i require no multiplication instruction at all?

<div class="upper-alpha" markdown>
1. Because i always equals exactly 1 in this course's twiddle-factor tables
2. Because the FPU has a dedicated `VMULI` instruction that performs the multiplication in zero cycles
3. Because multiplying by i swaps the real and imaginary parts and negates one of them, which can be done with a register swap and a sign flip instead of arithmetic
4. Because MicroPython's viper emitter automatically detects and removes multiplications by i
</div>

??? question "Show Answer"
    The correct answer is **C**. Multiplying \(z = a + bi\) by \(i\) gives \(-b + ai\): the real and imaginary parts swap places, and the new real part is negated. No multiply-accumulate instruction is needed, only a register swap and a sign flip — a cheaper path than the general complex multiplication a non-trivial twiddle factor requires. No such `VMULI` instruction exists, and this is a hand-applied optimization, not something viper does automatically.

    **Concept Tested:** Multiply By i

---

#### 4. What tradeoff does loop unrolling introduce when applied to the FFT's hot loop?

<div class="upper-alpha" markdown>
1. It reduces loop overhead per butterfly by processing several butterflies per iteration, at the cost of larger code size that can strain limited flash and instruction cache
2. It eliminates all branch instructions from the routine entirely, with no cost of any kind
3. It reduces code size by combining multiple butterflies into a single instruction
4. It converts the floating-point FFT into a fixed-point FFT to save registers
</div>

??? question "Show Answer"
    The correct answer is **A**. Loop unrolling amortizes the fixed cost of loop overhead — the `ADD`, `SUB`, `CMP`, and `BGT` bookkeeping — across more real work per iteration by manually duplicating the loop body. This is a direct code size tradeoff: duplicated instructions mean more flash usage, and unrolling too aggressively can overflow the instruction cache, the same cache-capacity concern Chapter 19 raised about aggressive compiler optimization flags.

    **Concept Tested:** Loop Unrolling

---

#### 5. A team builds a precomputed swap list identifying which butterfly positions have trivial twiddle factors, then splits the hot loop into two separate loops — one for trivial positions, one for the rest — with no runtime check in either loop. What does this design choice specifically avoid?

<div class="upper-alpha" markdown>
1. It avoids computing the twiddle-factor table in Python at all
2. It avoids introducing an unpredictable branch inside the hot loop, since the trivial/non-trivial classification already happened once in Python before either loop starts
3. It avoids the address computation cost of pointer arithmetic entirely
4. It avoids needing a bit-reversal permutation step before the FFT begins
</div>

??? question "Show Answer"
    The correct answer is **B**. Checking "is this twiddle trivial?" at runtime, inside the hot loop, would itself be a branch whose outcome could be scattered unpredictably through the butterfly sequence — exactly an unpredictable branch. A precomputed swap list moves that classification out of the hot loop entirely, computed once in Python during table setup, so neither resulting loop contains any conditional branch checking triviality.

    **Concept Tested:** Precomputed Swap List

---

#### 6. Chapter 11's bit-reversal permutation reorders array elements by jumping to bit-reversed indices rather than marching through memory sequentially. Applying this chapter's memory access pattern reasoning, what performance effect does this have?

<div class="upper-alpha" markdown>
1. It reduces the total instruction count, since bit-reversed indices require fewer address computations
2. It has no performance effect, since cache effects only apply to floating-point instructions, not integer indexing
3. It can cost real cycles from cache effects, because scrambled, unpredictable access defeats the cache's ability to serve several nearby accesses from one fetched block, independent of the algorithm's instruction count
4. It automatically triggers loop unrolling to compensate for the scrambled access order
</div>

??? question "Show Answer"
    The correct answer is **C**. Cache effects are performance differences that come purely from memory access patterns, with no change to instruction count at all. Sequential access lets the cache fetch a nearby block once and serve several subsequent accesses from it; bit-reversed access jumps around unpredictably and defeats that advantage, potentially costing real cycles that have nothing to do with the arithmetic being performed — a source of speed difference entirely independent of the branch and multiply optimizations earlier in the chapter.

    **Concept Tested:** Cache Effects

---

#### 7. Given the conditionally executed instructions `CMP r0, r1` / `MOVGE r2, r0` / `MOVLT r2, r1`, what do `MOVGE` and `MOVLT` accomplish that a `CMP`-then-`BGE`-then-`MOV` sequence does not?

<div class="upper-alpha" markdown>
1. They compute the result using only floating-point registers instead of general-purpose ones
2. They remove the need for the initial `CMP` instruction entirely
3. They unroll the comparison across four iterations at once
4. They select the larger value without any separate branch instruction, so there is no guess for the branch predictor to get wrong
</div>

??? question "Show Answer"
    The correct answer is **D**. `MOVGE` and `MOVLT` are conditionally executed instructions: the CPU fetches and decodes both, but only commits the one whose condition matches, with no separate branch instruction and therefore nothing for the predictor to guess about. This is branchless code — a narrower technique than the precomputed swap list, which removes the decision from the loop's control flow entirely rather than making a single instruction conditional.

    **Concept Tested:** Branchless Code

---

#### 8. An unrolled loop computes several butterflies' worth of addresses using fixed offsets like `[r0]`, `[r0, #4]`, `[r0, #8]` from one base pointer, instead of re-adding to the pointer before every single access. What does this specifically reduce?

<div class="upper-alpha" markdown>
1. The address computation cost paid on each access, since fewer separate `ADD` instructions are needed to compute each element's address
2. The number of floating-point registers needed per butterfly
3. The size of the twiddle-factor table needed for the transform
4. The likelihood of a cache miss during bit-reversal permutation
</div>

??? question "Show Answer"
    The correct answer is **A**. Address computation cost is the processing time spent on pointer arithmetic before a load-store instruction can actually access data. Using fixed offsets from one base pointer computes several element addresses without re-adding to the pointer before every access, trimming a real, if small, per-butterfly cost — separate from the register-count and twiddle-table concerns in the other options.

    **Concept Tested:** Address Computation Cost

---

#### 9. A team applies trivial-twiddle skipping, branchless selection, loop unrolling, and cache-aware ordering all in the same commit, then runs one before-and-after benchmark. What critical piece of information does this single measurement fail to provide?

<div class="upper-alpha" markdown>
1. The total execution time of the optimized routine
2. Whether the optimized routine still produces a bit-for-bit match against the Python reference
3. How much each individual optimization contributed to the total improvement, since changing several things at once conflates their separate effects into one combined number
4. Whether the routine still fits within the Pico 2's available flash memory
</div>

??? question "Show Answer"
    The correct answer is **C**. Optimization attribution requires changing exactly one thing at a time and re-measuring after each change, so a report can honestly credit each technique separately. A single combined before-and-after number cannot separate how much came from trivial-twiddle skipping versus loop unrolling versus vectorization or any other change stacked into the same commit — it only reports the net effect, not the breakdown.

    **Concept Tested:** Optimization Attribution

---

#### 10. Two students each report their FFT optimization work. Student A changes four things at once and reports a single "went from 850 to 710 microseconds" result. Student B changes one thing at a time, re-measuring the full harness after each change, and reports a per-change breakdown that does not perfectly sum to the total combined speedup. Which report better satisfies this chapter's standard for honest, useful optimization reporting, and why?

<div class="upper-alpha" markdown>
1. Student A's report, because a single combined number is simpler and avoids confusing the reader with multiple measurements
2. Neither report is useful without also disclosing the exact clock speed of the board, which matters more than attribution
3. Student A's report is better because it reflects the real-world deployed performance more accurately than any single-change measurement could
4. Student B's report, because isolating and measuring each optimization's individual contribution is optimization attribution done correctly, even though combined gains are often sub-linear and do not need to sum exactly
</div>

??? question "Show Answer"
    The correct answer is **D**. Student B's approach is optimization attribution as this chapter defines it: change one thing, re-measure with the full harness, and report each technique's individual contribution honestly. That the per-change numbers do not sum exactly to the combined total is expected — optimizations often compose sub-linearly because they compete for the same resources, such as register pressure or instruction cache space. Student A's single combined number cannot tell anyone which change was actually worth doing.

    **Concept Tested:** Optimization Attribution

---
