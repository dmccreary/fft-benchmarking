# Lab 17: Divide and Conquer — From DFT to FFT

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 16](../16-too-slow/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "The trick that changed signal processing"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your DFT is 530× too slow. The fix isn't a faster computer — it's noticing that most of
    that work is *the same work done twice*. Cooley and Tukey spotted it in 1965 and made
    real-time signal processing possible. Today you spot it too. **Time to transform!**

## What You'll Build

A hand-rolled single split: transform the even samples and the odd samples separately, stitch
them back together, and prove the answer is identical — for half the work.

## Learning Objectives

- **Split** a signal into even and odd samples and transform each half
- **Recombine** two half-spectra with a twiddle factor
- **Explain** how one complex multiply produces two output bins
- **Count** the operations saved per split, and after full recursion
- **Justify** why N must be a power of two

## Concepts Introduced

| ID | Concept |
|---|---|
| 363 | Divide And Conquer |
| 364 | Even Odd Split |
| 365 | Recursive Decomposition |
| 366 | Subproblem |
| 367 | Recombination Step |
| 368 | Logarithmic Stages |
| 369 | Complexity Reduction |
| 370 | Power Of Two Constraint |
| 371 | Redundant Computation |
| 372 | Symmetry Exploitation |

## Background

### The observation

Split your N samples into evens and odds. Transform each half separately, giving `E[k]` and
`O[k]`. Then the full transform is:

```
X[k]       = E[k] + W^k · O[k]
X[k + N/2] = E[k] − W^k · O[k]
```

Stare at those two lines. They use the **same** `E[k]`, the **same** `O[k]`, and the **same**
product `W^k · O[k]`. One multiplication, two output bins.

The direct DFT computes those two bins completely independently, redoing work it already had.

### `W^k` — the twiddle factor

```python
angle = -2 * math.pi * k / n
wr, wi = math.cos(angle), math.sin(angle)
```

It's a point on the unit circle — a rotation. It accounts for the odd samples being offset by
one position from the evens. Lab 18 gives it a proper table.

!!! mascot-thinking "Why stop at one split?"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    One split halves the work. But each half is itself a DFT — so split *those* too. And
    again. Keep going until each piece is a single sample, whose transform is just itself
    with no arithmetic at all. That's log₂(N) levels of splitting, and it's where
    N·log₂(N) comes from.

## Procedure

### Step 1 — Prove the split is exact

Open `17-divide-and-conquer.py` and run it:

```python
--8<-- "docs/labs/17-divide-and-conquer/code/17-divide-and-conquer.py"
```

```
 bin   direct DFT    split DFT   difference
   3      16.0000      16.0000     1.91e-06
   7       8.0000       8.0000     9.54e-07

largest difference anywhere: 2.39e-06
```

Identical to float precision. **This is not an approximation** — it's an exact restructuring of
the same arithmetic.

### Step 2 — Count what one split saves

```
       N   direct (N^2)        one split      saved
     512         262144           131328        50%
```

Two half-size DFTs cost `2·(N/2)² = N²/2`. Half the work, same answer.

### Step 3 — Recurse all the way down

```
       N     splits     direct N^2    FFT N*log2(N)      speedup
     512          9         262144             4608          57x
    4096         12       16777216            49152         341x
```

Nine splits for 512 samples. **57× less arithmetic** — and the advantage grows with N, which is
why the FFT matters more the bigger your problem gets.

### Step 4 — Why powers of two

```
N = 512: 512 -> 256 -> 128 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1   (clean)
N = 500: 500 -> 250 -> 125   <- STUCK at 125, cannot halve
```

Halving only works if the size keeps dividing evenly. 512 splits nine times to reach 1;
500 jams at 125.

(Other FFT variants handle non-powers-of-two — mixed-radix, Bluestein's — but radix-2 is the
one you can hold in your head, and 512 is a fine size for audio.)

### Step 5 — Measure it

```
N = 128
  direct DFT      :  1213 ms
  ONE split       :   551 ms   (2.2x faster)
```

One split, measured on hardware, gives 2.2×. Lab 20 does all nine.

## Expected Output

Your millisecond values will differ; the ~50% saving per split and the 57× count at N=512
should not.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Split disagrees with direct | Twiddle sign wrong | The angle is `-2πk/n`, negative |
| Only the first half is right | Missing the `X[k+N/2]` line | Both outputs come from one product |
| Errors around 1e-6 | Normal float32 behaviour | See Lab 15 |
| Crash on odd N | Can't halve | Use a power of two |

## Challenges

1. **Split twice.** Apply the split to each half as well, giving four quarter-size DFTs. What
   fraction of the original work remains?
2. **Make it recursive.** Write `fft_recursive(signal)` that calls itself until the input is
   length 1. Check it against the direct DFT.
3. **Where's the limit?** The count says 57× at N=512, but Lab 20 will measure ~146×. Why might
   the measured gain exceed the arithmetic count? (Hint: what else did we stop doing?)

## Check Your Understanding

1. Write the two recombination equations from memory.
2. Why does one complex multiply give two output bins?
3. Where does the log₂(N) in N·log₂(N) come from?
4. Why must N be a power of two for radix-2?
5. Is the split an approximation? Justify your answer from the measured output.

!!! mascot-celebration "You found the redundant work"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    That's the whole insight — the rest is bookkeeping. Next lab handles the bookkeeping:
    what order the data ends up in, and how to stop recomputing the same angles.

---

**Next:** [Lab 18: Bit Reversal and Twiddle Factors](../18-bit-reversal-twiddles/index.md)  |  **Previous:** [Lab 16](../16-too-slow/index.md)
