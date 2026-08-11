---
title: Abstraction Ladder Diagram
description: Five ways to write the same FFT, ranked by speed — and what each rung down takes away from you.
image: /sims/abstraction-ladder-diagram/abstraction-ladder-diagram.png
og:image: /sims/abstraction-ladder-diagram/abstraction-ladder-diagram.png
twitter:image: /sims/abstraction-ladder-diagram/abstraction-ladder-diagram.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Analyze
---

# Abstraction Ladder Diagram

<iframe src="main.html" height="472px" width="100%" scrolling="no"></iframe>

[Run the Abstraction Ladder Diagram MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/abstraction-ladder-diagram/main.html"
        height="472px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The same FFT can be written five ways on this board, and they are not five
unrelated options — they are a **ladder**. Each rung down runs faster than the one
above it, and each one takes something away.

| Rung | Relative time | What runs it |
|------|--------------|--------------|
| MicroPython (bytecode) | ×1.00 | An interpreter loop |
| MicroPython `@native` | ×0.62 | Machine code, calling the runtime |
| MicroPython `@viper` | ×0.28 | Machine code with your type annotations |
| C | ×0.11 | An optimizing compiler |
| Assembly | ×0.07 | You |

The bar lengths are **illustrative, not measured** — the labeling says so on the
canvas. The point is the shape of the progression, not the exact ratios.

## Read the Right-Hand Column

Speed is the easy half. Click each rung and read **What you give up**, because
that is the column that actually decides which rung you should be on.

- **`@native`** costs you code size and bytecode inspectability. The value model
  is unchanged, so the win is bounded — this is the cheapest rung to try.
- **`@viper`** is where the character of the change shifts. Values become unboxed
  machine types *you declare*. A wrong annotation is no longer a `TypeError` —
  it is a wrong answer or a crash.
- **C** costs you the Python runtime entirely. No garbage collection, no dynamic
  typing, no REPL. Edit-and-run becomes build-and-flash.
- **Assembly** costs you the compiler. Every register allocation and instruction
  scheduling decision becomes yours, including the ones you did not know were
  being made for you.

## The Biggest Step Is Not the Fastest One

Look at where the bar shrinks most: bytecode → `@native` → `@viper` is a 3.5×
improvement, and it happens *without leaving Python*.

Going all the way to assembly buys another 4× on top — real, but it costs you the
entire toolchain and every safety property you had. Most projects should climb to
`@viper` and stop, and the ones that go further should know exactly why.

## How to Use

1. Click each rung top to bottom and read all three fields.
2. Note where the *value representation* changes. That boundary — boxed to
   unboxed — is the single biggest source of the speedup, and the next MicroSim
   is about it.
3. Compare the give-up column for `@viper` against C. Which loss would matter
   more to your project?
4. Decide: for a 512-point FFT that currently misses a 40 ms deadline by 2×,
   which rung would you climb to?

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10 minutes

### Prerequisites

- MicroPython runs on the board
- Compiled versus interpreted execution

### Learning Objective

Students will be able to **organize** the five approaches into a ranked ladder
and **differentiate** what each rung gives up in exchange for speed.

### Activities

1. **Build the table** (4 min): Students click through all five and tabulate
   runner, value representation, and cost.
2. **Find the boundary** (3 min): Students identify which rung first changes the
   value representation and explain why that matters most.
3. **Choose a rung** (3 min): Given a stated deadline miss, students pick a rung
   and defend the tradeoff.

### Assessment

Ask: "Your FFT is 2× too slow and the project must stay maintainable by Python
programmers. Which rung do you climb to, and what one thing must you now be
careful about?"

## Related Resources

- [Chapter 19: The Abstraction Ladder](../../chapters/19-the-abstraction-ladder/index.md)
- [Boxed vs Unboxed Memory Explorer](../boxed-unboxed-memory-explorer/index.md)

## References

1. [MicroPython native and viper emitters](https://docs.micropython.org/en/latest/reference/speed_python.html) — the official description of `@native` and `@viper`.
2. [Abstraction (computer science)](https://en.wikipedia.org/wiki/Abstraction_(computer_science)) — the general tradeoff this ladder instantiates.
