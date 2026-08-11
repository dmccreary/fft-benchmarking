# Lab 28: Does Your CPU Have an FPU?

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 27](../27-abstraction-ladder/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "Ask the chip before you trust it"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Five minutes of probing beats four attempts at debugging. An earlier version of this course spent enormous effort on assembly that could never run — because nobody asked the silicon first.

## What You'll Build

A capability probe that reads the CPU's own registers, then tests what the assembler will actually emit.

## Learning Objectives

- **Query** the CPUID register to identify the core
- **Read** MVFR0 to detect floating-point hardware
- **Distinguish** what the chip implements from what the assembler exposes
- **Explain** why the previous generation of this course could never have worked
- **Gate** later work on a capability check

## Concepts Introduced

| ID | Concept |
|---|---|
| 478 | Instruction Set Architecture |
| 479 | ARMv6-M |
| 480 | ARMv7-M |
| 481 | ARMv8-M |
| 482 | Cortex M0 Plus |
| 483 | FPU Presence Detection |
| 484 | MVFR0 Register |
| 485 | FPv5-SP Unit |
| 486 | Capability Probing |
| 487 | Hardware Feature Gate |
| 488 | Portability Constraint |
| 489 | Failure Root Cause |

## Procedure

Open `28-fpu-check.py` and work through it section by section:

```python
--8<-- "docs/labs/28-fpu-check/code/28-fpu-check.py"
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
    You know what your silicon can do, and you asked it rather than assuming. Now we can write assembly with confidence.

---

**Next:** [Lab 29](../29-first-assembly/index.md)  |  **Previous:** [Lab 27](../27-abstraction-ladder/index.md)
