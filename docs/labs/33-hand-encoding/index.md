# Lab 33: Beyond the Assembler: Hand-Encoding an Instruction

**Time:** ~55 minutes  |  **Prerequisites:** [Lab 32](../32-specialization/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "The assembler is not the instruction set"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your chip implements an instruction MicroPython refuses to write. So we look it up in the manual and build the machine code ourselves.

## What You'll Build

An instruction MicroPython refuses to write, encoded by hand from the ARM manual and executed successfully.

## Learning Objectives

- **Derive** an instruction encoding from the reference manual
- **Emit** raw machine words with the data() directive
- **Verify** a hand-encoded instruction on known values
- **Explain** why the payoff is small and why that matters

## Concepts Introduced

| ID | Concept |
|---|---|
| 541 | Instruction Encoding |
| 542 | Opcode |
| 543 | Encoding Bit Field |
| 544 | Encoding Table |
| 545 | Halfword |
| 546 | Thumb-2 Encoding |
| 547 | Data Directive |
| 548 | Raw Machine Word |
| 549 | Fused Multiply Add |
| 550 | VFMA Instruction |
| 551 | Fused Rounding |
| 552 | Assembler Limitation |
| 553 | ISA Versus Toolchain |
| 554 | Encoding Verification |

## Procedure

Open `33-hand-encoding.py` and work through it section by section:

```python
--8<-- "docs/labs/33-hand-encoding/code/33-hand-encoding.py"
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
    You can now reach any instruction your chip implements, whether or not your toolchain has heard of it.

---

**Next:** [Lab 34](../34-variants/index.md)  |  **Previous:** [Lab 32](../32-specialization/index.md)
