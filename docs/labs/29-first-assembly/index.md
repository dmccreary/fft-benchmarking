# Lab 29: Your First Assembly Function

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 28](../28-fpu-check/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "Time to meet the machine"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Assembly is much less frightening than it sounds. About a dozen instructions cover most of it, and you already know what all of them do. **Time to transform!**

## What You'll Build

Assembly functions you can call from Python: adding two numbers, a counting loop, and summing an array 55x faster.

## Learning Objectives

- **Write** a function with @micropython.asm_thumb
- **Use** registers r0-r7 as your only variables
- **Build** a loop from a label, a compare and a branch
- **Read** memory with ldr and address arithmetic
- **Measure** the speedup over equivalent Python

## Concepts Introduced

| ID | Concept |
|---|---|
| 490 | Inline Assembler |
| 491 | asm_thumb Decorator |
| 492 | CPU Register |
| 493 | General Purpose Register |
| 494 | Register Allocation |
| 495 | Move Instruction |
| 496 | Add Instruction |
| 497 | Compare Instruction |
| 498 | Conditional Branch |
| 499 | Assembly Label |
| 500 | Assembly Loop |
| 501 | Argument Passing Convention |
| 502 | Return Value Register |
| 503 | Machine Code |
| 504 | Instruction Mnemonic |

## Procedure

Open `29-first-assembly.py` and work through it section by section:

```python
--8<-- "docs/labs/29-first-assembly/code/29-first-assembly.py"
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
    You just wrote machine instructions and called them from Python. Next lab, the floating-point set.

---

**Next:** [Lab 30](../30-fpu-assembly/index.md)  |  **Previous:** [Lab 28](../28-fpu-check/index.md)
