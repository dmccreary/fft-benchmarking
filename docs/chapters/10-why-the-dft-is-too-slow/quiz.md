# Quiz: Why the DFT Is Too Slow

Test your understanding of the DFT's quadratic complexity and why it falls far short of a real-time audio budget with these review questions.

---

#### 1. What does operation counting measure when analyzing an algorithm like the DFT?

<div class="upper-alpha" markdown>
1. The amount of memory an algorithm allocates during execution
2. The number of lines of source code required to implement the algorithm
3. The number of basic arithmetic operations an algorithm performs as a function of input size
4. The wall-clock time an algorithm takes on one specific processor
</div>

??? question "Show Answer"
    The correct answer is **C**. Operation counting tallies the multiplications and additions an algorithm performs as a function of input size, predicting how cost will scale before any code ever runs on real hardware. It deliberately ignores memory footprint (A), code length (B), and any one processor's raw speed (D), since those depend on implementation details rather than the algorithm itself.

    **Concept Tested:** Operation Counting

---

#### 2. How does algorithmic complexity differ from simply timing a program on one processor?

<div class="upper-alpha" markdown>
1. It describes how resource use grows with input size, independent of any specific processor's speed
2. It measures only the number of lines of code in an implementation
3. It is only meaningful once a program has been compiled to machine code
4. It reports the exact number of seconds a program takes on a reference chip
</div>

??? question "Show Answer"
    The correct answer is **A**. Algorithmic complexity describes how an algorithm's resource use grows as input size grows, independent of the speed of any particular processor it happens to run on. This is why the same O(N²) label applies to the DFT whether it runs on a Pico 2 or a desktop workstation. Options B, C, and D confuse complexity with implementation-specific measurements like code size or wall-clock timing on one chip.

    **Concept Tested:** Algorithmic Complexity

---

#### 3. A direct DFT implementation is described as having quadratic complexity. What does this mean in practice?

<div class="upper-alpha" markdown>
1. The operation count grows linearly with N, so doubling N doubles the work
2. The operation count is fixed regardless of how large N becomes
3. The operation count grows with the cube of N, tripling for every doubling
4. The operation count grows with the square of N, so doubling N roughly quadruples the work
</div>

??? question "Show Answer"
    The correct answer is **D**. Quadratic complexity, written O(N²), means the operation count grows with the square of the input size. The chapter's scaling table shows this directly: every time N doubles (64 to 128, 128 to 256, and so on), the operation count grows by a factor of four, not two. This is what makes quadratic algorithms deceptively cheap at small N and expensive at realistic sizes.

    **Concept Tested:** Quadratic Complexity

---

#### 4. Why is the DFT's complexity specifically O(N²) rather than some other growth rate?

<div class="upper-alpha" markdown>
1. Because the DFT recursively splits the input in half at every stage
2. Because computing each of the N output bins requires a full N-term sum, giving N bins times N operations each
3. Because the DFT requires N separate sub-calls, each needing log N operations
4. Because each output bin only needs to look at its two nearest neighboring samples
</div>

??? question "Show Answer"
    The correct answer is **B**. The DFT's nested loop computes N output bins, and producing each single bin requires summing across all N input samples — N bins times N operations per bin gives N × N = N² total operations. Options A and C describe the FFT's recursive, logarithmic structure, not the direct DFT, and option D misrepresents how a DFT bin is actually computed.

    **Concept Tested:** DFT Complexity

---

#### 5. Using the scaling table from this chapter, if a 256-sample DFT requires 65,536 operations, approximately how many operations will a 1,024-sample DFT require?

<div class="upper-alpha" markdown>
1. ~131,072
2. ~1,048,576
3. ~262,144
4. ~4,194,304
</div>

??? question "Show Answer"
    The correct answer is **B**. Going from N=256 to N=1,024 means N doubles twice (256→512→512→1024... i.e., two doublings), and quadratic scaling behavior means each doubling roughly quadruples the operation count: 4× followed by another 4× is 16×. Multiplying 65,536 by 16 gives 1,048,576, exactly matching the chapter's table entry for N=1,024. Option C is the value for N=512, a common off-by-one-doubling mistake.

    **Concept Tested:** Scaling Behavior

