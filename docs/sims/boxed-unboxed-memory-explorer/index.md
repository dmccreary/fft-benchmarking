---
title: Boxed vs Unboxed Memory Explorer
description: Step the same a + b through boxed and unboxed memory layouts and count the memory operations each one costs.
image: /sims/boxed-unboxed-memory-explorer/boxed-unboxed-memory-explorer.png
og:image: /sims/boxed-unboxed-memory-explorer/boxed-unboxed-memory-explorer.png
twitter:image: /sims/boxed-unboxed-memory-explorer/boxed-unboxed-memory-explorer.png
social:
   cards: false
status: implemented
library: p5.js
bloom_level: Understand
---

# Boxed vs Unboxed Memory Explorer

<iframe src="main.html" height="502px" width="100%" scrolling="no"></iframe>

[Run the Boxed vs Unboxed Memory Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }

You can include this MicroSim on your website using the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/fft-benchmarking/sims/boxed-unboxed-memory-explorer/main.html"
        height="502px" width="100%" scrolling="no"></iframe>
```

## About This MicroSim

The previous MicroSim showed that `@viper` is roughly 3.5× faster than plain
MicroPython, and that the thing which changes at that rung is the **value
representation**. This is that change, drawn out.

Both panels compute the same thing: `a + b`, where `a` and `b` are floats. Press
**Step forward** and watch the two paths diverge.

## Seven Operations Versus One

In the boxed world, a float is not a float. It is a **pointer to a heap object**
containing a type tag, a reference count, and — eventually — the actual value.

| Step | Boxed | Unboxed |
|------|-------|---------|
| Follow the pointers | 2 ops | 0 |
| Check the types | 2 ops | 0 |
| Extract the values | 2 ops | 0 |
| Add and store | 1 op + allocation | 1 op |
| **Total** | **7** | **1** |

The counts are illustrative rather than a precise cycle count, but the ratio is
the point and it is not exaggerated.

## The Allocation Is the Worst Part

Notice what happens at the final step in the boxed path: adding two numbers
**allocates memory**. The result needs a new heap object, because a boxed value
cannot exist anywhere else.

Inside an FFT inner loop running thousands of butterflies, that is thousands of
allocations. Each one is slow on its own, and collectively they eventually
trigger **garbage collection** — which pauses your program at a moment you do not
control. For a real-time deadline, an unpredictable pause is worse than a
predictable cost.

That is why an unboxed inner loop is not merely faster on average. It is faster
*and* it does not have a tail.

## What Unboxing Costs You

The unboxed slot holds `3F800000` — four raw bytes. There is no type tag, so
nothing checks that those bytes are a float. If you annotated the variable wrong,
the ADD happily operates on nonsense and returns nonsense.

The type check you removed was doing something. Removing it is the trade.

## How to Use

1. Press **Step forward** four times and watch the tallies diverge.
2. At each step, read which fields lit up in the boxed diagram and note that
   nothing lit up in the unboxed one.
3. Reach the final step. Note that the boxed path allocates and the unboxed path
   does not.
4. Ask: in a loop running 2,304 butterflies, how many allocations does the boxed
   version make?
5. Uncheck **Show operation tally** and re-read the diagrams. The structural
   difference is visible even without the counter.

## Lesson Plan

### Grade Level

Undergraduate (college junior/senior)

### Duration

10-12 minutes

### Prerequisites

- Pointers and heap allocation
- Variables occupy memory

### Learning Objective

Students will be able to **explain** why arithmetic on a boxed value requires
more memory accesses than the same arithmetic unboxed, by **comparing** their
memory layouts step by step.

### Activities

1. **Count together** (4 min): Students step both paths and record the tally at
   each stage.
2. **Find the allocation** (4 min): Students identify the step that allocates and
   explain why it matters more than the reads.
3. **Name the cost** (4 min): Students state what safety property unboxing gives
   up and construct an example where it bites.

### Assessment

Ask: "An FFT butterfly does one complex multiply and two complex adds. In boxed
MicroPython, roughly how many heap allocations is that per butterfly, and what
happens after a few thousand of them?"

## Related Resources

- [Chapter 19: The Abstraction Ladder](../../chapters/19-the-abstraction-ladder/index.md)
- [Abstraction Ladder Diagram](../abstraction-ladder-diagram/index.md)

## References

1. [Boxing (computer programming)](https://en.wikipedia.org/wiki/Object_type_(object-oriented_programming)#Boxing) — the representation shown in the top panel.
2. [MicroPython maximising speed](https://docs.micropython.org/en/latest/reference/speed_python.html) — the official guidance on avoiding allocation in inner loops.
3. [Garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) — why unpredictable pauses matter for real-time code.
