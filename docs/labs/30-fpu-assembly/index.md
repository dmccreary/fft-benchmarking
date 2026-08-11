# Lab 30: Talking to the FPU

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 29](../29-first-assembly/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "The registers that make FFTs fast"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your chip has a whole second set of registers holding floats, and instructions that multiply two of them in a single cycle. MicroPython takes about a thousand. Let's go get that back.

## What You'll Build

Float assembly: loading, arithmetic, and a loop that scales an array 122x faster than Python.

## Learning Objectives

- **Use** the s0-s31 float registers
- **Apply** vldr, vstr, vadd, vsub, vmul and vneg
- **Pass** float arrays by address with uctypes.addressof
- **Explain** why r registers hold addresses and s registers hold data
- **Hoist** loop-invariant loads out of the inner loop

## Concepts Introduced

| ID | Concept |
|---|---|
| 505 | Floating Point Register |
| 506 | Register Bank s0 to s31 |
| 507 | Load Store Architecture |
| 508 | VLDR Instruction |
| 509 | VSTR Instruction |
| 510 | VADD Instruction |
| 511 | VSUB Instruction |
| 512 | VMUL Instruction |
| 513 | Memory Address |
| 514 | Address Of Buffer |
| 515 | Typed Array |
| 516 | Pointer Arithmetic |
| 517 | Byte Offset |
| 518 | No Allocation In Timed Region |

## Procedure

Open `30-fpu-assembly.py` and work through it section by section:

```python
--8<-- "docs/labs/30-fpu-assembly/code/30-fpu-assembly.py"
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
    122x on float arrays. That's the arithmetic engine of the FFT, and you can now drive it directly.

---

**Next:** [Lab 31](../31-assembly-fft/index.md)  |  **Previous:** [Lab 29](../29-first-assembly/index.md)