---

#### 6. A 512-sample audio block must be fully processed before the next block arrives. Based on the chapter's stated real-time budget, approximately how much time is available for the DFT stage before the pipeline falls permanently behind?

<div class="upper-alpha" markdown>
1. 530 milliseconds
2. 21,000 milliseconds
3. 4 milliseconds
4. 40 milliseconds
</div>

??? question "Show Answer"
    The correct answer is **D**. The chapter establishes a 40-millisecond real-time budget for a 512-sample block: if computing the spectrum takes longer than that, the pipeline falls behind the incoming stream. Option A confuses the budget with the 530× overage factor, and option B is the measured actual DFT time, not the available budget.

    **Concept Tested:** Real Time Budget

---

#### 7. In the course's audio pipeline, why is the DFT specifically identified as the performance bottleneck rather than capture or DC-offset removal?

<div class="upper-alpha" markdown>
1. Because the DFT consumes the overwhelming majority of total pipeline time, so improving other stages produces little overall speedup
2. Because the DFT is the first stage to run in the pipeline
3. Because capture and DC-offset removal take longer than the DFT on this hardware
4. Because the DFT is the only stage that can be measured with a stopwatch
</div>

??? question "Show Answer"
    The correct answer is **A**. A performance bottleneck is the stage that consumes the largest share of total execution time, such that optimizing anything else yields little benefit until the bottleneck itself is addressed. Capturing samples and removing DC offset take a small, roughly constant amount of time regardless of what follows, while the DFT alone accounts for the pipeline's 530× overage — making it, overwhelmingly, the bottleneck.

    **Concept Tested:** Performance Bottleneck

---

#### 8. A student argues that because an 8-point DFT only required 64 operations by hand, quadratic complexity "isn't really a problem." What is the flaw in this reasoning?

<div class="upper-alpha" markdown>
1. Quadratic complexity only applies to FFT algorithms, not the DFT
2. Small N always requires more operations than large N
3. Quadratic growth is easy to underestimate at small N; the cost compounds dramatically once N grows to sizes real audio actually requires
4. Operation counting is inaccurate for input sizes smaller than 512
</div>

??? question "Show Answer"
    The correct answer is **C**. The chapter warns explicitly that quadratic complexity "looks fine at first" — small N, like an 8-point DFT's 64 operations, hides the problem completely. The growth pattern only becomes visible once N reaches sizes realistic audio processing actually needs, at which point the N² cost compounds far faster than intuition from small examples would suggest.

    **Concept Tested:** Quadratic Complexity

---

#### 9. A direct DFT is applied to a 128-sample signal. Using operation counting, approximately how many multiply-and-add operations does this require?

<div class="upper-alpha" markdown>
1. 128
2. 8,192
3. 16,384
4. 32,768
</div>

??? question "Show Answer"
    The correct answer is **C**. Operation counting gives N² total operations for a size-N DFT: 128 bins, each requiring a 128-term sum, is 128 × 128 = 16,384 operations — the exact value shown in the chapter's scaling table for N=128. Option A reflects a linear (not quadratic) misconception, and options B and D are plausible-looking but incorrect powers of two.

    **Concept Tested:** Operation Counting

---

#### 10. Given that the DFT alone accounts for the pipeline being 530× over its real-time budget, what does this imply about the value of optimizing the display-drawing code first?

<div class="upper-alpha" markdown>
1. Optimizing display code would fully close the real-time gap, since display and DFT time are roughly equal
2. Optimizing display code would produce little overall speedup, since the DFT is overwhelmingly the bottleneck
3. Optimizing display code is unnecessary because the DFT already meets the real-time budget
4. Optimizing display code would make the real-time gap worse
</div>

??? question "Show Answer"
    The correct answer is **B**. Because the DFT alone accounts for the pipeline's entire 530× overage, it is the performance bottleneck by a wide margin. Optimizing any other stage — including display code — would produce only a marginal improvement in total pipeline time, since the bottleneck itself would remain untouched. This is exactly why the chapter frames the DFT's slowness as the agenda for the rest of the course.

    **Concept Tested:** Performance Bottleneck

