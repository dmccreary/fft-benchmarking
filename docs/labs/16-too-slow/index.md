# Lab 16: Your DFT Is Too Slow

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 15](../15-validating/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "Correct, and completely useless"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your DFT is right. You proved it. Now we find out whether it's *fast enough* — and the
    answer is a spectacular no. Don't be discouraged by the number you're about to see.
    That number is the reason the next four labs exist.

## What You'll Build

A timing experiment that measures your DFT at five sizes, exposes its O(N²) scaling, and
compares it against the real-time deadline. Then it locates exactly where the time is going.

## Learning Objectives

- **Measure** execution time with `time.ticks_ms()`
- **Recognise** quadratic scaling from timing data
- **Calculate** a real-time budget from sample rate and frame size
- **Extrapolate** measured timings to a size too slow to test
- **Identify** the bottleneck by isolating parts of a loop

## Concepts Introduced

| ID | Concept |
|---|---|
| 354 | Algorithmic Complexity |
| 355 | Quadratic Complexity |
| 356 | Operation Counting |
| 357 | Scaling Behavior |
| 358 | Real Time Budget |
| 359 | Frame Duration |
| 360 | Processing Deadline |
| 361 | Performance Bottleneck |
| 362 | Motivation For Optimization |

## Background

### The deadline is not negotiable

Audio doesn't wait. At 12,800 Hz, 512 samples represent exactly:

```
512 / 12800 = 0.04 seconds = 40 ms
```

So a real-time system has **40 ms** to process each frame. Miss it and the next frame is already
arriving — you either drop audio or fall further behind every frame.

Recall from Lab 3: 40 ms at 150 MHz is **6,000,000 CPU cycles**. That's the budget.

### O(N²): the shape of the problem

Your DFT has two nested loops, each running N times. Total work: **N × N**.

Double N and the work goes up **four times**. That's not a small inconvenience — it's a wall.

## Procedure

### Step 1 — Predict first

> **Prediction:** if N = 64 takes 266 ms, how long will N = 512 take?

Write your answer before running anything. (Most people guess far too low.)

### Step 2 — Measure

Open `16-too-slow.py` and run it. It takes a while, which is rather the point:

```python
--8<-- "docs/labs/16-too-slow/code/16-too-slow.py"
```

```
     N    time (ms)    vs previous   operations
------------------------------------------------
    16           15              -          256
    32           60           4.0x         1024
    64          266           4.4x         4096
   128         1202           4.5x        16384
   256         5299           4.4x        65536
```

Look at the "vs previous" column: **4.0×, 4.4×, 4.5×, 4.4×**. Every doubling of N quadruples
the time, exactly as N² predicts. You've just measured algorithmic complexity on real hardware.

### Step 3 — Face the deadline

```
We need   : 40 ms
We take   : 21196 ms
Over by   : 530x
```

**Twenty-one seconds** to process **forty milliseconds** of audio.

While you finish one frame, 529 more have arrived and been thrown away. This isn't "a bit
sluggish" — it's off by more than two orders of magnitude.

!!! mascot-encourage "This is the good part, I promise"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Being 530× too slow feels like failure. It isn't — it's a *measurement*, and it's the
    single most motivating number in this course. Every optimization from here has something
    concrete to beat. By Lab 31 you'll be under a millisecond. Hold on to that.

### Step 4 — Find the bottleneck

Don't guess where the time goes. Measure:

```
N = 128, so the inner body runs 16384 times.
  empty loops only        :  39721 us
  + computing the angle   : 485936 us
  + calling sin and cos   : 1140869 us
```

The loop machinery is 40 ms. Adding the angle arithmetic costs 446 ms more. Adding the trig
calls costs another 655 ms.

**The trig calls dominate.** And here's the crack:

> We compute `sin` and `cos` **32,768** times, but there are only **128 distinct angles**.

We're recomputing the same handful of values thousands of times over.

!!! mascot-thinking "Two ways out"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    You could **precompute** the angles into a table and look them up — a real win, and
    exactly what Lab 18 does. Or you could notice that the DFT is doing enormously more
    *arithmetic* than it needs to, and restructure the algorithm itself. That second idea is
    the FFT, and it's worth about a thousand times more.

### Step 5 — Reality check

Your phone runs FFTs continuously — voice processing, noise cancellation, music apps — on
battery. Clearly the brute-force DFT is not what anyone actually uses.

The DFT was known for a century before it became practical. What changed in 1965 wasn't
computers getting faster. It was Cooley and Tukey noticing that most of that N² work is
**redundant**.

That's Lab 17.

## Expected Output

Your millisecond values will vary a little; the **4× per doubling** ratio and the ~500× overrun
should hold.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| N=16 reports 0 ms | Too fast for millisecond resolution | Use `ticks_us()`, or start at N=32 |
| Ratios aren't near 4 | Other work interfering | Close other programs; run again |
| Takes minutes | Normal at N=256 in pure Python | That's the lesson. Have a coffee |
| MemoryError | Too many lists at once | Drop the largest size |

## Challenges

1. **Table lookup.** Precompute `cos` and `sin` for all N distinct angles, then index the table
   instead of calling trig. How much faster? (This is a preview of Lab 18.)
2. **Predict N=1024.** Using your N=256 measurement, extrapolate. Then decide whether you're
   willing to wait to verify it.
3. **Find the crossover.** What's the largest N your DFT can do inside the 40 ms budget? Is it
   even usable for audio?

## Check Your Understanding

1. Why does doubling N quadruple the runtime?
2. What's the real-time budget for 512 samples at 12,800 Hz, in ms and CPU cycles?
3. Which part of the inner loop costs the most, and how do you know?
4. There are only N distinct angles. Why does the DFT compute 2N² trig calls?
5. In one sentence: why isn't the brute-force DFT used in practice?

!!! mascot-celebration "Module 3 complete — and you've earned the FFT"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You invented the DFT from correlation, proved it correct, and measured exactly how far
    short it falls. **That gap — 530× — is what Module 4 closes.** Nobody's handing you a
    magic algorithm; you're about to see precisely which work was wasted and take it back.

---

**Next:** [Lab 17: Divide and Conquer](../17-divide-and-conquer/index.md)  |  **Previous:** [Lab 15](../15-validating/index.md)
