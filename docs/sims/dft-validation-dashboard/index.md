---
title: DFT Validation Dashboard
description: Judge a DFT implementation against a numerical tolerance across a swept range of test frequencies, and decide what the failures actually mean.
image: /sims/dft-validation-dashboard/dft-validation-dashboard.png
og:image: /sims/dft-validation-dashboard/dft-validation-dashboard.png
twitter:image: /sims/dft-validation-dashboard/dft-validation-dashboard.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Evaluate
---

# DFT Validation Dashboard

<iframe src="main.html" height="597px" width="100%" scrolling="no"></iframe>

[Run the DFT Validation Dashboard MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/dft-validation-dashboard/main.html"
        height="597px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Before you benchmark an FFT you have to know it is **correct**. The usual method
is to feed it a signal whose answer you already know and check that the answer
comes back.

This dashboard does exactly that, and then asks you to make a judgment call.

For each test frequency it synthesizes a tone, runs a plain O(N²) DFT, finds the
peak bin, and compares that against the bin the frequency should land in. The
relative error is scored against your chosen tolerance and reported PASS or FAIL.

Press **Run full frequency sweep**. At the default 0.1% tolerance, eight of the
eleven cases pass and three fail.

## The Judgment You Have To Make

Look at which cases fail: 375 Hz, 625 Hz, and 1125 Hz. Now look at the bin
spacing: 250 Hz. Every failing frequency falls **between** two bin centers.

So is the implementation broken?

No. The DFT is doing precisely what it should. The problem is with the **test**:
it measures the peak bin's center frequency against the true frequency, and a
tone at 375 Hz genuinely has no bin of its own. It splits energy between bins 1
and 2, and whichever wins is off by 125 Hz. That is a resolution limit, not a
defect.

This distinction matters. A validation suite that reports FAIL for correct
behavior will get ignored, and then it will not catch the real bug when one
appears. Deciding which failures are meaningful is the skill this sim is
practicing.

## What Would a Real Bug Look Like?

A genuine implementation bug produces failures that do **not** correlate with bin
alignment — a wrong sign convention flips the imaginary part everywhere, an
off-by-one in the twiddle index shifts every peak, a missing normalization scales
every magnitude. Those show up as failures across the board, including at
frequencies sitting exactly on a bin.

Uniform failure at on-bin frequencies is the signature to worry about.

## How to Use

1. Run the sweep at the default tolerance and note which cases fail.
2. Raise **Tolerance** until everything passes. What tolerance was required, and
   would you be comfortable shipping that number?
3. Step the **Test frequency** slider to 375 Hz and look at the spectrum. The
   energy is split across two bins and the dashed expected-bin marker does not
   sit on the tallest bar.
4. Compare against 500 Hz, which is exactly on a bin: one clean bar, error zero.
5. Decide: would you change the tolerance, change the test frequencies, or change
   the pass criterion? Defend your answer.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

15 minutes

### Prerequisites

- DFT bin width and bin centers
- Relative error as a percentage

### Learning Objective

Students will be able to **judge** whether a DFT implementation passes validation
by comparing a computed peak against an expected peak within a chosen tolerance,
and **validate** their reasoning about what the failures indicate.

### Activities

1. **Run and read** (4 min): Students run the sweep and list which cases fail.
2. **Diagnose** (6 min): Students look for a pattern in the failures and decide
   whether the implementation or the test is at fault.
3. **Propose a fix** (5 min): Students propose a change — to the tolerance, the
   test frequencies, or the pass criterion — and justify why theirs would catch
   real bugs while not flagging correct behavior.

### Assessment

Ask: "Your validation suite reports FAIL at every test frequency, including ones
exactly on bin centers, with a consistent 2× magnitude error. Is this a
resolution limit or a bug? What would you check first?"

## Related Resources

- [Chapter 9: Computing and Validating the DFT](../../chapters/09-computing-and-validating-the-dft/index.md)

## References

1. [Discrete Fourier transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform) — the transform under test.
2. [Scalloping loss](https://en.wikipedia.org/wiki/Window_function#Scalloping_loss) — the between-bins effect causing the failures here.
3. [Software testing tolerance](https://en.wikipedia.org/wiki/Unit_testing) — why a test that cries wolf gets ignored.
