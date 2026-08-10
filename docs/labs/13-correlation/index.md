# Lab 13: Correlation — Does My Signal Contain This Note?

**Time:** ~60 minutes  |  **Prerequisites:** [Lab 12](../12-superposition/index.md)  |  **Hardware:** Pico 2 (no microphone needed)

!!! mascot-welcome "This is the one. Take your time."
    ![Echo waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every remaining lab in this course stands on the idea in this file. The good news: it's
    one multiplication and one addition. Really. If you understand this lab, the FFT stops
    being magic and becomes bookkeeping. **Time to transform!**

## What You'll Build

A frequency detector. Give it a signal and a candidate frequency, and it answers: *is that
frequency in here?* You'll build it, watch it fail on a phase shift, and then fix it.

## Learning Objectives

- **Explain** how multiply-and-sum detects a frequency
- **Describe** why non-matching frequencies cancel to zero
- **Demonstrate** that a sine-only detector is blind to a phase-shifted signal
- **Combine** sine and cosine correlations into a phase-independent magnitude
- **Connect** correlation to the dot product

## Concepts Introduced

| ID | Concept |
|---|---|
| 320 | Correlation |
| 321 | Multiply And Sum |
| 322 | Dot Product |
| 323 | Test Frequency |
| 324 | Similarity Measure |
| 325 | Orthogonal Functions |
| 326 | In Phase Component |
| 327 | Quadrature Component |
| 328 | Phase Independence |
| 329 | Correlation Magnitude |
| 330 | Basis Function |
| 331 | Projection Onto Basis |

## Background

### The whole idea, in one sentence

**Multiply your signal by a test wave, add up the results, and see whether the total is big.**

That's it. Here it is in code:

```python
total = 0
for i in range(N):
    total += signal[i] * test_wave[i]
```

### Why it works

Think about what happens sample by sample.

**When the frequencies match**, the two waves rise and fall together. Positive times positive
gives positive. Negative times negative *also* gives positive. Every product pushes the total
the same direction, so it grows large.

**When they don't match**, the waves drift in and out of step. Sometimes both are positive,
sometimes one is negative. The products land above and below zero at random and **cancel each
other out**.

A large total means "yes, that frequency is in here." Near zero means "no."

!!! mascot-thinking "You already know this as the dot product"
    ![Echo thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Multiply matching elements, add up the results — that's the **dot product** from vector
    maths, the thing that measures how much two vectors point the same way. Here the
    "vectors" have 256 dimensions and each one is a wave. Two waves of different
    frequencies are **orthogonal** — mathematically perpendicular. Their dot product is
    zero, which is exactly why non-matching frequencies vanish.

## Procedure

### Step 1 — Play the guessing game

Open `13-correlation.py` and run it:

```python
--8<-- "docs/labs/13-correlation/code/13-correlation.py"
```

Part 1 hides a tone in a signal and tests ten candidates:

```
 candidate    correlation
      50 Hz        -0.0000
     100 Hz        -0.0000
     250 Hz         0.0000
     300 Hz         0.5000  ##################################################
     350 Hz         0.0000
```

One candidate towers over the rest. **You just found a hidden frequency using nothing but
multiplication and addition.**

### Step 2 — Look inside the sum

Part 2 samples products from across the whole window:

```
MATCHING (300 Hz signal x 300 Hz test):
   +0.00 +0.00 +0.01 +0.02 +0.04 +0.06 +0.08 +0.11 +0.15 +0.18 +0.22 +0.26 +0.31
   0 of 13 are negative

NOT MATCHING (300 Hz signal x 150 Hz test):
   +0.00 +0.05 -0.00 -0.15 +0.02 +0.24 -0.04 -0.33 +0.07 +0.42 -0.11 -0.50 +0.16
   6 of 13 are negative
```

Matching: everything pulls the same way. Not matching: the signs alternate and fight. That's
cancellation, visible.

### Step 3 — Watch it break

Part 3 takes the *same 300 Hz tone*, shifts it by a quarter cycle, and tests again:

```
correlation with a SINE test wave: -0.000000
```

**Zero.** The tone is unquestionably there and our detector says it isn't.

The reason: a quarter-shifted sine is a cosine, and a sine is orthogonal to a cosine of the same
frequency. Our detector is blind to it.

!!! mascot-encourage "A broken detector is a good teacher"
    ![Echo encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    This failure is the reason the real Fourier transform uses complex numbers. Not because
    mathematicians enjoy them — because you need **two** measurements to pin down a wave
    whose starting point you don't know. Meet the problem first and the solution stops
    looking arbitrary.

### Step 4 — Fix it with two test waves

Test with a sine *and* a cosine, then combine them like the legs of a right triangle:

```python
magnitude = sqrt(sin_score**2 + cos_score**2)
```

```
                signal        sin        cos    magnitude
           300 Hz sine     0.5000    -0.0000       0.5000
         300 Hz cosine    -0.0000     0.5000       0.5000
     300 Hz, phase 0.7     0.3824     0.3221       0.5000
     300 Hz, phase 2.5    -0.4006     0.2992       0.5000
        150 Hz (wrong)    -0.0000    -0.0000       0.0000
```

Look at that magnitude column. The sin and cos scores swing around wildly as the phase changes
— but the magnitude is **0.5000 every single time**, and 0.0000 for the wrong frequency.

You now have a detector that answers "is this frequency present?" regardless of when the wave
happened to start.

### Step 5 — Predict, then measure

> **Prediction:** what magnitude would a 300 Hz tone at *half* amplitude produce?

Change the mystery signal's amplitude to 0.5 and check. Does the relationship match what you
expected?

## Expected Output

See the tables above. The two numbers that matter: **0.5000** for every phase of the right
frequency, **0.0000** for the wrong one.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| All candidates score near zero | Test frequencies don't fit whole cycles | Use multiples of `RATE/N` |
| Correlation isn't exactly zero | Floating-point rounding | 1e-17 is zero |
| Magnitude varies with phase | Using only the sine | You need both sine and cosine |
| Every candidate scores high | Signal has many frequencies | Try a single pure tone first |

## Challenges

1. **Two tones.** Make the mystery signal `sine(300) + 0.5*sine(500)`. Do both show up? Are the
   magnitudes in the right ratio?
2. **In-between frequencies.** Test 275 Hz against a 300 Hz signal. You'll get something that
   isn't zero *or* the full value. That leakage is Lab 22's whole subject.
3. **Recover the phase.** The sin and cos scores encode *when* the wave started.
   `math.atan2(sin_score, cos_score)` gives it back. Check it against the phase you put in.

## Check Your Understanding

1. Describe correlation in one sentence, without equations.
2. Why does correlating two different frequencies give approximately zero?
3. Why is a sine-only detector blind to a cosine of the same frequency?
4. How do the sine and cosine scores combine into a magnitude?
5. What does it mean for two waves to be orthogonal?

!!! mascot-celebration "You built a frequency detector from scratch"
    ![Echo celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    One multiply, one add, and a square root at the end. **Next lab you'll run this at every
    frequency at once — and discover you've written a DFT.** Nobody's going to hand it to
    you. You're going to build it.

---

**Next:** [Lab 14: Sweeping All Frequencies](../14-building-a-dft/index.md)  |  **Previous:** [Lab 12](../12-superposition/index.md)
