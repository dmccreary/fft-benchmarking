# Lab 32: Specialization and Branchless Code

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 31](../31-assembly-fft/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "Faster by doing less"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Not cleverer arithmetic — *less* arithmetic. Some multiplications are multiplications by one. Delete them.

## What You'll Build

Two optimizations measured: deleting multiplications by one, and removing an unpredictable branch.

## Learning Objectives

- **Identify** stages whose twiddle factors are trivial
- **Explain** why a data-dependent branch is expensive
- **Measure** each optimization independently
- **Describe** what each one costs in code size and complexity
- **Recognise** how allocation order can corrupt a benchmark

## Concepts Introduced

| ID | Concept |
|---|---|
| 529 | Special Case Optimization |
| 530 | Trivial Twiddle |
| 531 | Multiply By One |
| 532 | Multiply By i |
| 533 | Branch Prediction |
| 534 | Unpredictable Branch |
| 535 | Branchless Code |
| 536 | Precomputed Swap List |
| 537 | Code Size Tradeoff |
| 538 | Loop Overhead |
| 539 | Address Computation Cost |
| 540 | Optimization Attribution |

## Procedure

Open `32-specialization.py` and work through it section by section:

```python
--8<-- "docs/labs/32-specialization/code/32-specialization.py"
```

Each part builds on the last, and the comments in the file explain the
reasoning as you go. Run it, read it, then change something and run it again.

!!! mascot-tip "Predict before you measure"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Wherever this lab reports a speedup, write your guess down before you
    run it. Every quantitative prediction made while building this course
    turned out to be optimistic — being wrong on paper is how you find out
    what the machine really does.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `unsupported Thumb instruction` | The assembler lacks that mnemonic | Check Lab 28's probe; see Lab 33 for the workaround |
| Assembly returns nonsense | Wrong argument order | Arguments arrive in r0, r1, r2, r3 |
| Results differ between runs | No warm-up, or heap state | Discard a warm-up; build objects before measuring (Labs 26, 32) |
| Variant looks slower than baseline | Measurement artifact | Re-run with everything allocated up front |
| `MemoryError` | Too many variants alive | `gc.collect()` between sections |

## Check Your Understanding

1. What does this lab measure, and what does it deliberately exclude?
2. Which result surprised you most against your prediction, and why?
3. What would you change to make the effect larger?
4. Where would this technique NOT be worth the complexity?

!!! mascot-celebration "Onward"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Two more optimizations, measured honestly — including one that briefly fooled the person writing this lab.

---

**Next:** [Lab 33](../33-hand-encoding/index.md)  |  **Previous:** [Lab 31](../31-assembly-fft/index.md)
