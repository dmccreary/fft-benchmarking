# Lab 20: A Complete Python FFT

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 19](../19-butterfly/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "Assembly time — and I don't mean the language yet"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Four labs of pieces, and today they click together into a real FFT. Then we do the part
    that actually matters: check it against the DFT you already proved correct, and measure
    what all that cleverness bought. **Time to transform!**

## What You'll Build

A complete iterative radix-2 FFT in about twenty lines — validated against your Lab 15 test
suite and benchmarked against the Lab 16 DFT.

## Learning Objectives

- **Assemble** bit reversal, twiddle tables and butterflies into a working FFT
- **Validate** a new implementation against one already proven correct
- **Measure** speedup across several sizes
- **Explain** why the measured gain exceeds the operation-count prediction
- **Distinguish** an algorithm problem from a language problem

## Concepts Introduced

| ID | Concept |
|---|---|
| 393 | Iterative FFT |
| 394 | Algorithm Assembly |
| 395 | Reference Implementation |
| 396 | Cross Validation |
| 397 | Speedup Factor |
| 398 | Correctness Before Speed |
| 399 | Function Decomposition |

## Background

### The whole algorithm

```python
def fft(re, im, rev, tw_re, tw_im):
    n = len(re)

    # Lab 18: reorder once, in place
    for i in range(n):
        j = rev[i]
        if j > i:
            re[i], re[j] = re[j], re[i]
            im[i], im[j] = im[j], im[i]

    # Lab 19: log2(n) stages of butterflies
    half = 1
    while half < n:
        step = n // (half * 2)
        k = 0
        while k < n:
            j = 0
            while j < half:
                wr = tw_re[j * step]
                wi = tw_im[j * step]
                i1, i2 = k + j, k + j + half
                tr = wr * re[i2] - wi * im[i2]
                ti = wr * im[i2] + wi * re[i2]
                ar, ai = re[i1], im[i1]
                re[i1], im[i1] = ar + tr, ai + ti
                re[i2], im[i2] = ar - tr, ai - ti
                j += 1
            k += half * 2
        half *= 2
```

Three nested loops — stage, block, butterfly — wrapped around the eight lines from Lab 19.
That's it. That's the algorithm that made real-time signal processing possible.

!!! mascot-thinking "Where does `step` come from?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Early stages use few distinct twiddles spaced far apart in the table; later stages use
    many, spaced closely. `step = n // (half*2)` picks the right stride so each stage reads
    exactly the twiddles it needs from one shared table.

## Procedure

### Step 1 — Check it against the DFT

Open `20-complete-python-fft.py` and run it:

```python
--8<-- "docs/labs/20-complete-python-fft/code/20-complete-python-fft.py"
```

```
 bin          DFT          FFT   difference
   3      32.0000      32.0000     1.91e-06
   7      16.0000      16.0000     1.91e-06

largest difference across all bins: 3.110e-05
as a fraction of the peak (32.0): 9.72e-07

AGREEMENT CONFIRMED
```

Two completely different algorithms, same answer to seven digits. **That agreement is your
evidence.** A fast FFT that disagrees with a proven DFT is just a fast way to be wrong.

### Step 2 — Re-run the Lab 15 suite

```
  silence              PASS
  constant 0.5         PASS
  impulse              PASS
  alternating +/-1     PASS
  sine at bin 5        PASS
  5/5 passed
```

The tests you wrote for the DFT work unchanged on the FFT, because both compute the same thing.
That's what a good test suite gets you — it outlives the implementation it was written for.

### Step 3 — Measure the speedup

```
     N     DFT (ms)     FFT (ms)    speedup
    32           60            5        12x
    64          277           11        25x
   128         1218           27        45x
   256         5340           71        75x
```

Notice the speedup **grows with N**: 12× at 32, 75× at 256. The DFT gets four times slower per
doubling; the FFT only about twice. The gap widens forever.

### Step 4 — The deadline, revisited

```
512-point FFT in pure Python : 145 ms
real-time budget             : 40 ms
Lab 16's DFT estimate        : 21196 ms

improvement over the DFT     : 146x
still over budget by         : 3.6x
```

From **530× too slow** to **3.6× too slow**. A 146× improvement from restructuring alone,
without a faster chip or a single line of assembly.

And yet — still short.

!!! mascot-encourage "Being 3.6× away is a completely different problem"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    530× short means your *approach* is wrong. 3.6× short means your approach is right and
    something else is costing you. That something is the **language**: every one of those
    multiplies is an interpreted MicroPython operation. Modules 6 and 7 go after it, and
    by Lab 31 this same algorithm runs in under a millisecond.

### Step 5 — Predict, then measure

The operation count in Lab 17 predicted **57×**. We measured **146×**.

> **Prediction:** why is the measured gain more than twice the predicted one?

Think about what else changed between the DFT and the FFT. (Hint: Lab 18 measured a separate
5.5× on one specific thing.)

## Expected Output

See the tables above. Your milliseconds will vary; agreement with the DFT and the general shape
of the speedup should not.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Peaks in the wrong bins | Bit reversal skipped or wrong | Reorder before the stages, and use `if j > i` |
| Magnitudes right, spectrum scrambled | Twiddle stride wrong | `step = n // (half*2)` |
| Output equals the input | Stage loop never ran | `half` must start at 1 and double |
| Disagrees only at high bins | Twiddle table too small | You need N/2 entries |
| `MemoryError` at N=512 | Too many lists alive | Reuse buffers; don't rebuild tables per call |

## Challenges

1. **Inverse FFT.** Flip the twiddle sign and divide by N. Transform a signal, invert it, and
   check you get the original back. Round-trip tests are powerful.
2. **Hoist the tables.** The program rebuilds tables on every call. Build them once and reuse.
   How much does that save at N = 512?
3. **Find the crossover.** At what N does the FFT first beat the DFT? Below that size, is the
   extra complexity worth it?

## Check Your Understanding

1. What are the three nested loops in the FFT, from outside in?
2. Why validate the FFT against the DFT rather than just checking it looks right?
3. Why does the speedup grow as N grows?
4. The count predicted 57× and we measured 146×. Give one reason for the difference.
5. We're 3.6× from real time. Is that an algorithm problem or something else?

!!! mascot-celebration "Module 4 complete — you built a real FFT"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    From "what's a frequency bin?" in Lab 14 to a working, validated, 146× faster FFT here.
    **Next module points it at the microphone** — and you finally get to whistle at your
    Pico and watch the peak move. That's the payoff.

---

**Next:** [Lab 21: Spectrum of a Real Sound](../21-real-spectrum/index.md)  |  **Previous:** [Lab 19](../19-butterfly/index.md)
