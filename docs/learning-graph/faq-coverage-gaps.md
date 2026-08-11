# FAQ Coverage Gaps

Concepts from the [200-concept core learning graph](concept-dependencies.csv) not explicitly
named in [docs/faq.md](../faq.md), ranked by centrality (number of other concepts that depend on
each one). See [faq-quality-report.md](faq-quality-report.md) for full coverage statistics and a
note on why exact-phrase matching understates true thematic coverage.

## Critical Gaps (High Priority)

High-centrality concepts (3+ downstream dependents) without a dedicated FAQ entry:

1. **Performance Metrics** (BENCH, 7 dependents)
   Sub-concepts (execution time, throughput, speedup factor) are covered individually, but no
   question defines the umbrella term itself.
   Suggested question: "What performance metrics does this course use to compare FFT
   implementations?" (Core Concepts)

2. **Statistical Analysis** (BENCH, 6 dependents)
   Mean and standard deviation are covered under
   [What statistics should a trustworthy benchmark report?](../faq.md), but variance, confidence
   intervals, and outlier detection are not.
   Suggested question: "How do you detect and handle an outlier measurement in a set of benchmark
   trials?" (Best Practices)

3. **Compiler Optimization Levels** (OPT, 6 dependents)
   `-O2`/`-O3`/`-Os` flags are mentioned in passing but have no dedicated question.
   Suggested question: "What do compiler optimization flags like -O2 and -Os actually change?"
   (Technical Details)

4. **Fixed Point Numbers** (FXP, 5 dependents)
   Q15/Q31 are covered specifically, but the general fixed-point-versus-floating-point framing has
   no standalone entry.
   Suggested question: "What is fixed-point arithmetic, and how does it differ from floating
   point?" (Technical Details)

5. **Q Format Notation** (FXP, 5 dependents)
   Covered implicitly via the Q15/Q31 question but the general Q-format notation convention isn't
   named directly.
   Suggested question: "What does 'Q15' or 'Q31' notation actually mean?" (Technical Details)

6. **Input Signal Generation** (BENCH, 5 dependents)
   Test signal design (sine, chirp, white noise, impulse) used for benchmarking isn't covered.
   Suggested question: "What kinds of test signals are used to benchmark a spectrum analyzer, and
   why not just use real audio?" (Best Practices)

7. **Sine Wave Representation** (MATH, 3 dependents)
   The general sine wave equation is covered inside the time/frequency domain and Euler's formula
   answers but has no standalone entry.
   Suggested question: "What is the general equation for a sine wave, and what does each term
   mean?" (Core Concepts)

8. **DSP Extension Instructions** (ARM, 3 dependents)
   VMLA and other specific instructions are covered; the general ARM DSP extension category is
   not named.
   Suggested question: "What are ARM's DSP extension instructions, and which Cortex-M cores
   support them?" (Technical Details)

9. **Memory Alignment** (MEM, 3 dependents)
   Not currently covered; relevant to the assembly and typed-array chapters.
   Suggested question: "Why does memory alignment matter when working with typed arrays in
   assembly?" (Technical Details)

10. **Data Layout** (MEM, 3 dependents)
    Not currently covered.
    Suggested question: "How does data layout in memory affect FFT performance?" (Advanced
    Topics)

11. **Test Case Design** (BENCH, 3 dependents)
    Related to validation (covered) but the general practice of designing a good test case isn't
    a standalone question.
    Suggested question: "What makes a good test case for validating a DFT or FFT implementation?"
    (Best Practices)

12. **Linking Libraries** (LIB, 3 dependents)
    Static vs. dynamic linking, header files, and library dependencies are not covered — this
    course leans on licensing and library choice more than the mechanics of linking.
    Suggested question: "What's the difference between static and dynamic linking when
    integrating a C library like CMSIS-DSP?" (Advanced Topics)

## Medium Priority Gaps

Moderate-centrality concepts (1–2 downstream dependents) without dedicated FAQ coverage — 40
concepts. Grouped by taxonomy category:

**Mathematical foundations (MATH):** Continuous Fourier Transform, Convolution Theorem, Symmetry
Properties

**FFT algorithms (FFT):** Radix-4 FFT *(discussed but not as an exact phrase — see quality
report)*, Computational Complexity, Zero Padding

**Signal processing (SIG):** Analog To Digital Conversion, Overlap Add Method, Spectrum Analysis

**ARM architecture (ARM):** Pipeline Architecture, Instruction Pipeline, Interrupt Handling,
Memory Mapped IO, Clock Configuration, Direct Memory Access

**Memory (MEM):** Stack Memory, Heap Memory, Buffer Management, Cache Hit Rate, Memory Bandwidth,
Dynamic Memory Allocation, Double Buffering

**Fixed-point (FXP):** Integer Representation, Fixed Point Multiplication, Overflow Detection,
Rounding Modes, Truncation Error, Precision Analysis

**Benchmarking (BENCH):** Code Profiling, System Timer, High Resolution Timer, Profiling Tools,
Function Profiling, Chirp Signal, Baseline Measurement, Comparative Analysis, Benchmark Automation

**Libraries (LIB):** Library API Design, Library Integration, GitHub Repositories

## Low Priority Gaps

Leaf concepts with zero downstream dependents in the planning DAG — 100 concepts, distributed
across taxonomy categories as follows: ARM (17), Memory (14), Benchmarking (14), Libraries (14),
FFT (10), Signal Processing (9), Fixed-Point (9), Math (7), Optimization (6). These are mostly
fine-grained implementation details (specific register names, specific library functions,
specific window-function variants like the Kaiser window) that the [glossary](../glossary.md)
already defines individually and that a curated FAQ isn't expected to enumerate one by one.

## Recommendations

1. Add questions for the 12 critical gaps above — each is a genuinely distinct concept not
   addressed elsewhere in the FAQ, not just a phrasing mismatch. This would raise 200-concept DAG
   coverage from 24.0% to roughly 30% and close every remaining gap in the top-25-by-centrality
   list.
2. The 40 medium-priority gaps are reasonable candidates for a second-wave FAQ expansion if this
   document is revisited after the Instructor's Guide and any additional lab content stabilize,
   but are not urgent — most are already implicitly touched on through the concepts that depend on
   them.
3. The 100 low-priority leaf concepts can be addressed in future updates only if student questions
   actually arise about them in practice; they are better served by the glossary's existing
   per-term definitions than by dedicated FAQ entries.
