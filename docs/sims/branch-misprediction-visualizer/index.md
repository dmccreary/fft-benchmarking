---
title: Branch Misprediction Visualizer
description: Step two pipelines through the same ten branches and watch only the unpredictable one throw away cycles.
image: /sims/branch-misprediction-visualizer/branch-misprediction-visualizer.png
og:image: /sims/branch-misprediction-visualizer/branch-misprediction-visualizer.png
twitter:image: /sims/branch-misprediction-visualizer/branch-misprediction-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Branch Misprediction Visualizer

<iframe src="main.html" height="491px" width="100%" scrolling="no"></iframe>

[Run the Branch Misprediction Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/branch-misprediction-visualizer/main.html"
        height="491px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

"Branches are slow" is one of those pieces of folklore that is wrong in a way
that matters. Branches are not slow. *Unpredictable* branches are slow, and the
difference is large enough to change how you write a loop.

Both lanes here run on the same processor, execute the same instructions, and
resolve the same number of branches. The top lane is the `BNE` at the bottom of
a counted loop: taken, taken, taken, ... and not taken exactly once, when the
loop finishes. The bottom lane is a data-dependent test — "skip the multiply
when this twiddle factor is trivial" — and because trivial twiddles are
scattered through the table, its outcomes carry no pattern at all.

The processor guesses each branch before it knows the answer, using the simplest
possible rule: assume this branch does what it did last time. Fetch and Decode
are filled from the guessed path while Execute is still working out the truth.
When the guess is right, the pipeline never hiccups. When the guess is wrong,
the two speculative stages are discarded and refilled — two cycles bought and
thrown away.

Run all ten and compare the totals. The predictable lane wastes two cycles: one
mispredict, on the loop's final exit. That cost is fixed no matter how many
iterations the loop runs, so it rounds to nothing. The unpredictable lane
mispredicts five times out of ten and keeps doing so forever. Scaled to the
2,304 butterflies of a 512-point FFT, that is roughly 2,300 cycles per transform
spent on guesses that were wrong.

This is the number behind branchless code. The trivial-twiddle test is not
removed because the comparison is expensive — a `CMP` is one cycle. It is
removed because the branch that follows the comparison cannot be predicted.

## How to Use

1. Press **Step** to resolve one branch in both lanes at once. Read the status
   line under each pipeline: what the predictor guessed, what actually happened,
   and what it cost.
2. Watch the outcome strip fill in. A ✓ means the predictor guessed right for
   that branch; a ✗ means it did not. Notice the top lane collects ✓ after ✓
   while the bottom lane alternates.
3. Press **Run all 10** to let both lanes finish, then compare the two
   wasted-cycle totals in the lane headers.
4. Press **Reset** and step through again, this time predicting each branch
   yourself before pressing Step. You will find the top lane easy and the bottom
   lane impossible — which is exactly the processor's problem.

## Lesson Plan

**Grade Level:** Undergraduate

**Duration:** 10-12 minutes

**Prerequisites:**

- A pipeline overlaps fetch, decode, and execute for consecutive instructions
- A conditional branch's direction is not known until it executes
- Loops end with a conditional branch

**Learning Objective:** Explain why a predictable branch costs nearly nothing
while an unpredictable branch repeatedly stalls the pipeline, by stepping
through both cases with visible pipeline state.

**Activities:**

1. **Predict by hand (3 min).** Before pressing anything, have students write
   down their guess for each of the ten outcomes in each lane, using the same
   rule the hardware uses: "same as last time". Then step through and score
   themselves. Their score will match the simulation's.
2. **Separate the two costs (3 min).** Ask: how many cycles does the *comparison*
   cost, and how many does the *wrong guess* cost? Establish that the branch
   instruction itself is cheap and the flush is what hurts.
3. **Scale it up (3 min).** The counted loop mispredicts once regardless of trip
   count. Ask what the cost per iteration is for 10, 1,000, and 1,000,000
   iterations. Then ask the same question for the data-dependent branch.
4. **Motivate the fix (3 min).** Ask how you would get rid of the cost. Students
   should arrive at either removing the test entirely (do the multiply anyway) or
   replacing it with a conditional-execution instruction that has no branch to
   mispredict.

**Assessment:** A student replaces a data-dependent `if` inside a hot loop with
an unconditional multiply, doing work that is sometimes unnecessary, and the
loop gets faster. Explain how doing more arithmetic can take less time.

## Related Resources

- [FFT Stage Architecture](../fft-stage-architecture/index.md) — where the 2,304-butterfly count comes from
- [Register Tracer](../register-tracer/index.md) — how `CMP` and `BNE` cooperate through the Z flag
- [Optimization Attribution Waterfall](../optimization-attribution-waterfall/index.md) — what removing this branch is actually worth

## References

- [ARM Cortex-M33 Devices Generic User Guide](https://developer.arm.com/documentation/100235/latest/) — pipeline structure and branch timing
- [ARMv8-M Architecture Reference Manual](https://developer.arm.com/documentation/ddi0553/latest/) — conditional execution as a branch alternative
