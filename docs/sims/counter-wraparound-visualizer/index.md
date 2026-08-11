---
title: Counter Wraparound Visualizer
description: Compute elapsed cycles across a counter wraparound, and see exactly why naive subtraction fails and masking works.
image: /sims/counter-wraparound-visualizer/counter-wraparound-visualizer.png
og:image: /sims/counter-wraparound-visualizer/counter-wraparound-visualizer.png
twitter:image: /sims/counter-wraparound-visualizer/counter-wraparound-visualizer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Apply
---

# Counter Wraparound Visualizer

<iframe src="main.html" height="557px" width="100%" scrolling="no"></iframe>

[Run the Counter Wraparound Visualizer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/counter-wraparound-visualizer/main.html"
        height="557px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The Cortex-M cycle counter, CYCCNT, is 32 bits. At 150 MHz it fills and rolls
over to zero every 28.6 seconds. That is not a rare event — it is guaranteed to
happen during any benchmark you run for more than half a minute.

The counter is not a line from 0 to 4,294,967,295. It is a **circle**, and this
dial makes that literal. When your measurement straddles the top of the circle,
`end - start` is negative.

The sim uses a 10-bit demo counter (0 to 1023) so the wrap is visible, but the
arithmetic is identical.

## The Fix Is One Bitwise AND

```c
elapsed = (end - start) & 0xFFFFFFFF;
```

At the defaults — start 950, end 50 — naive subtraction gives **-900**, which is
not a duration. Masked subtraction gives **124**, which is correct: 74 counts to
reach the wrap, then 50 more.

## Why the Mask Works

This is the part worth understanding rather than memorizing.

The counter's range is a **power of two**. When it wraps, it does not lose
information — it discards exactly the bit that overflowed past bit 31. The
subtraction `end - start` produces a borrow out of the same position. Masking
with `0xFFFFFFFF` discards that borrow, which cancels the wrap precisely.

This is why the demo uses 1024 and `& 0x3FF` rather than some round decimal
number. If the counter counted 0 to 999 and reset, no bitmask would fix it and
you would need a modulo instead. The trick works because of binary, not because
of arithmetic in general.

In C with `uint32_t` variables the mask is implicit — unsigned subtraction
already wraps correctly. In Python, where integers are arbitrary precision, you
**must** write the mask explicitly or you will get the negative number.

## How to Use

1. At the defaults, compare the two panels. Confirm 1024 − 950 + 50 = 124 by hand.
2. Drag **End value** above the start, say to 990. No wrap occurs, and both
   panels now agree — the naive answer is right by luck.
3. Drag it back below the start. The naive panel goes red again.
4. Watch the green arc on the dial. It always shows the true elapsed span,
   clockwise from start to end, and its length always matches the masked result.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Binary representation and bitwise AND
- A hardware counter increments and rolls over

### Learning Objective

Students will be able to **apply** the masked-subtraction formula to compute
elapsed cycles across a wraparound, and **demonstrate** why naive subtraction
fails.

### Activities

1. **Hand-verify** (4 min): For three start/end pairs, students compute elapsed
   cycles by hand and check both panels.
2. **Find the safe case** (3 min): Students identify when naive subtraction
   happens to work and explain why relying on it is still wrong.
3. **Language check** (4 min): Students explain why C with `uint32_t` needs no
   explicit mask but Python does.

### Assessment

Ask: "Your benchmark reports an elapsed time of -12,000 cycles. What happened,
and what is the actual elapsed count if the counter is 32 bits?"

## Related Resources

- [Chapter 17: Measuring Time](../../chapters/17-measuring-time/index.md)
- [DWT Register Explorer](../dwt-register-explorer/index.md)

## References

1. [Data Watchpoint and Trace unit](https://developer.arm.com/documentation/ddi0439/b/Data-Watchpoint-and-Trace-Unit) — the CYCCNT register's definition.
2. [Modular arithmetic](https://en.wikipedia.org/wiki/Modular_arithmetic) — the general framework; masking is the power-of-two special case.
