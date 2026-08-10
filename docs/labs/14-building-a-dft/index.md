# Lab 14: Sweeping All Frequencies — You Just Built a DFT

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 13](../13-correlation/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "You're about to write a DFT. You just don't know it yet."
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Last lab you built a detector for *one* frequency. Today we do the least imaginative
    thing possible with it — run it at every frequency and keep the answers. That list is a
    spectrum, and the loop that makes it has a famous name. **Time to transform!**

## What You'll Build

A complete Discrete Fourier Transform, written by you, in about twelve lines. Then you'll use
it to unmix a two-tone signal and discover why spectra are always drawn as mirror images.

## Learning Objectives

- **Assemble** a DFT by looping the Lab 13 detector over every frequency
- **Explain** what a frequency bin is and how wide it is
- **Compute** a bin's centre frequency from its index
- **Interpret** the real and imaginary parts of a spectrum
- **Describe** why the upper half of a real signal's spectrum is redundant
- **Identify** the DC bin and the Nyquist bin

## Concepts Introduced

| ID | Concept |
|---|---|
| 332 | Frequency Sweep |
| 333 | Bin Index |
| 334 | Bin Center Frequency |
| 335 | Bin Width |
| 336 | Spectrum Array |
| 337 | Eight Point DFT By Hand |
| 338 | Complex Exponential |
| 339 | Real And Imaginary Parts |
| 340 | Spectrum Symmetry |
| 341 | Negative Frequencies |
| 342 | DC Bin |
| 343 | Nyquist Bin |

## Background

### Bins: the frequencies we can ask about

Lab 13's detector works cleanly when the test frequency fits a whole number of cycles in the
window. Those special frequencies are the **bins**:

```
bin width = sample rate / N
```

With N = 64 at 12,800 Hz that's **200 Hz per bin**. Bin 0 is 0 Hz, bin 1 is 200 Hz, bin 3 is
600 Hz, and so on.

A DFT doesn't report every possible frequency — it reports these N evenly-spaced ones. Want
finer detail? Use a bigger N. That's the whole tradeoff, and Lab 23 makes you live with it.

### The algorithm, in full

```python
for k in range(n):              # for every bin...
    re = im = 0.0
    for t in range(n):          # ...correlate against the signal
        angle = 2 * math.pi * k * t / n
        re += signal[t] * math.cos(angle)
        im -= signal[t] * math.sin(angle)
```

That inner loop is Lab 13's detector, unchanged. The outer loop is the only new idea.

!!! mascot-thinking "Real, imaginary — and why the minus sign"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    `re` is the cosine score, `im` the sine score — the two measurements you needed in
    Lab 13 to beat the phase problem. Mathematicians bundle them into one complex number
    because the algebra gets tidier, but they're just your two correlations. The minus sign
    on `im` is a sign convention for the forward transform; flip it and you get the inverse.

## Procedure

### Step 1 — Run it

Open `14-building-a-dft.py` and run it:

```python
--8<-- "docs/labs/14-building-a-dft/code/14-building-a-dft.py"
```

### Step 2 — Check the 8-point case by hand

Part 1 transforms `[1, -1, 1, -1, 1, -1, 1, -1]` — the fastest wiggle 8 samples can hold.

```
bin 4: real  +8.000  imag  -0.000  magnitude  8.000
```

Everything lands in **bin 4**, exactly half of 8. That's the Nyquist bin (Lab 9's limit,
showing up as an array index). Every other bin is zero.

Small enough that you can grind through the arithmetic on paper if you want to — and it's worth
doing once.

### Step 3 — Unmix a chord

Part 3 mixes 400 Hz at full amplitude with 1,000 Hz at half, then transforms it:

```
   2      400  ############################################
   5     1000  #####################
```

Two peaks, at bins 2 and 5, and **the second is half the height of the first**. The DFT
recovered the exact recipe — amplitudes and all — from a signal where the two tones were
hopelessly tangled together.

That's the superpower. A wave that looked like noise is now a list of ingredients.

### Step 4 — Meet the mirror

```
   3      600     32.000
  61    12200     32.000
```

Bin 61 is an identical copy of bin 3. Bin 62 mirrors bin 2. The top half of the spectrum is a
reflection of the bottom.

For a real-valued signal it carries no new information, so we plot only bins `0` to `N/2`:

| Bin | Meaning |
|---|---|
| `0` | **DC** — the signal's average |
| `1 … N/2−1` | real frequencies |
| `N/2` | **Nyquist** — the fastest representable |
| `N/2+1 … N−1` | the mirror; discard |

### Step 5 — Predict, then measure

> **Prediction:** with N = 64 at 12,800 Hz, which bin holds a 1,400 Hz tone? What if you
> changed N to 128?

Work it out, then change the code and check.

## Expected Output

```
=== PART 1: a tiny DFT, small enough to verify by hand ===
signal: [1.0, -1.0, 1.0, -1.0, 1.0, -1.0, 1.0, -1.0]

bin 4: real  +8.000  imag  -0.000  magnitude  8.000

--- 400 Hz (full) + 1000 Hz (half) -> bins 2 and 5 ---
   2      400  ############################################
   5     1000  #####################
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Peak lands between bins | Frequency isn't a bin centre | Use multiples of `RATE/N`; Lab 22 handles the rest |
| Energy smeared everywhere | Same cause, worse | This is spectral leakage — a preview of Lab 22 |
| Program takes ages | N too large for pure Python | Keep N ≤ 128 here; Lab 16 measures exactly how bad it gets |
| Mirror bins missing | Only plotting the lower half | That's intentional in Parts 2 and 3 |

## Challenges

1. **Three tones.** Mix bins 1, 4 and 9 at different amplitudes. Do all three appear at the
   right heights?
2. **Zero the DC.** Add a constant 0.5 to your signal. Which bin changes? Now subtract the mean
   before transforming — this is what Lab 7's DC removal was for.
3. **Between the bins.** Feed in a 500 Hz tone with 200 Hz bins. It has nowhere to go. Look at
   what happens to bins 2 and 3, and write down what you see — you'll explain it in Lab 22.

## Check Your Understanding

1. What is the bin width for N = 256 at 12,800 Hz?
2. Which bin holds a 2,000 Hz tone under those settings?
3. What do the real and imaginary parts of a bin correspond to, in Lab 13's terms?
4. Why is the upper half of a real signal's spectrum redundant?
5. What frequency does bin 0 represent, and what does its value tell you?

!!! mascot-celebration "You wrote a Fourier transform"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Not a toy version. The real Discrete Fourier Transform, in a dozen lines, from an idea
    you built yourself two labs ago. **Next: prove it's actually correct** — because looking
    right and being right are different things.

---

**Next:** [Lab 15: Validating Your DFT](../15-validating/index.md)  |  **Previous:** [Lab 13](../13-correlation/index.md)
