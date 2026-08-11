# Lab 34: Competing Variants: Predict, Measure, Explain

**Time:** ~55 minutes  |  **Prerequisites:** [Lab 33](../33-hand-encoding/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "Predict first. Seriously, write it down."
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Six variants, one harness. Every prediction made while designing this course was too optimistic — yours probably will be too, and that's the most useful thing that can happen.

## What You'll Build

A full comparison matrix across six FFT variants, checked for correctness before speed.

## Learning Objectives

- **Compare** variants under identical conditions
- **Verify** correctness before reporting speed
- **Determine** whether optimizations compose
- **Articulate** what a ranking hides

## Concepts Introduced

| ID | Concept |
|---|---|
| 555 | Variant Comparison |
| 556 | Controlled Variable |
| 557 | Comparison Matrix |
| 558 | Ranking Prediction |
| 559 | Optimization Composition |
| 560 | Sub Linear Composition |
| 561 | Integration Cost |
| 562 | Kernel Versus Total Time |
| 563 | Data Marshalling Cost |
| 564 | Surprising Result |

## Procedure

Open `34-variants.py` and work through it section by section:

```python
--8<-- "docs/labs/34-variants/code/34-variants.py"
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
    You can compare implementations honestly and explain what the ranking hides. One lab to go.

---

**Next:** [Lab 35](../35-capstone/index.md)  |  **Previous:** [Lab 33](../33-hand-encoding/index.md)
