# Lab 31: The Butterfly in Assembly, and a Complete FFT

**Time:** ~60 minutes  |  **Prerequisites:** [Lab 30](../30-fpu-assembly/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "Everything converges here"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    The butterfly from Lab 19, the registers from Lab 29, the float instructions from Lab 30. Put them together and you get 165x — computing exactly the same numbers. **Time to transform!**

## What You'll Build

The butterfly in assembly, validated bit-for-bit against your Python FFT, then the complete transform at 165x.

## Learning Objectives

- **Implement** the butterfly with float instructions
- **Explain** why the work is split between Python and assembly
- **Verify** bit-for-bit agreement with a trusted implementation
- **Measure** the complete journey from Lab 16 to here

## Concepts Introduced

| ID | Concept |
|---|---|
| 519 | Assembly Butterfly |
| 520 | Register Pressure |
| 521 | Register Spilling |
| 522 | Scratch Register |
| 523 | Stage Parameter Block |
| 524 | Python Assembly Boundary |
| 525 | Work Split Strategy |
| 526 | Assembly Debugging |
| 527 | Bit For Bit Match |
| 528 | Hot Loop |

## Procedure

Open `31-assembly-fft.py` and work through it section by section:

```python
--8<-- "docs/labs/31-assembly-fft/code/31-assembly-fft.py"
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
    From 530x over budget to 2.1% of it. Real-time audio analysis on a $5 chip, and you built every layer.

---

**Next:** [Lab 32](../32-specialization/index.md)  |  **Previous:** [Lab 30](../30-fpu-assembly/index.md)
