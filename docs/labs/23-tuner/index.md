# Lab 23: Peak Detection — Build a Tuner

**Time:** ~50 minutes  |  **Prerequisites:** [Lab 22](../22-windowing/index.md)  |  **Hardware:** Pico 2, INMP441, OLED

!!! mascot-welcome "A real instrument, from a coarse spectrum"
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Your bins are 25 Hz wide. The gap between A4 and A#4 is 26 Hz — barely one bin. So how
    can this possibly tune a guitar? Because a bin isn't a fence. Read the neighbours and
    you can see *between* them. Let's tune in — literally.

## What You'll Build

A working chromatic tuner: note name, octave, cents-off, and a needle display that tells you
sharp or flat.

## Learning Objectives

- **Explain** why the loudest bin alone is too coarse for tuning
- **Apply** parabolic interpolation to locate a peak between bins
- **Measure** the accuracy gain from interpolation
- **Demonstrate** that windowing is required for interpolation to work
- **Convert** a frequency to a note name and cents deviation

## Concepts Introduced

| ID | Concept |
|---|---|
| 422 | Argmax Search |
| 423 | Peak Bin |
| 424 | Bin To Frequency |
| 425 | Frequency Resolution Limit |
| 426 | Parabolic Interpolation |
| 427 | Sub Bin Accuracy |
| 428 | Local Maximum |
| 429 | Threshold Rejection |
| 430 | Pitch |
| 431 | Musical Note Mapping |
| 432 | Octave |

## Background

### A bin is not a fence

When a tone falls between two bins, **both** light up — and the ratio between them says where
in the gap the true frequency sits. Fit a parabola through the peak and its two neighbours, and
the apex gives you the answer:

```python
delta = 0.5 * (y1 - y3) / (y1 - 2*y2 + y3)
true_bin = k + delta
```

Three magnitudes, four arithmetic operations, and your resolution improves by roughly an order
of magnitude. You didn't change the FFT at all — you just read its output more carefully.

### Notes are logarithmic

Every octave doubles the frequency, and each octave is 12 equal semitones:

```
semitones from A4 = 12 · log₂(freq / 440)
```

A **cent** is 1/100 of a semitone. Trained musicians hear about 5 cents, so ±5 counts as in
tune.

!!! mascot-thinking "Lab 22 earns its keep here"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Parabolic interpolation assumes the peak is shaped like a parabola. An **unwindowed**
    peak isn't — and the refinement barely helps. Measured on this hardware: without a
    window, 5.7 Hz error; with a Hanning window, **1.3 Hz**. The window isn't decoration,
    it's what makes this technique work.

## Procedure

### Step 1 — Measure the improvement

Open `23-tuner.py` and run it:

```python
--8<-- "docs/labs/23-tuner/code/23-tuner.py"
```

```
   true Hz  nearest bin     bin only    refined        error
     440.0           18        450.0      441.1       +1.07
     466.2           19        475.0      467.5       +1.26
    1234.5           49       1225.0     1233.3       -1.17

worst error, bin only : 10.00 Hz
worst error, refined  : 1.30 Hz
improvement           : 8x
```

Bins are 25 Hz wide, yet we locate tones to about **1.3 Hz**.

### Step 2 — Prove the window matters

Delete the `* WINDOW[i]` from the test loop and re-run. The refined column gets dramatically
worse — around 5.7 Hz instead of 1.3.

That's Lab 22 paying a concrete dividend, not just producing prettier pictures.

### Step 3 — Read the note table

```
 frequency     note  cents off
     440.0      A4         +0
     445.0      A4        +20
     466.2     A#4         +0
     261.6      C4         -0
```

440 Hz is A4 exactly. 445 Hz is still A4, but 20 cents sharp — clearly audible to a musician.

### Step 4 — Tune something

Part 3 runs the live tuner. Sing, hum, whistle, or play an instrument. The display shows:

- the note name and octave
- the measured frequency
- a needle: centre is in tune, left flat, right sharp
- the cents deviation

Try singing a steady note and watch how much you drift. Most people are surprised.

!!! mascot-tip "1.3 Hz is about 5 cents at A4"
    ![Echo offering a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Which puts this tuner right at the threshold of human hearing — genuinely usable, but
    not studio-grade. To do better you'd need a longer window (finer bins) or a different
    algorithm entirely. Knowing your instrument's limits is as important as building it.

### Step 5 — Predict, then measure

> **Prediction:** you doubled N from 256 to 512 for this lab. What did that do to the bin
> width, and what did it cost?

Check against Lab 24's timing.

## Expected Output

The accuracy table, the note table, and the live tuner display.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Interpolation barely helps | Window missing | Apply Hanning before the FFT |
| Note jumps an octave | Harmonic louder than fundamental | Common with some instruments; restrict the search range |
| Needle jitters | Genuine pitch variation | Average the last few readings |
| Always "listening" | Too quiet, or `PEAK_RATIO` too high | Get closer, or lower it |
| Wrong octave number | Off-by-one in the octave formula | Check against a known 440 Hz tone |

## Challenges

1. **Smooth the needle.** Average the last five frequency estimates. Does it feel better or just
   slower?
2. **Guitar mode.** Restrict detection to the six open-string frequencies (82, 110, 147, 196,
   247, 330 Hz) and show which string you're nearest.
3. **Beat the interpolation.** Compare parabolic interpolation against fitting on a **log**
   magnitude scale. Which is more accurate for a Hanning-windowed peak?

## Check Your Understanding

1. Why is the loudest bin alone insufficient for tuning?
2. How does parabolic interpolation find a frequency between bins?
3. Why does interpolation need a window to work well?
4. What is a cent, and how many are in an octave?
5. Our tuner is accurate to ~1.3 Hz. Is that good enough for a musician? Justify it.

!!! mascot-celebration "You built a real instrument"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Not a demo — a tuner someone could actually use. **Next lab puts a stopwatch on every
    stage** and finds out what's really costing you time. The answer surprises most people.

---

**Next:** [Lab 24: Real-Time Spectrum Analyzer](../24-realtime-analyzer/index.md)  |  **Previous:** [Lab 22](../22-windowing/index.md)
