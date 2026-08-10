# Lab 19: The Butterfly

**Time:** ~40 minutes  |  **Prerequisites:** [Lab 18](../18-bit-reversal-twiddles/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "Four multiplies. That's the whole engine."
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Everything in an FFT — all 2,304 operations in a 512-point transform — is this one tiny
    thing repeated. Learn it here and you've learned the FFT's entire arithmetic. It even
    looks nice on paper.

## What You'll Build

The butterfly: a two-in, two-out operation that shares one complex multiplication between both
outputs. Then you'll see how butterflies arrange into stages.

## Learning Objectives

- **Perform** a complex multiplication with four real multiplies
- **Execute** a butterfly by hand and in code
- **Explain** why both outputs reuse the same product
- **Describe** how the pairing distance doubles each stage
- **Count** the butterflies in an N-point FFT

## Concepts Introduced

| ID | Concept |
|---|---|
| 384 | Butterfly Structure |
| 385 | Complex Multiplication |
| 386 | Four Multiply Form |
| 387 | Butterfly Pair |
| 388 | Stage Span |
| 389 | Data Flow Graph |
| 390 | Butterfly Count |
| 391 | Stage Loop |
| 392 | Cross Add And Subtract |

## Background

### The shape

```
        a ──────────┬─────────► a + W·b
                     ╲       ╱
                      ╲     ╱
                       ╲   ╱
                        ╳
                       ╱   ╲
                      ╱     ╲
        b ──[× W]────┴───────► a − W·b
```

Two complex inputs, two complex outputs, crossing over in the middle. Hence "butterfly."

### The arithmetic

**Step 1 — multiply `b` by the twiddle.** Complex multiplication needs four real multiplies:

```python
tr = wr*br - wi*bi        # real part
ti = wr*bi + wi*br        # imaginary part
```

**Step 2 — cross add and subtract.** No more multiplying:

```python
out1 = a + t
out2 = a - t
```

Total: **4 real multiplies, 6 real adds, two complex outputs.**

!!! mascot-thinking "The saving is the sharing"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that `W·b` is computed **once** and used for both outputs. The direct DFT computes
    those two bins separately, redoing that multiply. Multiply that waste across every bin
    and every stage and you have the entire 500× gap from Lab 16.

### Stages

```
Stage 1: pairs are 1 apart  (0,1) (2,3) (4,5) (6,7)
Stage 2: pairs are 2 apart  (0,2) (1,3) (4,6) (5,7)
Stage 3: pairs are 4 apart  (0,4) (1,5) (2,6) (3,7)
```

Stage 1 pairs neighbours. Each stage the reach doubles until the last stage spans half the
array. For N = 512 that's **nine stages** — the log₂(N) from Lab 17, made concrete.

Every stage does exactly N/2 butterflies, so the total is `(N/2)·log₂(N)`.

## Procedure

### Step 1 — Work one butterfly by hand

Open `19-butterfly.py` and run it:

```python
--8<-- "docs/labs/19-butterfly/code/19-butterfly.py"
```

Part 1 shows every intermediate value for a single butterfly with `a = 3+1i`, `b = 2−1i`, and a
45° twiddle. Follow the arithmetic with a calculator once — it makes the rest concrete.

### Step 2 — See it as code

```python
def butterfly(re, im, i1, i2, wr, wi):
    tr = wr * re[i2] - wi * im[i2]
    ti = wr * im[i2] + wi * re[i2]
    ar, ai = re[i1], im[i1]
    re[i1] = ar + tr
    im[i1] = ai + ti
    re[i2] = ar - tr
    im[i2] = ai - ti
```

Eight lines. **This is the FFT's entire arithmetic.** Everything else is loops deciding which
indices and which twiddle.

!!! mascot-warning "Save `a` before you overwrite it"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Notice `ar, ai = re[i1], im[i1]` happens *before* any assignment. Write `re[i1]` first
    and the old value is gone when you need it for `re[i2]`. It's a two-character bug that
    produces a spectrum which looks plausible and is wrong.

### Step 3 — Watch the stages spread

Part 3 prints the pairing for every stage of an 8-point FFT. Trace one element — say index 1 —
through all three stages and see who it partners with each time.

### Step 4 — Count the work

```
       N   stages    butterflies   direct DFT ops      ratio
     512        9           2304           262144        114x
```

**2,304 butterflies** for a 512-point FFT. At 4 multiplies each that's about 9,216
multiplications, where the DFT needed over half a million.

### Step 5 — Predict, then measure

> **Prediction:** how many butterflies in a 1,024-point FFT? How many stages?

Work it out before checking the table.

## Expected Output

```
Step 1 -- W * b  (four real multiplies):
   real = wr*br - wi*bi = +0.707*+2.000 - -0.707*-1.000 = +0.7071
   imag = wr*bi + wi*br = +0.707*-1.000 + -0.707*+2.000 = -2.1213

Stage 1: pairs are 1 apart, blocks of 2
          (0,1) (2,3) (4,5) (6,7)

     512        9           2304           262144        114x
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Outputs wrong but plausible | Overwrote `a` before using it | Save `ar, ai` first |
| Complex multiply wrong | Sign error | `tr = wr·br − wi·bi`; the minus is on the real part |
| Pairs overlap between blocks | Block stride wrong | Blocks advance by `half*2` |
| Only half the array changes | Inner loop bound wrong | It runs `half` times, not `n` |

## Challenges

1. **Three multiplies.** There's a known trick computing a complex product with 3 multiplies and
   5 adds instead of 4 and 2. Look it up, implement it, and decide whether it's worth it here.
2. **Draw the graph.** Sketch the full 8-point data-flow diagram, all three stages. You'll see
   why it's called a butterfly network.
3. **Trace an element.** Follow index 3 through all three stages of an 8-point FFT. Which
   partners does it meet, and which twiddle applies each time?

## Check Your Understanding

1. How many real multiplies does one butterfly need, and for how many outputs?
2. Why must you save `a` before writing the outputs?
3. In stage 3 of a 16-point FFT, how far apart are the paired elements?
4. How many butterflies are in a 256-point FFT?
5. In one sentence, where does the FFT's saving actually come from?

!!! mascot-celebration "You have every piece now"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Split, reorder, look up twiddles, butterfly. **Next lab you assemble all four into a
    working FFT** — and find out just how much faster it really is.

---

**Next:** [Lab 20: A Complete Python FFT](../20-complete-python-fft/index.md)  |  **Previous:** [Lab 18](../18-bit-reversal-twiddles/index.md)
