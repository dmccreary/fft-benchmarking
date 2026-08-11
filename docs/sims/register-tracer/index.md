---
title: Register Tracer
description: Step a five-instruction ARM loop one instruction at a time and watch r0 and the zero flag change.
image: /sims/register-tracer/register-tracer.png
og:image: /sims/register-tracer/register-tracer.png
twitter:image: /sims/register-tracer/register-tracer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Register Tracer

<iframe src="main.html" height="442px" width="100%" scrolling="no"></iframe>

[Run the Register Tracer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/register-tracer/main.html"
        height="442px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

Reading assembly is a skill you build by tracing, not by studying. This is a loop
that counts down from 5, and the only way to understand it is to walk it one
instruction at a time with the state visible.

```
    MOV  r0, #5
loop_start:
    SUB  r0, r0, #1
    CMP  r0, #0
    BNE  loop_start
```

Press **Step** repeatedly. Watch r0 on the right, and watch the zero flag lamp.

## CMP and BNE Are One Mechanism

This is the thing to take away, and it is not obvious from the source.

`CMP r0, #0` looks like it asks a question. It does not. It performs the
subtraction `r0 - 0`, **throws the result away**, and keeps only the flags. When
the result was zero, the Z flag is set.

`BNE loop_start` does not compare anything. It reads the Z flag that CMP left
behind and branches if it is clear.

Neither instruction is a conditional on its own. The condition lives in the
**flag between them** — one instruction writes it, the next reads it. Every
conditional loop in every assembly language works this way, and once you see it
here you will recognize it everywhere.

## Why This Matters for FFT Code

The next chapters put butterflies in assembly. Those loops run thousands of
times, and every iteration pays for its CMP and its BNE.

Once you can trace a loop, you can start asking the optimizer's questions: does
the SUB already set the flags, making the CMP redundant? Can the loop count down
to zero so the comparison is free? Those savings are only visible to someone who
can see the flag hand-off — which is what this sim is training.

## How to Use

1. Press **Step** once. r0 becomes 5, and note the Z lamp does not change —
   `MOV` does not set flags.
2. Step past the label. Nothing executes; a label is just a name for an address.
3. Step through SUB, then CMP. Read the "Last action" panel each time.
4. Step the BNE. Z is clear, so it branches back — the arrow jumps up.
5. Keep stepping. After five iterations r0 reaches 0, the lamp lights, and BNE
   falls through instead of branching.
6. Press **Reset**, then **Run to completion** to watch the whole thing.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- A register holds a value
- Loops and conditional branches in a high-level language

### Learning Objective

Students will be able to **interpret** a short assembly loop by **tracing**
register contents and status flags one instruction at a time.

### Activities

1. **Full trace** (5 min): Students step the entire loop and record r0 and Z
   after every instruction.
2. **Count the iterations** (3 min): Students state how many times the body runs
   and confirm it against the source.
3. **Find the hand-off** (4 min): Students identify which instruction writes Z
   and which reads it, and explain why neither is conditional alone.

### Assessment

Ask: "If you deleted the `CMP r0, #0` line, what would `BNE` branch on, and would
the loop still terminate?"

## Related Resources

- [Chapter 21: Your First Assembly Function](../../chapters/21-your-first-assembly-function/index.md)
- [DWT Register Explorer](../dwt-register-explorer/index.md)

## References

1. [ARM Cortex-M instruction set](https://developer.arm.com/documentation/dui0553/latest/) — MOV, SUB, CMP, and the branch conditions.
2. [Status register](https://en.wikipedia.org/wiki/Status_register) — the flags mechanism this loop depends on.
