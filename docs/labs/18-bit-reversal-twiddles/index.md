# Lab 18: Bit Reversal and Twiddle Factors

**Time:** ~45 minutes  |  **Prerequisites:** [Lab 17](../17-divide-and-conquer/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "The bookkeeping that makes it fit"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Splitting works, but it leaves your data in a peculiar order and it keeps recomputing
    the same angles. Both have surprisingly elegant fixes — and one of them is genuinely
    beautiful. Let's tune in.

## What You'll Build

Two tables that turn the recursive idea into fast in-place code: a bit-reversal permutation and
a twiddle-factor lookup table. Plus a measurement of exactly what the table buys you.

## Learning Objectives

- **Discover** that repeated even/odd splitting produces bit-reversed order
- **Build** a bit-reversal permutation table
- **Reorder** an array in place using only swaps
- **Precompute** twiddle factors as roots of unity
- **Measure** the speedup from table lookup versus recomputation
- **Explain** why hoisting work out of a loop is the most reliable optimization

## Concepts Introduced

| ID | Concept |
|---|---|
| 373 | Bit Reversal Permutation |
| 374 | Index Reversal |
| 375 | Permutation Table |
| 376 | Roots Of Unity |
| 377 | Twiddle Factor Table |
| 378 | Precomputation |
| 379 | Lookup Table |
| 380 | Loop Invariant Hoisting |
| 381 | In Place Reordering |
| 382 | Swap Operation |
| 383 | Interleaved Storage |

## Background

### The strange order

Split `[0..7]` into evens and odds, then split again, and again:

```
start          : [0, 1, 2, 3, 4, 5, 6, 7]
after split 1  : [0, 2, 4, 6, 1, 3, 5, 7]
after split 2  : [0, 4, 2, 6, 1, 5, 3, 7]
```

Final order: `0, 4, 2, 6, 1, 5, 3, 7`. Looks arbitrary. It is not.

### It's bit reversal

Write each index in binary and read it **backwards**:

| index | binary | reversed | value |
|---|---|---|---|
| 0 | 000 | 000 | 0 |
| 1 | 001 | 100 | **4** |
| 2 | 010 | 010 | 2 |
| 3 | 011 | 110 | **6** |
| 4 | 100 | 001 | **1** |

`0, 4, 2, 6, 1, 5, 3, 7` — exactly the split order.

That's a gift. Instead of recursively slicing lists (allocating, copying, and generally being
slow), we **reorder once at the start** with a handful of swaps and then work in place forever
after.

!!! mascot-thinking "Why bit reversal, intuitively"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Each split sorts by one bit: the first asks "is the *lowest* bit 0 or 1?" (even or odd).
    The next asks about the next bit up. After all the splits, the ordering is by lowest
    bit first, highest bit last — which is exactly the ordinary ordering with the bits
    reversed.

### Roots of unity

The twiddle factors are evenly spaced points around the unit circle:

```
W_N^k = cos(-2πk/N) + i·sin(-2πk/N)
```

For an N-point FFT you need only **N/2** of them. Compute them once; look them up forever.

## Procedure

### Step 1 — Watch the pattern emerge

Open `18-bit-reversal-twiddles.py` and run it:

```python
--8<-- "docs/labs/18-bit-reversal-twiddles/code/18-bit-reversal-twiddles.py"
```

Part 1 splits repeatedly; Part 2 shows the same order arising from reversing bits. The program
compares them and prints `same? : True`.

### Step 2 — Reorder with swaps

```
after in-place reorder: [0, 4, 2, 6, 1, 5, 3, 7]
swaps performed       : 2
N= 512 needs 240 swaps for  512 elements (47%)
```

Only about 47% of positions need a swap — the rest either map to themselves (0 and 7 above) or
have already been handled by their partner. The `if j > i` test is what stops us swapping every
pair twice and undoing our own work.

!!! mascot-warning "Swap each pair exactly once"
    ![Echo warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Drop the `if j > i` and the loop swaps `(1,4)` and later `(4,1)`, putting everything back
    where it started. The array ends up unchanged and your FFT produces confident nonsense.
    A classic, silent, deeply annoying bug.

### Step 3 — Build the twiddle table

```
   k      angle        cos        sin
   0     0.0000     1.0000     0.0000
   1    -0.7854     0.7071    -0.7071
   2    -1.5708     0.0000    -1.0000
   3    -2.3562    -0.7071    -0.7071
```

Four twiddles for an 8-point FFT, marching a quarter-turn at a time around the circle.

### Step 4 — Measure the payoff

```
N = 256, 20 passes over 128 twiddles
  recomputing sin/cos :   131 ms
  table lookup        :    24 ms
  speedup             : 5.5x
```

**5.5× on the twiddle work alone**, for the cost of one setup pass and 128 floats of memory.

### Step 5 — The bonus you already met

Remember Lab 15's precision problem? Recomputing `2πkt/N` gave angles up to ~390 radians, which
single-precision floats handle badly.

A twiddle table only ever holds angles within **one turn** of the circle. So precomputation is
faster *and* more accurate. That's rare — most optimizations trade one for the other.

## Expected Output

```
split order    : [0, 4, 2, 6, 1, 5, 3, 7]
bit-reversed   : [0, 4, 2, 6, 1, 5, 3, 7]
same?          : True

  recomputing sin/cos :   131 ms
  table lookup        :    24 ms
  speedup             : 5.5x
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Array unchanged after reorder | Missing `if j > i` | Every pair swapped twice cancels out |
| Reversed values look wrong | Wrong bit count | 8 elements needs 3 bits, 512 needs 9 |
| `NotImplementedError` on slices | MicroPython has no slice steps | Use an explicit `range()` loop |
| Table lookup no faster | Table built inside the timed loop | Build it once, outside |

## Challenges

1. **Reversal without a table.** Write a function that bit-reverses an index directly with
   shifts and masks. Compare its speed against the table for N = 512.
2. **Memory cost.** How many bytes does a 512-point twiddle table use as float32? As float64?
   Set that against the 485 KB of RAM from Lab 3.
3. **Interleaved storage.** Store twiddles as `[re0, im0, re1, im1, …]` instead of two lists.
   Why might that be faster on real hardware? (Lab 30 answers this properly.)

## Check Your Understanding

1. What order does repeated even/odd splitting leave the data in?
2. Bit-reverse index 5 in a 16-element array.
3. Why does the swap loop need `if j > i`?
4. How many twiddle factors does a 512-point FFT need?
5. Name two separate benefits of precomputing the twiddle table.

!!! mascot-celebration "The bookkeeping is done"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Reorder once, look up the twiddles, work in place. All that's left is the operation at
    the centre of it all — and it's only four multiplies.

---

**Next:** [Lab 19: The Butterfly](../19-butterfly/index.md)  |  **Previous:** [Lab 17](../17-divide-and-conquer/index.md)
