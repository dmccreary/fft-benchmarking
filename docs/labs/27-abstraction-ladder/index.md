# Lab 27: The Abstraction Ladder

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 26](../26-benchmarking/index.md)  |  **Hardware:** Pico 2

!!! mascot-welcome "What does convenience cost?"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Same algorithm, same answer, five ways of expressing it — and a 46× range. This isn't an
    argument for writing everything in assembly. It's about knowing what each layer costs so
    you can spend it deliberately. Let's tune in.

## What You'll Build

The same loop written four ways — pure Python, `@native`, `@viper`, assembly — measured against
each other, plus the real FFT at both ends of the ladder.

## Learning Objectives

- **Distinguish** bytecode interpretation, native compilation and machine types
- **Explain** what boxed and unboxed values are
- **Measure** the speedup at each rung
- **Explain** why viper doesn't rescue a float-heavy FFT
- **Compare** MicroPython, C and assembly as engineering choices

## Concepts Introduced

| ID | Concept |
|---|---|
| 467 | Bytecode Interpretation |
| 468 | Native Code Emitter |
| 469 | Viper Code Emitter |
| 470 | Boxed Values |
| 471 | Unboxed Values |
| 472 | Type Annotation |
| 473 | Machine Types |
| 474 | Abstraction Cost |
| 475 | Language Tradeoff Analysis |
| 476 | Calling C From MicroPython |
| 477 | Library Over Handwritten Code |

## Background

| Rung | What changes |
|---|---|
| **pure Python** | every operation interpreted; every value a heap object |
| **`@native`** | compiled to machine code; values *still* heap objects |
| **`@viper`** | compiled **and** using raw machine types (integers) |
| **assembly** | you choose the instructions |

**Boxed** values are the key idea. In normal Python `x = 3` isn't a machine word — it's a
pointer to an object carrying a type tag and a reference count. Every arithmetic operation
unwraps two objects, does one instruction of real work, and wraps the result.

`@native` removes the *interpreter*. `@viper` removes the *boxes*.

## Procedure

### Step 1 — Predict

> Rank the four rungs, and guess the speedup from pure Python to assembly.

### Step 2 — Race them

```python
--8<-- "docs/labs/27-abstraction-ladder/code/27-abstraction-ladder.py"
```

```
version              cycles    speedup         result
pure Python         1217693       1.0x        5997000
@native              780135       1.6x        5997000
@viper               472973       2.6x        5997000
assembly              26470      46.0x        5997000
```

All four return the same number — a fair race.

Note where the jumps are. `@native` gives 1.6×; `@viper` gives 2.6×. Assembly gives **46×**.
Most of the cost was never the interpreter — it was the object layer, and only assembly escapes
it entirely.

### Step 3 — The real FFT

```
implementation           cycles microseconds    speedup
pure Python            21161372     141075.8       1.0x
assembly                 134206        894.7     157.7x

real-time budget for 512 samples: 40000 us
  pure Python uses 353% of it
  assembly uses    2.2% of it
```

From **353% of the budget** to **2.2%**. That's the whole journey: Lab 16's DFT was 530× over,
Lab 20's Python FFT 3.6× over, and assembly finishes with 97.8% of the frame to spare.

!!! mascot-thinking "Why not just put @viper on the FFT?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Because viper's native types are **integer** types. It has `ptr8`, `ptr16` and `ptr32` —
    and no float pointer at all. An FFT is float arithmetic on float arrays, so viper can
    type the loop counters while every multiply still goes through the object layer.
    Viper is excellent for integer and bit work. This simply isn't that.

### Step 4 — Where C fits

C sits between viper and assembly: real machine types, real float hardware, and a compiler that
optimizes for you. For an FFT it lands close to hand-written assembly, often within a few
percent.

We don't use it here for one practical reason: C on the Pico needs a cross-compiler, CMake and a
firmware rebuild, while assembly runs from a plain `.py` file on stock MicroPython.

The honest summary for real work:

| Tool | When |
|---|---|
| **MicroPython** | write it here first — clarity beats speed |
| **C** | when you need speed *and* portability |
| **assembly** | the last 10%, or an instruction C can't express |

!!! mascot-tip "Reading beats writing"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Almost nobody writes production FFTs in assembly. They use a library someone wrote in
    assembly *once*, and tested exhaustively. The durable skill is **reading** it — knowing
    what the machine is really doing, so you can tell a good library from a bad one and
    explain why the fast one is fast. That's what Module 7 is for.

### Step 5 — Predict, then measure

> Take the `sum_viper` function and remove the `: int` annotations. What happens to its speed,
> and why?

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Viper slower than native | Annotations missing or wrong | `n: int` and `-> int` are what enable machine types |
| Viper raises on float data | No float pointer type | Use `array('i')` for viper, floats elsewhere |
| Assembly returns nonsense | Wrong argument order | Arguments arrive in r0, r1, r2, r3 |
| Results differ between rungs | Not the same computation | It isn't a fair race unless outputs match |

## Challenges

1. **Float viper.** Try writing the sum over `array('f')` in viper. Where exactly does it fight
   you?
2. **Native the FFT.** Add `@micropython.native` to `fftlab.FFT.run`. Measure it. Does it match
   the 1.6× from the simple loop? Why not?
3. **Price the boxes.** Using Lab 25's per-operation numbers, estimate what fraction of pure
   Python's FFT time is object handling rather than arithmetic.

## Check Your Understanding

1. What's the difference between a boxed and an unboxed value?
2. What does `@native` remove, and what does `@viper` remove on top of that?
3. Why doesn't viper help a float-heavy FFT much?
4. When would you reach for C rather than assembly?
5. Why is *reading* assembly more valuable than writing it, for most engineers?

!!! mascot-celebration "Module 6 complete"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can measure precisely, measure honestly, and price every layer between Python and
    the metal. **Module 7 is where you go get that 157× yourself.**

---

**Next:** [Lab 28: Does Your CPU Have an FPU?](../28-fpu-check/index.md)  |  **Previous:** [Lab 26](../26-benchmarking/index.md)
